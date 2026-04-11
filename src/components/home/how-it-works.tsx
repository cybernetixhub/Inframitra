"use client";

import { MessageCircle, Search, Truck } from "lucide-react";

const STEPS = [
  {
    icon: MessageCircle,
    number: 1,
    title: "Tell Us What You Need",
    description: "Chat with our AI assistant or fill a quick form",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Search,
    number: 2,
    title: "We Find the Best Match",
    description: "Our experts verify specs, condition & pricing",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Truck,
    number: 3,
    title: "Get It Delivered",
    description: "Pan-India shipping with tracking & warranty",
    gradient: "from-emerald-500 to-green-500",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight">
          How It Works
        </h2>
        <p className="mx-auto mb-14 max-w-xl text-center text-muted-foreground">
          Getting the right IT hardware has never been easier
        </p>

        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
          {/* Dotted connector lines (desktop only) */}
          <div className="pointer-events-none absolute top-12 left-[calc(33.33%_-_12px)] hidden h-0.5 w-[calc(33.33%_+_24px)] border-t-2 border-dashed border-muted-foreground/25 md:block" />
          <div className="pointer-events-none absolute top-12 left-[calc(66.66%_-_12px)] hidden h-0.5 w-[calc(33.33%_+_24px)] border-t-2 border-dashed border-muted-foreground/25 md:block" />

          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="flex flex-col items-center text-center">
                {/* Numbered circle with gradient */}
                <div
                  className={`relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${step.gradient} text-white shadow-lg`}
                >
                  <Icon className="h-10 w-10" strokeWidth={1.5} />
                  <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-foreground shadow-md ring-2 ring-background">
                    {step.number}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="max-w-[240px] text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
