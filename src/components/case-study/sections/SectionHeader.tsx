"use client";

import { useEffect, useRef, useState } from "react";
import type { SectionHeaderSection } from "@/lib/types";
import { ScrambleText } from "@/components/fx/ScrambleText";

export function SectionHeader({ label, title, subhead, group, centered }: SectionHeaderSection) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const topPad = group ? "pt-4" : "";
  const align = centered ? "text-center" : "pl-0 md:pl-[calc(100%/24)]";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className={`w-full ${topPad} pb-0 ${align}`}>
      <span className="inline-block text-[10px] tracking-[0.06em] capitalize text-current font-medium px-4 py-2 rounded-full bg-current/[0.06] mb-5">
        <ScrambleText text={label.toLowerCase()} trigger={visible} />
      </span>
      {title && (
        <div className="text-[18px] md:text-[20px] leading-[1.5] tracking-[-0.02em] font-normal">
          <h2 className="inline font-bold">{title.replace(/\n/g, " ")}</h2>
          {subhead && <>{" "}{subhead}</>}
        </div>
      )}
    </section>
  );
}
