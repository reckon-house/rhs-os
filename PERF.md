# Mobile performance — the baseline, and how to take it again

Taken 26 Aug 2026 against production (`main` @ `4fcb297`), before any
optimisation work, so that everything after it has something to be measured
against.

The reason it exists: outreach by email means strangers opening these links on
**phones, cold, on cellular**. That is the load this site has never been tuned
for.

---

## How to re-take it

Two halves, and they are separated on purpose.

### The byte half — automated, trustworthy anywhere

```bash
node scripts/perf-baseline.mjs perf/captures/before-main-4fcb297.json --label "after images"
```

Bytes on the wire do not move with what else the machine is doing, so this half
is a script and its numbers can be compared across days and machines.

To measure different pages, capture a new input file from the browser: load the
page at a mobile viewport, scroll it top to bottom so every lazy image commits
and reports its `naturalWidth`, then record each image's `src`, `naturalWidth`,
rendered CSS width, `devicePixelRatio`, `loading` and whether it has a `srcset`,
plus every URL in `performance.getEntriesByType('resource')`. Shape is
documented at the top of the script.

### The Core Web Vitals half — browser, and only on a quiet machine

**This is the part that will lie to you.** The first pass of this baseline was
taken while five audit agents were running builds; load average was 7.4 and LCP
read **2547 ms**. The same page on the same connection minutes later read
**924 ms**. Nothing about the site had changed.

So: check `uptime` first. If load average is above ~2, the number is not a
measurement, it is a reading of how busy the laptop was. Emulate a phone
(390x844, DPR 3, mobile+touch), 4x CPU throttle, Slow 4G, iPhone user agent,
then trace a reload.

---

## The baseline

### Totals, fully scrolled, cold, brotli offered

| | homepage | DSC case study |
|---|---|---|
| **total** | **18.76 MB** | **25.20 MB** |
| images | 18 660 KB (40 req) | 24 776 KB (63 req) |
| javascript | 407 KB (14 req) | 499 KB (16 req) |
| fonts | 42 KB (1) | 279 KB (4) |
| css | 34 KB (6) | 34 KB (6) |
| document | 8 KB | 21 KB |

Images are **99 %** of both pages.

### Core Web Vitals (provisional — see the warning above)

| | value | verdict |
|---|---|---|
| LCP | 924 ms quiet / 2547 ms under load | needs a clean re-measure |
| CLS | **0.00** | good, and it is not luck — the pressing system's declared aspect ratios reserve every box before its image arrives |
| long tasks | **0** | nothing blocks the main thread over 50 ms |
| TTFB | 32–38 ms | nothing to win here |
| DOM nodes | 690 (homepage) | fine |

The LCP element is the lede paragraph — text, not an image. It is in the DOM
and visible at 273 ms with `opacity: 1`, so nothing is hiding it; what moves LCP
is the paragraph *growing* as its content settles.

### Corrections to the first pass of this baseline

Two numbers in the first draft were wrong. Both are recorded because the way
they were wrong is repeatable.

**`du` lies on this volume by 40 %.** It reported `public/case-studies` at
661 MB. The real apparent size is **470 MB**. `/Volumes/ReckonHouse` is exFAT
with 262 144-byte allocation blocks, so every file rounds up to the next
quarter-megabyte — small files inflate 5–12x. Use
`find … -exec stat -f %z {} +`, never `du`, for any size claim here.

**The first "biggest lever" call was wrong, twice.** It named the facts index
(real, but 196 KB against 18 MB of images), then images in general — which was
the right direction but missed the two specific largest costs, both of which
are *code* decisions rather than file sizes. See the two entries below marked
**missed by the byte baseline**.

### What is actually wrong

**No image on the site has a `srcset`.** 39 of 39 on the homepage, 72 of 72 on
DSC. Every phone downloads the file a desktop would.

Overscale — how many times more image was sent than the screen can paint:

| ratio | file | sent | shown at |
|---|---|---|---|
| **5.98x** | hill-country-oakworks-billboard.jpg | 812 KB | 321 px of a 1920 px file |
| **3.86x** | nordstrom-framework-on-our-list.jpg | 775 KB | 498 px of 1920 |
| **3.21x** | rhs-arc-app-project-select-phone.jpg | 638 KB | 498 px of 1600 |
| 2.48x | big-bend/hero.jpg | 865 KB | 1032 px of 2560 |
| 1.90x | robert-rodriguez-storefront-window.jpg | 902 KB | 1032 px of 1962 |

Estimated bytes thrown away on decode: **10.37 MB** homepage, **14.44 MB** DSC.

