/* ── THE DSC HERO SIZZLE (28 Sept 2026) ─────────────────────────────────
   His brief: "a hero sizzle with a LITTLE bit of a demo feel, ya know?
   like i want someone to hit the case study here in the content column
   and see this play and get what the app does but also have it feel like
   a selling/sizzle reel." Then, back from a break: "i honestly think
   they might need SOME text in each - maybe a few versions are lighter
   and heavier ... let's push and do something editorial that fits the
   look of the site!"

   His dsc-sizzle project (a Remotion film, DSC's own voice: heavy caps
   on black, "SAYS IT. CHECKS IT. BOOKS IT.") is the source of the idea,
   not of the look. These are made of the room's own parts instead: its
   wipe (a band over a line and off it, a picture opening from the left
   on the same curve), its type on two weights at five sizes, its black
   field of figures, its two-tone lead, its kicker under a rule, its
   paper, and the index's dot grid under a page of type so it still
   reads as a frame on the room's paper. DSC's own palette is ink, paper
   and greys, so the brand and the house meet without either giving way.

   Five versions, lightest words to heaviest:
   - caption: photographs and screens, cut on the left-to-right mask,
     with a paper tab in the corner (the shelves' credit strip) naming
     each and saying it in one sentence. The checks tick on black;
   - figures: the room's black field as a reel. A figure as large as the
     frame holds, its sentence small under it, hard cuts to the
     photographs between. The one tap is pressed;
   - headline: a magazine opener per beat. One sentence set large and
     wiped in, the screen or photograph opening beside it;
   - spread: the room in miniature, turning pages. A running head, a
     two-tone lead in the right half, pictures and captions in the left;
   - transcript: the demo as type. The athlete's real words typed, their
     AI's real tool calls ticking, the request landing on the owner's
     console and approved in one tap, then the owner's week said out
     loud. Every line is from the real exchanges the study's live demos
     replay (public/lab/dsc-demos, NOTES.md), the em dashes aside.

   Rules it keeps: every sentence comes from the study (src/data/
   dsc-case-study.ts) or those real exchanges, as a whole sentence; no em
   dash; a picture shows at most half its pixels (the rungs in img/ are
   made by scripts/lib/dsc-sizzle-img.mjs); none of the admin screens
   with real registrants' names; Avenir Next only; it plays only while it
   is on screen, and under reduced motion it holds one composed frame.

       const p = DSCSizzle.mount(box, { version, still, fixed });
       p.set(version)   p.destroy()
       DSCSizzle.set(version)   every player that is not fixed follows
       ?sizzle=caption|figures|headline|spread|transcript|still

   In a room (study-panel.js asks window.SP_LIVE[k] when it makes a
   cover) it mounts over the cover's own picture, so the board's tile
   still flies into the same box and the first frame is that picture;
   a row of the versions sits under it, as the looks rows did, until he
   picks one. */
