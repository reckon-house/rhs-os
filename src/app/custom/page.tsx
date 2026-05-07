import Link from "next/link";
import { ScrambleOnView } from "@/components/fx/ScrambleText";
import { AIAgentDemo } from "./AIAgentDemo";
import { BookingDemo } from "./BookingDemo";
import { CRMDemo } from "./CRMDemo";

/**
 * /custom — landing page for custom-built business software.
 *
 * Audience: small / local business owners frustrated with off-the-shelf
 * SaaS, considering an agency, or duct-taping no-code tools together.
 *
 * Page mirrors the case-study design system (max-w-1400, breadcrumb pill,
 * SECTION 0X labels, cream inset blocks). Three live demo sections sit
 * inline as the proof — visitors don't have to click through to see the
 * product, they scroll past it.
 *
 * Phase 1 (this commit): page shell + static demo mockups that visually
 * communicate what each tool does.
 * Phase 2: wire AIAgentDemo to /api/agent-chat (server-side Claude call),
 * make BookingDemo rules editable with live calendar recompute, and
 * make CRMDemo industry tabs swap schemas + persist rows to localStorage.
 *
 * TODO when API key lands: drop ANTHROPIC_API_KEY into Vercel env and
 * scaffold /api/agent-chat following the apple-music dev-token pattern.
 */

