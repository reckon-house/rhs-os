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
