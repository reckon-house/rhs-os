"use client";

/* ── The index rail ──────────────────────────────────────────────────
 *
 * The drawer rail, canonical. Info and Contact open as drawers holding
 * what the old stacked blocks used to say; the five categories follow
 * after a breath, each flooding to ink and revealing a stamp-size faux
 * reel of that category's own work with the count beside it. The fifth,
 * Staples, shows the inspiration board instead — see rail-categories.ts.
 *
 * WHY THIS FILE EXISTS. The rail was rebuilt in the lab as this drawer
 * index, and the port carried it to the homepage — which is driven by
 * pressingHomeDriver.js — while the ring in the footer of every other
 * page went on rendering the retired five stacked .blk blocks. Both
 * rule sets survive in the generated stylesheet, so neither surface
 * looked broken; they were simply two different designs sharing one
 * page. This is the drawer, once, for every surface that is React.
 *
 * IT IS NOT THE DRIVER'S CODE, and cannot be. scripts/port-home.mjs
 * wraps the whole lab script in one `initPressingHome()` with nothing
 * exported, so there is no dealer to call — and importing 210KB of
 * brain into a case-study footer is the exact byte problem the port
 * exists to avoid. What is shared is the CONTRACT: the same class
 * names, the same drawer anatomy, the same motion, dressed by the same
 * stylesheet. See src/lib/index-cells.ts, which does this for the grid.
 *
 * TWO HONEST DIFFERENCES, both because the brain lives on the homepage:
 *   - A category click here NAVIGATES to /?q=… rather than answering in
 *     place. The homepage answers; the ring hands the question over.
 *   - The counts come from src/data/rail-categories.ts, which holds the
 *     brain's own answers captured from it, rather than from a live
 *     think(). Same numbers, no matcher shipped.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SizzleReel, type SizzleBeat } from "@/components/fx/SizzleReel";
import { projects } from "@/data/projects";
import { practiceNotes } from "@/data/practice-notes";
import { railCategories } from "@/data/rail-categories";

/* The photo spine of buildSequence(), with the word beats dropped —
   a stamp carries no headline. Timings verbatim. The two color beats
   run the site's paper, so the pinch blinks cream and the held curtain
   reads as the page showing through the ink band. */
const SZ_CREAM = "#F3F0ED";
function stampSequence(n: number): SizzleBeat[] {
  return [
    { fx: "shutter", img: 0 % n, ms: 640 },
    { fx: "fade", img: 1 % n, ms: 420 },
    { fx: "pinch", color: SZ_CREAM, img: 2 % n, ms: 520 },
    { fx: "slat", img: 3 % n, ms: 700 },
    { fx: "burn", img: 4 % n, ms: 640 },
    { fx: "ccurtain", color: SZ_CREAM, ms: 380 },
    { fx: "curtain", img: 5 % n, ms: 720 },
    { fx: "cut", img: 6 % n, ms: 640 },
  ];
}

const byId = new Map(projects.map((p) => [p.id, p]));
const note = (re: RegExp) => practiceNotes.find((n) => re.test(n.title));

/* The homepage driver's linkMail, as JSX. One address, two surfaces,
   and it has to be a control on both. */
const MAIL_RX = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
function mailify(text: string): React.ReactNode {
  const m = text.match(MAIL_RX);
  if (!m || m.index === undefined) return text;
  return (
    <>
      {text.slice(0, m.index)}
      <a className="rmail" href={`mailto:${m[0]}`}>
        {m[0]}
      </a>
      {text.slice(m.index + m[0].length)}
    </>
  );
}

