# sizzle-reel

A code-only "sizzle reel": one container cuts and wipes through a run of
stills fast enough that the eye reads it as motion. Photo wipes, a burn
blink, a lens pinch, solid color frames, and a title card that builds in
word by word and exits. **No video files, no dependencies, no build step.**

Loop grammar: every transition is a real edit. Color blinks and pinches hide
cuts (you always land on a different frame), title-card words scatter through
the loop, and the full line assembles at the close, holds, and releases.

## Three ways to use it

### 1. Any webpage — the web component

Copy `sizzle-reel.js` next to your page:

```html
<script type="module" src="/sizzle-reel.js"></script>

<sizzle-reel
  images="/photos/a.jpg, /photos/b.jpg, /photos/c.jpg, /photos/d.jpg, /photos/e.jpg"
  colors="#0888B8, #181818, #38B8D8"
  headline="Courage is power"
  aspect="16 / 9"
  radius="18px"
></sizzle-reel>
```

| Attribute  | Default   | Notes |
|------------|-----------|-------|
| `images`   | —         | Comma-separated URLs. 5–6 ideal; 6+ lets the pinch cut to a fresh frame instead of a callback. |
| `colors`   | cyan/dark | Hexes for color frames and title cards, loudest first. |
| `headline` | none      | 1–2 words: slide-in card at the end. 3+: words scatter through the loop, the line builds at the close and exits. |
| `aspect`   | `16 / 9`  | Any CSS `aspect-ratio`. |
| `radius`   | `0`       | Border radius. |
| `speed`    | `1`       | `1.5` = 50% faster. Useful at thumbnail scale. |
| `offset`   | `0`       | Start N beats in — desyncs a grid of reels. |

Built in: pauses offscreen (IntersectionObserver), honors
`prefers-reduced-motion` (every beat resolves to its end frame), auto
light/dark type on any card color, images stay mounted (no decode blinks).
Type inherits the page font — load your display face before judging the
title cards.

`demo.html` in this folder is a working page. Open it from any static
server.

### 2. React / Next.js — the component

Copy `src/components/fx/SizzleReel.tsx` (this repo) into your project.
Same engine, plus a `sequence` prop for full custom choreography and
`onBeatChange` / `index` / `nonce` for building inspector UIs. See
`src/app/sizzle/page.tsx` for a live playground with a beat inspector and
client-side palette extraction from the loaded images.

### 3. No code at all — the exported GIF / MP4

`exports/` holds ready renders of the Ivy Park reel:

- `ivy-park-sizzle.gif` (720px, ~1.3 MB) — drop into an `<img>`, a deck, an email
- `ivy-park-sizzle-small.gif` (480px, ~0.8 MB)
- `ivy-park-sizzle.mp4` (~0.2 MB) — 6× smaller; prefer it on the web:
  `<video autoplay muted loop playsinline src="ivy-park-sizzle.mp4">`

Re-render anytime (needs the dev server running + ffmpeg + Chrome):

```bash
node scripts/export-sizzle-gif.mjs --port 3000 --width 720 --fps 20
```

The exporter steps Chrome's virtual clock frame by frame, so every render is
deterministic and the loop is seamless. Edit
`src/app/sizzle/capture/page.tsx` to change what gets rendered.

## Weight notes

A reel costs its images (once — they're shared across every reel on the
page). Five ~400 KB JPGs ≈ 2 MB unoptimized; serve resized/AVIF versions at
thumbnail scale and a five-frame reel runs ~150 KB. Still lighter than one
video poster frame.
