import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { LinkButton } from "@/components/shared/link-button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadsExport } from "@/components/admin/leads-export";
import { LeadsBulkActions } from "@/components/admin/leads-bulk-actions";
import {
  UserPlus,
  Users,
  Phone,
  CheckCircle,
  MessageSquare,
  XCircle,
  Search,
} from "lucide-react";

const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
  "LOST",
] as const;

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

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status] || "bg-gray-100 text-gray-800"}`}
    >
      {status}
    </span>
  );
}

function SourceBadge({ source }: { source: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${SOURCE_COLORS[source] || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"}`}
    >
      {source}
    </span>
  );
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    source?: string;
    q?: string;
    range?: string;
  }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const { status, source, q, range } = await searchParams;

  const where: Record<string, unknown> = {};

  if (
    status &&
    LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number])
  ) {
    where.status = status;
  }

  if (source) {
    where.source = source;
  }

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  if (range) {
    const now = new Date();
    let dateFrom: Date | undefined;

    switch (range) {
      case "today": {
        dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      }
      case "week": {
        const day = now.getDay();
        dateFrom = new Date(now);
        dateFrom.setDate(now.getDate() - day);
        dateFrom.setHours(0, 0, 0, 0);
        break;
      }
      case "month": {
        dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      }
    }

    if (dateFrom) {
      where.createdAt = { gte: dateFrom };
    }
  }

  const [
    leads,
    totalCount,
    newCount,
    contactedCount,
    qualifiedCount,
    convertedCount,
    lostCount,
  ] = await Promise.all([
    prisma.salesLead.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.salesLead.count(),
    prisma.salesLead.count({ where: { status: "NEW" } }),
    prisma.salesLead.count({ where: { status: "CONTACTED" } }),
    prisma.salesLead.count({ where: { status: "QUALIFIED" } }),
    prisma.salesLead.count({ where: { status: "CONVERTED" } }),
    prisma.salesLead.count({ where: { status: "LOST" } }),
  ]);

  function buildFilterUrl(params: Record<string, string | undefined>) {
    const sp = new URLSearchParams();
    const merged = { status, source, q, range, ...params };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) sp.set(k, v);
    });
    const qs = sp.toString();
    return `/admin/leads${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Leads</h1>
          <p className="text-muted-foreground">
            Manage and track all sales leads from the AI chat widget and other
            sources
          </p>
        </div>
        <LeadsExport />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardContent className="flex items-center gap-3 py-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCount}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <UserPlus className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{newCount}</p>
              <p className="text-xs text-muted-foreground">New</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Phone className="size-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{contactedCount}</p>
              <p className="text-xs text-muted-foreground">Contacted</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <MessageSquare className="size-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{qualifiedCount}</p>
              <p className="text-xs text-muted-foreground">Qualified</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle className="size-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{convertedCount}</p>
              <p className="text-xs text-muted-foreground">Converted</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
              <XCircle className="size-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{lostCount}</p>
              <p className="text-xs text-muted-foreground">Lost</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="space-y-3 py-3">
          {/* Search */}
          <div className="flex items-center gap-2">
            <Search className="size-4 text-muted-foreground" />
            <form action="/admin/leads" method="GET" className="flex-1">
              {status && <input type="hidden" name="status" value={status} />}
              {source && <input type="hidden" name="source" value={source} />}
              {range && <input type="hidden" name="range" value={range} />}
              <input
                type="text"
                name="q"
                defaultValue={q || ""}
                placeholder="Search by name or email..."
                className="h-8 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </form>
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Status:
            </span>
            <LinkButton
              href={buildFilterUrl({ status: undefined })}
              variant={!status ? "default" : "outline"}
              size="xs"
            >
              All
            </LinkButton>
            {LEAD_STATUSES.map((s) => (
              <LinkButton
                key={s}
                href={buildFilterUrl({ status: s })}
                variant={status === s ? "default" : "outline"}
                size="xs"
              >
                {s}
              </LinkButton>
            ))}
          </div>

          {/* Source Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Source:
            </span>
            <LinkButton
              href={buildFilterUrl({ source: undefined })}
              variant={!source ? "default" : "outline"}
              size="xs"
            >
              All
            </LinkButton>
            {["ai-chat", "form", "phone"].map((s) => (
              <LinkButton
                key={s}
                href={buildFilterUrl({ source: s })}
                variant={source === s ? "default" : "outline"}
                size="xs"
              >
                {s}
              </LinkButton>
            ))}
          </div>

          {/* Date Range Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Period:
            </span>
            <LinkButton
              href={buildFilterUrl({ range: undefined })}
              variant={!range ? "default" : "outline"}
              size="xs"
            >
              All Time
            </LinkButton>
            {[
              { key: "today", label: "Today" },
              { key: "week", label: "This Week" },
              { key: "month", label: "This Month" },
            ].map((r) => (
              <LinkButton
                key={r.key}
                href={buildFilterUrl({ range: r.key })}
                variant={range === r.key ? "default" : "outline"}
                size="xs"
              >
                {r.label}
              </LinkButton>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      {leads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserPlus className="mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-medium">No leads found</h3>
            <p className="text-center text-muted-foreground">
              {status || source || q || range
                ? "No leads match the selected filters."
                : "No sales leads have been captured yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {leads.length} Lead{leads.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <LeadsBulkActions
              leads={leads.map((lead) => ({
                id: lead.id,
                name: lead.name,
                email: lead.email,
                phone: lead.phone,
                company: lead.company,
                source: lead.source,
                status: lead.status,
                requirement: lead.requirement,
                createdAt: lead.createdAt.toISOString(),
              }))}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
