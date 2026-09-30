/* ── the DSC app's screens, for the sizzle's second act (29 Sept 2026) ──
   His note: "show more of what an owner/trainer can do there - it's quick
   but i think there are a ton more features", then of the DSC agent's
   35-second plan, "can we grab them from the project code?"

   So each screen here is rebuilt from the app's own source
   (/Users/jp33/Documents/DSC/gym-management, read only) with its JSX's
   exact class strings, styled by the app's own stylesheet compiled from
   that source (app.css, scripts/lib/dsc-app-css.mjs), as the study's
   live demos rebuild theirs. Each entry cites the files and lines it
   copies and says what it changed (a fixed sheet made absolute inside
   the phone, links made spans, the em dashes out).

   The people are the project's own seed athletes (prisma/seed.ts), the
   parents and the lead's details fictional (555 numbers, @email.com),
   the trainers by first name as the study names them; no money, no real
   registrant. The second act is one day, Tuesday 23 June, the week after
   the first act's booking, so the screens agree with each other: Priya's
   ankle is on the coach's roster, in the PT's thread and on Zeke's time
   off; Marcus checks in for the Tuesday 4pm slot the first act set;
   Isaiah goes from lead to athlete to a waiver his mother signs; Zoe
   signs up and is a new registration on the owner's home.

   An entry is { html, run(doc, at, c) }: html is a page inside the phone
   (390 by 750 under its status bar); run is its seconds of use, at(ms,
   fn) timed from when the page shows, c the player (c.anim for motion on
   its clock, c.every for a stepped one). sizzle.js loads this file when
   a reel needs it. */
