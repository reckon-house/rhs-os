/* ── THE SALLY DESIGN SYSTEM HERO SIZZLE (2 Oct 2026) ───────────────────
   His ask: "can we do a sizzle at the top? that might help - like we did
   for ARC and DSC." So it is those reels' grammar (the mix: show how it
   works in a selling-reel way, vary the transitions, always something
   moving) played with this study's own parts:

   - the work: The Edit's homepage (the room's cover, so the first frame is
     that picture), the Lookbook scrolling, four more concepts panning,
     three emails, the Platinum Kit, the shade code, the vivids;
   - the engine, as his note on the study's engine asked ("let's just show
     the OS creating assets"): his two Sally Marketing OS demos, filmed as
     they play (scripts/lib/sally-sizzle-capture.mjs), then one brief in
     five shapes running through the seven kinds of brief;
   - every sentence is the study's (src/data/sally-design-system-case-
     study.ts), whole, or a section header with its held line, or a
     sentence's own clauses as a list; the kit, the swatches and the
     briefs are his concepts' own;
   - its grounds are the study's declared palette; its captions are the
     house's Avenir Next, and what it shows is set in Satoshi, the
     system's face.

   The engine is a copy of the A.R.C. reel's (the stage, the cuts, the
   wipe, the films, the review clock), kept apart so the tuned reels
   cannot move while this one is new.

       const p = SallySizzle.mount(box, { still, review, at });
       p.destroy()
       ?sizzle=still holds one frame

   In a room (study-panel.js asks window.SP_LIVE[k] when it makes a
   cover) it mounts over the cover's own picture, so the board's tile
   still flies into the same box and the first frame is that picture. */
