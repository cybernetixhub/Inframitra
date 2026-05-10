"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";

export function LeadsExport() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const res = await fetch("/api/leads?limit=100");
      if (!res.ok) {
        throw new Error("Failed to fetch leads");
      }

      const data = await res.json();
      const leads = data.leads || [];

      if (leads.length === 0) {
        toast.info("No leads to export");
        return;
      }

      const headers = [
        "Date",
        "Name",
        "Email",
        "Phone",
        "Company",
        "Source",
        "Status",
        "Requirement",
      ];

      const rows = leads.map(
        (lead: {
          createdAt: string;
          name: string;
          email: string;
          phone: string | null;
          company: string | null;
          source: string;
          status: string;
          requirement: string;
        }) => [
          new Date(lead.createdAt).toLocaleDateString("en-IN"),
          lead.name,
          lead.email,
          lead.phone || "",
          lead.company || "",
          lead.source,
          lead.status,
          lead.requirement.replace(/"/g, '""'),
        ]
      );

      const csvContent = [
        headers.join(","),
        ...rows.map((row: string[]) =>
          row.map((cell) => `"${cell}"`).join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const today = new Date().toISOString().split("T")[0];
      link.href = url;
      link.download = `inframitra-leads-${today}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${leads.length} leads as CSV`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to export leads"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={loading}>
      {loading ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <Download className="mr-2 size-4" />
      )}
      Export CSV
    </Button>
  );
}
