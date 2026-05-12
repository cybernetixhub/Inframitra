import type { Metadata } from "next";
import Link from "next/link";
import {
  HelpCircle,
  Rocket,
  ShoppingCart,
  IndianRupee,
  CreditCard,
  Truck,
  RotateCcw,
  UserCircle,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Help Center | InfraMitra",
  description:
    "Find answers to frequently asked questions about buying, selling, payments, shipping, and returns on InfraMitra.",
};

const sections = [
  {
    icon: Rocket,
    title: "Getting Started",
    questions: [
      {
        q: "What is InfraMitra?",
        a: "InfraMitra is India's trusted marketplace for enterprise IT hardware. You can buy, sell, configure, and recycle servers, storage systems, networking equipment, and more.",
      },
      {
        q: "How do I create an account?",
        a: "Click the Sign Up button in the top navigation bar. You can register using your email, Google account, or Microsoft 365 account. Verification is required for seller accounts.",
      },
      {
        q: "Is it free to use InfraMitra?",
        a: "Creating an account and browsing products is completely free. We charge a small commission on successful sales. Buyers pay no platform fees.",
      },
      {
        q: "What types of hardware can I find here?",
        a: "We specialize in enterprise IT hardware including rack servers, tower servers, storage arrays, SAN/NAS devices, switches, routers, firewalls, UPS systems, and related accessories from brands like Dell, HP, Cisco, Juniper, and more.",
      },
    ],
  },
  {
    icon: ShoppingCart,
    title: "Buying",
    questions: [
      {
        q: "How do I know if a product is in good condition?",
        a: "Every product listing includes a detailed condition rating (New, Like New, Refurbished, or Used). Refurbished products undergo thorough testing and come with a warranty. Product descriptions include specifics on cosmetic and functional condition.",
      },
      {
        q: "Can I request a custom configuration?",
        a: "Yes! Use our Configure & Quote feature to specify your exact requirements. Our team will put together a custom configuration and provide a detailed quote.",
      },
      {
        q: "Do products come with a warranty?",
        a: "Yes. New products come with the manufacturer's warranty. Refurbished products include an InfraMitra warranty of 6-12 months depending on the product category. Warranty details are mentioned on each product listing.",
      },
      {
        q: "Can I buy in bulk?",
        a: "Absolutely. We offer bulk pricing and custom logistics for large orders. Contact our sales team or use the Configure & Quote feature for bulk requirements.",
      },
    ],
  },
  {
    icon: IndianRupee,
    title: "Selling",
    questions: [
      {
        q: "How do I sell my hardware on InfraMitra?",
        a: "Register as a seller, complete the verification process, and list your products with detailed descriptions, specifications, and photos. Our team reviews listings to ensure quality.",
      },
      {
        q: "What commission does InfraMitra charge?",
        a: "We charge a competitive commission on successful sales. The exact rate varies by product category. You can view the full commission structure in your seller dashboard.",
      },
      {
        q: "How quickly will my listing go live?",
        a: "Most listings are reviewed and approved within 24-48 hours. Ensure your listing includes accurate specifications, clear photos, and honest condition descriptions for faster approval.",
      },
    ],
  },
  {
    icon: CreditCard,
    title: "Payments",
    questions: [
      {
        q: "What payment methods are accepted?",
        a: "We accept bank transfers (NEFT/RTGS/IMPS), UPI, credit/debit cards, and net banking. For bulk orders, we also support purchase orders with credit terms for verified businesses.",
      },
      {
        q: "Is my payment secure?",
        a: "Yes. All transactions are processed through secure, PCI-DSS compliant payment gateways. We use encryption to protect your financial information.",
      },
      {
        q: "When do sellers receive payment?",
        a: "Sellers receive payment within 7 business days after the buyer confirms receipt and the return window has passed. Payments are processed via bank transfer.",
      },
    ],
  },
  {
    icon: Truck,
    title: "Shipping",
    questions: [
      {
        q: "How long does shipping take?",
        a: "Standard delivery takes 3-7 business days for metro cities and 7-14 business days for non-metro areas. Express shipping options are available for select locations.",
      },
      {
        q: "Is there free shipping?",
        a: "Yes, we offer free shipping on orders above ₹25,000. For orders below this threshold, a flat shipping rate of ₹1,999 applies.",
      },
      {
        q: "How is hardware packaged for shipping?",
        a: "All hardware is packed using enterprise-grade secure packaging with anti-static materials, foam inserts, and reinforced boxes to ensure safe transit.",
      },
    ],
  },
  {
    icon: RotateCcw,
    title: "Returns",
    questions: [
      {
        q: "What is the return policy?",
        a: "We offer a 30-day return policy. Products must be returned in their original packaging without physical damage. Refunds are processed within 7-10 business days after inspection.",
      },
      {
        q: "What if I receive a defective item?",
        a: "Defective items are eligible for immediate replacement at no extra cost. Contact our support team with your order number and photos of the defect, and we will arrange a pickup and replacement.",
      },
      {
        q: "How do I initiate a return?",
        a: "Contact our support team with your order number via email at info@inframitra.com or call +91 9910668689. We will guide you through the return process and arrange a pickup.",
      },
    ],
  },
  {
    icon: UserCircle,
    title: "Account",
    questions: [
      {
        q: "How do I reset my password?",
        a: "Click \"Forgot Password\" on the sign-in page and enter your registered email. You will receive a password reset link. If you signed up via Google or Microsoft, use those services to manage your credentials.",
      },
      {
        q: "Can I have both buyer and seller accounts?",
        a: "Yes, a single account can function as both a buyer and a seller. Simply complete the seller verification process from your account settings to start listing products.",
      },
      {
        q: "How do I delete my account?",
        a: "Contact our support team at info@inframitra.com to request account deletion. Please note that active orders must be completed before an account can be deleted.",
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <HelpCircle className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Help Center
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Find answers to common questions about using InfraMitra. Can&apos;t
          find what you&apos;re looking for?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact our support team
          </Link>
          .
        </p>
      </div>

      {/* FAQ Sections */}
      <div className="mx-auto max-w-4xl space-y-8">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl">{section.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {section.questions.map((item, index) => (
                  <div
                    key={index}
                    className={`${index === 0 ? "" : "pt-4"} ${index === section.questions.length - 1 ? "" : "pb-4"}`}
                  >
                    <h3 className="mb-2 font-medium">{item.q}</h3>
                    <p className="text-sm text-muted-foreground">{item.a}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="mx-auto mt-12 max-w-2xl rounded-2xl border bg-muted/30 p-8 text-center">
        <h2 className="text-xl font-bold">Still Need Help?</h2>
        <p className="mt-2 text-muted-foreground">
          Our support team is available Monday through Saturday, 9:00 AM to 6:00
          PM IST.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Contact Support
          </Link>
          <a
            href="https://wa.me/919910668689"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium transition-colors hover:bg-muted"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  );
}