(() => {
  const BASE = "/lab/dsc-sizzle/", IMG = BASE + "img/", VQ = "?v=8";
  const VERSIONS = [
    { id: "caption", name: "Caption", weight: "light" },
    { id: "figures", name: "Figures", weight: "light" },
    { id: "headline", name: "Headline", weight: "medium" },
    { id: "spread", name: "Spread", weight: "medium" },
    { id: "transcript", name: "Transcript", weight: "heavy" },
  ];
  const IDS = VERSIONS.map((v) => v.id);
  const LS = "crossref2.sizzle";
  const DEF = "headline";
  const current = () => {
    const q = (new URLSearchParams(location.search).get("sizzle") || "").toLowerCase();
    if (IDS.includes(q) || q === "still") return q;
    let v = null; try { v = localStorage.getItem(LS); } catch (e) { /* a private window */ }
    return IDS.includes(v) || v === "still" ? v : DEF;
  };

  /* the pictures, with their sizes (img/sizes.json). The cover is the
     board's own lead, the one the room's cover shows, so the first
     frame is that picture exactly */
  const PICS = {
    cover: { src: "/lab/board-thumbs/hp/rhs-dallas-sport-collective-laptop-stool.webp", w: 1536, h: 1024 },
    "laptop-stool": { w: 1920, h: 1280, rungs: [1000, 1400, 1600, 1920] },
    "laptop-concrete": { w: 3120, h: 1926, rungs: [1000, 1400, 1600, 2000] },
    "phone-chat": { w: 3120, h: 1926, rungs: [1000, 1400, 1600, 2000] },
    "phone-calendar": { w: 3120, h: 1926, rungs: [1000, 1400, 1600, 2000] },
    "phone-site": { w: 3118, h: 1926, rungs: [1000, 1400, 1600, 2000] },
    "site-recovery": { w: 1800, h: 1109, rungs: [900, 1800] },
    "site-facilities": { w: 1800, h: 1557, rungs: [900, 1800] },
    login: { w: 774, h: 1200, screen: true },
    registration: { w: 775, h: 1200, screen: true },
    dashboard: { w: 711, h: 1099, screen: true },
    programs: { w: 774, h: 1200, screen: true },
    connect: { w: 760, h: 695, screen: true },
    consent: { w: 1141, h: 1300, screen: true },
    "claude-trainers": { w: 919, h: 1400, screen: true },
    "claude-avail": { w: 921, h: 1400, screen: true },
    "claude-request": { w: 1096, h: 1400, screen: true },
    "owner-chat": { w: 776, h: 1200, screen: true },
  };
  /* the rung for a width drawn: the smallest that keeps it at half its
     pixels on this screen, else the largest there is */
  const srcOf = (name, drawn) => {
    const p = PICS[name]; if (p.src) return p.src;
    if (p.screen) return IMG + name + ".webp";
    const need = drawn * Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const r = p.rungs.find((x) => x >= need) || p.rungs[p.rungs.length - 1];
    return IMG + name + "@" + r + ".webp";
  };
  /* the width a picture is drawn at when it covers a box */
  const coverW = (name, bw, bh) => { const p = PICS[name]; return Math.max(bw, bh * (p.w / p.h)); };
  /* a picture set at its own proportions inside a box, never past half
     its pixels */
  const honest = (name, maxW, maxH) => {
    const p = PICS[name]; let w = Math.min(maxW, p.w / 2), h = w * (p.h / p.w);
    if (h > maxH) { h = maxH; w = h * (p.w / p.h); }
    return [Math.floor(w), Math.floor(h)];
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  /* a sentence in two tones, as the board's leads are: the first
     sentence in ink, the rest grey */
  const twoTone = (a, b) => esc(a) + (b ? ' <span class="g">' + esc(b) + "</span>" : "");

  /* words into spans, where they stand, so a band can be laid over each
     line and the words shown when it has passed */
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

  /* ── what each sentence says, in one place, so it can be read and
     checked against the study together. Each is the study's own, from
     its subtitle, abstract, heads and text, or the demos' real words ── */
  const SAY = {
    gym: "Dallas Sport Collective is a six-trainer gym in North Texas.",
    site: "The site's photography is shot on the actual gym floor.",
    signup: "Athletes create their own accounts and sign the waiver on the way in.",
    app: "The athlete app opens on your next session.",
    ai: "Athletes can book a session from Claude, ChatGPT or Gemini.",
    aiUse: "Athletes can book from the AI they already use.",
    checks: "Every booking goes through the same checks.",
    approve: "The owner approves each request with one tap.",
    week: "The owner can schedule a whole week out loud.",
    weekSay: "The owner can say a whole week out loud.",
    open: "DSC is open seven days a week in Celina and McKinney, Texas.",
    live: "The platform is live at both locations, in Celina and McKinney.",
    onlyRequest: "An athlete's AI can only ever request a booking.",
    howeverIn: "However a booking comes in, it goes through the same checks.",
  };
  const CHECKS = ["Trainer availability", "Double-bookings", "Floor capacity", "Allowed durations", "Cancellation rules"];
  /* the athlete's exchange (athlete-mcp-loop.html, a real Claude session
     against the live MCP server, 13 June 2026) and the owner's batch
     (owner-batch-chat.html, run in the live app, 12 June 2026) */
  const REAL = {
    ask: "When does Scott have openings next week? I'd like a 60-minute session.",
    avail: "Scott has openings Monday through Thursday next week.",
    book: "Let's request to book 8am on Monday!",
    done: ["Done, your request is in.", "Pending Scott's approval."],
    who: ["Marcus Chen", "wants", "Scott"],
    when: "Mon, Jun 15 · 8:00 AM · 60 min",
    via: "via AI",
    approved: ["Approved.", "The session is on the calendar."],
    batch: "Schedule Marcus Chen with Scott on Monday, Wednesday, and Friday at 3pm for the next 4 weeks",
    accepted: ["10 sessions accepted.", "3 conflicts skipped: Marcus already has Scott at 3pm those days."],
    commit: "commit",
    locked: ["Done.", "Marcus is locked in with Scott, M/W/F at 3pm through July 13."],
  };

  /* ── the versions. Each is a list of shots: how long it holds, how it
     arrives (mask, a page turn, a blink, or at once), its ground, and a
     build that lays it out for the frame and returns what plays ── */
  const photoShot = (name, o) => Object.assign({ ground: "photo", pics: [name], build(c, s) {
    const p = c.pic(name, [0, 0, c.W, c.H], { settle: true, op: o && o.op });
    s.appendChild(p);
    return () => 0;
  } }, o || {});

  /* the checks, in rows between hairlines, each ticked */
  const checksAt = (c, parent, x, y, w, o) => {
    o = o || {};
    const box = c.el("div", "checks " + (o.size || "mid"));
    if (o.flow) box.style.cssText = `position:relative;width:${w}px`; else box.style.cssText = `left:${x}px;top:${y}px;width:${w}px`;
    const top = c.el("i", "rule hair"); box.appendChild(top);
    const rows = CHECKS.map((t) => {
      const r = c.el("div", "ck-row"), ck = c.el("div", "ck");
      const tx = c.el("span", null, esc(t)), tk = c.tick();
      ck.appendChild(tx); ck.appendChild(tk); r.appendChild(ck);
      const rl = c.el("i", "rule hair"); r.appendChild(rl);
      box.appendChild(r);
      return { tx, tk, rl };
    });
    parent.appendChild(box);
    return {
      box,
      play(at) {
        const gap = o.gap || 240;
        c.go(top, at);
        rows.forEach((r, i) => {
          const t = at + 120 + i * gap;
          c.wipe(r.tx, { at: t, kind: "tint", dur: 520 });
          c.go(r.rl, t + 60);
          c.go(r.tk, t + 360);
        });
        return at + 120 + (rows.length - 1) * gap + 700;
      },
    };
  };
  /* the request as it lands on the owner's console: who wants whom, when,
     and that it came in through an AI; then Approve and Decline under it.
     On a photograph it sits on a card of paper */
  const requestAt = (c, parent, x, y, w, o) => {
    o = o || {};
    const rq = c.el("div", "rq" + (o.card ? " card" : ""));
    rq.style.cssText = o.flow ? `position:relative;width:${w}px` : `left:${x}px;top:${y}px;width:${w}px`;
    const t = c.el("i", "rule t"), b = c.el("i", "rule hair b");
    const l = c.el("div", "rq-l");
    const who = c.el("div", "mid rq-who", esc(REAL.who[0]) + ' <span class="g">' + esc(REAL.who[1]) + "</span> " + esc(REAL.who[2]));
    const when = c.el("div", "sm g rq-when", esc(REAL.when) + ' · <span class="lab rq-via">' + esc(REAL.via) + "</span>");
    l.appendChild(who); l.appendChild(when);
    const a = c.el("div", "rq-a fd");
    const btn = c.el("span", "btn", '<i class="bd"></i><span>Approve</span>');
    a.appendChild(btn); a.appendChild(c.el("span", "sm g", "Decline"));
    const ok = c.el("div", "mid rq-ok", twoTone(REAL.approved[0], REAL.approved[1]));
    /* in the transcript the checks follow at once, under their own rule */
    if (!o.card) { rq.appendChild(t); if (!o.flow) rq.appendChild(b); }
    rq.appendChild(l); rq.appendChild(a); rq.appendChild(ok);
    parent.appendChild(rq);
    ok.style.visibility = "hidden";
    return {
      box: rq,
      show(at) {
        if (o.card) c.go(rq, at); else { c.go(t, at); c.go(b, at + 200); }
        c.wipe(who, { at: at + 160, kind: "tint", dur: 560 });
        c.wipe(when, { at: at + 260, kind: "tint", dur: 520 });
        c.go(a, at + 460);
        return at + 900;
      },
      press(at) {
        c.T(at, () => btn.classList.add("press"));
        c.T(at + 520, () => { rq.classList.add("done"); ok.style.visibility = ""; });
        c.wipe(ok, { at: at + 560, kind: "ink", dur: 640 });
        return at + 1300;
      },
    };
  };

  const V = {};

  /* ── caption: the pictures lead; a paper tab says each in a sentence ── */
  const screenOn = (name, ground, cap, d) => ({ d: d || 2400, cut: "mask", ground, pics: [name], cap, build(c, s) {
    const [w, h] = honest(name, c.W * 0.42, c.H - c.top - c.pad * 1.3);
    s.appendChild(c.pic(name, [c.W * 0.7 - w / 2, c.top + (c.H - c.top - c.pad * 1.3 - h) / 2, w, h], { screen: true }));
    return () => 0;
  } });
  V.caption = {
    tab: true,
    shots: [
      photoShot("cover", { d: 2700, cap: ["The gym", SAY.gym] }),
      screenOn("login", "ink", ["Sign-up", SAY.signup]),
      screenOn("dashboard", "mist", ["The athlete app", SAY.app]),
      screenOn("claude-avail", "ink", ["From your AI", SAY.ai], 2700),
      { d: 3100, cut: "mask", ground: "ink", cap: ["One engine", SAY.checks], build(c, s) {
        const k = checksAt(c, s, c.pad, c.top, Math.min(c.W * 0.5, 440), { size: "lg", gap: 240 });
        return (t0) => k.play(t0 + 120);
      } },
      photoShot("phone-calendar", { d: 2400, cut: "mask", cap: ["The owner console", SAY.approve] }),
      photoShot("phone-chat", { d: 2400, cut: "mask", op: "40% 50%", cap: ["A week by chat", SAY.week] }),
      photoShot("phone-site", { d: 2700, cut: "mask", cap: ["Live", SAY.open] }),
    ],
    loopCut: "mask",
    poster: 0,
  };

  /* ── figures: the black field as a reel. A figure sits on its own
     sentence at the foot of the frame, the study named in the corner ── */
  const figShot = (fig, say, o) => Object.assign({ ground: "ink", d: 2300, cut: "blink", build(c, s) {
    const S = c.el("div", "mid g lt abs", esc(say)); S.style.cssText = `left:${c.pad}px;bottom:${c.pad}px;width:${Math.min(c.W * 0.56, 520)}px`;
    s.appendChild(S);
    const N = c.el("div", "lab g abs fd", "Dallas Sport Collective"); N.style.cssText = `right:${c.pad}px;bottom:${c.pad}px`;
    s.appendChild(N);
    const F = c.el("div", "fig abs", esc(fig)); F.style.left = Math.round(c.pad - c.W * 0.006) + "px";
    s.appendChild(F);
    const room = c.H - c.top - c.pad - S.offsetHeight - c.H * 0.05;
    c.fitFig(F, o && o.figW ? o.figW(c) : (c.W - 2 * c.pad) * 0.94, Math.min(room, c.H * 0.6));
    /* the descenders of "tap" and "days" hang below the figure's tight
       line, so the sentence keeps a little more than the gap from it */
    const fs = parseFloat(F.style.fontSize) || 100, drop = /[gjpqy]/.test(fig) ? fs * 0.16 : 0;
    F.style.top = Math.round(c.H - c.pad - S.offsetHeight - c.H * 0.045 - drop - F.offsetHeight) + "px";
    const more = o && o.more ? o.more(c, s) : null;
    return (t0) => {
      c.wipe(F, { at: t0, kind: "ink", dur: 760 });
      c.wipe(S, { at: t0 + 420, kind: "tint" });
      c.go(N, t0 + 700);
      return more ? more(t0) : 0;
    };
  } }, o || {});
  V.figures = {
    shots: [
      photoShot("cover", { d: 1600 }),
      figShot("6", "Six trainers work at DSC, and the gym runs eleven programs, from NFL Combine prep to prenatal fitness."),
      photoShot("laptop-concrete", { d: 1250, cut: "blink" }),
      figShot("100+", "Sign-up moved a hundred-plus athletes off text threads and a spreadsheet and onto one roster."),
      photoShot("phone-chat", { d: 1250, cut: "blink", op: "40% 50%" }),
      figShot("11", "The MCP server has eleven tools, so an athlete can ask their own AI to book Friday at 10am."),
      photoShot("phone-calendar", { d: 1250, cut: "blink" }),
      figShot("1 tap", SAY.approve, { d: 3500, figW: (c) => c.W * 0.4, more(c, s) {
        const x = Math.round(c.W * 0.54), w = c.W - c.pad - x;
        const r = requestAt(c, s, x, c.top, w);
        return (t0) => { r.show(t0 + 450); return r.press(t0 + 1750); };
      } }),
      photoShot("phone-site", { d: 1250, cut: "blink" }),
      figShot("7 days", SAY.open),
      { d: 2100, cut: "blink", ground: "ink", build(c, s) {
        const m = c.el("i", "mark fd"), sz = Math.round(c.H * 0.36);
        m.style.cssText = `left:${(c.W - sz * 0.9) / 2}px;top:${(c.H - sz) / 2 - c.H * 0.05}px;width:${sz * 0.9}px;height:${sz}px`;
        s.appendChild(m);
        const N = c.el("div", "lab abs", "Dallas Sport Collective"); s.appendChild(N);
        N.style.cssText = `left:0;right:0;text-align:center;top:${(c.H + sz) / 2 - c.H * 0.02}px`;
        return (t0) => { c.go(m, t0); c.wipe(N, { at: t0 + 380, kind: "tint" }); return 0; };
      } },
    ],
    loopCut: "blink",
    poster: 1,
  };

  /* ── headline: a magazine opener per beat ── */
  const kicker = (c, s, x, y, w, label) => {
    const k = c.el("div", "abs"); k.style.cssText = `left:${x}px;top:${y}px;width:${w}px`;
    const l = c.el("div", "lab", esc(label)); l.style.paddingBottom = "0.75em";
    const r = c.el("i", "rule"); k.appendChild(l); k.appendChild(r); s.appendChild(k);
    return { k, l, r, h: () => k.offsetHeight, play(at) { c.go(r, at); c.wipe(l, { at: at + 80, kind: "tint", dur: 520 }); } };
  };
  const headline = (c, s, x, y, w, text, lines, hi) => {
    const t = c.el("div", "dsp abs", esc(text)); t.style.cssText = `left:${x}px;top:${y}px;width:${w}px`;
    s.appendChild(t);
    c.fit(t, lines || 4, Math.max(15, c.W * 0.04), hi || Math.min(80, c.W * 0.1));
    return t;
  };
  V.headline = {
    shots: [
      photoShot("cover", { d: 1900 }),
      { d: 3800, cut: "band", ground: "paper dots", pics: ["claude-avail"], build(c, s) {
        const cw = c.W * 0.52;
        const K = kicker(c, s, c.pad, c.top, cw, "From your AI");
        const T = headline(c, s, c.pad, c.top + K.h() + c.H * 0.045, cw, SAY.aiUse);
        const [w, h] = honest("claude-avail", c.W - c.pad - (c.pad + cw + c.W * 0.05), c.H - c.top - c.pad);
        const P = c.pic("claude-avail", [c.W - c.pad - w, c.top + (c.H - c.top - c.pad - h) / 2, w, h], { screen: true, m: true });
        s.appendChild(P);
        return (t0) => { K.play(t0); const e = c.wipe(T, { at: t0 + 200 }); c.go(P, e - 250); return 0; };
      } },
      { d: 4000, cut: "band", ground: "ink", build(c, s) {
        const cw = c.W * 0.5;
        const K = kicker(c, s, c.pad, c.top, cw, "One engine");
        const T = headline(c, s, c.pad, c.top + K.h() + c.H * 0.045, cw, SAY.checks);
        const x = c.pad + cw + c.W * 0.06;
        const k = checksAt(c, s, x, c.top, c.W - c.pad - x, { size: "mid", gap: 220 });
        return (t0) => { K.play(t0); const e = c.wipe(T, { at: t0 + 200 }); return k.play(e - 200); };
      } },
      { d: 5000, cut: "band", ground: "paper dots", pics: ["phone-calendar"], build(c, s) {
        const cw = c.W * 0.46;
        const K = kicker(c, s, c.pad, c.top, cw, "The owner console");
        const T = headline(c, s, c.pad, c.top + K.h() + c.H * 0.045, cw, SAY.approve);
        const x = Math.round(c.W * 0.54);
        const P = c.pic("phone-calendar", [x, 0, c.W - x, c.H], { settle: true, m: true, op: "46% 50%" });
        s.appendChild(P);
        /* the request itself, on a card over the photograph, approved */
        const cx = x + c.pad * 0.8, cw2 = c.W - cx - c.pad * 0.8;
        const R = requestAt(c, s, cx, 0, cw2, { card: true });
        R.box.style.top = Math.round(c.H - c.pad * 0.8 - R.box.offsetHeight) + "px";
        return (t0) => { K.play(t0); const e = c.wipe(T, { at: t0 + 200 }); c.go(P, e - 450); R.show(e - 100); return R.press(e + 950); };
      } },
      { d: 3600, cut: "band", ground: "paper dots", pics: ["phone-chat"], build(c, s) {
        const K = kicker(c, s, c.pad, c.top, c.W * 0.46, "A week by chat");
        const T = headline(c, s, c.pad, c.top + K.h() + c.H * 0.04, c.W - 2 * c.pad, SAY.weekSay, 2, Math.min(70, c.W * 0.08));
        const y = c.top + K.h() + c.H * 0.04 + T.offsetHeight + c.H * 0.065;
        const P = c.pic("phone-chat", [0, y, c.W, c.H - y], { settle: true, m: true, op: "40% 52%" });
        s.appendChild(P);
        return (t0) => { K.play(t0); const e = c.wipe(T, { at: t0 + 200 }); c.go(P, e - 250); return 0; };
      } },
      { d: 3400, cut: "band", ground: "paper dots", build(c, s) {
        const cw = c.W * 0.54;
        const K = kicker(c, s, c.pad, c.top, cw, "Live");
        const T = headline(c, s, c.pad, c.top + K.h() + c.H * 0.045, cw, SAY.live);
        const m = c.el("i", "mark fd"), sz = Math.round(Math.min(c.H * 0.56, c.W * 0.3));
        m.style.cssText = `left:${c.W * 0.79 - sz * 0.45}px;top:${(c.H - sz) / 2 + c.top * 0.2}px;width:${sz * 0.9}px;height:${sz}px;color:#000`;
        s.appendChild(m);
        return (t0) => { K.play(t0); const e = c.wipe(T, { at: t0 + 200 }); c.go(m, e - 300); return 0; };
      } },
    ],
    loopCut: "band",
    poster: 1,
  };

  /* ── spread: the room in miniature, a page at a time. The two-tone lead
     heads the right half and the study's footnote sits at its foot, as a
     section of the study pairs its large line with its small one ── */
  const spread = (c, s, label, ink, grey, foot, o) => {
    const H = c.el("div", "rh");
    const a = c.el("div", "lab", "Dallas Sport Collective"), b = c.el("div", "lab g", esc(label)), r = c.el("i", "rule");
    H.appendChild(a); H.appendChild(b); H.appendChild(r); s.appendChild(H);
    const y0 = c.top + H.offsetHeight + c.H * 0.06, x = c.W * 0.5 + c.W * 0.017, w = c.W - c.pad - x;
    const F = c.el("div", "sm g abs", esc(foot)); F.style.cssText = `left:${x}px;bottom:${c.pad}px;width:${w}px`;
    s.appendChild(F);
    const L = c.el("div", "lead abs", twoTone(ink, grey)); L.style.cssText = `left:${x}px;top:${y0}px;width:${w}px`;
    s.appendChild(L);
    /* the lead as large as it will go above the footnote */
    const avail = c.H - c.pad - F.offsetHeight - c.H * 0.06 - y0;
    let lo = 11, hi = Math.min(32, c.W * 0.046), best = lo;
    for (let i = 0; i < 12; i++) { const mid = (lo + hi) / 2; L.style.fontSize = mid + "px"; if (L.offsetHeight <= avail) { best = mid; lo = mid; } else hi = mid; }
    L.style.fontSize = Math.floor(best * 2) / 2 + "px";
    return {
      y0, x, w, L,
      play(at) {
        c.go(r, at); c.wipe(a, { at: at + 60, kind: "tint", dur: 480 }); c.wipe(b, { at: at + 140, kind: "tint", dur: 480 });
        const e = c.wipe(L, { at: at + 300, kind: "tint", dur: 600, gap: 70 });
        c.wipe(F, { at: e - 200, kind: "tint", dur: 520, gap: 60 });
        return e;
      },
    };
  };
  /* pictures in the left half, side by side at one height, each with its
     caption under it */
  const leftPics = (c, s, names, caps, y0) => {
    const x0 = c.pad, x1 = c.W * 0.5 - c.W * 0.017, gap = c.W * 0.018, capH = caps ? c.H * 0.075 : 0;
    const maxH = c.H - y0 - c.pad - capH;
    const R = names.reduce((t, n) => t + PICS[n].w / PICS[n].h, 0);
    let h = Math.min(maxH, (x1 - x0 - gap * (names.length - 1)) / R);
    h = Math.min(h, ...names.map((n) => PICS[n].h / 2));
    const tw = R * h + gap * (names.length - 1);
    const y = y0 + Math.max(0, (maxH - h) / 2);
    let x = x0 + (x1 - x0 - tw) / 2; const out = [];
    names.forEach((n, i) => {
      const w = h * (PICS[n].w / PICS[n].h);
      const p = c.pic(n, [x, y, w, h], { screen: PICS[n].screen, m: true });
      s.appendChild(p); out.push(p);
      if (caps && caps[i]) { const cp = c.el("div", "sm g abs fd", esc(caps[i])); cp.style.cssText = `left:${x}px;top:${y + h + c.H * 0.02}px;width:${w}px`; s.appendChild(cp); out.push(cp); }
      x += w + gap;
    });
    return out;
  };
  const FOOT = {
    signup: "Login and registration move a hundred-plus athletes off text threads and a spreadsheet and onto one roster the software can work with.",
    ai: "Lookups come back instantly, and any change the AI asks for waits as a pending request until the owner approves it.",
    owner: "On the owner console, every request lands in a queue, a week calendar shows the session count per day, and a member list flags waiver and trainer-assignment status.",
    stack: "The platform is Next.js on Vercel, with OAuth 2.0 consent and short-lived tokens, and it is live at two locations.",
  };
  V.spread = {
    shots: [
      photoShot("cover", { d: 1900 }),
      { d: 4500, cut: "band", ground: "paper dots", pics: ["login", "registration"], build(c, s) {
        const S = spread(c, s, "Sign-up", "Athletes create their own accounts.", "They sign the waiver on the way in, and the owner assigns each new member to a trainer before anyone books a session.", FOOT.signup);
        const ps = leftPics(c, s, ["login", "registration"], ["Login", "Registration"], S.y0);
        return (t0) => { const e = S.play(t0); ps.forEach((p, i) => c.go(p, t0 + 350 + i * 160)); return e; };
      } },
      { d: 4500, cut: "band", ground: "paper dots", pics: ["claude-request"], build(c, s) {
        const S = spread(c, s, "From your AI", SAY.ai, "They paste one URL into the AI they already use, and it reads their real schedule and puts in a request.", FOOT.ai);
        const ps = leftPics(c, s, ["claude-request"], ["Pending Scott's approval"], S.y0);
        return (t0) => { const e = S.play(t0); ps.forEach((p, i) => c.go(p, t0 + 350 + i * 160)); return e; };
      } },
      { d: 4500, cut: "band", ground: "paper dots", pics: ["phone-calendar"], build(c, s) {
        const S = spread(c, s, "The owner console", SAY.approve, "The owner can also say a whole week out loud, and the scheduler waits for a commit before it books anything.", FOOT.owner);
        const P = c.pic("phone-calendar", [0, S.y0, c.W * 0.5 - c.W * 0.017, c.H - S.y0], { settle: true, m: true, op: "46% 50%" });
        s.appendChild(P);
        return (t0) => { const e = S.play(t0); c.go(P, t0 + 350); return e; };
      } },
      { d: 4500, cut: "band", ground: "ink", build(c, s) {
        const S = spread(c, s, "One engine", SAY.howeverIn, SAY.onlyRequest, FOOT.stack);
        const k = checksAt(c, s, c.pad, S.y0, c.W * 0.5 - c.pad - c.W * 0.03, { size: "mid", gap: 210 });
        return (t0) => { const e = S.play(t0); return Math.max(e, k.play(t0 + 350)); };
      } },
    ],
    loopCut: "band",
    poster: 1,
  };

  /* ── transcript: the demo, as type. The rail names who speaks; the
     words are set as large as the page will hold them all ── */
  const rhead = (c, s, left, right) => {
    const H = c.el("div", "rh");
    const a = c.el("div", "lab", esc(left)), b = c.el("div", "lab g", esc(right || "")), r = c.el("i", "rule");
    H.appendChild(a); H.appendChild(b); H.appendChild(r); s.appendChild(H);
    return { H, play(at) { c.go(r, at); c.wipe(a, { at: at + 60, kind: "tint", dur: 480 }); if (right) c.wipe(b, { at: at + 160, kind: "tint", dur: 480 }); } };
  };
  const txGrid = (c, s, head, hiK) => {
    const g = c.el("div", "tx"); const top = c.top + head.H.offsetHeight + c.H * 0.055; g.style.top = top + "px";
    s.appendChild(g);
    const row = (who, node) => { const w = c.el("div", "who lab", esc(who || "")); g.appendChild(w); g.appendChild(node); return { w, node }; };
    /* once every row is in: the size at which they all fit the page */
    const fit = () => {
      const avail = c.H - top - c.pad;
      let lo = 7, hi = Math.min(24, c.W * (hiK || 0.028)), best = lo;
      for (let i = 0; i < 12; i++) { const mid = (lo + hi) / 2; g.style.fontSize = mid + "px"; if (g.offsetHeight <= avail) { best = mid; lo = mid; } else hi = mid; }
      g.style.fontSize = Math.floor(best * 4) / 4 + "px";
    };
    return { g, row, fit };
  };
  const toolLine = (c, name) => {
    const t = c.el("div", "tool mono");
    const k = c.tick(); t.appendChild(k); t.appendChild(c.el("span", null, esc(name)));
    t._k = k;
    return t;
  };
  /* a said line keeps its full height before it is typed, so the fit
     measures the page as it will end */
  const saidEl = (c, text) => { const d = c.el("div", "said"); d.textContent = text; d._t = text; return d; };
  V.transcript = {
    shots: [
      photoShot("cover", { d: 1700 }),
      { d: 8600, cut: "band", ground: "paper dots", build(c, s) {
        const hd = rhead(c, s, "Booking by AI", "A real exchange, replayed");
        const X = txGrid(c, s, hd);
        const a1 = X.row("The athlete", saidEl(c, REAL.ask));
        const t1 = X.row("Their AI", toolLine(c, "my_trainer_availability"));
        const r1 = X.row("", c.el("div", "mid g", esc(REAL.avail)));
        const a2 = X.row("The athlete", saidEl(c, REAL.book));
        const t2 = X.row("Their AI", toolLine(c, "request_session"));
        const r2 = X.row("", c.el("div", "mid", twoTone(REAL.done[0], REAL.done[1])));
        X.fit();
        /* rows arrive as they are said; until then they hold their place,
           so nothing below them moves */
        [t1, r1, a2, t2, r2].forEach((r) => { r.w.style.visibility = r.node.style.visibility = "hidden"; });
        const show = (r, at) => c.T(at, () => { r.w.style.visibility = r.node.style.visibility = ""; });
        const who = (r, at) => c.T(at, () => c.wipe(r.w, { kind: "tint", dur: 420 }));
        return (t0) => {
          hd.play(t0);
          c.wipe(a1.w, { at: t0 + 250, kind: "tint", dur: 480 });
          let e = c.type(a1.node, REAL.ask, { at: t0 + 450, cps: 24 });
          show(t1, e + 250); who(t1, e + 250); c.go(t1.node._k, e + 800);
          show(r1, e + 950); e = c.stream(r1.node, { at: e + 950, per: 55 });
          show(a2, e + 450); who(a2, e + 450);
          e = c.type(a2.node, REAL.book, { at: e + 600, cps: 30 });
          show(t2, e + 250); who(t2, e + 250); c.go(t2.node._k, e + 750);
          show(r2, e + 900); return c.stream(r2.node, { at: e + 900, per: 60 });
        };
      } },
      { d: 6900, cut: "band", ground: "paper dots", build(c, s) {
        const hd = rhead(c, s, "The owner console", "The same request");
        const X = txGrid(c, s, hd, 0.034);
        const holder = c.el("div", "rqh");
        const o1 = X.row("The owner", holder);
        const ck = c.el("div", "ckh");
        const e1 = X.row("The engine", ck);
        const R = requestAt(c, holder, 0, 0, 10, { flow: true });
        R.box.style.width = "100%";
        const K = checksAt(c, ck, 0, 0, 10, { size: "em", gap: 180, flow: true });
        K.box.style.width = "min(100%, 34em)";
        X.fit();
        e1.w.style.visibility = "hidden";
        return (t0) => {
          hd.play(t0);
          c.wipe(o1.w, { at: t0 + 250, kind: "tint", dur: 480 });
          const e = R.show(t0 + 300);
          const p = R.press(e + 900);
          c.T(e + 1150, () => { e1.w.style.visibility = ""; c.wipe(e1.w, { kind: "tint", dur: 420 }); });
          return Math.max(p, K.play(e + 1250));
        };
      } },
      { d: 7800, cut: "band", ground: "paper dots", build(c, s) {
        const hd = rhead(c, s, "A week by chat", "The owner's real batch");
        const X = txGrid(c, s, hd);
        const o1 = X.row("The owner", saidEl(c, REAL.batch));
        const t1 = X.row("The scheduler", toolLine(c, "propose_batch"));
        const r1 = X.row("", c.el("div", "mid", twoTone(REAL.accepted[0], REAL.accepted[1])));
        const o2 = X.row("The owner", saidEl(c, REAL.commit));
        const t2 = X.row("The scheduler", toolLine(c, "commit_all_pending"));
        const r2 = X.row("", c.el("div", "mid", twoTone(REAL.locked[0], REAL.locked[1])));
        X.fit();
        [t1, r1, o2, t2, r2].forEach((r) => { r.w.style.visibility = r.node.style.visibility = "hidden"; });
        const show = (r, at) => c.T(at, () => { r.w.style.visibility = r.node.style.visibility = ""; });
        const who = (r, at) => c.T(at, () => c.wipe(r.w, { kind: "tint", dur: 420 }));
        return (t0) => {
          hd.play(t0);
          c.wipe(o1.w, { at: t0 + 250, kind: "tint", dur: 480 });
          let e = c.type(o1.node, REAL.batch, { at: t0 + 450, cps: 19 });
          show(t1, e + 250); who(t1, e + 250); c.go(t1.node._k, e + 800);
          show(r1, e + 950); e = c.stream(r1.node, { at: e + 950, per: 45 });
          show(o2, e + 400); who(o2, e + 400);
          e = c.type(o2.node, REAL.commit, { at: e + 550, cps: 60 });
          show(t2, e + 250); who(t2, e + 250); c.go(t2.node._k, e + 750);
          show(r2, e + 900); return c.stream(r2.node, { at: e + 900, per: 55 });
        };
      } },
    ],
    loopCut: "band",
    poster: 1,
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
    const cssReady = new Promise((res) => { link.addEventListener("load", res, { once: true }); link.addEventListener("error", res, { once: true }); });

    const still = !!opts.still || matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ver = opts.version || current();
    let dead = false, playing = false, seen = false, idx = -1, cur = null, curS = null, tab = null, gen = 0;
    const timers = new Set(), loops = new Set();
    const T = (ms, fn) => { const my = gen; const id = setTimeout(() => { timers.delete(id); if (!dead && my === gen) fn(); }, still ? 0 : Math.max(0, ms)); timers.add(id); return id; };
    const stop = () => { timers.forEach(clearTimeout); timers.clear(); loops.forEach(clearInterval); loops.clear(); gen++; };

    const el = (t, c, html) => { const e = document.createElement(t); if (c) e.className = c; if (html != null) e.innerHTML = html; return e; };
    const ctx = { el, T, get instant() { return still; } };
    const size = () => {
      ctx.W = stage.clientWidth; ctx.H = stage.clientHeight;
      ctx.pad = Math.round(ctx.W * 0.044); ctx.top = Math.round(Math.max(34, ctx.H * 0.085));
    };
    /* go: the class that starts a thing's own transition, at a time */
    ctx.go = (node, at) => { if (!node) return; if (still) { node.classList.add("now"); return; } T(at, () => { void node.offsetWidth; node.classList.add("go"); }); };
    ctx.tick = () => { const s = document.createElementNS("http://www.w3.org/2000/svg", "svg"); s.setAttribute("viewBox", "0 0 12 10"); s.setAttribute("class", "tk"); s.innerHTML = '<path d="M1 5.2 4.4 8.4 11 1.4"/>'; return s; };
    ctx.pic = (name, box, o) => {
      o = o || {};
      const [x, y, w, h] = box;
      const b = el("div", "pic" + (o.screen ? " scr" : "") + (o.m ? " m" : "") + (o.settle ? " sl" : ""));
      b.style.cssText = `left:${Math.round(x)}px;top:${Math.round(y)}px;width:${Math.round(w)}px;height:${Math.round(h)}px`;
      if (o.op) b.style.setProperty("--op", o.op);
      const im = el("img"); im.alt = ""; im.decoding = "async"; im.draggable = false;
      im.src = srcOf(name, coverW(name, w, h));
      b.appendChild(im);
      return b;
    };
    /* the wipe on a block of text: a band per line, ink over display
       type, a tint over text; the words shown as it passes */
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
        const b = el("i", "bd " + kind);
        b.style.cssText = `left:${x0 - 2}px;top:${ln.top}px;width:${x1 - x0 + 4}px;height:${hh}px`;
        b.style.setProperty("--d", li * gap + "ms"); b.style.setProperty("--bd", dur + "ms");
        node.appendChild(b);
        ln.words.forEach((w) => w.style.setProperty("--d", Math.round(li * gap + dur * 0.5) + "ms"));
      });
      T(at, () => { void node.offsetWidth; node.classList.add("go"); });
      return at + (lines.length - 1) * gap + dur;
    };
    /* a reply streaming in, a word at a time */
    ctx.stream = (node, o) => {
      o = o || {};
      const words = splitWords(node), per = o.per || 55, at = o.at || 0;
      node.classList.add("st");
      if (still) { node.classList.add("now"); return 0; }
      words.forEach((w, i) => w.style.setProperty("--d", i * per + "ms"));
      T(at, () => { void node.offsetWidth; node.classList.add("go"); });
      return at + words.length * per;
    };
    /* typed, a character at a time, with a caret that goes once it is done */
    ctx.type = (node, text, o) => {
      o = o || {};
      const cps = o.cps || 30, at = o.at || 0;
      node.textContent = "";
      const tx = document.createTextNode(""), car = el("span", "caret");
      node.appendChild(tx);
      if (still) { tx.nodeValue = text; return 0; }
      /* the line takes its full height first, so nothing under it moves as
         it fills */
      const ghost = el("span", null, esc(text)); ghost.style.visibility = "hidden"; node.appendChild(ghost);
      T(at, () => {
        node.appendChild(car); ghost.remove();
        const rest = el("span", null, esc(text)); rest.style.visibility = "hidden"; node.appendChild(rest);
        let n = 0;
        const id = setInterval(() => {
          if (dead) { clearInterval(id); return; }
          n = Math.min(text.length, n + 1);
          tx.nodeValue = text.slice(0, n); rest.textContent = text.slice(n);
          if (n >= text.length) { clearInterval(id); loops.delete(id); rest.remove(); T(420, () => car.remove()); }
        }, cps);
        loops.add(id);
      });
      return at + text.length * cps;
    };
    /* the largest size a block keeps to its lines and its width */
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
    /* a figure: as wide as it may be and no taller than it may be */
    ctx.fitFig = (node, maxW, maxH) => {
      node.style.fontSize = "100px";
      const w = node.scrollWidth || 1;
      const fs = Math.min((maxW / w) * 100, maxH / 0.84);
      node.style.fontSize = Math.max(28, Math.floor(fs)) + "px";
    };

    /* the tab (caption): a paper strip in the corner whose words turn
       over with each shot, under a band of ink */
    const tabSet = (cap, at) => {
      if (!tab) return;
      const tt = tab.firstChild;
      const fill = () => { tt.innerHTML = '<div class="lab">' + esc(cap[0]) + '</div><div class="sm">' + esc(cap[1]) + "</div>"; tab.style.visibility = ""; };
      if (still) { fill(); return; }
      T(at, () => {
        const b = el("i", "bd go"); tab.appendChild(b);
        T(330, fill);
        T(720, () => b.remove());
      });
    };

    const seq = () => (V[ver] ? V[ver].shots : []);
    /* show shot n, arriving by its cut */
    const show = (n, cutKind) => {
      if (dead) return;
      const list = seq(); if (!list.length) return;
      const S = list[n % list.length];
      const node = el("div", "shot " + S.ground);
      const prev = cur, prevS = curS;
      let t0 = 0;
      const place = () => {
        const run = S.build(ctx, node);
        const end = run ? run(t0) : 0;
        return end;
      };
      if (!prev || cutKind === "none" || still) {
        stage.replaceChildren(...(tab ? [tab] : [])); stage.insertBefore(node, tab);
        place();
      } else if (cutKind === "mask") {
        node.classList.add("cm"); stage.insertBefore(node, tab);
        t0 = 380; place();
        T(20, () => { void node.offsetWidth; node.classList.add("go"); });
        T(760, () => { if (prev.isConnected) prev.remove(); node.classList.remove("cm", "go"); });
      } else if (cutKind === "blink") {
        stage.insertBefore(node, tab); if (prev.isConnected) prev.remove();
        t0 = 60; place();
        const b = el("i", "blink"); stage.appendChild(b); T(200, () => b.remove());
      } else {
        /* a page turn: the band comes in over the old shot, the new one is
           under it when it goes */
        stage.insertBefore(node, prev);
        t0 = 520; place();
        const b = el("i", "fband"); b.style.setProperty("--bc", prevS && /ink/.test(prevS.ground) ? "#fff" : "#000"); b.style.setProperty("--bd", "900ms");
        stage.appendChild(b);
        T(450, () => { if (prev.isConnected) prev.remove(); });
        T(940, () => b.remove());
      }
      if (S.cap) tabSet(S.cap, prev ? Math.max(0, t0 - 250) : 700);
      cur = node; curS = S; idx = n % list.length;
      if (playing && !still) advance(S.d);
    };
    const advance = (delay) => T(delay, () => {
      const list = seq(); if (!list.length) return;
      const nx = (idx + 1) % list.length;
      show(nx, nx === 0 ? V[ver].loopCut || "band" : list[nx].cut || "band");
    });

    const preload = () => {
      const list = seq(), urls = new Set();
      list.forEach((S) => (S.pics || []).forEach((n) => { urls.add(srcOf(n, PICS[n].screen ? 0 : coverW(n, Math.max(ctx.W, 400), Math.max(ctx.H, 260)))); }));
      return Promise.all([...urls].map((u) => new Promise((res) => { const im = new Image(); im.onload = im.onerror = () => res(); im.src = u; }))).then(() => null);
    };
    const fonts = () => document.fonts ? Promise.all(["600 40px 'Avenir Next'", "500 16px 'Avenir Next'", "400 14px 'Avenir Next'", "700 10px 'Avenir Next'"].map((f) => document.fonts.load(f).catch(() => null))) : Promise.resolve();

    const begin = () => {
      stop(); cur = null; curS = null; idx = -1;
      stage.replaceChildren();
      tab = null;
      if (ver === "still" || !V[ver]) { stage.classList.add("off"); return; }
      stage.classList.remove("off");
      size();
      if (V[ver].tab) { tab = el("div", "tab"); tab.appendChild(el("div", "tt")); tab.style.visibility = "hidden"; stage.appendChild(tab); }
      /* not playing until play() says so, or the first shot would set its
         own clock beside play()'s and the reel would skip a shot */
      playing = false;
      if (still) { show(opts.shot != null ? opts.shot : V[ver].poster || 0, "none"); return; }
      show(0, "none");
      if (seen) play();
    };
    /* it plays while it is on screen; off screen it waits where it is,
       and picks up with the next shot */
    let ready = false;
    function play() {
      if (dead || still || playing || !ready || ver === "still" || !V[ver]) return;
      playing = true;
      /* the cover has been on screen while it waited, so it holds a little
         less than its turn; anything else was cut short, so it moves on */
      const S = seq()[idx < 0 ? 0 : idx];
      advance(idx <= 0 ? Math.max(900, (S ? S.d : 1500) - 800) : 700);
    }
    function pause() { if (!playing) return; playing = false; stop(); }

    let io = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver((es) => es.forEach((e) => { seen = e.isIntersecting && e.intersectionRatio >= 0.3; if (seen) play(); else pause(); }), { threshold: [0, 0.3, 0.6] });
      io.observe(wrap);
    } else seen = true;
    /* the Browser pane and other hidden documents may never report: if it
       is in the window after a moment, it plays */
    setTimeout(() => {
      if (dead || seen) return;
      const r = wrap.getBoundingClientRect();
      if (r.width && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth) { seen = true; play(); }
    }, 1400);

    /* a new width: the shot is laid out again */
    let lastW = 0, rzT = 0;
    const ro = "ResizeObserver" in window ? new ResizeObserver(() => {
      clearTimeout(rzT);
      rzT = setTimeout(() => {
        if (dead || !ready) return;
        const w = stage.clientWidth; if (!w) return;
        if (!lastW) { lastW = w; return; }
        if (Math.abs(w - lastW) / lastW < 0.06) return;
        lastW = w; const was = playing; begin(); if (was) play();
      }, 120);
    }) : null;
    if (ro) ro.observe(wrap);

    Promise.all([cssReady, fonts()]).then(() => new Promise((res) => {
      /* wait for a size: a room is laid out a moment after it is made */
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
      set(v) { if (dead || (!IDS.includes(v) && v !== "still") || v === ver) return; ver = v; if (!ready) return; size(); preload().then(() => { if (!dead && ver === v) begin(); }); },
      destroy() { dead = true; stop(); if (io) io.disconnect(); if (ro) ro.disconnect(); LIVE.delete(api); wrap.remove(); },
    };
    LIVE.add(api);
    return api;
  }

  /* every player that is not fixed follows the one chosen */
  const set = (v) => {
    if (!IDS.includes(v) && v !== "still") return;
    try { localStorage.setItem(LS, v); } catch (e) { /* a private window */ }
    LIVE.forEach((p) => { if (!p.fixed) p.set(v); });
    document.querySelectorAll(".szl-row button").forEach((b) => b.classList.toggle("on", b.dataset.v === v));
  };

  /* ── in a room: over the cover, with a row of the versions under it,
     as the looks rows were, until he picks one ── */
  let styled = false;
  const rowStyle = () => {
    if (styled) return; styled = true;
    const st = document.createElement("style");
    st.textContent = ".szl-row{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 14px;margin:10px var(--m,28px) 0;font-size:8.5px;font-weight:700;letter-spacing:.2em;line-height:1.3;text-transform:uppercase;color:rgba(0,0,0,.42)}"
      + ".szl-row b{font-weight:700;color:#000;margin-right:4px}"
      + ".szl-row button{padding:0;border:0;background:none;font:inherit;letter-spacing:inherit;text-transform:inherit;color:inherit;cursor:pointer}"
      + ".szl-row button:hover,.szl-row button.on{color:#000}"
      + ".szl-row button.on{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:.35em}"
      + ".szl-row i{font-style:normal;font-weight:500;letter-spacing:.06em;text-transform:none;color:rgba(0,0,0,.3)}";
    document.head.appendChild(st);
  };
  const row = (fig) => {
    rowStyle();
    const r = document.createElement("div"); r.className = "szl-row";
    const v = current();
    r.innerHTML = "<b>Sizzle</b>" + VERSIONS.map((x) => '<button type="button" data-v="' + x.id + '"' + (x.id === v ? ' class="on"' : "") + ">" + x.name + " <i>" + x.weight + "</i></button>").join("")
      + '<button type="button" data-v="still"' + (v === "still" ? ' class="on"' : "") + ">Still</button>";
    r.addEventListener("click", (ev) => { const b = ev.target.closest("button[data-v]"); if (!b) return; ev.preventDefault(); ev.stopPropagation(); set(b.dataset.v); });
    fig.appendChild(r);
    return r;
  };
  window.SP_LIVE = window.SP_LIVE || {};
  window.SP_LIVE.dsc = (box, fig, o) => {
    const p = mount(box, { still: o && o.still });
    const r = fig ? row(fig) : null;
    return () => { p.destroy(); if (r) r.remove(); };
  };

  window.DSCSizzle = { mount, set, versions: VERSIONS, current };
})();
