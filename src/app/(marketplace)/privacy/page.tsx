import type { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy Policy | InfraMitra",
  description:
    "InfraMitra's Privacy Policy explains how we collect, use, and protect your personal data. Compliant with the Indian IT Act.",
};

const sections = [
  {
    title: "1. Information We Collect",
    content: [
      "We collect information that you provide directly to us when you use the InfraMitra platform, including:",
      "**Personal Information:** Name, email address, phone number, and shipping address provided during registration and checkout.",
      "**Business Information:** Company name, GST number, and business address for verified seller and corporate buyer accounts.",
      "**Transaction Data:** Order history, payment details (processed securely through our payment partners), and communication records related to transactions.",
      "**Usage Data:** Browser type, device information, IP address, pages visited, and interactions with the Platform collected automatically through cookies and similar technologies.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      "We use the information we collect for the following purposes:",
      "- Processing and fulfilling your orders, including shipping and delivery",
      "- Communicating with you about your account, orders, and support requests",
      "- Sending transactional notifications such as order confirmations, shipping updates, and invoices",
      "- Improving our Platform, products, and services based on usage patterns",
      "- Preventing fraud, enforcing our Terms of Service, and ensuring platform security",
      "- Sending promotional communications (only with your consent, and you can opt out at any time)",
    ],
  },
  {
    title: "3. Information Sharing",
    content: [
      "We do not sell, rent, or trade your personal information to third parties for marketing purposes. We may share your information in the following limited circumstances:",
      "- **Service Providers:** With trusted third-party service providers who assist us in operating the Platform, processing payments, and delivering orders. These providers are contractually obligated to protect your data.",
      "- **Sellers/Buyers:** Necessary order-related information (name, shipping address) is shared with the relevant seller or buyer to fulfill transactions.",
      "- **Legal Requirements:** When required by law, regulation, legal process, or government request.",
      "- **Business Transfers:** In connection with a merger, acquisition, or sale of assets, with appropriate data protection safeguards.",
    ],
  },
  {
    title: "4. Cookies & Tracking Technologies",
    content: [
      "We use cookies and similar technologies to enhance your experience on the Platform. These include:",
      "- **Essential Cookies:** Required for the Platform to function properly (authentication, shopping cart, security).",
      "- **Analytics Cookies:** Help us understand how users interact with the Platform so we can improve it.",
      "- **Preference Cookies:** Remember your settings and preferences for a personalized experience.",
      "You can manage your cookie preferences through your browser settings. Note that disabling essential cookies may affect the functionality of the Platform.",
    ],
  },
  {
    title: "5. Data Security",
    content: [
      "We implement industry-standard security measures to protect your personal information, including:",
      "- SSL/TLS encryption for all data transmitted between your browser and our servers",
      "- PCI-DSS compliant payment processing through trusted payment gateway partners",
      "- Regular security audits and vulnerability assessments",
      "- Access controls and authentication mechanisms to protect stored data",
      "- Encrypted storage for sensitive personal and financial information",
      "While we take every reasonable precaution to protect your data, no method of electronic transmission or storage is completely secure.",
    ],
  },
  {
    title: "6. Data Retention",
    content: [
      "We retain your personal information for as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your account and associated data by contacting our support team.",
    ],
  },
  {
    title: "7. Your Rights",
    content: [
      "You have the following rights regarding your personal information:",
      "- **Access:** Request a copy of the personal data we hold about you.",
      "- **Correction:** Request correction of inaccurate or incomplete data.",
      "- **Deletion:** Request deletion of your personal data, subject to legal retention requirements.",
      "- **Opt-out:** Unsubscribe from marketing communications at any time using the link in our emails or by contacting support.",
      "To exercise any of these rights, contact us at info@inframitra.com.",
    ],
  },
  {
    title: "8. Children's Privacy",
    content: [
      "The InfraMitra platform is not intended for use by individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal data, we will take steps to delete it.",
    ],
  },
  {
    title: "9. Compliance with Indian IT Act",
    content: [
      "InfraMitra complies with the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011. We implement reasonable security practices and procedures as required by law to protect sensitive personal data.",
    ],
  },
  {
    title: "10. Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on the Platform and updating the \"Last Updated\" date. We encourage you to review this policy periodically.",
    ],
  },
  {
    title: "11. Contact Us",
    content: [
      "If you have any questions, concerns, or requests regarding this Privacy Policy or the handling of your personal data, please contact us:",
      "- **Email:** info@inframitra.com",
      "- **Phone:** +91 9910668689",
      "- **Address:** InfraMitra Technologies, New Delhi, India",
    ],
  },
];

function renderContent(lines: string[]) {
  return lines.map((line, i) => {
    // Replace markdown bold with HTML
    const html = line.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="text-foreground">$1</strong>'
    );

    if (line.startsWith("- ")) {
      return (
        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span dangerouslySetInnerHTML={{ __html: html.slice(2) }} />
        </li>
      );
    }

    return (
      <p
        key={i}
        className="text-sm leading-relaxed text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  });
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <Shield className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Privacy Policy
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Your privacy is important to us. This policy explains how InfraMitra
          collects, uses, and protects your personal information.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: May 1, 2026
        </p>
      </div>

      {/* Privacy Content */}
      <div className="mx-auto max-w-3xl space-y-6">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="text-base">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {renderContent(section.content)}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Related Links */}
        <div className="rounded-2xl border bg-muted/30 p-6">
          <p className="mb-3 font-medium">Related Policies</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link
              href="/terms"
              className="text-primary hover:underline"
            >
              Terms of Service
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
