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
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Settings2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-4">Sign in to continue</h1>
        <p className="text-muted-foreground mb-6">
          You need to be signed in to request a configuration quote.
        </p>
        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          <Link
            href="/signin?callbackUrl=/configure"
            className={buttonVariants()}
          >
            Sign In
          </Link>
          <Link
            href="/signup?callbackUrl=/configure"
            className={buttonVariants({ variant: "outline" })}
          >
            Create Account
          </Link>
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
