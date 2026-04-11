"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Recycle, Loader2, Leaf, ShieldCheck } from "lucide-react";
import { EwasteServicesShowcase } from "@/components/home/ewaste-services";
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
import { RECYCLE_CONDITIONS } from "@/lib/spec-templates";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ERecyclePage() {
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
  const [description, setDescription] = useState("");
  const [approximateQuantity, setApproximateQuantity] = useState("");
  const [approximateWeight, setApproximateWeight] = useState("");
  const [condition, setCondition] = useState("");

  // Data & Security
  const [dataDestructionRequired, setDataDestructionRequired] = useState(false);
  const [securityNotes, setSecurityNotes] = useState("");

  // Pickup info
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [preferredPickupDate, setPreferredPickupDate] = useState("");

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!contactName || !contactEmail || !description) {
      toast.error(
        "Please fill in all required fields (Name, Email, Description)."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "E_RECYCLE",
          contactName,
          contactEmail,
          contactPhone,
          contactCompany,
          categoryId: categoryId || null,
          description,
          approximateQuantity,
          approximateWeight,
          condition,
          dataDestructionRequired,
          securityNotes,
          pickupAddress: address,
          pickupCity: city,
          pickupState: state,
          pickupZip: zip,
          pickupCountry: country,
          preferredPickupDate,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to submit request.");
        return;
      }

      toast.success("Your e-waste management request has been submitted!");
      router.push("/my-requests");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Render hero + services for everyone, gate only the form
  const renderHeroAndServices = () => (
    <>
      {/* Hero Section */}
      <div className="mb-10 text-center relative">
        <div className="absolute inset-0 -z-10 mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 dark:from-teal-950/30 dark:via-emerald-950/20 dark:to-cyan-950/30 blur-xl opacity-60" />
        <div className="py-8">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 shadow-lg shadow-teal-500/25">
            <Recycle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            E-Waste{" "}
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Management
            </span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Responsibly dispose of your end-of-life IT equipment. We provide
            NIST-certified data destruction and environmentally safe recycling.
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="max-w-3xl mx-auto mb-6">
        <div className="rounded-xl border-2 border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50 p-5 dark:border-teal-800/50 dark:from-teal-950/40 dark:to-emerald-950/40">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/50">
              <Leaf className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="font-semibold text-teal-800 dark:text-teal-200">
                Save the Planet, One Server at a Time
              </p>
              <p className="text-sm text-teal-700 dark:text-teal-300">
                Every piece of hardware recycled through InfraMitra is processed following
                strict environmental regulations with certified data wiping and responsible material recovery.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full E-Waste Services Showcase */}
      <div className="max-w-5xl mx-auto mb-12">
        <EwasteServicesShowcase />
      </div>
    </>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {renderHeroAndServices()}

      {authStatus === "loading" ? (
        <div className="py-8 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : authStatus === "unauthenticated" ? (
        <div className="max-w-md mx-auto text-center py-8 rounded-2xl border bg-muted/30">
          <Recycle className="mx-auto h-10 w-10 text-teal-600 dark:text-teal-400 mb-3" />
          <h2 className="text-xl font-bold mb-2">Sign in to submit a request</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Create a free account to submit your e-waste management request.
          </p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto px-4">
            <Link
              href="/signin?callbackUrl=/e-recycle"
              className={buttonVariants()}
            >
              Sign In
            </Link>
            <Link
              href="/signup?callbackUrl=/e-recycle"
              className={buttonVariants({ variant: "outline" })}
            >
              Create Account
            </Link>
          </div>
        </div>
      ) : (
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        {/* Card 1: Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              How should we reach you about this recycling request?
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
                  placeholder="+91 99106 68689"
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
              Tell us about the hardware you want to recycle.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={(val) => setCategoryId(val ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="mixed-other">Mixed / Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the hardware you want to recycle, e.g. 10 Dell PowerEdge R630 servers, 5 Cisco Catalyst 3850 switches, assorted cables and peripherals..."
                rows={4}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="approximateQuantity">
                  Approximate Quantity
                </Label>
                <Input
                  id="approximateQuantity"
                  value={approximateQuantity}
                  onChange={(e) => setApproximateQuantity(e.target.value)}
                  placeholder="e.g. 15 items"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="approximateWeight">
                  Approximate Weight
                </Label>
                <Input
                  id="approximateWeight"
                  value={approximateWeight}
                  onChange={(e) => setApproximateWeight(e.target.value)}
                  placeholder="e.g. 100 kg"
                />
              </div>
              <div className="space-y-2">
                <Label>Condition</Label>
                <Select value={condition} onValueChange={(val) => setCondition(val ?? "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {RECYCLE_CONDITIONS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Data & Security */}
        <Card>
          <CardHeader>
            <CardTitle>Data &amp; Security</CardTitle>
            <CardDescription>
              Let us know about any data security requirements.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="dataDestructionRequired"
                checked={dataDestructionRequired}
                onChange={(e) =>
                  setDataDestructionRequired(e.target.checked)
                }
                className="mt-1 h-4 w-4 rounded border-input"
              />
              <div>
                <Label
                  htmlFor="dataDestructionRequired"
                  className="font-medium"
                >
                  Data Destruction Required
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  We provide NIST 800-88 certified data wiping and physical
                  destruction services.
                </p>
              </div>
            </div>

            {dataDestructionRequired && (
              <div className="ml-7 flex items-start gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 dark:border-teal-900/50 dark:bg-teal-950/30">
                <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                <p className="text-xs text-teal-800 dark:text-teal-300">
                  You will receive a Certificate of Data Destruction after
                  processing is complete.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="securityNotes">
                Additional Security Notes
              </Label>
              <Textarea
                id="securityNotes"
                value={securityNotes}
                onChange={(e) => setSecurityNotes(e.target.value)}
                placeholder="Any specific security requirements, compliance standards, or handling instructions..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Pickup Information */}
        <Card>
          <CardHeader>
            <CardTitle>Pickup Information</CardTitle>
            <CardDescription>
              Where should we pick up the hardware for recycling?
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
                  placeholder="Mumbai"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State / Province</Label>
                <Input
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Maharashtra"
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
                  placeholder="400001"
                />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Select value={country} onValueChange={(val) => setCountry(val ?? "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">India</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredPickupDate">
                Preferred Pickup Date
              </Label>
              <Input
                id="preferredPickupDate"
                value={preferredPickupDate}
                onChange={(e) => setPreferredPickupDate(e.target.value)}
                placeholder="e.g. April 15-20, 2026 or Anytime next week"
              />
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Submitting..." : "Submit Recycling Request"}
          </Button>
        </div>
      </form>
      )}
    </div>
  );
}
