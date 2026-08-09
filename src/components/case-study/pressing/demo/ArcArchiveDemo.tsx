"use client";

/**
 * ArcArchiveDemo — the product, running, inside the case study.
 *
 * The study's claim is a mechanic: every item you document adds to a
 * running total, that total is compared against your policy limit, and
 * the shortfall shows up as a dollar amount before a disaster reveals
 * it. Everything else on the page ASSERTS that. This lets the reader do
 * it — change a value, delete a thing, watch the gap move.
 *
 * Tier 2 of three, deliberately. Tier 1 is the real component fed fixed
 * props (a screenshot that happens to be live). Tier 3 wires the real
 * vision endpoint, which on a public portfolio means keys within reach
 * of a browser and a per-view bill for anyone who finds it. This is the
 * middle: A.R.C.'s real ItemCard and the real aggregation, all in local
 * state. No server, no keys, nothing to rate limit, nothing to break at
 * 3am.
 *
 * ON THE NUMBERS. The items carry the study's own documented figures —
 * the per-category averages from its classification data and the
 * $38,000 policy limit from its coverage chart. Nothing here is invented
 * to make the demo land better, which matters more than usual: a made-up
 * number inside a working interface reads as a real one.
 *
 * The reset exists because a reader WILL delete everything, and an empty
 * archive with no way back is a dead end in the middle of a case study.
 */

import { useCallback, useMemo, useState } from "react";
import ItemCard, { type DemoItem } from "./ItemCard";
import styles from "./demo.module.css";

/** The policy limit from the study's coverage chart. Real. */
const POLICY_LIMIT = 38000;

const IMG = "/case-studies/arc";

/* Values are the study's documented per-category averages. The
   thumbnails are its own photography, drawn at 96px where a 388px file
   is comfortably sharp. */
const SEED: DemoItem[] = [
  {
    id: 1,
    name: "Sectional sofa",
    category: "Furniture",
    estimatedValue: 680,
    imageUrl: `${IMG}/arc-app-living-room-furniture-selection.jpg`,
    documentCount: 2,
  },
  {
    id: 2,
    name: "Wall-mounted television",
    category: "Electronics",
    estimatedValue: 425,
    imageUrl: `${IMG}/arc-pipeline-ai-categorization-step.jpg`,
  },
  {
    id: 3,
    name: "Framed print, above mantel",
    category: "Artwork",
    estimatedValue: 580,
    imageUrl: `${IMG}/arc-pipeline-photo-capture-step.jpg`,
    documentCount: 1,
  },
  {
    id: 4,
    name: "Range and hood",
    category: "Appliances",
    estimatedValue: 890,
    imageUrl: `${IMG}/arc-pipeline-cloud-sync-step.jpg`,
  },
  {
    id: 5,
    name: "Turntable and records",
    category: "Collectibles",
    estimatedValue: 695,
    imageUrl: `${IMG}/arc-room-scanning-interface.jpg`,
    documentCount: 3,
  },
];

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export function ArcArchiveDemo() {
  const [items, setItems] = useState<DemoItem[]>(SEED);
  const [editing, setEditing] = useState<DemoItem | null>(null);

  /* The mechanic, in one line. This is the whole argument of section 08
     and it is four operations of arithmetic — which is rather the point:
     the hard part was never the sum, it was ever having the inventory to
     sum in the first place. */
  const total = useMemo(
    () => items.reduce((sum, it) => sum + (it.estimatedValue || 0), 0),
    [items]
  );
  const gap = POLICY_LIMIT - total;

  const onDelete = useCallback((id: number) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setEditing((cur) => (cur && cur.id === id ? null : cur));
  }, []);

  const onEdit = useCallback((item: DemoItem) => {
    setEditing((cur) => (cur && cur.id === item.id ? null : item));
  }, []);

  const patch = useCallback((id: number, next: Partial<DemoItem>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...next } : it)));
    setEditing((cur) => (cur && cur.id === id ? { ...cur, ...next } : cur));
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <span className={styles.lbl}>Living room · running total</span>
        <button
          type="button"
          className={styles.reset}
          onClick={() => {
            setItems(SEED);
            setEditing(null);
          }}
        >
          Reset
        </button>
      </div>

      {/* The ledger the study describes. Documented value against the
          policy limit, and the number in between. */}
      <div className={styles.ledger}>
        <div>
          <div className={styles.big}>{usd(total)}</div>
          <div className={styles.lbl}>Documented · {items.length} items</div>
        </div>
        <div>
          <div className={`${styles.big} ${styles.quiet}`}>{usd(POLICY_LIMIT)}</div>
          <div className={styles.lbl}>Policy limit</div>
        </div>
        <div>
          <div className={`${styles.big} ${gap < 0 ? styles.over : ""}`}>
            {gap < 0 ? usd(Math.abs(gap)) : usd(gap)}
          </div>
          <div className={styles.lbl}>
            {gap < 0 ? "Over the limit" : "Headroom left"}
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {items.map((item) => (
          <div key={item.id} className={styles.slot}>
            <ItemCard
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              className={styles.card}
            />
            {editing && editing.id === item.id ? (
              <div className={styles.editor}>
                <label className={styles.field}>
                  <span className={styles.lbl}>Item</span>
                  <input
                    className={styles.input}
                    value={item.name}
                    onChange={(e) => patch(item.id, { name: e.target.value })}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.lbl}>Estimated value</span>
                  <input
                    className={styles.input}
                    inputMode="numeric"
                    value={item.estimatedValue ?? 0}
                    onChange={(e) =>
                      patch(item.id, {
                        estimatedValue: Number(e.target.value.replace(/[^\d]/g, "")) || 0,
                      })
                    }
                  />
                </label>
                <input
                  className={styles.range}
                  type="range"
                  min={0}
                  max={12000}
                  step={5}
                  value={item.estimatedValue ?? 0}
                  aria-label={`${item.name} estimated value`}
                  onChange={(e) => patch(item.id, { estimatedValue: Number(e.target.value) })}
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {items.length === 0 ? (
        <p className={styles.empty}>
          Nothing documented. That is the state most homes are in.
        </p>
      ) : null}

      <p className={styles.foot}>
        A.R.C.&apos;s own <code>ItemCard</code>, running here. Tap a card to
        edit it. Values are the study&apos;s documented per-category
        averages; the policy limit is its real one.
      </p>
    </div>
  );
}

export default ArcArchiveDemo;
