import Link from "next/link";
import { ScrambleOnView } from "@/components/fx/ScrambleText";
import { NowPlaying } from "@/components/NowPlaying";
import { inspiration } from "@/data/inspiration";

export default function InspirationPage() {
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
      <div className="h-[30px] md:h-[50px]" />

      {/* ---- Overview block — mirrors the homepage manifesto pattern ---- */}
      <section className="w-full pt-8 md:pt-12 pb-12 md:pb-20 px-4 md:px-0">
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

          {inspiration.map((item) => (
            <div
              key={item.src}
              className="mb-10 md:mb-12 break-inside-avoid overflow-hidden"
              style={{ borderRadius: "clamp(18px, 3.5vw, 36px)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="block w-full h-auto"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
