"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  }, [value, onSend]);

  return (
    <div className="flex items-center gap-2 border-t bg-background p-3">
      <Input
        placeholder="Type a message..."
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.value)
        }
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        disabled={disabled}
        className="flex-1 rounded-full border-muted-foreground/20 bg-muted/50 px-4 text-sm"
      />
      <Button
        size="icon"
        disabled={disabled || !value.trim()}
        onClick={handleSend}
        className="size-8 shrink-0 rounded-full bg-blue-600 hover:bg-blue-700"
      >
        <Send className="size-3.5" />
      </Button>
    </div>
  );
}
