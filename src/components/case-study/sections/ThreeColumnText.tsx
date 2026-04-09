"use client";

import { useState } from "react";
import type { ThreeColumnTextSection } from "@/lib/types";

function Accordion({ title, content, defaultOpen }: { title?: string; content: string; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-foreground/10 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        {title && (
          <h3 className="text-[11px] font-bold leading-[1.875]">{title}</h3>
        )}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`shrink-0 ml-2 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${open ? "max-h-[1000px] opacity-100 pb-4" : "max-h-0 opacity-0"}`}
      >
        {content.split("\n\n").map((p, i) => (
          <p key={i} className="text-[11px] leading-[1.875] text-current/80 mb-3 last:mb-0">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}

export function ThreeColumnText({ columns }: ThreeColumnTextSection) {
  return (
    <section className="w-full pt-2 pb-8 md:px-[calc(100%/24)]">
      {/* Mobile: Accordion */}
      <div className="md:hidden px-1">
        {columns.map((col, i) => (
          <Accordion
            key={i}
            title={col.title}
            content={col.content}
            defaultOpen={i === 0}
          />
        ))}
      </div>

      {/* Desktop: Side-by-side grid */}
      <div className="hidden md:block space-y-10">
        {columns.map((col, i) => (
          <div key={i} className="grid grid-cols-12 gap-x-5">
            {col.title && (
              <h3 className="col-span-3 text-[11px] md:text-[14px] font-bold leading-[1.875] pt-[3px]">
                {col.title}
              </h3>
            )}
            <div className={`${col.title ? "col-start-7 col-span-6" : "col-span-12"}`}>
              {col.content.split("\n\n").map((p, j) => (
                <p key={j} className="text-[11px] md:text-[14px] leading-[1.875] text-current/80 mb-4 last:mb-0">
                  {p}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
