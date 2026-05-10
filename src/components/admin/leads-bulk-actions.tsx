"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  CONTACTED:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  QUALIFIED:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  CONVERTED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  LOST: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const SOURCE_COLORS: Record<string, string> = {
  "ai-chat":
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  website:
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  referral:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  manual:
    "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  form: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
  phone:
    "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
};

const LEAD_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"];

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  source: string;
  status: string;
  requirement: string;
  createdAt: string;
}

interface LeadsBulkActionsProps {
  leads: Lead[];
}

export function LeadsBulkActions({ leads }: LeadsBulkActionsProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const allSelected = selected.size === leads.length && leads.length > 0;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(leads.map((l) => l.id)));
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
  }

  async function handleBulkUpdate() {
    if (!bulkStatus) {
      toast.error("Please select a status");
      return;
    }

    if (selected.size === 0) {
      toast.error("Please select at least one lead");
      return;
    }

    setLoading(true);
    try {
      const promises = Array.from(selected).map((leadId) =>
        fetch(`/api/leads/${leadId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: bulkStatus }),
        })
      );

      const results = await Promise.all(promises);
      const failed = results.filter((r) => !r.ok).length;

      if (failed > 0) {
        toast.error(`Failed to update ${failed} lead(s)`);
      } else {
        toast.success(
          `Updated ${selected.size} lead(s) to ${bulkStatus}`
        );
      }

      setSelected(new Set());
      setBulkStatus("");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update leads"
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateStr));
  }

  return (
    <div>
      {/* Bulk Actions Bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 border-b px-4 py-2 bg-muted/50">
          <span className="text-sm font-medium">
            {selected.size} selected
          </span>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="h-7 rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Change status to...</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <Button
            size="xs"
            onClick={handleBulkUpdate}
            disabled={loading || !bulkStatus}
          >
            {loading && <Loader2 className="mr-1 size-3 animate-spin" />}
            Apply
          </Button>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => {
              setSelected(new Set());
              setBulkStatus("");
            }}
          >
            Clear
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="size-4 rounded border-gray-300"
              />
            </TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Requirement</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selected.has(lead.id)}
                  onChange={() => toggleOne(lead.id)}
                  className="size-4 rounded border-gray-300"
                />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(lead.createdAt)}
              </TableCell>
              <TableCell>
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {lead.name}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {lead.email}
              </TableCell>
              <TableCell>{lead.company || "-"}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${SOURCE_COLORS[lead.source] || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"}`}
                >
                  {lead.source}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[lead.status] || "bg-gray-100 text-gray-800"}`}
                >
                  {lead.status}
                </span>
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-muted-foreground">
                {lead.requirement}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
