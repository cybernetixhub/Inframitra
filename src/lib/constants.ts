import {
  Server,
  HardDrive,
  Network,
  Monitor,
  Cpu,
  Keyboard,
} from "lucide-react";

export const CATEGORIES = [
  {
    name: "Servers",
    slug: "servers",
    description: "Rack servers, tower servers, blade servers, and more",
    icon: Server,
  },
  {
    name: "Storage & NAS",
    slug: "storage-nas",
    description: "SAN, NAS, storage arrays, and backup solutions",
    icon: HardDrive,
  },
  {
    name: "Networking",
    slug: "networking",
    description: "Switches, routers, firewalls, and access points",
    icon: Network,
  },
  {
    name: "Workstations",
    slug: "workstations",
    description: "High-performance workstations and desktops",
    icon: Monitor,
  },
  {
    name: "Components",
    slug: "components",
    description: "CPUs, RAM, SSDs, HDDs, GPUs, and RAID controllers",
    icon: Cpu,
  },
  {
    name: "Peripherals",
    slug: "peripherals",
    description: "KVM switches, UPS, PDUs, rails, and cables",
    icon: Keyboard,
  },
] as const;

export const CONDITION_LABELS: Record<string, string> = {
  NEW: "New",
  REFURBISHED: "Refurbished",
  USED: "Used",
};

export const CONDITION_COLORS: Record<string, string> = {
  NEW: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  REFURBISHED: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  USED: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400",
};

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  PROCESSING: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  REFUNDED: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400",
};

export const BRANDS = [
  "Dell",
  "HP Enterprise",
  "Cisco",
  "Lenovo",
  "Supermicro",
  "Juniper",
  "NetApp",
  "IBM",
  "Aruba",
  "Fortinet",
] as const;

export const REQUEST_TYPE_LABELS: Record<string, string> = {
  CONFIGURE_QUOTE: "Configure & Quote",
  SELL_HARDWARE: "Sell Hardware",
  E_RECYCLE: "E-Waste Management",
};

export const REQUEST_TYPE_COLORS: Record<string, string> = {
  CONFIGURE_QUOTE: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  SELL_HARDWARE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  E_RECYCLE: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
};

export const REQUEST_STATUS_LABELS: Record<string, string> = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  QUOTED: "Quoted",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  COMPLETED: "Completed",
  EXPIRED: "Expired",
};

export const REQUEST_STATUS_COLORS: Record<string, string> = {
  SUBMITTED: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400",
  UNDER_REVIEW: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  QUOTED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  ACCEPTED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  COMPLETED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  EXPIRED: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-500",
};
