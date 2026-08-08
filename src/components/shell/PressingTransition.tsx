"use client";

/* ── PressingTransition ─────────────────────────────────────────────
 * The site's page transition: white curtain down, black curtain up
 * over it, then the black lifts from the bottom to reveal the page
 * that was loaded underneath. The name of what is arriving repeats
 * down both panels, and inverts with them.
 *
 * IT LIVES IN THE SHELL, and that is the whole point of this file. The
 * sequence was written in the homepage's lab and stayed there, so it
 * only ran for links inside the homepage, and it ended on
 * `location.href` — a full document load, which throws away everything
 * React had. Every other link on the site got the older BurnMelt
 * overlay instead, and on the homepage BOTH fired: BurnMelt listens on
 * document in the capture phase, so it caught the same click, burned,
 * and pushed a route while the curtain was still running. The arriving
 * page then played BurnMelt's fade-in on top of the reveal. That is
 * the "mixed with the old burn" this replaces.
 *
 * THE SEQUENCE OWNS THE NAVIGATION. Beats one and two run on the page
 * being left; the route is pushed under full black, where nothing is
 * visible to swap; beat three runs on the page that arrived. Nothing
 * else may cover the screen at any point, so BurnMelt is gone.
 *
 * AND IT ALWAYS RUNS TO LENGTH. A prefetched route resolves in a few
 * milliseconds, which would snap the black open before the eye has
 * registered it was ever closed, so the reveal waits on a floor as
 * well as on the router. At the other end, a heavy route holds the
 * black for seconds, and a still page under a still curtain reads as
 * a hang — so the stack redraws itself while it waits, and a lap is
 * never cut short. That redraw is a KEYFRAME ANIMATION rather than a
 * timer, and the difference is the whole reason it works: while a
 * heavy route commits, the main thread is gone, so a JavaScript loader
 * freezes exactly when it is needed. The compositor does not care.
 * A ceiling gives the page back if the route never arrives at all.
 */

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

/** How far apart the stacked lines arrive, and leave. Arriving is the
 *  flourish; leaving should not hold the page up. */
const STEP_IN = 0.03;
const STEP_OUT = 0.02;
/** The floor under the black. Long enough to read as a held beat. */
const HOLD_MIN_MS = 520;
/** Tail after a stagger's last line starts, covering its own duration. */
const IN_TAIL_MS = 360;
const OUT_TAIL_MS = 260;
/** The ceiling. A route that never arrives still gives the page back. */
const HOLD_MAX_MS = 4000;
/** Per-beat safety, in case a transitionend never fires (hidden tab). */
const BEAT_MAX_MS = 1400;

