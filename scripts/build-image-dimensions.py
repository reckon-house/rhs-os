#!/usr/bin/env python3
"""
Build a manifest of real pixel dimensions for every image under public/.

Next.js <Image> needs width/height (or a parent with fixed dims for `fill`)
to reserve layout space and preserve aspect ratio without layout shift. Our
case-study data files store image paths but not dimensions, which is why the
hero / inspiration / showcase renderers were stuck on raw <img>.

This script walks the image folders once and emits a typed lookup map at
src/data/image-dimensions.ts keyed by the public URL path (the same string
used as `src` in the data files). Components import it and pass the real
width/height to <Image>, which lets Vercel serve responsive AVIF/WebP while
preserving each image's true aspect ratio.

Re-run whenever images are added or replaced:
    python3 scripts/build-image-dimensions.py
"""
from PIL import Image
from pathlib import Path

PUBLIC = Path("/Volumes/ReckonHouse/RHS/OS/public")
# Folders worth indexing — everything an <Image> might point at.
SCAN_DIRS = ["case-studies", "nav", "images"]
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"}

entries: dict[str, tuple[int, int]] = {}
errors: list[str] = []

for d in SCAN_DIRS:
    base = PUBLIC / d
    if not base.exists():
        continue
    for p in base.rglob("*"):
        if p.suffix.lower() not in EXTS:
            continue
        if p.name.startswith("._"):
            continue
        try:
            with Image.open(p) as img:
                w, h = img.size
            url = "/" + str(p.relative_to(PUBLIC))
            entries[url] = (w, h)
        except Exception as e:  # noqa: BLE001
            errors.append(f"{p}: {e}")

# Stable, sorted output so git diffs only show real changes.
lines = [
    "/**",
    " * Image dimension manifest — AUTO-GENERATED. Do not edit by hand.",
    " *",
    " * Regenerate with: python3 scripts/build-image-dimensions.py",
    " *",
    " * Maps each public image URL to its real [width, height] in pixels so",
    " * components can pass correct intrinsic dimensions to next/image,",
    " * preserving aspect ratio and preventing layout shift.",
    " */",
    "",
    "export const imageDimensions: Record<string, [number, number]> = {",
]
for url in sorted(entries):
    w, h = entries[url]
    # Escape any backtick/${} just in case (filenames shouldn't contain them).
    safe = url.replace("\\", "\\\\").replace('"', '\\"')
    lines.append(f'  "{safe}": [{w}, {h}],')
lines.append("};")
lines.append("")
lines.append("/**")
lines.append(" * Look up [width, height] for an image URL. Falls back to a 3:2")
lines.append(" * landscape ratio when the image isn't in the manifest (e.g. a")
lines.append(" * brand-new file added before the script was re-run) so callers")
lines.append(" * always get usable numbers.")
lines.append(" */")
lines.append("export function getImageDimensions(src: string): [number, number] {")
lines.append("  return imageDimensions[src] ?? [1200, 800];")
lines.append("}")
lines.append("")

out = PUBLIC.parent / "src" / "data" / "image-dimensions.ts"
out.write_text("\n".join(lines))

print(f"Wrote {len(entries)} image dimensions to {out}")
if errors:
    print(f"{len(errors)} errors:")
    for e in errors[:20]:
        print("  " + e)
