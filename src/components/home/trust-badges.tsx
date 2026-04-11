"use client";

import {
  ShieldCheck,
  Award,
  FileCheck,
  RotateCcw,
  Truck,
  Receipt,
  Lock,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface TrustBadge {
  icon: LucideIcon;
  label: string;
}

const CERTIFICATIONS: TrustBadge[] = [
  { icon: ShieldCheck, label: "ISO 27001 Compliant" },
  { icon: Award, label: "CompTIA Certified" },
  { icon: FileCheck, label: "NIST Data Destruction" },
];

const GUARANTEES: TrustBadge[] = [
  { icon: RotateCcw, label: "30-Day Returns" },
  { icon: Truck, label: "Pan-India Shipping" },
  { icon: Receipt, label: "GST Invoice" },
  { icon: Lock, label: "Secure Payments" },
  { icon: Clock, label: "1-Year Warranty" },
];

function BadgePill({ icon: Icon, label }: TrustBadge) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-4 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground">
      <Icon className="h-4 w-4 shrink-0" />
      <span className="whitespace-nowrap font-medium">{label}</span>
    </div>
  );
}

export function TrustBadges() {
  return (
    <section className="py-16 bg-muted/20">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="mb-10 text-center text-lg font-semibold text-muted-foreground">
          Certifications & Guarantees
        </h2>

        {/* Certifications row */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
          {CERTIFICATIONS.map((badge) => (
            <BadgePill key={badge.label} {...badge} />
          ))}
        </div>

        {/* Guarantees row */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {GUARANTEES.map((badge) => (
            <BadgePill key={badge.label} {...badge} />
          ))}
        </div>
      </div>
    </section>
  );
}
