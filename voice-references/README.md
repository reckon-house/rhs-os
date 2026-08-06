# Voice References

A working library of writing that lives in the same register Reckon House writing should occupy. Used as a reference set when drafting or editing in either Setting 1 (Personal / signed Jeremy) or Setting 2 (Portfolio).

Pair this with `voice-system.md` at the project root. That doc is the rules. This folder is the examples. Rules tell what to avoid. Examples show what to aim for. Both matter, and they work better together than either does alone.

---

## How to use this folder

Before drafting in voice, point the agent at the relevant reference file. A quick one-liner before the request is enough:

> Read `/voice-references/simmons-gold-club.md` before drafting this. Setting 2 (Portfolio), but use Simmons cadence — long sentences, parentheticals, willingness to wander.

The header at the top of each reference file explains what the piece is modeling and when to reach for it. Skim that first; if it fits the task, read the full piece below it before writing.

The agent's default register without a reference is compressed prose. Short sentences, parallel construction, fragments, swerve constructions, punchy closings. Editing those tells out of a draft after the fact gets the surface right but doesn't fix the underlying cadence. Reading a reference first lets the agent draft toward a real target instead of away from a list of negatives.

---

## What's in here

### Long-form personal voice (Mode E / Setting 1)

- `simmons-gold-club.md` — Bill Simmons. Long winding sentences, parentheticals as load-bearing asides, willingness to wander before landing a point. Reportorial Q&A register with comic asides.
- `simmons-welcome-to-grantland.md` — Bill Simmons. Personal launch essay. Vulnerability woven through structure, return-to-image bookending, the "I don't know if this will work" register. Read this when writing about something Jeremy is launching, building, or putting into the world.
- `ai-leaderboard.md` — Jeremy Prasatik (own work). Locked Mode E reference. Self-interruption, admitted uncertainty, pop culture as structural framework, landing on observation rather than conclusion.

### Restraint and intellectual honesty (Setting 1 + Setting 2)

- `anthropic-economic-index.md` — Anthropic. Research writing on AI use in the economy. Question-style section headers, specific numerical data integrated into prose, hedging done right, explicit acknowledgment of limitations. The "science register" half of the art-meets-science synthesis.
- `chimero-stub.md` — Stub. Add a Frank Chimero essay ("The Web's Grain," "Everything Easy is Hard Again," or "What Screens Want").

### Confident range, partner-page register (Setting 2)

- `pentagram.md` — Pentagram studio About page + TwelveLabs case study writeup. Two registers: how Pentagram positions itself as a practice (use for About page / homepage manifesto work), and how Pentagram writes about the work (use for case studies, especially solo full-vertical projects). Partner-specific pages (Scher, Bierut, Opara) still to add for the individual-level register.
- `stripe-press-stub.md` — Stub. Add Stripe Press homepage copy + a book introduction.

### Own canonical work (target voice)

- `ai-leaderboard.md` — listed above.
- `linkedin-six-month-review-stub.md` — Stub. Paste the "Thoughts from a Shifting Workflow" LinkedIn post when convenient.
- `arc-case-study-stub.md` — Stub. Once the live A.R.C. case study lands its final voice pass, copy the canonical version here.

---

## Adding new references

When a piece is worth saving, drop it in here as a new `.md` file with a header in this shape:

```
# [Title] — [Author] ([Year])

**Use for:** one-line description of what move this piece is modeling.

**Specific moves to study:**
- bullet points naming the actual techniques worth learning from
- keep these concrete, not abstract

**When to reach for this:** the situations where this reference is the right one to read before drafting.

---

[full text of the piece]
```

The header is the part that makes the file useful. Without it, the reference is just text. With it, future-Jeremy or future-Claude knows what move it's there to model and when to use it.

---

## Worth being honest about

Having references on disk doesn't replace the act of reading them before drafting. The library exists so the references are easy to point at, not so the agent absorbs them passively. Each session, name the file at the start of the task. That step is the part that does the work.

---

**Maintained by:** Jeremy Prasatik
**Last updated:** April 2026
