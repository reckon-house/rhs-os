#!/usr/bin/env node
/* ── How the row lands, off the glass ────────────────────────────────
 *
 *   npm run flow:sim              the gesture suite at three module widths
 *   node scripts/flow-sim.mjs 528 "V0,K,TOL"   one width, other numbers
 *
 * The board's sideways feel lives in three pieces of assemble-board.py:
 * flowX/landX (the wheel stream, the lift, the landing column), the
 * fitting in pageTo (the landing spring's stiffness) and the spring in
 * tick. None of it can be felt from here, and the Browser pane parks
 * its animation loop whenever it is not showing, so this reads those
 * three pieces out of the assembler VERBATIM, stands them in a stub of
 * the board on a virtual clock, and plays a set of trackpad gestures
 * through them: gentle, generous, hard, a 120Hz paired tail, an
 * integer tail with a wobble, a hand that stops before it lifts, a
 * mouse notch, a nudge. Each line is where it landed, when the lift
 * was caught, when it settled, and the velocity after the lift — with
 * a flag when that velocity rises again (a pause is a dip and a rise)
 * or runs backwards. Edit the assembler, run this, then feel it.
 */
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("./lib/assemble-board.py", import.meta.url), "utf8");
const cut = (from, to, tail = "") => {
  const a = src.indexOf(from); if (a < 0) throw new Error("flow-sim: no " + from);
  const b = src.indexOf(to, a); if (b < 0) throw new Error("flow-sim: no " + to);
  return src.slice(a, b + (tail ? to.length : 0));
};
const flow = cut("let flowT = 0, flowN = 0", "  pageTo(i);\n};\n", true);
const spring = cut("  const stiff = flowFrom != null", "  cur.x += vx * dt;\n", true);
const fit = cut("  const D = Math.abs(tgt.x - cur.x), moving", "\n", true).replace(/^(.*)$/m, (l) => l)
  + src.slice(src.indexOf("landW = D > 1", src.indexOf("const D = Math.abs(tgt.x - cur.x), moving")),
    src.indexOf("\n", src.indexOf("landW = D > 1", src.indexOf("const D = Math.abs(tgt.x - cur.x), moving"))) + 1);

const MOD = Number(process.argv[2]) || 0;
const FLOWQ = process.argv[3] || "";
const widths = MOD ? [MOD] : [386, 528, 700];

const harness = (MOD_X) => `
let now = 1000; const performance = { now: () => now };
let tid = 0; const timers = [];
const setTimeout = (fn, ms) => { const id = ++tid; timers.push({ id, at: now + ms, fn }); return id; };
const clearTimeout = (id) => { const i = timers.findIndex((t) => t.id === id); if (i >= 0) timers.splice(i, 1); };
const location = { search: ${JSON.stringify(FLOWQ ? "?flow=" + FLOWQ : "")} };
const GAP = 40;
const restX = (i) => i * MOD_X - GAP / 2;
let colIdx = 0; const tgt = { x: restX(0) }, cur = { x: restX(0) };
let dragging = false, dragAxis = null;
let flowFrom = null, flowRun = 0, flowLand = 0;
let vx = 0, tickT = 0, landW = 0.15;
const pageTo = (i) => {
  clearTimeout(flowLand); flowFrom = null;
  colIdx = Math.max(0, i); tgt.x = restX(colIdx);
${fit}};
${flow}
let acc = 0;
function frame() {
  const dt = 1;
  const turning = Math.abs(tgt.x - cur.x) > 0.5 || Math.abs(vx) > 0.05;
${spring}  if (!turning) { cur.x = tgt.x; vx = 0; }
}
/* time passes: due timers fire, and a frame is drawn for every 16.7ms */
function step(ms) {
  now += ms; acc += ms;
  for (const t of timers.filter((t) => t.at <= now)) { timers.splice(timers.indexOf(t), 1); t.fn(); }
  while (acc >= 16.7) { acc -= 16.7; frame(); }
}
return { step, flowX, get colIdx() { return colIdx; }, cur, get now() { return now; }, get coast() { return flowCoast; }, FLOW };
`;

