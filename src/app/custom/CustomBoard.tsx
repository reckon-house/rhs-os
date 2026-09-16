"use client";

/* ── /custom, ON THE BOARD'S GLASS ───────────────────────────────────
 * The page a small business lands on from an email, so it is a straight
 * read and not the board: one audience, in the grammar the rest of the
 * site is in, with the board's rail of doors down the left. It reads as
 * the studio's front door rather than a cut of the portfolio: the
 * studio and who it is for, then its three services dealt as the board
 * deals a run, a head with the service's one sentence and what it is
 * under it at the list's size, a wide hero across the pair, then two
 * columns of tiles, each a picture with the study's name and the
 * study's own line at 12px. Then how the work goes, twenty years of
 * clients with the way out to all of it, and the house's own black
 * column with the price line, the call and the week in it.
 *
 * EXPLORATIONS, for now, on ?v= and the rail's foot: six answers to
 * "an agency built around this design system", each a different row
 * of the same pieces. A is the page when nothing is said. The winner
 * keeps the page; the others come out.
 *
 * THE ASK IS THE BOARD'S. A question typed under the statement is
 * answered from the studies the tiles open (/api/ask), and the studies
 * the answer names stand under it as chips. A question about reaching
 * him is answered without the trip. ?for=Cleve hangs a chip beside the
 * page's own, so a link sent to one person addresses that person.
 *
 * Still a client component that SSRs: every word and every picture is
 * in the HTML before a script runs. The turning, the ink, the counts
 * and the Ask are layered on, and the mechanism is the glass's
 * (src/components/glass), shared with /daybook and /book.
 */

import {
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type RefObject,
} from "react";
import Link from "next/link";
import { PaperGround } from "@/components/shell/PaperGround";
import { Rule, still, turnRow, useArrival, useGlass, useTurns } from "@/components/glass/glass";
import { Week } from "@/components/glass/Week";
import { SizzleReel, type SizzleBeat } from "@/components/fx/SizzleReel";
import glass from "@/components/glass/glass.module.css";
import own from "./custom.module.css";
import {
  COVER,
  CUSTOM,
  DOORS,
  OFFERS,
  PIECES,
  RUNS,
  SPINE,
  WORK,
  WORK_PICKS,
  type Hero,
  type Piece as PieceT,
  type Run,
} from "@/data/custom";
import { CREDITS } from "@/components/shell/pressing-footer/PressingCredits";
import { PRACTICE } from "@/components/shell/pressing-footer/PressingContact";
import { plateSrcSet } from "@/lib/img-srcset";
import { METHOD } from "@/data/method";
import { SLOT_MINUTES } from "@/data/booking";
import { projects } from "@/data/projects";

/* the studies the Ask reads: the tiles', so an answer about scheduling
   comes from the gym's study rather than a guess */
const STUDY_HREFS = Array.from(new Set(PIECES.map((r) => r.href))).filter((h) =>
  h.startsWith("/case-studies/")
);

/* a named study's chip: the Ask names studies as the board reads them,
   by href, and a title is accepted too, so a name that comes back
   either way still finds its study */
const HREF_OF = new Map<string, string>();
const TITLE_OF = new Map<string, string>();
projects.forEach((p) => {
  if (!p.href) return;
  if (!HREF_OF.has(p.href)) HREF_OF.set(p.href, p.href);
  if (!HREF_OF.has(p.title)) HREF_OF.set(p.title, p.href);
  if (!TITLE_OF.has(p.href)) TITLE_OF.set(p.href, p.title);
});

/* ── THE ADDRESS ───────────────────────────────────────────────────
   ?for= names who the link was sent to; ?v= names the exploration.
   Both read through one external store, so the server's page and the
   client's first render agree and the chips appear once the address
   is read. The rail's foot writes ?v= and tells the store. */
