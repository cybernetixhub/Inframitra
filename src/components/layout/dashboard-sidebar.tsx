"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Heart,
  MessageSquare,
  Settings,
  Store,
  ClipboardList,
  BarChart3,
  Menu,
  Server,
  FileText,
} from "lucide-react";
import type { UserRole } from "@/generated/prisma";

interface DashboardSidebarProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: UserRole;
  };
}

const buyerLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/my-requests", label: "My Requests", icon: FileText },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/settings", label: "Settings", icon: Settings },
];

const sellerLinks = [
  { href: "/seller/products", label: "My Products", icon: Package },
  { href: "/seller/orders", label: "Seller Orders", icon: ClipboardList },
  { href: "/seller/analytics", label: "Analytics", icon: BarChart3 },
];

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isSeller = user.role === "SELLER" || user.role === "ADMIN";

  const allLinks = isSeller ? [...buyerLinks, ...sellerLinks] : buyerLinks;

  function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
    return (
      <nav className="flex flex-col gap-1">
        {allLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" && pathname.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <>
      {/* Mobile hamburger */}
      <div className="sticky top-0 z-40 flex h-14 items-center border-b bg-background px-4 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <Menu className="size-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setOpen(false)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo-icon.svg" alt="InfraMitra" className="h-7 w-7 rounded-md" />
                  <span className="font-bold">Infra<span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">Mitra</span></span>
                </Link>
              </SheetTitle>
            </SheetHeader>
            <div className="px-4 py-2">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/" className="ml-3 flex items-center gap-2">
          <Server className="size-5 text-primary" />
          <span className="font-bold">InfraMitra</span>
        </Link>
      </div>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-background md:block">
        <div className="flex h-14 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2">
            <Server className="size-5 text-primary" />
            <span className="font-bold">InfraMitra</span>
          </Link>
        </div>
        <div className="p-4">
          <NavLinks />
        </div>
        <div className="absolute bottom-0 left-0 right-0 border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
