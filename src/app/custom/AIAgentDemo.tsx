"use client";

/**
 * AIAgentDemo — Phase 1 placeholder.
 *
 * Static mockup of a custom-trained AI agent: a "Your Business" config
 * panel showing what the agent was told, then a sample conversation.
 *
 * Phase 2 swap: replace the readonly textarea with a real input, wire the
 * chat to /api/agent-chat (server-side Claude call following the same
 * pattern as /api/apple-music/developer-token), stream responses.
 */

const SAMPLE_BUSINESS = `I run a coffee shop in East Austin called Bell & Boon. Open 7am to 3pm Monday through Saturday, closed Sunday. We have a loyalty program — buy nine drinks, get the tenth free, no app required, just give us your phone number. Sam is our head barista and runs custom drink experiments on Fridays.`;

const SAMPLE_CONVO: { role: "user" | "agent"; text: string }[] = [
  { role: "user", text: "What time do you close today?" },
  { role: "agent", text: "We close at 3pm today. If you're coming by for a custom drink, Sam usually finishes the experimental menu around 2:30." },
  { role: "user", text: "Do I need an app for the loyalty thing?" },
  { role: "agent", text: "No app. Just give us your phone number at the counter. Buy nine drinks, the tenth is free." },
  { role: "user", text: "Are you open Sundays?" },
  { role: "agent", text: "Closed Sundays. Monday through Saturday, 7am to 3pm." },
];

export function AIAgentDemo() {
  return (
    <div className="w-full bg-white rounded-[clamp(20px,3vw,40px)] overflow-hidden border border-foreground/10 shadow-[0_2px_24px_rgba(20,20,20,0.04)]">
      {/* Config panel — what the agent was told */}
      <div className="bg-[#141414] text-white p-5 md:p-6">
        <p className="text-white/40 text-[10px] uppercase tracking-[0.12em] mb-2 font-medium">
          Your Business
        </p>
        <p className="text-[13px] md:text-[14px] leading-[1.5] text-white/90">
          {SAMPLE_BUSINESS}
        </p>
      </div>

      {/* Conversation */}
      <div className="p-5 md:p-6 space-y-4 min-h-[280px]">
        {SAMPLE_CONVO.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "agent" ? "" : "flex-row-reverse"}`}
          >
            <div
              className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${
                msg.role === "agent"
                  ? "bg-[#141414] text-white"
                  : "bg-foreground/10 text-foreground/70"
              }`}
            >
              {msg.role === "agent" ? "B" : "Y"}
            </div>
            <div
              className={`rounded-2xl px-4 py-2.5 max-w-[78%] ${
                msg.role === "agent"
                  ? "bg-foreground/[0.06] rounded-tl-sm"
                  : "bg-[#141414] text-white rounded-tr-sm"
              }`}
            >
              <p className="text-[13px] md:text-[14px] leading-[1.5]">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input row — disabled in placeholder */}
      <div className="border-t border-foreground/10 p-4 flex gap-2 bg-foreground/[0.02]">
        <input
          disabled
          placeholder="Ask the agent anything about Bell & Boon…"
          className="flex-1 bg-white border border-foreground/10 rounded-full px-4 py-2 text-[13px] md:text-[14px] disabled:opacity-60 disabled:cursor-not-allowed"
        />
        <button
          disabled
          className="bg-[#141414] text-white rounded-full px-5 py-2 text-[13px] md:text-[14px] font-medium disabled:opacity-60"
        >
          Send
        </button>
      </div>
    </div>
  );
}
