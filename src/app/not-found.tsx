import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

/**
 * Custom 404. Renders inside the root layout, so it inherits the grain/grid +
 * SpringSolve background, NavRail, and Satoshi. Returns a proper 404 status
 * automatically (App Router). Links back so a dead URL never dead-ends a
 * visitor or a crawler.
 */
export default function NotFound() {
  return (
    <main className="relative z-10 flex min-h-dvh w-full flex-col items-center justify-center px-6 pb-32 text-center">
      <span className="mb-6 inline-block rounded-full bg-[#141414]/[0.06] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.06em] text-[#141414] md:text-[13px]">
        Error 404
      </span>

      <h1 className="text-[88px] font-bold leading-none tracking-[-0.03em] text-foreground md:text-[120px]">
        404
      </h1>

      <p className="mt-6 max-w-[440px] text-[16px] leading-[1.5] text-foreground/70 md:text-[18px]">
        That page isn&apos;t in the system. Moved, renamed, or never built.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[14px] md:text-[15px]">
        <Link
          href="/"
          className="font-bold underline underline-offset-4 transition-colors hover:text-foreground/60"
        >
          Back to the work
        </Link>
        <span className="text-foreground/30">/</span>
        <Link
          href="/category/digital"
          className="underline underline-offset-4 transition-colors hover:text-foreground/60"
        >
          Digital
        </Link>
        <Link
          href="/category/creative"
          className="underline underline-offset-4 transition-colors hover:text-foreground/60"
        >
          Creative
        </Link>
        <Link
          href="/category/interiors"
          className="underline underline-offset-4 transition-colors hover:text-foreground/60"
        >
          Interiors
        </Link>
      </div>
    </main>
  );
}
