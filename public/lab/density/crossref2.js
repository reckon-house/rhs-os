/* ── CROSS-REFERENCE TWO: the page's own code (27 Sept 2026) ──────────
   Starts from crossref.js (left as it was, so the two can be compared)
   and keeps its index, its cross-reference and its wires. What it adds:

   - Clusters. Where an entry holds pictures, the focus sets several with
     air instead of one: the largest at its honest size, the others small,
     each captioned with its study and year. Reels step four at a time.
   - The stage. A click opens the right half at one of two depths: a
     shelf (the studies an entry touches, as an editorial page of their
     board pictures) or a room (a study composed by study-panel.js from its
     own fragments). Nothing leaves the page.
   - Flights. The picture you click is the picture that arrives: it flies
     from its tile (or the focus, or the foot of the last room) into the
     room's cover while the rest drop away, and flies back on Close.
   - Addresses. Every depth has one (#line/digital, #study/arc, ...), the
     back button steps through them, and a link opens straight onto one.
   - The index in three hierarchies (27 Sept). ?index=a, b or c, or the
     letters at its foot, sets the same entries three ways; see THE
     INDEX, IN THREE HIERARCHIES below. It scrolls in its own half now,
     its pictures load as they near the view, and a study clicked in
     Work flies from its own picture there into the room.

   Nothing here writes a sentence; every word on the page is a fragment's
   own. The words of its own are structural: Close, Next, Work, and the
   group names the index already used. */