const heard = new Set<() => void>();
const subscribe = (fn: () => void) => {
  heard.add(fn);
  window.addEventListener("popstate", fn);
  return () => {
    heard.delete(fn);
    window.removeEventListener("popstate", fn);
  };
};
const readFor = () => {
  try {
    return (new URLSearchParams(window.location.search).get("for") ?? "")
      .replace(/[^\p{L}\p{N} &'.,-]/gu, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 40);
  } catch {
    return "";
  }
};
const serverFor = () => "";
type Variant = "a" | "b" | "c" | "d" | "e" | "f";
const VARIANTS: Variant[] = ["a", "b", "c", "d", "e", "f"];
const readVariant = (): Variant => {
  try {
    const v = new URLSearchParams(window.location.search).get("v") as Variant | null;
    return v && VARIANTS.includes(v) ? v : "a";
  } catch {
    return "a";
  }
};
const serverVariant = (): Variant => "a";
function writeVariant(v: Variant) {
  try {
    const u = new URL(window.location.href);
    if (v === "a") u.searchParams.delete("v");
    else u.searchParams.set("v", v);
    window.history.replaceState(null, "", u);
  } catch {
    /* an address that will not take it keeps the one it had */
  }
  heard.forEach((fn) => fn());
}

/* the board's thumb at the rungs the generator wrote beside it, or a
   plate through the site's own ladder (raw in development, where the
   optimizer is off) */
const THUMBS = "/lab/board-thumbs/";
const rungsOf = (src: string, w?: number) =>
  `${src.replace(/\.webp$/, "@384.webp")} 384w, ${src.replace(/\.webp$/, "@768.webp")} 768w, ${src} ${w ?? 1536}w`;
const plateSet = (img: { src: string; w?: number }) =>
  img.src.startsWith(THUMBS) ? rungsOf(img.src, img.w) : plateSrcSet(img.src, img.w);

const piecesOf = (r: Run) =>
  r.id === "work"
    ? WORK_PICKS.map((id) => PIECES.find((p) => p.id === id)).filter((p): p is PieceT => !!p)
    : PIECES.filter((p) => p.run === r.id);

/* ── THE OFFERINGS (assemble-board.py, Info's "Shipped lately" rows) ──
   Three rows under the intro, one a service: a reel of that service's
   own pictures where a cover would stand, the name in ink and a gist
   in grey, and a press that turns the row to the service. The reel is
   the site's own (SizzleReel), cut to photographs only, since a colour
   blink in a box beside a sentence is noise; the three start beats
   apart so they never cut together, which the board found reads as
   holes in the page rather than reels. */
const REEL_BEATS: SizzleBeat[] = [
  { fx: "shutter", img: 0, ms: 900 },
  { fx: "fade", img: 1, ms: 700 },
  { fx: "cut", img: 2, ms: 900 },
  { fx: "curtain", img: 3, ms: 900 },
  { fx: "fade", img: 4, ms: 700 },
  { fx: "cut", img: 5, ms: 900 },
];
function Offers({ go, pauseRoot }: { go: (col: string) => void; pauseRoot: RefObject<HTMLDivElement | null> }) {
  return (
    <div className={glass.rows}>
      {OFFERS.map((o, k) => (
        <button
          key={o.run}
          type="button"
          className={`${glass.row} ${glass.rowBtn} ${glass.rise}`}
          onClick={() => go(o.run)}
          aria-label={`${o.name}: ${o.line}`}
        >
          <span className={glass.reel} aria-hidden="true">
            <SizzleReel
              images={o.frames}
              sequence={REEL_BEATS.filter((b) => (b.img ?? 0) < o.frames.length)}
              offsetBeat={k * 2}
              pauseRoot={pauseRoot}
              style={{ width: 96, height: 72 }}
            />
          </span>
          <span>
            <b>{o.name}</b> <span className={glass.g}>{o.line}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

/* ── A TILE (assemble-board.py .tile.ixrow) ─────────────────────────
   The picture at the column's width, and one line under it: the
   study's name in ink, the study's own sentence about the piece in
   grey. The picture is the door to the study, and the name is the
   curtain's label (.lbl), so leaving says the study's name. */
function Tile({ p }: { p: PieceT }) {
  return (
    <Link className={`${glass.tile} ${glass.rise}`} href={p.href} data-col={`piece-${p.id}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.image.src}
        srcSet={plateSet(p.image)}
        sizes="(max-width: 760px) 84vw, 480px"
        width={p.image.w}
        height={p.image.h}
        alt={p.image.alt}
        loading="lazy"
        decoding="async"
      />
      <span className={glass.cap}>
        <span className="lbl">
          <b>{p.project}</b>
        </span>{" "}
        <span className={glass.g}>{p.line}</span>
      </span>
    </Link>
  );
}

/* a hero, captioned as the board captions a cover; wide across a pair,
   or at a column's width where a column carries its own */
function HeroPlate({ h, wide }: { h: Hero; wide: boolean }) {
  return (
    <figure className={`${wide ? glass.hero : glass.tile} ${glass.rise}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={h.src}
        srcSet={plateSet(h)}
        sizes={wide ? "(max-width: 760px) 84vw, 1000px" : "(max-width: 760px) 84vw, 480px"}
        width={h.w}
        height={h.h}
        alt={h.name}
        loading="lazy"
        decoding="async"
      />
      <figcaption className={glass.cap}>
        <b>{h.name}</b> <span className={glass.g}>{h.cat}</span>
      </figcaption>
    </figure>
  );
}

/* the list under a head: what the service is, in the board's row */
function Rows({ rows }: { rows: Run["rows"] }) {
  if (!rows.length) return null;
  return (
    <div className={glass.rows}>
      {rows.map((x) => (
        <p key={x.head} className={`${glass.row} ${glass.text} ${glass.tight} ${glass.rise}`}>
          <span>
            <b>{x.head}</b> <span className={glass.g}>{x.body}</span>
          </span>
        </p>
      ))}
    </div>
  );
}

/* ── A RUN'S HEAD (assemble-board.py, the head tile) ────────────────
   The name in ink and its one sentence in grey, what it is as rows
   under them at the list's size, and a chip that counts the tiles and
   turns the row to them; the run's hero spans the pair under it. The
   only display prose a run carries. */
function Head({ r, go }: { r: Run; go: (col: string) => void }) {
  const mine = piecesOf(r);
  return (
    <section className={glass.pair} data-col={r.id} aria-labelledby={`run-${r.id}`}>
      <div className={glass.cin}>
        <div className={glass.pairHead}>
          <h2 id={`run-${r.id}`} className={`${glass.statement} ${glass.rise}`}>
            {r.name} <span className={glass.g}>{r.line}</span>
          </h2>
          <Rows rows={r.rows} />
          <p className={`${own.ways} ${glass.rise}`}>
            <button
              type="button"
              className={glass.chip}
              onClick={() => mine[0] && go(`tiles-${r.id}-0`)}
            >
              <span>
                {mine.length} {mine.length === 1 ? "piece" : "pieces"}
              </span>
              <span className={glass.arr} aria-hidden="true" />
            </button>
          </p>
        </div>
        <HeroPlate h={r.hero} wide />
      </div>
      <Rule />
    </section>
  );
}

/* ── A RUN'S TILES, DEALT DOWN TWO COLUMNS ──────────────────────────
   The board deals a run's pictures in rounds down the columns of a
   pair; here a run of four to seven tiles fills two columns, the first
   taking the odd one, the piece a small business recognises first at
   the top of the first. */
function Tiles({ r }: { r: Run }) {
  const mine = piecesOf(r);
  const half = Math.ceil(mine.length / 2);
  const cols = [mine.slice(0, half), mine.slice(half)].filter((c) => c.length);
  return (
    <>
      {cols.map((c, k) => (
        <section key={k} className={glass.col} data-col={`tiles-${r.id}-${k}`} aria-label={`${r.name} ${k + 1}`}>
          <div className={glass.cin}>
            {c.map((p) => (
              <Tile key={p.id} p={p} />
            ))}
          </div>
          <Rule />
        </section>
      ))}
    </>
  );
}

/* ── ONE COLUMN, THE WHOLE SERVICE (exploration E) ───────────────────
   The head, its rows, its hero at the column's width, then its tiles,
   all down one column: a service a screen wide, the row seven columns
   long. */
function Single({ r }: { r: Run }) {
  return (
    <section className={glass.col} data-col={r.id} aria-labelledby={`run-${r.id}`}>
      <div className={glass.cin}>
        <h2 id={`run-${r.id}`} className={`${glass.statement} ${glass.rise}`}>
          {r.name} <span className={glass.g}>{r.line}</span>
        </h2>
        <Rows rows={r.rows} />
        <div className={glass.rows}>
          <HeroPlate h={r.hero} wide={false} />
          {piecesOf(r).map((p) => (
            <Tile key={p.id} p={p} />
          ))}
        </div>
      </div>
      <Rule />
    </section>
  );
}

/* ── THE COVER (explorations B) ─────────────────────────────────────
   His hook over a hero, across the pair, before anything else. */
function Cover() {
  return (
    <section className={glass.pair} data-col="cover" aria-label="Cover">
      <div className={glass.cin}>
        <div className={glass.pairHead}>
          <p className={`${glass.statement} ${glass.rise}`}>
            {COVER.lede} <span className={glass.g}>{COVER.dim}</span>
          </p>
        </div>
        <HeroPlate h={COVER.hero} wide />
      </div>
      <Rule />
    </section>
  );
}

interface Turn {
  id: number;
  q: string;
  a: string | null;
  named: string[];
}

const REACH = /reach|contact|email|hire|talk/i;

function Ask({ cinRef }: { cinRef: RefObject<HTMLDivElement | null> }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const fieldRef = useRef<HTMLFormElement | null>(null);
  const seq = useRef(0);
  const held = useRef<number | null>(null);

  /* THE FIELD HOLDS STILL AND THE COLUMN MOVES UNDER IT (assemble-
     board.py .cturn): a turn lands above the field, and the column
     scrolls by exactly the height it added, so the field stays where
     the hand left it and everything above it slides up. */
  useLayoutEffect(() => {
    const cin = cinRef.current;
    const f = fieldRef.current;
    if (!cin || !f || held.current == null) return;
    cin.scrollTop += f.offsetTop - held.current;
    held.current = null;
  }, [turns, cinRef]);

  const land = (id: number, a: string, named: string[]) =>
    setTurns((t) => t.map((x) => (x.id === id ? { ...x, a, named } : x)));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("q") as HTMLInputElement | null;
    const q = input?.value.trim() ?? "";
    if (!input || !q) return;
    input.value = "";
    held.current = fieldRef.current?.offsetTop ?? null;
    const id = ++seq.current;
    setTurns((t) => [...t, { id, q, a: null, named: [] }]);
    if (REACH.test(q)) {
      land(id, CUSTOM.ask.reach, []);
      return;
    }
    try {
      const r = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ q, hrefs: STUDY_HREFS }),
      });
      const j = r.ok ? ((await r.json()) as { answer?: string; named?: unknown }) : null;
      const named = Array.isArray(j?.named)
        ? (j.named as unknown[]).filter((n): n is string => typeof n === "string")
        : [];
      land(id, j?.answer?.trim() || CUSTOM.ask.none, named);
    } catch {
      land(id, CUSTOM.ask.none, []);
    }
  };

  return (
    <div className={own.ask}>
      {turns.map((t) => {
        const chips = Array.from(
          new Set(t.named.map((n) => HREF_OF.get(n)).filter((h): h is string => !!h))
        ).slice(0, 4);
        return (
          <div key={t.id} className={own.turn}>
            <p>{t.q}</p>
            <p className={glass.g}>{t.a ?? CUSTOM.ask.wait}</p>
            {chips.length ? (
              <p className={own.chips}>
                {chips.map((h) => (
                  <Link key={h} className={glass.chip} href={h}>
                    <span className="lbl">{TITLE_OF.get(h) ?? h}</span>
                    <span className={glass.arr} aria-hidden="true" />
                  </Link>
                ))}
              </p>
            ) : null}
          </div>
        );
      })}
      <form ref={fieldRef} onSubmit={submit}>
        <input
          name="q"
          className={own.line}
          placeholder={CUSTOM.ask.placeholder}
          autoComplete="off"
          maxLength={200}
          aria-label="Ask about the work"
        />
      </form>
    </div>
  );
}

/* the rail's doors, and the explorations at its foot */
function Rail({ v, go, doors }: { v: Variant; go: (col: string) => void; doors: typeof DOORS }) {
  return (
    <>
      {doors.map((d) => (
        <button key={d.col} type="button" className={glass.pill} onClick={() => go(d.col)}>
          <span>{d.label}</span>
        </button>
      ))}
      <span className={glass.gap} aria-hidden="true" />
      {VARIANTS.map((x) => (
        <button
          key={x}
          type="button"
          className={glass.pill}
          aria-pressed={v === x}
          aria-label={`Exploration ${x.toUpperCase()}`}
          onClick={() => writeVariant(x)}
        >
          <span>{x.toUpperCase()}</span>
        </button>
      ))}
    </>
  );
}

/* what stands in the row, by exploration */
type Slot =
  | { kind: "statement"; dark?: boolean; spine?: boolean; facts?: boolean }
  | { kind: "cover" }
  | { kind: "caps"; ask?: boolean }
  | { kind: "head"; run: Run }
  | { kind: "tiles"; run: Run }
  | { kind: "single"; run: Run }
  | { kind: "method" }
  | { kind: "clients" }
  | { kind: "talk" };
const run = (id: Run["id"]) => (id === "work" ? WORK : RUNS.find((r) => r.id === id)!);
const services = (): Slot[] => RUNS.flatMap((r): Slot[] => [{ kind: "head", run: r }, { kind: "tiles", run: r }]);
const ROW: Record<Variant, Slot[]> = {
  /* A · the studio: statement, three services as runs, process, clients, the call */
  a: [{ kind: "statement" }, ...services(), { kind: "method" }, { kind: "clients" }, { kind: "talk" }],
  /* B · manifesto: the hook over a hero, what we do as a list, the work, then the rest */
  b: [
    { kind: "cover" },
    { kind: "caps", ask: true },
    { kind: "head", run: run("work") },
    { kind: "tiles", run: run("work") },
    { kind: "method" },
    { kind: "clients" },
    { kind: "talk" },
  ],
  /* C · work first: the statement, six pictures, then what we do, process, clients, the call */
  c: [
    { kind: "statement" },
    { kind: "head", run: run("work") },
    { kind: "tiles", run: run("work") },
    { kind: "caps" },
    { kind: "method" },
    { kind: "clients" },
    { kind: "talk" },
  ],
  /* D · the house: the studio speaks first in its own black column, with
     the practice line under the field; paper after; black to close */
  d: [
    { kind: "statement", dark: true, facts: true },
    ...services(),
    { kind: "method" },
    { kind: "clients" },
    { kind: "talk" },
  ],
  /* E · one column a service: the town's name as a spine, then each service whole, seven columns */
  e: [
    { kind: "statement", spine: true },
    ...RUNS.map((r): Slot => ({ kind: "single", run: r })),
    { kind: "method" },
    { kind: "clients" },
    { kind: "talk" },
  ],
  /* F · the call second: the statement, then the week, then the services;
     a page whose one job is the call puts it one turn away */
  f: [{ kind: "statement" }, { kind: "talk" }, ...services(), { kind: "method" }, { kind: "clients" }],
};
const DOORS_OF: Record<Variant, typeof DOORS> = {
  a: DOORS,
  b: [{ label: "What we do", col: "caps" }, { label: "The work", col: "work" }, ...DOORS.slice(3)],
  c: [{ label: "The work", col: "work" }, { label: "What we do", col: "caps" }, ...DOORS.slice(3)],
  d: DOORS,
  e: DOORS,
  f: [DOORS[5], ...DOORS.slice(0, 5)],
};

export function CustomBoard() {
  const who = useSyncExternalStore(subscribe, readFor, serverFor);
  const v = useSyncExternalStore(subscribe, readVariant, serverVariant);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const leadRef = useRef<HTMLDivElement | null>(null);
  /* the glass: ink and counts (rows and tiles alike) and the columns
     past the edge, redrawn when an exploration rebuilds the row; the
     rise under a curtain; the row turning from the keys and a held
     wheel */
  const past = useGlass(rootRef, stripRef, `.${glass.row}, .${glass.tile}`, v);
  useArrival(stripRef);
  useTurns(stripRef);

  /* THE ROW STARTS OVER WHEN ITS STRUCTURE DOES. The strip snaps, and a
     snapping scroller remembers the column it last snapped to: the
     server renders A, so a page opened on another exploration hydrates
     with A's first column as that target and re-snaps to it once the
     row is rebuilt. Before the paint, so the reader never sees the jump. */
  useLayoutEffect(() => {
    const strip = stripRef.current;
    if (strip && strip.scrollLeft) strip.scrollTo({ left: 0, behavior: "auto" });
  }, [v]);

  /* a door, a head's chip and the offer's own "Pick a time" all turn
     the row to a column by its address */
  const go = (col: string) => {
    const strip = stripRef.current;
    const target = strip?.querySelector<HTMLElement>(`[data-col="${col}"]`);
    if (strip && target) strip.scrollTo({ left: target.offsetLeft, behavior: still() ? "auto" : "smooth" });
  };

  const head = (id: string, text: string) => (
    <h2 id={id} className={`${glass.head} ${glass.g} ${glass.rise}`}>
      {text}
    </h2>
  );
  const pick = (
    <p className={`${own.ways} ${glass.rise}`}>
      <button type="button" className={glass.chip} onClick={() => go("talk")}>
        <span>{CUSTOM.talk.book}</span>
        <span className={glass.arr} aria-hidden="true" />
      </button>
    </p>
  );
  const rail = <Rail v={v} go={go} doors={DOORS_OF[v]} />;

  const columns = ROW[v].map((slot) => {
    switch (slot.kind) {
      case "statement":
        return (
          <section
            key="statement"
            className={`${glass.col} ${glass.lead}${slot.dark ? ` ${glass.dark}` : ""}`}
            data-col="statement"
            aria-label="Reckon House, for small business"
          >
            <div ref={leadRef} className={glass.cin}>
              <div className={glass.chead}>
                <span className={glass.tag}>{CUSTOM.caption}</span>
                {who ? (
                  <span className={glass.tag}>
                    {/* a space between the two, for a reader's ear: the chip's
                        gap draws it, and a flex box drops the text node */}
                    <span className={glass.g}>For</span> <span>{who}</span>
                  </span>
                ) : null}
              </div>
              <h1 className={`${glass.statement} ${glass.rise}`}>
                {CUSTOM.lede} <span className={glass.g}>{CUSTOM.dim}</span>
              </h1>
              {/* the three offerings, each a door to its service */}
              <Offers go={go} pauseRoot={stripRef} />
              {/* the call, here as well as at the end: the reader sold on
                  the first column should not have to turn past everything
                  to reach a time; not when the week is the next column */}
              {v === "f" ? null : pick}
              <Ask cinRef={leadRef} />
              {/* on a phone the rail has no column of its own, so it rides
                  under the statement, in the column that introduces it */}
              <div className={glass.pocket}>{rail}</div>
              {slot.facts ? (
                /* the practice line, as rows: the footer's own three words */
                <div className={glass.rows}>
                  {PRACTICE.map((x) => (
                    <p key={x} className={`${glass.row} ${glass.text} ${glass.tight} ${glass.rise}`}>
                      <span>
                        <b>{x}</b>
                      </span>
                    </p>
                  ))}
                </div>
              ) : null}
              {slot.spine ? (
                /* the town, set the way /book sets its month */
                <div className={glass.month} aria-hidden="true">
                  {SPINE}
                </div>
              ) : null}
            </div>
            <Rule />
          </section>
        );
      case "cover":
        return <Cover key="cover" />;
      case "caps":
        return (
          /* what we do, as one list: each service's name and sentence
             as a row, its rows under it, the way the board's Info room
             lists what the house does */
          <section key="caps" className={glass.col} data-col="caps" aria-labelledby="caps">
            <div className={glass.cin}>
              {head("caps", "What we do.")}
              {RUNS.map((r) => (
                <div key={r.id}>
                  <p className={`${glass.row} ${glass.text} ${glass.rise}`}>
                    <span>
                      <b>{r.name}</b> <span className={glass.g}>{r.line}</span>
                    </span>
                  </p>
                  {r.rows.map((x) => (
                    <p key={x.head} className={`${glass.row} ${glass.text} ${glass.tight} ${glass.rise}`}>
                      <span>
                        <b>{x.head}</b> <span className={glass.g}>{x.body}</span>
                      </span>
                    </p>
                  ))}
                </div>
              ))}
              {pick}
              {slot.ask ? <Ask cinRef={leadRef} /> : null}
              {slot.ask ? <div className={glass.pocket}>{rail}</div> : null}
            </div>
            <Rule />
          </section>
        );
      case "head":
        return <Head key={`head-${slot.run.id}`} r={slot.run} go={go} />;
      case "tiles":
        return <Tiles key={`tiles-${slot.run.id}`} r={slot.run} />;
      case "single":
        return <Single key={`single-${slot.run.id}`} r={slot.run} />;
      case "method":
        return (
          <section key="method" className={glass.col} data-col="method" aria-labelledby="method">
            <div className={glass.cin}>
              {head("method", CUSTOM.heads.method)}
              {METHOD.map((m) => (
                <p key={m.head} className={`${glass.row} ${glass.text} ${glass.rise}`}>
                  <span>
                    <b>{m.head}</b> <span className={glass.g}>{m.body}</span>
                  </span>
                </p>
              ))}
            </div>
            <Rule />
          </section>
        );
      case "clients":
        return (
          /* twenty years of clients, the credits the footer and the board
             keep, with the way out to all the work */
          <section key="clients" className={glass.col} data-col="clients" aria-labelledby="clients">
            <div className={glass.cin}>
              {head("clients", CUSTOM.heads.clients)}
              {CREDITS.map((c) => (
                <p key={c.name} className={`${glass.row} ${glass.text} ${glass.tight} ${glass.rise}`}>
                  <span>
                    <b>{c.name}</b>
                  </span>
                </p>
              ))}
              <p className={own.ways}>
                <Link className={glass.chip} href="/">
                  <span className="lbl">{CUSTOM.all}</span>
                  <span className={glass.arr} aria-hidden="true" />
                </Link>
              </p>
            </div>
            <Rule />
          </section>
        );
      case "talk":
        return (
          /* THE CALL HAPPENS HERE, not on a page of its own. The week is
             the board's own (Week, on the glass), so picking a time is
             the same act in the same clothes wherever it is offered. His
             pricing line is the grey half: what it costs to find out. */
          <section key="talk" className={`${glass.col} ${glass.dark}`} data-col="talk" aria-labelledby="talk">
            <div className={glass.cin}>
              {head("talk", CUSTOM.heads.talk)}
              <p className={`${glass.statement} ${glass.rise}`}>
                {CUSTOM.talk.lede}{" "}
                <span className={glass.g}>
                  {CUSTOM.talk.price} It&rsquo;s a {SLOT_MINUTES} minute call.
                </span>
              </p>
              <Week />
              <p className={own.ways}>
                <a className={glass.chip} href={`mailto:${CUSTOM.talk.email}`}>
                  {CUSTOM.talk.email}
                </a>
              </p>
            </div>
            <Rule />
          </section>
        );
      default:
        return null;
    }
  });

  return (
    /* data-lenis-prevent: the shell's smooth scroller listens on <main>,
       which holds this page, and would swallow the wheel before a column
       could take it */
    <div ref={rootRef} className={glass.page} data-lenis-prevent>
      <PaperGround />

      <div className={glass.cover}>
        <Link className={glass.mark} href="/" aria-label="Reckon House">
          Reckon<i>*</i>House<span className={glass.here}>{CUSTOM.caption}</span>
        </Link>
        <button
          type="button"
          className={glass.more}
          hidden={!past}
          onClick={() => stripRef.current && turnRow(stripRef.current, 1)}
          aria-label={`${past} more ${past === 1 ? "column" : "columns"}`}
        >
          +{past} &rarr;
        </button>
      </div>

      <nav className={glass.rail} aria-label="On this page">
        {rail}
      </nav>

      <div ref={stripRef} className={glass.strip}>
        {columns}
        {/* the fifth of a column past the last one, so its rule and its
            count stand on the glass when the row has turned to its end */}
        <div className={glass.tail} aria-hidden="true" />
      </div>
    </div>
  );
}
