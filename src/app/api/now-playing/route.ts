/**
 * Returns the most recent track played on Jeremy's Apple Music account.
 *
 * Apple Music's API doesn't expose "currently playing" — only "recently played"
 * via cloud sync. So this is technically "last played" with a small delay,
 * but covers ALL devices (HomePod, car, phone, Mac, web).
 *
 * Cached for 60 seconds via Next.js ISR so we don't hammer Apple's API on
 * every page view. Music doesn't change faster than that anyway.
 */

import { NextResponse } from "next/server";
import { getRecentlyPlayedTrack } from "@/lib/apple-music";

export const revalidate = 60;

export async function GET() {
  try {
    const track = await getRecentlyPlayedTrack();
    return NextResponse.json({ track });
  } catch (err) {
    return NextResponse.json(
      {
        track: null,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
