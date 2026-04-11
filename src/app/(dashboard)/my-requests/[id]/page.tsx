import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, formatDateTime } from "@/lib/format";
import { RequestStatusBadge } from "@/components/requests/request-status-badge";
import { RequestActions } from "@/components/requests/request-actions";
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
import {
  REQUEST_STATUS_LABELS,
  REQUEST_TYPE_LABELS,
} from "@/lib/constants";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  MessageSquare,
  CheckCircle2,
  Clock,
  CircleDot,
} from "lucide-react";

const STATUS_STEPS = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "QUOTED",
  "ACCEPTED",
  "COMPLETED",
] as const;

export default async function MyRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const { id } = await params;

  const request = await prisma.serviceRequest.findUnique({
    where: { id },
    include: {
      specs: { orderBy: { sortOrder: "asc" } },
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
    },
  });

  if (!request) {
    notFound();
  }

  if (request.userId !== session.user.id) {
    redirect("/my-requests");
  }

  const isTerminal = ["REJECTED", "EXPIRED", "COMPLETED"].includes(
    request.status
  );
  const currentStepIndex = STATUS_STEPS.indexOf(
    request.status as (typeof STATUS_STEPS)[number]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LinkButton href="/my-requests" variant="ghost" size="icon-sm">
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
        {/* Left column - Request Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Info Card */}
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

        {/* Right column - Status & Admin Response */}
        <div className="space-y-6">
          {/* Status Timeline Card */}
          <Card>
            <CardHeader>
              <CardTitle>Request Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isTerminal ? (
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                      <CircleDot className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {REQUEST_STATUS_LABELS[request.status] ??
                          request.status}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(request.updatedAt)}
                      </p>
                    </div>
                  </div>
                ) : (
                  STATUS_STEPS.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                      <div key={step} className="flex items-center gap-3">
                        <div
                          className={`flex size-8 items-center justify-center rounded-full ${
                            isCompleted
                              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : isCurrent
                                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="size-4" />
                          ) : isCurrent ? (
                            <Clock className="size-4" />
                          ) : (
                            <CircleDot className="size-4" />
                          )}
                        </div>
                        <div>
                          <p
                            className={`text-sm ${
                              isCurrent
                                ? "font-medium"
                                : isCompleted
                                  ? "text-muted-foreground"
                                  : "text-muted-foreground/60"
                            }`}
                          >
                            {REQUEST_STATUS_LABELS[step] ?? step}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Admin Response Card */}
          {(request.offeredPrice || request.adminNotes) && (
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="size-4" />
                  Admin Response
                </CardTitle>
                {request.reviewedAt && (
                  <CardDescription>
                    Reviewed on {formatDateTime(request.reviewedAt)}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {request.offeredPrice && (
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                    <DollarSign className="size-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Offered Price
                      </p>
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {formatPrice(request.offeredPrice.toNumber())}
                      </p>
                    </div>
                  </div>
                )}
                {request.adminNotes && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Notes
                    </h4>
                    <p className="text-sm whitespace-pre-wrap">
                      {request.adminNotes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Accept/Reject Actions */}
          {request.status === "QUOTED" && (
            <Card>
              <CardHeader>
                <CardTitle>Respond to Quote</CardTitle>
                <CardDescription>
                  Accept or reject the offered price
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RequestActions
                  requestId={request.id}
                  currentStatus={request.status}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
