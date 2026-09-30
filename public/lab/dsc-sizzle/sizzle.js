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
  const BASE = "/lab/dsc-sizzle/", IMG = BASE + "img/", VQ = "?v=19";
  const VERSIONS = [
    { id: "mix", name: "Mix", weight: "the app in use" },
    { id: "caption", name: "Caption", weight: "light" },
    { id: "figures", name: "Figures", weight: "light" },
    { id: "headline", name: "Headline", weight: "medium" },
    { id: "spread", name: "Spread", weight: "medium" },
    { id: "transcript", name: "Transcript", weight: "heavy" },
  ];
  const IDS = VERSIONS.map((v) => v.id);
  const LS = "crossref2.sizzle";
  const DEF = "mix";
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
    /* the app's own backgrounds, behind two of its rebuilt screens */
    "app-checkin": { w: 3012, h: 2008, rungs: [1600] },
    "app-landing": { w: 3000, h: 2000, rungs: [1600] },
    login: { w: 774, h: 1200, screen: true },
    registration: { w: 775, h: 1200, screen: true },
    dashboard: { w: 711, h: 1099, screen: true },
    programs: { w: 774, h: 1200, screen: true },
    trainer: { w: 774, h: 1200, screen: true },
    "trainers-list": { w: 800, h: 2346, screen: true },
    "dash-full": { w: 776, h: 1812, screen: true },
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
    /* his words for the close, 29 Sept: "the platform runs two locations,
       over 100 athletes including nfl, ncaa". The study has "more than a
       hundred" athletes and NFL Combine prep; NCAA is his note's alone */
    runs: "The platform runs two locations and more than a hundred athletes, including NFL and NCAA players.",
    /* his edit, 29 Sept: "1 tap" says "the owner" just before, so this one
       drops it */
    weekSayIt: "Say a whole week out loud.",
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
      const tx = c.el("span", null, (o.bullets ? '<span class="blt">•</span>' : "") + esc(t)), tk = o.bullets ? null : c.tick();
      ck.appendChild(tx); if (tk) ck.appendChild(tk); r.appendChild(ck);
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
          if (r.tk) c.go(r.tk, t + 360);
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
  const figShot = (fig, say, o) => Object.assign({ name: fig, ground: "ink", d: 2300, cut: "blink", build(c, s) {
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
    /* the mix keeps even a figure moving: it grows by a few hundredths */
    if (o && o.drift) { F.style.transformOrigin = "0 100%"; c.anim(F, [{ transform: "scale(1)" }, { transform: "scale(1.045)" }], { duration: (o.d || 2300) + 700, easing: "linear", fill: "forwards" }); }
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

  /* ── mix (29 Sept 2026): the app, running ───────────────────────────
     His notes on the first five: "i like a mix of figures, headline AND
     spread honestly!", and on what his own Remotion cut had that these
     did not: "it showed more of how that app works and less explanation
     ... the sizzle should show how it actually works but in a SAAS
     sizzle type of way ... vary the transitions too ... it's a difficult
     balance of pacing quickly in sections to get that sizzzle feel but
     then slowing down at times too to see the app actually in use - i
     also think even when it slows down something should always be
     moving at all times, subtle notes animating through, the screens in
     use growing, panning, etc."

     So this one runs the app itself. The phones load the app's own
     stylesheet, compiled from its current source (app.css, by
     scripts/lib/dsc-app-css.mjs), and carry its JSX class strings, as the
     study's live demos do, and replay the same real exchanges: the
     athlete asking their own AI, the request landing on the owner's
     console and approved in one tap, the owner's week said out loud, a
     standing slot filling the calendar. Each sits in the spread's frame
     (a running head, notes in the other half, a line or a tool call at a
     time) and holds long enough to follow, under a camera that never
     stops. Between them the pace goes quick: photographs gliding, a
     headline, the checks, a figure. The cuts are Faux Reel's own (whip,
     iris, flash, pinch, shutter, slat, burn, a push through the glass),
     the room's band among them.

     Then a second act (29 Sept): "the back office", the rest of the gym
     on the same app. The owner's home toured top to bottom, then two
     pairs of phones cropped side by side, each flipping through the
     app's own screens (screens.js, rebuilt from its source), one Tuesday
     so the screens agree with each other.

     The phones are iframes, not the shadow root: Tailwind v4 registers
     its variables with @property, which a shadow tree ignores, and the
     app's borders would go with them. The app's @font-face rules are
     swapped for the site's own Avenir files, already in cache. ── */
  let APPCSS = null, SCREENS = null;
  const appCss = () => APPCSS || (APPCSS = fetch(BASE + "app.css" + VQ).then((r) => (r.ok ? r.text() : "")).then((t) => t.replace(/@font-face\s*\{[^}]*\}/g, "")).catch(() => ""));
  /* the second act's screens, rebuilt from the app's source, live in
     screens.js and load only when a reel has them */
  const screensJs = () => SCREENS || (SCREENS = new Promise((res) => {
    if (window.DSCScreens) return res();
    const s = document.createElement("script"); s.src = BASE + "screens.js" + VQ;
    s.onload = s.onerror = () => res(); document.head.appendChild(s);
  }));
  /* a section that names a screen takes its page and its steps, and
     keeps its own time and tag */
  const screenOf = (x) => (x && x.screen ? Object.assign({}, (window.DSCScreens || {})[x.screen], x) : x);
  const FONTS = [[400, "Regular.woff2"], [500, "Medium.woff"], [600, "DemiBold.woff"], [700, "Bold.woff"], [800, "Heavy.woff"]]
    .map(([w, f]) => "@font-face{font-family:'Avenir Next';src:url('/fonts/AvenirNext-" + f + "');font-weight:" + w + ";font-display:block}").join("");
  /* inside a phone: a status bar, the demos' reveal and press, a tap, a
     caret, and the neutral AI surface the athlete demo draws (ours, on
     purpose not any vendor's) */
  const UICSS = "html,body{margin:0;height:100%;overflow:hidden;background:#fff}"
    + "body{font-family:'Avenir Next',system-ui,sans-serif;-webkit-font-smoothing:antialiased;color:#000;position:relative}"
    + ".sb{height:50px;display:flex;align-items:center;justify-content:space-between;padding:4px 32px 0 38px;box-sizing:border-box;font:600 16px/1 'Avenir Next',system-ui;letter-spacing:-.01em}"
    + ".sb .bt{position:relative;width:26px;height:12px;border:1.6px solid rgba(0,0,0,.35);border-radius:4px;box-sizing:border-box}"
    + ".sb .bt::after{content:'';position:absolute;left:1.5px;top:1.5px;bottom:1.5px;width:16px;background:#000;border-radius:1.5px}"
    + ".app{position:relative;height:750px;display:flex;flex-direction:column;min-height:0;overflow:hidden}"
    + ".pp{opacity:0;transform:translateY(10px);transition:opacity .32s cubic-bezier(.16,1,.3,1),transform .32s cubic-bezier(.16,1,.3,1)}"
    + ".pp.in{opacity:1;transform:none}"
    + ".gone{opacity:0!important;transform:translateY(-6px) scale(.98)!important;transition:opacity .28s ease,transform .28s ease}"
    + ".press{transform:scale(.92);filter:brightness(.85);transition:transform .12s ease,filter .12s ease}"
    + ".tap{position:absolute;width:64px;height:64px;margin:-32px 0 0 -32px;border-radius:50%;background:rgba(0,0,0,.22);pointer-events:none;z-index:50;animation:tap .7s cubic-bezier(.16,1,.3,1) both}"
    + "@keyframes tap{0%{transform:scale(.25);opacity:1}100%{transform:scale(1.8);opacity:0}}"
    + ".car{display:inline-block;width:2px;height:1.05em;background:currentColor;vertical-align:-.18em;margin-left:1px}"
    + ".ai-chat{flex:1;min-height:0;display:flex;flex-direction:column;background:#fff;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}"
    + ".ai-head{padding:12px 16px;border-bottom:1px solid rgba(0,0,0,.08);font-size:13px;font-weight:600;color:rgba(0,0,0,.75);display:flex;align-items:center;gap:8px}"
    + ".ai-head .ai-dot{width:8px;height:8px;border-radius:99px;background:#000}"
    + ".ai-head .ai-conn{margin-left:auto;font-family:'SF Mono',Menlo,monospace;font-size:10px;letter-spacing:.06em;color:rgba(0,0,0,.4);text-transform:uppercase}"
    + ".ai-scroll{flex:1;min-height:0;overflow-y:auto;padding:16px;scroll-behavior:smooth}.ai-scroll::-webkit-scrollbar{display:none}"
    + ".ai-user{max-width:85%;margin:0 0 14px auto;background:rgba(0,0,0,.06);border-radius:16px 16px 4px 16px;padding:10px 14px;font-size:14px;line-height:1.45;color:#111;width:fit-content}"
    + ".ai-reply{font-size:14px;line-height:1.55;color:#1a1a1a;margin:0 0 14px;white-space:pre-wrap}.ai-reply strong{font-weight:650}"
    + ".ai-tool{display:flex;align-items:center;gap:8px;margin:0 0 10px;padding:6px 10px;border:1px solid rgba(0,0,0,.09);border-radius:10px;width:fit-content;max-width:100%;font-size:12px;color:rgba(0,0,0,.55);background:rgba(0,0,0,.02)}"
    + ".ai-tool code{font-family:'SF Mono',Menlo,monospace;font-size:11px;color:rgba(0,0,0,.65);background:rgba(0,0,0,.05);border-radius:5px;padding:1px 5px;white-space:nowrap}"
    + ".lc{display:inline-block;flex:none;vertical-align:-2px}"
    + ".ai-tool .ai-spin{width:13px;height:13px;color:rgba(0,0,0,.5);animation:ai-rot .8s linear infinite}"
    + ".ai-tool.done .ai-spin{display:none}.ai-tool .ai-check{display:none;width:13px;height:13px;color:rgba(0,0,0,.72)}.ai-tool.done .ai-check{display:inline-block}"
    /* the owner's chat, set the way it reads (md() below) */
    + ".md p{margin:0}.md>*+*{margin-top:8px}.md .mh{display:flex;align-items:center;gap:6px;font-weight:600}.md .mh .lc{width:15px;height:15px}"
    + ".md ul{margin:4px 0 0;padding-left:18px}.md ul li{margin:1px 0}.md .mh+ul,.md .mh+p{margin-top:4px}"
    + "@keyframes ai-rot{to{transform:rotate(360deg)}}"
    + ".ai-dockrow{padding:10px 12px 14px;border-top:1px solid rgba(0,0,0,.08)}"
    + ".ai-dock{display:flex;align-items:center;gap:8px;border:1px solid rgba(0,0,0,.12);border-radius:14px;padding:10px 14px;font-size:14px;color:#111;min-height:20px}.ai-dock .ai-ph{color:rgba(0,0,0,.35)}"
    + "#th{scroll-behavior:smooth}#th::-webkit-scrollbar{display:none}"
    + ".pg{position:absolute;inset:0;overflow:hidden;background:#fff;will-change:transform}.pg.off{visibility:hidden}.pgin{min-height:100%;will-change:transform}.pgin>img.shot{display:block;width:100%;filter:grayscale(1)}";
  const SB = '<div class="sb"><span>9:41</span><span class="bt"></span></div>';
  /* Lucide's icons (lucide.dev, ISC), inline: the reel's glyphs in place of
     the product's emoji (his note, 29 Sept: "lucide icons vs emoji's") */
  const LC = (cls, body) => '<svg class="lc ' + cls + '" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + body + "</svg>";
  const ICON = {
    spin: LC("ai-spin", '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>'),
    done: LC("ai-check", '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'),
    check: LC("", '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'),
    alert: LC("", '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>'),
  };
  /* the owner's chat, set the way it reads. The product prints its
     markdown raw (**bold**, _calling `tool`..._, emoji; NOTES.md), which in
     a reel reads as broken (his note, 29 Sept: "less 'code'"): here bold is
     bold, a list is a list, and a heading's emoji is Lucide's. Tool calls
     are taken out and shown as status rows (bot() in ownerChatShot) */
  const md = (t) => t.split("\n\n").map((bk) => {
    let out = "", list = [];
    const flush = () => { if (list.length) { out += "<ul>" + list.map((x) => "<li>" + esc(x) + "</li>").join("") + "</ul>"; list = []; } };
    bk.split("\n").forEach((ln) => {
      const h = ln.match(/^\*\*(.+)\*\*$/);
      if (h) {
        flush(); let txt = h[1], ic = "";
        if (/^✅/.test(txt)) { ic = ICON.check; txt = txt.replace(/^✅\s*/, ""); } else if (/^⚠/.test(txt)) { ic = ICON.alert; txt = txt.replace(/^⚠\uFE0F?\s*/, ""); }
        out += '<div class="mh">' + ic + "<span>" + esc(txt) + "</span></div>";
      } else if (/^- /.test(ln)) list.push(ln.slice(2));
      else { flush(); if (ln.trim()) out += "<p>" + esc(ln) + "</p>"; }
    });
    flush(); return out;
  }).join("");
  const MARKSRC = "/lab/dsc-demos/assets/logo-mark.png";
  const CHEV = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';

  /* the app's screens, their class strings verbatim from the demos
     (athlete-mcp-loop.html, owner-batch-chat.html, standing-slots.html,
     each citing the JSX file and lines it copies) */
  const UI = {
    ai: '<div class="ai-chat"><div class="ai-head"><span class="ai-dot"></span> AI assistant <span class="ai-conn">DSC connected · MCP</span></div>'
      + '<div class="ai-scroll" id="sc"></div><div class="ai-dockrow"><div class="ai-dock" id="dock"><span class="ai-ph">Message…</span></div></div></div>',
    /* the owner's home as the app draws it (admin/page.tsx 293-331, 515-531):
       the check-in box above the alerts, the four cards below; the same
       home the second act tours in full */
    home: '<div class="bg-white flex flex-col" style="min-height:0;flex:1">'
      + '<header class="px-4 pt-6 pb-4 flex items-center justify-between"><div class="flex items-center gap-3"><img src="' + MARKSRC + '" alt="DSC" width="44" height="44"></div>'
      + '<div class="flex items-center gap-3"><span class="dsc-label text-black/60">Account</span><button class="dsc-label text-black/60">Log out</button></div></header>'
      + '<div class="px-4 pb-3"><div class="rounded-3xl bg-black/[0.04] p-4 max-w-3xl mx-auto w-full"><div class="flex items-center justify-between mb-2"><div class="dsc-label text-black/50">Check in</div></div><input placeholder="Type a name…" autocomplete="off" tabindex="-1" class="w-full h-12 px-4 bg-white rounded-2xl text-black text-base placeholder:text-black/30"></div></div>'
      + '<div class="px-4 space-y-2 pb-2" id="alerts"></div>'
      + '<section class="px-4 pt-2 pb-4"><div class="grid grid-cols-2 gap-3 max-w-3xl mx-auto">'
      + [["Talk to the scheduler", "Chat /\nSchedule"], ["See the week", "Calendar"], ["Hours &amp; roster", "Trainers"], ["Members &amp; assignments", "Athletes"]].map(([a, b]) => '<span class="group block bg-black/[0.04] rounded-3xl p-4 aspect-square flex flex-col justify-between overflow-hidden"><span class="dsc-label text-black/40 break-words">' + a + '</span><span class="dsc-headline text-2xl text-black whitespace-pre-line leading-[0.9] break-words">' + b + "</span></span>").join("")
      + "</div></section></div>",
    box: '<div class="flex items-center gap-2 mb-2"><span class="w-2 h-2 rounded-full bg-black"></span><span class="dsc-label text-black">Booking requests · 1</span></div>'
      + '<div class="space-y-2"><div class="bg-white rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center gap-2"><div class="flex-1 min-w-0">'
      + '<div class="text-black text-sm"><span class="font-medium">Marcus Chen</span><span class="text-black/50"> wants </span><span class="font-medium">Scott</span></div>'
      + '<div class="text-xs text-black/60 mt-0.5">Mon, Jun 15 · 8:00 AM · 60min<span class="ml-2 dsc-label text-black/40">via AI</span></div></div>'
      + '<div class="flex gap-2 shrink-0"><button id="ok" class="h-8 px-3 bg-black text-white text-xs rounded-full dsc-headline">Approve</button><button class="h-8 px-3 text-black/60 text-xs hover:text-black">Decline</button></div></div></div>',
    chat: '<header class="sticky top-0 z-10 bg-white/95 backdrop-blur px-4 py-3 flex items-center gap-3 border-b border-black/10"><span class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 text-black/70">' + CHEV + '</span><div class="dsc-headline text-lg md:text-xl text-black">Chat</div></header>'
      + '<div id="bn"></div>'
      + '<div class="flex flex-col h-full bg-white" style="flex:1;min-height:0"><div class="flex items-center justify-between px-4 py-3 border-b border-black/10"><span class="dsc-label text-black/60">Conversation</span><button class="dsc-label text-black/40 hover:text-black">Start fresh</button></div>'
      + '<div id="th" class="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[260px]"></div>'
      + '<div class="px-3 pt-2 pb-3 border-t border-black/10 flex items-center gap-2">'
      + '<button class="shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg bg-black text-white"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg></button>'
      + '<div id="in" class="flex-1 px-4 h-12 bg-black/5 rounded-full text-[15px] text-black" style="display:flex;align-items:center;overflow:hidden;white-space:nowrap"></div>'
      + '<button id="send" class="shrink-0 h-12 px-4 bg-black text-white rounded-full text-sm font-semibold">Send</button></div></div>',
    day: '<div class="bg-white" style="min-height:0;flex:1;overflow:hidden">'
      + '<header class="sticky top-0 z-10 bg-white/95 backdrop-blur px-4 py-3 flex items-center gap-3 border-b border-black/10"><span class="w-9 h-9 flex items-center justify-center rounded-full text-black/70">' + CHEV + '</span><span class="block"><img src="' + MARKSRC + '" alt="DSC" width="28" height="28"></span><div class="ml-2 dsc-headline text-lg text-black truncate">Tuesday, Jun 16</div></header>'
      + '<div class="max-w-3xl mx-auto w-full px-4 py-6"><div class="flex items-end justify-between mb-6"><div><div class="dsc-label text-black/40 mb-1">Tuesday</div><div class="dsc-headline text-5xl md:text-6xl text-black leading-none">Jun 16</div></div>'
      + '<div class="flex items-center gap-2"><span class="w-10 h-10 flex items-center justify-center rounded-full bg-black/5 text-black/70">←</span><span class="w-10 h-10 flex items-center justify-center rounded-full bg-black/5 text-black/70">→</span></div></div>'
      + '<button class="w-full mb-4 h-12 bg-black text-white rounded-full dsc-headline text-base">+ Add session</button><div class="space-y-2" id="dl">'
      + ["5:00am", "6:00am", "7:00am"].map((t) => '<button class="w-full rounded-3xl p-5 flex items-center justify-between gap-4 bg-black text-white"><span class="flex items-baseline gap-4 min-w-0 text-left"><span class="font-mono text-sm opacity-75 shrink-0 w-16">' + t + '</span><span class="min-w-0"><span class="font-semibold truncate" style="display:block">Max Bishop</span><span class="dsc-label opacity-60 mt-0.5" style="display:block">Scott · 60 min</span></span></span><span class="dsc-label opacity-50 shrink-0">Edit</span></button>').join("")
      + "</div></div></div>",
    row: '<span class="flex items-baseline gap-4 min-w-0 text-left"><span class="font-mono text-sm opacity-75 shrink-0 w-16">4:00pm</span><span class="min-w-0"><span class="font-semibold truncate" style="display:block">Marcus Chen</span><span class="dsc-label opacity-60 mt-0.5" style="display:block">Scott · 60 min</span></span></span><span class="dsc-label opacity-50 shrink-0">Edit</span>',
  };
  /* the owner's batch, as the product renders it: raw text, the **…** and
     _calling …_ marks literal (NOTES.md), the em dashes out */
  const BATCH = [
    "Let me first look up Marcus Chen's athlete ID, then I'll get this batch scheduled!\n\n_calling `list_athletes`…_",
    "Got him. Now let me run the batch proposal: M/W/F at 3pm with Scott for 4 weeks starting next Monday (6/15).\n\n_calling `propose_batch`…_",
    "Here's the rundown:\n\n**✅ 10 sessions accepted**\n- Jun 22, 24, 26\n- Jun 29, Jul 1, 3\n- Jul 6, 8, 10\n- Jul 13\n\n**⚠️ 3 conflicts (skipped)**\nJun 15, 17, and 19: Marcus already has Scott at 3pm those days, so no duplicates were added.\n\nThat's 10 new sessions queued up in the draft. Want me to go ahead and commit them?",
    "_calling `commit_all_pending`…_",
    "Done, 13 sessions are on the calendar. Marcus is locked in with Scott, M/W/F at 3pm through July 13.",
  ];
  /* the athlete's exchange, the availability as the AI laid it out (a
     real Claude session against the live MCP server) */
  const AVAIL = [
    "<strong>Monday, June 15</strong>: 7:00 AM to 2:00 PM (every 30 min), plus a 4:00 PM slot",
    "<strong>Tuesday, June 16</strong>: 8:00 AM to 12:00 PM (every 30 min)",
    "<strong>Wednesday, June 17</strong>: 7:00 AM to 2:00 PM (every 30 min), plus a 4:00 PM slot",
    "<strong>Thursday, June 18</strong>: 8:00 AM to 12:00 PM (every 30 min)",
  ];
  const DETAILS = ["• <strong>Trainer:</strong> Scott", "• <strong>When:</strong> Monday, June 15, 8:00 AM Central", "• <strong>Duration:</strong> 60 minutes", "• <strong>Status:</strong> Pending Scott's approval"];

  /* a phone, drawn at its own size and scaled: 390 by 800 inside an
     eleven-pixel bezel */
  const DW = 412, DH = 822;
  const phone = (c, s, cx, cy, h, o) => {
    o = o || {};
    const k = h / DH, w = DW * k;
    const cam = c.el("div", "cam");
    cam.style.cssText = `left:${Math.round(cx - w / 2)}px;top:${Math.round(cy - h / 2)}px;width:${Math.round(w)}px;height:${Math.round(h)}px`;
    const dev = c.el("div", "dev"); dev.style.transform = "scale(" + k.toFixed(5) + ")";
    const scr = c.el("div", "scr"); dev.appendChild(scr); dev.appendChild(c.el("i", "isl"));
    cam.appendChild(dev); s.appendChild(cam);
    const P = { cam, dev, scr, k, w, h, x: cx - w / 2, y: cy - h / 2, doc: null, frame: null };
    if (o.img) {
      const im = c.el("img", "top"); im.alt = ""; im.decoding = "async"; im.src = srcOf(o.img, 0); scr.appendChild(im);
      P.ready = Promise.resolve(null);
      return P;
    }
    /* a phone with sections: each a page of its own, the first showing */
    if (o.pages) o.body = o.pages.map((pg, i) => '<div class="pg' + (i ? " off" : "") + '"><div class="pgin">' + (pg.img ? '<img class="shot" alt="" src="' + srcOf(pg.img, 0) + '">' : pg.html) + "</div></div>").join("");
    const f = document.createElement("iframe"); f.className = "ui"; f.setAttribute("tabindex", "-1"); f.setAttribute("aria-hidden", "true"); f.title = "";
    scr.appendChild(f); P.frame = f;
    P.ready = appCss().then((css) => new Promise((res) => {
      f.addEventListener("load", () => { P.doc = f.contentDocument; res(P.doc); }, { once: true });
      f.srcdoc = '<!doctype html><html><head><meta charset="utf-8"><style>' + FONTS + css + UICSS + "</style></head><body>" + SB + '<div class="app">' + (o.body || "") + "</div></body></html>";
    }));
    if (c.phoneFrame) c.phoneFrame(f);
    if (c.hold) c.hold(P.ready);
    return P;
  };
  /* inside a phone: the next section pushes in from the right and the
     last gives way, as a phone navigates; a section scrolls up within
     the glass */
  const flip = (c, doc, i, dur) => {
    dur = dur || 540;
    const pages = [...doc.querySelectorAll(".pg")], nx = pages[i]; if (!nx) return;
    const cur = pages.find((pg) => pg !== nx && !pg.classList.contains("off"));
    nx.classList.remove("off");
    c.anim(nx, [{ transform: "translateX(100%)" }, { transform: "translateX(0%)" }], { duration: dur, easing: "cubic-bezier(0.7, 0, 0.15, 1)" });
    if (cur) {
      c.anim(cur, [{ transform: "translateX(0%)", filter: "brightness(1)" }, { transform: "translateX(-30%)", filter: "brightness(0.9)" }], { duration: dur, easing: "cubic-bezier(0.7, 0, 0.15, 1)", fill: "forwards" });
      c.T(dur + 20, () => cur.classList.add("off"));
    }
  };
  const scrollPg = (c, doc, i, px, dur) => {
    const pg = doc.querySelectorAll(".pg")[i]; if (!pg) return;
    const inner = pg.firstChild, max = Math.max(0, inner.scrollHeight - pg.clientHeight), y = px == null ? max : Math.min(px, max);
    if (y > 0) c.anim(inner, [{ transform: "translateY(0px)" }, { transform: "translateY(" + -y + "px)" }], { duration: dur || 1400, easing: "cubic-bezier(0.45, 0, 0.35, 1)", fill: "forwards" });
  };
  /* a phone going through its sections: each held for its time, its own
     steps run from when it shows, and a tag outside the phone naming it */
  const sections = (c, P, t0, list, tag) => script(c, P, t0, (doc, at) => {
    let t = 0;
    list.forEach((sec, i) => {
      if (i) at(t, () => flip(c, doc, i));
      const s0 = t + (i ? 320 : 0);
      if (tag && sec.tag) tag(sec.tag, s0 - (i ? 120 : 0));
      if (sec.run) sec.run(doc, (ms, f) => at(s0 + ms, f), c);
      if (sec.scroll) at(s0 + (sec.scroll[0] || 350), () => scrollPg(c, doc, i, sec.scroll[1], sec.scroll[2] || Math.max(700, sec.d - (sec.scroll[0] || 350) - 250)));
      t += sec.d;
    });
  });
  /* how a pair names its sections (his notes, 29 Sept): "small" unless
     asked, "list", or "large", the spines he tried first. ?labels= picks
     one, and the review page switches them */
  const LABEL_KINDS = ["small", "list", "large"];
  let LABELS = (() => { const k = (new URLSearchParams(location.search).get("labels") || "").toLowerCase(); return LABEL_KINDS.includes(k) ? k : "small"; })();
  /* the names small (his note on the spines, 29 Sept: "eh, this didnt
     workout like i thought, the sideways type ... maybe it's small
     sideways type that feels like a simple label?"): the reel's label on
     its side, on the reel's margin, or nearer the phone where the margin
     is narrow; the right reads down from the head, the left, turned, up
     from the foot. As a list, every section the phone will show is set,
     the one on screen in ink and the rest grey. A change is crossed by a
     small band of ink running along the name */
  const labelAt = (c, s, right, names, list, edge) => {
    const g = c.el("div", "plab lab" + (right ? " r" : ""));
    const items = (list ? names : [names[0] || ""]).map((n) => { const it = c.el("span", "pl-i" + (list ? " g" : "")); it.textContent = n; g.appendChild(it); return it; });
    g.style.visibility = "hidden"; s.appendChild(g);
    const x = Math.max(3, Math.min(c.pad, edge - g.offsetWidth * 1.8));
    g.style[right ? "right" : "left"] = x.toFixed(1) + "px";
    g.style[right ? "top" : "bottom"] = c.pad + "px";
    let on = -1;
    return (text, at) => c.T(Math.max(0, at), () => {
      const k = list ? Math.max(0, names.indexOf(text)) : 0, it = items[k], first = g.style.visibility === "hidden";
      if (!list && first) it.textContent = text;
      const b = c.el("i", "bd go"); b.style.visibility = "visible"; (first && list ? g : it).appendChild(b);
      c.T(330, () => {
        if (list) { if (on >= 0) items[on].classList.add("g"); it.classList.remove("g"); on = k; } else it.textContent = text;
        g.style.visibility = "";
      });
      c.T(720, () => b.remove());
    });
  };
  /* a pair's section names set large up the frame's edges, as spines (his
     note, 29 Sept: "more graphic? maybe they're running up the sides and
     large?"): the left reads up from the foot, the right down from the
     head, one size for both, fitted so the longest name either will carry
     fits the frame's height and the margin beside its phone; each change
     crossed by a band of ink running along the words */
  const spineSize = (c, s, names, margin) => {
    const g = c.el("div", "spine r"), tt = c.el("div", "sp-t"); g.appendChild(tt); g.style.visibility = "hidden"; tt.style.fontSize = "100px"; s.appendChild(g);
    let long = 1; names.forEach((n) => { tt.textContent = n; long = Math.max(long, g.offsetHeight); });
    g.remove();
    return Math.max(10, Math.min((100 * (c.H - 2 * c.pad)) / long, (margin * 0.8) / 0.92));
  };
  const spineAt = (c, s, right, fs, margin) => {
    const g = c.el("div", "spine" + (right ? " r" : "")), tt = c.el("div", "sp-t");
    const x = Math.max(2, (margin - fs * 0.92) / 2);
    tt.style.fontSize = fs.toFixed(1) + "px"; g.appendChild(tt);
    g.style.cssText = (right ? `right:${x.toFixed(1)}px;top:${c.pad}px` : `left:${x.toFixed(1)}px;bottom:${c.pad}px`) + ";visibility:hidden";
    s.appendChild(g);
    return (text, at) => c.T(Math.max(0, at), () => {
      if (g.style.visibility === "hidden") tt.textContent = text;
      const b = c.el("i", "bd go"); b.style.visibility = "visible"; g.appendChild(b);
      c.T(330, () => { tt.textContent = text; g.style.visibility = ""; });
      c.T(720, () => b.remove());
    });
  };
  /* two phones side by side, larger than the frame so it crops them,
     each going through its own sections, drifting against each other.
     Mirrored (o.mirror), the left phone rides high and the right low, so
     two pairs in a row don't repeat */
  const pairShot = (o) => ({ name: o.name, d: o.d, cut: o.cut, dir: o.dir, ground: o.ground || "paper dots", app: true, scr: [...o.left, ...o.right].some((x) => x.screen), pics: o.pics || [], build(c, s) {
    const d = this.d, h = c.H * (o.h || 1.2), m = !!o.mirror;
    const left = o.left.map(screenOf), right = o.right.map(screenOf);
    const L = phone(c, s, c.W * 0.285, c.H * (m ? 0.42 : 0.6), h, { pages: left });
    const R = phone(c, s, c.W * 0.715, c.H * (m ? 0.6 : 0.42), h, { pages: right });
    const drift = (P, a, b) => c.anim(P.cam, [{ transform: "translateY(" + (a * c.H).toFixed(1) + "px) scale(1)" }, { transform: "translateY(" + (b * c.H).toFixed(1) + "px) scale(1.035)" }], { duration: d + 900, easing: "linear", fill: "forwards" });
    if (m) { drift(L, -0.02, 0.05); drift(R, 0.03, -0.05); } else { drift(L, 0.03, -0.05); drift(R, -0.02, 0.05); }
    /* the names run up the margins beside the phones, as LABELS says */
    const w = DW * h / DH, margin = c.W * 0.285 - w / 2, names = (list) => list.map((x) => x.tag).filter(Boolean);
    let tl, tr;
    if (LABELS === "large") {
      const fs = spineSize(c, s, [...names(left), ...names(right)], margin);
      tl = spineAt(c, s, false, fs, margin); tr = spineAt(c, s, true, fs, margin);
    } else {
      /* the phone's outer edge where its drift leaves it, a little larger */
      const edge = c.W * 0.285 - (w / 2) * 1.035;
      tl = labelAt(c, s, false, names(left), LABELS === "list", edge); tr = labelAt(c, s, true, names(right), LABELS === "list", edge);
    }
    return (t0) => { sections(c, L, t0, left, tl); sections(c, R, t0 + (o.lag || 260), right, tr); return 0; };
  } });

  /* the camera: a list of poses, each a scale and the point of the phone
     (a share of its box) it carries toward a point of the frame, joined
     on one soft curve, and the last held only by the end of the shot */
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
  /* where a thing inside a phone stands on the frame */
  const onStage = (c, P, node) => {
    const fr = P.frame.getBoundingClientRect(), st = c.stageRect(), r = node.getBoundingClientRect(), k = fr.width / 390;
    return { x: fr.left - st.left + r.left * k, y: fr.top - st.top + r.top * k, w: r.width * k, h: r.height * k };
  };
  /* a script inside a phone, timed from the shot's own clock however long
     the phone took to load */
  const script = (c, P, t0, fn) => {
    const born = c.now() + t0;
    const done = P.ready.then((doc) => {
      if (!doc) return;
      const at = (ms, f) => c.T(Math.max(0, born + ms - c.now()), f);
      fn(doc, at);
    });
    if (c.hold) c.hold(done);
  };
  const addIn = (d, parent, cls, html) => { const b = d.createElement("div"); b.className = cls + " pp"; if (html != null) b.innerHTML = html; parent.appendChild(b); void b.offsetWidth; b.classList.add("in"); return b; };
  /* typed into a field, the caret following */
  const typeIn = (c, d, node, text, at, per, done) => {
    at(0, () => {
      node.textContent = ""; const tx = d.createTextNode(""), car = d.createElement("span"); car.className = "car"; node.appendChild(tx); node.appendChild(car);
      let n = 0;
      c.every(per, () => { n = Math.min(text.length, n + 1); tx.nodeValue = text.slice(0, n); if (n >= text.length) { car.remove(); if (done) done(); return false; } return true; });
    });
  };
  /* the spread's column beside a phone: its running head, then notes a
     line or a tool call at a time, drifting up the whole while */
  const notesAt = (c, s, x, y, w, head, d) => {
    const H = c.el("div", "rh"); H.style.cssText = `left:${x}px;right:auto;width:${w}px;top:${y}px`;
    const a = c.el("div", "lab", esc(head)), r = c.el("i", "rule"); H.appendChild(a); H.appendChild(r); s.appendChild(H);
    const col = c.el("div", "notes"); col.style.cssText = `left:${x}px;top:${y + H.offsetHeight + c.H * 0.055}px;width:${w}px`;
    s.appendChild(col);
    c.anim(col, [{ transform: "translateY(0px)" }, { transform: "translateY(" + (-c.H * 0.035).toFixed(1) + "px)" }], { duration: d + 900, easing: "linear", fill: "forwards" });
    return {
      head(at) { c.go(r, at); c.wipe(a, { at: at + 60, kind: "tint", dur: 460 }); },
      add(at, o) {
        const n = c.el("div", "note"), rl = c.el("i", "rule hair"); n.appendChild(rl);
        let L = null, Y = null, R = null;
        if (o.lab) { L = c.el("div", "lab", esc(o.lab)); n.appendChild(L); }
        if (o.trace) { R = c.el("div", "trace"); R.appendChild(c.tick()); R.appendChild(c.el("span", null, esc(o.trace))); n.appendChild(R); }
        if (o.say) { Y = c.el("div", "say", o.say); n.appendChild(Y); }
        n.style.visibility = "hidden"; col.appendChild(n);
        c.T(at, () => { n.style.visibility = ""; });
        c.go(rl, at);
        if (L) c.wipe(L, { at: at + 60, kind: "tint", dur: 460 });
        if (R) { c.wipe(R.lastChild, { at: at + 60, kind: "tint", dur: 420 }); c.go(R.firstChild, at + 380); }
        if (Y) c.wipe(Y, { at: at + (R ? 260 : 140), kind: "tint", dur: 560 });
        return n;
      },
    };
  };
  const glideShot = (name, o) => Object.assign({ name, ground: "photo", pics: [name], build(c, s) {
    const p = c.pic(name, [0, 0, c.W, c.H], { op: o && o.op });
    s.appendChild(p);
    const [a, b] = (o && o.glide) || [[1, 0, 0], [1.07, -1, 0]];
    c.anim(p.firstChild, [{ transform: `translate(${a[1]}%, ${a[2]}%) scale(${a[0]})` }, { transform: `translate(${b[1]}%, ${b[2]}%) scale(${b[0]})` }], { duration: (o.d || 1200) + 1100, easing: "linear", fill: "forwards" });
    return () => 0;
  } }, o || {});
  /* a headline across the page, then drifting while the dots do */
  const mixHead = (label, text, o) => Object.assign({ name: label, ground: "paper dots", build(c, s) {
    const K = kicker(c, s, c.pad, c.top, c.W * 0.46, label);
    const T = headline(c, s, c.pad, c.top + K.h() + c.H * 0.05, c.W - 2 * c.pad, text, 2, Math.min(84, c.W * 0.09));
    c.anim(T, [{ transform: "translateY(0px)" }, { transform: "translateY(" + (-c.H * 0.03).toFixed(1) + "px)" }], { duration: (o.d || 1600) + 900, easing: "linear", fill: "forwards" });
    return (t0) => { K.play(t0); return c.wipe(T, { at: t0 + 150 }); };
  } }, o || {});
  const markShot = (o) => Object.assign({ name: "The mark", ground: "ink", build(c, s) {
    const m = c.el("i", "mark fd"), sz = Math.round(c.H * 0.36);
    m.style.cssText = `left:${(c.W - sz * 0.9) / 2}px;top:${(c.H - sz) / 2 - c.H * 0.05}px;width:${sz * 0.9}px;height:${sz}px`;
    s.appendChild(m);
    const N = c.el("div", "lab abs", "Dallas Sport Collective"); s.appendChild(N);
    N.style.cssText = `left:0;right:0;text-align:center;top:${(c.H + sz) / 2 - c.H * 0.02}px`;
    c.anim(m, [{ transform: "scale(0.94)" }, { transform: "scale(1.02)" }], { duration: (o.d || 1400) + 600, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" });
    return (t0) => { c.go(m, t0); c.wipe(N, { at: t0 + 300, kind: "tint" }); return 0; };
  } }, o || {});

  /* the athlete asks their own AI; the request flies to the owner */
  const aiShot = { name: "The athlete's AI", d: 5700, cut: "mask", ground: "paper dots", app: true, build(c, s) {
    const d = this.d;
    const P = phone(c, s, c.W * 0.72, c.H * 0.53, c.H * 1.0, { body: UI.ai });
    const N = notesAt(c, s, c.pad, c.top, c.W * 0.4, "Booking by AI", d);
    camera(c, P, d + 700, [
      { t: 0, s: 1 },
      { t: 0.3, s: 1.12, fx: 0.5, fy: 0.55, tx: c.W * 0.72, ty: c.H * 0.52, k: 0.6 },
      { t: 1, s: 1.34, fx: 0.5, fy: 0.72, tx: c.W * 0.72, ty: c.H * 0.56, k: 0.85 },
    ]);
    return (t0) => {
      N.head(t0);
      N.add(t0 + 250, { lab: "The athlete's own AI", say: esc("Claude, ChatGPT or Gemini, connected with one URL.") });
      script(c, P, t0, (doc, at) => {
        const sc = doc.getElementById("sc"), dock = doc.getElementById("dock");
        const scroll = () => { sc.scrollTop = sc.scrollHeight; };
        const tool = (code, label) => addIn(doc, sc, "ai-tool", ICON.spin + ICON.done + "<code>" + esc(code) + "</code><span>" + esc(label) + "</span>");
        typeIn(c, doc, dock, REAL.ask, at, 14);
        at(1150, () => { dock.innerHTML = '<span class="ai-ph">Message…</span>'; addIn(doc, sc, "ai-user", esc(REAL.ask)); scroll(); });
        let t1 = null;
        at(1350, () => { t1 = tool("my_trainer_availability", "Cataloging Scott's availability across weekday slots"); scroll(); });
        at(1850, () => { if (t1) t1.classList.add("done"); });
        let r1 = null;
        at(1950, () => { r1 = addIn(doc, sc, "ai-reply", esc(REAL.avail) + " All times are Central (gym local), and these are start times for a 60-minute session:"); scroll(); });
        AVAIL.forEach((line, i) => at(2250 + i * 120, () => { if (r1) { r1.insertAdjacentHTML("beforeend", "\n" + line); scroll(); } }));
        typeIn(c, doc, dock, REAL.book, (ms, f) => at(3000 + ms, f), 16);
        at(3650, () => { dock.innerHTML = '<span class="ai-ph">Message…</span>'; addIn(doc, sc, "ai-user", esc(REAL.book)); scroll(); });
        let t2 = null;
        at(3800, () => { t2 = tool("request_session", "Converting Monday 8 AM to ISO 8601 timezone format"); scroll(); });
        at(4250, () => { if (t2) t2.classList.add("done"); });
        let r2 = null;
        at(4350, () => { r2 = addIn(doc, sc, "ai-reply", "Done, your request is in. Here are the details:"); scroll(); });
        DETAILS.forEach((line, i) => at(4550 + i * 110, () => { if (r2) { r2.insertAdjacentHTML("beforeend", "\n" + line); scroll(); } }));
        /* the request lifts out of the reply as the owner app's card and
           holds where it is; the owner's screen slides in under it */
        at(d - t0 - 460, () => { if (r2) { const q = onStage(c, P, r2); c.lift({ x: q.x, y: q.y }, ownW(c)); } });
      });
      N.add(t0 + 1400, { trace: "my_trainer_availability", say: esc("It reads the gym's real schedule.") });
      N.add(t0 + 3850, { trace: "request_session", say: esc(SAY.onlyRequest.replace("An athlete's AI", "It")) });
      return 0;
    };
  } };
  /* the owner's console, lined up under the request the athlete's chat let
     go of: the phone is placed so the app's own request card (44 by 301.7
     device pixels into the phone, 324 wide, measured) lands exactly under
     the lifted one; the camera holds while it does, then leans in on it */
  const OWN = { h: 1.2 }, INNER = { x: 44, y: 301.7, w: 324, h: 102.7 };
  const ownW = (c) => INNER.w * (c.H * OWN.h / DH);
  const ownerShot = { name: "The owner console", d: 2900, cut: "whip", needsPrev: true, ground: "paper dots", app: true, build(c, s) {
    const d = this.d, k = c.H * OWN.h / DH, h = DH * k, w = DW * k;
    const card = c.card || { x: c.W * 0.56, y: c.H * 0.46, w: ownW(c) };
    const left = card.x - INNER.x * k, top = card.y - INNER.y * k;
    const P = phone(c, s, left + w / 2, top + h / 2, h, { body: UI.home });
    const N = notesAt(c, s, c.pad, c.top, Math.max(c.W * 0.26, Math.min(c.W * 0.4, left - c.pad * 2)), "The owner console", d);
    const fx = (INNER.x + INNER.w / 2) / DW, fy = (INNER.y + INNER.h / 2) / DH, tx = left + fx * w, ty = top + fy * h;
    camera(c, P, d + 800, [{ t: 0, s: 1 }, { t: 0.32, s: 1, fx, fy, tx, ty, k: 1 }, { t: 1, s: 1.08, fx, fy, tx, ty, k: 1 }]);
    return (t0) => {
      N.head(t0);
      N.add(t0 + 300, { lab: "Booking requests", say: esc("The request lands as a card to approve.") });
      script(c, P, 0, (doc, at) => {
        /* the box is there as the screen arrives, so the card lands on it */
        const al = doc.getElementById("alerts"), box = doc.createElement("div");
        box.className = "px-4 py-3 rounded-2xl bg-black/[0.05] border border-black/10 max-w-3xl mx-auto"; box.innerHTML = UI.box; al.appendChild(box);
        at(t0 + 320, () => { const cd = c.card; if (!cd) return; c.anim(cd.el, [{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: "forwards" }); c.T(240, () => { cd.el.remove(); if (c.card === cd) c.card = null; }); });
        at(t0 + 1300, () => {
          const b = doc.getElementById("ok"); if (!b) return;
          const r = b.getBoundingClientRect(), t = doc.createElement("i"); t.className = "tap";
          t.style.left = r.left + r.width / 2 + "px"; t.style.top = r.top + r.height / 2 + "px"; doc.body.appendChild(t);
          b.classList.add("press");
          const q = onStage(c, P, b); c.focus = { x: q.x + q.w / 2, y: q.y + q.h / 2 };
        });
        at(t0 + 1480, () => { const b = doc.getElementById("ok"); if (b) b.classList.remove("press"); box.classList.add("gone"); });
        at(t0 + 1800, () => box.remove());
      });
      N.add(t0 + 1550, { say: twoTone(REAL.approved[0], REAL.approved[1]) });
      return 0;
    };
  } };
  /* a statement as large as the frame takes it, wrapped down, the phrase
     that matters lit and the rest in grey (his note, 29 Sept: "make the
     full statement really large and wrap down"), set on the frame's foot */
  const sayShot = (text, hi, o) => Object.assign({ name: hi, ground: "ink", d: 2000, cut: "blink", build(c, s) {
    const i = text.lastIndexOf(hi), j = i + hi.length, g = (x) => (x ? '<span class="g">' + esc(x) + "</span>" : "");
    const T = c.el("div", "say-big abs", g(text.slice(0, i)) + esc(hi) + g(text.slice(j)));
    T.style.cssText = `left:${c.pad}px;top:${c.top}px;width:${c.W - 2 * c.pad}px`;
    s.appendChild(T);
    const room = c.H - c.top - c.pad;
    const lines = (o && o.lines) || 4;
    c.fit(T, lines, Math.max(18, c.W * 0.05), Math.min(c.W * 0.15, room / lines));
    T.style.top = Math.round(c.H - c.pad - T.offsetHeight) + "px";
    if (o && o.drift) { T.style.transformOrigin = "0 100%"; c.anim(T, [{ transform: "scale(1)" }, { transform: "scale(1.03)" }], { duration: (o.d || 2000) + 700, easing: "linear", fill: "forwards" }); }
    return (t0) => c.wipe(T, { at: t0, kind: "ink", dur: 760 });
  } }, o || {});
  /* the engine: every check, quickly, on black */
  const checksShot = { name: "The checks", d: 3000, cut: "split", ground: "ink", build(c, s) {
    const K = kicker(c, s, c.pad, c.top, c.W * 0.5, "One engine");
    const k = checksAt(c, s, c.pad, c.top + K.h() + c.H * 0.06, Math.min(c.W * 0.62, 560), { size: "lg", gap: 165, bullets: true });
    c.anim(k.box, [{ transform: "translateY(0px)" }, { transform: "translateY(" + (-c.H * 0.03).toFixed(1) + "px)" }], { duration: this.d + 800, easing: "linear", fill: "forwards" });
    return (t0) => { K.play(t0); return k.play(t0 + 60); };
  } };
  /* the owner says the week: the scheduler proposes, skips three by name,
     waits for commit */
  const ownerChatShot = { name: "The owner's chat", d: 5500, cut: "push", ground: "paper dots", app: true, at: (c) => ({ x: c.W * 0.575, y: c.H * 0.46 }), build(c, s) {
    const d = this.d;
    const P = phone(c, s, c.W * 0.71, c.H * 0.53, c.H * 1.0, { body: UI.chat });
    const N = notesAt(c, s, c.pad, c.top, c.W * 0.4, "A week by chat", d);
    camera(c, P, d + 700, [
      { t: 0, s: 1.04 },
      { t: 0.25, s: 1.14, fx: 0.5, fy: 0.62, tx: c.W * 0.71, ty: c.H * 0.55, k: 0.6 },
      { t: 0.7, s: 1.3, fx: 0.5, fy: 0.55, tx: c.W * 0.71, ty: c.H * 0.52, k: 0.85 },
      { t: 1, s: 1.34, fx: 0.5, fy: 0.62, tx: c.W * 0.71, ty: c.H * 0.54, k: 0.9 },
    ]);
    return (t0) => {
      N.head(t0);
      script(c, P, t0, (doc, at) => {
        const th = doc.getElementById("th"), inp = doc.getElementById("in"), send = doc.getElementById("send"), bn = doc.getElementById("bn");
        const scroll = () => { th.scrollTop = th.scrollHeight; };
        const user = (t) => { const row = addIn(doc, th, "flex justify-end"); const b = doc.createElement("div"); b.className = "max-w-[88%] px-3.5 py-2.5 text-[15px] leading-snug whitespace-pre-wrap bg-black text-white rounded-2xl rounded-tr-md"; b.textContent = t; row.appendChild(b); scroll(); };
        const bot = (t) => {
          th.querySelectorAll(".ai-tool:not(.done)").forEach((x) => x.classList.add("done"));
          const calls = [], words = [];
          t.split("\n\n").forEach((bk) => { const m = bk.match(/^_calling `([^`]+)`…_$/); if (m) calls.push(m[1]); else words.push(bk); });
          let row = null;
          if (words.length) {
            row = addIn(doc, th, "flex justify-start");
            const b = doc.createElement("div"); b.className = "max-w-[88%] px-3.5 py-2.5 text-[15px] leading-snug bg-black/5 text-black rounded-2xl rounded-tl-md md";
            b.innerHTML = md(words.join("\n\n")); row.appendChild(b);
          }
          calls.forEach((name) => addIn(doc, th, "ai-tool", ICON.spin + ICON.done + "<code>" + esc(name) + "</code>"));
          scroll(); return row;
        };
        const press = (ms) => { at(ms, () => send.classList.add("press")); at(ms + 140, () => send.classList.remove("press")); };
        typeIn(c, doc, inp, REAL.batch, at, 11);
        press(1130);
        let think = null;
        at(1200, () => { inp.textContent = ""; user(REAL.batch); think = addIn(doc, th, "flex justify-start", '<div class="bg-black/5 text-black/40 rounded-2xl rounded-tl-md px-3.5 py-2.5 text-[15px] italic">thinking…</div>'); scroll(); });
        at(1650, () => { if (think) think.remove(); bot(BATCH[0]); });
        at(2150, () => bot(BATCH[1]));
        at(2700, () => bot(BATCH[2]));
        let ban = null;
        at(3150, () => { ban = addIn(doc, bn, "px-4 py-2 border-b border-black/10 bg-black/[0.05] flex items-center gap-2 shrink-0", '<span class="w-2 h-2 rounded-full bg-black"></span><span class="dsc-label text-black">13 pending · say “commit” to confirm</span>'); });
        typeIn(c, doc, inp, REAL.commit, (ms, f) => at(3450 + ms, f), 45);
        press(3760);
        at(3820, () => { inp.textContent = ""; user(REAL.commit); });
        at(4050, () => bot(BATCH[3]));
        at(4450, () => { bot(BATCH[4]); if (ban) ban.classList.add("gone"); });
      });
      N.add(t0 + 1700, { trace: "list_athletes" });
      N.add(t0 + 2250, { trace: "propose_batch", say: twoTone("10 accepted.", "3 skipped for conflicts.") });
      N.add(t0 + 4050, { trace: "commit_all_pending", say: esc("Nothing is booked until the owner says commit.") });
      return 0;
    };
  } };
  /* a standing slot: the engine writes the next eight Tuesdays */
  const dayShot = { name: "Standing slots", d: 2100, cut: "slat", ground: "paper dots", app: true, build(c, s) {
    const d = this.d;
    const P = phone(c, s, c.W * 0.29, c.H * 0.56, c.H * 1.04, { body: UI.day });
    const N = notesAt(c, s, c.W * 0.56, c.top, c.W * 0.4, "Standing slots", d);
    camera(c, P, d + 700, [
      { t: 0, s: 1.02, fx: 0.5, fy: 0.45, tx: c.W * 0.29, ty: c.H * 0.5, k: 0.4 },
      { t: 1, s: 1.22, fx: 0.5, fy: 0.72, tx: c.W * 0.29, ty: c.H * 0.56, k: 0.9 },
    ]);
    return (t0) => {
      N.head(t0);
      N.add(t0 + 200, { lab: "Tuesdays · 4:00 PM · Scott", say: esc("One recurring slot fills the next eight weeks.") });
      script(c, P, t0, (doc, at) => {
        at(550, () => { const r = doc.createElement("button"); r.className = "w-full rounded-3xl p-5 flex items-center justify-between gap-4 bg-black text-white pp"; r.innerHTML = UI.row; doc.getElementById("dl").appendChild(r); void r.offsetWidth; r.classList.add("in"); });
      });
      return 0;
    };
  } };
  /* ── the second act (29 Sept): after the booking, the rest of the gym
     on the same app. His notes: the owner's screen "is quick but i think
     there are a ton more features"; the three phones at the end split
     "side by side but cropped in", flipping "through different sections
     of the app", some of them scrolling "within the phone screen". The
     screens are screens.js's, rebuilt from the app's source, one day ── */

  /* the owner's home, all of it: down through every alert, the launcher
     and its links, then into Groups, where a roster's next eight weeks go
     on the calendar in one tap. Beside it, each part named as the page
     reaches it (every other one in a narrow frame) */
  const TOUR = [[150, "Lead follow-ups"], [330, "Time off requests"], [510, "Class requests"], [1080, "Who hasn't been in"], [1680, "Attendance not taken"], [1900, "New registrations"], [3400, "Groups"]];
  const tourShot = { name: "The owner's home", d: 4900, cut: "shutter", ground: "paper dots", app: true, scr: true, build(c, s) {
    const d = this.d, O = screenOf({ screen: "owner" }), G = screenOf({ screen: "groups" });
    const P = phone(c, s, c.W * 0.29, c.H * 0.55, c.H * 1.04, { pages: [O, G] });
    const N = notesAt(c, s, c.W * 0.56, c.top, c.W * 0.4, "The owner console", d);
    camera(c, P, d + 700, [
      { t: 0, s: 1.02 },
      { t: 1, s: 1.14, fx: 0.5, fy: 0.46, tx: c.W * 0.29, ty: c.H * 0.52, k: 0.7 },
    ]);
    const few = c.W < 520;
    return (t0) => {
      N.head(t0);
      script(c, P, t0, (doc, at) => {
        O.run(doc, at, c);
        at(3300, () => flip(c, doc, 1));
        G.run(doc, (ms, f) => at(3620 + ms, f), c);
      });
      TOUR.forEach(([ms, lab], i) => { if (!few || i % 2 === 0) N.add(t0 + ms, { lab }); });
      return 0;
    };
  } };
  /* the act's turn. His note, 29 Sept: "the rest of the gym" made it sound
     like some other part, not "the backbone of running the gym"; the tour
     after it spells the parts out. Not yet a line in the study */
  const PIVOT = "The same app runs the whole gym.";
  const ACT2 = [
    mixHead("The back office", PIVOT, { d: 1900, cut: "band" }),
    tourShot,
    /* the floor: Marcus checks in for his 4pm, the coach takes the 7am's
       attendance; the PT clears Priya's ankle, Zeke's days off go on the
       calendar */
    pairShot({ name: "The floor", d: 5900, cut: "whip", dir: -1, lag: 200, pics: ["app-checkin"],
      left: [{ screen: "checkin", d: 2500, tag: "Check-in" }, { screen: "coach", d: 3000, tag: "Attendance" }],
      right: [{ screen: "injuries", d: 2400, tag: "Injuries" }, { screen: "timeoffHome", d: 1400, tag: "Time off" }, { screen: "timeoffCal", d: 1600 }] }),
    /* the site, in hand, moved here from the opening (his note, 29 Sept:
       two pictures of the site in a row to start): a breath between the two
       pairs, and the way a family finds the front door */
    glideShot("phone-site", { name: "The site", d: 1100, cut: "mask", glide: [[1.12, 2, 0], [1.2, -2, 1]] }),
    /* the front door: a lead becomes an athlete and his mother signs the
       waiver; a family signs up, into the athlete app */
    /* a little slower than the floor (his note, 29 Sept: "not QUITE as
       fast going through it") */
    pairShot({ name: "The front door", d: 7300, cut: "flash", mirror: true, pics: ["app-landing", "dash-full", "trainers-list"],
      left: [{ screen: "leads", d: 3600, tag: "Leads" }, { screen: "waiver", d: 3400, tag: "Waiver" }],
      right: [{ screen: "signup", d: 2700, tag: "Sign-up" }, { img: "dash-full", d: 2200, tag: "Athlete app", scroll: [300] }, { img: "trainers-list", d: 2100, tag: "Trainers", scroll: [300] }] }),
    /* a second dark statement, so the first act's isn't the only one (his
       note, 29 Sept), arriving the same way, by a blink */
    sayShot(SAY.runs, "more than a hundred athletes,", { name: "Two locations", d: 2800, lines: 5, cut: "blink", drift: true }),
  ];
  /* the second act alone, a bench (play.html?v=_act2), not in the row */
  V._act2 = { shots: [...ACT2, markShot({ d: 1400, cut: "band" })], loopCut: "burn", poster: 1 };

  V.mix = {
    shots: [
      glideShot("cover", { name: "Cover", d: 1400, glide: [[1, 0, 0], [1.08, -1.2, 0.4]] }),
      mixHead("From your AI", SAY.aiUse, { d: 1900, cut: "band" }),
      aiShot,
      ownerShot,
      checksShot,
      sayShot(SAY.approve, "one tap.", { name: "1 tap", d: 2000, cut: "blink", drift: true }),
      mixHead("A week by chat", SAY.weekSayIt, { d: 1600, cut: "pinch" }),
      glideShot("phone-chat", { name: "The chat, in hand", d: 1000, cut: "mask", op: "40% 50%", glide: [[1.04, 0, 0], [1.14, -1.5, -1]] }),
      ownerChatShot,
      dayShot,
      ...ACT2,
      /* after a dark statement, the house's wipe, not a white band */
      markShot({ d: 1400, cut: "mask" }),
    ],
    loopCut: "burn",
    poster: 2,
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
    let shots = null, ovl = null;
    const cssReady = new Promise((res) => { link.addEventListener("load", res, { once: true }); link.addEventListener("error", res, { once: true }); });

    /* review.html mounts with a clock of its own, below; nothing else does */
    const review = !!opts.review;
    const still = !review && (!!opts.still || matchMedia("(prefers-reduced-motion: reduce)").matches);
    let ver = opts.version || current();
    let dead = false, playing = false, seen = false, idx = -1, cur = null, curS = null, tab = null, gen = 0;
    const timers = new Set(), loops = new Set(), anims = new Set();
    /* ── the review clock. Time is a number a timeline moves, not the
       wall's: every timer the reel sets waits in vq for it, and every
       animation it starts (its own, and the CSS ones in its shadow and
       its phones) is held and set to it, so any moment can be built again
       exactly, paused, stepped or slowed. Off review, the wall's clock ── */
    let vnow = 0, vseq = 0, holds = [];
    const vq = [], vt = new Map(), phoneFrames = new Set();
    const T = review
      ? (ms, fn) => { const my = gen; vq.push({ at: vnow + Math.max(0, ms), seq: vseq++, fn: () => { if (!dead && my === gen) fn(); } }); }
      : (ms, fn) => { const my = gen; const id = setTimeout(() => { timers.delete(id); if (!dead && my === gen) fn(); }, still ? 0 : Math.max(0, ms)); timers.add(id); return id; };
    const stop = () => { timers.forEach(clearTimeout); timers.clear(); loops.forEach(clearInterval); loops.clear(); vq.length = 0; gen++; };
    const halt = () => { stop(); anims.forEach((a) => { try { a.cancel(); } catch (e) { /* gone */ } }); anims.clear(); vt.clear(); phoneFrames.clear(); holds = []; };

    const el = (t, c, html) => { const e = document.createElement(t); if (c) e.className = c; if (html != null) e.innerHTML = html; return e; };
    const ctx = { el, T, get instant() { return still; } };
    /* the web animations a shot runs (its camera, its glide, a cut),
       cancelled when the reel starts over; none under reduced motion */
    const anim = (e, frames, o) => {
      if (!e || !e.animate || still) return null;
      const a = e.animate(frames, o); anims.add(a);
      if (review) { a.pause(); vt.set(a, vnow); a.currentTime = 0; }
      a.finished.then(() => anims.delete(a), () => anims.delete(a));
      return a;
    };
    ctx.anim = anim;
    ctx.now = review ? () => vnow : () => performance.now();
    ctx.stageRect = () => stage.getBoundingClientRect();
    /* a clock that repeats until its function says stop */
    ctx.every = review
      ? (ms, fn) => { const my = gen; const tick = () => { if (dead || my !== gen) return; if (fn() !== false) T(ms, tick); }; T(ms, tick); }
      : (ms, fn) => { const my = gen; const id = setInterval(() => { if (dead || my !== gen || fn() === false) { clearInterval(id); loops.delete(id); } }, ms); loops.add(id); return id; };
    /* under review a phone is waited for: the clock holds while it loads,
       so its steps land on their moments, not after them */
    ctx.hold = review ? (p) => { holds.push(p); } : null;
    ctx.phoneFrame = review ? (f) => { phoneFrames.add(f); } : null;
    const size = () => {
      ctx.W = stage.clientWidth; ctx.H = stage.clientHeight;
      ctx.pad = Math.round(ctx.W * 0.044); ctx.top = Math.round(Math.max(34, ctx.H * 0.085));
    };
    /* go: the class that starts a thing's own transition, at a time */
    ctx.go = (node, at) => { if (!node) return; if (still) { node.classList.add("now"); return; } T(at, () => { void node.offsetWidth; node.classList.add("go"); }); };
    ctx.tick = () => { const s = document.createElementNS("http://www.w3.org/2000/svg", "svg"); s.setAttribute("viewBox", "0 0 12 12"); s.setAttribute("class", "tk"); s.innerHTML = '<rect class="sq" width="12" height="12"/><path class="ch" d="M3.1 6.3 5.2 8.4 9 4.3"/>'; return s; };
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
        ctx.every(cps, () => {
          n = Math.min(text.length, n + 1);
          tx.nodeValue = text.slice(0, n); rest.textContent = text.slice(n);
          if (n >= text.length) { rest.remove(); T(420, () => car.remove()); return false; }
          return true;
        });
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
    /* the request crossing a cut: a card of the app's own look, from where
       it was said to where it lands */
    /* the request lifted out of the athlete's chat as the owner app's own
       card, where it was said; it holds there while the owner's screen
       slides in under it (his note, 29 Sept: "can the message stay exactly
       where it is and the next screen slide 'under' it"), and the next shot
       lines its box up beneath and lets the card go */
    ctx.lift = (from, w) => {
      if (still || !ovl || !from) return null;
      const cd = el("div", "flyc", '<div class="n">' + esc(REAL.who[0]) + ' <span class="g">' + esc(REAL.who[1]) + "</span> " + esc(REAL.who[2]) + '</div><div class="wh">Mon, Jun 15 · 8:00 AM · 60min<span class="v">via AI</span></div>');
      ovl.appendChild(cd);
      const k = w / 324, x = Math.min(from.x, ctx.W - ctx.pad - w), y = from.y;
      anim(cd, [{ opacity: 0, transform: `translate(${x}px, ${y + 8}px) scale(${k * 0.97})` }, { opacity: 1, transform: `translate(${x}px, ${y}px) scale(${k})` }], { duration: 300, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" });
      ctx.card = { el: cd, x, y, w };
      return ctx.card;
    };
    /* ── the cuts. The room's own three (the mask, the band, the blink),
       and Faux Reel's (SizzleReel.tsx, as the dsc-sizzle film ports them):
       a whip, an iris from the last thing touched, a flash, a pinch, a
       shutter, slats, a push through the glass, a burn. Each puts the new
       shot on the stage, takes the old one off when it is covered or
       gone, and says when the new one's own content may start ── */
    const RE = "cubic-bezier(0.7, 0, 0.15, 1)";
    const cut = (kind, prev, prevS, node, S) => {
      const put = (under) => (under ? shots.insertBefore(node, prev) : shots.appendChild(node));
      const drop = (ms) => T(ms, () => { if (prev && prev.isConnected) prev.remove(); });
      const over = (cls, bc) => { const e = el("div", "cutc " + cls); if (bc) e.style.setProperty("--bc", bc); stage.appendChild(e); return e; };
      const contra = (x) => (x && /ink/.test(x.ground) ? "#fff" : "#000");
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
          /* a slide, sharp all the way, an ink rule on the new shot's
             leading edge (his note, 29 Sept: the blurs don't suit the site) */
          put(); const d = 640, dir = S.dir || 1;
          anim(prev, [{ transform: "translateX(0%)" }, { transform: `translateX(${-100 * dir}%)` }], { duration: d, easing: RE, fill: "forwards" });
          anim(node, [{ transform: `translateX(${100 * dir}%)` }, { transform: "translateX(0%)" }], { duration: d, easing: RE });
          const seam = el("i", "seam" + (dir < 0 ? " r" : "")); node.appendChild(seam); T(d + 20, () => seam.remove());
          drop(d + 30);
          return 330;
        }
        case "split": {
          /* from the last thing touched, in straight lines (his note, 29
             Sept: the circle "feels out of place"): a rule drawn across the
             frame at the tap, then the new shot opening from it */
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
          /* a page turn: the band comes in over the old shot, the new one is
             under it when it goes */
          put(true);
          const b = el("i", "fband"); b.style.setProperty("--bc", contra(prevS)); b.style.setProperty("--bd", "900ms");
          stage.appendChild(b);
          drop(450); T(940, () => b.remove());
          return 520;
        }
      }
    };
    /* show shot n, arriving by its cut */
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
      const app = list.some((S) => S.app) ? [appCss()] : [];
      const scr = list.some((S) => S.scr) ? [screensJs()] : [];
      return Promise.all([...urls].map((u) => new Promise((res) => { const im = new Image(); im.onload = im.onerror = () => res(); im.src = u; })).concat(app, scr)).then(() => null);
    };
    const fonts = () => document.fonts ? Promise.all(["600 40px 'Avenir Next'", "500 16px 'Avenir Next'", "400 14px 'Avenir Next'", "700 10px 'Avenir Next'"].map((f) => document.fonts.load(f).catch(() => null))) : Promise.resolve();

    /* a clean stage: the shots, the caption tab, the overlay the request
       flies across */
    const restage = () => {
      halt(); cur = null; curS = null; idx = -1; ctx.card = null;
      stage.replaceChildren();
      tab = null;
      shots = el("div", "shots"); stage.appendChild(shots);
      if (V[ver].tab) { tab = el("div", "tab"); tab.appendChild(el("div", "tt")); tab.style.visibility = "hidden"; stage.appendChild(tab); }
      ovl = el("div", "ovl"); stage.appendChild(ovl);
    };

    /* ── review: the reel laid out on one timeline, shot after shot ── */
    let starts = [], total = 0, running = false, rate = 1, lastReal = 0, resumeAt = +opts.at || 0, lock = Promise.resolve(), target = null, seeking = false;
    const tickers = new Set();
    const emit = () => tickers.forEach((cb) => { try { cb(vnow); } catch (e) { /* the listener's own trouble */ } });
    const layoutTimes = () => { starts = []; total = 0; seq().forEach((S) => { starts.push(total); total += S.d; }); };
    const exclusive = (fn) => (lock = lock.then(fn, fn));
    /* every animation set to where it is at t; any the last step started
       (a CSS transition, a band, a sheet sliding up in a phone) is stamped
       with t first and held */
    const sweep = (t) => {
      const roots = [sr];
      phoneFrames.forEach((f) => { if (!f.isConnected) { phoneFrames.delete(f); return; } if (f.contentDocument) roots.push(f.contentDocument); });
      roots.forEach((r) => {
        let list = [];
        try { list = r.getAnimations(); } catch (e) { return; }
        list.forEach((a) => {
          if (!vt.has(a)) { vt.set(a, t); try { a.pause(); } catch (e) { /* gone */ } }
          const ct = Math.max(0, t - vt.get(a));
          try { if (a.currentTime !== ct) a.currentTime = ct; } catch (e) { /* gone */ }
        });
      });
    };
    /* run every step due by t, in order, each with the world set to its
       own moment; a phone still loading holds the clock until it is */
    const advanceTo = async (t) => {
      for (;;) {
        if (dead) return;
        if (holds.length) { const h = holds; holds = []; await Promise.all(h.map((q) => Promise.resolve(q).catch(() => null))); await null; await null; continue; }
        let k = -1;
        for (let i = 0; i < vq.length; i++) { const it = vq[i]; if (it.at <= t && (k < 0 || it.at < vq[k].at || (it.at === vq[k].at && it.seq < vq[k].seq))) k = i; }
        if (k < 0) break;
        const it = vq.splice(k, 1)[0];
        if (it.at > vnow) { vnow = it.at; sweep(vnow); }
        it.fn(); sweep(vnow);
      }
      if (t > vnow) vnow = t;
      sweep(vnow);
    };
    /* the reel as it is at t. Forward and within a shot's reach, the clock
       just runs on; otherwise it is built again from the shot before
       (whose cut brings this one in) and run up to t */
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
      if (ver === "still" || !V[ver]) { halt(); cur = null; curS = null; idx = -1; stage.replaceChildren(); tab = null; stage.classList.add("off"); return; }
      stage.classList.remove("off");
      size();
      restage();
      if (review) { layoutTimes(); requestSeek(resumeAt); return; }
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
    if (review) seen = true;
    else if ("IntersectionObserver" in window) {
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
        if (review) { lastW = w; resumeAt = vnow; begin(); return; }
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
      set(v) { if (dead || (!IDS.includes(v) && v !== "still") || v === ver) return; ver = v; resumeAt = 0; if (!ready) return; size(); preload().then(() => { if (!dead && ver === v) begin(); }); },
      destroy() { dead = true; running = false; halt(); if (io) io.disconnect(); if (ro) ro.disconnect(); LIVE.delete(api); wrap.remove(); },
      /* the review page's handle on the clock (review.html) */
      review: review ? {
        shots: () => seq().map((S, i) => ({ i, name: S.name || (S.cap && S.cap[0]) || "Shot " + (i + 1), d: S.d, start: starts[i] })),
        total: () => total,
        time: () => vnow,
        playing: () => running,
        speed: () => rate,
        play() { if (running || dead) return; running = true; lastReal = performance.now(); nextFrame(frame); emit(); },
        pause() { running = false; emit(); },
        seek: (t) => requestSeek(t),
        /* the moment on screen built again, after a switch (the labels) */
        rebuild: () => { curS = null; return requestSeek(vnow); },
        rate(r) { rate = r; emit(); },
        onTick(cb) { tickers.add(cb); return () => tickers.delete(cb); },
        idle: () => lock,
      } : null,
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

  window.DSCSizzle = { mount, set, versions: VERSIONS, current, labels: (k) => { if (LABEL_KINDS.includes(k)) LABELS = k; return LABELS; } };
})();
