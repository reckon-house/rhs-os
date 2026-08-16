# dsc-demos — live product demos for the DSC case study

**Three self-contained, looping HTML demos of the DSC gym platform**, built to
be embedded as live code sections in the reckon.house DSC case study. Built and
visually verified in a DSC-side session (2026-08-14) that had the product
context; this folder is the handoff.

Nothing needs installing or building. Serve the folder and open a file:

```bash
python3 -m http.server 4711 --directory public/lab/dsc-demos
```

## The three demos

| file | ~length | what it shows |
|---|---|---|
| `owner-batch-chat.html` | ~35s | The marquee. The owner types one sentence — *"Schedule Marcus Chen with Scott on Monday, Wednesday, and Friday at 3pm for the next 4 weeks"* — the scheduler looks up the athlete, runs `propose_batch`, accepts 10 sessions, **skips 3 conflicts by name**, waits for "commit," and only then writes the calendar |
| `athlete-mcp-loop.html` | ~30s | The full arc. An athlete asks their own AI for Scott's openings → the AI works the gym's real MCP tools (`my_trainer_availability`, `request_session`) → the request **lands as a card on the owner's console** → one tap approves it |
| `standing-slots.html` | ~18s | One recurring slot (Tuesdays · 4:00 PM · Scott), created in the product's own bottom sheet → the engine materializes the next 8 weeks → the new session appears on the calendar day view |

The three make one argument in order: the owner can say the schedule out loud,
the athlete never has to open the app, and the recurring stuff runs itself —
and every path ends in the same deterministic engine.

## Shared files

| file | role |
|---|---|
| `dsc-demo-kit.js` | the replay engine (IntersectionObserver, reduced-motion, loop, `DSCDemo.step()` test hook) — ported from the RHS repo's `sally-demo-kit.js` contract |
| `dsc-app.css` | **the deployed app's own compiled stylesheet** (`/_next/static/chunks/c6af397b294c5e6b.css` from dsc-gym.vercel.app), font URLs rewritten relative — nothing else touched |
| `dsc-demo.css` | engine classes (`.sd-pop`, `.sd-caret`, `.sd-instant`) + the phone-width mat the demos sit in |
| `assets/fonts/` | the product's 12 Avenir Next faces, copied from `public/fonts/` |
| `assets/logo-mark.png` | the DSC monogram, copied from `public/logo-mark.png` |

## Read this before changing anything

**`NOTES.md`** — the full handoff: what's real vs. representative in each demo,
every deliberate deviation and why, the traps already hit, and the open
decisions that belong to Jordan.

## Three things to know up front

1. **Fidelity is the whole point.** The interface is the product's own compiled
   CSS with the JSX's exact class strings, and the conversations are real
   exchanges run against the live app. Don't "simplify" the chrome, and don't
   "fix" the literal `**…**` / `_calling \`tool\`…_` marks in the owner chat —
   the product really renders them that way (raw text, no markdown).
2. **The athlete-side AI chat is deliberately neutral.** We reproduce our own
   interfaces faithfully; we don't clone Claude's or ChatGPT's chrome. The
   conversation content is real; the surface is generic on purpose.
3. **Licensed type is in this folder.** Avenir Next is a licensed Monotype
   family. The gym app already serves these exact files publicly at
   dsc-gym.vercel.app/fonts/; shipping them here is the same exposure, but it's
   Jordan's call to keep or subset — see NOTES.md.
