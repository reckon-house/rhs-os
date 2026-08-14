import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Info",
  description:
    "Multi-disciplinary design and engineering by Jeremy Prasatik. Reckon House Staples works across brand, product, and place: apps, interiors, and AI tools.",
};

/* ------------------------------------------------------------------ */
/*  Info                                                                */
/*                                                                      */
/*  The practice page the Masthead's Info link lands on. Content is    */
/*  the same ledger the Pressing C footer index carries — one reading  */
/*  size, sentence case, labels differ from content by color alone     */
/*  (the redesign's type rules). The Work row keeps the category       */
/*  pages reachable now that the NavRail thumbnails are gone.          */
/* ------------------------------------------------------------------ */

const LEDGER: Array<{ label: string; body: React.ReactNode }> = [
  {
    label: "The practice",
    body: "Multi-disciplinary design and engineering by Jeremy Prasatik. Reckon House Staples works across brand, product, and place: apps, interiors, and AI tools.",
  },
  {
    label: "What I do",
    body: "Art direction. Brand systems. Digital design. Interiors.",
  },
  {
    label: "The setup",
    body: "Independent, Texas. Design and build. I love the work.",
  },
  {
    label: "Recently",
    body: (
      <span>
        <a
          href="https://www.awwwards.com/sites/reckon-house-staples"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-60 transition-opacity underline underline-offset-4 decoration-foreground/25"
        >
          Awwwards Honors, 2026
        </a>
        . Faux Reel released as an open repo. 28 case studies online.
      </span>
    ),
  },
  {
    label: "Work",
    body: (
      <span className="flex flex-wrap gap-x-6 gap-y-1">
        <Link href="/" className="hover:opacity-60 transition-opacity">
          All work
        </Link>
        <Link href="/category/digital" className="hover:opacity-60 transition-opacity">
          Digital
        </Link>
        <Link href="/category/creative" className="hover:opacity-60 transition-opacity">
          Creative
        </Link>
        <Link href="/category/interiors" className="hover:opacity-60 transition-opacity">
          Interiors
        </Link>
      </span>
    ),
  },
  {
    label: "Get in touch",
    body: (
      <a href="mailto:hello@reckon.house" className="hover:opacity-60 transition-opacity">
        hello@reckon.house
      </a>
    ),
  },
];

export default function InfoPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-0">
      <h1 className="text-[clamp(44px,8vw,96px)] font-medium leading-[1.02] tracking-[-0.02em] pt-[18vh] pb-[10vh]">
        Info.
      </h1>

      <div className="pb-[16vh] space-y-10 md:space-y-12">
        {LEDGER.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-1 md:grid-cols-12 gap-x-5 gap-y-1"
          >
            <span className="md:col-span-3 text-[16px] leading-[1.6] text-foreground/45">
              {row.label}
            </span>
            <div className="md:col-span-6 text-[16px] leading-[1.6] text-foreground/80 max-w-[34em]">
              {row.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