**The facts index ships in the homepage's first load.** 195.8 KB brotli — 48 %
of all JavaScript on the page — and it is not read until a visitor types into
the ask field.

**Five form fields zoom the page on iPhone.** iOS Safari zooms whenever a
focused input is under 16 px. The booking form is 12 px (`bkName`, `bkMail`,
`bkNote`) and the contact form is 14 px. `/book` is where outreach is meant to
convert.

**24 tap targets under 44 px.** The booking slots are 112x27 — the thing a
visitor taps to book a call.

**Every case study carries the whole portfolio's thumbnails**, via the all-work
footer index. That is why a DSC page pulls Robert Rodriguez's storefront and
Big Bend's hero.

**The cover reel downloads full-size plates into a 98 px box** — *missed by the
byte baseline, and the largest single finding.* `PressingCover.tsx:387-409`
builds a `new window.Image()` per reel frame, so `loading="lazy"` can never
apply, and the reel will not render until every one resolves. All 30 studies
are `style: "pressing"`, and 209 of 218 frames are the study's own full-size
plates reused verbatim. `hill-country-oak` pulls **11 177 KB before any scroll**
into a box measured at **98 CSS px**, fed by a 3080 px source. Net-new cost runs
**1.5–9.4 MB per study**. On `big-bend` the LCP element *is* a reel frame.
Re-encoded at 400 px AVIF: robert-rodriguez 7308 KB → **89 KB**.

**`HeroPreloader` fetches 5.22 MB on every route, on every phone** — *also
missed by the byte baseline.* It is mounted in the root layout
(`layout.tsx:130`), so it runs on the homepage, every case study, and `/book`.
`fetchPriority="low"` changes queue order, not bytes, and there is no
`saveData` or `effectiveType` guard anywhere in the repo. Desktop takes all 20
heroes: **20.16 MB**. `/book` renders **zero** images of its own, so every
image byte a booking visitor pays is this.

**The image optimizer is live, configured, and used zero times.** `next/image`
is available; the pressing renderer uses raw `<img>` throughout.

**The masthead ask field hangs off the left edge of the phone.** At 375 px on
`/book`, `/custom` and every case study it computes `left: -25.5px`, so the
placeholder renders as "**k the house.**" — 12 % of the field clipped, at the
top of the page a cold recipient lands on. At 320 px it is `left: -53px`. The
homepage escapes it only because the driver writes `--ask-left: 20px`; nothing
sets it on any other route.

**`/case-studies/big-bend/chisos.jpg` does not exist**, is referenced from the
generated facts index, and 404s — into a `max-age=31536000, immutable` header,
so it is poisoned in that visitor's cache for a year.

### What is already right

Worth writing down so nobody "fixes" it:

- **CLS is 0.00.** Declared ratios do the reserving. Those same ratios are
  load-bearing for pressing scroll maths, so they are not free to change.
- **Every homepage image is lazy.** The 18.76 MB is a fully-scrolled figure, not
  a first-paint one.
- **Zero long tasks.** The driver measures a great deal but does not jank.
- **TTFB is 32–38 ms** and brotli is on for text assets.
- Charts at `min-w-[800px]` scroll horizontally **on purpose** (see CLAUDE.md).
- Hover work gated behind `@media (hover: hover)` is **correct**, not a bug.

---

## Before outreach: `/book` is not deployed

`curl https://reckon.house/book` → **404**. The route exists only on
`lab/mobile-parity`. Nothing in production links to it — verified, zero
`href="/book"` on the homepage and on a case study — so nothing is broken
today. But the branch must ship before any email points at it.

---

## The order to fix things in

From a five-lens audit (53 agents, 37 findings confirmed, 10 refuted). Ranked
by bytes off a cold mobile load, divided by risk.

**First — big, safe, measurable**

1. Gate `HeroPreloader` on `saveData` / `effectiveType`, drop the mobile limit
   from 6 to 0–2. **−5.22 MB on every route.** Nothing outside that file reads
   `HERO_IMAGES`, and `PressingTransition` never waits on a warmed hero.
2. Make the facts index lazy. **−196 KB brotli**, 47 % of homepage JS. Edit
   `scripts/port-home.mjs:162-176`, not the generated driver. Deep links
   (`/?q=…`) need the lab's rebuild-when-it-lands path ported deliberately.
3. 16 px form fields on phones, width-gated. Three files. Do **not** raise
   `--pp-note` globally — six rules read it. Add `min-w-0` to BookingDemo's
   four `input[type=time]` in the same commit or the Hours row overflows 7.4 px.
