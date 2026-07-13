"use client";

import { useState, useEffect, useRef } from "react";
import { CareerGalaxy } from "@/components/CareerGalaxy";
import { HeroCarousel } from "@/components/fx/HeroCarousel";
import { ScrambleOnView } from "@/components/fx/ScrambleText";
import { NowPlayingThumb } from "@/components/NowPlayingThumb";
import { projectsById as p } from "@/data/projects";
import { ThumbEnergy } from "@/components/fx/ThumbEnergy";
import { Thumb } from "@/components/Thumb";

// Case study hero slides for the homepage carousel
const CASE_STUDY_HEROES = [
  { src: "/case-studies/arc/arc-app-kitchen-project-selection-lifestyle.jpg",                                                                                                                                                          alt: "A.R.C. AI home inventory app" },
  { src: "/case-studies/sally-os/heroes/sally-os-platform-hero.jpg",                                                                                                                                                                    alt: "Sally Marketing OS" },
  { src: "/case-studies/robert-rodriguez/neiman-marcus-robert-rodriguez-woman-cream-polka-dot-dress-pink-blazer-orange-yellow-backdrop-storefront-window-display-campaign.jpg",                                                          alt: "Robert Rodriguez at Neiman Marcus" },
  { src: "/case-studies/black-white-type/typography-patterns-the-fancy-poster-wood-surface-lifestyle.jpg",                                                                                                                              alt: "Black & white typography & patterns" },
  { src: "/case-studies/hill-country-kitchen/hill-country-kitchen-island-pendants-marble-wide.jpg",                                                                                                                                     alt: "Hill Country home kitchen" },
  { src: "/case-studies/ivy-park/ivy-park-nordstrom-laptop-brand-experience-mockup.jpg",                                                                                                                                                alt: "Ivy Park by Beyoncé" },
  { src: "/case-studies/branding-graphics/okina.jpg",                                                                                                                                                                                   alt: "Okina brand identity" },
  { src: "/case-studies/hill-country-bath/hill-country-bath-vanity-marble-globe-sconces-sage.jpg",                                                                                                                                      alt: "Hill Country home primary bath" },
  { src: "/case-studies/fairview-bedroom/fairview-suite-bedroom-chandelier-fireplace-windows-wide.jpg",                                                                                                                                 alt: "The Fairview suite" },
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
/*  Worked with / spotted by / featured in                            */
/* ------------------------------------------------------------------ */

// Brands carry an optional monochrome logo, forced to a single ink so the wall
// stays consistent; otherwise the cell falls back to the name. Logos are capped
// by height, which makes very wide wordmarks read as oversized — `scale` trims
// those back so every logo carries similar optical weight (default 1). Drop new
// logos in /public/brands/, transparent only (a baked-in white background can't
// be cleaned up in CSS once it's behind the ticker's edge-fade mask). The lone
// exception is `asIs`: a logo that lives on its own dark fill (e.g. DWR's boxed
// mark) renders in native colors as a small chip, skipping the ink treatment.
// A `tracked` brand has no logo file — it renders its name as an all-caps,
// letter-spaced wordmark (e.g. HAVEN, whose mark is just type).
const FEATURED_BRANDS: { name: string; logo?: string; scale?: number; asIs?: boolean; tracked?: boolean }[] = [
  { name: "Crate & Barrel", logo: "/brands/crate-barrel.svg" },
  { name: "Nordstrom", logo: "/brands/nordstrom.svg", scale: 0.7 },
  { name: "Ivy Park by Beyoncé", logo: "/brands/ivy-park.svg" },
  { name: "Rejuvenation", logo: "/brands/rejuvenation.png", scale: 0.75 },
  { name: "Lostine Home", logo: "/brands/lostine.avif" },
  { name: "Neiman Marcus", logo: "/brands/neiman-marcus.svg" },
  { name: "Visual Comfort", logo: "/brands/visual-comfort.webp", scale: 0.64 },
  { name: "Floor & Decor", logo: "/brands/floor-decor.svg", scale: 0.85 },
  { name: "Kingston Brass", logo: "/brands/kingston-brass.webp", scale: 0.9 },
  { name: "Design Within Reach", logo: "/brands/dwr.jpg", asIs: true, scale: 1.05 },
  { name: "Vivir Homes", logo: "/brands/vivir-homes.webp" },
  { name: "HAVEN", tracked: true },
];

function FeaturedBrands() {
  // Doubled so the marquee loops seamlessly (the track scrolls to translateX(-50%)).
  const row = [...FEATURED_BRANDS, ...FEATURED_BRANDS];
  return (
    // Lives inside the career "Practice" card, below the CareerGalaxy chart.
    // A slow ticker instead of a grid: showing a few logos at a time, in motion,
    // lets their mismatched styles read as one quiet flow rather than a busy wall.
    <div className="mt-14 border-t border-[#141414]/10 pt-12 md:mt-20 md:pt-16">
      <p className="text-[10px] tracking-[0.16em] capitalize text-foreground/45 mb-7 md:mb-9">
        <ScrambleOnView text={"Worked with, spotted by & featured in".toLowerCase()} />
      </p>
      <div className="brand-ticker overflow-hidden">
        <div className="brand-ticker__track flex w-max items-center [--lh:26px] md:[--lh:30px]">
          {row.map((brand, i) => (
            <div
              key={i}
              aria-hidden={i >= FEATURED_BRANDS.length}
              className="mr-20 flex h-[40px] shrink-0 items-center justify-center md:mr-28"
            >
              {brand.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-auto"
                  // One ink for the whole wall. maxHeight = the base row height
                  // (--lh) times the per-brand optical scale, so wide wordmarks can
                  // be trimmed down without shrinking the already-balanced ones.
                  // `asIs` chips keep their native colors; the rest flatten to ink.
                  style={{
                    maxHeight: `calc(var(--lh) * ${brand.scale ?? 1})`,
                    ...(brand.asIs ? { opacity: 0.9 } : { filter: "brightness(0)", opacity: 0.82 }),
                  }}
                />
              ) : (
                <span
                  className={
                    brand.tracked
                      ? // all-caps, letter-spaced wordmark; pl balances the trailing
                        // letter-spacing so it sits optically centered in the cell
                        "whitespace-nowrap pl-[0.42em] text-[15px] font-semibold uppercase tracking-[0.42em] text-[#141414]/85 md:text-[16px]"
                      : "whitespace-nowrap text-[16px] font-medium tracking-[-0.01em] text-[#141414]/85 md:text-[18px]"
                  }
                >
                  {brand.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
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
      {/* Scroll-reactive thumbnail aliveness — pumps --e on <html> */}
      <ThumbEnergy />

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
      <div className="fixed top-[10px] left-[10px] right-[10px] z-40 md:top-[20px] md:left-[50px] md:right-[50px]">
        <div className="flex items-center justify-between gap-4">
          <nav className="text-[10px] md:text-[12px] leading-[1] tracking-normal text-[#141414] truncate min-w-0">
            <span className="font-bold">House</span>
            <span className="mx-1 md:mx-2 text-[#141414]/40">/</span>
            <span>All Projects</span>
          </nav>
          <a
            href="https://www.awwwards.com/sites/reckon-house-staples"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[10px] tracking-[0.06em] capitalize text-[#141414] font-medium px-3 py-1.5 rounded-full bg-[#141414]/[0.06] hover:bg-[#141414]/[0.1] transition-colors shrink-0"
          >
            <ScrambleOnView text={"AWWWARDS NOMINEE".toLowerCase()} />
          </a>
        </div>
      </div>

      {/* Spacer for fixed breadcrumb */}
      <div className="h-[20px] md:h-[50px]" />

      {/* ---- Manifesto block — case-study Meta pattern at portfolio scale ---- */}
      <section className="w-full pt-4 md:pt-12 pb-12 md:pb-20 px-4 md:px-0">
        {/* Section pill — matches case-study + CareerGalaxy + CapabilityWeb pattern */}
        <span className="inline-block text-[10px] tracking-[0.06em] capitalize text-[#141414] font-medium px-4 py-2 rounded-full bg-[#141414]/[0.06] mb-5">
          <ScrambleOnView text={"SECTION 01: OVERVIEW".toLowerCase()} />
        </span>

        {/* Manifesto — one continuous block: bold open and close, regular
            middle, all one size, no breaks. The opening sentence stays an
            inline <h1> so it still carries the page heading for SEO. */}
        <div className="text-[18px] md:text-[20px] leading-[1.5] tracking-[-0.02em] font-normal text-[#141414] mb-8 md:mb-10">
          <h1 className="inline font-bold">I&apos;m Jeremy. I work across brand, product, and place.</h1>{" "}
          The work spans apps and ecommerce, campaigns and brand systems, photography and art direction, custom interiors and material selection, AI tools and marketing platforms. The disciplines overlap more than they separate.{" "}
          <span className="font-bold">Same desk for all of it.</span>
        </div>

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
      {/* id is the scope target for ThumbEnergy's --e/--es vars: writing them
          here (not on :root) keeps scroll-time style invalidation inside the
          grid subtree instead of the whole document (SpringSolve, etc.). */}
      <div id="hp-grid" className="pb-24 space-y-10 md:space-y-[100px]">

        {/* Row 1: 4 thumbnails */}
        <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible">
          <Thumb project={p.sallyOS} blot="tl2" />
          <Thumb project={p.ivyPark} />
          <Thumb project={p.arc} />
          <Thumb project={p.hillKitchen} />
        </div>

        {/* Row 2: headline (cols 1-2) + 2 thumbnails on the right (cols 3-4) */}
        <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible md:relative">
          <div className="hidden md:block md:w-[160px] md:h-[160px]" />
          <div className="hidden md:block md:w-[160px]" />
          <div className="hidden md:flex md:absolute md:left-0 md:w-1/2 md:h-[160px] md:items-center md:justify-center md:pointer-events-none">
            <Headline>Designing digital and physical spaces</Headline>
          </div>
          <div className="hp-span col-span-2 py-2 text-center md:hidden">
            <Headline>Designing digital and physical spaces</Headline>
          </div>
          <Thumb project={p.robertRod} />
          <Thumb project={p.nordstromPersonal} />
        </div>

        {/* Row 3: cols 1, 2, 3, 4 — the SizzleReel tile is a live reel (see
             Thumb), a motion piece in the slot the thin asterisk used to hold. */}
        <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible">
          <Thumb project={p.jeffreyNyc} />
          <Thumb project={p.capitanBoot} />
          <Thumb project={p.sizzle} />
          <Thumb project={p.jeffreyCampaign} />
        </div>

        {/* Row 4: cols 1, 2 + headline (cols 3-4) */}
        <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible md:relative">
          <Thumb project={p.hillBath} />
          <Thumb project={p.nordstromBeauty} />
          <div className="hidden md:block md:w-[160px]" />
          <div className="hidden md:block md:w-[160px] md:h-[160px]" />
          <div className="hidden md:flex md:absolute md:right-0 md:w-1/2 md:h-[160px] md:items-center md:justify-center md:pointer-events-none">
            <Headline>from software to campaigns to kitchens</Headline>
          </div>
          <div className="hp-span col-span-2 py-2 text-center md:hidden">
            <Headline>from software to campaigns to kitchens</Headline>
          </div>
        </div>

        {/* Row 5: 4 thumbnails */}
        <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible">
          <Thumb project={p.oakworks} />
          <Thumb project={p.cosmoProf} />
          <Thumb project={p.dsc} />
          <Thumb project={p.bwType} />
        </div>

        {/* Row 6: headline (cols 1-2) + cols 3, 4 */}
        <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible md:relative">
          <div className="hidden md:block md:w-[160px] md:h-[160px]" />
          <div className="hidden md:block md:w-[160px]" />
          <div className="hidden md:flex md:absolute md:left-0 md:w-1/2 md:h-[160px] md:items-center md:justify-center md:pointer-events-none">
            <Headline>same instincts, different materials</Headline>
          </div>
          <div className="hp-span col-span-2 py-2 text-center md:hidden">
            <Headline>same instincts, different materials</Headline>
          </div>
          <Thumb project={p.hillLiving} />
          <Thumb project={p.jChristianson} />
        </div>

        {/* Row 7: cols 1, *, 3, 4 */}
        <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible">
          <Thumb project={p.amberShockey} />
          <div className="hp-thumb flex items-center justify-center overflow-visible md:w-[160px]">
            <Asterisk weight="heavy" />
          </div>
          <Thumb project={p.sallyBeauty} />
          <Thumb project={p.jeffreyCampaign2} />
        </div>

        {/* Row 8: cols 1, 2 + headline (cols 3-4) */}
        <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible md:relative">
          <Thumb project={p.fairviewSitting} />
          <Thumb project={p.floorDecor} />
          <div className="hidden md:block md:w-[160px]" />
          <div className="hidden md:block md:w-[160px] md:h-[160px]" />
          <div className="hidden md:flex md:absolute md:right-0 md:w-1/2 md:h-[160px] md:items-center md:justify-center md:pointer-events-none">
            <Headline>I love the work.</Headline>
          </div>
          <div className="hp-span col-span-2 py-2 text-center md:hidden">
            <Headline>I love the work.</Headline>
          </div>
        </div>

        {/* Row 9: cols 1, 2, 3, * */}
        <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible">
          <Thumb project={p.fairviewBedroom} />
          <Thumb project={p.fairviewFoyer} />
          <Thumb project={p.nordstromFramework} />
          <div className="hp-thumb flex items-center justify-center overflow-visible md:w-[160px]">
            <Asterisk weight="regular" />
          </div>
        </div>

        {/* Row 10: 4 thumbnails — last slot is the live music easter egg.
             Renders as variousDesign normally; swaps to album art + song +
             artist when a recent Apple Music play is detected. */}
        <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible">
          <Thumb project={p.lovedByNordstrom} />
          <Thumb project={p.mountainView} />
          <Thumb project={p.neimanMarcus} />
          <NowPlayingThumb fallback={p.variousDesign} />
        </div>

        {/* Row 11: West Texas photography + Various design closer */}
        <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible">
          <Thumb project={p.bigBend} />
          <Thumb project={p.variousDesign} />
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
          {/* Inner padded content — career chart + the brands band it earns */}
          <div style={{ padding: "clamp(40px, 6vw, 80px) clamp(24px, 5vw, 64px)" }}>
            <CareerGalaxy />
            <FeaturedBrands />
          </div>
        </div>
      </div>

    </div>
  );
}