(() => {
  const IMG = "/lab/dsc-sizzle/img/", MARK = "/lab/dsc-demos/assets/logo-mark.png";
  const CHEV = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
  const $ = (doc, id) => doc.getElementById(id);
  /* a finger on the glass: a ripple where it lands and the press state
     the demos use */
  const tap = (doc, el, c) => {
    if (!el) return;
    const r = el.getBoundingClientRect(), t = doc.createElement("i"); t.className = "tap";
    t.style.left = r.left + r.width / 2 + "px"; t.style.top = r.top + r.height / 2 + "px"; doc.body.appendChild(t);
    /* on the player's clock, so a paused or rewound reel holds the press */
    const later = c ? c.T : (ms, f) => setTimeout(f, ms);
    el.classList.add("press"); later(150, () => el.classList.remove("press")); later(800, () => t.remove());
  };
  const reveal = (el) => { el.classList.add("pp"); void el.offsetWidth; el.classList.add("in"); return el; };
  const node = (doc, html) => { const t = doc.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const swap = (el, off, on) => { if (!el) return; if (off) el.classList.remove(...off.split(" ")); if (on) el.classList.add(...on.split(" ")); };
  /* typed into a field a letter at a time, the caret following */
  const type = (doc, el, text, at, t0, per) => {
    let tx = null, car = null;
    at(t0, () => { el.textContent = ""; tx = doc.createTextNode(""); car = doc.createElement("span"); car.className = "car"; el.appendChild(tx); el.appendChild(car); });
    for (let i = 1; i <= text.length; i++) at(t0 + i * per, () => { if (tx) tx.nodeValue = text.slice(0, i); if (i === text.length && car) car.remove(); });
  };
  /* a page moved up under the glass on the reel's own clock */
  const glide = (c, el, y0, y1, dur) => c.anim(el, [{ transform: "translateY(" + -y0 + "px)" }, { transform: "translateY(" + -y1 + "px)" }], { duration: dur, easing: "cubic-bezier(0.45, 0, 0.35, 1)", fill: "forwards" });
  /* a box that scrolls itself (a sheet, the waiver's text), stepped */
  const scrollBox = (c, el, to, dur) => {
    const from = el.scrollTop, t0 = c.now();
    c.every(16, () => {
      const k = Math.min(1, (c.now() - t0) / dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      el.scrollTop = from + (to - from) * e; return k < 1;
    });
  };
  /* where a thing sits down a page, before anything has moved */
  const depth = (page, el) => el.getBoundingClientRect().top - page.getBoundingClientRect().top;
  /* Lucide's alert (lucide.dev, ISC), in place of the emoji */
  const ALERT = '<svg class="lc" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
  const S = {};

  /* ── check-in at the door ───────────────────────────────────────────
     src/app/checkin/page.tsx 307 (root), 309-317 (logo), 320-330 (the
     photo), 333 (main), 451-489 (login), 491-499 (finding), 501-529
     (welcome), 600-608 (footer); src/lib/checkin.ts 53-89 (today's
     session closest to now, on any roster the athlete is on, marked
     present). Changed: the email field is a div carrying the input's
     classes so it can be typed into, with the ring autoFocus gives it;
     the form a div; the photo the app's own (public/checkin-bg-flip.jpg,
     through the prep script); the trainer by first name. Marcus's
     session is the Tuesday 4pm slot the first act set. */
  S.checkin = {
    html: `<div class="flex flex-col bg-white p-3 md:p-5" style="height:750px;display:flex;flex-direction:column;position:relative">
<div class="absolute top-0 left-0 z-20"><img src="${MARK}" alt="DSC" width="60" height="60" class="w-[50px] h-[50px] md:w-[80px] md:h-[80px]"></div>
<div class="flex-1 flex flex-col relative rounded-lg overflow-hidden">
<div class="absolute inset-0"><img src="${IMG}app-checkin@1600.webp" alt="" class="object-cover" style="position:absolute;height:100%;width:100%;inset:0"></div>
<main id="kiosk" class="flex-1 relative z-10">
<div class="absolute left-[clamp(20px,10vw,150px)] bottom-[clamp(40px,10vw,150px)] right-[clamp(20px,10vw,150px)] max-w-2xl">
<button type="button" class="group flex items-center gap-2 md:gap-3 mb-4 md:mb-8 text-left"><span class="text-white font-extrabold tracking-tight drop-shadow-lg" style="font-size:clamp(24px, 4vw, 48px)">ATHLETE LOGIN</span><span class="text-white font-light opacity-80 rotate-180" style="font-size:clamp(20px, 3vw, 32px)">&#9735;</span></button>
<div class="bg-white/90 backdrop-blur rounded-2xl p-6 md:p-8 shadow-2xl">
<p class="font-bold text-sm md:text-base mb-4 text-black">SIGN IN BEFORE YOUR SESSION BEGINS</p>
<div class="space-y-4">
<div id="email" class="w-full px-4 py-3 text-base font-medium text-center bg-white border border-gray-300 rounded-lg ring-2 ring-black"><span class="text-gray-400">ENTER EMAIL</span></div>
<button id="signin" type="button" class="w-full px-6 py-3 text-base font-bold bg-black text-white rounded-lg hover:bg-gray-900 transition-colors">SIGN IN</button>
</div></div></div>
</main></div>
<footer class="bg-white pt-3 md:pt-4 pb-2"><p class="text-black font-medium uppercase" style="font-size:clamp(16px, 3.5vw, 48px);letter-spacing:clamp(0.1em, 2vw, 0.4em)">Unlock Your Peak Performance</p><p class="text-gray-500 text-xs mt-1 md:mt-2">Copyright &copy; 2025 Dallas Sports Collective. All Rights Reserved.</p></footer>
</div>`,
    run(doc, at, c) {
      type(doc, $(doc, "email"), "marcus.chen@email.com", at, 250, 30);
      at(1000, () => tap(doc, $(doc, "signin"), c));
      at(1150, () => { $(doc, "kiosk").innerHTML = '<div class="absolute inset-0 flex items-center justify-center"><div class="text-center bg-black/70 backdrop-blur rounded-2xl p-8"><div class="text-white text-xl mb-4">Finding your session...</div><div class="animate-pulse text-white text-4xl">...</div></div></div>'; });
      at(1750, () => {
        const k = $(doc, "kiosk");
        k.innerHTML = '<div class="absolute inset-0 flex items-center justify-center"><div class="text-center bg-black/80 backdrop-blur rounded-2xl p-8 space-y-4 max-w-md"><div class="text-6xl text-white">&#10003;</div><h2 class="text-3xl font-black text-white">Welcome, Marcus!</h2><div class="bg-white/10 rounded-lg p-4 space-y-2"><p class="text-xl text-white">Trainer: Scott</p><p class="text-lg text-gray-300">Session at 04:00 PM</p></div><button type="button" class="text-white/70 underline text-sm hover:text-white">Check in another person</button></div></div>';
        reveal(k.firstChild);
      });
    },
  };

  /* ── the coach's day and attendance ─────────────────────────────────
     src/app/trainer/page.tsx 218-422 (header, day, Today card, Needs
     attendance, This week; wording from who() 35-41, fmtTime() 67-72);
     src/components/QuickCheckIn.tsx 98-118; src/components/
     AttendanceSheet.tsx 128-272 (the sheet, its roster rows, drop-in,
     injury link, Save); the health line from lib/health.ts, "Left ankle
     sprain" the app's own example (components/HealthNotes.tsx 223).
     Changed: the sheet is absolute, not fixed; links are spans; Save
     reads "Save · 4 here" (the app's has an em dash); an empty day is
     "·". Everyone starts as here; the coach taps only who didn't come
     (lib/attendance.ts 8-11). */
  const WEEKROW = (d, n, chips, today) => `<div class="border-b border-black/10 last:border-b-0 grid grid-cols-[64px_1fr] items-center px-4 py-3 ${today ? "bg-black/[0.04]" : ""}"><div><div class="dsc-label text-black/40">${d}</div><div class="dsc-headline text-2xl text-black leading-none">${n}</div></div><div class="flex flex-wrap gap-1.5">${chips || '<span class="text-xs text-black/30 italic">·</span>'}</div></div>`;
  const CHIP = (t, who, done) => `<button class="inline-flex items-baseline gap-1.5 px-2 py-1 rounded text-xs leading-tight ${done ? "bg-black/10 text-black" : "bg-black text-white hover:opacity-85 active:opacity-70 cursor-pointer"}"><span class="font-mono text-[10px] opacity-80">${t}</span><span class="font-medium">${who}</span></button>`;
  const TODAY = (id, t, who, note) => `<button ${id ? `id="${id}" ` : ""}type="button" class="w-full flex items-baseline justify-between gap-3 text-left rounded-xl -mx-2 px-2 py-1 hover:bg-white/10"><div class="dsc-headline text-2xl text-white">${t}</div><div class="text-white/80 text-sm text-right">${who}<div ${id ? `id="${id}note" ` : ""}class="dsc-label text-white/50">${note}</div></div></button>`;
  const ROSTER = (id, name, health, sid) => `<button id="${id}" type="button" class="w-full flex items-center justify-between gap-3 rounded-2xl px-4 min-h-14 py-2 text-left transition-colors bg-black/[0.04] text-black"><span class="min-w-0"><span class="font-semibold truncate block">${name}</span>${health ? `<span class="block text-xs text-black/60 truncate">${ALERT} ${health}</span>` : ""}</span><span ${sid ? `id="${sid}" ` : ""}class="dsc-label shrink-0">Here</span></button>`;
  S.coach = {
    html: `<div class="bg-white flex flex-col" style="height:750px;display:flex;flex-direction:column;position:relative;overflow:hidden">
<header class="px-4 md:px-6 py-5 flex items-center justify-between border-b border-black/10"><span aria-label="DSC home" class="block"><img src="${MARK}" alt="DSC" width="40" height="40"></span><div class="flex items-center gap-3"><span class="dsc-label text-black/60 hover:text-black">Account</span><button class="dsc-label text-black/60 hover:text-black">Log out</button></div></header>
<div class="px-4 md:px-6 py-6 max-w-3xl mx-auto w-full flex-1 space-y-8">
<div class="rounded-3xl bg-black/[0.04] p-4 max-w-3xl mx-auto w-full"><div class="flex items-center justify-between mb-2"><div class="dsc-label text-black/50">Check in</div></div><input placeholder="Type a name…" autocomplete="off" tabindex="-1" class="w-full h-12 px-4 bg-white rounded-2xl text-black text-base placeholder:text-black/30"></div>
<section><div class="dsc-label text-black/40 mb-1">Tuesday, June 23</div><div class="flex flex-wrap items-end justify-between gap-3 mb-5"><h1 class="dsc-headline text-4xl md:text-5xl text-black">Scott</h1><div class="flex gap-2 shrink-0"><span class="h-10 px-4 rounded-full bg-black/5 hover:bg-black/10 text-sm font-semibold text-black flex items-center">Injuries</span><span class="h-10 px-4 rounded-full bg-black/5 hover:bg-black/10 text-sm font-semibold text-black flex items-center">Gym schedule →</span></div></div>
<div class="rounded-3xl bg-black text-white p-6"><div class="dsc-label text-white/60 mb-3">Today · 3</div><div class="space-y-2">${TODAY("", "6:00am", "Trevor +2 · 60m", "Attendance taken")}${TODAY("t2", "7:00am", "Priya +3 · 60m", "Tap to take attendance")}${TODAY("", "4:00pm", "Marcus Chen · 60m", "Tap to take attendance")}</div></div></section>
<section id="owed"><div class="dsc-label text-black/50 mb-3">Needs attendance · 1</div><div class="space-y-2"><button id="take" type="button" class="w-full rounded-2xl bg-black/[0.05] border border-black/10 px-4 py-3 flex items-center justify-between gap-3 text-left"><div class="min-w-0"><div class="font-semibold text-black truncate">Priya +3</div><div class="dsc-label text-black/50 mt-0.5">Tue, Jun 23, 7:00 AM</div></div><span class="dsc-label text-black/60 shrink-0">Take it</span></button></div></section>
<section><div class="flex items-baseline justify-between mb-3"><div class="dsc-label text-black/50">This week</div><button class="dsc-label bg-black text-white px-3 py-1.5 rounded-full hover:bg-black/85">+ Schedule</button></div><div class="border border-black/10 rounded-3xl overflow-hidden">${WEEKROW("Sun", 21)}${WEEKROW("Mon", 22, CHIP("6:00am", "Trevor +2", true) + CHIP("3:00pm", "Marcus", true))}${WEEKROW("Tue", 23, CHIP("6:00am", "Trevor +2", true) + CHIP("7:00am", "Priya +3") + CHIP("4:00pm", "Marcus"), true)}</div></section>
</div>
<div id="sheet" class="absolute inset-0 z-50 flex items-end md:items-center md:justify-center bg-black/40 dsc-sheet-backdrop hidden"><div class="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-md max-h-[88vh] overflow-y-auto dsc-sheet-panel">
<div class="px-5 pt-5 pb-3 flex items-center justify-between sticky top-0 bg-white"><div class="min-w-0"><div class="dsc-label text-black/40">Attendance</div><div class="dsc-headline text-2xl text-black truncate">Who came?</div><div class="dsc-label text-black/40 mt-0.5">Tue, Jun 23, 7:00 AM · Scott</div></div><button class="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-black/60 shrink-0" aria-label="Close">✕</button></div>
<div class="px-5 pb-5 space-y-3"><p class="text-xs text-black/50">Everyone starts as here. Tap anyone who didn&rsquo;t come.</p><div class="space-y-1.5">${ROSTER("r1", "Priya Patel", "Left ankle sprain")}${ROSTER("r2", "Kenji Watanabe")}${ROSTER("r3", "Derek Thompson", "", "r3s")}${ROSTER("r4", "Mia Johansson")}</div>
<select tabindex="-1" class="w-full h-12 px-3 bg-black/5 rounded-xl text-black"><option value="">+ Someone came who wasn&rsquo;t booked…</option></select><span class="block text-center dsc-label text-black/50">Someone got hurt? Report an injury →</span><button id="save" class="w-full h-12 bg-black text-white rounded-full font-semibold disabled:bg-black/30">Save · 4 here</button></div></div></div>
</div>`,
    /* the coach opens the owed session, taps the one who didn't come, and
       saves; the amber card clears */
    run(doc, at, c) {
      at(250, () => tap(doc, $(doc, "take"), c));
      at(420, () => swap($(doc, "sheet"), "hidden"));
      at(1050, () => tap(doc, $(doc, "r3"), c));
      at(1150, () => { swap($(doc, "r3"), "bg-black/[0.04] text-black", "bg-black text-white"); $(doc, "r3s").textContent = "No-show"; $(doc, "save").textContent = "Save · 3 here, 1 no-show"; });
      at(1750, () => tap(doc, $(doc, "save"), c));
      at(1850, () => { const v = $(doc, "save"); v.textContent = "Saving…"; v.setAttribute("disabled", ""); });
      at(2200, () => { swap($(doc, "sheet"), null, "hidden"); $(doc, "t2note").textContent = "Attendance taken"; swap($(doc, "owed"), null, "hidden"); });
    },
  };

  /* ── an injury, coach to PT ─────────────────────────────────────────
     src/app/injuries/page.tsx 38-42 (the status pills), 44-46 (when()),
     85-111 (root, header, the staff line, tabs, + Report injury),
     121-123 (the list), 174-252 (a thread: card, open area, notes,
     reply, Send, Cleared, the cleared row with Reopen); the rules from
     lib/ptFollowups.ts 96-139 (a PT's first reply moves New to PT
     following up; only the PT or an admin clears). Changed: the back
     link a span; the reply typed in already; the app's native confirm
     skipped; the staff line and the placeholder lose their em dashes
     (a full stop, a comma). The notes are the reel's. */
  const NOTE = (text, by) => `<div class="rounded-2xl bg-white px-3 py-2"><div class="text-sm text-black whitespace-pre-wrap">${text}</div><div class="dsc-label text-black/40 mt-0.5">${by}</div></div>`;
  const INJ_HEAD = (pill, pillCls, meta) => `<button class="w-full text-left p-4"><div class="flex items-start justify-between gap-3"><div class="min-w-0"><div class="font-semibold text-black truncate">Priya Patel</div><div class="text-sm text-black/70 truncate">Left ankle sprain</div></div><span ${pill === "New" ? 'id="pill" ' : ""}class="dsc-label px-2 py-1 rounded-full shrink-0 ${pillCls}">${pill}</span></div><div ${pill === "New" ? 'id="meta" ' : ""}class="dsc-label text-black/40 mt-1.5">${meta}</div></button>`;
  const INJ_WHAT = '<div class="text-sm text-black/70 whitespace-pre-wrap">Landed wrong on a box jump in the 4 PM group. Iced it, sat out the rest of the session.</div>';
  const INJ_ASK = NOTE("Can you take a look before Thursday?", "Scott · Jun 22, 4:05 PM");
  const INJ_REPLY = NOTE("Checked the ankle this morning. Light lifting OK, no jumping for now.", "Justin · Jun 23, 8:40 AM");
  S.injuries = {
    html: `<div class="bg-white" style="height:750px;display:flex;flex-direction:column;overflow:hidden">
<header class="sticky top-0 z-10 bg-white/95 backdrop-blur px-4 py-3 flex items-center gap-3 border-b border-black/10"><span class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 text-black/70">←</span><div class="dsc-headline text-lg md:text-xl text-black flex-1">Injury follow-ups</div></header>
<div class="max-w-3xl mx-auto w-full px-4 py-4 space-y-3">
<p class="text-xs text-black/50">Staff only. Families don&rsquo;t see these notes. PT: Justin.</p>
<div class="flex items-center gap-2"><button id="tabOpen" class="h-10 px-4 rounded-full text-sm font-semibold bg-black text-white">Open · 1 new</button><button id="tabCleared" class="h-10 px-4 rounded-full text-sm font-semibold bg-black/5 text-black/70">Cleared</button><button class="ml-auto h-10 px-4 rounded-full bg-black text-white text-sm font-semibold shrink-0">+ Report injury</button></div>
<div id="list" class="space-y-3">
<div id="t1" class="rounded-3xl bg-black/[0.04] overflow-hidden">${INJ_HEAD("New", "bg-black text-white", "Flagged by Scott · Jun 22, 4:05 PM · 1 note")}<div class="px-4 pb-4 space-y-3">${INJ_WHAT}<div id="notes" class="space-y-2">${INJ_ASK}</div>
<textarea id="reply" rows="2" tabindex="-1" placeholder="e.g. Evaluated, no jumping for 2 weeks, light lifting OK" class="w-full px-3 py-2 bg-white rounded-xl text-sm text-black">Checked the ankle this morning. Light lifting OK, no jumping for now.</textarea>
<div class="flex flex-wrap gap-2"><button id="send" class="h-10 px-4 rounded-full bg-black text-white text-sm font-semibold disabled:bg-black/30">Send</button><button id="clear" class="h-10 px-4 rounded-full bg-black/10 text-black text-sm font-semibold">Cleared</button></div></div></div>
<div class="rounded-3xl bg-black/[0.04] overflow-hidden"><button class="w-full text-left p-4"><div class="flex items-start justify-between gap-3"><div class="min-w-0"><div class="font-semibold text-black truncate">Brandon Mitchell</div><div class="text-sm text-black/70 truncate">Tight right hamstring</div></div><span class="dsc-label px-2 py-1 rounded-full shrink-0 bg-black/10 text-black">PT following up</span></div><div class="dsc-label text-black/40 mt-1.5">Flagged by Sara · Jun 22, 6:20 PM · 2 notes</div><div class="text-xs text-black/50 mt-1 truncate">Justin: Stretch plan sent. Recheck Thursday.</div></button></div>
</div></div></div>`,
    /* the PT replies, then clears it; it moves to Cleared, the thread
       kept */
    run(doc, at, c) {
      at(250, () => tap(doc, $(doc, "send"), c));
      at(400, () => {
        const n = node(doc, INJ_REPLY); $(doc, "notes").appendChild(n); reveal(n);
        const p = $(doc, "pill"); p.className = "dsc-label px-2 py-1 rounded-full shrink-0 bg-black/10 text-black"; p.textContent = "PT following up";
        $(doc, "meta").textContent = "Flagged by Scott · Jun 22, 4:05 PM · 2 notes"; $(doc, "tabOpen").textContent = "Open"; $(doc, "reply").value = "";
      });
      at(1050, () => tap(doc, $(doc, "clear"), c));
      at(1200, () => swap($(doc, "t1"), null, "gone"));
      at(1480, () => { const t = $(doc, "t1"); if (t) t.remove(); });
      at(1520, () => tap(doc, $(doc, "tabCleared"), c));
      at(1620, () => {
        $(doc, "tabOpen").className = "h-10 px-4 rounded-full text-sm font-semibold bg-black/5 text-black/70";
        $(doc, "tabCleared").className = "h-10 px-4 rounded-full text-sm font-semibold bg-black text-white";
        const l = $(doc, "list");
        l.innerHTML = `<div class="rounded-3xl bg-black/[0.04] overflow-hidden">${INJ_HEAD("Cleared", "bg-white text-black border border-black/20", "Flagged by Scott · Jun 22, 4:05 PM · 3 notes")}<div class="px-4 pb-4 space-y-3">${INJ_WHAT}<div class="space-y-2">${INJ_ASK}${INJ_REPLY}${NOTE("Cleared.", "Justin · Jul 2, 5:10 PM")}</div><div class="flex items-center justify-between gap-3 text-sm text-black/60"><span>Cleared by Justin · Jul 2, 5:10 PM</span><button class="dsc-label text-black/50 hover:text-black">Reopen</button></div></div></div>`;
        reveal(l.firstChild);
      });
    },
  };

  /* ── time off, asked and approved ───────────────────────────────────
     src/app/admin/page.tsx 293-331 (root, header, check-in slot), 337
     (alerts), 515-531 (the launcher, labels from CARDS 65-78), 876-940
     (TimeOffBox: row, Approve, Decline), 845-873 (the busy state);
     src/components/QuickCheckIn.tsx 99-118. Then the calendar:
     admin/calendar/page.tsx 131-171 (filters, + Time off), _components/
     WeekCards.tsx 149-165 (the off item: "{first name} off", All day,
     sorted first), 178-208 (week), 211-345 (the cards; today spans both
     columns in black and previews three). The date labels from
     lib/timeOff.ts 267-294, the booked-then line from 109-115. Zeke asks
     because Jordan and Scott are the owners who approve (lib/owner.ts).
     Changed: the week's em dash an en dash; links spans. Approving
     cancels nothing: the booked session is listed for someone to move. */
  const HOME_HEAD = `<header class="px-4 pt-6 pb-4 flex items-center justify-between"><div class="flex items-center gap-3"><img src="${MARK}" alt="DSC" width="44" height="44"></div><div class="flex items-center gap-3"><span class="dsc-label text-black/60 hover:text-black">Account</span><button class="dsc-label text-black/60 hover:text-black">Log out</button></div></header>`;
  const HOME_CHECKIN = (here) => `<div class="px-4 pb-3"><div class="rounded-3xl bg-black/[0.04] p-4 max-w-3xl mx-auto w-full"><div class="flex items-center justify-between mb-2"><div class="dsc-label text-black/50">Check in</div>${here ? `<button class="dsc-label text-black/50 hover:text-black">Here today · ${here} ▼</button>` : ""}</div><input placeholder="Type a name…" autocomplete="off" tabindex="-1" class="w-full h-12 px-4 bg-white rounded-2xl text-black text-base placeholder:text-black/30"></div></div>`;
  const CARD = (label, name, id) => `<span ${id ? `id="${id}" ` : ""}class="group block bg-black/[0.04] hover:bg-black/[0.07] rounded-3xl p-4 md:p-7 aspect-square flex flex-col justify-between transition-colors overflow-hidden"><div class="dsc-label text-black/40 group-hover:text-black/60 break-words">${label}</div><div class="dsc-headline text-2xl sm:text-3xl md:text-5xl text-black whitespace-pre-line leading-[0.9] break-words">${name}</div></span>`;
  const CARDS = CARD("Talk to the scheduler", "Chat /&#10;Schedule") + CARD("See the week", "Calendar") + CARD("Hours &amp; roster", "Trainers") + CARD("Members &amp; assignments", "Athletes");
  /* the home's panels in greys, not the app's violet, sky, emerald and
     amber (his note, 29 Sept: "for this can we keep the panels/container
     shades of grey vs the multi colors") */
  const LEADS_DUE = `<span class="block px-4 py-3 rounded-2xl bg-black/[0.05] border border-black/10 max-w-3xl mx-auto"><div class="flex items-center gap-2 mb-1"><span class="w-2 h-2 rounded-full bg-black" aria-hidden="true"></span><span class="dsc-label text-black">Lead follow-ups due · 3</span></div><div class="text-sm text-black/70 truncate">Ethan Park, Chloe Nakamura, Isaiah Brooks</div></span>`;
  const TIME_OFF = (ids) => `<div ${ids ? 'id="toff" ' : ""}class="px-4 py-3 rounded-2xl bg-black/[0.05] border border-black/10 max-w-3xl mx-auto"><div class="flex items-center gap-2 mb-2"><span class="w-2 h-2 rounded-full bg-black" aria-hidden="true"></span><span class="dsc-label text-black">Time off requests · 1</span></div><div class="space-y-2"><div class="bg-white rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center gap-2"><div class="flex-1 min-w-0"><div class="text-black text-sm"><span class="font-medium">Zeke</span><span class="text-black/50"> · </span><span>Thu Jun 25 – Fri Jun 26</span></div><div class="text-xs text-black/70 mt-0.5 italic truncate">&ldquo;Family wedding&rdquo;</div><div class="text-xs mt-0.5 text-black/60">On 1 session then: Fri, Jun 26, 4:00 PM (Priya Patel)</div></div><div class="flex gap-2 shrink-0"><button ${ids ? 'id="toff-ok" ' : ""}class="h-8 px-3 bg-black text-white text-xs rounded-full dsc-headline disabled:opacity-40">Approve</button><button ${ids ? 'id="toff-no" ' : ""}class="h-8 px-3 border border-black/20 text-black/70 text-xs rounded-full disabled:opacity-40">Decline</button></div></div></div></div>`;
  S.timeoffHome = {
    html: `<div class="bg-white flex flex-col" style="height:750px;display:flex;flex-direction:column;overflow:hidden">${HOME_HEAD}${HOME_CHECKIN(6)}<div class="px-4 space-y-2 pb-2" id="alerts">${LEADS_DUE}</div><section class="px-4 pt-2 pb-4"><div class="grid grid-cols-2 gap-3 md:gap-4 max-w-3xl mx-auto">${CARDS}</div></section></div>`,
    run(doc, at, c) {
      at(100, () => { const n = node(doc, TIME_OFF(true)); $(doc, "alerts").appendChild(n); reveal(n); });
      at(650, () => tap(doc, $(doc, "toff-ok"), c));
      at(780, () => { $(doc, "toff-ok").setAttribute("disabled", ""); $(doc, "toff-no").setAttribute("disabled", ""); });
    },
  };
  const PILL = (t, name, who, today) => `<div class="rounded-2xl px-3 py-1.5 flex items-baseline justify-between gap-2 ${today ? "bg-white text-black" : "bg-black text-white"}"><div class="flex items-baseline gap-2 min-w-0"><span class="font-mono text-[10px] opacity-75 shrink-0">${t}</span><span class="font-semibold text-xs truncate">${name}</span></div><span class="dsc-label opacity-60 shrink-0 text-[10px]">${who}</span></div>`;
  const OFF = '<div class="rounded-2xl px-3 py-1.5 flex items-baseline justify-between gap-2 bg-black/10 text-black"><div class="flex items-baseline gap-2 min-w-0"><span class="font-mono text-[10px] opacity-75 shrink-0">All day</span><span class="font-semibold text-xs truncate">Zeke off</span></div></div>';
  const DAY = (name, n, count, pills, more, id) => {
    const today = id === "today", tag = id && !today;
    return `<span ${tag ? `id="${id}" ` : ""}class="block rounded-3xl p-4 md:p-5 transition-colors ${today ? "col-span-2 bg-black text-white hover:bg-black/90" : "bg-black/[0.04] hover:bg-black/[0.07] text-black"}"><div class="flex items-baseline justify-between mb-3"><div><div class="dsc-label ${today ? "text-white/60" : "text-black/50"}">${name}</div><div class="dsc-headline leading-none mt-1 ${today ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"}">${n}</div></div><div class="text-right"><div class="dsc-headline leading-none ${today ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}">${count}</div><div class="dsc-label mt-1 ${today ? "text-white/60" : "text-black/50"}">sessions</div></div></div><div ${tag ? `id="${id}-list" ` : ""}class="space-y-1.5">${pills}${more ? `<div ${tag ? `id="${id}-more" ` : ""}class="dsc-label text-center pt-1 ${today ? "text-white/70" : "text-black/50"}">+ ${more} more</div>` : ""}</div></span>`;
  };
  S.timeoffCal = {
    html: `<div class="bg-white" style="height:750px;display:flex;flex-direction:column;overflow:hidden">
<header class="sticky top-0 z-10 bg-white/95 backdrop-blur px-4 py-3 flex items-center gap-3 border-b border-black/10"><span class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 text-black/70" aria-label="Back to home">${CHEV}</span><div class="dsc-headline text-lg md:text-xl text-black">Calendar</div></header>
<div id="cal" class="max-w-3xl mx-auto w-full" style="flex:1;min-height:0;overflow:hidden"><div id="calin">
<div class="px-4 pt-3 flex flex-wrap items-center gap-2"><select aria-label="Trainer" tabindex="-1" class="flex-1 min-w-[8rem] h-10 px-3 bg-black/[0.04] rounded-full text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/20"><option>All trainers</option></select><select aria-label="Location" tabindex="-1" class="h-10 px-3 bg-black/[0.04] rounded-full text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/20 max-w-[9rem]"><option>Both gyms</option></select><button class="h-10 px-4 rounded-full bg-black/[0.04] text-sm text-black shrink-0 hover:bg-black/[0.08]">+ Time off</button></div>
<div class="px-4 py-3 flex items-center justify-between"><button class="w-9 h-9 flex items-center justify-center rounded-full bg-black/5 text-black/70 hover:bg-black/10" aria-label="Previous week">←</button><div class="flex items-baseline gap-2"><span class="dsc-label text-black/40">Week of</span><span class="text-sm md:text-base font-bold tracking-tight text-black">Jun 21 – Jun 27</span></div><div class="flex items-center gap-1"><button class="dsc-label text-black/60 hover:text-black px-2 py-1">Today</button><button class="w-9 h-9 flex items-center justify-center rounded-full bg-black/5 text-black/70 hover:bg-black/10" aria-label="Next week">→</button></div></div>
<div class="px-4 pb-6 grid grid-cols-2 gap-3">
${DAY("Sun", 21, 2, PILL("9:00am", "Kenji Watanabe", "Justin") + PILL("10:00am", "Elena Rodriguez", "Sara"), 0)}
${DAY("Mon", 22, 12, PILL("6:00am", "Trevor +2", "Scott") + PILL("7:00am", "Aaliyah Jackson", "Justin"), 10)}
${DAY("Tue", 23, 10, PILL("6:00am", "Trevor +2", "Scott", true) + PILL("7:00am", "Priya +3", "Scott", true) + PILL("8:00am", "Brandon Mitchell", "Brenden", true), 7, "today")}
${DAY("Wed", 24, 11, PILL("6:00am", "Brandon +2", "Scott") + PILL("7:00am", "Fatima Al-Hassan", "Zeke"), 9)}
${DAY("Thu", 25, 9, PILL("6:00am", "Dante Williams", "Jordan") + PILL("7:00am", "Olivia Santos", "Brenden"), 7, "thu")}
${DAY("Fri", 26, 10, PILL("6:00am", "Jamal Richardson", "Justin") + PILL("7:00am", "Kenji Watanabe", "Sara"), 8, "fri")}
${DAY("Sat", 27, 4, PILL("8:00am", "Raj Sharma", "Brenden") + PILL("9:00am", "Olivia +5", "Jordan"), 2)}
</div></div></div></div>`,
    /* the week slides up to Thursday and Friday; Zeke's days go violet,
       first in each, and nothing else moves */
    run(doc, at, c) {
      const cal = $(doc, "cal"), inn = $(doc, "calin"), thu = $(doc, "thu");
      const y = Math.max(0, Math.min(inn.scrollHeight - cal.clientHeight, depth(inn, thu) - 118));
      at(80, () => glide(c, inn, 0, y, 520));
      at(620, () => ["thu", "fri"].forEach((d) => {
        const l = $(doc, d + "-list"), m = $(doc, d + "-more"), o = node(doc, OFF);
        l.children[1].remove(); l.prepend(o); reveal(o); m.textContent = "+ " + (d === "thu" ? 8 : 9) + " more";
      }));
    },
  };

  /* ── a lead, followed up and converted ──────────────────────────────
     src/app/admin/leads/page.tsx 187-226 (root, search, + Add lead, the
     overdue banner, tabs), 239-279 (a lead's card), 318-342 (the sheet),
     344 (inputCls), 355-380 (pills); LeadSheet 626-658 (details, Text,
     Call, Email), 660-667 (converted), 678-687 (Stage), 689-741 (the
     log), 745-788 (convert), 797-818 (History, Delete lead); the wording
     54-95 and 594-599; lib/leads.ts 269-327 (convertLead: an athlete
     made from the lead, the parent carried, added to the group waited
     for, a waiver still to sign). Changed: the sheet absolute; links
     spans; two em dashes commas; Scott chosen as the coach; the
     "Converted by" history note left out so no staff name shows. */
  const LEAD = (id, name, parent, wants, stage, src, loc, due, dueCls, note) => `<button id="${id}" class="w-full text-left rounded-3xl bg-black/[0.04] hover:bg-black/[0.07] p-4"><div class="flex items-start justify-between gap-3"><div class="min-w-0"><div class="font-semibold text-black truncate">${name}${parent ? `<span class="font-normal text-black/50"> · ${parent}</span>` : ""}</div><div class="text-sm text-black/60 truncate">${wants}</div></div><span class="dsc-label px-2 py-1 rounded-full bg-white text-black/70 shrink-0">${stage}</span></div><div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 dsc-label"><span class="text-black/40">${src}</span>${loc ? `<span class="text-black/40">${loc}</span>` : ""}<span class="${dueCls}">${due}</span></div>${note ? `<div class="text-xs text-black/50 mt-1.5 truncate">“${note}”</div>` : ""}</button>`;
  const LEAD_INFO = '<div class="text-sm text-black/60 -mt-2"><div>Parent: Nina Brooks</div><div>Wants: Handles</div><div>Instagram · added Jun 16 · waiting on Thursday hoops</div></div><div class="flex flex-wrap gap-2"><span class="h-10 px-4 rounded-full bg-black text-white text-sm font-semibold flex items-center">Text (214) 555-0142</span><span class="h-10 px-4 rounded-full bg-black/10 text-black text-sm font-semibold flex items-center">Call</span><span class="h-10 px-4 rounded-full bg-black/10 text-black text-sm font-semibold flex items-center">Email</span><button class="h-10 px-4 rounded-full bg-black/5 text-black/70 text-sm font-semibold">Edit details</button></div>';
  const LEAD_HISTORY = '<div><div class="dsc-label text-black/50 mb-2">History</div><div class="space-y-2"><div class="text-sm"><div class="text-black whitespace-pre-wrap">Texted Nina. A spot opens Thursday.</div><div class="dsc-label text-black/40 mt-0.5">Jun 19, 4:15 PM</div></div><div class="text-sm"><div class="text-black whitespace-pre-wrap">Nina DM\'d about Thursday hoops. Group\'s full.</div><div class="dsc-label text-black/40 mt-0.5">Jun 16, 7:32 PM</div></div></div></div><button class="w-full dsc-label text-black/40 py-2">Delete lead</button>';
  const STAGE = (n, on) => `<button type="button" class="h-9 px-3 rounded-full text-sm font-semibold ${on ? "bg-black text-white" : "bg-black/5 text-black/70"}">${n}</button>`;
  const NEXT = (n, on) => `<button type="button" class="h-8 px-3 rounded-full text-xs font-semibold ${on ? "bg-black text-white" : "bg-white text-black/70"}">${n}</button>`;
  S.leads = {
    html: `<div id="leads" class="bg-white" style="height:750px;display:flex;flex-direction:column;position:relative;overflow:hidden">
<header class="sticky top-0 z-10 bg-white/95 backdrop-blur px-4 py-3 flex items-center gap-3 border-b border-black/10"><span class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 text-black/70">${CHEV}</span><div class="dsc-headline text-lg md:text-xl text-black">Leads</div></header>
<div class="max-w-3xl mx-auto w-full px-4 py-4 space-y-4">
<div class="flex gap-2"><input placeholder="Search name, parent, phone…" tabindex="-1" class="flex-1 min-w-0 h-11 px-4 bg-black/[0.04] rounded-full text-sm text-black"><button class="h-11 px-5 bg-black text-white rounded-full text-sm font-semibold shrink-0">+ Add lead</button></div>
<div class="rounded-2xl bg-black/[0.05] border border-black/10 px-4 py-2 text-sm text-black/70">1 follow-up is overdue.</div>
<div class="flex gap-1.5 overflow-x-auto -mx-4 px-4 pb-1"><button class="h-9 px-4 rounded-full text-sm font-semibold shrink-0 bg-black text-white">To do<span class="opacity-60 ml-1.5">4</span></button><button class="h-9 px-4 rounded-full text-sm font-semibold shrink-0 bg-black/5 text-black/70">Open<span class="opacity-60 ml-1.5">7</span></button><button class="h-9 px-4 rounded-full text-sm font-semibold shrink-0 bg-black/5 text-black/70">Waitlist<span class="opacity-60 ml-1.5">2</span></button><button class="h-9 px-4 rounded-full text-sm font-semibold shrink-0 bg-black/5 text-black/70">Members<span class="opacity-60 ml-1.5">14</span></button><button class="h-9 px-4 rounded-full text-sm font-semibold shrink-0 bg-black/5 text-black/70">Lost<span class="opacity-60 ml-1.5">3</span></button></div>
<div class="space-y-2">
${LEAD("l1", "Ethan Park", "", "Speed work", "Contacted", "Website", "McKinney", "Overdue · Mon, Jun 22", "text-black", "Left a voicemail. Wants early mornings.")}
${LEAD("l2", "Chloe Nakamura", "", "Summer speed camp", "New", "Instagram", "Celina", "Today · Tue, Jun 23", "text-black/60", "DM'd asking about summer speed camp")}
${LEAD("l3", "Isaiah Brooks", "Nina Brooks", "Handles · waiting on Thursday hoops", "Waitlist", "Instagram", "", "Today · Tue, Jun 23", "text-black/60", "Texted Nina. A spot opens Thursday.")}
${LEAD("l4", "Andre Baptiste", "", "Off-season strength", "New", "Walk-in", "McKinney", "No follow-up set", "text-black/40", "")}
</div></div></div>`,
    /* the owner opens Isaiah, who signed up: convert, with Scott, and the
       app says what is still owed */
    run(doc, at, c) {
      at(450, () => tap(doc, $(doc, "l3"), c));
      at(600, () => {
        $(doc, "leads").appendChild(node(doc, `<div id="sheet" class="absolute inset-0 z-50 flex items-end md:items-center md:justify-center bg-black/40 dsc-sheet-backdrop"><div id="panel" class="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto dsc-sheet-panel"><div class="px-5 pt-5 pb-3 flex items-center justify-between sticky top-0 bg-white z-10"><div class="dsc-headline text-2xl text-black truncate">Isaiah Brooks</div><button class="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-black/60 shrink-0" aria-label="Close">✕</button></div><div id="lsbody" class="px-5 pb-6 space-y-4">${LEAD_INFO}<div><div class="dsc-label text-black/50 mb-1.5">Stage</div><div class="flex flex-wrap gap-1.5">${STAGE("New") + STAGE("Contacted") + STAGE("Trial") + STAGE("Waitlist", true)}</div></div><div class="rounded-2xl bg-black/[0.04] p-3 space-y-2"><textarea rows="2" tabindex="-1" placeholder="What happened? &quot;Texted, trying Tuesday 5pm&quot;" class="w-full px-3 py-2 bg-white rounded-xl text-black text-sm"></textarea><label class="flex items-center gap-2 text-sm text-black/70"><input type="checkbox" checked tabindex="-1" class="w-4 h-4 accent-black">I reached out / talked to them</label><div class="flex flex-wrap items-center gap-1.5"><span class="dsc-label text-black/50 mr-1">Next follow-up</span>${NEXT("Tomorrow") + NEXT("3 days", true) + NEXT("1 week") + NEXT("2 weeks")}</div><button disabled class="w-full h-10 bg-black text-white rounded-full text-sm font-semibold disabled:bg-black/30">Save note · next Fri, Jun 26</button><p class="text-xs text-black/50">Currently set: Tue, Jun 23</p></div><div id="conv"><div class="flex gap-2"><button id="make" class="flex-1 h-11 bg-black text-white rounded-full text-sm font-semibold">They signed up → make athlete</button><button class="h-11 px-4 rounded-full bg-black/5 text-black/70 text-sm font-semibold">Lost</button></div></div>${LEAD_HISTORY}</div></div></div>`));
      });
      at(1250, () => tap(doc, $(doc, "make"), c));
      at(1400, () => {
        $(doc, "conv").innerHTML = '<div class="rounded-2xl border border-black/10 p-3 space-y-2"><div class="text-sm font-semibold text-black">Make Isaiah an athlete</div><select tabindex="-1" class="w-full h-11 px-3 bg-black/5 rounded-xl text-black placeholder:text-black/30"><option>Scott</option></select><p class="text-xs text-black/60">They’ll also be added to Thursday hoops.</p><div class="flex gap-2"><button id="go" class="flex-1 h-10 bg-black text-white rounded-full text-sm font-semibold disabled:opacity-40">Convert</button><button class="h-10 px-4 rounded-full bg-black/5 text-sm">Cancel</button></div></div>';
        reveal($(doc, "conv").firstChild);
        scrollBox(c, $(doc, "panel"), 60, 380);
      });
      at(1900, () => tap(doc, $(doc, "go"), c));
      at(2100, () => {
        $(doc, "lsbody").innerHTML = LEAD_INFO + '<div id="done" class="rounded-2xl bg-black/[0.05] p-4 text-sm text-black">Isaiah Brooks is now an athlete. Added to Thursday hoops. They still need a signed waiver, send the link from their profile. <span class="underline font-semibold">Open profile</span></div><div class="rounded-2xl bg-black/[0.04] p-3 space-y-2"><textarea rows="2" tabindex="-1" placeholder="Add a note" class="w-full px-3 py-2 bg-white rounded-xl text-black text-sm"></textarea><button disabled class="w-full h-10 bg-black text-white rounded-full text-sm font-semibold disabled:bg-black/30">Add note</button></div>' + LEAD_HISTORY;
        $(doc, "panel").scrollTop = 0; reveal($(doc, "done"));
      });
    },
  };

  /* ── the waiver, by link ────────────────────────────────────────────
     src/app/waiver/[token]/page.tsx 59-66 (page, header), 81-88 (the
     signed card), 90-145 (ready: whose, the release, legal name, the
     tick, Sign); the release itself from lib/waiver.ts 10-29, the first
     sections (it scrolls past). For profiles staff make, which never saw
     sign-up: the link works once, lasts 14 days, and records the legal
     name, time and signer. Isaiah was a lead a moment ago; his mother
     signs. Changed: the name field a span to type into. */
  S.waiver = {
    html: `<div style="height:750px;display:flex;flex-direction:column;overflow:hidden;background:#fff">
<main id="wv-page" class="bg-white px-4 py-10" style="flex:none">
<div class="max-w-2xl mx-auto"><div class="text-center mb-8"><div class="dsc-headline text-3xl text-black">DSC</div><div class="dsc-label text-black/40 mt-1">Dallas Sport Collective</div></div>
<div id="wv-state"><div class="space-y-6">
<div><div class="dsc-label text-black/40">Waiver for</div><div class="dsc-headline text-3xl text-black">Isaiah Brooks</div><p class="text-sm text-black/60 mt-2">A parent or guardian should sign for anyone under 18.</p></div>
<div id="wv-text" class="rounded-3xl bg-black/[0.04] p-5 max-h-[55vh] overflow-y-auto" style="scrollbar-width:none"><h1 class="font-black text-center mb-1">ACCIDENT WAIVER AND RELEASE OF LIABILITY</h1><p class="text-center text-black/50 text-sm mb-4">Dallas Sports Collective, LLC</p><div class="whitespace-pre-wrap text-sm text-black/80 leading-relaxed">This release and waiver of liability, assumption of risk, and indemnity agreement ("Agreement") is in consideration of the Member/Guest being permitted to enter Dallas Sports Collective, LLC facilities, and to use its equipment and machinery in addition to participate in any instruction or training provided by or at Dallas Sports Collective, LLC. The undersigned (Parent/Guardian if the member is under the age of 18) hereby confirms that they are physically fit and able to participate in any training and/or the use of equipment and machinery.

ACTIVITIES
Activities shall include but are not limited to: (a) using of all sports performance equipment; (b) all activities incidental thereto including without limitation, warm-up exercises, warm-down exercises, rest, recovery, training programs, physical fitness regimens, and other activities which the company at which Company equipment and/or property may be used.

RISKS
The risks of engaging in the activities include but are not limited to: (a) contact or collision with other participants, equipment, or property; (b) slipping, falling, and other loss of balance; (c) abnormal blood pressure or respiration, fainting, dizziness, heat stroke, heart attack, physical conditions that could cause death; and (d) aggravation of pre-existing injuries or medical conditions.

MEDICAL CONDITIONS
Dallas Sports Collective, LLC, any staff member or agent does not provide medical advice. Depending on your individual physical condition, any instruction, advice, or direction of such parties could result in harm. You should consult your physician or medical doctor before starting a training regimen and prior to the use of any equipment or services. You are solely responsible for all decisions involving any medical treatment or advice of any kind.</div></div>
<label class="block"><span class="dsc-label text-black/50">Full legal name (signer)</span><span id="wv-name" class="mt-1 w-full h-12 px-4 bg-black/5 rounded-xl text-black" style="display:flex;align-items:center"><span class="text-black/50">Type your full name</span></span></label>
<label class="flex items-start gap-3 cursor-pointer"><input id="wv-agree" type="checkbox" tabindex="-1" class="mt-1 w-5 h-5 accent-black"><span class="text-sm text-black/70">I have read and fully understand the terms of this Agreement and understand that I am giving up legal rights by signing this Agreement.</span></label>
<button id="wv-sign" type="button" disabled class="w-full h-12 bg-black text-white rounded-full font-semibold disabled:bg-black/30">Sign waiver</button>
</div></div></div></main></div>`,
    /* read (fast), the page up to the name, typed, ticked, signed */
    run(doc, at, c) {
      const page = $(doc, "wv-page"), box = $(doc, "wv-text");
      const y = Math.max(0, page.offsetHeight - 750);
      at(150, () => scrollBox(c, box, 700, 520));
      at(520, () => glide(c, page, 0, y, 460));
      type(doc, $(doc, "wv-name"), "Nina Brooks", at, 640, 32);
      at(1060, () => { const a = $(doc, "wv-agree"); tap(doc, a, c); a.checked = true; $(doc, "wv-sign").removeAttribute("disabled"); });
      at(1300, () => { const s = $(doc, "wv-sign"); tap(doc, s, c); s.textContent = "Signing…"; });
      at(1520, () => {
        c.anim(page, [{ transform: "translateY(0px)" }, { transform: "translateY(0px)" }], { duration: 10, fill: "forwards" });
        $(doc, "wv-state").innerHTML = '<div class="rounded-3xl bg-black/[0.05] p-8 text-center"><div class="dsc-headline text-3xl text-black">Signed. Thank you.</div><p class="text-black/70 mt-3">Isaiah’s waiver is on file with DSC. You can close this page.</p></div>';
        reveal($(doc, "wv-state").firstChild);
      });
    },
  };

  /* ── a family signs up ──────────────────────────────────────────────
     src/app/athlete/register/page.tsx 9-15 (logo), 150-178 (page,
     header, the photo card, its gradient, the headline), 181-245 (the
     form to the picker), 247-291 (the parent block), 328-386 (password,
     legal name, the waiver tick, CREATE ACCOUNT); components/
     SportGradePicker.tsx 30-98 (the chips: 14 sports from lib/grade.ts
     8-33, up to five; Other; Grade). The date of birth decides whether
     the parent block shows (lib/guardian.ts 15-19: under 18), and the
     server holds the same rule. Changed: the photo the app's own
     (public/images/landing-page-bg.jpg, through the prep script); the
     typed fields spans; the guardian label's em dash a middle dot; the
     app's entrance classes left off (the page is already open). Zoe is
     a seed athlete signing up; her parent is fictional. */
  const SPORT = (n, id) => `<button type="button" ${id ? `id="${id}" ` : ""}class="h-9 px-3 rounded-full text-sm bg-white/10 text-white/80 hover:bg-white/20">${n}</button>`;
  const FIELD = "w-full h-14 px-6 bg-white text-black text-base rounded-full placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-white/60";
  S.signup = {
    html: `<div style="height:750px;display:flex;flex-direction:column;overflow:hidden;background:#fff">
<div id="reg-page" class="bg-white flex flex-col" style="flex:none">
<header class="px-4 md:px-6 py-5 flex items-center justify-between"><span aria-label="DSC home" class="block"><img src="${MARK}" alt="DSC" width="40" height="40"></span><span class="dsc-label text-black/60 hover:text-black">Sign in</span></header>
<div class="flex-1 flex items-stretch px-4 pb-4 md:px-6 md:pb-6"><div class="relative w-full rounded-3xl overflow-hidden flex flex-col justify-end" style="background-image:url(${IMG}app-landing@1600.webp);background-size:cover;background-position:center;min-height:680px">
<div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-none"></div>
<div class="relative p-6 pb-8 md:p-10 md:pb-10 w-full max-w-md mx-auto space-y-5">
<div><div class="dsc-label text-white/70 mb-2">New athlete</div><h2 class="dsc-headline text-4xl md:text-6xl text-white leading-[0.85]">Join the<br>collective.</h2></div>
<form class="space-y-2" onsubmit="return false">
<div class="grid grid-cols-2 gap-2"><input type="text" value="Zoe" tabindex="-1" class="${FIELD}"><input type="text" value="Campbell" tabindex="-1" class="${FIELD}"></div>
<input type="email" value="dana.campbell@email.com" tabindex="-1" class="${FIELD}"><input type="tel" value="214-555-0173" tabindex="-1" class="${FIELD}">
<label class="block"><span class="dsc-label text-white/60 px-6 mb-1.5 block">Date of birth</span><span id="reg-dob" class="${FIELD}" style="display:flex;align-items:center"></span></label>
<div class="rounded-3xl bg-white/10 p-4"><div class="space-y-4"><div><div id="reg-sport-label" class="dsc-label text-white/70 px-2 mb-2">Sport (pick any)</div><div class="flex flex-wrap gap-1.5">${SPORT("Basketball") + SPORT("Football") + SPORT("Baseball") + SPORT("Softball") + SPORT("Soccer") + SPORT("Volleyball", "chip-v") + SPORT("Track &amp; Field", "chip-t") + SPORT("Lacrosse") + SPORT("Hockey") + SPORT("Tennis") + SPORT("Golf") + SPORT("Wrestling") + SPORT("Swimming") + SPORT("Cheer / Dance")}</div><div class="flex gap-2 mt-2"><input placeholder="Other sport" tabindex="-1" class="w-full h-12 px-5 bg-white text-black text-base rounded-full placeholder:text-black/40 focus:outline-none"><button type="button" class="h-11 px-4 rounded-xl text-sm font-semibold shrink-0 bg-white/10 text-white">Add</button></div></div><div><div class="dsc-label text-white/70 px-2 mb-2">Grade</div><select id="reg-grade" tabindex="-1" class="w-full h-12 px-5 bg-white text-black text-base rounded-full placeholder:text-black/40 focus:outline-none"><option value="">Choose…</option></select></div></div></div>
<div id="reg-guardian" class="rounded-3xl bg-white/10 p-4 space-y-3 hidden"><div class="dsc-label text-white/70 px-2">Parent or guardian · required under 18</div><span id="reg-parent" class="${FIELD}" style="display:flex;align-items:center"><span class="text-black/40">Parent or guardian name</span></span><input type="tel" placeholder="Their mobile number" tabindex="-1" class="${FIELD}"><input type="text" placeholder="Relationship (mother, father, guardian…)" tabindex="-1" class="${FIELD}"><label class="flex items-start gap-3 px-2 pt-1 cursor-pointer"><input type="checkbox" checked tabindex="-1" class="mt-1 w-5 h-5 accent-white shrink-0"><span class="text-sm text-white/85 leading-snug">Emergency contact is the same person</span></label></div>
<input type="password" placeholder="Password (6+ characters)" tabindex="-1" class="${FIELD}"><input type="text" placeholder="Zoe Campbell" tabindex="-1" class="${FIELD}">
<label class="flex items-start gap-3 pt-2 px-1"><input type="checkbox" tabindex="-1" class="mt-1 w-5 h-5 accent-white shrink-0"><span class="text-sm text-white/85 leading-snug">I have read and agree to the <button type="button" class="underline text-white">waiver and disclaimer</button>.</span></label>
<button type="button" class="w-full h-14 border-2 border-white/80 text-white rounded-full dsc-headline text-lg hover:bg-white/10 transition-colors disabled:opacity-40 mt-3">CREATE ACCOUNT</button>
</form></div></div></div></div></div>`,
    /* a date of birth under 18 opens the parent block; two sports; the
       page goes up to it and the parent's name is typed */
    run(doc, at, c) {
      const page = $(doc, "reg-page"), dob = $(doc, "reg-dob"), g = $(doc, "reg-guardian");
      const y0 = Math.max(0, depth(page, dob) - 70);
      c.anim(page, [{ transform: "translateY(" + -y0 + "px)" }, { transform: "translateY(" + -y0 + "px)" }], { duration: 10, fill: "forwards" });
      at(200, () => { dob.textContent = "Nov 2, 2012"; swap(g, "hidden"); reveal(g); });
      const pick = (id, ms) => at(ms, () => { const b = $(doc, id); tap(doc, b, c); swap(b, "bg-white/10 text-white/80 hover:bg-white/20", "bg-white text-black"); });
      pick("chip-v", 520);
      pick("chip-t", 820);
      at(840, () => { $(doc, "reg-sport-label").textContent = "Sports (pick any)"; $(doc, "reg-grade").innerHTML = "<option>8th grade</option>"; });
      at(1060, () => { const y1 = Math.max(y0, Math.min(page.offsetHeight - 750, depth(page, g) + y0 - 150)); glide(c, page, y0, y1, 440); });
      type(doc, $(doc, "reg-parent"), "Dana Campbell", at, 1240, 30);
    },
  };

  /* ── the owner's home, all of it ────────────────────────────────────
     src/app/admin/page.tsx 65-91 (CARDS, LINKS), 295-324 (header,
     check-in), 327-512 (the alerts, in the order they render; each box
     shows only when it has rows), 515-553 (launcher and links), 589-942
     (the boxes: booking, alert, class, time off); QuickCheckIn.tsx
     98-179. What each alert means is the app's: leads due today or
     before (lib/leads.ts), a coach's time off with what they are booked
     on then (lib/timeOff.ts 76-115), families asking into an open group,
     a booking an athlete's AI requested (only request_session makes
     these, so each says via AI), who hasn't been in for two weeks (90
     days and nothing booked is only counted, lib/attendance.ts 160-241),
     sessions with no attendance in 14 days, check-ins with nothing
     booked, sign-ups with no trainer. The walk-ins box is left out. The
     day is Tuesday 23 June, so it agrees with the pairs: the leads,
     Zeke's request, Zoe's sign-up. */
  const BOX = (id, tone, dot, label, body, note) => `<div id="${id}" class="px-4 py-3 rounded-2xl ${tone} max-w-3xl mx-auto"><div class="flex items-center gap-2 mb-2"><span class="w-2 h-2 rounded-full ${dot}" aria-hidden="true"></span><span class="dsc-label ${label[1]}">${label[0]}</span></div>${note || ""}<div class="space-y-2">${body}</div></div>`;
  const ROW = (name, sub, right) => `<span class="bg-white rounded-2xl p-3 flex items-center gap-3 hover:bg-black/[0.02]"><div class="flex-1 min-w-0"><div class="text-sm text-black truncate font-medium">${name}</div>${sub ? `<div class="text-xs text-black/50 truncate">${sub}</div>` : ""}</div><span class="dsc-label text-black/60 shrink-0">${right}</span></span>`;
  const ASK = (who, verb, whom, when, note, id) => `<div class="bg-white rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center gap-2"><div class="flex-1 min-w-0"><div class="text-black text-sm"><span class="font-medium">${who}</span><span class="text-black/50"> ${verb} </span><span class="font-medium">${whom}</span></div><div class="text-xs text-black/60 mt-0.5">${when}</div>${note ? `<div class="text-xs text-black/70 mt-1 italic truncate">${note}</div>` : ""}</div><div class="flex gap-2 shrink-0"><button ${id ? `id="${id}" ` : ""}class="h-8 px-3 bg-black text-white text-xs rounded-full dsc-headline disabled:opacity-40">Approve</button><button class="h-8 px-3 ${verb === "wants" ? "text-black/60 text-xs hover:text-black" : "border border-black/20 text-black/70 text-xs rounded-full"} disabled:opacity-40">Decline</button></div></div>`;
  const REG = (name, email) => `<div class="bg-white rounded-2xl p-3 flex items-center gap-3"><div class="flex-1 min-w-0"><div class="text-sm text-black truncate"><span class="font-medium">${name}</span><span class="ml-2 text-xs text-black/50">${email}</span></div></div><select tabindex="-1" class="shrink-0 bg-black/5 border-0 text-black rounded-full px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-black/20"><option>Assign…</option></select></div>`;
  const LINK = (id, name, sub) => `<span id="${id}" class="group flex items-center justify-between gap-3 bg-black/[0.04] hover:bg-black/[0.07] rounded-2xl px-4 py-3 transition-colors"><div class="min-w-0"><div class="dsc-headline text-base text-black truncate">${name}</div><div class="dsc-label text-black/40 group-hover:text-black/60 truncate">${sub}</div></div><span class="text-black/30 group-hover:text-black/60 shrink-0">→</span></span>`;
  S.owner = {
    html: `<div id="ohs" style="height:750px;overflow:hidden;position:relative;background:#fff"><div id="oh" class="bg-white flex flex-col">${HOME_HEAD}${HOME_CHECKIN(6)}
<div class="px-4 space-y-2 pb-2">
${LEADS_DUE.replace("<span ", '<span id="oh-leads" ')}
${TIME_OFF(false).replace("<div ", '<div id="oh-timeoff" ')}
${BOX("oh-class", "bg-black/[0.05] border border-black/10", "bg-black", ["Class requests · 1", "text-black"], ASK("Elena Rodriguez", "wants a spot in", "Basketball group", "Mondays · 11:00am · 6/8 spots taken"))}
${BOX("oh-booking", "bg-black/[0.05] border border-black/10", "bg-black", ["Booking requests · 1", "text-black"], ASK("Aaliyah Jackson", "wants", "Sara", 'Wed, Jun 24 · 5:00 PM · 60min<span class="ml-2 dsc-label text-black/40">via AI</span>', "“Working on first-step speed before tryouts.”"))}
${BOX("oh-absent", "bg-black/[0.05] border border-black/10", "bg-black", ["Haven’t been in for 2+ weeks · 3", "text-black"], ROW("Ryan O'Brien", "Next booked Thu, Jun 25", "15d") + ROW("Nina Kowalski", "Nothing booked · 1 no-show", "19d") + ROW("Lucas Fernandez", "Nothing booked · not confirmed", "26d"), '<p class="text-xs text-black/60 mb-2">Worth a check-in call, most recent first. “Not confirmed” means their last session never had attendance taken. 2 more haven&rsquo;t been in for 3+ months and aren&rsquo;t listed.</p>')}
${BOX("oh-owed", "bg-black/[0.05] border border-black/10", "bg-black", ["Attendance not taken · 2", "text-black"], ROW("Basketball group (6)", "Mon, Jun 22, 11:00 AM · Zeke", "Take it") + ROW("Dante Williams", "Mon, Jun 22, 5:00 PM · Brenden", "Take it"))}
${BOX("oh-extra", "bg-black/[0.05] border border-black/10", "bg-black", ["Extra visits · 2", "text-black"], ROW("Raj Sharma", "", "4×") + ROW("Sofia Andersson", "", "2×"), '<p class="text-xs text-black/60 mb-2">Checked in without a scheduled session in the last 30 days.</p>')}
${BOX("oh-newreg", "bg-black/[0.05] border border-black/10", "bg-black", ["New registrations · 2", "text-black"], REG("Zoe Campbell", "dana.campbell@email.com") + REG("Jasmine Kumar", "jasmine.kumar@email.com"))}
</div>
<section class="px-4 pt-2 pb-4"><div id="oh-cards" class="grid grid-cols-2 gap-3 md:gap-4 max-w-3xl mx-auto">${CARDS}</div>
<div id="oh-links" class="grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-3xl mx-auto mt-3">${LINK("oh-link-money", "Money", "Revenue, who owes, prices") + LINK("oh-link-leads", "Leads", "Waitlist &amp; follow-ups") + LINK("oh-link-schedule", "Gym schedule", "What every coach sees") + LINK("oh-link-injuries", "Injuries", "Coach ↔ PT follow-ups") + LINK("oh-link-groups", "Groups", "Rosters &amp; standing times") + LINK("oh-link-blasts", "Announcements", "Email the gym") + LINK("oh-link-recovery", "Recovery", "Room charges") + LINK("oh-link-staff", "Staff", "Logins &amp; access")}</div></section>
</div></div>`,
    /* the stops down the page, each with the time the page arrives there:
       the requests, who hasn't been in and what is owed, the launcher,
       the links; then Groups is tapped. The shot reads the same list to
       keep its notes in step */
    stops: [["oh-booking", 1050], ["oh-owed", 1650], ["oh-cards", 2250], ["oh-link-injuries", 2800]],
    run(doc, at, c) {
      const oh = $(doc, "oh"), max = Math.max(0, oh.offsetHeight - 750);
      let prev = 0;
      this.stops.forEach(([id, ms]) => {
        const y = Math.min(max, Math.max(0, depth(oh, $(doc, id)) - 24)), from = prev; prev = y;
        at(ms - 480, () => glide(c, oh, from, y, 480));
      });
      at(3100, () => tap(doc, $(doc, "oh-link-groups"), c));
    },
  };
  /* Groups: a named roster with a standing time; Materialize puts the
     next eight weeks on the calendar through the engine and emails the
     roster once. src/app/admin/groups/page.tsx 119-148 (materialize),
     150-319 (the page, a group's card, the banner). */
  const MEMBERS = (names) => names.map((n) => `<span class="px-2.5 py-1 rounded-full bg-black text-white text-xs font-medium">${n}</span>`).join("");
  S.groups = {
    html: `<div style="height:750px;overflow:hidden;background:#fff"><div class="bg-white">
<header class="sticky top-0 z-10 bg-white/95 backdrop-blur px-4 py-3 flex items-center gap-3 border-b border-black/10"><span class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 text-black/70" aria-label="Back to home">${CHEV}</span><div class="dsc-headline text-lg md:text-xl text-black">Groups</div></header>
<div class="max-w-3xl mx-auto w-full px-4 py-6"><button class="w-full mb-4 h-12 bg-black text-white rounded-full dsc-headline text-base">+ New group</button><div id="gp-banner"></div>
<label class="flex items-center gap-2 mb-4 cursor-pointer"><input type="checkbox" tabindex="-1" class="w-4 h-4 accent-black"><span class="dsc-label text-black/50">Show retired groups</span></label>
<div class="space-y-3">
<div class="rounded-3xl p-5 bg-black/[0.04]"><div class="flex items-start justify-between gap-3 mb-3"><div class="min-w-0"><div class="dsc-headline text-xl text-black truncate">Basketball group</div><div class="dsc-label text-black/50 mt-1">Mondays at 11:00am · 60 min · Celina</div><div class="dsc-label text-black/60 mt-1">Open to families · 6/8 spots</div></div><button class="dsc-label text-black/50 hover:text-black shrink-0">Edit</button></div><div class="flex flex-wrap gap-1.5 mb-3">${MEMBERS(["Marcus C.", "Priya P.", "Olivia S.", "Dante W.", "Jamal R.", "Fatima A."])}</div><div class="flex items-center justify-between gap-3 flex-wrap"><div class="dsc-label text-black/50">Zeke (lead) · Justin</div><button id="gp-materialize" class="h-9 px-4 rounded-full bg-black text-white text-sm font-semibold disabled:bg-black/20">Materialize 8 weeks</button></div></div>
<div class="rounded-3xl p-5 bg-black/[0.04]"><div class="flex items-start justify-between gap-3 mb-3"><div class="min-w-0"><div class="dsc-headline text-xl text-black truncate">Combine prep</div><div class="dsc-label text-black/50 mt-1">Wednesdays at 6:00am · 90 min · McKinney</div></div><button class="dsc-label text-black/50 hover:text-black shrink-0">Edit</button></div><div class="flex flex-wrap gap-1.5 mb-3">${MEMBERS(["Brandon M.", "Trevor N.", "Kenji W."])}</div><div class="flex items-center justify-between gap-3 flex-wrap"><div class="dsc-label text-black/50">Scott</div><button class="h-9 px-4 rounded-full bg-black text-white text-sm font-semibold disabled:bg-black/20">Materialize 8 weeks</button></div></div>
</div></div></div></div>`,
    run(doc, at, c) {
      at(380, () => tap(doc, $(doc, "gp-materialize"), c));
      at(620, () => { const b = node(doc, '<div class="rounded-2xl bg-black/[0.05] border border-black/10 px-4 py-3 text-sm text-black mb-4 flex items-start justify-between gap-3"><span>Basketball group: 8 sessions added. Everyone on the roster has been emailed once.</span><button class="shrink-0 opacity-50 hover:opacity-100" aria-label="Dismiss">✕</button></div>'); $(doc, "gp-banner").appendChild(b); reveal(b); });
    },
  };

  window.DSCScreens = S;
})();
