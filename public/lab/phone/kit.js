/* ── PHONE: THE INDEX ON A PHONE (29 Sept 2026) ───────────────────────
   His question, stepping away: "one big thing we havent thought about is
   how this new site experience will work in mobile...the TOC/index is a
   hamburger menu maybe? maybe it's at the bottom and slides up/open or
   from the side? i'm not sure - it'll be a tough one...maybe a swipe from
   side to side allows the user to go back and forth? can we do some high
   level concepts of how it might function while i'm away?"

   On a desk the index and the room share the page: the index on the left
   never moves, and while a room is open it is that room's spec sheet. A
   phone has room for one of them. Each concept in /lab/phone/ is one
   answer to where the other one goes, and how you move between them.

   This file is what they share, so they differ only in that answer:
     PH.index(o)       the index as a phone reads it: index E's sections
                       in its order, from the same fragments.js crossref2
                       reads (01 What I make, 02 Work, 03 Years, 04 About,
                       05 Figures, 06 Capabilities, 07 Tools)
     PH.shelf(o)       what an entry holds: a line's, a year's, a tool's
                       studies, set as a phone page
     PH.room(host, k)  the real room, study-panel.js, in a host that
                       scrolls
     PH.about(host, id) an About section as a room of words
     PH.drag(el, o)    a pull that picks its axis in the first pixels, so
                       a room keeps its own scroll
   Nothing here is written: every word is the studies', the statement's
   or the index's own labels. Type is Avenir Next only. */
