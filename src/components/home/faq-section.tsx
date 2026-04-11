"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "What is refurbished hardware?",
    answer:
      "Refurbished hardware has been professionally restored to full working condition by certified technicians. Each unit undergoes rigorous testing, component replacement if needed, and quality assurance checks before being listed on InfraMitra. You get enterprise-grade equipment at a fraction of the original price.",
  },
  {
    question: "Do you provide warranty on refurbished products?",
    answer:
      "Yes! All refurbished products come with a minimum 1-year warranty covering hardware defects and component failures. Select products offer extended warranty options up to 3 years. Our warranty includes free pickup and replacement for any covered issues.",
  },
  {
    question: "How does the Configure & Quote service work?",
    answer:
      "Simply tell us your requirements \u2014 server specs, network equipment, storage needs, or any other IT hardware. Our AI assistant helps you configure the right setup, and our experts provide a detailed quote within 2 hours. You can also fill out a quick form if you prefer.",
  },
  {
    question: "Can I sell my old hardware to InfraMitra?",
    answer:
      "Absolutely! We buy used IT hardware including servers, switches, routers, storage arrays, and more. Submit your hardware details through our Sell Your Hardware page, and our team will provide a fair valuation within 24 hours. We arrange free pickup from anywhere in India.",
  },
  {
    question: "Do you provide GST invoice?",
    answer:
      "Yes, we provide proper GST invoice for all purchases. InfraMitra is a registered business, and all transactions include valid GST documentation for your accounting and compliance needs.",
  },
  {
    question: "What is your shipping and delivery policy?",
    answer:
      "We ship pan-India with tracked logistics partners. Standard delivery takes 3\u20137 business days depending on your location. Free shipping is available on orders above \u20b925,000. All shipments are insured and come with real-time tracking.",
  },
  {
    question: "How does E-Waste Management work?",
    answer:
      "We provide certified e-waste disposal with NIST-compliant data destruction. Our process includes secure data wiping (or physical destruction for storage devices), environmentally responsible recycling, and a certificate of destruction for your compliance records.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
          Everything you need to know about buying and selling IT hardware on InfraMitra
        </p>

        <div className="divide-y divide-border rounded-2xl border border-border/60 bg-card">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index}>
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-muted/40"
                >
                  <span className="text-sm font-semibold">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-200 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
