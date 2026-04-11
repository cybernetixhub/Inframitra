import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/format";
import { RequestStatusBadge } from "@/components/requests/request-status-badge";
import { LinkButton } from "@/components/shared/link-button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";

export default async function MyRequestsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const requests = await prisma.serviceRequest.findMany({
    where: { userId: session.user.id },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Requests</h1>
          <p className="text-muted-foreground">
            Track your service requests and quotes
          </p>
        </div>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="size-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No requests yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Submit a service request to get started. We offer configuration
              quotes, hardware buyback, and e-recycling services.
            </p>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="/configure" variant="default">
                <Plus className="size-4" />
                Configure &amp; Quote
              </LinkButton>
              <LinkButton href="/sell-hardware" variant="outline">
                <Plus className="size-4" />
                Sell Hardware
              </LinkButton>
              <LinkButton href="/e-recycle" variant="outline">
                <Plus className="size-4" />
                E-Waste Management
              </LinkButton>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request #</TableHead>
                  <TableHead>Type</TableHead>
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
                        href={`/my-requests/${request.id}`}
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
                      <Link
                        href={`/my-requests/${request.id}`}
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
