"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

interface ConversationListProps {
  conversations: Array<{
    id: string;
    buyer: { id: string; name: string | null; image: string | null };
    seller: { id: string; name: string | null; image: string | null };
    product: { id: string; title: string; slug: string } | null;
    messages: Array<{
      id: string;
      content: string;
      senderId: string;
      read: boolean;
      createdAt: string;
    }>;
    unreadCount: number;
    updatedAt: string;
  }>;
  currentUserId: string;
}

export function ConversationList({
  conversations,
  currentUserId,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
        <MessageSquare className="mb-4 size-12 text-muted-foreground" />
        <h3 className="text-lg font-medium">No messages yet</h3>
        <p className="text-sm text-muted-foreground">
          Start a conversation by messaging a seller on a product page.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y rounded-lg border">
      {conversations.map((conv) => {
        const otherUser =
          conv.buyer.id === currentUserId ? conv.seller : conv.buyer;
        const lastMessage = conv.messages[0];
        const hasUnread = conv.unreadCount > 0;

        return (
          <Link
            key={conv.id}
            href={`/messages/${conv.id}`}
            className={cn(
              "flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50",
              hasUnread && "bg-primary/5"
            )}
          >
            <Avatar>
              {otherUser.image && (
                <AvatarImage
                  src={otherUser.image}
                  alt={otherUser.name || "User"}
                />
              )}
              <AvatarFallback>
                {otherUser.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "text-sm",
                    hasUnread ? "font-semibold" : "font-medium"
                  )}
                >
                  {otherUser.name || "Unknown User"}
                </span>
                {lastMessage && (
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(lastMessage.createdAt)}
                  </span>
                )}
              </div>
              {conv.product && (
                <p className="truncate text-xs text-primary">
                  Re: {conv.product.title}
                </p>
              )}
              {lastMessage && (
                <p
                  className={cn(
                    "truncate text-sm",
                    hasUnread
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {lastMessage.senderId === currentUserId ? "You: " : ""}
                  {lastMessage.content}
                </p>
              )}
            </div>

            {hasUnread && (
              <Badge variant="default" className="shrink-0">
                {conv.unreadCount}
              </Badge>
            )}
          </Link>
        );
      })}
    </div>
  );
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
