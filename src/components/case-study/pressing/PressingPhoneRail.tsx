"use client";

/* ── PressingPhoneRail ──────────────────────────────────────────────
 * The sticky section label, phones only. See the stylesheet for why it
 * exists and why it is fixed rather than sticky.
 *
 * HOW IT KNOWS WHERE YOU ARE. PressingLayout drops a zero-height marker
 * at every section-header, carrying that header's label and title. This
 * reads the markers' positions on the shared scrub tick and shows the
 * last one to have passed under the bar. No wrapper, no observer per
 * section, and nothing between the choreography and <main>.
 *
 * A marker is a <span> with height 0 and no box of its own, so it takes
 * no part in layout: the rise plates' negative margins still land on the
 * sibling they were measured against.
 */

import { useEffect, useRef, useState } from "react";
import { CHOREO_BREAKPOINT } from "@/lib/choreo";
import { onTick } from "@/lib/scrub";
import styles from "./PressingPhoneRail.module.css";

/** The attribute PressingLayout stamps on each marker. */
export const MARK_ATTR = "data-pressing-mark";

/* The authored label is one string, "SECTION 03: SCHEDULING BY CHAT".
   Split on the first colon so the numeral and the name can be set
   differently; a label with no colon is all name. */
function split(label: string): [string, string] {
  const at = label.indexOf(":");
  if (at === -1) return ["", label.trim()];
  return [label.slice(0, at).replace(/^section\s*/i, "").trim(), label.slice(at + 1).trim()];
}

export function PressingPhoneRail() {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState<{ n: string; name: string } | null>(null);

  useEffect(() => {
    if (!railRef.current) return;

    /* Re-read the markers each tick rather than caching them. The list is
       short (a study has a handful of headers), and a study whose sections
       mount late — a viz frame, a demo iframe — would otherwise pin the
       rail to a stale list. */
    let lastKey = "";

    const stop = onTick(() => {
      if (window.innerWidth > CHOREO_BREAKPOINT) {
        if (lastKey !== "") {
          lastKey = "";
          setCurrent(null);
        }
        return;
      }
      const marks = document.querySelectorAll<HTMLElement>(`[${MARK_ATTR}]`);
      if (!marks.length) return;

      /* THE LINE IS NOT THE BAR. The bar sits on the bottom edge now, and
         keying off its own box would make a section "current" the moment
         its header appeared from below — naming a thing before the reader
         has reached it. You are inside a section once its header has gone
         past you, so the line stays at the top of the reading area: the
         underside of the masthead. Measured rather than assumed, because
         --nav-h steps down at 760 and the bar is only ever shown there. */
      const nav = document.getElementById("nav");
      const line = nav ? nav.getBoundingClientRect().bottom : 54;
      let found: HTMLElement | null = null;
      for (const m of marks) {
        if (m.getBoundingClientRect().top <= line) found = m;
        else break;
      }

      /* Keyed on the LABEL, not on the marker attribute. That attribute
         is stamped empty (it is a selector hook, not a value), so every
         marker keyed to "" — which is also lastKey's initial value, so
         the guard below returned on the first tick and the bar never
         turned on once. A cheap mistake to make and a silent one: the
         logic was right and nothing threw. */
      const key = found ? `${found.dataset.label}|${found.dataset.title}` : "";
      if (key === lastKey) return;
      lastKey = key;
      if (!found) {
        setCurrent(null);
        return;
      }
      const label = found.dataset.label || "";
      const title = found.dataset.title || "";
      const [n, name] = split(label);
      /* The label is the descriptor; the title is the fallback for a
         header authored without one. Never both: two names for one
         section in a 30px bar is the mess this is meant to answer. */
      setCurrent({ n, name: name || title });
    });
    return stop;
  }, []);

  return (
    <div
      ref={railRef}
      className={styles.rail}
      /* aria-hidden: this is orientation furniture that duplicates a
         heading already in the document. A screen reader gets the real
         heading in its real place and should not hear it twice. */
      aria-hidden="true"
      {...(current ? { "data-on": "" } : {})}
    >
      {current?.n ? <span className={styles.n}>{current.n}</span> : null}
      <span className={styles.name}>{current?.name ?? ""}</span>
    </div>
  );
}
