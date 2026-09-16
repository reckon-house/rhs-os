"use client";

/* ── /custom, ON THE BOARD'S GLASS ───────────────────────────────────
 * The page a small business lands on from an email, so it is a straight
 * read and not the board: one audience, in the grammar the rest of the
 * site is in, with the board's rail of doors down the left. It reads as
 * the studio's front door rather than a cut of the portfolio: the
 * studio and who it is for, then each of its three services dealt as
 * the board deals a run, a head with the service's one sentence and
 * what it is beside it, a wide hero across the pair, then two columns
 * of tiles, each a picture with the study's name and the study's own
 * line at 12px. Then how the work goes, twenty years of clients with
 * the way out to all of it, and the house's own black column with the
 * price line, the call and the week in it.
 *
 * THE BUDGET IS THE BOARD'S. An earlier draft dressed every piece as a
 * study preview and carried a study section at 32px in each, 58 words
 * a column, eleven columns running, and the pictures under the fold:
 * "there's so much text on all of them." A panel of five readings of
 * the system converged on the field's own rule: display prose once per
 * run, in its head; a picture carries a caption; every phrase has one
 * home. About 110 display words on the page now, the board's own
 * proportion.
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
import glass from "@/components/glass/glass.module.css";
import own from "./custom.module.css";
import { CUSTOM, DOORS, PIECES, RUNS, type Hero, type Piece as PieceT, type Run } from "@/data/custom";
import { CREDITS } from "@/components/shell/pressing-footer/PressingCredits";
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

/* ── WHO THE LINK IS FOR ───────────────────────────────────────────
   Read through an external store rather than copied into state, so
   the server's page and the client's first render agree and the chip
   appears once the address is read. Plain text, forty characters. */
const subscribeFor = (fn: () => void) => {
  window.addEventListener("popstate", fn);
  return () => window.removeEventListener("popstate", fn);
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

/* the board's thumb at the rungs the generator wrote beside it, or a
   plate through the site's own ladder (raw in development, where the
   optimizer is off) */
const THUMBS = "/lab/board-thumbs/";
const rungsOf = (src: string, w?: number) =>
  `${src.replace(/\.webp$/, "@384.webp")} 384w, ${src.replace(/\.webp$/, "@768.webp")} 768w, ${src} ${w ?? 1536}w`;
const plateSet = (img: { src: string; w?: number }) =>
  img.src.startsWith(THUMBS) ? rungsOf(img.src, img.w) : plateSrcSet(img.src, img.w);

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

/* a hero, captioned as the board captions a cover */
function HeroPlate({ h }: { h: Hero }) {
  return (
    <figure className={`${glass.hero} ${glass.rise}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={h.src}
        srcSet={plateSet(h)}
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
   The name in ink, its one sentence in grey, and a chip that counts the
   tiles and turns the row to them, with what the door actually is
   hanging beside it at read size; the run's hero spans the pair under
   both. The only display prose a run carries. */
function Head({ r, go }: { r: Run; go: (col: string) => void }) {
  const mine = PIECES.filter((p) => p.run === r.id);
  return (
    <section className={glass.pair} data-col={r.id} aria-labelledby={`run-${r.id}`}>
      <div className={glass.cin}>
        <div className={glass.pairHead}>
          <div>
            <h2 id={`run-${r.id}`} className={`${glass.statement} ${glass.rise}`}>
              {r.name} <span className={glass.g}>{r.line}</span>
            </h2>
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
          <p className={`${own.door} ${glass.rise}`}>{r.body}</p>
        </div>
        <HeroPlate h={r.hero} />
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
  const mine = PIECES.filter((p) => p.run === r.id);
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

/* the rail's doors */
function Rail({ go }: { go: (col: string) => void }) {
  return (
    <>
      {DOORS.map((d) => (
        <button key={d.col} type="button" className={glass.pill} onClick={() => go(d.col)}>
          <span>{d.label}</span>
        </button>
      ))}
    </>
  );
}

export function CustomBoard() {
  const who = useSyncExternalStore(subscribeFor, readFor, serverFor);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const leadRef = useRef<HTMLDivElement | null>(null);
  /* the glass: ink and counts (rows and tiles alike) and the columns
     past the edge; the rise under a curtain; the row turning from the
     keys and a held wheel */
  const past = useGlass(rootRef, stripRef, `.${glass.row}, .${glass.tile}`, "");
  useArrival(stripRef);
  useTurns(stripRef);

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
        <Rail go={go} />
      </nav>

      <div ref={stripRef} className={glass.strip}>
        <section className={`${glass.col} ${glass.lead}`} data-col="statement" aria-label="Reckon House, for small business">
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
            {/* the call, here as well as at the end: the reader sold on
                the first column should not have to turn past everything
                to reach a time */}
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
              <Rail go={go} />
            </div>
          </div>
          <Rule />
        </section>

        {RUNS.map((r) => (
          <Head key={`head-${r.id}`} r={r} go={go} />
        )).flatMap((h, i) => [h, <Tiles key={`tiles-${RUNS[i].id}`} r={RUNS[i]} />])}

        <section className={glass.col} data-col="method" aria-labelledby="method">
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

        {/* twenty years of clients, the credits the footer and the board
            keep, with the way out to all the work */}
        <section className={glass.col} data-col="clients" aria-labelledby="clients">
          <div className={glass.cin}>
            {head("clients", CUSTOM.heads.clients)}
            {CREDITS.map((c) => (
              <p key={c.name} className={`${glass.row} ${glass.text} ${glass.rise}`}>
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

        {/* THE CALL HAPPENS HERE, not on a page of its own. The week is
            the board's own (Week, on the glass), so picking a time is
            the same act in the same clothes wherever it is offered. His
            pricing line is the grey half: what it costs to find out. */}
        <section className={`${glass.col} ${glass.dark}`} data-col="talk" aria-labelledby="talk">
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

        {/* the fifth of a column past the last one, so its rule and its
            count stand on the glass when the row has turned to its end */}
        <div className={glass.tail} aria-hidden="true" />
      </div>
    </div>
  );
}
