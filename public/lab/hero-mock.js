/* ── HERO MOCK ────────────────────────────────────────────────────────
   A lab tool, not the board. Loaded only when the page is opened as
   /?hero, it lays a larger picture over the live board in one of four
   ways and pushes the tiles beneath it down, so a hero can be looked
   at against real neighbours before any of it is built. Nothing here
   touches the deal; reload without ?hero and it is gone.

   Four ideas, 11 Sept 2026:
     column   one picture a full column wide at its own height, beside
              a line's head — the top rung with a portrait
     opener   the same, as the opener's right column: the first screen
     banner   a picture across the pair under its head, cropped to
              2.1:1 to fit the screen with the head above it
     spread   a picture across the pair in place of its head
   The board's own rule stands between every column above the work, so
   a pair-wide picture on the real engine would have a 1px line through
   it; the mock sits above the rules and does not show that. */
(() => {
  /* `fit`: the picture is cut to the screen, not to its own ratio, and
     the column holds nothing else and does not scroll. A hero column
     is a page you pass, not a stack you read. */
  const V = {
    column: { col: 11, pair: false, src: "/case-studies/ivy-park/ivy-signage.jpg", ratio: 0.667, top: "band", fit: true,
      title: "Ivy Park by Beyoncé", sub: "Digital design, brand launch" },
    opener: { col: 1, pair: false, src: "/case-studies/hp/rhs-arc-app-project-select-phone.jpg", ratio: 0.74, top: "band", fit: true,
      title: "A.R.C. - AI Home Inventory", sub: "App & brand development" },
    banner: { col: 22, pair: true, src: "/case-studies/hill-country-living/hill-country-living-limestone-fireplace-eisenhower-painting-navajo-throw-cognac-sofa-symmetry.jpg", ratio: 2.1, top: "head",
      title: "Hill Country home", sub: "Interior design, living room" },
    spread: { col: 10, pair: true, src: "/case-studies/hp/rhs-robert-rodriguez-storefront-window.jpg", ratio: 1.55, top: "band",
      title: "Robert Rodriguez x Neiman’s", sub: "Creative direction, design", noHead: true },
  };
  const pushed = [], locked = [];
  const off = () => {
    document.querySelectorAll(".mock-hero").forEach((n) => n.remove());
    for (const [el, top] of pushed) el.style.top = top;
    pushed.length = 0;
    for (const [f, ov] of locked) { f.style.overflowY = ov; f.scrollTop = 0; }
    locked.length = 0;
    for (const el of live.values()) el.style.visibility = "";
  };
  /* the column mounts as the wheel gets there; the wheel turns only
     while the page is visible */
  const findCol = async (c) => {
    let last = null;
    for (let i = 0; i < 80; i++) {
      const f = [...fcols.values()].find((x) => x.__c === c);
      if (f) {
        /* the picture is fixed where it is placed, so it is placed only
           once the column has stopped: on screen, and where it was a
           beat ago */
        const left = Math.round(f.getBoundingClientRect().left);
        if (left >= -COL && left < innerWidth && left === last) return f;
        last = left;
      }
      await new Promise((r) => setTimeout(r, 120));
    }
    return null;
  };
  const dress = () => {
    const shot0 = document.querySelector(".fd-it .shot");
    const lbl0 = document.querySelector(".fd-it .lbl");
    const s0 = document.querySelector(".fd-it .lbl .sub");
    const lc = lbl0 ? getComputedStyle(lbl0) : null;
    return {
      radius: shot0 ? getComputedStyle(shot0).borderRadius : "14px",
      lbl: lc ? "font:" + lc.font + ";letter-spacing:" + lc.letterSpacing + ";color:" + lc.color + ";margin-top:" + lc.marginTop : "font:500 13px/1.3 sans-serif",
      sub: s0 ? "color:" + getComputedStyle(s0).color + ";font-weight:" + getComputedStyle(s0).fontWeight : "opacity:.42",
    };
  };
  const show = async (k) => {
    off();
    if (!k) return "off";
    const v = V[k];
    pageTo(dispU(v.pair ? v.col : (v.col % 2 ? v.col - 1 : v.col)));
    const f = await findCol(v.col);
    if (!f) return "not mounted";
    const d = dress();
    const fr = f.getBoundingClientRect();
    const w = v.pair ? 2 * COL + GAP : COL;
    const head = tiles.find((t) => t.kind === "head" && (t.col === v.col || t.col === v.col - 1));
    const headEl = head ? [...live.values()].find((e) => e.__t === head) : null;
    const top = v.top === "head" && headEl ? headEl.getBoundingClientRect().bottom + AIR_MIN : fr.top + TOP0;
    /* fitted: as tall as the screen leaves under the band, the caption
       and a floor. Otherwise the picture's own ratio. */
    const FLOOR = 24;
    const h = v.fit ? Math.max(240, Math.round(innerHeight - top - CAP_H - FLOOR)) : Math.round(w / v.ratio);
    const push = h + CAP_H + AIR_MIN;
    const cols = v.pair ? [v.col, v.col + 1] : [v.col];
    for (const el of live.values()) {
      const t = el.__t;
      if (!t || !cols.includes(t.col)) continue;
      if (t.kind === "head") { if (v.noHead) el.style.visibility = "hidden"; continue; }
      if (v.fit) { el.style.visibility = "hidden"; continue; }
      const r = el.getBoundingClientRect();
      if (r.bottom + AIR_MIN > top) {
        pushed.push([el, el.style.top]);
        el.style.top = (parseFloat(el.style.top) + push) + "px";
      }
    }
    /* a fitted column holds the one picture and does not scroll */
    if (v.fit) { locked.push([f, f.style.overflowY]); f.scrollTop = 0; f.style.overflowY = "hidden"; }
    const box = document.createElement("div");
    box.className = "mock-hero";
    box.style.cssText = "position:fixed;left:" + fr.left + "px;top:" + top + "px;width:" + w + "px;z-index:3;pointer-events:none";
    box.innerHTML = '<div style="width:100%;height:' + h + 'px;border-radius:' + d.radius + ';overflow:hidden;background:#EDE7E2">'
      + '<img src="' + v.src + '" style="width:100%;height:100%;object-fit:cover;display:block"></div>'
      + '<div style="' + d.lbl + '"><b>' + v.title + '</b> <span style="' + d.sub + '">' + v.sub + '</span></div>';
    document.body.appendChild(box);
    return k;
  };
  const bar = document.createElement("div");
  bar.id = "mockbar";
  bar.style.cssText = "position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:99;display:flex;gap:6px;align-items:center;"
    + "padding:6px 8px;border-radius:12px;background:#141414;color:#fff;font:500 12px/1 system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.25)";
  const btn = (k, label) => '<button data-k="' + k + '" style="font:inherit;border:0;border-radius:8px;padding:7px 11px;'
    + 'background:' + (k ? "rgba(255,255,255,.14)" : "transparent") + ';color:' + (k ? "#fff" : "rgba(255,255,255,.6)") + ';cursor:pointer">' + label + "</button>";
  bar.innerHTML = '<span style="opacity:.55;padding:0 6px">hero mock</span>' + Object.keys(V).map((k) => btn(k, k)).join("") + btn("", "off");
  const mark = (k) => [...bar.querySelectorAll("button")].forEach((x) => {
    x.style.background = x.dataset.k === k && k ? "rgba(255,255,255,.34)" : (x.dataset.k ? "rgba(255,255,255,.14)" : "transparent");
  });
  bar.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    mark(b.dataset.k); show(b.dataset.k || null);
  });
  const go = () => { document.body.appendChild(bar); mark("opener"); show("opener"); };
  if (window.__askReady) go(); else addEventListener("load", () => setTimeout(go, 1200));
})();