export function IndexRail() {
  /* One drawer at a time. The homepage keeps a category open from the
     server; here nothing is open until touched, because the ring is
     read on the way past rather than arrived at. */
  const [open, setOpen] = useState<string | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);

  /* Held open above 860, folded below — the same flag the driver sets
     from the width, for the same reason: a closed <details> cannot be
     forced open from CSS, since the closed state hides its own slot. */
  const [folded, setFolded] = useState(false);
  useEffect(() => {
    const fit = () => setFolded(window.innerWidth <= 860);
    fit();
    window.addEventListener("resize", fit, { passive: true });
    return () => window.removeEventListener("resize", fit);
  }, []);

  /* ── EVERY CHIP STOPS AT ITS OWN WORDS ────────────────────────────
     --hug is how much of the full-width row is clipped away at rest.
     It has to be measured: each label is a different length, and a
     guessed percentage clips a word in half. The driver runs the same
     arithmetic on the homepage — see hugChips there — so the two
     surfaces hug identically.

     Re-run on resize and once the webfont settles, since both move the
     ink width. */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const hug = () => {
      rail.querySelectorAll<HTMLElement>(".rrow").forEach((r) => {
        const ink = r.querySelector<HTMLElement>(".rink");
        const head = r.querySelector<HTMLElement>(".rhead");
        if (!ink || !head) return;
        const full = r.getBoundingClientRect().width;
        if (!full) return;
        const pad = parseFloat(getComputedStyle(head).paddingLeft) || 20;
        const want = ink.getBoundingClientRect().width + pad * 2;
        const v = Math.max(0, Math.min(92, ((full - want) / full) * 100));
        r.style.setProperty("--hug", v.toFixed(2) + "%");
      });
    };
    hug();
    window.addEventListener("resize", hug, { passive: true });
    if (document.fonts?.ready) document.fonts.ready.then(hug);
    return () => window.removeEventListener("resize", hug);
  }, [folded]);

  const about = [note(/what i do/i), note(/setup/i)].filter(Boolean);
  const news = note(/recently/i);
  /* THE OTHER STACK. Last in the drawer, matching the homepage: two
     subs of straight bio first, which is what makes a sub called
     "Stack" read as the framework list it is not. */
  const stack = note(/stack/i);
  const touch = note(/touch/i);

  const rows = (
    <div className="blk rdrawer" ref={railRef} onPointerLeave={() => setOpen(null)}>
      <Row
        id="info"
        label="Info"
        glyph="slash"
        open={open === "info"}
        setOpen={setOpen}
      >
        {about.length ? (
          <>
            <div className="rsub">About</div>
            <div className="rtxt">{about.map((n) => n!.body).join(" ")}</div>
          </>
        ) : null}
        {news ? (
          <>
            <div className="rsub">News</div>
            <div className="rtxt">{news.body}</div>
          </>
        ) : null}
        {stack ? (
          <>
            <div className="rsub">Stack</div>
            <div className="rtxt">{stack.body}</div>
          </>
        ) : null}
      </Row>

      <Row
        id="contact"
        label="Connect"
        glyph="slash"
        open={open === "contact"}
        setOpen={setOpen}
      >
        {touch ? (
          <>
            {/* THE ADDRESS IS A LINK, matching the driver's linkMail on
                the homepage. It was printed as text on both surfaces,
                so the one committing thing in the rail could be read
                and not used. Found rather than hardcoded, the same way,
                so the note's copy can gain words around the address
                without either copy having to be told. */}
            <div className="rtxt">{mailify(touch.body)}</div>
            {touch.link ? (
              <Link className="rgo" href={touch.link.href}>
                {touch.link.label}
              </Link>
            ) : null}
          </>
        ) : null}
      </Row>

      {/* the breath between the utility rows and the categories */}
      <div className="rgap" />

      {railCategories.map((c) => (
        <CategoryRow
          key={c.query}
          cat={c}
          open={open === c.query}
          setOpen={setOpen}
        />
      ))}
    </div>
  );

  /* THE RAIL FOLDS ON A PHONE. <details> rather than a hand-rolled
     toggle: it opens without script, it is a disclosure widget to a
     screen reader with no aria to keep in step, and the summary is
     focusable and operable from the keyboard for free. The .railslot
     wrapper is what animates — a details cannot be transitioned open
     on its own, since the UA hides the content outright. */
  return (
    <details className="railfold" open={!folded}>
      <summary>Filters and notes</summary>
      <div className="railslot on">
        <div className="railbody">{rows}</div>
      </div>
    </details>
  );
}