4. Fix the ask field's negative `left` off the homepage.

**Next — real wins, some care**

5. Cover-reel thumbnail export set at 400 px. **−1.5 to 9.4 MB per study**, and
   it is the LCP fix. New filenames are mandatory (immutable cache ignores
   `?v=`). Do not re-encode in place: the frames are shared with the plates.
6. Dynamic-import the 22 rare section components, delete the 2 unused.
   **−37 KB gzip per case-study route.** Never pass `ssr: false`.
7. Re-encode homepage and footer tiles to AVIF ~1080 px. **−11.2 MB** of page
   weight (lazy, so not all first-load). Two sources of truth: `projects.ts`
   for the ring, the lab's `WORK` array for the index.
8. `npm run dims` — 34 unindexed files, and a live wrong-ratio render in the
   footer ring on every non-home page. Do this *before* 7.
9. Booking tap targets: `padding-block: 14px`, not the `padding` shorthand,
   which would break `.on`'s horizontal inset.
10. Cache headers for `/brands`, `/images`, root `og-*`. Repeat-visit only.
11. Fix the dangling `chisos.jpg` reference. Leave the 404-caching header rule
    alone — narrowing it strips long-cache from 10 real files.

**With the visual pass** — eager-plate priority, the 38 no-alpha PNGs
(46.5 MB), fonts to woff2 (**careful**: opentype.js cannot read woff2 and Ivy
Park's glyph morph fails silently), and unifying the triplicated swatch-morph
constants.

**Not worth it** — deleting the unused `three`/`@react-three` deps is CI
hygiene, not a mobile win. Reclaiming the iOS URL bar would give back ~85–90 px
but Lenis owns `<main>` and CLAUDE.md marks it load-bearing. Making `/book`
static is wrong — `availability()` filters on `now`. And the "unreferenced
images" list does not reproduce; deleting a file that *is* looked up returns
`undefined` and breaks pressing scroll math.

---

## After the first four fixes — measured 26 Aug 2026

Same harness, same conditions, production.

| homepage, fully scrolled | before | after | |
|---|---|---|---|
| **total** | 18.76 MB | **14.45 MB** | −4.31 MB |
| images | 18 660 KB | 14 387 KB | −4 273 KB |
| **javascript** | 407.5 KB | **214.1 KB** | **−47 %** |
| est. wasted to overscale | 10.37 MB | 6.69 MB | |

`/book`, first load before any scroll, measured on a local production
build both times: **1 947.9 KB → 26.9 KB**, and zero images. Every image
byte that page used to carry was the preloader warming studies nobody
had asked about.

What did it:

1. **`HeroPreloader` is intent-driven on phones.** It fetched six
   full-size heroes on every mobile route from the root layout. Now the
   sweep is desktop-only and a phone warms exactly the hero of the study
   a pointer has landed on, with the burn's own 520ms of cover behind
   it. Nothing runs under Save-Data or on 2g/3g.
2. **The facts index loads on demand.** 151 KB brotli off first load.
   Requested on field focus and from `apply()`, which is the only path a
   deep link takes.
3. **Fifteen inputs are 16px on touch**, gated on `pointer: coarse`.
   iOS no longer zooms the page mid-booking.
4. **The ask field stops hanging off the left edge** — `left` and
   `width` now read one variable instead of disagreeing.

### Then the cover reel

`PressingCover` measures every reel frame's ratio with
`new window.Image()` before it will mount the reel, and a
JS-constructed Image ignores `loading="lazy"`. So all 218 frames across
30 studies were fetched **eagerly, at full size**, into a box that
clamps to 98 CSS px on a phone.

| | before | after |
|---|---|---|
| all 30 studies' reels | 192 MB | **4.08 MB** (−97.9 %) |
| hill-country-oak, before any scroll | 10.91 MB | **130 KB** |
| big-bend | 10.11 MB | 211 KB |
| DSC case study, fully scrolled | 25.20 MB | **19.88 MB** |

512px AVIF, because the largest box on the densest screen asks for 510
(170 CSS px at DPR 3). Measured on Robert at 1440/DPR2 the frame has
1.51x headroom over what the screen can paint.

`src/lib/reel-thumb.ts` owns the path convention and both the generator
and the renderer import it, so the file asked for is the file written.
`npm run reels` generates; `-- --check` fails on a gap.

### Still open

**No image on the site has a `srcset`.** That is where the remaining
~19 MB of a fully-scrolled case study lives, and it is now the single
largest item left. The overscale table above is unchanged by the reel
work — those are plates, not frames.
