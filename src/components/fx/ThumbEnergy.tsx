"use client";

import { useEffect } from "react";

/**
 * ThumbEnergy — drives the thumbnails' scroll-reactive "aliveness" on the homepage and
 * the category pages.
 *
 * Scroll velocity (read from the Lenis-driven `.content-scroll` element's native scroll
 * events) pumps `--e` / `--es` on #hp-grid. The thumbnail CSS scales its idle-float
 * amplitude and its shadow by those, so the grid wakes up while you move through it and
 * settles flat when you rest. One rAF loop that sleeps entirely once energy reaches 0.
 *
 * No-op under prefers-reduced-motion. Renders nothing.
 */
export function ThumbEnergy() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const scroller = document.querySelector<HTMLElement>(".content-scroll");
    // Scope the vars to the grid subtree (NOT :root) — writing a custom property on
    // :root invalidates style for the ENTIRE document every frame (SpringSolve's ~1000
    // SVG paths included). Scoped here, only the thumbnails recalc.
    const target = document.getElementById("hp-grid");
    if (!scroller || !target) return;

    let energy = 0;
    let last = scroller.scrollTop;
    let lastT = 0;
    let raf = 0;
    let running = false;

    let lastE = -1;
    let lastEs = -1;
    const write = () => {
      const eq = Math.round(energy * 20) / 20; // 0.05 steps (motion)
      if (eq !== lastE) { target.style.setProperty("--e", eq.toFixed(2)); lastE = eq; }
      const esq = Math.round(energy * 12) / 12; // ~0.083 steps (shadow)
      if (esq !== lastEs) { target.style.setProperty("--es", esq.toFixed(3)); lastEs = esq; }
    };

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

    // ── One-shot spray reveal ──
    // When a thumbnail's card first rises into the viewport, set data-in so its spray
    // plays the grow animation (CSS handles the stagger + landing). Done here off the
    // real scroll container because IntersectionObserver doesn't fire against it.
    const blots = [...target.querySelectorAll<HTMLElement>(".blot-ink")];
    let pending = blots.length;
    let blotRaf = 0;
    const checkBlots = (initial: boolean) => {
      blotRaf = 0;
      if (!pending) return;
      const scRect = scroller.getBoundingClientRect();
      const vh = scRect.height;
      const atEnd = scroller.scrollTop + vh >= scroller.scrollHeight - 4;
      // On load (or once scrolled to the very end of the page, where the last rows can't
      // reach mid-screen) reveal whatever's on screen; while scrolling, fire each spray
      // when its card crosses mid-screen, where the eye is, so the grow is noticed.
      const line = scRect.top + vh * (initial || atEnd ? 1 : 0.55);
      for (const ink of blots) {
        if (ink.dataset.in === "1") continue;
        const card = ink.parentElement;
        if (!card) { pending--; continue; }
        if (card.getBoundingClientRect().top < line) { ink.dataset.in = "1"; pending--; }
      }
    };
    const queueBlots = () => { if (!blotRaf && pending) blotRaf = requestAnimationFrame(() => checkBlots(false)); };

    const onScroll = () => {
      const now = scroller.scrollTop;
      const d = Math.abs(now - last);
      last = now;
      energy = Math.min(1, energy + d * 0.045); // velocity → energy
      ensure();
      queueBlots();
    };

    checkBlots(true); // reveal whatever is already on screen at load
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(blotRaf);
      target.style.setProperty("--e", "0");
      target.style.setProperty("--es", "0");
    };
  }, []);

  return null;
}
