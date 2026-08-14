import type { Metadata } from "next";
import { DaybookLedger } from "./DaybookLedger";

export const metadata: Metadata = {
  title: "Daybook",
  description:
    "What Reckon House Staples built, dated. Case studies, product work, and notes from the practice of Jeremy Prasatik.",
};

/* ── /daybook ───────────────────────────────────────────────────────
 * The running log. All rendering lives in DaybookLedger, a client
 * component (it makes the site's entrance and shows evidence on hover),
 * which still SSRs — the whole log is in the HTML for a crawler and for
 * anyone without a script. This file exists to keep the metadata export
 * on a server module, which a "use client" file cannot carry. */
export default function DaybookPage() {
  return <DaybookLedger />;
}
