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
