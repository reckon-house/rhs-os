/* ── THE CROSS-REFERENCE: the page's own code (26 Sept 2026) ───────────
   Reads window.D (density.js) and draws three things: the index (every
   entry a link, each carrying the set of studies it belongs to), the
   focus (one thing large, chosen from the entry's own fragments), and the
   wires between them. Related means: shares a study. Nothing here writes
   a sentence; every word on the page is a fragment's own. */
(() => {
  const D = window.D, DATA = D.data;
  const $ = (s) => document.querySelector(s);
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  /* the house rule: no em dashes on the page, even where the data has one */
  const clean = (s) => String(s == null ? "" : s).replace(/\s*\u2014\s*/g, " · ");
  const esc = (s) => D.esc(clean(s));
  const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const HTML = document.documentElement;
  const phone = () => HTML.classList.contains("stack");
  const IDX = $("#idx"), MARK = $("#mark"), FOCUS = $("#focus"), FIELD = $("#field"), WIRES = $("#wires");

  /* ── the studies, newest first ── */
  const ORDER = DATA.studies.map((s, i) => [s, i]).sort((a, b) => b[0].y - a[0].y || a[1] - b[1]).map((x) => x[0]);
  const RANK = {}; ORDER.forEach((s, i) => { RANK[s.k] = i; });
  const FIDX = new Map(); D.frags.forEach((f, i) => FIDX.set(f, i));
  const picsOf = (k) => D.byStudy(k).filter((f) => f.kind === "pic");
  const heroOf = (k) => { const p = picsOf(k); return p.find((f) => !f.alpha) || p[0] || null; };

  /* ── which studies a sentence of About names: the whole title, or one
     of its proper words (Nordstrom, Neiman, Sally, A.R.C., Dallas...) ── */
  const STOP = new Set(["Various", "Home", "Hill", "Country", "Black", "White", "Type", "Mountain", "View", "West", "Texas", "Spring",
    "Campaign", "Marketing", "Sport", "Collective", "Faux", "Reel", "Suite", "Beauty", "Personalization", "Framework", "Loved",
    "Inventory", "Floor", "Decor", "Park", "Design", "Boot"]);
  const KEYS = DATA.studies.map((s) => ({
    k: s.k, full: s.t.toLowerCase(),
    words: s.t.split(/\s+/).map((w) => w.replace(/[’']s$/, "").replace(/[,;:]$/, "")).filter((w) => w.length >= 4 && /^[A-Z]/.test(w) && !STOP.has(w)),
  }));
  const mentions = (text) => {
    const out = new Set(), low = String(text).toLowerCase();
    KEYS.forEach(({ k, full, words }) => {
      if (low.includes(full) || words.some((w) => new RegExp("(^|[^A-Za-z])" + reEsc(w)).test(text))) out.add(k);
    });
    return out;
  };
  const ABOUT = (DATA.about || []).map((a) => ({ a, rel: new Set([...mentions([a.lede].concat(a.body).join(" ")), "about:" + a.id]) }));
  const aboutOf = (text) => ABOUT.find(({ a }) => a.lede === text || a.body.some((b) => b.includes(text))) || null;
  const relOf = (f) => {
    if (f.k !== "about") return new Set([f.k]);
    const s = mentions(D.words(f)); const x = aboutOf(f.text || "");
    if (x) s.add("about:" + x.a.id);
    return s;
  };
  const studyOf = (rel) => [...rel].filter((k) => D.study(k)).sort((a, b) => RANK[a] - RANK[b])[0] || null;

  /* ── figures: every num value, and the figures inside his sentences,
     taken verbatim. Digits with whatever unit sits on them; a number word
     with a time unit; a number word of four or more with a count ── */
  const NUMW = { two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, twenty: 20, thirty: 30 };
  const TIME = "weeks?|years?|months?|days?|hours?|minutes?";
  const COUNT = "stores|tools|trainers|programs|categories|materials|marbles|stones|prints|tiles|shapes|collections|logos|setups|photographs|frames|finishes|weights|colorways|providers|applications|channels|locations|rooms|album covers|clients|lockups|feet";
  const RW = new RegExp("\\b(" + Object.keys(NUMW).join("|") + ")[- ](" + TIME + "|" + COUNT + ")\\b", "gi");
  const RD = /(?<![A-Za-z0-9'’.\-])(?:Weeks? )?~?\$?\d[\d,]*(?:\.\d+)?(?:[-–]\$?\d[\d,]*(?:\.\d+)?)?(?:%|\+|x\d+|x|KB|MB|ms|fps|M|")?(?:[- ](?:square feet|foot|feet|hours|minutes|weeks|wks|items|stores|store|square|wide|degree|per page|SKUs))?(?![A-Za-z0-9])/g;
  const figsIn = (text) => {
    const out = []; let m;
    const rd = new RegExp(RD.source, "g");
    while ((m = rd.exec(text))) {
      const s = m[0].trim().replace(/[,.]+$/, "");
      if (!s) continue;
      if (/^\d+$/.test(s)) { const n = +s; if (s.length < 2 || (n >= 2000 && n <= 2030)) continue; }
      if (/^\d+\.\d+$/.test(s)) continue; /* a version number, 2.0 */
      out.push({ s, at: m.index });
    }
    const rw = new RegExp(RW.source, "gi");
    while ((m = rw.exec(text))) {
      const n = NUMW[m[1].toLowerCase()]; const time = new RegExp("^(" + TIME + ")$", "i").test(m[2]);
      if (time || n >= 4) out.push({ s: m[0], at: m.index });
    }
    return out.sort((a, b) => a.at - b.at).map((x) => x.s);
  };
  const FIGS = new Map(); /* lower(figure) -> { s, src: [{f, item}], rel } */
  const addFig = (s, f, item) => {
    const key = s.toLowerCase();
    if (!FIGS.has(key)) FIGS.set(key, { s, src: [], rel: new Set(), order: Infinity });
    const g = FIGS.get(key); g.src.push({ f, item }); relOf(f).forEach((k) => g.rel.add(k));
    const o = (f.k === "about" ? -1e6 : (RANK[f.k] || 0) * 1e4) + FIDX.get(f); g.order = Math.min(g.order, o);
  };
  D.frags.forEach((f) => {
    if (f.kind === "num") addFig(f.value, f, { t: "fig", fig: f.value, label: f.label, sub: f.sub, k: f.k });
    else if (f.kind === "chart") {
      if (f.callout) addFig(f.callout, f, { t: "chart", f, hl: f.callout, k: f.k });
      f.bars.forEach((b) => figsIn(b.value).forEach((s) => addFig(s, f, { t: "chart", f, hl: s, k: f.k })));
    } else if (f.kind === "steps") {
      figsIn(f.duration || "").forEach((s) => addFig(s, f, { t: "steps", f, hl: s, k: f.k }));
      f.steps.forEach((st) => figsIn(st.note || "").forEach((s) => addFig(s, f, { t: "steps", f, hl: s, k: f.k })));
    } else if (f.kind === "line" && f.num) {
      figsIn(f.text).forEach((s) => addFig(s, f, { t: "fig", fig: s, sent: f.text, k: studyOf(relOf(f)) || f.k, about: f.k === "about" }));
    }
  });

  /* ── services and tools, deduplicated ── */
  const toolsWhere = (test) => {
    const m = new Map();
    D.byKind("tool").filter((f) => test(f.label)).forEach((f) => {
      const key = f.value.toLowerCase();
      if (!m.has(key)) m.set(key, { v: f.value, rel: new Set() });
      m.get(key).rel.add(f.k);
    });
    return [...m.values()].sort((a, b) => a.v.localeCompare(b.v));
  };

  /* ── the reels: what an entry can put in focus, best first ── */
  const heroItems = (rel, skip) => [...rel].filter((k) => D.study(k)).sort((a, b) => RANK[a] - RANK[b])
    .map((k) => heroOf(k)).filter((f) => f && !(skip && skip.has(f))).map((f) => ({ t: "pic", f, k: f.k }));
  const studyReel = (k) => {
    const fr = D.byStudy(k), out = [], s = D.study(k), h = heroOf(k);
    if (h) out.push({ t: "pic", f: h, k });
    else if (s && s.fact) out.push({ t: "text", text: s.fact, grey: s.rest, k });
    fr.filter((f) => f.kind === "line" && f.weight === "display").forEach((f) => out.push({ t: "text", text: f.text, k }));
    fr.filter((f) => f.kind === "num").forEach((f) => out.push({ t: "fig", fig: f.value, label: f.label, sub: f.sub, k }));
    fr.filter((f) => f.kind === "chart").forEach((f) => out.push({ t: "chart", f, hl: f.callout, k }));
    fr.filter((f) => f.kind === "steps").forEach((f) => out.push({ t: "steps", f, k }));
    fr.filter((f) => f.kind === "palette").slice(0, 1).forEach((f) => out.push({ t: "palette", f, k }));
    fr.filter((f) => f.kind === "pic" && f !== h).forEach((f) => out.push({ t: "pic", f, k }));
    return out;
  };
  const capReel = (v, rel) => {
    const pool = [...rel].flatMap((k) => picsOf(k));
    const hits = D.search(v, pool).filter((r) => r.score >= 3 && D.tokens(v).some((t) => new RegExp("\\b" + reEsc(t)).test((r.f.alt || "").toLowerCase())));
    const seen = new Set(hits.map((r) => r.f));
    return hits.slice(0, 16).map((r) => ({ t: "pic", f: r.f, k: r.f.k })).concat(heroItems(rel, seen));
  };
  const toolReel = (v, rel) => {
    const out = [], seen = new Set();
    const tries = [v].concat(v.split(/[^A-Za-z0-9.#]+/).filter((w) => w.length >= 4 && w.toLowerCase() !== "adobe"));
    for (const name of tries) {
      const re = new RegExp("(^|[^A-Za-z0-9])" + reEsc(name) + "(?![A-Za-z])", "i");
      [...rel].forEach((k) => D.byStudy(k).forEach((f) => {
        if (seen.has(f)) return;
        if (f.kind === "line" && re.test(f.text)) { seen.add(f); out.push({ t: "text", text: f.text, hl: name, k }); }
        else if (f.kind === "fact" && re.test(f.value)) { seen.add(f); out.push({ t: "text", text: f.value, hl: name, label: f.label, k }); }
      }));
      if (out.length) break;
    }
    /* sentences before spec lines, shorter first so the big type stays big */
    out.sort((a, b) => (a.label ? 1 : 0) - (b.label ? 1 : 0) || a.text.length - b.text.length);
    return out.slice(0, 12).concat(heroItems(rel));
  };

  /* ── the index ── */
  const ENTRIES = [];
  const GROUPS = [
    { id: "work", name: "Work", mode: "list" },
    { id: "lines", name: "Lines", mode: "list" },
    { id: "about", name: "About", mode: "list" },
    { id: "years", name: "Years", mode: "run" },
    { id: "capabilities", name: "Capabilities", mode: "run" },
    { id: "tools", name: "Tools", mode: "run" },
    { id: "figures", name: "Figures", mode: "run" },
  ];
  const G = {}; GROUPS.forEach((g) => { G[g.id] = g; g.items = []; });
  const add = (g, o) => { o.g = G[g]; o.i = ENTRIES.length; ENTRIES.push(o); G[g].items.push(o); let r = null; o.reel = () => (r = r || o.make().filter(Boolean)); return o; };

  ORDER.forEach((s) => add("work", { html: '<span class="t">' + esc(D.title(s.k)) + '</span><span class="y">' + s.y + "</span>", cls: "w",
    rel: new Set([s.k]), href: D.href(s.k), make: () => studyReel(s.k) }));
  (DATA.lines || []).forEach((l) => add("lines", { html: '<span class="chip" style="--c:' + l.color + '"></span><span class="t">' + esc(l.name) + "</span>",
    rel: new Set(l.studies), href: D.href(l.lead), make: () => [{ t: "field", line: l }].concat(heroItems(new Set([l.lead].concat(l.studies)))) }));
  ABOUT.forEach(({ a, rel }) => add("about", { html: '<span class="t">' + esc(a.name) + "</span>", rel, href: "/",
    make: () => [{ t: "about", a }].concat(heroItems(rel)) }));
  [...new Set(ORDER.map((s) => s.y))].forEach((y) => {
    const rel = new Set(ORDER.filter((s) => s.y === y).map((s) => s.k));
    add("years", { html: '<span class="t">' + y + "</span>", rel, href: D.href(studyOf(rel)), make: () => [{ t: "year", y, rel }].concat(heroItems(rel)) });
  });
  toolsWhere((l) => l === "Service").forEach(({ v, rel }) => add("capabilities", { html: '<span class="t">' + esc(v) + "</span>", rel, href: D.href(studyOf(rel)), make: () => capReel(v, rel) }));
  toolsWhere((l) => l !== "Service").forEach(({ v, rel }) => add("tools", { html: '<span class="t">' + esc(v) + "</span>", rel, href: D.href(studyOf(rel)), make: () => toolReel(v, rel) }));
  [...FIGS.values()].sort((a, b) => a.order - b.order).forEach((g) => add("figures", { html: '<span class="t">' + esc(g.s) + "</span>", cls: "fig", rel: g.rel,
    href: studyOf(g.rel) ? D.href(studyOf(g.rel)) : "/", make: () => g.src.map((x) => x.item) }));

  GROUPS.forEach((g) => {
    if (!g.items.length) return;
    const sec = el("section", "grp " + g.mode); sec.dataset.g = g.id;
    const h = el("h2", null, "<span>" + g.name + '</span><span class="n">' + g.items.length + "</span>");
    g.count = h.querySelector(".n");
    sec.appendChild(h);
    const box = el("div", "items");
    g.items.forEach((o, j) => {
      const a = el("a", "e" + (o.cls ? " " + o.cls : ""), o.html);
      a.href = o.href; a.dataset.i = o.i; o.a = a;
      if (g.mode === "run") {
        /* short entries keep their words together; a long one may break
           where it must. The dot rides on the end of its entry, so no line
           starts with one */
        const t = a.querySelector(".t"); if (t && t.textContent.length <= 22) a.classList.add("nw");
        const it = el("span", "it"); it.appendChild(a);
        if (j < g.items.length - 1) it.appendChild(el("span", "sep", "·"));
        box.appendChild(it); box.appendChild(document.createTextNode(" "));
      } else box.appendChild(a);
    });
    sec.appendChild(box); IDX.appendChild(sec);
  });

  /* fit: the fewest columns that read, then the largest type that fits */
  const fit = () => {
    const root = HTML.style;
    /* on a desk the mark heads the first column, like a masthead over a
       catalogue; stacked, it sits above the band */
    const stack = () => { HTML.classList.add("stack"); if (MARK.parentNode !== document.body) document.body.insertBefore(MARK, FOCUS); root.removeProperty("--fs"); root.removeProperty("--cols"); };
    if (innerWidth <= 760) return stack();
    HTML.classList.remove("stack", "scrolly");
    if (IDX.firstChild !== MARK) IDX.insertBefore(MARK, IDX.firstChild);
    const w = IDX.clientWidth; const base = Math.round(w / 172);
    if (base < 3) return stack(); /* too narrow for the index and an open half side by side */
    for (const cols of [base, base + 1]) {
      root.setProperty("--cols", cols);
      for (let fs = 13; fs >= 10.49; fs -= 0.25) {
        root.setProperty("--fs", fs + "px");
        if (IDX.scrollWidth <= IDX.clientWidth + 1 && IDX.scrollHeight <= IDX.clientHeight + 1) return;
      }
    }
    /* the whole index will not fit this glass at 10.5px: keep it beside
       the open half and let the page scroll it, the focus held still */
    HTML.classList.add("scrolly");
    root.setProperty("--cols", base); root.setProperty("--fs", "11.5px");
  };

  /* ── the cross-reference ── */
  const meets = (a, b) => { for (const k of a) if (b.has(k)) return true; return false; };
  let lit = [];
  const paint = (o) => {
    document.body.classList.toggle("x", !!o);
    lit = [];
    ENTRIES.forEach((x) => {
      const on = !!o && (x === o || meets(x.rel, o.rel));
      x.a.classList.toggle("on", on); x.a.classList.toggle("me", x === o);
      if (on && x !== o) lit.push(x);
    });
    GROUPS.forEach((g) => {
      if (!g.count) return;
      if (!o) { g.count.textContent = g.items.length; return; }
      const n = g.items.filter((x) => x.a.classList.contains("on")).length;
      g.count.innerHTML = "<b>" + n + "</b>/" + g.items.length;
    });
  };

  /* ── the focus: one thing, as large as it honestly goes ── */
  const title = (k) => (D.study(k) ? esc(D.title(k)) : "");
  const who = (k) => {
    const s = D.study(k); if (!s) return "";
    return '<span class="who">' + esc(D.title(k)) + '<span class="g">' + s.y + '</span><span class="g">' + esc(s.s) + "</span></span>";
  };
  const hl = (text, s) => {
    const t = esc(text); if (!s) return t;
    const i = t.toLowerCase().indexOf(esc(s).toLowerCase());
    return i < 0 ? t : t.slice(0, i) + "<mark>" + t.slice(i, i + esc(s).length) + "</mark>" + t.slice(i + esc(s).length);
  };
  /* the largest size (up to max) at which a block fits a box */
  const fitType = (node, W, H, max, min) => {
    let lo = min || 14, hi = max, best = lo;
    node.style.maxWidth = W + "px";
    for (let n = 0; n < 12; n++) {
      const mid = (lo + hi) / 2; node.style.fontSize = mid + "px";
      if (node.scrollWidth <= W + 1 && node.offsetHeight <= H) { best = mid; lo = mid; } else hi = mid;
    }
    node.style.fontSize = Math.floor(best) + "px";
    return Math.floor(best);
  };
  const oneLine = (node, W, H, max) => {
    node.style.fontSize = "100px"; node.style.whiteSpace = "nowrap";
    const w = node.scrollWidth || 1; const size = Math.min(max, (W / w) * 100 * 0.98, H);
    node.style.fontSize = Math.floor(size) + "px"; return Math.floor(size);
  };

  /* a picture, honestly: capped at half its pixels, thumbnail first, the
     honest rung once the pointer has stayed a beat */
  let timers = [];
  const picture = (f, W, H) => {
    const r = f.w / f.h; let w = Math.floor(Math.min(W, H * r, D.maxCss(f))); let h = Math.round(w / r);
    if (h > H) { h = Math.floor(H); w = Math.floor(h * r); }
    const box = el("div", "pic" + (f.alpha ? " alpha" : "")); box.style.width = w + "px"; box.style.height = h + "px";
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const quick = w * dpr <= 384 ? f.t384 : f.t768;
    const want = D.rung(f, w);
    if (quick && quick !== want) {
      const pv = el("img"); pv.alt = ""; pv.decoding = "async"; pv.src = encodeURI(quick); box.appendChild(pv);
      timers.push(setTimeout(() => {
        if (!box.isConnected) return;
        const im = D.img(f, w, { eager: true });
        im.addEventListener("load", () => { pv.remove(); }, { once: true });
        box.appendChild(im);
      }, 260));
    } else box.appendChild(D.img(f, w, { eager: true }));
    return box;
  };

  const V = {
    rest(main, W, H) {
      const st = DATA.statement || {};
      const wrap = el("div", "rest");
      if (DATA.practice && DATA.practice.length) wrap.appendChild(el("div", "mono prac", DATA.practice.map((p) => "<span>" + esc(p) + "</span>").join("")));
      const say = el("div", "say", esc(st.ink)); wrap.appendChild(say);
      if (st.grey) wrap.appendChild(el("p", "sent", esc(st.grey)));
      if (DATA.links) wrap.appendChild(el("div", "links", DATA.links.map((l) => '<a href="' + D.esc(l.v) + '">' + esc(l.k) + "</a>").join("")));
      main.appendChild(wrap);
      fitType(say, Math.min(W, 640), Math.max(80, H - 220), 52, 22);
    },
    pic(main, W, H, it) { main.appendChild(picture(it.f, W, H)); main.firstChild.classList.add("rise"); },
    text(main, W, H, it) {
      const say = el("div", "say", it.hl ? '<span class="g">' + hl(it.text, it.hl).replace("<mark>", '</span><span class="h">').replace("</mark>", '</span><span class="g">') + "</span>" : esc(it.text) + (it.grey ? ' <span class="g">' + esc(it.grey) + "</span>" : ""));
      if (it.label) main.appendChild(el("div", "mono g", esc(it.label))).style.margin = "0 0 14px";
      main.appendChild(say);
      const len = it.text.length + (it.grey ? it.grey.length : 0);
      fitType(say, W, (H - (it.label ? 30 : 0)) * 0.74, len < 40 ? 112 : len < 90 ? 84 : len < 160 ? 60 : 44, 18);
    },
    fig(main, W, H, it) {
      const wrap = el("div", "fig");
      const big = el("div", "big", esc(it.fig)); wrap.appendChild(big);
      let under = null;
      if (it.sent) under = el("p", "sent", hl(it.sent, it.fig));
      else if (it.label) under = el("p", "lbl", esc(it.label) + (it.sub ? ' <span class="g">' + esc(it.sub) + "</span>" : ""));
      if (under) wrap.appendChild(under);
      main.appendChild(wrap);
      const uh = under ? under.offsetHeight + 24 : 0;
      oneLine(big, W, Math.min((H - uh) * 1.05, 380), 380);
    },
    field(main, W, H, it) {
      const l = it.line;
      const wrap = el("div", "fieldv");
      wrap.appendChild(el("p", "sent", esc(l.sentence))).style.color = l.ink;
      const big = el("div", "big", esc(l.name)); big.style.marginTop = "0.12em"; wrap.appendChild(big);
      main.appendChild(wrap);
      oneLine(big, W, H * 0.6, 260);
    },
    year(main, W, H, it) {
      const ks = [...it.rel].sort((a, b) => RANK[a] - RANK[b]);
      const strip = el("div", "strip");
      const ps = ks.map(heroOf).filter(Boolean);
      const big = el("div", "big", String(it.y)); big.style.lineHeight = "0.8";
      main.appendChild(strip); main.appendChild(big);
      const size = oneLine(big, W, H * 0.5, 300);
      /* the strip: every study that year, small, on one or two rows */
      const room = H - size * 0.8 - 30;
      let th = Math.min(150, room);
      const rowW = (h) => ps.reduce((s, f) => s + Math.min(h * (f.w / f.h), D.maxCss(f)) + 10, 0);
      while (th > 40 && rowW(th) > W * (th > room / 2 ? 1 : 2)) th -= 4;
      ps.forEach((f) => { const b = picture(f, W, th); b.classList.add("rise"); b.title = D.title(f.k); strip.appendChild(b); });
    },
    about(main, W, H, it) {
      const a = it.a;
      const say = el("div", "say", esc(a.lede)); main.appendChild(say);
      const body = el("div", "body2", a.body.map((p) => "<p>" + esc(p) + "</p>").join("")); main.appendChild(body);
      body.style.maxWidth = W + "px";
      /* whole paragraphs only: on a small band the last ones wait for the study */
      while (body.children.length > 1 && body.offsetHeight > H * 0.62) body.lastElementChild.remove();
      fitType(say, W, Math.max(60, H - body.offsetHeight - 30), 60, 20);
    },
    chart(main, W, H, it) {
      const f = it.f;
      main.appendChild(el("div", "mono", esc(f.title)));
      const big = el("div", "big", esc(f.callout) + (f.suffix ? ' <span class="g">' + esc(f.suffix) + "</span>" : "")); big.style.whiteSpace = "nowrap";
      main.appendChild(big);
      const bars = el("div", "bars", f.bars.map((b) => '<div class="bar' + (it.hl && (b.value.includes(it.hl) || it.hl === f.callout) ? " hl" : "") + '"><span>' + esc(b.label) + "</span><span>" + esc(b.value) + '</span><i style="width:' + Math.max(1, b.width) + '%"></i></div>').join(""));
      main.appendChild(bars); main.style.width = W + "px";
      oneLine(big, W, H - bars.offsetHeight - 60, 220); big.style.whiteSpace = "nowrap"; big.style.marginTop = "12px";
    },
    steps(main, W, H, it) {
      const f = it.f;
      main.appendChild(el("div", "mono", esc(f.title)));
      const big = el("div", "big", esc(f.duration)); main.appendChild(big);
      const row = el("div", "steps", f.steps.map((s) => "<div>" + esc(s.title) + (s.note ? "<span>" + esc(s.note) + "</span>" : "") + "</div>").join(""));
      main.appendChild(row); main.style.width = W + "px";
      fitType(big, W, Math.max(60, H - row.offsetHeight - 50), 96, 20); big.style.marginTop = "10px";
    },
    palette(main, W, H, it) {
      const cs = it.f.colors; const sw = el("div", "swatches");
      const w = Math.floor(Math.min(W, 640) / cs.length); const h = Math.min(H, 420);
      cs.forEach((c) => {
        const d = el("div", "mono", esc(c.hex.toUpperCase()) + (c.name ? "<br>" + esc(c.name) : ""));
        d.style.cssText = "width:" + w + "px;height:" + h + "px;background:" + c.hex + ";color:" + D.ink(c.hex);
        sw.appendChild(d);
      });
      sw.classList.add("rise"); main.appendChild(sw);
    },
  };

  let cur = null; /* { o: entry, n: index in its reel } */
  let shownK = null; /* the study whose fragment is in focus */
  let lock = null;
  const layerOf = () => FOCUS.querySelector(".layer:not(.out)");
  const render = () => {
    const reel = cur ? cur.o.reel() : [];
    const it = cur && reel.length ? reel[(cur.n % reel.length + reel.length) % reel.length] : { t: "rest" };
    timers.forEach(clearTimeout); timers = [];
    const old = layerOf(); if (old) { old.classList.add("out"); setTimeout(() => old.remove(), 200); }
    const layer = el("div", "layer"); const main = el("div", "main"); const cap = el("div", "cap");
    layer.appendChild(main); layer.appendChild(cap); FOCUS.appendChild(layer);

    /* the field: a line's own colour fills the open half */
    const field = it.t === "field" ? it.line : null;
    document.body.style.setProperty("--fc", field ? field.color : "var(--paper)");
    FIELD.classList.toggle("on", !!field);
    layer.style.setProperty("--lc", field ? field.ink : "var(--ink)");

    /* the caption first, so the thing itself gets whatever height is left */
    const k = it.k && D.study(it.k) ? it.k : null;
    G.work.items.forEach((x) => x.a.classList.toggle("cur", !!cur && !!k && x.rel.has(k) && x !== cur.o));
    shownK = k;
    let left = "";
    if (k) {
      left = who(k);
      if (it.t === "pic" && it.f.alt) left += '<span class="alt">' + esc(it.f.alt) + "</span>";
    } else if (it.t === "year") left = '<span class="who">' + [...it.rel].sort((a, b) => RANK[a] - RANK[b]).map((x) => title(x)).join('<span class="g">·</span> ') + "</span>";
    let act = "";
    if (lock && cur && lock === cur.o) {
      if (reel.length > 1) act += '<span class="mono">' + ((cur.n % reel.length + reel.length) % reel.length + 1) + "/" + reel.length + "</span>";
      const href = k ? D.href(k) : cur.o.href;
      if (href && href !== "/") act += '<a href="' + D.esc(href) + '">Open</a>';
    }
    if (left || act) cap.innerHTML = '<div class="l">' + left + "</div>" + (act ? '<div class="act">' + act + "</div>" : "");
    if (it.t === "palette") { const p = it.f.colors.map((c) => '<i style="background:' + c.hex + '"></i>').join(""); const w = cap.querySelector(".who"); if (w) w.insertAdjacentHTML("beforeend", '<span class="pal">' + p + "</span>"); }

    const W = layer.clientWidth;
    const H = layer.clientHeight - (cap.innerHTML ? cap.offsetHeight + 14 : 0);
    (V[it.t] || V.rest)(main, W, Math.max(40, H), it);
    main.classList.toggle("step", !!cur && reel.length > 1);
    requestAnimationFrame(wire);
  };

  /* ── the wires ── */
  const NS = "http://www.w3.org/2000/svg";
  const wire = () => {
    WIRES.innerHTML = "";
    if (phone() || !cur) return;
    const layer = layerOf(); if (!layer) return;
    const m = layer.querySelector(".main"); if (!m) return;
    const r = m.getBoundingClientRect();
    const ax = r.left - 12, ay = r.top + Math.min(r.height / 2, Math.max(24, r.height * 0.5));
    const g = document.createElementNS(NS, "g");
    const end = (x) => { const rs = x.a.querySelector(".t") ? x.a.querySelector(".t").getClientRects() : x.a.getClientRects(); const b = rs[rs.length - 1]; return b ? [b.right + 3, b.top + b.height / 2] : null; };
    const line = (x, cls) => {
      const p = end(x); if (!p) return;
      const path = document.createElementNS(NS, "path");
      const mx = (p[0] + ax) / 2;
      path.setAttribute("d", "M" + p[0].toFixed(1) + " " + p[1].toFixed(1) + " C" + mx.toFixed(1) + " " + p[1].toFixed(1) + " " + mx.toFixed(1) + " " + ay.toFixed(1) + " " + ax.toFixed(1) + " " + ay.toFixed(1));
      if (cls) path.setAttribute("class", cls);
      g.appendChild(path);
    };
    const shown = shownK ? G.work.items.find((x) => x.rel.has(shownK) && x !== cur.o) : null;
    lit.forEach((x) => { if (x !== shown) line(x); });
    if (shown) line(shown, "me");
    line(cur.o, "me");
    const dot = document.createElementNS(NS, "circle"); dot.setAttribute("cx", ax); dot.setAttribute("cy", ay); dot.setAttribute("r", 2.2);
    g.appendChild(dot);
    WIRES.appendChild(g);
    g.querySelectorAll("path.me").forEach((pth) => { const L = pth.getTotalLength(); pth.style.strokeDasharray = L; pth.style.strokeDashoffset = L; });
    requestAnimationFrame(() => requestAnimationFrame(() => { g.classList.add("in"); g.querySelectorAll("path.me").forEach((pth) => { pth.style.strokeDashoffset = 0; }); }));
  };

  /* ── moving, locking, stepping ── */
  const show = (o, n) => {
    const same = cur && o && cur.o === o && cur.n === (n || 0);
    cur = o ? { o, n: n || 0 } : null;
    if (same) return;
    paint(o); render();
  };
  const setLock = (o) => {
    if (lock) lock.a.classList.remove("lock");
    lock = o; if (lock) lock.a.classList.add("lock");
    document.body.classList.toggle("held", !!lock);
  };
  const entryOf = (t) => { const a = t && t.closest && t.closest(".e"); return a ? ENTRIES[+a.dataset.i] : null; };
  /* hover intent: an entry takes the focus when the pointer rests on it,
     so a sweep across the columns toward the open half keeps the last
     one chosen */
  let restT = 0, intentT = 0;
  IDX.addEventListener("pointerover", (ev) => {
    if (ev.pointerType !== "mouse") return;
    const o = entryOf(ev.target);
    clearTimeout(intentT);
    if (!o) return;
    clearTimeout(restT);
    if (lock) return;
    intentT = setTimeout(() => show(o, 0), cur ? 90 : 0);
  });
  IDX.addEventListener("pointermove", (ev) => {
    /* a pointer that stops on an entry after moving fast still lands */
    if (ev.pointerType !== "mouse" || lock) return;
    const o = entryOf(ev.target); if (!o || (cur && cur.o === o)) return;
    clearTimeout(intentT); intentT = setTimeout(() => show(o, 0), 90);
  });
  IDX.addEventListener("focusin", (ev) => { const o = entryOf(ev.target); if (o && !lock && ev.target.matches(":focus-visible")) show(o, 0); });
  const goRest = () => { clearTimeout(restT); restT = setTimeout(() => { if (!lock) show(null); }, 700); };
  IDX.addEventListener("pointerleave", (ev) => { if (ev.pointerType === "mouse") { clearTimeout(intentT); goRest(); } });
  FOCUS.addEventListener("pointerenter", () => clearTimeout(restT));
  FOCUS.addEventListener("pointerleave", (ev) => { if (ev.pointerType === "mouse" && !IDX.contains(ev.relatedTarget)) goRest(); });

  IDX.addEventListener("click", (ev) => {
    const o = entryOf(ev.target); if (!o) return;
    if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button) return; /* a new tab is still a new tab */
    ev.preventDefault();
    if (lock === o) {
      const reel = o.reel(); const it = reel[(cur.n % reel.length + reel.length) % reel.length] || {};
      const href = it.k && D.study(it.k) ? D.href(it.k) : o.href;
      if (href) location.href = href;
      return;
    }
    setLock(o); cur = null; show(o, 0);
  });
  /* on glass, a sideways swipe on the focus steps it too */
  let sx = null, sy = 0, swiped = false;
  FOCUS.addEventListener("touchstart", (ev) => { const t = ev.touches[0]; sx = t.clientX; sy = t.clientY; swiped = false; }, { passive: true });
  FOCUS.addEventListener("touchend", (ev) => {
    if (sx == null || !cur) return; const t = ev.changedTouches[0]; const dx = t.clientX - sx, dy = t.clientY - sy; sx = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) { swiped = true; if (!lock) setLock(cur.o); step(dx < 0 ? 1 : -1); }
  }, { passive: true });
  FOCUS.addEventListener("click", (ev) => {
    if (swiped) { swiped = false; return; }
    if (ev.target.closest("a")) return;
    if (!cur) return;
    if (!lock) setLock(cur.o);
    step(1);
  });
  let wheelAcc = 0, wheelAt = 0;
  FOCUS.addEventListener("wheel", (ev) => {
    if (phone() || !cur) return;
    ev.preventDefault();
    const now = performance.now();
    if (now - wheelAt > 260) wheelAcc = 0;
    wheelAcc += ev.deltaY || ev.deltaX; wheelAt = now;
    if (Math.abs(wheelAcc) < 60) return;
    const d = wheelAcc > 0 ? 1 : -1; wheelAcc = -d * 400; /* one step per push */
    if (!lock) setLock(cur.o);
    step(d);
  }, { passive: false });
  const step = (d) => {
    if (!cur) return; const n = cur.o.reel().length; if (n < 2) { render(); return; }
    cur = { o: cur.o, n: (cur.n + d + n) % n }; render();
  };
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") { setLock(null); show(null); }
    else if (cur && (ev.key === "ArrowRight" || ev.key === "ArrowDown")) { ev.preventDefault(); if (!lock) setLock(cur.o); step(1); }
    else if (cur && (ev.key === "ArrowLeft" || ev.key === "ArrowUp")) { ev.preventDefault(); if (!lock) setLock(cur.o); step(-1); }
  });
  /* a click on empty paper lets go */
  document.addEventListener("click", (ev) => {
    if (!lock) return;
    if (IDX.contains(ev.target) && entryOf(ev.target)) return;
    if (FOCUS.contains(ev.target)) return;
    if (ev.target.closest && ev.target.closest("#mark")) return;
    setLock(null); show(null);
  });

  let sc = 0;
  addEventListener("scroll", () => { if (!HTML.classList.contains("scrolly")) return; cancelAnimationFrame(sc); sc = requestAnimationFrame(wire); }, { passive: true });
  let rz = 0;
  addEventListener("resize", () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(() => { fit(); render(); }); });
  const start = () => { fit(); render(); document.documentElement.classList.add("ready"); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
  window.XREF = { ENTRIES, GROUPS, FIGS, show, fit };
})();
