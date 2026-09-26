/* ── THE WORKINGS: the table and the drawing (26 Sept 2026) ──────────
   Loads after fragments.js and density.js. Everything visible comes
   out of window.DENSITY; this file only decides where it goes.

   Three layers:
   1. W, the hand-mapped table. Per study, which of his sentences are
      its time, its steps, its parts, its figures, its before and after.
      Every string in it is a quote. The only things written here are
      the numbers that place a quote on a drawing (days, counts, square
      feet), and each one is the number the quote itself states.
   2. The guard. Every string in W is looked for, exactly, in that
      study's own fragments before anything is drawn. A quote that is
      not found is dropped and named in the console, so a paraphrase
      cannot reach the page.
   3. The drawing. The ledger (all studies, one line each, on shared
      axes) and the sheet (one study, opened in place). */
(() => {
  const D = window.D;
  const el = D.el;
  const esc = D.esc;

  /* ── 1. THE TABLE ──────────────────────────────────────────────────
     time   { say, src, days }  a duration he states. say is the words
            drawn on the line, src the sentence they come from, days
            where it sits on the axis (six weeks = 42).
     steps  [{ days, say }]     timed steps, lengths in days, in order.
     order  { steps[], src }    a sequence he states with no durations.
            Drawn as order only: no scale, no ticks.
     parts  [{ n, say }]        a count he states. n squares, drawn.
     figs   [{ value, say, pct?, sqft? }]  a figure and its sentence.
     ba     { before, after, src? }  what it was, what it is.
     saves  [{ from, to }]      a time he says it took before and after,
            placed on the same axis as the durations.
     was    [{ head, say }]     "used to" lines, under their own heads.
     lead   the figure the ledger shows, when it comes from a num.
     Add a study by adding a key. A study with no key still gets its
     line: name, lines, tools, pictures, and gaps where nothing is said. */
  const W = {
    "branding-graphics": {
      time: { say: "about ten years", src: "Album covers, posters, art prints, logos, and one storefront window, made over about ten years for musicians, friends, and a handful of brands.", days: 3652 },
      parts: [{ n: 4, say: "Four album covers" }, { n: 5, say: "Five logos for five clients." }, { n: 1, say: "one storefront window" }],
    },
    "neiman-marcus": {
      order: { src: "The concept came first, then the shoot, then the styling and the layout.", steps: ["The concept", "the shoot", "the styling and the layout"] },
    },
    "nordstrom-personalization": {
      parts: [{ n: 3, say: "three tile shapes" }],
    },
    "jeffrey-ecommerce": {
      order: { src: "So the templates for a launch or a new story came first, and the product pages came after.", steps: ["the templates for a launch or a new story", "the product pages"] },
    },
    "ivy-park": {
      time: { say: "Six weeks", src: "Six weeks from moodboard to live, and most of the product gone within days.", days: 42 },
      steps: [
        { days: 7, say: "Week one: references, moodboards, competitive audit." },
        { days: 21, say: "Weeks two through four: wireframes, design concepts, copywriting, motion studies, all of it presented to Beyoncé's creative team, revisions turned around overnight." },
        { days: 14, say: "Weeks five and six: build and ship." },
      ],
      parts: [{ n: 1, say: "One scrolling brand experience." }],
      figs: [{ value: "95%", pct: 95, say: "95% of the product sold out within days." }],
      ba: { before: "Every photo came in as a rectangle.", after: "Then the shape was on everything." },
    },
    "nordstrom-framework": {
      parts: [{ n: 4, say: "four named buckets" }],
      figs: [{ value: "22%", pct: 22, say: "Engagement lifted 22% over two years." }],
      order: { src: "Pitched it to merchandising, marketing, and editorial, and it was organizing the teams before it reached a customer.", steps: ["Pitched it to merchandising, marketing, and editorial", "it was organizing the teams", "it reached a customer"] },
    },
    "amber-shockey-co": {
      parts: [{ n: 3, say: "Three tableware collections" }, { n: 3, say: "A hero, a secondary, and an accent pattern in each" }],
    },
    "loved-by-nordstrom": {
      time: { say: "Twelve months", src: "Twelve months across social feeds, email sends, in-store signage, and web landing pages.", days: 365 },
      parts: [{ n: 1, say: "One borrowed icon" }, { n: 2, say: "two tiers" }],
    },
    "jeffrey-spring": {
      parts: [{ n: 3, say: "three dress stories" }],
    },
    "nordstrom-beauty": {
      parts: [{ n: 3, say: "three story templates" }],
    },
    "hill-country-oak": {
      parts: [{ n: 3, say: "Color blocks, silhouette and type, at every size." }],
    },
    "j-christianson": {
      order: { src: "J. Christianson is a fashion and home goods label, and the brand started from nothing: the name first, then the mark, the palette, the type, and the product graphics.", steps: ["the name", "the mark", "the palette", "the type", "the product graphics"] },
      parts: [{ n: 4, say: "A four-circle mark" }, { n: 4, say: "four colorways" }],
    },
    "cosmo-prof": {
      order: { src: "Photography first, and the rest of the site built to sit around it.", steps: ["Photography", "the rest of the site"] },
    },
    "you-by-sally": {
      order: { src: "Casting first, and the portraits led everything after it. Then swatches big enough to pick a shade from.", steps: ["Casting", "the portraits", "swatches big enough to pick a shade from"] },
      parts: [{ n: 3, say: "Avenir Next in three weights" }],
    },
    "fairview-bedroom": {
      figs: [{ value: "600 sq ft", sqft: 600, say: "600 sq ft primary suite and ensuite, vaulted to fourteen feet" }],
    },
    "big-bend": {
      order: { src: "The photographs came home from a family trip and sat in a folder. Later, Capitan Boot Co. needed the West Texas desert behind its boots, and it was already in there.", steps: ["The photographs came home from a family trip", "sat in a folder", "Capitan Boot Co. needed the West Texas desert behind its boots"] },
    },
    "hill-country-kitchen": {
      parts: [{ n: 4, say: "four materials" }],
      order: { src: "Four materials, picked before the first cabinet was drawn and used on every surface.", steps: ["Four materials, picked", "the first cabinet was drawn", "used on every surface"] },
      figs: [{ value: "Eight feet", say: "Eight feet of usable counter, with the open shelving facing the dining side." }],
    },
    "hill-country-bath": {
      figs: [{ value: "400 sq ft", sqft: 400, say: "400 sq ft, two vanities, a freestanding tub, and a marble shower with a bench, all under a wood plank ceiling." }],
      parts: [{ n: 3, say: "Three marbles" }, { n: 2, say: "two vanities" }],
    },
    "black-white-type": {
      parts: [{ n: 6, say: "Six patterns" }, { n: 3, say: "three lithographs" }],
    },
    "hill-country-living": {
      parts: [{ n: 4, say: "Stone, pine, brass, leather." }],
    },
    "floor-and-decor": {
      parts: [{ n: 3, say: "three bathrooms" }, { n: 1, say: "one material kit" }],
      order: { src: "The stone, the wood and the metals were chosen together, before any of the rooms was drawn.", steps: ["The stone, the wood and the metals were chosen together", "the rooms was drawn"] },
    },
    "fairview-sitting": {
      parts: [{ n: 4, say: "four charcoal velvet swivel chairs" }],
    },
    "fairview-entry": {
      figs: [{ value: "two stories tall", say: "The Fairview entry, two stories tall." }],
    },
    "chalet": {
      order: { steps: ["Blue carpet, dated railings, an exterior that disappeared on cloudy days.", "Took it down to the studs.", "Exterior repainted warm gray with white railings."] },
      figs: [{ value: "over 400 square feet", sqft: 400, say: "The original footprint gained over 400 square feet." }],
    },
    "arc": {
      time: { say: "ten weeks", src: "Concept to live product in ten weeks.", days: 70 },
      /* the steps come from the study's own steps fragment (titles and
         "2 wks"); these are his sentences for the same five spans */
      stepLines: [
        "Weeks 1-2 went to checking the idea.",
        "Weeks 3-4 were the architecture: database schema, user flow, the room and item data models, authentication, storage.",
        "Weeks 5-6 were interface design and the build of it, at the same time, with no handoff between what I meant and what showed up in code.",
        "Weeks 7-8 were the financial layer, the insurance gap calculation and the policy limit comparison.",
        "Weeks 9-10 were the brand identity and visual system, the marketing site, and the go-to-market work, and then launch.",
      ],
      parts: [{ n: 13, say: "thirteen categories" }],
      lead: "$49,630",
      ba: {
        before: "You open a spreadsheet, walk room to room, describe each item, look up what it would cost to replace, photograph it, and attach the receipt.",
        after: "You point it at a room, photo or video, and it identifies what is there, estimates replacement value, and categorizes everything in the same pass.",
      },
      saves: [{ from: { say: "8-12 hours", lo: 8 / 24, hi: 12 / 24 }, to: { say: "~30 minutes", at: 30 / 1440 } }],
    },
    "robert-rodriguez": {
      time: { say: "one day", src: "A spring campaign for Neiman Marcus, shot in one day and run across social, email, the stores, and editorial.", days: 1 },
      parts: [{ n: 1, say: "One model" }, { n: 4, say: "four setups" }],
    },
    "sally-os": {
      time: { say: "about four months", src: "Design and full-stack, brand to backend, in about four months, from inside the marketing team", days: 122 },
      ba: {
        before: "Four months ago this was a spreadsheet and a group chat.",
        after: "Four months in, it is six deployed applications with a shared brain, and the system now reads the market and the customers on its own and proposes the campaigns.",
      },
      parts: [{ n: 6, say: "Six deployed applications" }, { n: 5, say: "five AI providers" }],
      figs: [{ value: "2,000+", say: "2,000+ stores with regional variation" }],
      saves: [{ from: { say: "Half a day", at: 0.5 }, to: { say: "three minutes", at: 3 / 1440 }, src: "Half a day of a designer's time, down to one click and three minutes." }],
      was: [
        { head: "Shelf Talker Generator", say: "That used to be hours of InDesign layout every promo cycle." },
        { head: "Image Compliance Scanner", say: "The problems it catches used to turn up in legal review, weeks after production wrapped." },
        { head: "Email Template Previewer", say: "It replaces the send-test-check-fix loop that used to add days to every email campaign." },
        { head: "Inside the Team", say: "When something was slow I could see it and change it, and the time between spotting a problem and shipping the fix went from months to days." },
      ],
    },
    "dsc": {
      ba: { before: "text threads and a spreadsheet", after: "one roster the software can work with", src: "A hundred-plus people moving off text threads and a spreadsheet and onto one roster the software can work with." },
      parts: [{ n: 6, say: "Six trainers" }, { n: 11, say: "eleven tools" }],
      lead: "100+",
    },
    "sizzle": {
      time: { say: "a day", src: "The build took a day with Claude Code, most of it spent finessing the timing so the stills feel like motion and not a slideshow.", days: 1 },
      parts: [{ n: 14, say: "Transition types" }],
      lead: "4.8KB",
    },
  };

  /* ── 2. THE GUARD ──────────────────────────────────────────────────
     A study's haystack is every word its fragments carry. A quote in W
     must sit inside one of them exactly, or it does not draw. */
  const HAY = {};
  const hay = (k, s) => { if (s == null || s === "") return; (HAY[k] = HAY[k] || []).push(String(s)); };
  D.frags.forEach((f) => {
    ["text", "head", "note", "value", "label", "sub", "title", "duration", "callout", "suffix"].forEach((p) => hay(f.k, f[p]));
    (f.steps || []).forEach((s) => { hay(f.k, s.title); hay(f.k, s.note); });
    (f.bars || []).forEach((b) => { hay(f.k, b.label); hay(f.k, b.value); });
  });
  D.studies.forEach((s) => ["t", "s", "fact", "rest"].forEach((p) => hay(s.k, s[p])));
  const said = (k, s) => typeof s === "string" && s.length > 0 && (HAY[k] || []).some((h) => h.includes(s));
  const drop = (k, what, s) => console.warn("workings: not found in " + k + ", dropped (" + what + "): " + s);
  Object.keys(W).forEach((k) => {
    const w = W[k];
    if (!D.study(k)) { drop(k, "study", k); delete W[k]; return; }
    if (w.time && !(said(k, w.time.say) && said(k, w.time.src))) { drop(k, "time", w.time.say); delete w.time; }
    if (w.steps) w.steps = w.steps.filter((s) => said(k, s.say) || (drop(k, "step", s.say), false));
    if (w.stepLines) w.stepLines = w.stepLines.map((s) => (said(k, s) ? s : (drop(k, "step line", s), "")));
    if (w.order) {
      w.order.steps = w.order.steps.filter((s) => said(k, s) || (drop(k, "order", s), false));
      if (w.order.src && !said(k, w.order.src)) { drop(k, "order source", w.order.src); delete w.order.src; }
      if (w.order.steps.length < 2) delete w.order;
    }
    if (w.parts) w.parts = w.parts.filter((p) => said(k, p.say) || (drop(k, "part", p.say), false));
    if (w.figs) w.figs = w.figs.filter((f) => (said(k, f.value) && said(k, f.say)) || (drop(k, "figure", f.value), false));
    if (w.ba && !(said(k, w.ba.before) && said(k, w.ba.after) && (!w.ba.src || said(k, w.ba.src)))) { drop(k, "before/after", w.ba.before); delete w.ba; }
    if (w.saves) w.saves = w.saves.filter((s) => (said(k, s.from.say) && said(k, s.to.say) && (!s.src || said(k, s.src))) || (drop(k, "saving", s.from.say), false));
    if (w.was) w.was = w.was.filter((x) => (said(k, x.head) && said(k, x.say)) || (drop(k, "was", x.say), false));
    if (w.lead && !said(k, w.lead)) { drop(k, "lead", w.lead); delete w.lead; }
  });
  const w = (k) => W[k] || {};

  /* his words, with any em dash in the data drawn as a short rule
     instead of set as a character (one Published fact carries one
     between two years) */
  const say = (s) => esc(s).replace(/\s*\u2014\s*/g, '<span class="rule" aria-label="to"></span>');

  /* ── numbers the data already carries, read as they are ── */
  const nums = (k) => D.byStudy(k).filter((f) => f.kind === "num");
  const stepsFrag = (k) => D.byStudy(k).find((f) => f.kind === "steps");
  const chartFrag = (k) => D.byStudy(k).find((f) => f.kind === "chart");
  const pics = (k) => D.byStudy(k).filter((f) => f.kind === "pic");
  const facts = (k) => D.byStudy(k).filter((f) => f.kind === "fact");
  const stack = (k) => D.byStudy(k).filter((f) => f.kind === "tool" && f.label !== "Service").map((f) => f.value);
  /* timed steps, from the table or from the study's steps fragment
     ("2 wks" is two weeks: the only arithmetic on the page) */
  const timedSteps = (k) => {
    const o = w(k);
    if (o.steps && o.steps.length) return o.steps;
    const sf = stepsFrag(k);
    if (!sf) return null;
    const out = sf.steps.map((s, i) => {
      const m = /([\d.]+)\s*wk/.exec(s.note || "");
      return m ? { days: parseFloat(m[1]) * 7, title: s.title, note: s.note, say: (o.stepLines || [])[i] || "" } : null;
    });
    return out.every(Boolean) ? out : null;
  };
  const leadFig = (k) => {
    const o = w(k);
    if (o.lead) return { value: o.lead, say: (nums(k).find((n) => n.value === o.lead) || {}).label || "" };
    if (o.figs && o.figs.length) return o.figs[0];
    return null;
  };
  const tagged = (k) => (D.study(k) ? D.study(k).tags : []);
  const LINES = ["digital", "app", "systems", "creative", "branding", "interiors"].map((t) => D.lines[t]).filter(Boolean);

  /* a study's own colours for its tallies: its palette, less the
     near-whites that would vanish on the paper */
  const tallyInks = (k) => {
    const pal = (D.study(k) && D.study(k).palette) || [];
    const dark = pal.filter((h) => D.lum(h) < 0.45);
    return dark.length ? dark : ["#000"];
  };

  /* ── time, on one axis: a minute to a decade, logarithmic ─────────
     Durations grow right from the Day line. Left of it, in minutes and
     hours, is where a before and after lands when he gives one. */
  const LG = Math.log10;
  const TICKS = [["Minute", 1 / 1440], ["Hour", 1 / 24], ["Day", 1], ["Week", 7], ["Month", 30.44], ["Year", 365.25], ["Decade", 3652.5]];
  const LO = LG(1 / 1440) - 0.22, HI = LG(3652.5) + 0.34;
  const X = (days) => Math.max(0, Math.min(100, ((LG(days) - LO) / (HI - LO)) * 100));
  const timed = D.studies.filter((s) => w(s.k).time).map((s) => s.k);

  /* marks for one study on a time axis. The phrase is placed later,
     once the lane has a width (placeDims). */
  const axisMarks = (k, host, o) => {
    const opt = o || {};
    const t = w(k).time;
    if (t) {
      const a = X(1), b = X(t.days);
      const bar = el("i", "bar"); bar.style.left = a + "%"; bar.style.width = Math.max(0, b - a) + "%"; host.appendChild(bar);
      const s1 = el("i", "sl"); s1.style.left = a + "%"; host.appendChild(s1);
      if (b - a > 0.3) { const s2 = el("i", "sl"); s2.style.left = b + "%"; host.appendChild(s2); }
      const st = timedSteps(k);
      if (st) {
        let cum = 0;
        st.slice(0, -1).forEach((s) => { cum += s.days; const g = el("i", "gap"); g.style.left = X(cum) + "%"; host.appendChild(g); });
      }
      /* in the sheet the span is already named large above its own
         line; on the practice axis the ink bar is enough */
      if (!opt.big) { const dt = el("span", "dt", say(t.say)); dt.dataset.a = a; dt.dataset.b = b; host.appendChild(dt); }
    }
    (w(k).saves || []).forEach((s) => {
      const lo = s.from.lo || s.from.at, hi = s.from.hi || s.from.at, to = s.to.at;
      const rg = el("i", "sv-from"); rg.style.left = X(lo) + "%"; rg.style.width = Math.max(0.6, X(hi) - X(lo)) + "%"; host.appendChild(rg);
      const ar = el("i", "sv-arrow"); ar.style.left = X(to) + "%"; ar.style.width = (X(lo) - X(to)) + "%"; host.appendChild(ar);
      if (opt.big) {
        const f = el("span", "sv-t from", say(s.from.say)); f.style.left = X(hi) + "%"; host.appendChild(f);
        const e = el("span", "sv-t to", say(s.to.say)); e.style.left = X(to) + "%"; host.appendChild(e);
      }
    });
  };
  /* dimension text sits after the line's end when there is room, and
     on the line (the line broken under it) when there is not */
  const placeDims = (root) => {
    root.querySelectorAll(".dt").forEach((dt) => {
      const lane = dt.parentElement; const W0 = lane.clientWidth; if (!W0) return;
      const a = (+dt.dataset.a / 100) * W0, b = (+dt.dataset.b / 100) * W0, tw = dt.offsetWidth;
      dt.classList.remove("on", "up");
      const roomy = lane.classList.contains("axl");
      const saves = !!lane.querySelector(".sv-arrow");
      if (b + 7 + tw <= W0) dt.style.left = (b + 7) + "px";
      else if (b - a >= tw + 18) { dt.style.left = ((a + b) / 2 - tw / 2) + "px"; dt.classList.add("on"); }
      /* no room after and too short to hold its words: in the sheet the
         words go above the line; in a ledger lane they go before it,
         unless a before and after already lives there */
      else if (roomy) { dt.style.left = Math.max(0, Math.min(W0 - tw, b - tw)) + "px"; dt.classList.add("up"); }
      else if (!saves && a - 7 - tw >= 0) dt.style.left = (a - 7 - tw) + "px";
      else { dt.style.left = Math.max(0, Math.min(W0 - tw, (a + b) / 2 - tw / 2)) + "px"; dt.classList.add("on"); }
    });
    /* an axis label never leaves its lane */
    root.querySelectorAll(".axl, .hc.c-time").forEach((lane) => {
      const W0 = lane.clientWidth; if (!W0) return;
      const L = lane.getBoundingClientRect().left;
      lane.querySelectorAll(".sv-t, .cbl, .cc, .tk").forEach((t) => {
        t.style.translate = "";
        const r = t.getBoundingClientRect(); if (!r.width) return;
        const l = r.left - L, rr = r.right - L;
        const dx = l < 0 ? -l : rr > W0 ? W0 - rr : 0;
        if (dx) t.style.translate = dx + "px 0";
      });
    });
  };

  /* ── tallies: a stated count, drawn as that many squares ── */
  const tally = (k, parts, big, from) => {
    const inks = tallyInks(k); const box = el("span", "tally" + (big ? " big" : ""));
    parts.forEach((p, gi) => {
      const g = el("span", "tg"); g.style.setProperty("--c", inks[(gi + (from || 0)) % inks.length]);
      for (let i = 0; i < p.n; i++) { const sq = el("i"); sq.style.setProperty("--j", i); g.appendChild(sq); }
      box.appendChild(g);
    });
    return box;
  };
  /* a figure's own glyph: a share as a filled bar, an area as a square
     drawn to one scale across every study */
  const figGlyph = (f, big) => {
    if (f.pct != null) { const g = el("span", "g-pct" + (big ? " big" : "")); const i = el("i"); i.style.width = f.pct + "%"; g.appendChild(i); return g; }
    if (f.sqft != null) { const g = el("span", "g-sq" + (big ? " big" : "")); const s = Math.sqrt(f.sqft) * (big ? 3.4 : 0.46); g.style.width = g.style.height = s.toFixed(1) + "px"; return g; }
    return null;
  };

  /* ── the page ─────────────────────────────────────────────────────*/
  const ROWS = document.getElementById("rows");
  const READ = document.getElementById("read");
  const HEAD = document.getElementById("colhead");
  const TIP = document.getElementById("tip");
  const phone = () => window.matchMedia("(max-width: 760px)").matches;
  let order = D.studies.map((s) => s.k);
  let sortBy = "year";
  let open = null;

  const no = (k) => String(D.studies.findIndex((s) => s.k === k) + 1).padStart(2, "0");

  /* the column heads */
  const buildHead = () => {
    HEAD.innerHTML = "";
    const c = (cls, h) => { const e = el("div", "hc " + cls, h); HEAD.appendChild(e); return e; };
    c("c-no", "No.");
    c("c-yr", "Year");
    c("c-nm", "Work");
    const ln = c("c-lines", "");
    LINES.forEach((l) => { const b = el("button", "lh", esc(l.name)); b.dataset.tag = l.tag; b.style.setProperty("--c", l.color); ln.appendChild(b); });
    const tl = c("c-time", "");
    const lab = el("span", "hl", "Time"); tl.appendChild(lab);
    TICKS.forEach(([n, d]) => { const t = el("span", "tk" + (n === "Day" ? " o" : ""), esc(n)); t.style.left = X(d) + "%"; tl.appendChild(t); });
    c("c-parts", "Parts");
    c("c-fig", "Figures");
    c("c-tools", "Tools");
    c("c-pics", "Pictures");
  };

  /* one study, one line */
  const buildRow = (k) => {
    const s = D.study(k); const o = w(k);
    const li = el("li", "row"); li.dataset.k = k;
    li.style.setProperty("--fill", s.fill);
    const ln = el("div", "ln");
    const cell = (cls, read) => { const e = el("div", "c " + cls); if (read) e.dataset.read = read; ln.appendChild(e); return e; };
    cell("c-no", "study").textContent = no(k);
    cell("c-yr", "study").textContent = s.y;
    cell("c-nm", "study").innerHTML = '<span class="nm">' + esc(D.title(k)) + "</span>";
    const lc = cell("c-lines", "lines");
    LINES.forEach((l) => { const i = el("i"); if (tagged(k).includes(l.tag)) { i.className = "on"; i.style.background = l.color; } lc.appendChild(i); });
    const tl = cell("c-time tl", "time");
    axisMarks(k, tl);
    const pc = cell("c-parts", "parts");
    if (o.parts && o.parts.length) {
      pc.appendChild(tally(k, o.parts));
      pc.appendChild(el("span", "ph", o.parts.map((p) => say(p.say)).join(' <b>·</b> ')));
    }
    const fc = cell("c-fig", "fig");
    const lf = leadFig(k);
    if (lf) { const g = figGlyph(lf); if (g) fc.appendChild(g); fc.appendChild(el("span", "fv", say(lf.value))); }
    const tc = cell("c-tools", "tools");
    const st = stack(k); if (st.length) tc.appendChild(el("span", "tv", st.map(esc).join(" <b>·</b> ")));
    const pcs = cell("c-pics", "");
    pics(k).slice(0, 4).forEach((f) => {
      const b = el("span", "th" + (f.alpha ? " a" : "")); b.dataset.read = "pic"; b.dataset.id = f.id;
      const im = D.img(f, 30); b.appendChild(im); pcs.appendChild(b);
    });
    li.appendChild(el("div", "sf"));
    li.appendChild(ln);
    const dw = el("div", "dw"); li.appendChild(dw);
    return li;
  };

  /* ── the readout: the band above the ledger reads what you point at ── */
  const statement = D.data.statement || {};
  const rbig = READ.querySelector(".big"), rsm = READ.querySelector(".sm"), rside = READ.querySelector(".side");
  const fit = (node, maxH, hi, lo) => {
    let size = hi; node.style.fontSize = size + "px";
    while (node.scrollHeight > maxH && size > lo) { size -= 2; node.style.fontSize = size + "px"; }
  };
  const bigSize = () => (phone() ? [34, 22] : [Math.round(Math.min(62, Math.max(40, innerHeight * 0.072))), 26]);
  let readKey = "";
  const setRead = (key, big, small, side) => {
    if (key === readKey) return; readKey = key;
    READ.classList.remove("in"); void READ.offsetWidth;
    rbig.innerHTML = ""; if (typeof big === "string") rbig.innerHTML = big; else if (big) rbig.appendChild(big);
    rsm.innerHTML = small || "";
    rside.innerHTML = ""; if (side) rside.appendChild(side);
    const [hi, lo] = bigSize();
    const rl = READ.querySelector(".rd-l"); const pad = parseFloat(getComputedStyle(rl).paddingBottom) || 0;
    const smH = rsm.innerHTML ? rsm.offsetHeight + 10 : 0;
    fit(rbig, rl.clientHeight - pad - smH - 4, hi, lo);
    READ.classList.add("in");
  };
  const readRest = () => {
    const side = el("ul", "prac");
    (D.data.practice || []).forEach((p) => side.appendChild(el("li", "", esc(p))));
    setRead("rest", esc(statement.ink || ""), '<span class="g">' + esc(statement.grey || "") + "</span>", side);
  };
  const capOf = (k) => '<span class="cap">' + no(k) + '&nbsp;&nbsp;' + D.cap(k) + "</span>";
  const readers = {
    study: (k) => { const s = D.study(k); setRead("s" + k, say(s.fact), '<span class="g">' + say(s.rest) + "</span>" + capOf(k)); },
    time: (k) => {
      const o = w(k);
      if (!o.time && !(o.saves || []).length) return readers.study(k);
      let small = o.time ? say(o.time.src) : "";
      (o.saves || []).forEach((s) => { small += (small ? "<br>" : "") + '<span class="g">' + (s.src ? say(s.src) : say(s.from.say) + " &rarr; " + say(s.to.say)) + "</span>"; });
      setRead("t" + k, o.time ? say(o.time.say) : say(o.saves[0].from.say) + " &rarr; " + say(o.saves[0].to.say), small + capOf(k));
    },
    parts: (k) => {
      const o = w(k); if (!o.parts || !o.parts.length) return readers.study(k);
      const box = el("div", "rparts");
      o.parts.forEach((p, i) => { const r = el("div", "rp"); r.appendChild(tally(k, [p], true, i)); r.appendChild(el("span", "", say(p.say))); box.appendChild(r); });
      setRead("p" + k, box, capOf(k));
    },
    fig: (k) => {
      const f = leadFig(k); if (!f) return readers.study(k);
      const n = nums(k).find((x) => x.value === f.value);
      setRead("f" + k, say(f.value), (n ? '<b class="lb">' + esc(n.label) + "</b> " + '<span class="g">' + esc(n.sub || "") + "</span>" : say(f.say)) + capOf(k));
    },
    tools: (k) => { const st = stack(k); if (!st.length) return readers.study(k); setRead("o" + k, st.map(esc).join(", "), capOf(k)); },
    lines: (k) => {
      const ls = LINES.filter((l) => tagged(k).includes(l.tag));
      const box = el("div", "rlines");
      ls.forEach((l) => { const r = el("span", "rl"); const i = el("i"); i.style.background = l.color; r.appendChild(i); r.appendChild(document.createTextNode(l.name)); box.appendChild(r); });
      setRead("l" + k, box, ls.map((l) => '<span class="g">' + esc(l.sentence) + "</span>").join("<br>") + capOf(k));
    },
    pic: (k, id) => {
      const f = D.frags.find((x) => x.id === id); if (!f) return;
      const side = el("div", "rpic");
      const hMax = Math.max(60, READ.clientHeight - 36);
      const h = Math.min(hMax, (f.h / 2)); const wd = Math.min(D.maxCss(f), h * f.w / f.h);
      const im = D.img(f, wd, { eager: true }); im.style.width = wd + "px"; im.style.height = (wd * f.h / f.w) + "px";
      if (f.alpha) side.classList.add("a");
      side.appendChild(im);
      const s = D.study(k); setRead("i" + id, say(s.fact), '<span class="g">' + say(s.rest) + "</span>" + capOf(k), side);
    },
  };

  /* ── the sheet: one study, drawn out ──────────────────────────────*/
  const lbl = (t, none) => el("div", "lbl" + (none ? " none" : ""), esc(t));
  const sheets = {};
  const buildSheet = (k) => {
    const s = D.study(k); const o = w(k); const ph = phone();
    const sh = el("div", "sheet" + (ph ? " ph" : ""));
    sh.style.setProperty("--fill", s.fill);

    /* the name, the lead, the lines it sits in; beside it the pictures */
    const nmb = el("div", "sh-name");
    nmb.appendChild(el("div", "sh-no", no(k) + '<span class="y">' + s.y + "</span>"));
    nmb.appendChild(el("h2", "sh-nm", esc(D.title(k))));
    nmb.appendChild(el("p", "sh-lead", say(s.fact) + ' <span class="g">' + say(s.rest) + "</span>"));
    const lns = el("div", "sh-lines");
    LINES.filter((l) => tagged(k).includes(l.tag)).forEach((l) => { const r = el("span", "rl"); const i = el("i"); i.style.background = l.color; r.appendChild(i); r.appendChild(document.createTextNode(l.name)); lns.appendChild(r); });
    nmb.appendChild(lns);
    sh.appendChild(nmb);
    const pz = el("div", "sh-pics");
    const ps = pics(k);
    if (ps.length) {
      const H = ph ? 120 : Math.round(Math.max(60, Math.min(112, (innerHeight - 560) * 0.15 + 50)));
      pz.style.setProperty("--ph", H + "px");
      ps.slice(0, ph ? 12 : 14).forEach((f) => {
        const wd = Math.min(D.maxCss(f), H * f.w / f.h); const ht = wd * f.h / f.w;
        const b = el("span", "pf" + (f.alpha ? " a" : "")); const im = D.img(f, wd);
        im.style.width = wd + "px"; im.style.height = ht + "px"; b.appendChild(im); pz.appendChild(b);
      });
    } else pz.appendChild(lbl("Pictures", true));
    sh.appendChild(pz);

    /* middle: time. Its own sequence at its own scale, then where it
       sits among every stated time in the practice */
    const tm = el("div", "sh-time");
    const st = o.time ? timedSteps(k) : null;
    if (o.time) {
      tm.appendChild(lbl("Time"));
      const seq = el("div", "seq" + (ph && st ? " v" : ""));
      const T = o.time.days;
      const dim = el("div", "dim"); dim.appendChild(el("i", "dl")); dim.appendChild(el("i", "sl a")); dim.appendChild(el("i", "sl b"));
      dim.appendChild(el("span", "dtx", say(o.time.say)));
      seq.appendChild(dim);
      const chain = el("div", "chain" + (st ? "" : " bare"));
      /* unit ticks: hours across a day, weeks across weeks, months
         across months, years across years; a scale, not a claim */
      const unit = T <= 1 ? 1 / 24 : T <= 120 ? 7 : T <= 730 ? 30.44 : 365.25;
      if (!(ph && st)) for (let d = unit; d < T - unit * 0.3; d += unit) { const t = el("i", "ut"); t.style.left = (d / T * 100) + "%"; chain.appendChild(t); }
      const segs = st || [{ days: T }];
      let cum = 0;
      segs.forEach((sg, i) => {
        const seg = el("div", "seg"); seg.style.width = (sg.days / T * 100) + "%";
        if (ph && st) seg.style.setProperty("--len", Math.max(34, sg.days * 3.2) + "px");
        seg.appendChild(el("i", "sl"));
        if (i === segs.length - 1) seg.appendChild(el("i", "sl end"));
        if (sg.title || sg.say) {
          const tx = el("div", "stx");
          if (sg.title) tx.appendChild(el("b", "", esc(sg.title) + (sg.note ? ' <span class="g">' + esc(sg.note) + "</span>" : "")));
          if (sg.say) tx.appendChild(el("span", "", say(sg.say)));
          seg.appendChild(tx);
        }
        chain.appendChild(seg); cum += sg.days;
      });
      seq.appendChild(chain);
      /* where he gives a before and an after of the same span, they sit
         at its two ends */
      if (!st && o.ba) {
        const ends = el("div", "ends");
        ends.appendChild(el("div", "end a", '<span class="lb">Before</span>' + say(o.ba.before)));
        ends.appendChild(el("div", "end b", '<span class="lb">After</span>' + say(o.ba.after)));
        seq.appendChild(ends);
      }
      if (!st && !o.ba) seq.appendChild(el("p", "src", say(o.time.src)));
      tm.appendChild(seq);
    } else if (o.order) {
      tm.appendChild(lbl("Order"));
      const od = el("div", "order" + (ph ? " v" : ""));
      const n = o.order.steps.length;
      o.order.steps.forEach((t, i) => {
        const nd = el("div", "nd"); nd.style.left = (n === 1 ? 0 : (i / (n - 1)) * 100) + "%";
        nd.classList.add(i === 0 ? "first" : i === n - 1 ? "last" : "mid");
        nd.style.setProperty("--n", i);
        nd.appendChild(el("i", "dot")); nd.appendChild(el("span", "", say(t)));
        od.appendChild(nd);
      });
      tm.appendChild(od);
      if (o.order.src) tm.appendChild(el("p", "src", say(o.order.src)));
    } else {
      tm.appendChild(lbl("Time", true));
    }
    /* the practice axis */
    const ax = el("div", "pax");
    const axl = el("div", "axl");
    TICKS.forEach(([n, d]) => { const t = el("span", "tk" + (n === "Day" ? " o" : ""), esc(n)); t.style.left = X(d) + "%"; axl.appendChild(t); const g = el("i", "gl" + (n === "Day" ? " o" : "")); g.style.left = X(d) + "%"; axl.appendChild(g); });
    timed.filter((x) => x !== k).forEach((x) => { const g = el("i", "ghost"); g.style.left = X(w(x).time.days) + "%"; g.dataset.k = x; axl.appendChild(g); });
    axisMarks(k, axl, { big: true });
    /* the study's chart, where it has one, is a before and after of
       the same job: its bars are the arrow above, its callout sits on it */
    const ch = chartFrag(k);
    if (ch && ch.callout && (o.saves || []).length) {
      const sv = o.saves[0]; const mid = (X(sv.to.at) + X(sv.from.lo || sv.from.at)) / 2;
      const cc = el("span", "cc", esc(ch.callout) + (ch.suffix ? " <span>" + esc(ch.suffix) + "</span>" : "")); cc.style.left = mid + "%"; axl.appendChild(cc);
      ch.bars.forEach((b, i) => { const t = el("span", "cbl " + (i ? "to" : "from"), esc(b.label)); t.style.left = (i ? X(sv.to.at) : X(sv.from.hi || sv.from.at)) + "%"; axl.appendChild(t); });
    }
    ax.appendChild(axl);
    tm.appendChild(ax);
    sh.appendChild(tm);

    /* low: figures, parts, before and after, and the title block */
    const low = el("div", "sh-low");
    const figs = el("div", "blk figs");
    const nf = nums(k).slice(0, 4);
    const tf = (o.figs || []);
    if (nf.length || tf.length) {
      figs.appendChild(lbl("Figures"));
      const grid = el("div", "fg" + (nf.length + tf.length > 1 ? " many" : ""));
      nf.forEach((n) => { const b = el("div", "fi"); b.appendChild(el("div", "fvv", say(n.value))); b.appendChild(el("div", "fl", "<b>" + esc(n.label) + "</b> " + '<span class="g">' + esc(n.sub || "") + "</span>")); grid.appendChild(b); });
      tf.forEach((f) => {
        const b = el("div", "fi"); const g = figGlyph(f, true);
        const v = el("div", "fvv", say(f.value)); b.appendChild(v); if (g) b.appendChild(g);
        b.appendChild(el("div", "fl g", say(f.say))); grid.appendChild(b);
      });
      figs.appendChild(grid);
    } else { figs.appendChild(lbl("Figures", true)); figs.classList.add("empty"); }
    low.appendChild(figs);

    const pb = el("div", "blk parts");
    if (o.parts && o.parts.length) {
      pb.appendChild(lbl("Parts"));
      o.parts.forEach((p, i) => { const r = el("div", "pr"); r.appendChild(tally(k, [p], true, i)); r.appendChild(el("div", "pt", say(p.say))); pb.appendChild(r); });
    } else { pb.appendChild(lbl("Parts", true)); pb.classList.add("empty"); }
    low.appendChild(pb);

    const ba = el("div", "blk ba");
    const baHere = o.ba && (st || !o.time);
    if (baHere || (o.was && o.was.length)) {
      if (baHere) {
        ba.appendChild(lbl("Before"));
        ba.appendChild(el("p", "bf", say(o.ba.before)));
        ba.appendChild(el("i", "arr"));
        ba.appendChild(lbl("After"));
        ba.appendChild(el("p", "af", say(o.ba.after)));
        if (o.ba.src) ba.appendChild(el("p", "src", say(o.ba.src)));
      }
      if (o.was && o.was.length) {
        ba.appendChild(lbl("Before"));
        const ul = el("div", "was");
        o.was.forEach((x) => ul.appendChild(el("p", "", "<b>" + esc(x.head) + "</b> " + '<span class="g">' + say(x.say) + "</span>")));
        ba.appendChild(ul);
      }
    } else { ba.appendChild(lbl("Before", true)); ba.classList.add("empty"); }
    low.appendChild(ba);
    [...low.children].filter((b) => b.classList.contains("empty")).forEach((b) => low.appendChild(b));

    /* the title block, the way a drawing sheet carries one */
    const tb = el("div", "tb");
    const fs = facts(k).filter((f) => f.label !== "Field");
    const order2 = ["Classification", "Published", "Status", "Author"];
    fs.sort((a, b) => { const ia = order2.indexOf(a.label), ib = order2.indexOf(b.label); return (ia < 0 ? 9 : ia) - (ib < 0 ? 9 : ib); });
    const short = fs.filter((f) => ["Published", "Status", "Author"].includes(f.label));
    const long = fs.filter((f) => !["Published", "Status", "Author"].includes(f.label));
    const r3 = el("div", "tr tri");
    short.forEach((f) => { const c = el("div", "td"); c.appendChild(el("span", "tl0", esc(f.label))); c.appendChild(el("span", "tv0", say(f.value))); r3.appendChild(c); });
    long.forEach((f) => { const r = el("div", "tr"); r.appendChild(el("span", "tl0", esc(f.label))); r.appendChild(el("span", "tv0", say(f.value))); tb.appendChild(r); });
    if (short.length) tb.insertBefore(r3, tb.firstChild);
    const last = el("div", "tr tri foot");
    const c1 = el("div", "td"); c1.appendChild(el("span", "tl0", "Sheet")); c1.appendChild(el("span", "tv0", no(k))); last.appendChild(c1);
    const c2 = el("div", "td wide"); c2.appendChild(el("span", "tl0", "Study"));
    const a = el("a", "tv0 go", esc(D.href(k)) + " &rarr;"); a.href = D.href(k); c2.appendChild(a); last.appendChild(c2);
    tb.appendChild(last);
    sh.appendChild(low);
    sh.appendChild(tb);
    return sh;
  };

  /* ── layout: at rest the whole practice fits one screen; open, the
     rest of it folds to strips above and below the sheet ── */
  const HD = () => document.getElementById("top").offsetHeight;
  const layout = () => {
    const root = document.documentElement;
    if (phone()) { root.style.removeProperty("--rh"); root.style.removeProperty("--dh"); }
    else {
      const chH = 56, n = D.studies.length;
      const rh = Math.max(15, Math.min(24, Math.floor((innerHeight - HD() - chH - 16 - 150) / n)));
      const readH = Math.max(130, Math.min(300, innerHeight - HD() - chH - 16 - rh * n));
      root.style.setProperty("--rd", readH + "px");
      root.style.setProperty("--rh", rh + "px");
      const strip = 4;
      const dh = Math.max(470, innerHeight - HD() - (D.studies.length - 1) * strip - rh - 14);
      root.style.setProperty("--dh", dh + "px");
    }
    placeDims(document);
    drawGrid();
  };
  /* the time column's hairlines run the full height of the ledger */
  const GRID = document.getElementById("grid");
  const drawGrid = () => {
    GRID.innerHTML = "";
    const lane = ROWS.querySelector(".row .tl"); if (!lane) return;
    const r = lane.getBoundingClientRect(), p = ROWS.getBoundingClientRect();
    GRID.style.left = (r.left - p.left) + "px"; GRID.style.width = r.width + "px";
    TICKS.forEach(([n, d]) => { const g = el("i", n === "Day" ? "o" : ""); g.style.left = X(d) + "%"; GRID.appendChild(g); });
  };

  const rowOf = (k) => ROWS.querySelector('.row[data-k="' + k + '"]');
  const openRow = (k) => {
    if (open === k) return closeRow();
    const prev = open; open = k;
    const li = rowOf(k);
    if (prev) { const p = rowOf(prev); p.classList.remove("on"); p.style.removeProperty("--own"); }
    const key = k + (phone() ? ":p" : ":d");
    if (!sheets[key]) sheets[key] = buildSheet(k);
    const dw = li.querySelector(".dw"); dw.innerHTML = ""; dw.appendChild(sheets[key]);
    document.documentElement.classList.add("open");
    ROWS.querySelectorAll(".row").forEach((r) => r.classList.toggle("strip", r !== li && !phone()));
    li.classList.add("on"); li.classList.remove("strip");
    document.getElementById("close").hidden = false;
    readKey = "";
    requestAnimationFrame(() => {
      placeDims(li);
      li.style.removeProperty("--own");
      if (!phone()) {
        const shEl = li.querySelector(".sheet");
        const need = shEl.scrollHeight;
        if (need > shEl.clientHeight + 2) li.style.setProperty("--own", need + "px");
      }
      if (phone()) {
        const y = li.getBoundingClientRect().top + scrollY - HD() - 4;
        window.scrollTo({ top: y, behavior: "smooth" });
      } else window.scrollTo({ top: 0 });
    });
    setTimeout(() => placeDims(li), 520);
    history.replaceState(null, "", "#" + k);
  };
  const closeRow = () => {
    if (!open) return;
    const li = rowOf(open); open = null;
    if (li) li.style.removeProperty("--own");
    document.documentElement.classList.remove("open");
    ROWS.querySelectorAll(".row").forEach((r) => r.classList.remove("strip", "on"));
    document.getElementById("close").hidden = true;
    TIP.classList.remove("in");
    readRest();
    history.replaceState(null, "", location.pathname);
    if (phone() && li) { const y = li.getBoundingClientRect().top + scrollY - HD() - 60; window.scrollTo({ top: Math.max(0, y) }); }
    setTimeout(() => placeDims(document), 520);
  };
  const step = (d) => {
    if (!open) return;
    const i = order.indexOf(open); const n = order[(i + d + order.length) % order.length];
    openRow(n);
  };

  /* ── sorting: by year, or by how long he says it took ── */
  const sortKeys = {
    year: () => D.studies.map((s) => s.k),
    time: () => {
      const t = D.studies.filter((s) => w(s.k).time).sort((a, b) => w(a.k).time.days - w(b.k).time.days || a.y - b.y).map((s) => s.k);
      return t.concat(D.studies.filter((s) => !w(s.k).time).map((s) => s.k));
    },
  };
  const resort = (by) => {
    sortBy = by; const next = sortKeys[by]();
    document.querySelectorAll(".sort button").forEach((b) => b.classList.toggle("on", b.dataset.sort === by));
    const first = new Map(); ROWS.querySelectorAll(".row").forEach((r) => first.set(r.dataset.k, r.getBoundingClientRect().top));
    next.forEach((k) => ROWS.appendChild(rowOf(k)));
    order = next;
    ROWS.querySelectorAll(".row").forEach((r) => {
      const dy = first.get(r.dataset.k) - r.getBoundingClientRect().top; if (!dy) return;
      r.style.transition = "none"; r.style.transform = "translateY(" + dy + "px)";
      requestAnimationFrame(() => requestAnimationFrame(() => { r.style.transition = ""; r.style.transform = ""; }));
    });
  };

  /* ── build ── */
  buildHead();
  D.studies.forEach((s, i) => { const r = buildRow(s.k); r.style.setProperty("--i", i); ROWS.appendChild(r); });
  readRest();
  layout();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { layout(); readKey = ""; if (!open) readRest(); });

  /* ── events ── */
  let hoverT = 0;
  ROWS.addEventListener("pointerover", (e) => {
    const row = e.target.closest(".row"); if (!row) return;
    const k = row.dataset.k;
    if (open) {
      if (row.classList.contains("strip") && !phone()) {
        TIP.innerHTML = D.cap(k);
        const r = row.getBoundingClientRect();
        TIP.style.top = (r.top + r.height / 2) + "px"; TIP.classList.add("in");
      }
      return;
    }
    if (phone() || e.pointerType === "touch") return;
    const c = e.target.closest("[data-read]");
    const kind = c ? c.dataset.read : "study";
    clearTimeout(hoverT);
    hoverT = setTimeout(() => (kind === "pic" ? readers.pic(k, c.dataset.id) : (readers[kind] || readers.study)(k)), 40);
  });
  ROWS.addEventListener("pointerleave", () => { clearTimeout(hoverT); TIP.classList.remove("in"); if (!open) hoverT = setTimeout(readRest, 160); });
  ROWS.addEventListener("pointerout", (e) => { if (open && !e.relatedTarget?.closest?.(".row.strip")) TIP.classList.remove("in"); });
  ROWS.addEventListener("click", (e) => {
    if (e.target.closest(".dw a")) return;
    const row = e.target.closest(".row"); if (!row) return;
    if (e.target.closest(".dw")) return;
    openRow(row.dataset.k);
  });
  document.getElementById("close").addEventListener("click", closeRow);
  document.querySelectorAll(".sort button").forEach((b) => b.addEventListener("click", () => { if (open) closeRow(); resort(b.dataset.sort); }));
  HEAD.addEventListener("pointerover", (e) => {
    const b = e.target.closest(".lh"); if (!b) return;
    const tag = b.dataset.tag; const l = D.lines[tag];
    ROWS.querySelectorAll(".row").forEach((r) => r.classList.toggle("dim", !tagged(r.dataset.k).includes(tag)));
    const box = el("div", "rlines"); const r = el("span", "rl"); const i = el("i"); i.style.background = l.color; r.appendChild(i); r.appendChild(document.createTextNode(l.name)); box.appendChild(r);
    setRead("line" + tag, box, '<span class="g">' + esc(l.sentence) + "</span>");
  });
  HEAD.addEventListener("pointerout", (e) => {
    if (e.target.closest(".lh") && !e.relatedTarget?.closest?.(".lh")) { ROWS.querySelectorAll(".row.dim").forEach((r) => r.classList.remove("dim")); readRest(); }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeRow();
    else if (open && (e.key === "ArrowDown" || e.key === "ArrowRight")) { e.preventDefault(); step(1); }
    else if (open && (e.key === "ArrowUp" || e.key === "ArrowLeft")) { e.preventDefault(); step(-1); }
  });
  let rz = 0; let wasPhone = phone();
  addEventListener("resize", () => {
    clearTimeout(rz); rz = setTimeout(() => {
      layout();
      if (phone() !== wasPhone) { wasPhone = phone(); if (open) { const k = open; open = null; openRow(k); } }
      readKey = ""; if (!open) readRest();
    }, 120);
  });
  const hash = decodeURIComponent(location.hash.slice(1));
  if (hash && D.study(hash)) openRow(hash);

  /* for the checks: every quote drawn, and what the guard dropped */
  window.WORKINGS = { W, said };
})();
