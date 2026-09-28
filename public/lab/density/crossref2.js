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
   - Index D (27 Sept, later), the default until E. The first version's
     four columns of small type, fitted to one screen by measuring, with a
     type scale and a few pictures set into them; see INDEX D below.
   - Index E, the default since F (27 Sept, latest). His "i still think
     i prefer E", after the back of the book was set beside it. The
     page with no ?index opens on E; the others are a letter away.
   - No category colour (27 Sept, later). The lines lost their squares,
     their coloured words and their coloured grounds, in every version and
     on every depth. A line is a word now. A study's own palette inside
     its room is the study's, and stays.
   - The shelf as a magazine grid (27 Sept, later). Pictures edge to
     edge with nothing between, justified rows, and heroes that run past
     the edge and scroll sideways. Flights clip to what is on screen
     (visRect), so a hero scrolled halfway flies from the half you see.
   - The shelf, pluggable (27 Sept, latest). How a shelf sets its studies
     is a layout any file can register, so several can be compared on one
     page; the grid is shelf-grid.js now, calmed (the entry's name on
     paper above the pictures, never over them). See THE SHELF CONTRACT
     just below, and THE SHELF, PLUGGABLE for the frame the page keeps.

   Nothing here writes a sentence; every word on the page is a fragment's
   own. The words of its own are structural: Close, Next, Work, and the
   group names the index already used. */
