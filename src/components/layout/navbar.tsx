"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Server,
  ShoppingCart,
  Search,
  Menu,
  User,
  LogOut,
  Package,
  LayoutDashboard,
  Heart,
  MessageSquare,
  Shield,
  FileText,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const userInitials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.svg" alt="InfraMitra" className="h-9 w-9 rounded-lg" />
          <span className="hidden sm:inline font-bold text-xl">
            Infra<span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">Mitra</span>
          </span>
        </Link>

        {/* Search Bar - Desktop */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-xl mx-8"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search servers, storage, networking..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Cart */}
          <Link
            href="/cart"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Link>

          {/* Auth */}
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={buttonVariants({ variant: "ghost", size: "icon", className: "relative h-9 w-9 rounded-full" })}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={session.user.image || ""} />
                  <AvatarFallback className="text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.user.email}
                    </p>
                    <Badge variant="secondary" className="w-fit text-[10px]">
                      {session.user.role}
                    </Badge>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/dashboard" className="flex items-center w-full">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/orders" className="flex items-center w-full">
                    <Package className="mr-2 h-4 w-4" />
                    My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/wishlist" className="flex items-center w-full">
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/my-requests" className="flex items-center w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    My Requests
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/messages" className="flex items-center w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messages
                  </Link>
                </DropdownMenuItem>
                {(session.user.role === "SELLER" ||
                  session.user.role === "ADMIN") && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link
                        href="/seller/products"
                        className="flex items-center w-full"
                      >
                        <Package className="mr-2 h-4 w-4" />
                        My Products
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                {session.user.role === "ADMIN" && (
                  <DropdownMenuItem>
                    <Link href="/admin" className="flex items-center w-full">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/settings" className="flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 dark:text-red-400"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/signin"
                className={buttonVariants({ variant: "ghost" })}
              >
                Sign In
              </Link>
              <Link href="/signup" className={buttonVariants()}>
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger>
              <span
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon",
                  className: "md:hidden",
                })}
              >
                <Menu className="h-5 w-5" />
              </span>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-4 mt-8">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search hardware..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>
                <nav className="flex flex-col gap-2">
                  <Link
                    href="/products"
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Browse Products
                  </Link>
                  <Link
                    href="/products?condition=NEW"
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    New Hardware
                  </Link>
                  <Link
                    href="/products?condition=REFURBISHED"
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Refurbished
                  </Link>
                  <Link
                    href="/products?condition=USED"
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Used Hardware
                  </Link>
                  <div className="my-2 border-t" />
                  <span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Services</span>
                  <Link
                    href="/configure"
                    className="rounded-md px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Configure & Quote
                  </Link>
                  <Link
                    href="/sell-hardware"
                    className="rounded-md px-3 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sell Hardware
                  </Link>
                  <Link
                    href="/e-recycle"
                    className="rounded-md px-3 py-2 text-sm font-medium text-teal-600 dark:text-teal-400 hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    E-Waste
                  </Link>
                </nav>
                {!session?.user && (
                  <div className="flex flex-col gap-2 mt-4">
                    <Link
                      href="/signin"
                      className={buttonVariants({ variant: "outline" })}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className={buttonVariants()}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Category Navigation - Desktop */}
      <nav className="hidden lg:block border-t">
        <div className="container mx-auto flex items-center gap-6 px-4 h-10 text-sm">
          <Link
            href="/products"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            All Products
          </Link>
          <Link
            href="/products?category=servers"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Servers
          </Link>
          <Link
            href="/products?category=storage-nas"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Storage & NAS
          </Link>
          <Link
            href="/products?category=networking"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Networking
          </Link>
          <Link
            href="/products?category=components"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Components
          </Link>
          <span className="ml-auto" />
          <Link
            href="/configure"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            Configure & Quote
          </Link>
          <Link
            href="/sell-hardware"
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
          >
            Sell Hardware
          </Link>
          <Link
            href="/e-recycle"
            className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors"
          >
            E-Waste
          </Link>
        </div>
      </nav>
    </header>
  );
}
