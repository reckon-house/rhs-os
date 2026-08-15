"use client";

/**
 * PressingContact — the contact beat of the Pressing C footer, ported from
 * the first `.mt-beat` section inside the `.fx-mast` block of
 * public/lab/swiss-spread.html.
 *
 * It is the prototype's pinned-brief pattern on ink: a section-mark row, a
 * two-line masked headline held sticky in track 1, and a column in track 2
 * that travels up beside it carrying a four-way ledger (Contact, Services,
 * Practice, News) and a mailto form. CSS does the pinning — the headline and
 * the column share grid row 2, so the sticky's containing block bottom IS the
 * column's bottom and the release needs no computed threshold.
 *
 * What this component computes is placement, and there are two numbers:
 *
 *   1. The column's start offset. It has to be MEASURED because the headline
 *      rewraps across breakpoints, and it is measured from the ROW rather
 *      than the section — both items start at the same row edge, so the drop
 *      is exactly the headline's own margin plus its height plus GAP.
 *      Measuring against the section instead folds in the label row and the
 *      sticky displacement, which is how the prototype got gaps anywhere
 *      from 39px to 221px against a 34px target.
 *
 *   2. The section's bottom padding, which is the footer beat's own trick:
 *
 *        paddingBottom = viewport - stickyTopOffset - headlineHeight
 *
 *      A sticky headline releases at its containing block's bottom, and
 *      measured that is the section's CONTENT box — not its grid row and not
 *      its border box. So one number decides two things at once: where the
 *      pin lets go, and how much taller than its content the section runs.
 *      At this value the content box ends exactly at the column's bottom (the
 *      release lands on the frame the two bottoms meet) and the border box
 *      ends one viewport later (the section's bottom edge reaches the fold on
 *      that same frame), so whatever follows never starts climbing over a
 *      column still being read. Setting a height instead only moves the
 *      second one, and the pin then holds hundreds of pixels past the copy.
 *
 * Both are re-measured on resize, once fonts settle, and once more on a late
 * timeout — the prototype's own settle passes, kept because the reveal masks
 * only net to zero layout after everything has landed. This is layout, not
 * motion, so it runs under prefers-reduced-motion too.
 *
 * The scroll rules: nothing here subscribes to a scroll event. `vh()` is the
 * shared driver's viewport read (never CSS 100vh, never window scroll), the
 * resize listener reacts to geometry rather than position, and the entrance
 * systems trigger off viewport IntersectionObservers — safe even though the
 * page scrolls inside <main>, because main spans the whole viewport and the
 * two intersection tests are the same. The one per-frame subscriber on this
 * screen is SectionMark's, which it owns.
 *
 * Wrapper discipline: the section is the sticky's scroll ancestor chain up to
 * <main>, so nothing between them may transform, filter, or clip. Do not add
 * overflow: hidden to this box or to anything you wrap it in.
 *
 * Below 760px the pin is off, the two tracks stack, and both measured values
 * are cleared so the stylesheet owns the spacing.
 */

import { useEffect, useId, useLayoutEffect, useRef } from "react";
import { DAYBOOK } from "@/data/daybook";
import { RevealHeadline } from "@/components/fx/RevealHeadline";
import { BodyReveal } from "@/components/fx/BodyReveal";
import { SectionMark } from "@/components/fx/SectionMark";
import { vh } from "@/lib/scrub";
import styles from "./PressingContact.module.css";

/** px between the headline's last line and the column's first (prototype GAP). */
const GAP = 34;

/**
 * Below this width the pin is off and the measured values are meaningless.
 * Inclusive, matching the prototype's `innerWidth <= 760` and
 * CHOREO_BREAKPOINT in src/lib/choreo.ts. The stylesheet's phone block cuts
 * at the same number — if the two ever disagree, there is a band of widths
 * where the stacked layout gets handed a desktop drop.
 */
const PIN_OFF_AT = 760;

/* The placement pass writes styles the first paint should already have, so it
   runs pre-paint on the client; the guard keeps SSR from warning. */
const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/* Site chrome, not content: this copy is the same on every page, so it is
   hardcoded here rather than threaded through props. */
/* The site's own pages. They used to live in the masthead's centre
   links, which the question field took over: Work was always just the
   homepage, which the wordmark reaches, but Info and Staples had no
   other door and would have been orphaned. The footer is on every
   route and has room to name them, which is a better home for them
   than a bar with three words in it. */
