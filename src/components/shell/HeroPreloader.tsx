"use client";

import { useEffect } from "react";

/**
 * HeroPreloader — warms a case study's opening hero so that
 * click → burn → reveal never blinks on an image that has not arrived.
 *
 * TWO STRATEGIES, AND THE PHONE ONLY GETS ONE.
 *
 * On every device, a hero is warmed the moment a pointer lands on a link
 * to its study. That is the cheapest possible version of this: exactly
 * one image, and only ever the one being opened.
 *
 * On desktop it ALSO sweeps the whole list on idle, staggered so it does
 * not blast the network.
 *
 * On a phone it used to do the same sweep capped at six, which measured
 * 5.22 MB of full-size heroes on EVERY route — including /book, which
 * renders no images of its own, so someone booking a call paid the whole
 * bill for studies they never asked about. Six right answers out of
 * thirty is a bad bet at that price, so the sweep is desktop-only now.
 * What covers the phone instead is the touchstart above plus the burn's
 * own HOLD_MIN_MS, which is 520ms of screen before the hero is needed.
 *
 * Nothing runs at all under Save-Data or on a 2g/3g link.
 *
 * When adding a new case study, add its hero src to this list. The slug
 * is read back out of the path, so nothing else needs updating.
 */
const HERO_IMAGES = [
  "/case-studies/arc/arc-app-kitchen-project-selection-lifestyle.jpg",
  "/case-studies/sally-os/heroes/sally-os-platform-hero.jpg",
  "/case-studies/robert-rodriguez/neiman-marcus-robert-rodriguez-woman-cream-polka-dot-dress-pink-blazer-orange-yellow-backdrop-storefront-window-display-campaign.jpg",
  "/case-studies/black-white-type/typography-patterns-the-fancy-poster-wood-surface-lifestyle.jpg",
  "/case-studies/hill-country-kitchen/hill-country-kitchen-island-pendants-marble-wide.jpg",
  "/case-studies/ivy-park/ivy-park-nordstrom-laptop-brand-experience-mockup.jpg",
  "/case-studies/hill-country-bath/hill-country-bath-vanity-marble-globe-sconces-sage.jpg",
  "/case-studies/fairview-bedroom/fairview-suite-bedroom-chandelier-fireplace-windows-wide.jpg",
  "/case-studies/fairview-sitting/fairview-sitting-stacked-stone-fireplace-charcoal-velvet-swivels-brass-coffee-table.jpg",
  "/case-studies/j-christianson/j-christianson-storefront-tree-stripe-window-mockup.jpg",
  "/case-studies/nordstrom-beauty/nordstrom-beauty-hub-laptop-homepage-mockup.jpg",
  "/case-studies/neiman-marcus/neiman-marcus-insite-contemporary-art-magazine-hands-mockup.jpg",
  "/case-studies/loved-by-nordstrom/loved-by-nordstrom-gallery-wall-campaign-tiles-tibi-center.jpg",
  "/case-studies/branding-graphics/branding-graphics-inna-foil-zine-orange-dress-lifestyle.jpg",
  "/case-studies/nordstrom-personalization/nordstrom-personalization-system-design-laptop-website-interface-fashion-ecommerce-floral-field-outdoor-lifestyle.jpg",
  "/case-studies/capitan-boot-co/capitan-boot-co-western-original-desert-landscape-cattle-skull-logo-prickly-pear-cactus-agave-plants-arid-mountains-branding-campaign.jpg",
  // amber-shockey-co opens with a hero-carousel; preload the first slide
  "/case-studies/amber-shockey-co/amber-shockey-co-blue-florals-plates-stacked-on-peony-pattern-collection-mockup.jpg",
  // cosmo-prof opens with a single hero, then has a hero-carousel inside
  "/case-studies/cosmo-prof/cosmo-prof-photography-direction-hair-color-brushes-product-detail-quad-composition.jpg",
  "/case-studies/hill-country-oak/hill-country-oakworks-outdoor-banner-whiskey-barrels-colorful-background-tree-texas-born-oakcraft.jpg",
  "/case-studies/jeffrey-spring/jeffrey-spring-campaign-simone-rocha-floral-dress-monstera-frame.jpg",
];

