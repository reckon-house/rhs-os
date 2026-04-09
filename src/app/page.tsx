"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CareerGalaxy } from "@/components/CareerGalaxy";
import { CapabilityWeb } from "@/components/CapabilityWeb";

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

interface Project {
  title: string;
  category: string;
  image: string;
  href?: string;
}

const HP = "/case-studies/hp";

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
/*  All project records                                                */
/* ------------------------------------------------------------------ */

const p = {
  ivyPark: { title: "Ivy Park by Beyonce", category: "Digital design, brand launch", image: `${HP}/rhs-ivy-park-beyonce-digital-brand-launch.jpg` },
  arc: { title: "A.R.C. - AI home Inventory", category: "App & brand development", image: `${HP}/rhs-arc-ai-home-inventory-app-thumbnail.jpg`, href: "/case-studies/arc" },
  hillKitchen: { title: "Hill Country home", category: "Interior design, kitchen", image: `${HP}/rhs-interior-design-kitchen-modern-meets-vintage.jpg`, href: "/case-studies/hill-country-kitchen" },
  robertRod: { title: "Robert Rodriguez x Neiman\u2019s", category: "Creative direction, design", image: `${HP}/rhs-robert-rodriguez-neiman-marcus-campaign-thumbnail.jpg`, href: "/case-studies/robert-rodriguez" },
  nordstromPersonal: { title: "Nordstrom personalization", category: "Design system, direction", image: `${HP}/rhs-nordstrom-personalization-design-system.jpg` },
  jeffreyNyc: { title: "Jeffrey NYC", category: "Ecommerce, web design", image: `${HP}/rhs-jeffrey-ecommerce-website-design.jpg` },
  capitanBoot: { title: "Capitan Boot Co.", category: "Branding, design", image: `${HP}/rhs-capitan-boot-co-branding.jpg` },
  jeffreyCampaign: { title: "Jeffrey Spring Campaign", category: "Creative direction, design", image: `${HP}/rhs-jeffrey-spring-campaign.jpg` },
  hillBath: { title: "Hill Country home", category: "Interior design, primary bath", image: `${HP}/rhs-interior-design-hill-country-primary-bath.jpg` },
  nordstromBeauty: { title: "Nordstrom beauty", category: "Digital design, personalized", image: `${HP}/rhs-nordstrom-beauty-finder-digital-design.jpg` },
  oakworks: { title: "Hill County Oakworks", category: "Campaign direction, branding", image: `${HP}/rhs-hill-county-oakworks-campaign-branding.jpg` },
  cosmoProf: { title: "Cosmo Prof", category: "Digital design, creative direction", image: `${HP}/rhs-cosmo-prof-website-design-digital-rebrand.jpg` },
  dsc: { title: "Dallas Sport Collective", category: "Website, custom app", image: `${HP}/rhs-dallas-sport-collective-website-app.jpg` },
  bwType: { title: "Black & white type", category: "Custom typography, patterns", image: `${HP}/rhs-campaign-design-typography-black-white-custom-patterns.jpg`, href: "/case-studies/black-white-type" },
  hillLiving: { title: "Hill Country home", category: "Interior design, living room", image: `${HP}/rhs-interior-design-livingroom-interior.jpg` },
  jChristianson: { title: "J.Christianson", category: "Brand development, design", image: `${HP}/rhs-campaign-design-j-christianson-branding.jpg` },
  amberShockey: { title: "Amber Shockey & Co.", category: "Tableware design, branding", image: `${HP}/rhs-campaign-design-amber-shockey-pattern-dishware.jpg` },
  sallyBeauty: { title: "You By Sally", category: "Brand campaign", image: `${HP}/rhs-campaign-design-sally-beauty-you-by-sally-campaign.jpg` },
  sallyOS: { title: "Sally Marketing OS", category: "Product design, engineering", image: `/case-studies/sally-os/heroes/sally-os-platform-hero.jpg`, href: "/case-studies/sally" },
  jeffreyCampaign2: { title: "Jeffrey NYC", category: "Campaign direction, design", image: `${HP}/rhs-interior-design-formal-modern-transitional.jpg` },
  fairviewSitting: { title: "The Fairview", category: "Interior design, sitting room", image: `${HP}/rhs-interior-design-formal-modern-transitional-1.jpg` },
  floorDecor: { title: "Floor & Decor", category: "Interiors feature", image: `${HP}/rhs-interior-design-master-bath-urban-farmhouse.jpg` },
  fairviewBedroom: { title: "The Fairview Suite", category: "Interior design, bedroom", image: `${HP}/rhs-interior-design-master-bedroom-glam-luxe.jpg` },
  fairviewFoyer: { title: "The Fairview", category: "Interior Design, foyer", image: `${HP}/rhs-interior-design-grand-entry-luxe.jpg` },
  nordstromFramework: { title: "Nordstrom framework", category: "Content direction, design", image: `${HP}/rhs-nordstrom-framework-content-design.jpg` },
  lovedByNordstrom: { title: "Loved by Nordstrom", category: "Brand campaign, design", image: `${HP}/rhs-campaign-design-nordstrom-loved-by-campaign.jpg` },
  mountainView: { title: "Mountain View", category: "Interior design, remodel", image: `${HP}/rhs-interior-design-cabin-mid-century.jpg` },
  neimanMarcus: { title: "Neiman Marcus", category: "Editorial direction, design", image: `${HP}/rhs-campaign-design-neiman-marcus-editorial-design.jpg` },
  variousDesign: { title: "Various design", category: "Branding, art, apparel", image: `${HP}/rhs-various-design-branding-art-apparel.jpg` },
} satisfies Record<string, Project>;

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

      {/* ---- Project grid ---- */}
      <div className="pb-24 space-y-10 md:space-y-[100px]">

        {/* Row 1: 4 thumbnails */}
        <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible">
          <Thumb project={p.ivyPark} />
          <Thumb project={p.arc} />
          <Thumb project={p.hillKitchen} />
          <Thumb project={p.robertRod} />
        </div>

        {/* Row 2: studio name (cols 1-2) + 2 thumbnails (cols 3-4) */}
        <div className="hp-row grid grid-cols-2 gap-y-10 items-start md:flex md:justify-between md:items-start overflow-visible md:relative">
          <div className="hidden md:block md:w-[160px] md:h-[160px]" />
          <div className="hidden md:block md:w-[160px]" />
          <div className="hidden md:flex md:absolute md:left-0 md:w-1/2 md:h-[160px] md:items-center md:justify-center md:pointer-events-none">
            <p className="text-[20px] font-semibold text-center whitespace-nowrap pointer-events-auto">
              Creative work{" "}
              <span className="text-foreground/50 font-normal">by Jeremy Prasatik</span>
            </p>
          </div>
          <p className="hp-span col-span-2 text-[14px] font-semibold text-center py-2 md:hidden">
            Creative work{" "}
            <span className="text-foreground/50 font-normal">by Jeremy Prasatik</span>
          </p>
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
            <Headline>Architecting digital and physical spaces</Headline>
          </div>
          <div className="hp-span col-span-2 py-2 text-center md:hidden">
            <Headline>Architecting digital and physical spaces</Headline>
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
            <Headline>From pixels to pine plank floors</Headline>
          </div>
          <div className="hp-span col-span-2 py-2 text-center md:hidden">
            <Headline>From pixels to pine plank floors</Headline>
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
            <Headline>Content, code, and construction</Headline>
          </div>
          <div className="hp-span col-span-2 py-2 text-center md:hidden">
            <Headline>Content, code, and construction</Headline>
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

      {/* ---- Career Galaxy ---- */}
      <div className="px-4 md:px-0 py-20">
        <CareerGalaxy />
      </div>

      {/* ---- Capability Bubbles ---- */}
      <div className="px-4 md:px-0 pb-20">
        <CapabilityWeb />
      </div>

    </div>
  );
}
