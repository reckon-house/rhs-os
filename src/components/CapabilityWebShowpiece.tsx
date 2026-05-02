"use client";

/**
 * CapabilityWebShowpiece — current variant: pure 2D SVG chart with
 * 3D-rendered orbs (radial gradients + soft drop shadows) so each element
 * reads as a glossy sphere while the chart stays a flat top-down chart.
 *
 * The WebGL variant (CapabilityWeb3D.tsx) is kept around as an alternate
 * renderer — flip USE_WEBGL_VARIANT to `true` to dynamically import it
 * once an IntersectionObserver fires. That path costs ~150 KB and a
 * dynamic chunk; the SVG path is free.
 */

import { CapabilityWebHeader, CapabilityWebChart2D } from "@/components/CapabilityWeb";

export function CapabilityWebShowpiece({ dark = true }: { dark?: boolean } = {}) {
  return (
    <div className="w-full">
      <CapabilityWebHeader dark={dark} />
      <CapabilityWebChart2D dark={dark} />
    </div>
  );
}
