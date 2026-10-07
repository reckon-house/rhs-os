/* ── CLOSING A STUDY ────────────────────────────────────────────────
 * A study column on the board has a ×, and pressing it puts the board
 * back as it was. A full case study had no such door: its bar offered
 * the next study and the mark, and the mark goes to the front of the
 * board rather than to the place the reader left. This is the × for
 * the page.
 *
 * WHERE THEY WERE is the page the reader came from before their first
 * study: the board, with its row kept in its own address, or a page of
 * the app such as the daybook. It is written down once, when a study
 * is reached from something that is not a study, and every study
 * reached from another study only counts a step.
 *
 * THE WAY BACK DEPENDS ON THE WAY IN.
 *   - A document the board opened, no step taken since: the entry
 *     before this one in history IS the board, so close goes back one.
 *     The browser restores the board from its back-forward cache
 *     exactly as it was left, scroll and all, or reloads it at its
 *     own address.
 *   - Any other way to the board: it loads at the address it had when
 *     the reader left, which stands the row back up.
 *   - A page of the app: the router takes the reader there.
 *   - Nothing recorded (a study opened from a search, or in a new
 *     tab): the board.
 *
 * THE CURTAIN RUNS THE WHOLE WAY. Its first two beats play here. A
 * board that loads draws the arrival note this writes in its head and
 * lifts it; a board restored from cache draws the same note in its
 * pageshow handler (scripts/lib/assemble-board.py). A page of the app
 * lifts the curtain the way every route change does.
 */
import { curtain } from "@/lib/curtain";

type Return = {
  /** Path, query and hash of the page to go back to. */
  href: string;
  /** "doc": this document was loaded from that page. "app": the router brought a study up from it. */
  via: "doc" | "app";
  /** Studies walked since, one route change each. */
  steps: number;
};

const KEY = "pt.return";
const isStudy = (path: string) => path.startsWith("/case-studies/");

/* what the curtain repeats on the way back: the name of the page */
const NAMES: Record<string, string> = {
  "/": "Reckon*House",
  "/daybook": "Daybook",
  "/inspiration": "Staples",
  "/book": "Book a call",
};

function readReturn(): Return | null {
  try {
    const r = JSON.parse(sessionStorage.getItem(KEY) || "null");
    return r && typeof r.href === "string" ? (r as Return) : null;
  } catch {
    return null;
  }
}

function writeReturn(r: Return | null) {
  try {
    if (r) sessionStorage.setItem(KEY, JSON.stringify(r));
    else sessionStorage.removeItem(KEY);
  } catch {
    /* private mode keeps no trail, and close goes to the board */
  }
}

let lastPath: string | null = null;
let lastHref: string | null = null;

/** The shell calls this on every route it shows. */
export function trackStudyReturn(pathname: string) {
  const here = window.location.pathname + window.location.search + window.location.hash;
  const prevPath = lastPath;
  const prevHref = lastHref;
  lastPath = pathname;
  lastHref = here;
  if (!isStudy(pathname) || prevPath === pathname) return;

  if (prevPath === null) {
    /* A RELOAD KEEPS WHAT WAS WRITTEN. The browser hands a reloaded page
       its first referrer again, which after a walk through Next would
       say the board is one step back when it is several. */
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if ((nav?.type === "reload" || nav?.type === "back_forward") && readReturn()) return;

    /* this document opened on a study, so its referrer is where it came from */
    let ref: URL | null = null;
    try {
      ref = document.referrer ? new URL(document.referrer) : null;
    } catch {
      ref = null;
    }
    if (!ref || ref.origin !== window.location.origin) {
      writeReturn(null);
    } else if (!isStudy(ref.pathname)) {
      writeReturn({ href: ref.pathname + ref.search + ref.hash, via: "doc", steps: 0 });
    } else {
      /* a study document opened from another study: history is not the way back */
      const r = readReturn();
      if (r) writeReturn({ ...r, steps: r.steps + 1 });
    }
    return;
  }

  if (!isStudy(prevPath) && prevHref) {
    writeReturn({ href: prevHref, via: "app", steps: 0 });
  } else {
    const r = readReturn();
    if (r) writeReturn({ ...r, steps: r.steps + 1 });
  }
}

/* The note the board's head script draws its arriving curtain from, in
   the shape the board itself writes: the lines this page's curtain is
   showing, at the size and line height they were fitted to. */
function writeArrivalNote(title: string) {
  const stack = document.querySelector<HTMLElement>("#pt .ptw .ptstack");
  const note = {
    t: Date.now(),
    title,
    sub: "",
    n: stack ? stack.childElementCount : 0,
    lh: stack?.style.getPropertyValue("--ptlh") || "",
    fs: stack?.style.getPropertyValue("--ptfs") || "",
  };
  try {
    sessionStorage.setItem("pt.arrive", JSON.stringify(note));
  } catch {
    /* the board arrives uncovered, which is the old behaviour */
  }
}

/** The study's ×: back to where the reader was, under the curtain. */
export function closeStudy(push: (href: string) => void) {
  const r = readReturn();
  const dest = r?.href || "/";
  const path = dest.split(/[?#]/)[0] || "/";
  const title = NAMES[path] ?? "Reckon*House";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (path === "/") {
    const back = r !== null && r.via === "doc" && r.steps === 0 && window.history.length > 1;
    void curtain(
      title,
      "",
      () =>
        /* NEVER RESOLVES WHILE THIS PAGE IS UP. The board is a static
           document, so this page leaves at full black and is not
           around to lift anything. It resolves only if the page is
           shown again from the cache, by Forward, so the curtain that
           was left down lifts at once instead of waiting out its
           ceiling. */
        new Promise<void>((resolve) => {
          if (!reduced) writeArrivalNote(title);
          const onShow = (e: PageTransitionEvent) => {
            if (!e.persisted) return;
            window.removeEventListener("pageshow", onShow);
            resolve();
          };
          window.addEventListener("pageshow", onShow);
          if (!back) {
            window.location.href = dest;
            return;
          }
          window.history.back();
          /* a back that leaves nothing behind in three seconds had no
             page to go to: go by the address instead. Cancelled the
             moment this page is hidden, or a Forward to it later would
             fire it. */
          const late = window.setTimeout(() => {
            window.location.href = dest;
          }, 3000);
          const cancel = () => {
            window.clearTimeout(late);
            window.removeEventListener("pagehide", cancel);
          };
          window.addEventListener("pagehide", cancel);
        })
    );
    return;
  }

  const from = window.location.pathname;
  void curtain(
    title,
    "",
    () =>
      new Promise<void>((resolve) => {
        push(dest);
        const t0 = performance.now();
        const tick = () => {
          if (window.location.pathname !== from || performance.now() - t0 > 8000) resolve();
          else window.setTimeout(tick, 50);
        };
        tick();
      })
  );
}
