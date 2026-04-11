import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, formatDateTime } from "@/lib/format";
import { RequestStatusBadge } from "@/components/requests/request-status-badge";
import { AdminRequestForm } from "@/components/requests/admin-request-form";
import { LinkButton } from "@/components/shared/link-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { REQUEST_TYPE_LABELS } from "@/lib/constants";
import { ArrowLeft, User, Mail, Phone, Building2 } from "lucide-react";

export default async function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const { id } = await params;

  const request = await prisma.serviceRequest.findUnique({
    where: { id },
    include: {
      specs: { orderBy: { sortOrder: "asc" } },
      images: { orderBy: { sortOrder: "asc" } },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          company: true,
        },
      },
      category: true,
    },
  });

  if (!request) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LinkButton href="/admin/requests" variant="ghost" size="icon-sm">
              <ArrowLeft className="size-4" />
            </LinkButton>
            <h1 className="text-2xl font-bold tracking-tight">
              {request.requestNumber}
            </h1>
          </div>
          <div className="flex items-center gap-3 ml-9">
            <RequestStatusBadge
              status={request.status}
              type={request.type}
            />
            <span className="text-sm text-muted-foreground">
              Submitted {formatDate(request.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="text-sm font-medium">{request.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{request.email}</p>
                  </div>
                </div>
                {request.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{request.phone}</p>
                    </div>
                  </div>
                )}
                {request.company && (
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Company</p>
                      <p className="text-sm font-medium">{request.company}</p>
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Account</p>
                  <p className="text-sm font-medium">
                    {request.user.name || "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {request.user.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>{request.title}</CardTitle>
              <CardDescription>
                {REQUEST_TYPE_LABELS[request.type] ?? request.type} Request
                {request.category && ` - ${request.category.name}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Description
                </h4>
                <p className="text-sm whitespace-pre-wrap">
                  {request.description}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {request.quantity > 1 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Quantity
                    </h4>
                    <p className="text-sm">{request.quantity}</p>
                  </div>
                )}
                {request.brandName && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Brand
                    </h4>
                    <p className="text-sm">{request.brandName}</p>
                  </div>
                )}
                {request.condition && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Condition
                    </h4>
                    <p className="text-sm">{request.condition}</p>
                  </div>
                )}
                {request.age && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Age
                    </h4>
                    <p className="text-sm">{request.age}</p>
                  </div>
                )}
                {request.budgetRange && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Budget Range
                    </h4>
                    <p className="text-sm">{request.budgetRange}</p>
                  </div>
                )}
                {request.preferredCondition && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Preferred Condition
                    </h4>
                    <p className="text-sm">{request.preferredCondition}</p>
                  </div>
                )}
                {request.timeline && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Timeline
                    </h4>
                    <p className="text-sm">{request.timeline}</p>
                  </div>
                )}
                {request.expectedPrice && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Expected Price
                    </h4>
                    <p className="text-sm">
                      {formatPrice(request.expectedPrice.toNumber())}
                    </p>
                  </div>
                )}
                {request.hasInvoice !== null && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Has Invoice
                    </h4>
                    <p className="text-sm">
                      {request.hasInvoice ? "Yes" : "No"}
                    </p>
                  </div>
                )}
                {request.warrantyStatus && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Warranty Status
                    </h4>
                    <p className="text-sm">{request.warrantyStatus}</p>
                  </div>
                )}
                {request.approxWeight && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Approximate Weight
                    </h4>
                    <p className="text-sm">{request.approxWeight}</p>
                  </div>
                )}
                {request.dataDestruction !== null && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Data Destruction Required
                    </h4>
                    <p className="text-sm">
                      {request.dataDestruction ? "Yes" : "No"}
                    </p>
                  </div>
                )}
              </div>

              {request.reasonForSelling && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Reason for Selling
                  </h4>
                  <p className="text-sm whitespace-pre-wrap">
                    {request.reasonForSelling}
                  </p>
                </div>
              )}

              {/* Pickup Info */}
              {request.pickupAddress && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Pickup Address
                  </h4>
                  <p className="text-sm">
                    {request.pickupAddress}
                    {request.pickupCity && `, ${request.pickupCity}`}
                    {request.pickupState && `, ${request.pickupState}`}
                    {request.pickupZip && ` ${request.pickupZip}`}
                    {request.pickupCountry && `, ${request.pickupCountry}`}
                  </p>
                  {request.pickupDate && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Preferred pickup: {request.pickupDate}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Specs Table */}
          {request.specs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Specification</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {request.specs.map((spec) => (
                      <TableRow key={spec.id}>
                        <TableCell className="font-medium">
                          {spec.label}
                        </TableCell>
                        <TableCell>{spec.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Photos */}
          {request.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                  {request.images.map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-square rounded-lg overflow-hidden border"
                    >
                      <Image
                        src={image.url}
                        alt={image.alt || "Request photo"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column - Admin Actions (sticky) */}
        <div className="space-y-6">
          <div className="lg:sticky lg:top-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
                <CardDescription>
                  Update the status and respond to this request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminRequestForm
                  requestId={request.id}
                  currentStatus={request.status}
                  currentPrice={
                    request.offeredPrice
                      ? request.offeredPrice.toNumber()
                      : null
                  }
                  currentNotes={request.adminNotes}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
