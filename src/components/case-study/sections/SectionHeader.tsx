"use client";

import { useEffect, useRef, useState } from "react";
import type { SectionHeaderSection } from "@/lib/types";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789αβγδεζηθλμπσφψω∑∏∫∂√∞≈≠±÷×∆◊†‡§¶";

function ScrambleText({ text, trigger }: { text: string; trigger: boolean }) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!trigger) return;

    const target = text;
    const duration = 500; // total animation ms
    const startTime = Date.now();

    let frameCount = 0;

    const animate = () => {
      frameCount++;
      // Update every 2nd frame
      if (frameCount % 2 !== 0) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Characters lock in left-to-right
      const lockedCount = Math.floor(progress * target.length);

      const result = target.split("").map((char, i) => {
        if (char === " " || char === ":" || char === "/") return char;
        if (i < lockedCount) return char;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join("");

      setDisplay(result);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(target);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [trigger, text]);

  return <>{display}</>;
}

export function SectionHeader({ label, title, group, centered }: SectionHeaderSection) {
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
      <span className="inline-block text-[11px] md:text-[13px] tracking-[0.06em] uppercase text-[#141414] font-medium px-4 py-2 rounded-full bg-[#141414]/[0.06] mb-5">
        <ScrambleText text={label} trigger={visible} />
      </span>
      {title && (
        <h2 className="text-[16px] md:text-[24px] leading-[1.5] tracking-[-0.02em] font-bold">
          {title.replace(/\n/g, " ")}
        </h2>
      )}
    </section>
  );
}
