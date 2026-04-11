"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getInitialState,
  processMessage,
  type ChatState,
} from "@/lib/chat-engine";
import { ChatMessageBubble } from "./chat-message";
import { ChatInput } from "./chat-input";

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatState, setChatState] = useState<ChatState>(getInitialState);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [chatState.messages, isTyping]);

  const handleSend = useCallback(
    (message: string) => {
      // Add user message immediately
      const { newState, shouldCreateLead } = processMessage(chatState, message);

      // Show only user message first, then simulate typing delay
      const userMsgOnly: ChatState = {
        ...chatState,
        messages: [
          ...chatState.messages,
          newState.messages[chatState.messages.length], // the user message
        ],
      };
      setChatState(userMsgOnly);
      setIsTyping(true);

      setTimeout(() => {
        setChatState(newState);
        setIsTyping(false);

        if (shouldCreateLead) {
          createLead(newState.collectedData);
        }
      }, 500);
    },
    [chatState]
  );

  const handleQuickReply = useCallback(
    (text: string) => {
      // Remove quick replies from the last bot message to prevent re-clicks
      const updatedMessages = chatState.messages.map((msg, idx) => {
        if (idx === chatState.messages.length - 1 && msg.role === "bot") {
          return { ...msg, quickReplies: undefined };
        }
        return msg;
      });
      const stateWithoutChips = { ...chatState, messages: updatedMessages };
      setChatState(stateWithoutChips);

      // Process as a normal message
      const { newState, shouldCreateLead } = processMessage(
        stateWithoutChips,
        text
      );

      // Add user message then bot response after delay
      const userMsg = newState.messages[stateWithoutChips.messages.length];
      const withUser: ChatState = {
        ...stateWithoutChips,
        messages: [...stateWithoutChips.messages, userMsg],
      };
      setChatState(withUser);
      setIsTyping(true);

      setTimeout(() => {
        setChatState(newState);
        setIsTyping(false);

        if (shouldCreateLead) {
          createLead(newState.collectedData);
        }
      }, 500);
    },
    [chatState]
  );

  return (
    <>
      {/* Floating action buttons */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <div className="flex flex-col items-end gap-3">
            {/* Phone Call */}
            <div className="group relative">
              <a
                href="tel:+919910668689"
                className="flex size-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
              >
                <Phone className="size-5" />
              </a>
              <span className="pointer-events-none absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs text-background opacity-0 shadow transition-opacity group-hover:opacity-100">
                Call: +91 99106 68689
              </span>
            </div>

            {/* WhatsApp */}
            <div className="group relative">
              <a
                href="https://wa.me/919910668689?text=Hi%20InfraMitra%2C%20I%20would%20like%20to%20enquire%20about%20IT%20hardware."
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:bg-[#1ebe57] hover:shadow-xl"
              >
                <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <span className="pointer-events-none absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs text-background opacity-0 shadow transition-opacity group-hover:opacity-100">
                WhatsApp us
              </span>
            </div>

            {/* Chat */}
            <div className="group relative">
              <span className="absolute inset-0 animate-ping rounded-full bg-blue-500/40" />
              <Button
                onClick={() => setIsOpen(true)}
                className="relative size-14 rounded-full bg-blue-600 shadow-lg hover:bg-blue-700 hover:shadow-xl"
                size="icon-lg"
              >
                <MessageCircle className="size-6" />
              </Button>
              <span className="pointer-events-none absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs text-background opacity-0 shadow transition-opacity group-hover:opacity-100">
                Chat with us
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Chat panel */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl transition-all duration-300 ease-in-out",
          // Mobile: full width with margins
          "max-sm:bottom-0 max-sm:right-0 max-sm:left-0 max-sm:top-auto max-sm:h-[85vh] max-sm:rounded-b-none max-sm:rounded-t-2xl",
          // Desktop sizing
          "sm:w-[380px] sm:max-h-[600px]",
          isOpen
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-full bg-white/20">
              <MessageCircle className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">
                InfraMitra Assistant
              </p>
              <p className="mt-0.5 text-[11px] leading-none text-blue-100">
                Online | Typically replies instantly
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <a
              href="tel:+919910668689"
              className="flex size-7 items-center justify-center rounded-full text-white hover:bg-white/20"
              title="Call us"
            >
              <Phone className="size-3.5" />
            </a>
            <a
              href="https://wa.me/919910668689?text=Hi%20InfraMitra%2C%20I%20would%20like%20to%20enquire%20about%20IT%20hardware."
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-7 items-center justify-center rounded-full text-white hover:bg-white/20"
              title="WhatsApp"
            >
              <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto p-4"
        >
          {chatState.messages.map((msg, idx) => (
            <ChatMessageBubble
              key={msg.id}
              message={msg}
              onQuickReply={
                idx === chatState.messages.length - 1 ? handleQuickReply : undefined
              }
            />
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                <MessageCircle className="size-3.5" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5">
                <div className="flex gap-1">
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Lead creation helper
// ---------------------------------------------------------------------------

async function createLead(data: Record<string, string>) {
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name || "Chat Lead",
        email: data.email || "",
        phone: data.phone === "skip" ? "" : (data.phone || ""),
        source: "chat_widget",
        flowSource: data.flowSource || "general",
        collectedData: data,
      }),
    });
    if (!res.ok) {
      console.error("Failed to create lead:", res.statusText);
    }
  } catch (err) {
    console.error("Lead creation error:", err);
    toast.error("Could not save your details. Please try again later.");
  }
}
