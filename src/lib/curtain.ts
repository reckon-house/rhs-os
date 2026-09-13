/**
 * The curtain, for things that are not navigations.
 *
 * PressingTransition owns the sequence: white down, black up over it,
 * the change made under full black where nothing is visible, then the
 * black lifting to reveal what was built. It ran for links only,
 * because the change it made under the black was always a route push.
 *
 * A daybook filter is the same act with a different commit. It rebuilds
 * the list rather than the document, and before this it had a private
 * two-beat animation of its own: rows drew out, the list swapped, rows
 * drew back in. Two different transitions on one site, one of them
 * doing a quieter version of the other's job.
 *
 * So the commit became the parameter. `curtain(label, sub, commit)`
 * plays the full sequence and calls `commit` under the black; a route
 * push is now one commit among others rather than the only one.
 *
 * A MODULE-LEVEL REGISTRY, NOT A CONTEXT, and deliberately. The
 * transition is mounted once in the shell, above every route, and the
 * things that want to call it are leaves. Threading a provider through
 * for a single function that has exactly one publisher is more moving
 * parts than the problem has.
 *
 * IT FALLS BACK TO DOING THE WORK. If nothing is registered — the
 * transition unmounted, a test, reduced motion refusing to play — the
 * commit still runs, immediately and without ceremony. A caller never
 * has to check whether the curtain exists, and a missing animation can
 * never become a missing state change.
 */

/** Resolves once the change is committed AND on screen. */
export type CurtainCommit = () => void | Promise<void>;

export type CurtainRunner = (
  label: string,
  sub: string,
  commit: CurtainCommit
) => Promise<void>;

let runner: CurtainRunner | null = null;

/** PressingTransition calls this on mount. Returns its own teardown. */
export function registerCurtain(fn: CurtainRunner): () => void {
  runner = fn;
  return () => {
    if (runner === fn) runner = null;
  };
}

/**
 * Play the curtain over a change.
 *
 * @param label what is arriving, repeated down both panels
 * @param sub   the quiet half of each line; "" for none
 * @param commit the change itself, run under full black
 */
export async function curtain(
  label: string,
  sub: string,
  commit: CurtainCommit
): Promise<void> {
  if (!runner) {
    await commit();
    return;
  }
  await runner(label, sub, commit);
}

/** Whether a curtain is available, for callers choosing their own path. */
export const curtainReady = () => runner !== null;

/* ── THE ARRIVAL GATE ───────────────────────────────────────────────
 * A page reached through the curtain is UNDER it while it mounts, so
 * everything that reveals on arrival — a headline whose observer sees
 * it in the viewport the moment it exists — plays behind the black and
 * is finished before anyone sees it. That is the blink.
 *
 * While the gate is held, an arrival waits; when the curtain finishes
 * lifting it is released and they run in the order they asked. Held
 * only by a document that arrived covered, so nothing else on the site
 * ever waits on it.
 */
/* HELD FROM THE FLAG, NOT FROM AN EFFECT. The head script marks the
 * document before a single module runs; PressingTransition's effect
 * runs AFTER the page's own, so a headline observer registered in a
 * child could win the race and reveal behind the black. Reading the
 * flag at import closes it: by the time anything can ask, the answer
 * is already yes.
 *
 * And it opens on its own if nothing ever lifts the curtain. A page
 * that held its arrivals for good would be a page whose headlines
 * never appear, which is a worse failure than a missing animation. */
let held =
  typeof document !== "undefined" &&
  document.documentElement.classList.contains("pt-arriving");
const waiting: (() => void)[] = [];
if (held) setTimeout(() => releaseArrivals(), 5000);

export function holdArrivals(): void {
  held = true;
}

export function releaseArrivals(): void {
  held = false;
  const go = waiting.splice(0);
  for (const fn of go) fn();
}

/** Run now, or as soon as the curtain has finished lifting. */
export function afterCurtain(fn: () => void): void {
  if (held) waiting.push(fn);
  else fn();
}

/** True while a curtain covers the page, so an arrival can arm itself unseen.
 *  A page opened directly is already on the glass, and hiding it to
 *  bring it back would be the blink the gate exists to prevent. */
export const arrivalsHeld = (): boolean => held;