const PAGES = [
  { label: "Work", href: "/", external: false },
  { label: "Info", href: "/info", external: false },
  { label: "Staples", href: "/inspiration", external: false },
];
const CONTACT = [
  { label: "Email", href: "mailto:hello@reckon.house", external: false },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jeremy-prasatik",
    external: true,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/reckonhousestaples",
    external: true,
  },
];
const SERVICES = ["Art Direction", "Brand Systems", "Digital Design", "Interiors"];
const PRACTICE = ["Independent, Texas", "Design and build", "I love the work"];
/* News is the daybook, not a second list. The footer already renders the
   daybook strip below this, and the rail's "Recently" carries the same
   three lines as this column did — so a reader met the identical items
   twice within a screen. The column now names the newest three entries,
   which means it changes when the daybook does and never goes stale on
   its own. Titled entries use their title; the rest their first clause. */
const NEWS = DAYBOOK.slice(0, 3).map((e) => {
  if (e.title) return e.title;
  const first = Array.isArray(e.body) ? e.body[0] : e.body;
  return first.split(/[.:]/)[0].trim();
});

/** A ledger column of LINKS. The reveal rides inside the anchor for the
 *  same reason it does in the contact column: the splitter flattens
 *  inline markup to text, so a link wrapped in a BodyReveal comes back
 *  as a plain word with its href gone. */
function LinkColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string; external: boolean }[];
}) {
  return (
    <div>
      <BodyReveal as="h4" className={styles.colHead}>
        {title}
      </BodyReveal>
      <ul className={styles.list}>
        {items.map((c) => (
          <li key={c.label}>
            <a
              className={styles.link}
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noreferrer noopener" : undefined}
            >
              <BodyReveal as="span">{c.label}</BodyReveal>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A ledger column: a dimmed heading over a set of dim items. Every item is
 *  its own BodyReveal, which is what makes the fourteen rows cascade on a
 *  short beat instead of arriving as one block. */
function LedgerColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <BodyReveal as="h4" className={styles.colHead}>
        {title}
      </BodyReveal>
      <ul className={styles.list}>
        {items.map((item) => (
          <BodyReveal key={item} as="li" className={styles.dim}>
            {item}
          </BodyReveal>
        ))}
      </ul>
    </div>
  );
}

export interface PressingContactProps {
  /** Optional extra class on the section, for a parent that needs a hook. */
  className?: string;
}

export function PressingContact({ className }: PressingContactProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const colRef = useRef<HTMLDivElement | null>(null);
  // Field ids have to be stable across server and client for htmlFor to hold
  // through hydration, and unique in case this beat is ever rendered twice.
  const uid = useId();

  useIsoLayoutEffect(() => {
    const sec = sectionRef.current;
    const col = colRef.current;
    if (!sec || !col) return;
    // RevealHeadline renders the tag itself, so the headline is reached the
    // way the prototype reached it: the section's own h2.
    const h2 = sec.querySelector("h2") as HTMLElement | null;
    if (!h2) return;

    const place = () => {
      // Phones stack the two in separate rows. The measured drop is
      // meaningless there, and a beat sized to hold a pin that is switched
      // off is just a screen of empty ink.
      if (window.innerWidth <= PIN_OFF_AT) {
        col.style.marginTop = "";
        sec.style.paddingBottom = "";
        return;
      }

      // Cleared before measuring: the column and the headline share a grid
      // row, so a stale margin inflates the row and the reading compounds on
      // every resize.
      col.style.marginTop = "0px";
      const drop =
        parseFloat(getComputedStyle(h2).marginTop) + h2.offsetHeight + GAP;
      col.style.marginTop = Math.max(0, Math.round(drop)) + "px";

      // The footer beat's placement. `top` on a sticky element computes to
      // the used pixel value, so this reads the resolved calc() rather than
      // duplicating it here — change the offset in the stylesheet and this
      // follows. vh() is window.innerHeight: the shell is h-dvh, and a CSS
      // 100vh would overshoot by the mobile browser-chrome delta.
      const pin = parseFloat(getComputedStyle(h2).top) || 0;
      const pad = Math.max(0, Math.round(vh() - pin - h2.offsetHeight));
      sec.style.paddingBottom = pad + "px";
    };

    place();
    // A window resize listener, deliberately: this reacts to geometry, not to
    // scroll position, so the Lenis-owns-main rule is not in play.
    window.addEventListener("resize", place);
    /* The settle pass the credits beat always had — the review caught this
       copy missing it. The observer covers whatever resize and fonts.ready
       miss (late layout shifts, engines that reflow without a resize). */
    const ro = new ResizeObserver(place);
    const h2El = sec.querySelector("h2");
    if (h2El) ro.observe(h2El);
    // Satoshi (or Helvetica inside a pressing article) lands after first
    // paint and moves the headline's wrap points; the late timeout is the
    // prototype's own settle pass.
    let alive = true;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (alive) place();
      });
    }
    const t = window.setTimeout(place, 300);

    return () => {
      alive = false;
      window.removeEventListener("resize", place);
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      /* hero-breakout because the beat is full-bleed ink while <main> carries
         md:px-[50px] gutters. It is idempotent: nested inside a parent that
         is already 100vw, `calc(-50vw + 50%)` resolves to 0, so a future
         footer wrapper can carry it too without doubling the pull.
         data-nav-dark is what the sticky masthead watches to invert its ink
         over this ground; the driver queries the attribute fresh on every
         check, so nothing needs registering. */
      data-nav-dark
      className={["hero-breakout", styles.beat, className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.markRow}>
        {/* No scrollRef: the section itself scrolls normally — only the
            headline is sticky — so the mark's own position on screen is a
            real signal and can drive its sweep. `dark` because the disc runs
            paper-on-ink here. */}
        {/* R, not a number. The tail is the same on every route, so a
            numeral here claimed a place in a sequence it was never in:
            "07" made sense on the one study that happened to have six
            sections before it and nowhere else. The two beats carry
            the house's initials instead — R here, H on credits — which
            is true on the homepage and on all thirty studies. */}
        <SectionMark n="R" name="Contact" dark />
      </div>

      {/* "\n" is RevealHeadline's authored line break: each line gets its own
          overflow-hidden mask, which is exactly what the prototype's two
          .rln spans were. */}
      <RevealHeadline as="h2" className={styles.headline}>
        {"Have a project\nin mind?"}
      </RevealHeadline>

      <div ref={colRef} className={styles.col}>
        <div className={styles.cols}>
          <div>
            <BodyReveal as="h4" className={styles.colHead}>
              Contact
            </BodyReveal>
            <ul className={styles.list}>
              {CONTACT.map((c) => (
                <li key={c.label}>
                  {/* The reveal rides INSIDE the anchor, not around it. The
                      split flattens inline markup to text, so a link wrapped
                      in a BodyReveal comes back as a plain word with its href
                      gone — which is what happens in the prototype, where the
                      splitter claimed the whole <li> and quietly ate these
                      three mailto/profile links. */}
                  <a
                    className={styles.link}
                    href={c.href}
                    target={c.external ? "_blank" : undefined}
                    rel={c.external ? "noreferrer noopener" : undefined}
                  >
                    <BodyReveal as="span">{c.label}</BodyReveal>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <LinkColumn title="Pages" items={PAGES} />
          <LedgerColumn title="Services" items={SERVICES} />
          <LedgerColumn title="Practice" items={PRACTICE} />
          <LedgerColumn title="News" items={NEWS} />
        </div>

        {/* A real mailto form, exactly as the prototype ships it: the browser
            hands it to the user's mail client, there is no endpoint and no
            fetch behind it. The note under the button is the fallback for
            anyone whose browser declines to open one. */}
        <form
          className={styles.form}
          action="mailto:hello@reckon.house"
          method="post"
          encType="text/plain"
        >
          <span className={styles.field}>
            {/* The label keeps htmlFor and the reveal sits inside it — same
                reason as the links above: BodyReveal takes no arbitrary
                props, and wrapping the label would drop the association. */}
            <label className={styles.fieldLabel} htmlFor={`${uid}-name`}>
              <BodyReveal as="span">Name</BodyReveal>
            </label>
            <input
              className={styles.input}
              id={`${uid}-name`}
              name="name"
              type="text"
              autoComplete="name"
            />
          </span>

          <span className={styles.field}>
            <label className={styles.fieldLabel} htmlFor={`${uid}-email`}>
              <BodyReveal as="span">Email</BodyReveal>
            </label>
            <input
              className={styles.input}
              id={`${uid}-email`}
              name="email"
              type="email"
              autoComplete="email"
            />
          </span>

          <span className={styles.field}>
            <label className={styles.fieldLabel} htmlFor={`${uid}-message`}>
              <BodyReveal as="span">Project</BodyReveal>
            </label>
            <textarea
              className={styles.textarea}
              id={`${uid}-message`}
              name="message"
              rows={2}
            />
          </span>

          <button className={styles.send} type="submit">
            Send
          </button>

          <BodyReveal as="span" className={styles.note}>
            Or just email · hello@reckon.house
          </BodyReveal>
        </form>
      </div>
    </section>
  );
}
