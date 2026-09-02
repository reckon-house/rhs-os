/* ── the house's small brain, shared by every field demo ─────────────
   No model. The same counting the board uses: a question is matched
   against each study's title, category, tags and opening line; a
   shelf is a tag; the next study is ranked from what was done. Every
   demo gets the same answers, so what differs between them is only
   the way the field works — which is the point of the folder.

   Loads after data.js. Everything is on window.FIELD. */
(() => {
  const S = window.FIELD_STUDIES || [];
  const SHELVES = window.FIELD_SHELVES || [];
  const TOUR = window.FIELD_TOUR || ["All work"];

  const words = (t) => (t || "").toLowerCase().split(/[^a-z0-9']+/).filter((w) => w.length > 2);
  const hay = (s) => (s.slug + " " + s.title + " " + s.cat + " " + s.tags.join(" ") + " " + s.line).toLowerCase();
  const shelfOf = (tag) => SHELVES.find((x) => x.tag === tag);
  const shelfByName = (t) => {
    const q = (t || "").toLowerCase().trim();
    return SHELVES.find((x) => x.name.toLowerCase() === q || x.tag === q ||
      x.name.toLowerCase().split("/")[0] === q) || null;
  };

  /* ── ask: a line in, a line back, and the studies it caught ────── */
  function ask(text) {
    const q = (text || "").trim();
    if (!q) return { q, hits: [], line: "", kind: "empty" };
    const lower = q.toLowerCase();
    /* a shelf by name is a filter, not a question */
    const shelf = shelfByName(q);
    /* the Staples shelf holds the board's pulls and kept lines, not
       studies, so it answers as a line rather than as an empty count */
    if (shelf && shelf.tag === "staples")
      return { q, hits: [], shelf: "staples", kind: "staple",
        line: "Staples are the pulls and the kept lines, not studies. Mostly rooms, type, and people." };
    if (shelf) {
      const hits = S.filter((s) => s.tags.includes(shelf.tag));
      return { q, hits, shelf: shelf.tag, kind: "shelf",
        line: hits.length + (hits.length === 1 ? " study" : " studies") + " on the " + shelf.name + " shelf." };
    }
    if (/reach|contact|email|hire|talk/.test(lower))
      return { q, hits: [], kind: "contact", line: "hello@reckon.house. Or the house answers here." };
    if (/inspire|inspiration|why|philosophy/.test(lower))
      return { q, hits: S.filter((s) => s.tags.includes("staples")).slice(0, 4), kind: "staple",
        line: "Mostly the rooms, the type, and the people who let me near either." };
    if (/^all( work)?$/.test(lower) || lower === "everything")
      return { q, hits: S.slice(), kind: "all", line: S.length + " studies. Start anywhere." };
    /* a light stem, so "kitchens" finds the kitchen and "campaigns"
       the campaign; and the whole-phrase bonus only for a phrase long
       enough to mean something, since "in" is inside most of the
       board and a bonus there made the live count flicker high */
    const stem = (w) => w.replace(/(ies)$/, "y").replace(/(es|s)$/, "");
    const ws = words(q).map(stem);
    const scored = S.map((s) => {
      const h = hay(s);
      let n = 0;
      for (const w of ws) if (w && h.includes(w)) n += 1;
      if (lower.length >= 4 && h.includes(lower)) n += 2;
      return { s, n };
    }).filter((x) => x.n > 0).sort((a, b) => b.n - a.n);
    const hits = scored.map((x) => x.s);
    if (!hits.length) return { q, hits, kind: "miss",
      line: "Nothing caught on the board. The homepage's brain reads deeper." };
    const first = hits[0];
    return { q, hits, kind: "hits",
      line: hits.length === 1
        ? "One: " + first.title + ". " + first.line
        : hits.length + " studies, " + first.title + " first." };
  }

  /* ── predict: what the house would put beside this ─────────────── */
  function predict(trail, currentSlug) {
    trail = trail || { opened: [], shelves: [], asked: [], dwell: {} };
    /* only words that could name a thing: "since you asked about you"
       is what three-letter words and pronouns produced */
    const STOP = new Set(["how", "you", "what", "the", "and", "for", "with", "your", "this",
      "that", "does", "did", "can", "could", "about", "from", "have", "who", "why", "when"]);
    const askedWords = words((trail.asked || []).join(" "))
      .filter((w) => w.length > 3 && !STOP.has(w));
    let best = null;
    for (const s of S) {
      if (s.slug === currentSlug) continue;
      let score = 0; const parts = [];
      for (const on of trail.opened || []) {
        const o = S.find((x) => x.slug === on); if (!o || o.slug === s.slug) continue;
        const shared = s.tags.filter((t) => o.tags.includes(t));
        if (shared.length) { score += 2.5 * shared.length; parts.push({ v: 2.5 * shared.length, kind: "opened", on: o, tag: shared[0] }); }
      }
      for (const [on, ms] of Object.entries(trail.dwell || {})) {
        const o = S.find((x) => x.slug === on); if (!o || o.slug === s.slug) continue;
        const shared = s.tags.filter((t) => o.tags.includes(t));
        if (shared.length) { const v = Math.min(4, ms / 1500) * shared.length; score += v; parts.push({ v, kind: "dwell", on: o, tag: shared[0] }); }
      }
      for (const m of trail.shelves || []) if (s.tags.includes(m)) { score += 3; parts.push({ v: 3, kind: "shelf", tag: m }); }
      const h = hay(s);
      for (const w of askedWords) if (h.includes(w)) { score += 2; parts.push({ v: 2, kind: "asked", word: w }); }
      if ((trail.opened || []).includes(s.slug)) score *= 0.35;
      if (!best || score > best.score) best = { s, score, parts };
    }
    if (!best || best.score <= 0) {
      const i = S.findIndex((x) => x.slug === currentSlug);
      const s = S[(i + 1) % S.length] || S[0];
      return { study: s, why: "next in the house's order" };
    }
    const top = best.parts.sort((a, b) => b.v - a.v)[0];
    const here = top.on && top.on.slug === currentSlug;
    const why = top.kind === "shelf" ? "since you picked " + (shelfOf(top.tag) || { name: top.tag }).name
      : here ? "like " + top.on.title
      : top.kind === "opened" ? "since you opened " + top.on.title
      : top.kind === "dwell" ? "since you stayed on " + top.on.title
      : "since you asked about " + top.word;
    return { study: best.s, why };
  }

  /* ── the statement, as every demo says it ──────────────────────── */
  const STATEMENT =
    'I\'m Jeremy Prasatik. I make things across <span class="term" data-ask="brand">brand</span>, ' +
    '<span class="term" data-ask="product">product</span>, and <span class="term" data-ask="place">place</span>. ' +
    '<span class="dim"><span class="term" data-ask="Apps">Apps</span> and <span class="term" data-ask="ecommerce">ecommerce</span>, ' +
    '<span class="term" data-ask="campaigns">campaigns</span> and <span class="term" data-ask="brand systems">brand systems</span>, ' +
    '<span class="term" data-ask="photography">photography and art direction</span>, ' +
    '<span class="term" data-ask="interiors">custom interiors</span>, <span class="term" data-ask="AI tools">AI tools</span>.</span>';

  const quote = (t) => "“" + t + "”";

  /* ── the rotation, the homepage's own cadence ──────────────────── */
  function tour(paint, opts) {
    opts = opts || {};
    const IN = 52, OUT = 26, HOLD = 1700, GAP = 340;
    let k = 0, i = 0, mode = "in", timer = 0, stopped = false;
    const step = () => {
      if (stopped) return;
      if (opts.paused && opts.paused()) { timer = setTimeout(step, 400); return; }
      const w = TOUR[k];
      if (mode === "in") { i += 1; paint(quote(w.slice(0, i)), w, i >= w.length);
        if (i >= w.length) { mode = "hold"; timer = setTimeout(step, HOLD); } else timer = setTimeout(step, IN); return; }
      if (mode === "hold") { mode = "out"; timer = setTimeout(step, OUT); return; }
      i -= 1; paint(quote(w.slice(0, Math.max(0, i))), w, false);
      if (i <= 0) { mode = "in"; k = (k + 1) % TOUR.length; timer = setTimeout(step, GAP); }
      else timer = setTimeout(step, OUT);
    };
    paint(quote(TOUR[0]), TOUR[0], true); i = TOUR[0].length; mode = "hold";
    timer = setTimeout(step, 1400);
    return { stop: () => { stopped = true; clearTimeout(timer); }, current: () => TOUR[k] };
  }

  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const studyRow = (s) => {
    const r = el("div", "study"); r.dataset.slug = s.slug;
    const im = el("img"); im.src = s.cover; im.alt = ""; im.loading = "lazy";
    const t = el("div"); const b = el("b", null, s.title); const sp = el("span", null, s.cat);
    t.appendChild(b); t.appendChild(sp); r.appendChild(im); r.appendChild(t);
    return r;
  };

  window.FIELD = { S, SHELVES, TOUR, ask, predict, STATEMENT, quote, tour, el, studyRow, shelfOf, shelfByName };
})();