/* ── THE SHELF CONTRACT (27 Sept 2026) ────────────────────────────────
   He wants ways of setting a category side by side: "let's see if we can
   keep pushing the categories on the right side - it's closer but not
   quite there yet...do we do some options?". So how a shelf sets its
   studies is a layout any file can register, and the page keeps
   everything around it. A layout is

     window.XREF_SHELVES = window.XREF_SHELVES || {};
     window.XREF_SHELVES[id] = { label, render(container, ctx) -> view };

   id is its address (?shelf=<id>) and label its word in the switch.
   render is called when a shelf of any kind becomes the page, with an
   empty container under the running head, and returns a view.

   ctx, which is all it gets (nothing of the page's internals):
     entry     { kind, id, key, group, name, sentence?, mark?, label? }
               kind is the address's first word (line, year, cap, tool,
               fig, about), id its second, key the two ("line/digital"),
               group the index's name for the kind ("Lines"). name,
               sentence and label are his words, verbatim, with no em
               dash: a line's sentence, About's lede, the sentence that
               names a tool or holds a figure (mark is then that tool or
               figure, inside it), or a table figure's label and its note
               (label, sentence).
     studies   [k, ...] in shelf order (a line opens on its lead study)
     pics(k)   that study's picture fragments in reading order, each
               { id, k, src, w, h, t384, t768, alt, alpha } (alpha is a
               transparent file, which shows paper through)
     lead(k)   the board's lead picture in the same shape, lead: true
     width, height   the stage's width, and its height under the running
               head. Read live (they are getters)
     scroller  the element that scrolls vertically (the root for an
               IntersectionObserver that loads pictures as they near)
     head      the running head's height, over the scroller's top
     phone     true when the stage is a sheet over a phone
     open(k, fromEl)   open that study's room. The page flies fromEl's
               visible rect into the room's cover and keeps the address.
               fromEl is what shows the picture (a box its img covers, or
               the img); an _f or data-f (a fragment id) on it lets the
               flight home find the same picture in the room
     hover(k|null, el?)   light the index for that study, with hairlines
               to el (else to tileFor(k)); null when the pointer leaves
     esc(s), clean(s)   escape for HTML / take out em dashes
     D         the kit (density.js): D.img(f, cssW) with an honest
               srcset, D.maxCss(f) = w/2, D.rung, D.title(k), D.year(k),
               D.study(k)

   view, what it gives back:
     destroy()         take itself out, stop its observers and timers
     tileFor(k)        the element a closing room flies back to (the
                       study's picture on screen, else its first), or null
     onResize?()       the window changed size; lay out again if it
                       matters. Without it the page sets the layout afresh
                       when the stage moves much
     enter?({ delay, back, keep })   the shelf is the page: on opening, and
                       when a room closes onto it (back). keep is the
                       element a picture is flying home to; leave it be
     leave?(keep)      a room is opening over it; keep is flying out, and
                       stays where it is, hidden
     light?(set|null)  an index entry is under the pointer: the studies it
                       touches, or null once it has gone
   Without enter and leave the page fades the container in and out.

   The page keeps: the running head (the kind of entry, its name once the
   layout's own head, marked data-head, has gone under it, the switch,
   Close), the next entry of the same kind at the foot, Escape, the
   addresses, the flights, the wires. The switch lists every registered
   layout by its label with the current one underlined; the choice is
   kept in the address (?shelf=<id>) and in localStorage, so it holds
   while he browses. A layout whose file did not load is not in the
   switch; one that throws gives way to the grid. Every layout keeps the
   house rules: nothing written (his words, and short structural labels),
   no em dash, no picture drawn wider than half its pixels, only what is
   near the screen loaded, Avenir Next only, paper, ink and one grey, no
   colour for a category, no type over a busy picture. The layouts are
   shelf-grid.js (grid), shelf-spread.js, shelf-sheet.js, shelf-reel.js,
   each with its own .css, loaded by crossref2.html before this file. */
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
  /* the wires are drawn twice: behind the index, where the words wear a
     halo of paper so a wire passes under them instead of striking them
     out, and over the stage, clipped to it, so a wire into a shelf or a
     room still lands on the picture (27 Sept) */
  const WIRES_BACK = $("#wiresBack");
  const clearWires = () => { WIRES.innerHTML = ""; if (WIRES_BACK) WIRES_BACK.innerHTML = ""; };
  const EASE = "cubic-bezier(0.2, 0.7, 0.2, 1)";
  /* the site's exit curve: leaving is quicker than arriving (reveal.module.css) */
  const EXIT = "cubic-bezier(0.4, 0, 0.7, 1)";
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
  /* a cluster of two or more becomes a mosaic filling the half, keeping
     the cluster to fall back on */
  const fill = (c, title) => (c.pics && c.pics.length >= 2 ? { t: "mosaic", pics: c.pics, title: title || null, k: c.k, fallback: c } : c);
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
    /* the open half filled (27 Sept, his "more filled in, big editorial
       feeling to balance the feel of the TOC"): the study's picture to
       the edges of the half first, then its next pictures butted in a
       mosaic. Each is resolved at the size of the glass when it shows,
       and gives way to the cluster when no picture has the pixels */
    const pool = [face].concat(own).filter((f, i, a) => f && !f.alpha && a.indexOf(f) === i);
    const clu = face ? { t: "cluster", pics: [face].concat(first).map((f) => ({ f, k })), multi: false, k } : null;
    if (face) out.push({ t: "bleed", k, pool, fallback: clu });
    else if (s && s.fact) out.push({ t: "text", text: s.fact, grey: s.rest, k });
    if (first.length >= 2) out.push({ t: "mosaic", pics: first.map((f) => ({ f, k })), k, fallback: clu && { t: "cluster", pics: first.map((f) => ({ f, k })), multi: false, k } });
    fr.filter((f) => f.kind === "line" && f.weight === "display").forEach((f) => out.push({ t: "text", text: f.text, k }));
    fr.filter((f) => f.kind === "num").forEach((f) => out.push({ t: "fig", fig: f.value, label: f.label, sub: f.sub, k }));
    fr.filter((f) => f.kind === "chart").forEach((f) => out.push({ t: "chart", f, hl: f.callout, k }));
    fr.filter((f) => f.kind === "steps").forEach((f) => out.push({ t: "steps", f, k }));
    fr.filter((f) => f.kind === "palette").slice(0, 1).forEach((f) => out.push({ t: "palette", f, k }));
    return out.concat(clusters(later.map((f) => ({ f, k })), false).map((c) => fill(c)));
  };
  const lineReel = (l) => chunk(facesOf(l.studies.filter((k) => D.study(k))), 4).map((pics) => ({ t: "mosaic", pics, title: l.name, sub: l.sentence, fallback: { t: "linefield", line: l, pics } }));
  const yearReel = (y, rel) => {
    const ks = byRank([...rel]); let pics = facesOf(ks);
    /* a year with one or two rooms fills its cluster with their pictures */
    if (pics.length < 3) ks.forEach((k) => picsOf(k).slice(1).filter((f) => !f.alpha).forEach((f) => { if (pics.length < 4) pics.push({ f, k }); }));
    return chunk(pics, 4).map((p) => ({ t: "mosaic", pics: p, title: String(y), fallback: { t: "yearfield", y, rel, pics: p } }));
  };
  const capReel = (v, rel) => {
    const pool = [...rel].flatMap((k) => picsOf(k));
    const hits = D.search(v, pool).filter((r) => r.score >= 3 && D.tokens(v).some((t) => new RegExp("\\b" + reEsc(t)).test((r.f.alt || "").toLowerCase())));
    const pics = hits.slice(0, 16).map((r) => ({ f: r.f, k: r.f.k }));
    const shown = new Set(pics.map((p) => p.k));
    return clusters(pics.concat(facesOf(byRank([...rel]).filter((k) => !shown.has(k)))), true).map((c) => fill(c, v));
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
    /* "Lines" is the house's word; his "which we should probably title
       something more user friendly" (27 Sept). His own verb, from the
       lede beside it: "I make things across brand, product, and place" */
    { id: "lines", name: "What I make", mode: "list", pre: "line" },
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
  /* figures that are a spec rather than a claim leave the index (27 Sept,
     his "drop them"): A.R.C.'s eight category averages, a frame rate, a
     shelf talker's width, and a search's debounce and page size. They
     read only inside their studies, and the rooms still set them there */
  const FIG_SKIP = new Set(["$680", "$425", "$580", "$890", "$310", "$185", "$695", "$5,000+", "20fps", "3.667\"", "300ms", "24 per page"]);
  [...FIGS.values()].filter((g) => !bare(g.s) && !FIG_SKIP.has(g.s)).sort((a, b) => a.order - b.order).forEach((g) => add("figures", { label: g.s, fig: g, rel: g.rel,
    make: () => g.src.map((x) => x.item) }, slug(g.s)));
  ENTRIES.forEach((o) => (o.alias || []).forEach((k) => { if (!KEYMAP.has(k)) KEYMAP.set(k, o); }));
  /* where each entry reaches beyond the studies' own lists (entry-reach.js,
     his "lean towards OVER doing it rather than under"): studies are only
     ever added, before anything counts, ranks or marks by them */
  Object.entries(window.ENTRY_REACH || {}).forEach(([key, ks]) => {
    const o = KEYMAP.get(key); if (!o || !o.rel) return;
    (ks || []).forEach((k) => { if (D.study(k)) o.rel.add(k); });
  });

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
  /* the four figures set large, AI first (27 Sept, his "make the four big
     figures AI first too"): the marketing brain's scale, the deck that
     went from half a day to three minutes, the home A.R.C. documents in
     about thirty, then Nordstrom's $3M as the one proof from before the
     AI work. The rest run on in the Figures run */
  const BIGFIG = ["2,000+ stores", "three minutes", "~30 minutes", "$3M"];
  /* the homepage lines (entry-lines.js): one line per entry, written for
     this page, used in place of a sentence pulled from a study */
  const LINES = window.ENTRY_LINES || {};
  /* a line in two tones, as a study's lead is: its first sentence ink */
  /* a sentence ends on a period after a small letter, a figure or a
     bracket, so an initial or an acronym ("J. Christianson", "A.R.C.")
     does not end the ink half early */
  const twoTone = (t) => { const m = /[a-z0-9%)"'\u2019\u201d][.!?]\s+(?=[A-Z])/.exec(t); return m ? esc(t.slice(0, m.index + 2)) + ' <span class="g">' + esc(t.slice(m.index + m[0].length)) + "</span>" : esc(t); };

  const IXS = ["a", "b", "c", "d", "e", "f"];
  let IX = (new URLSearchParams(location.search).get("index") || "e").toLowerCase();
  if (!IXS.includes(IX)) IX = "e";
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
  /* ── MOTION (27 Sept): his "add animations ... so things dont just
     'pop' into place". Each group of the index settles in (a short rise
     and fade) the first time it comes into view, a beat after the one
     before it, and E's rules and bars draw as their section arrives. A
     group that the observer never reports (a hidden tab) is shown anyway
     after two seconds, so nothing can stay invisible ── */
  let sio = null, seenT = 0;
  HTML.classList.toggle("anim", !still());
  const watchSeen = () => {
    if (sio) sio.disconnect(); clearTimeout(seenT);
    const groups = [...IDX.querySelectorAll(".grp")];
    if (still()) { groups.forEach((g) => g.classList.add("seen")); return; }
    sio = new IntersectionObserver((es) => {
      let n = 0;
      es.forEach((e) => { if (!e.isIntersecting) return; sio.unobserve(e.target);
        const d = n++ * 70; e.target.style.transitionDelay = d + "ms"; e.target.style.setProperty("--gd", d + "ms"); e.target.classList.add("seen");
        setTimeout(() => { e.target.style.transitionDelay = ""; }, 900 + n * 70); });
    }, { root: phone() ? null : IDX, rootMargin: "0px 0px -6% 0px" });
    groups.forEach((g) => { if (!g.classList.contains("seen")) sio.observe(g); });
    seenT = setTimeout(() => groups.forEach((g) => g.classList.add("seen")), 2000);
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
    if (mode && mode[0] === "E") return entryE(o, mode, a);
    if (mode && mode[0] === "F") return entryF(o, mode, a);
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

  /* ════════════════════════════════════════════════════════════════════
     INDEX E, THE CONTENTS PAGE (27 Sept 2026, latest). He sent magazine
     contents pages (big numbers over titles, pictures under them, vertical
     rules between the columns, a dense list beside an airy feature) and
     asked to push the index: "a little more spacing in some spots to vary
     things - maybe vertical grid lines? maybe a few variations within
     each smaller section too? the 'mind' concept had some of that".

     So E is set as a contents page on a four-column grid, with a hairline
     rule in every gutter from top to foot, and numbered sections the way a
     magazine numbers its own ("01 LINES"):
     - 01 Lines: the six lines large down the first column, each with its
       sentence; beside them, across the other three columns, each line's
       lead study as a feature: the line over it, its year set large where
       a magazine sets the page number, its name, its picture at the
       column's width, its sentence and its discipline under.
     - 02 Work: the other twenty-four as a contents list, each name run to
       its year by a leader of dots, its discipline under it in grey.
     - 03 Years: each year large with a square for every study made in it,
       so the column is also a chart of the practice by year.
     - 04 About: the four sections, each with its first sentence.
     - 05 Figures: four figures set large, each with the sentence it comes
       from; the rest run on.
     - 06 Capabilities: the five the most studies list, a size up with
       their counts; the rest run on.
     - 07 Tools: the five the most studies list as a short bar chart; the
       rest run on.
     Every section has a rich setting and a dense one, the air falls in
     different places, and nothing is typed: the sentences are the
     studies', the lines' and About's own. The feature's type and picture
     are one entry, so it lights, locks and wires like any other.
     ════════════════════════════════════════════════════════════════════ */
  const LEAD_OF = {}; (DATA.lines || []).forEach((l, i) => { if (D.study(l.lead) && !LEAD_OF[l.lead]) LEAD_OF[l.lead] = { l, i }; });
  const two = (n) => String(n).padStart(2, "0");
  /* a large word in a mask of its own, so it can rise into place the
     first time its section is seen (27 Sept, the load pass) */
  const mk = (html) => '<span class="mk"><span class="mi">' + html + "</span></span>";
  /* the sentence a figure comes from, the figure in ink inside it */
  const boldIn = (t, s) => { const i = t.indexOf(s); return i < 0 ? esc(t) : esc(t.slice(0, i)) + "<b>" + esc(s) + "</b>" + esc(t.slice(i + s.length)); };
  const figSource = (fig, key) => {
    const src = fig.src.find((x) => x.item.sent) || fig.src[0]; const it = src.item;
    /* the credit carries the figure's place, study and section: 26.03 */
    const credit = it.about ? ((aboutOf(it.sent || "") || {}).a || {}).name || "About" : it.k ? D.title(it.k) + " " + D.year(it.k) + (src.f && src.f.k === it.k ? "  " + D.loc(src.f) : "") : "";
    if (key && LINES[key]) return { html: boldIn(LINES[key], fig.s), credit };
    if (it.sent) {
      const i = it.sent.indexOf(fig.s);
      const html = i < 0 ? esc(it.sent) : esc(it.sent.slice(0, i)) + "<b>" + esc(fig.s) + "</b>" + esc(it.sent.slice(i + fig.s.length));
      return { html, credit };
    }
    return { label: it.label || "", html: esc(it.sub || ""), credit };
  };
  const TOPN = 5;
  const topBy = (id) => G[id].items.slice().sort((x, y) => y.rel.size - x.rel.size || x.label.localeCompare(y.label)).slice(0, TOPN);
  /* the five capabilities set large are chosen, not counted (27 Sept).
     Counting put the broadest first once entries reached further. His
     call: AI goes at the top, for the kind of role he is after (building
     AI tools and workflows a marketing team and its customers can use,
     at a company like Databricks); then the range behind it. In this
     order; a key that is missing is skipped and the count fills in */
  const FEATURED_CAPS = ["cap/ai-strategy", "cap/ai-integration", "cap/product-design", "cap/creative-direction", "cap/interior-design"];
  const featuredCaps = () => {
    const picked = FEATURED_CAPS.map((k) => KEYMAP.get(k)).filter((o) => o && o.g && o.g.id === "capabilities");
    return picked.concat(topBy("capabilities").filter((o) => !picked.includes(o))).slice(0, TOPN);
  };
  /* and the five tools set large, AI first, the same way (his "yes, AI
     tools first"). Their bars are sized against each other, not against
     the most-listed tool, so a chart of five AI tools does not read as
     five tools barely used */
  const FEATURED_TOOLS = ["tool/claude-code", "tool/claude", "tool/gemini", "tool/openai", "tool/supabase-pgvector"];
  let toolMax = 0;
  const featuredTools = () => {
    const picked = FEATURED_TOOLS.map((k) => KEYMAP.get(k)).filter((o) => o && o.g && o.g.id === "tools");
    const list = picked.concat(topBy("tools").filter((o) => !picked.includes(o))).slice(0, TOPN);
    toolMax = Math.max(1, ...list.map((o) => o.rel.size));
    return list;
  };
  const entryE = (o, mode, a) => {
    const g = o.g.id;
    if (mode === "Eline") {
      const l = o.line, i = (DATA.lines || []).indexOf(l);
      a.classList.add("el");
      a.innerHTML = '<span class="kk caps"><span>' + two(i + 1) + '</span><span class="cnt">' + l.studies.filter((k) => D.study(k)).length + "</span></span>" +
        '<span class="nr"><span class="t">' + mk(esc(o.label)) + '</span></span><span class="dk">' + esc(l.sentence) + "</span>";
      a.style.setProperty("--i", i);
    } else if (mode === "Efeat") {
      const s = D.study(o.k), L = LEAD_OF[o.k];
      a.classList.add("w", "ef");
      /* .nr is the name's own row, so a mark can fill the cell around it */
      a.innerHTML = '<span class="kk caps"><span>' + esc(L ? L.l.name : "") + '</span><span class="wn">' + D.num(o.k) + '</span></span><span class="fy">' + mk(D.year(o.k)) + '</span><span class="nr"><span class="t">' + esc(o.label) + "</span></span>";
      const th = thumb(o.k, "fth");
      if (th) { th.style.setProperty("--r", Math.max(0.78, Math.min(1.5, ratio(th._f))).toFixed(3)); a.appendChild(th); }
      if (s && s.fact) a.appendChild(el("span", "dk", esc(s.fact)));
      if (s && s.s) a.appendChild(el("span", "cr caps", esc(s.s)));
    } else if (mode === "Ework") {
      const s = D.study(o.k);
      a.classList.add("w", "ew");
      /* a room's name already carries its discipline ("Hill Country home,
         kitchen"), so its credit would say it twice */
      const credit = s && s.s && D.title(o.k) === s.t ? '<span class="cr">' + esc(s.s) + "</span>" : "";
      /* the study's number leads its row, as a figure's does in a picture index */
      a.innerHTML = '<span class="er"><span class="wn">' + D.num(o.k) + '</span><span class="t">' + esc(o.label) + '</span><span class="ld"></span><span class="y we">' + D.year(o.k) + "</span></span>" + credit;
    } else if (mode === "Eyear") {
      a.classList.add("ey");
      a.innerHTML = '<span class="t">' + mk(esc(o.label)) + '</span><span class="pips" aria-hidden="true">' + [...Array(o.rel.size)].map((_, j) => '<i style="--d:' + j + '"></i>').join("") + "</span>";
    } else if (mode === "Eabout") {
      a.classList.add("ea");
      a.innerHTML = '<span class="nr"><span class="t">' + esc(o.label) + '</span></span><span class="dk">' + esc(o.about.lede || "") + "</span>";
    } else if (mode === "Efig") {
      const m = /^([~$]?[\d][\d,.]*[%+MKx]*)(.*)$/.exec(clean(o.label)) || [0, clean(o.label), ""];
      const src = figSource(o.fig, o.key);
      a.classList.add("fig", "efig");
      a.innerHTML = '<span class="nr"><span class="t"><span class="fn">' + mk(D.esc(m[1])) + "</span>" + (m[2] ? '<span class="fu">' + D.esc(m[2]) + "</span>" : "") + "</span></span>" +
        (src.label ? '<span class="kk caps">' + esc(src.label) + "</span>" : "") + (src.html ? '<span class="dk">' + src.html + "</span>" : "") +
        (src.credit ? '<span class="cr caps">' + esc(src.credit) + "</span>" : "");
    } else if (mode === "Ecap") {
      a.classList.add("ecap");
      a.innerHTML = '<span class="t">' + esc(o.label) + '</span><sup class="cnt">' + o.rel.size + "</sup>";
    } else if (mode === "Etool") {
      const max = toolMax || Math.max(...G.tools.items.map((x) => x.rel.size));
      a.classList.add("etool");
      a.innerHTML = '<span class="er"><span class="t">' + esc(o.label) + '</span><span class="cnt">' + o.rel.size + '</span></span><span class="bar" aria-hidden="true"><i style="width:' +
        (o.rel.size / max * 100).toFixed(1) + '%"></i></span>';
    } else {
      a.innerHTML = '<span class="t">' + esc(o.label) + "</span>";
      if (g === "figures") a.classList.add("fig");
    }
    return a;
  };
  const headE = (n, id, name) => {
    const g = G[id];
    const h = el("h2", "eh", '<span><b>' + n + "</b>" + esc(name || g.name) + '</span><span class="n">' + g.items.length + "</span>");
    g.count = h.querySelector(".n");
    return h;
  };
  /* a run of entries set on as text, a middle dot between */
  const runE = (items, cls) => {
    const box = el("div", "erun" + (cls ? " " + cls : ""));
    items.forEach((o, j) => {
      const a = entryEl(o, "Erun"); if (o.label.length <= 22) a.classList.add("nw");
      const it = el("span", "it"); it.appendChild(a);
      if (j < items.length - 1) it.appendChild(el("span", "sep", "·"));
      box.appendChild(it); box.appendChild(document.createTextNode(" "));
    });
    return box;
  };
  /* a section of the contents: a group's entries, set by E, spanning some
     of the four columns */
  const cellE = (id, span, kids, cls) => {
    const c = el("section", "grp ec" + (cls ? " " + cls : "")); c.dataset.g = id; c.style.setProperty("--span", span);
    kids.filter(Boolean).forEach((k) => c.appendChild(k)); return c;
  };
  /* E is masonry now (27 Sept, his "what if we got rid of these gaps in
     the TOC so it felt more masonry and things were connected a bit
     more?"): four columns that each run on, with no row waiting for its
     tallest cell. The lines head the first column and the six lead
     studies the other three, two each, staggered; then Work, Years,
     About, Figures, Capabilities and Tools each go to whichever column is
     shortest when its turn comes (packE, measured), so the columns close
     up and end near one another. A phone reads the same blocks as one
     column in this order. */
  const buildE = () => {
    const wrap = el("div", "eg");
    ["vr1", "vr2", "vr3"].forEach((v) => wrap.appendChild(el("i", "vr " + v)));
    const mas = el("div", "emas"); wrap.appendChild(mas);
    const cols = [0, 1, 2, 3].map(() => { const c = el("div", "ecol"); mas.appendChild(c); return c; });
    let order = 0;
    const put = (node, ci) => { node.style.order = order++; if (ci != null) cols[ci].appendChild(node); else { node.classList.add("pk"); cols[0].appendChild(node); } return node; };

    /* 01 Lines, and each line's lead study as a feature */
    const lines = el("div", "elines"); G.lines.items.forEach((o) => lines.appendChild(entryEl(o, "Eline")));
    put(cellE("lines", 1, [headE("01", "lines"), lines], "c-lines"), 0);
    G.work.items.filter((o) => LEAD_OF[o.k]).sort((x, y) => LEAD_OF[x.k].i - LEAD_OF[y.k].i)
      .forEach((o, i) => { const c = cellE("work", 1, [entryEl(o, "Efeat")], "c-feat"); c.dataset.tx = "lead-" + LEAD_OF[o.k].l.tag; put(c, 1 + (i % 3)); });

    /* the rest, packed where there is room */
    /* the list counts down by the studies' numbers, so the column reads
       as a picture index does (27 Sept, the locators) */
    const wl = el("div", "elist"); G.work.items.filter((o) => !LEAD_OF[o.k]).sort((x, y) => D.num(y.k).localeCompare(D.num(x.k))).forEach((o) => wl.appendChild(entryEl(o, "Ework")));
    put(cellE("work", 1, [headE("02", "work"), wl]));
    const yl = el("div", "eyears"); G.years.items.forEach((o, i) => { const a = entryEl(o, "Eyear"); a.style.setProperty("--i", i); yl.appendChild(a); });
    put(cellE("years", 1, [headE("03", "years"), yl]));
    const al = el("div", "eabout"); G.about.items.forEach((o) => al.appendChild(entryEl(o, "Eabout")));
    put(cellE("about", 1, [headE("04", "about"), al]));
    const big = G.figures.items.filter((o) => BIGFIG.includes(o.label)).sort((x, y) => BIGFIG.indexOf(x.label) - BIGFIG.indexOf(y.label));
    const bl = el("div", "ebig"); big.forEach((o, i) => { const a = entryEl(o, "Efig"); a.style.setProperty("--i", i); bl.appendChild(a); });
    put(cellE("figures", 1, [headE("05", "figures"), bl, runE(G.figures.items.filter((o) => !big.includes(o)))]));
    const tc = featuredCaps(), tt = featuredTools();
    const cl = el("div", "ecaps"); tc.forEach((o, i) => { const a = entryEl(o, "Ecap"); a.style.setProperty("--d", i); cl.appendChild(a); });
    put(cellE("capabilities", 1, [headE("06", "capabilities"), cl, runE(G.capabilities.items.filter((o) => !tc.includes(o)))]));
    const tl = el("div", "etools"); tt.forEach((o, i) => { const a = entryEl(o, "Etool"); a.style.setProperty("--d", i); tl.appendChild(a); });
    put(cellE("tools", 1, [headE("07", "tools"), tl, runE(G.tools.items.filter((o) => !tt.includes(o)))]));
    return wrap;
  };
  /* where the blocks still to place go: every way of sending them to the
     four columns (each column keeps them in reading order) is tried, and
     the one whose tallest column is shortest wins, then the one whose
     columns end nearest one another. Six blocks over four columns is
     4,096 tries of simple sums, measured once. A phone reads them as one
     column, in order, so there it only puts them back */
  const packE = () => {
    const mas = IDX.querySelector(".emas"); if (!mas) return;
    const cols = [...mas.children];
    const rest = [...mas.querySelectorAll(".grp.ec.pk")].sort((a, b) => a.style.order - b.style.order);
    rest.forEach((b) => b.remove());
    if (phone()) { rest.forEach((b) => cols[0].appendChild(b)); return; }
    const gap = parseFloat(getComputedStyle(cols[0]).rowGap) || 0;
    const base = cols.map((c) => c.offsetHeight);
    const hs = rest.map((b) => { cols[0].appendChild(b); const h = b.offsetHeight; b.remove(); return h; });
    const n = rest.length, m = cols.length;
    let best = null;
    for (let code = 0; n <= 8 && code < m ** n; code++) {
      const H = base.slice(); let c = code;
      for (let i = 0; i < n; i++) { const ci = c % m; c = Math.floor(c / m); H[ci] += (H[ci] > 0 ? gap : 0) + hs[i]; }
      const mx = Math.max(...H), spread = mx - Math.min(...H);
      if (!best || mx < best.mx - 0.5 || (Math.abs(mx - best.mx) <= 0.5 && spread < best.spread)) best = { code, mx, spread };
    }
    let c = best ? best.code : 0;
    rest.forEach((b) => { const ci = best ? c % m : cols.indexOf(cols.reduce((x, y) => (y.offsetHeight < x.offsetHeight - 1 ? y : x), cols[0])); c = Math.floor(c / m); cols[ci].appendChild(b); });
  };
  /* ════════════════════════════════════════════════════════════════════
     INDEX F, THE BACK OF THE BOOK (27 Sept 2026, a lever pull). His
     "i want to keep 'pulling the lever'", with a catalogue's picture
     index (numbers and pages in columns), a magazine's A to Z index
     (a legend of kinds, each name with its page), 1/1 Studio's numbered
     index and Exe's related row beside it; and his own reading of the
     page, "a table of contents and an index mixed into one".

     So F is both, as a book has them: the contents first, the thirty
     studies counting down by number with their year and discipline; then
     the index, every line, capability, tool, figure and About section
     from A to Z under its letter, marked by kind with a shape (no
     colour), each with its locators the way a book gives page numbers:
     a study's number, or its number and section (26.02) where the index
     knows the place. A locator opens the study there; a name opens its
     shelf, as everywhere. Years are the contents' own column.
     ════════════════════════════════════════════════════════════════════ */
  const KIND = { lines: ["\u25C6", "Line"], capabilities: ["\u25CF", "Capability"], tools: ["\u25CB", "Tool"], figures: ["\u25A0", "Figure"], about: ["\u25B2", "About"] };
  /* an entry's locators: each of its studies once, oldest first, at the
     sections the index knows, else the study alone */
  const locatorsF = (o) => {
    if (!o.rel) return [];
    const ks = [...o.rel].filter((k) => D.study(k)).sort((a, b) => D.num(a).localeCompare(D.num(b)));
    const out = [];
    ks.forEach((k) => {
      const ls = ["capabilities", "tools", "figures"].includes(o.g.id) ? locsOf(o, k) : [];
      if (ls.length) ls.forEach((l) => out.push({ k, at: l.at, t: D.num(k) + "." + l.s }));
      else out.push({ k, at: null, t: D.num(k) });
    });
    return out;
  };
  const entryF = (o, mode, a) => {
    if (mode === "Fwork") {
      const s = D.study(o.k) || {};
      a.classList.add("w", "fw");
      a.innerHTML = '<span class="fn">' + D.num(o.k) + '</span><span class="fy">' + D.year(o.k) + '</span><span class="fx"><span class="t">' + esc(o.label) + "</span>" +
        (s.s ? '<span class="fd">' + esc(s.s) + "</span>" : "") + "</span>";
      return a;
    }
    const kind = KIND[o.g.id] || ["", ""];
    a.classList.add("ft");
    const ls = locatorsF(o);
    a.innerHTML = '<span class="fk" title="' + kind[1] + '">' + kind[0] + '</span><span class="fx"><span class="t">' + esc(nameOf(o)) + "</span>" +
      (ls.length ? '<span class="fl">' + ls.map((l) => '<span class="floc" data-k="' + D.esc(l.k) + '"' + (l.at ? ' data-at="' + D.esc(l.at) + '"' : "") + ' title="' + esc(D.title(l.k)) + '">' + l.t + "</span>").join(", ") + "</span>" : "") + "</span>";
    return a;
  };
  const headF = (n, name, count) => el("h2", "fh", "<span><b>" + n + "</b>" + esc(name) + '</span><span class="n">' + count + "</span>");
  const buildF = () => {
    const wrap = el("div", "fg");
    wrap.appendChild(el("div", "flegend caps", Object.values(KIND).map(([m, n]) => "<span><i>" + m + "</i>" + n + "</span>").join("")));
    const body = el("div", "fbody");
    /* 01 Contents: the studies, counting down by number */
    const con = el("section", "grp fcon"); con.dataset.g = "work";
    con.appendChild(headF("01", "Contents", G.work.items.length));
    const rows = el("div", "frows");
    G.work.items.slice().sort((x, y) => D.num(y.k).localeCompare(D.num(x.k))).forEach((o) => rows.appendChild(entryEl(o, "Fwork")));
    con.appendChild(rows); body.appendChild(con);
    /* 02 Index: everything else, A to Z, under its letter */
    const terms = ["lines", "capabilities", "tools", "figures", "about"].flatMap((g) => G[g].items);
    const sortKey = (o) => clean(nameOf(o)).toLowerCase().replace(/^[^a-z0-9]+/, "");
    terms.sort((x, y) => sortKey(x).localeCompare(sortKey(y), "en", { numeric: true }));
    const idx = el("section", "grp findex"); idx.dataset.g = "index";
    idx.appendChild(headF("02", "Index", terms.length));
    const cols = el("div", "fcols");
    let letter = null, block = null;
    terms.forEach((o) => {
      const c = sortKey(o).charAt(0); const L = /[a-z]/.test(c) ? c.toUpperCase() : "0\u20139";
      if (L !== letter) { letter = L; block = el("div", "fblock"); block.appendChild(el("div", "flh", L)); cols.appendChild(block); }
      block.appendChild(entryEl(o, "Fterm"));
    });
    idx.appendChild(cols); body.appendChild(idx);
    wrap.appendChild(body);
    return wrap;
  };
  const LAYOUT = {
    a: () => [section("lines", "row"), section("work", "sheet"), section("figures", "wall"),
      block("fine", [section("about", "list"), section("years", "run"), section("capabilities", "run"), section("tools", "run")])],
    b: () => [section("lines", "inline"), section("work", "inline"), section("about", "run"), section("years", "run"),
      section("figures", "run"), section("capabilities", "run"), section("tools", "run")],
    c: () => [section("lines", "word"), section("work", "tile"),
      block("fine", [section("about", "list"), section("years", "run"), section("figures", "run"), section("capabilities", "run"), section("tools", "run")])],
    d: () => [block("dcols", [section("lines", "dline"), section("work", "dwork"), section("about", "list"), section("years", "run"),
      section("capabilities", "run"), section("tools", "run"), section("figures", "dfig")])],
    e: () => [buildE()],
    f: () => [buildF()],
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
    /* E's second switch: how an entry takes the ink */
    if (IX === "e") top.appendChild(el("div", "ixsw mksw caps", '<span class="ixl">Mark</span>' + MKS.map((x) => '<a href="?mark=' + x + '" data-mk="' + x + '"' + (x === MK ? ' class="on" aria-current="true"' : "") + ">" + x + "</a>").join("")));
    /* and its third: the texture, one to a section */
    if (IX === "e") top.appendChild(el("div", "ixsw txsw caps", '<span class="ixl">Texture</span>' + TXS.map((x) => '<a href="?texture=' + x + '" data-tx="' + x + '"' + (x === TX ? ' class="on" aria-current="true"' : "") + ">" + x + "</a>").join("")));
    /* and its fourth: how a room and a shelf come in (MOTS below) */
    if (IX === "e") top.appendChild(el("div", "ixsw mosw caps", '<span class="ixl">Motion</span>' + MOTS.map((x) => '<a href="?motion=' + x + '" data-mo="' + x + '"' + (x === MOT ? ' class="on" aria-current="true"' : "") + ">" + x + "</a>").join("")));
    IDX.appendChild(top);
    LAYOUT[IX]().filter(Boolean).forEach((n) => IDX.appendChild(n));
    /* in D the mark and the switch head the first column only, as the
       first version's mark did, so the other three run to the top */
    const cols = IX === "d" && IDX.querySelector(".dcols");
    if (cols) cols.insertBefore(top, cols.firstChild);
    wireTextures();
  };
  const setIndex = (x) => {
    if (x === IX || !IXS.includes(x)) return;
    IX = x; HTML.dataset.ix = x;
    const u = new URL(location.href); u.searchParams.set("index", x);
    history.replaceState(history.state, "", u.pathname + u.search + u.hash);
    buildIndex(); fit(true);
    paint(painted[0], painted[1]);
    if (locked && locked.a) locked.a.classList.add("lock");
    clearWires();
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
  /* E: the list type is fixed; the lines' names are sized so the longest
     fills its column beside nothing, as the contents page's largest words */
  const fitE = () => {
    const root = HTML.style;
    root.setProperty("--fs", phone() ? "12px" : "11px");
    const ls = [...IDX.querySelectorAll(".e.el")]; if (!ls.length) return;
    root.setProperty("--fl", "100px");
    const w = Math.max(...ls.map((a) => a.querySelector(".t").offsetWidth));
    const room = ls[0].clientWidth;
    root.setProperty("--fl", Math.floor(Math.min(phone() ? 34 : 34, (room / w) * 100 * 0.97) * 4) / 4 + "px");
  };
  const sizeIndex = () => {
    const root = HTML.style;
    root.removeProperty("--ts"); root.removeProperty("--lw"); root.removeProperty("--gc");
    root.removeProperty("--fs"); root.removeProperty("--fl"); root.removeProperty("--cols");
    if (IX === "e") { fitE(); packE(); }
    else if (IX === "d") fitD();
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
    if (fresh || stack !== was || !tio) { watchThumbs(); watchSeen(); }
  };

  /* ── the cross-reference: how what shares a study is marked. Ink, a
     black band, is the default (27 Sept); ?mark=dim keeps the old grey ── */
  const QMARK = (new URLSearchParams(location.search).get("mark") || "").toLowerCase();
  const MARKMODE = QMARK === "dim" ? "dim" : "ink";
  HTML.dataset.mark = MARKMODE;
  /* how E's entries take the ink (27 Sept, his "the black bars behind the
     text are nice but the padding is so tight it looks off ... editorial
     meets tech/system design?"). Three settings on a switch by the index's:
     - cell, the default: the band fills the entry's cell of the grid, rule
       to rule, the way a system marks a selected row. The gutter is its
       padding, so the words never move and never crowd its edges;
     - bar: the band on the words, as before, given room to breathe;
     - node: no band. A square sits on the column's rule beside the entry,
       a point on an axis, and a rule of ink draws under its name;
     - grey, the default since his "could we try the cell in a grey AND
       keep the node? but maybe the node is a circle vs a square?" (27
       Sept): the cell's fill in a light grey, the words staying ink, and
       a circle of ink on the rule at the row's left edge.
     The runs of capabilities, tools and figures stay bold in all four. */
  const MKS = ["grey", "cell", "bar", "node"], MK_LS = "crossref2.mark";
  const lsMk = () => { try { return localStorage.getItem(MK_LS); } catch (e) { return null; } };
  let MK = MKS.includes(QMARK) ? QMARK : QMARK === "ink" ? "bar" : MKS.includes(lsMk()) ? lsMk() : "grey";
  HTML.dataset.mk = MK;
  const setMark = (x) => {
    if (!MKS.includes(x) || x === MK) return;
    MK = x; HTML.dataset.mk = x;
    try { localStorage.setItem(MK_LS, x); } catch (e) { /* private window */ }
    const u = new URL(location.href); u.searchParams.set("mark", x);
    history.replaceState(history.state, "", u.pathname + u.search + u.hash);
    IDX.querySelectorAll(".mksw a").forEach((a) => { const on = a.dataset.mk === x; a.classList.toggle("on", on); if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
  };

  /* ── the texture, one to a section (27 Sept). The first pass laid one
     texture under the whole index, from his "what if we tried a super
     subtle texture in the background of the nav panels? ... ascii type
     design...not colored like what i attached but the patterns
     themselves" (he attached a grid of full stops, a wall of base64 and a
     grid of plus signs, all typed). Then his "i was kinda thinking each
     section was unique - lines is one ..., ivy park has one, capabilities
     has one, arc, etc, etc. probably a little more subtle for all and
     just contain it to that specific section, no spilling out of the
     left and right into the gutters". So each of E's sections carries a
     pattern of its own, set in type (10px mono, on cells 6 wide and 12
     tall) and drawn into a canvas inside the section: exactly its
     measure, half a line over and under, centred so both edges keep the
     same margin, never into a gutter. Each pattern is picked for what
     its section holds:
     - What I make (the six lines): the house's asterisk;
     - Digital's lead, Ivy Park: this page's own source, as an editor
       shows it, indented and cut off at the edge, a site being code;
     - Apps' lead, A.R.C.: its own sentences in base64, an app being code;
     - Systems' lead, Sally OS: registration crosses;
     - Campaigns' lead, Robert Rodriguez: polka dots on a half drop, after
       the dress in its hero picture;
     - Branding's lead, Amber Shockey Co.: a floret in a half-drop
       repeat, the way a tableware pattern is built;
     - Interiors' lead, the Hill Country kitchen: tiles in brackets, laid
       in a running bond;
     - Work: full stops on a 12px grid, the quietest, for the longest list;
     - Years: the years themselves, in binary;
     - About: weather, a character a cell from a slow noise field;
     - Figures: their own numbers, set as a ledger;
     - Capabilities: cross stitch;
     - Tools: the marks code is made of.
     All ink at a few percent, fainter than the first pass. Then his
     "make it the default so it's always on" and "let's pick something
     different for Ivy Park and the long lines - maybe some sort of ascii
     code type of look mixed into some of them?": the patterns drawn as
     long lines (scan lines, a trellis, a hatch, tally marks) became the
     four above, two of them code. On by default; ?texture=none or the
     row under Mark turns it off, kept in localStorage under a new key so
     a "none" from the first round does not hide it. ── */
  const TXS = ["none", "on"], TX_LS = "crossref2.texture2";
  const QTX = (new URLSearchParams(location.search).get("texture") || "").toLowerCase();
  const lsTx = () => { try { return localStorage.getItem(TX_LS); } catch (e) { return null; } };
  let TX = TXS.includes(QTX) ? QTX : TXS.includes(lsTx()) ? lsTx() : "on";
  HTML.dataset.tx = TX;
  const toB64 = (s) => {
    const u = new TextEncoder().encode(s); let bin = "";
    for (let i = 0; i < u.length; i += 8192) bin += String.fromCharCode.apply(null, u.subarray(i, i + 8192));
    return btoa(bin);
  };
  /* the weather: value noise in two octaves, on a fixed seed, so it is the
     same on every visit */
  const hash2 = (x, y) => { let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) ^ 0x5bd1e995; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };
  const ease3 = (t) => t * t * (3 - 2 * t);
  const noise = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = ease3(x - xi), yf = ease3(y - yi);
    const a = hash2(xi, yi), b = hash2(xi + 1, yi), c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
  };
  const RAMP = " .:-=+*#", CODE = "{}[]<>();=/";
  const mod = (a, n) => ((a % n) + n) % n;
  /* a lead study's own sentences, and the figures' own numbers */
  const WORDS64 = new Map();
  const words64 = (sec) => {
    const a = sec.querySelector(".e[data-i]"), o = a && ENTRIES[+a.dataset.i]; if (!o || !o.k) return "";
    if (!WORDS64.has(o.k)) WORDS64.set(o.k, toB64(D.byStudy(o.k).filter((f) => f.kind === "line").map((f) => f.text).join(" ").slice(0, 6000)));
    return WORDS64.get(o.k);
  };
  const ledger = () => G.figures.items.map((o) => (o.label.replace(/,/g, "").match(/\d+(?:\.\d+)?/) || [])[0]).filter(Boolean);
  /* this page's own source: the functions that build and draw E, their
     comments taken out, blank lines closed up, indents kept */
  let SRC = null;
  const source = () => SRC || (SRC = [buildE, packE, drawSec, cellE, headE, runE].map(String).join("\n")
    .replace(/\/\*[\s\S]*?\*\//g, "").split("\n").map((l) => l.replace(/\s+$/, "")).filter((l) => l.trim()));
  const binYears = () => G.years.items.map((o) => parseInt(o.label, 10)).filter((y) => y > 0).map((y) => y.toString(2));
  /* a floret, five cells by three, for the half-drop repeat */
  const FLORET = ["  o  ", "o . o", "  o  "];
  /* a pattern is a lattice (one mark every p pixels, the lattice centred
     in the box, every other row shifted half a step for a half drop), or
     a character, or none, for each 6 by 12 cell */
  const PAT = {
    lines: { a: 0.09, p: [24, 24], ch: "*" },
    "lead-digital": { a: 0.04, code: true },
    "lead-app": { a: 0.025, text: words64 },
    "lead-systems": { a: 0.08, p: [24, 24], ch: "+" },
    "lead-creative": { a: 0.055, p: [18, 18], half: true, ch: "•" },
    "lead-branding": { a: 0.06, cell: (i, j) => { const c = Math.floor(i / 8), r = mod(j - (mod(c, 2) ? 2 : 0), 4), k = mod(i, 8); return r < 3 && k < 5 ? FLORET[r][k] : null; } },
    "lead-interiors": { a: 0.04, cell: (i, j) => "[  ]"[mod(i + (mod(j, 2) ? 2 : 0), 4)] },
    work: { a: 0.11, p: [12, 12], ch: "." },
    years: { a: 0.04, binary: true },
    about: { a: 0.04, field: true },
    figures: { a: 0.03, ledger: true },
    capabilities: { a: 0.06, p: [12, 24], half: true, ch: "x" },
    tools: { a: 0.045, cell: (i, j) => (hash2(i + 11, j + 101) < 0.2 ? CODE[Math.floor(hash2(i + 7, j + 3) * CODE.length) % CODE.length] : null) },
  };
  const PADV = 8;
  const drawSec = (sec) => {
    let cv = sec.querySelector(":scope > canvas.stx");
    const pat = PAT[sec.dataset.tx || sec.dataset.g];
    if (TX === "none" || !pat) { if (cv) cv.remove(); return; }
    if (!cv) { cv = el("canvas", "stx"); cv.setAttribute("aria-hidden", "true"); sec.insertBefore(cv, sec.firstChild); }
    const W = sec.clientWidth, H = sec.clientHeight + PADV * 2;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const key = W + "," + H + "," + dpr; if (cv._k === key) return; cv._k = key;
    if (!W || !H) return;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    const g = cv.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.font = "10px " + (getComputedStyle(HTML).getPropertyValue("--mono").trim() || "monospace");
    g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#000"; g.globalAlpha = pat.a;
    if (pat.p) {
      const [px, py] = pat.p, half = pat.half ? px / 2 : 0;
      const nx = Math.max(1, Math.floor((W - 6 - half) / px) + 1), ny = Math.max(1, Math.floor((H - 12) / py) + 1);
      const x0 = (W - (nx - 1) * px - half) / 2, y0 = (H - (ny - 1) * py) / 2;
      for (let l = 0; l < ny; l++) for (let k = 0; k < nx; k++) g.fillText(pat.ch, x0 + k * px + (l % 2 ? half : 0), y0 + l * py);
      return;
    }
    const CW = 6, LH = 12, cols = Math.floor(W / CW), rows = Math.floor(H / LH);
    const ox = (W - cols * CW) / 2 + CW / 2, oy = (H - rows * LH) / 2 + LH / 2;
    const put = (i, j, ch) => { if (ch && ch !== " ") g.fillText(ch, ox + i * CW, oy + j * LH); };
    if (pat.text) {
      const s = pat.text(sec); if (!s) return;
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) put(i, j, s[(j * cols + i) % s.length]);
    } else if (pat.ledger) {
      const nums = ledger(); if (!nums.length) return;
      for (let j = 0; j < rows; j++) {
        let row = "", k = j * 3; while (row.length < cols) row += nums[k++ % nums.length].padStart(7, " ");
        for (let i = 0; i < cols; i++) put(i, j, row[i]);
      }
    } else if (pat.code) {
      const src = source();
      for (let j = 0; j < rows; j++) { const l = src[(j + 3) % src.length]; for (let i = 0; i < cols && i < l.length; i++) put(i, j, l[i]); }
    } else if (pat.binary) {
      const bins = binYears(); if (!bins.length) return;
      for (let j = 0; j < rows; j += 2) {
        let row = "", k = j / 2; while (row.length < cols) row += bins[k++ % bins.length] + " ";
        for (let i = 0; i < cols; i++) put(i, j, row[i]);
      }
    } else if (pat.field) {
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const x = i * CW, y = j * LH;
        const n = 0.65 * noise(x / 70 + 5, y / 70 + 9) + 0.35 * noise(x / 28 + 17, y / 28 + 31);
        const v = Math.max(0, Math.min(1, (n - 0.38) / 0.62));
        put(i, j, RAMP[Math.min(RAMP.length - 1, Math.floor(Math.pow(v, 1.5) * RAMP.length))]);
      }
    } else for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) put(i, j, pat.cell(i, j));
  };
  /* each section is drawn when it is built, and again whenever its size
     moves (a column narrows, a font arrives) */
  let txRO = null;
  const wireTextures = () => {
    if (txRO) txRO.disconnect();
    const secs = [...IDX.querySelectorAll(".grp.ec")];
    if (TX !== "none" && !txRO && "ResizeObserver" in window) txRO = new ResizeObserver((es) => es.forEach((e) => drawSec(e.target)));
    secs.forEach((s) => { drawSec(s); if (TX !== "none" && txRO) txRO.observe(s); });
  };
  const setTexture = (x) => {
    if (!TXS.includes(x) || x === TX) return;
    TX = x; HTML.dataset.tx = x;
    try { localStorage.setItem(TX_LS, x); } catch (e) { /* private window */ }
    const u = new URL(location.href); u.searchParams.set("texture", x);
    history.replaceState(history.state, "", u.pathname + u.search + u.hash);
    IDX.querySelectorAll(".txsw a").forEach((a) => { const on = a.dataset.tx === x; a.classList.toggle("on", on); if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
    wireTextures();
  };
  /* ── MOTION (27 Sept, his "maybe before we do we do some animation
     explorations? ... put together 5-6 different animations options for
     the text, images, etc. since we're more of an editorial interface
     interactive TOC - what type of animations would work better - fit
     more style wise?"). Six families on one switch, the room's in
     study-panel.js (above FAM) and css, a shelf's pictures here in
     XREF_IN. Wipe is the default since his pick ("wipe is awesome!",
     27 Sept), under a new localStorage key so an earlier pick from the
     six does not hide it; ?motion= or the row under Texture changes it.
     Choosing one, or the one already chosen, plays what is on screen
     again ── */
  const MOTS = ["rise", "set", "wipe", "focus", "cut", "scrub"], MOT_LS = "crossref2.motion2";
  const QMO = (new URLSearchParams(location.search).get("motion") || "").toLowerCase();
  const lsMo = () => { try { return localStorage.getItem(MOT_LS); } catch (e) { return null; } };
  let MOT = MOTS.includes(QMO) ? QMO : MOTS.includes(lsMo()) ? lsMo() : "wipe";
  HTML.dataset.motion = MOT;
  const setMotion = (x) => {
    if (!MOTS.includes(x)) return;
    if (x !== MOT) {
      MOT = x; HTML.dataset.motion = x;
      try { localStorage.setItem(MOT_LS, x); } catch (e) { /* private window */ }
      const u = new URL(location.href); u.searchParams.set("motion", x);
      history.replaceState(history.state, "", u.pathname + u.search + u.hash);
      IDX.querySelectorAll(".mosw a").forEach((a) => { const on = a.dataset.mo === x; a.classList.toggle("on", on); if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
    }
    if (VIEW.v === "study" && RM && RM.room && RM.room.replay) RM.room.replay();
    else if (SH && SH.visible) shelfEnter(SH, {});
  };
  /* a shelf's opener and its head, in the family's terms; null keeps the
     layout's own (rise, and scrub, which has no clock to give a shelf) */
  window.XREF_IN = (words) => {
    const IN = "cubic-bezier(0.45, 0, 0.2, 1)";
    switch (MOT) {
      case "set": return words
        ? { kf: [{ clipPath: "inset(-20% 100% -20% 0)" }, { clipPath: "inset(-20% 0 -20% 0)" }], dur: 560, ease: "linear" }
        : { kf: [{ clipPath: "inset(50% 0 50% 0)" }, { clipPath: "inset(0 0 0 0)" }], dur: 800, ease: "cubic-bezier(0.7, 0, 0.15, 1)" };
      case "wipe": return words
        ? { kf: [{ clipPath: "inset(-20% 100% -20% 0)" }, { clipPath: "inset(-20% 0 -20% 0)" }], dur: 420, ease: IN }
        : { kf: [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], dur: 640, ease: IN };
      case "focus": return words
        ? { kf: [{ opacity: 0, filter: "blur(6px)" }, { opacity: 1, filter: "blur(0px)" }], dur: 800, ease: "ease-out" }
        : { kf: [{ opacity: 0, filter: "blur(14px)", transform: "scale(1.04)" }, { opacity: 1, filter: "blur(0px)", transform: "none" }], dur: 1000, ease: "cubic-bezier(0.16, 1, 0.3, 1)" };
      case "cut": return { kf: [{ opacity: 0 }, { opacity: 1 }], dur: 90, ease: "steps(1, end)", step: 1.6 };
      default: return null;
    }
  };
  const meets = (a, b) => { for (const k of a) if (b.has(k)) return true; return false; };
  let lit = [], painted = [null, null];
  const paint = (rel, me) => {
    painted = [rel, me];
    document.body.classList.toggle("x", !!rel);
    lit = [];
    /* a line never lights the other lines: every one of them shares a
       study with Digital, so the names went solid black and said nothing */
    const lineMe = !!me && me.g && me.g.id === "lines";
    ENTRIES.forEach((x) => {
      /* an entry a version does not set (F leaves years to its contents) */
      if (!x.a) return;
      const on = !!rel && (x === me || (meets(x.rel, rel) && !(lineMe && x.g && x.g.id === "lines")));
      x.a.classList.toggle("on", on); x.a.classList.toggle("me", !!me && x === me);
      if (on && x !== me) lit.push(x);
    });
    /* a line's strip lights picture by picture: only the studies in play */
    STRIPS.forEach((s) => s.classList.toggle("hit", !!rel && rel.has(s.dataset.k)));
    GROUPS.forEach((g) => {
      if (!g.count) return;
      if (!rel) { g.count.textContent = g.items.length; return; }
      const n = g.items.filter((x) => x.a && x.a.classList.contains("on")).length;
      g.count.innerHTML = "<b>" + n + "</b>/" + g.items.length;
    });
  };
  let locked = null;
  const lockEntry = (o) => { if (locked && locked.a) locked.a.classList.remove("lock"); locked = o || null; if (locked && locked.a) locked.a.classList.add("lock"); };

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
    /* Faux Reel runs instead, in the still's own shape: its frames are
       1600 wide, so it may be drawn up to 800, where the still stopped */
    if (liveOf(f)) {
      const rw = Math.floor(Math.min(w, 800)), rb = el("div", "pic");
      rb.style.width = rw + "px"; rb.style.height = Math.round(rw / ratio(f)) + "px";
      liveReel(f, rb); return rb;
    }
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

  /* ── THE OPEN HALF, FILLED (27 Sept). A picture fills the half only if
     it has the pixels: its drawn width under cover, max(width, height x
     its ratio), is no more than half its own. The size is the half's own
     at the moment it shows, less a strip for the caption; a phone keeps
     the band it has ── */
  const drawnOf = (f, W, H) => Math.max(W, H * ratio(f));
  const honestAt = (f, W, H) => !!f && !f.alpha && f.w / 2 >= drawnOf(f, W, H) * 0.985;
  const FILLCAP = 58;
  const fillWH = () => ({ W: STAGE.clientWidth, H: innerHeight - FILLCAP });
  /* the tiles of a mosaic: two side by side, three as one tall beside two
     stacked, four as a square of four; widths follow the pictures a little */
  const tilesOf = (n, W, H) => {
    if (n === 2) { const a = Math.round(W * 0.56); return [[0, 0, a, H], [a, 0, W - a, H]]; }
    if (n === 3) { const a = Math.round(W * 0.58), h = Math.round(H / 2); return [[0, 0, a, H], [a, 0, W - a, h], [a, h, W - a, H - h]]; }
    const a = Math.round(W / 2), h = Math.round(H * 0.54); return [[0, 0, a, h], [a, 0, W - a, h], [0, h, a, H - h], [a, h, W - a, H - h]];
  };
  const resolveFill = (it) => {
    if (phone()) return null;
    const { W, H } = fillWH(); if (W < 300 || H < 300) return null;
    if (it.t === "bleed") {
      /* the study's own picture first if it has the pixels, else its largest that does */
      const pool = it.pool.slice(0, 1).concat(it.pool.slice(1).sort((a, b) => b.w - a.w));
      const f = pool.find((x) => honestAt(x, W, H));
      return f ? { t: "bleed", f, k: it.k } : null;
    }
    /* a mosaic: each tile its picture, or another of the same study that
       has the pixels, or it leaves; under two tiles it is a cluster again */
    let pics = it.pics.slice(0, 4);
    for (let n = pics.length; n >= 2; n--) {
      const T = tilesOf(n, W, H), out = [];
      pics.slice(0, n).forEach((p, i) => {
        const t = T[i]; if (!t) return;
        const f = [p.f].concat(p.k ? picsOf(p.k).filter((x) => !x.alpha).sort((a, b) => b.w - a.w) : []).find((x) => honestAt(x, t[2], t[3]));
        if (f) out.push({ f, k: p.k || f.k });
      });
      if (out.length === n) return { t: "mosaic", tiles: out, title: it.title, sub: it.sub, k: it.k };
      if (out.length >= 2) pics = out;
    }
    return null;
  };
  /* ── Faux Reel runs (27 Sept, his "then for 'faux reel' let's make it
     function vs just being static"). The study is a tool that cuts stills
     fast enough to read as motion, and its only picture here was a still
     of it; the board already lets its tile run. So wherever that picture
     would stand (a shelf in any layout, the focus, its room's cover) the
     product stands instead: <sizzle-reel>, from /lab/sizzle-reel.js,
     playing its own default cut, the seven frames and five colours
     src/data/sizzle-case-study.ts names (RANGE_IMAGES, RANGE_COLORS).
     The frames are made 1600 wide for it (thumbs/reel/), so a reel across
     the stage is still drawn at half its pixels. It pauses off screen and
     holds still under reduced motion on its own. A layout asks with
     window.XREF_LIVE(f) and mounts with XREF_LIVE(f, box) ── */
  const LIVE = {
    sizzle: {
      frames: [
        "nordstrom-personalization-system-design-woman-model-blue-floral-print-dress-black-white-geometric-strappy-heels-yellow-sofa-editorial",
        "hill-country-bath-vanity-marble-globe-sconces-sage",
        "nordstrom-content-framework-lockup-whats-now",
        "hill-country-kitchen-island-pendants-marble-wide",
        "hill-country-oakworks-outdoor-banner-whiskey-barrels-colorful-background-tree-texas-born-oakcraft",
        "j-christianson-storefront-tree-stripe-window-mockup",
        "capitan-boot-co-western-original-buffalo-silhouette-desert-landscape-mesa-mountains-sage-brush-terrain-branding-campaign",
      ].map((n) => "/lab/density/thumbs/reel/" + n + "@1600.webp"),
      colors: ["#0AA7CA", "#181B17", "#776549", "#F5EAE7", "#8A8784"],
    },
  };
  const liveOf = (f) => (f && f.lead && LIVE[f.k] && window.customElements && customElements.get("sizzle-reel") ? LIVE[f.k] : null);
  const liveReel = (f, box) => {
    const L = liveOf(f); if (!L || !box) return L;
    const r = document.createElement("sizzle-reel"); r.className = "live";
    r.setAttribute("images", L.frames.join(", "));
    r.setAttribute("colors", L.colors.join(", "));
    box.appendChild(r); box.classList.add("in", "reel");
    return r;
  };
  window.XREF_LIVE = liveReel;

  /* a picture cropped to a box, its rung chosen by the size it is drawn at
     under cover; the preview first, the honest file a beat later */
  const coverBox = (f, W, H) => {
    const box = el("div", "pic cov"); box.style.width = Math.round(W) + "px"; box.style.height = Math.round(H) + "px";
    if (liveOf(f)) { liveReel(f, box); return box; }
    const want = D.rung(f, drawnOf(f, W, H)), quick = f.t768 || f.t384;
    const add = (src) => { const im = el("img"); im.alt = f.alt || ""; im.decoding = "async"; im.src = encodeURI(src); box.appendChild(im); return im; };
    if (quick && quick !== want) {
      const pv = add(quick);
      timers.push(setTimeout(() => {
        if (!box.isConnected) return;
        const im = add(want); im.classList.add("hi");
        im.addEventListener("load", () => { im.classList.add("in"); setTimeout(() => pv.remove(), 320); }, { once: true });
      }, 220));
    } else add(want);
    return box;
  };

  /* ── the focus renderers: one thing, as large as it honestly goes ── */
  const V = {
    bleed(main, W, H, it) { const b = coverBox(it.f, W, H); b.classList.add("fillpic"); main.appendChild(b); },
    /* the shelf the entry opens, built in the open half as the stage would
       hold it: its running head, its layout, its foot. A click hands this
       very shelf to the stage (promote), so nothing loads again, moves or
       plays twice */
    shelf(main, W, H, it) {
      const P = buildShelf(it.o, false, { host: main, pv: true });
      main.parentNode._pv = P;
      shelfEnter(P, { delay: 0 });
    },
    mosaic(main, W, H, it) {
      const wrap = el("div", "mos"); wrap.style.width = W + "px"; wrap.style.height = H + "px";
      tilesOf(it.tiles.length, W, H).forEach(([x, y, w, h], i) => {
        const p = it.tiles[i];
        const t = el("div", "tile"); t.style.cssText = "left:" + x + "px;top:" + y + "px;width:" + w + "px;height:" + h + "px;--i:" + i;
        t.appendChild(coverBox(p.f, w, h));
        if (!it.k && p.k && D.study(p.k)) t.appendChild(el("div", "tc", '<span class="t">' + esc(D.title(p.k)) + '</span> <span class="y">' + D.year(p.k) + "</span>"));
        t.dataset.k = p.k || ""; wrap.appendChild(t);
      });
      main.appendChild(wrap);
    },
    rest(main, W, H) {
      const st = DATA.statement || {};
      const wrap = el("div", "rest");
      if (DATA.practice && DATA.practice.length) wrap.appendChild(el("div", "caps prac", DATA.practice.map((p) => "<span>" + esc(p) + "</span>").join("")));
      /* the board's two-tone lead: his first sentence in ink, the rest in
         grey, one size and one weight */
      const say = el("div", "say", esc(st.ink) + (st.grey ? ' <span class="g">' + esc(st.grey) + "</span>" : "")); wrap.appendChild(say);
      if (DATA.links) wrap.appendChild(el("div", "links", DATA.links.map((l) => '<a href="' + D.esc(l.v) + '">' + esc(l.k) + "</a>").join("")));
      main.appendChild(wrap);
      /* the folio (27 Sept, the editorial pass): the half at rest is the
         cover, so its head carries the index's own counts, as a cover
         carries its lines. Counted here, never typed */
      const ys = DATA.studies.map((x) => +x.y).filter(Boolean);
      const lay = main.parentNode;
      if (lay && !phone() && ys.length) {
        const f = el("div", "caps folio", ["work", "lines", "figures"].map((id) => "<span>" + esc(G[id].name) + " <b>" + G[id].items.length + "</b></span>").join("") +
          "<span>" + Math.min(...ys) + "\u2013" + Math.max(...ys) + "</span>");
        lay.appendChild(f);
      }
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
      /* the picture of the study the figure comes from, over it (his "an
         image with these", 27 Sept). A figure from About names no one
         study, so it stands alone rather than borrow a guessed picture */
      const k = !it.about && it.k && D.study(it.k) ? it.k : null, pf = k ? faceOf(k) : null;
      let top = null;
      if (pf) {
        const ph = Math.min(H * 0.4, 320);
        top = el("div", "figpic");
        top.appendChild(picture(pf, Math.min(W * 0.52, ph * ratio(pf))));
        top.appendChild(el("div", "cc", '<span class="t">' + esc(D.title(k)) + '</span> <span class="y">' + D.year(k) + "</span>"));
        wrap.appendChild(top);
      }
      const big = el("div", "big", esc(it.fig)); wrap.appendChild(big);
      let under = null;
      if (it.sent) under = el("p", "sent", hl(it.sent, it.fig));
      else if (it.label) under = el("p", "lbl", '<span class="caps">' + esc(it.label) + "</span>" + (it.sub ? '<span class="g">' + esc(it.sub) + "</span>" : ""));
      if (under) wrap.appendChild(under);
      main.appendChild(wrap);
      const uh = (under ? under.offsetHeight + 24 : 0) + (top ? top.offsetHeight + 30 : 0);
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
  /* what a hover shows. A line, a year or a capability shows the shelf a
     click on it opens, as it will be (27 Sept, his "on hover instead of
     loading this grid let's just load the stack - it's one less variable
     and consistent with what the user will end up seeing anyways"). Then
     tools and figures too (27 Sept, later, his "in the 'Tools' section
     when you hover the images it loads arent full width - in fact the
     hover and the 'click' experience are different ... let's keep it
     consistent"), and About with them, whose shelf is set the same way.
     Every kind now; a phone keeps its band */
  const PREVIEWED = new Set(["lines", "years", "capabilities", "tools", "figures", "about"]);
  const reelOf = (o) => (!phone() && PREVIEWED.has(o.g.id) && shelfIds().length ? o._sv || (o._sv = [{ t: "shelf", o }]) : o.reel());
  const itemOf = () => {
    const reel = cur ? reelOf(cur.o) : [];
    return { reel, it: cur && reel.length ? reel[(cur.n % reel.length + reel.length) % reel.length] : { t: "rest" } };
  };
  const render = () => {
    let { reel, it } = itemOf();
    timers.forEach(clearTimeout); timers = [];
    const old = layerOf();
    if (old) {
      old.classList.add("out");
      /* a preview the pointer has left loads nothing more, though it stays
         on the glass through its fade */
      if (old._pv && old._pv.pv) old._pv.gone = true;
      /* a preview that became the shelf has left this layer; one that did
         not goes with it */
      setTimeout(() => { old.remove(); const P = old._pv; if (P && P.pv) destroyShelf(P); }, 200);
    }
    if (it.t === "bleed" || it.t === "mosaic") it = resolveFill(it) || it.fallback || { t: "rest" };
    const full = it.t === "bleed" || it.t === "mosaic" || it.t === "shelf";
    const layer = el("div", "layer" + (full ? " bleed" : "") + (it.t === "shelf" ? " pvl" : "")); const main = el("div", "main"); const cap = el("div", "cap");
    layer.appendChild(main); layer.appendChild(cap); FOCUS.appendChild(layer);

    /* a line no longer fills the open half with its colour (27 Sept): its
       studies and its name sit on paper, in ink, like everything else.
       At rest the half is black and his statement is set light on it (27
       Sept, his "let's try making this black with lighter text"): the
       field rises under it, and falls away when anything is hovered */
    const dark = it.t === "rest" && !phone() && !document.body.classList.contains("staged");
    if (dark) { FIELD.style.setProperty("--fc", "var(--ink)"); FIELD.classList.add("on"); layer.classList.add("dark"); }
    else FIELD.classList.remove("on");

    /* the caption first, so the thing itself gets whatever height is left.
       A cluster of one study names it here; a cluster of several names
       each picture under itself */
    /* a figure from About is his, not a study's: it was credited to the
       newest study its sentence's words matched ("At Nordstrom the new CMS
       saved $3M" read as Nordstrom beauty, 2018), so it is credited to
       its About section instead (27 Sept) */
    const k = it.k && D.study(it.k) && !it.about ? it.k : null;
    G.work.items.forEach((x) => { if (x.a) x.a.classList.toggle("cur", !!cur && !!k && x.rel.has(k) && x !== cur.o); });
    shownK = k;
    let left = "";
    if (k) {
      left = who(k);
      const f = it.t === "pic" ? it.f : it.t === "cluster" ? it.pics[0].f : null;
      if (f && f.alt && !f.lead) left += '<span class="alt">' + esc(f.alt) + "</span>";
    } else if (it.about && it.sent) {
      const x = aboutOf(it.sent);
      if (x) left = '<span class="who">About<span class="g">' + esc(x.a.name) + "</span></span>";
    }
    if (it.t === "mosaic" && it.title && !k) left = '<span class="who">' + esc(it.title) + (it.sub ? '<span class="g">' + esc(it.sub) + "</span>" : "") + "</span>";
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
    if (!x.a) return null;
    const t = x.a.querySelector(".we") || x.a.querySelector(".t"); const rs = (t || x.a).getClientRects(); const b = rs[rs.length - 1];
    if (!b || !b.width) return null;
    const y = b.top + b.height / 2;
    if (!phone()) { const r = IDX.getBoundingClientRect(); if (y < r.top + 6 || y > r.bottom - 6) return null; }
    return [b.right + 3, y];
  };
  /* each wire leaves its entry level and bends early, so it crosses the
     columns on a slant rather than riding along a row of words, where the
     bits showing between them read as dashes (27 Sept) */
  const pathD = (p, q) => {
    const d = Math.max(24, Math.min(90, (q[0] - p[0]) * 0.22));
    return "M" + p[0].toFixed(1) + " " + p[1].toFixed(1) + " C" + (p[0] + d).toFixed(1) + " " + p[1].toFixed(1) + " " + (q[0] - d * 1.6).toFixed(1) + " " + q[1].toFixed(1) + " " + q[0].toFixed(1) + " " + q[1].toFixed(1);
  };
  /* pairs: [{ x: entry, q: [x, y], me }]; dots at each end on the stage.
     Every ground is paper now (27 Sept), so a wire is ink all the way */
  const draw = (pairs, o) => {
    clearWires();
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
    const back = WIRES_BACK ? g.cloneNode(true) : null;
    if (back) WIRES_BACK.appendChild(back);
    const both = back ? [g, back] : [g];
    if (o && o.live) { both.forEach((x) => x.classList.add("live")); return g; }
    both.forEach((x) => x.querySelectorAll("path.me").forEach((pth) => { const L = pth.getTotalLength(); pth.style.strokeDasharray = L; pth.style.strokeDashoffset = L; }));
    requestAnimationFrame(() => requestAnimationFrame(() => both.forEach((x) => { x.classList.add("in"); x.querySelectorAll("path.me").forEach((pth) => { pth.style.strokeDashoffset = 0; }); })));
    return g;
  };
  const wire = (live) => {
    if (staged()) return;
    if (phone() || !cur) { clearWires(); return; }
    const layer = layerOf(); if (!layer) return;
    const m = layer.querySelector(".main"); if (!m) return;
    const r = m.getBoundingClientRect();
    const q = [r.left - 12, r.top + r.height / 2];
    const shown = shownK ? G.work.items.find((x) => x.rel.has(shownK) && x !== cur.o) : null;
    /* every related entry is wired again (27 Sept, his "i do kinda miss
       the curved lines that mapped back to the words"). They pass behind
       the index now, so crossing a column no longer reads as a
       strikethrough */
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
    if (!cur) return; const n = reelOf(cur.o).length; if (n < 2) return;
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
    if (on) { FIELD.classList.remove("on"); clearWires(); }
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
    const ims = (box.tagName === "IMG" ? [box] : [...box.querySelectorAll("img")]).filter((im) => im.complete && im.naturalWidth);
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
        const ok = !box || !box.isConnected || box.classList.contains("in") || (box.tagName === "IMG" ? [box] : [...box.querySelectorAll("img")]).some((im) => im.complete && im.naturalWidth && im.style.opacity !== "0");
        if (!ok && performance.now() - t0 < 1400) { requestAnimationFrame(done); return; }
        flight.im.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: "ease", fill: "forwards" }).finished.then(gone, gone);
      };
      requestAnimationFrame(done);
    }, () => { if (after) after(); gone(); });
  };

  /* ── a shelf ── */
  const shelfStudies = (o) => (o.g.id === "lines" ? o.line.studies.filter((k) => D.study(k)) : byRank([...o.rel]));
  /* the order a shelf deals its studies in: a line opens on its own lead */
  const shelfOrder = (o) => {
    const ks = shelfStudies(o), lead = o.g.id === "lines" && o.line.lead;
    return lead && ks.includes(lead) ? [lead].concat(ks.filter((k) => k !== lead)) : ks;
  };
  /* the words a shelf's entry carries, verbatim: a line's sentence,
     About's lede, the sentence that names a tool (the tool marked in it),
     the sentence a figure sits in (the figure marked), or a table
     figure's label and its note */
  /* a sentence's paragraph from that sentence on, while it stays about two
     lines long; and the title of the column it sits in, when it sits in one */
  const PARAS = new Map();
  D.frags.forEach((f) => { if (f.kind === "line" && f.pi != null) { const key = f.k + "|" + f.si + "|" + f.pi; if (!PARAS.has(key)) PARAS.set(key, []); PARAS.get(key).push(f); } });
  const paraFrom = (f) => {
    const list = PARAS.get(f.k + "|" + f.si + "|" + f.pi) || [f];
    let i = list.indexOf(f); if (i < 0) return f.text;
    let out = list[i].text;
    for (i++; i < list.length && (out + " " + list[i].text).length <= 280; i++) out += " " + list[i].text;
    return out;
  };
  const colTitle = (f) => {
    let best = null;
    for (const x of D.byStudy(f.k)) {
      if (x.si !== f.si || x.kind !== "line" || x.weight !== "head" || x.where === "section-header" || !(x.pi < f.pi)) continue;
      if (!best || x.pi > best.pi) best = x;
    }
    return best ? clean(best.text).replace(/[.:]\s*$/, "") : null;
  };
  const shelfSentence = (o) => {
    /* a line written for this page outranks anything pulled from a study */
    if (LINES[o.key]) return { text: LINES[o.key], lead: true, mark: o.fig ? o.fig.s : null };
    if (o.g.id === "lines") return { text: o.line.sentence };
    if (o.g.id === "about") return { text: o.about.lede };
    if (o.g.id === "tools") { const t = namedIn(o.v, o.rel).find((x) => !x.label); return t ? { text: t.text, mark: t.hl } : null; }
    if (o.g.id === "figures") {
      const src = o.fig.src[0]; if (!src) return null; const it = src.item;
      /* a figure's sentence alone read like a fragment of a spec ("Four
         photographs, a typeface family, and a color field."). His "it's
         not very homepage friendly context": so it carries on with the
         sentences after it in its paragraph, to about two lines' worth,
         under the title of the column it sits in ("The System"). All his
         own words, only more of them (27 Sept) */
      if (it.sent) {
        const para = paraFrom(src.f);
        const col = colTitle(src.f);
        return Object.assign({ text: para, mark: o.fig.s }, col ? { label: col } : {});
      }
      if (it.label) return it.sub ? { label: it.label, text: it.sub } : { label: it.label };
      /* a figure from a chart or a timeline had no sentence at all, so its
         shelf opened on a bare number. It reads the chart instead: its
         title over its own bars, or the timeline over its steps */
      if (it.t === "chart" && it.f) {
        const bars = (it.f.bars || []).map((x) => x.label + ": " + x.value + ".").join(" ");
        const call = it.f.callout ? " " + it.f.callout + (it.f.suffix ? " " + it.f.suffix : "") + "." : "";
        return { label: it.f.title, text: (bars + call).trim(), mark: o.fig.s };
      }
      if (it.t === "steps" && it.f) {
        const st = (it.f.steps || []).map((x) => x.title + (x.note ? ", " + x.note : "") + ".").join(" ");
        return { label: it.f.title, text: ((it.f.duration ? it.f.duration + ". " : "") + st).trim(), mark: o.fig.s };
      }
    }
    return null;
  };

  /* ════════════════════════════════════════════════════════════════════
     THE SHELF, PLUGGABLE (27 Sept 2026, latest). How a shelf sets its
     pictures is a layout on window.XREF_SHELVES (the contract is at the
     top of this file; the edge-to-edge grid that lived here is
     shelf-grid.js now). What stays here is the frame every layout sits
     in: the running head (the kind of entry, its name once the layout's
     own head has gone by, the switch between layouts, Close), the next
     entry at the foot, on paper, the hairlines to the index, and the
     flights into and out of a room. A layout is mounted only while its
     shelf is the page, so a shelf held behind a room loads nothing until
     Close brings it back.
     ════════════════════════════════════════════════════════════════════ */
  const HEAD = 44; /* the running head: paper, on the index's top line */
  const SHELVES = (window.XREF_SHELVES = window.XREF_SHELVES || {});
  /* Stack first and the default since 27 Sept (his "instead of grids
     what if we stacked the heros"); the grid stays one click away */
  const SHELF_ORDER = ["stack", "grid", "spread", "sheet", "reel"];
  const SHELF_DEF = "stack";
  const shelfIds = () => Object.keys(SHELVES).filter((id) => SHELVES[id] && typeof SHELVES[id].render === "function")
    .sort((a, b) => (SHELF_ORDER.indexOf(a) + 1 || 99) - (SHELF_ORDER.indexOf(b) + 1 || 99));
  /* a new key when the default changed, so a choice remembered from
     before (the grid, mostly) does not hide the new default */
  const SHELF_LS = "crossref2.shelf.2";
  let shelfPref = (() => {
    const q = new URLSearchParams(location.search).get("shelf");
    if (q) return q.toLowerCase();
    try { return localStorage.getItem(SHELF_LS) || ""; } catch (e) { return ""; }
  })();
  const layoutId = () => { const ids = shelfIds(); return ids.includes(shelfPref) ? shelfPref : ids.includes(SHELF_DEF) ? SHELF_DEF : ids.includes("grid") ? "grid" : ids[0] || null; };
  /* a choice remembered from an earlier visit goes into the address, so a
     link copied now opens on it. One asked for by the address and not
     loaded is left there for when it is */
  const keepShelfParam = () => {
    const id = layoutId(), u = new URL(location.href);
    if (!id || u.searchParams.has("shelf") || id === SHELF_DEF) return;
    u.searchParams.set("shelf", id);
    history.replaceState(history.state, "", u.pathname + u.search + u.hash);
  };
  /* what a layout is told about its entry, and nothing of the page's */
  const entryInfo = (o) => {
    const e = { kind: o.g.pre, id: o.key.slice(o.g.pre.length + 1), key: o.key, group: o.g.name, name: clean(nameOf(o)) };
    const s = shelfSentence(o);
    if (s && s.text) e.sentence = clean(s.text);
    if (s && s.mark) e.mark = clean(s.mark);
    if (s && s.label) e.label = clean(s.label);
    if (s && s.lead) e.lead = true;
    const see = seeAlso(o); if (see.length) e.see = see.map((x) => ({ key: x.key, name: clean(nameOf(x)) }));
    return e;
  };
  /* ── the reference system (27 Sept): where in a study an entry is, and
     what to read next. A place is the section a fragment that names the
     entry sits in (D.secOf); an entry only listed in a study's title
     block has the study's number and no section ── */
  const locFrags = (o, k) => {
    switch (o.g.id) {
      case "capabilities": case "tools": {
        const vs = (o.vs || [o.v]).map((v) => v.toLowerCase());
        /* a name may be written with a possessive inside it: "Perceptron's Mk1" */
        const pat = (v) => v.split(/\s+/).map(reEsc).join("(?:['\u2019]s)?\\s+");
        const re = new RegExp("(^|[^A-Za-z0-9])(" + (o.vs || [o.v]).map(pat).join("|") + ")(?![A-Za-z])", "i");
        return D.byStudy(k).filter((f) => (f.kind === "line" && re.test(f.text)) || (f.kind === "tool" && vs.includes(f.value.toLowerCase())));
      }
      case "figures": return o.fig.src.map((x) => x.f).filter((f, i, a) => f && f.k === k && a.indexOf(f) === i);
      default: return [];
    }
  };
  const locsOf = (o, k) => {
    const out = [], seen = new Set();
    locFrags(o, k).filter((f) => f.kind !== "tool").sort((a, b) => FIDX.get(a) - FIDX.get(b)).forEach((f) => {
      const sec = D.secOf(f); if (seen.has(sec)) return; seen.add(sec);
      out.push({ s: sec, at: f.id });
    });
    return out.sort((a, b) => a.s.localeCompare(b.s));
  };
  const SEE = window.ENTRY_SEE || {};
  const seeAlso = (o) => {
    const out = [];
    (SEE[o.key] || []).forEach((key) => { const x = KEYMAP.get(key); if (x && x !== o && !out.includes(x)) out.push(x); });
    if (["capabilities", "tools", "figures"].includes(o.g.id) && o.rel && o.rel.size && out.length < 4) {
      /* the entries that share the most of its studies, for their size */
      const J = (x) => { let i = 0; o.rel.forEach((k) => { if (x.rel.has(k)) i++; }); return i ? i / (o.rel.size + x.rel.size - i) : 0; };
      G.capabilities.items.concat(G.tools.items).filter((x) => x !== o && !out.includes(x)).map((x) => [x, J(x)])
        .filter(([, j]) => j >= 0.34).sort((a, b) => b[1] - a[1] || b[0].rel.size - a[0].rel.size || a[0].label.localeCompare(b[0].label))
        .slice(0, 4 - out.length).forEach(([x]) => out.push(x));
    }
    return out.slice(0, 4);
  };

  const shelfCtx = (S) => ({
    entry: entryInfo(S.o),
    studies: S.ks.slice(),
    pics: (k) => picsOf(k),
    lead: (k) => leadOf(k),
    get width() { return S.layer.clientWidth || STAGE.clientWidth; },
    get height() { return Math.max(0, (S.layer.clientHeight || innerHeight) - HEAD); },
    scroller: S.layer,
    head: HEAD,
    get phone() { return phone(); },
    /* a preview until a click makes it the shelf; a layout may load less
       while it is only a preview */
    get preview() { return !!S.pv; },
    get gone() { return !!S.gone; },
    open: (k, fromEl, at) => (S.pv ? pvOpen(S, k, fromEl, at) : shelfOpen(S, k, fromEl, at)),
    /* the reference system: a study's number, and where in it this entry is */
    num: (k) => D.num(k),
    locs: (k) => locsOf(S.o, k),
    hover: (k, at) => (S.pv ? pvHover(S, k, at) : shelfHover(S, k, at)),
    esc, clean, D,
  });

  /* the frame: the running head, an empty body for the layout, the foot */
  const frameShelf = (S) => {
    const o = S.o;
    const bar = el("div", "sh-bar");
    bar.appendChild(el("span", "sh-bar-k caps", esc(o.g.name)));
    bar.appendChild(el("span", "sh-bar-t", esc(nameOf(o))));
    const sw = el("span", "sh-sw"); bar.appendChild(sw);
    const x = el("button", "sh-x", "Close"); x.type = "button"; x.addEventListener("click", (ev) => { ev.stopPropagation(); closeTo({ v: "rest" }); });
    if (S.pv) x.tabIndex = -1;
    bar.appendChild(x);
    const body = el("div", "sh-body");
    const kids = [bar, body];
    /* the foot: the next entry of the same kind, on paper, so a shelf never
       ends in a wall. Since 27 Sept (his "instead of clicking 'next' ...
       can the user just keep scrolling maybe?") it is a glass tall and set
       as that entry's own shelf opens, its name, count, column and
       sentence where the stack will put them; a rule beside Next fills as
       it comes up, and reaching its end carries on into that shelf */
    const items = o.g.items, nx = items[(items.indexOf(o) + 1) % items.length];
    S.foot = null;
    if (nx && nx !== o) {
      const a = el("a", "sh-foot"); a.href = "#" + nx.key; a.dataset.key = nx.key;
      const ns = shelfSentence(nx), n = shelfOrder(nx).length;
      /* a line comes as the one run its head is set in (the stack's
         .xk-stand), so the scroll into it lands on the same words */
      const run = nx.g.id === "lines" && ns && ns.text;
      a.innerHTML = '<span class="sh-foot-k caps"><span>Next</span><i></i></span>' +
        '<span class="sh-foot-hl">' + (run
          ? '<span class="sh-foot-t stand">' + esc(nameOf(nx)) + '. <span class="g">' + esc(clean(ns.text)) + "</span></span>"
          : '<span class="sh-foot-t' + (nx.g.id === "years" || nx.g.id === "figures" ? " num" : "") + '">' + esc(nameOf(nx)) + "</span>") +
        (n ? '<span class="sh-foot-n caps">Work<b>' + n + "</b></span>" : "") + "</span>" +
        (!run && ns && ns.label ? '<span class="sh-foot-l caps">' + esc(clean(ns.label)) + "</span>" : "") +
        (!run && ns && ns.text ? '<span class="sh-foot-s' + (ns.lead ? " lead" : "") + '">' + (ns.lead ? twoTone(clean(ns.text)) : esc(clean(ns.text))) + "</span>" : "");
      kids.push(a); S.foot = a;
    }
    S.layer.replaceChildren(...kids);
    Object.assign(S, { bar, body, sw });
  };
  /* the switch: every layout that loaded, by its own word, the current
     one underlined. Plain words, nothing else */
  const drawSwitch = (S) => {
    const ids = shelfIds();
    S.sw.innerHTML = ids.map((id) => {
      const u = new URL(location.href); u.searchParams.set("shelf", id);
      return '<a href="' + D.esc(u.pathname + u.search + u.hash) + '" data-shelf="' + D.esc(id) + '"' + (S.pv ? ' tabindex="-1"' : "") + (id === S.lid ? ' class="on" aria-current="true"' : "") + ">" + esc(SHELVES[id].label || id) + "</a>";
    }).join("");
  };
  const unmountLayout = (S) => {
    if (S.view) { try { S.view.destroy(); } catch (e) { /* the layout's own */ } }
    S.view = null; S.hovK = null; S.hovAt = null;
    if (S.fade) { S.fade.cancel(); S.fade = null; }
    if (S.body) S.body.replaceChildren();
  };
  const mountLayout = (S) => {
    unmountLayout(S);
    S.lid = layoutId(); S.stale = false;
    S.W = S.layer.clientWidth; S.V = S.layer.clientHeight;
    const put = (id) => {
      S.body.dataset.layout = id;
      S.ctx = shelfCtx(S);
      try { S.view = SHELVES[id].render(S.body, S.ctx) || null; return true; }
      catch (e) { console.warn("crossref2: the " + id + " shelf could not be set", e); unmountLayout(S); return false; }
    };
    /* a layout that throws gives way to the grid */
    if (S.lid && !put(S.lid) && S.lid !== "grid" && SHELVES.grid) { S.lid = "grid"; put("grid"); }
    drawSwitch(S); fitFoot(S);
    S.headEl = S.body.querySelector("[data-head]");
    pastCheck(S);
  };
  /* the next entry's name is fitted as the stack fits its own (two lines
     at most, never past the edge), so it lands where it will stand */
  const fitFoot = (S) => {
    const t = S.foot && S.foot.querySelector(".sh-foot-t"); if (!t || t.classList.contains("stand")) return;
    t.style.fontSize = ""; let fs = parseFloat(getComputedStyle(t).fontSize) || 64;
    const over = () => t.scrollWidth > t.clientWidth + 1 || t.offsetHeight > fs * 2.05;
    for (let i = 0; i < 24 && fs > 22 && over(); i++) { fs -= 2; t.style.fontSize = fs + "px"; }
  };
  /* how far the next entry has come up, and at the end of it, its shelf.
     A shelf arrived at from below (scrolling back up) starts at its end
     with this disarmed, until the reader has scrolled up off the foot */
  const footScroll = (S) => {
    const f = S.foot; if (!f || !f.isConnected || S.pv) return;
    const lb = S.layer.getBoundingClientRect(), fb = f.getBoundingClientRect();
    f.style.setProperty("--fp", Math.max(0, Math.min(1, (lb.bottom - fb.top) / Math.max(1, fb.height))).toFixed(3));
    if (S.contd && SH === S && fb.top > lb.top + HEAD + 60) S.contd = false;
    const atEnd = S.layer.scrollTop + S.layer.clientHeight >= S.layer.scrollHeight - 2;
    if (atEnd && fb.top <= lb.top + HEAD + 12 && !S.contd) carryOn(S);
  };
  const carryOn = (S) => {
    if (!S.foot || S.gone2 || VIEW.v !== "shelf" || SH !== S || !S.visible || S.pv) return;
    S.contd = true; S.gone2 = true;
    go({ v: "shelf", key: S.foot.dataset.key }, { push: true, via: "scroll" });
  };
  /* back up the way the reader came: past the top of a shelf reached by
     carrying on, to the end of the one before, through the history */
  let backUp = null;
  const carryBack = (S) => {
    if (!S.back || S.gone2 || VIEW.v !== "shelf" || SH !== S || !S.visible || S.pv) return;
    const hs = history.state; if (!hs || hs.key !== S.key || hs.back !== S.back) return;
    S.gone2 = true; backUp = S.back;
    history.back();
  };
  /* a pull past either end, by wheel or by finger, counted until it is
     plainly meant: a pause or a turn starts the count again */
  const edgePull = (S) => {
    let acc = 0, dir = 0, at = 0, ty = null;
    const edge = () => ({ top: S.layer.scrollTop <= 1, end: S.layer.scrollTop + S.layer.clientHeight >= S.layer.scrollHeight - 2 });
    const push = (d, need) => {
      const now = performance.now(), sgn = Math.sign(d);
      if (sgn !== dir || now - at > 260) { acc = 0; dir = sgn; }
      at = now; acc += Math.abs(d);
      if (acc < need) return;
      acc = 0;
      const e = edge();
      if (sgn < 0 && e.top) carryBack(S);
      else if (sgn > 0 && e.end) carryOn(S);
    };
    S.layer.addEventListener("wheel", (ev) => {
      const e = edge(); if (!(ev.deltaY < 0 && e.top) && !(ev.deltaY > 0 && e.end)) { acc = 0; return; }
      push(ev.deltaY, 140);
    }, { passive: true });
    S.layer.addEventListener("touchstart", (ev) => { ty = ev.touches[0].clientY; acc = 0; }, { passive: true });
    S.layer.addEventListener("touchmove", (ev) => {
      if (ty == null) return; const y = ev.touches[0].clientY, d = ty - y; ty = y;
      const e = edge(); if (!(d < 0 && e.top) && !(d > 0 && e.end)) { acc = 0; return; }
      push(d, 90);
    }, { passive: true });
    S.layer.addEventListener("touchend", () => { ty = null; }, { passive: true });
  };
  /* the running head names the entry once the layout's own head (or a
     third of the glass, for a layout without one) has gone under it */
  const pastCheck = (S) => {
    const h = S.headEl, lb = S.layer.getBoundingClientRect();
    S.layer.classList.toggle("past", h && h.isConnected ? h.getBoundingClientRect().bottom < lb.top + HEAD + 4 : S.layer.scrollTop > S.layer.clientHeight * 0.33);
    /* and a hairline under it once anything has gone under it, so a
       sentence passing beneath never reads as part of the head */
    S.layer.classList.toggle("moved", S.layer.scrollTop > 2);
  };
  const buildShelf = (o, held, opt) => {
    opt = opt || {};
    const layer = el("div", "shelf" + (opt.pv ? " pv" : ""));
    layer.dataset.key = o.key;
    if (held) layer.style.visibility = "hidden";
    (opt.host || STAGE).appendChild(layer);
    const S = { key: o.key, o, layer, ks: shelfOrder(o), view: null, lid: null, visible: !held, clicked: null, hovK: null, hovAt: null, fade: null,
      pv: !!opt.pv, host: opt.host ? opt.host.parentNode : null };
    frameShelf(S);
    /* a shelf held behind a room is framed but not laid out: it loads
       nothing until Close brings it back */
    if (!held) mountLayout(S);
    layer.addEventListener("click", (ev) => shelfClick(S, ev));
    edgePull(S);
    let sc = 0;
    layer.addEventListener("scroll", () => {
      cancelAnimationFrame(sc); sc = requestAnimationFrame(() => {
        pastCheck(S);
        footScroll(S);
        /* a preview keeps a picture's wires on it as it scrolls */
        if (S.pv) { if (S.hovK) wireTile(S); return; }
        /* a scroll still gliding when a picture is clicked lands after the
           room has opened; its wires belong to the shelf, so they are drawn
           only while the shelf is the page (27 Sept review) */
        if (VIEW.v !== "shelf" || SH !== S) return;
        if (S.hovK) wireTile(S); else if (hov) wireShelf(S, hov);
      });
    }, { passive: true });
    return S;
  };
  const destroyShelf = (S) => { if (!S) return; unmountLayout(S); S.layer.remove(); };
  const setShelfLayout = (id) => {
    if (!SHELVES[id] || typeof SHELVES[id].render !== "function") return;
    shelfPref = id;
    try { localStorage.setItem(SHELF_LS, id); } catch (e) { /* a private window */ }
    const u = new URL(location.href); u.searchParams.set("shelf", id);
    history.replaceState(history.state, "", u.pathname + u.search + u.hash);
    if (!SH) return;
    if (!SH.visible) { SH.stale = true; return; }
    if (SH.lid === id) { drawSwitch(SH); return; }
    clearWires(); hov = null;
    SH.layer.scrollTop = 0; mountLayout(SH);
    paint(SH.o.rel, SH.o);
    shelfEnter(SH, { delay: 0 });
  };
  /* in and out: the layout's own when it has them, else the page fades
     its body */
  const shelfEnter = (S, o) => {
    if (S.fade) { S.fade.cancel(); S.fade = null; }
    if (S.foot) S.foot.getAnimations().forEach((a) => a.cancel());
    if (S.view && S.view.enter) { try { S.view.enter(o || {}); } catch (e) { /* the layout's own */ } return; }
    if (still()) return;
    S.fade = S.body.animate([{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], { duration: 520, delay: (o && o.delay) || 0, easing: EASE, fill: "backwards" });
  };
  const shelfLeave = (S, keep) => {
    if (S.foot) S.foot.animate([{ opacity: 1 }, { opacity: 0 }], { duration: still() ? 0 : 240, fill: "forwards" });
    if (S.view && S.view.leave) { try { S.view.leave(keep || null); } catch (e) { /* the layout's own */ } return; }
    if (S.fade) S.fade.cancel();
    S.fade = S.body.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: DROP, fill: "forwards" });
  };
  const shelfLight = (S, ks) => { if (S.view && S.view.light) { try { S.view.light(ks); } catch (e) { /* the layout's own */ } } };
  const tileOf = (S, k) => {
    if (!S || !S.view || !S.view.tileFor) return null;
    try { const n = S.view.tileFor(k); return n && n.isConnected ? n : null; } catch (e) { return null; }
  };
  /* the picture an element of a layout shows, as a fragment: its own
     (node._f, or data-f), else the one its image's file is, else what the
     image itself says, else the study's board lead */
  const PICS = new Map(); D.frags.forEach((f) => { if (f.kind === "pic") PICS.set(f.id, f); });
  const picOfEl = (node, k) => {
    if (!node || !node.isConnected) return null;
    const ims = node.tagName === "IMG" ? [node] : [...node.querySelectorAll("img")];
    const im = ims.filter((i) => i.complete && i.naturalWidth).pop() || ims[0] || null;
    let f = node._f || null;
    if (!f && node.dataset && node.dataset.f) f = PICS.get(node.dataset.f) || (node.dataset.f === "lead:" + k ? leadOf(k) : null);
    if (!f && im) {
      const s = im.currentSrc || im.src || "";
      let p = ""; try { p = decodeURI(new URL(s, location.href).pathname); } catch (e) { /* not an address */ }
      f = [leadOf(k)].concat(picsOf(k)).find((x) => x && [x.src, x.t384, x.t768].includes(p)) || null;
      if (!f && im.naturalWidth) f = { id: null, k, src: p || s, w: im.naturalWidth, h: im.naturalHeight, alt: "" };
    }
    if (!f) f = leadOf(k) || heroOf(k);
    return f ? { box: node, f } : null;
  };
  /* a study opened from a shelf: the picture clicked flies into its room */
  const shelfOpen = (S, k, fromEl, at) => {
    if (SH !== S || VIEW.v !== "shelf" || !D.study(k)) return;
    const p = fromEl ? picOfEl(fromEl, k) : null;
    S.clicked = { k, el: p ? p.box : null };
    /* the study comes in under the curtain, at its place when a locator
       was clicked (27 Sept, his "yes, use the curtain there too"); the
       tile is kept so Close can fly the picture home to it */
    go({ v: "study", k, from: S.key }, { push: true, at: at || null, curtain: true });
  };
  const shelfClick = (S, ev) => {
    if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button) return; /* a new tab is still a new tab */
    const sa = ev.target.closest("a[data-see]");
    if (sa && S.layer.contains(sa)) { ev.preventDefault(); go({ v: "shelf", key: sa.dataset.see }, { push: true }); return; }
    const sw = ev.target.closest(".sh-sw a");
    if (sw) { ev.preventDefault(); setShelfLayout(sw.dataset.shelf); return; }
    const nx = ev.target.closest(".sh-foot");
    if (nx) { ev.preventDefault(); go({ v: "shelf", key: nx.dataset.key }, { push: true }); return; }
    /* a layout that leaves a study's link to the page: it opens in place,
       from the picture inside it */
    if (ev.defaultPrevented) return;
    const a = ev.target.closest('a[href^="#study/"]');
    if (a && S.body.contains(a)) {
      ev.preventDefault();
      const ims = a.querySelectorAll("img");
      (S.pv ? pvOpen : shelfOpen)(S, decodeURIComponent(a.getAttribute("href").slice(7)), ims.length ? ims[ims.length - 1] : null);
    }
  };

  /* hovering in a shelf: a picture lights what its study holds, wired to
     it; an entry sets solid what it touches (the layout's light), wired */
  const anchorOf = (box, clampTo) => {
    const r = box.getBoundingClientRect(), s = (clampTo || STAGE).getBoundingClientRect();
    const top = s.top + HEAD + 6; /* below the running head */
    const y = Math.max(top, Math.min(s.bottom - 10, (Math.max(r.top, top) + Math.min(r.bottom, s.bottom)) / 2));
    /* inside the picture's own edge: edge to edge, a point just left of it
       was on the picture next door (27 Sept review) */
    return [Math.max(s.left + 2, r.left + 10), y];
  };
  const wireTile = (S) => {
    const k = S.hovK, node = S.hovAt && S.hovAt.isConnected ? S.hovAt : tileOf(S, k);
    if (!node) { clearWires(); return; }
    const q = anchorOf(node, S.layer), me = WORK[k];
    draw(lit.filter((x) => x !== me).map((x) => ({ x, q })).concat(me ? [{ x: me, q, me: true }] : []), { live: true });
  };
  const shelfHover = (S, k, at) => {
    if (VIEW.v !== "shelf" || SH !== S) return;
    if (!k || !D.study(k)) { if (S.hovK) { S.hovK = null; S.hovAt = null; stageNeutral(); } return; }
    /* a picture under the pointer outranks an entry just left in the index,
       whose neutral would otherwise land on it a beat later */
    clearTimeout(restT); hov = null;
    S.hovK = k; S.hovAt = at || null;
    paint(new Set([k]), WORK[k]);
    wireTile(S);
  };
  const wireShelf = (S, o) => {
    const lb = S.layer.getBoundingClientRect(), view = { top: lb.top + HEAD, bottom: lb.bottom };
    const pairs = S.ks.filter((k) => o.rel.has(k)).map((k) => tileOf(S, k))
      .filter((n) => n && rectIn(n.getBoundingClientRect(), view)).map((n) => ({ x: o, q: anchorOf(n, S.layer), me: true }));
    draw(pairs, { live: true });
  };

  /* ── the preview: the shelf a hover shows. A picture under the pointer
     lights what its study holds, wired to it, as on the shelf; the pointer
     leaving it gives the entry back its own light and fan ── */
  const pvHover = (S, k, at) => {
    if (!S.pv || staged() || !cur || cur.o !== S.o) return;
    if (!k || !D.study(k)) { if (S.hovK) { S.hovK = null; S.hovAt = null; paint(S.o.rel, S.o); wire(true); } return; }
    clearTimeout(restT);
    S.hovK = k; S.hovAt = at || null;
    paint(new Set([k]), WORK[k]);
    wireTile(S);
  };
  /* a picture clicked in a preview: the preview becomes the shelf, and the
     picture flies from it into its room, as from any shelf. Close comes
     back to that shelf, as it was */
  const pvOpen = (S, k, fromEl, at) => {
    if (!S.pv || staged() || !D.study(k)) return;
    go({ v: "shelf", key: S.key }, { push: true });
    if (SH === S) shelfOpen(S, k, fromEl, at);
  };
  const pvOf = (o) => { const l = layerOf(); const P = l && l._pv; return P && P.pv && P.o === o && !phone() ? P : null; };
  /* the preview moves to the stage as it is: the same element, its layout,
     its loaded pictures and where it was scrolled. Only its running head's
     own controls arrive */
  const promote = (P) => {
    const top = P.layer.scrollTop;
    P.pv = false; P.visible = true;
    if (P.host && P.host._pv === P) P.host._pv = null;
    STAGE.appendChild(P.layer);
    P.layer.scrollTop = top;
    P.layer.classList.remove("pv");
    P.bar.querySelectorAll("[tabindex]").forEach((n) => n.removeAttribute("tabindex"));
    pastCheck(P);
    return P;
  };

  /* open a shelf over whatever the stage holds */
  const openShelf = (o, how) => {
    const old = SH, oldRoom = RM, was = staged();
    const P = !was ? pvOf(o) : null;
    const S = P ? promote(P) : buildShelf(o); SH = S; RM = null;
    /* reached by carrying on from the shelf before: the way back up */
    const hs = history.state;
    S.back = hs && hs.v === "shelf" && hs.key === o.key && hs.via === "scroll" && hs.back ? hs.back : null;
    setStaged(true); lockEntry(o); cur = null;
    paint(o.rel, o);
    keepShelfParam();
    /* from its preview, the shelf is already on the glass: nothing rises */
    if (P) {
      setTimeout(() => {
        if (old && old !== SH) destroyShelf(old);
        if (oldRoom) { oldRoom.room.destroy(); oldRoom.c.remove(); }
      }, 520);
      return;
    }
    /* carried on from the foot of the shelf before: its name is already
       where that foot left it, so the shelf only has to appear, and only
       its pictures arrive */
    if (how && how.via === "scroll" && old && old.visible && !oldRoom) {
      if (!still()) S.layer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "ease" });
      shelfEnter(S, { delay: 0, keep: S.body.querySelector("header") });
      setTimeout(() => { if (old && old !== SH) destroyShelf(old); }, 240);
      return;
    }
    /* back up from the shelf after it: this one arrives at its end, its
       foot carrying the name the reader was just under, and the pictures
       are above, where they were */
    if (how && how.via === "scroll-up" && old && old.visible && !oldRoom) {
      const f = S.foot;
      if (f) { S.layer.scrollTop += f.getBoundingClientRect().top - (S.layer.getBoundingClientRect().top + HEAD); pastCheck(S); }
      S.contd = true;
      footScroll(S);
      if (!still()) S.layer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "ease" });
      setTimeout(() => { if (old && old !== SH) destroyShelf(old); }, 240);
      return;
    }
    const rise = !still() && !(phone() && !was);
    if (rise) S.layer.animate([{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 560, easing: EASE });
    shelfEnter(S, { delay: rise ? 160 : phone() && !was ? 220 : 60 });
    setTimeout(() => {
      if (old && old !== SH) destroyShelf(old);
      if (oldRoom) { oldRoom.room.destroy(); oldRoom.c.remove(); }
    }, rise ? 580 : 520);
  };
  /* a shelf held behind a room, for Close to return to */
  const holdShelf = (o) => {
    if (SH && SH.key === o.key) return;
    if (SH) destroyShelf(SH);
    SH = buildShelf(o, true);
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
      onNext: (x) => go({ v: "study", k: x, from }, { push: true, via: "next", curtain: true }),
      onClose: () => closeTo(parentOf(VIEW)),
      /* its words wait to rise until the room is on stage (play, below) */
      hold: true,
    });
    RM = { k, from, c, room };
    if (room.cover && liveOf(leadOf(k))) liveReel(leadOf(k), room.cover);
    const reveal = () => {
      clearTimeout(revealT);
      c.style.visibility = "";
      if (SH && SH.visible && RM && RM.c === c) { SH.visible = false; SH.layer.style.visibility = "hidden"; }
      if (prev) { prev.room.destroy(); prev.c.remove(); }
    };
    /* opened from a locator: the room starts at that place, marked */
    if (how.at && room.find(how.at)) { room.scrollTo(how.at); room.mark([how.at]); }
    let rsc = 0;
    c.addEventListener("scroll", () => { cancelAnimationFrame(rsc); rsc = requestAnimationFrame(() => { if (LW) drawLive(); else wireRoom(true); }); }, { passive: true });

    /* opened from the index (27 Sept, his "if i click instead of the
       transtion inside the content column the thumbnail image
       'moves/animates' from the the left side to the right side and zooms
       into place. can we remove that and just have the curtain type of
       animation happen and load the case study on the content column?"):
       no flight. The site's own curtain plays in the content column, the
       study's name down a white panel that falls and a black one that
       rises over it. At full black the room is put in place under it,
       whatever the column showed goes, and the black lifts off the room
       as its words rise. The index keeps working the whole time. Then
       every other way in as well, his "yes, use the curtain there too":
       a shelf's picture or locator, Next, the focus, back and forward.
       Only an address opened cold, a phone and reduced motion keep the
       old ways, so a picture flies only home to its tile on Close */
    if (how.curtain !== false && window.Curtain && window.Curtain.cover && !still() && !phone()) {
      RM.curtain = true;
      lockEntry(WORK[k]);
      const s = D.study(k) || {};
      window.Curtain.cover(D.title(k), s.s || "").then(() => {
        /* a later click took the curtain over; it lifts it. A close, or a
           step elsewhere, lifts it here */
        if (!RM || RM.c !== c) { if (!RM || !RM.curtain) window.Curtain.lift(); return; }
        setStaged(true); cur = null;
        lockEntry(WORK[k]); paintRoom();
        c.style.visibility = "";
        if (SH && SH.visible) shelfLeave(SH, null);
        reveal();
        room.play({ delay: 140, settle: true });
        window.Curtain.lift();
        setTimeout(() => { if (RM && RM.c === c) roomWires(true); }, 260);
      });
      return;
    }

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
    if (!src && SH && SH.visible && !prev) {
      const node = SH.clicked && SH.clicked.k === k && SH.clicked.el && SH.clicked.el.isConnected ? SH.clicked.el : tileOf(SH, k);
      const p = node && visRect(node) ? picOfEl(node, k) : null;
      if (p) src = { box: p.box, f: p.f, target: "cover", shelf: true };
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
    /* what a picture flies to shows at once and holds still */
    if (flight) room.shown(to);
    if (flight) {
      /* the room comes up on paper behind the picture in flight; its own
         cover waits under the flyer until the flyer lands on it */
      const restore = src.box;
      restore.style.visibility = "hidden"; to.style.visibility = "hidden";
      c.style.visibility = "";
      c.animate([{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 520, delay: 40, easing: EASE, fill: "backwards" });
      room.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, delay: 330, easing: "ease", fill: "backwards" });
      if (SH && SH.visible && src.shelf) shelfLeave(SH, src.box);
      if (prev) prev.c.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-24px)" }], { duration: 320, easing: DROP, fill: "forwards" });
      land(flight, to, () => { to.style.visibility = ""; restore.style.visibility = ""; reveal(); roomWires(true); });
      /* the words rise as the room's paper comes up behind the flight */
      room.play({ delay: 380 });
    } else {
      c.style.visibility = "";
      /* no flight: the cover settles as the paper rises, and the words
         come up a beat behind it */
      room.play({ delay: phone() && !was ? 200 : 240, settle: true });
      if (!was && phone()) { reveal(); return; }
      if (!still()) c.animate([{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 560, easing: EASE });
      if (prev) prev.c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" });
      if (SH && SH.visible) shelfLeave(SH, null);
      revealT = setTimeout(() => { reveal(); roomWires(true); }, still() ? 0 : 560);
    }
  };
  /* back from a room to the shelf it came from: the picture flies home and
     the others rise again */
  const backToShelf = () => {
    const S = SH, R = RM; RM = null;
    R.c.style.pointerEvents = "none";
    S.layer.style.visibility = ""; S.visible = true;
    /* a shelf held behind a room is laid out only now, and so is one whose
       layout was switched while it waited */
    if (!S.view || S.stale || S.lid !== layoutId()) mountLayout(S);
    const node = (S.clicked && S.clicked.k === R.k && S.clicked.el && S.clicked.el.isConnected ? S.clicked.el : null) || tileOf(S, R.k);
    if (node) {
      /* bring its picture home into view, most of it, before it flies
         there. A hero keeps where it was scrolled sideways */
      const lb = S.layer.getBoundingClientRect(), tb = node.getBoundingClientRect();
      const top = lb.top + HEAD, vh = lb.height - HEAD;
      const seen = Math.min(tb.bottom, lb.bottom) - Math.max(tb.top, top);
      if (seen < Math.min(tb.height, vh) * 0.8) S.layer.scrollTop += tb.top - top - Math.max(0, (vh - tb.height) / 2);
    }
    lockEntry(S.o); paint(S.o.rel, S.o); clearLive(); pastCheck(S);
    /* it flies home from where the room shows it: the picture itself when
       the room has it in view, else the cover (the board's lead, which
       gives way to the shelf's own picture as it lands) */
    const tp = node ? picOfEl(node, R.k) : null;
    let from = R.room.cover, ff = leadOf(R.k);
    if (tp && !tp.f.lead && tp.f.id) { const e = R.room.find(tp.f.id); if (e && e !== R.room.cover && visRect(e)) { from = e; ff = tp.f; } }
    const flight = tp && from && ff && visRect(from) && visRect(tp.box) ? fly(from, ff, tp.box, { ms: 540, fitB: ff.src !== tp.f.src }) : null;
    shelfEnter(S, { back: true, delay: 200, keep: flight ? tp.box : null });
    if (flight) { tp.box.style.visibility = "hidden"; from.style.visibility = "hidden"; land(flight, tp.box, () => { tp.box.style.visibility = ""; }); }
    /* the room's words go first, lifting away on the site's exit curve,
       then its paper lowers off the shelf */
    R.room.el.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-12px)" }], { duration: still() ? 0 : 300, easing: EXIT, fill: "forwards" });
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
    if (R) {
      R.c.style.pointerEvents = "none";
      if (!still() && !phone()) R.room.el.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-12px)" }], { duration: 300, easing: EXIT, fill: "forwards" });
      drop(R.c, () => { R.room.destroy(); R.c.remove(); });
    }
    if (S) { if (S.visible) drop(S.layer, () => destroyShelf(S)); else destroyShelf(S); }
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
    /* the room's scroll is Lenis's when it has one: a write past it would
       be undone */
    const L = RM.room.lenis;
    if (L) {
      L.resize();
      if (Math.abs(d) > c.clientHeight * 1.4) L.scrollTo(top - Math.sign(d) * near, { immediate: true, force: true });
      L.scrollTo(top, { duration: 1.1, force: true });
      return;
    }
    if (Math.abs(d) > c.clientHeight * 1.4) c.scrollTop = top - Math.sign(d) * near;
    c.scrollTo({ top, behavior: still() ? "auto" : "smooth" });
  };
  /* the room wired to all it touches (27 Sept, his "can we have ALL the
     curve lines going to all the other attributes that case study has -
     does that make sense? in theory most case studies would have a BUNCH
     of the curves indicator lines pointing to it"). Every entry the open
     study lights sends a wire to one point on the room's edge, level with
     the middle of its cover while the cover shows; its own entry's wire
     is drawn in ink. The fan stays while an entry is pointed at, under
     that entry's own wire to its place */
  const roomNode = () => {
    const s = RM.c.getBoundingClientRect();
    const cv = RM.room.cover && RM.room.cover.getBoundingClientRect();
    const mid = cv && cv.height ? cv.top + Math.min(cv.height / 2, 220) : s.top + 60;
    return [s.left - 1, Math.max(s.top + 60, Math.min(s.bottom - 60, mid))];
  };
  const fanPairs = (except, inkOwn) => {
    const q = roomNode(), own = WORK[RM.k];
    const out = lit.filter((x) => x !== except && x !== own).map((x) => ({ x, q }));
    if (own && own !== except) out.push({ x: own, q, me: inkOwn });
    return out;
  };
  const wireRoom = (live) => {
    if (!RM || VIEW.v !== "study" || LW || phone() || !staged()) return;
    draw(fanPairs(null, true), live ? { live: true } : null);
  };
  /* once a room is in place: an entry pointed at while it came in keeps
     its own wire (a click lands before the hover it began), else the fan
     draws in */
  const roomWires = (anim) => { if (!RM) return; if (LW) drawLive(); else wireRoom(!anim); };
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
    draw(fanPairs(LW.o, false).concat([{ x: LW.o, q: [x, y], me: true }]), { live: true });
  };
  const clearLive = () => { LW = null; clearWires(); };
  const pointAt = (o) => {
    const k = RM.k;
    if (!o.rel.has(k)) { paintRoom(); clearLive(); wireRoom(true); return; }
    paint(new Set([k]), o);
    const ts = roomTargets(o, k);
    if (!ts.length) { clearLive(); markEls([]); wireRoom(true); return; }
    markEls(ts); scrollToEl(ts[0]);
    LW = { o, t: ts[0], raf: 0 }; drawLive();
  };

  /* hover while the stage is open */
  let hov = null;
  const stageHover = (o) => {
    hov = o;
    if (VIEW.v === "shelf" && SH) {
      SH.hovK = null; SH.hovAt = null;
      paint(o.rel, o);
      /* nothing on the shelf dims: its layout sets solid what the entry
         touches (27 Sept, latest) */
      shelfLight(SH, new Set(SH.ks.filter((k) => o.rel.has(k))));
      wireShelf(SH, o);
    } else if (VIEW.v === "study" && RM) pointAt(o);
  };
  const stageNeutral = () => {
    hov = null;
    if (VIEW.v === "shelf" && SH) { shelfLight(SH, null); paint(SH.o.rel, SH.o); clearWires(); }
    else if (VIEW.v === "study" && RM) { paintRoom(); LW = null; wireRoom(true); }
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
      history.pushState({ v: st.v, key: st.key || null, k: st.k || null, from: st.from || null, back: keyOf(VIEW), via: how.via || null }, "", h ? "#" + h : location.pathname + location.search);
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
    const up = backUp && st.v === "shelf" && st.key === backUp; backUp = null;
    apply(st, up ? { via: "scroll-up" } : {});
  });

  /* what a click on an entry opens */
  const open = (o, how) => {
    if (o.g.id === "work") {
      if (VIEW.v === "study" && RM && RM.k === o.k) return;
      const from = VIEW.v === "shelf" ? VIEW.key : VIEW.v === "study" ? VIEW.from : null;
      go({ v: "study", k: o.k, from }, Object.assign({ push: true, curtain: true }, how || {}));
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
    /* a locator in index F: the study, at the place, with the entry's
       shelf held behind it for Close */
    const lc = ev.target.closest(".floc");
    if (lc && !(ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button)) {
      ev.preventDefault(); clearTimeout(intentT);
      const o2 = entryOf(ev.target);
      go({ v: "study", k: lc.dataset.k, from: o2 && o2.g.id !== "work" ? o2.key : null }, { push: true, at: lc.dataset.at || null, curtain: true });
      return;
    }
    const sw = ev.target.closest(".ixsw a");
    if (sw && !(ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button)) { ev.preventDefault(); if (sw.dataset.mk) setMark(sw.dataset.mk); else if (sw.dataset.tx) setTexture(sw.dataset.tx); else if (sw.dataset.mo) setMotion(sw.dataset.mo); else setIndex(sw.dataset.ix); return; }
    const o = entryOf(ev.target); if (!o) return;
    if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button) return; /* a new tab is still a new tab */
    ev.preventDefault();
    clearTimeout(intentT);
    /* on glass a tap is the hover; a second tap opens */
    if (phone() && !staged() && !(cur && cur.o === o)) { show(o, 0); return; }
    /* a study opens under the curtain in the content column; its picture
       no longer flies over from the index (27 Sept, see openRoom) */
    open(o, o.g.id === "work" ? { curtain: true } : null);
  });
  /* ── LEAVING (27 Sept): a full study, or the board through the mark,
     is left under the site's own curtain (curtain.js), the name of what
     is arriving repeating down it; the page that arrives lifts it ── */
  document.addEventListener("click", (ev) => {
    if (ev.defaultPrevented || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button || !window.Curtain) return;
    const a = ev.target.closest("a.sp-full, a#mark"); if (!a || !a.href) return;
    let title = "Reckon*House", sub = "";
    if (a.classList.contains("sp-full")) {
      const k = (a.closest(".sp") || {}).dataset ? a.closest(".sp").dataset.k : null; const s = k && D.study(k);
      if (s) { title = D.title(k); sub = s.s || ""; }
    }
    ev.preventDefault();
    window.Curtain.go(a.href, title, sub);
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
    if (ev.defaultPrevented) return; /* a preview's picture, already opening */
    if (ev.target.closest("a") || staged()) return;
    const cp = ev.target.closest(".cp");
    if (cp && cp._f) {
      const from = null;
      go({ v: "study", k: cp.dataset.k, from }, { push: true, curtain: true });
      return;
    }
    if (cur) open(cur.o);
  });
  let wheelAcc = 0, wheelAt = 0;
  FOCUS.addEventListener("wheel", (ev) => {
    if (phone() || !cur || staged()) return;
    /* a preview scrolls, as its shelf will */
    const lp = layerOf(); if (lp && lp._pv) return;
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
    if (VIEW.v === "shelf" && SH) { if (SH.hovK) wireTile(SH); else if (hov) wireShelf(SH, hov); }
    else if (VIEW.v === "study" && RM) { if (LW) drawLive(); else wireRoom(true); }
  };
  IDX.addEventListener("scroll", () => { cancelAnimationFrame(sc); sc = requestAnimationFrame(rewire); }, { passive: true });
  let rz = 0;
  addEventListener("resize", () => {
    cancelAnimationFrame(rz);
    rz = requestAnimationFrame(() => {
      fit();
      HTML.classList.toggle("sheet", staged() && phone());
      if (!staged()) render();
      /* the shelf's layout hears of it; one that does not listen is set
         afresh when the stage's width or height moves much */
      if (SH && SH.visible && SH.view) {
        if (SH.view.onResize) { try { SH.view.onResize(); } catch (e) { /* the layout's own */ } }
        else if (Math.abs(SH.layer.clientWidth - SH.W) > 30 || Math.abs(SH.layer.clientHeight - SH.V) > 80) {
          const f = SH.layer.scrollTop / Math.max(1, SH.layer.scrollHeight); mountLayout(SH); SH.layer.scrollTop = f * SH.layer.scrollHeight;
        }
        SH.W = SH.layer.clientWidth; SH.V = SH.layer.clientHeight; pastCheck(SH);
      }
      clearWires();
      /* a room keeps its fan */
      if (VIEW.v === "study" && RM) { if (LW) drawLive(); else wireRoom(true); }
    });
  });

  buildIndex();
  const start = () => {
    fit(true); render(); HTML.classList.add("ready");
    /* an address opens its depth directly */
    const st = history.state && history.state.v ? (history.state.v === "study" ? { v: "study", k: history.state.k, from: history.state.from } : history.state.v === "shelf" ? { v: "shelf", key: history.state.key } : { v: "rest" }) : parse(location.hash);
    if (keyOf(st) !== decodeURIComponent(location.hash.replace(/^#/, ""))) Object.assign(st, parse(location.hash));
    history.replaceState({ v: st.v, key: st.key || null, k: st.k || null, from: st.from || null, back: history.state ? history.state.back : undefined }, "", keyOf(st) ? "#" + keyOf(st) : location.pathname + location.search);
    /* an address opened cold rises as it did: the page's own arrival is
       the curtain there */
    if (st.v !== "rest") apply(st, { curtain: false });
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
  window.XREF = { ENTRIES, GROUPS, FIGS, KEYMAP, show, fit, go, setIndex, get ix() { return IX; }, get view() { return VIEW; }, get shelf() { return SH; }, get room() { return RM; }, shelves: SHELVES, get layout() { return SH ? SH.lid : layoutId(); }, setShelf: setShelfLayout };
})();
