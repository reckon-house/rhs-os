/**
 * Returns a fresh Apple Music Developer Token.
 *
 * Used client-side by /admin/connect-music to initialize MusicKit JS for the
 * one-time auth flow that captures the Music User Token.
 *
 * NOTE: The Developer Token is technically intended to be public-ish (it's
 * embedded in MusicKit JS apps anywhere in the wild), but it does grant access
 * to "personalized requests for authorized users" via the same key. Treat it
 * with reasonable care — don't log it, don't expose it on indexed pages.
 */

import { NextResponse } from "next/server";
import { generateDeveloperToken } from "@/lib/apple-music";

export async function GET() {
  try {
    const token = await generateDeveloperToken();
    return NextResponse.json({ token });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
