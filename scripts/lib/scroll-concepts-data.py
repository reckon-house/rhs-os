#!/usr/bin/env python3
"""The facts the scroll concepts read (/lab/scroll-concepts/), in one file.

His ask, 24 Sept 2026: concepts that blend the board with the horizontal
ride, the solid colour fields and the horizontal-to-vertical turn of two
Awwwards sites he found. Every word and picture in the concepts is the
site's own; this gathers them from where they already live, so nothing is
retyped:

  public/lab/board-data.js      the studies' names, lines and sentences
  public/lab/timeline-data.js   the studies' frames, cover sizes and years
  scripts/lib/board-house.json  the statement, the lines, About, the news
  public/lab/board-copy.json    how he works, the credits, the ways in
  scripts/lib/board-order.txt   who sits on Systems (it has no tag)
  src/data/*-case-study.ts      each study's own palette (its reel colours)

A study's FILL is a colour from its own declared palette, never picked to
taste (the reel rule in CLAUDE.md: a colour the brand does not use is a
lie about the brand). The pick is automatic (the most saturated mid-tone),
with a handful of hand picks noted below, still from the same palettes.

Run it again when a study, a line or a palette changes:
    python3 scripts/lib/scroll-concepts-data.py
"""
import colorsys, json, re, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "public/lab/scroll-concepts/house.js"

def js_object(path, name):
    s = (ROOT / path).read_text(encoding="utf-8")
    m = re.search(r"window\." + name + r" = (\{.*?\});\n", s, re.S)
    return json.loads(m.group(1))

groups = js_object("public/lab/board-data.js", "BOARD_GROUPS")
tl = (ROOT / "public/lab/timeline-data.js").read_text(encoding="utf-8")
tl_studies = json.loads(re.search(r"const STUDIES = (\[.*?\]);\n", tl).group(1))
house = json.loads((ROOT / "scripts/lib/board-house.json").read_text(encoding="utf-8"))
copy = json.loads((ROOT / "public/lab/board-copy.json").read_text(encoding="utf-8"))["house"]

# Systems has no tag: the order file's homes say who sits on it
systems = set()
for line in (ROOT / "scripts/lib/board-order.txt").read_text(encoding="utf-8").splitlines():
    m = re.match(r"^([a-z0-9-]+)\s*=\s*([a-z ,]+)$", line.strip())
    if m and "systems" in [x.strip() for x in m.group(2).split(",")]:
        systems.add(m.group(1))

def palette(slug):
    t = (ROOT / f"src/data/{slug}-case-study.ts").read_text(encoding="utf-8")
    m = re.search(r"const REEL_COLORS = (\[[^\]]*\])", t)
    if m and "colors: REEL_COLORS" in t:
        return json.loads(m.group(1))
    m = re.search(r"colors:\s*(\[[^\]]*\])", t)
    return json.loads(m.group(1)) if m else []

def hls(c):
    c = c.lstrip("#"); r, g, b = [int(c[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return colorsys.rgb_to_hls(r, g, b)

def lum(c):
    c = c.lstrip("#")
    ch = [int(c[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    ch = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in ch]
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2]

def ink_on(c):
    """black or white, whichever reads better on the fill"""
    L = lum(c)
    return "#000000" if (L + 0.05) / 0.05 >= 1.05 / (L + 0.05) else "#FFFFFF"

def auto_fill(p):
    def score(c):
        h, l, s = hls(c)
        if l < 0.16 or l > 0.9: return -1
        return s * (1 - abs(l - 0.55) * 1.3) + 0.02
    return max(p, key=score) if p else "#EDE7E2"

# hand picks, each from that study's own palette: its signature colour
# where the automatic pick chose a neighbour, or two neighbours in a row
# would have worn the same caramel
PICK = {
    "arc": "#B1BC94", "robert-rodriguez": "#E0552F", "dsc": "#141414",
    "j-christianson": "#DCA23D", "you-by-sally": "#E91E63",
    "amber-shockey-co": "#1F4D78", "fairview-sitting": "#B4ACA0",
    "fairview-entry": "#4B4A52", "neiman-marcus": "#9EA7AF",
    "cosmo-prof": "#DBC5C8",
}

studies = {}
for s in tl_studies:
    g = groups.get(s["k"], {})
    p = palette(s["h"])
    fill = PICK.get(s["k"]) or auto_fill(p)
    assert fill.upper() in [x.upper() for x in p] or not p, (s["k"], fill, p)
    fact, _, rest = (g.get("d") or "").partition("|")
    tags = list(g.get("tags") or [])
    if s["k"] in systems: tags.append("systems")
    studies[s["k"]] = {
        "k": s["k"], "t": s["t"], "s": s["s"], "h": s["h"], "y": s["y"], "seat": s["seat"],
        "tags": tags, "fact": fact.strip(), "rest": rest.strip(),
        "palette": p, "fill": fill, "ink": ink_on(fill),
        "frames": s["frames"], "nat": s["nat"], "r768": s["r768"],
    }
order = [s["k"] for s in sorted(studies.values(), key=lambda x: x["seat"])]

# a line takes its colour from the study it leads with, chosen so that no
# two lines in a row wear the same field
LEAD = {"digital": "ivy-park", "app": "arc", "systems": "sally-os",
        "creative": "robert-rodriguez", "branding": "amber-shockey-co",
        "interiors": "hill-country-kitchen"}
lines = []
for name, tag, sentence in house["lines"]:
    if tag == "staples": continue
    members = [k for k in order if tag in studies[k]["tags"]]
    lead = LEAD[tag]
    members.remove(lead); members.insert(0, lead)
    lines.append({"name": name, "tag": tag, "sentence": sentence, "lead": lead,
                  "color": studies[lead]["fill"], "ink": studies[lead]["ink"], "studies": members})

strip = lambda h: re.sub(r"<[^>]+>", "", h).strip()
lead_html = house["statement"]["lead"]
grey = re.search(r'<span class="q">(.*?)</span>', lead_html, re.S).group(1)
statement = {"ink": strip(lead_html.split('<span class="q">')[0]), "grey": strip(grey)}

data = {
    "statement": statement, "email": house["email"], "lines": lines, "order": order, "studies": studies,
    "about": house["about"]["sections"], "news": house["news"],
    "method": copy["method"], "credits": copy["credits"], "practice": copy["practice"],
    "links": copy["links"], "book": copy["book"],
}
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text("/* generated by scripts/lib/scroll-concepts-data.py; do not edit by hand */\nwindow.HOUSE = "
               + json.dumps(data, ensure_ascii=False) + ";\n", encoding="utf-8")
print("wrote", OUT.relative_to(ROOT), OUT.stat().st_size, "bytes;",
      ", ".join(f'{l["name"]} {len(l["studies"])}' for l in lines))
