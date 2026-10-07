/* ── DENSITY: THE SHARED KIT (26 Sept 2026) ───────────────────────────
   Loads after fragments.js. Everything is on window.D.

   The fragments are the unit: a picture, a line (his sentence), a num
   (a figure and its label), a fact (a study's spec line), a tool, a
   palette, steps, a chart, a day (a daybook entry). Each carries k, the
   study it came from ("about" and "daybook" are the two that are not
   studies). This kit gives every prototype the same honest pictures,
   the same search, the same names; how they are laid out is the
   prototype's own business.

   Two rules it exists to enforce:
   - A picture is never shown wider than half its own pixels
     (D.maxCss). Thumbnails come first; the file only when needed.
   - Nothing is written here. A prototype may arrange his words; it
     never adds to them. */
(() => {
  const DATA = window.DENSITY;
  /* pictures he has taken out of the new site, by file (30 Sept 2026,
     A.R.C.'s chromatic brand circle: "let's remove this"). Gone from every
     view here; the live case study keeps it until he says */
  const SKIP_PICS = new Set(["/case-studies/arc/chromatic-brand-circle.png"]);
  DATA.frags = DATA.frags.filter((f) => !(f.kind === "pic" && SKIP_PICS.has(f.src)));
  const FR = DATA.frags;
  const STUDY = {}; DATA.studies.forEach((s) => { STUDY[s.k] = s; });
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* ── names: two studies share a title (three Hill Country rooms, two
     Fairview rooms), and the room tells them apart ── */
  const TITLES = {}; DATA.studies.forEach((s) => { TITLES[s.t] = (TITLES[s.t] || 0) + 1; });
  /* a room that is not a study (6 Oct 2026, Signal: scripts/build-signal.mjs
     writes window.DENSITY_ROOMS): the rooms read it as a study, and the
     index never counts it as one */
  const ROOMX = (k) => (window.DENSITY_ROOMS && window.DENSITY_ROOMS[k]) || null;
  const title = (k) => {
    if (k === "about") return "About";
    if (k === "daybook") return "Daybook";
    if (ROOMX(k)) return ROOMX(k).study.t;
    const s = STUDY[k]; if (!s) return k;
    if (TITLES[s.t] < 2) return s.t;
    return s.t + ", " + String(s.s || "").replace(/^interior design,\s*/i, "");
  };
  const year = (k) => (STUDY[k] ? STUDY[k].y : ROOMX(k) ? ROOMX(k).study.y : "");
  const href = (k) => (STUDY[k] ? "/case-studies/" + STUDY[k].h : k === "daybook" ? "/daybook" : "/");
  /* the board's six lines, by tag */
  const LINE = {}; (DATA.lines || []).forEach((l) => { LINE[l.tag] = l; });

  /* ── pictures, honestly ── */
  const maxCss = (f) => (f && f.w ? f.w / 2 : 0);
  const dpr = () => Math.min(2, window.devicePixelRatio || 1);
  const rung = (f, cssW) => {
    const need = cssW * dpr();
    if (f.t384 && need <= 384) return f.t384;
    if (f.t768 && need <= 768) return f.t768;
    return f.src;
  };
  const img = (f, cssW, o) => {
    const im = el("img"); const opt = o || {};
    im.alt = f.alt || ""; im.decoding = "async"; im.loading = opt.eager ? "eager" : "lazy";
    const set = [];
    if (f.t384) set.push(encodeURI(f.t384) + " 384w");
    if (f.t768) set.push(encodeURI(f.t768) + " 768w");
    set.push(encodeURI(f.src) + " " + f.w + "w");
    im.srcset = set.join(", ");
    im.sizes = Math.max(1, Math.round(cssW || 200)) + "px";
    im.src = encodeURI(rung(f, cssW || 200));
    return im;
  };

  /* ── colour: which ink reads on a fill ── */
  const lum = (hex) => {
    const h = String(hex || "#fff").replace("#", ""); const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ink = (hex) => ((1.05) / (lum(hex) + 0.05) >= (lum(hex) + 0.05) / 0.05 ? "#fff" : "#000");

  /* ── the words a fragment carries, for search and for a caption ── */
  const words = (f) => {
    switch (f.kind) {
      case "pic": return f.alt || "";
      case "line": return f.text + (f.note ? " " + f.note : "") + (f.head ? " " + f.head : "");
      case "num": return f.value + " " + f.label + " " + (f.sub || "");
      case "fact": return f.label + " " + f.value;
      case "tool": return f.value + " " + f.label;
      case "palette": return (f.title || "") + " " + f.colors.map((c) => (c.name || "") + " " + (c.role || "")).join(" ");
      case "steps": return (f.title || "") + " " + (f.duration || "") + " " + f.steps.map((s) => s.title + " " + (s.note || "")).join(" ");
      case "chart": return (f.title || "") + " " + f.bars.map((b) => b.label + " " + b.value).join(" ") + " " + (f.callout || "");
      case "day": return (f.title || "") + " " + f.body.join(" ") + " " + f.project;
      default: return "";
    }
  };

  /* ── search: plain counting, no model. A word matches a fragment's own
     words, its study's name and discipline, or, through a small set of
     plain synonyms, one of the board's lines ── */
  const SYN = {
    app: ["app", "apps", "ios", "iphone", "mobile", "software", "product", "tool", "tools"],
    systems: ["system", "systems", "workflow", "workflows", "process", "operations", "operating", "efficiency", "automation", "ai", "agents", "strategy", "team", "teams"],
    branding: ["brand", "branding", "logo", "logos", "identity", "mark", "marks", "pattern", "patterns", "type", "typography", "packaging"],
    creative: ["campaign", "campaigns", "creative", "shoot", "photography", "photo", "art", "direction", "editorial", "fashion"],
    digital: ["site", "sites", "website", "websites", "web", "ecommerce", "digital", "cms", "store", "stores", "launch"],
    interiors: ["interior", "interiors", "kitchen", "kitchens", "bath", "bathroom", "room", "rooms", "home", "homes", "house", "remodel", "materials"],
  };
  const tokens = (q) => String(q || "").toLowerCase().split(/[^a-z0-9$%']+/).filter((w) => w.length > 1);
  const hay = new Map();
  const hayOf = (f) => {
    if (hay.has(f.id)) return hay.get(f.id);
    const s = STUDY[f.k];
    const h = { own: words(f).toLowerCase(), study: s ? (s.t + " " + s.s + " " + (s.fact || "")).toLowerCase() : f.k, tags: s ? s.tags : [] };
    hay.set(f.id, h); return h;
  };
  const search = (q, pool) => {
    const ts = tokens(q); if (!ts.length) return [];
    const lines = Object.entries(SYN).filter(([, list]) => ts.some((t) => list.includes(t))).map(([tag]) => tag);
    const out = [];
    for (const f of pool || FR) {
      const h = hayOf(f); let score = 0;
      for (const t of ts) {
        const re = new RegExp("\\b" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
        if (re.test(h.own)) score += 3; else if (h.own.includes(t)) score += 1;
        if (re.test(h.study)) score += 2;
      }
      lines.forEach((tag) => { if (h.tags.includes(tag)) score += 1.5; });
      if (score > 0) out.push({ f, score });
    }
    return out.sort((a, b) => b.score - a.score);
  };

  /* ── the reference system (27 Sept 2026, his "yes, try the locators and
     see also", with a catalogue's picture index beside it: "ABB. 6
     S. 21"). Every study has a number, oldest first, so a new study
     takes the next one and nothing renumbers. A place inside a study is
     its number and the section it sits in, 26.03, the way a catalogue
     gives a figure and its page. A section's number is the study's own
     ("SECTION 03: ..."); whatever comes before the first is 01 ── */
  const NUM = new Map();
  DATA.studies.map((s, i) => [s, i]).sort((a, b) => (a[0].y || 0) - (b[0].y || 0) || a[1] - b[1])
    .forEach(([s], i) => NUM.set(s.k, String(i + 1).padStart(2, "0")));
  const SEC = new Map();
  (() => {
    let k = null, cur = "01", count = 1;
    FR.forEach((f) => {
      if (f.k !== k) { k = f.k; cur = "01"; count = 1; }
      if (f.kind === "line" && f.weight === "head" && f.where === "section-header") {
        count++;
        const m = /^\s*section\s+(\d+)/i.exec(String(f.label || ""));
        cur = m ? m[1].padStart(2, "0") : String(count).padStart(2, "0");
      }
      SEC.set(f.id, cur);
    });
  })();
  const num = (k) => NUM.get(k) || "";
  const secOf = (f) => (f && SEC.get(f.id)) || "01";
  const loc = (f) => (f ? num(f.k) + "." + secOf(f) : "");

  window.D = {
    data: DATA, frags: FR, studies: DATA.studies, study: (k) => STUDY[k] || (ROOMX(k) && ROOMX(k).study) || undefined, lines: LINE, num, secOf, loc,
    /* a room's own words when it is not a study (Signal), else its fragments */
    roomFrags: (k) => (ROOMX(k) ? ROOMX(k).frags : FR.filter((f) => f.k === k)), isRoom: (k) => !!ROOMX(k),
    byKind: (kind) => FR.filter((f) => f.kind === kind),
    byStudy: (k) => FR.filter((f) => f.k === k),
    title, year, href, words, search, tokens,
    img, rung, maxCss, lum, ink, el, esc,
    /* a caption the house would write: the study, then its year in grey */
    cap: (k) => esc(title(k)) + (year(k) ? ' <span class="y">' + year(k) + "</span>" : ""),
  };
})();
