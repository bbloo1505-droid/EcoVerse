import { useCallback, useEffect, useRef, useState } from "react";
import { Send, Sparkles, Bot } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendChatMessage, type ChatMessage } from "@/lib/chatApi";
import { cn } from "@/lib/utils";

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Hi — I’m your **EcoVerse Assistant**. Ask me how to break into environmental roles (consulting, ecology, bush regen, climate, water, policy…), what steps might suit your background, or anything else about working in the environmental space in Australia/NZ. I’ll give practical ideas — always double-check official course and job links yourself.",
};

export default function Assistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const onSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: ChatMessage = { role: "user", content: text };
    setInput("");
    const historyForApi = [...messages, userMsg].filter((m) => m.content.trim());
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    try {
      const { message } = await sendChatMessage(historyForApi);
      setMessages((prev) => [...prev, { role: "assistant", content: message }]);
    } catch (e) {
      const detail = e instanceof Error ? e.message : "Could not reach the assistant.";
      toast.error(detail);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: detail,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  return (
    <div className="container-app flex flex-col py-6 sm:py-10 min-h-[calc(100dvh-8rem)] max-w-3xl mx-auto">
      <header className="mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold">Career assistant</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Ask about pathways, skills, and environmental careers — powered by AI.
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-[280px] flex flex-col rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
        <ScrollArea className="flex-1 p-4 sm:p-5 h-[min(52vh,480px)]">
          <ul className="space-y-4 pr-2">
            {messages.map((m, i) => (
              <li
                key={i}
                className={cn(
                  "flex gap-3",
                  m.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    m.role === "user"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-primary-soft text-primary",
                  )}
                  aria-hidden
                >
                  {m.role === "user" ? "You" : <Bot className="h-4 w-4" />}
                </span>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[min(100%,34rem)]",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-md"
                      : "bg-surface-alt text-foreground border border-border rounded-tl-md",
                  )}
                >
                  <MessageBody text={m.content} isUser={m.role === "user"} />
                </div>
              </li>
            ))}
            {loading && (
              <li className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <Bot className="h-4 w-4 animate-pulse" />
                </span>
                <div className="rounded-2xl rounded-tl-md border border-border bg-surface-alt px-4 py-3 text-sm text-muted-foreground">
                  Thinking…
                </div>
              </li>
            )}
            <div ref={bottomRef} />
          </ul>
        </ScrollArea>

        <div className="border-t border-border p-3 sm:p-4 bg-surface-alt/50">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. I’m a chemistry graduate — how could I get into contaminated land consulting?"
              className="min-h-[88px] resize-none rounded-xl border-border bg-surface sm:flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              disabled={loading}
            />
            <Button
              type="button"
              size="lg"
              className="shrink-0 gap-2 sm:h-[88px] sm:px-8"
              onClick={onSend}
              disabled={loading || !input.trim()}
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground text-center sm:text-left">
            AI can be wrong — verify important facts. Not professional, legal, or migration advice.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Renders markdown-lite **bold** and newlines for assistant replies */
function MessageBody({ text, isUser }: { text: string; isUser: boolean }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <div className={cn("whitespace-pre-wrap break-words", isUser && "[&_strong]:text-primary-foreground")}>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </div>
  );
}