const safariTail = (v0, n) => { const t = []; for (let i = 0; i < n; i++) t.push(Math.max(1, Math.round(v0 * Math.pow(0.9, i) + ((i % 3) === 1 ? 1 : 0)))); return t; };
const pairedTail = (v0, n) => { const t = []; for (let i = 0; i < n; i++) { const d = Math.round(v0 * Math.pow(0.96, i) / 2); t.push(d, d); } return t.slice(0, n); };
const GESTURES = [
  ["subtle flick, bunched", [40, 90, 70], safariTail(30, 25), 4],
  ["short fast flick", [50, 120, 90], safariTail(40, 25)],
  ["gentle flick", [8, 14, 22, 30, 32, 30], safariTail(16, 25)],
  ["generous swipe, 444px", Array(12).fill(37), safariTail(20, 25)],
  ["long swipe, 518px", Array(14).fill(37), safariTail(20, 25)],
  ["medium flick", [30, 55, 70, 65, 50], safariTail(40, 30)],
  ["hard flick", [60, 110, 130, 120, 100, 80], safariTail(60, 30)],
  ["very hard flick", [120, 220, 260, 240, 200, 150], safariTail(120, 30)],
  ["paired tail (120Hz)", [30, 55, 65, 60, 50, 40], pairedTail(50, 60)],
  ["plateau tail", [40, 60, 70, 60, 45, 30, 20], [12, 12, 11, 11, 9, 9, 8, 8, 7, 7, 6, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1]],
  ["long tail, 1s", [40, 70, 80, 70], Array.from({ length: 60 }, (_, i) => Math.max(1, Math.round(50 * Math.pow(0.95, i))))],
  ["hand stops, then lifts", Array(14).fill(20).map((d, i) => d + (i % 2)), []],
  ["slow crawl, stops", Array(20).fill(8), []],
  ["hand back on mid-tail", [30, 55, 70, 60, 45, 30, 20, 14, 10, 8, 6, 5, 40, 60, 60, 60, 60, 50, 40, 30, 20], safariTail(14, 20)],
  ["mouse notch", [100], []],
  ["nudge, 12px", [12], []],
  ["gentle flick back", [-8, -16, -24, -30, -30, -26], safariTail(14, 25).map((d) => -d)],
];

for (const MOD_X of widths) {
  const B = new Function("MOD_X", harness(MOD_X))(MOD_X);
  console.log(`module ${MOD_X}px  V0 ${B.FLOW.V0}  K ${B.FLOW.K}  TOL ${B.FLOW.TOL}`);
  for (const [name, direct, tail, gapMs] of GESTURES) {
    const from = B.colIdx, S = [];
    const play = (list, gap) => { for (const d of list) { B.flowX(d); B.step(gap); S.push([B.now, B.cur.x]); } };
    play(direct, gapMs || 16.7); if (gapMs && gapMs < 16.7) B.step(16.7); const liftAt = B.now; let caught = null;
    for (const d of tail) { B.flowX(d); if (B.coast && caught == null) caught = Math.round(B.now - liftAt); B.step(16.7); S.push([B.now, B.cur.x]); }
    for (let t = 0; t < 1500; t += 16.7) { B.step(16.7); S.push([B.now, B.cur.x]); }
    const v = []; for (let i = 1; i < S.length; i++) v.push([S[i][0] - liftAt, (S[i][1] - S[i - 1][1]) / ((S[i][0] - S[i - 1][0]) / 16.7)]);
    const after = v.filter((x) => x[0] > 0);
    const settled = after.find((x) => Math.abs(x[1]) < 0.3 && x[0] > 100);
    const before = after.filter((x) => !settled || x[0] < settled[0]);
    const sgn = Math.sign(direct[0]);
    const vmax = Math.max(...before.map((x) => Math.abs(x[1]))); let dip = 0;
    for (let i = 0; i < before.length; i++) for (let j = i + 1; j < before.length; j++) {
      const gain = sgn * (before[j][1] - before[i][1]);
      if (gain > Math.max(1.5, 0.15 * vmax)) dip = Math.max(dip, Math.round(gain));
    }
    const back = before.some((x) => sgn * x[1] < -0.3);
    const vel = before.filter((_, i) => i % 4 === 0).map((x) => Math.round(x[1])).slice(0, 10);
    const flag = (back ? "  BACKWARDS" : "") + (dip ? "  DIP +" + dip : "");
    console.log(`  ${name.padEnd(26)} ${String(B.colIdx - from).padStart(2)} col  lift ${String(caught == null ? "idle" : caught + "ms").padStart(5)}  settled ${String(settled ? Math.round(settled[0]) : "-").padStart(4)}ms  v ${vel.join(" ")}${flag}`);
    B.step(400);
  }
  console.log("");
}
