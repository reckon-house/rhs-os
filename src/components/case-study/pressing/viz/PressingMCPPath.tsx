import { px } from "@/lib/px";
import styles from "./PressingViz.module.css";

/**
 * PressingMCPPath — the pressing skin for `mcp-architecture` (dsc),
 * drawn as the drop-line field (VIZ-PASS.md).
 *
 * One spine, twenty-five drops: the path a message takes from the chat
 * window to the record, left to right. Three AI clients, the eleven-tool
 * surface, the five checks the engine runs, the six records it reads and
 * writes. Position along the spine is band membership and the item's
 * place inside its band — nothing else. The spine is a path, not a
 * scale, so it carries no poles and no ticks that would imply one.
 *
 * Verbatim from MCPArchitecture: the eleven tool names in source order
 * with their read/write kind, the five check names, the six record names
 * carrying the three counts the study states (100+ athletes, six
 * trainers, two locations), and the three clients. Tool names stay
 * lowercase snake_case because that is the identifier — uppercasing it
 * would be a different string, not a styling choice.
 *
 * The deviation from the ASSIGNMENT, named out loud: VIZ-PASS.md asks
 * for "servers and clients as lines, calls as dots". Every entity is
 * drawn as a dot here and there are no call marks at all, because the
 * study authors no call-volume data — drawing calls would be exactly
 * the generated density the kit rules out. The shape is the assigned
 * one; the thing it has no numbers for is simply absent.
 *
 * The deviation from the exemplar's grammar, also named out loud: the
 * spectrum alternates sides purely to keep labels apart, and here the
 * side is the datum. The two writes hang BELOW the spine, because
 * read-versus-write is the only distinction the classic legend spelled
 * out ("9 reads — instant", "2 writes — booking & cancellation") and a
 * position states it with no swatch to decode. Everything else drops
 * upward. Leader length is constant within a side: the strongest
 * available statement that length is not measuring anything.
 *
 * What did not come over: the 2,200-node particle field, the ambient
 * dust, the atmospheric web, the radiating spokes, the 150 rim ticks.
 * All of it seeded RNG — the generated density the kit rules out, and
 * the same construction that cost SystemArchitecture a triple hydration
 * mismatch per load. Every coordinate here is arithmetic through px().
 * Also dropped: the per-entity `importance` weights (30, 22, 15, 14, 12,
 * 8). They exist to size particle clusters, carry no unit and no source,
 * and drawing them would put a scale under a quantity the study never
 * measured.
 *
 * No accent. There is no single datum this chart exists to point at —
 * the schematic IS the point — so it stays pure ink, per the kit's rule
 * that a chart without one point gets none.
 */

/** The three AI clients, verbatim. */
const AI_CLIENTS = ["CLAUDE", "CHATGPT", "MCP CLIENTS"];

/** The 11 live MCP tools, verbatim: source order, 9 reads then 2 writes. */
const TOOLS: { label: string; kind: "read" | "write" }[] = [
  { label: "gym_overview", kind: "read" },
  { label: "list_services", kind: "read" },
  { label: "list_trainers", kind: "read" },
  { label: "trainer_bio", kind: "read" },
  { label: "my_trainer", kind: "read" },
  { label: "my_trainer_availability", kind: "read" },
  { label: "my_sessions", kind: "read" },
  { label: "my_pending_requests", kind: "read" },
  { label: "suggest_slots", kind: "read" },
  { label: "request_session", kind: "write" },
  { label: "cancel_session", kind: "write" },
];

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

type Node = { label: string; below: boolean };

const BANDS: { name: string; nodes: Node[] }[] = [
  {
    name: "AI CLIENTS · 3",
    nodes: AI_CLIENTS.map((label) => ({ label, below: false })),
  },
  {
    name: "TOOL SURFACE · 9 READS · 2 WRITES",
    nodes: TOOLS.map((t) => ({ label: t.label, below: t.kind === "write" })),
  },
  {
    name: "DETERMINISTIC CHECKS · 5",
    nodes: CHECKS.map((label) => ({ label, below: false })),
  },
  {
    name: "DATA MODEL · 6",
    nodes: RECORDS.map((label) => ({ label, below: false })),
  },
];

const W = 1100;
/* Tall enough for the longest label from each side: 84 + 6 + ~137px of
   9px mono above (`my_trainer_availability`), and 44 + 6 + ~89px below
   (`request_session`) with the band strip clearing it. */
