"use client";

import { useRef, type CSSProperties } from "react";
import type { SpeedComparisonSection } from "@/lib/types";
import { useVizArrival, VIZ_STAGGER_MS } from "@/lib/viz-motion";
import { px } from "@/lib/px";
import styles from "./PressingViz.module.css";

/**
 * @shape sticks — conforms to lab/viz-system.html
 *
 * The speed chart — the pressing skin for `speed-comparison`, redrawn
 * as grounded STICKS (lab/viz-system.html §02).
 *
 * The callout is still the chart's thesis: the multiple at display
 * scale, because the number says it better than any geometry. Under it,
 * the evidence as sticks — heavy round-capped strokes off one fine
 * baseline, heights on the section's own authored relative widths. The
 * before is grey because it is the superseded state, which is exactly
 * what the system reserves grey for; the after is ink and takes the
 * pill, the one emphasis device. The per-item `color` field from the
 * classic era stays ignored: one ink is the system.
 *
 * No reading head: a before/after pair is under the series minimum,
 * and walking two rows reads as a blink. Arrival only — sticks grow
 * off the baseline on the shared curve.
 */

const W = 1100;
const H = 470;
const BASE = 390;
const PLOT = 300;
const STICK = 10;

export function PressingSpeedComparison({
  section,
}: {
  section: SpeedComparisonSection;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drawn = useVizArrival(ref);

  const items = section.items;
  const last = items.length - 1;
  const max = Math.max(...items.map((i) => i.width), 1);
  /* two sticks sit inside the middle of the measure; more spread out */
  const xAt = (i: number) =>
    items.length === 1
      ? W / 2
      : 280 + (i * (W - 560)) / Math.max(1, items.length - 1);

  return (
    <div className={styles.viz} ref={ref}>
      {section.callout ? (
        <div className={styles.head}>
          <span className={styles.lbl}>{section.title}</span>
          <span className={styles.big}>
            {section.callout}
            {section.calloutSuffix ? (
              <span
                className={styles.grey}
                style={{ fontSize: "0.32em", marginLeft: "0.5em", letterSpacing: 0 }}
              >
                {section.calloutSuffix}
              </span>
            ) : null}
          </span>
        </div>
      ) : null}

      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block" }}
        role="img"
        aria-label={items
          .map((it) => `${it.label}: ${it.value}`)
          .join(". ")}
      >
        <line
          x1={60}
          y1={BASE}
          x2={W - 60}
          y2={BASE}
          stroke="var(--pv-ink)"
          strokeWidth="var(--pv-fine)"
        />
        {items.map((it, i) => {
          const h = Math.max(10, (it.width / max) * PLOT);
          const x = px(xAt(i));
          const isDatum = i === last;
          const stroke = isDatum ? "var(--pv-ink)" : "var(--pv-grey)";
          /* the round cap extends half a stroke past each end, so the
             stick is inset to keep the drawn mass at its honest height */
          const y1 = BASE - STICK / 2;
          const y2 = BASE - h + STICK / 2;
          const len = Math.abs(y1 - y2);
          const pillW = it.label.length * 6.6 + 30;
          return (
            <g key={it.label}>
              <line
                className={styles.draw}
                x1={x}
                y1={y1}
                x2={x}
                y2={px(y2)}
                stroke={stroke}
                strokeWidth={STICK}
                strokeLinecap="round"
                strokeDasharray={px(len)}
                strokeDashoffset={drawn ? 0 : px(len)}
                style={{ "--lag": `${(i * VIZ_STAGGER_MS) / 1000}s` } as CSSProperties}
              />
              <text
                x={x}
                y={px(y2 - 26)}
                textAnchor="middle"
                fontSize={20}
                fontWeight={600}
                style={{
                  fill: stroke,
                  letterSpacing: "-0.01em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {it.value}
              </text>
              {isDatum ? (
                <g
                  className={`${styles.fade} ${drawn ? styles.fadeIn : ""}`}
                  style={{ "--lag": "0.7s" } as CSSProperties}
                >
                  <rect
                    x={px(xAt(i) - pillW / 2)}
                    y={BASE + 18}
                    rx={10}
                    width={px(pillW)}
                    height={20}
                    fill="var(--pv-ink)"
                  />
                  <text
                    x={x}
                    y={BASE + 32}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight={600}
                    letterSpacing="0.06em"
                    fill="var(--pp-paper)"
                  >
                    {it.label.toUpperCase()}
                  </text>
                </g>
              ) : (
                <text
                  x={x}
                  y={BASE + 32}
                  textAnchor="middle"
                  className={styles.lbl}
                  style={{ fill: "var(--pv-grey)" }}
                >
                  {it.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
