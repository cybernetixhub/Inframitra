"use client";

import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/lib/chat-engine";
import { Server } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  message: ChatMessageType;
  onQuickReply?: (text: string) => void;
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function ChatMessageBubble({ message, onQuickReply }: ChatMessageProps) {
  const isBot = message.role === "bot";

  return (
    <div
      className={cn(
        "flex w-full gap-2",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {/* Bot avatar */}
      {isBot && (
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
          <Server className="size-3.5" />
        </div>
      )}

      <div className={cn("max-w-[80%] space-y-2")}>
        {/* Message bubble */}
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
            isBot
              ? "rounded-tl-sm bg-muted text-foreground"
              : "rounded-tr-sm bg-blue-600 text-white"
          )}
        >
          {message.content.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i < message.content.split("\n").length - 1 && <br />}
            </span>
          ))}
        </div>

        {/* Quick reply chips */}
        {isBot && message.quickReplies && message.quickReplies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {message.quickReplies.map((reply) => (
              <Button
                key={reply}
                variant="outline"
                size="xs"
                className="h-auto rounded-full px-3 py-1 text-xs font-normal"
                onClick={() => onQuickReply?.(reply)}
              >
                {reply}
              </Button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p
          className={cn(
            "text-[10px] text-muted-foreground",
            isBot ? "text-left" : "text-right"
          )}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
