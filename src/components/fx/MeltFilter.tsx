/**
 * MeltFilter — the nav's displacement chain, as one definition.
 *
 * fractalNoise 0.015 0.025, three octaves, seed 8, blurred by 2 and fed to
 * a displacement map. Only `scale` ever animates; the caller owns it
 * through `dispRef` and decides what the melt MEANS — RevealHeadline
 * decays it to zero so letters arrive out of a smear, PressingSystemIndex
 * runs it up and back down so one word liquefies into the next.
 *
 * It lives here because it is now in two hands. The numbers are tuned
 * against the prototype and copying them a second time is how a chain like
 * this quietly becomes two slightly different chains.
 *
 * Two things the callers must keep doing, both learned the hard way:
 * give every instance its OWN id (two headlines sharing a filter fight
 * over `scale`), and take the element OUT of the pipeline at rest — text
 * left inside a filter renders soft, and these have to be sharp when they
 * are not moving.
 */

import type { RefObject } from "react";

export interface MeltFilterProps {
  /** Unique per instance. Two elements on one filter fight over `scale`. */
  id: string;
  /** The caller's handle on the one animated attribute. */
  dispRef: RefObject<SVGFEDisplacementMapElement | null>;
}

export function MeltFilter({ id, dispRef }: MeltFilterProps) {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute" }}
    >
      <filter
        id={id}
        x="-25%"
        y="-25%"
        width="150%"
        height="150%"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.015 0.025"
          numOctaves={3}
          seed={8}
          result="n"
        />
        <feGaussianBlur in="n" stdDeviation={2} result="sm" />
        <feDisplacementMap
          ref={dispRef}
          in="SourceGraphic"
          in2="sm"
          scale={0}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
