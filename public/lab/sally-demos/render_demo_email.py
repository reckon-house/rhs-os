"""Render the demo email through the PRODUCT'S OWN renderer (email_components.py)
on a CURRENT 2026 template (Multicategory), using real generated copy pulled from
channel_requests. Output goes to the RHS lab as a static fragment the demo embeds.

Nothing is invented here except the template mapping: the source row's copy was
generated against the retired "Email 1" template, and Multicategory is the current
template whose section composition (hero + 2 category headers + 2 product rows)
matches that copy one-for-one.
"""
import sys, os, json
sys.path.insert(0, "/Volumes/ReckonHouse/Sally/Sally Marketing Brain/sally-portal")

import email_components as ec

OUT = "/Volumes/ReckonHouse/RHS/OS/public/lab/sally-demos/assets"

# Local asset paths — the demo serves these next to the HTML.
HERO   = "assets/em-hero.jpg"
# ⚠️ The source row exhibits the DOCUMENTED generate-v2 bug: it invented product
# names ("Permanent Liquid", "Gel", "Paints") that don't match the SKU assets
# attached to the row (a powder lightener, a color remover). Showing that pairing
# would be advertising a known defect. Each generated DESCRIPTION is kept and
# paired with the correct real Wella colorcharm packshot from the DAM; only the
# form-factor word in two names is corrected to match the product pictured.
# All four are real "-studio-bg" packshots from the DAM: square, product centered,
# consistent light ground — which is what the 240×240 product cell expects.
P1     = "assets/wella-demi-5rr.jpg"       # colorcharm Demi-Permanent 5RR Medium Red
P2     = "assets/wella-demi-1n.jpg"        # colorcharm Demi-Permanent 1N Black
P3     = "assets/wella-gloss-crimson.jpg"  # colorcharm Shineluxe Gloss RV Crimson
P4     = "assets/wella-gloss-choc.jpg"     # colorcharm Shineluxe Gloss Choc Glacé

NATURAL = ec.NATURAL  # #FFF0E0

# --- Multicategory section set (from CR_EMAIL_TEMPLATES['Multicategory']) ---
# Copy verbatim from channel_requests d0c8673e's generated_copy.
sections = [
    ("email_hero", {
        "spec": "2026",
        "bg_color": NATURAL,
        "eyebrow": "COLORFEST",
        # 2026 hero has no headline_accent field; the row's headline + accent
        # combine into the single 44-char headline the template allows.
        "headline": "Your boldest color starts right here",
        "subcopy": "Bestselling shades and fresh new hues for every kind of color lover.",
        "cta_text": "Shop color",
        "hero_image": HERO,
        "focal_x": 56, "focal_y": 40,
    }),
    ("section_header", {
        "bg_color": NATURAL,
        "header": "A celebration of color, all yours",
    }),
    ("product_2up", {
        "bg_color": NATURAL,
        "product_1": {"eyebrow": "WELLA", "name": "colorcharm Demi-Permanent — 5RR",
                      "description": "Bold demi-permanent shade for vivid, no-mix color you can layer.",
                      "image": P1},
        "product_2": {"eyebrow": "WELLA", "name": "colorcharm Demi-Permanent — 1N",
                      "description": "Ammonia-free demi formula for glossy tone and seamless blending.",
                      "image": P2},
    }),
    ("section_header", {
        "bg_color": NATURAL,
        "header": "Find your next signature shade",
    }),
    ("product_2up", {
        "bg_color": NATURAL,
        "product_1": {"eyebrow": "WELLA", "name": "Shineluxe Top Coat Gloss — Crimson",
                      "description": "Top-coat gloss for rich, long-lasting shine from root to tip.",
                      "image": P3},
        "product_2": {"eyebrow": "WELLA", "name": "Shineluxe Top Coat Gloss — Choc Glacé",
                      "description": "Glossy finish that refreshes tone and delivers true-to-tone results.",
                      "image": P4},
    }),
]

parts = []
for stype, data in sections:
    fn = ec.SECTION_RENDERERS[stype]
    parts.append(f'<div class="em-sec" data-sec="{stype}">' + fn(data) + "</div>")

html = "\n".join(parts)

path = os.path.join(OUT, "email-multicategory.html")
with open(path, "w") as f:
    f.write(html)

print(f"wrote {path}  ({len(html):,} chars, {len(parts)} sections)")
for stype, _ in sections:
    print("  -", stype)
