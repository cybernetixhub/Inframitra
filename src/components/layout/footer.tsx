import Link from "next/link";
import { Server } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-icon.svg" alt="InfraMitra" className="h-8 w-8 rounded-lg" />
              <span className="font-bold text-lg">
                Infra<span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">Mitra</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              The premier marketplace for buying and selling enterprise IT
              hardware. New, refurbished, and used servers, storage, and
              networking equipment.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products?category=servers" className="hover:text-foreground transition-colors">
                  Servers
                </Link>
              </li>
              <li>
                <Link href="/products?category=storage-nas" className="hover:text-foreground transition-colors">
                  Storage & NAS
                </Link>
              </li>
              <li>
                <Link href="/products?category=networking" className="hover:text-foreground transition-colors">
                  Networking
                </Link>
              </li>
              <li>
                <Link href="/products?category=workstations" className="hover:text-foreground transition-colors">
                  Workstations
                </Link>
              </li>
              <li>
                <Link href="/products?category=components" className="hover:text-foreground transition-colors">
                  Components
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-foreground transition-colors">
                  Sell on InfraMitra
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-3">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/configure" className="hover:text-foreground transition-colors">
                  Configure & Quote
                </Link>
              </li>
              <li>
                <Link href="/sell-hardware" className="hover:text-foreground transition-colors">
                  Sell Your Hardware
                </Link>
              </li>
              <li>
                <Link href="/e-recycle" className="hover:text-foreground transition-colors">
                  E-Waste Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/help" className="hover:text-foreground transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-foreground transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-foreground transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} InfraMitra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
