import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatDateTime } from "@/lib/format";
import { LeadActions } from "@/components/admin/lead-actions";
import { LinkButton } from "@/components/shared/link-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowLeft, User, Mail, Phone, Building2, Bot, MessageSquare } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  CONTACTED: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  QUALIFIED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  CONVERTED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  LOST: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

interface ChatMessage {
  role: "bot" | "user" | "assistant" | "system";
  content: string;
}

function parseChatTranscript(transcript: string): ChatMessage[] {
  try {
    const parsed = JSON.parse(transcript);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

export default async function AdminLeadDetailPage({
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

  const lead = await prisma.salesLead.findUnique({
    where: { id },
  });

  if (!lead) {
    notFound();
  }

  const messages = parseChatTranscript(lead.chatTranscript);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LinkButton href="/admin/leads" variant="ghost" size="icon-sm">
              <ArrowLeft className="size-4" />
            </LinkButton>
            <h1 className="text-2xl font-bold tracking-tight">{lead.name}</h1>
          </div>
          <div className="flex items-center gap-3 ml-9">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[lead.status] || "bg-gray-100 text-gray-800"}`}
            >
              {lead.status}
            </span>
            <span className="text-sm text-muted-foreground">
              Created {formatDate(lead.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="text-sm font-medium">{lead.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{lead.email}</p>
                  </div>
                </div>
                {lead.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{lead.phone}</p>
                    </div>
                  </div>
                )}
                {lead.company && (
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Company</p>
                      <p className="text-sm font-medium">{lead.company}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Requirement Card */}
          <Card>
            <CardHeader>
              <CardTitle>Requirement</CardTitle>
              <CardDescription>
                Source: {lead.source}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{lead.requirement}</p>
            </CardContent>
          </Card>

          {/* Chat Transcript Card */}
          {messages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Chat Transcript</CardTitle>
                <CardDescription>
                  Conversation from the AI chat widget
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {messages.map((message, index) => {
                    const isBot =
                      message.role === "bot" ||
                      message.role === "assistant" ||
                      message.role === "system";
                    return (
                      <div
                        key={index}
                        className={`flex ${isBot ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`flex max-w-[80%] gap-2 ${isBot ? "flex-row" : "flex-row-reverse"}`}
                        >
                          <div
                            className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
                              isBot
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {isBot ? (
                              <Bot className="size-4" />
                            ) : (
                              <MessageSquare className="size-4" />
                            )}
                          </div>
                          <div
                            className={`rounded-lg px-3 py-2 text-sm ${
                              isBot
                                ? "bg-muted text-foreground"
                                : "bg-primary text-primary-foreground"
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
                  Update lead status and manage assignment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LeadActions
                  leadId={lead.id}
                  currentStatus={lead.status}
                  currentNotes={lead.notes}
                  currentAssignedTo={lead.assignedTo}
                />
              </CardContent>
            </Card>

            {/* Metadata Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{formatDateTime(lead.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span>{formatDateTime(lead.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Source</span>
                  <span>{lead.source}</span>
                </div>
                {lead.assignedTo && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assigned To</span>
                    <span>{lead.assignedTo}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