function Row({
  id,
  label,
  glyph,
  open,
  setOpen,
  children,
}: {
  id: string;
  label: string;
  glyph?: string;
  open: boolean;
  setOpen: (v: string | null) => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rrow${open ? " open" : ""}`}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setOpen(id);
      }}
    >
      <button
        type="button"
        className="rhead"
        aria-expanded={open}
        onClick={() => setOpen(open ? null : id)}
      >
        {/* the words in their own inline box, so the hug pass can
            measure them — the button is the full column */}
        {/* THE CATEGORIES CARRY NO MARK, and the utility rows keep the
            slash — the same two-kinds-of-row rule the driver follows in
            mkRow. Four solids and then four Lucide icons both told the
            categories apart without saying anything about them, which
            is work their own labels were already doing. The slash is a
            different job: it separates Info and Connect from the
            categories below them. */}
        <span className="rink">
          {glyph === "slash" ? (
            <>
              <span className="rslash">/</span>{" "}
            </>
          ) : null}
          {label}
        </span>
      </button>
      <div className="rbody">
        <div>
          <div className="rpad">{children}</div>
        </div>
      </div>
    </div>
  );
}

function CategoryRow({
  cat,
  open,
  setOpen,
}: {
  cat: (typeof railCategories)[number];
  open: boolean;
  setOpen: (v: string | null) => void;
}) {
  const router = useRouter();
  /* Frames first, ids second. Four rows read their stamp off the
     studies they count; Staples counts none, because its shelf is the
     inspiration board, so it carries its eight frames written down.
     See the note on RailCategory.frames. */
  const frames =
    cat.frames ??
    cat.ids.map((id) => byId.get(id)?.image).filter((s): s is string => Boolean(s));

  return (
    <div
      className={`rrow${open ? " open" : ""}`}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setOpen(cat.query);
      }}
    >
      {/* A category HANDS THE QUESTION OVER. The brain lives on the
          homepage, so a filter pressed from the tail of a case study
          carries its query there rather than answering in place. It is
          a link, not a button, so it opens in a new tab and shows its
          destination like any other. */}
      <Link className="rhead" href={`/?q=${encodeURIComponent(cat.query)}`}>
        <span className="rink">
          {cat.label}
        </span>
      </Link>
      <div className="rbody">
        <div>
          {/* THE WHOLE OPEN PANEL ASKS, not just its label. Once a row
              is open the reel and the one-liner are the biggest things
              in it and read as decoration otherwise, so they carry the
              same destination. A handler rather than a second <Link>:
              the head above is already the reachable control, and a
              duplicate would announce the same place twice to a screen
              reader. This only widens the target for a pointer.
              A scrub on the reel swallows its own click, so shuttling
              frames never navigates. */}
          {/* data-cursor-grow, not cursor: pointer. The site draws its
              own cursor and sets `cursor: none` on everything, so the
              CSS property is dead; this attribute is what
              CustomCursor's INTERACTIVE selector looks for. */}
          <div
            className="rpad rcat"
            data-cursor-grow=""
            onClick={() => router.push(`/?q=${encodeURIComponent(cat.query)}`)}
          >
            {frames.length ? (
              <SizzleReel
                className="rreel"
                images={frames}
                sequence={stampSequence(frames.length)}
                /* Only the open drawer's reel should run; a closed one
                   is clipped to nothing by the 0fr row and would be
                   painting frames nobody can see. */
                index={open ? null : 0}
              />
            ) : null}
            {/* No count caption: it came out of the band deliberately,
                and .rnumcap no longer exists in the stylesheet. The
                reel IS the count. */}
            <div className="rdesc">{cat.note}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
