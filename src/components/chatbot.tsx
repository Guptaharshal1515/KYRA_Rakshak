import { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, X, Send, Loader2, Sparkles, AlertTriangle, RotateCw, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = {
  role: "user" | "assistant";
  content: string;
  error?: { message: string; status?: number; detail?: string };
};

const SUGGESTIONS = [
  "What is KYRA?",
  "How does selective disclosure work?",
  "What is a DID?",
  "How is my data kept safe?",
];

type ConnState = "idle" | "online" | "offline" | "error";

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm KYRA's assistant. Ask me anything about how KYRA works — DIDs, verifiable credentials, selective disclosure, or the loan approval flow.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [conn, setConn] = useState<ConnState>("idle");
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  useEffect(() => {
    const on = () => setConn((c) => (c === "offline" ? "idle" : c));
    const off = () => setConn("offline");
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    if (typeof navigator !== "undefined" && !navigator.onLine) setConn("offline");
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const send = useCallback(
    async (text: string, opts?: { retry?: boolean }) => {
      const q = text.trim();
      if (!q || loading) return;

      setLastQuery(q);
      let base: Msg[];
      if (opts?.retry) {
        // Drop trailing assistant error(s) so we don't stack failures.
        base = msgs.slice();
        while (base.length && base[base.length - 1].role === "assistant" && base[base.length - 1].error) {
          base.pop();
        }
      } else {
        base = [...msgs, { role: "user" as const, content: q }];
        setInput("");
      }
      setMsgs(base);
      setLoading(true);

      // History sent to server: strip client-only error messages.
      const history = base
        .filter((m) => !m.error)
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        if (typeof navigator !== "undefined" && !navigator.onLine) {
          throw new Error("OFFLINE");
        }

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });

        if (!res.ok || !res.body) {
          const bodyText = await res.text().catch(() => "");
          const err = new Error(`HTTP ${res.status}`) as Error & { status?: number; detail?: string };
          err.status = res.status;
          err.detail = bodyText.slice(0, 300);
          throw err;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        setMsgs((m) => [...m, { role: "assistant", content: "" }]);
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMsgs((m) => {
            const copy = m.slice();
            copy[copy.length - 1] = { role: "assistant", content: acc };
            return copy;
          });
        }
        setConn("online");
      } catch (e) {
        const err = e as Error & { status?: number; detail?: string };
        console.error("[chatbot] request failed:", {
          message: err?.message,
          status: err?.status,
          detail: err?.detail,
        });

        const status = err?.status;
        let message: string;
        if (err?.message === "OFFLINE") {
          message = "You appear to be offline. Check your connection and retry.";
          setConn("offline");
        } else if (status === 429) {
          message = "Rate limit reached. Please wait a moment and retry.";
          setConn("error");
        } else if (status === 402) {
          message = "AI credits exhausted. Please add credits in workspace settings.";
          setConn("error");
        } else if (status === 500 || status === 502 || status === 503) {
          message = `The assistant service is unavailable (HTTP ${status}). Please retry.`;
          setConn("error");
        } else {
          message = "Couldn't reach the assistant. Check your connection and retry.";
          setConn("error");
        }

        setMsgs((m) => [
          ...m,
          {
            role: "assistant",
            content: message,
            error: {
              message,
              status,
              detail: err?.detail || err?.message,
            },
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, msgs],
  );

  const retry = useCallback(() => {
    if (!lastQuery || loading) return;
    void send(lastQuery, { retry: true });
  }, [lastQuery, loading, send]);

  const connBadge = () => {
    if (conn === "offline") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-semibold text-destructive-foreground">
          <WifiOff className="h-3 w-3" aria-hidden /> Offline
        </span>
      );
    }
    if (conn === "error") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-warn px-2 py-0.5 text-[10px] font-semibold text-warn-foreground">
          <AlertTriangle className="h-3 w-3" aria-hidden /> Connection issue
        </span>
      );
    }
    if (conn === "online") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
          <Wifi className="h-3 w-3" aria-hidden /> Online
        </span>
      );
    }
    return null;
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        )}
        aria-label={open ? "Close KYRA assistant" : "Open KYRA assistant"}
      >
        {open ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="KYRA Assistant"
          className="fixed bottom-24 right-6 z-50 flex h-[min(600px,80vh)] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-primary/40 bg-card text-card-foreground shadow-elegant shadow-black/20"
        >
          <div className="flex items-center gap-2 border-b border-primary/30 bg-primary px-4 py-3 text-primary-foreground">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-white/20">
              <Sparkles className="h-4 w-4" aria-hidden />
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="text-sm font-semibold">KYRA Assistant</div>
              <div className="text-[11px] text-primary-foreground/90">
                Ask about trust, identity &amp; records
              </div>
            </div>
            {connBadge()}
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => {
              if (m.error) {
                const isLast = i === msgs.length - 1;
                return (
                  <div key={i} className="flex justify-start">
                    <div className="w-full max-w-[92%] rounded-2xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-foreground">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden />
                        <div className="flex-1">
                          <div className="font-semibold text-destructive">Assistant unreachable</div>
                          <div className="mt-0.5 text-foreground">{m.content}</div>
                          {(m.error.status || m.error.detail) && (
                            <div className="mt-1 text-[11px] text-muted-foreground">
                              {m.error.status ? `Status ${m.error.status}` : null}
                              {m.error.status && m.error.detail ? " · " : ""}
                              {m.error.detail
                                ? m.error.detail.length > 120
                                  ? `${m.error.detail.slice(0, 120)}…`
                                  : m.error.detail
                                : null}
                            </div>
                          )}
                          {isLast && lastQuery && (
                            <button
                              onClick={retry}
                              disabled={loading}
                              className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-destructive px-2.5 py-1 text-xs font-medium text-destructive-foreground hover:opacity-90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                              {loading ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                              ) : (
                                <RotateCw className="h-3.5 w-3.5" aria-hidden />
                              )}
                              Retry
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground",
                    )}
                  >
                    {m.content || (loading && i === msgs.length - 1 ? "…" : "")}
                  </div>
                </div>
              );
            })}
            {msgs.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border bg-card p-3"
          >
            <label htmlFor="kyra-chat-input" className="sr-only">
              Ask KYRA
            </label>
            <input
              id="kyra-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about KYRA…"
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Send message"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Send className="h-4 w-4" aria-hidden />
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
