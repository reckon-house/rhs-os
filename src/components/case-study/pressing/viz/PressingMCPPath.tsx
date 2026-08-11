"use client";

import { useRef, type CSSProperties } from "react";
import { useVizArrival, useReadingHead } from "@/lib/viz-motion";
import { px } from "@/lib/px";
import styles from "./PressingViz.module.css";

/**
 * @shape sticks — conforms to lab/viz-system.html
 *
 * PressingMCPPath — the DSC MCP system, rethought for the chart system.
 *
 * The first pressing draft was a drop-line spine: every tool, check and
 * record as a dot with a rotated label on a leader. Held against the
 * sheet it was not one of the four shapes — position along the spine
 * carried nothing, leader length deliberately carried nothing, so every
 * mark on the page was layout pretending to be geometry. The honest
 * quantities in this data are the GROUP COUNTS, and counts are sticks.
 *
 * So: five grounded sticks in pipeline order — the request path a call
 * actually takes, clients → reads → writes → checks → data model — each
 * height a count summed from the roster it stands over, never typed by
 * hand. The rosters keep every name, verbatim, as the ledger under each
 * stick: type carries the inventory the way type carries the number.
 *
 * WRITES is the grey stick, and the grey is data: the two write tools
 * are gated behind owner approval, a state the reads never enter — the
 * classic legend's one distinction ("9 reads — instant, 2 writes —
 * booking & cancellation"), now carried by tone and named by the pill.
 *
 * What still does not come over from the classic: the 2,200-node
 * particle field, ambient dust, radiating spokes, 150 rim ticks (seeded
 * RNG, the generated density the kit rules out) and the per-entity
 * `importance` weights, which carry no unit and no source. Tool names
 * stay lowercase — they are code identifiers, quoted, not labels.
 *
 * Arrival replays the pipeline left to right. The reading head walks
 * the five group labels; five sits inside both the floor and ceiling.
 */

/** The three AI clients, verbatim. */
const AI_CLIENTS = ["CLAUDE", "CHATGPT", "MCP CLIENTS"];

/** The 11 live MCP tools, verbatim: source order, 9 reads then 2 writes. */
const READS = [
  "gym_overview",
  "list_services",
  "list_trainers",
  "trainer_bio",
  "my_trainer",
  "my_trainer_availability",
  "my_sessions",
  "my_pending_requests",
  "suggest_slots",
];
const WRITES = ["request_session", "cancel_session"];

/** The engine's deterministic checks, verbatim. */
const CHECKS = ["AVAILABILITY", "CONFLICTS", "CAPACITY", "DURATION", "CANCELLATION"];

/** The data model, verbatim — including the three stated counts. */
const RECORDS = [
  "ATHLETES · 100+",
  "TRAINERS · 6",
  "PROGRAMS",
  "SESSIONS",
  "HOURS",
  "LOCATIONS · 2",
];

const GROUPS: { name: string; roster: string[]; gated?: boolean }[] = [
  { name: "AI CLIENTS", roster: AI_CLIENTS },
  { name: "READS", roster: READS },
  { name: "WRITES", roster: WRITES, gated: true },
  { name: "CHECKS", roster: CHECKS },
  { name: "DATA MODEL", roster: RECORDS },
];
const MAX = Math.max(...GROUPS.map((g) => g.roster.length));

const W = 1100;
const BASE = 300;
const PLOT = 240;
const STICK = 10;
const LBL_Y = BASE + 30;
const PILL_Y = BASE + 44;
const ROSTER_Y = BASE + 78;
const ROSTER_LH = 17;
const H = ROSTER_Y + MAX * ROSTER_LH + 8;

const xAt = (i: number) => px(150 + i * 200);

export function PressingMCPPath() {
  const ref = useRef<HTMLDivElement>(null);
  const drawn = useVizArrival(ref);
  const head = useReadingHead(ref, GROUPS.length);

  return (
    <div className={styles.viz} ref={ref}>
      <div className={styles.head}>
        <span className={styles.lbl}>The MCP system</span>
        <span className={`${styles.lbl} ${styles.grey}`}>
          {`3 clients · 11 tools · 5 checks · 6 records`}
        </span>
      </div>

      <div className={styles.scroller} data-lenis-prevent-touch>
        <svg
          className={styles.wide}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          role="img"
          aria-label={
            "The DSC MCP system in pipeline order: 3 AI clients, 9 read tools, " +
            "2 write tools pending owner approval, 5 deterministic checks, 6 data records"
          }
        >
          <line
            x1={40}
            y1={BASE}
            x2={W - 40}
            y2={BASE}
            stroke="var(--pv-ink)"
            strokeWidth="var(--pv-fine)"
          />

          {GROUPS.map((g, i) => {
            const x = xAt(i);
            const n = g.roster.length;
            const h = (n / MAX) * PLOT;
            const y1 = BASE - STICK / 2;
            const y2 = BASE - h + STICK / 2;
            const len = Math.abs(y1 - y2);
            const stroke = g.gated ? "var(--pv-grey)" : "var(--pv-ink)";
            return (
              <g key={g.name}>
                <line
                  className={styles.draw}
                  x1={x}
                  y1={y1}
                  x2={x}
                  y2={px(y2)}
                  stroke={stroke}
                  strokeWidth={STICK}
                  strokeLinecap="round"
                  strokeDasharray={px(len)}
                  strokeDashoffset={drawn ? 0 : px(len)}
                  style={{ "--lag": `${(i * 0.12).toFixed(2)}s` } as CSSProperties}
                />
                <text
                  x={x}
                  y={px(y2 - 24)}
                  textAnchor="middle"
                  fontSize={20}
                  fontWeight={600}
                  style={{
                    fill: stroke,
                    letterSpacing: "-0.01em",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {n}
                </text>

                {/* the group label: the reading head's walk */}
                <text
                  x={x}
                  y={LBL_Y}
                  textAnchor="middle"
                  className={styles.lbl}
                  style={{
                    fill: head === i ? "var(--pv-ink)" : "var(--pv-grey)",
                    transition: "fill 0.32s ease",
                  }}
                >
                  {g.name}
                </text>

                {/* the gate, named: the one emphasis on the page */}
                {g.gated ? (
                  <g
                    className={`${styles.fade} ${drawn ? styles.fadeIn : ""}`}
                    style={{ "--lag": "0.9s" } as CSSProperties}
                  >
                    <rect
                      x={px(150 + i * 200 - 70)}
                      y={PILL_Y}
                      rx={10}
                      width={140}
                      height={20}
                      fill="var(--pv-ink)"
                    />
                    <text
                      x={x}
                      y={PILL_Y + 14}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight={600}
                      letterSpacing="0.06em"
                      fill="var(--pp-paper)"
                    >
                      PENDING APPROVAL
                    </text>
                  </g>
                ) : null}

                {/* the roster: every name, verbatim, as the ledger */}
                {g.roster.map((label, r) => (
                  <text
                    key={label}
                    x={x}
                    y={ROSTER_Y + r * ROSTER_LH}
                    textAnchor="middle"
                    className={styles.schemNum}
                  >
                    {label}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default PressingMCPPath;
