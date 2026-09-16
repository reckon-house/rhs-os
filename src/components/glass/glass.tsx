"use client";

/* ── THE GLASS ─────────────────────────────────────────────────────────
 * The mechanism a page of columns shares with the board, in one place
 * so /daybook and /custom cannot drift: the ink a column draws on its
 * rule as it scrolls, the count of what is left below the reading line,
 * the columns still past the glass, the rise under a curtain, and the
 * two ways a row turns without a pointer (shift and a wheel, the arrow
 * keys). Every number is assemble-board.py's; glass.module.css names
 * where each came from. A page keeps its own material, and its own
 * reasons to redraw.
 */

import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { afterCurtain, arrivalsHeld } from "@/lib/curtain";
import styles from "./glass.module.css";

type Box = RefObject<HTMLDivElement | null>;

export const still = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const columnsIn = (strip: HTMLElement) =>
  Array.from(strip.querySelectorAll<HTMLElement>(`.${styles.col}`)).filter((c) => !c.hidden);

/* ── THE INK AND THE COUNT (assemble-board.py, dressRules) ──────────
   The ink is the column's scroll, drawn on its rule: a segment as long
   as the glass is of the column, travelling as far down the rule as
   the column has scrolled. The count is what is left below a reading
   line that sweeps from the top of the glass to its foot as the column
   runs to its end, so it is every unit before the reader scrolls, one
   at the bottom, and never jumps between. A column that fits the glass
   has nothing to count, and says nothing. */
function writeCount(yc: HTMLElement, n: number | null) {
  const key = n == null ? "" : String(n);
  if (yc.dataset.n === key) return;
  yc.dataset.n = key;
  if (!key) {
    yc.replaceChildren();
    return;
  }
  yc.replaceChildren(
    ...["+", key, "↓"].map((t) => {
      const s = document.createElement("span");
      s.textContent = t;
      return s;
    })
  );
}

/** `unit` is the selector of what the count counts: an entry on the
 *  daybook, a row on /custom. */
export function dressColumn(c: HTMLElement, onGlass: boolean, unit: string) {
  const cin = c.querySelector<HTMLElement>(`.${styles.cin}`);
  const rule = c.querySelector<HTMLElement>(`.${styles.rule}`);
  const rg = c.querySelector<HTMLElement>(`.${styles.rg}`);
  const yc = c.querySelector<HTMLElement>(`.${styles.yc}`);
  if (!cin || !rule || !rg || !yc) return;
  const max = cin.scrollHeight - cin.clientHeight;
  /* a column turned off the glass leaves its rule standing at the
     strip's edge, half cut; the board draws nothing for a column
     nobody can see, so its ink and its count go with it */
  if (max <= 1 || !onGlass) {
    rg.classList.remove(styles.on);
    writeCount(yc, null);
    return;
  }
  const H = rule.clientHeight;
  const seg = Math.max(24, (H * cin.clientHeight) / cin.scrollHeight);
  const at = clamp01(cin.scrollTop / max);
  rg.classList.add(styles.on);
  rg.style.top = `${at * (H - seg)}px`;
  rg.style.height = `${seg}px`;

  const tops = Array.from(cin.querySelectorAll<HTMLElement>(unit))
    .filter((el) => !el.hidden)
    .map((el) => el.offsetTop);
  if (tops.length < 2) {
    writeCount(yc, null);
    return;
  }
  const line = cin.scrollTop + at * cin.clientHeight;
  let crossed = 0;
  for (const y of tops) if (y <= line) crossed += 1;
  writeCount(yc, tops.length - Math.max(0, crossed - 1));
}

/* the columns past the glass: a column the glass does not hold whole,
   so the fifth of the next one showing still counts, as on the board */
export function pastGlass(strip: HTMLElement, cols: HTMLElement[]) {
  const edge = strip.scrollLeft + strip.clientWidth + 1;
  return cols.filter((c) => c.offsetLeft + c.offsetWidth > edge).length;
}

/* ── THE RISE (assemble-board.py, .tile.lines .crow) ────────────────
   What is on the glass arrives the way the board's lists do: up and
   in, a column at a time, each piece a beat behind the one above. Only
   what can be seen is armed; the rest of a column already stands where
   it will be when the reader scrolls to it. Returns the release. */
