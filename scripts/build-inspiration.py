#!/usr/bin/env python3
import os
import random
import sys

IMG_DIR = "/Volumes/ReckonHouse/RHS/OS/public/case-studies/inspiration"

# Collect all image files, excluding macOS metadata (._*)
exts = (".jpg", ".jpeg", ".png", ".webp", ".avif")
files = sorted(
    f for f in os.listdir(IMG_DIR)
    if f.lower().endswith(exts) and not f.startswith("._")
)

# Deterministic shuffle so the order is consistent across builds.
random.seed(42)
random.shuffle(files)

# Preserve known captions; everything else gets the placeholder.
alt_overrides = {
    "Amber-Interior-Design_Ambers-Montana-Extravaganza_Los-Angeles-California19-min.jpg":
        "Amber Interior Design — Montana residence",
    "Amber-Interior-Design_Ambers-Montana-Extravaganza_Los-Angeles-California25-min.jpg":
        "Amber Interior Design — Montana residence",
    "Amber-Interior-Design_Ambers-Montana-Extravaganza_Los-Angeles-California26-min.jpg":
        "Amber Interior Design — Montana residence",
}

header = '''/**
 * Inspiration board — manual list of saved images for House*Staples.
 *
 * V1 is a flat array of image filenames. Add new ones by dropping the
 * file in /public/case-studies/inspiration/ and re-running
 * scripts/build-inspiration.py (a deterministic shuffle keeps related
 * images from clustering — seed 42).
 *
 * Computer vision rename pass is pending — alt text and meaningful
 * filenames will land later. Hash filenames are placeholders.
 *
 * When this list grows past ~150 items, migrate to Supabase + admin
 * upload.
 */

const IMG = "/case-studies/inspiration";

export type InspirationImage = {
  type: "image";
  src: string;
  alt: string;
};

export const inspiration: InspirationImage[] = [
'''

lines = [header]
for f in files:
    alt = alt_overrides.get(f, "Saved image")
    # Use template literal with ${IMG} interpolation.
    lines.append(f'  {{ type: "image", src: `${{IMG}}/{f}`, alt: "{alt}" }},\n')
lines.append("];\n")

out_path = "/Volumes/ReckonHouse/RHS/OS/src/data/inspiration.ts"
with open(out_path, "w") as f:
    f.writelines(lines)

print(f"Wrote {len(files)} entries to {out_path}", file=sys.stderr)
