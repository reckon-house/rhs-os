"use client";

/* ── /custom, ON THE BOARD'S GLASS ───────────────────────────────────
 * The page a small business lands on from an email, so it is a straight
 * read and not the board: one audience, in the grammar the rest of the
 * site is in, with a rail of doors down the left as the board has. The
 * statement and the two doors, then each door as a RUN the way the
 * board deals one: an opening that sets the stage (a head with a wide
 * hero, or a pitch spread beside one), then that door's pieces, each a
 * column in the clothes a study's preview wears. Then twenty years of
 * the studio's work with the way out to all of it, how the work goes,
 * and the house's own black column with the call, and the week in it.
 *
 * THREE EXPLORATIONS, for now, on ?v=a|b|c and the rail's foot: A opens
 * each run on the board's head and a wide hero; B on a two-column
 * spread, the pitch at display size beside the hero; C opens the page
 * itself on a cover, runs as A, and carries the story in beats between
 * them. The winner keeps the page; the others come out.
 *
 * THE ASK IS THE BOARD'S. A question typed under the statement is
 * answered from the recent work's studies (/api/ask), and the studies
 * the answer names stand under it as chips. A question about reaching
 * him is answered without the trip.
 *
 * ?for=Cleve hangs a chip beside the page's own, so a link sent to one
 * person addresses that person. Nothing else about the page changes.
 *
 * Still a client component that SSRs: every word and every row is in
 * the HTML before a script runs. The turning, the ink, the counts and
 * the Ask are layered on, and the mechanism is the glass's
 * (src/components/glass), shared with /daybook.
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
import glass from "@/components/glass/glass.module.css";
import own from "./custom.module.css";
import {
  BEATS,
  COVER,
  CUSTOM,
  DOORS,
  PIECES,
  RUNS,
  STUDIO,
  type Beat as BeatT,
  type Hero,
  type Piece as PieceT,
  type Row,
  type Run,
} from "@/data/custom";
import { plateSrcSet } from "@/lib/img-srcset";
import { METHOD } from "@/data/method";
import { BOOK_DIM } from "@/data/booking";
import { projects } from "@/data/projects";

/* the studies the Ask reads: the pieces', so an answer about
   scheduling comes from the gym's study rather than a guess */
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

/* ── WHO THE LINK IS FOR ───────────────────────────────────────────
   Read through an external store rather than copied into state, so
   the server's page and the client's first render agree and the chip
   appears once the address is read. Plain text, forty characters. */
