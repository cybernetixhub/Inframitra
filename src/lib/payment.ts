export interface PaymentDetails {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  name: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  error?: string;
}

interface PaymentProvider {
  processPayment(
    amount: number,
    currency: string,
    details: PaymentDetails
  ): Promise<PaymentResult>;
}

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

class MockPaymentProvider implements PaymentProvider {
  async processPayment(
    amount: number,
    currency: string,
    _details: PaymentDetails
  ): Promise<PaymentResult> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      transactionId: generateUUID(),
    };
  }
}

export function getPaymentProvider(): PaymentProvider {
  return new MockPaymentProvider();
}