(() => {
  const BASE = "/lab/sally-sizzle/", IMG = BASE + "img/", VID = BASE + "vid/", VQ = "?v=1";
  const VERSIONS = [{ id: "mix", name: "Mix", weight: "the work and the engine" }];
  const DEF = "mix";
  const current = () => ((new URLSearchParams(location.search).get("sizzle") || "").toLowerCase() === "still" ? "still" : DEF);

  /* the pictures, with their sizes (img/sizes.json). The cover is The
     Edit's homepage, the same capture as the room's cover, so the first
     frame is that picture */
  const PICS = {"cover":{"w":2880,"h":1800,"rungs":[900,1600,2400,2880]},"lookbook":{"w":2880,"h":1800,"rungs":[900,1600,2400,2880]},"colorfest":{"w":2880,"h":1800,"rungs":[900,1600,2400,2880]},"pride":{"w":2880,"h":1800,"rungs":[900,1600,2400,2880]},"diy":{"w":2880,"h":1800,"rungs":[900,1600,2400,2880]},"authority":{"w":2880,"h":1800,"rungs":[900,1600,2400,2880]},"blonde":{"w":1005,"h":1500,"rungs":[500,1000]},"violet":{"w":1166,"h":1500,"rungs":[500,1000]},"cherry":{"w":1000,"h":1500,"rungs":[500,1000]},"teal":{"w":1500,"h":1000,"rungs":[500,1000,1500]},"blue":{"w":1000,"h":1500,"rungs":[500,1000]},"copper":{"w":1001,"h":1500,"rungs":[500,1000]},"vanity":{"w":2000,"h":1334,"rungs":[500,1000,2000]},"waves":{"w":1500,"h":1000,"rungs":[500,1000,1500]},"lb-strip":{"w":2880,"h":5400,"rungs":[1440,2400,2880]},"gloss-strip":{"w":1200,"h":3600,"rungs":[600,1200]},"sale-strip":{"w":1200,"h":3600,"rungs":[600,1200]},"candy-strip":{"w":1200,"h":3600,"rungs":[600,1200]}};
  /* the films, their lengths in seconds (vid/sizes.json); both 1120 by 760 */
  const CLIPS = { email: 5.1, figma: 5.0 };
  const FILM_R = 1120 / 760;
  const dpr = () => Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const srcOf = (name, drawn) => {
    const p = PICS[name], need = drawn * dpr();
    const r = p.rungs.find((x) => x >= need) || p.rungs[p.rungs.length - 1];
    return IMG + name + "@" + r + ".webp" + VQ;
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
    /* the abstract's first sentence */
    weeks: "An email or a homepage at Sally Beauty used to take weeks to make.",
    /* "The doer's store, color expertise and education, each one a story
       the templates can tell." (The Idea), its clauses as a list */
    ideasK: "Three ideas",
    ideas: ["The doer's store", "Color expertise", "Education"],
    /* The Homepage: its header and held line, and its subhead */
    homeK: "The homepage",
    home: "The homepage leads with the looks.",
    lookbook: "The Lookbook is the one to see: every row is a person, not a packshot.",
    eleven: "Eleven concepts came out of the kit.",
    /* The Emails: its header and held line */
    mailK: "The emails",
    mail: "Four email sets share one chassis.",
    /* The Stories */
    kitK: "Shop the look",
    kit: "Going platinum takes six steps and about two hours, so the doer's store sells it as one kit for $36.99.",
    codeK: "The color code",
    code: "A level and a tone name every shade.",
    vividK: "The vivids",
    vivid: "Vivids skip the levels and want a light base, so the lightener comes first.",
    /* The Engine: its header and held line, its subhead, the Figma demo's note */
    engineK: "The engine",
    engine: "One request fills every channel.",
    form: "The request form connects the Marketing OS to the Asset Hub, the product tool and the brand guidelines.",
    figma: "The Figma plugin builds the requested emails in one press, the images first and then the copy.",
    /* Every Brief: its header and held line */
    briefsK: "Every brief",
    briefs: "Seven kinds of brief, five shapes each.",
    /* the abstract's last sentence */
    minutes: "Work that took weeks now takes minutes.",
  };
  /* his Platinum Kit (the DIY Studio concept) */
  const KIT = [["lightener", "ion", "Creme Lightener", "$8.99"], ["developer", "ion", "30 Vol Developer", "$6.49"], ["toner", "Wella", "T18 Toner", "$7.99"], ["bowl & brush", "GVP", "Bowl & Brush Set", "$4.99"], ["bond protector", "ion", "Bond Protector", "$12.99"]];
  /* his level and tone swatches (the Color Authority concept) */
  const LEVELS = ["#1a1411", "#2b1d16", "#3d2a1c", "#5a3a22", "#6e4828", "#8a5e34", "#a87c4a", "#c6a06a", "#ddc394", "#ece0bf"];
  const TONES = [["A", "#b9aa8d"], ["N", "#c2a173"], ["G", "#cfa45e"], ["C", "#c07a45"], ["R", "#a8503c"]];
  /* his eight vivid hues, warm side to cool side, and the three looks */
  const VIVIDS = ["#c4172c", "#d1377f", "#e58cb4", "#7a3fa0", "#33408f", "#2a6fdb", "#14564f", "#1f8a5b"];
  const LOOKS = [["cherry", 0, "Cherry Cola", "50% 30%"], ["violet", 3, "Electric Violet", "50% 30%"], ["teal", 6, "Deep Sea Teal", "64% 50%"]];
  /* the seven kinds of brief, each from his concepts (as the study's brief grid) */
  const BRIEFS = [
    ["Seasonal campaign", "Colorfest", "blue", "50% 25%", "Colorfest · Through July 6", "Wear your color out loud.", "#102964", "", "Shop the edit"],
    ["Category drive", "Hair color", "copper", "50% 30%", "The color experts since 1964", "Find your perfect shade.", "#8A4B22", "", "Find my shade"],
    ["Promo", "The 48-hour sale", "cherry", "50% 30%", "48 hours only · Code SAVE30", "30% off sitewide.", "#E11324", "30% off", "Shop the sale"],
    ["Cause", "Pride", "violet", "50% 30%", "Pride 2026", "Every vivid shade gives back.", "#442861", "", "How we give back"],
    ["Loyalty", "Sally Rewards", "vanity", "35% 45%", "Sally Rewards", "Members shop it first.", "#1C1413", "", "Join Rewards"],
    ["Project", "The Platinum Kit", "blonde", "50% 30%", "The Platinum Kit", "Go platinum, nothing missing.", "#E11324", "$36.99 kit", "Shop the kit"],
    ["New drop", "New arrivals", "waves", "62% 40%", "New this week", "Your brightest summer, sorted.", "#0E4043", "", "Shop new arrivals"],
  ];

  /* ── the shots ── */
  const V = {};
  const tall = (c) => c.H > c.W * 1.05;
  const narrow = (c) => c.W < 520;
  const kicker = (c, s, x, y, w, label) => {
    const k = c.el("div", "abs"); k.style.cssText = `left:${x}px;top:${y}px;width:${w}px`;
    const l = c.el("div", "lab", esc(label)); l.style.paddingBottom = "0.75em";
    const r = c.el("i", "rule"); k.appendChild(l); k.appendChild(r); s.appendChild(k);
    return { k, l, r, h: () => k.offsetHeight, play(at) { c.go(r, at); c.wipe(l, { at: at + 80, kind: "tint", dur: 520 }); } };
  };
  const glideShot = (name, o) => Object.assign({ name, ground: "photo", pics: [name], build(c, s) {
    const p = c.pic(name, [0, 0, c.W, c.H], { op: o && o.op });
    s.appendChild(p);
    const [a, b] = (o && o.glide) || [[1, 0, 0], [1.07, -1, 0]];
    c.anim(p.firstChild, [{ transform: `translate(${a[1]}%, ${a[2]}%) scale(${a[0]})` }, { transform: `translate(${b[1]}%, ${b[2]}%) scale(${b[0]})` }], { duration: (o.d || 1200) + 1100, easing: "linear", fill: "forwards" });
    return () => 0;
  } }, o || {});
  /* a statement as large as the frame takes it, the phrase that matters
     lit and the rest in grey, set on the frame's foot */
  const sayShot = (text, hi, o) => Object.assign({ name: hi, ground: "ink", d: 2000, cut: "blink", build(c, s) {
    const i = text.lastIndexOf(hi), j = i + hi.length, g = (x) => (x ? '<span class="g">' + esc(x) + "</span>" : "");
    const T = c.el("div", "say-big abs", g(text.slice(0, i)) + esc(hi) + g(text.slice(j)));
    T.style.cssText = `left:${c.pad}px;top:${c.top}px;width:${c.W - 2 * c.pad}px`;
    s.appendChild(T);
    const room = c.H - c.top - c.pad;
    const lines = (o && o.lines) || 3;
    c.fit(T, lines, Math.max(16, c.W * 0.04), Math.min(c.W * 0.11, room / lines));
    T.style.top = Math.round(c.H - c.pad - T.offsetHeight) + "px";
    if (o && o.drift) { T.style.transformOrigin = "0 100%"; c.anim(T, [{ transform: "scale(1)" }, { transform: "scale(1.03)" }], { duration: (o.d || 2000) + 700, easing: "linear", fill: "forwards" }); }
    return (t0) => c.wipe(T, { at: t0, kind: "ink", dur: 760 });
  } }, o || {});
  /* a headline across the page, then drifting while the dots do */
  const mixHead = (label, text, o) => Object.assign({ name: label, ground: "paper dots", build(c, s) {
    const K = kicker(c, s, c.pad, c.top, c.W * 0.46, label);
    const T = c.el("div", "dsp abs", esc(text)); T.style.cssText = `left:${c.pad}px;top:${c.top + K.h() + c.H * 0.06}px;width:${c.W - 2 * c.pad}px`;
    s.appendChild(T);
    c.fit(T, 2, Math.max(15, c.W * 0.04), Math.min(c.W * 0.1, (c.H - c.top - K.h() - c.pad * 2) / 2));
    c.anim(T, [{ transform: "translateY(0px)" }, { transform: "translateY(" + (-c.H * 0.03).toFixed(1) + "px)" }], { duration: (o.d || 1600) + 900, easing: "linear", fill: "forwards" });
    return (t0) => { K.play(t0); return c.wipe(T, { at: t0 + 150 }); };
  } }, o || {});
  /* a list, a row at a time between hairlines, as large as the page holds it */
  const listShot = (label, rows, o) => Object.assign({ name: label, ground: "paper dots", d: 2400, cut: "split", build(c, s) {
    const K = kicker(c, s, c.pad, c.top, c.W * 0.5, label);
    const y = c.top + K.h() + c.H * 0.05, w = Math.min(c.W - 2 * c.pad, c.W * 0.78);
    const box = c.el("div", "rows"); box.style.cssText = `left:${c.pad}px;top:${y}px;width:${w}px`;
    const rs = rows.map((t) => {
      const r = c.el("div", "rw"), tx = c.el("span", null, '<span class="blt">•</span>' + esc(t)), rl = c.el("i", "rule hair");
      r.appendChild(tx); r.appendChild(rl); box.appendChild(r); return { tx, rl };
    });
    s.appendChild(box);
    const avail = c.H - y - c.pad;
    let lo = 10, hi = Math.min(c.W * 0.09, 150), best = lo;
    for (let i = 0; i < 12; i++) { const mid = (lo + hi) / 2; box.style.fontSize = mid + "px"; if (box.offsetHeight <= avail && box.scrollWidth <= w + 1) { best = mid; lo = mid; } else hi = mid; }
    box.style.fontSize = Math.floor(best * 2) / 2 + "px";
    c.anim(box, [{ transform: "translateY(0px)" }, { transform: "translateY(" + (-c.H * 0.025).toFixed(1) + "px)" }], { duration: this.d + 800, easing: "linear", fill: "forwards" });
    return (t0) => {
      K.play(t0);
      const gap = (o && o.gap) || 260;
      rs.forEach((r, i) => { const t = t0 + 120 + i * gap; c.wipe(r.tx, { at: t, kind: "tint", dur: 520 }); c.go(r.rl, t + 60); });
      return 0;
    };
  } }, o || {});
  /* notes: a running head over a column, then a line at a time */
  const notesAt = (c, s, x, y, w, head, d) => {
    const H = c.el("div", "rh"); H.style.cssText = `left:${x}px;width:${w}px;top:${y}px`;
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

  /* the Lookbook in a window, scrolling, its notes beside it */
  const screenShot = (o) => Object.assign({ name: o.name, ground: "paper dots", pics: [o.strip], build(c, s) {
    const d = this.d, p = PICS[o.strip], nar = narrow(c);
    const sw = nar ? c.W - 2 * c.pad : c.W * 0.6;
    const sh = nar ? Math.min(sw / 1.6, c.H - c.top - c.pad * 0.6) : c.H - c.pad * 1.3;
    const sx = nar ? c.pad : c.W - c.pad - sw, sy = nar ? c.H - c.pad * 0.6 - sh : (c.H - sh) / 2;
    const win = c.el("div", "win"); win.style.cssText = `left:${sx}px;top:${sy}px;width:${sw}px;height:${sh}px`;
    const img = c.img(o.strip, sw); img.className = "page"; img.style.width = sw + "px";
    win.appendChild(img); s.appendChild(win);
    const travel = Math.max(0, sw * (p.h / p.w) - sh) * 0.88;
    c.anim(img, [{ transform: "translateY(0px)", offset: 0 }, { transform: "translateY(0px)", offset: 0.12 }, { transform: `translateY(${-travel}px)` }], { duration: d + 500, easing: "cubic-bezier(0.45, 0, 0.35, 1)", fill: "forwards" });
    if (nar) { const K = kicker(c, s, c.pad, c.top * 0.6, c.W * 0.6, o.head); return (t0) => { K.play(t0); return 0; }; }
    const N = notesAt(c, s, c.pad, c.top, sx - c.pad - c.W * 0.035, o.head, d);
    return (t0) => { N.head(t0); o.notes.forEach(([ms, n]) => N.add(t0 + ms, n)); return 0; };
  } }, o);
  /* more concepts, panning past */
  const panShot = (o) => Object.assign({ name: o.name, ground: "paper dots", pics: o.items.map((i) => i[0]), build(c, s) {
    const d = this.d;
    const K = kicker(c, s, c.pad, c.top, c.W * 0.46, o.head);
    const T = c.el("div", "mid abs", esc(o.say)); T.style.cssText = `left:${c.pad}px;top:${c.top + K.h() + c.H * 0.03}px;width:${c.W * 0.7}px`;
    s.appendChild(T);
    const y = c.top + K.h() + c.H * 0.03 + T.offsetHeight + c.H * 0.05;
    const capH = Math.max(14, c.H * 0.06), h = Math.max(50, c.H - y - c.pad - capH), w = h * 1.6, g = c.W * 0.022;
    const row = c.el("div", "reelrow"); row.style.cssText = `left:${c.pad}px;top:${y}px;height:${h + capH}px;width:${o.items.length * (w + g)}px`;
    const cards = o.items.map(([name, label], i) => {
      const card = c.el("div", "fcard rise"); card.style.cssText = `left:${i * (w + g)}px;width:${w}px;height:${h + capH}px`;
      const p = c.pic(name, [0, 0, w, h]); p.classList.add("rd"); card.appendChild(p);
      const cap = c.el("div", "lab g fcap", esc(label)); cap.style.top = (h + capH * 0.38) + "px"; card.appendChild(cap);
      row.appendChild(card); return card;
    });
    s.appendChild(row);
    const total = o.items.length * (w + g) - g, travel = Math.max(0, total - (c.W - 2 * c.pad)) + c.W * 0.04;
    c.anim(row, [{ transform: "translateX(0px)" }, { transform: `translateX(${-travel}px)` }], { duration: d + 900, easing: "linear", fill: "forwards" });
    return (t0) => { K.play(t0); c.wipe(T, { at: t0 + 120, kind: "tint" }); cards.forEach((x, i) => c.go(x, t0 + 150 + i * 110)); return 0; };
  } }, o);
  /* three emails, as cards drifting up at their own speeds */
  const mailShot = (o) => Object.assign({ name: o.name, ground: "paper dots", pics: o.strips, build(c, s) {
    const d = this.d, nar = narrow(c);
    const colW = nar ? c.W * 0.42 : c.W * 0.34;
    const K = kicker(c, s, c.pad, c.top, colW, o.head);
    const T = c.el("div", "dsp abs", esc(o.say)); T.style.cssText = `left:${c.pad}px;top:${c.top + K.h() + c.H * 0.05}px;width:${colW}px`;
    s.appendChild(T);
    c.fit(T, 4, Math.max(13, c.W * 0.028), Math.min(c.W * 0.058, 104));
    const x0 = c.pad + colW + c.W * 0.05, aw = c.W - c.pad - x0, g = c.W * 0.02, cw = (aw - 2 * g) / 3;
    const cards = o.strips.map((name, i) => {
      const p = PICS[name], ch = cw * (p.h / p.w);
      const card = c.el("div", "mcard rise"); const y = c.H * [0.1, 0.03, 0.17][i];
      card.style.cssText = `left:${x0 + i * (cw + g)}px;top:${y}px;width:${cw}px;height:${ch}px`;
      const im = c.img(name, cw); card.appendChild(im); s.appendChild(card);
      const up = Math.min(ch - (c.H - y) + c.pad, ch * 0.45) * [0.75, 1, 0.6][i];
      c.anim(card, [{ transform: "translateY(0px)" }, { transform: `translateY(${-Math.max(c.H * 0.06, up)}px)` }], { duration: d + 900, easing: "cubic-bezier(0.4, 0, 0.4, 1)", fill: "forwards" });
      return card;
    });
    return (t0) => { K.play(t0); c.wipe(T, { at: t0 + 150 }); cards.forEach((x, i) => c.go(x, t0 + 220 + i * 140)); return 0; };
  } }, o);
  /* the Platinum Kit: the look, and the kit filling the bag a row at a time */
  const kitShot = (o) => Object.assign({ name: o.name, ground: "paper dots", pics: ["blonde"], build(c, s) {
    const d = this.d, nar = narrow(c);
    const pw = Math.round(c.W * (nar ? 0.34 : 0.3)), ph = c.H - c.top - c.pad;
    const P = c.pic("blonde", [c.pad, c.top, pw, ph], { op: "50% 30%" }); P.classList.add("rd"); s.appendChild(P);
    c.anim(P.firstChild, [{ transform: "scale(1)" }, { transform: "scale(1.06)" }], { duration: d + 700, easing: "linear", fill: "forwards" });
    const x = c.pad + pw + c.W * 0.035, w = c.W - c.pad - x;
    const K = kicker(c, s, x, c.top, w, o.head);
    const S = c.el("div", "sm g abs", esc(o.say)); S.style.cssText = `left:${x}px;bottom:${c.pad}px;width:${w}px`; s.appendChild(S);
    const y = c.top + K.h() + c.H * 0.035;
    const list = c.el("div", "kit"); list.style.cssText = `left:${x}px;top:${y}px;width:${w}px`;
    const rows = KIT.map(([wd, b, n, pr]) => { const r = c.el("div", "krow rise", `<b>${esc(wd)}</b><span class="kn">${esc(b + " · " + n)}</span><span class="kp">${esc(pr)}</span>`); list.appendChild(r); return r; });
    const tot = c.el("div", "ktot rise", "<b>$36.99</b><span>The Platinum Kit · Save $4.46</span>"); list.appendChild(tot);
    s.appendChild(list);
    const avail = c.H - c.pad - S.offsetHeight - c.H * 0.035 - y;
    let lo = 6, hi = Math.min(c.W * 0.026, 40), best = lo;
    for (let i = 0; i < 12; i++) { const mid = (lo + hi) / 2; list.style.fontSize = mid + "px"; if (list.offsetHeight <= avail) { best = mid; lo = mid; } else hi = mid; }
    list.style.fontSize = Math.floor(best * 2) / 2 + "px";
    return (t0) => { K.play(t0); rows.forEach((r, i) => c.go(r, t0 + 200 + i * 230)); c.go(tot, t0 + 200 + rows.length * 230 + 120); c.wipe(S, { at: t0 + 1900, kind: "tint" }); return 0; };
  } }, o);
  /* the shade code: 8, then the ramp, then the tone, then C */
  const codeShot = (o) => Object.assign({ name: o.name, ground: "paper dots", build(c, s) {
    const nar = narrow(c);
    const K = kicker(c, s, c.pad, c.top, c.W * 0.4, o.head);
    const S = c.el("div", "mid abs", esc(o.say)); S.style.cssText = `left:${c.pad}px;bottom:${c.pad}px;width:${nar ? c.W * 0.44 : c.W * 0.38}px`; s.appendChild(S);
    const F = c.el("div", "fig sat code8 abs", '8<span class="cc fd">C</span>'); s.appendChild(F);
    const fy = c.top + K.h() + c.H * 0.04, fh = c.H - fy - c.pad - S.offsetHeight - c.H * 0.06;
    c.fitFig(F, c.W * 0.4, fh);
    F.style.left = Math.round(c.pad - c.W * 0.008) + "px"; F.style.top = Math.round(fy + (fh - F.offsetHeight) / 2) + "px";
    const C = F.querySelector(".cc");
    const x = c.pad + c.W * 0.45, w = c.W - c.pad - x;
    const R = c.el("div", "ramp"); R.style.cssText = `left:${x}px;top:0px;width:${w}px`;
    const lv = LEVELS.map((col, i) => { const sw = c.el("i", "sw rise" + (i >= 7 ? " lt" : ""), `<b>${i + 1}</b>`); sw.style.background = col; R.appendChild(sw); return sw; });
    s.appendChild(R);
    const k1 = c.el("div", "key lab"); k1.innerHTML = "<span>1 · Black</span><span>10 · Lightest</span>"; s.appendChild(k1);
    const Tn = c.el("div", "tones"); Tn.style.cssText = `left:${x}px;top:0px;width:${w * 0.62}px`;
    const tn = TONES.map(([l, col]) => { const sw = c.el("i", "sw rise lt", `<b>${l}</b>`); sw.style.background = col; Tn.appendChild(sw); return sw; });
    s.appendChild(Tn);
    /* the ramp, its key and the tones as one block, centred in the frame */
    const gapA = c.H * 0.025, gapB = c.H * 0.07;
    const blockH = R.offsetHeight + gapA + k1.offsetHeight + gapB + Tn.offsetHeight;
    const by = Math.max(c.top, (c.H - blockH) / 2);
    R.style.top = by + "px";
    k1.style.cssText = `left:${x}px;top:${by + R.offsetHeight + gapA}px;width:${w}px`;
    Tn.style.top = (by + R.offsetHeight + gapA + k1.offsetHeight + gapB) + "px";
    return (t0) => {
      K.play(t0); c.wipe(F, { at: t0 + 100, kind: "ink", dur: 700 });
      lv.forEach((sw, i) => c.go(sw, t0 + 300 + i * 55));
      c.T(t0 + 1050, () => lv[7].classList.add("up"));
      tn.forEach((sw, i) => c.go(sw, t0 + 1250 + i * 70));
      c.T(t0 + 1800, () => tn[3].classList.add("up")); c.go(C, t0 + 1850);
      c.wipe(S, { at: t0 + 2000, kind: "tint" });
      return 0;
    };
  } }, o);
  /* the vivids wall: eight hues, then the three looks over theirs */
  const vividShot = (o) => Object.assign({ name: o.name, ground: "ink", pics: LOOKS.map((l) => l[0]), build(c, s) {
    const n = VIVIDS.length, sw = c.W / n;
    const st = VIVIDS.map((col, i) => { const e = c.el("i", "stripe"); e.style.cssText = `left:${Math.floor(i * sw)}px;width:${Math.ceil(sw) + 1}px;background:${col}`; e.style.setProperty("--d", i * 55 + "ms"); s.appendChild(e); return e; });
    const ch = c.H * 0.56, cw = ch * 0.78;
    const cards = LOOKS.map(([pic, idx, label, op]) => {
      const left = Math.max(c.pad, Math.min(c.W - c.pad - cw, idx * sw + sw / 2 - cw / 2));
      const card = c.el("div", "vcard rise"); card.style.cssText = `left:${left}px;top:${c.H * 0.08}px;width:${cw}px;height:${ch}px`;
      const p = c.pic(pic, [0, 0, cw, ch], { op }); card.appendChild(p);
      card.appendChild(c.el("div", "vlab", esc(label)));
      s.appendChild(card); return card;
    });
    const tab = c.el("div", "inktab fd"); tab.style.cssText = `left:${c.pad}px;bottom:${c.pad * 0.8}px;width:${Math.min(c.W * 0.62, 760)}px`;
    const L = c.el("div", "lab", esc(o.head)), Y = c.el("div", "mid", esc(o.say)); tab.appendChild(L); tab.appendChild(Y); s.appendChild(tab);
    return (t0) => {
      st.forEach((e) => c.go(e, t0));
      cards.forEach((x, i) => c.go(x, t0 + 650 + i * 170));
      c.go(tab, t0 + 1100); c.wipe(L, { at: t0 + 1150, kind: "tint", dur: 460 }); c.wipe(Y, { at: t0 + 1250, kind: "tint", dur: 560 });
      return 0;
    };
  } }, o);
  /* the OS creating an asset: his demo, filmed, in a window, with a tab
     saying what it is */
  const filmShot = (o) => ({ name: o.name, d: o.d, cut: o.cut, dir: o.dir, ground: o.ground || "paper dots", clips: [o.clip], build(c, s) {
    const d = this.d;
    let w = c.W - 2 * c.pad, h = w / FILM_R;
    const maxH = c.H - c.pad * 1.2;
    if (h > maxH) { h = maxH; w = h * FILM_R; }
    const x = o.side === "l" ? c.pad : c.W - c.pad - w, y = (c.H - h) / 2;
    const win = c.el("div", "win"); win.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
    win.style.transformOrigin = `${(o.fx || 0.5) * 100}% ${(o.fy || 0.5) * 100}%`;
    const F = c.video(o.clip, { from: o.from || 0, rate: o.rate || 1, drawn: w });
    win.appendChild(F.v); s.appendChild(win);
    F.start(0);
    c.anim(win, [{ transform: "scale(1)" }, { transform: `scale(${o.zoom || 1.06})` }], { duration: d + 700, easing: "cubic-bezier(0.45, 0, 0.35, 1)", fill: "forwards" });
    const tw = Math.min(c.W * (narrow(c) ? 0.62 : 0.4), 640);
    const tab = c.el("div", "tab rise"); tab.style.cssText = `${o.side === "l" ? "right" : "left"}:${c.pad}px;bottom:${c.pad}px;width:${tw}px`;
    const L = c.el("div", "lab", esc(o.lab)), Y = c.el("div", "say", esc(o.say)); tab.appendChild(L); tab.appendChild(Y); s.appendChild(tab);
    return (t0) => { c.go(tab, t0 + (o.tabAt || 500)); c.wipe(L, { at: t0 + (o.tabAt || 500) + 80, kind: "tint", dur: 460 }); c.wipe(Y, { at: t0 + (o.tabAt || 500) + 200, kind: "tint", dur: 560 }); return 0; };
  } });
  /* one brief in five shapes, then the seven kinds of brief in turn */
  const SHAPES = [["sq", 1, "1:1"], ["v45", 0.8, "4:5"], ["v916", 0.5625, "9:16"], ["h169", 16 / 9, "16:9"], ["h31", 3, "3:1"]];
  const tileHTML = (kind, B, src) => {
    const [, , , pos, kick, head, acc, chip, cta] = B;
    const ch = chip ? `<span class="chip2" style="background:${acc}">${esc(chip)}</span>` : "";
    const im = `<img src="${src}" alt="" style="object-position:${pos}">`;
    const tag = `<span class="shp">${SHAPES.find((x) => x[0] === kind)[2]}</span>`;
    if (kind === "sq") return `<span class="ph2">${im}</span><div class="card2"><p class="k2">${esc(kick)}</p><p class="h2">${esc(head)}</p>${ch}</div>${tag}`;
    if (kind === "v45") return `<span class="ph2 top">${im}</span><div class="under"><p class="k2">${esc(kick)}</p><p class="h2">${esc(head)}</p><span class="pill2">${esc(cta)}</span></div>${tag}`;
    if (kind === "v916") return `<span class="ph2">${im}</span><div class="card2 low"><p class="k2">${esc(kick)}</p><p class="h2">${esc(head)}</p><span class="pill2">${esc(cta)}</span></div>${tag}`;
    if (kind === "h169") return `<span class="ph2 half">${im}</span><div class="side2"><p class="k2">${esc(kick)}</p><p class="h2">${esc(head)}</p>${ch}<span class="pill2">${esc(cta)}</span></div>${tag}`;
    return `<div class="msg2" style="background:${acc}"><p class="k2">${esc(kick)}</p><p class="h2">${esc(head)}</p><span class="lk2">${esc(cta)} →</span></div><span class="ph2 half">${im}</span>${tag}`;
  };
  const briefShot = (o) => Object.assign({ name: o.name, ground: "paper dots", pics: [...new Set(BRIEFS.map((b) => b[2]))], build(c, s) {
    const K = kicker(c, s, c.pad, c.top, c.W * 0.4, o.head);
    const T = c.el("div", "dsp abs", esc(o.say)); T.style.cssText = `left:${c.pad}px;top:${c.top + K.h() + c.H * 0.025}px;width:${c.W * 0.5}px`; s.appendChild(T);
    c.fit(T, 2, Math.max(12, c.W * 0.022), Math.min(c.W * 0.04, 64));
    const B = c.el("div", "lab abs"); B.style.cssText = `right:${c.pad}px;top:${c.top}px;text-align:right`; s.appendChild(B);
    const y0 = c.top + K.h() + c.H * 0.025 + T.offsetHeight + c.H * 0.045, aw = c.W - 2 * c.pad, ah = c.H - y0 - c.pad * 0.8, g = Math.max(4, c.W * 0.012);
    /* row one: 16:9, 1:1, 9:16; row two: 3:1, 4:5. Each row as wide as
       the frame, then both scaled down together until they fit its height */
    const ROWA = ["h169", "sq", "v916"], ROWB = ["h31", "v45"];
    const rr = (keys) => keys.reduce((a, k) => a + SHAPES.find((x) => x[0] === k)[1], 0);
    let hA = (aw - 2 * g) / rr(ROWA), hB = (aw - g) / rr(ROWB);
    const k2 = Math.min(1, (ah - g) / (hA + hB)); hA *= k2; hB *= k2;
    const tiles = [];
    let x = c.pad;
    ROWA.forEach((k) => { const r = SHAPES.find((q) => q[0] === k)[1]; tiles.push([k, x, y0, hA * r, hA]); x += hA * r + g; });
    x = c.pad;
    ROWB.forEach((k) => { const r = SHAPES.find((q) => q[0] === k)[1]; tiles.push([k, x, y0 + hA + g, hB * r, hB]); x += hB * r + g; });
    const els = tiles.map(([k, tx, ty, tw, th]) => {
      const t = c.el("div", "t " + k + " rise"); t.style.cssText = `left:${tx}px;top:${ty}px;width:${tw}px;height:${th}px`;
      const inn = c.el("div", "tin"); t.appendChild(inn); s.appendChild(t);
      return { t, inn, k, tw };
    });
    const set = (i) => {
      const b = BRIEFS[i];
      B.textContent = b[0] + " · " + b[1];
      els.forEach((e) => { e.inn.innerHTML = tileHTML(e.k, b, srcOf(b[2], e.tw * (e.k === "h169" || e.k === "h31" ? 0.5 : 1))); });
    };
    set(0);
    return (t0) => {
      K.play(t0); c.wipe(T, { at: t0 + 120 }); c.go(B, t0); els.forEach((e, i) => c.go(e.t, t0 + 260 + i * 120));
      for (let i = 1; i < BRIEFS.length; i++) {
        const at = t0 + (o.firstSwap || 1500) + (i - 1) * (o.swap || 320);
        c.T(at - 110, () => els.forEach((e) => e.t.classList.add("swap")));
        c.T(at, () => { set(i); els.forEach((e) => e.t.classList.remove("swap")); });
      }
      return 0;
    };
  } }, o);
  /* the mark: Sally's wordmark */
  const markShot = (o) => Object.assign({ name: "The mark", ground: "scarlet", build(c, s) {
    const w = Math.round(Math.min(c.W * 0.42, 560)), h = Math.round(w / 4);
    const m = c.el("i", "mark fd"); m.style.cssText = `left:${(c.W - w) / 2}px;top:${(c.H - h) / 2}px;width:${w}px;height:${h}px`;
    s.appendChild(m);
    c.anim(m, [{ transform: "scale(0.94)" }, { transform: "scale(1.02)" }], { duration: (o.d || 1400) + 600, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" });
    return (t0) => { c.go(m, t0); return 0; };
  } }, o || {});

  V.mix = {
    shots: [
      glideShot("cover", { name: "Cover", d: 1400, glide: [[1, 0, 0], [1.07, 0, -1]] }),
      sayShot(SAY.weeks, "used to take weeks to make.", { name: "Weeks", d: 2200, cut: "band", drift: true }),
      listShot(SAY.ideasK, SAY.ideas, { name: "Three ideas", d: 2200, cut: "split" }),
      screenShot({ name: "The homepage", d: 3900, cut: "mask", strip: "lb-strip", head: SAY.homeK,
        notes: [[250, { lab: "Concept 11 · The Lookbook", say: SAY.home }], [1700, { lab: "Every row", say: SAY.lookbook }]] }),
      panShot({ name: "More concepts", d: 2300, cut: "whip", head: "The concepts", say: SAY.eleven,
        items: [["colorfest", "Concept 4 · Colorfest"], ["pride", "Concept 6 · Pride"], ["diy", "Concept 7 · The DIY Studio"], ["authority", "Concept 8 · The Color Authority"]] }),
      mailShot({ name: "The emails", d: 3100, cut: "shutter", head: SAY.mailK, say: SAY.mail, strips: ["gloss-strip", "sale-strip", "candy-strip"] }),
      kitShot({ name: "Shop the look", d: 3500, cut: "mask", head: SAY.kitK, say: SAY.kit }),
      codeShot({ name: "8C", d: 2900, cut: "blink", head: SAY.codeK, say: SAY.code }),
      vividShot({ name: "The vivids", d: 2700, cut: "slat", head: SAY.vividK, say: SAY.vivid }),
      mixHead(SAY.engineK, SAY.engine, { name: "The engine", d: 2000, cut: "pinch", ground: "ink" }),
      filmShot({ name: "Brief to email", d: 5000, cut: "split", clip: "email", side: "r", fx: 0.62, fy: 0.45, zoom: 1.05, lab: "Campaign board · Create Email", say: SAY.form }),
      filmShot({ name: "Email to Figma", d: 4800, cut: "whip", clip: "figma", side: "l", fx: 0.35, fy: 0.4, zoom: 1.06, lab: "Figma plugin", say: SAY.figma, ground: "ink" }),
      briefShot({ name: "Every brief", d: 3700, cut: "push", head: SAY.briefsK, say: SAY.briefs, firstSwap: 1500, swap: 330 }),
      sayShot(SAY.minutes, "now takes minutes.", { name: "Minutes", d: 2400, cut: "blink", ground: "scarlet", drift: true, lines: 2 }),
      markShot({ d: 1600, cut: "mask" }),
    ],
    loopCut: "burn",
    poster: 12,
  };

  /* ── Satoshi, the system's face, for the shadow root: a face added to
     the document is one every shadow tree can use ── */
  let satP = null;
  const satoshi = () => {
    if (satP) return satP;
    try {
      const f = new FontFace("Satoshi SZL", "url(/fonts/Satoshi-Variable.woff2) format('woff2')", { weight: "300 900", style: "normal", display: "swap" });
      document.fonts.add(f);
      satP = f.load().catch(() => null);
    } catch (e) { satP = Promise.resolve(); }
    return satP;
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
    let ver = opts.version || current();
    /* ?sizzle=still holds one frame of the mix */
    const stillQ = ver === "still"; if (stillQ) ver = DEF;
    const still = !review && (!!opts.still || stillQ || matchMedia("(prefers-reduced-motion: reduce)").matches);
    let dead = false, playing = false, seen = false, idx = -1, cur = null, curS = null, gen = 0;
    const timers = new Set(), loops = new Set(), anims = new Set();
    /* ── the review clock (as the A.R.C. reel's): time is a number a
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
      ctx.pad = Math.round(ctx.W * 0.044); ctx.top = Math.round(Math.max(Math.min(34, ctx.H * 0.12), ctx.H * 0.085));
    };

    /* ── film. One <video> per clip, made once and kept: it loads while
       it waits, is set to its first frame, and a shot takes it into its
       window (a media element keeps what it has loaded when it moves) ── */
    const pool = new Map();
    const rungFor = () => ((ctx.W || 700) * dpr() > 1150 ? 1600 : 1000);
    const atTime = (v, x) => { if (v.readyState >= 1) { try { v.currentTime = x; } catch (e) { /* not yet */ } } else v.addEventListener("loadedmetadata", () => { try { v.currentTime = x; } catch (e) { /* gone */ } }, { once: true }); };
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
    const filmsTo = (t) => films.forEach((r) => {
      if (!r.v.isConnected) return;
      const len = r.v.duration || CLIPS[r.name] || 0;
      let x = r.born == null ? r.from : r.from + (Math.max(0, t - r.born) * r.rate) / 1000;
      if (len) x = Math.min(x, len - 0.034);
      if (r.v.readyState < 2 || Math.abs((r.v.currentTime || 0) - x) > 0.002) holds.push(seekTo(r.v, x));
    });

    ctx.go = (node, at) => { if (!node) return; if (still) { node.classList.add("now"); return; } T(at, () => { void node.offsetWidth; node.classList.add("go"); }); };
    ctx.img = (name, drawn) => {
      const im = el("img"); im.alt = ""; im.decoding = "async"; im.draggable = false;
      im.src = srcOf(name, drawn);
      if (review && im.decode) holds.push(im.decode().catch(() => null));
      return im;
    };
    ctx.pic = (name, box, o) => {
      o = o || {};
      const [x, y, w, h] = box;
      const b = el("div", "pic");
      b.style.cssText = `left:${Math.round(x)}px;top:${Math.round(y)}px;width:${Math.round(w)}px;height:${Math.round(h)}px`;
      if (o.op) b.style.setProperty("--op", o.op);
      b.appendChild(ctx.img(name, coverW(name, w, h)));
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
    /* ── the cuts: the room's mask, band and blink, and Faux Reel's whip,
       split, flash, pinch, shutter, slat, push, burn ── */
    const RE = "cubic-bezier(0.7, 0, 0.15, 1)";
    const dark = (x) => x && /ink|scarlet|violet|teal/.test(x.ground);
    const cut = (kind, prev, prevS, node, S) => {
      const put = (under) => (under ? shots.insertBefore(node, prev) : shots.appendChild(node));
      const drop = (ms) => T(ms, () => { if (prev && prev.isConnected) prev.remove(); });
      const over = (cls, bc) => { const e = el("div", "cutc " + cls); if (bc) e.style.setProperty("--bc", bc); stage.appendChild(e); return e; };
      const contra = (x) => (dark(x) ? "#F4F3F1" : "#1C1413");
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
          put(true); const p = over("pinch", S.bc || "#1C1413"); p.innerHTML = "<i></i><i></i>";
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
      list.forEach((S) => (S.pics || []).forEach((n) => urls.add(srcOf(n, coverW(n, Math.max(ctx.W * 0.6, 300), Math.max(ctx.H * 0.6, 200))))));
      urls.add(srcOf("cover", ctx.W));
      if (!still) list.forEach((S) => (S.clips || []).forEach((n) => film(n)));
      return Promise.all([...urls].map((u) => new Promise((res) => { const im = new Image(); im.onload = im.onerror = () => res(); im.src = u; }))).then(() => null);
    };
    const fonts = () => Promise.all([satoshi()].concat(document.fonts ? ["600 40px 'Avenir Next'", "500 16px 'Avenir Next'", "400 14px 'Avenir Next'", "700 10px 'Avenir Next'"].map((f) => document.fonts.load(f).catch(() => null)) : []));

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
      const from = n > 0 && t - starts[n] < 1500 ? n - 1 : n;
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
  window.SP_LIVE["sally-design-system"] = (box, fig, o) => {
    const p = mount(box, { still: o && o.still });
    return () => p.destroy();
  };
  window.SallySizzle = { mount, versions: VERSIONS, current };
})();
