"use client";

import { useEffect } from "react";

/**
 * ThumbEnergy — drives the homepage thumbnails' scroll-reactive "aliveness".
 *
 * Scroll velocity (read from the Lenis-driven `.content-scroll` element's
 * native scroll events) pumps a global `--e` (0..1) on <html>. When scrolling
 * stops, `--e` decays gracefully back to 0. The thumbnail CSS scales both its
 * float amplitude and its drop shadow by `--e`, so the grid wakes up while you
 * move through it and settles flat — with only a whisper of motion — when you
 * rest.
 *
 * One rAF loop, and it sleeps entirely once energy reaches 0 (no idle cost).
 * No-op under prefers-reduced-motion. Renders nothing.
 */
export function ThumbEnergy() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const scroller = document.querySelector<HTMLElement>(".content-scroll");
    // Scope the vars to the grid subtree (NOT :root) — writing a custom
    // property on :root invalidates style for the ENTIRE document every frame
    // (SpringSolve's ~1000 SVG paths included), which is what made scrolling
    // janky. Scoped here, only the ~29 thumbnails recalc.
    const target = document.getElementById("hp-grid");
    if (!scroller || !target) return;

    let energy = 0;
    let last = scroller.scrollTop;
    let lastT = 0;
    let raf = 0;
    let running = false;

    // --e drives motion (transform → GPU); --es drives the shadow. Both are
    // quantized and skip redundant writes, so while energy is pinned during a
    // sustained scroll neither is rewritten and there's no per-frame recalc.
    let lastE = -1;
    let lastEs = -1;
    const write = () => {
      const eq = Math.round(energy * 20) / 20; // 0.05 steps (motion)
      if (eq !== lastE) { target.style.setProperty("--e", eq.toFixed(2)); lastE = eq; }
      const esq = Math.round(energy * 12) / 12; // ~0.083 steps (shadow)
      if (esq !== lastEs) { target.style.setProperty("--es", esq.toFixed(3)); lastEs = esq; }
    };

    // Only the rAF writes (once per frame); scroll events just update energy.
    const tick = (t: number) => {
      if (!lastT) lastT = t;
      const dt = Math.min(0.05, (t - lastT) / 1000);
      lastT = t;
      energy *= Math.exp(-dt / 0.5); // graceful settle, tau ~0.5s
      write();
      if (energy < 0.0025) {
        energy = 0;
        running = false;
        lastT = 0;
        write();
        return; // loop sleeps until the next scroll
      }
      raf = requestAnimationFrame(tick);
    };

    const ensure = () => {
      if (running) return;
      running = true;
      lastT = 0;
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const now = scroller.scrollTop;
      const d = Math.abs(now - last);
      last = now;
      energy = Math.min(1, energy + d * 0.045); // velocity → energy
      ensure();
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      target.style.setProperty("--e", "0");
      target.style.setProperty("--es", "0");
    };
  }, []);

  return null;
}