const STAGGER_MS = 200;

/* WHICH HERO BELONGS TO WHICH STUDY. Derived rather than declared: every
   path above is /case-studies/<slug>/…, so the slug is already in the
   data and a second hand-maintained map would be one more thing to
   forget when a study is added. */
const HERO_BY_SLUG = new Map<string, string>(
  HERO_IMAGES.map((src) => [src.split("/")[2], src] as const)
);

const warmed = new Set<string>();
function warm(src: string) {
  if (warmed.has(src)) return;
  warmed.add(src);
  const img = new Image();
  img.fetchPriority = "low";
  img.decoding = "async";
  img.src = src;
}

/* SAVE-DATA AND SLOW LINKS GET NOTHING. Speculative bytes are the first
   thing that should go when someone has said, or their network has said
   for them, that bytes are expensive. navigator.connection is absent on
   Safari, and absent reads as "no objection" rather than "assume the
   worst" — the alternative disables this everywhere on iOS. */
type Conn = { saveData?: boolean; effectiveType?: string };
function bytesAreCheap(): boolean {
  const c = (navigator as Navigator & { connection?: Conn }).connection;
  if (!c) return true;
  if (c.saveData) return false;
  return !/(^|-)2g$|^3g$/.test(c.effectiveType ?? "");
}

export function HeroPreloader() {
  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (!bytesAreCheap()) return;

    /* ── warm on intent, on every device ──────────────────────────
       The one hero worth having is the one being opened, and a pointer
       says which that is. Delegated on the document because the grid is
       injected by the homepage driver and re-dealt on every query, so
       per-link listeners would have to be re-attached each time.

       touchstart, not click: it fires before the navigation commits, and
       the burn holds the screen for at least HOLD_MIN_MS afterwards
       (PressingTransition.tsx:47), so there is a real window even on a
       tap. pointerenter covers the desktop hover, which is far more
       generous. */
    const onIntent = (e: Event) => {
      const el = (e.target as Element | null)?.closest?.("a[href*='/case-studies/']");
      const href = el?.getAttribute("href");
      const slug = href?.split("/case-studies/")[1]?.split(/[/?#]/)[0];
      const src = slug && HERO_BY_SLUG.get(slug);
      if (src) warm(src);
    };
    document.addEventListener("pointerenter", onIntent, { capture: true, passive: true });
    document.addEventListener("touchstart", onIntent, { capture: true, passive: true });

    /* ── the speculative sweep, desktop only ──────────────────────
       It used to run on phones too, capped at six, and that was 5.22 MB
       of full-size heroes on EVERY route — including /book, which
       renders no images of its own, so a booking visitor paid the whole
       bill for studies they had not asked about. Six of thirty is a bad
       bet at that price. On a phone the intent listener above is the
       whole strategy; on desktop the bandwidth is usually there and a
       hover gives less warning than a hover on a big screen suggests. */
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    const start = () => {
      if (cancelled || isTouch) return;
      HERO_IMAGES.forEach((src, i) => {
        timers.push(setTimeout(() => { if (!cancelled) warm(src); }, i * STAGGER_MS));
      });
    };

    // Wait for the browser to be idle. Falls back to a 1.5s setTimeout for
    // browsers without requestIdleCallback (Safari).
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
    let handle: number | undefined;
    let fallback: ReturnType<typeof setTimeout> | undefined;
    if (typeof ric === "function") handle = ric(start, { timeout: 3000 });
    else fallback = setTimeout(start, 1500);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      if (fallback !== undefined) clearTimeout(fallback);
      if (handle !== undefined) {
        const cic = (window as Window & { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
        if (typeof cic === "function") cic(handle);
      }
      document.removeEventListener("pointerenter", onIntent, { capture: true });
      document.removeEventListener("touchstart", onIntent, { capture: true });
    };
  }, []);

  return null;
}
