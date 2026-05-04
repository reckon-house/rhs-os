import { CapabilityWebHeader, CapabilityWebChart2D } from "@/components/CapabilityWeb";
import { AnimatedDarkCard } from "@/components/fx/AnimatedDarkCard";

/* ------------------------------------------------------------------ */
/*  SiteFooter                                                          */
/*                                                                      */
/*  The dark footer card that closes every page in the site —          */
/*  homepage, category pages, and case studies. Composition:           */
/*    • Editorial headline (Designing across space and material.)      */
/*    • CapabilityWebHeader text block (SECTION: PRACTICE + meta)      */
/*    • CapabilityWebChart2D — the orbiting bubble chart               */
/*    • Copyright line                                                  */
/*                                                                      */
/*  Layout rule: the headline and CapabilityWebHeader sit inside a     */
/*  max-w-[1400px] container so the text stays comfortably readable.   */
/*  The chart visualization breaks out of that container so its        */
/*  cosmic background and outer label ring fill the full dark card    */
/*  width — i.e. all the way to the viewport edges. Copyright drops    */
/*  back into the constrained container.                                */
/*                                                                      */
/*  Background scale + corner-radius animation is owned by             */
/*  AnimatedDarkCard. The chart scales in lockstep via --card-scale.   */
/* ------------------------------------------------------------------ */

export function SiteFooter() {
  return (
    // Both the AnimatedDarkCard's section and the dark tail below carry
    // data-nav-dark — the NavRail watches for any element with this
    // attribute to overlap its vertical position and inverts its text /
    // icon / divider colors accordingly.
    <>
      <AnimatedDarkCard navDark>
        {/* Headline + chart-header — constrained for readability */}
        <div className="px-0 md:px-[50px]">
          <div
            className="max-w-[1400px] mx-auto"
            style={{ padding: "clamp(40px, 6vw, 80px) clamp(24px, 5vw, 64px) 0" }}
          >
            <h2 className="text-[#F0EAE4] text-[44px] md:text-[88px] font-light leading-[1.05] tracking-[-0.03em] text-center whitespace-pre-line py-12 md:py-20">
              {"Designing across\nspace and material."}
            </h2>

            <CapabilityWebHeader dark />
          </div>
        </div>

        {/* Chart — breaks out of max-w-[1400px] to fill full dark card width */}
        <div
          className="will-change-transform"
          style={{
            transform: "scale(var(--card-scale, 1))",
            transformOrigin: "center center",
          }}
        >
          <CapabilityWebChart2D dark />
        </div>

        {/* Copyright — back to constrained */}
        <div className="px-0 md:px-[50px]">
          <div
            className="max-w-[1400px] mx-auto"
            style={{ padding: "0 clamp(24px, 5vw, 64px) clamp(40px, 6vw, 80px)" }}
          >
            <p className="mt-20 md:mt-32 text-spec text-center text-[#F0EAE4]/50">
              &copy; 2026 Reckon House. Made by Jeremy Prasatik.
            </p>
          </div>
        </div>
      </AnimatedDarkCard>

      {/* Dark tail — covers main's pb-[90px] so the cream html background
          doesn't show through between the dark card and the bottom of the
          page (i.e. the strip behind the floating NavRail bar). The
          negative bottom margin pulls the tail into main's padding area
          so its background extends all the way to the viewport bottom. */}
      <div
        aria-hidden
        data-nav-dark
        className="hero-breakout"
        style={{
          backgroundColor: "#141414",
          height: "90px",
          marginTop: "-1px",
          marginBottom: "-90px",
        }}
      />
    </>
  );
}
