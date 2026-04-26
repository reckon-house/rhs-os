"use client";

/**
 * ScrambleText — character-locking scramble animation for section labels.
 *
 * Two exports:
 *   - <ScrambleText text trigger />   — controlled. Pass trigger=true to start.
 *   - <ScrambleOnView text />         — uncontrolled. Triggers when scrolled into view.
 *
 * Animation: 500ms, characters lock left-to-right. Spaces, colons, and slashes
 * are preserved (no scramble) so labels like "SECTION 02: DATA VIZ" stay legible
 * during the animation.
 */

import { useEffect, useRef, useState } from "react";

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789αβγδεζηθλμπσφψω∑∏∫∂√∞≈≠±÷×∆◊†‡§¶";

export function ScrambleText({ text, trigger }: { text: string; trigger: boolean }) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!trigger) return;

    const target = text;
    const duration = 500;
    const startTime = Date.now();
    let frameCount = 0;

    const animate = () => {
      frameCount++;
      // Update every 2nd frame for a stop-motion feel
      if (frameCount % 2 !== 0) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const lockedCount = Math.floor(progress * target.length);

      const result = target
        .split("")
        .map((char, i) => {
          if (char === " " || char === ":" || char === "/") return char;
          if (i < lockedCount) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

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

export function ScrambleOnView({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

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
    <span ref={ref}>
      <ScrambleText text={text} trigger={visible} />
    </span>
  );
}
