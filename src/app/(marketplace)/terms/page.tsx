import type { Metadata } from "next";
import Link from "next/link";
import { ScrollText } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms of Service | InfraMitra",
  description:
    "Read InfraMitra's Terms of Service governing the use of our IT hardware marketplace platform.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing and using the InfraMitra platform ("Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Platform. InfraMitra reserves the right to modify these Terms at any time, and your continued use of the Platform constitutes acceptance of any changes.`,
  },
  {
    title: "2. Eligibility",
    content: `You must be at least 18 years of age and capable of forming a binding contract to use the Platform. By using InfraMitra, you represent that you meet these requirements. Business accounts must be registered by authorized representatives of the organization.`,
  },
  {
    title: "3. Account Registration",
    content: `To access certain features, you must create an account with accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately if you suspect unauthorized use of your account. InfraMitra reserves the right to suspend or terminate accounts that violate these Terms.`,
  },
  {
    title: "4. Products & Listings",
    content: `Sellers are responsible for the accuracy of their product listings, including descriptions, specifications, condition, pricing, and images. InfraMitra reserves the right to review, approve, edit, or remove any listing that violates our policies. Product availability and pricing are subject to change without notice. All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless otherwise stated.`,
  },
  {
    title: "5. Orders & Payments",
    content: `When you place an order, you agree to pay the listed price plus any applicable shipping charges. Orders are subject to acceptance and availability. InfraMitra may cancel orders at its discretion if products are unavailable, pricing errors exist, or fraud is suspected. Payments are processed through secure, PCI-DSS compliant payment gateways. Accepted payment methods include bank transfers (NEFT/RTGS/IMPS), UPI, credit/debit cards, and net banking.`,
  },
  {
    title: "6. Shipping & Delivery",
    content: `InfraMitra will make reasonable efforts to deliver products within the estimated timeframes. However, delivery dates are estimates and not guaranteed. Risk of loss and title for products pass to the buyer upon delivery. For detailed shipping information, please refer to our Shipping Policy.`,
  },
  {
    title: "7. Returns & Refunds",
    content: `Products may be returned within 30 days of delivery subject to our Return Policy conditions. Refunds are processed within 7-10 business days after inspection. InfraMitra reserves the right to refuse returns that do not meet our return conditions. For detailed information, please refer to our Return Policy.`,
  },
  {
    title: "8. Seller Obligations",
    content: `Sellers agree to provide accurate product information, ship products within the committed timeframe, respond to buyer inquiries promptly, and comply with all applicable laws and regulations. Sellers are responsible for ensuring their products do not infringe on any intellectual property rights and meet all safety standards. InfraMitra may suspend seller accounts for repeated violations or poor service quality.`,
  },
  {
    title: "9. Prohibited Activities",
    content: `You agree not to: use the Platform for any unlawful purpose; post false, misleading, or fraudulent content; attempt to gain unauthorized access to the Platform or other accounts; interfere with the Platform's operation or security; scrape, crawl, or harvest data without authorization; sell counterfeit, stolen, or prohibited items; or engage in any activity that could harm InfraMitra, its users, or its reputation.`,
  },
  {
    title: "10. Intellectual Property",
    content: `All content on the Platform, including logos, text, graphics, and software, is the property of InfraMitra or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without prior written permission.`,
  },
  {
    title: "11. Limitation of Liability",
    content: `InfraMitra acts as a marketplace platform connecting buyers and sellers. While we strive to ensure quality, InfraMitra is not liable for the condition, authenticity, or performance of products sold by third-party sellers. To the maximum extent permitted by law, InfraMitra's total liability for any claims arising from the use of the Platform shall not exceed the amount paid by you for the specific transaction giving rise to the claim.`,
  },
  {
    title: "12. Dispute Resolution",
    content: `Any disputes arising from these Terms or your use of the Platform shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, disputes shall be resolved through arbitration in accordance with the Indian Arbitration and Conciliation Act, 1996, with the seat of arbitration being New Delhi, India. The language of arbitration shall be English.`,
  },
  {
    title: "13. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of India. The courts of New Delhi shall have exclusive jurisdiction over any disputes arising from these Terms.`,
  },
  {
    title: "14. Contact Information",
    content: `For questions about these Terms of Service, please contact us at info@inframitra.com or call +91 9910668689.`,
  },
];

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <ScrollText className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Terms of Service
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Please read these terms carefully before using the InfraMitra
          platform.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: May 1, 2026
        </p>
      </div>

      {/* Terms Content */}
      <div className="mx-auto max-w-3xl space-y-6">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="text-base">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {section.content}
              </p>
            </CardContent>
          </Card>
        ))}

        {/* Related Links */}
        <div className="rounded-2xl border bg-muted/30 p-6">
          <p className="mb-3 font-medium">Related Policies</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link
              href="/privacy"
              className="text-primary hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/shipping"
              className="text-primary hover:underline"
            >
              Shipping Policy
            </Link>
            <Link
              href="/returns"
              className="text-primary hover:underline"
            >
              Return Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
