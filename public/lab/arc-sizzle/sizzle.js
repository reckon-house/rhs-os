/* ── THE A.R.C. HERO SIZZLE (30 Sept 2026) ──────────────────────────────
   His ask, while away: "can we work on a sizzle reel like we did for DSC
   for ARC? the code base for it is also on the drive so you should be
   able to grab screens, styling, code, etc to really build it out."

   So it is the DSC mix's grammar (dsc-sizzle/sizzle.js, his pick there
   and his notes on it: "show how it actually works but in a SAAS sizzle
   type of way", "vary the transitions", "even when it slows down
   something should always be moving") played with A.R.C.'s own parts:

   - its phones play the real app. Most are his simulator recordings of
     the shipped iOS build on the Sample Home (arc-portfolio-demo), the
     rest films of the same client running offline, for the screens the
     recordings don't reach: the photo scan, the coverage card,
     Documents (scripts/lib/arc-sizzle-capture.mjs, then
     arc-sizzle-img.mjs). The scan's five items, their categories and
     values are the production model's own output for that photograph;
   - every sentence is the study's (src/data/arc-case-study.ts), as a
     whole sentence, a section header with its held line, or a column's
     list, except where his review notes gave the words (the capture
     note, 1 Oct); no model is named, since the study names one the code
     no longer calls;
   - its grounds are the study's declared palette: cream, black, olive,
     and the two warm ones, the Warm Register and Oak Tan (his notes,
     1 Oct: "change the color to something warm" where the sage was).
     Its mark is his own outlined lockup;
   - its frame is portrait. The room's A.R.C. cover is the board's tall
     phone, so the reel is laid out tall (notes beside a phone, a pair
     with its names over it) and falls back to the DSC reel's layouts
     where a frame is wide.

   The engine is a copy of the DSC reel's (the stage, the cuts, the
   review clock), kept apart so the tuned DSC reel cannot move while this
   one is new, with one addition: film. A phone's <video> is set to the
   reel's clock under review (every frame sought, the clock held until it
   lands, as a phone's loading holds it) and simply played otherwise.

       const p = ARCSizzle.mount(box, { still, review, at });
       p.destroy()
       ?sizzle=still holds one frame

   In a room (study-panel.js asks window.SP_LIVE[k] when it makes a
   cover) it mounts over the cover's own picture, so the board's tile
   still flies into the same box and the first frame is that picture. */
