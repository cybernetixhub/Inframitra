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
import { UserPlus, Users, Phone, CheckCircle } from "lucide-react";

const LEAD_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"] as const;

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  CONTACTED: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  QUALIFIED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  CONVERTED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  LOST: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const SOURCE_COLORS: Record<string, string> = {
  "ai-chat": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  website: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  referral: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  manual: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
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
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const { status } = await searchParams;

  const where: Record<string, unknown> = {};

  if (status && LEAD_STATUSES.includes(status as typeof LEAD_STATUSES[number])) {
    where.status = status;
  }

  const [leads, totalCount, newCount, contactedCount, convertedCount] =
    await Promise.all([
      prisma.salesLead.findMany({
        where,
        orderBy: { createdAt: "desc" },
      }),
      prisma.salesLead.count(),
      prisma.salesLead.count({ where: { status: "NEW" } }),
      prisma.salesLead.count({ where: { status: "CONTACTED" } }),
      prisma.salesLead.count({ where: { status: "CONVERTED" } }),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sales Leads</h1>
        <p className="text-muted-foreground">
          Manage and track all sales leads from the AI chat widget and other
          sources
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 py-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCount}</p>
              <p className="text-xs text-muted-foreground">Total Leads</p>
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
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle className="size-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{convertedCount}</p>
              <p className="text-xs text-muted-foreground">Converted</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 py-3">
          <span className="text-sm font-medium text-muted-foreground">
            Filter:
          </span>
          <div className="flex flex-wrap gap-2">
            <LinkButton
              href="/admin/leads"
              variant={!status ? "default" : "outline"}
              size="sm"
            >
              All
            </LinkButton>
            {LEAD_STATUSES.map((s) => (
              <LinkButton
                key={s}
                href={`/admin/leads?status=${s}`}
                variant={status === s ? "default" : "outline"}
                size="sm"
              >
                {s}
              </LinkButton>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      {leads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserPlus className="size-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No leads found</h3>
            <p className="text-muted-foreground text-center">
              {status
                ? "No leads match the selected filter."
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
            <Table>
              <TableHeader>
                <TableRow>
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
                      <SourceBadge source={lead.source} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={lead.status} />
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {lead.requirement}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
