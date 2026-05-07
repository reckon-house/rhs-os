"use client";

/**
 * AIAgentDemo — interactive demo of a custom-trained AI customer-service agent.
 *
 * Visitor edits the business description (textarea), then asks the agent
 * questions in the chat input. Calls /api/agent-chat which streams Claude
 * responses back as text deltas. The agent is scoped to the business
 * description on every request — no fine-tuning, just a strong system
 * prompt with the description as context.
 *
 * Initial state seeds two sample messages so the demo communicates value
 * before the visitor types anything. When the visitor sends their first
 * real message, those seed messages are cleared so the conversation is
 * coherent.
 *
 * If ANTHROPIC_API_KEY isn't configured server-side, the API returns a
 * graceful "demo wiring up" message that we render inline like any other
 * agent reply.
 */

import { useState, useRef, useEffect } from "react";

const DEFAULT_BUSINESS = `I run a coffee shop in East Austin called Bell & Boon. Open 7am to 3pm Monday through Saturday, closed Sunday. We have a loyalty program. Buy nine drinks, get the tenth free, no app required, just give us your phone number. Sam is our head barista and runs custom drink experiments on Fridays.`;

const SEED_CONVO = [
  { role: "user" as const, content: "What time do you close today?" },
  {
    role: "assistant" as const,
    content:
      "We close at 3pm today. If you're coming by for a custom drink, Sam usually finishes the experimental menu around 2:30.",
  },
];

const SAMPLE_PROMPTS = [
  "Do I need an app for the loyalty thing?",
  "Are you open Sundays?",
  "What's on the experimental menu this week?",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIAgentDemo() {
  const [businessDescription, setBusinessDescription] = useState(DEFAULT_BUSINESS);
  const [messages, setMessages] = useState<Message[]>(SEED_CONVO);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the chat to the latest message.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  async function send(prompt: string) {
    const text = prompt.trim();
    if (!text || isStreaming) return;

    // First real interaction clears the seed conversation so the chat is coherent.
    const baseMessages = hasInteracted ? messages : [];
    const nextMessages: Message[] = [
      ...baseMessages,
      { role: "user", content: text },
    ];
    setMessages(nextMessages);
    setHasInteracted(true);
    setInput("");
    setIsStreaming(true);

    // Add a placeholder assistant message that streams in.
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessDescription,
          history: baseMessages,
          message: text,
        }),
      });

      if (!res.ok || !res.body) {
        const errText = await res.text();
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: errText || "Agent unavailable." };
          return copy;
        });
        setIsStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assembled = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assembled += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: assembled };
          return copy;
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: `Couldn't reach the agent (${msg}). Try again in a moment.` };
        return copy;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  function reset() {
    setMessages(SEED_CONVO);
    setHasInteracted(false);
    setInput("");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <div className="w-full bg-white rounded-[clamp(20px,3vw,40px)] overflow-hidden border border-foreground/10 shadow-[0_2px_24px_rgba(20,20,20,0.04)]">
      {/* Config panel — editable business description */}
      <div className="bg-[#141414] text-white p-5 md:p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-white/40 text-[10px] uppercase tracking-[0.12em] font-medium">
            Your Business
          </p>
          <span className="text-white/40 text-[10px]">
            {businessDescription.length} / 2000
          </span>
        </div>
        <textarea
          value={businessDescription}
          onChange={(e) => setBusinessDescription(e.target.value.slice(0, 2000))}
          rows={4}
          className="w-full bg-transparent text-[13px] md:text-[14px] leading-[1.5] text-white/90 resize-none focus:outline-none placeholder:text-white/30"
          placeholder="Describe your business. Hours, products, voice, anything customers might ask about."
        />
      </div>

      {/* Conversation */}
      <div className="p-5 md:p-6 space-y-4 min-h-[280px] max-h-[420px] overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-foreground/40 text-[13px] italic text-center py-12">
            Conversation cleared. Ask the agent something below.
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "assistant" ? "" : "flex-row-reverse"}`}
          >
            <div
              className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${
                msg.role === "assistant"
                  ? "bg-[#141414] text-white"
                  : "bg-foreground/10 text-foreground/70"
              }`}
            >
              {msg.role === "assistant" ? "B" : "Y"}
            </div>
            <div
              className={`rounded-2xl px-4 py-2.5 max-w-[78%] ${
                msg.role === "assistant"
                  ? "bg-foreground/[0.06] rounded-tl-sm"
                  : "bg-[#141414] text-white rounded-tr-sm"
              }`}
            >
              {msg.content ? (
                <p className="text-[13px] md:text-[14px] leading-[1.5] whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <span className="inline-flex gap-1 items-center py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-[pulse_1.4s_ease-in-out_infinite]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-[pulse_1.4s_ease-in-out_0.2s_infinite]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-[pulse_1.4s_ease-in-out_0.4s_infinite]" />
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Sample prompts — only show before the visitor's first interaction */}
      {!hasInteracted && (
        <div className="px-5 md:px-6 pb-3 flex flex-wrap gap-2">
          {SAMPLE_PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => send(p)}
              disabled={isStreaming}
              className="text-[11px] md:text-[12px] bg-foreground/[0.04] hover:bg-foreground/10 border border-foreground/10 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <form
        onSubmit={onSubmit}
        className="border-t border-foreground/10 p-4 flex gap-2 bg-foreground/[0.02]"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isStreaming}
          placeholder="Ask the agent anything…"
          className="flex-1 bg-white border border-foreground/10 rounded-full px-4 py-2 text-[13px] md:text-[14px] focus:outline-none focus:border-foreground/30 transition-colors disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isStreaming || !input.trim()}
          className="bg-[#141414] text-white rounded-full px-5 py-2 text-[13px] md:text-[14px] font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-foreground/80 transition-colors"
        >
          Send
        </button>
        {hasInteracted && (
          <button
            type="button"
            onClick={reset}
            disabled={isStreaming}
            className="text-foreground/50 hover:text-foreground/80 text-[12px] px-2 disabled:opacity-50"
            aria-label="Reset conversation"
          >
            Reset
          </button>
        )}
      </form>
    </div>
  );
}
