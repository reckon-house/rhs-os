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
   - Index D, the default (27 Sept, later). The first version's four
     columns of small type, fitted to one screen by measuring, with a type
     scale and a few pictures set into them; see INDEX D below.
   - No category colour (27 Sept, later). The lines lost their squares,
     their coloured words and their coloured grounds, in every version and
     on every depth. A line is a word now. A study's own palette inside
     its room is the study's, and stays.
   - The shelf as a magazine grid (27 Sept, latest). Pictures edge to
     edge with nothing between, a cover with the entry's name over it,
     justified rows, and heroes that run past the edge and scroll
     sideways; see THE SHELF AS A MAGAZINE GRID below. Flights now clip
     to what is on screen (visRect), so a hero scrolled halfway flies
     from the half you see.

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
  /* ════════════════════════════════════════════════════════════════════
     INDEX D (27 Sept 2026, later). He looked at A, B and C and asked for
     "one that's more columns like the original ... i loved the dense
     editorial/magazine look it had just maybe with some type scale and
     images mixed in". So D is crossref.html's index again (four columns
     of small type on his MacBook, Work, Lines and About as lists, the rest
     run on with middle dots, the type fitted by measuring until the whole
     index sits on one screen) with a contents page's scale set into it:

     - the six lines lead the first column as the largest words, with how
       many studies each holds, sized so the longest fills the column;
     - in Work, each line's lead study is a feature: a size up, with its
       board picture butted to its name, two lines of its type tall. The
       other twenty-four stay rows;
     - four figures are set large inside the Figures run, the number
       large and any noun after it at the run's size.

     Four sizes and no more (the mark aside): the caps over each group,
     the run, the features, the lines and big figures. The pictures are
     six, one per line, all at one height and each in its own proportion,
     so a phone screen is narrow and a storefront wide. Lines, features
     and figures are the same entries doing the same things as in A, B and
     C.
     ════════════════════════════════════════════════════════════════════ */
  const FEAT = new Set((DATA.lines || []).map((l) => l.lead).filter((k) => D.study(k)));
  /* the figures set large: the biggest claims, from four studies */
  const BIGFIG = ["$3M", "2,000+ stores", "$49,630", "95%"];

  const IXS = ["a", "b", "c", "d"];
  let IX = (new URLSearchParams(location.search).get("index") || "d").toLowerCase();
  if (!IXS.includes(IX)) IX = "d";
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
      /* D pictures only its features; the other studies are words */
      const th = mode === "dwork" && !FEAT.has(o.k) ? null : thumb(o.k, mode === "tile" ? "we" : "");
      if (th) a.appendChild(th);
      if (mode === "tile") a.appendChild(el("span", "tc", '<span class="t">' + esc(o.label) + '</span> <span class="y">' + D.year(o.k) + "</span>"));
      else if (mode === "dwork" && FEAT.has(o.k)) {
        /* D: a line's lead study is a feature, set a size up with its
           picture butted to the name; every other study stays a row */
        a.classList.add("ft");
        /* each picture keeps its own proportion, within reason, at one height */
        if (th) th.style.setProperty("--r", Math.max(0.8, Math.min(1.6, ratio(th._f))).toFixed(3));
        /* the year after the name, floated to the column's edge on the
           name's last line (27 Sept review). Floated on the first line it
           cut that line short, so a long name broke as "Hill / Country
           home, / kitchen", and on a wide glass ran under the picture */
        a.appendChild(el("span", "tx", '<span class="t">' + esc(o.label) + '</span> <span class="y we">' + D.year(o.k) + "</span>"));
      } else if (mode === "inline") {
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
      /* a line is a word: no square, no colour of its own (27 Sept) */
      const l = o.line;
      if (mode === "row") {
        a.classList.add("ln");
        a.appendChild(el("span", "nm", '<span class="t">' + esc(o.label) + "</span>"));
        const strip = el("span", "strip we");
        l.studies.filter((k) => D.study(k)).forEach((k) => { const th = thumb(k); if (th) { strip.appendChild(th); STRIPS.push(th); } });
        a.appendChild(strip);
      } else if (mode === "word") { a.classList.add("lw"); a.innerHTML = '<span class="t">' + esc(o.label) + "</span>"; }
      else if (mode === "dline") {
        /* D: the largest words on the page, with how many studies each holds */
        a.classList.add("ld");
        a.innerHTML = '<span class="t">' + esc(o.label) + '</span><span class="y we">' + l.studies.filter((k) => D.study(k)).length + "</span>";
      } else a.innerHTML = '<span class="t">' + esc(o.label) + "</span>";
    } else if (g === "figures" && mode === "dfig" && BIGFIG.includes(o.label)) {
      /* D: a handful of figures set large. The number is large and a noun
         after it stays at the size of the run, as a magazine sets a figure */
      const m = /^([~$]?[\d][\d,.]*[%+MKx]*)(.*)$/.exec(clean(o.label)) || [0, clean(o.label), ""];
      a.classList.add("fig", "bf");
      a.innerHTML = '<span class="t"><span class="fn">' + D.esc(m[1]) + "</span>" + (m[2] ? '<span class="fu">' + D.esc(m[2]) + "</span>" : "") + "</span>";
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
    /* D's modes are the first version's list and run, with its own scale */
    const sec = el("section", "grp " + ({ dfig: "run dfig", dline: "list dline", dwork: "list dwork" }[mode] || mode)); sec.dataset.g = id;
    const h = el("h2", null, "<span>" + g.name + '</span><span class="n">' + g.items.length + "</span>");
    g.count = h.querySelector(".n"); sec.appendChild(h);
    const box = el("div", "items");
    g.items.forEach((o, j) => {
      const a = entryEl(o, mode);
      if (mode === "run" || mode === "wall" || mode === "dfig") {
        if (o.label.length <= 22) a.classList.add("nw");
        const big = a.classList.contains("bf");
        const it = el("span", "it" + (big ? " bf" : "")); it.appendChild(a);
        /* a figure set large stands on its own line, with no dot after it */
        if (j < g.items.length - 1 && !big) it.appendChild(el("span", "sep", "·"));
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
    d: () => [block("dcols", [section("lines", "dline"), section("work", "dwork"), section("about", "list"), section("years", "run"),
      section("capabilities", "run"), section("tools", "run"), section("figures", "dfig")])],
  };
  const buildIndex = () => {
    THUMBS = []; STRIPS = [];
    GROUPS.forEach((g) => { g.count = null; });
    const markIn = IDX.contains(MARK);
    IDX.replaceChildren();
    /* the switch: three letters, nothing else. It sits on the mark's line
       at the top, where it can be found; at the foot of an index two
       screens tall it could not (his "how do i go between the different
       versions?", 27 Sept) */
    const sw = el("div", "ixsw caps", '<span class="ixl">Index</span>' + IXS.map((x) => '<a href="?index=' + x + '" data-ix="' + x + '"' + (x === IX ? ' class="on" aria-current="true"' : "") + ">" + x.toUpperCase() + "</a>").join(""));
    const top = el("div", "ixtop");
    if (markIn) top.appendChild(MARK);
    top.appendChild(sw);
    IDX.appendChild(top);
    LAYOUT[IX]().filter(Boolean).forEach((n) => IDX.appendChild(n));
    /* in D the mark and the switch head the first column only, as the
       first version's mark did, so the other three run to the top */
    const cols = IX === "d" && IDX.querySelector(".dcols");
    if (cols) cols.insertBefore(top, cols.firstChild);
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
  /* D is fitted the way the first version was: four columns (two on a
     phone, one per group), and the run's type stepped down from 12.5px until the whole
     index fits the glass with nothing past the last column. Every other
     size follows the run's, except the lines', which are sized to their
     column: the longest name and its count fill it. Below 10.25px the
     index keeps its columns, balanced, and scrolls in its own half */
  const fitD = () => {
    const root = HTML.style, box = IDX.querySelector(".dcols"); if (!box) return;
    HTML.classList.remove("dscroll");
    /* a phone reads down, so there the index is one column and each group
       sets its own measure (the lines in two, Work as one list, the runs
       full width); two columns of the whole index would mean reading one
       long column and scrolling back up for the next */
    root.setProperty("--cols", phone() ? 1 : Math.max(3, Math.min(5, Math.round(box.clientWidth / 172))));
    const lines = () => {
      const ls = [...box.querySelectorAll(".e.ld")]; if (!ls.length) return;
      root.setProperty("--fl", "100px");
      const w = Math.max(...ls.map((a) => a.querySelector(".t").offsetWidth));
      const n = Math.max(...ls.map((a) => a.querySelector(".y").offsetWidth));
      const room = ls[0].clientWidth - n - 6;
      root.setProperty("--fl", Math.floor(Math.min(phone() ? 44 : 40, (room / w) * 100 * 0.985) * 4) / 4 + "px");
    };
    if (phone()) { root.setProperty("--fs", "12px"); lines(); return; }
    for (let fs = 12.5; fs >= 10.24; fs -= 0.125) {
      root.setProperty("--fs", fs + "px"); lines();
      if (box.scrollWidth <= box.clientWidth + 1) return;
    }
    HTML.classList.add("dscroll");
    root.setProperty("--fs", "11.25px"); lines();
  };
  const sizeIndex = () => {
    const root = HTML.style;
    root.removeProperty("--ts"); root.removeProperty("--lw"); root.removeProperty("--gc");
    root.removeProperty("--fs"); root.removeProperty("--fl"); root.removeProperty("--cols");
    if (IX === "d") fitD();
    else if (IX === "a") {
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
    /* on a desk the mark heads the index on one line with the switch, as
       buildIndex meant it to (it had been set a line above); stacked, it
       sits over the band */
    const top = IDX.querySelector(".ixtop");
    if (stack) { if (MARK.parentNode !== document.body) document.body.insertBefore(MARK, FOCUS); }
    else if (top && top.firstChild !== MARK) top.insertBefore(MARK, top.firstChild);
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

    /* a line no longer fills the open half with its colour (27 Sept): its
       studies and its name sit on paper, in ink, like everything else */
    FIELD.classList.remove("on");

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
  /* pairs: [{ x: entry, q: [x, y], me }]; dots at each end on the stage.
     Every ground is paper now (27 Sept), so a wire is ink all the way */
  const draw = (pairs, o) => {
    WIRES.innerHTML = "";
    if (phone() || !pairs.length) return null;
    const g = document.createElementNS(NS, "g");
    const dots = new Map();
    pairs.forEach(({ x, q, me }) => {
      const p = endOf(x); if (!p || !q) return;
      const path = document.createElementNS(NS, "path"); path.setAttribute("d", pathD(p, q));
      if (me) path.setAttribute("class", "me");
      g.appendChild(path);
      dots.set(q[0].toFixed(0) + "," + q[1].toFixed(0), q);
    });
    dots.forEach((q) => { const d = document.createElementNS(NS, "circle"); d.setAttribute("cx", q[0]); d.setAttribute("cy", q[1]); d.setAttribute("r", 2.2); g.appendChild(d); });
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
  /* what of a box is on the glass: its rect cut by every ancestor that
     clips it (a hero's sideways scroller, the shelf under its running
     head, the room, the index). A picture flies from and lands on only
     that much, so a hero scrolled halfway leaves from the half you see */
  const visRect = (box) => {
    const r = box.getBoundingClientRect();
    let L = r.left, T = r.top, R = r.right, B = r.bottom;
    for (let a = box.parentElement; a && a !== document.body && a !== HTML; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if (cs.overflowX === "visible" && cs.overflowY === "visible") continue;
      const q = a.getBoundingClientRect();
      if (cs.overflowX !== "visible") { L = Math.max(L, q.left); R = Math.min(R, q.right); }
      if (cs.overflowY !== "visible") { T = Math.max(T, q.top + (a.classList.contains("shelf") ? HEAD : 0)); B = Math.min(B, q.bottom); }
    }
    L = Math.max(L, 0); T = Math.max(T, 0); R = Math.min(R, innerWidth); B = Math.min(B, innerHeight);
    return R - L > 2 && B - T > 2 ? { left: L, top: T, right: R, bottom: B, width: R - L, height: B - T } : null;
  };
  const fly = (fromBox, f, toBox, opt) => {
    opt = opt || {};
    const A0 = fromBox.getBoundingClientRect(), B0 = toBox.getBoundingClientRect();
    if (!A0.width || !B0.width || still()) return null;
    const A = opt.clipA || visRect(fromBox) || A0, B = opt.clipB || visRect(toBox) || B0;
    const r = ratio(f);
    const full = (R) => { const w = Math.max(R.width, R.height * r), h = w / r; return { x: R.left + (R.width - w) / 2, y: R.top + (R.height - h) / 2, w, h }; };
    /* a picture landing on a box that shows another picture covers only
       the part of the box on screen, then gives way to it: covering the
       whole of a hero wider than the stage would blow it up */
    const FA = full(A0), FB = full(opt.fitB ? B : B0), s = FA.w / FB.w;
    const im = document.createElement("img"); im.className = "flyer"; im.alt = ""; im.decoding = "sync";
    im.src = shownSrc(fromBox, f);
    Object.assign(im.style, { left: FB.x + "px", top: FB.y + "px", width: FB.w + "px", height: FB.h + "px" });
    const inset = (R, F, sc) => [(R.top - F.y) / sc, (F.x + F.w - R.right) / sc, (F.y + F.h - R.bottom) / sc, (R.left - F.x) / sc].map((v) => Math.max(0, v).toFixed(1) + "px").join(" ");
    const k0 = { transform: "translate(" + (FA.x - FB.x).toFixed(1) + "px," + (FA.y - FB.y).toFixed(1) + "px) scale(" + s.toFixed(5) + ")", clipPath: "inset(" + inset(A, FA, s) + ")" };
    const k1 = { transform: "translate(0px,0px) scale(1)", clipPath: "inset(" + inset(B, FB, 1) + ")" };
    im.style.transform = k0.transform; im.style.clipPath = k0.clipPath;
    document.body.appendChild(im);
    const an = im.animate([k0, k1], { duration: opt.ms || 580, easing: EASE, fill: "forwards" });
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
  const shelfStudies = (o) => (o.g.id === "lines" ? o.line.studies.filter((k) => D.study(k)) : byRank([...o.rel]));
  const shelfLead = (o) => {
    if (o.g.id === "lines") return esc(o.line.sentence);
    /* About sets its lede only: over a picture a cover holds a sentence,
       not a paragraph */
    if (o.g.id === "about") return esc(o.about.lede);
    if (o.g.id === "tools") { const t = namedIn(o.v, o.rel).find((x) => !x.label); return t ? greyHl(t.text, t.hl).replace('class="h"', "") : null; }
    if (o.g.id === "figures") {
      const src = o.fig.src[0]; if (!src) return null; const it = src.item;
      if (it.sent) return greyHl(it.sent, o.fig.s);
      if (it.label) return esc(it.label) + (it.sub ? ' <span class="g">' + esc(it.sub) + "</span>" : "");
    }
    return null;
  };

  /* ════════════════════════════════════════════════════════════════════
     THE SHELF AS A MAGAZINE GRID (27 Sept 2026, later). He looked at the
     Digital shelf (framed pictures with air between them, on the line's
     colour) and asked: "what if it's an edge to edge grid - no color or
     background showing? and maybe we mix some hero images in that are so
     large you have to scroll left/right inside the column to view it?
     like it's cropped...really give it a magazine/grid look as well".

     So a shelf is pictures butted together from the stage's left edge to
     the window's right and down to its foot, nothing between them. Only
     a thin running head on paper stays at the top, on the index's first
     line, with Close. The grid is blocks, each exactly the stage wide:

     - the cover: the first study cropped to the stage, the entry's name
       and lead set over it (a line opens on its own lead study);
     - rows of two, three and four at one height, as tall as the
       pictures' shapes make them, their widths summing to the stage;
     - a tall picture beside a stack of two, either way round;
     - one picture across the width, cropped to a band;
     - heroes: one picture set near the stage's height, so wide it runs
       past the edge, in a row that scrolls sideways (a trackpad swipe,
       a mouse drag with a grab cursor, a finger), with a thin rule
       saying where you are. It opens centred, so both edges are cut;
     - at the foot, the next entry of the same kind as a last cover.

     Which picture a study shows depends on its slot: its board lead when
     the slot is the lead's shape, else one of its own nearer the shape,
     so a row is not three of the same 3:2. A hero is a study's largest
     picture (most are 3,000 pixels or more), never wider than half its
     pixels, so a small picture is never stretched into one; a study with
     none that large is never a hero. Every slot is checked the same way
     before it is used: the width the picture is drawn at under its crop
     is at most half its pixels. A shelf of few studies brings them back
     with their other pictures, so it still fills.

     Captions sit on the pictures, bottom left: the study and its year, in
     paper or ink by what the picture is under the words (sampled from its
     thumbnail on a 16 by 16 canvas). Where neither holds enough contrast
     a soft scrim goes under those words only.
     ════════════════════════════════════════════════════════════════════ */
  const HEAD = 44; /* the running head: paper, on the index's top line */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  /* the width a picture is drawn at when it covers a box, and whether
     that is at most half its pixels */
  const coverW = (bw, bh, f) => Math.max(bw, bh * ratio(f));
  const honest = (bw, bh, f) => !!f && coverW(bw, bh, f) <= D.maxCss(f) + 0.01;
  const OWN = {};
  /* a study's own pictures with a ground of their own (a transparent one
     would show paper through) */
  const ownOf = (k) => OWN[k] || (OWN[k] = picsOf(k).filter((f) => !f.alpha && f.w && f.h));
  const FEW = () => (phone() ? 4 : 5);
  /* what a study can show: its board lead and its own. A study shown more
     than once keeps to its own, since the lead is often one of them */
  const candsFor = (S, k, taken) => {
    const own = ownOf(k), lead = leadOf(k);
    return ((S.multi && own.length) || !lead ? [] : [lead]).concat(own).filter((f) => !S.used.has(f.src) && !(taken && taken.has(f.src)));
  };
  /* the one nearest the slot's shape that the slot would not stretch; the
     board's own lead when it is close */
  const pickFor = (S, k, want, fits, taken) => {
    let best = null, bs = Infinity;
    candsFor(S, k, taken).forEach((f) => {
      if (fits && !fits(f)) return;
      const s = Math.abs(Math.log(ratio(f) / want)) - (f.lead ? 0.3 : 0);
      if (s < bs) { bs = s; best = f; }
    });
    return best;
  };
  const shelfOrder = (o) => {
    const ks = shelfStudies(o), lead = o.g.id === "lines" && o.line.lead;
    return lead && ks.includes(lead) ? [lead].concat(ks.filter((k) => k !== lead)) : ks;
  };
  const coverH = (avail) => Math.round(avail * (phone() ? 0.6 : 0.7));
  /* the picture a shelf opens on: its first study that fills the cover
     without stretching, else the next that does */
  const coverOf = (S, ks, W, Hc) => {
    for (let i = 0; i < Math.min(ks.length, 8); i++) {
      const f = pickFor(S, ks[i], W / Hc, (x) => honest(W, Hc, x));
      if (f) return { i, k: ks[i], f };
    }
    return null;
  };
  /* a hero: the study's widest picture that stands near the stage's height
     at half its pixels or less and still runs well past the edge */
  const heroPick = (S, k) => {
    let best = null; const lead = leadOf(k);
    ownOf(k).concat(!S.multi && lead ? [lead] : []).forEach((f) => {
      if (S.used.has(f.src)) return;
      const H = Math.floor(Math.min(S.heroH, f.h / 2)), w = Math.floor(H * ratio(f));
      if (H < S.heroH * 0.84 || w < S.W * 1.3) return;
      const s = w * (f.lead ? 0.7 : 1);
      if (!best || s > best.s) best = { f, H, w, s };
    });
    return best;
  };

  /* the blocks: what each wants of its pictures' shapes */
  const NEEDN = { r2: 2, r3: 3, r4: 4, ts: 3, st: 3, full: 1 };
  const WANTS = { r2: [[0.75, 1.5], [1.5, 1]], r3: [[1.5, 0.75, 1.33], [1, 1.5, 0.8]], r4: [[1, 1.5, 0.75, 1.5], [1.5, 0.8, 1.5, 1]] };
  const PWANTS = { r2: [[0.8, 1.5], [1.5, 0.8]], r3: [[0.8, 1, 0.8], [0.8, 1, 0.8]], r4: [[0.8, 1, 0.8, 1], [1, 0.8, 1, 0.8]] };
  const MINW = () => (phone() ? 92 : 110);
  /* a row at one height: widths in proportion to the pictures' shapes,
     summing to the stage. Capped in height, the tiles crop a little */
  const solveRow = (S, t, ks, v) => {
    const wants = (phone() ? PWANTS : WANTS)[t][v % 2];
    const W = S.W, sw = wants.reduce((a, b) => a + b, 0);
    let need = wants.map((x) => (W * x) / sw);
    for (let pass = 0; pass < 3; pass++) {
      const taken = new Set();
      const fs = ks.map((k, i) => { const f = pickFor(S, k, wants[i], (x) => D.maxCss(x) >= need[i], taken); if (f) taken.add(f.src); return f; });
      if (fs.some((f) => !f)) return null;
      const R = fs.reduce((s, f) => s + ratio(f), 0);
      const H = Math.floor(Math.min(W / R, S.rowMax));
      const ws = fs.map((f) => (W * ratio(f)) / R);
      if (ws.some((w) => w < MINW())) return null;
      const bad = fs.map((f, i) => !honest(ws[i], H, f));
      if (!bad.some(Boolean)) return { t, ks, fs, H, ws };
      need = need.map((n, i) => (bad[i] ? Math.max(n, ws[i]) + 1 : n));
    }
    return null;
  };
  /* a tall picture beside a stack of two, solved so both sides are one
     height: H = W / (tall's shape + the stack's) */
  const solveTS = (S, t, ks) => {
    const W = S.W;
    let needT = W * 0.4, needS = W * 0.5;
    for (let pass = 0; pass < 3; pass++) {
      const taken = new Set();
      const ft = pickFor(S, ks[0], 0.72, (x) => D.maxCss(x) >= needT, taken); if (!ft) return null; taken.add(ft.src);
      const f1 = pickFor(S, ks[1], 1.5, (x) => D.maxCss(x) >= needS, taken); if (!f1) return null; taken.add(f1.src);
      const f2 = pickFor(S, ks[2], 1.5, (x) => D.maxCss(x) >= needS, taken); if (!f2) return null;
      const inv = 1 / ratio(f1) + 1 / ratio(f2);
      const H0 = W / (ratio(ft) + 1 / inv);
      const wt = H0 * ratio(ft), ws = W - wt;
      const H = Math.floor(Math.min(H0, S.rowMax)), sc = H / H0;
      const hs = [ws / ratio(f1), ws / ratio(f2)];
      const okT = honest(wt, H, ft), ok1 = honest(ws, hs[0] * sc, f1), ok2 = honest(ws, hs[1] * sc, f2);
      if (okT && ok1 && ok2 && Math.min(wt, ws) >= MINW()) return { t, ks, fs: [ft, f1, f2], H, wt, ws, hs };
      if (!okT) needT = wt + 1;
      if (!ok1 || !ok2) needS = ws + 1;
    }
    return null;
  };
  /* one picture across the width, cropped to a band */
  const solveFull = (S, t, ks) => {
    const W = S.W, H = Math.floor(Math.min(W / (phone() ? 1.3 : 1.85), S.avail * 0.66));
    const f = pickFor(S, ks[0], W / H, (x) => honest(W, H, x));
    return f ? { t: "full", ks: [ks[0]], fs: [f], H } : null;
  };
  const solveBlock = (S, t, ks, v) => (t === "ts" || t === "st" ? solveTS(S, t, ks) : t === "full" ? solveFull(S, t, ks) : solveRow(S, t, ks, v));
  /* the last resort, when no picture a study has can fill a slot: it sits
     at its honest size and the paper shows beside it. Only a study with a
     single small picture comes to this */
  const solveSolo = (S, k) => {
    const c = candsFor(S, k).sort((a, b) => D.maxCss(b) - D.maxCss(a))[0]; if (!c) return null;
    const w0 = Math.min(S.W, D.maxCss(c)), H = Math.floor(Math.min(w0 / ratio(c), S.rowMax));
    return { t: "solo", ks: [k], fs: [c], H, w: Math.floor(Math.min(w0, H * ratio(c))) };
  };

  const planShelf = (S) => {
    const ks = shelfOrder(S.o), W = S.W;
    S.multi = ks.length < FEW();
    const slots = ks.slice();
    if (S.multi) {
      const want = phone() ? 7 : 8;
      for (let round = 1; slots.length < want && round < 16; round++) {
        let added = false;
        ks.forEach((k) => { if (slots.length < want && ownOf(k).length > round) { slots.push(k); added = true; } });
        if (!added) break;
      }
    }
    /* a shelf with no study (a figure only About holds) is its name on paper */
    if (!slots.length) return [{ t: "cover", bare: true, ks: [], fs: [], H: 0 }];
    const blocks = [], shown = new Set();
    const use = (b) => { b.fs.forEach((f) => S.used.add(f.src)); b.ks.forEach((k) => shown.add(k)); blocks.push(b); };
    let q = slots.slice();
    /* heroes first, so the cover and the rows cannot spend the one picture
       large enough: two on a long shelf, one on a short, each the study
       whose picture runs furthest past the edge (a little in favour of the
       nearer). The cover's study is never one */
    const want = q.length - 1 >= 8 ? 2 : q.length >= 2 ? 1 : 0;
    const heroes = [];
    for (let n = 0; n < want; n++) {
      let got = null;
      q.forEach((k, i) => { if (!i) return; const h = heroPick(S, k); if (h && (!got || h.w - i * 30 > got.s)) got = { i, h, s: h.w - i * 30 }; });
      if (!got) break;
      heroes.push({ t: "hero", ks: [q[got.i]], fs: [got.h.f], H: got.h.H, w: got.h.w });
      S.used.add(got.h.f.src); q.splice(got.i, 1);
    }
    let cv = coverOf(S, q, W, S.Hc);
    if (!cv && heroes.length) {
      /* no cover left once the heroes took theirs: the cover comes first */
      heroes.forEach((h) => S.used.delete(h.fs[0].src)); heroes.length = 0; q = slots.slice();
      cv = coverOf(S, q, W, S.Hc);
    }
    if (cv) { q.splice(cv.i, 1); use({ t: "cover", ks: [cv.k], fs: [cv.f], H: S.Hc }); }
    else { const b = solveSolo(S, q.shift()); if (b) { b.t = "cover"; b.solo = true; use(b); } }
    /* a short shelf brings its studies back, and taking out the cover and
       the heroes could leave two of one study side by side in a row, with
       the same caption twice (year 2024 set Robert Rodriguez beside
       himself). The rest are dealt so that one study never follows
       itself while another can go between (27 Sept review) */
    if (S.multi && new Set(q).size > 1) {
      const left = q.slice(), out = []; let prev = cv ? cv.k : null;
      while (left.length) {
        const n = {}; left.forEach((k) => { n[k] = (n[k] || 0) + 1; });
        let at = -1;
        left.forEach((k, i) => { if (k !== prev && (at < 0 || n[k] > n[left[at]])) at = i; });
        if (at < 0) at = 0;
        prev = left[at]; out.push(prev); left.splice(at, 1);
      }
      q = out;
    }
    heroes.forEach((h) => shown.add(h.ks[0]));
    /* placed after the first row and after the third, or straight after the
       cover when little else is left */
    const heroAt = heroes.length === 2 ? [1, 3] : heroes.length === 1 ? [q.length <= 4 ? 0 : 1] : [];
    const PAT = phone() ? ["r2", "ts", "full", "st", "r2", "r3"] : ["r3", "ts", "r4", "r2", "full", "st", "r3", "r4", "r2", "ts"];
    let pi = 0, bi = 0, hi = 0, v = 0, guard = 0;
    const heroNow = () => { while (hi < heroes.length && bi >= heroAt[hi]) { blocks.push(heroes[hi++]); bi++; } };
    while (q.length && guard++ < 80) {
      heroNow();
      const left = q.length;
      let t = PAT[pi++ % PAT.length];
      if (NEEDN[t] > left) t = left === 1 ? "full" : left === 2 ? "r2" : left === 3 ? (phone() ? "ts" : "r3") : phone() ? "r2" : "r4";
      /* never leave one study to the end that cannot fill a band alone:
         take one more into this block, or one fewer */
      if (left - NEEDN[t] === 1 && !solveFull(S, "full", [q[left - 1]])) t = { r2: "r3", r3: phone() ? "r2" : "r4", ts: phone() ? "r2" : "r4", st: phone() ? "r2" : "r4", r4: "r3", full: "r2" }[t];
      let b = solveBlock(S, t, q.slice(0, NEEDN[t]), v++);
      if (!b) for (const t2 of phone() ? ["r2", "ts", "full"] : ["r3", "r4", "ts", "r2", "full"]) {
        if (t2 === t || NEEDN[t2] > left) continue;
        b = solveBlock(S, t2, q.slice(0, NEEDN[t2]), v++); if (b) break;
      }
      /* nothing fills the width with it. A study already on the shelf is
         left out rather than set alone on paper; only one not yet shown
         keeps its honest size with the paper beside it */
      if (!b && !shown.has(q[0])) b = solveSolo(S, q[0]);
      q.splice(0, b ? b.ks.length : 1);
      if (b) { use(b); bi++; }
    }
    bi = Infinity; heroNow();
    return blocks;
  };

  /* ── what a picture is under the words on it ── */
  const LN = 16;
  const LC = document.createElement("canvas"); LC.width = LC.height = LN;
  const LX = LC.getContext("2d", { willReadFrequently: true });
  /* the picture as its box draws it (cropped to cover, centred), 16 by 16 */
  const sampleBox = (box, im) => {
    const iw = im.naturalWidth, ih = im.naturalHeight; if (!iw || !ih) return false;
    const ba = box.offsetWidth / Math.max(1, box.offsetHeight), ia = iw / ih;
    let sx = 0, sy = 0, sw = iw, sh = ih;
    if (ia > ba) { sw = ih * ba; sx = (iw - sw) / 2; } else { sh = iw / ba; sy = (ih - sh) / 2; }
    try {
      LX.clearRect(0, 0, LN, LN); LX.drawImage(im, sx, sy, sw, sh, 0, 0, LN, LN);
      const d = LX.getImageData(0, 0, LN, LN).data, g = new Float32Array(LN * LN);
      for (let i = 0; i < LN * LN; i++) g[i] = (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255;
      box._lum = g; return true;
    } catch (e) { return false; }
  };
  const lin = (v) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  /* paper or ink over a region (fractions of the box): whichever holds
     more contrast on average; a scrim when even that is thin, or when a
     cell under the words fights it */
  const inkOver = (g, q, force) => {
    const a = clamp(Math.floor(q[0] * LN), 0, LN - 1), b = clamp(Math.ceil(q[2] * LN) - 1, a, LN - 1);
    const c = clamp(Math.floor(q[1] * LN), 0, LN - 1), d = clamp(Math.ceil(q[3] * LN) - 1, c, LN - 1);
    let s = 0, n = 0, lo = 1, hi = 0;
    for (let y = c; y <= d; y++) for (let x = a; x <= b; x++) { const L = lin(g[y * LN + x]); s += L; n++; lo = Math.min(lo, L); hi = Math.max(hi, L); }
    const m = s / n;
    const light = force != null ? force : 1.05 / (m + 0.05) >= (m + 0.05) / 0.05;
    const avg = light ? 1.05 / (m + 0.05) : (m + 0.05) / 0.05;
    const worst = light ? 1.05 / (hi + 0.05) : (lo + 0.05) / 0.05;
    return { light, scrim: avg < 4.5 || worst < 2.2 };
  };
  const regionOf = (node, box) => {
    const r = node.getBoundingClientRect(), b = box.getBoundingClientRect();
    if (!b.width || !b.height || !r.width) return null;
    return [(r.left - b.left) / b.width, (r.top - b.top) / b.height, (r.right - b.left) / b.width, (r.bottom - b.top) / b.height];
  };
  const inkOn = (node, box, noScrim, force) => {
    const q = box._lum && regionOf(node, box); if (!q) return null;
    const v = inkOver(box._lum, q, force);
    node.classList.toggle("lt", v.light); node.classList.toggle("scr", !noScrim && v.scrim); node.classList.add("inked");
    return v;
  };
  /* the words over a picture: its caption, a hero's rule, and a cover's
     name and lead, which take one ink together (the scrim under the lead
     only; the name is large enough to hold) */
  const paintOver = (box) => {
    if (!box._lum) return;
    const t = box._t;
    const over = (t && t.over) || box._over;
    if (over) {
      /* a cover's name goes where the picture is calmest for it, the foot
         or the head of the cover, whichever holds its ink over more of
         the cells under it (it is hidden until now, so the move is unseen).
         The Next cover at a shelf's foot chooses the same way (27 Sept
         review) */
      if (!over._placed) {
        over._placed = true;
        const q = regionOf(over, box), H = box.offsetHeight || 1, top = (phone() ? 14 : 18) / H;
        if (q) {
          const qt = [q[0], top, q[2], top + (q[3] - q[1])];
          if (held(box._lum, qt) > held(box._lum, q) + 0.08) { over.classList.add("at-top"); if (t && t.over === over) t.cap.classList.add("at-foot"); }
        }
      }
      /* a name this large crosses light and dark at once, so its ink is
         the one that holds over more of it, not the one that suits the
         average: the average set "Campaigns" in ink over a dark shop
         front, and lost its first letters (27 Sept review) */
      const q = regionOf(over, box), hb = q && heldBy(box._lum, q);
      const v = inkOn(over, box, true, hb && hb.w !== hb.k ? hb.w > hb.k : null);
      if (v) over.querySelectorAll(".sh-lead, .caps").forEach((n) => inkOn(n, box, false, v.light));
    }
    if (t) { inkOn(t.cap, box); if (t.rule) inkOn(t.rule, box, true); }
  };
  /* how much of a region holds a 3:1 contrast in paper (w) and in ink (k) */
  const heldBy = (g, q) => {
    const a = clamp(Math.floor(q[0] * LN), 0, LN - 1), b = clamp(Math.ceil(q[2] * LN) - 1, a, LN - 1);
    const c = clamp(Math.floor(q[1] * LN), 0, LN - 1), d = clamp(Math.ceil(q[3] * LN) - 1, c, LN - 1);
    let w = 0, k = 0, n = 0;
    for (let y = c; y <= d; y++) for (let x = a; x <= b; x++) { const L = lin(g[y * LN + x]); n++; if (1.05 / (L + 0.05) >= 3) w++; if ((L + 0.05) / 0.05 >= 3) k++; }
    return { w: w / n, k: k / n };
  };
  /* and for the better of the two */
  const held = (g, q) => { const h = heldBy(g, q); return Math.max(h.w, h.k); };

  /* ── the blocks, built ── */
  /* the words are clamped inside their own span: clamped on the caption
     itself, a third line showed through its padding (27 Sept review) */
  const capHtml = (k) => '<span class="tl"><span class="t">' + esc(D.title(k)) + '</span> <span class="y">' + D.year(k) + "</span></span>";
  const tileEl = (S, k, f, cls) => {
    const a = el("a", "tu" + (cls ? " " + cls : "")); a.href = "#study/" + k; a.dataset.k = k; a.draggable = false;
    const box = el("div", "tpic"); a.appendChild(box);
    const cap = el("div", "tcap", capHtml(k)); a.appendChild(cap);
    const t = { k, f, box, a, cap };
    box._f = f; box._t = t; a._t = t;
    S.tiles.push(t); S.units.push(a); S.boxes.push(box);
    return a;
  };
  const flexOf = (a, n) => { a.style.flex = n.toFixed(3) + " 1 0px"; };
  const coverEl = (S, b) => {
    const o = S.o;
    /* a study whose only picture is too small to fill the stage keeps its
       honest size at the right edge, and its name sits on the paper
       beside it, in ink */
    const blk = el("div", "g-cover" + (b.bare ? " bare" : b.solo ? " solo" : "")); if (!b.bare) blk.style.height = b.H + "px";
    const a = b.bare ? null : tileEl(S, b.ks[0], b.fs[0], "cov");
    if (b.solo) a.style.width = b.w + "px";
    if (a) blk.appendChild(a);
    const tt = el("div", "g-title" + (b.bare || b.solo ? " inked" : ""));
    if (b.solo) tt.style.right = b.w + (phone() ? 16 : 20) + "px";
    const nm = el("h2", "sh-name" + (o.g.id === "years" || o.g.id === "figures" ? " num" : ""), esc(nameOf(o)));
    tt.appendChild(nm);
    const ld = shelfLead(o); if (ld) tt.appendChild(el("p", "sh-lead", ld));
    blk.appendChild(tt);
    if (a && !b.solo) a._t.over = tt;
    S.cover = { blk, tt, nm, a, t: a && a._t };
    S.units.push(tt);
    return blk;
  };
  const heroEl = (S, b) => {
    const k = b.ks[0], f = b.fs[0];
    const a = el("a", "tu hero"); a.href = "#study/" + k; a.dataset.k = k; a.draggable = false; a.style.height = b.H + "px";
    const sc = el("div", "hx");
    const box = el("div", "tpic"); box.style.width = b.w + "px"; box.style.height = b.H + "px";
    sc.appendChild(box); a.appendChild(sc);
    const cap = el("div", "tcap", capHtml(k)); a.appendChild(cap);
    const rule = el("div", "hx-rule", "<i></i>"); a.appendChild(rule);
    const t = { k, f, box, a, cap, sc, rule, hero: true, raf: 0 };
    box._f = f; box._t = t; a._t = t;
    S.tiles.push(t); S.units.push(a); S.boxes.push(box); S.heroes.push(t);
    dragScroll(sc);
    sc.addEventListener("scroll", () => { cancelAnimationFrame(t.raf); t.raf = requestAnimationFrame(() => heroMoved(t)); }, { passive: true });
    /* from the keyboard: Tab reaches a hero, the arrows move it (27 Sept review) */
    a.addEventListener("keydown", (ev) => {
      if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight") return;
      ev.preventDefault();
      sc.scrollBy({ left: (ev.key === "ArrowRight" ? 1 : -1) * sc.clientWidth * 0.4, behavior: still() ? "auto" : "smooth" });
    });
    return a;
  };
  /* where the hero is: the rule's mark is the window onto the picture */
  const heroMoved = (t) => {
    const sc = t.sc, sw = sc.scrollWidth || 1;
    const i = t.rule.firstChild;
    i.style.left = (100 * sc.scrollLeft) / sw + "%"; i.style.width = (100 * sc.clientWidth) / sw + "%";
    if (t.box._lum) { inkOn(t.cap, t.box); inkOn(t.rule, t.box, true); }
  };
  /* a hero moves under a trackpad or a finger on its own; a mouse drags
     it, with a little glide on letting go. A drag is never a click */
  const dragScroll = (sc) => {
    let id = null, x0 = 0, s0 = 0, moved = false, vx = 0, lx = 0, lt = 0, raf = 0;
    sc.addEventListener("pointerdown", (ev) => {
      if (ev.pointerType !== "mouse" || ev.button !== 0) return;
      cancelAnimationFrame(raf); id = ev.pointerId; x0 = lx = ev.clientX; s0 = sc.scrollLeft; lt = performance.now(); moved = false; vx = 0;
    });
    sc.addEventListener("pointermove", (ev) => {
      if (ev.pointerId !== id) return;
      const dx = ev.clientX - x0;
      if (!moved && Math.abs(dx) > 5) { moved = true; try { sc.setPointerCapture(id); } catch (e) { /* gone */ } sc.classList.add("grabbing"); }
      if (!moved) return;
      sc.scrollLeft = s0 - dx;
      const now = performance.now(), dt = Math.max(1, now - lt);
      vx = 0.75 * ((ev.clientX - lx) / dt) + 0.25 * vx; lx = ev.clientX; lt = now;
    });
    const end = (ev) => {
      if (ev.pointerId !== id) return; id = null;
      sc.classList.remove("grabbing");
      if (!moved) return;
      sc._drag = true; setTimeout(() => { sc._drag = false; }, 0);
      if (still() || Math.abs(vx) < 0.05 || performance.now() - lt > 90) return;
      let v = -vx * 16, last = performance.now();
      const glide = (now) => { const d = Math.min(3, (now - last) / 16); last = now; sc.scrollLeft += v * d; v *= Math.pow(0.93, d); if (Math.abs(v) > 0.35) raf = requestAnimationFrame(glide); };
      raf = requestAnimationFrame(glide);
    };
    sc.addEventListener("pointerup", end); sc.addEventListener("pointercancel", end);
    sc.addEventListener("click", (ev) => { if (sc._drag) { ev.preventDefault(); ev.stopPropagation(); sc._drag = false; } }, true);
  };
  const blockEl = (S, b) => {
    if (b.t === "cover") return coverEl(S, b);
    if (b.t === "hero") return heroEl(S, b);
    const row = el("div", "g-row g-" + b.t); row.style.height = b.H + "px";
    if (b.t === "ts" || b.t === "st") {
      const tall = tileEl(S, b.ks[0], b.fs[0]); flexOf(tall, b.wt);
      const st = el("div", "g-stack"); flexOf(st, b.ws);
      [1, 2].forEach((i) => { const a = tileEl(S, b.ks[i], b.fs[i]); flexOf(a, b.hs[i - 1]); st.appendChild(a); });
      row.appendChild(tall); row.appendChild(st);
    } else if (b.t === "full") { const a = tileEl(S, b.ks[0], b.fs[0]); flexOf(a, 1); row.appendChild(a); }
    else if (b.t === "solo") { const a = tileEl(S, b.ks[0], b.fs[0]); a.style.flex = "0 0 " + b.w + "px"; row.appendChild(a); }
    else b.fs.forEach((f, j) => { const a = tileEl(S, b.ks[j], f); flexOf(a, b.ws[j]); row.appendChild(a); });
    /* a study on two pictures that touch is captioned once, on the first
       (a year of two studies set the same name and year side by side). In
       a row only neighbours touch; beside a stack, all three do */
    const seen = new Set(); let prev = null;
    [...row.querySelectorAll(".tu")].forEach((a) => {
      const k = a.dataset.k;
      if (b.t === "ts" || b.t === "st" ? seen.has(k) : prev === k) a.classList.add("rep");
      seen.add(k); prev = k;
    });
    return row;
  };

  const buildShelf = (o, held) => {
    const layer = el("div", "shelf");
    layer.dataset.key = o.key;
    if (held) layer.style.visibility = "hidden";
    STAGE.appendChild(layer);
    const S = { key: o.key, o, layer, ks: shelfStudies(o), tiles: [], units: [], boxes: [], heroes: [], io: null, W: 0, V: 0, visible: !held, clicked: null };
    layoutShelf(S);
    layer.addEventListener("click", (ev) => shelfClick(S, ev));
    layer.addEventListener("pointerover", (ev) => { if (ev.pointerType === "mouse") tileOver(S, ev.target.closest(".tu")); });
    layer.addEventListener("pointerleave", () => tileOver(S, null));
    let sc = 0;
    layer.addEventListener("scroll", () => {
      cancelAnimationFrame(sc); sc = requestAnimationFrame(() => {
        const cv = S.cover && S.cover.blk;
        layer.classList.toggle("past", layer.scrollTop > (cv ? cv.offsetTop + cv.offsetHeight - HEAD - 24 : 120));
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
    const W = layer.getBoundingClientRect().width || STAGE.clientWidth, V = layer.clientHeight || innerHeight;
    Object.assign(S, { W, V, avail: V - HEAD, used: new Set(), tiles: [], units: [], boxes: [], heroes: [], cover: null, next: null, clicked: null });
    S.Hc = coverH(S.avail); S.heroH = Math.round(S.avail * (phone() ? 0.64 : 0.96)); S.rowMax = Math.round(S.avail * 0.92);
    /* one study: its name is on the cover, and only there */
    layer.classList.toggle("one", S.ks.length === 1);
    if (S.io) { S.io.disconnect(); S.io = null; }
    const frag = document.createDocumentFragment();
    /* the running head: what the shelf is and how many studies, its name
       once the cover has gone by, and Close */
    const bar = el("div", "sh-bar");
    bar.appendChild(el("span", "sh-bar-k caps", "<span>" + esc(o.g.name) + '</span><span class="n">Work<b>' + S.ks.length + "</b></span>"));
    bar.appendChild(el("span", "sh-bar-t", esc(nameOf(o))));
    const x = el("button", "sh-x", "Close"); x.type = "button"; x.addEventListener("click", (ev) => { ev.stopPropagation(); closeTo({ v: "rest" }); });
    bar.appendChild(x); frag.appendChild(bar);

    const grid = el("div", "sh-grid");
    planShelf(S).forEach((b) => grid.appendChild(blockEl(S, b)));
    frag.appendChild(grid);

    /* the foot: the next entry of the same kind, as the cover it opens on,
       so a shelf never ends in a wall */
    const items = o.g.items; const nx = items[(items.indexOf(o) + 1) % items.length];
    if (nx && nx !== o) {
      const nks = shelfOrder(nx);
      const nc = coverOf({ used: new Set(), multi: nks.length < FEW() }, nks, W, S.Hc);
      const Hn = Math.round(S.avail * (phone() ? 0.44 : 0.5));
      const a = el("a", "sh-next g-next"); a.href = "#" + nx.key; a.dataset.key = nx.key; a.draggable = false;
      const nnum = nx.g.id === "years" || nx.g.id === "figures";
      const tt = el("div", "g-title", '<span class="caps">Next</span><span class="sh-next-t' + (nnum ? " num" : "") + '">' + esc(nameOf(nx)) + "</span>");
      if (nc && honest(W, Hn, nc.f)) {
        a.style.height = Hn + "px";
        const box = el("div", "tpic"); box._f = nc.f; box._over = tt; a.appendChild(box);
        a._box = box; a._f = nc.f; S.boxes.push(box);
      } else a.classList.add("bare");
      a.appendChild(tt);
      frag.appendChild(a); S.units.push(a); S.next = { a, tt };
    }
    layer.replaceChildren(frag);

    /* the name over the cover: as large as it goes on one line, or two
       when it is long; its lead under it, smaller until it fits */
    if (S.cover) {
      const { nm, tt, a } = S.cover;
      const inset = phone() ? 16 : 20;
      const C = S.cover.tt.getBoundingClientRect().width, Hc = a ? a.offsetHeight : S.avail * 0.6;
      const num = o.g.id === "years" || o.g.id === "figures";
      const nmax = Math.min(num ? 230 : 150, Hc * (num ? 0.42 : 0.3));
      if (num) oneLine(nm, C, nmax, nmax, o.g.id === "years" ? -0.065 : -0.06);
      else { nm.style.whiteSpace = "nowrap"; const one = oneLine(nm, C, nmax, nmax); if (one < 56) { nm.style.whiteSpace = ""; fitType(nm, C, 2 * Math.min(96, nmax) * 0.95, Math.min(96, nmax), 30); } }
      const ld = tt.querySelector(".sh-lead");
      if (ld) {
        ld.style.maxWidth = Math.min(C, phone() ? C : 540) + "px";
        /* four lines at most, smaller until it fits, else it is left out */
        const room = Hc - inset - 44 - nm.offsetHeight - 14;
        let fs = phone() ? 16 : 19; ld.style.fontSize = fs + "px";
        const over = () => ld.offsetHeight > Math.min(room, fs * 1.22 * 4 + 16);
        while (over() && fs > 13) { fs -= 1; ld.style.fontSize = fs + "px"; }
        if (over()) ld.remove();
      }
    }
    if (S.next && S.next.a._box) {
      const n = S.next.tt.querySelector(".sh-next-t");
      const C = W - 2 * (phone() ? 16 : 20);
      const nh = Math.min(130, S.next.a.offsetHeight * 0.42);
      oneLine(n, C, nh, nh, n.classList.contains("num") ? -0.06 : undefined);
    }
    /* a hero opens centred on its picture, so both of its edges are cut */
    S.heroes.forEach((t) => { t.sc.scrollLeft = Math.max(0, (t.sc.scrollWidth - t.sc.clientWidth) / 2); heroMoved(t); });

    /* pictures load as they near the view, the thumbnail first, and only
       while the shelf is the page (one held behind a room waits) */
    S.io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { S.io.unobserve(e.target); loadTile(e.target); } }),
      { root: layer, rootMargin: "0px 0px 50% 0px" });
    S.watch = () => { if (S.io && !S.watching) { S.watching = true; S.boxes.forEach((b) => { if (!b._loaded) S.io.observe(b); }); } };
    S.watching = false;
    if (S.visible) S.watch();
  };
  /* the honest rung for the size the picture is drawn at under its crop,
     after the rung below it, which is also the one sampled for its light */
  const loadTile = (box) => {
    const f = box._f; if (!f || box._loaded) return; box._loaded = true;
    const w = box.offsetWidth || 300, h = box.offsetHeight || 200;
    const want = D.rung(f, coverW(w, h, f));
    const rungs = [f.t384, f.t768, f.src].filter(Boolean);
    const quick = rungs.indexOf(want) > 0 ? rungs[rungs.indexOf(want) - 1] : null;
    /* the words over it wait for its light; should the canvas refuse the
       picture, they show in ink anyway */
    const lit = (im) => {
      if (box._lum) return;
      if (sampleBox(box, im)) { paintOver(box); return; }
      const t = box._t, over = (t && t.over) || box._over;
      [t && t.cap, t && t.rule, over].forEach((n) => n && n.classList.add("inked"));
    };
    const add = (src, then) => { const im = el("img"); im.alt = ""; im.decoding = "async"; im.draggable = false; im.addEventListener("load", () => then(im), { once: true }); im.src = encodeURI(src); box.appendChild(im); return im; };
    let pv = null;
    if (quick) pv = add(quick, (im) => { box.classList.add("in"); lit(im); });
    add(want, (im) => { box.classList.add("in"); lit(im); if (pv) setTimeout(() => pv.remove(), 400); });
  };
  const unitsInView = (S) => { const box = S.layer.getBoundingClientRect(); return S.units.filter((u) => rectIn(u.getBoundingClientRect(), box)); };
  /* in: each picture opens upward in reading order, the words after */
  const shelfIn = (S, delay, skip) => {
    const us = unitsInView(S).map((u) => [u, u.getBoundingClientRect()]).sort((a, b) => a[1].top - b[1].top || a[1].left - b[1].left).map((x) => x[0]);
    us.forEach((u, i) => {
      if (u._an) u._an.cancel();
      if (still()) return;
      const words = u.classList.contains("g-title");
      u._an = u.animate(words ? [{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "none" }] : [{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }],
        { duration: words ? 560 : 640, delay: (delay || 0) + (words ? 240 : 0) + i * 45, easing: EASE, fill: "backwards" });
    });
    S.units.forEach((u) => { if (!us.includes(u) && u._an) { u._an.cancel(); u._an = null; } });
    if (skip) skip.style.visibility = "hidden";
  };
  /* out: the others go to paper; the one flying keeps its place, empty */
  const shelfOut = (S, keep) => {
    const us = unitsInView(S);
    us.forEach((u, i) => {
      if (u._an) u._an.cancel();
      const kept = keep && u.contains(keep);
      if (kept) { keep.style.visibility = "hidden"; [...u.children].filter((c) => !c.contains(keep)).forEach((c) => c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "forwards" })); u._kept = true; return; }
      u._an = u.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, delay: i * 18, easing: DROP, fill: "forwards" });
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
    const top = s.top + HEAD + 6; /* below the running head */
    const y = Math.max(top, Math.min(s.bottom - 10, (Math.max(r.top, top) + Math.min(r.bottom, s.bottom)) / 2));
    /* inside the picture's own edge: edge to edge, a point just left of it
       was on the picture next door (27 Sept review) */
    return [Math.max(s.left + 2, r.left + 10), y];
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
    if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button) return; /* a new tab is still a new tab */
    const nx = ev.target.closest(".sh-next");
    if (nx) {
      ev.preventDefault();
      /* the next shelf opens on this picture: it flies up into its cover */
      const from = nx._box && nx._box.classList.contains("in") ? { box: nx._box, f: nx._f } : null;
      go({ v: "shelf", key: nx.dataset.key }, { push: true, from });
      return;
    }
    const u = ev.target.closest(".tu"); if (!u) return;
    ev.preventDefault();
    S.clicked = u._t || null;
    go({ v: "study", k: u.dataset.k, from: S.key }, { push: true });
  };

  /* open a shelf over whatever the stage holds */
  const openShelf = (o, how) => {
    const old = SH, oldRoom = RM, was = staged();
    const S = buildShelf(o); SH = S; RM = null;
    setStaged(true); lockEntry(o); cur = null;
    paint(o.rel, o);
    const rise = !still() && !(phone() && !was);
    if (rise) S.layer.animate([{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 560, easing: EASE });
    /* from the foot of the last shelf: its picture flies up into this cover */
    let skip = null;
    const fr = how && how.from, ct = S.cover && S.cover.t;
    if (fr && ct && fr.box.isConnected && ct.f.src === fr.f.src) {
      const flight = fly(fr.box, fr.f, ct.box, { ms: 640 });
      if (flight) { skip = ct.box; fr.box.style.visibility = "hidden"; land(flight, ct.box, () => { ct.box.style.visibility = ""; }); }
    }
    shelfIn(S, rise ? 160 : phone() && !was ? 220 : 60, skip);
    setTimeout(() => {
      if (old && old !== SH) { if (old.io) old.io.disconnect(); old.layer.remove(); }
      if (oldRoom) { oldRoom.room.destroy(); oldRoom.c.remove(); }
    }, rise ? 580 : 520);
  };
  /* a shelf held behind a room, for Close to return to */
  const holdShelf = (o) => {
    if (SH && SH.key === o.key) return;
    if (SH) { if (SH.io) SH.io.disconnect(); SH.layer.remove(); }
    /* built unseen, and it loads nothing until Close brings it back */
    SH = buildShelf(o, true); SH.layer.style.visibility = "hidden";
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
    /* on a shelf: the tile clicked (a study can show twice on a short
       shelf), else its first on screen. It lands on the room's cover, so
       the study opens at its top; a tile showing another of the study's
       pictures gives way to the board's lead there as it lands */
    let tileT = null;
    if (!src && SH && SH.visible && !prev) {
      const list = SH.clicked && SH.clicked.k === k ? [SH.clicked] : SH.tiles.filter((t) => t.k === k);
      tileT = list.find((t) => visRect(t.box)) || null;
      if (tileT) src = { box: tileT.box, f: tileT.f, target: "cover" };
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
    S.layer.style.visibility = ""; S.visible = true; S.watch();
    shelfReset(S);
    const t = (S.clicked && S.clicked.k === R.k ? S.clicked : null) || S.tiles.find((x) => x.k === R.k);
    if (t) {
      /* bring its picture home into view, most of it, before it flies
         there. A hero keeps where it was scrolled sideways */
      const lb = S.layer.getBoundingClientRect(), tb = t.a.getBoundingClientRect();
      const top = lb.top + HEAD, vh = lb.height - HEAD;
      const seen = Math.min(tb.bottom, lb.bottom) - Math.max(tb.top, top);
      if (seen < Math.min(tb.height, vh) * 0.8) S.layer.scrollTop += tb.top - top - Math.max(0, (vh - tb.height) / 2);
    }
    lockEntry(S.o); paint(S.o.rel, S.o); clearLive();
    /* it flies home from where the room shows it: the picture itself when
       the room has it in view, else the cover (the board's lead, which
       gives way to the tile's own picture as it lands) */
    let from = R.room.cover, ff = leadOf(R.k);
    if (t && !t.f.lead) { const e = R.room.find(t.f.id); if (e && e !== R.room.cover && visRect(e)) { from = e; ff = t.f; } }
    const flight = t && from && ff && visRect(from) ? fly(from, ff, t.box, { ms: 540, fitB: ff.src !== t.f.src }) : null;
    if (flight) { t.box.style.visibility = "hidden"; from.style.visibility = "hidden"; land(flight, null, () => { t.box.style.visibility = ""; }); }
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
      openShelf(o, how);
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
      /* a shelf is laid out to its stage's width and height (a hero's is
         the height's), so it is laid out again when either moves much */
      if (SH && (Math.abs(SH.layer.getBoundingClientRect().width - SH.W) > 30 || Math.abs(SH.layer.clientHeight - SH.V) > 80)) {
        const f = SH.layer.scrollTop / Math.max(1, SH.layer.scrollHeight); layoutShelf(SH); SH.layer.scrollTop = f * SH.layer.scrollHeight;
      }
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
