"use client";

/* ── /custom, ON THE BOARD'S GLASS ───────────────────────────────────
 * The page a small business lands on from an email, so it is a straight
 * read and not the board: one audience, in the grammar the rest of the
 * site is in. The statement and the two doors, then the recent work in
 * pieces, each a column in the clothes a study's preview wears on the
 * board, then twenty years of the studio's work with the way out to all
 * of it, then how the work goes, then the house's own black column
 * with the call.
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
import { CUSTOM, PIECES, STUDIO, type Piece as PieceT, type Row } from "@/data/custom";
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
    <section className={glass.col} aria-labelledby={`piece-${p.id}`}>
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

export function CustomBoard() {
  const who = useSyncExternalStore(subscribeFor, readFor, serverFor);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const leadRef = useRef<HTMLDivElement | null>(null);
  /* the glass: ink, counts and the columns past the edge; the rise
     under a curtain; the row turning from the keys and a held wheel */
  const past = useGlass(rootRef, stripRef, `.${glass.row}`, "");
  /* the offer's own way to the week: the row is fifteen columns now,
     and the reader sold on the first one should not have to turn past
     everything to reach a time */
  const goTalk = () => {
    const strip = stripRef.current;
    const col = strip?.querySelector<HTMLElement>('[data-col="talk"]');
    if (strip && col) strip.scrollTo({ left: col.offsetLeft, behavior: still() ? "auto" : "smooth" });
  };
  useArrival(stripRef);
  useTurns(stripRef);

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

      <div ref={stripRef} className={glass.strip}>
        <section className={`${glass.col} ${glass.lead}`} aria-label={CUSTOM.caption}>
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
            {/* the call, here as well as at the end: the row is long
                enough now that the reader who is sold on the first
                column should not have to turn ten more to find it */}
            <p className={`${own.ways} ${glass.rise}`}>
              <button type="button" className={glass.chip} onClick={goTalk}>
                <span>{CUSTOM.talk.book}</span>
                <span className={glass.arr} aria-hidden="true" />
              </button>
            </p>
            <Ask cinRef={leadRef} />
          </div>
          <Rule />
        </section>

        {PIECES.map((p) => (
          <Piece key={p.id} p={p} />
        ))}

        <section className={glass.col} aria-labelledby="studio">
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

        <section className={glass.col} aria-labelledby="method">
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

        {/* THE CALL HAPPENS HERE, not on a page of its own. The week is
            the board's own (Week, on the glass), so picking a time is
            the same act in the same clothes wherever it is offered. */}
        <section className={`${glass.col} ${glass.dark}`} data-col="talk" aria-labelledby="talk">
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

        {/* the fifth of a column past the last one, so its rule and its
            count stand on the glass when the row has turned to its end */}
        <div className={glass.tail} aria-hidden="true" />
      </div>
    </div>
  );
}