const heard = new Set<() => void>();
const subscribeFor = (fn: () => void) => {
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

/* the board's thumb at the rungs the generator wrote beside it */
const THUMBS = "/lab/board-thumbs/";
const rungsOf = (src: string, w?: number) =>
  `${src.replace(/\.webp$/, "@384.webp")} 384w, ${src.replace(/\.webp$/, "@768.webp")} 768w, ${src} ${w ?? 1536}w`;
const rungs = (r: Row) => (r.thumb ? rungsOf(r.thumb, r.w) : undefined);
/* a piece's picture: the board's thumb with its rungs, or a plate
   through the site's own ladder (raw in development, where the
   optimizer is off) */
const plateSet = (img: PieceT["image"]) =>
  img.src.startsWith(THUMBS) ? rungsOf(img.src, img.w) : plateSrcSet(img.src, img.w);

/* ── A PIECE OF THE WORK (assemble-board.py openStudyColumn) ────────
   A study's preview on the board is its chip, its own sentence, the
   way to the full study, and its cover. A piece wears the same: the
   piece's name and its study as chips, the study's sentence about the
   piece, "Full case study", and the piece's picture at the column's
   measure. */
function Piece({ p }: { p: PieceT }) {
  return (
    <section className={glass.col} data-col={`piece-${p.id}`} aria-labelledby={`piece-${p.id}`}>
      <div className={glass.cin}>
        <div className={glass.chead}>
          <span className={glass.tag}>{p.chip}</span>
          <span className={`${glass.tag} ${glass.g}`}>{p.project}</span>
        </div>
        <h2 id={`piece-${p.id}`} className={`${glass.statement} ${glass.rise}`}>
          {p.lede} <span className={glass.g}>{p.dim}</span>
        </h2>
        <p className={`${own.ways} ${glass.rise}`}>
          <Link className={glass.chip} href={p.href}>
            <span className="lbl">{CUSTOM.full}</span>
            <span className={glass.arr} aria-hidden="true" />
          </Link>
        </p>
        <figure className={`${own.plate} ${glass.rise}`}>
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
        </figure>
      </div>
      <Rule />
    </section>
  );
}

/* a study on the shelf: its cover, its name, its line. The name is
   the curtain's label (.lbl), so leaving for the study says the
   study's name and not the whole row. */
function Shelf({ r }: { r: Row }) {
  return (
    <Link
      className={`${glass.row}${r.thumb ? "" : ` ${glass.text}`} ${glass.rise}`}
      href={r.href}
    >
      {r.thumb ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={r.thumb}
          srcSet={rungs(r)}
          sizes="96px"
          width={96}
          height={72}
          alt=""
          loading="lazy"
          decoding="async"
        />
      ) : null}
      <span>
        <span className="lbl">
          <b>{r.title}</b>
        </span>{" "}
        <span className={glass.g}>{r.line}</span>
      </span>
    </Link>
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

/* ── WHICH EXPLORATION ─────────────────────────────────────────────
   ?v=a|b|c, read through the same store as ?for=, and written by the
   rail's foot so the row rebuilds without a load. A is the page when
   nothing is said. */
type Variant = "a" | "b" | "c";
const readVariant = (): Variant => {
  try {
    const v = new URLSearchParams(window.location.search).get("v");
    return v === "b" || v === "c" ? v : "a";
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

/* what stands in the row, by exploration: a kind, and what it is of */
type Slot =
  | { kind: "statement" }
  | { kind: "cover" }
  | { kind: "head"; run: Run }
  | { kind: "spread"; run: Run }
  | { kind: "pieces"; run: Run }
  | { kind: "beat"; beat: BeatT }
  | { kind: "studio" }
  | { kind: "method" }
  | { kind: "talk" };
const run = (id: Run["id"]) => RUNS.find((r) => r.id === id)!;
const beat = (id: string) => BEATS.find((b) => b.id === id)!;
const ROW: Record<Variant, Slot[]> = {
  a: [
    { kind: "statement" },
    { kind: "head", run: run("setup") },
    { kind: "pieces", run: run("setup") },
    { kind: "head", run: run("build") },
    { kind: "pieces", run: run("build") },
    { kind: "studio" },
    { kind: "method" },
    { kind: "talk" },
  ],
  b: [
    { kind: "statement" },
    { kind: "spread", run: run("setup") },
    { kind: "pieces", run: run("setup") },
    { kind: "spread", run: run("build") },
    { kind: "pieces", run: run("build") },
    { kind: "studio" },
    { kind: "method" },
    { kind: "talk" },
  ],
  c: [
    { kind: "cover" },
    { kind: "statement" },
    { kind: "head", run: run("setup") },
    { kind: "pieces", run: run("setup") },
    { kind: "beat", beat: beat("account") },
    { kind: "head", run: run("build") },
    { kind: "pieces", run: run("build") },
    { kind: "beat", beat: beat("years") },
    { kind: "studio" },
    { kind: "method" },
    { kind: "talk" },
  ],
};

const heroSet = (h: Hero) => plateSet({ src: h.src, w: h.w, h: h.h, alt: h.name });

/* a hero, captioned as the board captions a cover */
function HeroPlate({ h, className }: { h: Hero; className: string }) {
  return (
    <figure className={`${className} ${glass.rise}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={h.src}
        srcSet={heroSet(h)}
        sizes="(max-width: 760px) 84vw, 1000px"
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

/* ── A RUN'S HEAD (assemble-board.py, the head tile) ────────────────
   The name in ink, its one line in grey, and a chip that counts what
   follows and turns the row to it; the run's hero spans the pair under
   it. */
function Head({ r, go }: { r: Run; go: (col: string) => void }) {
  const mine = PIECES.filter((p) => p.run === r.id);
  return (
    <section className={glass.pair} data-col={r.id} aria-labelledby={`run-${r.id}`}>
      <div className={glass.cin}>
        <div className={glass.pairHead}>
          <h2 id={`run-${r.id}`} className={`${glass.statement} ${glass.rise}`}>
            {r.name} <span className={glass.g}>{r.line}</span>
          </h2>
          <p className={`${own.ways} ${glass.rise}`}>
            <button
              type="button"
              className={glass.chip}
              onClick={() => mine[0] && go(`piece-${mine[0].id}`)}
            >
              <span>
                {mine.length} {mine.length === 1 ? "piece" : "pieces"}
              </span>
              <span className={glass.arr} aria-hidden="true" />
            </button>
          </p>
        </div>
        <HeroPlate h={r.hero} className={glass.hero} />
      </div>
      <Rule />
    </section>
  );
}

/* ── THE COVER ──────────────────────────────────────────────────────
   One claim over a wide hero, before the lede: the page's own first
   sentence, set a notch over the statement. */
function Cover() {
  return (
    <section className={`${glass.pair} ${glass.beat}`} data-col="cover" aria-label="Cover">
      <div className={glass.cin}>
        <div className={glass.pairHead}>
          <p className={`${glass.claim} ${glass.rise}`}>
            {COVER.lede} <span className={glass.g}>{COVER.dim}</span>
          </p>
        </div>
        <HeroPlate h={COVER.hero} className={glass.hero} />
      </div>
      <Rule />
    </section>
  );
}

/* ── A SPREAD: THE PITCH BESIDE THE HERO ────────────────────────────
   Two columns that read as one page: the run's pitch at display size,
   and its picture. A portrait takes the whole column, cut to the
   screen's height, as a tall hero does on the board; a landscape stands
   at its own ratio. */
function Spread({ r }: { r: Run }) {
  const tall = r.tall;
  return (
    <>
      <section className={glass.col} data-col={r.id} aria-labelledby={`run-${r.id}`}>
        <div className={glass.cin}>
          <div className={glass.chead}>
            <span className={glass.tag}>{r.name.replace(/\.$/, "")}</span>
          </div>
          <h2 id={`run-${r.id}`} className={`${glass.statement} ${glass.rise}`}>
            {r.pitch.lede} <span className={glass.g}>{r.pitch.dim}</span>
          </h2>
        </div>
        <Rule />
      </section>
      {tall ? (
        <section className={`${glass.col} ${glass.tall}`} aria-label={tall.name}>
          <div className={glass.cin}>
            <figure className={glass.tallFig}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tall.src}
                srcSet={heroSet(tall)}
                sizes="(max-width: 760px) 84vw, 480px"
                width={tall.w}
                height={tall.h}
                alt={tall.name}
                loading="lazy"
                decoding="async"
              />
              <figcaption className={glass.cap}>
                <b>{tall.name}</b> <span className={glass.g}>{tall.cat}</span>
              </figcaption>
            </figure>
          </div>
          <Rule />
        </section>
      ) : (
        <section className={glass.col} aria-label={r.hero.name}>
          <div className={glass.cin}>
            <HeroPlate h={r.hero} className={own.plate} />
          </div>
          <Rule />
        </section>
      )}
    </>
  );
}

/* ── A BEAT: THE STORY, TWO COLUMNS WIDE ────────────────────────────
   A claim and its grey half across the pair, with no picture: the
   page's own voice between the runs. */
function BeatCol({ b }: { b: BeatT }) {
  return (
    <section className={`${glass.pair} ${glass.beat}`} data-col={`beat-${b.id}`} aria-label={b.lede}>
      <div className={glass.cin}>
        <div className={glass.pairHead}>
          <p className={`${glass.claim} ${glass.rise}`}>
            {b.lede} <span className={glass.g}>{b.dim}</span>
          </p>
        </div>
      </div>
      <Rule />
    </section>
  );
}

/* the rail's doors, and the explorations at its foot */
function Rail({ v, go }: { v: Variant; go: (col: string) => void }) {
  return (
    <>
      {DOORS.map((d) => (
        <button key={d.col} type="button" className={glass.pill} onClick={() => go(d.col)}>
          <span>{d.label}</span>
        </button>
      ))}
      <span className={glass.gap} aria-hidden="true" />
      {(["a", "b", "c"] as Variant[]).map((x) => (
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

export function CustomBoard() {
  const who = useSyncExternalStore(subscribeFor, readFor, serverFor);
  const v = useSyncExternalStore(subscribeFor, readVariant, serverVariant);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const leadRef = useRef<HTMLDivElement | null>(null);
  /* the glass: ink, counts and the columns past the edge, redrawn when
     an exploration rebuilds the row; the rise under a curtain; the row
     turning from the keys and a held wheel */
  const past = useGlass(rootRef, stripRef, `.${glass.row}`, v);
  useArrival(stripRef);
  useTurns(stripRef);

  /* THE ROW STARTS OVER WHEN ITS STRUCTURE DOES. The strip snaps, and a
     snapping scroller remembers the column it last snapped to: the
     server renders A, so a page opened on ?v=c hydrates with the
     statement as that column, and the moment the cover is put ahead of
     it the browser re-snaps to the statement and the cover stands off
     the glass. Before the paint, so the reader never sees the jump. */
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

  const statement = (
    <section key="statement" className={`${glass.col} ${glass.lead}`} data-col="statement" aria-label={CUSTOM.caption}>
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
        <div className={own.doors}>
          {CUSTOM.doors.map((d) => (
            <p key={d.head} className={`${own.door} ${glass.rise}`}>
              <b>{d.head}</b> {d.body}
            </p>
          ))}
        </div>
        <p className={`${own.price} ${glass.rise}`}>{CUSTOM.price}</p>
        {/* the call, here as well as at the end: the row is long enough
            that the reader sold on the first column should not have to
            turn past everything to reach a time */}
        <p className={`${own.ways} ${glass.rise}`}>
          <button type="button" className={glass.chip} onClick={() => go("talk")}>
            <span>{CUSTOM.talk.book}</span>
            <span className={glass.arr} aria-hidden="true" />
          </button>
        </p>
        <Ask cinRef={leadRef} />
        {/* on a phone the rail has no column of its own, so it rides
            under the statement, in the column that introduces it */}
        <div className={glass.pocket}>
          <Rail v={v} go={go} />
        </div>
      </div>
      <Rule />
    </section>
  );

  const columns = ROW[v].map((slot) => {
    switch (slot.kind) {
      case "statement":
        return statement;
      case "cover":
        return <Cover key="cover" />;
      case "head":
        return <Head key={`head-${slot.run.id}`} r={slot.run} go={go} />;
      case "spread":
        return <Spread key={`spread-${slot.run.id}`} r={slot.run} />;
      case "pieces":
        return PIECES.filter((p) => p.run === slot.run.id).map((p) => <Piece key={p.id} p={p} />);
      case "beat":
        return <BeatCol key={`beat-${slot.beat.id}`} b={slot.beat} />;
      case "studio":
        return (
          <section key="studio" className={glass.col} data-col="studio" aria-labelledby="studio">
            <div className={glass.cin}>
              {head("studio", CUSTOM.heads.studio)}
              {STUDIO.map((r) => (
                <Shelf key={r.href} r={r} />
              ))}
              <p className={`${own.large} ${glass.rise}`}>
                <span className={glass.g}>{CUSTOM.large}</span>
              </p>
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
      case "talk":
        return (
          /* THE CALL HAPPENS HERE, not on a page of its own. The week is
             the board's own (Week, on the glass), so picking a time is
             the same act in the same clothes wherever it is offered. */
          <section key="talk" className={`${glass.col} ${glass.dark}`} data-col="talk" aria-labelledby="talk">
            <div className={glass.cin}>
              {head("talk", CUSTOM.heads.talk)}
              <p className={`${glass.statement} ${glass.rise}`}>
                {CUSTOM.talk.lede} <span className={glass.g}>{BOOK_DIM}</span>
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
        <Rail v={v} go={go} />
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