const H = 500;
const PAD_X = 76;
const AXIS_Y = 262;
const UP = 84;    // leader length above the spine — constant, and means nothing
const DOWN = 44;  // ditto below; shorter only so the band strip clears it
const GAP_SLOTS = 1.4;

const COUNT = BANDS.reduce((n, b) => n + b.nodes.length, 0);
const STEP = (W - PAD_X * 2) / (COUNT + GAP_SLOTS * (BANDS.length - 1));

/* One pass, at module scope: even slots down the whole field, a slot and
   a bit of air between bands. Deterministic arithmetic, so the server
   and the browser serialize the same numbers. */
const LAID = (() => {
  let cursor = PAD_X + STEP / 2;
  return BANDS.map((band) => {
    const xs = band.nodes.map((_, i) => px(cursor + i * STEP));
    cursor += (band.nodes.length + GAP_SLOTS) * STEP;
    return { band, xs };
  });
})();

/* The two writes, for the brace that names what a write actually does. */
const WRITE_XS = LAID[1].xs.filter((_, i) => BANDS[1].nodes[i].below);
const BRACE_L = px(WRITE_XS[0] - STEP / 2);
const BRACE_R = px(WRITE_XS[WRITE_XS.length - 1] + STEP / 2);
const BRACE_Y = 410;

const STRIP_Y = 452;   // the band brackets
const STRIP_LBL = 474; // and their names

export function PressingMCPPath() {
  return (
    <div className={styles.viz}>
      <div className={styles.scroller} data-lenis-prevent-touch>
        <svg
          className={styles.wide}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          role="img"
          aria-label="The request path through the DSC MCP server, left to right: three AI clients, an eleven-tool surface split nine reads and two writes, five deterministic engine checks, and the six records the engine reads and writes"
        >
          {/* The spine. A path, not a scale: no end ticks, no poles. */}
          <line
            x1={PAD_X} y1={AXIS_Y} x2={W - PAD_X} y2={AXIS_Y}
            stroke="var(--pp-ink)" strokeOpacity="0.14"
          />

          {LAID.map(({ band, xs }) =>
            band.nodes.map((n, i) => {
              const x = xs[i];
              const yEnd = n.below ? AXIS_Y + DOWN : AXIS_Y - UP;
              const yLbl = n.below ? yEnd + 6 : yEnd - 6;
              return (
                <g key={`${band.name}-${n.label}`}>
                  <line
                    x1={x} y1={n.below ? AXIS_Y + 7 : AXIS_Y - 7} x2={x} y2={yEnd}
                    stroke="var(--pp-ink)" strokeOpacity="0.14"
                  />
                  <circle cx={x} cy={AXIS_Y} r={3} fill="var(--pp-ink)" />
                  {/* Rotated mono label, reading away from the spine. */}
                  <text
                    x={x} y={yLbl}
                    transform={`rotate(-90 ${x} ${yLbl})`}
                    textAnchor={n.below ? "end" : "start"}
                    dominantBaseline="middle"
                    className={styles.schemNum}
                  >
                    {n.label}
                  </text>
                </g>
              );
            })
          )}

          {/* The brace over the two drops that hang below: what a write
              costs. Pinned to the data it describes, not set off in a
              legend. */}
          <line
            x1={BRACE_L} y1={BRACE_Y} x2={BRACE_R} y2={BRACE_Y}
            stroke="var(--pp-ink)" strokeOpacity="0.14"
          />
          <text
            x={px((BRACE_L + BRACE_R) / 2)} y={BRACE_Y + 14}
            textAnchor="middle" dominantBaseline="hanging"
            className={styles.schemNum}
          >
            PENDING APPROVAL
          </text>

          {/* Band brackets: each stage of the path, named under it. */}
          {LAID.map(({ band, xs }) => {
            const l = px(xs[0] - STEP / 2);
            const r = px(xs[xs.length - 1] + STEP / 2);
            return (
              <g key={band.name}>
                <line
                  x1={l} y1={STRIP_Y} x2={r} y2={STRIP_Y}
                  stroke="var(--pp-ink)" strokeOpacity="0.14"
                />
                <line x1={l} y1={STRIP_Y} x2={l} y2={STRIP_Y - 5} stroke="var(--pp-ink)" strokeOpacity="0.14" />
                <line x1={r} y1={STRIP_Y} x2={r} y2={STRIP_Y - 5} stroke="var(--pp-ink)" strokeOpacity="0.14" />
                <text x={l} y={STRIP_LBL} textAnchor="start" className={styles.schemLbl}>
                  {band.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
