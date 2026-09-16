import type { Metadata } from "next";
import { availability } from "@/lib/booking";
import { BookBoard } from "./BookBoard";

export const metadata: Metadata = {
  title: "Book a call",
  description:
    "Thirty minutes with Jeremy Prasatik. Pick a time and tell me what you're working on.",
};

/* Availability is read per request, not baked: a slot claimed a minute
   ago has to be gone, and a statically rendered calendar is a calendar
   that lies as soon as anyone uses it. */
export const dynamic = "force-dynamic";

/* ── /book ──────────────────────────────────────────────────────────
 * Its own route rather than a block in a footer, for two reasons that
 * still hold: a calendar is a committal act that deserves the room,
 * and a URL is half of what a scheduling product is for, so this one
 * can be sent to somebody directly. What changed in September 2026 is
 * the clothes: the page is columns on the board's glass now, and the
 * week in it is the same component the board's Connect room and
 * /custom's last column use. Rendering lives in BookBoard; the grid
 * is computed here on the server, so the week is readable without a
 * script and the client only adds the ability to claim one.
 */
export default async function BookPage() {
  const days = await availability();
  return <BookBoard days={days} />;
}
