import type { Metadata } from "next";
import {
  Building2,
  Target,
  Eye,
  ShoppingCart,
  IndianRupee,
  Wrench,
  Recycle,
  Users,
  MapPin,
  Briefcase,
  Server,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us | InfraMitra",
  description:
    "Learn about InfraMitra — India's trusted IT hardware marketplace for buying, selling, and recycling enterprise servers, storage, and networking equipment.",
};

const services = [
  {
    icon: ShoppingCart,
    title: "Buy Hardware",
    description:
      "Browse and purchase certified refurbished and new enterprise IT hardware at competitive prices. Every product is thoroughly tested and comes with a warranty.",
  },
  {
    icon: IndianRupee,
    title: "Sell Hardware",
    description:
      "Get the best value for your surplus or end-of-life IT equipment. We provide fair market valuations and handle the entire resale process for you.",
  },
  {
    icon: Wrench,
    title: "Configure & Quote",
    description:
      "Need custom configurations? Our infrastructure experts will help you spec out the perfect setup for your workload and budget requirements.",
  },
  {
    icon: Recycle,
    title: "E-Waste Management",
    description:
      "Responsibly dispose of your decommissioned hardware with certified data destruction and environmentally compliant recycling processes.",
  },
];

const stats = [
  {
    icon: MapPin,
    value: "Pan-India",
    label: "Presence",
  },
  {
    icon: Briefcase,
    value: "200+",
    label: "Corporate Clients",
  },
  {
    icon: Server,
    value: "10,000+",
    label: "Assets Processed",
  },
  {
    icon: Users,
    value: "50+",
    label: "Team Members",
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <Building2 className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          About{" "}
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            InfraMitra
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          India&apos;s trusted marketplace for enterprise IT hardware. We make
          it simple to buy, sell, configure, and responsibly recycle servers,
          storage, and networking equipment.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="mx-auto mb-16 grid max-w-4xl gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To bridge the gap in India&apos;s IT hardware market by providing
              a transparent, reliable, and efficient platform where businesses
              can access quality enterprise hardware at fair prices while
              promoting sustainability through responsible asset lifecycle
              management.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl">Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To become India&apos;s leading IT infrastructure marketplace where
              every piece of enterprise hardware finds its optimal use --
              reducing waste, lowering costs, and empowering businesses of all
              sizes with the technology they need to grow.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* What We Do */}
      <div className="mb-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight">What We Do</h2>
          <p className="mt-2 text-muted-foreground">
            End-to-end IT hardware lifecycle services for Indian businesses
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card key={service.title}>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <service.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-16">
        <div className="mx-auto max-w-4xl rounded-2xl border bg-muted/30 p-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="mx-auto mb-16 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Our Story</CardTitle>
            <CardDescription>
              Founded to transform how India buys and sells IT hardware
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              InfraMitra was founded to bridge the gap in India&apos;s IT
              hardware market. We saw businesses struggling with opaque pricing,
              unreliable suppliers, and no structured way to liquidate surplus
              equipment. At the same time, perfectly functional hardware was
              being discarded, contributing to the growing e-waste problem.
            </p>
            <p className="text-muted-foreground">
              We built InfraMitra as a trusted marketplace that solves both
              sides of this equation -- connecting buyers with quality,
              certified hardware at transparent prices, and giving sellers a
              professional channel to recover value from their assets. Our
              commitment to sustainability drives us to ensure every piece of
              hardware is either reused or responsibly recycled.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team */}
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Our Team</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Our team of IT infrastructure experts brings decades of combined
          experience in enterprise hardware, supply chain management, and
          technology consulting. We are passionate about making quality IT
          infrastructure accessible to every business in India.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Interested in joining us?{" "}
          <a
            href="mailto:careers@inframitra.com"
            className="text-primary hover:underline"
          >
            careers@inframitra.com
          </a>
        </p>
      </div>
    </div>
  );
}