export function armRise(strip: HTMLElement): () => void {
  const cast: HTMLElement[] = [];
  const edge = strip.scrollLeft + strip.clientWidth;
  columnsIn(strip).forEach((c, k) => {
    if (c.offsetLeft >= edge) return;
    const cin = c.querySelector<HTMLElement>(`.${styles.cin}`);
    if (!cin) return;
    const floor = cin.scrollTop + cin.clientHeight;
    let i = 0;
    cin.querySelectorAll<HTMLElement>(`.${styles.rise}`).forEach((el) => {
      if (el.hidden || el.offsetTop > floor) return;
      el.style.setProperty("--lag", `${k * 90 + i * 45}ms`);
      el.classList.add(styles.pre);
      cast.push(el);
      i += 1;
    });
  });
  let done = false;
  return () => {
    if (done) return;
    done = true;
    cast.forEach((el) => el.classList.remove(styles.pre));
  };
}

/** one column along, the way a page turns on the board */
export function turnRow(strip: HTMLElement, dir: 1 | -1) {
  const col = strip.querySelector<HTMLElement>(`.${styles.col}`);
  if (!col) return;
  strip.scrollTo({
    left: strip.scrollLeft + dir * col.offsetWidth,
    behavior: still() ? "auto" : "smooth",
  });
}

export function Rule() {
  /* an <i> is italic by default, and the count inherits it: the
     module sets it upright, as the board's own rule had to */
  return (
    <i className={styles.rule} aria-hidden="true">
      <span className={styles.rg} />
      <span className={styles.yc} />
    </i>
  );
}

/* ── ARRIVING UNDER THE CURTAIN ─────────────────────────────────────
   Armed only when a curtain covers the page, and released when it has
   finished lifting. Opened directly, the page is already on the glass,
   and hiding it to bring it back would be a blink. */
export function useArrival(stripRef: Box) {
  useLayoutEffect(() => {
    const strip = stripRef.current;
    if (!strip || still() || !arrivalsHeld()) return;
    const release = armRise(strip);
    afterCurtain(() => requestAnimationFrame(() => requestAnimationFrame(release)));
    const belt = window.setTimeout(release, 6000);
    return () => {
      window.clearTimeout(belt);
      release();
    };
  }, [stripRef]);
}

/* the ink, the counts and the columns past the glass, redrawn on the
   next frame after anything that could move them. `key` is whatever a
   page changes that rebuilds its columns; the count of columns past
   the glass comes back for the cover line. */
export function useGlass(rootRef: Box, stripRef: Box, unit: string, key: string): number {
  const [past, setPast] = useState(0);
  useEffect(() => {
    const root = rootRef.current;
    const strip = stripRef.current;
    if (!root || !strip) return;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const cols = columnsIn(strip);
      cols.forEach((c) => dressColumn(c, c.offsetLeft + c.offsetWidth > strip.scrollLeft + 2, unit));
      setPast(pastGlass(strip, cols));
    };
    const ask = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    root.addEventListener("scroll", ask, { capture: true, passive: true });
    root.addEventListener("load", ask, true);
    window.addEventListener("resize", ask, { passive: true });
    document.fonts?.ready.then(ask).catch(() => {});
    ask();
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("scroll", ask, true);
      root.removeEventListener("load", ask, true);
      window.removeEventListener("resize", ask);
    };
  }, [rootRef, stripRef, unit, key]);
  return past;
}

/* ── THE ROW TURNS WITHOUT A POINTER ────────────────────────────────
   SHIFT AND A WHEEL, as on the board (assemble-board.py reads
   e.shiftKey ? e.deltaY : e.deltaX). A trackpad, and a Mac's own
   shift-wheel, already arrive sideways and scroll the row natively; a
   plain wheel with shift held arrives vertical, so it turns one column
   per notch, with a beat between turns so a spinning wheel does not
   run the row to its end. And the arrow keys, as a page turns. */
export function useTurns(stripRef: Box) {
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    let acc = 0;
    let until = 0;
    const onWheel = (e: WheelEvent) => {
      if (!e.shiftKey || Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;
      e.preventDefault();
      const now = performance.now();
      if (now < until) return;
      acc += e.deltaY;
      if (Math.abs(acc) < 40) return;
      turnRow(strip, acc > 0 ? 1 : -1);
      acc = 0;
      until = now + 450;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable]")) return;
      e.preventDefault();
      turnRow(strip, e.key === "ArrowRight" ? 1 : -1);
    };
    strip.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      strip.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [stripRef]);
}
