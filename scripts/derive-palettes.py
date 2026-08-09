#!/usr/bin/env python3
"""
Derive a palette for studies that never declared one.

Every pressing cover reel flashes the study's colours, and the rule is
that they come from the study's own palette rather than being picked to
taste — a reel showing colours the work does not use is a lie about the
work. Studies with a `marks-materials` or `brand-system` section already
declare theirs. Six interiors studies do not.

For those, the photographs ARE the palette. This quantises each study's
own images and keeps the colours that actually carry the room, which is
a derivation from the work rather than an invention on top of it.

    python3 scripts/derive-palettes.py

Writes src/data/generated/derived-palettes.json, read by
scripts/port-study.mjs as a fallback. Re-run when a study's images
change.
"""
from PIL import Image
from pathlib import Path
import json, colorsys, subprocess, sys

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src/data/generated/derived-palettes.json"

# The studies and their image lists come from the data, not from a
# folder guess: several studies keep their images under a directory that
# does not match the slug (fairview-suite lives in fairview-bedroom).
listing = subprocess.run(
    ["node", "scripts/list-study-images.mjs"],
    cwd=ROOT, capture_output=True, text=True
)
if listing.returncode != 0:
    print(listing.stderr[-800:], file=sys.stderr)
    sys.exit(1)
studies = json.loads(listing.stdout)


def interesting(rgb):
    """Drop the near-white and near-black that dominate every interior
    shot — they are the paper and the shadow, not the palette."""
    r, g, b = [v / 255 for v in rgb]
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    return 0.10 < l < 0.88


def palette_for(paths, want=5):
    counts = {}
    for p in paths[:10]:
        f = ROOT / "public" / p.lstrip("/")
        if not f.exists():
            continue
        try:
            im = Image.open(f).convert("RGB")
        except Exception:
            continue
        im.thumbnail((160, 160))
        # 16 bins, then keep the ones that actually cover area
        q = im.quantize(colors=16, method=Image.MEDIANCUT).convert("RGB")
        for count, rgb in sorted(q.getcolors(65536) or [], reverse=True)[:8]:
            if not interesting(rgb):
                continue
            # merge near-duplicates so a palette is five colours, not
            # five shades of one
            key = tuple(v // 26 for v in rgb)
            counts[key] = counts.get(key, [0, rgb])
            counts[key][0] += count
            counts[key][1] = rgb
    ranked = sorted(counts.values(), key=lambda x: -x[0])[:want]
    return ["#%02X%02X%02X" % tuple(rgb) for _, rgb in ranked]


out = {}
for slug, info in studies.items():
    if info.get("hasPalette"):
        continue
    pal = palette_for(info["images"])
    if len(pal) >= 3:
        out[slug] = pal
        print(f"  {slug}: {' '.join(pal)}")
    else:
        print(f"  {slug}: could not derive (only {len(pal)} usable colours)")

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(out, indent=1) + "\n")
print(f"\nwrote {OUT.relative_to(ROOT)} — {len(out)} studies")