(() => {
  const D = window.D, DATA = D.data, SP = window.StudyPanel;
  const $ = (s) => document.querySelector(s);
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  /* the house rule: no em dash reaches the page. A range keeps its
     figures with an en dash; anywhere else it becomes a middle dot */
  const clean = (s) => String(s == null ? "" : s).replace(/(\d)\s*\u2014\s*(\d)/g, "$1\u2013$2").replace(/\s*\u2014\s*/g, " \u00b7 ");
  const esc = (s) => D.esc(clean(s));
  const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const HTML = document.documentElement;
  const phone = () => HTML.classList.contains("stack");
  const IDX = $("#idx"), MARK = $("#mark"), FOCUS = $("#focus"), FIELD = $("#field"), WIRES = $("#wires"), STAGE = $("#stage");
  const EASE = "cubic-bezier(0.2, 0.7, 0.2, 1)";
  const DROP = "cubic-bezier(0.5, 0, 0.75, 0)";
  const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ratio = (f) => f.w / f.h;

  /* ── the studies, newest first ── */
  const ORDER = DATA.studies.map((s, i) => [s, i]).sort((a, b) => b[0].y - a[0].y || a[1] - b[1]).map((x) => x[0]);
  const RANK = {}; ORDER.forEach((s, i) => { RANK[s.k] = i; });
  const FIDX = new Map(); D.frags.forEach((f, i) => FIDX.set(f, i));
  const picsOf = (k) => D.byStudy(k).filter((f) => f.kind === "pic");
  const heroOf = (k) => { const p = picsOf(k); return p.find((f) => !f.alpha) || p[0] || null; };
  const byRank = (ks) => ks.filter((k) => D.study(k)).sort((a, b) => RANK[a] - RANK[b]);
  /* the board's own picture for a study, as a picture the kit can size */
  const LEADS = {};
  const leadOf = (k) => {
    if (k in LEADS) return LEADS[k];
    const s = D.study(k); const l = s && s.lead;
    LEADS[k] = l ? { id: "lead:" + k, k, lead: true, src: l.src, w: l.w, h: l.h, t384: l.t384 || null, t768: l.t768 || null, alt: D.title(k), alpha: false } : null;
    return LEADS[k];
  };
  const faceOf = (k) => leadOf(k) || heroOf(k);

  /* ── which studies a sentence of About names ── */
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
  const studyOf = (rel) => byRank([...rel])[0] || null;

  /* ── figures: every num value, and the figures inside his sentences,
     taken verbatim (the same pattern crossref.js reads them with) ── */
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
      if (/^\d+\.\d+$/.test(s)) continue;
      out.push({ s, at: m.index });
    }
    const rw = new RegExp(RW.source, "gi");
    while ((m = rw.exec(text))) {
      const n = NUMW[m[1].toLowerCase()]; const time = new RegExp("^(" + TIME + ")$", "i").test(m[2]);
      if (time || n >= 4) out.push({ s: m[0], at: m.index });
    }
    return out.sort((a, b) => a.at - b.at).map((x) => x.s);
  };
  const FIGS = new Map();
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

  /* ── services and tools, one entry per thing. The studies spell some of
     them two ways (Design System and Design Systems, Material
     Specification and Material specification, Adobe Photoshop and
     Photoshop), and the index listed each spelling as its own entry. Now
     a name in another case, in the plural, or with Adobe's name in front
     is the same entry, and a name one study lists as a service and
     another as a tool is a capability. The name shown is always one of
     his own spellings: the one the most studies use, a service's first ── */
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "x";
  const normKey = (v) => v.toLowerCase().replace(/^adobe\s+/, "").split(/\s+/).map((w) => w.replace(/ies$/, "y").replace(/([^s])s$/, "$1")).join(" ");
  const TOOLS = (() => {
    const m = new Map();
    D.byKind("tool").forEach((f) => {
      const key = normKey(f.value), svc = f.label === "Service";
      if (!m.has(key)) m.set(key, { rel: new Set(), sp: new Map(), service: false });
      const x = m.get(key); x.rel.add(f.k); if (svc) x.service = true;
      if (!x.sp.has(f.value)) x.sp.set(f.value, { ks: new Set(), svc: false, tool: false });
      const s = x.sp.get(f.value); s.ks.add(f.k); if (svc) s.svc = true; else s.tool = true;
    });
    return [...m.values()].map((x) => {
      const sp = [...x.sp.entries()];
      const pick = sp.filter(([, s]) => !x.service || s.svc).sort((a, b) => b[1].ks.size - a[1].ks.size || a[0].length - b[0].length)[0][0];
      /* the old addresses of every spelling still open this entry */
      const alias = sp.flatMap(([v, s]) => (s.svc ? ["cap/" + slug(v)] : []).concat(s.tool ? ["tool/" + slug(v)] : []));
      return { v: pick, vs: sp.map(([v]) => v), rel: x.rel, service: x.service, alias };
    }).sort((a, b) => a.v.localeCompare(b.v));
  })();
  /* a figure with no unit and no noun ("0", "2", "1.0x") says nothing in a
     list of figures; it stays in its study, and leaves the index */
  const bare = (s) => /^\d+\+?$/.test(s) || /^[\d.,–-]+x$/i.test(s);
  /* the sentences that name a tool, shorter first so the big type stays big */
  const namedIn = (v, rel) => {
    const out = [], seen = new Set();
    const tries = [v].concat(v.split(/[^A-Za-z0-9.#]+/).filter((w) => w.length >= 4 && w.toLowerCase() !== "adobe"));
    for (const name of tries) {
      const re = new RegExp("(^|[^A-Za-z0-9])" + reEsc(name) + "(?![A-Za-z])", "i");
      [...rel].forEach((k) => D.byStudy(k).forEach((f) => {
        if (seen.has(f)) return;
        if (f.kind === "line" && re.test(f.text)) { seen.add(f); out.push({ t: "text", text: f.text, hl: name, k, f }); }
        else if (f.kind === "fact" && re.test(f.value)) { seen.add(f); out.push({ t: "text", text: f.value, hl: name, label: f.label, k, f }); }
      }));
      if (out.length) break;
    }
    out.sort((a, b) => (a.label ? 1 : 0) - (b.label ? 1 : 0) || a.text.length - b.text.length);
    return out;
  };

  /* ── the reels: what an entry can put in focus, best first. Pictures
     come four at a time as a cluster ── */
  const chunk = (list, n) => { const out = []; for (let i = 0; i < list.length; i += n) out.push(list.slice(i, i + n)); return out; };
  const facesOf = (ks) => ks.map((k) => (faceOf(k) ? { f: faceOf(k), k } : null)).filter(Boolean);
  const clusters = (pics, multi) => chunk(pics, 4).map((p) => ({ t: "cluster", pics: p, multi, k: multi ? null : p[0].k }));
  const studyReel = (k) => {
    const fr = D.byStudy(k), out = [], s = D.study(k);
    const own = picsOf(k), face = faceOf(k);
    /* the board's picture large, then three of its own; the first of its
       own is usually the board's picture again, uncropped, so it waits */
    const rest = face && face.lead ? own.slice(1) : own.filter((f) => f !== face);
    const first = rest.filter((f) => !f.alpha).slice(0, 3);
    const later = rest.filter((f) => !first.includes(f));
    if (face) out.push({ t: "cluster", pics: [face].concat(first).map((f) => ({ f, k })), multi: false, k });
    else if (s && s.fact) out.push({ t: "text", text: s.fact, grey: s.rest, k });
    fr.filter((f) => f.kind === "line" && f.weight === "display").forEach((f) => out.push({ t: "text", text: f.text, k }));
    fr.filter((f) => f.kind === "num").forEach((f) => out.push({ t: "fig", fig: f.value, label: f.label, sub: f.sub, k }));
    fr.filter((f) => f.kind === "chart").forEach((f) => out.push({ t: "chart", f, hl: f.callout, k }));
    fr.filter((f) => f.kind === "steps").forEach((f) => out.push({ t: "steps", f, k }));
    fr.filter((f) => f.kind === "palette").slice(0, 1).forEach((f) => out.push({ t: "palette", f, k }));
    return out.concat(clusters(later.map((f) => ({ f, k })), false));
  };
  const lineReel = (l) => chunk(facesOf(l.studies.filter((k) => D.study(k))), 4).map((pics) => ({ t: "linefield", line: l, pics }));
  const yearReel = (y, rel) => {
    const ks = byRank([...rel]); let pics = facesOf(ks);
    /* a year with one or two rooms fills its cluster with their pictures */
    if (pics.length < 3) ks.forEach((k) => picsOf(k).slice(1).filter((f) => !f.alpha).forEach((f) => { if (pics.length < 4) pics.push({ f, k }); }));
    return chunk(pics, 4).map((p) => ({ t: "yearfield", y, rel, pics: p }));
  };
  const capReel = (v, rel) => {
    const pool = [...rel].flatMap((k) => picsOf(k));
    const hits = D.search(v, pool).filter((r) => r.score >= 3 && D.tokens(v).some((t) => new RegExp("\\b" + reEsc(t)).test((r.f.alt || "").toLowerCase())));
    const pics = hits.slice(0, 16).map((r) => ({ f: r.f, k: r.f.k }));
    const shown = new Set(pics.map((p) => p.k));
    return clusters(pics.concat(facesOf(byRank([...rel]).filter((k) => !shown.has(k)))), true);
  };
  const toolReel = (v, rel) => {
    const texts = namedIn(v, rel).slice(0, 12);
    const faces = facesOf(byRank([...rel]));
    const out = [];
    if (texts.length) out.push(Object.assign({}, texts[0], { t: "toolpics", pics: faces.slice(0, 3) }));
    return out.concat(texts.slice(1), clusters(texts.length ? faces.slice(3) : faces, true));
  };

  /* ── the index ── */
  const ENTRIES = [];
  const GROUPS = [
    { id: "work", name: "Work", mode: "list", pre: "study" },
    { id: "lines", name: "Lines", mode: "list", pre: "line" },
    { id: "about", name: "About", mode: "list", pre: "about" },
    { id: "years", name: "Years", mode: "run", pre: "year" },
    { id: "capabilities", name: "Capabilities", mode: "run", pre: "cap" },
    { id: "tools", name: "Tools", mode: "run", pre: "tool" },
    { id: "figures", name: "Figures", mode: "run", pre: "fig" },
  ];
  const G = {}; GROUPS.forEach((g) => { G[g.id] = g; g.items = []; });
  const KEYMAP = new Map(); const WORK = {};
  const add = (g, o, id) => {
    o.g = G[g]; o.i = ENTRIES.length; ENTRIES.push(o); G[g].items.push(o);
    let key = G[g].pre + "/" + id, n = 2; while (KEYMAP.has(key)) key = G[g].pre + "/" + id + "-" + n++;
    o.key = key; KEYMAP.set(key, o);
    let r = null; o.reel = () => (r = r || o.make().filter(Boolean));
    return o;
  };
  ORDER.forEach((s) => { WORK[s.k] = add("work", { label: D.title(s.k), k: s.k, rel: new Set([s.k]), make: () => studyReel(s.k) }, s.k); });
  (DATA.lines || []).forEach((l) => add("lines", { label: l.name, line: l, rel: new Set(l.studies), make: () => lineReel(l) }, l.tag));
  ABOUT.forEach(({ a, rel }) => add("about", { label: a.name, about: a, rel,
    make: () => [{ t: "about", a }].concat(clusters(facesOf(byRank([...rel])), true)) }, a.id));
  [...new Set(ORDER.map((s) => s.y))].forEach((y) => {
    const rel = new Set(ORDER.filter((s) => s.y === y).map((s) => s.k));
    add("years", { label: String(y), y, rel, make: () => yearReel(y, rel) }, String(y));
  });
  TOOLS.filter((t) => t.service).forEach(({ v, vs, rel, alias }) => add("capabilities", { label: v, v, vs, rel, alias, make: () => capReel(v, rel) }, slug(v)));
  TOOLS.filter((t) => !t.service).forEach(({ v, vs, rel, alias }) => add("tools", { label: v, v, vs, rel, alias, make: () => toolReel(v, rel) }, slug(v)));
  [...FIGS.values()].filter((g) => !bare(g.s)).sort((a, b) => a.order - b.order).forEach((g) => add("figures", { label: g.s, fig: g, rel: g.rel,
    make: () => g.src.map((x) => x.item) }, slug(g.s)));
  ENTRIES.forEach((o) => (o.alias || []).forEach((k) => { if (!KEYMAP.has(k)) KEYMAP.set(k, o); }));

  /* ════════════════════════════════════════════════════════════════════
     THE INDEX, IN THREE HIERARCHIES (27 Sept 2026). He looked at the
     index as one size of type everywhere and asked for "some visual
     hierarchy ... maybe the main lines are large in size and lead then
     maybe the font sizes scale down per section ... maybe there are some
     thumbnails worked in for projects". Three answers, switched by the
     address (?index=a, b, c) or the letters at the foot of the index:

     A  three sizes, because three read as a system and six read as
        decoration. The six lines large, each with a strip of its studies'
        board pictures at the height of its capitals; Work as a contact
        sheet, each name beside its picture; the figures bold, a wall of
        numbers, since they are the evidence with no pictures; the rest
        (About, Years, Capabilities, Tools) as a book index's fine print.
     B  his idea as he said it: the lines largest, then each section one
        step smaller in order (32, 22, 17, 14, 12, 11), Work running on
        as a paragraph with each study's picture set in the line like a
        word.
     C  pictures lead: the lines as large words in their own colours,
        Work as a true contact sheet of every board picture in one grid
        with the names small under them, the rest as fine print below.

     All three are the same entries doing the same things; only the
     setting changes. The pictures are the board's own leads at their
     smallest size, and a picture in the index lights and dims with its
     entry, so the cross-reference reads in pictures as well as words.
     ════════════════════════════════════════════════════════════════════ */
  const IXS = ["a", "b", "c"];
  let IX = (new URLSearchParams(location.search).get("index") || "a").toLowerCase();
  if (!IXS.includes(IX)) IX = "a";
  HTML.dataset.ix = IX;
  let THUMBS = [], STRIPS = [], tio = null;

  /* a study's board picture, small. It loads when it nears the view; the
     rung is chosen by the size it is drawn at under cover, never above
     half its pixels */
  const thumb = (k, cls) => {
    const f = leadOf(k); if (!f) return null;
    const s = el("span", "th" + (cls ? " " + cls : "")); s.dataset.k = k; s._f = f;
    THUMBS.push(s); return s;
  };
  const loadThumb = (s) => {
    if (s._loaded || !s.isConnected) return; s._loaded = true;
    const f = s._f, w = s.offsetWidth || 40, h = s.offsetHeight || 27;
    const drawn = Math.max(w, h * ratio(f));
    const im = el("img"); im.alt = ""; im.decoding = "async"; im.src = encodeURI(D.rung(f, drawn));
    im.addEventListener("load", () => s.classList.add("in"), { once: true });
    s.appendChild(im);
  };
  const watchThumbs = () => {
    if (tio) tio.disconnect();
    tio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { tio.unobserve(e.target); loadThumb(e.target); } }),
      { root: phone() ? null : IDX, rootMargin: "240px 0px 320px 0px" });
    THUMBS.forEach((s) => { if (!s._loaded) tio.observe(s); });
  };

  /* one entry, set for the version: mode is how its group is set */
  const entryEl = (o, mode) => {
    const a = el("a", "e"); a.href = "#" + o.key; a.dataset.i = o.i; o.a = a;
    const g = o.g.id;
    if (g === "work") {
      a.classList.add("w");
      const th = thumb(o.k, mode === "tile" ? "we" : "");
      if (th) a.appendChild(th);
      if (mode === "tile") a.appendChild(el("span", "tc", '<span class="t">' + esc(o.label) + '</span> <span class="y">' + D.year(o.k) + "</span>"));
      else if (mode === "inline") {
        /* running on as text: the picture never parts from the first word
           of its name, nor the year from the last */
        const words = clean(o.label).split(" "), first = words.shift();
        const t = el("span", "t"), hold = el("span", "hold");
        if (th) hold.appendChild(th);
        hold.appendChild(document.createTextNode(first)); t.appendChild(hold);
        if (words.length) t.appendChild(document.createTextNode(" " + words.join(" ")));
        a.replaceChildren(t, document.createTextNode("\u00a0"), el("span", "y we", String(D.year(o.k))));
      } else a.insertAdjacentHTML("beforeend", '<span class="t">' + esc(o.label) + '</span><span class="y we">' + D.year(o.k) + "</span>");
    } else if (g === "lines") {
      const l = o.line; a.style.setProperty("--c", l.color); a.style.setProperty("--ci", l.ink);
      if (mode === "row") {
        a.classList.add("ln");
        a.appendChild(el("span", "nm", '<span class="chip"></span><span class="t">' + esc(o.label) + "</span>"));
        const strip = el("span", "strip we");
        l.studies.filter((k) => D.study(k)).forEach((k) => { const th = thumb(k); if (th) { strip.appendChild(th); STRIPS.push(th); } });
        a.appendChild(strip);
      } else if (mode === "word") { a.classList.add("lw"); a.innerHTML = '<span class="t">' + esc(o.label) + "</span>"; }
      else a.innerHTML = '<span class="chip"></span><span class="t">' + esc(o.label) + "</span>";
    } else {
      a.innerHTML = '<span class="t">' + esc(o.label) + "</span>";
      if (g === "figures") a.classList.add("fig");
    }
    return a;
  };
  /* a group: its small caps head and count over its entries. "run" and
     "wall" set the entries on as text with a middle dot between */
  const section = (id, mode) => {
    const g = G[id]; if (!g.items.length) return null;
    const sec = el("section", "grp " + mode); sec.dataset.g = id;
    const h = el("h2", null, "<span>" + g.name + '</span><span class="n">' + g.items.length + "</span>");
    g.count = h.querySelector(".n"); sec.appendChild(h);
    const box = el("div", "items");
    g.items.forEach((o, j) => {
      const a = entryEl(o, mode);
      if (mode === "run" || mode === "wall") {
        if (o.label.length <= 22) a.classList.add("nw");
        const it = el("span", "it"); it.appendChild(a);
        if (j < g.items.length - 1) it.appendChild(el("span", "sep", "·"));
        box.appendChild(it); box.appendChild(document.createTextNode(" "));
      } else { box.appendChild(a); if (mode === "inline" || mode === "word") box.appendChild(document.createTextNode(" ")); }
    });
    sec.appendChild(box); return sec;
  };
  const block = (cls, kids) => { const d = el("div", cls); kids.filter(Boolean).forEach((k) => d.appendChild(k)); return d; };
  const LAYOUT = {
    a: () => [section("lines", "row"), section("work", "sheet"), section("figures", "wall"),
      block("fine", [section("about", "list"), section("years", "run"), section("capabilities", "run"), section("tools", "run")])],
    b: () => [section("lines", "inline"), section("work", "inline"), section("about", "run"), section("years", "run"),
      section("figures", "run"), section("capabilities", "run"), section("tools", "run")],
    c: () => [section("lines", "word"), section("work", "tile"),
      block("fine", [section("about", "list"), section("years", "run"), section("figures", "run"), section("capabilities", "run"), section("tools", "run")])],
  };
  const buildIndex = () => {
    THUMBS = []; STRIPS = [];
    GROUPS.forEach((g) => { g.count = null; });
    const markIn = MARK.parentNode === IDX;
    IDX.replaceChildren();
    if (markIn) IDX.appendChild(MARK);
    LAYOUT[IX]().filter(Boolean).forEach((n) => IDX.appendChild(n));
    /* the switch: three letters, nothing else */
    IDX.appendChild(el("div", "ixsw caps", IXS.map((x) => '<a href="?index=' + x + '" data-ix="' + x + '"' + (x === IX ? ' class="on" aria-current="true"' : "") + ">" + x.toUpperCase() + "</a>").join("")));
  };
  const setIndex = (x) => {
    if (x === IX || !IXS.includes(x)) return;
    IX = x; HTML.dataset.ix = x;
    const u = new URL(location.href); u.searchParams.set("index", x);
    history.replaceState(history.state, "", u.pathname + u.search + u.hash);
    buildIndex(); fit(true);
    paint(painted[0], painted[1]);
    if (locked) locked.a.classList.add("lock");
    WIRES.innerHTML = "";
    if (!staged()) requestAnimationFrame(() => wire());
  };

  /* fit: the index scrolls in its own half now, so fitting is only the
     few sizes each version measures: the strips' pictures (A) to the room
     the longest strip has, and the coloured words (C) to two lines */
  const sizeIndex = () => {
    const root = HTML.style;
    root.removeProperty("--ts"); root.removeProperty("--lw"); root.removeProperty("--gc");
    if (IX === "a") {
      const strips = [...IDX.querySelectorAll(".strip")]; if (!strips.length) return;
      const n = Math.max(...strips.map((s) => s.children.length));
      const w = strips[0].clientWidth;
      root.setProperty("--ts", Math.max(12, Math.min(phone() ? 22 : 23, Math.floor((w + 3) / n) - 3)) + "px");
    } else if (IX === "c") {
      root.setProperty("--gc", phone() ? 3 : 6);
      const box = IDX.querySelector('.grp[data-g="lines"] .items'); if (!box) return;
      const lines = phone() ? 3 : 2, max = phone() ? 46 : 64;
      let lo = 20, hi = max;
      for (let i = 0; i < 10; i++) {
        const mid = (lo + hi) / 2; root.setProperty("--lw", mid + "px");
        if (box.offsetHeight <= mid * 1.02 * lines + 2 && box.scrollWidth <= box.clientWidth + 1) lo = mid; else hi = mid;
      }
      root.setProperty("--lw", Math.floor(lo) + "px");
    }
  };
  const fit = (fresh) => {
    const was = HTML.classList.contains("stack");
    let stack = innerWidth <= 760 || Math.min(innerWidth * 0.46, 760) < 430;
    HTML.classList.remove("scrolly");
    HTML.classList.toggle("stack", stack);
    if (stack) { if (MARK.parentNode !== document.body) document.body.insertBefore(MARK, FOCUS); }
    else if (IDX.firstChild !== MARK) IDX.insertBefore(MARK, IDX.firstChild);
    sizeIndex();
    if (fresh || stack !== was || !tio) watchThumbs();
  };

  /* ── the cross-reference: what shares a study stays in ink ── */
  const meets = (a, b) => { for (const k of a) if (b.has(k)) return true; return false; };
  let lit = [], painted = [null, null];
  const paint = (rel, me) => {
    painted = [rel, me];
    document.body.classList.toggle("x", !!rel);
    lit = [];
    ENTRIES.forEach((x) => {
      const on = !!rel && (x === me || meets(x.rel, rel));
      x.a.classList.toggle("on", on); x.a.classList.toggle("me", !!me && x === me);
      if (on && x !== me) lit.push(x);
    });
    /* a line's strip lights picture by picture: only the studies in play */
    STRIPS.forEach((s) => s.classList.toggle("hit", !!rel && rel.has(s.dataset.k)));
    GROUPS.forEach((g) => {
      if (!g.count) return;
      if (!rel) { g.count.textContent = g.items.length; return; }
      const n = g.items.filter((x) => x.a.classList.contains("on")).length;
      g.count.innerHTML = "<b>" + n + "</b>/" + g.items.length;
    });
  };
  let locked = null;
  const lockEntry = (o) => { if (locked) locked.a.classList.remove("lock"); locked = o || null; if (locked) locked.a.classList.add("lock"); };

  /* ── type: Avenir Next, tracked in as it grows (his call, 27 Sept) ── */
  const track = (px) => (px >= 150 ? -0.06 : px >= 90 ? -0.055 : px >= 54 ? -0.05 : px >= 34 ? -0.042 : px >= 21 ? -0.03 : -0.012);
  const setSize = (node, px, tr) => { node.style.fontSize = px + "px"; node.style.letterSpacing = (tr != null ? tr : track(px)) + "em"; };
  /* the largest size (up to max) at which a block fits a box */
  const fitType = (node, W, H, max, min) => {
    let lo = min || 14, hi = max, best = lo;
    node.style.maxWidth = W + "px";
    for (let n = 0; n < 12; n++) {
      const mid = (lo + hi) / 2; setSize(node, mid);
      if (node.scrollWidth <= W + 1 && node.offsetHeight <= H) { best = mid; lo = mid; } else hi = mid;
    }
    setSize(node, Math.floor(best));
    return Math.floor(best);
  };
  /* one line, as large as the width and height allow */
  const oneLine = (node, W, H, max, tr) => {
    node.style.whiteSpace = "nowrap";
    let size = max;
    for (let i = 0; i < 2; i++) {
      setSize(node, 100, tr != null ? tr : track(size));
      const w = node.scrollWidth || 1; size = Math.min(max, (W / w) * 100 * 0.985, H);
    }
    setSize(node, Math.floor(size), tr); return Math.floor(size);
  };

  /* a picture, honestly: never wider than half its pixels, the thumbnail
     first, the honest rung once the pointer has stayed a beat */
  let timers = [];
  const picture = (f, w) => {
    w = Math.floor(Math.min(w, D.maxCss(f))); const h = Math.round(w / ratio(f));
    const box = el("div", "pic" + (f.alpha ? " alpha" : "")); box.style.width = w + "px"; box.style.height = h + "px";
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const quick = w * dpr <= 384 ? f.t384 : f.t768 || f.t384;
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

  /* ── a cluster: one picture large at its honest size, the others small
     in a column beside it with air, staggered, and one that does not fit
     the column set under it. Captions are the study and its year, on one
     line or two, measured ── */
  const CAPX = document.createElement("canvas").getContext("2d");
  const cluster = (pics, W, H, o) => {
    o = o || {};
    const caps = !!o.caps;
    const ch = (p, w) => {
      if (!caps) return 0;
      CAPX.font = "600 " + (phone() ? 10.5 : 11) + "px 'Avenir Next'";
      return 7 + 14 * (CAPX.measureText(D.title(p.k) + "  " + D.year(p.k)).width <= w - 2 ? 1 : 2);
    };
    const gx = Math.max(16, Math.round(W * 0.036)), gy = Math.max(14, Math.round(H * 0.035));
    const L = pics[0]; const rL = ratio(L.f);
    const smalls = pics.slice(1, 4);
    const minW = Math.min(96, W * 0.26);
    const tryPlan = (sm, share, underOne) => {
      let Lw = Math.floor(Math.min(D.maxCss(L.f), W * (sm.length ? share : 1), (H - ch(L, 9999)) * rL));
      if (Lw / rL + ch(L, Lw) > H) Lw = Math.floor((H - ch(L, Lw)) * rL);
      const Lh = Lw / rL, LH = Lh + ch(L, Lw);
      if (!sm.length) return { Lw, Lh, LH, col: [], under: [], sw: 0, uh: 0, Hc: LH };
      const cw = W - Lw - gx; if (cw < minW) return null;
      const col = underOne ? sm.slice(0, -1) : sm.slice(), under = underOne ? sm.slice(-1) : [];
      if (!col.length) return null;
      const inv = col.reduce((a2, p) => a2 + 1 / ratio(p.f), 0), n = col.length;
      const Hcol = Math.min(H, Math.max(LH, H * 0.5));
      /* the column's width, solved against its captions, which may wrap */
      let capSum = n * ch(col[0], 9999), sw = 0;
      for (let it = 0; it < 3; it++) {
        sw = Math.min(cw, W * 0.3, Math.min(...col.map((p) => D.maxCss(p.f))), (Hcol - capSum - (n - 1) * gy) / inv);
        capSum = col.reduce((a2, p) => a2 + ch(p, sw), 0);
      }
      if (sw < minW) return null;
      const colH = sw * inv + capSum + (n - 1) * gy;
      if (colH > H + 1) return null;
      const top = Math.max(LH, colH);
      let uh = 0, uc = 0;
      if (under.length) {
        const p = under[0];
        uc = ch(p, 9999);
        uh = Math.min(H - top - gy - uc, Lh * 0.42, sw / 1.05, D.maxCss(p.f) / ratio(p.f));
        uc = ch(p, uh * ratio(p.f)); uh = Math.min(uh, H - top - gy - uc);
        if (uh < 70 || uh * ratio(p.f) > Lw * 0.66) return null;
      }
      return { Lw, Lh, LH, col, under, sw, uh, uc, colH, Hc: top + (under.length ? gy + uh + uc : 0) };
    };
    /* every arrangement that fits; the one with the most pictures wins,
       then the one whose large picture is largest */
    let plan = null;
    for (const share of [0.66, 0.6, 0.54, 0.48]) {
      for (let n = smalls.length; n >= 0; n--) {
        for (const u of n >= 2 ? [false, true] : [false]) {
          const c = tryPlan(smalls.slice(0, n), share, u);
          if (!c || c.Hc > H + 1) continue;
          const score = (n + 1) * 1e7 + c.Lw * c.Lh + (u ? 2e4 : 0);
          if (!plan || score > plan.score) plan = Object.assign(c, { score });
        }
      }
    }
    if (!plan) plan = tryPlan([], 1, false);
    const { Lw, Lh, LH, col, under, sw, uh, colH } = plan;
    const flip = !!o.flip;
    const wrap = el("div", "clu");
    const colX = flip ? 0 : Lw + gx, LX = flip ? W - Lw : 0;
    const top = Math.max(LH, colH || 0);
    const Hc = Math.ceil(plan.Hc);
    const items = [];
    const place = (p, x, y, w, i) => {
      const cp = el("div", "cp"); cp.style.left = Math.round(x) + "px"; cp.style.top = Math.round(y) + "px"; cp.style.width = Math.round(w) + "px";
      const box = picture(p.f, w); cp.appendChild(box);
      if (caps) cp.appendChild(el("div", "cc", '<span class="t">' + esc(D.title(p.k)) + '</span> <span class="y">' + D.year(p.k) + "</span>"));
      cp.dataset.k = p.k; cp._f = p.f; cp._box = box; cp.dataset.i = i;
      wrap.appendChild(cp); items.push(cp);
      return cp;
    };
    /* the large one sits on the cluster's floor */
    place(L, LX, top - LH, Lw, 0);
    /* the column: its first level with the top of the large one, its last
       on the floor, the middle between; they step in and out across it */
    const cw = W - Lw - gx;
    const slack = Math.max(0, top - (colH || 0));
    let y = 0;
    col.forEach((p, i) => {
      const w = Math.min(sw, D.maxCss(p.f));
      const shift = cw - w > 24 ? (i % 2 ? cw - w : 0) : 0;
      const x = flip ? cw - w - shift : colX + shift;
      place(p, x, y, w, i + 1);
      y += w / ratio(p.f) + ch(p, sw) + gy + (col.length > 1 ? slack / (col.length - 1) : 0);
    });
    /* one under the large one, set in from its edge */
    under.forEach((p, i) => {
      const w = Math.min(uh * ratio(p.f), D.maxCss(p.f));
      const x = flip ? LX + Lw * 0.66 - w : LX + Lw * 0.34;
      place(p, Math.max(0, x), top + gy, w, col.length + 1 + i);
    });
    wrap.style.width = W + "px"; wrap.style.height = Hc + "px";
    wrap._items = items;
    return wrap;
  };

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
  const greyHl = (text, s) => '<span class="g">' + hl(text, s).replace("<mark>", '</span><span class="h">').replace("</mark>", '</span><span class="g">') + "</span>";

  /* ── the focus renderers: one thing, as large as it honestly goes ── */
  const V = {
    rest(main, W, H) {
      const st = DATA.statement || {};
      const wrap = el("div", "rest");
      if (DATA.practice && DATA.practice.length) wrap.appendChild(el("div", "caps prac", DATA.practice.map((p) => "<span>" + esc(p) + "</span>").join("")));
      /* the board's two-tone lead: his first sentence in ink, the rest in
         grey, one size and one weight */
      const say = el("div", "say", esc(st.ink) + (st.grey ? ' <span class="g">' + esc(st.grey) + "</span>" : "")); wrap.appendChild(say);
      if (DATA.links) wrap.appendChild(el("div", "links", DATA.links.map((l) => '<a href="' + D.esc(l.v) + '">' + esc(l.k) + "</a>").join("")));
      main.appendChild(wrap);
      fitType(say, Math.min(W, phone() ? W : 600), Math.max(80, H - 150), phone() ? 28 : 36, 19);
    },
    pic(main, W, H, it) { main.appendChild(picture(it.f, Math.min(W, H * ratio(it.f)))); main.firstChild.classList.add("rise"); },
    cluster(main, W, H, it) { main.appendChild(cluster(it.pics, W, H, { caps: it.multi, flip: !!cur && (cur.o.i + cur.n) % 2 === 1 })); },
    text(main, W, H, it) {
      const say = el("div", "say", it.hl ? greyHl(it.text, it.hl) : esc(it.text) + (it.grey ? ' <span class="g">' + esc(it.grey) + "</span>" : ""));
      if (it.label) main.appendChild(el("div", "caps lk", esc(it.label)));
      main.appendChild(say);
      const len = it.text.length + (it.grey ? it.grey.length : 0);
      fitType(say, W, (H - (it.label ? 30 : 0)) * 0.78, len < 40 ? 104 : len < 90 ? 78 : len < 160 ? 56 : 42, 18);
    },
    /* a tool: the studies that use it, small, over the sentence that names it */
    toolpics(main, W, H, it) {
      const top = it.pics.length ? cluster(it.pics, W, Math.min(H * 0.5, 330), { caps: true, flip: true }) : null;
      if (top) { main.appendChild(top); top.style.marginBottom = "30px"; }
      if (it.label) main.appendChild(el("div", "caps lk", esc(it.label)));
      const say = el("div", "say", greyHl(it.text, it.hl)); main.appendChild(say);
      const used = (top ? top.offsetHeight + 30 : 0) + (it.label ? 30 : 0);
      fitType(say, W, Math.max(60, (H - used) * 0.9), it.text.length < 90 ? 60 : 44, 17);
    },
    fig(main, W, H, it) {
      const wrap = el("div", "fig");
      const big = el("div", "big", esc(it.fig)); wrap.appendChild(big);
      let under = null;
      if (it.sent) under = el("p", "sent", hl(it.sent, it.fig));
      else if (it.label) under = el("p", "lbl", '<span class="caps">' + esc(it.label) + "</span>" + (it.sub ? '<span class="g">' + esc(it.sub) + "</span>" : ""));
      if (under) wrap.appendChild(under);
      main.appendChild(wrap);
      const uh = under ? under.offsetHeight + 24 : 0;
      oneLine(big, W, Math.min((H - uh) * 1.1, 420), 420, -0.06);
    },
    /* a line: four of its studies on its own colour, its sentence, its name */
    linefield(main, W, H, it) {
      const l = it.line;
      const wrap = el("div", "fieldv");
      const sent = el("p", "sent", esc(l.sentence));
      const big = el("div", "big", esc(l.name));
      wrap.appendChild(sent); wrap.appendChild(big); main.appendChild(wrap);
      oneLine(big, W, H * (phone() ? 0.22 : 0.27), 230);
      /* measured, not estimated: the cluster gets exactly what is left */
      const used = wrap.offsetHeight + 26 + 2;
      const c = cluster(it.pics, W, Math.max(80, H - used), { caps: true, flip: l.tag.length % 2 === 1 });
      wrap.insertBefore(c, sent);
    },
    yearfield(main, W, H, it) {
      const wrap = el("div", "fieldv yr");
      const big = el("div", "big", String(it.y)); big.style.lineHeight = "0.8"; big.style.fontWeight = "800"; big.style.marginTop = "0";
      wrap.appendChild(big); main.appendChild(wrap);
      oneLine(big, W, H * (phone() ? 0.26 : 0.32), 320, -0.065);
      const multi = new Set(it.pics.map((p) => p.k)).size > 1;
      const c = cluster(it.pics, W, Math.max(80, H - big.offsetHeight - 32), { caps: multi, flip: it.y % 2 === 1 });
      c.style.marginBottom = "30px";
      wrap.insertBefore(c, big);
    },
    about(main, W, H, it) {
      const a = it.a;
      const say = el("div", "say", esc(a.lede)); main.appendChild(say);
      const body = el("div", "body2", a.body.map((p) => "<p>" + esc(p) + "</p>").join("")); main.appendChild(body);
      body.style.maxWidth = W + "px";
      while (body.children.length > 1 && body.offsetHeight > H * 0.58) body.lastElementChild.remove();
      fitType(say, W, Math.max(60, H - body.offsetHeight - 30), 58, 20);
    },
    chart(main, W, H, it) {
      const f = it.f;
      main.appendChild(el("div", "caps", esc(f.title)));
      const big = el("div", "big", esc(f.callout) + (f.suffix ? ' <span class="g">' + esc(f.suffix) + "</span>" : "")); big.style.whiteSpace = "nowrap"; big.style.fontWeight = "800";
      main.appendChild(big);
      const bars = el("div", "bars", f.bars.map((b) => '<div class="bar' + (it.hl && (b.value.includes(it.hl) || it.hl === f.callout) ? " hl" : "") + '"><span>' + esc(b.label) + "</span><span>" + esc(b.value) + '</span><i style="width:' + Math.max(1, b.width) + '%"></i></div>').join(""));
      main.appendChild(bars); main.style.width = W + "px";
      oneLine(big, W, H - bars.offsetHeight - 60, 220, -0.06); big.style.marginTop = "12px";
    },
    steps(main, W, H, it) {
      const f = it.f;
      main.appendChild(el("div", "caps", esc(f.title)));
      const big = el("div", "big", esc(f.duration)); main.appendChild(big);
      const row = el("div", "steps", f.steps.map((s) => "<div>" + esc(s.title) + (s.note ? "<span>" + esc(s.note) + "</span>" : "") + "</div>").join(""));
      main.appendChild(row); main.style.width = W + "px";
      fitType(big, W, Math.max(60, H - row.offsetHeight - 50), 96, 20); big.style.marginTop = "10px";
    },
    palette(main, W, H, it) {
      const cs = it.f.colors; const sw = el("div", "swatches");
      const w = Math.floor(Math.min(W, 640) / cs.length); const h = Math.min(H, 420);
      cs.forEach((c) => {
        const d = el("div", "caps", esc(c.hex.toUpperCase()) + (c.name ? "<br>" + esc(c.name) : ""));
        d.style.cssText = "width:" + w + "px;height:" + h + "px;background:" + c.hex + ";color:" + D.ink(c.hex);
        sw.appendChild(d);
      });
      sw.classList.add("rise"); main.appendChild(sw);
    },
  };

  let cur = null; /* { o: entry, n: index in its reel } */
  let shownK = null;
  const layerOf = () => FOCUS.querySelector(".layer:not(.out)");
  const itemOf = () => {
    const reel = cur ? cur.o.reel() : [];
    return { reel, it: cur && reel.length ? reel[(cur.n % reel.length + reel.length) % reel.length] : { t: "rest" } };
  };
  const render = () => {
    const { reel, it } = itemOf();
    timers.forEach(clearTimeout); timers = [];
    const old = layerOf(); if (old) { old.classList.add("out"); setTimeout(() => old.remove(), 200); }
    const layer = el("div", "layer"); const main = el("div", "main"); const cap = el("div", "cap");
    layer.appendChild(main); layer.appendChild(cap); FOCUS.appendChild(layer);

    /* the field: a line's own colour fills the open half */
    const field = it.t === "linefield" ? it.line : null;
    document.body.style.setProperty("--fc", field ? field.color : "var(--paper)");
    FIELD.classList.toggle("on", !!field && !staged());
    layer.style.setProperty("--lc", field ? field.ink : "var(--ink)");

    /* the caption first, so the thing itself gets whatever height is left.
       A cluster of one study names it here; a cluster of several names
       each picture under itself */
    const k = it.k && D.study(it.k) ? it.k : null;
    G.work.items.forEach((x) => x.a.classList.toggle("cur", !!cur && !!k && x.rel.has(k) && x !== cur.o));
    shownK = k;
    let left = "";
    if (k) {
      left = who(k);
      const f = it.t === "pic" ? it.f : it.t === "cluster" ? it.pics[0].f : null;
      if (f && f.alt && !f.lead) left += '<span class="alt">' + esc(f.alt) + "</span>";
    }
    let act = "";
    if (cur && reel.length > 1) act = '<span class="caps">' + ((cur.n % reel.length + reel.length) % reel.length + 1) + "/" + reel.length + "</span>";
    if (left || act) cap.innerHTML = '<div class="l">' + left + "</div>" + (act ? '<div class="act">' + act + "</div>" : "");
    if (it.t === "palette") { const p = it.f.colors.map((c) => '<i style="background:' + c.hex + '"></i>').join(""); const w = cap.querySelector(".who"); if (w) w.insertAdjacentHTML("beforeend", '<span class="pal">' + p + "</span>"); }

    const W = layer.clientWidth;
    const H = layer.clientHeight - (cap.innerHTML ? cap.offsetHeight + 14 : 0);
    (V[it.t] || V.rest)(main, W, Math.max(40, H), it);
    main.classList.toggle("go", !!cur);
    requestAnimationFrame(wire);
  };

  /* ── the wires ── */
  const NS = "http://www.w3.org/2000/svg";
  /* a wire leaves an entry at the end of what it shows: a strip's last
     picture, a year after its name, a frame's edge. An entry the index
     has scrolled out of view sends none */
  const endOf = (x) => {
    const t = x.a.querySelector(".we") || x.a.querySelector(".t"); const rs = (t || x.a).getClientRects(); const b = rs[rs.length - 1];
    if (!b || !b.width) return null;
    const y = b.top + b.height / 2;
    if (!phone()) { const r = IDX.getBoundingClientRect(); if (y < r.top + 6 || y > r.bottom - 6) return null; }
    return [b.right + 3, y];
  };
  const pathD = (p, q) => { const mx = (p[0] + q[0]) / 2; return "M" + p[0].toFixed(1) + " " + p[1].toFixed(1) + " C" + mx.toFixed(1) + " " + p[1].toFixed(1) + " " + mx.toFixed(1) + " " + q[1].toFixed(1) + " " + q[0].toFixed(1) + " " + q[1].toFixed(1); };
  /* where the hairlines cross onto a coloured ground (a line's field or
     shelf), the part over it is drawn in that ground's own ink, so a wire
     stays ink on paper and white on a dark line, and takes no other colour */
  const groundNow = () => {
    if (staged()) {
      if (VIEW.v === "shelf" && SH && GROUND(SH.o)) return { x: STAGE.getBoundingClientRect().left, c: GROUND(SH.o).fg };
      return null;
    }
    if (FIELD.classList.contains("on")) { const l = cur && cur.o.line; return l ? { x: FIELD.getBoundingClientRect().left, c: l.ink } : null; }
    return null;
  };
  /* pairs: [{ x: entry, q: [x, y], me }]; dots at each end on the stage */
  const draw = (pairs, o) => {
    WIRES.innerHTML = "";
    if (phone() || !pairs.length) return null;
    const g = document.createElementNS(NS, "g");
    const gr = groundNow();
    let clipL = null, clipR = null;
    if (gr) {
      const defs = document.createElementNS(NS, "defs");
      const mk = (id, x0, x1) => { const c = document.createElementNS(NS, "clipPath"); c.setAttribute("id", id); const r = document.createElementNS(NS, "rect"); r.setAttribute("x", x0); r.setAttribute("y", -10); r.setAttribute("width", Math.max(0, x1 - x0)); r.setAttribute("height", innerHeight + 20); c.appendChild(r); defs.appendChild(c); };
      mk("wl", -10, gr.x); mk("wr", gr.x, innerWidth + 10); g.appendChild(defs); clipL = "url(#wl)"; clipR = "url(#wr)";
    }
    const dots = new Map();
    pairs.forEach(({ x, q, me }) => {
      const p = endOf(x); if (!p || !q) return;
      const d = pathD(p, q);
      const add = (clip, color) => {
        const path = document.createElementNS(NS, "path"); path.setAttribute("d", d);
        if (me) path.setAttribute("class", "me");
        if (clip) path.setAttribute("clip-path", clip);
        if (color) path.style.stroke = color;
        g.appendChild(path);
      };
      add(clipL, null);
      if (gr) add(clipR, gr.c);
      dots.set(q[0].toFixed(0) + "," + q[1].toFixed(0), q);
    });
    dots.forEach((q) => { const d = document.createElementNS(NS, "circle"); d.setAttribute("cx", q[0]); d.setAttribute("cy", q[1]); d.setAttribute("r", 2.2); if (gr && q[0] >= gr.x) d.style.fill = gr.c; g.appendChild(d); });
    WIRES.appendChild(g);
    if (o && o.live) { g.classList.add("live"); return g; }
    g.querySelectorAll("path.me").forEach((pth) => { const L = pth.getTotalLength(); pth.style.strokeDasharray = L; pth.style.strokeDashoffset = L; });
    requestAnimationFrame(() => requestAnimationFrame(() => { g.classList.add("in"); g.querySelectorAll("path.me").forEach((pth) => { pth.style.strokeDashoffset = 0; }); }));
    return g;
  };
  const wire = (live) => {
    if (staged()) return;
    if (phone() || !cur) { WIRES.innerHTML = ""; return; }
    const layer = layerOf(); if (!layer) return;
    const m = layer.querySelector(".main"); if (!m) return;
    const r = m.getBoundingClientRect();
    const q = [r.left - 12, r.top + r.height / 2];
    const shown = shownK ? G.work.items.find((x) => x.rel.has(shownK) && x !== cur.o) : null;
    const pairs = lit.filter((x) => x !== shown).map((x) => ({ x, q }));
    if (shown) pairs.push({ x: shown, q, me: true });
    pairs.push({ x: cur.o, q, me: true });
    draw(pairs, live === true ? { live: true } : null);
  };

  /* ── hover, stepping ── */
  const show = (o, n) => {
    const same = cur && o && cur.o === o && cur.n === (n || 0);
    cur = o ? { o, n: n || 0 } : null;
    if (same || staged()) return;
    paint(o ? o.rel : null, o); render();
  };
  const step = (d) => {
    if (!cur) return; const n = cur.o.reel().length; if (n < 2) return;
    cur = { o: cur.o, n: (cur.n + d + n) % n }; render();
  };
  const entryOf = (t) => { const a = t && t.closest && t.closest(".e"); return a ? ENTRIES[+a.dataset.i] : null; };

  /* ════════════════════════════════════════════════════════════════════
     THE STAGE. Three depths on the right half: rest (the focus), a shelf,
     a room. VIEW is where the page is; SH and RM are what is mounted.
     ════════════════════════════════════════════════════════════════════ */
  let VIEW = { v: "rest" };
  let SH = null; /* { key, o, layer, ks, tiles, units, io, W, visible } */
  let RM = null; /* { k, from, c, room } */
  const staged = () => document.body.classList.contains("staged");
  const setStaged = (on) => {
    document.body.classList.toggle("staged", on);
    HTML.classList.toggle("sheet", on && phone());
    if (on) { FIELD.classList.remove("on"); WIRES.innerHTML = ""; }
  };
  const keyOf = (st) => (st.v === "shelf" ? st.key : st.v === "study" ? "study/" + st.k : "");
  const parentOf = (st) => (st.v === "study" && st.from && KEYMAP.has(st.from) ? { v: "shelf", key: st.from } : { v: "rest" });
  const margin = (W) => Math.round(Math.min(44, Math.max(16, W * 0.046)));
  const rectIn = (r, box) => r.bottom > box.top + 8 && r.top < box.bottom - 8 && r.width > 0;
  const nameOf = (o) => (o.g.id === "work" ? D.title(o.k) : o.g.id === "lines" ? o.line.name : o.g.id === "about" ? o.about.name
    : o.g.id === "years" ? String(o.y) : o.g.id === "figures" ? o.fig.s : o.v);

  /* ── the flight: a picture showing its whole frame at A becomes the same
     picture cropped to B. The image is sized to cover B, clipped to B,
     and at the start scaled (evenly, so it never distorts) and clipped
     back to A. Only transform and clip-path move ── */
  const shownSrc = (box, f) => {
    const ims = [...box.querySelectorAll("img")].filter((im) => im.complete && im.naturalWidth);
    const im = ims[ims.length - 1];
    return im ? im.currentSrc || im.src : encodeURI(f.t384 || f.t768 || f.src);
  };
  const fly = (fromBox, f, toBox, opt) => {
    const A = fromBox.getBoundingClientRect(), B = toBox.getBoundingClientRect();
    if (!A.width || !B.width || still()) return null;
    const r = ratio(f);
    const full = (R) => { const w = Math.max(R.width, R.height * r), h = w / r; return { x: R.left + (R.width - w) / 2, y: R.top + (R.height - h) / 2, w, h }; };
    const FA = full(A), FB = full(B), s = FA.w / FB.w;
    const im = document.createElement("img"); im.className = "flyer"; im.alt = ""; im.decoding = "sync";
    im.src = shownSrc(fromBox, f);
    Object.assign(im.style, { left: FB.x + "px", top: FB.y + "px", width: FB.w + "px", height: FB.h + "px" });
    const inset = (R, F, sc) => [(R.top - F.y) / sc, (F.x + F.w - R.right) / sc, (F.y + F.h - R.bottom) / sc, (R.left - F.x) / sc].map((v) => Math.max(0, v).toFixed(1) + "px").join(" ");
    const k0 = { transform: "translate(" + (FA.x - FB.x).toFixed(1) + "px," + (FA.y - FB.y).toFixed(1) + "px) scale(" + s.toFixed(5) + ")", clipPath: "inset(" + inset(A, FA, s) + ")" };
    const k1 = { transform: "translate(0px,0px) scale(1)", clipPath: "inset(" + inset(B, FB, 1) + ")" };
    im.style.transform = k0.transform; im.style.clipPath = k0.clipPath;
    document.body.appendChild(im);
    const an = im.animate([k0, k1], { duration: (opt && opt.ms) || 580, easing: EASE, fill: "forwards" });
    const flight = { im, an };
    FLIGHTS.add(flight);
    return flight;
  };
  /* a new step cuts any picture still in the air: it finishes where it
     was going (its callbacks run) and the flyer goes at once */
  const FLIGHTS = new Set();
  const cutFlights = () => { FLIGHTS.forEach((f) => { f.cut = true; f.an.cancel(); }); };
  /* the flyer stays until the picture under it has loaded, then goes */
  const land = (flight, box, after) => {
    if (!flight) { if (after) after(); return; }
    const gone = () => { FLIGHTS.delete(flight); flight.im.remove(); };
    flight.an.finished.then(() => {
      if (after) after();
      const t0 = performance.now();
      const done = () => {
        if (flight.cut) { gone(); return; }
        const ok = !box || !box.isConnected || box.classList.contains("in") || [...box.querySelectorAll("img")].some((im) => im.complete && im.naturalWidth && im.style.opacity !== "0");
        if (!ok && performance.now() - t0 < 1400) { requestAnimationFrame(done); return; }
        flight.im.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: "ease", fill: "forwards" }).finished.then(gone, gone);
      };
      requestAnimationFrame(done);
    }, () => { if (after) after(); gone(); });
  };

  /* ── a shelf ── */
  const GROUND = (o) => (o.g.id === "lines" ? { bg: o.line.color, fg: o.line.ink } : o.g.id === "figures" ? { bg: "#000", fg: "#fff" } : null);
  const shelfStudies = (o) => (o.g.id === "lines" ? o.line.studies.filter((k) => D.study(k)) : byRank([...o.rel]));
  const shelfLead = (o) => {
    if (o.g.id === "lines") return esc(o.line.sentence);
    if (o.g.id === "about") return esc(o.about.lede) + (o.about.body[0] ? ' <span class="g">' + esc(o.about.body[0]) + "</span>" : "");
    if (o.g.id === "tools") { const t = namedIn(o.v, o.rel).find((x) => !x.label); return t ? greyHl(t.text, t.hl).replace('class="h"', "") : null; }
    if (o.g.id === "figures") {
      const src = o.fig.src[0]; if (!src) return null; const it = src.item;
      if (it.sent) return greyHl(it.sent, o.fig.s);
      if (it.label) return esc(it.label) + (it.sub ? ' <span class="g">' + esc(it.sub) + "</span>" : "");
    }
    return null;
  };
  /* the rows: a feature first, then pairs at one height, uneven pairs, a
     row of three, and a picture set to one side with its lead beside it,
     so the page changes pace. Every picture at or under half its pixels */
  const PLAN = ["P2u", "O", "P3", "P2", "O", "P2u", "P3"];
  const NEED = { P2u: 2, O: 1, P3: 3, P2: 2 };
  const plan = (n) => {
    const rows = n ? ["F"] : []; let left = n - 1, i = 0;
    while (left > 0) {
      let p = PLAN[i++ % PLAN.length];
      if (NEED[p] > left) p = left === 1 ? "O" : left === 2 ? "P2" : "P3";
      rows.push(p); left -= NEED[p];
    }
    return rows;
  };
  const buildShelf = (o) => {
    const gr = GROUND(o);
    const layer = el("div", "shelf" + (gr ? "" : " paper") + (gr && /^#f/i.test(gr.fg) ? " inv" : ""));
    layer.dataset.key = o.key;
    if (gr) { layer.style.setProperty("--bg", gr.bg); layer.style.setProperty("--fg", gr.fg); }
    STAGE.appendChild(layer);
    const S = { key: o.key, o, layer, ks: shelfStudies(o), tiles: [], units: [], io: null, W: 0, visible: true };
    layoutShelf(S);
    layer.addEventListener("click", (ev) => shelfClick(S, ev));
    layer.addEventListener("pointerover", (ev) => { if (ev.pointerType === "mouse") tileOver(S, ev.target.closest(".tu")); });
    layer.addEventListener("pointerleave", () => tileOver(S, null));
    let sc = 0;
    layer.addEventListener("scroll", () => {
      cancelAnimationFrame(sc); sc = requestAnimationFrame(() => {
        layer.classList.toggle("past", layer.scrollTop > (S.nameEl ? S.nameEl.offsetTop + S.nameEl.offsetHeight - 40 : 120));
        /* a scroll still gliding when a tile is clicked lands after the room
           has opened; its wires belong to the shelf, so they are drawn only
           while the shelf is the page (27 Sept review) */
        if (VIEW.v !== "shelf" || SH !== S) return;
        if (S.hovTile) wireTile(S, S.hovTile); else if (hov) wireShelf(S, hov);
      });
    }, { passive: true });
    return S;
  };
  const layoutShelf = (S) => {
    const o = S.o, layer = S.layer;
    const W = layer.clientWidth || STAGE.clientWidth, V = layer.clientHeight || innerHeight;
    const m = phone() ? 18 : margin(W), C = W - 2 * m, g = Math.max(10, Math.round(W * 0.016));
    S.W = W; layer.style.setProperty("--m", m + "px");
    if (S.io) S.io.disconnect();
    S.tiles = []; S.units = [];
    const frag = document.createDocumentFragment();
    const bar = el("div", "sh-bar", '<span class="sh-bar-t">' + esc(nameOf(o)) + "</span>");
    const x = el("button", "sh-x", "Close"); x.type = "button"; x.addEventListener("click", (ev) => { ev.stopPropagation(); closeTo({ v: "rest" }); });
    bar.appendChild(x); frag.appendChild(bar);

    const head = el("header", "sh-head");
    head.appendChild(el("div", "sh-kick caps", "<span>" + esc(o.g.name) + "</span><span>Work<b>" + S.ks.length + "</b></span>"));
    const nm = el("h2", "sh-name" + (o.g.id === "years" || o.g.id === "figures" ? " num" : ""), esc(nameOf(o)));
    head.appendChild(nm); S.nameEl = nm;
    const ld = shelfLead(o); if (ld) head.appendChild(el("p", "sh-lead", ld));
    frag.appendChild(head); S.units.push(head);

    const grid = el("div", "sh-grid");
    const wide = C >= 520;
    const L = (k) => leadOf(k) || heroOf(k);
    const tile = (k, w, cls, noCap) => {
      const f = L(k); w = Math.floor(Math.min(w, D.maxCss(f))); const h = Math.round(w / ratio(f));
      const box = el("div", "tpic"); box.style.width = w + "px"; box.style.height = h + "px"; box._f = f;
      const cap = noCap ? null : el("div", "tcap", '<span class="t">' + esc(D.title(k)) + '</span> <span class="y">' + D.year(k) + "</span>");
      const t = { k, box, f, w, h };
      S.tiles.push(t);
      return { t, box, cap, w, h };
    };
    const unit = (k, cls) => { const a = el("a", "tu" + (cls ? " " + cls : "")); a.href = "#study/" + k; a.dataset.k = k; S.units.push(a); return a; };
    const txt = (k) => {
      const s = D.study(k);
      const d = el("div", "sh-txt");
      d.appendChild(el("div", "sh-kk", '<span class="t">' + esc(D.title(k)) + '</span> <span class="y">' + s.y + '</span><span class="d">' + esc(s.s) + "</span>"));
      if (s.fact) d.appendChild(el("p", "sh-tt", esc(s.fact) + (s.rest ? ' <span class="g">' + esc(s.rest) + "</span>" : "")));
      return d;
    };
    let side = 0;
    /* a single picture with its study's lead: under it when the picture is
       wide and fills the column, beside it when it leaves a column free */
    const feature = (k, mode) => {
      const f = L(k), r = ratio(f);
      const row = el("div", "sh-row");
      let w, beside;
      if (mode === "F" && r >= 1.15) {
        /* the first, if it is wide, as large as its pixels allow: edge to
           edge when they fill the stage, its lead under it */
        w = Math.min(D.maxCss(f), W, V * 0.74 * r); if (w < W - 1) w = Math.min(w, C);
        beside = false;
      } else {
        w = Math.min(D.maxCss(f), C * (mode === "F" ? 0.58 : wide ? 0.5 : 0.72), V * (mode === "F" ? 0.74 : 0.62) * r);
        beside = wide && C - w >= 230;
      }
      const T = tile(k, w, null, true);
      const a = unit(k, "feat" + (beside ? (side++ % 2 ? " rev" : "") : " under"));
      a.appendChild(T.box); a.appendChild(txt(k));
      /* a wide picture that can fill the stage runs edge to edge */
      if (!beside && T.w >= W - 1) { row.classList.add("bleed"); a.querySelector(".sh-txt").style.margin = "18px " + m + "px 0"; }
      else if (!beside) a.style.width = Math.max(T.w, Math.min(C, 560)) + "px";
      row.appendChild(a); T.t.a = a;
      return row;
    };
    /* pictures side by side at one height, as tall as honesty allows */
    const atOneHeight = (ks, maxH) => {
      const fs = ks.map(L); const R = fs.reduce((s, f) => s + ratio(f), 0);
      let h = (C - g * (ks.length - 1)) / R;
      h = Math.min(h, maxH, ...fs.map((f) => D.maxCss(f) / ratio(f)));
      return fs.map((f) => Math.floor(h * ratio(f)));
    };
    const rowOf = (ks, ws, just, align) => {
      const row = el("div", "sh-row"); row.style.justifyContent = just || "flex-start"; row.style.alignItems = align || "flex-end";
      if (just === "flex-start" || just === "flex-end") row.style.gap = g + "px";
      ks.forEach((k, i) => { const T = tile(k, ws[i]); const a = unit(k); a.style.width = T.w + "px"; a.appendChild(T.box); a.appendChild(T.cap); row.appendChild(a); T.t.a = a; });
      return row;
    };
    const rows = plan(S.ks.length); let at = 0, flip = 0;
    rows.forEach((p) => {
      const n = p === "F" ? 1 : NEED[p]; const ks = S.ks.slice(at, at + n); at += n;
      if (p === "F") { grid.appendChild(feature(ks[0], "F")); return; }
      if (p === "O") { grid.appendChild(feature(ks[0], "O")); return; }
      if (p === "P2" || p === "P3") {
        const ws = atOneHeight(ks, V * (p === "P3" ? 0.42 : 0.56));
        const sum = ws.reduce((a, b) => a + b, 0) + g * (ws.length - 1);
        grid.appendChild(rowOf(ks, ws, sum >= C - 2 ? "space-between" : flip++ % 2 ? "flex-end" : "flex-start"));
        return;
      }
      /* an uneven pair: one large, one small, set to opposite edges */
      const big = flip % 2 ? 1 : 0;
      const ws = ks.map((k, i) => { const f = L(k); return Math.min(D.maxCss(f), (i === big ? (wide ? 0.6 : 0.62) : wide ? 0.3 : 0.34) * C, (i === big ? V * 0.6 : V * 0.36) * ratio(f)); });
      flip++;
      grid.appendChild(rowOf(ks, ws, "space-between", big ? "flex-start" : "flex-end"));
    });
    frag.appendChild(grid);

    /* the foot: the next entry of the same kind, so a shelf never ends in a wall */
    const items = o.g.items; const nx = items[(items.indexOf(o) + 1) % items.length];
    if (nx && nx !== o) {
      const foot = el("footer", "sh-foot");
      const a = el("a", "sh-next"); a.href = "#" + nx.key; a.dataset.key = nx.key;
      a.appendChild(el("span", "caps", "Next"));
      a.appendChild(el("span", "sh-next-t", (nx.line ? '<i class="chip" style="--c:' + nx.line.color + '"></i>' : "") + esc(nameOf(nx))));
      foot.appendChild(a); frag.appendChild(foot); S.units.push(foot);
    }
    layer.replaceChildren(frag);

    /* the name: as large as it goes on one line, or two when it is long */
    const nmax = o.g.id === "years" ? Math.min(260, V * 0.3) : o.g.id === "figures" ? Math.min(230, V * 0.28) : Math.min(170, V * 0.22);
    if (o.g.id === "years" || o.g.id === "figures") oneLine(nm, C, nmax, nmax, o.g.id === "years" ? -0.065 : -0.06);
    else { nm.style.whiteSpace = "nowrap"; const one = oneLine(nm, C, nmax, nmax); if (one < 64) { nm.style.whiteSpace = ""; fitType(nm, C, 2 * Math.min(100, nmax) * 0.95, Math.min(100, nmax), 34); } }

    /* pictures load as they near the view, the thumbnail first */
    S.io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { S.io.unobserve(e.target); loadTile(e.target); } }),
      { root: layer, rootMargin: "40% 0px 60% 0px" });
    S.tiles.forEach((t) => S.io.observe(t.box));
  };
  const loadTile = (box) => {
    const f = box._f; if (!f || box._loaded) return; box._loaded = true;
    const w = box.offsetWidth || 300; const want = D.rung(f, w);
    const quick = f.t384 && f.t384 !== want ? f.t384 : null;
    let pv = null;
    if (quick) { pv = el("img"); pv.alt = ""; pv.decoding = "async"; pv.src = encodeURI(quick); pv.addEventListener("load", () => box.classList.add("in"), { once: true }); box.appendChild(pv); }
    const im = D.img(f, w, { eager: true });
    im.addEventListener("load", () => { box.classList.add("in"); if (pv) setTimeout(() => pv.remove(), 400); }, { once: true });
    box.appendChild(im);
  };
  const unitsInView = (S) => { const box = S.layer.getBoundingClientRect(); return S.units.filter((u) => rectIn(u.getBoundingClientRect(), box)); };
  const shelfIn = (S, delay, skip) => {
    const us = unitsInView(S);
    us.forEach((u, i) => {
      if (u._an) u._an.cancel();
      if (still()) return;
      u._an = u.animate([{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "none" }],
        { duration: 540, delay: (delay || 0) + i * 45, easing: EASE, fill: "backwards" });
    });
    S.units.forEach((u) => { if (!us.includes(u) && u._an) { u._an.cancel(); u._an = null; } });
    if (skip) skip.style.visibility = "hidden";
  };
  const shelfOut = (S, keep) => {
    const us = unitsInView(S);
    us.forEach((u, i) => {
      if (u._an) u._an.cancel();
      const kept = keep && u.contains(keep);
      if (kept) { keep.style.visibility = "hidden"; [...u.children].filter((c) => c !== keep).forEach((c) => c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "forwards" })); u._kept = true; return; }
      u._an = u.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(28px)" }],
        { duration: 340, delay: i * 26, easing: DROP, fill: "forwards" });
    });
  };
  const shelfReset = (S) => {
    S.units.forEach((u) => { if (u._an) { u._an.cancel(); u._an = null; } if (u._kept) { [...u.children].forEach((c) => c.getAnimations().forEach((a) => a.cancel())); u._kept = false; } });
    S.tiles.forEach((t) => { t.box.style.visibility = ""; });
  };

  /* hovering in a shelf: a picture lights what its study holds, wired to
     it; an entry keeps the studies it touches, wired to them */
  const anchorOf = (box, clampTo) => {
    const r = box.getBoundingClientRect(), s = (clampTo || STAGE).getBoundingClientRect();
    const top = s.top + 50; /* below the shelf's bar */
    const y = Math.max(top, Math.min(s.bottom - 10, (Math.max(r.top, top) + Math.min(r.bottom, s.bottom)) / 2));
    return [Math.max(s.left + 2, r.left - 7), y];
  };
  const wireTile = (S, u) => {
    const k = u.dataset.k; const box = u.querySelector(".tpic"); if (!box) return;
    const q = anchorOf(box, S.layer);
    const me = WORK[k];
    draw(lit.filter((x) => x !== me).map((x) => ({ x, q })).concat(me ? [{ x: me, q, me: true }] : []), { live: true });
  };
  const tileOver = (S, u) => {
    if (VIEW.v !== "shelf" || SH !== S) return;
    if (u === S.hovTile) return;
    S.hovTile = u || null;
    if (!u) { stageNeutral(); return; }
    const k = u.dataset.k;
    paint(new Set([k]), WORK[k]);
    wireTile(S, u);
  };
  const wireShelf = (S, o) => {
    const box = S.layer.getBoundingClientRect();
    const pairs = S.tiles.filter((t) => o.rel.has(t.k) && rectIn(t.box.getBoundingClientRect(), box)).map((t) => ({ x: o, q: anchorOf(t.box, S.layer), me: true }));
    draw(pairs, { live: true });
  };
  const shelfClick = (S, ev) => {
    const nx = ev.target.closest(".sh-next");
    if (nx) { if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button) return; ev.preventDefault(); go({ v: "shelf", key: nx.dataset.key }, { push: true }); return; }
    const u = ev.target.closest(".tu"); if (!u) return;
    if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button) return;
    ev.preventDefault();
    go({ v: "study", k: u.dataset.k, from: S.key }, { push: true });
  };

  /* open a shelf over whatever the stage holds */
  const openShelf = (o) => {
    const old = SH, oldRoom = RM, was = staged();
    const S = buildShelf(o); SH = S; RM = null;
    setStaged(true); lockEntry(o); cur = null;
    paint(o.rel, o);
    const rise = !still() && !(phone() && !was);
    if (rise) S.layer.animate([{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 560, easing: EASE });
    shelfIn(S, rise ? 160 : phone() && !was ? 220 : 60);
    setTimeout(() => {
      if (old && old !== SH) { if (old.io) old.io.disconnect(); old.layer.remove(); }
      if (oldRoom) { oldRoom.room.destroy(); oldRoom.c.remove(); }
    }, rise ? 580 : 520);
  };
  /* a shelf held behind a room, for Close to return to */
  const holdShelf = (o) => {
    if (SH && SH.key === o.key) return;
    if (SH) { if (SH.io) SH.io.disconnect(); SH.layer.remove(); }
    SH = buildShelf(o); SH.visible = false; SH.layer.style.visibility = "hidden";
  };

  /* ── a room ── */
  const orderFor = (k, from) => {
    const o = from && KEYMAP.get(from);
    const ks = o ? shelfStudies(o) : [];
    return ks.length > 1 && ks.includes(k) ? ks : ORDER.map((s) => s.k);
  };
  const focusFace = (k) => {
    if (staged()) return null;
    const cp = [...FOCUS.querySelectorAll(".layer:not(.out) .cp")].find((c) => c.dataset.k === k && c._f && c._f.lead);
    return cp ? { box: cp._box, f: cp._f, target: "cover" } : null;
  };
  let revealT = 0;
  const openRoom = (k, from, how) => {
    how = how || {};
    const prev = RM, was = staged();
    if (prev) prev.c.style.pointerEvents = "none";
    const c = el("div", "roomc"); c.style.visibility = "hidden"; STAGE.appendChild(c);
    const order = orderFor(k, from), i = order.indexOf(k);
    const nk = order.length > 1 ? order[(i + 1) % order.length] : null;
    const room = SP.render(c, k, {
      next: nk ? { k: nk, t: D.title(nk) } : null,
      onNext: (x) => go({ v: "study", k: x, from }, { push: true, via: "next" }),
      onClose: () => closeTo(parentOf(VIEW)),
    });
    RM = { k, from, c, room };
    c.addEventListener("scroll", () => { if (LW) { cancelAnimationFrame(LW.raf); LW.raf = requestAnimationFrame(drawLive); } }, { passive: true });

    /* where the picture flies from: what was clicked, else the foot of the
       last room, else the study's tile on the shelf, else the focus */
    let src = how.src || null;
    if (!src && how.via === "next" && prev) {
      const np = prev.room.el.querySelector(".sp-next-pic");
      if (np && rectIn(np.getBoundingClientRect(), prev.c.getBoundingClientRect())) src = { box: np, f: leadOf(k), target: "cover" };
    }
    let tileT = null;
    if (!src && SH && SH.visible && !prev) {
      tileT = SH.tiles.find((t) => t.k === k);
      if (tileT && rectIn(tileT.box.getBoundingClientRect(), SH.layer.getBoundingClientRect())) src = { box: tileT.box, f: tileT.f, target: "cover" };
      else tileT = null;
    }
    if (!src && !was) src = focusFace(k);
    if (src && phone() && !was) src = null; /* the sheet is still rising */
    /* where it lands: the cover, or the picture itself inside the room */
    let to = room.cover;
    if (src && src.target && src.target !== "cover") {
      if (room.scrollTo(src.target)) to = room.find(src.target) || room.cover;
    }
    if (src && !to) src = null;

    setStaged(true); cur = null;
    lockEntry(WORK[k]); paintRoom();
    const flight = src && !still() ? fly(src.box, src.f, to) : null;
    const reveal = () => {
      clearTimeout(revealT);
      c.style.visibility = "";
      if (SH && SH.visible && RM && RM.c === c) { SH.visible = false; SH.layer.style.visibility = "hidden"; }
      if (prev) { prev.room.destroy(); prev.c.remove(); }
    };
    if (flight) {
      /* the room comes up on paper behind the picture in flight; its own
         cover waits under the flyer until the flyer lands on it */
      const restore = src.box;
      restore.style.visibility = "hidden"; to.style.visibility = "hidden";
      c.style.visibility = "";
      c.animate([{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 520, delay: 40, easing: EASE, fill: "backwards" });
      room.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, delay: 330, easing: "ease", fill: "backwards" });
      if (SH && SH.visible && tileT) shelfOut(SH, tileT.box);
      if (prev) prev.c.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-24px)" }], { duration: 320, easing: DROP, fill: "forwards" });
      land(flight, to, () => { to.style.visibility = ""; restore.style.visibility = ""; reveal(); });
    } else {
      c.style.visibility = "";
      if (!was && phone()) { reveal(); return; }
      if (!still()) c.animate([{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 560, easing: EASE });
      if (prev) prev.c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" });
      if (SH && SH.visible) shelfOut(SH, null);
      revealT = setTimeout(reveal, still() ? 0 : 560);
    }
  };
  /* back from a room to the shelf it came from: the cover flies home and
     the other pictures rise again */
  const backToShelf = () => {
    const S = SH, R = RM; RM = null;
    R.c.style.pointerEvents = "none";
    S.layer.style.visibility = ""; S.visible = true;
    shelfReset(S);
    const t = S.tiles.find((x) => x.k === R.k);
    if (t) {
      /* bring its picture home into view, most of it, before it flies there */
      const lb = S.layer.getBoundingClientRect(), tb = t.box.getBoundingClientRect();
      const seen = Math.min(tb.bottom, lb.bottom) - Math.max(tb.top, lb.top);
      if (seen < Math.min(tb.height, lb.height) * 0.8) S.layer.scrollTop += tb.top - lb.top - Math.max(48, (lb.height - tb.height) / 2);
    }
    lockEntry(S.o); paint(S.o.rel, S.o); clearLive();
    const cover = R.room.cover;
    const flight = t && cover && rectIn(cover.getBoundingClientRect(), R.c.getBoundingClientRect()) ? fly(cover, t.f, t.box, { ms: 540 }) : null;
    if (flight) { t.box.style.visibility = "hidden"; cover.style.visibility = "hidden"; land(flight, null, () => { t.box.style.visibility = ""; }); }
    shelfIn(S, 200, null);
    if (flight) t.box.style.visibility = "hidden";
    /* the room's words go first, then its paper lowers off the shelf */
    R.room.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: still() ? 0 : 180, easing: "ease", fill: "forwards" });
    const lower = still() ? R.c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 0, fill: "forwards" })
      : R.c.animate([{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(100% 0 0 0)" }], { duration: 480, delay: 90, easing: "cubic-bezier(0.4, 0, 0.6, 1)", fill: "forwards" });
    lower.finished.then(() => { R.room.destroy(); R.c.remove(); });
  };
  /* all the way back to rest */
  const closeStage = () => {
    const S = SH, R = RM; SH = null; RM = null;
    lockEntry(null); clearLive(); cur = null;
    const was = staged();
    setStaged(false);
    paint(null); render();
    if (!was) return;
    const drop = (node, then) => {
      if (still() || phone()) { setTimeout(then, phone() ? 520 : 0); return; }
      node.animate([{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(100% 0 0 0)" }], { duration: 460, easing: "cubic-bezier(0.4, 0, 0.6, 1)", fill: "forwards" }).finished.then(then);
    };
    if (R) { R.c.style.pointerEvents = "none"; drop(R.c, () => { R.room.destroy(); R.c.remove(); }); }
    if (S) { if (S.io) S.io.disconnect(); if (S.visible) drop(S.layer, () => S.layer.remove()); else S.layer.remove(); }
  };

  /* the index as the room's spec sheet */
  const paintRoom = () => { if (!RM) return; paint(new Set([RM.k]), null); };
  /* where an entry sits inside the room: the fragment it came from */
  const roomTargets = (o, k) => {
    const R = RM.room;
    const byF = (fs) => fs.sort((a, b) => FIDX.get(a) - FIDX.get(b)).map((f) => R.find(f.id)).filter(Boolean);
    switch (o.g.id) {
      case "work": return [R.cover || R.el.querySelector(".sp-title")].filter(Boolean);
      case "lines": return [...R.el.querySelectorAll(".sp-line")].filter((e) => e.textContent.trim() === o.line.name);
      case "years": { const kk = R.el.querySelector(".sp-meta .sp-kk .y") || R.el.querySelector(".sp-kk .y"); return kk ? [kk] : []; }
      case "capabilities": case "tools": {
        /* every spelling the entry stands for */
        const vs = (o.vs || [o.v]).map((v) => v.toLowerCase());
        const re = new RegExp("(^|[^A-Za-z0-9])(" + (o.vs || [o.v]).map(reEsc).join("|") + ")(?![A-Za-z])", "i");
        return byF(D.byStudy(k).filter((f) => (f.kind === "tool" && vs.includes(f.value.toLowerCase())) || (f.kind === "line" && re.test(f.text)) || (f.kind === "fact" && re.test(f.value))));
      }
      case "figures": return byF(o.fig.src.map((x) => x.f).filter((f, i, a) => f.k === k && a.indexOf(f) === i));
      default: return [];
    }
  };
  let manual = [];
  const markEls = (els) => {
    manual.forEach((e) => e.classList.remove("sp-on")); manual = [];
    if (!RM) return;
    const ids = [];
    els.forEach((e) => { if (e.dataset && e.dataset.f) ids.push(e.dataset.f); else { e.classList.add("sp-on"); manual.push(e); } });
    RM.room.mark(ids);
  };
  /* a long way is a cut to just short of it and a short glide in, so the
     room never scrolls past a whole study to reach one line */
  const scrollToEl = (e) => {
    const c = RM.c;
    const top = e === RM.room.cover ? 0 : Math.max(0, e.getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop - Math.round(c.clientHeight * 0.2));
    const d = top - c.scrollTop, near = c.clientHeight * 0.5;
    if (Math.abs(d) > c.clientHeight * 1.4) c.scrollTop = top - Math.sign(d) * near;
    c.scrollTo({ top, behavior: still() ? "auto" : "smooth" });
  };
  /* one live hairline, from an entry to the fragment it points at, kept
     on it while the room scrolls */
  let LW = null;
  const drawLive = () => {
    if (!LW || !RM) return;
    const e = LW.t; const rs = [...e.getClientRects()]; const r = rs.find((x) => x.width > 4) || e.getBoundingClientRect();
    const s = RM.c.getBoundingClientRect();
    const pic = e.classList.contains("sp-pic") || e.classList.contains("sp-pal");
    const y = Math.max(s.top + 10, Math.min(s.bottom - 10, r.top + (pic ? Math.min(r.height / 2, 40) : r.height / 2)));
    const x = Math.max(s.left + 3, r.left - 7);
    draw([{ x: LW.o, q: [x, y], me: true }], { live: true });
  };
  const clearLive = () => { LW = null; WIRES.innerHTML = ""; };
  const pointAt = (o) => {
    const k = RM.k;
    if (!o.rel.has(k)) { paintRoom(); clearLive(); return; }
    paint(new Set([k]), o);
    const ts = roomTargets(o, k);
    if (!ts.length) { clearLive(); markEls([]); return; }
    markEls(ts); scrollToEl(ts[0]);
    LW = { o, t: ts[0], raf: 0 }; drawLive();
  };

  /* hover while the stage is open */
  let hov = null;
  const stageHover = (o) => {
    hov = o;
    if (VIEW.v === "shelf" && SH) {
      SH.hovTile = null;
      paint(o.rel, o);
      SH.layer.classList.add("dim");
      SH.tiles.forEach((t) => t.a && t.a.classList.toggle("hit", o.rel.has(t.k)));
      wireShelf(SH, o);
    } else if (VIEW.v === "study" && RM) pointAt(o);
  };
  const stageNeutral = () => {
    hov = null;
    if (VIEW.v === "shelf" && SH) { SH.layer.classList.remove("dim"); paint(SH.o.rel, SH.o); WIRES.innerHTML = ""; }
    else if (VIEW.v === "study" && RM) { paintRoom(); LW = null; WIRES.innerHTML = ""; }
  };

  /* ── addresses: one per depth, and the back button steps through them ── */
  const parse = (h) => {
    const s = decodeURIComponent(String(h || "").replace(/^#/, ""));
    if (!s) return { v: "rest" };
    if (s.startsWith("study/")) { const k = s.slice(6); return D.study(k) ? { v: "study", k, from: null } : { v: "rest" }; }
    /* an old address (a spelling since merged) opens the entry it joined */
    return KEYMAP.has(s) ? { v: "shelf", key: KEYMAP.get(s).key } : { v: "rest" };
  };
  const apply = (st, how) => {
    how = how || {};
    cutFlights();
    VIEW = st; hov = null;
    if (st.v === "rest") { closeStage(); return; }
    if (st.v === "shelf") {
      const o = KEYMAP.get(st.key);
      if (!o) { VIEW = { v: "rest" }; closeStage(); return; }
      if (RM && SH && SH.key === st.key) { backToShelf(); return; }
      if (SH && SH.key === st.key && SH.visible) return;
      openShelf(o);
      return;
    }
    if (RM && RM.k === st.k) { RM.from = st.from; return; }
    if (st.from && KEYMAP.has(st.from)) holdShelf(KEYMAP.get(st.from));
    else if (SH && !RM) { /* a room opened from a shelf it does not belong to keeps no shelf behind it */ }
    openRoom(st.k, st.from && KEYMAP.has(st.from) ? st.from : null, how);
  };
  const go = (st, how) => {
    how = how || {};
    if (how.push) {
      const h = keyOf(st);
      history.pushState({ v: st.v, key: st.key || null, k: st.k || null, from: st.from || null, back: keyOf(VIEW) }, "", h ? "#" + h : location.pathname + location.search);
    }
    apply(st, how);
  };
  /* Close goes back one depth: through history when that is where we came
     from, otherwise as a new step */
  const closeTo = (target) => {
    const s = history.state;
    if (s && s.back === keyOf(target)) history.back(); else go(target, { push: true });
  };
  addEventListener("popstate", (ev) => {
    const s = ev.state;
    const st = s && s.v ? (s.v === "study" ? { v: "study", k: s.k, from: s.from } : s.v === "shelf" ? { v: "shelf", key: s.key } : { v: "rest" }) : parse(location.hash);
    apply(st, {});
  });

  /* what a click on an entry opens */
  const open = (o, how) => {
    if (o.g.id === "work") {
      if (VIEW.v === "study" && RM && RM.k === o.k) return;
      const from = VIEW.v === "shelf" ? VIEW.key : VIEW.v === "study" ? VIEW.from : null;
      go({ v: "study", k: o.k, from }, Object.assign({ push: true }, how || {}));
      return;
    }
    if (VIEW.v === "shelf" && VIEW.key === o.key) { closeTo({ v: "rest" }); return; }
    go({ v: "shelf", key: o.key }, { push: true });
  };

  /* ── pointer and keys ── */
  let restT = 0, intentT = 0;
  const hoverIn = (o) => { if (staged()) { if (hov !== o) stageHover(o); } else show(o, 0); };
  IDX.addEventListener("pointerover", (ev) => {
    if (ev.pointerType !== "mouse") return;
    const o = entryOf(ev.target);
    clearTimeout(intentT);
    if (!o) return;
    clearTimeout(restT);
    intentT = setTimeout(() => hoverIn(o), staged() ? (VIEW.v === "study" ? 150 : 70) : cur ? 90 : 0);
  });
  IDX.addEventListener("pointermove", (ev) => {
    if (ev.pointerType !== "mouse") return;
    const o = entryOf(ev.target); if (!o) return;
    if (staged() ? hov === o : cur && cur.o === o) return;
    clearTimeout(intentT); intentT = setTimeout(() => hoverIn(o), staged() && VIEW.v === "study" ? 150 : 90);
  });
  IDX.addEventListener("focusin", (ev) => { const o = entryOf(ev.target); if (o && ev.target.matches(":focus-visible")) hoverIn(o); });
  const goRest = () => { clearTimeout(restT); restT = setTimeout(() => { if (!staged()) show(null); }, 700); };
  IDX.addEventListener("pointerleave", (ev) => {
    if (ev.pointerType !== "mouse") return;
    clearTimeout(intentT);
    if (staged()) { clearTimeout(restT); restT = setTimeout(() => { if (hov) stageNeutral(); }, 380); } else goRest();
  });
  FOCUS.addEventListener("pointerenter", () => clearTimeout(restT));
  FOCUS.addEventListener("pointerleave", (ev) => { if (ev.pointerType === "mouse" && !IDX.contains(ev.relatedTarget) && !staged()) goRest(); });

  IDX.addEventListener("click", (ev) => {
    const sw = ev.target.closest(".ixsw a");
    if (sw && !(ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button)) { ev.preventDefault(); setIndex(sw.dataset.ix); return; }
    const o = entryOf(ev.target); if (!o) return;
    if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button) return; /* a new tab is still a new tab */
    ev.preventDefault();
    clearTimeout(intentT);
    /* on glass a tap is the hover; a second tap opens */
    if (phone() && !staged() && !(cur && cur.o === o)) { show(o, 0); return; }
    /* a study in Work flies from its own picture in the index, when that
       picture is loaded and in view */
    let how = null;
    if (o.g.id === "work") {
      const th = o.a.querySelector(".th");
      const view = phone() ? { top: 0, bottom: innerHeight } : IDX.getBoundingClientRect();
      if (th && th.classList.contains("in") && rectIn(th.getBoundingClientRect(), view)) how = { src: { box: th, f: th._f, target: "cover" } };
    }
    open(o, how);
  });
  /* on glass, a sideways swipe on the focus steps it */
  let sx = null, sy = 0, swiped = false;
  FOCUS.addEventListener("touchstart", (ev) => { const t = ev.touches[0]; sx = t.clientX; sy = t.clientY; swiped = false; }, { passive: true });
  FOCUS.addEventListener("touchend", (ev) => {
    if (sx == null || !cur) return; const t = ev.changedTouches[0]; const dx = t.clientX - sx, dy = t.clientY - sy; sx = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) { swiped = true; step(dx < 0 ? 1 : -1); }
  }, { passive: true });
  /* a picture in the focus opens its study, flying into it; anywhere else
     on the focus opens what the entry holds */
  FOCUS.addEventListener("click", (ev) => {
    if (swiped) { swiped = false; return; }
    if (ev.target.closest("a") || staged()) return;
    const cp = ev.target.closest(".cp");
    if (cp && cp._f) {
      const from = null;
      go({ v: "study", k: cp.dataset.k, from }, { push: true, src: { box: cp._box, f: cp._f, target: cp._f.lead ? "cover" : cp._f.id } });
      return;
    }
    if (cur) open(cur.o);
  });
  let wheelAcc = 0, wheelAt = 0;
  FOCUS.addEventListener("wheel", (ev) => {
    if (phone() || !cur || staged()) return;
    ev.preventDefault();
    const now = performance.now();
    if (now - wheelAt > 260) wheelAcc = 0;
    wheelAcc += ev.deltaY || ev.deltaX; wheelAt = now;
    if (Math.abs(wheelAcc) < 60) return;
    const d = wheelAcc > 0 ? 1 : -1; wheelAcc = -d * 400;
    step(d);
  }, { passive: false });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") {
      if (VIEW.v !== "rest") { ev.preventDefault(); closeTo(parentOf(VIEW)); }
      else { show(null); }
    } else if (!staged() && cur && (ev.key === "ArrowRight" || ev.key === "ArrowDown")) { ev.preventDefault(); step(1); }
    else if (!staged() && cur && (ev.key === "ArrowLeft" || ev.key === "ArrowUp")) { ev.preventDefault(); step(-1); }
  });

  /* the index scrolls in its own half; the wires follow it */
  let sc = 0;
  const rewire = () => {
    if (!staged()) { wire(true); return; }
    if (VIEW.v === "shelf" && SH) { if (SH.hovTile) wireTile(SH, SH.hovTile); else if (hov) wireShelf(SH, hov); }
    else if (VIEW.v === "study" && LW) drawLive();
  };
  IDX.addEventListener("scroll", () => { cancelAnimationFrame(sc); sc = requestAnimationFrame(rewire); }, { passive: true });
  let rz = 0;
  addEventListener("resize", () => {
    cancelAnimationFrame(rz);
    rz = requestAnimationFrame(() => {
      fit();
      HTML.classList.toggle("sheet", staged() && phone());
      if (!staged()) render();
      if (SH && Math.abs(SH.layer.clientWidth - SH.W) > 30) { const f = SH.layer.scrollTop / Math.max(1, SH.layer.scrollHeight); layoutShelf(SH); SH.layer.scrollTop = f * SH.layer.scrollHeight; }
      WIRES.innerHTML = "";
    });
  });

  buildIndex();
  const start = () => {
    fit(true); render(); HTML.classList.add("ready");
    /* an address opens its depth directly */
    const st = history.state && history.state.v ? (history.state.v === "study" ? { v: "study", k: history.state.k, from: history.state.from } : history.state.v === "shelf" ? { v: "shelf", key: history.state.key } : { v: "rest" }) : parse(location.hash);
    if (keyOf(st) !== decodeURIComponent(location.hash.replace(/^#/, ""))) Object.assign(st, parse(location.hash));
    history.replaceState({ v: st.v, key: st.key || null, k: st.k || null, from: st.from || null, back: history.state ? history.state.back : undefined }, "", keyOf(st) ? "#" + keyOf(st) : location.pathname + location.search);
    if (st.v !== "rest") apply(st, {});
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
  window.XREF = { ENTRIES, GROUPS, FIGS, KEYMAP, show, fit, go, setIndex, get ix() { return IX; }, get view() { return VIEW; }, get shelf() { return SH; }, get room() { return RM; } };
})();
