import { NextResponse } from "next/server";
import {
  DAYBOOK,
  DAYBOOK_DIM,
  DAYBOOK_LEDE,
  byMonth,
  dayLabel,
  monthLabel,
} from "@/data/daybook";

/* ── THE DAYBOOK, AS DATA FOR THE BOARD ─────────────────────────────
 * The board is a static document, so its Daybook room cannot import
 * the log; it reads it from here the first time the room opens. Built
 * from src/data/daybook.ts at deploy, so the room and /daybook cannot
 * disagree: the same entries, the same accession numbers, the same
 * lede. Static, because the log only changes when the site ships.
 */
export const dynamic = "force-static";

/* a picture goes at its row's size, 96 by 72, through the optimizer:
   384 wide is a phone's 3x with room for the crop. Development serves
   images unoptimized (next.config.ts), so there the file goes as is. */
const thumb = (src: string) =>
  process.env.NODE_ENV === "production"
    ? `/_next/image?url=${encodeURIComponent(src)}&w=384&q=75`
    : src;

export function GET() {
  const total = DAYBOOK.length;
  /* the oldest entry is No. 001 and the count only grows, as on the page */
  const no = new Map(DAYBOOK.map((e, i) => [e.id, total - i]));
  return NextResponse.json({
    lede: DAYBOOK_LEDE,
    dim: DAYBOOK_DIM,
    total,
    since: monthLabel(DAYBOOK[total - 1].date),
    months: byMonth(DAYBOOK).map((m) => ({
      key: m.key,
      label: m.label,
      entries: m.entries.map((e) => ({
        id: e.id,
        day: dayLabel(e.date),
        no: no.get(e.id) ?? 0,
        project: e.project,
        title: e.title ?? null,
        body: Array.isArray(e.body) ? e.body : [e.body],
        link: e.link ?? null,
        image: e.image ? { src: thumb(e.image.src), alt: e.image.alt } : null,
      })),
    })),
  });
}
