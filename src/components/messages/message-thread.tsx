"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Send, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface MessageThreadProps {
  conversation: {
    id: string;
    product: { id: string; title: string; slug: string } | null;
    messages: Message[];
  };
  currentUserId: string;
  otherUser: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export function MessageThread({
  conversation,
  currentUserId,
  otherUser,
}: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>(conversation.messages);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const content = newMessage.trim();
    if (!content) return;

    setSending(true);
    try {
      const res = await fetch(`/api/messages/${conversation.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }

      const message = await res.json();
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send message"
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b pb-4">
        <Link
          href="/messages"
          className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
        >
          <ArrowLeft className="size-4" />
        </Link>
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
        <div>
          <p className="text-sm font-medium">
            {otherUser.name || "Unknown User"}
          </p>
          {conversation.product && (
            <p className="text-xs text-muted-foreground">
              Re: {conversation.product.title}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isSelf = message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={cn(
                  "flex items-end gap-2",
                  isSelf ? "flex-row-reverse" : "flex-row"
                )}
              >
                {!isSelf && (
                  <Avatar size="sm">
                    {message.sender.image && (
                      <AvatarImage
                        src={message.sender.image}
                        alt={message.sender.name || "User"}
                      />
                    )}
                    <AvatarFallback>
                      {message.sender.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-2",
                    isSelf
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={cn(
                      "mt-1 text-xs",
                      isSelf
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  >
                    {new Date(message.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex items-center gap-2 border-t pt-4">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={sending || !newMessage.trim()}>
          {sending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