(() => {
  const D = window.D, DATA = window.DENSITY, SP = window.StudyPanel;
  if (!D || !DATA || !SP) return;
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const two = (n) => String(n).padStart(2, "0");

  /* the studies newest first, as crossref2 orders them */
  const ORDER = DATA.studies.map((s, i) => [s, i]).sort((a, b) => b[0].y - a[0].y || a[1] - b[1]).map((x) => x[0].k);
  const RANK = {}; ORDER.forEach((k, i) => { RANK[k] = i; });
  const byRank = (ks) => [...new Set(ks)].filter((k) => D.study(k)).sort((a, b) => RANK[a] - RANK[b]);
  const LINES = (DATA.lines || []).map((l) => Object.assign({}, l, { ks: byRank(l.studies) }));
  const YEARS = [...new Set(ORDER.map((k) => D.study(k).y))];

  /* the index's other entries, each the studies it touches */
  const CAPS = new Map(), TOOLS = new Map(), FIGS = [];
  D.frags.forEach((f) => {
    if (f.kind === "tool" && f.value) {
      const m = f.label === "Service" ? CAPS : TOOLS;
      const key = String(f.value).trim(); if (!m.has(key)) m.set(key, new Set()); m.get(key).add(f.k);
    }
    if (f.kind === "num" && f.value && f.label) FIGS.push(f);
  });
  const ranked = (m) => [...m.entries()].map(([v, s]) => ({ v, ks: byRank([...s]) })).sort((a, b) => b.ks.length - a.ks.length || a.v.localeCompare(b.v));

  /* a study's own pictures, and the one the board leads with */
  const cover = (k) => SP.cover(k);
  const dpr = () => Math.min(2, window.devicePixelRatio || 1);
  const pic = (k, w, cls) => {
    const c = cover(k), box = el("span", "ph-pic" + (cls ? " " + cls : ""));
    if (!c) { box.classList.add("none"); return box; }
    box.style.setProperty("--ar", (c.w / c.h).toFixed(4));
    const im = el("img"); im.alt = ""; im.decoding = "async"; im.loading = "lazy";
    const want = w * dpr();
    im.src = encodeURI(want <= 384 && c.t384 ? c.t384 : want <= 768 && c.t768 ? c.t768 : c.src);
    im.addEventListener("load", () => box.classList.add("in"), { once: true });
    box.appendChild(im);
    return box;
  };

  /* ── the index ── */
  const head = (n, name, count) => el("h2", "ix-h", '<span><b>' + n + "</b>" + esc(name) + "</span>" + (count != null ? '<span class="n">' + count + "</span>" : ""));
  const index = (o) => {
    o = o || {};
    const go = (kind, v, from) => { if (o.on) o.on(kind, v, from); };
    const root = el("div", "ix");
    if (o.statement !== false) {
      const st = el("section", "ix-st");
      st.appendChild(el("p", "ix-stm", esc(DATA.statement.ink) + ' <span class="g">' + esc(DATA.statement.grey) + "</span>"));
      const ln = el("p", "ix-links");
      (DATA.links || []).forEach((l) => { const a = el("a", null, esc(l.k)); a.href = l.v; if (/^https?:/.test(l.v)) a.target = "_blank"; ln.appendChild(a); });
      st.appendChild(ln); root.appendChild(st);
    }
    /* 01 What I make: the six lines, large, and each line's lead study */
    const s1 = el("section", "ix-g"); s1.dataset.g = "lines";
    s1.appendChild(head("01", "What I make", LINES.length));
    const ls = el("div", "ix-lines");
    LINES.forEach((l) => {
      const a = el("a", "ix-line e", '<span class="nm">' + esc(l.name) + '<sup>' + l.ks.length + "</sup></span>" + '<span class="sn">' + esc(l.sentence) + "</span>");
      a.href = "#line/" + l.tag; a.dataset.line = l.tag; a.dataset.ks = l.ks.join(" ");
      a.addEventListener("click", (e) => { e.preventDefault(); go("line", l.tag, a); });
      ls.appendChild(a);
    });
    s1.appendChild(ls);
    if (o.features !== false) {
      const fs = el("div", "ix-feats");
      LINES.forEach((l) => {
        if (!D.study(l.lead)) return;
        const a = el("a", "ix-feat e"); a.href = "#study/" + l.lead; a.dataset.k = l.lead; a.dataset.ks = l.lead;
        a.appendChild(pic(l.lead, 180));
        a.appendChild(el("span", "t", esc(D.title(l.lead))));
        a.appendChild(el("span", "l", esc(l.name)));
        a.addEventListener("click", (e) => { e.preventDefault(); go("study", l.lead, a); });
        fs.appendChild(a);
      });
      s1.appendChild(fs);
    }
    root.appendChild(s1);
    /* 02 Work: every study, counting down by its number */
    const s2 = el("section", "ix-g"); s2.dataset.g = "work";
    s2.appendChild(head("02", "Work", ORDER.length));
    const wl = el("div", "ix-work");
    ORDER.slice().sort((a, b) => D.num(b).localeCompare(D.num(a))).forEach((k) => {
      const s = D.study(k);
      const a = el("a", "ix-w e", '<span class="no">' + D.num(k) + '</span><span class="t">' + esc(D.title(k)) + '</span><span class="y">' + s.y + "</span>" + (s.s ? '<span class="d">' + esc(s.s) + "</span>" : ""));
      a.href = "#study/" + k; a.dataset.k = k; a.dataset.ks = k;
      a.addEventListener("click", (e) => { e.preventDefault(); go("study", k, a); });
      wl.appendChild(a);
    });
    s2.appendChild(wl); root.appendChild(s2);
    /* 03 Years */
    const s3 = el("section", "ix-g"); s3.dataset.g = "years";
    s3.appendChild(head("03", "Years", YEARS.length));
    const yl = el("div", "ix-run ix-years");
    YEARS.forEach((y) => {
      const ks = ORDER.filter((k) => D.study(k).y === y);
      const a = el("a", "e", esc(y) + "<sup>" + ks.length + "</sup>"); a.href = "#year/" + y; a.dataset.ks = ks.join(" ");
      a.addEventListener("click", (e) => { e.preventDefault(); go("year", y, a); });
      yl.appendChild(a);
    });
    s3.appendChild(yl); root.appendChild(s3);
    /* 04 About */
    const s4 = el("section", "ix-g"); s4.dataset.g = "about";
    s4.appendChild(head("04", "About", (DATA.about || []).length));
    const al = el("div", "ix-about");
    (DATA.about || []).forEach((ab) => {
      const a = el("a", "ix-ab e", '<span class="t">' + esc(ab.name) + '</span><span class="sn">' + esc(ab.lede) + "</span>");
      a.href = "#about/" + ab.id; a.dataset.ks = "";
      a.addEventListener("click", (e) => { e.preventDefault(); go("about", ab.id, a); });
      al.appendChild(a);
    });
    s4.appendChild(al); root.appendChild(s4);
    /* 05 Figures, 06 Capabilities, 07 Tools: runs, as the index sets them */
    const runSec = (n, name, list, kind) => {
      const s = el("section", "ix-g"); s.dataset.g = kind;
      s.appendChild(head(n, name, list.length));
      const r = el("div", "ix-run");
      list.forEach((x) => {
        const a = el("a", "e", esc(x.v)); a.href = "#" + kind + "/" + encodeURIComponent(x.v); a.dataset.ks = x.ks.join(" ");
        a.addEventListener("click", (e) => { e.preventDefault(); go(kind, x.v, a); });
        r.appendChild(a);
      });
      s.appendChild(r); root.appendChild(s);
    };
    const figs = [];
    const seen = new Set();
    FIGS.forEach((f) => { const v = f.value + " " + String(f.label).toLowerCase(); if (seen.has(v)) return; seen.add(v); figs.push({ v, ks: [f.k], f }); });
    runSec("05", "Figures", figs.slice(0, 18), "fig");
    runSec("06", "Capabilities", ranked(CAPS).slice(0, 24), "cap");
    runSec("07", "Tools", ranked(TOOLS).slice(0, 30), "tool");
    const foot = el("p", "ix-foot", '<span class="mark">Reckon<i>*</i>House</span> <a href="mailto:' + esc(DATA.email) + '">' + esc(DATA.email) + "</a>");
    root.appendChild(foot);

    /* while a room is open, the index is its spec sheet: what the study
       holds in ink, the rest grey; the study's own row set solid */
    root.mark = (k) => {
      root.classList.toggle("spec", !!k);
      root.querySelectorAll(".e").forEach((a) => {
        const ks = (a.dataset.ks || "").split(" ");
        a.classList.toggle("on", !!k && ks.includes(k));
        a.classList.toggle("cur", !!k && a.dataset.k === k);
      });
    };
    root.rowOf = (k) => root.querySelector('.ix-w[data-k="' + k + '"]');
    return root;
  };

  /* ── a shelf: what an entry holds, as a phone page ── */
  const shelfOf = (kind, v) => {
    if (kind === "line") { const l = LINES.find((x) => x.tag === v); return l ? { name: l.name, sentence: l.sentence, ks: l.ks, label: "What I make" } : null; }
    if (kind === "year") return { name: String(v), sentence: "", ks: ORDER.filter((k) => D.study(k).y === +v), label: "Year" };
    if (kind === "cap") { const s = CAPS.get(v); return s ? { name: v, sentence: "", ks: byRank([...s]), label: "Capability" } : null; }
    if (kind === "tool") { const s = TOOLS.get(v); return s ? { name: v, sentence: "", ks: byRank([...s]), label: "Tool" } : null; }
    if (kind === "fig") { const f = FIGS.find((x) => x.value + " " + String(x.label).toLowerCase() === v); return f ? { name: f.value + " " + String(f.label).toLowerCase(), sentence: f.sub || "", ks: [f.k], label: "Figure" } : null; }
    return null;
  };
  const shelf = (o) => {
    const S = shelfOf(o.kind, o.v); const root = el("div", "sh");
    if (!S) return root;
    root.ks = S.ks;
    root.appendChild(el("p", "sh-lab", esc(S.label) + '<span class="n">' + S.ks.length + (S.ks.length === 1 ? " study" : " studies") + "</span>"));
    root.appendChild(el("h1", "sh-h", esc(S.name) + (S.sentence ? '<span class="g">. ' + esc(S.sentence.replace(/\.$/, "")) + ".</span>" : "")));
    const list = el("div", "sh-list");
    S.ks.forEach((k, i) => {
      const s = D.study(k);
      const a = el("a", "sh-s e" + (i === 0 ? " lead" : "")); a.href = "#study/" + k; a.dataset.k = k;
      a.appendChild(pic(k, i === 0 ? 390 : 190));
      a.appendChild(el("span", "t", esc(D.title(k))));
      a.appendChild(el("span", "y", s.y + (s.s ? " · " + esc(s.s) : "")));
      a.addEventListener("click", (e) => { e.preventDefault(); if (o.on) o.on("study", k, a); });
      list.appendChild(a);
    });
    root.appendChild(list);
    return root;
  };

  /* ── the room: the real one ── */
  const room = (host, k, o) => {
    o = o || {};
    const order = o.order || ORDER;
    const i = order.indexOf(k), nk = order.length > 1 ? order[(i + 1) % order.length] : null;
    const r = SP.render(host, k, {
      next: o.next === false || !nk ? null : { k: nk, t: D.title(nk) },
      onNext: o.onNext ? (x) => o.onNext(x) : undefined,
      onClose: o.onClose ? () => o.onClose() : undefined,
      hold: !!o.hold,
    });
    return r;
  };
  /* an About section, as a room of words */
  const about = (host, id) => {
    const a = (DATA.about || []).find((x) => x.id === id); const root = el("article", "ab");
    if (a) {
      root.appendChild(el("p", "sh-lab", "About"));
      root.appendChild(el("h1", "ab-h", esc(a.name)));
      root.appendChild(el("p", "ab-lede", esc(a.lede)));
      (a.body || []).forEach((p) => root.appendChild(el("p", "ab-p", esc(p))));
    }
    host.appendChild(root);
    return { el: root, destroy() { root.remove(); } };
  };

  /* ── a pull that picks its axis in the first pixels ──
     o.axis "x" or "y": the axis this pull owns; the other is left to the
     page (set touch-action on the element to match: pan-y for an "x"
     pull, none for a "y" handle). o.edge: start only this near the left
     (or o.edgeRight) edge. start/move/end get dx, dy and, at the end, the
     velocity in px per ms */
  const drag = (node, o) => {
    let id = null, x0 = 0, y0 = 0, t0 = 0, axis = null, hist = [], eat = false, eatT = 0;
    const vel = () => { const a = hist[0], b = hist[hist.length - 1]; if (!a || !b || b.t === a.t) return { vx: 0, vy: 0 }; return { vx: (b.x - a.x) / (b.t - a.t), vy: (b.y - a.y) / (b.t - a.t) }; };
    const down = (e) => {
      eat = false;
      if (id != null || (e.pointerType === "mouse" && e.button !== 0)) return;
      if (o.edge && e.clientX > o.edge) return;
      if (o.edgeRight && e.clientX < innerWidth - o.edgeRight) return;
      if (o.can && !o.can(e)) return;
      id = e.pointerId; x0 = e.clientX; y0 = e.clientY; t0 = performance.now(); axis = null; hist = [{ x: x0, y: y0, t: t0 }];
      /* heard on the window until it ends, so a mouse that leaves a narrow
         handle before the axis is picked still pulls it */
      addEventListener("pointermove", move, { passive: false });
      addEventListener("pointerup", up); addEventListener("pointercancel", up);
    };
    const move = (e) => {
      if (e.pointerId !== id) return;
      const dx = e.clientX - x0, dy = e.clientY - y0, now = performance.now();
      hist.push({ x: e.clientX, y: e.clientY, t: now }); while (hist.length > 2 && now - hist[0].t > 90) hist.shift();
      if (!axis) {
        if (Math.hypot(dx, dy) < 8) return;
        axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        if (axis !== o.axis) { id = null; removeEventListener("pointermove", move); removeEventListener("pointerup", up); removeEventListener("pointercancel", up); return; }
        try { node.setPointerCapture(id); } catch (err) { /* gone */ }
        if (o.start) o.start(dx, dy, e);
      }
      if (o.move) o.move(dx, dy, e);
      if (e.cancelable) e.preventDefault();
    };
    const up = (e) => {
      if (e.pointerId !== id) return;
      removeEventListener("pointermove", move); removeEventListener("pointerup", up); removeEventListener("pointercancel", up);
      const was = axis === o.axis; id = null; axis = null;
      if (!was) { if (o.tap && e.type === "pointerup" && Math.hypot(e.clientX - x0, e.clientY - y0) < 8) o.tap(e); return; }
      /* the click a mouse sends after a pull is the pull's, not a tap;
         eaten once, and only for a moment, so the next real tap lands */
      eat = true; clearTimeout(eatT); eatT = setTimeout(() => { eat = false; }, 350);
      const { vx, vy } = vel();
      /* a cancelled pointer can report 0,0; the last place it was seen is
         where the pull ended */
      const last = hist[hist.length - 1] || { x: x0, y: y0 };
      const ex = e.type === "pointercancel" ? last.x : e.clientX, ey = e.type === "pointercancel" ? last.y : e.clientY;
      if (o.end) o.end(ex - x0, ey - y0, vx, vy, e);
    };
    node.addEventListener("pointerdown", down);
    node.addEventListener("click", (e) => { if (eat) { eat = false; e.preventDefault(); e.stopPropagation(); } }, true);
  };

  /* a node's transform set with or without a glide; the house's curve */
  const EASE = "cubic-bezier(0.2, 0.7, 0.2, 1)";
  const set = (node, tf, ms, ease) => {
    node.style.transition = ms ? "transform " + ms + "ms " + (ease || EASE) : "none";
    node.style.transform = tf;
  };
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  window.PH = {
    D, DATA, ORDER, RANK, LINES, YEARS, byRank, cover, pic, el, esc, two,
    index, shelf, shelfOf, room, about, drag, set, wait, EASE,
    title: (k) => D.title(k), num: (k) => D.num(k), year: (k) => (D.study(k) || {}).y,
    next: (k, order) => { order = order || ORDER; const i = order.indexOf(k); return order[(i + 1) % order.length]; },
    prev: (k, order) => { order = order || ORDER; const i = order.indexOf(k); return order[(i - 1 + order.length) % order.length]; },
    lineOf: (k) => LINES.find((l) => l.ks.includes(k)) || null,
  };
})();
