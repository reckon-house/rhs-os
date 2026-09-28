/* ── THE TYPE TWEAKS PANEL (27 Sept 2026): his "can you make me a tweaks
   panel where i can change the text weights and sizes to play with a
   little bit?". A small "Type" button at the foot of the page opens a
   panel of sliders, a group each for the case studies, the home and the
   index. Each slider writes one rule into a stylesheet of its own
   (!important, so it wins over the sizes the page fits by script), so
   the page answers as it moves. The settings are kept in localStorage
   and survive a reload; "Copy" puts them on the clipboard as CSS, to be
   sent back and set into the real stylesheets. Nothing here changes the
   stylesheets themselves.

   Avenir Next is hosted at 400, 500, 600, 700 and 800 only, so a weight
   moves in those steps. A knob's starting value is read from the page
   (the first element it styles), else the value it is given here ── */
(() => {
  const LS = "crossref2.tweaks";
  const S = (sel) => sel.split("|").join(", ");
  const KNOBS = [
    { g: "Case study", items: [
      { k: "sp-title", label: "Title", sel: ".sp .sp-title", props: { weight: 500, size: 72 } },
      { k: "sp-h", label: "Section heads", sel: ".sp .sp-h", props: { weight: 500, size: 46 } },
      { k: "sp-pq", label: "Pull quotes", sel: ".sp .sp-pq", props: { weight: 500, size: 48 } },
      { k: "sp-fn", label: "Figures", sel: ".sp .sp-fn", props: { weight: 500 } },
      { k: "sp-mid", label: "Decks and subtitles", sel: ".sp .sp-stand|.sp .sp-deck|.sp .sp-closing p + p|.sp .sp-closing p.sp-long", props: { weight: 400, size: 21, leading: 1.3 } },
      { k: "sp-text", label: "Paragraphs", sel: ".sp .sp-p|.sp .sp-fs|.sp .sp-card p|.sp .sp-ns|.sp .sp-tr dd|.sp .sp-tcol li", props: { weight: 400, size: 15, leading: 1.62 } },
      { k: "sp-tt", label: "Titles in the text", sel: ".sp .sp-col|.sp .sp-card h3", props: { weight: 500, size: 15 } },
      { k: "sp-small", label: "Captions", sel: ".sp .sp-cap|.sp .sp-meta|.sp .sp-bcap|.sp .sp-fcap|.sp .sp-spec-h", props: { weight: 400, size: 12 } },
      { k: "sp-label", label: "Labels", sel: ".sp .sp-caps|.sp .sp-kick|.sp .sp-nl|.sp .sp-tr dt", props: { weight: 500, size: 10.5, tracking: 0.08 } },
    ] },
    { g: "Home", items: [
      { k: "say", label: "Statement", sel: ".rest .say", props: { weight: 600, size: 35, tracking: -0.042, leading: 1.02 } },
    ] },
    { g: "Index", items: [
      { k: "ix-line", label: "Line names", sel: "html[data-ix=\"e\"] #idx .e.el .t", props: { weight: 700, size: 28 } },
      { k: "ix-card", label: "Work card names", sel: "html[data-ix=\"e\"] #idx .e.ef .t", props: { weight: 700, size: 23.5 } },
      { k: "ix-year", label: "Years", sel: "html[data-ix=\"e\"] #idx .e.ey .t", props: { weight: 700, size: 21 } },
      { k: "ix-fig", label: "Figures", sel: "html[data-ix=\"e\"] #idx .e.efig .fn", props: { weight: 700, size: 34 } },
      { k: "ix-list", label: "Work list, capabilities, tools", sel: "html[data-ix=\"e\"] #idx .e.ew .t|html[data-ix=\"e\"] #idx .e.ecap .t|html[data-ix=\"e\"] #idx .e.etool .t", props: { weight: 500, size: 13 } },
      { k: "ix-dk", label: "Sentences", sel: "html[data-ix=\"e\"] #idx .e .dk", props: { weight: 500, size: 10.5 } },
      { k: "ix-head", label: "Section heads", sel: "html[data-ix=\"e\"] #idx .eh", props: { weight: 600, size: 10 } },
    ] },
  ];
  const PROP = {
    weight: { label: "Weight", css: "font-weight", min: 400, max: 800, step: 100, fmt: (v) => String(v), out: (v) => String(v) },
    size: { label: "Size", css: "font-size", fmt: (v) => v + "px", out: (v) => v + "px" },
    leading: { label: "Leading", css: "line-height", min: 0.8, max: 2, step: 0.02, fmt: (v) => v.toFixed(2), out: (v) => v.toFixed(2) },
    tracking: { label: "Tracking", css: "letter-spacing", min: -0.1, max: 0.2, step: 0.005, fmt: (v) => v.toFixed(3) + "em", out: (v) => v.toFixed(3) + "em" },
  };
  let state = {};
  try { state = JSON.parse(localStorage.getItem(LS) || "{}") || {}; } catch (e) { state = {}; }
  const save = () => { try { localStorage.setItem(LS, JSON.stringify(state)); } catch (e) { /* a private window */ } };

  /* the rules */
  const sheet = document.createElement("style"); sheet.id = "twk-rules"; document.head.appendChild(sheet);
  const knob = (k) => { for (const g of KNOBS) for (const it of g.items) if (it.k === k) return it; return null; };
  const cssText = () => Object.keys(state).map((k) => {
    const it = knob(k); if (!it) return "";
    const decl = Object.keys(state[k]).filter((p) => PROP[p]).map((p) => PROP[p].css + ": " + PROP[p].out(state[k][p]) + " !important;").join(" ");
    return decl ? S(it.sel) + " { " + decl + " }" : "";
  }).filter(Boolean).join("\n");
  let rzT = 0;
  const apply = () => {
    sheet.textContent = cssText();
    /* the page fits some type to its room; let it measure again */
    clearTimeout(rzT); rzT = setTimeout(() => dispatchEvent(new Event("resize")), 260);
  };
  apply();

  /* where a knob starts: the page's own value, else its given one */
  const read = (it, p) => {
    const e = document.querySelector(S(it.sel));
    if (!e) return it.props[p];
    const cs = getComputedStyle(e);
    if (p === "weight") return Math.round(parseFloat(cs.fontWeight) / 100) * 100 || it.props[p];
    if (p === "size") return Math.round(parseFloat(cs.fontSize) * 2) / 2 || it.props[p];
    if (p === "leading") { const lh = parseFloat(cs.lineHeight), fs = parseFloat(cs.fontSize); return lh && fs ? Math.round((lh / fs) * 100) / 100 : it.props[p]; }
    if (p === "tracking") { const ls = parseFloat(cs.letterSpacing), fs = parseFloat(cs.fontSize); return fs && !isNaN(ls) ? Math.round((ls / fs) * 1000) / 1000 : it.props[p]; }
    return it.props[p];
  };

  /* the panel's own look, kept apart from everything it tweaks */
  const css = document.createElement("style");
  css.textContent = `
.twk-btn { position: fixed; left: 12px; bottom: 12px; z-index: 1000; padding: 6px 11px 5px; border: 1px solid rgba(0,0,0,.18); border-radius: 999px; background: #fff; color: #000;
  font: 600 10.5px/1 "Avenir Next", "Helvetica Neue", Arial, sans-serif; letter-spacing: .08em; text-transform: uppercase; cursor: pointer; box-shadow: 0 1px 6px rgba(0,0,0,.08); }
.twk-btn:hover, .twk-btn.on { background: #000; color: #fff; border-color: #000; }
.twk { position: fixed; left: 12px; bottom: 46px; z-index: 1000; width: 300px; max-height: calc(100vh - 70px); overflow: auto; overscroll-behavior: contain;
  background: #fff; color: #000; border: 1px solid rgba(0,0,0,.14); box-shadow: 0 8px 30px rgba(0,0,0,.12); font: 500 11.5px/1.3 "Avenir Next", "Helvetica Neue", Arial, sans-serif; letter-spacing: 0; }
.twk[hidden] { display: none; }
.twk-top { position: sticky; top: 0; z-index: 1; display: flex; gap: 12px; align-items: center; padding: 10px 12px 9px; background: #fff; border-bottom: 1px solid rgba(0,0,0,.1); }
.twk-top b { flex: 1; font-weight: 700; letter-spacing: -.01em; }
.twk-top button, .twk-row button { padding: 0; border: 0; background: none; font: inherit; color: rgba(0,0,0,.5); cursor: pointer; }
.twk-top button:hover, .twk-row button:hover { color: #000; }
.twk-g { padding: 12px 12px 4px; font-size: 9.5px; font-weight: 600; letter-spacing: .09em; text-transform: uppercase; color: rgba(0,0,0,.45); }
.twk-k { padding: 7px 12px 9px; border-top: 1px solid rgba(0,0,0,.06); }
.twk-k.set { background: #F4F4F4; }
.twk-kh { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 5px; font-weight: 600; }
.twk-row { display: grid; grid-template-columns: 58px 1fr 52px; gap: 8px; align-items: center; margin-top: 3px; color: rgba(0,0,0,.6); }
.twk-row input { width: 100%; margin: 0; accent-color: #000; }
.twk-row output { text-align: right; color: #000; font-variant-numeric: tabular-nums; }
.twk-copy { display: block; width: calc(100% - 24px); margin: 10px 12px 12px; padding: 8px 0 7px; border: 1px solid #000; background: #000; color: #fff; font: 600 10.5px/1 "Avenir Next", "Helvetica Neue", Arial, sans-serif; letter-spacing: .08em; text-transform: uppercase; cursor: pointer; }
.twk-copy:hover { background: #fff; color: #000; }
.twk-note { margin: -4px 12px 12px; color: rgba(0,0,0,.45); font-size: 10.5px; }
`;
  document.head.appendChild(css);

  const btn = document.createElement("button"); btn.type = "button"; btn.className = "twk-btn"; btn.textContent = "Type";
  const panel = document.createElement("div"); panel.className = "twk"; panel.hidden = true;
  document.body.appendChild(panel); document.body.appendChild(btn);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const range = (it, p, v0) => {
    const P = PROP[p];
    if (p === "size") { const base = it.props.size || v0; return { min: Math.max(6, Math.round(base * 0.5)), max: Math.round(base * 2.2), step: base < 20 ? 0.5 : 1 }; }
    return { min: P.min, max: P.max, step: P.step };
  };
  const draw = () => {
    let h = '<div class="twk-top"><b>Type</b><button type="button" data-act="reset">Reset all</button><button type="button" data-act="close">Close</button></div>';
    KNOBS.forEach((g) => {
      h += '<div class="twk-g">' + esc(g.g) + "</div>";
      g.items.forEach((it) => {
        const set = state[it.k] && Object.keys(state[it.k]).length;
        h += '<div class="twk-k' + (set ? " set" : "") + '" data-k="' + it.k + '"><div class="twk-kh"><span>' + esc(it.label) + "</span>" + (set ? '<button type="button" data-act="undo" data-k="' + it.k + '">Reset</button>' : "") + "</div>";
        Object.keys(it.props).forEach((p) => {
          const v0 = read(it, p), v = state[it.k] && state[it.k][p] != null ? state[it.k][p] : v0, r = range(it, p, v0);
          h += '<label class="twk-row"><span>' + PROP[p].label + '</span><input type="range" data-k="' + it.k + '" data-p="' + p + '" min="' + r.min + '" max="' + r.max + '" step="' + r.step + '" value="' + v + '"><output>' + PROP[p].fmt(+v) + "</output></label>";
        });
        h += "</div>";
      });
    });
    h += '<button type="button" class="twk-copy" data-act="copy">Copy settings</button><div class="twk-note">Copies the changed ones as CSS, to paste back to Claude.</div>';
    panel.innerHTML = h;
  };
  panel.addEventListener("input", (ev) => {
    const r = ev.target.closest("input[type=range]"); if (!r) return;
    const k = r.dataset.k, p = r.dataset.p, v = parseFloat(r.value);
    (state[k] = state[k] || {})[p] = v;
    r.nextElementSibling.textContent = PROP[p].fmt(v);
    const card = r.closest(".twk-k");
    if (!card.classList.contains("set")) { card.classList.add("set"); card.querySelector(".twk-kh").insertAdjacentHTML("beforeend", '<button type="button" data-act="undo" data-k="' + k + '">Reset</button>'); }
    save(); apply();
  });
  panel.addEventListener("click", (ev) => {
    const b = ev.target.closest("[data-act]"); if (!b) return;
    const act = b.dataset.act;
    if (act === "close") { panel.hidden = true; btn.classList.remove("on"); return; }
    if (act === "reset") { state = {}; save(); apply(); setTimeout(draw, 300); return; }
    if (act === "undo") { delete state[b.dataset.k]; save(); apply(); setTimeout(draw, 300); return; }
    if (act === "copy") {
      const txt = cssText() || "/* nothing changed */";
      const done = () => { b.textContent = "Copied"; setTimeout(() => { b.textContent = "Copy settings"; }, 1400); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, () => { prompt("Copy these settings:", txt); });
      else prompt("Copy these settings:", txt);
    }
  });
  btn.addEventListener("click", () => {
    panel.hidden = !panel.hidden; btn.classList.toggle("on", !panel.hidden);
    if (!panel.hidden) draw();
  });
  window.TWEAKS = { get state() { return state; }, css: cssText };
})();
