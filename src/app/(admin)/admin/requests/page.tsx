import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { RequestType, RequestStatus } from "@/generated/prisma";
import { formatPrice, formatDate } from "@/lib/format";
import { RequestStatusBadge } from "@/components/requests/request-status-badge";
import { LinkButton } from "@/components/shared/link-button";
import {
  REQUEST_TYPE_LABELS,
  REQUEST_STATUS_LABELS,
} from "@/lib/constants";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const { type, status } = await searchParams;

  const where: Record<string, unknown> = {};

  if (type && Object.values(RequestType).includes(type as RequestType)) {
    where.type = type;
  }

  if (
    status &&
    Object.values(RequestStatus).includes(status as RequestStatus)
  ) {
    where.status = status;
  }

  const requests = await prisma.serviceRequest.findMany({
    where,
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const typeValues = Object.values(RequestType);
  const statusValues = Object.values(RequestStatus);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Service Requests</h1>
        <p className="text-muted-foreground">
          Manage and review all customer service requests
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 py-3">
          <span className="text-sm font-medium text-muted-foreground">
            Filter:
          </span>

          <div className="flex flex-wrap gap-2">
            <LinkButton
              href="/admin/requests"
              variant={!type && !status ? "default" : "outline"}
              size="sm"
            >
              All
            </LinkButton>
          </div>

          <div className="h-6 w-px bg-border" />

          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Type
          </span>
          <div className="flex flex-wrap gap-2">
            {typeValues.map((t) => (
              <LinkButton
                key={t}
                href={`/admin/requests?type=${t}${status ? `&status=${status}` : ""}`}
                variant={type === t ? "default" : "outline"}
                size="sm"
              >
                {REQUEST_TYPE_LABELS[t] ?? t}
              </LinkButton>
            ))}
          </div>

          <div className="h-6 w-px bg-border" />

          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Status
          </span>
          <div className="flex flex-wrap gap-2">
            {statusValues.map((s) => (
              <LinkButton
                key={s}
                href={`/admin/requests?status=${s}${type ? `&type=${type}` : ""}`}
                variant={status === s ? "default" : "outline"}
                size="sm"
              >
                {REQUEST_STATUS_LABELS[s] ?? s}
              </LinkButton>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      {requests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="size-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No requests found</h3>
            <p className="text-muted-foreground text-center">
              {type || status
                ? "No requests match the selected filters."
                : "No service requests have been submitted yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {requests.length} Request{requests.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request #</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Offered Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <Link
                        href={`/admin/requests/${request.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {request.requestNumber}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <RequestStatusBadge
                        status={request.status}
                        type={request.type}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">
                          {request.user.name || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {request.user.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/requests/${request.id}`}
                        className="hover:underline"
                      >
                        {request.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <RequestStatusBadge status={request.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(request.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {request.offeredPrice
                        ? formatPrice(request.offeredPrice.toNumber())
                        : "-"}
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
