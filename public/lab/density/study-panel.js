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
    "sally-design-system": "/case-studies/sally-design-system/sally-design-system-homepage-concept-10-the-edit-desktop.jpg",
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
  const secLabel = (t) => { const m = /^\s*section\s+(\d+)\s*[:.]\s*(.+)$/i.exec(String(t || "")); return m ? { n: m[1].padStart(2, "0"), name: lbl(m[2].trim()) } : { n: "", name: lbl(String(t || "").trim()) }; };
  /* the small labels' case (1 Oct 2026). crossref2 sets html[data-labels],
     title by default: his "all the labels that are ALL CAPS and tracked
     out...can we look at them just title case and normal tracking?", then
     "yea do the rooms too". A study writes its section labels in capitals
     ("PROBLEM STATEMENT"), which no stylesheet can lower, so the words are
     cased here. Title case keeps the short joining words low ("Down to the
     Studs"); sentence case lowers all but the names; an acronym stays one.
     Words written in mixed case keep their own spelling. A page that sets
     no data-labels gets its labels as they come. StudyPanel.label lends
     this to the index, so the two read alike */
  const LB_ACR = new Map("AI API AR CMS CRM CSS DSC DTC HTML iOS JS KPI LLM MCP NCAA NFL NYC OS PDF QR RGB ROI SEO SKU SKUs TV TX UI UX VR".split(" ").map((w) => [w.toUpperCase(), w]));
  const LB_NAMES = ["A.R.C.", "Jim", "Prada Marfa", "Jack White", "West Texas", "The Fancy", "Highball Stepper"];
  const LB_SMALL = new Set("a an and as at but by for in nor of off on or per so the to up via vs yet".split(" "));
  function lbl(s) {
    const mode = document.documentElement.dataset.labels;
    let t = String(s == null ? "" : s);
    if (mode !== "title" && mode !== "sentence") return t;
    const caps = !/[a-z]/.test(t);
    if (caps) {
      t = t.toLowerCase().replace(/[a-z][a-z0-9]*/g, (w) => LB_ACR.get(w.toUpperCase()) || w).replace(/\bi\b/g, "I");
      LB_NAMES.forEach((n) => { t = t.replace(new RegExp("(^|[^A-Za-z])" + n.replace(/\./g, "\\.") + "(?![A-Za-z])", "gi"), (m0, a) => a + n); });
    }
    if (mode === "sentence") return caps ? t.replace(/(^|[\/:]\s*)([a-z])/g, (m0, a, b) => a + b.toUpperCase()) : t;
    const ws = t.split(" ");
    let last = ws.length - 1; while (last > 0 && !/[A-Za-z]/.test(ws[last])) last--;
    let open = true;
    return ws.map((w, i) => {
      if (!/[A-Za-z]/.test(w)) { if (/[\/:]$/.test(w)) open = true; return w; }
      const small = !open && i !== last && LB_SMALL.has(w.replace(/[^A-Za-z]/g, "").toLowerCase());
      open = /[\/:]$/.test(w);
      return small ? w : w.replace(/[A-Za-z][A-Za-z'’.]*/g, (p) => (p === p.toLowerCase() ? p[0].toUpperCase() + p.slice(1) : p));
    }).join(" ");
  }
  const inkGrey = (t) => { const [a, b] = halves(t); return esc(a) + (b ? ' <span class="sp-g">' + esc(b) + "</span>" : ""); };
  /* a pressing headline carries its halves (ink, held); the room sets the
     held line grey, as the study page does */
  const inkGreyF = (f) => (f.held ? esc(f.ink) + ' <span class="sp-g">' + esc(f.held) + "</span>" : inkGrey(f.text));
  const ratio = (f) => (markOf(f) ? 1 : f.w / f.h);
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
       text), a picture masked in along the same path;
     - focus: out of a blur, a picture settling from a little closer;
     - cut: hard cuts a line at a time in Faux Reel's rhythm, a picture
       after a blink of ink;
     - scrub: no clock at all, everything as far along as the scroll is */
  const FAM = () => document.documentElement.dataset.motion || "rise";
  const RV_KINDS = [
    ["mask", ".sp-title, .sp-stand:not(.sp-cst), .sp-h, .sp-deck, .sp-pq, .sp-closing p, .sp-fn, .sp-next-t, .sp-dur, .sp-col, .sp-card h3, .sp-pr-fn"],
    ["lines", ".sp-p"],
    ["pic", ".sp-pic:not(.sp-cpic)"],
    ["field", ".sp-black, .sp-field, .sp-pc, .sp-pb, .sp-povb, .sp-pcy, .sp-pchg, .sp-press"],
    /* .sp-open is not here any more: the rule over a room's opening
       block came off for every room (2 Oct 2026, his "this first one i
       think we can drop from the system") */
    ["rule", ".sp-kick, .sp-run.sp-hasc, .sp-foot, .sp-spec, .sp-card, .sp-tcol, .sp-tr, .sp-nr"],
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

  /* ── the break sections (27 Sept): the black field of figures and the
     first pull quote on the study's fill, the two places a room changes
     ground. His "these type of sections in the case studies feel a
     little off - i like having something different worked in to break
     things up but maybe we do some concepts on these too? maybe 5 or 6
     options - pulled quote style maybe? maybe the fonts are
     takeover/large? maybe we use icons? graphic repeating words? more
     negative space?". Seven looks, chosen on a small row in the sections
     themselves (the index's switches came off the same day), kept in
     html[data-brk] and localStorage, ?look= for an address:
     - field: as they were, the black field and the study's fill;
     - pull: a magazine's pull quote on paper, between rules, the mark
       hung in the study's colour; a figure pulled out the same way;
     - takeover: the words as large as a glass tall will hold them;
     - icons: each figure drawn as what it counts (a hundred dots with
       its share filled, that many weeks as squares, that many stores as
       dots), in the study's colour;
     - repeat: the words repeated down the field in outline, one line
       solid, the curtain's device;
     - air: small type in a tall page of paper, the study's colour one
       small square;
     - fill: the live site's knockout. The section holds still while the
       fill rises under the words and turns them over at its edge;
     - combo, the default since his "i like pull but i think it needs more
       air (maybe not AS tall as air but close) and maybe we put it on a
       solid background? and when we use it as a quote maybe we use the
       icons? so it's kinda of a combo of the 3": pull's rules and pulled
       figures, most of air's height, on the field's solid ground, the
       quote under the drawn mark. A new localStorage key, so a pick from
       the first seven does not hide it ── */
  const LOOKS = ["combo", "field", "pull", "takeover", "icons", "repeat", "air", "fill"], LOOK_LS = "crossref2.look2";
  (() => {
    const q = (new URLSearchParams(location.search).get("look") || "").toLowerCase();
    let v = LOOKS.includes(q) ? q : null;
    if (!v) { try { v = localStorage.getItem(LOOK_LS); } catch (e) { /* a private window */ } }
    document.documentElement.dataset.brk = LOOKS.includes(v) ? v : "combo";
  })();
  const LOOK = () => { const v = document.documentElement.dataset.brk; return LOOKS.includes(v) ? v : "combo"; };
  const ROOMS = new Set();
  const setLook = (x) => {
    if (!LOOKS.includes(x)) return;
    document.documentElement.dataset.brk = x;
    try { localStorage.setItem(LOOK_LS, x); } catch (e) { /* a private window */ }
    ROOMS.forEach((f) => f());
  };
  /* the row came off once he settled on combo ("this looks GREAT - we
     can remove the options toggle", 27 Sept); ?look= still switches */
  const lookRow = () => "";
  /* a figure drawn as what it counts */
  const picto = (fig, text) => {
    const f = String(fig || ""), lf = f.toLowerCase();
    const m = /(\d[\d,]*(?:\.\d+)?)/.exec(f);
    let n = m ? parseFloat(m[1].replace(/,/g, "")) : null;
    if (n == null) { const w = /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|twenty|thirty)\b/.exec(lf); if (w) n = w[1] === "one" ? 1 : NUMW[w[1]]; }
    const svg = (w, h, body) => '<svg class="sp-picto" viewBox="0 0 ' + w + " " + h + '" width="' + w + '" height="' + h + '" aria-hidden="true">' + body + "</svg>";
    const dots = (total, on, per, c) => {
      let b = ""; const r = c * 0.34;
      for (let i = 0; i < total; i++) { const x = (i % per) * c + c / 2, y = Math.floor(i / per) * c + c / 2; b += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r.toFixed(2) + '"' + (i < on ? "" : ' class="off"') + "/>"; }
      return svg(per * c, Math.ceil(total / per) * c, b);
    };
    if (/%/.test(f) && n != null) return dots(100, Math.round(n), 10, 13);
    if (/\b(weeks?|days?|months?|years?|hours?|minutes?)\b/.test(lf) && n) {
      const k = Math.min(Math.round(n), 60), per = Math.min(k, 12), c = k <= 8 ? 44 : 24; let b = "";
      const gp = Math.round(c * 0.22);
      for (let i = 0; i < k; i++) b += '<rect x="' + ((i % per) * c) + '" y="' + (Math.floor(i / per) * c) + '" width="' + (c - gp) + '" height="' + (c - gp) + '"/>';
      return svg(per * c - gp, Math.ceil(k / per) * c - gp, b);
    }
    if (n && n >= 2 && !/\$|\dx\b|\bx\d/i.test(f)) { const k = Math.min(Math.round(n), 2400), per = Math.ceil(Math.sqrt(k * 2.4)), c = k > 400 ? 6 : k > 100 ? 9 : 14; return dots(k, k, per, c); }
    return svg(22, 22, '<rect width="22" height="22"/>');
  };
  /* the wall: the words again and again in outline, over the words
     themselves in solid */
  const wallHtml = (words, rows) => { const line = (words + "   ").repeat(5); let h = ""; for (let i = 0; i < rows; i++) h += '<span class="sp-wl">' + esc(line) + "</span>"; return '<div class="sp-wall" aria-hidden="true">' + h + "</div>"; };

  /* ── the palette (27 Sept, his "let's be large and more impactful with
     the palette - i think it's another moment to have fun. the color
     could sit on one of the images. or paired with the image. one block
     per image and it's a carosel? or opposite maybe it's a big block of
     color with a thumbnail image on top and it animates through different
     colors with different images on top. big color blocks with
     thumbnails on them. or some sort of graph or chart. let's do some
     options for it too!"). Six looks on a row of their own
     (html[data-pal], localStorage, ?pal=):
     - swatch: as it was, small squares in the title block;
     - overlay: the colours as bars laid over the study's picture that
       holds the most of them;
     - paired: a column to each colour, its hex up the column, over the
       picture that colour is most of;
     - blocks: big blocks of colour, each with its picture on it;
     - cycle: one big block that runs through the colours, a different
       picture on each;
     - chart: the colours as a chart of their lightness (L*), darkest
       first.
     The studies' palettes carry no names, so none is made up: a colour
     is its hex and its RGB. Which picture goes with which colour is
     measured from the pictures themselves (the one with the most pixels
     nearest that colour), once, when the room is built ── */
  const PALS = ["blocks", "swatch", "overlay", "paired", "cycle", "chart"], PAL_LS = "crossref2.pal2";
  (() => {
    const q = (new URLSearchParams(location.search).get("pal") || "").toLowerCase();
    let v = PALS.includes(q) ? q : null;
    if (!v) { try { v = localStorage.getItem(PAL_LS); } catch (e) { /* a private window */ } }
    document.documentElement.dataset.pal = PALS.includes(v) ? v : "blocks";
  })();
  /* blocks, his pick ("i like blocks for the palette"), is the default,
     under a new localStorage key so an earlier pick does not hide it */
  const PAL = () => { const v = document.documentElement.dataset.pal; return PALS.includes(v) ? v : "blocks"; };
  const setPal = (x) => {
    if (!PALS.includes(x)) return;
    document.documentElement.dataset.pal = x;
    try { localStorage.setItem(PAL_LS, x); } catch (e) { /* a private window */ }
    ROOMS.forEach((f) => f());
  };
  /* the row came off with the looks' (his "yes, remove the palette row
     too", 27 Sept); ?pal= still switches */
  const palRow = () => "";
  const hexRgb = (h) => { const x = parseInt(String(h).replace("#", "").slice(0, 6), 16) || 0; return [(x >> 16) & 255, (x >> 8) & 255, x & 255]; };
  /* lightness, CIE L*, from a hex */
  const lstar = (h) => {
    const y = hexRgb(h).map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    const Y = 0.2126 * y[0] + 0.7152 * y[1] + 0.0722 * y[2];
    return Y > 216 / 24389 ? 116 * Math.cbrt(Y) - 16 : (24389 / 27) * Y;
  };
  const palCache = new Map();
  const matchPal = (k, colors, pics) => {
    if (palCache.has(k)) return palCache.get(k);
    const pr = Promise.all(pics.slice(0, 18).map((f) => new Promise((res) => {
      const im = new Image(); im.decoding = "async";
      im.onload = () => { try { const c = document.createElement("canvas"); c.width = c.height = 40; const x = c.getContext("2d", { willReadFrequently: true }); x.drawImage(im, 0, 0, 40, 40); res({ f, d: x.getImageData(0, 0, 40, 40).data }); } catch (e) { res(null); } };
      im.onerror = () => res(null);
      im.src = encodeURI(f.t384 || f.t768 || f.src);
    }))).then((list) => {
      list = list.filter(Boolean);
      if (!list.length) return { best: null, per: [] };
      const cs = colors.map((c) => hexRgb(c.hex));
      const share = cs.map(() => list.map(() => 0));
      list.forEach((it, j) => {
        const d = it.d; let n = 0;
        for (let q = 0; q < d.length; q += 4) {
          if (d[q + 3] < 200) continue; n++;
          let bi = 0, bd = Infinity;
          cs.forEach((c, i) => { const dd = (d[q] - c[0]) ** 2 + (d[q + 1] - c[1]) ** 2 + (d[q + 2] - c[2]) ** 2; if (dd < bd) { bd = dd; bi = i; } });
          if (bd < 4800) share[bi][j]++;
        }
        if (n) share.forEach((row) => { row[j] /= n; });
      });
      let best = list[0].f, bs = -1;
      list.forEach((it, j) => { const t = share.reduce((a, row) => a + row[j], 0); if (t > bs) { bs = t; best = it.f; } });
      /* each colour its strongest picture, the strongest pairings first,
         no picture twice while another is left */
      const per = new Array(cs.length).fill(null), used = new Set(), pairs = [];
      share.forEach((row, i) => row.forEach((v, j) => pairs.push([v, i, j])));
      pairs.sort((a, b) => b[0] - a[0]).forEach(([, i, j]) => { if (!per[i] && !used.has(j)) { per[i] = list[j].f; used.add(j); } });
      per.forEach((x, i) => { if (!x) per[i] = list[i % list.length].f; });
      return { best, per };
    });
    palCache.set(k, pr);
    return pr;
  };

  /* ── the palette's names (27 Sept, his "let's replace the hex with a
     'name'", then "if they dont let's make basic ones up / or, clever
     ones"). A colour takes the name its own study gives it in its
     src/data file, matched by hex (twelve studies name theirs); the rest
     are drafts written here for his edit, plain colour words, a few taken
     from the study itself (Robert's "Blazer Pink" and "Polka Dot Cream"
     from its own picture, Sally's hair colours, the kitchen's sage and
     marble). An empty name shows the hex ── */
  /* a quote's ground where his eye asked for another than the study's
     first colour (30 Sept 2026, A.R.C.: "can we adjust this color to a
     cremy beige or something that works better with the warmer tones?"):
     A.R.C.'s own Oak Tan (#BAA383, observed in its photographs, from its
     declared palette) taken half way to the paper. ?qfill=hex tries
     another by eye */
  const QUOTE_FILL = { arc: "#DDD1C1" };
  const quoteFill = (k, s) => {
    const q = new URLSearchParams(location.search).get("qfill");
    if (q && /^#?[0-9a-f]{6}$/i.test(q)) return (q[0] === "#" ? "" : "#") + q;
    return QUOTE_FILL[k] || s.fill || "#000";
  };
  const PAL_OWN = {
    "amber-shockey-co": { "#1F4D78": "Cobalt", "#D87A82": "Blush", "#8E3F40": "Burgundy", "#1F2434": "Charcoal", "#ECE6D5": "Cream" },
    "arc": { "#B1BC94": "Primary", "#000000": "Ground", "#F1F0EE": "Cream", "#C4A265": "Warm Register", "#4A463A": "Olive", "#BAA383": "Oak Tan" },
    "capitan-boot-co": { "#EFEAD9": "Cream", "#C4B594": "Tan", "#5A5945": "Olive", "#2A2A1A": "Dark Olive" },
    "cosmo-prof": { "#F8F6F2": "Cream", "#F4D9DC": "Blush", "#DBC5C8": "Stone", "#E5D6C9": "Sand", "#000000": "Black" },
    "dsc": { "#000000": "Ground", "#141414": "Ink", "#8E8E8E": "Steel", "#E6E6E6": "Mist", "#FFFFFF": "Paper" },
    "fairview-entry": { "#E7DFD2": "Limestone Cream", "#1F1E1B": "Black Iron", "#A87A45": "Antiqued Brass", "#C0A47C": "White Oak", "#4B4A52": "Vintage Indigo" },
    "fairview-sitting": { "#B4ACA0": "Stone Grey", "#3F3E37": "Charcoal Velvet", "#A87A45": "Antiqued Brass", "#A67E55": "Warm Oak", "#ECE6D5": "Cream" },
    "hill-country-living": { "#E5DDC9": "Limestone Cream", "#9B6F47": "Reclaimed Pine", "#8B4F32": "Cognac Leather", "#4A4540": "Charcoal Tweed", "#A87A45": "Antiqued Brass" },
    "hill-country-oak": { "#ECE2C5": "Cream", "#ECC265": "Mustard", "#DA8849": "Burnt Orange", "#D45E3D": "Brick", "#8FB7A0": "Teal", "#3B2F1F": "Charcoal Brown" },
    "ivy-park": { "#18A6CC": "Signal", "#8E9499": "Neutral", "#0E0E0E": "Ground" },
    "jeffrey-ecommerce": { "#1A1A1A": "Charcoal", "#F5F2ED": "Cream", "#FFFF40": "Brand Yellow", "#8C8578": "Soft Gray" },
    "jeffrey-spring": { "#F5F2EC": "Studio White", "#A8B8C8": "Striped Blue", "#E8C4B8": "Blush", "#3E5A39": "Monstera", "#1A1A18": "Soft Black" },
    "you-by-sally": { "#E91E63": "Hot Pink", "#00B8D4": "Cyan", "#141414": "Black", "#F5F2ED": "Cream" },
    /* the pushed palette (2 Oct 2026): his tokens --sb-red "Sally scarlet" and
       --sb-ink, the one soft grey of the pushed pass, and two vivids sampled
       from the photographs of his looks, named as his concepts name them */
    "sally-design-system": { "#E11324": "Sally Scarlet", "#1C1413": "Ink", "#F4F3F1": "Soft Grey", "#442861": "Electric Violet", "#0E4043": "Deep Sea Teal" },
  };
  const PAL_DRAFT = {
    "branding-graphics": { "#DCDDDD": "Paper Grey", "#380F03": "Oxblood", "#9DB3AD": "Sage Mist", "#A89B8F": "Taupe", "#BBCFC9": "Sea Glass" },
    "neiman-marcus": { "#DCD9D2": "Linen", "#9EA7AF": "Slate Blue", "#DCD3C9": "Oat", "#B8C1C4": "Fog", "#84868C": "Pewter" },
    "nordstrom-personalization": { "#DEDBDA": "Chalk", "#3E4412": "Moss", "#C6C6CB": "Silver", "#615D24": "Olive", "#D7C572": "Straw" },
    "ivy-park": { "#1B1B1B": "Jet", "#605D5C": "Graphite", "#363D45": "Slate", "#B4B4B4": "Concrete", "#B9B9B9": "Ash" },
    "nordstrom-framework": { "#E5DCD3": "Bone", "#6E706E": "Graphite", "#918C88": "Stone", "#61605E": "Pewter", "#403934": "Espresso" },
    "loved-by-nordstrom": { "#DAD7D2": "Porcelain", "#605C66": "Dusk", "#BBAA8B": "Camel", "#AF987F": "Toffee", "#CAC4BE": "Oyster" },
    "j-christianson": { "#DCA23D": "Marigold", "#2D2B27": "Soot", "#E5D443": "Lemon", "#593D19": "Walnut", "#B6B548": "Chartreuse" },
    "nordstrom-beauty": { "#787878": "Graphite", "#848486": "Steel", "#2E2E2E": "Charcoal", "#ADA5A1": "Greige", "#C5C1C0": "Pearl" },
    "fairview-bedroom": { "#282923": "Black Olive", "#58635A": "Sage", "#3D4039": "Loden", "#565C48": "Moss", "#657765": "Fern" },
    "big-bend": { "#9AA0A2": "Haze", "#4D402C": "Mesquite", "#645138": "Canyon", "#292B22": "Creosote", "#7F95A1": "Sky" },
    "hill-country-kitchen": { "#35412B": "Deep Sage", "#585D3E": "Sage", "#C1B7A9": "Marble", "#A99D8E": "Stone", "#372810": "Umber" },
    "hill-country-bath": { "#959085": "Sage Grey", "#B0ACAD": "Marble", "#8F8577": "Putty", "#605C5B": "Iron", "#A39D90": "Stone" },
    "black-white-type": { "#C1C1C1": "Silver", "#515151": "Lead", "#D9D9D9": "Newsprint", "#838383": "Pewter", "#4B4744": "Soot" },
    "floor-and-decor": { "#C0C1C3": "Concrete", "#A3A4A6": "Steel", "#5F6363": "Slate", "#D4DBE5": "Ice", "#817D78": "Driftwood" },
    "chalet": { "#CCC4C1": "Birch", "#AEA4A2": "Ash", "#BDACA0": "Sand", "#764226": "Rust", "#667C72": "Pine" },
    "robert-rodriguez": { "#E0552F": "Vermilion", "#F09A3E": "Marigold", "#E8637A": "Blazer Pink", "#F5EAE7": "Polka Dot Cream", "#241C18": "Espresso" },
    "sally-os": { "#D2C6C7": "Mauve", "#C8C8C9": "Platinum", "#C18E7C": "Rose Gold", "#C08861": "Caramel", "#2C312F": "Soft Black" },
    "sizzle": { "#0AA7CA": "Cyan", "#181B17": "Ink", "#776549": "Bronze", "#F5EAE7": "Cream", "#8A8784": "Graphite" },
  };
  const palName = (k, hex) => { const h = String(hex).toUpperCase(); return (PAL_OWN[k] && PAL_OWN[k][h]) || (PAL_DRAFT[k] && PAL_DRAFT[k][h]) || ""; };

  /* ── compose: a study's fragments, in its own reading order, sorted into
     the parts of a room. Nothing is dropped except the Author fact (it is
     him on every study) and the picture the cover already shows ── */
  const compose = (k) => {
    const s = D.study(k); if (!s) return null;
    const dupSrc = s.lead ? LEAD_SAME[k] || null : null;
    const M = { k, s, lead: s.lead || null, dup: null, stand: null, abs: [], facts: [], tools: [], palette: null, secs: [], pool: [] };
    let sec = { open: true, head: null, items: [] }; M.secs.push(sec);
    for (const f of D.byStudy(k)) {
      if (f.kind === "palette") { if (!M.palette) M.palette = Object.assign({}, f, { colors: (f.colors || []).map((c) => Object.assign({}, c, { name: c.name || palName(k, c.hex) })) }); continue; }
      if (f.kind === "fact") { if (f.label !== "Author") M.facts.push(f); continue; }
      if (f.kind === "tool") { M.tools.push(f); continue; }
      if (f.kind === "pic") {
        if (dupSrc && f.src === dupSrc) { M.dup = f; continue; }
        if (f.where === "meta") { M.pool.push(f); continue; }
        sec.items.push({ t: "pic", f }); continue;
      }
      if (f.kind === "num" || f.kind === "chart" || f.kind === "steps") { sec.items.push({ t: f.kind, f }); continue; }
      if (f.kind === "live") { sec.items.push({ t: "live", f }); continue; }
      if (f.kind === "link") { sec.items.push({ t: "link", f }); continue; }
      if (f.kind !== "line") continue;
      if (f.weight === "sub" && f.where === "meta" && !M.stand) { M.stand = f; continue; }
      if (f.weight === "body" && f.where === "abstract") { M.abs.push(f); continue; }
      if (f.weight === "head" && f.where === "section-header") { sec = { head: f, items: [] }; M.secs.push(sec); continue; }
      if (f.weight === "head") { sec.items.push({ t: f.note ? "card" : "col", f }); continue; }
      if (f.weight === "display") { sec.items.push({ t: "pull", f }); continue; }
      if (f.weight === "sub") { sec.items.push({ t: f.where === "closing" ? "closing" : "deck", f }); continue; }
      sec.items.push({ t: "body", f });
    }
    /* a FULL picture leads its section's pictures: it moves up to where
       the first of them stood, the words around them left in place */
    M.secs.forEach((x) => {
      const first = x.items.findIndex((i) => i.t === "pic"); if (first < 0) return;
      const lead = x.items.filter((i, j) => j > first && i.t === "pic" && full(i.f));
      if (!lead.length) return;
      x.items = x.items.filter((i) => !lead.includes(i));
      x.items.splice(first, 0, ...lead);
    });
    /* the reel: one or two frames after the abstract, the rest dealt to
       the sections with no picture of their own, set after their first
       run of text so the section reads words, picture, words. A live
       page counts as a section's own picture (2 Oct 2026: the Sally
       design system shows its emails and homepages live, and the reel's
       stills of them were being dealt in beside the pages themselves) */
    const pool = M.pool.slice();
    M.openPics = pool.splice(0, pool.length >= 6 ? 2 : 1);
    const bare = M.secs.filter((x) => !x.open && !x.items.some((i) => i.t === "pic" || i.t === "live"));
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
    /* a mark goes under the picture it is set after, wherever that landed */
    const moving = [];
    M.secs.forEach((x) => { x.items = x.items.filter((i) => { const mk = i.t === "pic" && markOf(i.f); if (mk && mk.after) { moving.push(i); return false; } return true; }); });
    M.openPics = M.openPics.filter((f) => { const mk = markOf(f); if (mk && mk.after) { moving.push({ t: "pic", f }); return false; } return true; });
    moving.forEach((it) => {
      const want = markOf(it.f).after;
      for (const x of M.secs) {
        let j = -1; x.items.forEach((i, n) => { if ((i.t === "pic" && fileOf(i.f) === want) || (i._after === want)) j = n; });
        if (j >= 0) { it._after = want; x.items.splice(j + 1, 0, it); return; }
      }
      const o = M.openPics.findIndex((f) => fileOf(f) === want);
      if (o >= 0) { let j = o; while (j + 1 < M.openPics.length && markOf(M.openPics[j + 1])) j++; M.openPics.splice(j + 1, 0, it.f); return; }
      M.secs[M.secs.length - 1].items.push(it);
    });
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
      if (it.t === "live") { const ph = !!it.f.phone, fit = it.f.mode === "fit"; if (!fit && !it.f.tabs && last && last.t === "lives" && !last.fit && last.phone && ph && !last.list[0].tabs) last.list.push(it.f); else out.push({ t: "lives", phone: ph, fit, list: [it.f] }); continue; }
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
  /* pictures that stand alone, never paired in a row: spreads whose type
     is the point and reads only large (1 Oct 2026, his "let's stack these
     so they are a single vs doing them in a grid - we miss the big type
     with them being small", on Neiman Marcus's typography spreads) */
  const SOLO = new Set([
    "neiman-marcus-insite-minimalism-flat-spread.jpg", "neiman-marcus-insite-structure-piazza-sempione-spread.jpg",
    "neiman-marcus-insite-the-rocker-typographic-spread.jpg", "neiman-marcus-insite-the-socialite-red-dress-spread.jpg",
    "neiman-marcus-insite-classic-beauty-spread.jpg",
  ]);
  /* pictures set at the room's full width whatever their height, and set
     first among their section's pictures: Typography & Patterns' three
     prints, flat (1 Oct 2026, his "let's do these full size and let's also
     put them above the pattern blocks vs after in each of their
     sections"). The files are 1860px, so the full width is still honest.
     They hold still: the drift crops a tenth of a picture, and a print's
     type runs to its edges */
  const FULL = new Set([
    "typography-patterns-the-fancy-poster-flat.png", "typography-patterns-stepper-poster-flat.png",
    "typography-patterns-white-poster-flat.png",
  ]);
  const fileOf = (f) => (f && f.src ? f.src.split("/").pop() : "");
  const full = (f) => FULL.has(fileOf(f));
  /* marks set small on a square of flat colour, edge to edge, with plenty
     of air round them, and moved down under the brand-system picture
     (1 Oct 2026, his "can we make the marks smaller centered on my larger
     floods of solid color so there's plenty of negative space around
     them? they can both be wide 1x1 too", then "they can also move down
     below with this image", on Capitan's buffalo and badge). The colours
     are the study's palette: the cream buffalo on its olive, the badge on
     its cream. k is the mark's share of the square, about its honest
     width at the room's full one */
  const CAPITAN_SYSTEM = "capitan-boot-co-branding-system-color-palette-logo-western-original-bull-skull-horns-arrows-dark-green-beige-geometric-grid-design.jpg";
  const MARKS = {
    "buffalo-logo.png": { bg: "#5A5945", k: 0.46, after: CAPITAN_SYSTEM },
    "capitan-boot-co-branding-western-logo-desert-cactus-rock-formation-vintage-outdoors-landscape-design.png": { bg: "#EFEAD9", k: 0.6, after: CAPITAN_SYSTEM },
  };
  function markOf(f) { return (f && f.src && MARKS[f.src.split("/").pop()]) || null; }
  const solo = (f) => SOLO.has(fileOf(f)) || full(f) || !!markOf(f);
  const partition = (list, W, V, g) => {
    const n = list.length, T = W * 0.45, Vc = V * 0.84;
    /* a hero: honest across the whole room and not so tall that the glass
       would crop most of it. It never shares a row; nor does a solo */
    const hero = (f) => (f.w / 2 >= W - 0.5 && W / ratio(f) <= Vc * 1.15) || solo(f);
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

  /* the shoutouts: each verb once, its names after it, as a line (the
     default) or a band */
  const PRESS_HOW = { featured: "Featured by", posted: "Posted by", wrote: "Written about by", spotted: "Spotted by" };
  const PRESS_MODE = () => { const m = (new URLSearchParams(location.search).get("press") || "").toLowerCase(); return m === "band" || m === "ticker" ? m : "note"; };
  const pressGroups = (list) => {
    const gs = [];
    list.forEach((x) => { let g = gs.find((y) => y.how === x.how); if (!g) gs.push((g = { how: x.how, by: [] })); g.by.push(x.by); });
    return gs;
  };
  const andList = (a) => (a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]);
  const pressNote = (list) => el("p", "sp-pr-fn", pressGroups(list).map((g) => '<span class="sp-g">' + esc(PRESS_HOW[g.how] || g.how) + "</span> " + esc(andList(g.by)) + ".").join(" "));
  const pressBand = (list) => {
    const gs = pressGroups(list), and = andList;
    const inner = gs.map((g) => '<span class="sp-pr-g"><span class="sp-pr-h">' + esc(lbl(PRESS_HOW[g.how] || g.how)) + '</span><span class="sp-pr-n">' + esc(and(g.by)) + "</span></span>").join("");
    const tick = PRESS_MODE() === "ticker";
    const b = el("aside", "sp-press" + (tick ? " tick" : ""));
    if (tick) { const t = el("div", "sp-pr-track"); for (let i = 0; i < 4; i++) t.appendChild(el("div", "sp-pr-run", inner)); b.appendChild(t); }
    else b.appendChild(el("div", "sp-pr-in", inner));
    return b;
  };

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
    /* the live site's scroll (27 Sept, his "can we add the scaling,
       parallax and other effects we have live? ... as many as we can so
       they feel really immersive like the live version", and "yes make
       wipe the default and start the port!"). Built, then set aside the
       same day: he liked the rooms better as they were ("i noticed we
       pulled the entire way the live case studies animate...i kinda like
       how we had them before we did that"). The page is the default
       again; ?scroll=live still opens a room the way a study opens on
       the site, for comparing */
    const CH = mo && (new URLSearchParams(location.search).get("scroll") || "page") === "live";
    if (CH) root.classList.add("ch");
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
      els.forEach((e) => { if (e.closest(".lk-fill")) go(e, true); });
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
        if (p.settle && parts && parts.coverBox && !CH) parts.coverBox.classList.add("settle");
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
      root.querySelectorAll(".sp-pic.par, .sp-pic.par2").forEach((b) => {
        const r = b.getBoundingClientRect(); if (r.bottom < cr.top || r.top > cr.bottom) return;
        let k = Math.max(0, Math.min(1, (cr.bottom - r.top) / (cr.height + r.height)));
        if (b.classList.contains("par2") && b.classList.contains("odd")) k = 1 - k;
        b.style.setProperty("--py", (-0.1 * r.height * k).toFixed(1) + "px");
      });
    };
    const onScroll = () => { if (!parT) parT = requestAnimationFrame(drift); };
    if (mo) container.addEventListener("scroll", onScroll, { passive: true });

    /* the cover's type: the title as large as the live cover sets it
       (13.5% of the column, 84 to 205px; 15.5%, 42 to 96px, narrow), then
       down until its widest word keeps to the line; cut into its lines,
       each in a mask. The subtitle's words each a box of their own,
       knowing the line they sit on */
    const coverLay = (W) => {
      const h1 = parts.ctitle, st = parts.cstand, m = margin(W), box = W - 2 * m;
      h1.textContent = h1.dataset.t;
      let fs = W < 560 ? Math.max(42, Math.min(96, W * 0.155)) : Math.max(84, Math.min(205, W * 0.135));
      h1.style.fontSize = fs + "px";
      const pr = document.createElement("span"); pr.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap"; h1.appendChild(pr);
      let wid = 1; h1.dataset.t.split(/\s+/).forEach((w) => { pr.textContent = w; wid = Math.max(wid, pr.offsetWidth); }); pr.remove();
      if (wid > box) { fs = Math.floor(fs * (box / wid) * 0.99); h1.style.fontSize = fs + "px"; }
      h1.innerHTML = h1.dataset.t.split(/\s+/).map((w) => '<span class="rw">' + esc(w) + "</span>").join(" ");
      const lines = []; let top = null;
      h1.querySelectorAll(".rw").forEach((w) => { const y = Math.round(w.offsetTop); if (top === null || Math.abs(y - top) > 3) { lines.push([]); top = y; } lines[lines.length - 1].push(w.textContent); });
      h1.innerHTML = lines.map((l) => '<span class="rln"><span class="rlnI">' + l.map(esc).join(" ") + "</span></span>").join(" ");
      if (!st) { parts.cwords = []; return; }
      st.innerHTML = st.dataset.h;
      const ws = [];
      const walk = (n) => [...n.childNodes].forEach((c) => {
        if (c.nodeType === 3) {
          const fr = document.createDocumentFragment();
          c.nodeValue.split(/(\s+)/).filter(Boolean).forEach((x) => { if (/^\s+$/.test(x)) fr.appendChild(document.createTextNode(x)); else { const w = document.createElement("span"); w.className = "csW"; w.textContent = x; fr.appendChild(w); ws.push(w); } });
          c.replaceWith(fr);
        } else if (c.nodeType === 1) walk(c);
      });
      walk(st);
      let li = -1, ty = null; ws.forEach((w) => { const y = Math.round(w.offsetTop); if (ty === null || Math.abs(y - ty) > 3) { li++; ty = y; } w._li = li; });
      parts.cwords = ws;
    };
    /* the scroll through the cover and the climb, the live numbers:
       the lines go out over 0.55 of the sequence each, 0.1 apart, the
       bottom first; the subtitle starts at 0.3, travels 0.86 of the glass
       over 0.55, dragging 13px a line; the held glass creeps up 0.08 of
       what is scrolled; the picture grows from 0.95 as it crosses the
       glass and its 44px corners square off when it fills the room */
    let chT = 0;
    const smooth = (k) => k * k * (3 - 2 * k), c01 = (k) => (k < 0 ? 0 : k > 1 ? 1 : k);
    function choreo() {
      chT = 0; if (dead || !parts || !parts.cvw) return;
      const cr = container.getBoundingClientRect(), H = container.clientHeight || 800;
      const r = parts.cvw.getBoundingClientRect(), top = r.top - cr.top;
      const p = c01(-top / Math.max(1, r.height - H - H * 0.96));
      const lines = parts.cvw.querySelectorAll(".rlnI"), n = lines.length;
      lines.forEach((inner, i) => {
        const k = smooth(c01((p - (n - 1 - i) * 0.1) / 0.55));
        const tr = inner._tr || (inner._tr = (inner.parentElement.offsetHeight / Math.max(1, inner.offsetHeight)) * 100 + 8);
        inner.style.transform = k ? "translateY(" + (k * tr).toFixed(1) + "%)" : "";
      });
      const q = c01((p - 0.3) / 0.55), settle = Math.pow(1 - q, 1.7), rise = (1 - q) * 0.86 * H;
      (parts.cwords || []).forEach((w) => { w.style.transform = "translateY(" + (rise + settle * w._li * 13).toFixed(1) + "px)"; });
      const sc = -top, span = Math.max(1, r.height - H);
      const dr = sc > 0 ? Math.round(-Math.min(sc, span) * 0.08 * 10) / 10 : 0;
      parts.cvs.style.transform = dr ? "translate3d(0," + dr + "px,0)" : "";
      const B = parts.coverBox;
      if (B) {
        const pp = c01((H - (parts.coverFrame.getBoundingClientRect().top - cr.top)) / H);
        B.style.transform = "scale(" + (0.95 + 0.05 * pp).toFixed(4) + ")";
        B.style.borderRadius = (B.offsetWidth >= root.clientWidth - (root.clientWidth >= 560 ? 20 : 0) - 1 ? Math.round(44 * (1 - pp)) : 44) + "px";
      }
    }
    const onChoreo = () => { if (!chT) chT = requestAnimationFrame(choreo); };
    if (CH) container.addEventListener("scroll", onChoreo, { passive: true });

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

    /* the fill look's knockout, as the live site's quote drives its own:
       how far through the section the reader is, eased, is how high the
       fill stands; the words drift up a little as it comes. Without
       motion it stands full */
    let knT = 0;
    function knockTick() {
      knT = 0; if (dead || !parts || !parts.knocks.length) return;
      const cr = container.getBoundingClientRect(), H = container.clientHeight || 800;
      parts.knocks.forEach((K) => {
        if (!mo) { K.sec.style.setProperty("--fh", "100%"); return; }
        const r = K.sec.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (cr.top - r.top) / Math.max(1, r.height - H)));
        const e = 1 - Math.pow(1 - p, 1.4);
        K.sec.style.setProperty("--fh", (e * 100).toFixed(2) + "%");
        K.sec.style.setProperty("--kt", (-e * 34).toFixed(1) + "px");
      });
    }
    const onKnock = () => { if (!knT) knT = requestAnimationFrame(knockTick); };
    container.addEventListener("scroll", onKnock, { passive: true });
    /* the family changed on the page: what has played plays again */
    function replay() {
      if (dead || !mo) return;
      /* back to the start states at once: unwound through their own
         transitions, a picture was still half there when its turn came */
      root.classList.add("rv-reset");
      root.querySelectorAll(".rvband").forEach((b) => b.remove());
      root.querySelectorAll(".rv").forEach((e) => {
        if (e._still) return;
        e.classList.remove("rv-go", "rv-now", "rv-split"); e._rvd = false; e.style.removeProperty("--p");
        if (e._rvpos) { e.style.position = ""; e._rvpos = false; }
        if (e.querySelector(".rvw")) unsplit(e);
      });
      void root.offsetHeight;
      root.classList.remove("rv-reset");
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
      const mk = markOf(f);
      const b = el("div", "sp-pic" + (f.alpha ? " alpha" : "") + (mk ? " mark" : "") + (cls ? " " + cls : ""));
      b._f = f; b.style.setProperty("--ar", mk ? "1 / 1" : f.w + " / " + f.h); b.style.setProperty("--r", ratio(f).toFixed(4));
      if (mk) { b.style.background = mk.bg; b.style.setProperty("--mk", String(mk.k)); }
      return tag(b, f);
    };

    /* ── build, for a width. Called again when the panel changes width by
       more than a little, since where rows break depends on it ── */
    const build = () => {
      const W = root.clientWidth || container.clientWidth || 700;
      const V = container.clientHeight || window.innerHeight || 800;
      builtW = W;
      ids.length = 0; pending.clear();
      if (parts && parts.stops) parts.stops.forEach((f) => f());
      const P = { rows: [], asides: [], figs: [], title: null, pulls: [], coverBox: null, coverFrame: null, coverLive: false, knocks: [], stops: [], briefs: [], lives: [] };
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
        const lk = LOOK();
        const dark = lk === "field" || lk === "takeover" || lk === "repeat" || lk === "combo";
        const b = el("div", (dark ? "sp-black " : "") + "sp-brk sp-brk-f lk-" + lk);
        b.style.setProperty("--fill", s.fill || "#000");
        /* a fill too light to read on paper draws in ink */
        b.style.setProperty("--dotc", /^#?f/i.test(String(D.ink(s.fill || "#000"))) ? "var(--fill)" : "var(--ink)");
        if (lk === "air") b.insertAdjacentHTML("beforeend", '<i class="sp-dot" aria-hidden="true"></i>');
        const cells = [...node.querySelectorAll(".sp-fm")];
        if (lk === "icons") cells.forEach((c) => { const n = c.querySelector(".sp-fn"), t = c.querySelector(".sp-fs, .sp-nl"); c.insertAdjacentHTML("afterbegin", '<div class="sp-ico">' + picto(n ? n.textContent : "", t ? t.textContent : "") + "</div>"); });
        if (lk === "repeat") b.insertAdjacentHTML("beforeend", wallHtml(cells.map((c) => c.querySelector(".sp-fn").textContent).join("   "), 5));
        b.appendChild(node);
        b.appendChild(el("div", "sp-bcap", esc(D.title(k)) + '<span class="y">' + esc(s.y) + "</span>" + lookRow()));
        return lk === "fill" ? knock(b, "#000", "#fff") : b;
      };
      /* the fill: the section a few glasses tall, a screen held still in
         it, the fill rising at its foot and a copy of the words in the
         fill's own ink shown only where the fill has reached */
      const knock = (sec, fill, ink) => {
        const scr = el("div", "sp-kscr");
        const a = el("div", "sp-kin"), inn = el("div", "sp-kinr");
        [...sec.childNodes].forEach((c) => inn.appendChild(c)); a.appendChild(inn);
        const f = el("div", "sp-kf"); f.style.background = fill;
        const bb = el("div", "sp-kin sp-kinv"); bb.setAttribute("aria-hidden", "true"); bb.style.color = ink;
        scr.appendChild(f); scr.appendChild(a); scr.appendChild(bb);
        /* the looks' row stays on top of both, readable on either ground */
        const lr = inn.querySelector(".sp-looks"); if (lr) { lr.classList.add("sp-klooks"); scr.appendChild(lr); }
        sec.appendChild(scr);
        P.knocks.push({ sec, a: inn, b: bb, ink });
        return sec;
      };
      const AIR = ["t", "r", "l"];

      /* the bar: the study's name once its title has scrolled away, and
         Close. Set in white with difference, so it reads on any picture */
      const bar = el("div", "sp-bar");
      const barIn = el("div", "sp-bar-in");
      barIn.appendChild(el("span", "sp-bar-t", esc(D.title(k)) + '<span class="sp-bar-s"></span>'));
      if (o.onClose) { const x = el("button", "sp-x", "Close"); x.type = "button"; x.addEventListener("click", () => o.onClose()); barIn.appendChild(x); }
      bar.appendChild(barIn); frag.appendChild(bar);

      /* the cover, as the live site opens a study (PressingCover and
         RisingPlate, their numbers kept): the room opens on its title as
         large as the column holds it, at the foot of a held glass. The
         reader's scroll takes its lines down out of their masks, the
         bottom one first, while the subtitle rises into its seat, its
         lower lines dragging a little; then the cover picture climbs
         over the held glass and grows to its edges */
      if (CH) {
        const cvw = el("section", "sp-cvw"), cvs = el("div", "sp-cvs");
        const h1 = el("h1", "sp-title sp-ct", esc(D.title(k))); h1.dataset.t = h1.textContent; cvs.appendChild(h1);
        let st = null;
        if (M.stand) st = tag(el("p", "sp-stand sp-cst", inkGrey(M.stand.text)), M.stand);
        else if (s.fact) st = el("p", "sp-stand sp-cst", esc(s.fact) + (s.rest ? ' <span class="sp-g">' + esc(s.rest) + "</span>" : ""));
        if (st) { st.dataset.h = st.innerHTML; cvs.appendChild(st); }
        cvw.appendChild(cvs); frag.appendChild(cvw);
        Object.assign(P, { title: h1, ctitle: h1, cstand: st, cvw, cvs });
      }
      const cv = el("figure", "sp-cover" + (CH ? " sp-riser" : ""));
      if (M.lead) {
        const lf = { src: M.lead.src, w: M.lead.w, h: M.lead.h, t384: M.lead.t384, t768: M.lead.t768, alt: s.t };
        const box = el("div", "sp-pic sp-cpic"); box._f = lf;
        if (M.dup) tag(box, M.dup);
        const side = el("div", "sp-cside"); cv.appendChild(side); P.coverSide = side;
        cv.appendChild(box); P.coverBox = box; P.coverFrame = cv; P.lead = lf;
        room.cover = box;
        /* a cover that plays (28 Sept, the DSC hero sizzle, public/lab/
           dsc-sizzle): the player mounts over the lead picture, so the
           tile still flies into this box and the first frame is the same
           picture. A rebuild stops it (P.stops) and this mounts it again */
        const live = window.SP_LIVE && window.SP_LIVE[k];
        if (live) { try { const off = live(box, cv, { still: !mo }); P.coverLive = true; if (typeof off === "function") P.stops.push(off); } catch (e) { /* the cover stays a picture */ } }
      }
      frag.appendChild(cv);

      /* who posted or wrote about the work (30 Sept 2026, his "i'd like to
         callout the projects that did get the shoutouts...for example this
         kitchen was posted by crate and barrel, rejuvination and written
         about by Haven and Vivir home...we need a banner"), then "what if
         they were smaller more footnotes vs this large?" and "it should
         probably animate in like the rest of the case study in style": a
         line under the cover, as a picture's credit sits, his own verbs in
         grey and the names in ink (features.js), coming in as the room's
         other lines do. ?press=band sets the band of ink it was first,
         ?press=ticker that band running */
      const FE = (window.DENSITY_FEATURES || {})[k];
      if (FE && FE.length) frag.appendChild(PRESS_MODE() === "note" ? pressNote(FE) : pressBand(FE));

      /* the title, the subtitle, and the quiet facts (held in the cover
         above when the room moves as the site does) */
      if (!CH) {
        const head = el("header", "sp-head");
        const h1 = el("h1", "sp-title", esc(D.title(k))); head.appendChild(h1); P.title = h1;
        if (M.stand) head.appendChild(tag(el("p", "sp-stand", inkGrey(M.stand.text)), M.stand));
        else if (s.fact) head.appendChild(el("p", "sp-stand", esc(s.fact) + (s.rest ? ' <span class="sp-g">' + esc(s.rest) + "</span>" : "")));
        frag.appendChild(head);
      }

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
        /* with the site's scroll a section's text stays together, its
           head held beside it (the brief below), and the pictures follow
           it, as the live site sets a brief and then its plates; without
           it, a picture moves into the middle of a long stretch of text */
        const blocks = CH && !sec.open ? asideUp(shape(sec.items, figs)) : spread(asideUp(shape(sec.items, figs)));
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
        const h2 = !(ink && firstText && firstText.f.text.length > ink.length && firstText.f.text.startsWith(ink)) ? tag(el("h2", "sp-h", inkGreyF(sec.head)), sec.head) : null;
        /* the brief (PressingBrief): with the site's scroll, the head and
           its deck are held in the left half while the section's first
           runs of text scroll past in the right, the column starting
           under the head. Two tracks only; narrow, it stacks */
        const d0 = blocks[0] && blocks[0].t === "deck" ? 1 : 0;
        let j = d0; while (j < blocks.length && (blocks[j].t === "run" || blocks[j].t === "cards")) j++;
        if (CH && h2 && j > d0) {
          const br = el("div", "sp-brief"), hd = el("div", "sp-bhd"), col = el("div", "sp-bcol");
          hd.appendChild(h2); if (d0) hd.appendChild(blockEl(blocks[0]));
          blocks.slice(d0, j).forEach((b) => col.appendChild(blockEl(b)));
          br.appendChild(hd); br.appendChild(col); se.appendChild(br);
          P.briefs.push({ hd, col });
          blocks.slice(j).forEach((b) => se.appendChild(blockEl(b)));
        } else {
          if (h2) se.appendChild(h2);
          blocks.forEach((b) => se.appendChild(blockEl(b)));
        }
        frag.appendChild(se);
      });

      /* the title block: the study under a hairline, its facts as a
         table, its services and stack as lists side by side, its palette
         as swatches with the hex under each */
      const spec = el("section", "sp-spec");
      spec.appendChild(el("div", "sp-spec-h sp-kk", esc(D.title(k)) + '<span class="y">' + esc(s.y) + "</span>"));
      if (M.facts.length) {
        const tb = el("dl", "sp-tb");
        M.facts.forEach((f) => { const r = el("div", "sp-tr"); r.appendChild(el("dt", null, esc(lbl(f.label)))); r.appendChild(el("dd", null, esc(f.value))); tb.appendChild(tag(r, f)); });
        spec.appendChild(tb);
      }
      const byLabel = new Map(); M.tools.forEach((f) => { if (!byLabel.has(f.label)) byLabel.set(f.label, []); byLabel.get(f.label).push(f); });
      if (byLabel.size) {
        const cols = el("div", "sp-tcols");
        byLabel.forEach((list, label) => {
          const c = el("div", "sp-tcol"); c.appendChild(el("div", "sp-caps", esc(lbl(label))));
          const ul = el("ul"); list.forEach((f) => ul.appendChild(tag(el("li", null, esc(f.value)), f)));
          c.appendChild(ul); cols.appendChild(c);
        });
        spec.appendChild(cols);
      }
      const pl = PAL();
      /* the palette opens the title block, under its rule and the study's
         name. It stood before the block at first, and so read as part of
         the closing section, its closing lines like a caption to the
         colours (his "what does this block of text align with? ... they
         sit inside of the closing section", 27 Sept) */
      if (M.palette && M.palette.colors && M.palette.colors.length && pl !== "swatch") spec.insertBefore(palSection(pl), spec.firstChild.nextSibling);
      if (M.palette && M.palette.colors && M.palette.colors.length && pl === "swatch") {
        const pal = el("div", "sp-pal"); pal.style.setProperty("--n", M.palette.colors.length);
        M.palette.colors.forEach((c) => {
          const sw = el("div", "sp-sw", '<i style="background:' + esc(c.hex) + '"></i><span>' + esc(String(c.hex).toUpperCase()) + "</span>" + (c.name ? "<span>" + esc(lbl(c.name)) + "</span>" : ""));
          pal.appendChild(sw);
        });
        const pw = el("div", "sp-palw"); if (M.palette.title) pw.appendChild(el("div", "sp-caps sp-palh", esc(lbl(M.palette.title)) + palRow())); pw.appendChild(tag(pal, M.palette));
        spec.appendChild(pw);
      }
      frag.appendChild(spec);

      /* the foot */
      const foot = el("footer", "sp-foot");
      if (o.next && o.next.k && D.study(o.next.k)) {
        const nk = o.next.k;
        const a = el("a", "sp-next"); a.href = D.href(nk);
        a.appendChild(el("span", "sp-caps", esc(lbl("Next"))));
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
      /* the palette as a moment of its own, before the title block */
      function palSection(pl) {
        const cols = M.palette.colors.map((c) => ({ hex: String(c.hex).toUpperCase(), name: c.name || "", rgb: hexRgb(c.hex), ink: D.ink(c.hex), L: lstar(c.hex) }));
        const n = cols.length;
        const seen = new Set();
        const pics = [M.lead].concat(D.byStudy(k).filter((f) => f.kind === "pic")).filter((f) => f && !f.alpha && f.src && !seen.has(f.src) && seen.add(f.src));
        const sec = el("section", "sp-palx lk-" + pl); sec.style.setProperty("--n", n);
        sec.appendChild(el("div", "sp-caps sp-palh", esc(lbl(M.palette.title || "Palette")) + palRow()));
        const rgbT = (c) => "RGB " + c.rgb.join(" ");
        const box = (f, cls) => { const b = el("div", "sp-pic " + cls); b._f = f; watch(b); return b; };
        const slots = []; /* pictures the pairing will choose: [box, colour index or -1 for the best] */
        const pic = (i, cls) => { if (!pics.length) return null; const b = box(pics[(i < 0 ? 0 : i + 1) % pics.length], cls); slots.push([b, i]); return b; };
        if (pl === "overlay") {
          const w = el("div", "sp-pov"); const b = pic(-1, "sp-povp"); if (b) w.appendChild(b);
          const st = el("div", "sp-povs");
          cols.forEach((c) => { const r = el("div", "sp-povb", "<b>" + c.hex + "</b><span>" + rgbT(c) + "</span>"); r.style.background = c.hex; r.style.color = c.ink; st.appendChild(r); });
          w.appendChild(st); sec.appendChild(w);
        } else if (pl === "paired") {
          const w = el("div", "sp-ppr");
          cols.forEach((c, i) => {
            const col = el("div", "sp-pc");
            const cc = el("div", "sp-pcc", "<span>" + rgbT(c) + "</span><b>" + c.hex + "</b>"); cc.style.background = c.hex; cc.style.color = c.ink; col.appendChild(cc);
            const b = pic(i, "sp-pcp"); if (b) col.appendChild(b);
            w.appendChild(col);
          });
          sec.appendChild(w);
        } else if (pl === "blocks") {
          const w = el("div", "sp-pbk n" + n);
          cols.forEach((c, i) => {
            const bk = el("div", "sp-pb", "<b>" + esc(c.name || c.hex) + '</b><span class="sp-pbm">' + lbl("HEX") + " " + c.hex.slice(1) + "<br>" + rgbT(c) + "</span>"); bk.style.background = c.hex; bk.style.color = c.ink;
            const b = pic(i, "sp-pbp"); if (b) bk.appendChild(b);
            w.appendChild(bk);
          });
          sec.appendChild(w);
        } else if (pl === "cycle") {
          const w = el("div", "sp-pcy");
          const prog = el("div", "sp-pcyp", cols.map(() => "<i></i>").join("")); w.appendChild(prog);
          const bs = cols.map((c, i) => pic(i, "sp-pcyi")).filter(Boolean); bs.forEach((b) => w.appendChild(b));
          const t = el("div", "sp-pcyt"); w.appendChild(t);
          let at = -1, tm = 0, vis = false;
          const show = (i) => {
            at = (i + n) % n; const c = cols[at];
            w.style.background = c.hex; w.style.color = c.ink;
            t.innerHTML = '<span class="sp-pcyn">' + two(at + 1) + " / " + two(n) + "</span><b>" + c.hex + "</b><span>" + rgbT(c) + "</span>";
            bs.forEach((b, j) => b.classList.toggle("on", j === at));
            [...prog.children].forEach((x, j) => x.classList.toggle("on", j <= at));
          };
          const run = () => { clearInterval(tm); tm = 0; if (vis && MOTION()) tm = setInterval(() => { if (dead || !w.isConnected) { clearInterval(tm); return; } show(at + 1); }, 2400); };
          w.addEventListener("click", () => { show(at + 1); run(); });
          if ("IntersectionObserver" in window) { const cio = new IntersectionObserver(([e]) => { vis = e.isIntersecting; run(); }, { root: container, threshold: 0.25 }); cio.observe(w); P.stops.push(() => { cio.disconnect(); clearInterval(tm); }); }
          show(0);
          sec.appendChild(w);
        } else {
          /* chart: bars by lightness, the darkest first */
          const order = cols.map((c, i) => i).sort((a, b) => cols[a].L - cols[b].L);
          const w = el("div", "sp-pch");
          const g = el("div", "sp-pchg");
          g.innerHTML = '<span class="sp-pchy" style="bottom:100%">100</span><span class="sp-pchy" style="bottom:50%">50</span><span class="sp-pchy" style="bottom:0">0</span>';
          order.forEach((i) => { const c = cols[i]; const b = el("i", "sp-pchb"); b.style.cssText = "height:" + Math.max(1, c.L).toFixed(1) + "%;background:" + c.hex; g.appendChild(b); });
          w.appendChild(g);
          w.appendChild(el("div", "sp-pchl", order.map((i) => "<span><b>" + cols[i].hex + "</b>L* " + Math.round(cols[i].L) + "</span>").join("")));
          w.appendChild(el("div", "sp-caps sp-pchk", "Lightness, L*, darkest first"));
          sec.appendChild(w);
        }
        /* the pairing, measured from the pictures; a box not yet loaded
           takes its measured picture */
        if (slots.length) matchPal(k, M.palette.colors, pics).then((m) => {
          if (dead) return;
          slots.forEach(([b, i]) => { const f = i < 0 ? m.best : m.per[i]; if (f && !b._loaded) b._f = f; });
        });
        return sec;
      }
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
      /* ── live pages (1 Oct 2026, his "can we use live pages?") ────────
         A page or a demo in a frame, laid out at its own width and scaled
         to the room (never above 1). It loads as it nears and stands down
         off screen. A page set to scroll walks itself down and back up; a
         demo plays on its own clock and is paused through its
         data-paused contract when hidden; a page set whole stands at its
         full height. The frame never takes the wheel, and a click opens
         the page itself in a new tab */
      function livesEl(b) {
        const wrap = el("div", "sp-lives" + (b.phone ? " phone" : "") + (b.fit ? " fit" : ""));
        const ls = b.list.map((f) => liveEl(f));
        ls.forEach((L) => wrap.appendChild(L.fig));
        P.lives.push({ wrap, phone: b.phone, fit: b.fit, ls });
        return wrap;
      }
      function liveEl(f) {
        const fig = tag(el("figure", "sp-live sp-live-" + (f.mode || "page") + (f.phone ? " phone" : "") + (f.tabs ? " tabbed" : "")), f);
        /* tabs (3 Oct 2026, his "one homepage section with a tab ... a user
           can tab or toggle through"): the pages share the frame, and a tab
           swaps the page in place; its title, its note and the open link
           follow it, and a page that walks itself starts again from the top */
        const tabs = f.tabs && f.tabs.length > 1 ? f.tabs : null;
        const T0 = tabs ? tabs[0] : f;
        let tabRow = null;
        if (tabs) {
          tabRow = el("div", "sp-tabs"); tabRow.setAttribute("role", "tablist"); tabRow.setAttribute("aria-label", f.title || "Pages");
          tabs.forEach((t, i) => { const b = el("button", "sp-tab", esc(t.label)); b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-selected", i ? "false" : "true"); b.tabIndex = i ? -1 : 0; tabRow.appendChild(b); });
          fig.appendChild(tabRow);
        }
        const stage = el("div", "sp-live-stage");
        const fr = document.createElement("iframe");
        fr.title = T0.title || f.title || "A live page"; fr.setAttribute("tabindex", "-1"); fr.setAttribute("aria-hidden", "true");
        if (f.mode === "fit") { fr.style.width = "100%"; fr.style.height = (f.h || 600) + "px"; }
        else { fr.style.width = f.w + "px"; fr.style.height = (f.h || 900) + "px"; }
        stage.appendChild(fr);
        /* a page that scrolls (3 Oct 2026, his "make the container it's in a
           lot taller and then when someone clicks into it they can scroll
           it"): a click hands the frame the scroll, and Done, Escape or
           scrolling the frame out of view hands it back. Opening the page in
           a new tab moves to the caption. Other frames still open on a click */
        const isScroll = f.mode === "scroll";
        const srcOf = (t) => (t.src || f.src).replace(/[?&]framed=1/, "");
        const open = el(isScroll ? "button" : "a", "sp-live-open");
        if (isScroll) {
          open.type = "button";
          open.setAttribute("aria-label", "Scroll " + (T0.title || f.title || "the page") + " inside the frame");
          open.innerHTML = '<span class="sp-live-hint">' + (matchMedia("(hover: none)").matches ? "Tap to scroll" : "Click to scroll") + "</span>";
        } else {
          open.href = srcOf(T0); open.target = "_blank"; open.rel = "noopener";
          open.setAttribute("aria-label", "Open " + (T0.title || f.title || "the page") + " in a new tab");
        }
        stage.appendChild(open);
        let done = null;
        if (isScroll) { done = el("button", "sp-live-done", "Done"); done.type = "button"; stage.appendChild(done); }
        fig.appendChild(stage);
        const capHtml = (t) => (t.title ? "<b>" + esc(t.title) + "</b>" : "") + (t.note ? " " + esc(t.note) : "") +
          (isScroll ? ' <a class="sp-live-ext" href="' + esc(srcOf(t)) + '" target="_blank" rel="noopener">Open the page</a>' : "");
        if (T0.title || T0.note || f.title || f.note) fig.appendChild(el("figcaption", "sp-cap sp-live-cap", capHtml(T0.title || T0.note ? T0 : f)));
        const L = { f, fig, stage, fr, s: 1, docH: 0, vis: false, loaded: false, raf: 0, y: 0, phase: 0, t: 0, last: 0, tab: 0, src: tabs ? T0.src : f.src, walkOff: false };
        const engage = () => {
          if (fig.classList.contains("on")) return;
          fig.classList.add("on"); L.walkOff = true; cancelAnimationFrame(L.raf); L.raf = 0;
          fr.removeAttribute("aria-hidden"); fr.setAttribute("tabindex", "0");
          try { fr.focus(); } catch (e) { /* not yet */ }
        };
        const disengage = () => {
          if (!fig.classList.contains("on")) return;
          fig.classList.remove("on"); fr.setAttribute("aria-hidden", "true"); fr.setAttribute("tabindex", "-1");
        };
        if (isScroll) {
          open.addEventListener("click", engage);
          done.addEventListener("click", (e) => { e.stopPropagation(); disengage(); open.focus(); });
        }
        if (tabs) {
          const btns = [...tabRow.children];
          const pick = (i, focus) => {
            const t = tabs[i]; if (!t || L.tab === i) return;
            L.tab = i; L.src = t.src;
            btns.forEach((b, j) => { b.setAttribute("aria-selected", j === i ? "true" : "false"); b.tabIndex = j === i ? 0 : -1; });
            if (focus) btns[i].focus();
            if (isScroll) { open.setAttribute("aria-label", "Scroll " + (t.title || t.label) + " inside the frame"); disengage(); L.walkOff = false; }
            else { open.href = srcOf(t); open.setAttribute("aria-label", "Open " + (t.title || t.label) + " in a new tab"); }
            fr.title = t.title || t.label;
            const cap = fig.querySelector(".sp-live-cap"); if (cap) cap.innerHTML = capHtml(t);
            cancelAnimationFrame(L.raf); L.raf = 0; L.y = 0; L.phase = 0; L.t = 0; L.last = 0; L.docH = 0;
            if (L.loaded) fr.src = t.src;
          };
          btns.forEach((b, i) => b.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); pick(i); }));
          tabRow.addEventListener("keydown", (e) => {
            const n = btns.length;
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); pick((L.tab + (e.key === "ArrowRight" ? 1 : n - 1)) % n, true); }
            else if (e.key === "Home") { e.preventDefault(); pick(0, true); }
            else if (e.key === "End") { e.preventDefault(); pick(n - 1, true); }
          });
        }
        L.size = () => liveSize(L); /* the layout calls it from outside the build */
        const near = new IntersectionObserver(([e]) => {
          if (!e.isIntersecting || L.loaded) return;
          L.loaded = true; fr.src = L.src; near.disconnect();
        }, { root: container, rootMargin: "900px 0px" });
        const seen = new IntersectionObserver(([e]) => { L.vis = e.isIntersecting; if (!L.vis) disengage(); liveRun(L); }, { root: container, threshold: 0 });
        near.observe(fig); seen.observe(fig);
        fr.addEventListener("load", () => {
          liveMeasure(L); setTimeout(() => liveMeasure(L), 1400); liveRun(L);
          /* inside an entered page: Escape hands the scroll back, and a link
             that goes nowhere ("#") no longer jumps the page to its top */
          if (isScroll) {
            try {
              const d = fr.contentDocument;
              d.addEventListener("keydown", (e) => { if (e.key === "Escape") { disengage(); open.focus(); } });
              d.addEventListener("click", (e) => { const a = e.target.closest && e.target.closest('a[href="#"]'); if (a) e.preventDefault(); });
            } catch (e) { /* another origin */ }
          }
          /* a module for the column reflows with the room, so its height is
             measured again whenever its fonts land or its window resizes */
          if (f.mode === "fit") {
            try {
              const w = fr.contentWindow;
              w.addEventListener("resize", () => liveMeasure(L));
              if (w.document.fonts) w.document.fonts.ready.then(() => liveMeasure(L));
              setTimeout(() => liveMeasure(L), 400);
            } catch (e) { /* another origin: its declared height holds */ }
          }
        });
        P.stops.push(() => { near.disconnect(); seen.disconnect(); cancelAnimationFrame(L.raf); try { fr.src = "about:blank"; } catch (e) { /* gone */ } });
        return L;
      }
      /* the frame's size: the page's own width scaled to the stage, the
         height its viewport (a page that scrolls) or its measured document */
      function liveSize(L) {
        const sw = L.stage.clientWidth; if (!sw) return;
        if (L.f.mode === "fit") {
          /* the column's own width, the page's own height: it reads as part of the room */
          L.s = 1; L.fr.style.width = sw + "px"; L.fr.style.transform = "none";
          let d = null; try { d = L.fr.contentDocument; } catch (e) { /* another origin */ }
          const mh = d && d.body ? Math.ceil(d.body.getBoundingClientRect().height) : 0;
          const h = mh || L.docH || L.f.h || 600;
          L.fr.style.height = h + "px"; L.stage.style.height = h + "px";
          return;
        }
        if (L.f.mode === "scroll") {
          /* most of the glass (3 Oct 2026, his "make the container it's in a
             lot taller"): about 86% of the room's height, a phone frame 90%,
             never less than its declared view. A homepage built for every
             width (1000px and up) shows its own phone layout in a narrow
             room, at its true size, instead of a desktop shrunk to a quarter */
          const V = container.clientHeight || window.innerHeight;
          let pw = L.f.w; L.s = Math.min(1, sw / pw);
          const fluid = pw >= 1000 && sw < 600;
          if (fluid) { pw = sw; L.s = 1; }
          const want = Math.round(V * (L.f.phone ? 0.9 : 0.86));
          const vh = fluid ? want : Math.max(L.f.h || 900, Math.round(want / L.s));
          L.vh = vh;
          L.fr.style.width = pw + "px"; L.fr.style.height = vh + "px";
          L.fr.style.transform = L.s === 1 ? "none" : "scale(" + L.s.toFixed(5) + ")";
          L.stage.style.height = Math.round(vh * L.s) + "px";
          return;
        }
        L.s = Math.min(1, sw / L.f.w);
        const h = L.docH || L.f.h || 900;
        L.fr.style.height = h + "px";
        L.fr.style.transform = "scale(" + L.s.toFixed(5) + ")";
        L.stage.style.height = Math.round(h * L.s) + "px";
      }
      function liveMeasure(L) {
        let d = null; try { d = L.fr.contentDocument; } catch (e) { /* another origin: the declared height holds */ }
        if (d && d.body && L.f.mode !== "scroll") L.docH = L.f.mode === "demo" ? d.body.scrollHeight : d.documentElement.scrollHeight;
        liveSize(L);
      }
      /* a demo's host, the element its replay engine reads data-paused on */
      function liveHost(L) {
        let d = null; try { d = L.fr.contentDocument; } catch (e) { return null; }
        if (!d || !d.body) return null;
        const inner = d.querySelector("[data-stage]");
        return (inner && inner.closest("body > *")) || d.body.firstElementChild;
      }
      const liveReduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
      function liveRun(L) {
        const on = L.vis && !document.hidden;
        if (L.f.mode === "demo") { const h = liveHost(L); if (h) { if (on) delete h.dataset.paused; else h.dataset.paused = "true"; } return; }
        if (L.f.mode === "fit") {
          let d = null; try { d = L.fr.contentDocument; } catch (e) { return; }
          if (d && d.documentElement) { if (on && !liveReduce()) delete d.documentElement.dataset.paused; else d.documentElement.dataset.paused = "true"; }
          return;
        }
        cancelAnimationFrame(L.raf); L.raf = 0;
        if (L.f.mode !== "scroll" || !on || !L.loaded || liveReduce() || L.walkOff) return;
        L.last = 0; L.raf = requestAnimationFrame((t) => liveTick(L, t));
      }
      /* a page walks itself down at 160px a second, holds, eases back up, holds */
      function liveTick(L, now) {
        let w = null, d = null; try { w = L.fr.contentWindow; d = w && w.document; } catch (e) { return; }
        if (!d || !d.documentElement) { L.raf = requestAnimationFrame((t) => liveTick(L, t)); return; }
        const dt = L.last ? Math.min(64, now - L.last) : 0; L.last = now; L.t += dt;
        const max = Math.max(0, d.documentElement.scrollHeight - (w.innerHeight || L.vh || L.f.h || 900)), HOLD = 1800;
        if (L.phase === 0) { if (L.t >= HOLD) { L.phase = 1; L.t = 0; } }
        else if (L.phase === 1) { L.y = Math.min(max, L.y + 0.16 * dt); if (L.y >= max) { L.phase = 2; L.t = 0; } }
        else if (L.phase === 2) { if (L.t >= HOLD) { L.phase = 3; L.t = 0; L.from = L.y; } }
        else { const k = Math.min(1, L.t / 1400); L.y = L.from * Math.pow(1 - k, 3); if (k >= 1) { L.phase = 0; L.t = 0; L.y = 0; } }
        try { w.scrollTo({ top: L.y, behavior: "instant" }); } catch (e) { w.scrollTo(0, L.y); }
        L.raf = requestAnimationFrame((t) => liveTick(L, t));
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
          /* a solo picture keeps one side, the copy's left margin, so a run
             of them stacks in line instead of alternating (his "yea line
             them up stacked vs alternating"); it takes no turn from the rest */
          const air = ps.length === 1 && solo(ps[0]) ? "l" : AIR[airSide++ % AIR.length];
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
          case "lives": return livesEl(b);
          case "link": {
            /* another study, opened in place as the foot's Next is (2 Oct 2026,
               his "we could maybe link each case study to each other") */
            const to = b.f.to;
            if (!D.study(to)) return el("div");
            const a = tag(el("a", "sp-xlink"), b.f); a.href = D.href(to);
            a.appendChild(el("span", "sp-caps", esc(lbl(b.f.label || "See also"))));
            a.appendChild(el("span", "sp-xlink-t", esc(D.title(to))));
            if (b.f.note) a.appendChild(el("span", "sp-xlink-n", esc(b.f.note)));
            const xc = cover(to);
            if (xc) { const xb = picBox({ src: xc.src, w: xc.w, h: xc.h, t384: xc.t384, t768: xc.t768, alt: "" }, "sp-xlink-pic"); a.appendChild(xb); watch(xb); }
            a.addEventListener("click", (ev) => {
              if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button) return;
              if (!o.onNext) return;
              ev.preventDefault(); o.onNext(to);
            });
            return a;
          }
          /* a deck that is one short line is set as a bold beat of its own */
          case "deck": return tag(el("p", "sp-deck" + (b.f.text.length <= 52 && b.f.text.indexOf(" | ") < 0 ? " sp-short" : ""), inkGrey(b.f.text)), b.f);
          case "pull": {
            const first = pulled++ === 0;
            const lk = first ? LOOK() : null;
            const onFill = lk === "field" || lk === "takeover" || lk === "repeat" || lk === "combo";
            const q = el("blockquote", "sp-pull" + (onFill ? " sp-field" : "") + (first ? " sp-brk sp-brk-q lk-" + lk : ""));
            const qf = quoteFill(k, s);
            if (first) { q.style.setProperty("--fill", qf); q.style.setProperty("--fink", QUOTE_FILL[k] ? D.ink(qf) : s.ink || D.ink(qf)); }
            if (lk === "repeat") q.insertAdjacentHTML("beforeend", wallHtml(halves(b.f.text)[0], 6));
            if (lk === "icons" || lk === "combo") q.insertAdjacentHTML("beforeend", '<div class="sp-ico sp-qmark" aria-hidden="true"><svg viewBox="0 0 120 92" width="120" height="92"><path d="M0 92V56C0 22 16 4 48 0l5 13C35 18 27 29 26 46h24v46H0Zm70 0V56C70 22 86 4 118 0l5 13c-18 5-26 16-27 33h24v46H70Z"/></svg></div>');
            if (lk === "air") q.insertAdjacentHTML("beforeend", '<i class="sp-dot" aria-hidden="true"></i>');
            const t = el("p", "sp-pq", inkGrey(b.f.text)); q.appendChild(t); P.pulls.push(t);
            if (first) q.appendChild(el("div", "sp-fcap", esc(D.title(k)) + '<span class="y">' + esc(s.y) + "</span>" + lookRow()));
            tag(q, b.f);
            return lk === "fill" ? knock(q, qf, QUOTE_FILL[k] ? D.ink(qf) : s.ink || D.ink(qf)) : q;
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
              c.appendChild(el("p", "sp-nl", esc(lbl(f.label))));
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
            c.appendChild(el("div", "sp-caps", esc(lbl(f.title))));
            const n = el("div", "sp-fn", esc(f.callout) + (f.suffix ? ' <span class="sp-g">' + esc(f.suffix) + "</span>" : ""));
            c.appendChild(n); P.figs.push({ n, cell: c, group: c });
            f.bars.forEach((x) => c.appendChild(el("div", "sp-bar2", '<span>' + esc(x.label) + '</span><span>' + esc(x.value) + '</span><i style="width:' + Math.max(1, x.width) + '%"></i>')));
            return tag(c, f);
          }
          case "steps": {
            const f = b.f; const c = el("div", "sp-steps");
            c.appendChild(el("div", "sp-caps", esc(lbl(f.title))));
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
      /* Wf, the widest a picture runs: from the room's left edge to 20px
         short of the window's right one on a desk (1 Oct 2026, his "keep
         the text as-is for case studies but let's bring the images in to
         the 20", after the index took 20px margins). The copy keeps m; the
         colour fields still run to the edge; a phone still bleeds */
      const Wf = W >= 560 ? W - 20 : W;
      root.style.setProperty("--m", m + "px");
      /* the solid blocks stop where the pictures do: the 20px a picture
         stops short by on a desk, nothing on a phone, where both bleed
         (2 Oct 2026, his "it runs off the side to the right edge when we
         put padding on the case studies", on the black and colour
         blocks, which had been left running to the edge) */
      root.style.setProperty("--rm", (W - Wf) + "px");
      root.style.setProperty("--vh", V + "px");

      /* the cover: edge to edge if the lead can honestly fill it, cropped
         to nine tenths of the glass if it is taller (it was 0.62, so the
         title showed on arrival; he asked for more of the picture); else
         at its own honest size, with air. A cover that plays (a sizzle on
         SP_LIVE) always runs edge to edge: the player lays itself out to
         its box, so the lead's pixels no longer set its size (2 Oct 2026,
         his "on a large screen those sizzle didnt fill the entire right
         column"; DSC's lead is 1536px, honest only to 768) */
      if (parts.coverBox) {
        const f = parts.lead, r = ratio(f), hon = parts.coverLive ? Infinity : f.w / 2, capH = Math.max(260, Math.round(V * 0.9));
        const box = parts.coverBox, frame = parts.coverFrame;
        let side = false;
        if (hon >= Wf - 0.5) {
          frame.classList.remove("small");
          box.style.width = Wf + "px"; box.style.height = Math.round(Math.min(Wf / r, capH)) + "px";
        } else {
          frame.classList.add("small");
          let w = Math.min(hon, C), h = w / r;
          if (h > capH) { h = capH; w = h * r; }
          box.style.width = Math.round(w) + "px"; box.style.height = Math.round(h) + "px";
          /* a small cover leaves a hole beside it. When the hole is wide
             enough, the cover sets to the right and the kicker (the
             discipline, the year, the lines) moves into the hole at its
             foot, the way a magazine opener sets its standfirst */
          side = !CH && W >= 560 && C - w >= 200;
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
        /* a mark's square is flat colour, so only the glass limits it */
        const Hc = Math.min(Math.min(...R.ps.map((f) => (markOf(f) ? Infinity : f.h / 2))), R.ps.every(full) ? Infinity : V * 0.84);
        const maxW = Hc * sum + g * (n - 1);
        let w, ml;
        if (maxW >= Wf - 0.5) { w = Wf; ml = 0; }
        else if (maxW > C) { w = maxW; ml = Math.min((W - w) / 2, Wf - w); }
        else {
          w = maxW;
          if (R.air === "t" && wide) ml = w <= tw + 0.5 ? tx : W - m - w;
          else ml = R.air === "r" ? W - m - w : m;
        }
        R.row.classList.toggle("bleed", w >= Wf - 0.5);
        R.row.style.width = Math.floor(w) + "px"; R.row.style.marginLeft = Math.round(ml) + "px";
        /* a lone picture across the room drifts, when a tenth more of it
           is still honest */
        const pb = R.row.firstElementChild;
        if (pb) pb.classList.toggle("par", mo && n === 1 && w >= Wf - 0.5 && R.ps[0].w / 2 >= 1.1 * w && !pb._still && !full(R.ps[0]));
        /* a pair or more, as the live site's plates pair: each a tenth
           taller and the neighbours drifting against each other, where a
           tenth more is still honest */
        const rowH = (Math.floor(w) - g * (n - 1)) / sum;
        [...R.row.children].forEach((b, i) => { b.classList.toggle("par2", CH && n > 1 && R.ps[i].h / 2 >= 1.1 * rowH && !b._still); b.classList.toggle("odd", i % 2 === 1); });
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
      /* live frames run as wide as the pictures do; a row of phones and
         emails starts at the copy's margin */
      parts.lives.forEach((Lv) => {
        const inset = Lv.phone || Lv.fit;
        Lv.wrap.style.width = Math.floor(inset ? Wf - m : Wf) + "px";
        Lv.wrap.style.marginLeft = (inset ? m : 0) + "px";
        Lv.ls.forEach((L) => {
          L.size();
          /* a caption keeps to the copy's margin, as a picture's does */
          const c = L.fig.querySelector(".sp-live-cap");
          if (c) { c.style.marginLeft = (inset ? 0 : m) + "px"; c.style.maxWidth = (Lv.phone ? "" : Math.max(240, Math.min(C, 640)) + "px"); }
        });
      });
      parts.asides.forEach((A) => {
        const f = A.f, pw = Math.floor(Math.min(f.w / 2, (C - gc) / 2, V * 0.8 * ratio(f)));
        A.a.style.setProperty("--pw", pw + "px");
      });
      /* keep what is already loaded asking for the right rung */
      root.querySelectorAll(".sp-pic img").forEach((im) => { const w = im.parentNode.offsetWidth; if (w) im.sizes = w + "px"; });

      fitType(W);
      if (parts.cvw) coverLay(W);
      parts.briefs.forEach(({ hd, col }) => {
        col.style.marginTop = "";
        if (W < 560) return;
        col.style.marginTop = "0px";
        col.style.marginTop = Math.round(hd.offsetHeight + 34) + "px";
      });
      /* the fill's copy of the words, made once they are sized */
      parts.knocks.forEach((K) => {
        const c = K.a.cloneNode(true);
        c.querySelectorAll("[data-f]").forEach((x) => x.removeAttribute("data-f"));
        c.querySelectorAll(".sp-looks").forEach((x) => x.remove());
        K.b.replaceChildren(c);
      });
      if (mo) drift();
      if (mo) { scrubList(); scrub(); }
      knockTick();
      if (CH) choreo();
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
    const fitBox = (node, hi, maxH) => {
      let lo = 22, best = lo;
      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2; node.style.fontSize = mid + "px";
        if (node.scrollWidth <= node.clientWidth + 1 && node.offsetHeight <= maxH) { best = mid; lo = mid; } else hi = mid;
      }
      node.style.fontSize = Math.floor(best) + "px";
    };
    const fitType = (W) => {
      /* the title: big, but under the cover, never over it in weight */
      if (parts.title && !parts.ctitle) {
        const t = parts.title, len = t.textContent.length;
        /* as large as 118px, his size from the tweaks panel in a 572px
           room, and scaled with the room from there; a long title steps
           down until no word breaks the line (27 Sept) */
        fitLines(t, Math.max(34, W * 0.07), Math.min(118, W * 0.206), len > 26 ? 4 : 3);
      }
      parts.pulls.forEach((q) => {
        const len = q.textContent.length, lk = q.closest(".sp-brk") ? LOOK() : null;
        /* air sets its quote small, by the CSS alone */
        if (lk === "air") { q.style.fontSize = ""; return; }
        /* takeover: as large as the words will go in most of a glass */
        if (lk === "takeover") { fitBox(q, Math.max(22, W * 0.3), (container.clientHeight || 800) * 0.62); return; }
        /* 36px at his 572px room, from the tweaks panel (27 Sept) */
        if (lk === "pull" || lk === "combo") { fitLines(q, 22, Math.min(36, W * 0.063), 6); return; }
        fitLines(q, 22, Math.min(36, W * 0.063), 6);
      });
      /* figures: one line each, as large as their cell allows, at three
         scales: the black field loudest, a band on paper next, a figure
         inside the text column quietest */
      parts.figs.forEach(({ n }) => {
        /* the break section's looks: takeover to the edges, air small,
           a pulled figure a size under the field's */
        const brk = n.closest(".sp-brk");
        const cap = brk && brk.classList.contains("lk-takeover") ? W * 2 : brk && brk.classList.contains("lk-air") ? Math.min(64, W * 0.09)
          : brk && (brk.classList.contains("lk-pull") || brk.classList.contains("lk-combo") || brk.classList.contains("lk-icons")) ? Math.min(150, W * 0.19)
          : n.closest(".sp-black, .lk-fill") ? Math.min(300, W * 0.36) : n.closest(".sp-band, .sp-numg, .sp-chart") ? Math.min(210, W * 0.24) : Math.min(96, W * 0.125);
        n.style.fontSize = "100px"; n.style.whiteSpace = "nowrap";
        /* takeover sets each word on a line of its own, the widest word
           to the edges. It measures the words themselves: the box's
           scrollWidth, which the others read, is never less than the box,
           so a short figure there never grows past about 100px */
        if (brk && brk.classList.contains("lk-takeover")) {
          n.style.whiteSpace = "normal";
          const pr = document.createElement("span"); pr.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap"; n.appendChild(pr);
          let wid = 1; n.textContent.trim().split(/\s+/).forEach((w) => { pr.textContent = w; wid = Math.max(wid, pr.offsetWidth); }); pr.remove();
          n.style.fontSize = Math.floor(((n.parentNode.clientWidth || W) / wid) * 100 * 0.97) + "px";
          return;
        }
        /* a pulled figure keeps to its own column */
        const avail = (brk && (brk.classList.contains("lk-pull") || brk.classList.contains("lk-combo")) ? n.clientWidth : n.parentNode.clientWidth) || W; const w100 = n.scrollWidth || 1;
        n.style.fontSize = Math.floor(Math.max(28, Math.min(cap, (avail / w100) * 100 * 0.985))) + "px";
      });
      /* figures in a set share a size; a band leads with its first figure
         alone, larger, across the page */
      const groups = new Map();
      parts.figs.forEach((x) => {
        const gr = x.group; if (!gr.classList.contains("sp-numg") && !gr.classList.contains("sp-band") && !gr.classList.contains("sp-figs")) return;
        if (gr.closest(".lk-takeover")) return;
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

    /* a new look for the break sections: the room is set again where the
       reader is, as a new width sets it */
    const relook = () => {
      if (dead) return;
      const anchor = firstInView();
      if (io) io.disconnect();
      build(); startIO(); layout(); watchTitle(); markAgain();
      if (anchor) { const e2 = find(anchor.id); if (e2) setScroll(container.scrollTop + e2.getBoundingClientRect().top - container.getBoundingClientRect().top - anchor.off); }
      armReveals(true);
    };
    ROOMS.add(relook);
    root.addEventListener("click", (ev) => {
      const b = ev.target.closest(".sp-looks [data-look], .sp-looks [data-pal]"); if (!b) return;
      ev.preventDefault(); ev.stopPropagation();
      if (b.dataset.pal) setPal(b.dataset.pal); else setLook(b.dataset.look);
    });
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
      dead = true; ROOMS.delete(relook);
      container.removeEventListener("scroll", onChoreo); cancelAnimationFrame(chT);
      if (parts && parts.stops) parts.stops.forEach((f) => f());
      container.removeEventListener("scroll", onKnock); cancelAnimationFrame(knT);
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

  window.StudyPanel = { render, cover, setLook, looks: LOOKS, setPal, pals: PALS, label: lbl };
})();
