"use client";

import { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const shippingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(5, "ZIP code must be at least 5 characters"),
  country: z.string().min(2, "Country is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .optional()
    .or(z.literal("")),
});

export type ShippingData = z.infer<typeof shippingSchema>;

interface CheckoutFormProps {
  onSubmit: (data: ShippingData) => void;
  defaultValues?: Partial<ShippingData>;
  onChange?: (data: Partial<ShippingData>) => void;
}

const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "GB", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "AU", label: "Australia" },
];

export function CheckoutForm({
  onSubmit,
  defaultValues,
  onChange,
}: CheckoutFormProps) {
  const [formData, setFormData] = useState<Partial<ShippingData>>({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    phone: "",
    ...defaultValues,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ShippingData, string>>
  >({});

  function handleChange(field: keyof ShippingData, value: string) {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    onChange?.(updated);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = shippingSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ShippingData, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ShippingData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    onSubmit(result.data);
  }

  return (
    <form id="shipping-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="John Doe"
          value={formData.name ?? ""}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Street Address</Label>
        <Input
          id="address"
          placeholder="123 Main St, Apt 4"
          value={formData.address ?? ""}
          onChange={(e) => handleChange("address", e.target.value)}
        />
        {errors.address && (
          <p className="text-sm text-destructive">{errors.address}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="San Francisco"
            value={formData.city ?? ""}
            onChange={(e) => handleChange("city", e.target.value)}
          />
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State / Province</Label>
          <Input
            id="state"
            placeholder="CA"
            value={formData.state ?? ""}
            onChange={(e) => handleChange("state", e.target.value)}
          />
          {errors.state && (
            <p className="text-sm text-destructive">{errors.state}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zip">ZIP / Postal Code</Label>
          <Input
            id="zip"
            placeholder="94102"
            value={formData.zip ?? ""}
            onChange={(e) => handleChange("zip", e.target.value)}
          />
          {errors.zip && (
            <p className="text-sm text-destructive">{errors.zip}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select
            value={formData.country ?? "US"}
            onValueChange={(val) => val && handleChange("country", val)}
          >
            <SelectTrigger id="country">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-sm text-destructive">{errors.country}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="(555) 123-4567"
          value={formData.phone ?? ""}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone}</p>
        )}
      </div>
    </form>
  );
}
