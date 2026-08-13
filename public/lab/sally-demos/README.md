# sally-demos — live product demos for the Sally case study

**Four self-contained, looping HTML demos of the Sally Marketing Portal**, built
to be embedded as live code sections in `/case-studies/sally`. Built and visually
verified in a Sally-side session (2026-08-12/13) that had the product context;
this folder is the handoff.

Nothing needs installing or building. Serve the folder and open a file:

```bash
python3 -m http.server 4614 --directory public/lab/sally-demos
```

Or, once committed, they're live at `reckon.house/lab/sally-demos/<name>.html`
because `public/` is served as-is — watchable before any React port exists.

## The four demos

| file | ~length | what it shows |
|---|---|---|
| `jim-chat.html` | ~30s | A positioning challenge ("salon visits are trending back up — does *no salon required* still hold?") → Jim answers with the research + persona nuance → follow-up ask → a homepage card generates inline with a real DAM lifestyle shot |
| `pdp-studio.html` | ~40s | URL → audit findings (severity + SEO/AEO chips) → demand (Google KWP) → competitive whitespace → full rewrite streaming in → **Gemini + Perplexity grade it in parallel** |
| `requests-email.html` | ~16s | August campaign board → click COLORfest's CRM channel → request detail → Create Email → **a real email assembles from the product's own renderer** |
| `figma-build.html` | ~25s | Sally OS plugin batch-builds four CRM emails onto a canvas — clone, then images first, then copy, exactly as the plugin does |

`requests-email` and `figma-build` **chain** — the first ends on *"ready for the
Figma build."* Present them in that order.

## Shared files

| file | role |
|---|---|
| `sally-demo-kit.js` | the replay engine (IntersectionObserver, reduced-motion, loop, `SallyDemo.step()` test hook) |
| `sally-portal-chrome.css` | portal rail / campaign panel / chat / dock — **extracted verbatim** from `sally-portal/index.html` |
| `sally-pdp-studio.css` | PDP Studio accordions, findings, grades — verbatim |
| `sally-figma-plugin.css` | the Sally OS plugin panel — verbatim from `Sally Figma Plugin/ui.html` |
| `sally-demo.css` | engine classes (`.sd-pop`, `.sd-caret`, `.sd-instant`) |
| `render_demo_email.py` | regenerates `assets/email-multicategory.html` via the portal's real `email_components.py` |
| `assets/` | Sally logo, Satoshi + Founders Grotesk woff2, real DAM photography and packshots |

## Read this before changing anything

**`NOTES.md`** — the full handoff. It carries the port plan, what's real vs.
representative in each demo, the licensing decision on Founders Grotesk, and
every trap already paid for (there are five, and two of them cost real time).

## Two things to know up front

1. **Fidelity is the whole point.** An earlier pass used stylized miniatures with
   invented data and was rejected as *"a dumbed down version."* These run on the
   product's own interface code, with real photography, real generated copy, and
   real model names. Don't "simplify" the chrome.
2. **Licensed type is in this repo.** `assets/fonts/` carries five Founders
   Grotesk faces (Sally's brand display family) and they get publicly served.
   Jeremy made that call knowingly — see NOTES.md.
