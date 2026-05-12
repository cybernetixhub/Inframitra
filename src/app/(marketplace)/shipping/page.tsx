import type { Metadata } from "next";
import Link from "next/link";
import {
  Truck,
  Package,
  MapPin,
  Clock,
  Smartphone,
  IndianRupee,
  ShieldCheck,
  Building2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Shipping Policy | InfraMitra",
  description:
    "Learn about InfraMitra's shipping policy for IT hardware across India. Free shipping on orders above ₹25,000. Enterprise-grade secure packaging.",
};

const shippingHighlights = [
  {
    icon: IndianRupee,
    title: "Free Shipping",
    description: "On orders above ₹25,000",
  },
  {
    icon: Clock,
    title: "3-7 Business Days",
    description: "Delivery to metro cities",
  },
  {
    icon: Package,
    title: "Secure Packaging",
    description: "Enterprise-grade protection",
  },
  {
    icon: Smartphone,
    title: "Real-time Tracking",
    description: "SMS and email updates",
  },
];

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <Truck className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Shipping Policy
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          We deliver enterprise IT hardware safely across India with
          professional packaging and real-time tracking.
        </p>
      </div>

      {/* Highlights */}
      <div className="mx-auto mb-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {shippingHighlights.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border bg-muted/30 p-4 text-center"
          >
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Detailed Sections */}
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Shipping Rates */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <IndianRupee className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Shipping Rates</CardTitle>
                <CardDescription>
                  Transparent pricing with free shipping on qualifying orders
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">
                      Order Value
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                      Shipping Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3">Above ₹25,000</td>
                    <td className="px-4 py-3 font-medium text-green-600 dark:text-green-400">
                      FREE
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Below ₹25,000</td>
                    <td className="px-4 py-3">₹1,999 flat rate</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Shipping rates apply to standard delivery within India. Rates for
              remote or restricted areas may vary.
            </p>
          </CardContent>
        </Card>

        {/* Delivery Timeline */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Delivery Timeline</CardTitle>
                <CardDescription>
                  Estimated delivery times after order processing
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                      Estimated Delivery
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3">
                      Metro Cities (Delhi, Mumbai, Bangalore, Chennai, Hyderabad,
                      Kolkata, Pune)
                    </td>
                    <td className="px-4 py-3">3-7 business days</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3">Tier 2 Cities</td>
                    <td className="px-4 py-3">5-10 business days</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      Non-Metro / Remote Areas
                    </td>
                    <td className="px-4 py-3">7-14 business days</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Timelines are estimated from the date of dispatch. Order processing
              typically takes 1-2 business days. Delays may occur during peak
              seasons or due to unforeseen circumstances.
            </p>
          </CardContent>
        </Card>

        {/* Packaging */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Enterprise-Grade Packaging</CardTitle>
                <CardDescription>
                  Your hardware is packed to survive the journey
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Anti-static bags for all electronic components
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Custom-fit foam inserts to prevent movement during transit
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Double-walled corrugated boxes for impact protection
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Tamper-evident seals for security during transit
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Palletized shipping for heavy equipment (servers, storage arrays)
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Tracking */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Shipment Tracking</CardTitle>
                <CardDescription>
                  Stay updated at every step
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              All shipments are fully tracked with real-time updates delivered
              via SMS and email. Once your order is dispatched, you will receive
              a tracking number and a link to monitor your shipment&apos;s
              progress. Key milestones such as dispatch, in-transit, out for
              delivery, and delivered are communicated automatically.
            </p>
          </CardContent>
        </Card>

        {/* Bulk Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Bulk Orders & Custom Logistics</CardTitle>
                <CardDescription>
                  Special handling for large deployments
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              For bulk orders or large-scale deployments, we arrange custom
              logistics solutions including dedicated freight, white-glove
              delivery, and on-site installation support. Our logistics team
              will work with you to plan the most efficient and cost-effective
              delivery schedule for your requirements.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Contact our sales team at{" "}
              <a
                href="mailto:info@inframitra.com"
                className="text-primary hover:underline"
              >
                info@inframitra.com
              </a>{" "}
              or call{" "}
              <a
                href="tel:+919910668689"
                className="text-primary hover:underline"
              >
                +91 9910668689
              </a>{" "}
              to discuss bulk shipping arrangements.
            </p>
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="rounded-2xl border bg-muted/30 p-6 text-center">
          <p className="text-muted-foreground">
            Have questions about shipping?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact us
            </Link>{" "}
            or visit our{" "}
            <Link href="/help" className="text-primary hover:underline">
              Help Center
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
