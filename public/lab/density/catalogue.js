/* ── THE CATALOGUE: building the sheet from the fragments (26 Sept 2026)
   See the comment at the top of catalogue.html for the why. This file
   only arranges what fragments.js carries: it never writes a sentence.
   The one change it makes to his words is the em dash, which the house
   never sets: between figures it becomes an en dash, elsewhere a comma. */
(() => {
  const D = window.D; const DATA = D.data;
  const el = D.el;
  const clean = (s) => String(s == null ? "" : s).replace(/(\d)\s*\u2014\s*(\d)/g, "$1\u2013$2").replace(/\s*\u2014\s*/g, ", ");
  const esc = (s) => D.esc(clean(s));
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const p3 = (n) => String(n).padStart(3, "0");
  const p2 = (n) => String(n).padStart(2, "0");

  /* ── the catalogue: numbered by year, oldest first, like a label's
     releases; the sheet shows it newest first ── */
  const ORDER = DATA.studies.map((s, i) => [s, i]).sort((a, b) => (a[0].y - b[0].y) || (a[1] - b[1])).map((x) => x[0]);
  const lead = (pics) => {
    let best = null; let bs = -1e9;
    pics.forEach((p, j) => {
      let sc = (p.alpha ? 0 : 3) + (p.w >= p.h * 1.15 ? 1.6 : 0) + Math.min(2, D.maxCss(p) / 700) - j * 0.06;
      if (sc > bs) { bs = sc; best = p; }
    });
    return best;
  };
  const build = (s, n) => {
    const fr = D.byStudy(s.k); const no = "RH" + p3(n);
    const pics = fr.filter((f) => f.kind === "pic");
    pics.forEach((p, j) => { p._no = no + "." + p2(j + 1); p._j = j; });
    const fact = {}; fr.filter((f) => f.kind === "fact").forEach((f) => { if (!(f.label in fact)) fact[f.label] = f.value; });
    const tracks = []; let cur = null;
    fr.forEach((f) => {
      if (f.kind === "line" && f.where === "section-header") {
        const m = /SECTION\s*(\d+)\s*:?\s*(.*)$/i.exec(f.label || "");
        cur = { n: m ? p2(m[1]) : p2(tracks.length + 2), name: m ? m[2] : "", text: f.text, subs: [], pics: [] };
        tracks.push(cur);
      } else if (cur && f.kind === "line" && f.weight === "head") cur.subs.push(f.text);
      else if (cur && f.kind === "pic") cur.pics.push(f);
    });
    return {
      k: s.k, s, n, no, pics, fact, tracks, lead: lead(pics),
      abs: fr.filter((f) => f.kind === "line" && f.where === "abstract").map((f) => f.text),
      display: fr.filter((f) => f.kind === "line" && f.weight === "display").map((f) => f.text),
      closing: fr.filter((f) => f.kind === "line" && f.where === "closing").map((f) => f.text),
      nums: fr.filter((f) => f.kind === "num"), tools: fr.filter((f) => f.kind === "tool"),
      chart: fr.find((f) => f.kind === "chart"), steps: fr.find((f) => f.kind === "steps"),
      lines: fr.filter((f) => f.kind === "line").length,
      title: D.title(s.k), href: D.href(s.k), year: clean(fact.Published || s.y),
    };
  };
  const M = ORDER.map((s, i) => build(s, i + 1));
  const BYK = {}; M.forEach((m) => { BYK[m.k] = m; });
  const SHOWN = M.slice().reverse();
  const PIC = {}; M.forEach((m) => m.pics.forEach((p) => { PIC[p.id] = p; }));
  const YEARS = [Math.min(...M.map((m) => m.s.y)), Math.max(...M.map((m) => m.s.y))];

  /* ── glass: the column count comes from the width, so a new study is a
     new column and a phone gets two ── */
  const G = { vw: 0, vh: 0, mg: 32, W: 0, cols: 8, gut: 16, U: 16, ug: 16, uw: 0, per: 8 };
  const measure = () => {
    const vw = document.documentElement.clientWidth; const vh = window.innerHeight;
    G.vw = vw; G.vh = vh; G.mg = vw < 700 ? 16 : 32; G.gut = vw < 700 ? 12 : 16; G.W = vw - 2 * G.mg;
    G.cols = Math.max(2, Math.min(10, Math.floor((G.W + G.gut) / (158 + G.gut))));
    G.per = G.cols >= 6 ? G.cols : G.cols * Math.round(8 / G.cols);
    G.U = G.W >= 1000 ? 16 : G.W >= 640 ? 12 : 6; G.ug = G.W >= 640 ? 16 : 10;
    G.uw = (G.W - (G.U - 1) * G.ug) / G.U;
    const r = document.documentElement.style;
    r.setProperty("--cols", G.cols); r.setProperty("--u", G.U); r.setProperty("--ug", G.ug + "px");
  };
  const span = (n) => n * G.uw + (n - 1) * G.ug;

  /* a picture in a box that is always the picture's own shape, never
     wider than half its pixels */
  const fit = (p, maxW, maxH) => {
    let w = Math.min(maxW, D.maxCss(p), maxH ? (maxH * p.w) / p.h : 1e9);
    w = Math.max(1, Math.floor(w));
    return { w, h: Math.round((w * p.h) / p.w) };
  };
  const fadeIn = (im) => { const on = () => im.classList.add("in"); if (im.complete && im.naturalWidth) on(); else im.addEventListener("load", on, { once: true }); };
  /* a small square crop (sleeve, strip): ask for enough pixels to cover */
  const cover = (p, box) => { const im = D.img(p, p.alpha ? box : Math.ceil(box * Math.max(1, p.w / p.h, p.h / p.w))); im.alt = clean(p.alt); im.dataset.t = encodeURI(p.t384 || p.src); fadeIn(im); return im; };

  /* ── masthead ── */
  const mast = () => {
    const first = M[0].no; const last = M[M.length - 1].no;
    $("#m-range").textContent = first + "\u2013" + last;
    $("#m-years").textContent = YEARS[0] + "\u2013" + YEARS[1];
    $("#m-ink").textContent = clean(DATA.statement.ink);
    $("#m-grey").textContent = clean(DATA.statement.grey);
    const im = $("#m-imprint");
    im.innerHTML = '<div class="pr">' + DATA.practice.map((t) => "<p>" + esc(t) + "</p>").join("") + "</div>" +
      '<div class="ct"><span class="m">Contact</span>' + DATA.links.map((l) => '<a href="' + esc(l.v) + '">' + esc(l.k) + "</a>").join("") + "</div>";
    const bar = $("#bar"); bar.innerHTML = "";
    SHOWN.forEach((m) => {
      const b = el("button", "pal"); b.dataset.go = m.k; b.title = m.no + " " + clean(m.title);
      b.innerHTML = '<span class="chips">' + m.s.palette.map((h) => '<i style="background:' + h + '"></i>').join("") + '</span><span class="no m">' + m.no + "</span>";
      b.addEventListener("mouseenter", () => { say(m); }); b.addEventListener("mouseleave", () => say(null));
      bar.appendChild(b);
    });
    const ls = $("#m-lines"); ls.innerHTML = "";
    const ab = DATA.about[0];
    if (ab) ls.appendChild(el("div", "ab", '<span class="m" style="color:var(--grey)">' + esc(ab.name) + "</span><b>" + esc(ab.lede) + "</b>"));
    Object.values(D.lines).forEach((l) => {
      const inLine = SHOWN.filter((m) => m.s.tags.includes(l.tag));
      const d = el("div", "ln"); d.style.setProperty("--c", l.color);
      d.innerHTML = "<h2><i></i>" + esc(l.name) + "</h2><p>" + esc(l.sentence) + '</p><div class="nos m">' +
        inLine.map((m) => '<button data-go="' + m.k + '">' + m.no + "</button>").join("") + "</div>";
      d.addEventListener("mouseenter", () => dim(inLine.map((m) => m.k)));
      d.addEventListener("mouseleave", () => dim(null));
      ls.appendChild(d);
    });
  };

  /* ── an entry on the sheet ── */
  const SPEC = ["Status", "Classification", "Built", "Scope", "Stack", "Tools", "Materials", "Ships", "Try it", "Shot", "Subject", "Later", "Angle"];
  let WIDE = 1e9;
  const entry = (m) => {
    const a = el("article", "ent"); a.dataset.k = m.k; a.id = m.no.toLowerCase();
    a.style.setProperty("--f", m.s.fill);
    let h = '<div class="nr"><button class="no" data-go="' + m.k + '">' + m.no + '</button><span class="yr">' + esc(m.year) + "</span></div>";
    h += '<div class="body"><div class="sleeve"><button class="th" aria-label="' + esc(m.no) + '"></button><div class="pal">' +
      m.s.palette.map((x) => '<i style="background:' + x + ";color:" + D.ink(x) + '">' + x.toUpperCase() + "</i>").join("") + "</div></div>";
    h += '<h3><a href="' + m.href + '">' + esc(m.title) + '</a></h3><p class="ss">' + esc(m.s.s) + "</p>";
    /* Classification is the comma-set version of the study's Field, and
       the shorter of the two names fits the column */
    const rows = SPEC.filter((k) => m.fact[k]).map((k) => "<dt>" + (k === "Classification" ? "Field" : esc(k)) + "</dt><dd>" + esc(m.fact[k]) + "</dd>");
    if (rows.length) h += '<dl class="spec">' + rows.join("") + "</dl>";
    if (m.abs.length) h += '<p class="abs"><b>' + esc(m.abs[0]) + "</b> " + m.abs.slice(1, 4).map(esc).join(" ") + "</p>";
    if (m.nums.length) {
      h += '<div class="sec figs-w"><span class="m">Figures</span><div class="figs">' +
        m.nums.map((f) => "<b>" + esc(f.value) + "</b><span>" + esc(f.label.charAt(0) + f.label.slice(1).toLowerCase()) + (f.sub ? " <em>" + esc(f.sub) + "</em>" : "") + "</span>").join("") + "</div></div>";
    }
    if (m.chart) {
      const c = m.chart;
      h += '<div class="sec chart"><span class="m">' + esc(c.title) + "</span>" +
        c.bars.map((b) => '<div class="row"><span>' + esc(b.label) + "<b>" + esc(b.value) + '</b></span><i style="width:' + Math.max(2, Math.min(100, +b.width || 0)) + '%"></i></div>').join("") +
        (c.callout ? '<div class="call"><b>' + esc(c.callout) + "</b> " + esc(c.suffix || "") + "</div>" : "") + "</div>";
    }
    if (m.steps) {
      const st = m.steps;
      h += '<div class="sec steps"><span class="m">' + esc(st.title) + '</span><div class="dur">' + esc(st.duration || "") + '</div><div class="seg">' +
        st.steps.map(() => "<i></i>").join("") + "</div><ol>" + st.steps.map((x) => "<li><span>" + esc(x.title) + "</span><em>" + esc(x.note || "") + "</em></li>").join("") + "</ol></div>";
    }
    if (m.tracks.length) {
      h += '<div class="sec tr"><span class="m">Sections</span><ol class="trk">' + m.tracks.map((t) => {
        const pr = t.pics.length ? (t.pics.length === 1 ? String(t.pics[0]._j + 1) : (t.pics[0]._j + 1) + "\u2013" + (t.pics[t.pics.length - 1]._j + 1)) : "";
        return '<li><span class="tn">' + t.n + '</span><span class="tt">' + esc(t.text) +
          (t.name ? "<small>" + esc(t.name) + "</small>" : "") +
          (t.subs.length ? "<em>" + t.subs.map(esc).join(" / ") + "</em>" : "") + "</span>" +
          (pr ? '<button class="tp" data-plate="' + t.pics[0].id + '">' + pr + "</button>" : "<span></span>") + "</li>";
      }).join("") + "</ol></div>";
    }
    if (m.tools.length) {
      const by = {}; m.tools.forEach((t) => { (by[t.label] = by[t.label] || []).push(t.value); });
      h += '<div class="sec"><span class="m">Credits</span><dl class="cred">' + Object.keys(by).map((k) => "<dt>" + esc(k) + "</dt><dd>" + by[k].map(esc).join(", ") + "</dd>").join("") + "</dl></div>";
    }
    if (m.pics.length) h += '<div class="sec"><span class="m">Plates <span style="float:right">' + m.pics.length + '</span></span><div class="strip"></div></div>';
    a.innerHTML = h + "</div>";
    /* a long entry (the workflow ones) takes two columns of the sheet and
       runs its text across both, the way a feature does on a broadsheet */
    m.wide = a.textContent.length > WIDE;
    a.classList.toggle("w2", m.wide);

    const th = $(".th", a);
    if (m.lead) {
      th.dataset.plate = m.lead.id; th.classList.toggle("al", !!m.lead.alpha);
      th.appendChild(cover(m.lead, 76));
    } else th.dataset.go = m.k;
    const strip = $(".strip", a);
    if (strip) m.pics.forEach((p) => {
      const b = el("button", p.alpha ? "al" : ""); b.dataset.plate = p.id; b.title = p._no;
      b.appendChild(cover(p, 18)); strip.appendChild(b);
    });
    a.addEventListener("mouseenter", () => { mark(m.k); say(m); });
    a.addEventListener("mouseleave", () => { mark(null); say(null); });
    return a;
  };

  /* ── the plates ── */
  const PLATES = {}; // plate id -> the element in a band
  const BLOCK = {}; // study key -> its block
  const plate = (p, box, o) => {
    const opt = o || {};
    const a = el("a", "pl" + (p.alpha ? " al" : "")); a.href = D.href(p.k); a.dataset.k = p.k; a.dataset.id = p.id;
    a.style.setProperty("--f", BYK[p.k].s.fill);
    const f = el("span", "fr"); f.style.width = box.w + "px"; f.style.height = box.h + "px";
    const im = D.img(p, box.w); im.alt = clean(p.alt); im.width = box.w; im.height = box.h;
    /* a plate asks for its file only when it comes near the glass */
    im.dataset.srcset = im.srcset; im.dataset.src = im.getAttribute("src"); im.removeAttribute("srcset"); im.removeAttribute("src");
    f.appendChild(im); a.appendChild(f);
    if (opt.cap !== false) {
      const c = el("span", "cap", '<span class="m">' + p._no + "</span>" + (opt.title ? "<span>" + esc(BYK[p.k].title) + "</span>" : ""));
      a.appendChild(c);
      if (opt.alt && p.alt) a.appendChild(el("span", "alt", esc(p.alt)));
    }
    if (!PLATES[p.id]) PLATES[p.id] = a;
    a.addEventListener("mouseenter", () => say(BYK[p.k], p));
    a.addEventListener("mouseleave", () => say(null));
    return a;
  };
  let IO = null;
  const watch = () => {
    if (IO) IO.disconnect();
    const wake = (im) => { if (!im.dataset.src) return; im.srcset = im.dataset.srcset; im.src = im.dataset.src; delete im.dataset.src; fadeIn(im); };
    if (!("IntersectionObserver" in window)) { $$(".band img").forEach(wake); return; }
    IO = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { wake(e.target); IO.unobserve(e.target); } }), { rootMargin: "500px 0px" });
    $$(".band img").forEach((im) => IO.observe(im));
  };
  const others = (m, n, not) => m.pics.filter((p) => p !== m.lead && !(not || []).includes(p)).sort((a, b) => (a.alpha - b.alpha) || (a._j - b._j)).slice(0, n);
  const at = (node, col, extra) => { node.style.gridColumn = col; node.style.gridRow = "1"; if (extra) Object.assign(node.style, extra); return node; };
  const head = (m, dark) => '<div class="kn"><span class="m">' + m.no + '</span><span class="m">' + esc(m.s.s) + '</span></div><h3><a href="' + m.href + '">' + esc(m.title) + "</a><em>" + esc(m.year) + "</em></h3>";
  const mkBlock = (cls, ms) => { const b = el("div", "blk " + cls); b.dataset.ks = ms.map((m) => m.k).join(" "); ms.forEach((m) => { BLOCK[m.k] = b; }); return b; };

  /* the focus: one plate as large as its pixels allow */
  const XL = (m, mir) => {
    const b = mkBlock("xl", [m]); const U = G.U; const phone = U === 6;
    const pw = phone ? G.W : span(U === 16 ? 10 : 8);
    const box = fit(m.lead, pw, phone ? G.vh * 0.7 : Math.min(G.vh * 0.86, 840));
    const pl = plate(m.lead, box, { alt: true });
    const side = el("div", "kside");
    side.innerHTML = "<div>" + head(m) + (m.display[0] ? '<p class="dl">' + esc(m.display[0]) + "</p>" : "") + "</div>";
    const sm = el("div", "smalls");
    const n = phone ? 3 : 2; const sw = phone ? (G.W - 2 * G.ug) / 3 : span(2);
    others(m, n).forEach((p) => sm.appendChild(plate(p, fit(p, sw, sw * 1.35), { })));
    side.appendChild(sm);
    if (phone) {
      at(pl, "1 / -1"); side.style.gridColumn = "1 / -1"; side.style.marginTop = "26px";
      b.append(pl, side);
    } else {
      const pc = U === 16 ? (mir ? "7 / 17" : "1 / 11") : (mir ? "5 / 13" : "1 / 9");
      const sc = U === 16 ? (mir ? "1 / 6" : "12 / 17") : (mir ? "1 / 5" : "9 / 13");
      at(pl, pc, { justifySelf: mir ? "end" : "start" });
      at(side, sc, { minHeight: box.h + "px" });
      b.append(pl, side);
    }
    return b;
  };
  /* two studies at two scales, the smaller one dropped */
  const PAIR = (ms, mir) => {
    const b = mkBlock("pair", ms); const U = G.U;
    const [A, B] = ms;
    if (U === 6) {
      const ba = fit(A.lead, span(4), G.vh * 0.6); const pa = at(plate(A.lead, ba, { title: true }), mir ? "3 / 7" : "1 / 5", { justifySelf: mir ? "end" : "start" });
      b.appendChild(pa);
      if (B) { const bb = fit(B.lead, span(3), G.vh * 0.5); b.appendChild(at(plate(B.lead, bb, { title: true }), mir ? "1 / 4" : "4 / 7", { gridRow: "2", marginTop: "40px", justifySelf: mir ? "start" : "end" })); }
      return b;
    }
    const ca = U === 16 ? (mir ? "9 / 16" : "2 / 9") : (mir ? "6 / 12" : "1 / 7");
    const cb = U === 16 ? (mir ? "2 / 6" : "11 / 15") : (mir ? "1 / 5" : "8 / 12");
    const ba = fit(A.lead, span(U === 16 ? 7 : 6), G.vh * 0.78);
    b.appendChild(at(plate(A.lead, ba, { title: true }), ca, { justifySelf: mir ? "end" : "start" }));
    if (B) {
      const bb = fit(B.lead, span(4), G.vh * 0.62);
      b.appendChild(at(plate(B.lead, bb, { title: true }), cb, { marginTop: Math.round(ba.h * 0.42) + "px", justifySelf: mir ? "start" : "end" }));
    }
    return b;
  };
  /* three small plates with a lot of air between them */
  const SCATTER = (ms, mir) => {
    const b = mkBlock("scatter", ms); const U = G.U;
    let cols; let ws; let tops;
    if (U === 16) { cols = mir ? ["13 / 17", "8 / 10", "2 / 5"] : ["1 / 5", "8 / 10", "13 / 16"]; ws = [4, 2, 3]; tops = [0, 0.7, 0.24]; }
    else if (U === 12) { cols = mir ? ["10 / 13", "6 / 8", "1 / 4"] : ["1 / 4", "6 / 8", "10 / 13"]; ws = [3, 2, 3]; tops = [0, 0.6, 0.2]; }
    else { cols = mir ? ["4 / 7", "1 / 4", "3 / 6"] : ["1 / 4", "4 / 7", "2 / 5"]; ws = [3, 3, 3]; tops = [0, 0.45, 0]; }
    let h0 = 0;
    ms.forEach((m, i) => {
      const box = fit(m.lead, span(ws[i]), G.vh * (ws[i] === 2 ? 0.34 : 0.5));
      if (i === 0) h0 = box.h;
      const pl = plate(m.lead, box, { title: true });
      const row = U === 6 && i === 2 ? "2" : "1";
      at(pl, cols[i], { gridRow: row, marginTop: (row === "2" ? 40 : Math.round(h0 * tops[i])) + "px", justifySelf: (i === 0) === !mir ? "start" : "end" });
      b.appendChild(pl);
    });
    return b;
  };
  const SOLO = (m, mir) => {
    const b = mkBlock("solo", [m]); const U = G.U;
    const c = U === 16 ? (mir ? "3 / 8" : "10 / 15") : U === 12 ? (mir ? "2 / 7" : "7 / 12") : (mir ? "1 / 5" : "3 / 7");
    const box = fit(m.lead, span(U === 6 ? 4 : 5), G.vh * 0.7);
    b.appendChild(at(plate(m.lead, box, { title: true }), c, { justifySelf: mir ? "start" : "end" }));
    return b;
  };
  /* a black field: the study's display lines in Ogg, its plates beside */
  const FIELD = (m, mir) => {
    const b = mkBlock("field", [m]); const U = G.U; const phone = U === 6;
    const tx = el("div", "ftx", "<div>" + head(m) + m.display.slice(0, 3).map((t) => '<p class="dl">' + esc(t) + "</p>").join("") + "</div>" +
      (m.closing[0] ? '<p class="cl">' + esc(m.closing[0]) + "</p>" : ""));
    const fp = el("div", "fpl");
    const bw = phone ? G.W : span(U === 16 ? 6 : 5);
    const box = fit(m.lead, bw, G.vh * 0.62);
    fp.appendChild(plate(m.lead, box, { alt: true }));
    const row = el("div", "row"); const sw = phone ? (G.W - 2 * G.ug) / 3 : span(2) - 4;
    others(m, phone ? 3 : 3).forEach((p) => row.appendChild(plate(p, fit(p, sw, sw * 1.3), {})));
    if (row.childNodes.length) fp.appendChild(row);
    if (phone) { tx.style.gridColumn = "1 / -1"; fp.style.gridColumn = "1 / -1"; fp.style.marginTop = "44px"; b.append(tx, fp); }
    else {
      at(tx, U === 16 ? (mir ? "8 / 17" : "1 / 10") : (mir ? "6 / 13" : "1 / 8"));
      at(fp, U === 16 ? (mir ? "1 / 7" : "11 / 17") : (mir ? "1 / 6" : "8 / 13"));
      b.append(tx, fp);
    }
    return b;
  };
  /* a plate made of type: a study with no pictures shows its figures */
  const TYPE = (m, mir) => {
    const b = mkBlock("type", [m]); const U = G.U; const phone = U === 6;
    b.style.setProperty("--f", m.s.fill); b.style.setProperty("--fi", D.ink(m.s.fill));
    const cap = el("div", "tcap", head(m) + "<p>" + esc(m.s.fact) + " <span>" + esc(m.s.rest) + "</span></p>");
    const nums = m.nums.slice(0, 4);
    const tf = el("div", "tfield");
    tf.style.setProperty("--tn", phone ? 2 : Math.max(1, nums.length));
    if (nums.length) {
      /* the figures are set as large as the longest one allows */
      const tn = phone ? 2 : nums.length; const fw = phone ? G.W : span(U === 16 ? 12 : 8);
      const colw = (fw - (phone ? 40 : 72) - (tn - 1) * G.ug) / tn;
      const longest = Math.max(...nums.map((f) => clean(f.value).length));
      tf.style.setProperty("--vs", Math.round(Math.min(phone ? 64 : 112, colw / (longest * 0.6))) + "px");
      tf.innerHTML = nums.map((f) => '<div><span class="v">' + esc(f.value) + '</span><span class="l m">' + esc(f.label) + '</span><span class="s">' + esc(f.sub || "") + "</span></div>").join("");
    }
    else tf.innerHTML = '<div><span class="v" style="white-space:normal">' + esc(m.display[0] || m.s.fact) + "</span></div>";
    if (phone) { cap.style.gridColumn = "1 / -1"; tf.style.gridColumn = "1 / -1"; tf.style.marginTop = "22px"; b.append(cap, tf); }
    else {
      at(cap, U === 16 ? (mir ? "13 / 17" : "1 / 5") : (mir ? "9 / 13" : "1 / 5"), { alignSelf: "end" });
      at(tf, U === 16 ? (mir ? "1 / 13" : "5 / 17") : (mir ? "1 / 9" : "5 / 13"));
      b.append(cap, tf);
    }
    return b;
  };

  /* the roles, chosen from what each study carries */
  const xlScore = (m) => { const p = m.lead; if (!p) return -1e9; return (p.alpha ? -6 : 0) + (p.w >= p.h * 1.15 ? 3 : 0) + Math.min(3, D.maxCss(p) / 450) + Math.min(1.5, m.pics.length / 10); };
  const compose = (group, bi) => {
    const band = el("section", "band"); const mir = bi % 2 === 1;
    const from = group[0].no; const to = group[group.length - 1].no;
    band.innerHTML = '<div class="bh"><span class="m">Plates</span><span class="m">' + from + (group.length > 1 ? "\u2013" + to : "") + "</span></div>";
    const pool = group.filter((m) => m.pics.length);
    const types = group.filter((m) => !m.pics.length);
    const take = (score) => {
      let best = null; let bs = -1e8;
      pool.forEach((m) => { const v = score(m); if (v > bs) { bs = v; best = m; } });
      if (best) pool.splice(pool.indexOf(best), 1);
      return best;
    };
    const blocks = [];
    const xl = pool.length ? take(xlScore) : null;
    const fields = [];
    const work = (m) => m.s.tags.includes("systems") || m.s.tags.includes("app");
    for (let i = 0; i < 2; i++) {
      const f = take((m) => (m.display.length >= 2 && work(m) ? 10 + m.display.length : -1e9));
      if (f) fields.push(f);
    }
    if (!fields.length && pool.length > 2) {
      const f = take((m) => (m.display.length ? m.display.length * 3 + m.lines / Math.max(1, m.pics.length) : -1e9));
      if (f) fields.push(f);
    }
    /* what is left is set in pairs and scatters, never the same twice
       running, and a last one alone */
    const papers = [];
    const rest = group.filter((m) => pool.includes(m));
    const PAT = { 1: [1], 2: [2], 3: [3], 4: [3, 1], 5: [2, 3], 6: [2, 3, 1], 7: [2, 3, 2], 8: [3, 2, 3] };
    const pat = PAT[rest.length] || [];
    let left = rest.length - pat.reduce((a, b) => a + b, 0);
    while (left > 0) { const n = Math.min(left, pat[pat.length - 1] === 3 ? 2 : 3); pat.push(n); left -= n; }
    pat.forEach((n) => {
      const chunk = rest.splice(0, n);
      papers.push(chunk.length === 1 ? ["solo", chunk[0]] : chunk.length === 2 ? ["pair", chunk] : ["scatter", chunk]);
    });
    if (xl) blocks.push(XL(xl, mir));
    types.forEach((m) => blocks.push(TYPE(m, !mir)));
    let k = 0;
    const n = Math.max(papers.length, fields.length);
    for (let i = 0; i < n; i++) {
      const pp = papers[i];
      if (pp) { const mm = (k++ % 2 === 1) !== mir; blocks.push(pp[0] === "solo" ? SOLO(pp[1], mm) : pp[0] === "pair" ? PAIR(pp[1], mm) : SCATTER(pp[1], mm)); }
      if (fields[i]) blocks.push(FIELD(fields[i], (i % 2 === 1) !== mir));
    }
    blocks.forEach((b) => band.appendChild(b));
    return band;
  };

  /* ── the index and the foot ── */
  const index = () => {
    const ix = $("#index");
    const tag = {}; Object.values(D.lines).forEach((l) => { tag[l.tag] = l; });
    ix.innerHTML = '<div class="ih"><span class="m">Index</span><span class="m">' + M[0].no + "\u2013" + M[M.length - 1].no + "</span></div>" +
      '<table><thead><tr><th class="m">No.</th><th class="m">Title</th><th class="m g">Field</th><th class="m c">Lines</th><th class="m" style="text-align:right">Year</th><th class="m" style="text-align:right">Plates</th></tr></thead><tbody>' +
      SHOWN.map((m) => '<tr class="r" data-to="' + m.no.toLowerCase() + '"><td class="no">' + m.no + '</td><td class="t">' + esc(m.title) + '</td><td class="g">' + esc(m.s.s) +
        '</td><td class="c">' + m.s.tags.filter((t) => tag[t]).map((t) => '<i style="--c:' + tag[t].color + '" title="' + esc(tag[t].name) + '"></i>').join("") +
        '</td><td class="y">' + esc(m.year) + '</td><td class="n">' + m.pics.length + "</td></tr>").join("") + "</tbody></table>";
    $$("tr.r", ix).forEach((tr) => tr.addEventListener("click", () => toEntry(tr.dataset.to)));
    const ft = $("#foot");
    ft.innerHTML = DATA.method.map((x) => '<div class="md"><span class="m">' + esc(x.k) + "</span><p>" + esc(x.v) + "</p></div>").join("") +
      '<div class="ct"><span class="m">Contact</span>' + DATA.links.map((l) => '<a href="' + esc(l.v) + '">' + esc(l.k) + "</a>").join("") + '<a href="mailto:' + esc(DATA.email) + '">' + esc(DATA.email) + "</a></div>" +
      '<div class="end"><a class="mark" href="/">Reckon<i>*</i>House</a><span class="m">' + M[0].no + "\u2013" + M[M.length - 1].no + "</span></div>";
  };

  /* ── the sheet: entries, and after every sheet of them, their plates ── */
  const render = () => {
    measure();
    for (const k in PLATES) delete PLATES[k];
    for (const k in BLOCK) delete BLOCK[k];
    const sh = $("#sheet"); sh.innerHTML = "";
    const els = SHOWN.map((m) => [m, entry(m)]);
    /* rows by slots: a wide entry takes two, and a row that cannot take
       the next one ends early, leaving its slot as air */
    const rows = []; let row = []; let used = 0;
    els.forEach(([m, e]) => {
      const sp = m.wide ? Math.min(2, G.cols) : 1;
      if (used + sp > G.cols) { rows.push(row); row = []; used = 0; }
      row.push([m, e]); used += sp;
    });
    if (row.length) rows.push(row);
    const per = G.cols >= 6 ? 1 : Math.max(1, Math.round(8 / G.cols));
    for (let i = 0, bi = 0; i < rows.length; i += per, bi++) {
      const group = [].concat(...rows.slice(i, i + per));
      group.forEach(([, e]) => sh.appendChild(e));
      sh.appendChild(compose(group.map(([m]) => m), bi));
    }
    /* a wide entry starts its tracklist at the head of its second column
       when that costs the row no height; otherwise the text just flows */
    const ents = $$(".ent", sh); ents.forEach((e) => { e.style.alignSelf = "start"; });
    const rowTop = {}; ents.forEach((e) => { if (!e.classList.contains("w2")) rowTop[e.offsetTop] = Math.max(rowTop[e.offsetTop] || 0, e.offsetHeight); });
    ents.filter((e) => e.classList.contains("w2")).forEach((e) => {
      const a = e.offsetHeight; e.classList.add("brk"); const b2 = e.offsetHeight;
      if (b2 > Math.max(rowTop[e.offsetTop] || 0, a + 40)) e.classList.remove("brk");
    });
    ents.forEach((e) => { e.style.alignSelf = ""; });
    sections();
    watch();
    if (Q.ks) dim(Q.ks);
  };

  /* ── marking: an entry marks its plates, a line marks its entries ── */
  let marked = null;
  const mark = (k) => {
    if (marked === k) return; marked = k;
    $$(".band.mk").forEach((b) => b.classList.remove("mk"));
    $$(".band .on").forEach((x) => x.classList.remove("on"));
    if (!k) return;
    const blk = BLOCK[k]; if (!blk) return;
    blk.closest(".band").classList.add("mk");
    $$('.pl[data-k="' + k + '"]', blk.closest(".band")).forEach((x) => x.classList.add("on"));
    $$(".blk", blk.closest(".band")).forEach((b) => { if (b.dataset.ks.split(" ").includes(k)) b.classList.add("on"); });
  };
  const dim = (ks) => {
    if (!ks && Q.ks) ks = Q.ks; // a search holds when the pointer leaves a line
    const sh = $("#sheet"); sh.classList.toggle("dim", !!ks);
    $$(".ent", sh).forEach((e) => e.classList.toggle("on", !!ks && ks.includes(e.dataset.k)));
    $$(".band .pl", sh).forEach((e) => e.classList.toggle("hit", !!ks && ks.includes(e.dataset.k)));
    $$(".band .blk", sh).forEach((b) => { const hit = !!ks && b.dataset.ks.split(" ").some((k) => ks.includes(k)); b.classList.toggle("hit", hit); const sd = $(".kside", b); if (sd) sd.classList.toggle("hit", hit); });
  };
  /* search: the kit's plain counting over every fragment. A study stays
     lit when any of its fragments scores 1.5 or more: a word of its own
     (3), a word in its name (2), or a word that names one of its lines
     ("workflow" is Systems, 1.5). A stray partial match (1) is not enough */
  const Q = { ks: null };
  const POOL = D.frags.filter((f) => BYK[f.k]);
  const search = (q) => {
    const n = $("#q-n");
    if (!q.trim()) { Q.ks = null; n.textContent = ""; dim(null); return; }
    const hit = {}; D.search(q, POOL).forEach((r) => { if (r.score >= 1.5) hit[r.f.k] = 1; });
    Q.ks = Object.keys(hit);
    n.textContent = Q.ks.length + " / " + M.length;
    dim(Q.ks);
  };

  /* ── the running head: where you are, or what is under the pointer ── */
  let SECS = [];
  const sections = () => {
    SECS = [];
    let cur = null;
    $$("#sheet > *").forEach((n) => {
      if (n.classList.contains("ent")) { if (!cur || cur.done) { cur = { a: n, ks: [] }; SECS.push(cur); } cur.ks.push(n.dataset.k); }
      else if (n.classList.contains("band")) { if (cur) { cur.band = n; cur.done = true; } }
    });
  };
  const nowText = () => {
    const y = window.scrollY + 40; let s = SECS[0];
    SECS.forEach((x) => { if (x.a.offsetTop <= y) s = x; });
    if (!s) return "";
    const a = BYK[s.ks[0]].no; const b = BYK[s.ks[s.ks.length - 1]].no;
    const inBand = s.band && s.band.offsetTop <= y;
    return (inBand ? "Plates " : "") + a + "\u2013" + b;
  };
  let saying = null;
  const say = (m, p) => {
    saying = m;
    const n = $("#rh-now");
    if (!m) { n.innerHTML = '<b class="m">' + nowText() + "</b>"; return; }
    n.innerHTML = '<b class="m">' + (p ? p._no : m.no) + "</b><span>" + esc(m.title) + "</span><em>" + esc(m.year) + "</em>";
  };
  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const past = window.scrollY > $("#mast").offsetHeight - 40;
      $("#rh").classList.toggle("on", past && !LB.open);
      if (!saying) $("#rh-now").innerHTML = '<b class="m">' + nowText() + "</b>";
    });
  };

  /* ── going places ── */
  const still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollToY = (y, smooth0) => new Promise((res) => {
    const smooth = smooth0 && !still;
    const target = Math.max(0, Math.min(y, document.documentElement.scrollHeight - G.vh));
    if (Math.abs(window.scrollY - target) < 4) return res();
    let done = false; const fin = () => { if (done) return; done = true; window.removeEventListener("scrollend", fin); res(); };
    window.addEventListener("scrollend", fin);
    setTimeout(fin, smooth ? 1400 : 60);
    window.scrollTo({ top: target, behavior: smooth ? "smooth" : "auto" });
  });
  const toEntry = (id) => { const e = document.getElementById(id); if (e) scrollToY(e.getBoundingClientRect().top + window.scrollY - 44, true); };
  /* a catalogue number goes to its plate in the band, and enlarges it */
  const goPlate = async (p, from) => {
    const inBand = PLATES[p.id];
    if (inBand) {
      const r = inBand.getBoundingClientRect(); const fr = $(".fr", inBand).getBoundingClientRect();
      const y = window.scrollY + r.top - Math.max(60, (G.vh - fr.height) / 2);
      await scrollToY(y, true);
      openLB(p, $(".fr", inBand));
    } else openLB(p, from);
  };
  const goStudy = (k, from) => {
    const m = BYK[k]; if (!m) return;
    if (m.lead) return goPlate(m.lead, from);
    const b = BLOCK[k]; if (b) scrollToY(b.getBoundingClientRect().top + window.scrollY - (G.vh - b.offsetHeight) / 2, true);
  };

  /* ── a plate, enlarged, on black ── */
  const LB = { open: false, p: null };
  const lbSize = (p) => {
    const well = $("#lb .lb-well").getBoundingClientRect();
    const box = fit(p, well.width - 2 * G.mg, well.height - 8);
    return { w: box.w, h: box.h, x: well.left + (well.width - box.w) / 2, y: well.top + (well.height - box.h) / 2, top: well.top, left: well.left };
  };
  const showLB = (p) => {
    const m = BYK[p.k]; LB.p = p;
    const box = $("#lb-box"); box.innerHTML = ""; box.href = m.href; box.classList.toggle("al", !!p.alpha);
    box.style.setProperty("--f", m.s.fill);
    const s = lbSize(p);
    box.style.left = (s.x - s.left) + "px"; box.style.top = (s.y - s.top) + "px"; box.style.width = s.w + "px"; box.style.height = s.h + "px";
    const im = D.img(p, s.w, { eager: true }); im.alt = clean(p.alt); fadeIn(im); box.appendChild(im);
    $("#lb-no").textContent = p._no + " / " + m.pics.length;
    $("#lb-t").innerHTML = esc(m.title) + "<em>" + esc(m.year) + "</em>"; $("#lb-t").href = m.href;
    $("#lb-open").href = m.href;
    $("#lb-cap").textContent = clean(p.alt);
    const st = $("#lb-strip");
    if (st.dataset.k !== m.k) {
      st.dataset.k = m.k; st.innerHTML = "";
      m.pics.forEach((q) => { const b = el("button", q.alpha ? "al" : ""); b.dataset.lb = q.id; b.title = q._no; b.appendChild(cover(q, 22)); st.appendChild(b); });
    }
    $$("button", st).forEach((b) => b.classList.toggle("on", b.dataset.lb === p.id));
    return s;
  };
  const openLB = (p, fromEl) => {
    const lb = $("#lb"); LB.open = true; lb.classList.add("on"); lb.setAttribute("aria-hidden", "false");
    $("#rh").classList.remove("on");
    const s = showLB(p); const box = $("#lb-box");
    if (fromEl) {
      const r = fromEl.getBoundingClientRect();
      box.style.transition = "none";
      box.style.transform = "translate(" + (r.left - s.x) + "px," + (r.top - s.y) + "px) scale(" + (r.width / s.w) + "," + (r.height / s.h) + ")";
      box.getBoundingClientRect();
      requestAnimationFrame(() => { box.style.transition = "transform 0.6s var(--ease)"; box.style.transform = "none"; });
    } else { box.style.transition = "none"; box.style.transform = "none"; }
  };
  const closeLB = () => {
    const lb = $("#lb"); LB.open = false; lb.classList.remove("on"); lb.setAttribute("aria-hidden", "true");
    onScroll();
  };
  const stepLB = (d) => {
    if (!LB.open || !LB.p) return;
    const m = BYK[LB.p.k]; const i = (m.pics.indexOf(LB.p) + d + m.pics.length) % m.pics.length;
    const box = $("#lb-box"); box.style.transition = "none"; box.style.transform = "none";
    showLB(m.pics[i]);
  };

  /* ── print: every picture on the sheet loads first, then the poster.
     A print re-picks from a srcset at print resolution and would fetch
     the full files, so the sheet's pictures are pinned to their 384px
     thumbnails first: a 76px sleeve is 20mm on the poster, and 384
     pixels across 20mm is more than a printer can use ── */
  const pin = () => $$("#sheet .ent img, #lb-strip img").forEach((i) => {
    if (i.dataset.t && i.getAttribute("srcset")) { i.removeAttribute("srcset"); i.removeAttribute("sizes"); i.src = i.dataset.t; }
    i.loading = "eager";
  });
  const print = async () => {
    pin();
    const ims = $$("#sheet .ent img");
    await Promise.race([
      Promise.all(ims.map((i) => (i.complete && i.naturalWidth ? 1 : new Promise((r) => { i.addEventListener("load", r, { once: true }); i.addEventListener("error", r, { once: true }); })))),
      new Promise((r) => setTimeout(r, 8000)),
    ]);
    window.print();
  };
  window.addEventListener("beforeprint", pin);

  /* ── wiring ── */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-go],[data-plate],[data-lb],[data-print],#lb-x");
    if (!t) { if (LB.open && !e.target.closest("#lb-box,.lb-top,#lb-strip")) closeLB(); return; }
    if (t.id === "lb-x") return closeLB();
    if (t.hasAttribute("data-print")) return print();
    if (t.dataset.lb) { const box = $("#lb-box"); box.style.transition = "none"; box.style.transform = "none"; return void showLB(PIC[t.dataset.lb]); }
    if (t.dataset.plate) return void goPlate(PIC[t.dataset.plate], t);
    if (t.dataset.go) {
      if (t.closest("#bar") || t.closest(".lines")) return toEntry(BYK[t.dataset.go].no.toLowerCase());
      return void goStudy(t.dataset.go, $(".th", t.closest(".ent")) || t);
    }
  });
  document.addEventListener("keydown", (e) => {
    if (!LB.open) return;
    if (e.key === "Escape") closeLB();
    else if (e.key === "ArrowRight") stepLB(1);
    else if (e.key === "ArrowLeft") stepLB(-1);
  });
  let qt = 0;
  $("#q").addEventListener("input", (e) => { clearTimeout(qt); const v = e.target.value; qt = setTimeout(() => search(v), 120); });
  $("#q").addEventListener("keydown", (e) => { if (e.key === "Escape") { e.target.value = ""; search(""); } });
  window.addEventListener("scroll", onScroll, { passive: true });
  let lastW = 0; let rt = 0;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      const w = document.documentElement.clientWidth;
      if (w !== lastW) { lastW = w; render(); onScroll(); }
      if (LB.open && LB.p) showLB(LB.p);
    }, 180);
  });

  {
    const probe = SHOWN.map((m) => { const a = entry(m); return a.textContent.length; }).sort((a, b) => a - b);
    WIDE = probe[probe.length >> 1] * 1.7;
  }
  mast(); index();
  lastW = document.documentElement.clientWidth;
  render(); onScroll();
})();