export default function CustomPage() {
  return (
    <div className="relative w-full max-w-[1400px] mx-auto min-h-full px-[10px] pt-[10px] md:px-0 md:pt-0">
      {/* Breadcrumb — matches every other page */}
      <div className="fixed top-[10px] left-[10px] right-14 z-40 md:top-[20px] md:left-[50px] md:right-[50px]">
        <div className="flex items-center justify-between gap-4">
          <nav className="text-[10px] md:text-[12px] leading-[1] tracking-normal text-[#141414] truncate min-w-0">
            <Link href="/" className="hover:opacity-70 transition-opacity">House</Link>
            <span className="mx-1 md:mx-2 text-[#141414]/40">/</span>
            <span className="font-bold">Custom</span>
          </nav>
          <span className="hidden md:inline text-[12px] leading-[1] tracking-normal text-[#141414] shrink-0">
            House OS. Beta.
          </span>
        </div>
      </div>

      {/* Spacer for fixed breadcrumb */}
      <div className="h-[20px] md:h-[50px]" />

      <div className="pb-24 space-y-10 md:space-y-[100px]">
        {/* ═══════════════════════════════════════════════════════════════
            SECTION 01 · OVERVIEW
            ═══════════════════════════════════════════════════════════════ */}
        <section className="w-full pt-4 md:pt-12 pb-4 md:pb-8 px-4 md:px-0">
          <span className="inline-block text-[11px] md:text-[13px] tracking-[0.06em] uppercase text-[#141414] font-medium px-4 py-2 rounded-full bg-[#141414]/[0.06] mb-5">
            <ScrambleOnView text="SECTION 01: OVERVIEW" />
          </span>
          <h1 className="text-[22px] md:text-[24px] leading-[1.5] tracking-[-0.02em] font-bold">
            Software shaped to your business.
          </h1>
          <p className="text-[22px] md:text-[24px] font-normal leading-[1.5] tracking-[-0.02em] text-[#141414] mb-4">
            Off-the-shelf SaaS forces your business into someone else's design. Square decided what a restaurant looks like. Calendly decided how booking works. Most of the time, your actual business doesn't quite fit. You adapt. Pay monthly fees forever. Tell customers &ldquo;sorry, the system can't do that.&rdquo;
          </p>
          <p className="text-[14px] md:text-[16px] leading-[1.6] text-foreground/70 mb-6">
            Or you build the tool that actually fits. AI changed the math on what that costs. What used to be a six-month custom build is a one-week sprint. What used to need an enterprise contract starts at the price of a year of SaaS. When something needs to change, the change happens in hours, not a roadmap meeting.
          </p>

          {/* Meta fields — mirrors the homepage manifesto pattern */}
          <div className="text-spec text-foreground/90">
            <p>
              <span className="font-bold">Field: </span>
              Custom Software
            </p>
            <p>
              <span className="font-bold">Author: </span>
              Jeremy Prasatik
              {" | Active since: "}
              2026
              {" | Status: "}
              Open for projects
            </p>
            <p>
              <span className="font-bold">Classification: </span>
              AI Agents | Booking | CRM | Internal Tools
            </p>
            <p>
              <span className="font-bold">Connect: </span>
              <a
                href="mailto:hello@reckon.house"
                className="underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                hello@reckon.house
              </a>
              {" | 214.697.4578"}
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 02 · WHAT THIS REPLACES
            ═══════════════════════════════════════════════════════════════ */}
        <section className="w-full px-4 md:px-0">
          <div className="max-w-[1100px] mx-auto overflow-hidden px-6 py-10 md:px-16 md:py-16" style={{ backgroundColor: "#ECE6E1", borderRadius: "clamp(30px, 5vw, 75px)" }}>
            <div className="md:px-[calc(100%/24)] mb-10 md:mb-14">
              <span className="inline-block text-[11px] md:text-[13px] tracking-[0.06em] uppercase text-[#141414] font-medium px-4 py-2 rounded-full bg-[#141414]/[0.06] mb-5">
                <ScrambleOnView text="SECTION 02: WHAT THIS REPLACES" />
              </span>
              <h2 className="text-[22px] md:text-[24px] leading-[1.5] tracking-[-0.02em] font-bold mb-2">
                Three ways most small businesses solve this. All three have a tradeoff that gets worse over time.
              </h2>
              <p className="text-[14px] md:text-[16px] leading-[1.6] text-foreground/70">
                Every business owner has tried at least one. Most have tried all three. Here's where each one breaks.
              </p>
            </div>

            {/* Desktop columns */}
            <div className="hidden md:block space-y-10 md:px-[calc(100%/24)]">
              {[
                {
                  title: "Off-the-shelf SaaS",
                  body: "You pay forever for software that almost fits. The fees compound. The customizations stop where the platform's API ends. Your data is locked in their format. Year five of paying $200/month for Toast is $12,000 you'll never see again, and you still can't do the thing you wished it could do on day one.",
                },
                {
                  title: "Hiring an agency",
                  body: "$50K and four months later, you have a tool. Then you need a small change. The freelancer is on another project. The agency wants a new statement of work. The thing you owned starts feeling like something you're renting from your developer.",
                },
                {
                  title: "DIY with no-code",
                  body: "Notion, Airtable, Zapier, a dozen integrations duct-taped together. Works for a while. Then your team hits the ceiling: a workflow no-code can't quite handle, a customer-facing experience that looks like a Google Form, an automation that breaks every other Tuesday. The thing you built isn't a tool. It's a job.",
                },
              ].map((col) => (
                <div key={col.title} className="grid grid-cols-12 gap-x-5">
                  <h3 className="col-span-3 text-[11px] md:text-[14px] font-bold leading-[1.875] pt-[3px]">
                    {col.title}
                  </h3>
                  <p className="col-start-7 col-span-6 text-[11px] md:text-[14px] leading-[1.875] text-current/80">
                    {col.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Mobile columns */}
            <div className="md:hidden space-y-6">
              {[
                {
                  title: "Off-the-shelf SaaS",
                  body: "You pay forever for software that almost fits. The fees compound. The customizations stop where the platform's API ends. Year five of paying $200/month for Toast is $12,000 you'll never see again, and you still can't do the thing you wished it could do on day one.",
                },
                {
                  title: "Hiring an agency",
                  body: "$50K and four months later, you have a tool. Then you need a small change. The freelancer is on another project. The agency wants a new statement of work. The thing you owned starts feeling like something you're renting from your developer.",
                },
                {
                  title: "DIY with no-code",
                  body: "Notion, Airtable, Zapier, a dozen integrations duct-taped together. Works for a while. Then your team hits the ceiling: a workflow no-code can't quite handle, a customer-facing experience that looks like a Google Form, an automation that breaks every other Tuesday. The thing you built isn't a tool. It's a job.",
                },
              ].map((col) => (
                <div key={col.title}>
                  <h3 className="text-[11px] font-bold leading-[1.875] mb-1">{col.title}</h3>
                  <p className="text-[11px] leading-[1.875] text-current/80">
                    {col.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 03 · DEMO 01 — AI AGENT
            ═══════════════════════════════════════════════════════════════ */}
        <section className="w-full px-4 md:px-0">
          <div className="md:px-[calc(100%/24)]">
            <div className="mb-6 md:mb-10">
              <span className="inline-block text-[11px] md:text-[13px] tracking-[0.06em] uppercase text-[#141414] font-medium px-4 py-2 rounded-full bg-[#141414]/[0.06] mb-5">
                <ScrambleOnView text="SECTION 03: DEMO 01" />
              </span>
              <h2 className="text-[22px] md:text-[24px] leading-[1.5] tracking-[-0.02em] font-bold mb-2">
                AI customer service that knows your business.
              </h2>
              <p className="text-[14px] md:text-[16px] leading-[1.6] text-foreground/70">
                Off-the-shelf chatbots are trained on the internet. Yours should be trained on your business: hours, menu, policies, voice. Below is what that looks like for a coffee shop in East Austin. Your version answers in your tone, about your operation.
              </p>
            </div>
            <AIAgentDemo />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 04 · DEMO 02 — BOOKING
            ═══════════════════════════════════════════════════════════════ */}
        <section className="w-full px-4 md:px-0">
          <div className="md:px-[calc(100%/24)]">
            <div className="mb-6 md:mb-10">
              <span className="inline-block text-[11px] md:text-[13px] tracking-[0.06em] uppercase text-[#141414] font-medium px-4 py-2 rounded-full bg-[#141414]/[0.06] mb-5">
                <ScrambleOnView text="SECTION 04: DEMO 02" />
              </span>
              <h2 className="text-[22px] md:text-[24px] leading-[1.5] tracking-[-0.02em] font-bold mb-2">
                Booking that works the way you actually book.
              </h2>
              <p className="text-[14px] md:text-[16px] leading-[1.6] text-foreground/70">
                Calendly assumes everyone books the same way. Real businesses don't. Set the rules: staff schedules, service types, lunch breaks, blackout days. The booker rebuilds itself in real time. The version below is configured for a hair salon working four days a week.
              </p>
            </div>
            <BookingDemo />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 05 · DEMO 03 — CRM
            ═══════════════════════════════════════════════════════════════ */}
        <section className="w-full px-4 md:px-0">
          <div className="md:px-[calc(100%/24)]">
            <div className="mb-6 md:mb-10">
              <span className="inline-block text-[11px] md:text-[13px] tracking-[0.06em] uppercase text-[#141414] font-medium px-4 py-2 rounded-full bg-[#141414]/[0.06] mb-5">
                <ScrambleOnView text="SECTION 05: DEMO 03" />
              </span>
              <h2 className="text-[22px] md:text-[24px] leading-[1.5] tracking-[-0.02em] font-bold mb-2">
                A customer list that fits your industry.
              </h2>
              <p className="text-[14px] md:text-[16px] leading-[1.6] text-foreground/70">
                A restaurant CRM is not a salon CRM is not a contractor CRM. The fields are different. The workflows are different. Pick the industry and the template configures itself. Below: a restaurant set up with allergies, favorite dishes, and visit history baked into the schema.
              </p>
            </div>
            <CRMDemo />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 06 · PROCESS
            ═══════════════════════════════════════════════════════════════ */}
        <section className="w-full px-4 md:px-0">
          <div className="max-w-[1100px] mx-auto overflow-hidden px-6 py-10 md:px-16 md:py-16" style={{ backgroundColor: "#ECE6E1", borderRadius: "clamp(30px, 5vw, 75px)" }}>
            <div className="md:px-[calc(100%/24)] mb-10 md:mb-14">
              <span className="inline-block text-[11px] md:text-[13px] tracking-[0.06em] uppercase text-[#141414] font-medium px-4 py-2 rounded-full bg-[#141414]/[0.06] mb-5">
                <ScrambleOnView text="SECTION 06: PROCESS" />
              </span>
              <h2 className="text-[22px] md:text-[24px] leading-[1.5] tracking-[-0.02em] font-bold mb-2">
                Day one to deployed in two weeks.
              </h2>
              <p className="text-[14px] md:text-[16px] leading-[1.6] text-foreground/70">
                Most engagements run a two-week shape. Some are faster. Some need three. Here's the typical arc.
              </p>
            </div>

            {/* Desktop columns */}
            <div className="hidden md:block space-y-10 md:px-[calc(100%/24)]">
              {[
                {
                  title: "Days 1–2 · Conversation",
                  body: "Two-hour kickoff call. We talk through the actual workflow, not abstractions. What does the day look like? Where does software get in the way? What do you wish the current tools did? I take notes, you correct them. By the end of the second day there's a written scope you've signed off on.",
                },
                {
                  title: "Days 3–7 · Build",
                  body: "I build. You review at end of day three with a working prototype, not mockups. Real data flows through it. We iterate on real edges. By day seven the core flows work end-to-end and the thing is hosted somewhere you can poke at it from your phone.",
                },
                {
                  title: "Days 8–14 · Refine and ship",
                  body: "You use it on real work for a week. Edge cases surface. We patch them. By day fourteen the tool is in production with your team using it daily. The relationship doesn't end here. Changes after launch are part of the ongoing arrangement.",
                },
              ].map((col) => (
                <div key={col.title} className="grid grid-cols-12 gap-x-5">
                  <h3 className="col-span-3 text-[11px] md:text-[14px] font-bold leading-[1.875] pt-[3px]">
                    {col.title}
                  </h3>
                  <p className="col-start-7 col-span-6 text-[11px] md:text-[14px] leading-[1.875] text-current/80">
                    {col.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Mobile columns */}
            <div className="md:hidden space-y-6">
              {[
                {
                  title: "Days 1–2 · Conversation",
                  body: "Two-hour kickoff call. We talk through the actual workflow, not abstractions. What does the day look like? Where does software get in the way? I take notes, you correct them. By end of day two there's a scope you've signed off on.",
                },
                {
                  title: "Days 3–7 · Build",
                  body: "I build. You review at end of day three with a working prototype, not mockups. Real data flows through it. By day seven the core flows work end-to-end and you can poke at it from your phone.",
                },
                {
                  title: "Days 8–14 · Refine and ship",
                  body: "You use it on real work for a week. Edge cases surface. We patch them. By day fourteen the tool is in production. Changes after launch are part of the ongoing arrangement.",
                },
              ].map((col) => (
                <div key={col.title}>
                  <h3 className="text-[11px] font-bold leading-[1.875] mb-1">{col.title}</h3>
                  <p className="text-[11px] leading-[1.875] text-current/80">
                    {col.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 07 · PRICING
            ═══════════════════════════════════════════════════════════════
            TODO: tune the numbers below. Current placeholders are
            educated guesses based on the small-biz market. Swap to real
            pricing before sharing this link widely. */}
        <section className="w-full px-4 md:px-0">
          <div className="md:px-[calc(100%/24)] mb-8 md:mb-10">
            <span className="inline-block text-[11px] md:text-[13px] tracking-[0.06em] uppercase text-[#141414] font-medium px-4 py-2 rounded-full bg-[#141414]/[0.06] mb-5">
              <ScrambleOnView text="SECTION 07: PRICING" />
            </span>
            <h2 className="text-[22px] md:text-[24px] leading-[1.5] tracking-[-0.02em] font-bold mb-2">
              Three tiers. No surprises.
            </h2>
            <p className="text-[14px] md:text-[16px] leading-[1.6] text-foreground/70">
              Small business pricing for small businesses. Build, deployment, hosting, and ongoing changes are bundled. No hourly billing. No per-seat fees on top.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 md:px-[calc(100%/24)]">
            {[
              {
                name: "Starter",
                price: "From $5,000",
                cadence: "one-time",
                fit: "One tool. AI agent, booking widget, or small CRM.",
                includes: [
                  "One core tool, branded and deployed",
                  "Hosted on your domain",
                  "One round of changes per month",
                  "1–2 week build",
                ],
              },
              {
                name: "Standard",
                price: "From $15,000",
                cadence: "one-time",
                fit: "A connected suite. Three tools that share data and login.",
                includes: [
                  "Three integrated tools",
                  "Single sign-on across them",
                  "Changes bundled in for six months",
                  "3–4 week build",
                ],
                featured: true,
              },
              {
                name: "Unlimited",
                price: "$2,500",
                cadence: "per month",
                fit: "An ongoing relationship. Whatever your business needs, built and maintained.",
                includes: [
                  "Unlimited tools, unlimited changes",
                  "Priority response on requests",
                  "Tools evolve as the business does",
                  "Always shipping",
                ],
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`p-6 md:p-8 rounded-[clamp(20px,3vw,40px)] flex flex-col ${
                  tier.featured
                    ? "bg-[#141414] text-white"
                    : "bg-[#ECE6E1] text-[#141414]"
                }`}
              >
                <div className="mb-6">
                  <p className={`text-[10px] uppercase tracking-[0.12em] mb-2 font-medium ${tier.featured ? "text-white/50" : "text-foreground/50"}`}>
                    {tier.name}
                  </p>
                  <p className="text-[28px] md:text-[32px] font-bold leading-none">
                    {tier.price}
                  </p>
                  <p className={`text-[11px] mt-1 ${tier.featured ? "text-white/60" : "text-foreground/60"}`}>
                    {tier.cadence}
                  </p>
                </div>
                <p className={`text-[13px] md:text-[14px] leading-[1.5] mb-5 ${tier.featured ? "text-white/80" : "text-foreground/70"}`}>
                  {tier.fit}
                </p>
                <ul className={`space-y-2 text-[12px] md:text-[13px] leading-[1.5] ${tier.featured ? "text-white/90" : "text-foreground/80"} flex-1`}>
                  {tier.includes.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className={`shrink-0 ${tier.featured ? "text-white/50" : "text-foreground/40"}`}>—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-[11px] md:text-[12px] text-foreground/50 mt-6 md:mt-8 md:px-[calc(100%/24)] italic">
            Every project is scoped against actual workflow. Final pricing depends on what gets built. The numbers above are typical starting points.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 08 · CONTACT
            ═══════════════════════════════════════════════════════════════ */}
        <section className="w-full px-4 md:px-0">
          <div className="max-w-[1100px] mx-auto overflow-hidden px-6 py-10 md:px-16 md:py-20" style={{ backgroundColor: "#ECE6E1", borderRadius: "clamp(30px, 5vw, 75px)" }}>
            <div className="md:px-[calc(100%/24)]">
              <span className="inline-block text-[11px] md:text-[13px] tracking-[0.06em] uppercase text-[#141414] font-medium px-4 py-2 rounded-full bg-[#141414]/[0.06] mb-5">
                <ScrambleOnView text="SECTION 08: LET'S TALK" />
              </span>
              <h2 className="text-[22px] md:text-[24px] leading-[1.5] tracking-[-0.02em] font-bold mb-2">
                Tell me about your business.
              </h2>
              <p className="text-[22px] md:text-[24px] font-normal leading-[1.5] tracking-[-0.02em] text-[#141414] mb-4">
                If any of this resonated, the next step is a thirty-minute conversation. No pitch deck. No sales call. Just talking through what you're working with and whether there's a fit.
              </p>
              <div className="text-spec text-foreground/90 mt-8">
                <p>
                  <span className="font-bold">Email: </span>
                  <a
                    href="mailto:hello@reckon.house?subject=Custom%20software%20question"
                    className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                  >
                    hello@reckon.house
                  </a>
                </p>
                <p>
                  <span className="font-bold">Phone: </span>
                  <a
                    href="tel:+12146974578"
                    className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                  >
                    214.697.4578
                  </a>
                </p>
                <p>
                  <span className="font-bold">Response: </span>
                  Within one business day. Usually faster.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
