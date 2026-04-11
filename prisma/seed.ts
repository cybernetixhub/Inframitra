import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@inframitra.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@inframitra.com",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  // Create seller users
  const sellerHash = await bcrypt.hash("seller123", 12);
  const seller1 = await prisma.user.upsert({
    where: { email: "seller1@inframitra.com" },
    update: {},
    create: {
      name: "InfraMitra",
      email: "seller1@inframitra.com",
      passwordHash: sellerHash,
      role: "SELLER",
      company: "InfraMitra Inc.",
      sellerProfile: {
        create: {
          storeName: "InfraMitra",
          storeSlug: "inframitra",
          description:
            "Leading provider of enterprise-grade refurbished IT equipment. 15+ years in the industry with certified technicians and comprehensive warranty programs.",
          verified: true,
          rating: 4.8,
          totalSales: 1250,
        },
      },
    },
  });

  const seller2 = await prisma.user.upsert({
    where: { email: "seller2@inframitra.com" },
    update: {},
    create: {
      name: "InfraMitra Networks",
      email: "seller2@inframitra.com",
      passwordHash: sellerHash,
      role: "SELLER",
      company: "InfraMitra Networks Pvt. Ltd.",
      sellerProfile: {
        create: {
          storeName: "InfraMitra Networks",
          storeSlug: "inframitra-networks",
          description:
            "Specialized in networking equipment from top brands. New and certified refurbished switches, routers, and firewalls.",
          verified: true,
          rating: 4.6,
          totalSales: 890,
        },
      },
    },
  });

  const seller3 = await prisma.user.upsert({
    where: { email: "seller3@inframitra.com" },
    update: {},
    create: {
      name: "InfraMitra Storage",
      email: "seller3@inframitra.com",
      passwordHash: sellerHash,
      role: "SELLER",
      company: "InfraMitra Storage Solutions Pvt. Ltd.",
      sellerProfile: {
        create: {
          storeName: "InfraMitra Storage",
          storeSlug: "inframitra-storage",
          description:
            "Direct from the datacenter - quality servers and storage at wholesale prices. All equipment thoroughly tested and certified.",
          verified: true,
          rating: 4.7,
          totalSales: 2100,
        },
      },
    },
  });

  // Create buyer user
  const buyerHash = await bcrypt.hash("buyer123", 12);
  await prisma.user.upsert({
    where: { email: "buyer@inframitra.com" },
    update: {},
    create: {
      name: "John Buyer",
      email: "buyer@inframitra.com",
      passwordHash: buyerHash,
      role: "BUYER",
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "servers" },
      update: {},
      create: {
        name: "Servers",
        slug: "servers",
        description: "Rack servers, tower servers, blade servers, and more",
        icon: "Server",
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "storage-nas" },
      update: {},
      create: {
        name: "Storage & NAS",
        slug: "storage-nas",
        description: "SAN, NAS, storage arrays, and backup solutions",
        icon: "HardDrive",
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "networking" },
      update: {},
      create: {
        name: "Networking",
        slug: "networking",
        description: "Switches, routers, firewalls, and access points",
        icon: "Network",
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "workstations" },
      update: {},
      create: {
        name: "Workstations",
        slug: "workstations",
        description: "High-performance workstations and desktops",
        icon: "Monitor",
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: "components" },
      update: {},
      create: {
        name: "Components",
        slug: "components",
        description: "CPUs, RAM, SSDs, HDDs, GPUs, and RAID controllers",
        icon: "Cpu",
        sortOrder: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: "peripherals" },
      update: {},
      create: {
        name: "Peripherals",
        slug: "peripherals",
        description: "KVM switches, UPS, PDUs, rails, and cables",
        icon: "Keyboard",
        sortOrder: 6,
      },
    }),
  ]);

  const [servers, storage, networking, workstations, components, peripherals] =
    categories;

  // Create brands
  const brands = await Promise.all([
    prisma.brand.upsert({ where: { slug: "dell" }, update: {}, create: { name: "Dell", slug: "dell" } }),
    prisma.brand.upsert({ where: { slug: "hp-enterprise" }, update: {}, create: { name: "HP Enterprise", slug: "hp-enterprise" } }),
    prisma.brand.upsert({ where: { slug: "cisco" }, update: {}, create: { name: "Cisco", slug: "cisco" } }),
    prisma.brand.upsert({ where: { slug: "lenovo" }, update: {}, create: { name: "Lenovo", slug: "lenovo" } }),
    prisma.brand.upsert({ where: { slug: "supermicro" }, update: {}, create: { name: "Supermicro", slug: "supermicro" } }),
    prisma.brand.upsert({ where: { slug: "juniper" }, update: {}, create: { name: "Juniper", slug: "juniper" } }),
    prisma.brand.upsert({ where: { slug: "netapp" }, update: {}, create: { name: "NetApp", slug: "netapp" } }),
    prisma.brand.upsert({ where: { slug: "ibm" }, update: {}, create: { name: "IBM", slug: "ibm" } }),
    prisma.brand.upsert({ where: { slug: "aruba" }, update: {}, create: { name: "Aruba", slug: "aruba" } }),
    prisma.brand.upsert({ where: { slug: "fortinet" }, update: {}, create: { name: "Fortinet", slug: "fortinet" } }),
  ]);

  const [dell, hpe, cisco, lenovo, supermicro, juniper, netapp, ibm, aruba, fortinet] = brands;

  // Create products
  const products = [
    // Servers
    {
      sellerId: seller1.id,
      title: "Dell PowerEdge R750 2U Rack Server",
      slug: "dell-poweredge-r750-2u-rack-server",
      description: "The Dell PowerEdge R750 is a full-featured enterprise server designed for demanding workloads. Powered by 3rd Gen Intel Xeon Scalable processors with up to 2 sockets, this 2U rack server delivers exceptional performance for database, VDI, and AI/ML workloads. Features 32 DDR4 DIMM slots, up to 24 NVMe drives, and Dell's intelligent automation with iDRAC9.",
      price: 365500,
      comparePrice: 722500,
      condition: "REFURBISHED" as const,
      status: "ACTIVE" as const,
      quantity: 5,
      categoryId: servers.id,
      brandId: dell.id,
      warranty: "1 Year Warranty",
      featured: true,
      specs: [
        { label: "Processor", value: "2x Intel Xeon Gold 6338 (32 cores, 2.0GHz)" },
        { label: "Memory", value: "256GB DDR4-3200 ECC RDIMM" },
        { label: "Storage", value: "4x 1.92TB SAS SSD" },
        { label: "RAID", value: "PERC H755 RAID Controller" },
        { label: "Network", value: "2x 25GbE SFP28 + 2x 1GbE" },
        { label: "Power", value: "2x 1400W Redundant PSU" },
        { label: "Form Factor", value: "2U Rack Mount" },
        { label: "Management", value: "iDRAC9 Enterprise" },
      ],
    },
    {
      sellerId: seller3.id,
      title: "HP ProLiant DL380 Gen10 Plus Server",
      slug: "hp-proliant-dl380-gen10-plus",
      description: "The HPE ProLiant DL380 Gen10 Plus is the world's best-selling server. Designed for supreme versatility and resilience, it delivers an unmatched feature set with proven performance, security, and expandability. Ideal for small to large enterprises needing industry-leading performance and security.",
      price: 331500,
      comparePrice: 612000,
      condition: "REFURBISHED" as const,
      status: "ACTIVE" as const,
      quantity: 8,
      categoryId: servers.id,
      brandId: hpe.id,
      warranty: "1 Year Warranty",
      featured: true,
      specs: [
        { label: "Processor", value: "2x Intel Xeon Gold 6326 (16 cores, 2.9GHz)" },
        { label: "Memory", value: "128GB DDR4-3200 ECC RDIMM" },
        { label: "Storage", value: "8x 600GB SAS 15K" },
        { label: "RAID", value: "HPE Smart Array P408i-a" },
        { label: "Network", value: "4x 1GbE + 1x iLO port" },
        { label: "Power", value: "2x 800W Flex Slot Platinum" },
        { label: "Form Factor", value: "2U Rack Mount" },
        { label: "Management", value: "HPE iLO 5 Advanced" },
      ],
    },
    {
      sellerId: seller1.id,
      title: "Lenovo ThinkSystem SR650 V2 Server",
      slug: "lenovo-thinksystem-sr650-v2",
      description: "The Lenovo ThinkSystem SR650 V2 is a versatile 2U rack server that combines performance, flexibility, and security for business-critical workloads. With 3rd Gen Intel Xeon Scalable processors and support for up to 40 DDR4 DIMMs, it excels at virtualization, cloud, and database workloads.",
      price: 255000,
      condition: "USED" as const,
      status: "ACTIVE" as const,
      quantity: 3,
      categoryId: servers.id,
      brandId: lenovo.id,
      warranty: "90 Day Warranty",
      specs: [
        { label: "Processor", value: "1x Intel Xeon Silver 4314 (16 cores, 2.4GHz)" },
        { label: "Memory", value: "64GB DDR4-3200 ECC" },
        { label: "Storage", value: "2x 480GB SATA SSD" },
        { label: "RAID", value: "ThinkSystem RAID 530-8i" },
        { label: "Network", value: "2x 10GbE + 2x 1GbE" },
        { label: "Power", value: "2x 750W Platinum PSU" },
        { label: "Form Factor", value: "2U Rack Mount" },
      ],
    },
    {
      sellerId: seller3.id,
      title: "Supermicro SuperServer SYS-620P-TR",
      slug: "supermicro-superserver-sys-620p-tr",
      description: "High-performance 2U dual-socket server with 3rd Gen Intel Xeon Scalable processor support. Features 16 DIMM slots, 8 hot-swap 3.5\" drive bays, and dual 10GbE networking. Perfect for virtualization, HPC, and storage applications.",
      price: 467500,
      condition: "NEW" as const,
      status: "ACTIVE" as const,
      quantity: 12,
      categoryId: servers.id,
      brandId: supermicro.id,
      warranty: "3 Year Warranty",
      featured: true,
      specs: [
        { label: "Processor", value: "2x Intel Xeon Gold 6342 (24 cores, 2.8GHz)" },
        { label: "Memory", value: "512GB DDR4-3200 ECC RDIMM" },
        { label: "Storage", value: "8x 3.5\" Hot-Swap SATA/SAS Bays" },
        { label: "RAID", value: "Broadcom 3108 RAID Controller" },
        { label: "Network", value: "2x 10GBase-T + IPMI" },
        { label: "Power", value: "2x 1200W Redundant Titanium PSU" },
        { label: "Form Factor", value: "2U Rack Mount" },
      ],
    },
    // Storage
    {
      sellerId: seller3.id,
      title: "NetApp FAS2750 Hybrid Storage Array",
      slug: "netapp-fas2750-hybrid-storage",
      description: "The NetApp FAS2750 is a hybrid flash storage system that delivers enterprise-grade storage for mid-sized deployments. With support for NAS and SAN protocols, inline data reduction, and seamless cloud integration, it provides a complete data management solution.",
      price: 765000,
      comparePrice: 1530000,
      condition: "REFURBISHED" as const,
      status: "ACTIVE" as const,
      quantity: 2,
      categoryId: storage.id,
      brandId: netapp.id,
      warranty: "1 Year Warranty",
      featured: true,
      specs: [
        { label: "Controller", value: "Dual Active-Active Controllers" },
        { label: "Cache", value: "32GB per controller" },
        { label: "Storage Capacity", value: "48TB Raw (12x 4TB NL-SAS)" },
        { label: "SSD Cache", value: "2x 960GB SSD FlashCache" },
        { label: "Protocols", value: "NFS, CIFS, iSCSI, FC" },
        { label: "Network", value: "4x 10GbE + 4x 16Gb FC per controller" },
        { label: "ONTAP Version", value: "ONTAP 9.10" },
      ],
    },
    {
      sellerId: seller1.id,
      title: "Dell PowerVault ME5024 Storage Array",
      slug: "dell-powervault-me5024-storage",
      description: "The Dell PowerVault ME5024 offers high-density SAN storage with 24 SFF drive bays in a compact 2U form factor. Designed for SMB and ROBO environments, it delivers reliable block storage with dual redundant controllers and advanced data services.",
      price: 467500,
      condition: "NEW" as const,
      status: "ACTIVE" as const,
      quantity: 4,
      categoryId: storage.id,
      brandId: dell.id,
      warranty: "3 Year ProSupport",
      specs: [
        { label: "Controllers", value: "Dual Active/Active" },
        { label: "Drive Bays", value: "24x 2.5\" SFF Hot-Swap" },
        { label: "Storage", value: "12x 1.92TB SAS SSD" },
        { label: "Host Ports", value: "4x 25GbE iSCSI per controller" },
        { label: "Cache", value: "16GB per controller" },
        { label: "RAID Levels", value: "0, 1, 5, 6, 10" },
      ],
    },
    // Networking
    {
      sellerId: seller2.id,
      title: "Cisco Catalyst 9300-48P PoE+ Switch",
      slug: "cisco-catalyst-9300-48p-poe-switch",
      description: "The Cisco Catalyst 9300 Series is the next generation of the industry's most widely deployed switching platform. Built for security, IoT, and cloud with Cisco's UADP 2.0 ASIC, it provides full PoE+ on all 48 ports with a 437W power budget.",
      price: 187000,
      comparePrice: 408000,
      condition: "REFURBISHED" as const,
      status: "ACTIVE" as const,
      quantity: 15,
      categoryId: networking.id,
      brandId: cisco.id,
      warranty: "1 Year Warranty",
      featured: true,
      specs: [
        { label: "Ports", value: "48x 1GbE PoE+ RJ45" },
        { label: "Uplinks", value: "4x 10G SFP+ (Network Module)" },
        { label: "PoE Budget", value: "437W PoE+" },
        { label: "Switching Capacity", value: "480 Gbps" },
        { label: "MAC Addresses", value: "32,768" },
        { label: "Stacking", value: "StackWise-480 (up to 8 switches)" },
        { label: "Management", value: "Cisco DNA Center, CLI, SNMP" },
        { label: "OS", value: "Cisco IOS-XE" },
      ],
    },
    {
      sellerId: seller2.id,
      title: "Juniper EX4300-48T Ethernet Switch",
      slug: "juniper-ex4300-48t-switch",
      description: "The Juniper EX4300-48T is a high-performance, fixed-configuration access switch designed for enterprise campus and branch deployments. With 48 10/100/1000BASE-T ports and 4 SFP+ uplinks, it provides wire-speed Layer 2 and Layer 3 switching.",
      price: 110500,
      condition: "USED" as const,
      status: "ACTIVE" as const,
      quantity: 20,
      categoryId: networking.id,
      brandId: juniper.id,
      warranty: "90 Day Warranty",
      specs: [
        { label: "Ports", value: "48x 1GbE RJ45" },
        { label: "Uplinks", value: "4x 10GbE SFP+" },
        { label: "Switching Capacity", value: "176 Gbps" },
        { label: "Throughput", value: "130.9 Mpps" },
        { label: "Virtual Chassis", value: "Up to 10 members" },
        { label: "OS", value: "Junos OS" },
      ],
    },
    {
      sellerId: seller2.id,
      title: "Fortinet FortiGate 100F Next-Gen Firewall",
      slug: "fortinet-fortigate-100f-firewall",
      description: "The FortiGate 100F delivers enterprise-class next-generation firewall protection for mid-sized businesses. With purpose-built SPU technology, it provides industry-leading threat protection performance, SSL inspection, and ultra-low latency.",
      price: 161500,
      condition: "NEW" as const,
      status: "ACTIVE" as const,
      quantity: 7,
      categoryId: networking.id,
      brandId: fortinet.id,
      warranty: "1 Year FortiCare",
      specs: [
        { label: "Firewall Throughput", value: "20 Gbps" },
        { label: "IPS Throughput", value: "2.6 Gbps" },
        { label: "SSL VPN", value: "500 users" },
        { label: "Interfaces", value: "2x 10GE SFP+, 14x GE RJ45, 4x GE SFP" },
        { label: "Sessions", value: "1.5 Million concurrent" },
        { label: "SD-WAN", value: "Included" },
      ],
    },
    {
      sellerId: seller2.id,
      title: "Aruba 6300M 48-Port L3 Managed Switch",
      slug: "aruba-6300m-48-port-l3-switch",
      description: "The Aruba CX 6300M is an advanced access/aggregation switch with high performance and security features. Perfect for modern campus networks with VSX support, dynamic segmentation, and cloud-native management.",
      price: 272000,
      condition: "NEW" as const,
      status: "ACTIVE" as const,
      quantity: 6,
      categoryId: networking.id,
      brandId: aruba.id,
      warranty: "Limited Lifetime",
      specs: [
        { label: "Ports", value: "48x 1GbE PoE Class 6" },
        { label: "Uplinks", value: "4x 1/10/25GbE SFP28" },
        { label: "PoE Budget", value: "740W" },
        { label: "Switching Capacity", value: "740 Gbps" },
        { label: "OS", value: "AOS-CX" },
        { label: "Stacking", value: "VSF up to 10 units" },
      ],
    },
    // Workstations
    {
      sellerId: seller1.id,
      title: "Dell Precision 7920 Tower Workstation",
      slug: "dell-precision-7920-tower",
      description: "The Dell Precision 7920 Tower is designed for complex, compute-intensive workloads. With dual Intel Xeon processors, up to 3TB of memory, and support for multiple high-end GPUs, it's ideal for AI/ML development, 3D rendering, and simulation.",
      price: 297500,
      comparePrice: 663000,
      condition: "REFURBISHED" as const,
      status: "ACTIVE" as const,
      quantity: 4,
      categoryId: workstations.id,
      brandId: dell.id,
      warranty: "1 Year Warranty",
      specs: [
        { label: "Processor", value: "2x Intel Xeon Gold 6248R (24 cores, 3.0GHz)" },
        { label: "Memory", value: "256GB DDR4-2933 ECC" },
        { label: "GPU", value: "NVIDIA RTX A5000 24GB" },
        { label: "Storage", value: "1TB NVMe SSD + 4TB SATA HDD" },
        { label: "Power", value: "1400W PSU" },
        { label: "OS", value: "Windows 11 Pro for Workstations" },
      ],
    },
    {
      sellerId: seller1.id,
      title: "Lenovo ThinkStation P620 Workstation",
      slug: "lenovo-thinkstation-p620",
      description: "The ThinkStation P620 is the world's first PCIe Gen 4 workstation. Powered by AMD Threadripper PRO processors with up to 64 cores, it delivers extraordinary single and multi-threaded performance.",
      price: 357000,
      condition: "NEW" as const,
      status: "ACTIVE" as const,
      quantity: 3,
      categoryId: workstations.id,
      brandId: lenovo.id,
      warranty: "3 Year On-Site",
      specs: [
        { label: "Processor", value: "AMD Threadripper PRO 5975WX (32 cores, 3.6GHz)" },
        { label: "Memory", value: "128GB DDR4-3200 ECC" },
        { label: "GPU", value: "NVIDIA RTX A4000 16GB" },
        { label: "Storage", value: "2TB NVMe Gen4 SSD" },
        { label: "PCIe", value: "7x PCIe Gen 4 slots" },
        { label: "OS", value: "Ubuntu 22.04 LTS" },
      ],
    },
    // Components
    {
      sellerId: seller3.id,
      title: "Intel Xeon Gold 6338 Processor (32-Core)",
      slug: "intel-xeon-gold-6338-processor",
      description: "Intel Xeon Gold 6338 Ice Lake processor with 32 cores and 48MB cache. 2.0GHz base frequency with 3.2GHz Turbo. TDP 205W. Perfect for enterprise server upgrades.",
      price: 76500,
      comparePrice: 178500,
      condition: "NEW" as const,
      status: "ACTIVE" as const,
      quantity: 25,
      categoryId: components.id,
      brandId: null,
      warranty: "3 Year Intel Warranty",
      specs: [
        { label: "Cores/Threads", value: "32 / 64" },
        { label: "Base Clock", value: "2.0 GHz" },
        { label: "Turbo Clock", value: "3.2 GHz" },
        { label: "Cache", value: "48 MB L3" },
        { label: "TDP", value: "205W" },
        { label: "Socket", value: "LGA 4189" },
        { label: "Memory Support", value: "DDR4-3200, 8 channels" },
      ],
    },
    {
      sellerId: seller3.id,
      title: "Samsung PM9A3 3.84TB NVMe U.2 Enterprise SSD",
      slug: "samsung-pm9a3-384tb-nvme-ssd",
      description: "Samsung PM9A3 enterprise NVMe SSD with 3.84TB capacity in U.2 form factor. PCIe Gen4 x4 interface delivering up to 6,900 MB/s sequential read. Designed for data center and enterprise server environments.",
      price: 38000,
      condition: "NEW" as const,
      status: "ACTIVE" as const,
      quantity: 50,
      categoryId: components.id,
      brandId: null,
      warranty: "5 Year Warranty",
      specs: [
        { label: "Capacity", value: "3.84 TB" },
        { label: "Interface", value: "PCIe Gen4 x4 NVMe 1.4" },
        { label: "Form Factor", value: "U.2 (2.5\")" },
        { label: "Seq. Read", value: "6,900 MB/s" },
        { label: "Seq. Write", value: "4,100 MB/s" },
        { label: "DWPD", value: "1.0" },
        { label: "Endurance", value: "7,008 TBW" },
      ],
    },
    {
      sellerId: seller1.id,
      title: "128GB DDR4-3200 ECC RDIMM Server Memory Kit",
      slug: "128gb-ddr4-3200-ecc-rdimm-kit",
      description: "128GB (4x 32GB) DDR4-3200 ECC Registered DIMM memory kit. Compatible with Dell, HP, Lenovo, and Supermicro servers. Fully tested and certified for enterprise use.",
      price: 25500,
      comparePrice: 44200,
      condition: "REFURBISHED" as const,
      status: "ACTIVE" as const,
      quantity: 30,
      categoryId: components.id,
      brandId: null,
      warranty: "Lifetime Warranty",
      specs: [
        { label: "Total Capacity", value: "128GB (4x 32GB)" },
        { label: "Type", value: "DDR4 ECC Registered (RDIMM)" },
        { label: "Speed", value: "3200 MHz (PC4-25600)" },
        { label: "CAS Latency", value: "CL22" },
        { label: "Voltage", value: "1.2V" },
        { label: "Rank", value: "2Rx4" },
      ],
    },
    // Peripherals
    {
      sellerId: seller1.id,
      title: "APC Smart-UPS 3000VA Rack-Mount UPS",
      slug: "apc-smart-ups-3000va-rack-mount",
      description: "APC Smart-UPS 3000VA LCD RM 2U 120V with SmartConnect. Provides reliable power protection for servers, storage, and networking equipment. Features line-interactive topology with automatic voltage regulation.",
      price: 102000,
      condition: "NEW" as const,
      status: "ACTIVE" as const,
      quantity: 10,
      categoryId: peripherals.id,
      brandId: null,
      warranty: "2 Year APC Warranty",
      specs: [
        { label: "Capacity", value: "3000VA / 2700W" },
        { label: "Form Factor", value: "2U Rack-Mount" },
        { label: "Input", value: "120V NEMA L5-30P" },
        { label: "Outputs", value: "8x NEMA 5-20R" },
        { label: "Battery Runtime", value: "5.2 min at full load" },
        { label: "Management", value: "SmartConnect Cloud, SNMP" },
      ],
    },
    {
      sellerId: seller2.id,
      title: "Raritan Dominion KX III 32-Port KVM Switch",
      slug: "raritan-dominion-kx3-32-port-kvm",
      description: "Enterprise-grade KVM-over-IP switch with 32 server ports and up to 8 simultaneous users. Provides secure, BIOS-level remote access to physical servers. Supports virtual media and smart card authentication.",
      price: 212500,
      condition: "REFURBISHED" as const,
      status: "ACTIVE" as const,
      quantity: 5,
      categoryId: peripherals.id,
      brandId: null,
      warranty: "1 Year Warranty",
      specs: [
        { label: "Server Ports", value: "32" },
        { label: "Users", value: "Up to 8 concurrent" },
        { label: "Video Resolution", value: "1920x1200 @ 60Hz" },
        { label: "Network", value: "Dual GbE" },
        { label: "Features", value: "Virtual Media, Smart Card, LDAP" },
      ],
    },
    {
      sellerId: seller3.id,
      title: "Dell ReadyRails II Sliding Rail Kit",
      slug: "dell-readyrails-ii-sliding-rail-kit",
      description: "Dell ReadyRails II sliding rail kit compatible with PowerEdge R640, R740, R750 and similar 2U servers. Tool-less installation with cable management arm.",
      price: 7500,
      condition: "NEW" as const,
      status: "ACTIVE" as const,
      quantity: 100,
      categoryId: peripherals.id,
      brandId: dell.id,
      specs: [
        { label: "Type", value: "Sliding Rails with CMA" },
        { label: "Rack Size", value: "4-post, 19\" square/round hole" },
        { label: "Depth", value: "680mm - 914mm" },
        { label: "Weight Capacity", value: "50 kg" },
        { label: "Installation", value: "Tool-less" },
      ],
    },
    {
      sellerId: seller1.id,
      title: "IBM FlashSystem 5200 All-Flash Storage",
      slug: "ibm-flashsystem-5200-all-flash",
      description: "IBM FlashSystem 5200 delivers powerful enterprise storage with advanced AI-driven automation. NVMe end-to-end architecture with inline data reduction, encryption, and multi-cloud support. Perfect for enterprise workloads demanding consistent high performance.",
      price: 1062500,
      comparePrice: 2125000,
      condition: "REFURBISHED" as const,
      status: "ACTIVE" as const,
      quantity: 2,
      categoryId: storage.id,
      brandId: ibm.id,
      warranty: "1 Year Warranty",
      featured: true,
      specs: [
        { label: "Raw Capacity", value: "38.4TB (NVMe Flash)" },
        { label: "Effective Capacity", value: "Up to 115TB (3:1 DRE)" },
        { label: "Controllers", value: "Dual Active-Active" },
        { label: "Host Ports", value: "8x 32Gb FC + 8x 25GbE iSCSI" },
        { label: "IOPS", value: "Up to 1.1M (4K random read)" },
        { label: "Latency", value: "< 70 microseconds" },
        { label: "Data Services", value: "Thin Provisioning, Snapshots, Replication" },
      ],
    },
  ];

  for (const product of products) {
    const { specs, ...productData } = product;
    const created = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        specs: {
          create: specs.map((spec, index) => ({
            ...spec,
            sortOrder: index,
          })),
        },
      },
    });
    console.log(`  Created product: ${created.title}`);
  }

  console.log("\nSeeding complete!");
  console.log("\nTest accounts:");
  console.log("  Admin:  admin@inframitra.com / admin123");
  console.log("  Seller: seller1@inframitra.com / seller123");
  console.log("  Seller: seller2@inframitra.com / seller123");
  console.log("  Seller: seller3@inframitra.com / seller123");
  console.log("  Buyer:  buyer@inframitra.com / buyer123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
