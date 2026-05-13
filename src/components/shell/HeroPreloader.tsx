"use client";

import { useEffect } from "react";

/**
 * HeroPreloader — quietly fetches every case study's opening hero image
 * after the current page is settled. Once cached, click → burn → reveal
 * never blinks because the destination's hero is already in memory.
 *
 * Runs via requestIdleCallback (or a 1.5s setTimeout fallback) so it
 * never competes with the in-view page's actual loading. Slides are
 * staggered 200ms apart so we don't blast the network.
 *
 * When adding a new case study, add its hero src to this list.
 */
const HERO_IMAGES = [
  "/case-studies/arc/arc-app-kitchen-project-selection-lifestyle.jpg",
  "/case-studies/sally-os/heroes/sally-os-platform-hero.jpg",
  "/case-studies/robert-rodriguez/neiman-marcus-robert-rodriguez-woman-cream-polka-dot-dress-pink-blazer-orange-yellow-backdrop-storefront-window-display-campaign.jpg",
  "/case-studies/black-white-type/typography-patterns-the-fancy-poster-wood-surface-lifestyle.jpg",
  "/case-studies/hill-country-kitchen/hill-country-kitchen-island-pendants-marble-wide.jpg",
  "/case-studies/ivy-park/ivy-park-nordstrom-laptop-brand-experience-mockup.jpg",
  "/case-studies/hill-country-bath/hill-country-bath-vanity-marble-globe-sconces-sage.jpg",
  "/case-studies/fairview-suite/fairview-suite-bedroom-chandelier-fireplace-windows-wide.jpg",
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

// On mobile (touch-only devices), cap the background preload at the first
// few heroes. Visitors don't browse 20 case studies on a phone the way they
// might on desktop; the rest are bandwidth taxes for views that won't happen.
// Desktop still preloads all of them.
const MOBILE_PRELOAD_LIMIT = 6;

export function HeroPreloader() {
  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const list = isMobile ? HERO_IMAGES.slice(0, MOBILE_PRELOAD_LIMIT) : HERO_IMAGES;

    const start = () => {
      if (cancelled) return;
      list.forEach((src, i) => {
        timers.push(
          setTimeout(() => {
            if (cancelled) return;
            const img = new Image();
            img.fetchPriority = "low";
            img.decoding = "async";
            img.src = src;
          }, i * STAGGER_MS),
        );
      });
    };

    // Wait for the browser to be idle. Falls back to a 1.5s setTimeout for
    // browsers without requestIdleCallback (Safari).
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
    if (typeof ric === "function") {
      const handle = ric(start, { timeout: 3000 });
      return () => {
        cancelled = true;
        timers.forEach(clearTimeout);
        const cic = (window as Window & { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
        if (typeof cic === "function") cic(handle);
      };
    }

    const fallback = setTimeout(start, 1500);
    return () => {
      cancelled = true;
      clearTimeout(fallback);
      timers.forEach(clearTimeout);
    };
  }, []);

  return null;
}
