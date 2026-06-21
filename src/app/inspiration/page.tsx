import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ScrambleOnView } from "@/components/fx/ScrambleText";
import { NowPlaying } from "@/components/NowPlaying";
import { InspirationQuoteTile } from "@/components/InspirationQuoteTile";
import { inspiration } from "@/data/inspiration";
import { inspirationQuotes, quoteInsertionPoints } from "@/data/inspiration-quotes";
import { getImageDimensions } from "@/data/image-dimensions";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const INSPIRATION_DESCRIPTION =
  "A running visual reference board. Images, marks, and quotes that feed the work.";

export const metadata: Metadata = {
  title: "Inspiration",
  description: INSPIRATION_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/inspiration` },
  openGraph: {
    title: "Inspiration",
    description: INSPIRATION_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    url: `${SITE_URL}/inspiration`,
    images: inspiration[0]?.src ? [inspiration[0].src] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: "Inspiration",
    description: INSPIRATION_DESCRIPTION,
    images: inspiration[0]?.src ? [inspiration[0].src] : undefined,
  },
};

// Weave quotes into the image list at the configured anchor points.
// Insertion is done before mapping so each tile gets a stable key based on
// its source data. Quotes whose insertion point exceeds the image count
// simply append to the end.
type InspirationItem =
  | { kind: "image"; src: string; alt: string }
  | { kind: "quote"; text: string; attribution: string; key: string };

function buildInspirationItems(): InspirationItem[] {
  const items: InspirationItem[] = inspiration.map((img) => ({
    kind: "image",
    src: img.src,
    alt: img.alt,
  }));

  // Insert from the end so earlier insertions don't shift later indexes.
  const sortedPoints = [...quoteInsertionPoints].sort((a, b) => b - a);
  sortedPoints.forEach((point) => {
    const quoteIdx = quoteInsertionPoints.indexOf(point);
    const quote = inspirationQuotes[quoteIdx];
    if (!quote) return;
    items.splice(Math.min(point, items.length), 0, {
      kind: "quote",
      text: quote.text,
      attribution: quote.attribution,
      key: `quote-${quoteIdx}`,
    });
  });

  return items;
}

export default function InspirationPage() {
  const items = buildInspirationItems();

  return (
    <div className="relative w-full max-w-[1400px] mx-auto min-h-full px-[10px] pt-[10px] md:px-0 md:pt-0">
      {/* Breadcrumb bar — matches homepage */}
      <div className="fixed top-[10px] left-[10px] right-14 z-40 md:top-[20px] md:left-[50px] md:right-[50px]">
        <div className="flex items-center justify-between gap-4">
          <nav className="text-[10px] md:text-[12px] leading-[1] tracking-normal text-[#141414] truncate min-w-0">
            <Link href="/" className="hover:opacity-70 transition-opacity">House</Link>
            <span className="mx-1 md:mx-2 text-[#141414]/40">/</span>
            <span className="font-bold">Inspiration</span>
          </nav>
          <span className="hidden md:inline text-[12px] leading-[1] tracking-normal text-[#141414] shrink-0">
            House OS. Beta.
          </span>
        </div>
      </div>

      {/* Spacer for fixed breadcrumb */}
      <div className="h-[20px] md:h-[50px]" />

      {/* ---- Overview block — mirrors the homepage manifesto pattern ---- */}
      <section className="w-full pt-4 md:pt-12 pb-12 md:pb-20 px-4 md:px-0">
        {/* Section pill */}
        <span className="inline-block text-[11px] md:text-[13px] tracking-[0.06em] uppercase text-[#141414] font-medium px-4 py-2 rounded-full bg-[#141414]/[0.06] mb-5">
          <ScrambleOnView text="SECTION 01: OVERVIEW" />
        </span>

        {/* Title */}
        <h1 className="text-[22px] md:text-[24px] leading-[1.5] tracking-[-0.02em] font-bold">
          A shelf of staples I keep coming back to.
        </h1>

        {/* Body — flows directly under the headline as one block, like the homepage */}
        <p className="text-[22px] md:text-[24px] leading-[1.5] tracking-[-0.02em] font-normal text-[#141414]">
          The people, the work, the rooms - the things that show up in everything I make, whether I notice or not. Plus the occasional piece I write about why they matter.
        </p>

        {/* Closing line — quieter, secondary lens. Acts as the tagline that
            frames how Reckon*House and House*Staples relate. */}
        <p className="mt-4 text-[14px] md:text-[16px] leading-[1.6] text-foreground/70 mb-6">
          Reckon*House is what gets made. House*Staples is what holds it up.
        </p>

        {/* Meta fields — matches homepage pattern */}
        <div className="text-spec text-foreground/90">
          <p>
            <span className="font-bold">Field: </span>
            Visual Reference
          </p>
          <p>
            <span className="font-bold">Saved by: </span>
            Jeremy Prasatik
            {" | Updated: "}
            Regularly
            {" | Status: "}
            Personal
          </p>
          <p>
            <span className="font-bold">Classification: </span>
            People | Rooms | Objects | Words
          </p>
          <p>
            <span className="font-bold">Rights: </span>
            Not mine, no claim made, all credit to the makers
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

      {/* ---- Masonry board ----
           CSS columns layout — natural aspect ratios preserved, browser handles
           wrap. 4 columns on desktop, 2 on mobile, generous gaps to start.
           Each item uses break-inside: avoid so it doesn't split across columns. */}
      <section className="pb-24 px-4 md:px-0">
        <div
          className="columns-2 lg:columns-4"
          style={{ columnGap: "40px" }}
        >
          {/* Now-playing tile — drops into the masonry as a 1×1 album-art
              card with a small "Last Played" overlay. Renders nothing if
              no recent track is available, so the column flow stays clean. */}
          <div className="mb-10 md:mb-12 break-inside-avoid">
            <NowPlaying />
          </div>

          {items.map((item) => (
            <div
              key={item.kind === "image" ? item.src : item.key}
              className="mb-10 md:mb-12 break-inside-avoid overflow-hidden"
              style={{ borderRadius: "clamp(18px, 3.5vw, 36px)" }}
            >
              {item.kind === "image" ? (
                (() => {
                  // Real dimensions from the manifest let next/image reserve
                  // exact space (no layout shift as the masonry fills in) and
                  // serve responsive AVIF/WebP. Masonry shows 2 cols on mobile,
                  // 4 on desktop, so each tile is ~half / quarter viewport.
                  const [w, h] = getImageDimensions(item.src);
                  return (
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={w}
                      height={h}
                      sizes="(min-width: 1024px) 24vw, 48vw"
                      loading="lazy"
                      className="block w-full h-auto"
                    />
                  );
                })()
              ) : (
                <InspirationQuoteTile text={item.text} attribution={item.attribution} />
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
