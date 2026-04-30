"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CareerGalaxy } from "@/components/CareerGalaxy";
import { CapabilityWebShowpiece } from "@/components/CapabilityWebShowpiece";
import { HeroCarousel } from "@/components/fx/HeroCarousel";
import { ScrambleOnView } from "@/components/fx/ScrambleText";
import { projectsById as p, type Project } from "@/data/projects";

// Case study hero slides for the homepage carousel
const CASE_STUDY_HEROES = [
  { src: "/case-studies/arc/arc-app-kitchen-project-selection-lifestyle.jpg",                                                                                                                                                          alt: "A.R.C. AI home inventory app" },
  { src: "/case-studies/sally-os/heroes/sally-os-platform-hero.jpg",                                                                                                                                                                    alt: "Sally Marketing OS" },
  { src: "/case-studies/robert-rodriguez/neiman-marcus-robert-rodriguez-woman-cream-polka-dot-dress-pink-blazer-orange-yellow-backdrop-storefront-window-display-campaign.jpg",                                                          alt: "Robert Rodriguez at Neiman Marcus" },
  { src: "/case-studies/black-white-type/typography-patterns-the-fancy-poster-wood-surface-lifestyle.jpg",                                                                                                                              alt: "Black & white typography & patterns" },
  { src: "/case-studies/hill-country-kitchen/hill-country-kitchen-island-pendants-marble-wide.jpg",                                                                                                                                     alt: "Hill Country home kitchen" },
  { src: "/case-studies/ivy-park/ivy-park-nordstrom-laptop-brand-experience-mockup.jpg",                                                                                                                                                alt: "Ivy Park by Beyonce" },
  { src: "/case-studies/hill-country-bath/hill-country-bath-vanity-marble-globe-sconces-sage.jpg",                                                                                                                                      alt: "Hill Country home primary bath" },
  { src: "/case-studies/fairview-suite/fairview-suite-bedroom-chandelier-fireplace-windows-wide.jpg",                                                                                                                                   alt: "The Fairview suite" },
  { src: "/case-studies/j-christianson/j-christianson-storefront-tree-stripe-window-mockup.jpg",                                                                                                                                        alt: "J. Christianson brand identity" },
  { src: "/case-studies/nordstrom-beauty/nordstrom-beauty-hub-laptop-homepage-mockup.jpg",                                                                                                                                              alt: "Nordstrom Beauty hub" },
  { src: "/case-studies/neiman-marcus/neiman-marcus-insite-contemporary-art-magazine-hands-mockup.jpg",                                                                                                                                 alt: "Neiman Marcus editorial" },
  { src: "/case-studies/loved-by-nordstrom/loved-by-nordstrom-gallery-wall-campaign-tiles-tibi-center.jpg",                                                                                                                             alt: "Loved by Nordstrom campaign" },
];

/* ------------------------------------------------------------------ */
/*  Asterisk SVG component                                              */
/* ------------------------------------------------------------------ */

