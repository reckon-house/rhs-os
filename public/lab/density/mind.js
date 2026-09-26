/* ── THE MIND: the script (26 Sept 2026) ─────────────────────────────
   mind.html says why. This file: the field (every fragment, packed),
   the texture (every fragment as a mark, a tower per study), the spread
   a search pulls out, the catalogue a focus gathers, and the moves
   between them. Nothing in here is copy: every word on the page is
   read out of fragments.js through the kit in density.js. */
(() => {
  "use strict";
  const D = window.D, DATA = D.data, FR = D.frags;
  const IDX = new Map(FR.map((f, i) => [f.id, i]));
  const BY = new Map(FR.map((f) => [f.id, f]));
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const EASE = "cubic-bezier(0.2, 0.7, 0.2, 1)";
  const FLY = RM ? 0 : 760;
  const $ = (s) => document.querySelector(s);
  const H = { head: $("#head"), field: $("#field"), mind: $("#mind"), stage: $("#stage"), spread: $("#spread"), band: $("#band"),
    tex: $("#tex"), labs: $("#labs"), read: $("#read"), q: $("#q"), sug: $("#sug"), count: $("#count"), close: $("#close") };

  /* ── text: shown as written, except that no em dash reaches the page.
     A range between two figures gets an en dash, anything else a comma. */
  const clean = (s) => String(s == null ? "" : s).replace(/(\d)\s*\u2014\s*(\d)/g, "$1\u2013$2").replace(/\s*\u2014\s*/g, ", ");
  const T = (s) => D.esc(clean(s));
  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967296; };
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = (s) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s || ""); return m ? +m[3] + " " + MON[+m[2] - 1] + " " + m[1] : T(s); };
  const halves = (t) => { const i = t.indexOf(" | "); return i < 0 ? [t, ""] : [t.slice(0, i), t.slice(i + 3)]; };
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  /* the query's words, marked where they occur */
  const hl = (raw, toks) => {
    const s = clean(raw); if (!toks || !toks.length) return D.esc(s);
    const re = new RegExp("\\b(" + toks.map(escRe).join("|") + ")", "gi"); let out = "", last = 0, m;
    while ((m = re.exec(s))) { out += D.esc(s.slice(last, m.index)) + "<mark>" + D.esc(m[0]) + "</mark>"; last = m.index + m[0].length; if (!m[0].length) re.lastIndex++; }
    return out + D.esc(s.slice(last));
  };
  const cap = (k, tag) => "<" + (tag || "span") + ' class="cp">' + T(D.title(k)) + (D.year(k) ? "<i>" + D.year(k) + "</i>" : "") + "</" + (tag || "span") + ">";
  const imgIn = (im) => { im.alt = clean(im.alt); if (im.complete && im.naturalWidth) im.classList.add("in"); else im.addEventListener("load", () => im.classList.add("in"), { once: true }); return im; };

  /* ── the field's order: every kind of every study spread evenly down
     the whole page (the i-th of a study's n pictures sits near i/n, the
     same for its sentences, its figures, its spec lines), nudged by a
     hash so it never reads as a pattern; then no two neighbours from
     the same study. Any screen carries a bit of everything. ── */
  const byK = new Map();
  FR.forEach((f) => { if (!byK.has(f.k)) byK.set(f.k, []); byK.get(f.k).push(f); });
  const pos = new Map();
  /* the first of each kind of each study comes near the top, so the
     first screens are a front page of everything; after that, even */
  const kindOf = (f) => f.kind + (f.kind === "line" ? ":" + ({ body: "b", display: "h", sub: "s" }[f.weight] || "k") : "");
  const LATE = new Set(["line:h", "line:k", "fact", "tool"]);
  /* how deep the front page runs for each kind: pictures and figures first */
  const FRONT = { pic: 0.022, num: 0.02, chart: 0.02, palette: 0.045, "line:s": 0.05, day: 0.04, "line:b": 0.06 };
  byK.forEach((list) => {
    const g = new Map(); list.forEach((f) => { const k = kindOf(f); if (!g.has(k)) g.set(k, []); g.get(k).push(f); });
    /* a kind a study has only one of (its palette) comes to the front a third of the time */
    const front = (f, i, fs, kk) => i === 0 && !LATE.has(kk) && (fs.length > 1 || hash(f.id + "f") < 0.33);
    g.forEach((fs, kk) => fs.forEach((f, i) => pos.set(f.id, front(f, i, fs, kk) ? (FRONT[kk] || 0.05) * hash(f.id) : (i + 0.08 + 0.84 * hash(f.id)) / fs.length)));
  });
  const ORDER = FR.slice().sort((a, b) => pos.get(a.id) - pos.get(b.id));
  for (let i = 1; i < ORDER.length; i++) {
    if (ORDER[i].k !== ORDER[i - 1].k) continue;
    for (let j = i + 1; j < Math.min(ORDER.length, i + 14); j++) if (ORDER[j].k !== ORDER[i - 1].k) { ORDER.splice(i, 0, ORDER.splice(j, 1)[0]); break; }
  }

  /* ── the towers: About, then the studies in the order they were made,
     then the Daybook. Inside a tower the marks are stacked by kind,
     pictures at the foot and tools at the top, so each tower reads as
     what that project is made of. A key the data grows later gets a
     tower of its own at the end. ── */
  const KO = { pic: 0, palette: 1, num: 2, chart: 3, steps: 3, day: 4, line: 5, fact: 6, tool: 7 };
  const LO = { display: 0, sub: 1, head: 2, body: 3 };
  const TOWERS = [];
  const addTower = (k) => {
    const list = (byK.get(k) || []).slice().sort((a, b) => ((KO[a.kind] ?? 5) - (KO[b.kind] ?? 5)) || ((LO[a.weight] || 0) - (LO[b.weight] || 0)) || (IDX.get(a.id) - IDX.get(b.id)));
    if (list.length && !TOWERS.some((t) => t.k === k)) TOWERS.push({ k, list, y: D.year(k) });
  };
  addTower("about");
  D.studies.slice().sort((a, b) => (a.y || 0) - (b.y || 0)).forEach((s) => addTower(s.k));
  addTower("daybook");
  byK.forEach((_, k) => addTower(k));
  const TOWER_OF = new Map(); TOWERS.forEach((t, ti) => t.list.forEach((f) => TOWER_OF.set(f.id, ti)));

  /* ── the suggested words: the six lines, then the words his fragments
     use most across at least four studies. Counted, not picked. ── */
  const STOP = new Set(("the and for with that this from into over each every which what when where then than they them their there these those were have been has had its " +
    "one two three four five six more most much many some same other only just also like made make makes built build used uses using use about after before first still " +
    "even would could should while because through between across around under onto your you our out not but all any are was can who how why off per new old way ways " +
    "day days time year years work works worked thing things look looks page pages part parts set sets see shows show gets get got let lets back down side sides front " +
    "whole full real own well kind kinds sort another does done doing being keep kept take takes took goes went come came here right left enough instead once nothing " +
    "everything against runs running reads read sits showing next open live inside picked drawn size line lines field design jeremy prasatik").split(" "));
  const SUG = (() => {
    const lines = Object.values(D.lines);
    const lineWords = new Set(); lines.forEach((l) => D.tokens(l.name).forEach((w) => lineWords.add(w)));
    const titleWords = new Set(); D.studies.forEach((s) => D.tokens(s.t).forEach((w) => titleWords.add(w)));
    const df = new Map(), st = new Map();
    FR.forEach((f) => {
      if (f.kind === "fact" || f.kind === "tool") return;
      new Set(D.tokens(D.words(f))).forEach((w) => {
        if (w.length < 4 || STOP.has(w) || lineWords.has(w) || titleWords.has(w) || /^\d/.test(w) || /['$%]/.test(w)) return;
        df.set(w, (df.get(w) || 0) + 1); if (!st.has(w)) st.set(w, new Set()); st.get(w).add(f.k);
      });
    });
    /* which of the six lines a word mostly belongs to, so the list does not end up all rooms */
    const lean = (w) => { const c = {}; st.get(w).forEach((k) => { const s = D.study(k); (s ? s.tags : []).forEach((t) => { c[t] = (c[t] || 0) + 1; }); }); return Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0] || "none"; };
    const cands = [...df.keys()].filter((w) => st.get(w).size >= 4).sort((a, b) => df.get(b) - df.get(a));
    const per = {}, out = [];
    for (const w of cands) {
      const l = lean(w); if ((per[l] || 0) >= 2) continue;
      if (!D.search(w).some((r) => r.score >= 3)) continue;
      per[l] = (per[l] || 0) + 1; out.push(w); if (out.length >= 8) break;
    }
    return { lines, words: out };
  })();
  const LINE_BY_NAME = new Map(SUG.lines.map((l) => [l.name.toLowerCase(), l]));

  /* ── the grid ── */
  let G = null;
  const grid = () => {
    const vw = document.documentElement.clientWidth, vh = window.innerHeight, phone = vw < 760;
    const mg = phone ? 16 : vw < 1100 ? 24 : 32, C = phone ? 4 : vw < 1100 ? 8 : 12, gut = phone ? 10 : 14;
    const cw = (vw - 2 * mg - (C - 1) * gut) / C;
    const g = { vw, vh, phone, mg, C, gut, cw, head: phone ? 84 : 64 };
    g.X = (c) => Math.round(mg + c * (cw + gut)); g.W = (n) => Math.round(n * cw + (n - 1) * gut);
    const r = document.documentElement.style;
    r.setProperty("--mg", mg + "px"); r.setProperty("--gut", gut + "px"); r.setProperty("--head", g.head + "px");
    r.setProperty("--c2", g.W(2) + "px"); r.setProperty("--c3", g.W(3) + "px");
    return g;
  };

  /* ════════════════════════════════════════════════════════════════
     THE FIELD
     ════════════════════════════════════════════════════════════════ */
  const SPANS = {
    12: { body: 2, bodyL: 3, sub: 3, head: 2, num: 2, fact: 2, factL: 3, tool: 1, palette: 3, day: 2, dayL: 3, chart: 4, steps: 3, picL: [1, 2, 2, 2, 3], picP: [1, 1, 2], picS: [1, 1, 2] },
    8: { body: 2, bodyL: 3, sub: 3, head: 2, num: 2, fact: 2, factL: 3, tool: 1, palette: 3, day: 3, dayL: 3, chart: 4, steps: 3, picL: [1, 2, 2, 3], picP: [1, 1, 2], picS: [1, 2] },
    4: { body: 2, bodyL: 4, sub: 4, head: 2, num: 2, fact: 2, factL: 4, tool: 1, palette: 4, day: 4, dayL: 4, chart: 4, steps: 4, picL: [2, 2, 4], picP: [1, 2], picS: [1, 2] },
  };
  const spanOf = (f, S) => {
    switch (f.kind) {
      case "pic": {
        const a = f.w / f.h, opts = a > 1.25 ? S.picL : a < 0.85 ? S.picP : S.picS;
        let sp = opts[Math.floor(hash(f.id + "s") * opts.length)];
        while (sp > 1 && G.W(sp) > D.maxCss(f)) sp--;
        return sp;
      }
      case "line": return f.weight === "sub" ? S.sub : f.weight === "head" ? S.head : f.text.length > 190 ? S.bodyL : S.body;
      case "num": return S.num;
      case "fact": return String(f.value).length > 110 ? S.factL : S.fact;
      case "tool": return S.tool;
      case "palette": return S.palette;
      case "day": return D.words(f).length > 280 ? S.dayL : S.day;
      case "chart": return S.chart;
      case "steps": return S.steps;
    }
    return S.body;
  };

  const strip = (f, withHex) => '<div class="strip">' + f.colors.map((c) => '<span style="background:' + c.hex + ";color:" + D.ink(c.hex) + '">' + (withHex ? T(c.hex.replace("#", "")) : "") + "</span>").join("") + "</div>";
  const barsHTML = (f) => '<span class="lb">' + T(f.title) + '</span><div class="bars">' + f.bars.map((b) => "<div>" + T(b.label) + "<i>" + T(b.value) + '</i><s style="width:' + Math.max(2, Math.min(100, +b.width || 0)) + '%"></s></div>').join("") + "</div>" +
    (f.callout ? '<span class="callout">' + T(f.callout) + (f.suffix ? "<i>" + T(f.suffix) + "</i>" : "") + "</span>" : "");
  const stepsHTML = (f) => '<span class="lb">' + T(f.title) + "</span>" + (f.duration ? '<span class="dur">' + T(f.duration) + "</span>" : "") +
    '<ol class="steps">' + f.steps.map((s) => "<li><span>" + T(s.title) + "</span>" + (s.note ? "<i>" + T(s.note) + "</i>" : "") + "</li>").join("") + "</ol>";
  const dayText = (f, toks) => (f.title ? "<b>" + hl(f.title, toks) + "</b> " : "") + f.body.map((b) => hl(b, toks)).join(" ");

  const fieldNode = (f, w) => {
    const e = document.createElement("div");
    e.className = "it k-" + f.kind + (f.weight ? " w-" + f.weight : ""); e.dataset.id = f.id; e.style.width = w + "px";
    let h = "";
    switch (f.kind) {
      case "pic": {
        const fw = Math.floor(Math.min(w, D.maxCss(f))), fh = Math.round(fw * f.h / f.w);
        e.style.width = fw + "px"; e.style.height = fh + "px"; e._h = fh; if (f.alpha) e.classList.add("alpha");
        e.appendChild(imgIn(D.img(f, fw)));
        return e;
      }
      case "line": {
        const [a, b] = halves(f.text);
        h = cap(f.k) + (f.weight === "head" && f.label ? '<span class="lb">' + T(f.label) + "</span>" : "") +
          '<p class="tx">' + T(a) + (b ? ' <span class="g">' + T(b) + "</span>" : "") + "</p>";
        break;
      }
      case "num": h = '<span class="nv">' + T(f.value) + '</span><span class="lb">' + T(f.label) + "</span>" + (f.sub ? '<span class="ns">' + T(f.sub) + "</span>" : "") + cap(f.k); break;
      case "fact": h = cap(f.k) + '<p class="fv"><span class="lb">' + T(f.label) + "</span> " + T(f.value) + "</p>"; break;
      case "tool": h = '<span class="lb">' + T(f.label) + "</span>" + T(f.value); break;
      case "palette": h = strip(f, true) + cap(f.k); break;
      case "day": h = '<span class="dh">' + day(f.date) + "<i>" + T(f.project) + '</i></span><p class="tx">' + dayText(f) + "</p>"; break;
      case "chart": h = cap(f.k) + barsHTML(f); break;
      case "steps": h = cap(f.k) + stepsHTML(f); break;
    }
    e.innerHTML = h;
    return e;
  };

  /* a pause: one display line with the width around it left empty,
     every other one on its study's own fill */
  const pauseNode = (f, i) => {
    const s = D.study(f.k), fill = i % 2 === 1 && s && s.fill ? s.fill : null;
    const e = document.createElement("div");
    e.className = "it pause" + (fill ? " fill" : ""); e.dataset.id = f.id; e.style.width = G.vw + "px";
    const span = G.phone ? G.C : Math.round(G.C * 0.66), room = G.C - span;
    const off = G.phone ? 0 : [0, room, Math.round(room / 2), room, 0, Math.round(room / 3)][i % 6];
    const size = G.phone ? 34 : Math.round(Math.min(80, Math.max(44, G.cw * 0.64)));
    const pad = G.phone ? (fill ? 40 : 28) : (fill ? 64 : 44);
    e.style.padding = pad + "px 0";
    if (fill) { e.style.background = fill; e.style.color = D.ink(fill); }
    e.innerHTML = '<div style="margin-left:' + G.X(off) + "px;width:" + G.W(span) + 'px"><p class="pt" style="font-size:' + size + 'px">' + T(f.text) + "</p>" + cap(f.k) + "</div>";
    return { f, pause: true, fill: !!fill, el: e };
  };

  /* the opening: his statement, and the whole archive as a chart */
  let OPEN = null;
  const openingNode = () => {
    const st = DATA.statement || {};
    const e = document.createElement("div"); e.className = "it pause opening"; e.style.width = G.vw + "px";
    const size = G.phone ? 34 : Math.round(Math.min(64, Math.max(40, G.cw * 0.5)));
    const tw = G.phone ? G.W(4) : G.W(Math.round(G.C * 0.55)), cx = G.phone ? G.mg : G.X(Math.round(G.C * 0.62)), cw = G.phone ? G.W(4) : G.W(G.C - Math.round(G.C * 0.62));
    const ch = G.phone ? 104 : Math.round(Math.min(170, Math.max(120, G.vh * 0.2)));
    e.style.padding = (G.phone ? 26 : 52) + "px 0 " + (G.phone ? 22 : 40) + "px";
    e.innerHTML = '<div style="margin-left:' + G.mg + "px;width:" + tw + 'px"><p class="pt" style="font-size:' + size + 'px">' + T(st.ink) + "</p>" +
      (st.grey ? '<p class="og">' + T(st.grey) + "</p>" : "") + (G.phone ? '<div class="oroom" style="height:' + (ch + 30) + 'px"></div>' : "") + "</div>";
    const cv = document.createElement("canvas"); e.appendChild(cv);
    const labs = document.createElement("div"); labs.className = "olabs"; labs.style.cssText = "position:absolute;height:16px;font-size:9.5px;font-weight:600;color:var(--grey);font-variant-numeric:tabular-nums;pointer-events:none";
    e.appendChild(labs);
    const rd = document.createElement("div"); rd.className = "ord"; rd.style.cssText = "position:absolute;font-size:11px;font-weight:600;line-height:1.35;pointer-events:none;opacity:0;transition:opacity .15s ease;max-width:" + cw + "px";
    e.appendChild(rd);
    OPEN = { el: e, cv, labs, rd, cx, cw, ch };
    return { pause: true, opening: true, el: e };
  };
  const endsNode = () => {
    const e = document.createElement("div"); e.className = "it pause ends"; e.style.width = G.vw + "px";
    e.style.padding = (G.phone ? 48 : 96) + "px 0 " + (G.phone ? 56 : 120) + "px";
    const size = G.phone ? 34 : Math.round(Math.min(64, Math.max(40, G.cw * 0.5)));
    const links = (DATA.links || []).filter((l) => !/^mailto:/.test(l.v));
    e.innerHTML = '<div style="margin-left:' + G.mg + 'px">' + (DATA.email ? '<p class="pt" style="font-size:' + size + 'px"><a href="mailto:' + D.esc(DATA.email) + '">' + T(DATA.email) + "</a></p>" : "") +
      '<div style="margin-top:22px">' + links.map((l) => '<a href="' + D.esc(l.v) + '"' + (/^https?:/.test(l.v) ? ' target="_blank" rel="noopener"' : "") + ">" + T(l.k) + "</a>").join("") + "</div></div>";
    return { pause: true, ends: true, el: e };
  };

  /* the packer: a skyline with a lookahead. Find the lowest notch, take
     the next fragment (within the next sixteen) narrow enough to fit it;
     if none fits, close the notch up to its lower neighbour and leave
     that as air. A pause flattens the whole row. */
  const pack = (items) => {
    const C = G.C, gy = G.phone ? 16 : 20, K = 16, hs = new Array(C).fill(0), q = items.slice();
    while (q.length) {
      if (q[0].pause && !q[0].opening) {
        /* before a pause, fill the low columns with pieces from further on
           that fit under the tallest one, so the page ends square */
        for (let guard = 0; guard < 24; guard++) {
          const top = Math.max(...hs); let minH = Infinity, x0 = 0;
          for (let c = 0; c < C; c++) if (hs[c] < minH - 0.5) { minH = hs[c]; x0 = c; }
          if (top - minH < 70) break;
          let run = 0; while (x0 + run < C && hs[x0 + run] <= minH + 8) run++;
          let j = -1;
          for (let k = 1; k < Math.min(q.length, 60); k++) { const c = q[k]; if (!c.pause && c.span <= run && c.h <= top - minH - gy) { j = k; break; } }
          if (j < 0) { const L = x0 > 0 ? hs[x0 - 1] : Infinity, R = x0 + run < C ? hs[x0 + run] : Infinity; const to = Math.min(L, R, top); for (let c = x0; c < x0 + run; c++) hs[c] = to; continue; }
          const it = q.splice(j, 1)[0], sp = Math.min(it.span, C - x0);
          it.x = G.X(x0); it.y = minH; for (let c = x0; c < x0 + sp; c++) hs[c] = minH + it.h + gy;
        }
      }
      if (q[0].pause) {
        const it = q.shift(), top = Math.max(...hs) + (it.opening || it.ends ? 0 : it.fill ? 30 : 10);
        it.x = 0; it.y = top; hs.fill(top + it.h + (it.opening ? 8 : it.fill ? 34 : 18)); continue;
      }
      let minH = Infinity, x0 = 0;
      for (let c = 0; c < C; c++) if (hs[c] < minH - 0.5) { minH = hs[c]; x0 = c; }
      let run = 0; while (x0 + run < C && hs[x0 + run] <= minH + 8) run++;
      let pick = -1;
      for (let j = 0; j < Math.min(K, q.length); j++) { if (q[j].pause) break; if (q[j].span <= run) { pick = j; break; } }
      if (pick < 0) {
        const L = x0 > 0 ? hs[x0 - 1] : Infinity, R = x0 + run < C ? hs[x0 + run] : Infinity, to = Math.min(L, R);
        if (isFinite(to)) { for (let c = x0; c < x0 + run; c++) hs[c] = to; continue; }
        pick = 0;
      }
      const it = q.splice(pick, 1)[0], sp = Math.min(it.span, C - x0);
      let y = 0; for (let c = x0; c < x0 + sp; c++) y = Math.max(y, hs[c]);
      it.x = G.X(x0); it.y = y;
      for (let c = x0; c < x0 + sp; c++) hs[c] = y + it.h + gy;
    }
    return Math.max(...hs);
  };

  let FIELD = null;
  const buildField = () => {
    const S = SPANS[G.C];
    H.field.innerHTML = "";
    const frag = document.createDocumentFragment(), items = [];
    const add = (it) => { items.push(it); frag.appendChild(it.el); };
    add(openingNode());
    let pi = 0;
    ORDER.forEach((f) => {
      /* thirty copies of his own name as author say nothing the page does not */
      if (f.kind === "fact" && /^author$/i.test(f.label)) return;
      /* nor do 29 "Published" lines that repeat the year in their own caption (review, 26 Sept) */
      if (f.kind === "fact" && /^published$/i.test(f.label) && String(f.value).trim() === String(D.year(f.k))) return;
      if (f.kind === "line" && f.weight === "display") add(pauseNode(f, pi++));
      else { const span = spanOf(f, S); add({ f, span, el: fieldNode(f, G.W(span)) }); }
    });
    add(endsNode());
    H.field.appendChild(frag);
    items.forEach((it) => { it.h = it.el._h != null ? it.el._h : it.el.offsetHeight; it.w = it.el.offsetWidth; });
    const height = pack(items);
    items.forEach((it) => { it.el.style.left = it.x + "px"; it.el.style.top = it.y + "px"; });
    H.field.style.height = Math.ceil(height) + "px";
    FIELD = { items, byId: new Map(items.filter((i) => i.f).map((i) => [i.f.id, i])) };
    drawOpening();
  };

  /* ════════════════════════════════════════════════════════════════
     THE TEXTURE
     ════════════════════════════════════════════════════════════════ */
  const towerGeom = (W, Hh, tight) => {
    const N = TOWERS.length, g = tight ? 2 : Math.max(3, Math.round(W * 0.0042));
    const tw = (W - (N - 1) * g) / N, max = Math.max(...TOWERS.map((t) => t.list.length));
    let c = 16;
    for (; c > 2; c--) { const cpr = Math.floor((tw + 1) / c); if (cpr >= 1 && Math.ceil(max / cpr) * c <= Hh) break; }
    const cpr = Math.max(1, Math.floor((tw + 1) / c));
    const cells = new Float32Array(FR.length * 3), tx = [];
    TOWERS.forEach((t, ti) => {
      const x0 = ti * (tw + g), used = cpr * c - 1, off = Math.round(x0 + (tw - used) / 2);
      tx.push({ x: x0, w: tw, off });
      t.list.forEach((f, i) => { const j = IDX.get(f.id) * 3; cells[j] = off + (i % cpr) * c; cells[j + 1] = Hh - (Math.floor(i / cpr) + 1) * c + 1; cells[j + 2] = Math.max(1, c - 1); });
    });
    return { cells, tx, c, cpr, g, tw, W, H: Hh };
  };
  const hitCell = (geo, x, y) => {
    if (!geo) return null;
    const ti = Math.floor(x / (geo.tw + geo.g)); if (ti < 0 || ti >= TOWERS.length) return null;
    const t = TOWERS[ti], o = geo.tx[ti];
    const col = Math.floor((x - o.off) / geo.c), row = Math.floor((geo.H - y) / geo.c);
    let f = null;
    if (col >= 0 && col < geo.cpr && row >= 0) { const i = row * geo.cpr + col; if (i < t.list.length) f = t.list[i]; }
    return { t, ti, f };
  };
  const labelTowers = (geo, box, left) => {
    let last = null, lastX = -99, h = "";
    TOWERS.forEach((t, ti) => {
      const lab = t.y ? String(t.y) : D.title(t.k), x = geo.tx[ti].x;
      if (lab === last) return;
      const wEst = String(lab).length * 5.6;
      if (x - lastX < wEst + 6) return;
      h += '<span style="left:' + Math.round(left + x) + 'px">' + T(lab) + "</span>"; last = lab; lastX = x;
    });
    box.innerHTML = h;
  };
  const baseShade = (f) => {
    switch (f.kind) {
      case "pic": return 0.34; case "palette": return 0.42; case "num": return 0.5; case "chart": case "steps": return 0.42; case "day": return 0.2;
      case "line": return f.weight === "display" ? 0.44 : f.weight === "body" ? 0.14 : 0.24;
      case "fact": return 0.1; case "tool": return 0.08;
    }
    return 0.1;
  };
  const BASE = new Float32Array(FR.length); FR.forEach((f, i) => { BASE[i] = baseShade(f); });

  const drawCells = (ctx, geo, alpha, dpr, ring) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, geo.W, geo.H + 2);
    let cur = "";
    for (let i = 0; i < FR.length; i++) {
      const a = alpha[i]; if (a < 0.012) continue;
      const s = "rgba(0,0,0," + (Math.round(a * 50) / 50) + ")"; if (s !== cur) { ctx.fillStyle = s; cur = s; }
      const j = i * 3; ctx.fillRect(geo.cells[j], geo.cells[j + 1], geo.cells[j + 2], geo.cells[j + 2]);
    }
    if (ring >= 0 && alpha[ring] > 0.01) {
      const j = ring * 3, s = geo.cells[j + 2];
      ctx.strokeStyle = "#000"; ctx.lineWidth = 1; ctx.strokeRect(geo.cells[j] - 1.5, geo.cells[j + 1] - 1.5, s + 3, s + 3);
    }
  };
  const sizeCanvas = (cv, W, Hh) => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(W * dpr); cv.height = Math.round((Hh + 2) * dpr); cv.style.width = W + "px"; cv.style.height = (Hh + 2) + "px";
    return dpr;
  };

  /* the opening chart: the texture at rest, before any search */
  const drawOpening = () => {
    if (!OPEN) return;
    const { cv, labs, rd, cx, cw, ch } = OPEN;
    const geo = towerGeom(cw, ch, G.phone), dpr = sizeCanvas(cv, cw, ch);
    const room = OPEN.el.querySelector(".oroom"), top = room ? room.offsetTop + 22 : 58;
    cv.style.left = cx + "px"; cv.style.top = top + "px";
    labs.style.left = "0px"; labs.style.width = G.vw + "px"; labs.style.top = (top + ch + 8) + "px";
    labelTowers(geo, labs, cx);
    rd.style.left = cx + "px"; rd.style.top = (top + ch + 28) + "px";
    OPEN.geo = geo; OPEN.top = top;
    drawCells(cv.getContext("2d"), geo, BASE, dpr, -1);
  };

  /* the texture in the mind: the same towers, large, with state */
  const TX = { a: new Float32Array(FR.length), t: new Float32Array(FR.length), t0: new Float64Array(FR.length), geo: null, ctx: H.tex.getContext("2d"), dpr: 1, raf: 0, ring: -1 };
  const texLoop = () => {
    TX.raf = 0; if (!TX.geo) return;
    const now = performance.now(); let busy = false;
    for (let i = 0; i < FR.length; i++) {
      if (now < TX.t0[i]) { busy = true; continue; }
      const d = TX.t[i] - TX.a[i];
      if (Math.abs(d) > 0.006) { TX.a[i] += d * 0.22; busy = true; } else TX.a[i] = TX.t[i];
    }
    drawCells(TX.ctx, TX.geo, TX.a, TX.dpr, TX.ring);
    if (busy) TX.raf = requestAnimationFrame(texLoop);
  };
  const texKick = () => { if (!TX.raf) TX.raf = requestAnimationFrame(texLoop); };
  /* targets: ink for a strong match, grey for a loose one, the rest recede */
  const texTarget = (mode, info) => {
    TX.ring = -1;
    for (let i = 0; i < FR.length; i++) TX.t[i] = BASE[i];
    if (mode === "search" && info) {
      info.res.forEach((r, n) => { const i = IDX.get(r.f.id); TX.t[i] = r.score >= info.strong || n < 24 ? 1 : Math.max(0.46, BASE[i]); });
    } else if (mode === "focus" && info) {
      (byK.get(info.k) || []).forEach((f) => { TX.t[IDX.get(f.id)] = Math.max(0.62, BASE[IDX.get(f.id)] + 0.4); });
      const i = IDX.get(info.id); TX.t[i] = 1; TX.ring = i;
    }
  };

  let MG = null;  // the mind's geometry
  const mindGeom = () => {
    const mh = G.vh - G.head;
    const texH = G.phone ? 92 : Math.round(Math.min(180, Math.max(110, G.vh * 0.2)));
    const labH = 16, foot = G.phone ? 10 : 20, bandTop = mh - foot - labH - texH;
    const stageH = bandTop - (G.phone ? 14 : 34);
    MG = { mh, texH, bandTop, stageH, labH, W: G.vw - 2 * G.mg };
    H.stage.style.height = stageH + "px";
    H.band.style.top = bandTop + "px"; H.band.style.left = G.mg + "px"; H.band.style.right = "auto"; H.band.style.width = MG.W + "px"; H.band.style.height = (texH + labH + 2) + "px";
    TX.geo = towerGeom(MG.W, texH, G.phone); TX.dpr = sizeCanvas(H.tex, MG.W, texH);
    H.labs.style.top = (texH + 6) + "px";
    labelTowers(TX.geo, H.labs, 0);
    H.read.style.bottom = (texH + labH + 10) + "px";
    texKick();
  };
  /* where a mark is on the screen, for a fragment flying into it */
  const cellRect = (id) => {
    const j = IDX.get(id) * 3, g = TX.geo;
    return { x: G.mg + g.cells[j], y: G.head + MG.bandTop + g.cells[j + 1], w: g.cells[j + 2], h: g.cells[j + 2] };
  };

  /* ════════════════════════════════════════════════════════════════
     THE SPREAD AND THE CATALOGUE
     ════════════════════════════════════════════════════════════════ */
  const KPREF = (f) => (f.kind === "line" ? { display: 0, sub: 3, head: 6, body: 7 }[f.weight] ?? 7 : { pic: 1, num: 2, chart: 2, palette: 4, steps: 4, day: 5, fact: 8, tool: 9 }[f.kind] ?? 9);

  /* fit a block's type to a box, largest first */
  const fit = (box, el, maxH, hi, lo, maxW) => {
    let s = hi;
    for (let n = 0; n < 40; n++) {
      el.style.fontSize = s + "px";
      if ((box.offsetHeight <= maxH && (!maxW || el.scrollWidth <= maxW)) || s <= lo) break;
      s = Math.max(lo, Math.floor(s * 0.93));
    }
    return s;
  };

  const kicker = (f) => (f.kind === "line" && f.weight === "head" && f.label ? '<span class="lb">' + T(f.label) + "</span>" :
    f.kind === "line" && f.head && f.weight !== "head" && f.head !== D.title(f.k) ? '<span class="lb">' + T(f.head) + "</span>" : "");

  /* the one in focus, large */
  const heroNode = (layer, f, w, h, toks) => {
    const e = D.el("div", "sp hero k-" + f.kind); e.dataset.id = f.id; layer.appendChild(e);
    const capBlock = cap(f.k, "span");
    switch (f.kind) {
      case "pic": {
        const a = f.w / f.h, room = G.phone ? Infinity : h - 64;
        let fw = Math.floor(Math.min(w, D.maxCss(f), room * a)); fw = Math.max(fw, 40);
        const fh = Math.round(fw / a);
        e.innerHTML = '<div class="fig' + (f.alpha ? " alpha" : "") + '" style="width:' + fw + "px;height:" + fh + 'px"></div><div style="margin-top:12px">' + capBlock + (f.alt ? '<span class="alt">' + hl(f.alt, toks) + "</span>" : "") + "</div>";
        e.firstChild.appendChild(imgIn(D.img(f, fw, { eager: true })));
        e.style.width = Math.max(fw, Math.min(w, 320)) + "px";
        break;
      }
      case "line": {
        const serif = f.weight === "display", [a, b] = halves(f.text);
        e.style.width = w + "px";
        e.innerHTML = capBlock + kicker(f) + '<p class="tx' + (serif ? " serif" : "") + '">' + hl(a, toks) + (b ? ' <span class="g">' + hl(b, toks) + "</span>" : "") + "</p>";
        const tx = e.querySelector(".tx"); tx.style.marginTop = "14px";
        fit(e, tx, h, serif ? (G.phone ? 48 : 104) : (G.phone ? 26 : a.length < 60 ? 56 : 44), serif ? 30 : 17);
        break;
      }
      case "num": {
        e.classList.add("black"); const bw = Math.min(w, G.phone ? w : G.W(Math.max(3, Math.round(G.C / 3))));
        e.style.width = bw + "px"; e.style.padding = (G.phone ? 20 : 30) + "px";
        e.innerHTML = '<span class="nv">' + T(f.value) + '</span><span class="lb" style="color:#fff;margin-top:22px">' + T(f.label) + "</span>" + (f.sub ? '<span class="ns">' + hl(f.sub, toks) + "</span>" : "") + '<div style="margin-top:22px">' + capBlock + "</div>";
        fit(e, e.querySelector(".nv"), h, G.phone ? 120 : 220, 40, bw - (G.phone ? 40 : 60));
        break;
      }
      case "palette": {
        e.style.width = w + "px";
        const sh = Math.min(G.phone ? 220 : 320, h - 60);
        e.innerHTML = '<div class="strip" style="height:' + sh + 'px">' + f.colors.map((c) => '<span style="background:' + c.hex + ";color:" + D.ink(c.hex) + ';font-size:11px;padding:0 0 12px 12px;flex-direction:column;justify-content:flex-end;align-items:flex-start">' +
          (c.name ? "<b style=\"font-family:var(--sans);font-size:12px\">" + T(c.name) + "</b>" : "") + T(c.hex) + "</span>").join("") + '</div><div style="margin-top:12px">' + capBlock + "</div>";
        break;
      }
      case "day": {
        e.style.width = Math.min(w, G.phone ? w : G.W(5)) + "px";
        e.innerHTML = '<span class="cp" style="color:var(--ink)">' + day(f.date) + '<i style="color:var(--grey)">' + T(f.project) + "</i></span>" + '<p class="tx" style="margin-top:14px;line-height:1.3">' + dayText(f, toks) + "</p>" +
          (f.link && f.link.href ? '<a class="cp" style="margin-top:14px;color:var(--ink)" href="' + D.esc(f.link.href) + '">' + T(f.link.label || f.link.href) + "</a>" : "");
        fit(e, e.querySelector(".tx"), h, G.phone ? 22 : 30, 13);
        break;
      }
      case "fact": {
        e.style.width = Math.min(w, G.phone ? w : G.W(5)) + "px";
        e.innerHTML = capBlock + '<span class="lb" style="margin-top:14px">' + T(f.label) + '</span><p class="tx">' + hl(f.value, toks) + "</p>";
        fit(e, e.querySelector(".tx"), h, G.phone ? 26 : 44, 15);
        break;
      }
      case "tool": {
        e.style.width = w + "px";
        e.innerHTML = '<span class="lb">' + T(f.label) + '</span><p class="tx serif" style="margin:10px 0 18px">' + hl(f.value, toks) + "</p>" + capBlock;
        fit(e, e.querySelector(".tx"), h, G.phone ? 56 : 112, 28, w);
        break;
      }
      case "chart": {
        e.style.width = Math.min(w, G.phone ? w : G.W(5)) + "px";
        e.innerHTML = capBlock + '<div style="margin-top:14px">' + barsHTML(f) + "</div>";
        e.querySelectorAll(".bars div").forEach((d) => { d.style.fontSize = "15px"; d.style.marginBottom = "18px"; });
        e.querySelectorAll(".bars s").forEach((s) => { s.style.height = "22px"; s.style.marginTop = "8px"; });
        const c = e.querySelector(".callout"); if (c) c.style.fontSize = G.phone ? "56px" : "96px";
        break;
      }
      case "steps": {
        e.style.width = Math.min(w, G.phone ? w : G.W(5)) + "px";
        e.innerHTML = capBlock + '<div style="margin-top:14px">' + stepsHTML(f) + "</div>";
        e.querySelector(".steps").style.fontSize = "17px"; e.querySelector(".dur").style.fontSize = "17px";
        e.querySelectorAll(".steps li").forEach((li) => { li.style.padding = "9px 0"; });
        break;
      }
    }
    return e;
  };

  /* the next few, smaller */
  const midNode = (layer, f, w, maxH, toks) => {
    const e = D.el("div", "sp mid k-" + f.kind); e.dataset.id = f.id; layer.appendChild(e);
    e.style.width = w + "px";
    switch (f.kind) {
      case "pic": {
        const a = f.w / f.h; let fw = Math.floor(Math.min(w, D.maxCss(f))); if (fw / a > maxH) fw = Math.floor(maxH * a);
        e.style.width = Math.max(fw, 120) + "px";
        e.innerHTML = '<div class="fig' + (f.alpha ? " alpha" : "") + '" style="width:' + fw + "px;height:" + Math.round(fw / a) + 'px"></div>' + cap(f.k);
        e.firstChild.appendChild(imgIn(D.img(f, fw)));
        break;
      }
      case "line": {
        const [a, b] = halves(f.text);
        e.innerHTML = cap(f.k) + kicker(f) + '<p class="tx' + (f.weight === "display" ? " serif" : "") + '">' + hl(a, toks) + (b ? ' <span class="g">' + hl(b, toks) + "</span>" : "") + "</p>";
        break;
      }
      case "num": e.classList.add("black"); e.style.padding = "16px"; e.innerHTML = '<span class="nv" style="font-size:52px">' + T(f.value) + '</span><span class="lb" style="color:#fff;margin-top:12px">' + T(f.label) + "</span>" + (f.sub ? '<span class="ns" style="font-size:11.5px">' + hl(f.sub, toks) + "</span>" : "") + '<div style="margin-top:12px">' + cap(f.k) + "</div>"; break;
      case "palette": e.innerHTML = strip(f, true) + '<div style="margin-top:7px">' + cap(f.k) + "</div>"; break;
      case "day": e.innerHTML = '<span class="cp" style="color:var(--ink)">' + day(f.date) + '<i style="color:var(--grey)">' + T(f.project) + '</i></span><p class="tx" style="font-size:13px;font-weight:500;line-height:1.42">' + dayText(f, toks) + "</p>"; break;
      case "fact": e.innerHTML = cap(f.k) + '<span class="lb">' + T(f.label) + '</span><p class="tx" style="font-size:14px;font-weight:500">' + hl(f.value, toks) + "</p>"; break;
      case "tool": e.innerHTML = '<span class="lb">' + T(f.label) + '</span><p class="tx serif" style="font-size:30px;margin:4px 0 8px">' + hl(f.value, toks) + "</p>" + cap(f.k); break;
      case "chart": e.innerHTML = cap(f.k) + barsHTML(f); break;
      case "steps": e.innerHTML = cap(f.k) + stepsHTML(f); break;
    }
    return e;
  };

  /* the rest, as a column of rows */
  const rowHTML = (f, toks) => {
    let th = "", tx = "";
    switch (f.kind) {
      case "pic": { const a = f.w / f.h, tw = Math.round(Math.min(68, 38 * a)); th = '<span class="th' + (f.alpha ? " alpha" : "") + '" style="width:' + tw + 'px" data-pic="' + f.id + '"></span>'; tx = hl(f.alt || "", toks); break; }
      case "palette": th = '<span class="th" style="width:38px;display:flex;flex-direction:column">' + f.colors.map((c) => '<i style="flex:1;background:' + c.hex + '"></i>').join("") + "</span>"; tx = f.colors.map((c) => T(c.hex)).join(" "); break;
      case "line": tx = hl(halves(f.text).join(" "), toks); break;
      case "num": tx = "<b>" + T(f.value) + "</b> " + hl(f.label + " " + (f.sub || ""), toks); break;
      case "fact": case "tool": tx = '<b style="font-weight:600;color:var(--grey)">' + T(f.label) + "</b> " + hl(f.value, toks); break;
      case "day": tx = day(f.date) + ". " + dayText(f, toks); break;
      default: tx = hl(D.words(f), toks);
    }
    return '<div class="row" data-id="' + f.id + '">' + th + '<div style="min-width:0">' + cap(f.k) + '<div class="rt">' + tx + "</div></div></div>";
  };
  const fillThumbs = (root) => root.querySelectorAll("[data-pic]").forEach((s) => { const f = BY.get(s.dataset.pic); s.appendChild(imgIn(D.img(f, parseFloat(s.style.width) || 40))); s.removeAttribute("data-pic"); });

  /* pick the spread: the hero is the best-scoring fragment, a picture or
     a big line ahead of a spec line; the next few are chosen so they do
     not all come from one study or one kind */
  /* how well a kind carries the big slot: a display line or a figure
     over a picture, a picture over a sentence, spec lines last */
  const BIG = (f) => (f.kind === "line" ? { display: 1.6, sub: 0.7, head: -0.4, body: 0 }[f.weight] ?? 0 : { pic: 0.9, num: 1.2, chart: 1.1, palette: 0.2, steps: 0.4, day: -0.2, fact: -2.4, tool: -2.2 }[f.kind] ?? -1);
  const choose = (S) => {
    const res = S.res;
    if (!res.length) return { hero: null, mids: [], rest: [] };
    const top = res[0].score;
    let hero = null, hv = -Infinity;
    /* a line's name opens on its lead study; a word opens on its best match */
    const pool = S.line ? res.filter((r) => r.f.k === S.line.lead) : res.filter((r) => r.score >= top - 2.2).slice(0, 120);
    (pool.length ? pool : res).forEach((r, i) => { const v = r.score + BIG(r.f) - i * 0.002; if (v > hv) { hv = v; hero = r; } });
    const left = res.filter((r) => r !== hero).slice(0, 80), mids = [], usedK = {}, usedKind = {};
    usedK[hero.f.k] = 1; usedKind[hero.f.kind] = 1;
    const want = G.phone ? 4 : 5;
    for (let n = 0; n < want && left.length; n++) {
      let best = -1, bv = -Infinity;
      left.forEach((r, i) => {
        if (r.f.kind === "tool" || r.f.kind === "fact") return;
        const hasPic = mids.some((m) => m.f.kind === "pic") || hero.f.kind === "pic";
        const v = r.score - 1.3 * (usedK[r.f.k] || 0) - 0.7 * (usedKind[r.f.kind] || 0) - 0.015 * i + (r.f.kind === "pic" && !hasPic ? 0.9 : 0) + (r.f.kind === "line" && r.f.weight === "display" ? 0.4 : 0);
        if (v > bv) { bv = v; best = i; }
      });
      if (best < 0) break;
      const r = left.splice(best, 1)[0]; mids.push(r); usedK[r.f.k] = (usedK[r.f.k] || 0) + 1; usedKind[r.f.kind] = (usedKind[r.f.kind] || 0) + 1;
    }
    const chosen = new Set([hero, ...mids]);
    /* the list keeps the ranking, with spec lines let down a step */
    const rest = res.filter((r) => !chosen.has(r)).map((r, i) => ({ r, v: r.score - (r.f.kind === "fact" || r.f.kind === "tool" ? 1.6 : 0) - i * 0.0001 }))
      .sort((a, b) => b.v - a.v).slice(0, 160).map((o) => o.r);
    return { hero, mids, rest };
  };

  const runSearch = (q) => {
    const toks = D.tokens(q), line = LINE_BY_NAME.get(q.trim().toLowerCase());
    let res = D.search(q);
    /* a line's name leads with that line's own lead study */
    if (line) res = res.map((r) => ({ f: r.f, score: r.score + (r.f.k === line.lead ? 1 : 0) })).sort((a, b) => b.score - a.score);
    const strong = res.some((r) => r.score >= 3) ? 3 : Infinity;
    return { q, toks: line ? [] : toks, res, strong, line };
  };

  /* lay a layer out: desktop is a spread across the grid, the phone a stack */
  const PAD = () => (G.phone ? 18 : 26);
  const composeSearch = (layer, S) => {
    const { hero, mids, rest } = choose(S), toks = S.toks, pad = PAD();
    if (!hero) return;
    if (G.phone) {
      let y = pad;
      const he = heroNode(layer, hero.f, G.W(4), 9999, toks); place(he, G.X(0), y); y += he.offsetHeight + 30;
      const cols = [y, y];
      mids.forEach((r) => { const c = cols[0] <= cols[1] ? 0 : 1; const m = midNode(layer, r.f, G.W(2), 260, toks); place(m, G.X(c * 2), cols[c]); cols[c] += m.offsetHeight + 24; });
      y = Math.max(...cols) + 8;
      const mo = moreNode(layer, rest, toks, G.W(4), S.line); place(mo, G.X(0), y); y += mo.offsetHeight + 24;
      layer.style.height = y + "px";
      return;
    }
    const hw = G.C >= 12 ? 6 : 4, mw = G.C >= 12 ? 3 : 2, rx = G.C - 2;
    const avail = MG.stageH - pad;
    const he = heroNode(layer, hero.f, G.W(hw), avail - 6, toks); place(he, G.X(0), pad);
    /* the next few sit one empty column past the hero, however wide it came out */
    let mx = hw + 1; const heW = he.offsetWidth;
    mx = rx - mw;
    for (let c = 1; c <= rx - mw; c++) if (G.X(c) >= G.X(0) + heW + G.gut) { mx = Math.min(rx - mw, c + (G.C >= 12 ? 1 : 0)); break; }
    /* the next few stack in one column until the column is full */
    let y = pad;
    mids.forEach((r) => {
      if (y > pad + avail - 90) return;
      const m = midNode(layer, r.f, G.W(mw), Math.min(260, avail * 0.52), toks);
      if (y + m.offsetHeight > pad + avail && y > pad) { m.remove(); return; }
      place(m, G.X(mx), y); y += m.offsetHeight + 26;
    });
    const mo = moreNode(layer, rest, toks, G.W(G.C - rx), S.line);
    mo.style.height = avail + "px"; place(mo, G.X(rx), pad);
  };
  const moreNode = (layer, rest, toks, w, line) => {
    const e = D.el("div", "sp more"); e.style.width = w + "px"; layer.appendChild(e);
    /* a line's own sentence heads its list, on a rule in the line's colour */
    e.innerHTML = (line ? '<div class="ln" style="box-shadow:inset 0 3px 0 ' + line.color + '"><b>' + T(line.name) + "</b> " + T(line.sentence) + "</div>" : "") + rest.map((r) => rowHTML(r.f, toks)).join("");
    fillThumbs(e);
    return e;
  };
  const place = (el, x, y) => { el.style.left = Math.round(x) + "px"; el.style.top = Math.round(y) + "px"; };

  /* the catalogue entry: the study the focus came from, gathered */
  const catalogue = (k, fid) => {
    const s = D.study(k), list = byK.get(k) || [], href = D.href(k);
    const e = D.el("div", "sp cat");
    const here = (f) => (f.id === fid ? " here" : "");
    let h = '<h2><a href="' + href + '">' + T(D.title(k)) + "</a></h2>";
    h += '<span class="yr">' + (s ? '<a href="' + href + '">' + T(s.s) + "</a>" : "") + (D.year(k) || "") + "</span>";
    const lede = list.find((f) => f.kind === "line" && f.weight === "sub");
    if (lede && k !== "daybook") { const [a, b] = halves(lede.text); h += '<p class="lede' + here(lede) + '" data-id="' + lede.id + '" style="cursor:pointer">' + T(a) + (b ? ' <span class="g">' + T(b) + "</span>" : "") + "</p>"; }
    /* every picture it has, small, in the order the study shows them */
    const pics = list.filter((f) => f.kind === "pic");
    if (pics.length) h += '<div class="thumbs">' + pics.map((f) => '<button type="button" data-id="' + f.id + '" class="' + (f.alpha ? "alpha" : "") + here(f) + '" style="width:' + Math.round(52 * f.w / f.h) + 'px" aria-label="' + D.esc(clean(f.alt || "")) + '"></button>').join("") + "</div>";
    list.filter((f) => f.kind === "palette").forEach((f) => { h += '<div data-id="' + f.id + '" class="pal">' + strip(f, true) + "</div>"; });
    const nums = list.filter((f) => f.kind === "num");
    if (nums.length) h += '<div class="nums">' + nums.map((f) => '<button type="button" data-id="' + f.id + '" class="' + here(f) + '"><b>' + T(f.value) + '</b><span class="lb">' + T(f.label) + "</span></button>").join("") + "</div>";
    /* the spec as a table, and the section heads as a numbered list */
    const facts = list.filter((f) => f.kind === "fact" && !/^author$/i.test(f.label));
    let heads = list.filter((f) => f.kind === "line" && f.weight === "head" && f.label);
    if (!heads.length) { const seen = new Set(); heads = list.filter((f) => f.kind === "line" && f.head && !seen.has(f.head) && seen.add(f.head)).map((f) => ({ id: f.id, text: f.head })); }
    const focusHead = (BY.get(fid) || {}).head;
    if (heads.length) h += '<ol class="tl">' + heads.map((f, i) => '<li data-id="' + f.id + '"' + (f.id === fid || (focusHead && f.text === focusHead) ? ' class="here"' : "") + "><b>" + String(i + 1).padStart(2, "0") + "</b><span>" + T(f.text) + "</span></li>").join("") + "</ol>";
    if (facts.length) h += '<dl class="spec">' + facts.map((f) => '<div data-id="' + f.id + '" class="' + here(f) + '"><dt>' + T(f.label) + "</dt><dd>" + T(f.value) + "</dd></div>").join("") + "</dl>";
    if (k === "daybook") {
      const i = list.findIndex((f) => f.id === fid), from = Math.max(0, i - 7), near = list.slice(from, from + 16);
      h += '<div class="days">' + near.map((f) => { const w = clean((f.title ? f.title + " " : "") + f.body[0]); return '<div data-id="' + f.id + '" class="' + here(f) + '"><b>' + day(f.date) + "</b><span>" + T(f.project) + ". " + D.esc(w.length > 150 ? w.slice(0, 149) + "\u2026" : w) + "</span></div>"; }).join("") + "</div>";
    }
    const tools = list.filter((f) => f.kind === "tool");
    if (tools.length) {
      const g = new Map(); tools.forEach((f) => { if (!g.has(f.label)) g.set(f.label, []); g.get(f.label).push(f); });
      h += '<dl class="spec tools">' + [...g].map(([lab, fs]) => "<div><dt>" + T(lab) + "</dt><dd>" + fs.map((f) => '<span data-id="' + f.id + '" class="' + here(f) + '">' + T(f.value) + "</span>").join(", ") + "</dd></div>").join("") + "</dl>";
    }
    list.filter((f) => f.kind === "chart" || f.kind === "steps").forEach((f) => { h += '<div class="sec' + here(f) + '" data-id="' + f.id + '">' + (f.kind === "chart" ? barsHTML(f) : stepsHTML(f)) + "</div>"; });
    e.innerHTML = h;
    e.querySelectorAll(".thumbs button").forEach((b) => { const f = BY.get(b.dataset.id); b.appendChild(imgIn(D.img(f, parseFloat(b.style.width)))); });
    return e;
  };
  const composeFocus = (layer, F) => {
    const f = BY.get(F.id), pad = PAD();
    if (G.phone) {
      let y = pad;
      const he = heroNode(layer, f, G.W(4), 9999, []); place(he, G.X(0), y); y += he.offsetHeight + 36;
      const c = catalogue(f.k, f.id); layer.appendChild(c); c.style.width = G.W(4) + "px"; place(c, G.X(0), y); y += c.offsetHeight + 24;
      layer.style.height = y + "px";
      return;
    }
    const hw = G.C >= 12 ? 6 : 4, avail = MG.stageH - pad;
    const he = heroNode(layer, f, G.W(hw), avail - 6, []); place(he, G.X(0), pad);
    const cx = G.C >= 12 ? 7 : 4, c = catalogue(f.k, f.id); layer.appendChild(c);
    c.style.width = G.W(G.C - cx) + "px"; c.style.height = avail + "px"; place(c, G.X(cx), pad);
  };

  /* ════════════════════════════════════════════════════════════════
     THE MOVES
     ════════════════════════════════════════════════════════════════ */
  const ST = { mode: "field", S: null, F: null, back: null, busy: 0 };
  let layer = null;

  const visibleField = () => {
    const sy = window.scrollY, out = [];
    FIELD.items.forEach((it) => {
      const top = G.head + it.y - sy;
      if (top < G.vh && top + it.h > G.head) out.push({ it, r: { x: it.x, y: top, w: it.w || G.vw, h: it.h } });
    });
    return out;
  };
  const rectOf = (el) => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; };
  const flipFrom = (el, r0, r1, delay) => {
    if (!r1.w || !r0.w) return;
    const s = r0.w / r1.w, dx = r0.x - r1.x, dy = r0.y - r1.y;
    el.animate([{ transform: "translate(" + dx + "px," + dy + "px) scale(" + s + ")" }, { transform: "none" }], { duration: FLY, delay: delay || 0, easing: EASE, fill: "backwards" });
  };
  const fadeIn = (el, delay) => { if (RM) return; el.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 520, delay, easing: EASE, fill: "backwards" }); };
  const cellT = (r, c) => "translate(" + (c.x - r.x) + "px," + (c.y - r.y) + "px) scale(" + (Math.max(1, c.w) / Math.max(1, r.w)) + ")";

  /* build the next layer; the old one fades while the new one arrives */
  const newLayer = () => {
    const old = layer; layer = D.el("div", "layer"); layer.style.cssText = "position:absolute;left:0;top:0;right:0;" + (G.phone ? "" : "bottom:0");
    H.spread.appendChild(layer);
    if (old) {
      old.style.pointerEvents = "none";
      if (RM) old.remove(); else old.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "ease-out", fill: "forwards" }).onfinish = () => old.remove();
    }
    return layer;
  };
  const renderLayer = () => {
    const L = newLayer();
    L.classList.toggle("searching", ST.mode === "search");
    if (ST.mode === "search") composeSearch(L, ST.S);
    else if (ST.mode === "focus") composeFocus(L, ST.F);
    if (G.phone) H.stage.scrollTop = 0;
    return L;
  };
  const primaries = (L) => [...L.querySelectorAll(".sp[data-id]")];

  const headState = () => {
    const on = ST.mode !== "field";
    H.close.hidden = !on;
    H.count.textContent = ST.mode === "search" && ST.S ? String(ST.S.res.length) : "";
    const q = ST.mode === "search" && ST.S ? ST.S.q.trim().toLowerCase() : "";
    H.sug.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.textContent.toLowerCase() === q));
    fitSug();
  };
  /* the words that do not fit the row step out whole, never cut */
  const fitSug = () => {
    if (G && G.phone) return;
    const bs = [...H.sug.children]; bs.forEach((b) => { b.style.display = ""; });
    const right = H.sug.getBoundingClientRect().right;
    for (let i = bs.length - 1; i >= 0 && bs[i].getBoundingClientRect().right > right + 0.5; i--) bs[i].style.display = "none";
  };

  /* field to mind: the pieces you could see fly into their marks; the
     ones the spread wants fly into the spread instead */
  const enter = () => {
    const vis = visibleField();
    document.documentElement.classList.add("locked");
    H.mind.classList.add("on");
    mindGeom();
    const L = renderLayer();
    const now = performance.now();
    const claimed = new Map(); primaries(L).forEach((el) => { if (!claimed.has(el.dataset.id)) claimed.set(el.dataset.id, el); });
    const targets = primaries(L).map((el) => ({ el, r1: rectOf(el) }));
    /* the marks rise tower by tower, from the foot */
    for (let i = 0; i < FR.length; i++) { TX.a[i] = 0; }
    texTarget(ST.mode, ST.mode === "search" ? ST.S : ST.F);
    TOWERS.forEach((t, ti) => t.list.forEach((f, n) => { TX.t0[IDX.get(f.id)] = now + (RM ? 0 : 140 + ti * 11 + (n / Math.max(1, TX.geo.cpr)) * 5); }));
    vis.forEach(({ it, r }, n) => {
      const id = it.f && it.f.id, el = it.el;
      if (id && claimed.has(id)) { el.style.transition = "none"; el.style.opacity = "0"; return; }
      if (RM) return;
      const delay = Math.round(hash((id || "p") + n) * 160);
      if (!id) { el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, delay, fill: "forwards" }); return; }
      const c = cellRect(id), t = cellT(r, c);
      el.animate([{ transform: "none", opacity: 1 }, { transform: t, opacity: 0.9, offset: 0.82 }, { transform: t, opacity: 0 }], { duration: FLY, delay, easing: EASE, fill: "forwards" });
      TX.t0[IDX.get(id)] = now + delay + FLY * 0.8;
    });
    targets.forEach(({ el, r1 }, n) => {
      const src = FIELD.byId.get(el.dataset.id), v = src && vis.find((o) => o.it === src);
      if (v && claimed.get(el.dataset.id) === el) flipFrom(el, v.r, r1, 0);
      else fadeIn(el, 220 + n * 45);
    });
    L.querySelectorAll(".more, .cat").forEach((el) => fadeIn(el, 320));
    texKick();
    clearTimeout(ST.t); ST.t = setTimeout(() => {
      H.mind.classList.add("solid");
      H.field.querySelectorAll(".it").forEach((el) => { el.getAnimations().forEach((a) => a.cancel()); el.style.opacity = ""; });
      requestAnimationFrame(() => H.field.querySelectorAll(".it").forEach((el) => { el.style.transition = ""; }));
    }, FLY + 200);
  };

  /* mind to field: the reverse, and whatever the spread was holding
     flies back to its place in the field */
  const leave = () => {
    clearTimeout(ST.t);
    H.mind.classList.remove("solid");
    H.field.querySelectorAll(".it").forEach((el) => { el.getAnimations().forEach((a) => a.cancel()); el.style.opacity = ""; });
    const vis = visibleField(), now = performance.now();
    const held = new Map(); if (layer) primaries(layer).forEach((el) => { if (!held.has(el.dataset.id)) held.set(el.dataset.id, rectOf(el)); });
    vis.forEach(({ it, r }, n) => {
      if (RM) return;
      const id = it.f && it.f.id, el = it.el, delay = Math.round(hash((id || "p") + n) * 160);
      if (!id) { el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 200 + delay, fill: "backwards" }); return; }
      if (held.has(id)) { flipFrom(el, held.get(id), r, 0); return; }
      const t = cellT(r, cellRect(id));
      el.animate([{ transform: t, opacity: 0 }, { transform: t, opacity: 0.9, offset: 0.18 }, { transform: "none", opacity: 1 }], { duration: FLY, delay, easing: EASE, fill: "backwards" });
      TX.t0[IDX.get(id)] = now + delay + 60;
      TX.t[IDX.get(id)] = 0;
    });
    const hide = new Set(vis.map((v) => v.it.f && v.it.f.id));
    TOWERS.forEach((t, ti) => t.list.forEach((f, n) => {
      const i = IDX.get(f.id); TX.t[i] = 0;
      if (!hide.has(f.id)) TX.t0[i] = now + (RM ? 0 : (TOWERS.length - ti) * 6 + (t.list.length - n) * 1.2);
    }));
    TX.ring = -1; texKick();
    if (layer) { const old = layer; layer = null; old.style.pointerEvents = "none"; if (RM) old.remove(); else old.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: "forwards" }).onfinish = () => old.remove(); }
    ST.mode = "field"; ST.S = null; ST.F = null; ST.back = null; headState();
    ST.t = setTimeout(() => {
      H.mind.classList.remove("on"); document.documentElement.classList.remove("locked");
    }, RM ? 0 : FLY + 180);
  };

  /* mind to mind: a new search, or a focus. Anything in both layers
     moves from where it was to where it goes. */
  const shift = () => {
    const before = new Map(); if (layer) primaries(layer).forEach((el) => { if (!before.has(el.dataset.id)) before.set(el.dataset.id, rectOf(el)); });
    const rows = new Map(); if (layer) layer.querySelectorAll("[data-id]").forEach((el) => { if (!rows.has(el.dataset.id)) rows.set(el.dataset.id, rectOf(el)); });
    const L = renderLayer();
    const firsts = new Set();
    primaries(L).map((el) => ({ el, r1: rectOf(el) })).forEach(({ el, r1 }, n) => {
      const id = el.dataset.id; if (firsts.has(id)) return; firsts.add(id);
      const r0 = before.get(id) || (el.classList.contains("hero") ? rows.get(id) : null);
      if (r0 && !RM) flipFrom(el, r0, r1, 0); else fadeIn(el, 60 + n * 35);
    });
    L.querySelectorAll(".more, .cat").forEach((el) => fadeIn(el, 120));
    texTarget(ST.mode, ST.mode === "search" ? ST.S : ST.F);
    const now = performance.now(); TX.t0.fill(now); texKick();
  };

  const go = () => { clearTimeout(assocT); assoc(null); headState(); if (H.mind.classList.contains("on") && layer) shift(); else enter(); };
  const search = (q) => {
    if (!q.trim()) { if (ST.mode !== "field") leave(); return; }
    ST.mode = "search"; ST.S = runSearch(q); ST.F = null; ST.back = null; go();
  };
  const focus = (id) => {
    const f = BY.get(id); if (!f) return;
    if (ST.mode !== "focus") ST.back = ST.mode === "search" ? { mode: "search", q: ST.S.q } : { mode: "field" };
    ST.mode = "focus"; ST.F = { id, k: f.k }; go();
  };
  const back = () => {
    if (ST.mode === "focus" && ST.back && ST.back.mode === "search") { const q = ST.back.q; H.q.value = q; ST.mode = "search"; ST.S = runSearch(q); ST.F = null; ST.back = null; go(); return; }
    if (ST.mode !== "field") { H.q.value = ""; leave(); }
  };
  const step = (d) => {
    if (ST.mode !== "focus") return;
    const list = byK.get(ST.F.k), i = list.findIndex((f) => f.id === ST.F.id), n = list[(i + d + list.length) % list.length];
    if (n) focus(n.id);
  };

  /* ════════════════════════════════════════════════════════════════
     WIRING
     ════════════════════════════════════════════════════════════════ */
  H.sug.innerHTML = SUG.lines.map((l) => '<button type="button">' + T(l.name) + "</button>").join("") + '<span class="sep"></span>' + SUG.words.map((w) => '<button type="button">' + T(w) + "</button>").join("");
  H.sug.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; H.q.value = b.textContent; search(b.textContent); });
  let qt = 0;
  H.q.addEventListener("input", () => { clearTimeout(qt); qt = setTimeout(() => search(H.q.value), 110); });
  H.q.addEventListener("keydown", (e) => { if (e.key === "Enter") { clearTimeout(qt); search(H.q.value); } });
  H.close.addEventListener("click", back);
  H.field.addEventListener("click", (e) => {
    if (e.target.closest("a")) return;
    const it = e.target.closest(".it[data-id]"); if (it) focus(it.dataset.id);
  });
  H.spread.addEventListener("click", (e) => {
    if (e.target.closest("a")) return;
    const t = e.target.closest("[data-id]"); if (!t || (t.classList.contains("hero") && ST.mode === "focus")) return;
    focus(t.dataset.id);
  });
  H.band.addEventListener("click", back);
  const ringBase = () => (ST.mode === "focus" && ST.F ? IDX.get(ST.F.id) : -1);
  H.spread.addEventListener("pointerover", (e) => {
    if (e.pointerType !== "mouse") return;
    const t = e.target.closest("[data-id]"), i = t ? IDX.get(t.dataset.id) : undefined;
    const r = i != null ? i : ringBase();
    if (r !== TX.ring) { TX.ring = r; texKick(); }
  });
  H.spread.addEventListener("pointerleave", () => { const r = ringBase(); if (r !== TX.ring) { TX.ring = r; texKick(); } });
  /* association: rest on a fragment and the rest of its study that is
     on screen stays lit while everything else steps back */
  let assocT = 0, assocK = null;
  const assoc = (k) => {
    if (k === assocK) return; assocK = k;
    H.field.classList.toggle("assoc", !!k);
    FIELD.items.forEach((it) => { if (it.f) it.el.classList.toggle("kin", !!k && it.f.k === k); });
  };
  H.field.addEventListener("pointerover", (e) => {
    if (e.pointerType !== "mouse" || ST.mode !== "field") return;
    const it = e.target.closest(".it[data-id]"); clearTimeout(assocT);
    if (!it) { assocT = setTimeout(() => assoc(null), 160); return; }
    const k = (BY.get(it.dataset.id) || {}).k;
    assocT = setTimeout(() => assoc(k), assocK ? 90 : 420);
  });
  H.field.addEventListener("pointerleave", () => { clearTimeout(assocT); assoc(null); });
  const readout = (box, geo, x, y, left) => {
    const hit = hitCell(geo, x, y);
    if (!hit) { box.classList.remove("on"); return; }
    const words = hit.f ? clean(hit.f.kind === "pic" ? hit.f.alt || "" : D.words(hit.f)).trim() : "";
    box.innerHTML = T(D.title(hit.t.k)) + (hit.t.y ? "<i>" + hit.t.y + "</i>" : "") + (words ? "<span>" + D.esc(words.length > 96 ? words.slice(0, 95) + "\u2026" : words) + "</span>" : "");
    box.style.left = Math.round(Math.max(0, Math.min(left + geo.tx[hit.ti].x, left + geo.W - 300))) + "px";
    box.classList.add("on");
  };
  H.band.addEventListener("pointermove", (e) => { if (e.pointerType !== "mouse") return; const r = H.tex.getBoundingClientRect(); readout(H.read, TX.geo, e.clientX - r.left, e.clientY - r.top, 0); });
  H.band.addEventListener("pointerleave", () => H.read.classList.remove("on"));
  /* the opening chart: hover names a mark, a click opens it */
  H.field.addEventListener("pointermove", (e) => {
    if (!OPEN || e.target !== OPEN.cv || e.pointerType !== "mouse") { if (OPEN) OPEN.rd.style.opacity = "0"; return; }
    const r = OPEN.cv.getBoundingClientRect(), hit = hitCell(OPEN.geo, e.clientX - r.left, e.clientY - r.top);
    readout(OPEN.rd, OPEN.geo, e.clientX - r.left, e.clientY - r.top, OPEN.cx);
    OPEN.rd.style.opacity = OPEN.rd.classList.contains("on") ? "1" : "0";
    clearTimeout(assocT); assoc(hit ? hit.t.k : null);
  });
  H.field.addEventListener("click", (e) => {
    if (!OPEN || e.target !== OPEN.cv) return;
    const r = OPEN.cv.getBoundingClientRect(), hit = hitCell(OPEN.geo, e.clientX - r.left, e.clientY - r.top);
    if (hit) focus((hit.f || hit.t.list[0]).id);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { e.preventDefault(); back(); return; }
    if (e.target === H.q) return;
    if (e.key === "ArrowRight" && ST.mode === "focus") { e.preventDefault(); step(1); return; }
    if (e.key === "ArrowLeft" && ST.mode === "focus") { e.preventDefault(); step(-1); return; }
    if (e.key === "/" || (e.key.length === 1 && /\S/.test(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey)) { if (e.key === "/") e.preventDefault(); H.q.focus(); }
  });

  let lastW = 0;
  const layout = () => {
    G = grid(); lastW = G.vw;
    buildField(); fitSug();
    if (ST.mode !== "field") { mindGeom(); renderLayer(); texTarget(ST.mode, ST.mode === "search" ? ST.S : ST.F); TX.a.set(TX.t); texKick(); }
  };
  let rt = 0;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      const w = document.documentElement.clientWidth;
      if (w !== lastW) layout();
      else if (ST.mode !== "field") { G = grid(); mindGeom(); renderLayer(); }
    }, 180);
  });
  /* the field is measured once, so every weight it sets must be here
     first; a face that still lands late lays the field out again */
  let started = false;
  const start = () => { started = true; layout(); headState(); document.documentElement.classList.add("ready"); };
  const want = ['400 12px "Avenir Next"', '500 12px "Avenir Next"', '600 12px "Avenir Next"', '700 12px "Avenir Next"', '700 40px "RH Ogg"'];
  const fonts = document.fonts ? Promise.race([Promise.all(want.map((w) => document.fonts.load(w).catch(() => 0))).then(() => document.fonts.ready), new Promise((r) => setTimeout(r, 1500))]) : Promise.resolve();
  fonts.then(start);
  if (document.fonts) document.fonts.addEventListener("loadingdone", () => { if (started && ST.mode === "field") { clearTimeout(rt); rt = setTimeout(layout, 120); } });
})();
