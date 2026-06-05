import type { CSSProperties } from "react";

// Stable 0..1 value from a string seed + salt. FNV-1a-ish. Deterministic, so a
// thumbnail's depth and idle-float timing are fixed across renders but differ
// from its neighbors.
function hash01(str: string, salt: number): number {
  let h = (2166136261 ^ salt) >>> 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return ((h >>> 0) % 10000) / 10000;
}

/**
 * Per-thumbnail depth + idle-float CSS variables, derived from a stable seed
 * (the project title). Each card floats on its own clock and sits on its own
 * warm depth shadow, so the grid feels like objects resting on the desk rather
 * than one flat plane. Consumed by `.thumb-float` / `.thumb-card` in globals.css.
 */
export function thumbMotionVars(seed: string): { float: CSSProperties; card: CSSProperties } {
  const depth = hash01(seed, 7); // 0..1 — "closeness"
  const dir = hash01(seed, 29) > 0.5 ? 1 : -1; // orbit + faux-3D turn direction
  const float = {
    "--dur": `${(7 + hash01(seed, 13) * 5).toFixed(2)}s`,             // 7–12s
    "--delay": `${(-hash01(seed, 17) * 12).toFixed(2)}s`,             // negative — desync phase
    "--amp": `${(-(2 + hash01(seed, 11) * 2)).toFixed(1)}px`,         // -2 to -4px — subtler vertical
    "--ampX": `${((1.5 + hash01(seed, 19) * 1.8) * dir).toFixed(1)}px`, // ±1.5–3.3px horizontal drift
    "--tilt": `${((2 + hash01(seed, 23) * 2.5) * dir).toFixed(2)}deg`,  // ±2–4.5° faux-3D y-turn
  } as CSSProperties;
  const card = {
    "--rs": (0.97 + depth * 0.06).toFixed(3),                        // resting scale 0.97–1.03
    // Tighter, offset, angled drop (directional light from the upper-left), as
    // components so the CSS can fade it in with scroll energy (--e). At rest
    // every term resolves to ~0, so the card lies flat with no shadow.
    "--sh-x": `${(4 + depth * 3).toFixed(1)}px`,
    "--sh-y": `${(5 + depth * 4).toFixed(1)}px`,
    "--sh-blur": `${(9 + depth * 9).toFixed(1)}px`,
    "--sh-a": (0.12 + depth * 0.06).toFixed(3),
  } as CSSProperties;
  return { float, card };
}
