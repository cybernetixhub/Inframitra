"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getPaymentProvider,
  type PaymentDetails,
  type PaymentResult,
} from "@/lib/payment";

interface MockPaymentProps {
  amount: number;
  onSuccess: (result: PaymentResult) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export function MockPayment({
  amount,
  onSuccess,
  onError,
  disabled,
}: MockPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<PaymentDetails>({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    name: "",
  });

  function handleChange(field: keyof PaymentDetails, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !formData.cardNumber ||
      !formData.expiryMonth ||
      !formData.expiryYear ||
      !formData.cvv ||
      !formData.name
    ) {
      onError("Please fill in all payment fields");
      return;
    }

    setIsProcessing(true);
    try {
      const provider = getPaymentProvider();
      const result = await provider.processPayment(amount, "INR", formData);
      if (result.success) {
        onSuccess(result);
      } else {
        onError(result.error || "Payment failed");
      }
    } catch (err) {
      onError("Payment processing error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          <span className="font-medium">Payment Details</span>
        </div>
        <Badge
          variant="outline"
          className="border-amber-500 text-amber-600 dark:text-amber-400"
        >
          TEST MODE
        </Badge>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
        This is a test payment form. Any card details will be accepted.
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="card-name">Name on Card</Label>
          <Input
            id="card-name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            disabled={disabled || isProcessing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="card-number">Card Number</Label>
          <Input
            id="card-number"
            placeholder="4242 4242 4242 4242"
            value={formData.cardNumber}
            onChange={(e) => handleChange("cardNumber", e.target.value)}
            disabled={disabled || isProcessing}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry-month">Month</Label>
            <Input
              id="expiry-month"
              placeholder="12"
              maxLength={2}
              value={formData.expiryMonth}
              onChange={(e) => handleChange("expiryMonth", e.target.value)}
              disabled={disabled || isProcessing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiry-year">Year</Label>
            <Input
              id="expiry-year"
              placeholder="28"
              maxLength={2}
              value={formData.expiryYear}
              onChange={(e) => handleChange("expiryYear", e.target.value)}
              disabled={disabled || isProcessing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              placeholder="123"
              maxLength={4}
              value={formData.cvv}
              onChange={(e) => handleChange("cvv", e.target.value)}
              disabled={disabled || isProcessing}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={disabled || isProcessing}
        >
          {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
        </Button>
      </form>
    </div>
  );
}