(() => {
  const BASE = "/lab/arc-sizzle/", IMG = BASE + "img/", VID = BASE + "vid/", VQ = "?v=2";
  const VERSIONS = [{ id: "mix", name: "Mix", weight: "the app in use" }];
  const IDS = VERSIONS.map((v) => v.id);
  const DEF = "mix";
  const current = () => ((new URLSearchParams(location.search).get("sizzle") || "").toLowerCase() === "still" ? "still" : DEF);

  /* the pictures, with their sizes (sizes.json). The cover is the board's
     own lead, the one the room's cover shows, so the first frame is that
     picture exactly */
  const PICS = {
    cover: { src: "/lab/board-thumbs/hp/rhs-arc-app-project-select-phone.webp", w: 1536, h: 2082 },
    kitchen: { w: 1890, h: 2363, rungs: [900, 1400, 1890] },
  };
  /* the films, their lengths in seconds (sizes.json) */
  const CLIPS = { scan: 7.6, home: 6.1, item: 5.7, cover: 6.15, docs: 3.8, reports: 4.8 };
  const srcOf = (name, drawn) => {
    const p = PICS[name]; if (p.src) return p.src;
    const need = drawn * Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const r = p.rungs.find((x) => x >= need) || p.rungs[p.rungs.length - 1];
    return IMG + name + "@" + r + ".webp";
  };
  const coverW = (name, bw, bh) => { const p = PICS[name]; return Math.max(bw, bh * (p.w / p.h)); };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const splitWords = (node) => {
    const words = [];
    const walk = (n) => [...n.childNodes].forEach((c) => {
      if (c.nodeType === 3) {
        const parts = c.nodeValue.split(/(\s+)/).filter(Boolean); if (!parts.length) return;
        const fr = document.createDocumentFragment();
        parts.forEach((p) => {
          if (/^\s+$/.test(p)) { fr.appendChild(document.createTextNode(p)); return; }
          const w = document.createElement("span"); w.className = "w"; w.textContent = p; fr.appendChild(w); words.push(w);
        });
        c.replaceWith(fr);
      } else if (c.nodeType === 1 && !c.classList.contains("w") && !c.classList.contains("bd")) walk(c);
    });
    walk(node);
    return words;
  };
  const linesOf = (words) => {
    const lines = []; let cur = null;
    words.forEach((w) => { const t = w.offsetTop; if (!cur || Math.abs(t - cur.top) > 3) { cur = { top: t, words: [] }; lines.push(cur); } cur.words.push(w); });
    return lines;
  };

  /* ── what each line says, in one place, so it can be read and checked
     against the study together ── */
  const SAY = {
    /* the problem section's header and its held line */
    never: "Most homeowners have never written down what they own.",
    paperwork: "The paperwork",
    /* "You open a spreadsheet, walk room to room, describe each item, look
       up what it would cost to replace, photograph it, and attach the
       receipt." (The Insurance Reality), its clauses as a list */
    chores: ["Open a spreadsheet", "Walk room to room", "Describe each item", "Look up what it would cost to replace", "Photograph it", "Attach the receipt"],
    hours: "Done properly for an average home, that takes 40+ hours, and hardly anyone finishes.",
    /* the turn, plainly (his note, 1 Oct: "'show the camera the room...'
       this kinda feels like AI-talk ... there's a more straightforward
       way to say this"): the abstract's own sentence, under the column
       that says how */
    turnK: "The vision layer",
    turn: "A.R.C. works from the camera.",
    /* the method section's header and its held line */
    photo: "One photo of a room comes back as a list of what is in it.",
    /* his words (1 Oct: "maybe for image capture it's more about the
       technology? 'the app uses computer vision and needs no tuning...'"),
       with the study's "no special hardware" kept */
    capture: "The app uses computer vision and needs no tuning or special hardware.",
    names: "A.R.C. names each item, puts a value on it, and sorts it into a category.",
    replace: "The estimate is what the item would cost to replace today, which is the number insurance runs on.",
    /* "value first", his word over "money first" (1 Oct), in the study too */
    money: "Every screen puts the value first: what you own, what it is worth, and whether it is covered.",
    rooms: "Each room is its own archive.",
    finK: "Financial intelligence",
    compares: "A.R.C. compares what you own against your policy limit.",
    gap: "Any gap between your documented total and your coverage shows as a dollar amount.",
    limit: "The policy limit A.R.C. uses is your personal property limit, which you enter yourself.",
    /* the study's whole-home figure since his notes (1 Oct: "73 item
       home seems low - it's probably 73 items per room ... let's
       calculate something higher", and his home's sixteen rooms): 1,168
       items at the app's pace, 73 items in under 30 minutes */
    minutes: "Documenting a 1,168-item home in A.R.C. takes under eight hours.",
    weeks: "Ten weeks after the first idea, A.R.C. was live on the App Store.",
  };

  /* ── the shots ── */
  const V = {};
  const kicker = (c, s, x, y, w, label) => {
    const k = c.el("div", "abs"); k.style.cssText = `left:${x}px;top:${y}px;width:${w}px`;
    const l = c.el("div", "lab", esc(label)); l.style.paddingBottom = "0.75em";
    const r = c.el("i", "rule"); k.appendChild(l); k.appendChild(r); s.appendChild(k);
    return { k, l, r, h: () => k.offsetHeight, play(at) { c.go(r, at); c.wipe(l, { at: at + 80, kind: "tint", dur: 520 }); } };
  };
  const tall = (c) => c.H > c.W * 1.05;
  const glideShot = (name, o) => Object.assign({ name, ground: "photo", pics: [name], build(c, s) {
    const p = c.pic(name, [0, 0, c.W, c.H], { op: o && o.op });
    s.appendChild(p);
    const [a, b] = (o && o.glide) || [[1, 0, 0], [1.07, -1, 0]];
    c.anim(p.firstChild, [{ transform: `translate(${a[1]}%, ${a[2]}%) scale(${a[0]})` }, { transform: `translate(${b[1]}%, ${b[2]}%) scale(${b[0]})` }], { duration: (o.d || 1200) + 1100, easing: "linear", fill: "forwards" });
    return () => 0;
  } }, o || {});
  /* a statement as large as the frame takes it, wrapped down, the phrase
     that matters lit and the rest in grey, set on the frame's foot */
  const sayShot = (text, hi, o) => Object.assign({ name: hi, ground: "ink", d: 2000, cut: "blink", build(c, s) {
    const i = text.lastIndexOf(hi), j = i + hi.length, g = (x) => (x ? '<span class="g">' + esc(x) + "</span>" : "");
    const T = c.el("div", "say-big abs", g(text.slice(0, i)) + esc(hi) + g(text.slice(j)));
    T.style.cssText = `left:${c.pad}px;top:${c.top}px;width:${c.W - 2 * c.pad}px`;
    s.appendChild(T);
    const room = c.H - c.top - c.pad;
    const lines = (o && o.lines) || (tall(c) ? 6 : 4);
    c.fit(T, lines, Math.max(18, c.W * 0.05), Math.min(c.W * (tall(c) ? 0.16 : 0.15), room / lines));
    T.style.top = Math.round(c.H - c.pad - T.offsetHeight) + "px";
    if (o && o.drift) { T.style.transformOrigin = "0 100%"; c.anim(T, [{ transform: "scale(1)" }, { transform: "scale(1.03)" }], { duration: (o.d || 2000) + 700, easing: "linear", fill: "forwards" }); }
    return (t0) => c.wipe(T, { at: t0, kind: "ink", dur: 760 });
  } }, o || {});
  /* a figure as wide as the frame holds, its sentence under it */
  const figShot = (fig, say, o) => Object.assign({ name: fig, ground: "ink", d: 2300, cut: "blink", build(c, s) {
    const S = c.el("div", "mid g lt abs", esc(say)); S.style.cssText = `left:${c.pad}px;bottom:${c.pad}px;width:${Math.min(c.W - 2 * c.pad, tall(c) ? c.W * 0.86 : c.W * 0.56, 560)}px`;
    s.appendChild(S);
    /* the name at the head, left: a room's Close sits top right */
    const N = c.el("div", "lab g abs fd", "A.R.C."); N.style.cssText = `left:${c.pad}px;top:${c.top}px`;
    s.appendChild(N);
    const F = c.el("div", "fig abs", esc(fig)); F.style.left = Math.round(c.pad - c.W * 0.006) + "px";
    s.appendChild(F);
    const room = c.H - c.top - c.pad - S.offsetHeight - c.H * 0.05;
    c.fitFig(F, (c.W - 2 * c.pad) * 0.96, Math.min(room, c.H * 0.6));
    const fs = parseFloat(F.style.fontSize) || 100, drop = /[gjpqy]/.test(fig) ? fs * 0.16 : 0;
    F.style.top = Math.round(c.H - c.pad - S.offsetHeight - c.H * 0.045 - drop - F.offsetHeight) + "px";
    if (o && o.drift) { F.style.transformOrigin = "0 100%"; c.anim(F, [{ transform: "scale(1)" }, { transform: "scale(1.045)" }], { duration: (o.d || 2300) + 700, easing: "linear", fill: "forwards" }); }
    return (t0) => { c.wipe(F, { at: t0, kind: "ink", dur: 760 }); c.wipe(S, { at: t0 + 420, kind: "tint" }); c.go(N, t0 + 700); return 0; };
  } }, o || {});
  /* a headline across the page, then drifting while the dots do */
  const mixHead = (label, text, o) => Object.assign({ name: label, ground: "paper dots", build(c, s) {
    const K = kicker(c, s, c.pad, c.top, c.W * (tall(c) ? 0.62 : 0.46), label);
    const T = c.el("div", "dsp abs", esc(text)); T.style.cssText = `left:${c.pad}px;top:${c.top + K.h() + c.H * 0.05}px;width:${c.W - 2 * c.pad}px`;
    s.appendChild(T);
    c.fit(T, tall(c) ? 5 : 2, Math.max(15, c.W * 0.04), Math.min(tall(c) ? 112 : 84, c.W * (tall(c) ? 0.16 : 0.09)));
    c.anim(T, [{ transform: "translateY(0px)" }, { transform: "translateY(" + (-c.H * 0.03).toFixed(1) + "px)" }], { duration: (o.d || 1600) + 900, easing: "linear", fill: "forwards" });
    return (t0) => { K.play(t0); return c.wipe(T, { at: t0 + 150 }); };
  } }, o || {});
  /* the paperwork, as the study lists it: a row at a time between
     hairlines, as large as the page holds them all */
  const listShot = (label, rows, o) => Object.assign({ name: label, ground: "paper dots", d: 3000, cut: "split", build(c, s) {
    const K = kicker(c, s, c.pad, c.top, c.W * (tall(c) ? 0.62 : 0.5), label);
    const y = c.top + K.h() + c.H * 0.05, w = Math.min(c.W - 2 * c.pad, tall(c) ? c.W : c.W * 0.7);
    const box = c.el("div", "rows"); box.style.cssText = `left:${c.pad}px;top:${y}px;width:${w}px`;
    const rs = rows.map((t) => {
      const r = c.el("div", "rw"), tx = c.el("span", null, '<span class="blt">•</span>' + esc(t)), rl = c.el("i", "rule hair");
      r.appendChild(tx); r.appendChild(rl); box.appendChild(r); return { tx, rl };
    });
    s.appendChild(box);
    /* the size at which every row fits the page */
    const avail = c.H - y - c.pad;
    /* set a size down from filling the page, so the list sits in air
       (his note, 1 Oct: "make the font smaller here so there's some
       negative space vs it basically filling the screen") */
    let lo = 10, hi = Math.min(34, c.W * (tall(c) ? 0.05 : 0.04)), best = lo;
    for (let i = 0; i < 12; i++) { const mid = (lo + hi) / 2; box.style.fontSize = mid + "px"; if (box.offsetHeight <= avail) { best = mid; lo = mid; } else hi = mid; }
    box.style.fontSize = Math.floor(best * 2) / 2 + "px";
    c.anim(box, [{ transform: "translateY(0px)" }, { transform: "translateY(" + (-c.H * 0.025).toFixed(1) + "px)" }], { duration: this.d + 800, easing: "linear", fill: "forwards" });
    return (t0) => {
      K.play(t0);
      const gap = (o && o.gap) || 210;
      rs.forEach((r, i) => { const t = t0 + 120 + i * gap; c.wipe(r.tx, { at: t, kind: "tint", dur: 520 }); c.go(r.rl, t + 60); });
      return t0 + 120 + (rs.length - 1) * gap + 700;
    };
  } }, o || {});
  /* the mark: his lockup, a.r.c. over "archive ready cloud" */
  const markShot = (o) => Object.assign({ name: "The mark", ground: "warm", build(c, s) {
    const w = Math.round(Math.min(c.W * 0.6, 520)), h = Math.round(w / 2.95);
    const m = c.el("i", "mark fd"); m.style.cssText = `left:${(c.W - w) / 2}px;top:${(c.H - h) / 2}px;width:${w}px;height:${h}px`;
    s.appendChild(m);
    c.anim(m, [{ transform: "scale(0.94)" }, { transform: "scale(1.02)" }], { duration: (o.d || 1400) + 600, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" });
    return (t0) => { c.go(m, t0); return 0; };
  } }, o || {});

  /* ── the app, running ── */
  /* the simulator's phone: a 440 by 956 point screen in an eleven-pixel
     bezel, drawn at its own size and scaled */
  const DW = 462, DH = 978;
  const vphone = (c, s, cx, cy, h, pages) => {
    const k = h / DH, w = DW * k;
    const cam = c.el("div", "cam");
    cam.style.cssText = `left:${Math.round(cx - w / 2)}px;top:${Math.round(cy - h / 2)}px;width:${Math.round(w)}px;height:${Math.round(h)}px`;
    const dev = c.el("div", "dev"); dev.style.transform = "scale(" + k.toFixed(5) + ")";
    const scr = c.el("div", "scr"); dev.appendChild(scr);
    cam.appendChild(dev); s.appendChild(cam);
    const P = { cam, dev, scr, k, w, h, x: cx - w / 2, y: cy - h / 2, pages: [] };
    pages.forEach((pg, i) => {
      const box = c.el("div", "vpg" + (i ? " off" : ""));
      const F = c.video(pg.clip, { from: pg.from || 0, rate: pg.rate || 1 });
      box.appendChild(F.v); scr.appendChild(box);
      P.pages.push({ box, F, d: pg.d, tag: pg.tag });
    });
    return P;
  };
  /* inside a phone: the next section pushes in from the right and the
     last gives way, as a phone navigates */
  const flip = (c, P, i, dur) => {
    dur = dur || 540;
    const nx = P.pages[i]; if (!nx) return;
    const cur = P.pages.find((pg) => pg !== nx && !pg.box.classList.contains("off"));
    nx.box.classList.remove("off");
    c.anim(nx.box, [{ transform: "translateX(100%)" }, { transform: "translateX(0%)" }], { duration: dur, easing: "cubic-bezier(0.7, 0, 0.15, 1)" });
    if (cur) {
      c.anim(cur.box, [{ transform: "translateX(0%)", filter: "brightness(1)" }, { transform: "translateX(-30%)", filter: "brightness(0.9)" }], { duration: dur, easing: "cubic-bezier(0.7, 0, 0.15, 1)", fill: "forwards" });
      c.T(dur + 20, () => cur.box.classList.add("off"));
    }
  };
  /* the camera: a list of poses, each a scale and the point of the phone
     (a share of its box) it carries toward a point of the frame, joined
     on one soft curve */
  const camera = (c, P, d, poses) => {
    const pose = (p) => {
      if (p.fx == null) return "translate(0px, 0px) scale(" + p.s + ")";
      const Fx = P.w * p.fx, Fy = P.h * p.fy, Cx = P.w / 2, Cy = P.h / 2;
      const nx = P.x + Cx + p.s * (Fx - Cx), ny = P.y + Cy + p.s * (Fy - Cy);
      const k = p.k == null ? 1 : p.k;
      return "translate(" + ((p.tx - nx) * k).toFixed(1) + "px, " + ((p.ty - ny) * k).toFixed(1) + "px) scale(" + p.s + ")";
    };
    return c.anim(P.cam, poses.map((p) => ({ transform: pose(p), offset: p.t, easing: "cubic-bezier(0.45, 0, 0.35, 1)" })), { duration: d, fill: "forwards" });
  };
  /* notes: a running head over a column, then a line at a time, drifting
     up the whole while */
  const notesAt = (c, s, x, y, w, head, d) => {
    const H = c.el("div", "rh"); H.style.cssText = `left:${x}px;right:auto;width:${w}px;top:${y}px`;
    const a = c.el("div", "lab", esc(head)), r = c.el("i", "rule"); H.appendChild(a); H.appendChild(r); s.appendChild(H);
    const col = c.el("div", "notes"); col.style.cssText = `left:${x}px;top:${y + H.offsetHeight + c.H * 0.045}px;width:${w}px`;
    s.appendChild(col);
    c.anim(col, [{ transform: "translateY(0px)" }, { transform: "translateY(" + (-c.H * 0.03).toFixed(1) + "px)" }], { duration: d + 900, easing: "linear", fill: "forwards" });
    return {
      head(at) { c.go(r, at); c.wipe(a, { at: at + 60, kind: "tint", dur: 460 }); },
      add(at, o) {
        const n = c.el("div", "note"), rl = c.el("i", "rule hair"); n.appendChild(rl);
        let L = null, Y = null;
        if (o.lab) { L = c.el("div", "lab", esc(o.lab)); n.appendChild(L); }
        if (o.say) { Y = c.el("div", "say", esc(o.say)); n.appendChild(Y); }
        n.style.visibility = "hidden"; col.appendChild(n);
        c.T(at, () => { n.style.visibility = ""; });
        c.go(rl, at);
        if (L) c.wipe(L, { at: at + 60, kind: "tint", dur: 460 });
        if (Y) c.wipe(Y, { at: at + 140, kind: "tint", dur: 560 });
        return n;
      },
    };
  };
  /* where a phone and its notes stand. Tall (the room's cover): the notes
     in a column at one side, the phone filling the rest at the frame's
     height, past the edge where it must. Wide: as the DSC reel sets it */
  const layout = (c, side) => {
    if (!tall(c)) {
      const h = c.H * 1.0, w = (DW * h) / DH, cx = side === "r" ? c.W * 0.72 : c.W * 0.29;
      return { cx, cy: c.H * 0.54, h, w, nx: side === "r" ? c.pad : c.W * 0.56, nw: c.W * 0.4 };
    }
    /* a little under the frame's height, so the whole screen is there to
       read and the camera has room to pan it */
    const h = c.H * 0.94, w = (DW * h) / DH, cy = c.H * 0.52;
    const nw = c.W < 420 ? 128 : Math.max(150, c.W * 0.29), gap = Math.max(12, c.W * 0.035);
    if (side === "r") {
      const x0 = c.pad + nw + gap, free = c.W - c.pad - x0;
      return { cx: free >= w ? x0 + free / 2 : x0 + w / 2, cy, h, w, nx: c.pad, nw };
    }
    const x1 = c.W - c.pad - nw - gap, free = x1 - c.pad;
    return { cx: free >= w ? c.pad + free / 2 : x1 - w / 2, cy, h, w, nx: c.W - c.pad - nw, nw };
  };
  /* one phone and its notes: the film plays from the cut, the camera
     leans in on what the film is doing, the notes say it */
  const appShot = (o) => ({ name: o.name, d: o.d, cut: o.cut, dir: o.dir, ground: o.ground || "paper dots", clips: [o.clip], build(c, s) {
    const d = this.d, L = layout(c, o.side || "r");
    const P = vphone(c, s, L.cx, L.cy, L.h, [{ clip: o.clip, from: o.from, rate: o.rate }]);
    P.pages[0].F.start(0);
    const N = notesAt(c, s, L.nx, c.top, L.nw, o.head, d);
    camera(c, P, d + 700, o.cam(L));
    return (t0) => { N.head(t0); o.notes.forEach(([ms, n]) => N.add(t0 + ms, n)); return 0; };
  } });
  /* a pair's names: a list over each phone where the frame is tall, on
     the frame's margins beside them where it is wide; every section the
     phone will show is set, the one on screen in ink and the rest grey */
  const labels = (c, s, names, o) => {
    const g = c.el("div", "plab lab" + (o.v ? " v" + (o.right ? " r" : "") : ""));
    const items = names.map((n) => { const it = c.el("span", "pl-i g"); it.textContent = n; g.appendChild(it); return it; });
    g.style.visibility = "hidden"; s.appendChild(g);
    if (o.v) {
      const x = Math.max(3, Math.min(c.pad, o.edge - g.offsetWidth * 1.8));
      g.style[o.right ? "right" : "left"] = x.toFixed(1) + "px";
      g.style[o.right ? "top" : "bottom"] = c.pad + "px";
    } else { g.style.left = Math.round(o.x) + "px"; g.style.top = Math.round(o.y) + "px"; }
    let on = -1;
    return (text, at) => c.T(Math.max(0, at), () => {
      const k = Math.max(0, names.indexOf(text)), it = items[k], first = g.style.visibility === "hidden";
      const b = c.el("i", "bd go"); b.style.visibility = "visible"; (first ? g : it).appendChild(b);
      c.T(330, () => { if (on >= 0) items[on].classList.add("g"); it.classList.remove("g"); on = k; g.style.visibility = ""; });
      c.T(720, () => b.remove());
    });
  };
  /* two phones side by side, each going through its own sections */
  const pairShot = (o) => ({ name: o.name, d: o.d, cut: o.cut, dir: o.dir, ground: o.ground || "paper dots", clips: [...o.left, ...o.right].map((x) => x.clip), build(c, s) {
    const d = this.d;
    let L, R, tl, tr;
    const names = (list) => list.map((x) => x.tag).filter(Boolean);
    if (tall(c)) {
      const w = c.W * 0.465, h = (w * DH) / DW, xl = c.W * 0.252, xr = c.W * 0.748, lh = c.H * 0.045;
      const topL = c.top + lh, topR = Math.min(c.H - h * 0.9, topL + c.H * 0.1);
      L = vphone(c, s, xl, topL + h / 2, h, o.left);
      R = vphone(c, s, xr, topR + h / 2, h, o.right);
      tl = labels(c, s, names(o.left), { x: xl - w / 2 + w * 0.06, y: c.top });
      tr = labels(c, s, names(o.right), { x: xr - w / 2 + w * 0.06, y: topR - lh + c.top * 0 });
    } else {
      const h = c.H * 1.2, w = (DW * h) / DH, edge = c.W * 0.285 - (w / 2) * 1.035;
      L = vphone(c, s, c.W * 0.285, c.H * 0.6, h, o.left);
      R = vphone(c, s, c.W * 0.715, c.H * 0.42, h, o.right);
      tl = labels(c, s, names(o.left), { v: true, edge }); tr = labels(c, s, names(o.right), { v: true, right: true, edge });
    }
    const drift = (P, a, b) => c.anim(P.cam, [{ transform: "translateY(" + (a * c.H).toFixed(1) + "px) scale(1)" }, { transform: "translateY(" + (b * c.H).toFixed(1) + "px) scale(1.035)" }], { duration: d + 900, easing: "linear", fill: "forwards" });
    drift(L, 0.02, -0.03); drift(R, -0.015, 0.03);
    const run = (P, t0, tag) => {
      let t = 0;
      P.pages.forEach((pg, i) => {
        const at = t0 + t;
        if (i) c.T(at, () => flip(c, P, i));
        pg.F.start(i ? at : 0);
        if (pg.tag) tag(pg.tag, at - (i ? 120 : 0));
        t += pg.d || d;
      });
    };
    return (t0) => { run(L, t0, tl); run(R, t0 + (o.lag || 260), tr); return 0; };
  } });

  /* the scan: a photo of the living room, the analysing card, the five
     items back to review. In the film: the tap at 0.4s, the card from
     0.65s, the items at 3.3s, then down to Save */
  const scanShot = appShot({ name: "The scan", d: 6600, cut: "mask", clip: "scan", head: "Photo Archive", side: "r",
    cam: (L) => [
      { t: 0, s: 1 },
      { t: 0.45, s: 1.02, fx: 0.5, fy: 0.5, tx: L.cx, ty: L.cy - L.h * 0.01 },
      { t: 1, s: 1.05, fx: 0.5, fy: 0.5, tx: L.cx, ty: L.cy - L.h * 0.075 },
    ],
    notes: [[200, { lab: "Image capture", say: SAY.capture }], [1300, { lab: "Vision processing", say: SAY.names }], [3500, { lab: "Value estimation", say: SAY.replace }]] });
  /* the whole home, then its rooms */
  const homeShot = appShot({ name: "The home", d: 4800, cut: "whip", clip: "home", head: "Dashboard", side: "l",
    cam: (L) => [{ t: 0, s: 1 }, { t: 1, s: 1.05, fx: 0.5, fy: 0.5, tx: L.cx, ty: L.cy - L.h * 0.05 }],
    notes: [[250, { lab: "Dashboard view", say: SAY.money }], [2500, { lab: "Room view", say: SAY.rooms }]] });
  /* the coverage card, then Coverage Check */
  const coverShot = appShot({ name: "The coverage gap", d: 4700, cut: "shutter", clip: "cover", head: "Insights", side: "r",
    cam: (L) => [{ t: 0, s: 1 }, { t: 0.5, s: 1.03, fx: 0.5, fy: 0.5, tx: L.cx, ty: L.cy - L.h * 0.02 }, { t: 1, s: 1.05, fx: 0.5, fy: 0.5, tx: L.cx, ty: L.cy - L.h * 0.06 }],
    notes: [[250, { lab: "Personal Items Coverage", say: SAY.gap }], [2600, { lab: "The policy limit", say: SAY.limit }]] });

  V.mix = {
    shots: [
      glideShot("cover", { name: "Cover", d: 1400, glide: [[1, 0, 0], [1.07, 0, -1]] }),
      sayShot(SAY.never, "written down what they own.", { name: "Never written down", d: 2200, cut: "band", drift: true }),
      listShot(SAY.paperwork, SAY.chores, { d: 2600, cut: "split", gap: 185 }),
      figShot("40+ hours", SAY.hours, { d: 2000, cut: "blink", ground: "warm", drift: true }),
      mixHead(SAY.turnK, SAY.turn, { d: 2200, cut: "band" }),
      scanShot,
      sayShot(SAY.photo, "a list of what is in it.", { name: "A list", d: 2100, cut: "blink", drift: true }),
      glideShot("kitchen", { name: "The counter", d: 1100, cut: "mask", glide: [[1.08, 0, 1], [1.16, 0, -1.5]] }),
      homeShot,
      mixHead(SAY.finK, SAY.compares, { d: 2200, cut: "pinch", ground: "oak" }),
      coverShot,
      sayShot(SAY.minutes, "under eight hours.", { name: "Under eight hours", d: 2300, cut: "blink", ground: "olive", drift: true }),
      pairShot({ name: "Items, documents, reports", d: 6400, cut: "flash", lag: 260,
        left: [{ clip: "item", d: 3400, tag: "Item" }, { clip: "docs", d: 3000, tag: "Document AI" }],
        right: [{ clip: "reports", tag: "Reports" }] }),
      figShot("10 weeks", SAY.weeks, { d: 2500, cut: "blink", drift: true }),
      markShot({ d: 1600, cut: "mask" }),
    ],
    loopCut: "burn",
    poster: 5,
  };

  /* ── the player ── */
  const LIVE = new Set();
  function mount(host, opts) {
    opts = opts || {};
    const wrap = document.createElement("div"); wrap.className = "szl-host";
    wrap.style.cssText = "position:absolute;inset:0;z-index:2;display:block;pointer-events:none";
    host.appendChild(wrap);
    const sr = wrap.attachShadow({ mode: "open" });
    const link = document.createElement("link"); link.rel = "stylesheet"; link.href = BASE + "sizzle.css" + VQ;
    sr.appendChild(link);
    const stage = document.createElement("div"); stage.className = "stage"; sr.appendChild(stage);
    const park = document.createElement("div"); park.className = "vpark"; sr.appendChild(park);
    let shots = null;
    const cssReady = new Promise((res) => { link.addEventListener("load", res, { once: true }); link.addEventListener("error", res, { once: true }); });

    const review = !!opts.review;
    const still = !review && (!!opts.still || matchMedia("(prefers-reduced-motion: reduce)").matches);
    let ver = opts.version || current();
    let dead = false, playing = false, seen = false, idx = -1, cur = null, curS = null, gen = 0;
    const timers = new Set(), loops = new Set(), anims = new Set();
    /* ── the review clock (as the DSC reel's): time is a number a
       timeline moves. Every timer waits in vq for it, every animation is
       held and set to it, and every film is sought to it ── */
    let vnow = 0, vseq = 0, holds = [];
    const vq = [], vt = new Map(), films = new Set();
    const T = review
      ? (ms, fn) => { const my = gen; vq.push({ at: vnow + Math.max(0, ms), seq: vseq++, fn: () => { if (!dead && my === gen) fn(); } }); }
      : (ms, fn) => { const my = gen; const id = setTimeout(() => { timers.delete(id); if (!dead && my === gen) fn(); }, still ? 0 : Math.max(0, ms)); timers.add(id); return id; };
    const stop = () => { timers.forEach(clearTimeout); timers.clear(); loops.forEach(clearInterval); loops.clear(); vq.length = 0; gen++; };
    const halt = () => { stop(); anims.forEach((a) => { try { a.cancel(); } catch (e) { /* gone */ } }); anims.clear(); vt.clear(); films.clear(); holds = []; pool.forEach((r) => { try { r.v.pause(); } catch (e) { /* gone */ } }); };

    const el = (t, c, html) => { const e = document.createElement(t); if (c) e.className = c; if (html != null) e.innerHTML = html; return e; };
    const ctx = { el, T, get instant() { return still; } };
    const anim = (e, frames, o) => {
      if (!e || !e.animate || still) return null;
      const a = e.animate(frames, o); anims.add(a);
      if (review) { a.pause(); vt.set(a, vnow); a.currentTime = 0; }
      a.finished.then(() => anims.delete(a), () => anims.delete(a));
      return a;
    };
    ctx.anim = anim;
    ctx.now = review ? () => vnow : () => performance.now();
    ctx.every = review
      ? (ms, fn) => { const my = gen; const tick = () => { if (dead || my !== gen) return; if (fn() !== false) T(ms, tick); }; T(ms, tick); }
      : (ms, fn) => { const my = gen; const id = setInterval(() => { if (dead || my !== gen || fn() === false) { clearInterval(id); loops.delete(id); } }, ms); loops.add(id); return id; };
    const size = () => {
      ctx.W = stage.clientWidth; ctx.H = stage.clientHeight;
      ctx.pad = Math.round(ctx.W * 0.044); ctx.top = Math.round(Math.max(34, ctx.H * (ctx.H > ctx.W * 1.05 ? 0.06 : 0.085)));
    };

    /* ── film. One <video> per clip, made once and kept: it loads while
       it waits, is set to its first frame, and a shot takes it into its
       phone (a media element keeps what it has loaded when it moves). The
       width is the smaller one where a phone is drawn small enough to
       keep it at half its pixels ── */
    const pool = new Map();
    const rungFor = () => ((440 * ctx.H) / DH) * Math.max(1, Math.min(2, window.devicePixelRatio || 1)) > 560 ? 880 : 540;
    const atTime = (v, x) => { if (v.readyState >= 1) { try { v.currentTime = x; } catch (e) { /* not yet */ } } else v.addEventListener("loadedmetadata", () => { try { v.currentTime = x; } catch (e) { /* gone */ } }, { once: true }); };
    /* under review: sought, and the clock held until the frame is there */
    const seekTo = (v, x) => new Promise((res) => {
      if (v.readyState >= 2 && !v.seeking && Math.abs(v.currentTime - x) < 0.0005) { res(); return; }
      let done = false;
      const fin = () => { if (done) return; done = true; clearTimeout(to); v.removeEventListener("seeked", chk); v.removeEventListener("loadeddata", chk); res(); };
      const chk = () => { if (v.readyState >= 2 && !v.seeking) fin(); };
      const to = setTimeout(fin, 3000);
      v.addEventListener("seeked", chk); v.addEventListener("loadeddata", chk);
      atTime(v, x);
      if (v.readyState >= 2 && !v.seeking) setTimeout(chk, 0);
    });
    const film = (name) => {
      const rung = rungFor();
      let r = pool.get(name);
      if (r && r.rung === rung) return r;
      if (r) { try { r.v.pause(); r.v.removeAttribute("src"); r.v.load(); r.v.remove(); } catch (e) { /* gone */ } }
      const v = el("video", "vp");
      v.muted = true; v.defaultMuted = true; v.playsInline = true; v.loop = false; v.disablePictureInPicture = true;
      v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("aria-hidden", "true"); v.setAttribute("tabindex", "-1");
      v.preload = still ? "none" : "auto";
      v.poster = VID + name + "@" + rung + ".webp" + VQ;
      if (!still) v.src = VID + name + "@" + rung + ".mp4" + VQ;
      r = { v, name, rung, from: 0, rate: 1, born: null };
      pool.set(name, r); park.appendChild(v);
      return r;
    };
    ctx.video = (name, o) => {
      o = o || {};
      const r = film(name), v = r.v;
      r.from = o.from || 0; r.rate = o.rate || 1; r.born = null;
      if (!still) { try { v.pause(); } catch (e) { /* gone */ } }
      if (review) { films.add(r); holds.push(seekTo(v, r.from)); } else if (!still) atTime(v, r.from);
      return {
        v,
        start(at) {
          T(at || 0, () => {
            r.born = ctx.now();
            if (review || still) return;
            v.playbackRate = r.rate; const p = v.play(); if (p && p.catch) p.catch(() => { /* held, as a paused film is */ });
          });
        },
      };
    };
    /* every film set to where it is at t */
    const filmsTo = (t) => films.forEach((r) => {
      if (!r.v.isConnected) return;
      const len = r.v.duration || CLIPS[r.name] || 0;
      let x = r.born == null ? r.from : r.from + (Math.max(0, t - r.born) * r.rate) / 1000;
      if (len) x = Math.min(x, len - 0.034);
      if (r.v.readyState < 2 || Math.abs((r.v.currentTime || 0) - x) > 0.002) holds.push(seekTo(r.v, x));
    });

    ctx.go = (node, at) => { if (!node) return; if (still) { node.classList.add("now"); return; } T(at, () => { void node.offsetWidth; node.classList.add("go"); }); };
    ctx.pic = (name, box, o) => {
      o = o || {};
      const [x, y, w, h] = box;
      const b = el("div", "pic");
      b.style.cssText = `left:${Math.round(x)}px;top:${Math.round(y)}px;width:${Math.round(w)}px;height:${Math.round(h)}px`;
      if (o.op) b.style.setProperty("--op", o.op);
      const im = el("img"); im.alt = ""; im.decoding = "async"; im.draggable = false;
      im.src = srcOf(name, coverW(name, w, h));
      b.appendChild(im);
      /* under review a picture is waited for until it is drawn */
      if (review && im.decode) holds.push(im.decode().catch(() => null));
      return b;
    };
    ctx.wipe = (node, o) => {
      o = o || {};
      const kind = o.kind || "ink", dur = o.dur || (kind === "ink" ? 760 : 600), gap = o.gap || (kind === "ink" ? 95 : 70), at = o.at || 0;
      node.querySelectorAll(":scope > .bd").forEach((b) => b.remove());
      node.classList.remove("go", "now");
      const words = node.querySelector(".w") ? [...node.querySelectorAll(".w")] : splitWords(node);
      node.classList.add("wp");
      if (still) { node.classList.add("now"); return 0; }
      const lines = linesOf(words);
      lines.forEach((ln, li) => {
        const x0 = Math.min(...ln.words.map((w) => w.offsetLeft)), x1 = Math.max(...ln.words.map((w) => w.offsetLeft + w.offsetWidth));
        const hh = Math.max(...ln.words.map((w) => w.offsetHeight)) || 12;
        const b = el("i", "bd " + (kind === "ink" ? "solid" : kind));
        b.style.cssText = `left:${x0 - 2}px;top:${ln.top}px;width:${x1 - x0 + 4}px;height:${hh}px`;
        b.style.setProperty("--d", li * gap + "ms"); b.style.setProperty("--bd", dur + "ms");
        node.appendChild(b);
        ln.words.forEach((w) => w.style.setProperty("--d", Math.round(li * gap + dur * 0.5) + "ms"));
      });
      T(at, () => { void node.offsetWidth; node.classList.add("go"); });
      return at + (lines.length - 1) * gap + dur;
    };
    ctx.fit = (node, maxLines, lo, hi) => {
      const lh = parseFloat(getComputedStyle(node).lineHeight) / parseFloat(getComputedStyle(node).fontSize) || 1;
      let best = lo;
      for (let i = 0; i < 14; i++) {
        const mid = (lo + hi) / 2; node.style.fontSize = mid + "px";
        const ok = node.scrollWidth <= node.clientWidth + 1 && node.offsetHeight <= mid * lh * maxLines + 2;
        if (ok) { best = mid; lo = mid; } else hi = mid;
      }
      node.style.fontSize = Math.floor(best * 2) / 2 + "px";
    };
    ctx.fitFig = (node, maxW, maxH) => {
      node.style.fontSize = "100px";
      const w = node.scrollWidth || 1;
      const fs = Math.min((maxW / w) * 100, maxH / 0.84);
      node.style.fontSize = Math.max(28, Math.floor(fs)) + "px";
    };

    const seq = () => (V[ver] ? V[ver].shots : []);
    /* ── the cuts, the DSC reel's: the room's mask, band and blink, and
       Faux Reel's whip, split, flash, pinch, shutter, slat, push, burn ── */
    const RE = "cubic-bezier(0.7, 0, 0.15, 1)";
    const dark = (x) => x && /ink|olive/.test(x.ground);
    const cut = (kind, prev, prevS, node, S) => {
      const put = (under) => (under ? shots.insertBefore(node, prev) : shots.appendChild(node));
      const drop = (ms) => T(ms, () => { if (prev && prev.isConnected) prev.remove(); });
      const over = (cls, bc) => { const e = el("div", "cutc " + cls); if (bc) e.style.setProperty("--bc", bc); stage.appendChild(e); return e; };
      const contra = (x) => (dark(x) ? "#F1F0EE" : "#000");
      const at = typeof S.at === "function" ? S.at(ctx) : S.at || ctx.focus || { x: ctx.W / 2, y: ctx.H / 2 };
      switch (kind) {
        case "mask":
          node.classList.add("cm"); put();
          T(20, () => { void node.offsetWidth; node.classList.add("go"); });
          T(760, () => { drop(0); node.classList.remove("cm", "go"); });
          return 380;
        case "blink": {
          put(); drop(0);
          const b = el("i", "blink"); stage.appendChild(b); T(200, () => b.remove());
          return 60;
        }
        case "whip": {
          put(); const d = 640, dir = S.dir || 1;
          anim(prev, [{ transform: "translateX(0%)" }, { transform: `translateX(${-100 * dir}%)` }], { duration: d, easing: RE, fill: "forwards" });
          anim(node, [{ transform: `translateX(${100 * dir}%)` }, { transform: "translateX(0%)" }], { duration: d, easing: RE });
          const seam = el("i", "seam" + (dir < 0 ? " r" : "")); node.appendChild(seam); T(d + 20, () => seam.remove());
          drop(d + 30);
          return 330;
        }
        case "split": {
          put(); const y = Math.round(Math.max(0, Math.min(ctx.H - 2, at.y))), b = ctx.H - y - 2;
          anim(node, [
            { clipPath: `inset(${y}px ${ctx.W}px ${b}px 0px)`, easing: "cubic-bezier(0.45, 0, 0.2, 1)" },
            { clipPath: `inset(${y}px 0px ${b}px 0px)`, offset: 0.4, easing: RE },
            { clipPath: "inset(0px 0px 0px 0px)" },
          ], { duration: 860 });
          drop(880);
          return 400;
        }
        case "flash": {
          put(true); const f = over("flash");
          anim(f, [{ opacity: 0 }, { opacity: 1, offset: 0.4 }, { opacity: 1, offset: 0.6 }, { opacity: 0 }], { duration: 360 });
          drop(150); T(380, () => f.remove());
          return 170;
        }
        case "pinch": {
          put(true); const p = over("pinch", S.bc || "#000"); p.innerHTML = "<i></i><i></i>";
          [...p.children].forEach((x, i) => {
            const off = i ? "101%" : "-101%";
            anim(x, [{ transform: `translateY(${off})`, easing: RE }, { transform: "translateY(0%)", offset: 0.45 }, { transform: "translateY(0%)", offset: 0.55, easing: RE }, { transform: `translateY(${off})` }], { duration: 780, fill: "forwards" });
          });
          drop(370); T(800, () => p.remove());
          return 430;
        }
        case "shutter":
          put(); anim(node, [{ clipPath: "inset(50% 0% 50% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)" }], { duration: 660, easing: RE });
          drop(680);
          return 260;
        case "slat": {
          put(true); const n = 7, sl = over("slats", S.bc || contra(prevS));
          for (let i = 0; i < n; i++) sl.appendChild(el("i"));
          [...sl.children].forEach((x, i) => anim(x, [
            { transform: "scaleY(0)", transformOrigin: "50% 0%", easing: RE },
            { transform: "scaleY(1)", transformOrigin: "50% 0%", offset: 0.46 },
            { transform: "scaleY(1)", transformOrigin: "50% 100%", offset: 0.5, easing: RE },
            { transform: "scaleY(0)", transformOrigin: "50% 100%" },
          ], { duration: 860, delay: i * 36, fill: "both" }));
          drop(430 + 36 * n); T(900 + 36 * n, () => sl.remove());
          return 560;
        }
        case "push": {
          put(true);
          prev.style.transformOrigin = at.x + "px " + at.y + "px";
          anim(prev, [{ transform: "scale(1)", opacity: 1 }, { transform: "scale(2.1)", opacity: 1, offset: 0.62 }, { transform: "scale(3.2)", opacity: 0 }], { duration: 600, easing: "cubic-bezier(0.55, 0, 0.85, 0.4)", fill: "forwards" });
          anim(node, [{ transform: "scale(1.14)" }, { transform: "scale(1)" }], { duration: 1000, delay: 360, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" });
          drop(620);
          return 420;
        }
        case "burn": {
          put(); const w = over("burnw");
          anim(node, [{ opacity: 0, filter: "brightness(1.5) saturate(2.2) contrast(1.4)", transform: "scale(1.02)" }, { opacity: 1, filter: "brightness(1.35) saturate(2) contrast(1.3)", transform: "scale(1.015)", offset: 0.22 }, { opacity: 1, filter: "brightness(1) saturate(1) contrast(1)", transform: "scale(1)" }], { duration: 820, easing: "ease-out" });
          anim(w, [{ opacity: 0 }, { opacity: 0.95, offset: 0.16 }, { opacity: 0.3, offset: 0.4 }, { opacity: 0 }], { duration: 820 });
          drop(210); T(840, () => w.remove());
          return 200;
        }
        default: {
          put(true);
          const b = el("i", "fband"); b.style.setProperty("--bc", contra(prevS)); b.style.setProperty("--bd", "900ms");
          stage.appendChild(b);
          drop(450); T(940, () => b.remove());
          return 520;
        }
      }
    };
    const show = (n, cutKind) => {
      if (dead) return;
      const list = seq(); if (!list.length) return;
      const S = list[n % list.length];
      const node = el("div", "shot " + S.ground);
      const prev = cur, prevS = curS;
      let t0 = 0;
      if (!prev || cutKind === "none" || still) { shots.replaceChildren(node); }
      else t0 = cut(cutKind, prev, prevS, node, S);
      const run = S.build(ctx, node);
      if (run) run(t0);
      cur = node; curS = S; idx = n % list.length;
      if (playing && !still) advance(S.d);
    };
    const advance = (delay) => T(delay, () => {
      const list = seq(); if (!list.length) return;
      const nx = (idx + 1) % list.length;
      show(nx, nx === 0 ? V[ver].loopCut || "band" : list[nx].cut || "band");
    });

    /* the pictures before the first frame; the films start loading and
       are waited for only by the review clock */
    const preload = () => {
      const list = seq(), urls = new Set();
      list.forEach((S) => (S.pics || []).forEach((n) => urls.add(srcOf(n, coverW(n, Math.max(ctx.W, 300), Math.max(ctx.H, 400))))));
      if (!still) list.forEach((S) => (S.clips || []).forEach((n) => film(n)));
      return Promise.all([...urls].map((u) => new Promise((res) => { const im = new Image(); im.onload = im.onerror = () => res(); im.src = u; }))).then(() => null);
    };
    const fonts = () => document.fonts ? Promise.all(["600 40px 'Avenir Next'", "500 16px 'Avenir Next'", "400 14px 'Avenir Next'", "700 10px 'Avenir Next'"].map((f) => document.fonts.load(f).catch(() => null))) : Promise.resolve();

    /* a clean stage; the films go back to wait where they load */
    const restage = () => {
      halt(); cur = null; curS = null; idx = -1; ctx.focus = null;
      pool.forEach((r) => { if (r.v.parentNode !== park) park.appendChild(r.v); });
      stage.replaceChildren();
      shots = el("div", "shots"); stage.appendChild(shots);
    };

    /* ── review: the reel laid out on one timeline ── */
    let starts = [], total = 0, running = false, rate = 1, lastReal = 0, resumeAt = +opts.at || 0, lock = Promise.resolve(), target = null, seeking = false;
    const tickers = new Set();
    const emit = () => tickers.forEach((cb) => { try { cb(vnow); } catch (e) { /* the listener's own trouble */ } });
    const layoutTimes = () => { starts = []; total = 0; seq().forEach((S) => { starts.push(total); total += S.d; }); };
    const exclusive = (fn) => (lock = lock.then(fn, fn));
    const sweep = (t) => {
      let list = [];
      try { list = sr.getAnimations(); } catch (e) { list = []; }
      list.forEach((a) => {
        if (!vt.has(a)) { vt.set(a, t); try { a.pause(); } catch (e) { /* gone */ } }
        const ct = Math.max(0, t - vt.get(a));
        try { if (a.currentTime !== ct) a.currentTime = ct; } catch (e) { /* gone */ }
      });
      filmsTo(t);
    };
    const settle = async () => { while (holds.length) { const h = holds; holds = []; await Promise.all(h.map((q) => Promise.resolve(q).catch(() => null))); await null; } };
    const advanceTo = async (t) => {
      for (;;) {
        if (dead) return;
        if (holds.length) { await settle(); continue; }
        let k = -1;
        for (let i = 0; i < vq.length; i++) { const it = vq[i]; if (it.at <= t && (k < 0 || it.at < vq[k].at || (it.at === vq[k].at && it.seq < vq[k].seq))) k = i; }
        if (k < 0) break;
        const it = vq.splice(k, 1)[0];
        if (it.at > vnow) { vnow = it.at; sweep(vnow); }
        it.fn(); sweep(vnow);
      }
      if (t > vnow) vnow = t;
      sweep(vnow);
      await settle();
    };
    const doSeek = async (t) => {
      if (!total) return;
      t = Math.max(0, Math.min(total - 1, t));
      let n = 0; while (n + 1 < starts.length && starts[n + 1] <= t) n++;
      if (curS && t >= vnow && n <= idx + 1) { await advanceTo(t); return; }
      const from = n > 0 && (t - starts[n] < 1500 || seq()[n].needsPrev) ? n - 1 : n;
      restage(); vnow = starts[from]; playing = true;
      show(from, "none");
      await advanceTo(t);
    };
    const requestSeek = (t) => {
      target = t;
      if (!seeking) {
        seeking = true;
        exclusive(async () => { while (target != null) { const x = target; target = null; await doSeek(x); } seeking = false; emit(); });
      }
      return lock;
    };
    const nextFrame = (f) => (document.hidden ? setTimeout(f, 16) : requestAnimationFrame(f));
    const frame = async () => {
      if (!running || dead) return;
      const now = performance.now(), dt = Math.min(80, now - lastReal); lastReal = now;
      if (!seeking) await exclusive(async () => { const t = vnow + dt * rate; if (t >= total) await doSeek(0); else await advanceTo(t); });
      emit();
      if (running && !dead) nextFrame(frame);
    };

    const begin = () => {
      if (ver === "still" && !still) ver = DEF;
      if (!V[ver]) { halt(); cur = null; curS = null; idx = -1; stage.replaceChildren(); stage.classList.add("off"); return; }
      stage.classList.remove("off");
      size();
      restage();
      if (review) { layoutTimes(); requestSeek(resumeAt); return; }
      playing = false;
      if (still) { show(opts.shot != null ? opts.shot : V[ver].poster || 0, "none"); return; }
      show(0, "none");
      if (seen) play();
    };
    let ready = false;
    function play() {
      if (dead || still || playing || !ready || !V[ver]) return;
      playing = true;
      const S = seq()[idx < 0 ? 0 : idx];
      advance(idx <= 0 ? Math.max(900, (S ? S.d : 1500) - 800) : 700);
    }
    function pause() { if (!playing) return; playing = false; stop(); pool.forEach((r) => { try { r.v.pause(); } catch (e) { /* gone */ } }); }

    let io = null;
    if (review) seen = true;
    else if ("IntersectionObserver" in window) {
      io = new IntersectionObserver((es) => es.forEach((e) => { seen = e.isIntersecting && e.intersectionRatio >= 0.3; if (seen) play(); else pause(); }), { threshold: [0, 0.3, 0.6] });
      io.observe(wrap);
    } else seen = true;
    setTimeout(() => {
      if (dead || seen) return;
      const r = wrap.getBoundingClientRect();
      if (r.width && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth) { seen = true; play(); }
    }, 1400);

    let lastW = 0, rzT = 0;
    const ro = "ResizeObserver" in window ? new ResizeObserver(() => {
      clearTimeout(rzT);
      rzT = setTimeout(() => {
        if (dead || !ready) return;
        const w = stage.clientWidth; if (!w) return;
        if (!lastW) { lastW = w; return; }
        if (Math.abs(w - lastW) / lastW < 0.06) return;
        if (review) { lastW = w; resumeAt = vnow; begin(); return; }
        lastW = w; const was = playing; begin(); if (was) play();
      }, 120);
    }) : null;
    if (ro) ro.observe(wrap);

    Promise.all([cssReady, fonts()]).then(() => new Promise((res) => {
      const tryIt = (n) => { if (dead) return res(); if (stage.clientWidth > 40 || n > 60) return res(); setTimeout(() => tryIt(n + 1), 50); };
      tryIt(0);
    })).then(() => { size(); return preload(); }).then(() => {
      if (dead) return;
      ready = true; lastW = stage.clientWidth;
      begin();
    });

    const api = {
      el: wrap, fixed: !!opts.fixed,
      get version() { return ver; },
      destroy() {
        dead = true; running = false; halt(); if (io) io.disconnect(); if (ro) ro.disconnect(); LIVE.delete(api);
        pool.forEach((r) => { try { r.v.pause(); r.v.removeAttribute("src"); r.v.load(); } catch (e) { /* gone */ } }); pool.clear();
        wrap.remove();
      },
      review: review ? {
        shots: () => seq().map((S, i) => ({ i, name: S.name || "Shot " + (i + 1), d: S.d, start: starts[i] })),
        total: () => total,
        time: () => vnow,
        playing: () => running,
        speed: () => rate,
        play() { if (running || dead) return; running = true; lastReal = performance.now(); nextFrame(frame); emit(); },
        pause() { running = false; emit(); },
        seek: (t) => requestSeek(t),
        rebuild: () => { curS = null; return requestSeek(vnow); },
        rate(r) { rate = r; emit(); },
        onTick(cb) { tickers.add(cb); return () => tickers.delete(cb); },
        idle: () => lock,
      } : null,
    };
    LIVE.add(api);
    return api;
  }

  window.SP_LIVE = window.SP_LIVE || {};
  window.SP_LIVE.arc = (box, fig, o) => {
    const p = mount(box, { still: o && o.still });
    return () => p.destroy();
  };
  window.ARCSizzle = { mount, versions: VERSIONS, current };
})();
