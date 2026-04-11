"use client";

import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "InfraMitra helped us set up our entire data center with refurbished Dell servers. Saved over 60% compared to new pricing. Excellent support team!",
    name: "Rajesh Kumar",
    title: "CTO",
    company: "TechVista Solutions",
    industry: "IT Services",
  },
  {
    quote:
      "The Configure & Quote feature made it so easy to spec out exactly what we needed. Got a response within 2 hours. Highly recommended!",
    name: "Priya Sharma",
    title: "IT Manager",
    company: "MedLife Hospitals",
    industry: "Healthcare",
  },
  {
    quote:
      "We sold our old Cisco switches through InfraMitra. The process was smooth, valuation was fair, and pickup was arranged within 48 hours.",
    name: "Amit Patel",
    title: "Infrastructure Lead",
    company: "FinServ Bank",
    industry: "Banking",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-emerald-100 text-emerald-700",
];

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight">
          What Our Customers Say
        </h2>
        <p className="mx-auto mb-14 max-w-xl text-center text-muted-foreground">
          Trusted by IT teams across India
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={t.name}
              className="relative flex flex-col rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              {/* Quote icon */}
              <Quote className="mb-4 h-8 w-8 text-primary/20" />

              {/* Quote text */}
              <p className="mb-6 flex-1 text-sm leading-relaxed text-foreground/80">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Stars */}
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Author info */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${AVATAR_COLORS[idx]}`}
                >
                  {getInitials(t.name)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.title}, {t.company}
                  </p>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {t.industry}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
