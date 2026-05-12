import type { Metadata } from "next";
import Link from "next/link";
import {
  RotateCcw,
  Clock,
  Package,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Return Policy | InfraMitra",
  description:
    "InfraMitra's 30-day return policy for IT hardware. Easy returns, exchanges, and refunds. Immediate replacement for defective items.",
};

const returnSteps = [
  {
    step: 1,
    title: "Contact Support",
    description:
      "Reach out to our support team with your order number via email at info@inframitra.com, call +91 9910668689, or WhatsApp us.",
  },
  {
    step: 2,
    title: "Return Approval",
    description:
      "Our team will review your request and provide a Return Authorization (RA) number within 24 hours along with return shipping instructions.",
  },
  {
    step: 3,
    title: "Ship the Item",
    description:
      "Pack the item securely in its original packaging and ship it back. We will arrange a pickup for your convenience at no extra cost for defective items.",
  },
  {
    step: 4,
    title: "Inspection & Refund",
    description:
      "Once we receive and inspect the item, your refund will be processed within 7-10 business days to your original payment method.",
  },
];

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <RotateCcw className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Return Policy
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          We stand behind the quality of our products. If you&apos;re not
          satisfied, we make returns and exchanges simple.
        </p>
      </div>

      {/* Key Highlights */}
      <div className="mx-auto mb-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Clock, title: "30-Day Window", desc: "From delivery date" },
          { icon: RefreshCw, title: "Exchange Option", desc: "Swap for another item" },
          { icon: ShieldCheck, title: "Defect Coverage", desc: "Immediate replacement" },
          { icon: CheckCircle2, title: "7-10 Day Refund", desc: "After inspection" },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border bg-muted/30 p-4 text-center"
          >
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        {/* Return Window */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>30-Day Return Window</CardTitle>
                <CardDescription>
                  Hassle-free returns within 30 days of delivery
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You may return any product purchased from InfraMitra within 30
              days from the date of delivery. The return window applies to all
              product categories including servers, storage, networking, and
              accessories. Items must meet the return conditions outlined below.
            </p>
          </CardContent>
        </Card>

        {/* Conditions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Return Conditions</CardTitle>
                <CardDescription>
                  Items must meet these conditions to be eligible for return
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                Product must be in its original packaging
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                No physical damage caused by the buyer (scratches, dents, liquid
                damage)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                All original accessories, cables, and documentation must be
                included
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                Product serial number must match the one on the invoice
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                Return must be initiated within 30 days of delivery
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Refund Process */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <RotateCcw className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Refund Process</CardTitle>
                <CardDescription>
                  What to expect after your return is received
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Once we receive your returned item, our technical team will
              inspect it within 2-3 business days. After the inspection is
              complete and the item meets our return conditions, your refund
              will be processed within 7-10 business days.
            </p>
            <p>
              Refunds are issued to the original payment method. Bank transfer
              refunds may take an additional 2-3 business days to reflect in
              your account depending on your bank.
            </p>
          </CardContent>
        </Card>

        {/* Exchange */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <RefreshCw className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Exchange Option</CardTitle>
                <CardDescription>
                  Swap your product for a different one
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Prefer a different product? We offer exchanges within the same
              return window. If the replacement item has a different price, the
              difference will be charged or refunded accordingly. Contact our
              support team to initiate an exchange and we will help you find the
              right alternative.
            </p>
          </CardContent>
        </Card>

        {/* Defective Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <AlertTriangle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Defective Items</CardTitle>
                <CardDescription>
                  Immediate resolution for defective products
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              If you receive a defective or malfunctioning item, we offer
              immediate replacement at no extra cost. The defective item will
              be picked up from your location and a replacement will be shipped
              as soon as possible.
            </p>
            <p>
              To report a defective item, contact our support team with your
              order number and clear photos or a description of the defect.
              Our team will process your claim on a priority basis.
            </p>
          </CardContent>
        </Card>

        {/* How to Initiate */}
        <Card>
          <CardHeader>
            <CardTitle>How to Initiate a Return</CardTitle>
            <CardDescription>
              Follow these simple steps to start your return
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {returnSteps.map((item, index) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {item.step}
                    </div>
                    {index < returnSteps.length - 1 && (
                      <div className="mt-1 h-full w-px bg-border" />
                    )}
                  </div>
                  <div className={index < returnSteps.length - 1 ? "pb-4" : ""}>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <div className="rounded-2xl border bg-muted/30 p-6 text-center">
          <p className="text-muted-foreground">
            Need to start a return?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact our support team
            </Link>{" "}
            with your order number and we will guide you through the process.
          </p>
        </div>
      </div>
    </div>
  );
}
