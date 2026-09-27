/* ── THE STUDY PANEL: a case study made for the stage (27 Sept 2026) ──
   His words, on the Cross-reference: "maybe we never have to actually
   leave this one page if the right side loads all the case studies. we
   could do a case study in that space and maybe the case studies are new
   versions to fit this space and design."

   None of these rooms is made by hand. One editorial template composes
   every study from its own fragments (fragments.js, through window.D), so
   all thirty exist at once, stay in step with the real studies, and a new
   study gets a room the day it gets fragments. Curation can come later as
   small overrides; LEAD_SAME below is the first and only one.

   How a room is put together, top to bottom. The treatments are the
   ones he sent back from the Mind and the Brief on 26 Sept ("just ideas
   to work different sizes and images in - feel editorial"), used as a
   vocabulary so the page changes pace rather than as a fixed order:
   - The cover is the board's own lead picture, the one the grid tile
     shows, so a caller can fly the tile into it. It runs edge to edge
     when its pixels allow. When they do not, it sits at its honest size,
     set right, and the kicker moves into the space beside it.
   - The title, then the study's own subtitle as the board's two-tone
     lead (the first sentence in ink, the rest in grey), then a hairline
     and the kicker: the discipline, its year lighter, its lines.
   - The abstract: its first paragraph a size up in the regular weight,
     the rest in medium. Any sentence in it that carries a figure moves
     into a band of figures under it, the figure set large and the
     sentence small beneath. Every sentence appears once: a figure is
     lifted out of its paragraph, never copied.
   - One black field per room: the study's stats when it has three or
     more, otherwise the abstract's figures. White figures, labels in
     small caps, the sentence in grey, the study named small at its foot.
   - The sections in order: the label in small grey caps under a rule,
     the head, its deck (a short one set as a bold beat of its own), then
     the paragraphs, the first of them in the regular weight. A column's
     title sits in the rail under a hairline, beside its text. Stats as
     figures, the chart and the timeline drawn from their numbers,
     feature cards under hairlines, and the pull quote. The first pull
     quote sits on the study's own fill colour; the rest on paper.
   - Pictures sit where they occur, cut into rows at one height. A row
     runs edge to edge only when every picture in it can honestly fill
     that width; otherwise it keeps its native size and is set in turn
     against the text column, the right margin and the left. A single
     picture carries its own description as a caption, beside it when it
     leaves room. A small or tall picture after text goes beside that
     text, up to three of a section's columns, when the text stands about
     as tall as the picture.
   - The reel frames the study opens with (the "meta" pictures) are its
     overview, not any one section's. The first one or two follow the
     abstract; the rest are dealt, in order, to the sections that have no
     picture of their own, so a study that is mostly words still turns
     pages. Faux Reel has no pictures of its own and reads as text and
     figures under its board picture.
   - A title block at the end, like the Brief's: the facts as a table
     with small grey caps labels, the services and the stack as two
     lists side by side, the palette as swatches with the hex under
     each. Then Next and Full study.

   The half split (27 Sept, later). His words, with the copy boxed on the
   right of a line down the middle: "split the copy so it's half split
   and not slightly past half", and on the pictures, "let's hero more of
   the images...when we put them next to each other and dont break up the
   case studies they become really text heavy". So from 560px up the room
   is two halves. Running copy (paragraphs, a figure's sentence, a spec
   value) lives in the right half; the left half holds what labels it
   (the kicker, a column's title, a spec label) or a picture set beside
   the copy. Display type (the title, heads, decks, pull quotes) still
   hangs from the left margin across both. A band leads with its first
   figure across the page and stacks the rest down the right half, as he
   roughed it in the canvas. A picture that can fill the room honestly is
   a hero, a row of its own, edge to edge, never halved into a pair; and
   a picture that closes a long stretch of text moves to the middle of
   it, so a section reads words, picture, words. The cover keeps nine
   tenths of the glass ("let's retain more of the original height").

   Rules it keeps: nothing on the page is written here (labels like
   "Next", "Full study" and "Close" are the only words of its own); no em
   dash reaches the page; no picture shows wider than half its pixels
   (D.maxCss); pictures load only when they near the view, against the
   caller's scroll container, thumbnail first; type is Avenir Next only.

   What it cannot do yet. A pressing section's head is only the ink half
   of its headline ("Most homeowners have never"); the grey half lives in
   the study file as pressing.heldLine and fragments.js does not carry it,
   so many heads read unfinished. If the generator ever writes a head as
   "ink | grey", the second half sets grey here with no change. The lead
   duplicates in LEAD_SAME were found by comparing thumbnails (27 Sept);
   a new study whose lead repeats one of its pictures shows it twice until
   it gets a line there.

       const room = StudyPanel.render(container, "arc", { next: { k, t } | null, onNext(k), onClose() });
       room.el, room.cover, room.scroller, room.ids
       room.find(id) -> Element | null     room.mark([ids])     room.destroy()
       room.scrollTo(id, { smooth }) -> true | false
       StudyPanel.cover(k) -> { src, w, h, t384, t768 } | null

   The container is the caller's: it sizes it and makes it scroll
   (overflow-y: auto). The room lays out to the container's width, 390
   to about 1000px, and rebuilds its rows when that width changes by more
   than a little. Every fragment it draws carries data-f="<id>".
*/
(() => {
  const D = window.D;
  if (!D) return;

  /* The board's lead picture is often one of the study's own pictures, or
     a crop of it. That picture is the cover, so the room does not show it
     again: its fragment id goes on the cover instead. Measured 27 Sept
     2026 by comparing each lead with every picture in its study. */
  const LEAD_SAME = {
    "nordstrom-personalization": "/case-studies/nordstrom-personalization/nordstrom-personalization-homepage-laptop-mockup-hero.jpg",
    "jeffrey-ecommerce": "/case-studies/jeffrey-ecommerce/jeffrey-new-york-saint-laurent-shoes-homepage-laptop-hero.jpg",
    "nordstrom-framework": "/case-studies/nordstrom-framework/nordstrom-framework-on-our-list-phone-turntable.jpg",
    "amber-shockey-co": "/case-studies/amber-shockey-co/amber-shockey-co-blue-florals-plate-in-wire-rack-hero.jpg",
    "loved-by-nordstrom": "/case-studies/loved-by-nordstrom/loved-by-nordstrom-ipad-tibi-tiles-held.jpg",
    "jeffrey-spring": "/case-studies/jeffrey-spring/jeffrey-spring-campaign-homepage-laptop-mockup-hero.jpg",
    "capitan-boot-co": "/case-studies/capitan-boot-co/capitan-boot-co-western-original-desert-landscape-cattle-skull-logo-prickly-pear-cactus-agave-plants-arid-mountains-branding-campaign.jpg",
    "nordstrom-beauty": "/case-studies/nordstrom-beauty/nordstrom-beauty-hub-laptop-homepage-mockup.jpg",
    "hill-country-oak": "/case-studies/hill-country-oak/hill-country-oakworks-billboard-winter-trees-hero.jpg",
    "j-christianson": "/case-studies/j-christianson/j-christianson-storefront-sign-dot-grid-brown.jpg",
    "cosmo-prof": "/case-studies/cosmo-prof/cosmo-prof-photography-direction-hair-color-brushes-product-detail-quad-composition.jpg",
    "you-by-sally": "/case-studies/you-by-sally/you-by-sally-street-display-case-hero.jpg",
    "fairview-bedroom": "/case-studies/fairview-bedroom/fairview-suite-bedroom-chandelier-fireplace-windows-wide.jpg",
    "big-bend": "/case-studies/big-bend/hero.jpg",
    "hill-country-kitchen": "/case-studies/hill-country-kitchen/hill-country-kitchen-island-pendants-marble-wide.jpg",
    "hill-country-bath": "/case-studies/hill-country-bath/hill-country-bath-vanity-marble-globe-sconces-sage.jpg",
    "black-white-type": "/case-studies/black-white-type/typography-patterns-the-fancy-poster-wood-surface-lifestyle.jpg",
    "hill-country-living": "/case-studies/hill-country-living/hill-country-living-cognac-leather-sofa-tweed-armchairs-limestone-fireplace-pendant-chandelier-wide.jpg",
    "floor-and-decor": "/case-studies/floor-and-decor/urban-southwest-primary-bath-exposed-brick-matte-black-soaking-tub.jpg",
    "fairview-sitting": "/case-studies/fairview-sitting/fairview-sitting-black-box-beams-stone-fireplace-pampas-grass-architectural-wide.jpg",
    "fairview-entry": "/case-studies/fairview-entry/hero1.avif",
    "chalet": "/case-studies/chalet/chalet-living-room-a-frame-glass-doors-malm-fireplace-sputnik-chandelier.jpg",
    "robert-rodriguez": "/case-studies/robert-rodriguez/neiman-marcus-robert-rodriguez-woman-cream-polka-dot-dress-pink-blazer-orange-yellow-backdrop-storefront-window-display-campaign.jpg",
    "sally-os": "/case-studies/sally-os/heroes/sally-os-asset-hub-platform-hero.jpg",
    "dsc": "/case-studies/dsc/dsc-marketing-site-laptop-stool-hero.jpg",
  };

  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  /* the house rule: no em dash reaches the page. A range keeps its figures
     with an en dash (2008–2018); anywhere else it becomes a middle dot, as
     the Cross-reference does */
  const clean = (s) => String(s == null ? "" : s).replace(/(\d)\s*\u2014\s*(\d)/g, "$1\u2013$2").replace(/\s*\u2014\s*/g, " \u00b7 ");
  const esc = (s) => D.esc(clean(s));
  /* a line written "ink | grey" is one sentence in two halves */
  const halves = (t) => { const s = String(t || ""); const i = s.indexOf(" | "); return i < 0 ? [s, ""] : [s.slice(0, i), s.slice(i + 3)]; };
  /* a section's label as the study writes it, "SECTION 02: PROBLEM
     STATEMENT", read as its number and its name, so the room can number
     its sections the way the index numbers its own ("01 LINES") */
  const secLabel = (t) => { const m = /^\s*section\s+(\d+)\s*[:.]\s*(.+)$/i.exec(String(t || "")); return m ? { n: m[1].padStart(2, "0"), name: m[2].trim() } : { n: "", name: String(t || "").trim() }; };
  const inkGrey = (t) => { const [a, b] = halves(t); return esc(a) + (b ? ' <span class="sp-g">' + esc(b) + "</span>" : ""); };
  /* a pressing headline carries its halves (ink, held); the room sets the
     held line grey, as the study page does */
  const inkGreyF = (f) => (f.held ? esc(f.ink) + ' <span class="sp-g">' + esc(f.held) + "</span>" : inkGrey(f.text));
  const ratio = (f) => f.w / f.h;
  const two = (n) => String(n).padStart(2, "0");

  /* ── MOTION (27 Sept, his "polish design and animation pass - text and
     image animations similar to what the live site has. easing on things,
     lenis scroll maybe on the case studies ... load and unload
     animation, etc. really bring this to life"). The live site's own
     vocabulary, its values copied, not re-derived (src/components/fx,
     SmoothScroll.tsx, RisingPlate.tsx, ledger-arrival.ts):
     - Lenis on the room's own scroller with the site's settings;
     - type rises through a mask, no fade: display type on the headline
       curve over 1.2s, 6ms a character; paragraphs a line at a time, 45ms
       apart, over 0.7s; a room-wide queue starts each block at least 90ms
       after the one before;
     - a picture wipes up out of its own frame over 0.9s while the image
       settles from 1.06; a picture across the room drifts against the
       scroll by a tenth of its height, where its pixels allow;
     - a rule draws in from the left over 0.66s and its words follow.
     The finished state is the resting CSS: only a room with motion
     allowed (.mo) is given start states, and reduced motion gets none. */
  const MOTION = () => !matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* ── six ways in (27 Sept, his "maybe we take a moment and put together
     5-6 different animations options for the text, images, etc. since
     we're more of an editorial interface interactive TOC - what type of
     animations would work better - fit more style wise?"). The same
     reveals, the same moments; what a block does when its turn comes is
     the family's, chosen on the page as html[data-motion]:
     - rise: the live site's (above), words out of their masks;
     - set: a line is set left to right as if typed, a picture opens from a
       slit like a shutter, a rule draws at a typesetter's pace;
     - wipe: the index's own mark, a band sweeping over a line and off it
       with the words under it (ink on display type, the grey cell on
       text), a picture uncovered from under an ink panel;
     - focus: out of a blur, a picture settling from a little closer;
     - cut: hard cuts a line at a time in Faux Reel's rhythm, a picture
       after a blink of ink;
     - scrub: no clock at all, everything as far along as the scroll is */
  const FAM = () => document.documentElement.dataset.motion || "rise";
  const RV_KINDS = [
    ["mask", ".sp-title, .sp-stand, .sp-h, .sp-deck, .sp-pq, .sp-closing p, .sp-fn, .sp-next-t, .sp-dur, .sp-col, .sp-card h3"],
    ["lines", ".sp-p"],
    ["pic", ".sp-pic:not(.sp-cpic)"],
    ["field", ".sp-black, .sp-field"],
    ["rule", ".sp-kick, .sp-open, .sp-run.sp-hasc, .sp-foot, .sp-spec, .sp-card, .sp-tcol, .sp-tr, .sp-nr"],
    ["fade", ".sp-cap, .sp-fs, .sp-nl, .sp-ns, .sp-meta, .sp-spec-h, .sp-tcol > .sp-caps, .sp-tcol ul, .sp-palw, .sp-bar2, .sp-stl li, .sp-full, .sp-next > .sp-caps, .sp-fcap, .sp-bcap, .sp-card p, .sp-tr dd, .sp-tr dt"],
  ];
  /* words into masks: each word an inline-block clipped to its own line,
     its inside rising into it. Text nodes are split where they are, so a
     span that carries a fragment's id stays the same element */
  const splitWords = (node) => {
    const words = [];
    const walk = (n) => [...n.childNodes].forEach((c) => {
      if (c.nodeType === 3) {
        const parts = c.nodeValue.split(/(\s+)/).filter(Boolean); if (!parts.length) return;
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
          const w = document.createElement("span"); w.className = "rvw";
          const i = document.createElement("span"); i.className = "rvi"; i.textContent = p;
          w.appendChild(i); frag.appendChild(w); words.push(w);
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1 && !c.classList.contains("rvw")) walk(c);
    });
    walk(node);
    return words;
  };
  const unsplit = (node) => { node.querySelectorAll(".rvw").forEach((w) => w.replaceWith(document.createTextNode(w.textContent))); node.normalize(); };

  /* ── figures inside his sentences: the same pattern the Cross-reference
     reads its Figures column with. Digits with whatever unit sits on
     them; a number word with a time unit; a number word of four or more
     with a count ── */
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
  /* the one figure a sentence is set under: a sum or a share first. A
     sentence with more than three figures is a spec, not a figure, and
     stays in its paragraph */
  const pickFig = (f) => {
    if (!f.num) return null;
    const fs = figsIn(f.text);
    if (!fs.length || fs.length > 3) return null;
    const s = fs.find((x) => /[$%]/.test(x)) || fs[0];
    if (/"$/.test(s) || /^\d+\.\d+x$/.test(s) || f.text.indexOf(s) < 0) return null;
    return s;
  };
  const withFig = (text, fig) => {
    const i = text.indexOf(fig);
    return i < 0 ? esc(text) : esc(text.slice(0, i)) + "<b>" + esc(fig) + "</b>" + esc(text.slice(i + fig.length));
  };

  /* ── compose: a study's fragments, in its own reading order, sorted into
     the parts of a room. Nothing is dropped except the Author fact (it is
     him on every study) and the picture the cover already shows ── */
  const compose = (k) => {
    const s = D.study(k); if (!s) return null;
    const dupSrc = s.lead ? LEAD_SAME[k] || null : null;
    const M = { k, s, lead: s.lead || null, dup: null, stand: null, abs: [], facts: [], tools: [], palette: null, secs: [], pool: [] };
    let sec = { open: true, head: null, items: [] }; M.secs.push(sec);
    for (const f of D.byStudy(k)) {
      if (f.kind === "palette") { if (!M.palette) M.palette = f; continue; }
      if (f.kind === "fact") { if (f.label !== "Author") M.facts.push(f); continue; }
      if (f.kind === "tool") { M.tools.push(f); continue; }
      if (f.kind === "pic") {
        if (dupSrc && f.src === dupSrc) { M.dup = f; continue; }
        if (f.where === "meta") { M.pool.push(f); continue; }
        sec.items.push({ t: "pic", f }); continue;
      }
      if (f.kind === "num" || f.kind === "chart" || f.kind === "steps") { sec.items.push({ t: f.kind, f }); continue; }
      if (f.kind !== "line") continue;
      if (f.weight === "sub" && f.where === "meta" && !M.stand) { M.stand = f; continue; }
      if (f.weight === "body" && f.where === "abstract") { M.abs.push(f); continue; }
      if (f.weight === "head" && f.where === "section-header") { sec = { head: f, items: [] }; M.secs.push(sec); continue; }
      if (f.weight === "head") { sec.items.push({ t: f.note ? "card" : "col", f }); continue; }
      if (f.weight === "display") { sec.items.push({ t: "pull", f }); continue; }
      if (f.weight === "sub") { sec.items.push({ t: f.where === "closing" ? "closing" : "deck", f }); continue; }
      sec.items.push({ t: "body", f });
    }
    /* the reel: one or two frames after the abstract, the rest dealt to
       the sections with no picture of their own, set after their first
       run of text so the section reads words, picture, words */
    const pool = M.pool.slice();
    M.openPics = pool.splice(0, pool.length >= 6 ? 2 : 1);
    const bare = M.secs.filter((x) => !x.open && !x.items.some((i) => i.t === "pic"));
    if (bare.length && pool.length) {
      const per = Math.min(3, Math.ceil(pool.length / bare.length));
      bare.forEach((x) => {
        const take = pool.splice(0, per); if (!take.length) return;
        const firstBody = x.items.findIndex((i) => i.t === "body");
        let at = firstBody < 0 ? -1 : x.items.findIndex((i, j) => j > firstBody && i.t !== "body");
        const closeAt = x.items.findIndex((i) => i.t === "closing");
        if (at < 0) at = closeAt < 0 ? x.items.length : closeAt;
        x.items.splice(at, 0, ...take.map((f) => ({ t: "pic", f, dealt: true })));
      });
    }
    M.openPics = M.openPics.concat(pool);
    return M;
  };

  /* ── shape a section's items into blocks: paragraphs joined by their
     paragraph index, a column's title with its text, consecutive pictures
     as one group, consecutive stats as one grid ── */
  const shape = (items, figs) => {
    const out = []; let run = null, para = null;
    for (const it of items) {
      if (it.t === "body") {
        if (!run) { run = { t: "run", col: null, parts: [] }; out.push(run); para = null; }
        const fig = figs.take(it.f);
        if (fig) {
          const last = run.parts[run.parts.length - 1];
          if (last && last.t === "figs") last.list.push({ f: it.f, fig }); else run.parts.push({ t: "figs", list: [{ f: it.f, fig }] });
          para = null; continue;
        }
        if (!para || para.pi !== it.f.pi) { para = { t: "p", pi: it.f.pi, lines: [] }; run.parts.push(para); }
        para.lines.push(it.f); continue;
      }
      if (it.t === "col") { run = { t: "run", col: it.f, parts: [] }; out.push(run); para = null; continue; }
      run = null; para = null;
      const last = out[out.length - 1];
      if (it.t === "pic") { if (last && last.t === "pics") last.list.push(it.f); else out.push({ t: "pics", list: [it.f] }); continue; }
      if (it.t === "num") { if (last && last.t === "nums" && last.si === it.f.si) last.list.push(it.f); else out.push({ t: "nums", si: it.f.si, list: [it.f] }); continue; }
      if (it.t === "card") { if (last && last.t === "cards") last.list.push(it.f); else out.push({ t: "cards", list: [it.f] }); continue; }
      if (it.t === "closing") { if (last && last.t === "closing") last.list.push(it.f); else out.push({ t: "closing", list: [it.f] }); continue; }
      out.push({ t: it.t, f: it.f });
    }
    return out;
  };

  /* ── pictures in rows at one height. A small search over where to break
     the rows: each row is scored by how far its height sits from a
     comfortable one (0.45 of the panel), how much air an honest cap
     leaves, and a few tastes (pairs over quartets, a wide opener edge to
     edge, transparent and opaque kept apart) ── */
  const partition = (list, W, V, g) => {
    const n = list.length, T = W * 0.45, Vc = V * 0.84;
    /* a hero: honest across the whole room and not so tall that the glass
       would crop most of it. It never shares a row */
    const hero = (f) => f.w / 2 >= W - 0.5 && W / ratio(f) <= Vc * 1.15;
    const cost = (a, b) => {
      const ps = list.slice(a, b), m = ps.length;
      const R = ps.reduce((s, f) => s + ratio(f), 0);
      const h = (W - g * (m - 1)) / R;
      const H = Math.min(h, Math.min(...ps.map((f) => f.h / 2)), Vc);
      let c = Math.pow(Math.log(H / T), 2) + 1.2 * (1 - H / h);
      if (m > 1 && ps.some(hero)) c += 4;
      if (m === 1 && ratio(ps[0]) < 0.9) c += 0.5;
      if (m === 3) c += 0.12;
      if (m === 4) c += 0.4;
      if (a === 0 && m === 1 && ratio(ps[0]) >= 1.2 && H >= h - 1) c -= 0.25;
      if (ps.some((f) => f.alpha) && ps.some((f) => !f.alpha)) c += 0.4;
      return c;
    };
    const best = [0], cut = [0];
    for (let i = 1; i <= n; i++) {
      best[i] = Infinity;
      for (let m = 1; m <= Math.min(4, i); m++) { const c = best[i - m] + cost(i - m, i); if (c < best[i]) { best[i] = c; cut[i] = i - m; } }
    }
    const rows = []; for (let i = n; i > 0; i = cut[i]) rows.unshift(list.slice(cut[i], i));
    return rows;
  };

  /* ── the room ── */
  const cover = (k) => { const s = D.study(k); return s && s.lead ? { src: s.lead.src, w: s.lead.w, h: s.lead.h, t384: s.lead.t384 || null, t768: s.lead.t768 || null } : null; };

  function render(container, k, opts) {
    const o = opts || {};
    const M = compose(k);
    const root = el("article", "sp sp-enter"); root.dataset.k = k;
    container.appendChild(root);
    try { container.scrollTop = 0; } catch (e) { /* a container that cannot scroll */ }
    const room = { el: root, cover: null, scroller: container, ids: [], destroy, find, mark, scrollTo, play, shown, replay, lenis: null };
    if (!M) return room;

    let io = null, ro = null, headIO = null, fontsT = 0, dead = false;
    let parts = null; /* what layout() needs to reach: rows, asides, fitted type */
    let builtW = 0;

    /* lazy pictures: nothing loads until it nears the view of the caller's
       scroll container; then the thumbnail, then the honest rung */
    const pending = new Map();
    const loadPic = (box) => {
      const f = box._f; if (!f || box._loaded) return; box._loaded = true;
      const w = Math.max(1, box.offsetWidth || box._w || 200);
      const want = D.rung(f, w);
      const quick = f.t384 && f.t384 !== want ? f.t384 : null;
      let pv = null;
      if (quick) { pv = el("img", "sp-q"); pv.alt = ""; pv.decoding = "async"; pv.src = encodeURI(quick); box.appendChild(pv); }
      const im = D.img(f, w, { eager: true });
      im.addEventListener("load", () => { box.classList.add("in"); if (pv) setTimeout(() => pv.remove(), 400); }, { once: true });
      if (pv) pv.addEventListener("load", () => box.classList.add("in"), { once: true });
      box.appendChild(im);
    };
    const watch = (box, eager) => {
      if (eager) { loadPic(box); return; }
      pending.set(box, true); if (io) io.observe(box);
    };
    const startIO = () => {
      if (!("IntersectionObserver" in window)) { pending.forEach((_, b) => loadPic(b)); return; }
      io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); pending.delete(e.target); loadPic(e.target); } }),
        { root: container, rootMargin: "40% 0px 60% 0px" });
      pending.forEach((_, b) => io.observe(b));
    };

    /* ── motion (MOTION above). Lenis owns the room's scroller with the
       live site's settings; every other write to its scroll goes through
       setScroll so Lenis does not undo it ── */
    const mo = MOTION() && !o.still;
    if (mo) root.classList.add("mo");
    let lenis = null, lraf = 0;
    if (mo && window.Lenis) {
      try {
        lenis = new window.Lenis({ wrapper: container, content: root, smoothWheel: true, duration: 1.65, easing: (t) => 1 - Math.pow(1 - t, 6), wheelMultiplier: 0.65, touchMultiplier: 1.4 });
        const tick = (t) => { lenis.raf(t); lraf = requestAnimationFrame(tick); };
        lraf = requestAnimationFrame(tick);
      } catch (e) { lenis = null; }
    }
    room.lenis = lenis;
    const setScroll = (y) => { if (lenis) lenis.scrollTo(y, { immediate: true, force: true }); else container.scrollTop = y; };

    /* the reveals: each block waits under its start state until it is a
       fifth in view, then takes its turn in the queue */
    let rio = null, playing = false, qAt = 0, holdT = 0;
    const RVSEL = RV_KINDS.map(([k, s]) => s).join(", ");
    const kindOf = (e) => { for (const [k, s] of RV_KINDS) if (e.matches(s)) return k; return null; };
    /* the queue orders what arrives together; a fast scroll never makes
       anything wait more than a third of a second for its turn */
    const slot = () => { const now = performance.now(); const t = Math.max(now, Math.min(qAt + 90, now + 320)); qAt = t; return t - now; };
    const EZT = "cubic-bezier(0.16, 1, 0.3, 1)";
    const go = (e, instant) => {
      if (!e._rv || e._rvd) return; e._rvd = true;
      if (rio) rio.unobserve(e);
      const k = e._rv;
      const fam = FAM();
      if (instant || fam === "scrub") { e.classList.add("rv-go", "rv-now"); return; }
      const base = slot();
      if ((k === "mask" || k === "lines") && fam !== "rise") { splitFam(e, k, base, fam); return; }
      if (k === "mask" || k === "lines") {
        const words = splitWords(e); e.classList.add("rv-split");
        /* a line is the words that share a top; a display block also
           staggers by character, as the site's headlines do */
        let line = -1, lastTop = -1e9, chars = 0, maxD = 0;
        const total = e.textContent.length || 1, per = Math.min(6, 420 / total);
        words.forEach((w) => {
          const t = w.offsetTop; if (Math.abs(t - lastTop) > 3) { line++; lastTop = t; }
          const d = base + line * 45 + (k === "mask" ? Math.round(chars * per) : 0);
          chars += w.textContent.length + 1; maxD = Math.max(maxD, d);
          w.style.setProperty("--d", d + "ms");
        });
        requestAnimationFrame(() => requestAnimationFrame(() => e.classList.add("rv-go")));
        /* a paragraph gives its words back once it has risen, so the
           marks and the reading are plain text again */
        if (k === "lines") setTimeout(() => { if (!dead && e.isConnected) { unsplit(e); e.classList.remove("rv-split"); } }, maxD + 820);
        return;
      }
      e.style.setProperty("--d", base + "ms");
      requestAnimationFrame(() => requestAnimationFrame(() => e.classList.add("rv-go")));
    };
    /* the other families' text: words grouped into their lines, each line
       given its turn, a band laid over a line where the family wipes or
       blinks. The words give themselves back once it has played */
    const band = (e, ln, x0, lw, delay, kind, dur) => {
      const h = Math.max(...ln.words.map((w) => w.offsetHeight)) || 16;
      const b = el("i", "rvband rvb-" + kind);
      b.style.cssText = "left:" + (x0 - 3) + "px;top:" + ln.top + "px;width:" + (lw + 6) + "px;height:" + h + "px";
      b.style.setProperty("--d", Math.max(0, Math.round(delay)) + "ms");
      if (dur) b.style.setProperty("--bd", dur + "ms");
      e.appendChild(b);
    };
    const splitFam = (e, k, base, fam) => {
      if ((fam === "wipe" || fam === "cut") && getComputedStyle(e).position === "static") { e.style.position = "relative"; e._rvpos = true; }
      const words = splitWords(e); e.classList.add("rv-split");
      const lines = []; let cur = null;
      words.forEach((w) => { const t = w.offsetTop; if (!cur || Math.abs(t - cur.top) > 3) { cur = { top: t, words: [] }; lines.push(cur); } cur.words.push(w); });
      /* the band is the words' own colour: solid over display type, a tint
         of it over text, so a field's white type gets a white band */
      const disp = k === "mask";
      let end = 0;
      lines.forEach((ln, li) => {
        const x0 = Math.min(...ln.words.map((w) => w.offsetLeft));
        const x1 = Math.max(...ln.words.map((w) => w.offsetLeft + w.offsetWidth));
        const lw = Math.max(1, x1 - x0);
        if (fam === "set") {
          const LD = disp ? 520 : 400, start = base + li * (disp ? 110 : 85);
          ln.words.forEach((w) => {
            const a = (w.offsetLeft - x0) / lw, b = (w.offsetLeft + w.offsetWidth - x0) / lw;
            w.style.setProperty("--d", Math.round(start + a * LD) + "ms");
            w.style.setProperty("--wd", Math.max(30, Math.round((b - a) * LD)) + "ms");
          });
          end = Math.max(end, start + LD);
        } else if (fam === "focus") {
          const start = base + li * (disp ? 70 : 55);
          ln.words.forEach((w, wi) => w.style.setProperty("--d", (start + wi * (disp ? 22 : 6)) + "ms"));
          end = Math.max(end, start + 1100);
        } else if (fam === "cut") {
          const start = base + li * (disp ? 110 : 75);
          if (disp) band(e, ln, x0, lw, start, "ink", 0);
          ln.words.forEach((w) => w.style.setProperty("--d", (start + (disp ? 90 : 0)) + "ms"));
          end = Math.max(end, start + 120);
        } else {
          const DUR = disp ? 760 : 600, start = base + li * (disp ? 95 : 70);
          band(e, ln, x0, lw, start, disp ? "ink" : "grey", DUR);
          ln.words.forEach((w) => w.style.setProperty("--d", Math.round(start + DUR * 0.5) + "ms"));
          end = Math.max(end, start + DUR);
        }
      });
      requestAnimationFrame(() => requestAnimationFrame(() => e.classList.add("rv-go")));
      setTimeout(() => {
        if (dead || !e.isConnected) return;
        e.querySelectorAll(":scope > .rvband").forEach((b) => b.remove());
        if (e._rvpos) { e.style.position = ""; e._rvpos = false; }
        if (k === "lines") { unsplit(e); e.classList.remove("rv-split"); }
      }, end + 900);
    };
    const armReveals = (showAbove) => {
      if (rio) rio.disconnect(); rio = null;
      if (!mo) return;
      const els = [...root.querySelectorAll(RVSEL)];
      const vb = container.getBoundingClientRect().bottom;
      els.forEach((e) => { e._rv = kindOf(e); e._rvd = false; e.classList.add("rv", "rv-" + e._rv); });
      /* scrub has no turns: every block rests finished and the scroll
         carries it (the driver below) */
      if (FAM() === "scrub") {
        els.forEach((e) => {
          go(e, true);
          if (e._rv !== "mask" || e.querySelector(".rvw")) return;
          const words = splitWords(e); e.classList.add("rv-split");
          let li = -1, top = -1e9;
          words.forEach((w) => { const t = w.offsetTop; if (Math.abs(t - top) > 3) { li++; top = t; } w.style.setProperty("--li", li); });
        });
        scrubList(); scrub(); return;
      }
      /* after a rebuild, what the reader has already passed stays put */
      if (showAbove) els.forEach((e) => { if (e.getBoundingClientRect().top < vb) go(e, true); });
      if (!("IntersectionObserver" in window)) { els.forEach((e) => go(e, true)); return; }
      rio = new IntersectionObserver((es) => es.forEach((en) => {
        if (!playing || !en.isIntersecting) return;
        if (en.intersectionRatio >= 0.2 || en.boundingClientRect.height > container.clientHeight * 0.6 || en.boundingClientRect.top < container.getBoundingClientRect().top + container.clientHeight * 0.5) go(en.target);
      }), { root: container, rootMargin: "0px 0px -6% 0px", threshold: [0, 0.2] });
      els.forEach((e) => { if (!e._rvd) rio.observe(e); });
    };
    /* the caller says when the room is on screen: after a picture has
       flown into it, or as its paper rises. A caller that never says
       plays it at once */
    function play(p) {
      p = p || {};
      clearTimeout(holdT);
      holdT = setTimeout(() => {
        if (dead || playing) return;
        playing = true; qAt = performance.now();
        if (p.settle && parts && parts.coverBox) parts.coverBox.classList.add("settle");
        root.classList.add("sp-on-stage");
        if (rio) { const list = [...root.querySelectorAll(".rv")].filter((e) => !e._rvd); rio.disconnect(); list.forEach((e) => rio.observe(e)); }
      }, Math.max(0, p.delay || 0));
    }
    /* an element a picture is flying to shows at once, and holds still */
    function shown(e) {
      if (!e) return;
      const box = e.closest(".sp-pic") || e;
      go(box, true); box._still = true; box.classList.remove("par");
    }

    /* the drift: a picture across the room is drawn a tenth taller and
       moves up through that tenth as it crosses the glass */
    let parT = 0;
    const drift = () => {
      parT = 0; if (dead || !mo) return;
      const cr = container.getBoundingClientRect();
      root.querySelectorAll(".sp-pic.par").forEach((b) => {
        const r = b.getBoundingClientRect(); if (r.bottom < cr.top || r.top > cr.bottom) return;
        const k = Math.max(0, Math.min(1, (cr.bottom - r.top) / (cr.height + r.height)));
        b.style.setProperty("--py", (-0.1 * r.height * k).toFixed(1) + "px");
      });
    };
    const onScroll = () => { if (!parT) parT = requestAnimationFrame(drift); };
    if (mo) container.addEventListener("scroll", onScroll, { passive: true });

    /* scrub: how far each block has come up the glass, as --p, from its
       top at the foot of the view (0) to four tenths of the way up (1).
       Measured in layout, so the transforms it drives never feed back */
    let scT = 0, scEls = [];
    const layTop = (e) => { let y = 0, n = e; while (n && n !== root) { y += n.offsetTop; n = n.offsetParent; } return y; };
    function scrubList() {
      if (FAM() !== "scrub" || !mo) { scEls = []; return; }
      const at = root.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
      scEls = [...root.querySelectorAll(".rv")].map((e) => ({ e, top: at + layTop(e), h: e.offsetHeight, p: null }));
    }
    function scrub() {
      scT = 0; if (dead || !scEls.length) return;
      const st = container.scrollTop, vh = container.clientHeight || 800, vb = st + vh;
      scEls.forEach((x) => {
        if (x.top > vb + 80 || x.top + x.h < st - 80) return;
        const p = Math.max(0, Math.min(1, (vb - x.top) / (vh * 0.42)));
        if (x.p == null || Math.abs(p - x.p) > 0.004) { x.p = p; x.e.style.setProperty("--p", p.toFixed(3)); }
      });
    }
    const onScrub = () => { if (!scT) scT = requestAnimationFrame(scrub); };
    if (mo) container.addEventListener("scroll", onScrub, { passive: true });
    /* the family changed on the page: what has played plays again */
    function replay() {
      if (dead || !mo) return;
      root.querySelectorAll(".rvband").forEach((b) => b.remove());
      root.querySelectorAll(".rv").forEach((e) => {
        if (e._still) return;
        e.classList.remove("rv-go", "rv-now", "rv-split"); e._rvd = false; e.style.removeProperty("--p");
        if (e._rvpos) { e.style.position = ""; e._rvpos = false; }
        if (e.querySelector(".rvw")) unsplit(e);
      });
      armReveals(false);
    }

    /* the running head (27 Sept, the editorial pass): once the title has
       gone it names the section the reader is in, numbered as the index
       numbers its own, and a rule of ink along its hairline shows how
       far through the room they are */
    let trT = 0, curSec;
    const track = () => {
      trT = 0; if (dead) return;
      const max = container.scrollHeight - container.clientHeight;
      root.style.setProperty("--pg", max > 0 ? Math.min(1, container.scrollTop / max).toFixed(4) : "0");
      const line = container.getBoundingClientRect().top + 64;
      let now = null;
      for (const se of root.querySelectorAll(".sp-sec")) { if (se.getBoundingClientRect().top <= line) now = se; else break; }
      if (now === curSec) return;
      curSec = now;
      const slot = root.querySelector(".sp-bar-s");
      if (slot) slot.innerHTML = now && now._lab ? (now._lab.n ? "<b>" + esc(now._lab.loc || now._lab.n) + "</b>" : "") + esc(now._lab.name) : "";
    };
    const onTrack = () => { if (!trT) trT = requestAnimationFrame(track); };
    container.addEventListener("scroll", onTrack, { passive: true });

    const ids = [];
    const tag = (node, f) => { if (f && f.id) { node.dataset.f = f.id; ids.push(f.id); } return node; };
    const picBox = (f, cls) => {
      const b = el("div", "sp-pic" + (f.alpha ? " alpha" : "") + (cls ? " " + cls : ""));
      b._f = f; b.style.setProperty("--ar", f.w + " / " + f.h); b.style.setProperty("--r", ratio(f).toFixed(4));
      return tag(b, f);
    };

    /* ── build, for a width. Called again when the panel changes width by
       more than a little, since where rows break depends on it ── */
    const build = () => {
      const W = root.clientWidth || container.clientWidth || 700;
      const V = container.clientHeight || window.innerHeight || 800;
      builtW = W;
      ids.length = 0; pending.clear();
      const P = { rows: [], asides: [], figs: [], title: null, pulls: [], coverBox: null, coverFrame: null };
      const s = M.s;
      const frag = document.createDocumentFragment();
      const g = Math.max(5, Math.round(W * 0.011));
      const C = W - 2 * margin(W);
      /* the width of one half of the split: the copy's measure */
      const half = (C - gutter(W)) / 2;
      const figs = { used: new Set(), n: 0, take(f) {
        const s2 = pickFig(f); if (!s2) return null;
        const key = s2.toLowerCase(); if (this.used.has(key) || this.n >= 2) return null;
        this.used.add(key); this.n++; return s2;
      } };
      /* the room's one black field goes to its stats when it has three or
         more; otherwise to the first group of figures it meets */
      const statsFirst = M.secs.some((x) => x.items.filter((i) => i.t === "num").length >= 3);
      let airSide = 0, pulled = 0, lede = false, blackDone = false, figNo = 0;
      const blackOr = (node) => {
        if (blackDone) return node;
        blackDone = true;
        const b = el("div", "sp-black"); b.appendChild(node);
        b.appendChild(el("div", "sp-bcap", esc(D.title(k)) + '<span class="y">' + esc(s.y) + "</span>"));
        return b;
      };
      const AIR = ["t", "r", "l"];

      /* the bar: the study's name once its title has scrolled away, and
         Close. Set in white with difference, so it reads on any picture */
      const bar = el("div", "sp-bar");
      const barIn = el("div", "sp-bar-in");
      barIn.appendChild(el("span", "sp-bar-t", esc(D.title(k)) + '<span class="sp-bar-s"></span>'));
      if (o.onClose) { const x = el("button", "sp-x", "Close"); x.type = "button"; x.addEventListener("click", () => o.onClose()); barIn.appendChild(x); }
      bar.appendChild(barIn); frag.appendChild(bar);

      /* the cover */
      const cv = el("figure", "sp-cover");
      if (M.lead) {
        const lf = { src: M.lead.src, w: M.lead.w, h: M.lead.h, t384: M.lead.t384, t768: M.lead.t768, alt: s.t };
        const box = el("div", "sp-pic sp-cpic"); box._f = lf;
        if (M.dup) tag(box, M.dup);
        const side = el("div", "sp-cside"); cv.appendChild(side); P.coverSide = side;
        cv.appendChild(box); P.coverBox = box; P.coverFrame = cv; P.lead = lf;
        room.cover = box;
      }
      frag.appendChild(cv);

      /* the title, the subtitle, and the quiet facts */
      const head = el("header", "sp-head");
      const h1 = el("h1", "sp-title", esc(D.title(k))); head.appendChild(h1); P.title = h1;
      if (M.stand) head.appendChild(tag(el("p", "sp-stand", inkGrey(M.stand.text)), M.stand));
      else if (s.fact) head.appendChild(el("p", "sp-stand", esc(s.fact) + (s.rest ? ' <span class="sp-g">' + esc(s.rest) + "</span>" : "")));
      frag.appendChild(head);

      /* the kicker: the discipline, its year lighter, then its lines */
      const meta = el("div", "sp-meta");
      /* the study's number leads its kicker, as it leads its row in the index */
      meta.appendChild(el("div", "sp-kk", (D.num ? '<span class="sp-no">' + esc(D.num(k)) + "</span>" : "") + esc(s.s) + '<span class="y">' + esc(s.y) + "</span>"));
      const lines = (D.data.lines || []).filter((l) => (s.tags || []).includes(l.tag));
      if (lines.length) meta.appendChild(el("div", "sp-lines", lines.map((l) => '<span class="sp-line"><i style="background:' + l.color + '"></i>' + esc(l.name) + "</span>").join("")));

      /* the abstract, with its figures lifted into the band */
      const band = [], absLines = [];
      M.abs.forEach((f) => {
        const s2 = band.length < 4 ? pickFig(f) : null;
        if (s2 && !figs.used.has(s2.toLowerCase())) { figs.used.add(s2.toLowerCase()); band.push({ f, fig: s2 }); }
        else absLines.push(f);
      });
      /* with no abstract, the kicker runs as one line under its hairline */
      const open = el("section", absLines.length ? "sp-open sp-grid" : "sp-open sp-solo");
      const rail = el("div", "sp-rail"); rail.appendChild(meta); open.appendChild(rail);
      if (absLines.length) {
        const txt = el("div", "sp-text");
        paras(absLines).forEach((p, i) => txt.appendChild(paraEl(p, i === 0 ? "sp-p sp-lede" : "sp-p")));
        open.appendChild(txt);
      }
      frag.appendChild(open);
      P.meta = meta; P.rail = rail; P.open = open; P.openBare = !absLines.length;
      /* on the black field two long figures stack, each the full width,
         rather than halve each other */
      if (band.length) frag.appendChild(statsFirst || blackDone ? figBlock(band, "sp-band")
        : blackOr(figBlock(band, "sp-band" + (band.length === 2 && band.some((x) => x.fig.length > 5) ? " sp-stack" : ""))));

      /* the opening plates, then whatever the study put before its first head */
      if (M.openPics.length) frag.appendChild(picGroup(M.openPics, "sp-plates sp-first"));
      M.secs.forEach((sec) => {
        figs.n = 0; lede = !sec.open;
        const blocks = spread(asideUp(shape(sec.items, figs)));
        if (sec.open) { blocks.forEach((b) => frag.appendChild(blockEl(b))); return; }
        const se = el("section", "sp-sec");
        /* the label as the study writes it, in small grey caps, over the head */
        const lab = secLabel(sec.head.label); se._lab = lab;
        /* the section's full place, study and section (26.03), the same
           locator the index gives it (27 Sept) */
        if (lab.n && D.num) lab.loc = D.num(k) + "." + lab.n;
        se.appendChild(el("div", "sp-kick sp-caps", (lab.n ? "<b>" + esc(lab.loc || lab.n) + "</b>" : "") + "<span>" + esc(lab.name) + "</span>"));
        /* a head that is only the opening words of the sentence right under
           it (Faux Reel's "The reel up top is") would read twice; the
           sentence carries it, under the label (27 Sept review) */
        const ink = (sec.head.held ? sec.head.ink : halves(sec.head.text)[0]).trim();
        const firstText = sec.items.find((i) => i.f && i.f.kind === "line" && i.t !== "col" && i.t !== "card");
        if (!(ink && firstText && firstText.f.text.length > ink.length && firstText.f.text.startsWith(ink))) se.appendChild(tag(el("h2", "sp-h", inkGreyF(sec.head)), sec.head));
        blocks.forEach((b) => se.appendChild(blockEl(b)));
        frag.appendChild(se);
      });

      /* the title block: the study under a hairline, its facts as a
         table, its services and stack as lists side by side, its palette
         as swatches with the hex under each */
      const spec = el("section", "sp-spec");
      spec.appendChild(el("div", "sp-spec-h sp-kk", esc(D.title(k)) + '<span class="y">' + esc(s.y) + "</span>"));
      if (M.facts.length) {
        const tb = el("dl", "sp-tb");
        M.facts.forEach((f) => { const r = el("div", "sp-tr"); r.appendChild(el("dt", null, esc(f.label))); r.appendChild(el("dd", null, esc(f.value))); tb.appendChild(tag(r, f)); });
        spec.appendChild(tb);
      }
      const byLabel = new Map(); M.tools.forEach((f) => { if (!byLabel.has(f.label)) byLabel.set(f.label, []); byLabel.get(f.label).push(f); });
      if (byLabel.size) {
        const cols = el("div", "sp-tcols");
        byLabel.forEach((list, label) => {
          const c = el("div", "sp-tcol"); c.appendChild(el("div", "sp-caps", esc(label)));
          const ul = el("ul"); list.forEach((f) => ul.appendChild(tag(el("li", null, esc(f.value)), f)));
          c.appendChild(ul); cols.appendChild(c);
        });
        spec.appendChild(cols);
      }
      if (M.palette && M.palette.colors && M.palette.colors.length) {
        const pal = el("div", "sp-pal"); pal.style.setProperty("--n", M.palette.colors.length);
        M.palette.colors.forEach((c) => {
          const sw = el("div", "sp-sw", '<i style="background:' + esc(c.hex) + '"></i><span>' + esc(String(c.hex).toUpperCase()) + "</span>" + (c.name ? "<span>" + esc(c.name) + "</span>" : ""));
          pal.appendChild(sw);
        });
        const pw = el("div", "sp-palw"); if (M.palette.title) pw.appendChild(el("div", "sp-caps", esc(M.palette.title))); pw.appendChild(tag(pal, M.palette));
        spec.appendChild(pw);
      }
      frag.appendChild(spec);

      /* the foot */
      const foot = el("footer", "sp-foot");
      if (o.next && o.next.k && D.study(o.next.k)) {
        const nk = o.next.k;
        const a = el("a", "sp-next"); a.href = D.href(nk);
        a.appendChild(el("span", "sp-caps", "Next"));
        a.appendChild(el("span", "sp-next-t", esc(o.next.t || D.title(nk))));
        const nc = cover(nk);
        if (nc) { const nb = picBox({ src: nc.src, w: nc.w, h: nc.h, t384: nc.t384, t768: nc.t768, alt: "" }, "sp-next-pic"); a.appendChild(nb); watch(nb); }
        a.addEventListener("click", (ev) => {
          if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button) return; /* a new tab is still a new tab */
          if (!o.onNext) return;
          ev.preventDefault(); o.onNext(nk);
        });
        foot.appendChild(a);
      }
      const full = el("a", "sp-full", "Full study"); full.href = D.href(k);
      foot.appendChild(full);
      frag.appendChild(foot);

      root.replaceChildren(frag);
      room.ids = ids.slice();
      parts = P;

      /* ── the builders ── */
      function paras(list) {
        const out = []; let p = null;
        list.forEach((f) => { if (!p || p.pi !== f.pi) { p = { pi: f.pi, lines: [] }; out.push(p); } p.lines.push(f); });
        return out;
      }
      function paraEl(p, cls) {
        const e = el("p", cls);
        p.lines.forEach((f, i) => { if (i) e.appendChild(document.createTextNode(" ")); e.appendChild(tag(el("span", null, esc(f.text)), f)); });
        return e;
      }
      function figBlock(list, cls) {
        const b = el("div", cls + " n" + list.length);
        list.forEach(({ f, fig }) => {
          const c = tag(el("div", "sp-fm"), f);
          const n = el("div", "sp-fn", esc(fig)); c.appendChild(n);
          c.appendChild(el("p", "sp-fs", withFig(f.text, fig)));
          b.appendChild(c); P.figs.push({ n, cell: c, group: b });
        });
        return b;
      }
      function picGroup(list, cls) {
        const wrap = el("div", cls || "sp-plates");
        partition(list, W, V, g).forEach((ps) => {
          const row = el("div", "sp-row n" + ps.length);
          row.style.setProperty("--g", g + "px");
          /* each picture grows by its share of the row's ratios. Raw
             ratios under one (a lone tall screen) grew only that fraction
             of the row, so a 267px plate drew at 119 */
          const sum = ps.reduce((a, f) => a + ratio(f), 0);
          ps.forEach((f) => { const b = picBox(f); b.style.setProperty("--r", (ratio(f) / sum).toFixed(5)); row.appendChild(b); watch(b); });
          const air = AIR[airSide++ % AIR.length];
          /* a single picture keeps its own words as a caption, under it,
             or beside it when the picture leaves room on one side */
          let one = null, cap = null;
          if (ps.length === 1 && ps[0].alt) {
            one = el("div", "sp-one"); one.appendChild(row);
            cap = el("p", "sp-cap", '<span class="sp-fno">' + two(++figNo) + "</span>" + esc(ps[0].alt)); one.appendChild(cap);
            wrap.appendChild(one);
          } else wrap.appendChild(row);
          P.rows.push({ row, ps, air, one, cap });
        });
        return wrap;
      }
      /* a small or tall picture that follows text goes beside it instead
         of standing alone in a row of its own. When a group follows, its
         first picture goes beside and the rest keep their rows. Runs of
         text in a row (a section's columns) share the one picture, the
         way a page sets a small plate beside a column of items */
      /* how tall a run of text will stand at a width: plain arithmetic on
         its characters, close enough to tell a paragraph from a page */
      function textH(runs, w) {
        return runs.reduce((h, r) => h + (r.col ? 34 : 0) + r.parts.reduce((a, p) => {
          if (p.t !== "p") return a + 150 * p.list.length;
          const n = p.lines.reduce((c, f) => c + f.text.length + 1, 0);
          return a + Math.ceil(n / Math.max(20, w / 7.4)) * 24.3 + 16;
        }, 0) + 30, 0);
      }
      function asideUp(blocks) {
        const out = [];
        const small = (f) => f.w / 2 < 0.62 * C || ratio(f) < 0.85;
        blocks.forEach((b) => {
          const prev = out[out.length - 1];
          if (b.t === "pics" && prev && prev.t === "run" && W >= 560 && small(b.list[0]) && (b.list.length === 1 || ratio(b.list[0]) < 0.85 || b.list[0].w / 2 < 0.46 * C)) {
            const f = b.list[0];
            const runs = [prev];
            for (let j = out.length - 2; j >= 0 && runs.length < 3 && out[j].t === "run" && out[j].col && runs[0].col; j--) runs.unshift(out[j]);
            /* only beside text that stands about as tall as the picture:
               a tall screen next to one short line is mostly a hole */
            const pw = Math.min(f.w / 2, half, V * 0.8 * ratio(f));
            if (pw / ratio(f) > Math.max(textH(runs, half) * 1.9, V * 0.42)) { out.push(b); return; }
            out.splice(out.length - runs.length, runs.length);
            out.push({ t: "aside", runs, f });
            if (b.list.length > 1) out.push({ t: "pics", list: b.list.slice(1) });
            return;
          }
          out.push(b);
        });
        return out;
      }
      /* a picture group that closes two or more runs of text moves up to
         the paragraph end nearest their middle, so a long section is not
         a wall of words and then a gallery. Nothing else moves */
      function spread(blocks) {
        const out = blocks.slice();
        const len = (r) => r.parts.reduce((a, p) => a + (p.t === "p" ? p.lines.reduce((c, f) => c + f.text.length + 1, 0) : 150 * p.list.length), 0);
        for (let i = 0; i < out.length; i++) {
          if (out[i].t !== "pics") continue;
          let j = i; while (j > 0 && out[j - 1].t === "run") j--;
          const runs = out.slice(j, i); if (runs.length < 2) continue;
          const total = runs.reduce((a, r) => a + len(r), 0); if (total < 700) continue;
          let acc = 0, at = 1, best = Infinity;
          for (let q = 0; q < runs.length - 1; q++) { acc += len(runs[q]); const d = Math.abs(acc - total / 2); if (d < best) { best = d; at = q + 1; } }
          const [b] = out.splice(i, 1); out.splice(j + at, 0, b);
        }
        return out;
      }
      function runEl(run) {
        const g2 = el("div", "sp-grid sp-run" + (run.col ? " sp-hasc" : ""));
        const rl = el("div", "sp-rail");
        if (run.col) rl.appendChild(tag(el("h3", "sp-col", inkGrey(run.col.text)), run.col));
        g2.appendChild(rl);
        const t = el("div", "sp-text");
        run.parts.forEach((p) => {
          /* the first paragraph of a section is its lede: regular weight,
             a size up, so the medium body under it reads as a change */
          if (p.t === "p") { t.appendChild(paraEl(p, lede ? "sp-p sp-ls" : "sp-p")); lede = false; }
          else t.appendChild(figBlock(p.list, "sp-figs"));
        });
        g2.appendChild(t);
        return g2;
      }
      function blockEl(b) {
        switch (b.t) {
          case "run": return runEl(b);
          case "aside": {
            /* the picture in the left half, the copy in the right */
            const a = el("div", "sp-aside");
            const pb = picBox(b.f, "sp-apic"); watch(pb);
            const pw = el("div", "sp-aw"); pw.appendChild(pb); a.appendChild(pw);
            const at = el("div", "sp-at");
            b.runs.forEach((run) => { const r = runEl(run); r.classList.add("sp-in-aside"); at.appendChild(r); });
            a.appendChild(at);
            P.asides.push({ a, pw, f: b.f, runs: b.runs });
            return a;
          }
          case "pics": return picGroup(b.list);
          /* a deck that is one short line is set as a bold beat of its own */
          case "deck": return tag(el("p", "sp-deck" + (b.f.text.length <= 52 && b.f.text.indexOf(" | ") < 0 ? " sp-short" : ""), inkGrey(b.f.text)), b.f);
          case "pull": {
            const first = pulled++ === 0;
            const q = el("blockquote", "sp-pull" + (first ? " sp-field" : ""));
            if (first) { q.style.setProperty("--fill", s.fill || "#000"); q.style.setProperty("--fink", s.ink || D.ink(s.fill || "#000")); }
            const t = el("p", "sp-pq", inkGrey(b.f.text)); q.appendChild(t); P.pulls.push(t);
            if (first) q.appendChild(el("div", "sp-fcap", esc(D.title(k)) + '<span class="y">' + esc(s.y) + "</span>"));
            return tag(q, b.f);
          }
          case "closing": {
            const c = el("div", "sp-closing");
            b.list.forEach((f, i) => c.appendChild(tag(el("p", !i && f.text.length > 150 ? "sp-long" : null, inkGrey(f.text)), f)));
            return c;
          }
          case "cards": {
            const c = el("div", "sp-cards");
            b.list.forEach((f) => { const d = el("div", "sp-card"); d.appendChild(el("h3", null, esc(f.text))); d.appendChild(el("p", null, esc(f.note))); c.appendChild(tag(d, f)); });
            return c;
          }
          case "nums": {
            const big = b.list.slice(0, 4), rest = b.list.slice(4);
            const w = el("div", "sp-nums");
            const grid = el("div", "sp-numg n" + big.length);
            big.forEach((f) => {
              const c = tag(el("div", "sp-fm"), f);
              const n = el("div", "sp-fn", esc(f.value)); c.appendChild(n);
              c.appendChild(el("p", "sp-nl", esc(f.label)));
              if (f.sub) c.appendChild(el("p", "sp-ns", esc(f.sub)));
              grid.appendChild(c); P.figs.push({ n, cell: c, group: grid });
            });
            w.appendChild(grid);
            if (rest.length) {
              const tl = el("div", "sp-numt");
              rest.forEach((f) => { const r = el("div", "sp-nr", '<span class="v">' + esc(f.value) + '</span><span class="l">' + esc(f.label) + '</span><span class="s">' + esc(f.sub || "") + "</span>"); tl.appendChild(tag(r, f)); });
              w.appendChild(tl);
            }
            return blackOr(w);
          }
          case "chart": {
            const f = b.f; const c = el("div", "sp-chart");
            c.appendChild(el("div", "sp-caps", esc(f.title)));
            const n = el("div", "sp-fn", esc(f.callout) + (f.suffix ? ' <span class="sp-g">' + esc(f.suffix) + "</span>" : ""));
            c.appendChild(n); P.figs.push({ n, cell: c, group: c });
            f.bars.forEach((x) => c.appendChild(el("div", "sp-bar2", '<span>' + esc(x.label) + '</span><span>' + esc(x.value) + '</span><i style="width:' + Math.max(1, x.width) + '%"></i>')));
            return tag(c, f);
          }
          case "steps": {
            const f = b.f; const c = el("div", "sp-steps");
            c.appendChild(el("div", "sp-caps", esc(f.title)));
            if (f.duration) c.appendChild(el("p", "sp-dur", esc(f.duration)));
            const row = el("ol", "sp-stl");
            f.steps.forEach((x) => row.appendChild(el("li", null, (x.n ? '<span class="sp-g">' + esc(x.n) + "</span> " : "") + "<b>" + esc(x.title) + "</b>" + (x.note ? "<span>" + esc(x.note) + "</span>" : ""))));
            c.appendChild(row);
            return tag(c, f);
          }
          default: return el("div");
        }
      }
    };

    /* ── layout: everything that depends on the panel's size and the
       fonts, done after they settle and again on resize ── */
    function margin(W) { return Math.round(Math.min(44, Math.max(16, W * 0.046))); }
    /* the gutter between the halves, as the CSS sets --gc */
    function gutter(W) { return Math.min(36, Math.max(20, W * 0.034)); }
    const layout = () => {
      if (dead || !parts) return;
      const W = root.clientWidth, V = container.clientHeight || window.innerHeight;
      if (W < 60) return;
      const m = margin(W), C = W - 2 * m;
      root.style.setProperty("--m", m + "px");
      root.style.setProperty("--vh", V + "px");

      /* the cover: edge to edge if the lead can honestly fill it, cropped
         to nine tenths of the glass if it is taller (it was 0.62, so the
         title showed on arrival; he asked for more of the picture); else
         at its own honest size, with air */
      if (parts.coverBox) {
        const f = parts.lead, r = ratio(f), hon = f.w / 2, capH = Math.max(260, Math.round(V * 0.9));
        const box = parts.coverBox, frame = parts.coverFrame;
        let side = false;
        if (hon >= W - 0.5) {
          frame.classList.remove("small");
          box.style.width = W + "px"; box.style.height = Math.round(Math.min(W / r, capH)) + "px";
        } else {
          frame.classList.add("small");
          let w = Math.min(hon, C), h = w / r;
          if (h > capH) { h = capH; w = h * r; }
          box.style.width = Math.round(w) + "px"; box.style.height = Math.round(h) + "px";
          /* a small cover leaves a hole beside it. When the hole is wide
             enough, the cover sets to the right and the kicker (the
             discipline, the year, the lines) moves into the hole at its
             foot, the way a magazine opener sets its standfirst */
          side = W >= 560 && C - w >= 200;
        }
        frame.classList.toggle("side", side);
        const home = side ? parts.coverSide : parts.rail;
        if (parts.meta.parentNode !== home) home.appendChild(parts.meta);
        parts.open.classList.toggle("sp-bare", side && parts.openBare);
        if (!box._loaded) loadPic(box);
      }

      /* rows: as wide as the panel if every picture can fill it; else at
         the width their pixels allow, set in turn against the text
         column, the right margin and the left, so the page keeps moving */
      const wide = W >= 560, gc = gutter(W);
      /* the copy's column: the right half, from just past the middle */
      const tx = wide ? m + (C - gc) * 0.5 + gc : m, tw = W - m - tx;
      parts.rows.forEach((R) => {
        const n = R.ps.length, g = parseFloat(R.row.style.getPropertyValue("--g")) || 8;
        const sum = R.ps.reduce((s, f) => s + ratio(f), 0);
        const Hc = Math.min(Math.min(...R.ps.map((f) => f.h / 2)), V * 0.84);
        const maxW = Hc * sum + g * (n - 1);
        let w, ml;
        if (maxW >= W - 0.5) { w = W; ml = 0; }
        else if (maxW > C) { w = maxW; ml = (W - w) / 2; }
        else {
          w = maxW;
          if (R.air === "t" && wide) ml = w <= tw + 0.5 ? tx : W - m - w;
          else ml = R.air === "r" ? W - m - w : m;
        }
        R.row.classList.toggle("bleed", w >= W - 0.5);
        R.row.style.width = Math.floor(w) + "px"; R.row.style.marginLeft = Math.round(ml) + "px";
        /* a lone picture across the room drifts, when a tenth more of it
           is still honest */
        const pb = R.row.firstElementChild;
        if (pb) pb.classList.toggle("par", mo && n === 1 && w >= W - 0.5 && R.ps[0].w / 2 >= 1.1 * w && !pb._still);
        if (R.cap) {
          const gs = Math.max(18, Math.round(W * 0.03));
          const right = W - m - (ml + w), left = ml - m;
          const side = !wide ? null : right >= 190 ? "r" : left >= 190 ? "l" : null;
          R.one.classList.toggle("side", !!side);
          R.cap.style.left = R.cap.style.width = R.cap.style.marginLeft = R.cap.style.maxWidth = "";
          /* a picture in the left half keeps its words in the right one,
             on the copy's line */
          if (side === "r" && ml + w + gs <= tx) { R.cap.style.left = Math.round(tx) + "px"; R.cap.style.width = Math.min(250, Math.floor(tw)) + "px"; }
          else if (side === "r") { R.cap.style.left = Math.round(ml + w + gs) + "px"; R.cap.style.width = Math.min(250, Math.floor(right - gs)) + "px"; }
          else if (side === "l") { const cw = Math.min(250, Math.floor(left - gs)); R.cap.style.left = Math.round(ml - gs - cw) + "px"; R.cap.style.width = cw + "px"; }
          else { R.cap.style.marginLeft = Math.max(m, Math.round(ml)) + "px"; R.cap.style.maxWidth = Math.max(240, Math.min(C, Math.floor(w))) + "px"; }
        }
      });
      parts.asides.forEach((A) => {
        const f = A.f, pw = Math.floor(Math.min(f.w / 2, (C - gc) / 2, V * 0.8 * ratio(f)));
        A.a.style.setProperty("--pw", pw + "px");
      });
      /* keep what is already loaded asking for the right rung */
      root.querySelectorAll(".sp-pic img").forEach((im) => { const w = im.parentNode.offsetWidth; if (w) im.sizes = w + "px"; });

      fitType(W);
      if (mo) drift();
      if (mo) { scrubList(); scrub(); }
    };

    /* the largest size at which a block of type keeps to a number of lines */
    const fitLines = (node, lo, hi, maxLines) => {
      const lh = parseFloat(getComputedStyle(node).lineHeight) / parseFloat(getComputedStyle(node).fontSize) || 1;
      let best = lo;
      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2; node.style.fontSize = mid + "px";
        const ok = node.scrollWidth <= node.clientWidth + 1 && node.offsetHeight <= mid * lh * maxLines + 2;
        if (ok) { best = mid; lo = mid; } else hi = mid;
      }
      node.style.fontSize = Math.floor(best * 2) / 2 + "px";
    };
    const fitType = (W) => {
      /* the title: big, but under the cover, never over it in weight */
      if (parts.title) {
        const t = parts.title, len = t.textContent.length;
        fitLines(t, Math.max(34, W * 0.07), Math.min(104, W * (len <= 12 ? 0.135 : 0.108)), len > 26 ? 3 : 2);
      }
      parts.pulls.forEach((q) => { const len = q.textContent.length; fitLines(q, 22, Math.min(96, W * (len < 50 ? 0.1 : len < 80 ? 0.082 : 0.068)), len < 50 ? 3 : 4); });
      /* figures: one line each, as large as their cell allows, at three
         scales: the black field loudest, a band on paper next, a figure
         inside the text column quietest */
      parts.figs.forEach(({ n }) => {
        const cap = n.closest(".sp-black") ? Math.min(300, W * 0.36) : n.closest(".sp-band, .sp-numg, .sp-chart") ? Math.min(210, W * 0.24) : Math.min(96, W * 0.125);
        n.style.fontSize = "100px"; n.style.whiteSpace = "nowrap";
        const avail = n.parentNode.clientWidth || W; const w100 = n.scrollWidth || 1;
        n.style.fontSize = Math.floor(Math.max(28, Math.min(cap, (avail / w100) * 100 * 0.985))) + "px";
      });
      /* figures in a set share a size; a band leads with its first figure
         alone, larger, across the page */
      const groups = new Map();
      parts.figs.forEach((x) => {
        const gr = x.group; if (!gr.classList.contains("sp-numg") && !gr.classList.contains("sp-band") && !gr.classList.contains("sp-figs")) return;
        if (gr.classList.contains("sp-band") && !gr.classList.contains("sp-stack") && x.cell === gr.firstElementChild) return;
        if (!groups.has(gr)) groups.set(gr, []); groups.get(gr).push(x);
      });
      groups.forEach((list) => { if (list.length < 2 && !list[0].group.classList.contains("sp-numg")) return; const min = Math.min(...list.map((x) => parseFloat(x.n.style.fontSize))); list.forEach((x) => { x.n.style.fontSize = min + "px"; }); });
      /* the next study's name keeps to its column beside the small cover: a
         long word ("personalization" on a phone) steps the size down rather
         than run under the picture (27 Sept review) */
      const nt = root.querySelector(".sp-next-t");
      if (nt) {
        nt.style.fontSize = "";
        let px = parseFloat(getComputedStyle(nt).fontSize);
        while (px > 20 && nt.scrollWidth > nt.clientWidth + 1) { px -= 1; nt.style.fontSize = px + "px"; }
      }
    };

    build();
    startIO();
    layout();
    armReveals(false);
    if (!o.hold) play({ settle: true, delay: 40 });
    if (document.fonts && document.fonts.ready) {
      Promise.all(["700 100px 'Avenir Next'", "600 20px 'Avenir Next'", "500 15px 'Avenir Next'", "800 100px 'Avenir Next'"].map((f) => document.fonts.load(f).catch(() => null)))
        .then(() => document.fonts.ready).then(() => { if (!dead) layout(); });
    }

    /* the bar's name shows once the title has gone */
    const watchTitle = () => {
      if (headIO) headIO.disconnect();
      if (!("IntersectionObserver" in window) || !parts.title) return;
      headIO = new IntersectionObserver(([e]) => root.classList.toggle("sp-past", !e.isIntersecting && e.boundingClientRect.top < (e.rootBounds ? e.rootBounds.top : 0) + 10), { root: container, threshold: 0 });
      headIO.observe(parts.title);
    };
    watchTitle();

    /* a new width: small changes relayout; a real change rebuilds the rows
       and keeps the reader where they were */
    let rzT = 0;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(() => {
        cancelAnimationFrame(rzT);
        rzT = requestAnimationFrame(() => {
          if (dead) return;
          const W = root.clientWidth;
          if (Math.abs(W - builtW) > Math.max(40, builtW * 0.12)) {
            const anchor = firstInView();
            if (io) io.disconnect();
            build(); startIO(); layout(); watchTitle(); markAgain();
            if (anchor) { const e2 = find(anchor.id); if (e2) setScroll(container.scrollTop + e2.getBoundingClientRect().top - container.getBoundingClientRect().top - anchor.off); }
            armReveals(true);
          } else layout();
        });
      });
      ro.observe(container);
    }
    const firstInView = () => {
      const top = container.getBoundingClientRect().top;
      for (const e of root.querySelectorAll("[data-f]")) { const r = e.getBoundingClientRect(); if (r.bottom > top + 1) return { id: e.dataset.f, off: r.top - top }; }
      return null;
    };

    /* the arrival plays once, not again on a rebuild */
    setTimeout(() => root.classList.remove("sp-enter"), 1400);

    let marked = [];
    function find(id) { return root.querySelector('[data-f="' + String(id).replace(/"/g, "") + '"]'); }
    function mark(list) {
      marked.forEach((e) => e.classList.remove("sp-on"));
      marked = (list || []).map(find).filter(Boolean);
      marked.forEach((e) => e.classList.add("sp-on"));
      room._markIds = (list || []).slice();
    }
    function markAgain() { if (room._markIds) mark(room._markIds); }
    function scrollTo(id, o2) {
      const e = find(id); if (!e) return false;
      const top = e.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - Math.round(container.clientHeight * 0.18);
      if (lenis) { lenis.resize(); lenis.scrollTo(Math.max(0, top), { immediate: !(o2 && o2.smooth), force: true }); }
      else container.scrollTo({ top: Math.max(0, top), behavior: o2 && o2.smooth ? "smooth" : "auto" });
      return true;
    }
    function destroy() {
      dead = true;
      if (io) io.disconnect(); if (ro) ro.disconnect(); if (headIO) headIO.disconnect(); if (rio) rio.disconnect();
      if (lenis) { cancelAnimationFrame(lraf); lenis.destroy(); lenis = null; }
      container.removeEventListener("scroll", onScroll); cancelAnimationFrame(parT); clearTimeout(holdT);
      container.removeEventListener("scroll", onScrub); cancelAnimationFrame(scT);
      container.removeEventListener("scroll", onTrack); cancelAnimationFrame(trT);
      clearTimeout(fontsT); cancelAnimationFrame(rzT);
      root.remove();
    }
    return room;
  }

  window.StudyPanel = { render, cover };
})();
