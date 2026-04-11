"use client";

import Link from "next/link";
import {
  Server,
  HardDrive,
  Network,
  Monitor,
  Cpu,
  Keyboard,
  Search,
  ShieldCheck,
  Truck,
  BadgeDollarSign,
  ArrowRight,
  Star,
  Users,
  Package,
  Settings2,
  DollarSign,
  Recycle,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BrandPartners } from "@/components/home/brand-partners";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HowItWorks } from "@/components/home/how-it-works";
import { Testimonials } from "@/components/home/testimonials";
import { TrustBadges } from "@/components/home/trust-badges";
import { FaqSection } from "@/components/home/faq-section";

const categories = [
  {
    name: "Servers",
    slug: "servers",
    description: "Rack, tower & blade servers",
    icon: Server,
    count: "500+",
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    name: "Storage & NAS",
    slug: "storage-nas",
    description: "SAN, NAS & backup solutions",
    icon: HardDrive,
    count: "300+",
    gradient: "from-purple-500/10 to-pink-500/10",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    name: "Networking",
    slug: "networking",
    description: "Switches, routers & firewalls",
    icon: Network,
    count: "450+",
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "Workstations",
    slug: "workstations",
    description: "High-performance desktops",
    icon: Monitor,
    count: "200+",
    gradient: "from-orange-500/10 to-amber-500/10",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    name: "Components",
    slug: "components",
    description: "CPUs, RAM, SSDs & GPUs",
    icon: Cpu,
    count: "800+",
    gradient: "from-red-500/10 to-rose-500/10",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    name: "Peripherals",
    slug: "peripherals",
    description: "KVM, UPS, PDUs & rails",
    icon: Keyboard,
    count: "350+",
    gradient: "from-indigo-500/10 to-violet-500/10",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
];

const valueProps = [
  {
    icon: ShieldCheck,
    title: "Verified Sellers",
    description:
      "Every seller is verified. All hardware is quality-checked before listing.",
  },
  {
    icon: BadgeDollarSign,
    title: "Best Prices",
    description:
      "Save up to 70% compared to new prices. Competitive pricing across all categories.",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description:
      "Secure packaging and reliable shipping. Track your order every step of the way.",
  },
];

const stats = [
  { value: "10,000+", label: "Products Listed", icon: Package },
  { value: "5,000+", label: "Happy Customers", icon: Users },
  { value: "4.8/5", label: "Average Rating", icon: Star },
  { value: "500+", label: "Verified Sellers", icon: ShieldCheck },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              The #1 IT Hardware Marketplace
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Buy & Sell Enterprise{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                IT Hardware
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              The premier marketplace for servers, storage, networking, and more.
              New, refurbished, and used equipment from verified sellers at
              unbeatable prices.
            </p>

            {/* Search Bar */}
            <form
              action="/products"
              method="GET"
              className="mt-8 flex max-w-xl mx-auto gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  name="q"
                  type="search"
                  placeholder="Search for servers, switches, storage..."
                  className="h-12 pl-12 text-base rounded-xl"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-6 rounded-xl">
                Search
              </Button>
            </form>

            {/* Quick Links */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="text-sm text-muted-foreground">Popular:</span>
              {[
                "Dell PowerEdge",
                "Cisco Catalyst",
                "HP ProLiant",
                "NetApp FAS",
              ].map((term) => (
                <Link
                  key={term}
                  href={`/products?q=${encodeURIComponent(term)}`}
                  className="text-sm text-primary hover:underline"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brand Partners */}
      <BrandPartners />

      {/* Stats Bar */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold font-mono">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Categories Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Browse by Category</h2>
            <p className="mt-2 text-muted-foreground">
              Find exactly what you need from our extensive catalog
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/products?category=${cat.slug}`}>
                <Card className="group h-full transition-all hover:shadow-lg hover:-translate-y-0.5 border-2 hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cat.gradient}`}
                      >
                        <cat.icon className={`h-7 w-7 ${cat.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {cat.name}
                          </h3>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {cat.description}
                        </p>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {cat.count} listings
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Services Section */}
      <section className="py-16 md:py-20 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Our Services</h2>
            <p className="mt-2 text-muted-foreground">
              Beyond buying — we help you configure, sell, and recycle IT hardware
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Link href="/configure">
              <Card className="group h-full transition-all hover:shadow-lg hover:-translate-y-0.5 border-2 hover:border-blue-500/30">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30">
                    <Settings2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Configure & Quote
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Customize your server, storage, or networking requirements.
                    Our experts will find the perfect match and share a competitive quote.
                  </p>
                  <span className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                    Get a Quote <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/sell-hardware">
              <Card className="group h-full transition-all hover:shadow-lg hover:-translate-y-0.5 border-2 hover:border-emerald-500/30">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                    <DollarSign className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Sell Your Hardware
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Get the best price for your used IT equipment. We verify condition,
                    age, and specs — then make you a competitive offer.
                  </p>
                  <span className="mt-4 inline-flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    Sell Now <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/e-recycle">
              <Card className="group h-full transition-all hover:shadow-lg hover:-translate-y-0.5 border-2 hover:border-teal-500/30">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 dark:bg-teal-900/30">
                    <Recycle className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="text-xl font-semibold group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    E-Waste Management
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Responsibly dispose of end-of-life hardware. Certified data destruction,
                    environmentally safe recycling — save the planet, one server at a time.
                  </p>
                  <span className="mt-4 inline-flex items-center text-sm font-medium text-teal-600 dark:text-teal-400">
                    Manage E-Waste <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="py-16 md:py-20 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Why InfraMitra?</h2>
            <p className="mt-2 text-muted-foreground">
              Trusted by thousands of IT professionals worldwide
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {valueProps.map((prop) => (
              <div
                key={prop.title}
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                  <prop.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{prop.title}</h3>
                <p className="mt-2 text-muted-foreground max-w-sm">
                  {prop.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Trust Badges */}
      <TrustBadges />

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="text-3xl font-bold">Ready to sell your hardware?</h2>
            <p className="mt-3 text-primary-foreground/80 text-lg">
              Join thousands of sellers and reach buyers looking for quality IT
              equipment. List your first product in minutes.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className={buttonVariants({
                  size: "lg",
                  variant: "secondary",
                  className: "rounded-xl",
                })}
              >
                Start Selling
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/products"
                className={buttonVariants({
                  size: "lg",
                  variant: "outline",
                  className:
                    "rounded-xl border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10",
                })}
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

      <Footer />
    </div>
  );
}
