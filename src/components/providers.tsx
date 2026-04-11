"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { AiChatWidget } from "@/components/chat/ai-chat-widget";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        {children}
        <Toaster position="top-right" richColors />
        <AiChatWidget />
      </ThemeProvider>
    </SessionProvider>
  );
}