export function PressingTransition() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const busy = useRef(false);
  /** Resolved by the pathname effect when the document has actually
   *  swapped, so the reveal is keyed to the real thing rather than to
   *  an optimistic timer. */
  const arrived = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (arrived.current) {
      arrived.current();
      arrived.current = null;
    }
  }, [pathname]);

  /** One beat: add the class, wait for the PANEL's own transition.
   *  transitionend bubbles, so every stacked line inside reports too —
   *  without the target check the first line to land ends the beat and
   *  the sequence collapses to about a third of its length. */
  const beat = useCallback((cls: string, el: Element) => {
    const root = rootRef.current!;
    return new Promise<void>((resolve) => {
      let done = false;
      const end = (e?: Event) => {
        if (done || (e && e.target !== el)) return;
        done = true;
        el.removeEventListener("transitionend", end);
        resolve();
      };
      el.addEventListener("transitionend", end);
      root.classList.add(cls);
      setTimeout(end, BEAT_MAX_MS);
    });
  }, []);

  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  /* Stop the wait animation only at a lap boundary, so no line is
     caught mid-flight. The first line has no delay, so it laps first;
     the keyframes hold their settled state long enough that when it
     does, every staggered line behind it is settled too. */
  const stopWaiting = useCallback((root: HTMLElement) => {
    return new Promise<void>((resolve) => {
      if (!root.classList.contains("pt-wait")) return resolve();
      const first = root.querySelector<HTMLElement>(".ptw .ptstack .ptl");
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        first?.removeEventListener("animationiteration", finish);
        root.classList.remove("pt-wait");
        resolve();
      };
      first?.addEventListener("animationiteration", finish);
      /* a floor under the boundary wait: one lap, plus the stagger */
      setTimeout(finish, 2000);
    });
  }, []);

  const play = useCallback(
    async (href: string, title: string, sub: string) => {
      const root = rootRef.current;
      if (!root || busy.current) return;
      busy.current = true;

      /* What is loading, repeated until it fills the page. The count is
         MEASURED rather than fixed: a line is whatever the type
         actually renders at, so the stack fills a phone and a display
         alike. */
      const stacks = [
        root.querySelector<HTMLElement>(".ptw .ptstack")!,
        root.querySelector<HTMLElement>(".ptb .ptstack")!,
      ];
      stacks.forEach((el) => (el.innerHTML = ""));
      const probe = document.createElement("span");
      probe.className = "ptl";
      probe.style.cssText = "position:absolute;visibility:hidden;opacity:1";
      probe.textContent = title || "—";
      stacks[0].appendChild(probe);
      const lineH = probe.getBoundingClientRect().height || 44;
      probe.remove();

      const gut =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--gut")
        ) || 40;
      const avail = window.innerHeight - gut * 2;
      const lines = Math.max(3, Math.round(avail / lineH));
      stacks.forEach((el) =>
        el.style.setProperty("--ptlh", (avail / lines).toFixed(2) + "px")
      );
      for (let i = 0; i < lines; i++) {
        stacks.forEach((el) => {
          const line = document.createElement("span");
          line.className = "ptl";
          line.style.setProperty("--d", (i * STEP_IN).toFixed(3) + "s");
          line.textContent = title || "";
          if (sub) {
            const t = document.createElement("span");
            t.className = "sub";
            t.textContent = "  " + sub;
            line.appendChild(t);
          }
          el.appendChild(line);
        });
      }

      const white = root.querySelector(".ptw")!;
      const black = root.querySelector(".ptb")!;
      root.classList.add("pt-run");
      /* Commit the lines' start state before the class that animates
         them. Built and revealed in the same task, they have never
         been rendered hidden, so there is nothing to transition FROM
         and all of them arrive at once. Reading layout forces the
         frame. */
      void (root as HTMLElement).offsetHeight;

      await beat("pt-1", white); /* white falls */
      await beat("pt-2", black); /* black rises over it */

      /* ── the swap, under full black ──
         Nothing is visible here, which is the only safe place to
         change the document. The wait is on the real arrival AND a
         floor, so a prefetched route cannot snap the black open before
         it has registered as closed, and a stalled one cannot hold the
         screen forever. */
      let ready = false;
      const routeChange = new Promise<void>((resolve) => {
        arrived.current = resolve;
      })
        /* The route arriving is not the same as the page being ON
           SCREEN. A.R.C. commits its pathname while it still has
           thousands of SVG nodes left to paint, so lifting on the
           pathname alone handed the reader a curtain rising over a
           page that was still assembling — the stutter moved out from
           under the black instead of being hidden by it. Two frames
           after the commit, the browser has painted; a timeout keeps
           a page that never settles from holding the screen. */
        .then(
          () =>
            new Promise<void>((resolve) => {
              let done = false;
              const go = () => {
                if (done) return;
                done = true;
                resolve();
              };
              requestAnimationFrame(() => requestAnimationFrame(go));
              setTimeout(go, 900);
            })
        )
        .then(() => {
          ready = true;
        });
      void routeChange;

      /* The class goes on BEFORE the push. Once React starts committing
         a heavy route the main thread is gone, and a class added after
         that would not land until the work was already over. Started
         here, the compositor carries it straight through. */
      root.classList.add("pt-wait");
      router.push(href);

      /* the floor: a prefetched route must not snap the black open
         before the eye has registered it closed */
      const started = performance.now();
      await wait(HOLD_MIN_MS);
      /* then simply wait. The stack is redrawing itself on the
         compositor the whole time, so this loop does nothing but
         watch the clock — which is the point: on a heavy route it
         does not get to run at all for a while. */
      while (!ready && performance.now() - started < HOLD_MAX_MS) {
        await wait(80);
      }
      arrived.current = null;
      /* let the lap finish before the reveal */
      await stopWaiting(root as HTMLElement);


      /* The arriving page starts at its own top, and it has to happen
         while the black is still down or the jump is visible. */
      document.querySelector("main")?.scrollTo({ top: 0, behavior: "auto" });

      /* Reverse every line's delay before the last beat: they leave
         from the bottom, which is the direction the lifting clip
         already removes them in. Per stack, not across both —
         querySelectorAll returns document order, so indexing across
         the pair would give the two panels different sequences and
         break their registration. */
      stacks.forEach((stack) => {
        Array.from(stack.children).forEach((line, i) => {
          (line as HTMLElement).style.setProperty(
            "--d",
            ((lines - 1 - i) * STEP_OUT).toFixed(3) + "s"
          );
        });
      });

      /* Beat 3 is over when BOTH the curtain and the last line are
         done. Waiting only on the curtain resets the overlay while
         lines are still leaving, and hiding the panel cuts the stagger
         off mid-flight. */
      const outMs = ((lines - 1) * STEP_OUT + 0.26) * 1000;
      await Promise.all([
        beat("pt-3", black),
        new Promise((r) => setTimeout(r, outMs)),
      ]);

      root.className = "pt";
      busy.current = false;
    },
    [beat, stopWaiting, router]
  );

  useEffect(() => {
    const reduce = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onClick = (e: MouseEvent) => {
      if (e.button !== 0) return;
      /* A modified click opens a new tab; the page being left should
         not draw a curtain over itself for it. */
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/")) return; /* external, hash, mailto */
      if (a.getAttribute("target") === "_blank") return;
      if (href === pathname) return;
      if (reduce()) return; /* plain navigation, no curtain */

      /* CAPTURE, and the event stops here. Next's <Link> attaches its
         own click handler to the anchor, so a document listener on the
         bubble phase runs after the route has already been pushed —
         which is exactly what happened: the curtain never played and
         the page simply changed. Capture runs document-first, and
         stopping propagation is what keeps Link from navigating out
         from under the sequence. */
      e.preventDefault();
      e.stopPropagation();
      /* The destination names itself. Work frames carry the project and
         its category in the label; anything else falls back to its own
         text, which is what a footer link or a filter would want. */
      const lbl = a.querySelector(".lbl");
      const sub = lbl?.querySelector(".sub")?.textContent?.trim() ?? "";
      const title =
        (lbl ? lbl.textContent?.replace(sub, "") : a.textContent)?.trim() ?? "";
      void play(href, title, sub);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, play]);

  return (
    <div className="pt" id="pt" ref={rootRef} aria-hidden="true">
      <div className="ptw">
        <div className="ptstack" />
      </div>
      <div className="ptb">
        <div className="ptstack" />
      </div>
    </div>
  );
}
