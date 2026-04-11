export const SPEC_TEMPLATES: Record<string, { label: string; placeholder: string }[]> = {
  servers: [
    { label: "Processor", placeholder: "e.g. Intel Xeon Gold 6338" },
    { label: "Cores", placeholder: "e.g. 32 cores" },
    { label: "RAM", placeholder: "e.g. 256GB DDR4 ECC" },
    { label: "Storage Type", placeholder: "e.g. NVMe SSD / SAS HDD" },
    { label: "Storage Capacity", placeholder: "e.g. 4x 1.92TB" },
    { label: "RAID Controller", placeholder: "e.g. PERC H755" },
    { label: "Network", placeholder: "e.g. 2x 25GbE + 2x 1GbE" },
    { label: "Form Factor", placeholder: "e.g. 2U Rack Mount" },
    { label: "Operating System", placeholder: "e.g. Ubuntu 22.04 / Windows Server" },
    { label: "Redundant PSU", placeholder: "e.g. Yes, 2x 1400W" },
  ],
  "storage-nas": [
    { label: "Total Capacity", placeholder: "e.g. 48TB Raw" },
    { label: "Drive Type", placeholder: "e.g. NL-SAS / SSD" },
    { label: "Protocol", placeholder: "e.g. NFS, iSCSI, FC" },
    { label: "IOPS Requirement", placeholder: "e.g. 100K+ IOPS" },
    { label: "Controllers", placeholder: "e.g. Dual Active-Active" },
    { label: "Replication", placeholder: "e.g. Sync/Async replication needed" },
    { label: "Cache", placeholder: "e.g. 32GB per controller" },
  ],
  networking: [
    { label: "Port Count", placeholder: "e.g. 48 ports" },
    { label: "Port Speed", placeholder: "e.g. 1GbE / 10GbE / 25GbE" },
    { label: "Uplinks", placeholder: "e.g. 4x 10G SFP+" },
    { label: "PoE", placeholder: "e.g. PoE+ 740W budget" },
    { label: "Layer", placeholder: "e.g. Layer 2 / Layer 3" },
    { label: "Stacking", placeholder: "e.g. Up to 8 units" },
    { label: "Management", placeholder: "e.g. CLI, SNMP, Web GUI" },
  ],
  workstations: [
    { label: "Processor", placeholder: "e.g. AMD Threadripper PRO" },
    { label: "RAM", placeholder: "e.g. 128GB DDR4 ECC" },
    { label: "GPU", placeholder: "e.g. NVIDIA RTX A5000" },
    { label: "Storage", placeholder: "e.g. 2TB NVMe SSD" },
    { label: "Operating System", placeholder: "e.g. Windows 11 Pro" },
  ],
  components: [
    { label: "Component Type", placeholder: "e.g. CPU / RAM / SSD / GPU" },
    { label: "Model", placeholder: "e.g. Intel Xeon Gold 6338" },
    { label: "Specifications", placeholder: "e.g. 32 cores, 2.0GHz, LGA4189" },
    { label: "Compatibility", placeholder: "e.g. Dell PowerEdge R750" },
  ],
  peripherals: [
    { label: "Device Type", placeholder: "e.g. UPS / KVM / PDU / Rails" },
    { label: "Model", placeholder: "e.g. APC Smart-UPS 3000VA" },
    { label: "Capacity/Ports", placeholder: "e.g. 3000VA / 32-port" },
    { label: "Form Factor", placeholder: "e.g. 2U Rack Mount" },
  ],
};

export const BUDGET_RANGES = [
  "Under ₹50,000",
  "₹50,000 - ₹2,00,000",
  "₹2,00,000 - ₹5,00,000",
  "₹5,00,000 - ₹10,00,000",
  "₹10,00,000 - ₹25,00,000",
  "₹25,00,000 - ₹50,00,000",
  "₹50,00,000+",
];

export const TIMELINES = [
  "Urgent (ASAP)",
  "Within 1 week",
  "Within 2 weeks",
  "Within 1 month",
  "Flexible / No rush",
];

export const HARDWARE_CONDITIONS = [
  "Working - Fully Functional",
  "Partially Working - Some Issues",
  "Not Working - Powers On",
  "Not Working - Dead",
  "Unknown",
];

export const HARDWARE_AGES = [
  "Less than 1 year",
  "1 - 3 years",
  "3 - 5 years",
  "5 - 7 years",
  "7+ years",
];

export const RECYCLE_CONDITIONS = [
  "Dead / Non-functional",
  "End-of-Life / Outdated",
  "Physically Damaged",
  "Water / Fire Damaged",
  "Mixed Lot",
];
