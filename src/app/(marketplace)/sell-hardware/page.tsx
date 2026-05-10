"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  SPEC_TEMPLATES,
  HARDWARE_CONDITIONS,
  HARDWARE_AGES,
} from "@/lib/spec-templates";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function SellHardwarePage() {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Contact info
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactCompany, setContactCompany] = useState("");

  // Hardware details
  const [categoryId, setCategoryId] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [brand, setBrand] = useState("");
  const [title, setTitle] = useState("");
  const [condition, setCondition] = useState("");
  const [age, setAge] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [warrantyStatus, setWarrantyStatus] = useState("");
  const [hasPurchaseInvoice, setHasPurchaseInvoice] = useState(false);
  const [expectedPrice, setExpectedPrice] = useState("");
  const [reasonForSelling, setReasonForSelling] = useState("");

  // Specs
  const [specs, setSpecs] = useState<Record<string, string>>({});

  // Photos
  const [photoUrls, setPhotoUrls] = useState("");

  // Pickup info
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  // Pre-fill from session
  useEffect(() => {
    if (session?.user) {
      setContactName(session.user.name || "");
      setContactEmail(session.user.email || "");
    }
  }, [session]);

  // Fetch categories
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => {});
  }, []);

  function handleCategoryChange(value: string) {
    setCategoryId(value);
    const cat = categories.find((c) => c.id === value);
    setCategorySlug(cat?.slug || "");
    setSpecs({});
  }

  function handleSpecChange(label: string, value: string) {
    setSpecs((prev) => ({ ...prev, [label]: value }));
  }

  const specTemplate = categorySlug ? SPEC_TEMPLATES[categorySlug] : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!contactName || !contactEmail || !categoryId || !title || !condition) {
      toast.error(
        "Please fill in all required fields (Name, Email, Category, Product Name, Condition)."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "SELL_HARDWARE",
          contactName,
          contactEmail,
          contactPhone,
          contactCompany,
          categoryId,
          brand,
          title,
          condition,
          age,
          quantity: parseInt(quantity) || 1,
          warrantyStatus,
          hasPurchaseInvoice,
          expectedPrice: expectedPrice ? parseFloat(expectedPrice) : null,
          reasonForSelling,
          specs,
          photoUrls,
          pickupAddress: address,
          pickupCity: city,
          pickupState: state,
          pickupZip: zip,
          pickupCountry: country,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to submit request.");
        return;
      }

      toast.success("Your sell request has been submitted!");
      router.push("/my-requests");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authStatus === "loading") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    const handleOAuth = (provider: string) => {
      const { signIn: oauthSignIn } = require("next-auth/react");
      oauthSignIn(provider, { callbackUrl: "/sell-hardware" });
    };

    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md">
          <div className="text-center mb-8">
            <DollarSign className="mx-auto h-12 w-12 text-emerald-600 dark:text-emerald-400 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Sign in to continue</h1>
            <p className="text-muted-foreground">
              Sign in to sell your hardware. Choose your preferred method.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6 space-y-4">
            {/* OAuth Providers */}
            <button
              onClick={() => handleOAuth("google")}
              className={buttonVariants({ variant: "outline", className: "w-full justify-center gap-3 h-11" })}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => handleOAuth("microsoft-entra-id")}
              className={buttonVariants({ variant: "outline", className: "w-full justify-center gap-3 h-11" })}
            >
              <svg className="h-5 w-5" viewBox="0 0 21 21">
                <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
              </svg>
              Continue with Microsoft 365
            </button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">or use email</span>
              </div>
            </div>

            <Link
              href="/signin?callbackUrl=/sell-hardware"
              className={buttonVariants({ className: "w-full justify-center h-11" })}
            >
              Sign In with Email
            </Link>

            <p className="text-center text-xs text-muted-foreground pt-2">
              Don&apos;t have an account?{" "}
              <Link href="/signup?callbackUrl=/sell-hardware" className="text-primary font-medium hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
          <DollarSign className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Sell Your IT Hardware
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Get the best price for your used enterprise equipment. Our team
          verifies condition and provides a competitive offer.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        {/* Card 1: Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              How should we reach you about your hardware?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactName">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contactName"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="john@company.com"
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactCompany">Company</Label>
                <Input
                  id="contactCompany"
                  value={contactCompany}
                  onChange={(e) => setContactCompany(e.target.value)}
                  placeholder="Acme Inc."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Hardware Details */}
        <Card>
          <CardHeader>
            <CardTitle>Hardware Details</CardTitle>
            <CardDescription>
              Tell us about the hardware you want to sell.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={categoryId}
                  onValueChange={(val) => val && handleCategoryChange(val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Dell, HP, Cisco"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">
                Model / Product Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Dell PowerEdge R750"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>
                  Condition <span className="text-destructive">*</span>
                </Label>
                <Select value={condition} onValueChange={(val) => setCondition(val ?? "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {HARDWARE_CONDITIONS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Age</Label>
                <Select value={age} onValueChange={(val) => setAge(val ?? "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent>
                    {HARDWARE_AGES.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="warrantyStatus">Warranty Status</Label>
                <Input
                  id="warrantyStatus"
                  value={warrantyStatus}
                  onChange={(e) => setWarrantyStatus(e.target.value)}
                  placeholder="e.g. Active until Dec 2026"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedPrice">Expected Price (INR)</Label>
                <Input
                  id="expectedPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="hasPurchaseInvoice"
                checked={hasPurchaseInvoice}
                onChange={(e) => setHasPurchaseInvoice(e.target.checked)}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="hasPurchaseInvoice" className="font-normal">
                I have the original purchase invoice
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reasonForSelling">Reason for Selling</Label>
              <Textarea
                id="reasonForSelling"
                value={reasonForSelling}
                onChange={(e) => setReasonForSelling(e.target.value)}
                placeholder="e.g. Upgrading to newer hardware, decommissioning data center..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Technical Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Specifications</CardTitle>
            <CardDescription>
              Provide the specs of your hardware for accurate valuation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {specTemplate ? (
              <div className="space-y-4">
                {specTemplate.map((spec) => (
                  <div
                    key={spec.label}
                    className="grid gap-2 sm:grid-cols-3 items-center"
                  >
                    <Label className="sm:text-right text-muted-foreground">
                      {spec.label}
                    </Label>
                    <div className="sm:col-span-2">
                      <Input
                        value={specs[spec.label] || ""}
                        onChange={(e) =>
                          handleSpecChange(spec.label, e.target.value)
                        }
                        placeholder={spec.placeholder}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                Select a category first to see relevant specification fields.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Card 4: Photos */}
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
            <CardDescription>
              Upload photos of your hardware for faster evaluation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Photo upload will be available soon. For now, you can paste image
                URLs below (one per line).
              </p>
            </div>
            <Textarea
              value={photoUrls}
              onChange={(e) => setPhotoUrls(e.target.value)}
              placeholder="Paste image URLs here, one per line..."
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Card 5: Pickup Information */}
        <Card>
          <CardHeader>
            <CardTitle>Pickup Information</CardTitle>
            <CardDescription>
              Where should we pick up the hardware?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main Street"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="San Francisco"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State / Province</Label>
                <Input
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="CA"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP / Postal Code</Label>
                <Input
                  id="zip"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="94105"
                />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Select value={country} onValueChange={(val) => setCountry(val ?? "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="IN">India</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Submitting..." : "Submit Sell Request"}
          </Button>
        </div>
      </form>
    </div>
  );
}
