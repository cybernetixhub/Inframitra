"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Settings2, Loader2 } from "lucide-react";
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
import { SPEC_TEMPLATES, BUDGET_RANGES, TIMELINES } from "@/lib/spec-templates";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ConfigurePage() {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Contact info
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactCompany, setContactCompany] = useState("");

  // Requirements
  const [categoryId, setCategoryId] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [useCase, setUseCase] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [budgetRange, setBudgetRange] = useState("");
  const [preferredCondition, setPreferredCondition] = useState("");
  const [timeline, setTimeline] = useState("");

  // Specs
  const [specs, setSpecs] = useState<Record<string, string>>({});

  // Notes
  const [additionalNotes, setAdditionalNotes] = useState("");

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

    if (!contactName || !contactEmail || !categoryId) {
      toast.error("Please fill in all required fields (Name, Email, Category).");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "CONFIGURE_QUOTE",
          contactName,
          contactEmail,
          contactPhone,
          contactCompany,
          categoryId,
          useCase,
          quantity: parseInt(quantity) || 1,
          budgetRange,
          preferredCondition,
          timeline,
          specs,
          additionalNotes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to submit request.");
        return;
      }

      toast.success("Your configuration request has been submitted!");
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
      oauthSignIn(provider, { callbackUrl: "/configure" });
    };

    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md">
          <div className="text-center mb-8">
            <Settings2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Sign in to continue</h1>
            <p className="text-muted-foreground">
              Sign in to request a configuration quote. Choose your preferred method.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <button onClick={() => handleOAuth("google")} className={buttonVariants({ variant: "outline", className: "w-full justify-center gap-3 h-11" })}>
              <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
            <button onClick={() => handleOAuth("microsoft-entra-id")} className={buttonVariants({ variant: "outline", className: "w-full justify-center gap-3 h-11" })}>
              <svg className="h-5 w-5" viewBox="0 0 21 21"><rect x="1" y="1" width="9" height="9" fill="#F25022"/><rect x="11" y="1" width="9" height="9" fill="#7FBA00"/><rect x="1" y="11" width="9" height="9" fill="#00A4EF"/><rect x="11" y="11" width="9" height="9" fill="#FFB900"/></svg>
              Continue with Microsoft 365
            </button>
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or use email</span></div>
            </div>
            <Link href="/signin?callbackUrl=/configure" className={buttonVariants({ className: "w-full justify-center h-11" })}>Sign In with Email</Link>
            <p className="text-center text-xs text-muted-foreground pt-2">
              Don&apos;t have an account?{" "}
              <Link href="/signup?callbackUrl=/configure" className="text-primary font-medium hover:underline">Create one</Link>
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
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Settings2 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Configure Your IT Infrastructure
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Tell us what you need and our team will put together a custom quote
          with the best hardware options for your requirements.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        {/* Card 1: Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              How should we reach you regarding this quote?
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

        {/* Card 2: Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
            <CardDescription>
              Tell us about the hardware you need.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={categoryId} onValueChange={(val) => val && handleCategoryChange(val)}>
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
              <Label htmlFor="useCase">Use Case</Label>
              <Textarea
                id="useCase"
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                placeholder="Describe your use case, e.g. database server for production workloads, development environment, etc."
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
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
              <div className="space-y-2">
                <Label>Budget Range</Label>
                <Select value={budgetRange} onValueChange={(val) => setBudgetRange(val ?? "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUDGET_RANGES.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preferred Condition</Label>
                <Select
                  value={preferredCondition}
                  onValueChange={(val) => setPreferredCondition(val ?? "")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Refurbished">Refurbished</SelectItem>
                    <SelectItem value="Either">Either</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Timeline</Label>
              <Select value={timeline} onValueChange={(val) => setTimeline(val ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  {TIMELINES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Technical Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Specifications</CardTitle>
            <CardDescription>
              Provide details about the specifications you need.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {specTemplate ? (
              <div className="space-y-4">
                {specTemplate.map((spec) => (
                  <div key={spec.label} className="grid gap-2 sm:grid-cols-3 items-center">
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

        {/* Card 4: Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
            <CardDescription>
              Anything else we should know about your requirements?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Any additional requirements, constraints, or questions..."
              rows={4}
            />
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Submitting..." : "Submit Configuration Request"}
          </Button>
        </div>
      </form>
    </div>
  );
}
