"use client";

import {
  Recycle,
  Truck,
  ShieldCheck,
  HardDrive,
  Lightbulb,
  FileCheck,
  Gem,
  Monitor,
  Server,
  Network,
  Cpu,
  Smartphone,
  ArrowRight,
  CheckCircle,
  Building2,
  Globe,
  Award,
  Factory,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const services = [
  {
    icon: Recycle,
    title: "WEEE Recycling",
    description:
      "End-to-end e-waste recycling solution prioritizing environmental protection and maximum material recovery. We process all categories of electrical and electronic equipment.",
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-100 dark:bg-teal-900/30",
  },
  {
    icon: Truck,
    title: "Reverse Logistics",
    description:
      "Pan-India collection network with secure transportation. We arrange pickup from your premises with tracked logistics and proper documentation.",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    icon: ShieldCheck,
    title: "Certified Data Destruction",
    description:
      "NIST 800-88 compliant data wiping and physical shredding. On-site and off-site options available. Certificate of Destruction provided for every asset.",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/30",
  },
  {
    icon: HardDrive,
    title: "IT Asset Disposition (ITAD)",
    description:
      "Complete lifecycle management of your IT assets. We evaluate, refurbish, resell, or responsibly recycle — maximizing value recovery for your organization.",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    icon: Gem,
    title: "Precious Metal Recovery",
    description:
      "Professional extraction of gold, silver, copper, palladium, and platinum from circuit boards and electronic components using environmentally safe processes.",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    icon: Lightbulb,
    title: "Lamp & Battery Recycling",
    description:
      "Safe disposal of fluorescent lamps, LED fixtures, UPS batteries, and lithium-ion cells. Mercury-safe processing with zero landfill commitment.",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    icon: FileCheck,
    title: "EPR Compliance",
    description:
      "Extended Producer Responsibility implementation and documentation. We help manufacturers and importers meet their e-waste collection and recycling obligations.",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
  },
  {
    icon: Factory,
    title: "Bulk Decommissioning",
    description:
      "Full data center and office decommissioning services. Inventory, packing, removal, and documented disposal of all IT infrastructure in one go.",
    color: "text-zinc-600 dark:text-zinc-400",
    bg: "bg-zinc-100 dark:bg-zinc-800/30",
  },
];

const acceptedItems = [
  { icon: Server, label: "Servers & Racks" },
  { icon: Monitor, label: "Monitors & Displays" },
  { icon: Network, label: "Networking Gear" },
  { icon: HardDrive, label: "Storage & Drives" },
  { icon: Cpu, label: "Motherboards & CPUs" },
  { icon: Smartphone, label: "Laptops & Tablets" },
  { icon: Lightbulb, label: "UPS & Batteries" },
  { icon: Recycle, label: "Cables & Peripherals" },
];

const certifications = [
  "ISO 9001 Quality Management",
  "ISO 14001 Environmental Management",
  "ISO 27001 Information Security",
  "ISO 45001 Occupational Safety",
  "NIST 800-88 Data Destruction",
  "CPCB Authorized Recycler",
];

const stats = [
  { value: "500+", label: "Tonnes Recycled" },
  { value: "10,000+", label: "Assets Processed" },
  { value: "200+", label: "Corporate Clients" },
  { value: "100%", label: "Zero Landfill" },
];

export function EwasteServicesShowcase() {
  return (
    <div className="space-y-16">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border-2 border-teal-200 bg-teal-50/50 p-4 text-center dark:border-teal-800/50 dark:bg-teal-950/20"
          >
            <p className="text-2xl font-bold text-teal-700 dark:text-teal-300 font-mono">
              {stat.value}
            </p>
            <p className="text-xs text-teal-600 dark:text-teal-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Services Grid */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-2">
          Comprehensive E-Waste Services
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          From collection to certified recycling — we handle the entire lifecycle
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card
              key={service.title}
              className="group transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <CardContent className="p-5">
                <div
                  className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${service.bg}`}
                >
                  <service.icon className={`h-5 w-5 ${service.color}`} />
                </div>
                <h3 className="font-semibold text-sm mb-1">{service.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* What We Accept */}
      <div className="rounded-2xl border bg-muted/30 p-6 md:p-8">
        <h2 className="text-xl font-bold text-center mb-6">
          What We Accept
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {acceptedItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2.5 rounded-lg border bg-background p-3"
            >
              <item.icon className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div>
        <h2 className="text-xl font-bold text-center mb-8">
          How E-Waste Recycling Works
        </h2>
        <div className="grid gap-6 md:grid-cols-5">
          {[
            {
              step: "1",
              title: "Submit Request",
              desc: "Fill the form below with your e-waste details",
            },
            {
              step: "2",
              title: "Assessment",
              desc: "Our team evaluates quantity, condition & value",
            },
            {
              step: "3",
              title: "Pickup",
              desc: "We arrange secure collection from your location",
            },
            {
              step: "4",
              title: "Processing",
              desc: "Data destruction, dismantling & material recovery",
            },
            {
              step: "5",
              title: "Certificate",
              desc: "Receive destruction certificate & recycling report",
            },
          ].map((item, idx) => (
            <div key={item.step} className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white font-bold text-lg shadow-md">
                {item.step}
              </div>
              <h3 className="font-semibold text-sm">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {item.desc}
              </p>
              {idx < 4 && (
                <ArrowRight className="hidden md:block h-4 w-4 text-muted-foreground/50 absolute right-0 top-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">
          Certifications & Compliance
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          All processing follows strict Indian and international environmental regulations
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {certifications.map((cert) => (
            <Badge
              key={cert}
              variant="outline"
              className="px-3 py-1.5 text-xs gap-1.5"
            >
              <CheckCircle className="h-3 w-3 text-teal-600 dark:text-teal-400" />
              {cert}
            </Badge>
          ))}
        </div>
      </div>

      {/* Separator before form */}
      <div className="text-center">
        <Separator className="mb-4" />
        <h2 className="text-2xl font-bold">
          Submit Your E-Waste Request
        </h2>
        <p className="text-muted-foreground mt-1">
          Fill the form below and our team will get back to you within 24 hours
        </p>
      </div>
    </div>
  );
}