function Asterisk({ weight = "regular" }: { weight?: "thin" | "regular" | "heavy" }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rotRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const rot  = rotRef.current;
    if (!wrap || !rot) return;

    // Hide until in view
    wrap.style.opacity  = "0";
    wrap.style.transform = "scale(0.1)";

    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();

      // ── Scale + opacity on the outer wrapper (keep the dramatic pop) ──
      wrap.animate(
        [
          { opacity: "0", transform: "scale(0.1)" },
          { opacity: "1", transform: "scale(1)"   },
        ],
        { duration: 1400, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" }
      );

      // ── Rotation on the inner div, completely independent ──
      const entry = rot.animate(
        [
          { transform: "rotate(0deg)"   },
          { transform: "rotate(720deg)" },
        ],
        { duration: 1400, easing: "cubic-bezier(0.1, 0.9, 0.9, 0.9975)", fill: "forwards" }
      );

      entry.onfinish = () => {
        entry.cancel();
        rot.animate(
          [
            { transform: "rotate(0deg)"   },
            { transform: "rotate(360deg)" },
          ],
          { duration: 28000, iterations: Infinity, easing: "linear" }
        );
      };
    }, { threshold: 0.3 });

    io.observe(wrap);
    return () => io.disconnect();
  }, []);

  const src = `/case-studies/hp/asterisk-${weight}.svg`;

  return (
    <div ref={wrapRef} className="flex items-center justify-center w-[130px] h-[130px] md:w-[160px] md:h-[160px]">
      <div ref={rotRef}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="w-[100px] md:w-[130px] h-auto" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Project type + thumbnails                                          */
/* ------------------------------------------------------------------ */

// Project type and HP image-path constant now live in `@/data/projects`.

/* ------------------------------------------------------------------ */
/*  Thumbnail component                                                */
/* ------------------------------------------------------------------ */

function Thumb({ project }: { project: Project }) {
  const inner = (
    <div className="w-[130px] md:w-[160px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.image}
        alt={project.title}
        className="w-full aspect-square object-cover rounded-[23%]"
      />
      <div className="text-center mt-2 md:mt-3">
        <p className="text-[10px] font-medium leading-[14px]">{project.title}</p>
        <p className="text-[10px] leading-[14px] text-foreground/50">{project.category}</p>
      </div>
    </div>
  );

  if (project.href) {
    return (
      <Link href={project.href} className="hp-thumb group block">
        {inner}
      </Link>
    );
  }
  return <div className="hp-thumb group cursor-default">{inner}</div>;
}

/* ------------------------------------------------------------------ */
/*  Headline component                                                 */
/* ------------------------------------------------------------------ */

function Headline({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center">
      <p className="text-[14px] md:text-[20px] font-semibold text-center leading-[1.3]">{children}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <HomeContent />
  );
}

function HomeContent() {
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "g") {
        e.preventDefault();
        setShowGrid((v) => !v);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="relative w-full max-w-[1400px] mx-auto min-h-full px-[10px] pt-[10px] md:px-0 md:pt-0">
      {/* 12-column grid overlay — toggle with Ctrl/Cmd+G */}
      {showGrid && (
        <div className="pointer-events-none fixed inset-0 z-50 ml-[161px] pt-[50px] pl-[50px] pr-[50px]">
          <div className="h-full max-w-[1400px] mx-auto grid grid-cols-12 gap-x-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-full bg-[#ff000010] border-x border-[#ff000020]"
              />
            ))}
          </div>
        </div>
      )}

      {/* Breadcrumb bar */}
      <div className="fixed top-[10px] left-[10px] right-14 z-40 md:top-[20px] md:left-[50px] md:right-[50px]">
        <div className="flex items-center justify-between gap-4">
          <nav className="text-[10px] md:text-[12px] leading-[1] tracking-normal text-[#141414] truncate min-w-0">
            <span className="font-bold">House</span>
            <span className="mx-1 md:mx-2 text-[#141414]/40">/</span>
            <span>All Projects</span>
          </nav>
          <span className="hidden md:inline text-[12px] leading-[1] tracking-normal text-[#141414] shrink-0">
            House OS. Beta.
          </span>
        </div>
      </div>

      {/* Spacer for fixed breadcrumb */}
      <div className="h-[30px] md:h-[50px]" />

      {/* ---- Manifesto block — case-study Meta pattern at portfolio scale ---- */}
      <section className="w-full pt-8 md:pt-12 pb-12 md:pb-20 px-4 md:px-0">
        {/* Section pill — matches case-study + CareerGalaxy + CapabilityWeb pattern */}
        <span className="inline-block text-[11px] md:text-[13px] tracking-[0.06em] uppercase text-[#141414] font-medium px-4 py-2 rounded-full bg-[#141414]/[0.06] mb-5">
          <ScrambleOnView text="SECTION 01: OVERVIEW" />
        </span>

        {/* Title */}
        <h1 className="text-[22px] md:text-[24px] leading-[1.5] tracking-[-0.02em] font-bold">
          A practice across brand, product, and place.
        </h1>

        {/* Subtitle — spans full width, regular weight */}
        <p className="text-[22px] md:text-[24px] leading-[1.5] tracking-[-0.02em] font-normal text-[#141414]">
          The work spans AI-powered software, enterprise retail campaigns, and custom homes built piece by piece. The throughline isn&apos;t the discipline. It&apos;s the thinking, and the willingness to ship.
        </p>

        {/* Smaller secondary line — sits directly under the subhead, full width like the headings */}
        <p className="mt-4 text-[14px] md:text-[16px] leading-[1.6] text-foreground/70 mb-6">
          Generation is becoming free. Taste, judgment, and editing are what compound. The projects below are the argument.
        </p>

        {/* Meta fields — left-aligned, constrained width */}
        <div className="text-spec text-foreground/90">
          <p>
            <span className="font-bold">Field </span>
            Brand  Product  Place
          </p>
          <p>
            <span className="font-bold">Author </span>
            Jeremy Prasatik
            {"  Active Since: "}
            2002
            {"  Status: "}
            Practicing
          </p>
          <p>
            <span className="font-bold">Classification </span>
            Product Design  Full-Stack Engineering  Brand Strategy  Creative Direction  Interior Design
          </p>
        </div>
      </section>

      {/* ---- Project grid ---- */}
      <div className="pb-24 space-y-10 md:space-y-[100px]">

        {/* Row 1: 4 thumbnails */}
        <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible">
          <Thumb project={p.ivyPark} />
          <Thumb project={p.arc} />
          <Thumb project={p.hillKitchen} />
          <Thumb project={p.robertRod} />
        </div>

        {/* Row 2: 2 thumbnails on the right (cols 3-4) */}
        <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible md:relative">
          <div className="hidden md:block md:w-[160px] md:h-[160px]" />
          <div className="hidden md:block md:w-[160px]" />
          <Thumb project={p.nordstromPersonal} />
          <Thumb project={p.jeffreyNyc} />
        </div>

        {/* Row 3: cols 1, 2, *, 4 */}
        <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible">
          <Thumb project={p.capitanBoot} />
          <Thumb project={p.jeffreyCampaign} />
          <div className="hp-thumb flex items-center justify-center overflow-visible md:w-[160px]">
            <Asterisk weight="thin" />
          </div>
          <Thumb project={p.hillBath} />
        </div>

        {/* Row 4: cols 1, 2 + headline (cols 3-4) */}
        <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible md:relative">
          <Thumb project={p.nordstromBeauty} />
          <Thumb project={p.oakworks} />
          <div className="hidden md:block md:w-[160px]" />
          <div className="hidden md:block md:w-[160px] md:h-[160px]" />
          <div className="hidden md:flex md:absolute md:right-0 md:w-1/2 md:h-[160px] md:items-center md:justify-center md:pointer-events-none">
            <Headline>From software to campaigns to kitchens.</Headline>
          </div>
          <div className="hp-span col-span-2 py-2 text-center md:hidden">
            <Headline>From software to campaigns to kitchens.</Headline>
          </div>
        </div>

        {/* Row 5: 4 thumbnails */}
        <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible">
          <Thumb project={p.cosmoProf} />
          <Thumb project={p.dsc} />
          <Thumb project={p.bwType} />
          <Thumb project={p.hillLiving} />
        </div>

        {/* Row 6: headline (cols 1-2) + cols 3, 4 */}
        <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible md:relative">
          <div className="hidden md:block md:w-[160px] md:h-[160px]" />
          <div className="hidden md:block md:w-[160px]" />
          <div className="hidden md:flex md:absolute md:left-0 md:w-1/2 md:h-[160px] md:items-center md:justify-center md:pointer-events-none">
            <Headline>The disciplines share patterns.</Headline>
          </div>
          <div className="hp-span col-span-2 py-2 text-center md:hidden">
            <Headline>The disciplines share patterns.</Headline>
          </div>
          <Thumb project={p.jChristianson} />
          <Thumb project={p.amberShockey} />
        </div>

        {/* Row 7: cols 1, *, 3, 4 */}
        <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible">
          <Thumb project={p.sallyBeauty} />
          <div className="hp-thumb flex items-center justify-center overflow-visible md:w-[160px]">
            <Asterisk weight="heavy" />
          </div>
          <Thumb project={p.jeffreyCampaign2} />
          <Thumb project={p.fairviewSitting} />
        </div>

        {/* Row 8: cols 1, 2 + headline (cols 3-4) */}
        <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible md:relative">
          <Thumb project={p.floorDecor} />
          <Thumb project={p.fairviewBedroom} />
          <div className="hidden md:block md:w-[160px]" />
          <div className="hidden md:block md:w-[160px] md:h-[160px]" />
          <div className="hidden md:flex md:absolute md:right-0 md:w-1/2 md:h-[160px] md:items-center md:justify-center md:pointer-events-none">
            <Headline>The premium is in the editing.</Headline>
          </div>
          <div className="hp-span col-span-2 py-2 text-center md:hidden">
            <Headline>The premium is in the editing.</Headline>
          </div>
        </div>

        {/* Row 9: cols 1, 2, 3, * */}
        <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible">
          <Thumb project={p.fairviewFoyer} />
          <Thumb project={p.nordstromFramework} />
          <Thumb project={p.lovedByNordstrom} />
          <div className="hp-thumb flex items-center justify-center overflow-visible md:w-[160px]">
            <Asterisk weight="regular" />
          </div>
        </div>

        {/* Row 10: 4 thumbnails */}
        <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible">
          <Thumb project={p.mountainView} />
          <Thumb project={p.neimanMarcus} />
          <Thumb project={p.variousDesign} />
          <Thumb project={p.sallyOS} />
        </div>
      </div>

      {/* ---- Carousel hero — scroll-reactive, full-bleed, lifted out of the chapter card ---- */}
      <HeroCarousel
        slides={CASE_STUDY_HEROES}
        aspectClassName="aspect-[16/9]"
        scrollReactive
      />

      {/* ---- The Practice — chapter card ----
           Cream rounded container holds: CareerGalaxy chart → Principles cards.
           Reads as one chapter beat below the breakout hero. */}
      <div className="px-4 md:px-0 py-20">
        <div
          className="overflow-hidden"
          style={{
            backgroundColor: "#ECE6E1",
            borderRadius: "clamp(30px, 5vw, 75px)",
          }}
        >
          {/* Inner padded content — chart + principles */}
          <div style={{ padding: "clamp(40px, 6vw, 80px) clamp(24px, 5vw, 64px)" }}>
            <CareerGalaxy />

            {/* ── Principles — case-study ThreeColumnText pattern ──
                 Title left (col-span-3), copy right (col-start-7 col-span-6), three rows stacked. */}
            <div className="mt-20 md:mt-32 pt-12 md:pt-16 border-t border-[#141414]/10">
              <p className="text-[10px] md:text-[12px] font-semibold tracking-[0.15em] uppercase text-foreground/40 mb-10 md:mb-14">
                Principles
              </p>

              <div className="space-y-8 md:space-y-10">
                {/* Principle 01 */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-3 md:gap-x-5">
                  <h3 className="md:col-span-3 text-[13px] md:text-[14px] font-bold leading-[1.5] md:leading-[1.875] md:pt-[3px]">
                    Function. Detail. Endurance.
                  </h3>
                  <p className="md:col-start-7 md:col-span-6 text-[13px] md:text-[14px] leading-[1.7] md:leading-[1.875] text-foreground/80">
                    Three filters every project runs through. The first asks whether it works. The second asks whether it&apos;s right. The third asks whether it survives.
                  </p>
                </div>

                {/* Principle 02 */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-3 md:gap-x-5">
                  <h3 className="md:col-span-3 text-[13px] md:text-[14px] font-bold leading-[1.5] md:leading-[1.875] md:pt-[3px]">
                    Range is the practice.
                  </h3>
                  <p className="md:col-start-7 md:col-span-6 text-[13px] md:text-[14px] leading-[1.7] md:leading-[1.875] text-foreground/80">
                    A campaign, a kitchen, and a software product share patterns. Working across all three sharpens the work in each. The disciplines are not separate.
                  </p>
                </div>

                {/* Principle 03 */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-3 md:gap-x-5">
                  <h3 className="md:col-span-3 text-[13px] md:text-[14px] font-bold leading-[1.5] md:leading-[1.875] md:pt-[3px]">
                    Aesthetic intelligence.
                  </h3>
                  <p className="md:col-start-7 md:col-span-6 text-[13px] md:text-[14px] leading-[1.7] md:leading-[1.875] text-foreground/80">
                    Generation is becoming free. Taste, judgment, and the willingness to throw work away are what compound. The premium is in the editing, not the first draft.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Dark inset footer card — same container pattern as the Career Galaxy section ---- */}
      <div className="px-4 md:px-0 py-20">
        <div
          className="overflow-hidden"
          style={{
            backgroundColor: "#141414",
            borderRadius: "clamp(30px, 5vw, 75px)",
          }}
        >
          {/* Inner padded content */}
          <div style={{ padding: "clamp(40px, 6vw, 80px) clamp(24px, 5vw, 64px)" }}>

          {/* Editorial headline — case-study EditorialHeadline pattern, scaled for footer */}
          <h2 className="text-[#F0EAE4] text-[44px] md:text-[88px] font-light leading-[1.05] tracking-[-0.03em] text-center whitespace-pre-line py-12 md:py-20">
            {"Brand. Product. Place.\nConcept through launch."}
          </h2>

          {/* Capability Web — chart + dense meta heading */}
          <CapabilityWebShowpiece dark />

          {/* Closing block — case-study ClosingBlock pattern */}
          <div className="mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-12 gap-x-5 gap-y-12 pl-0 md:pl-[calc(100%/24)]">

            {/* Left column — Services / Stack / Year */}
            <div className="md:col-span-4 text-spec text-[#F0EAE4]">
              <p className="font-bold">Services</p>
              <p className="text-[#F0EAE4]/70">Product Design</p>
              <p className="text-[#F0EAE4]/70">Full-Stack Engineering</p>
              <p className="text-[#F0EAE4]/70">Brand Strategy & Identity</p>
              <p className="text-[#F0EAE4]/70">Creative Direction</p>
              <p className="text-[#F0EAE4]/70">Interior Design</p>

              <p className="font-bold mt-6">Stack</p>
              <p className="text-[#F0EAE4]/70">Next.js  React  TypeScript</p>
              <p className="text-[#F0EAE4]/70">Supabase  Vercel</p>
              <p className="text-[#F0EAE4]/70">Figma  Framer  Webflow</p>
              <p className="text-[#F0EAE4]/70">Claude  GPT  Midjourney</p>

              <p className="font-bold mt-6">Active Since</p>
              <p className="text-[#F0EAE4]/70">2002 — Present</p>
            </div>

            {/* Right column — Closing copy + Contact */}
            <div className="md:col-start-7 md:col-span-6 space-y-6">
              <p className="text-body text-[#F0EAE4]/80">
                Strategy and execution don&apos;t take turns. They run at the same desk, in the same week, on the same project.
              </p>
              <p className="text-body text-[#F0EAE4]/80">
                Engagements range from a single mark to a full platform to a custom home. The work ships, and it holds up after.
              </p>

              <div className="pt-4 border-t border-[#F0EAE4]/15">
                <p className="text-spec font-bold text-[#F0EAE4] mb-2">Contact</p>
                <p className="text-spec">
                  <a href="mailto:hello@reckon.house" className="text-[#F0EAE4]/80 hover:text-[#F0EAE4] underline underline-offset-2 transition-colors">hello@reckon.house</a>
                </p>
                <p className="text-spec text-[#F0EAE4]/80">214.697.4578</p>
                <p className="text-spec">
                  <a href="https://instagram.com/reckonhousestaples" target="_blank" rel="noopener noreferrer" className="text-[#F0EAE4]/80 hover:text-[#F0EAE4] underline underline-offset-2 transition-colors">IG @reckonhousestaples</a>
                </p>
                <p className="text-spec text-[#F0EAE4]/80">Texas / Anywhere</p>
              </div>
            </div>
          </div>

          </div>
        </div>
      </div>

    </div>
  );
}
