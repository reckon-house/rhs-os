/** Canvas dominant-color extraction for SizzleReel: downsample to 64px,
 *  quantize to 16 levels per channel, count buckets, pick the top hits that
 *  stay mutually distinct, then order loudest-first (the flash and word
 *  frames read best in the most saturated pick). Near-white and near-black
 *  only qualify when they truly dominate. Runs entirely in the browser on
 *  same-origin or object-URL images; nothing leaves the page. */
export async function extractPalette(srcs: string[], count = 5): Promise<string[]> {
  const buckets = new Map<string, { n: number; r: number; g: number; b: number }>();
  for (const src of srcs) {
    await new Promise<void>((resolve) => {
      const im = new window.Image();
      im.crossOrigin = "anonymous";
      im.onload = () => {
        const w = 64;
        const h = Math.max(1, Math.round((im.naturalHeight / im.naturalWidth) * w));
        const cv = document.createElement("canvas");
        cv.width = w;
        cv.height = h;
        const cx = cv.getContext("2d");
        if (!cx) return resolve();
        cx.drawImage(im, 0, 0, w, h);
        let data: Uint8ClampedArray;
        try {
          data = cx.getImageData(0, 0, w, h).data;
        } catch {
          return resolve(); // tainted canvas (cross-origin) — skip
        }
        for (let p = 0; p < data.length; p += 4) {
          const r = data[p], g = data[p + 1], b = data[p + 2];
          const key = `${r >> 4},${g >> 4},${b >> 4}`;
          const cur = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
          cur.n++;
          cur.r += r;
          cur.g += g;
          cur.b += b;
          buckets.set(key, cur);
        }
        resolve();
      };
      im.onerror = () => resolve();
      im.src = src;
    });
  }
  const total = [...buckets.values()].reduce((s, v) => s + v.n, 0) || 1;
  const ranked = [...buckets.values()]
    .map((v) => ({
      n: v.n,
      r: Math.round(v.r / v.n),
      g: Math.round(v.g / v.n),
      b: Math.round(v.b / v.n),
    }))
    .map((c) => {
      const max = Math.max(c.r, c.g, c.b), min = Math.min(c.r, c.g, c.b);
      const sat = max === 0 ? 0 : (max - min) / max;
      const extreme = (c.r > 235 && c.g > 235 && c.b > 235) || (c.r < 20 && c.g < 20 && c.b < 20);
      // weight: frequency x saturation boost; extremes need real dominance
      const w = extreme && c.n / total < 0.4 ? 0 : c.n * (1 + sat * 2.2);
      return { ...c, w };
    })
    .filter((c) => c.w > 0)
    .sort((a, b) => b.w - a.w);
  const picks: { r: number; g: number; b: number }[] = [];
  for (const c of ranked) {
    if (picks.length >= count) break;
    const distinct = picks.every(
      (p) => Math.hypot(p.r - c.r, p.g - c.g, p.b - c.b) > 60
    );
    if (distinct) picks.push(c);
  }
  // Loudest color leads
  picks.sort((a, b) => {
    const sat = (c: { r: number; g: number; b: number }) => {
      const max = Math.max(c.r, c.g, c.b);
      return max === 0 ? 0 : (max - Math.min(c.r, c.g, c.b)) / max;
    };
    return sat(b) - sat(a);
  });
  const hex = (v: number) => v.toString(16).padStart(2, "0");
  return picks.map((p) => `#${hex(p.r)}${hex(p.g)}${hex(p.b)}`.toUpperCase());
}
