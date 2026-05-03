/**
 * Test endpoint to verify Apple Music Developer Token generation.
 *
 * Hits Apple's catalog endpoint (which only requires the Developer Token,
 * not a user token). If this returns 200 with track data, the JWT signing
 * + key + Team ID + Key ID setup is all working correctly.
 *
 * Pinging "Strawberry Fields Forever" by The Beatles (a known catalog ID)
 * to keep the test deterministic.
 *
 * Visit /api/apple-music-test in the browser to run.
 */

import { NextResponse } from "next/server";
import { generateDeveloperToken, getCatalogTrack } from "@/lib/apple-music";

const TEST_TRACK_ID = "1441164708"; // Strawberry Fields Forever

export async function GET() {
  try {
    const token = await generateDeveloperToken();
    const tokenPreview = `${token.slice(0, 20)}...${token.slice(-20)}`;

    const catalogResponse = await getCatalogTrack(TEST_TRACK_ID);
    const track = catalogResponse?.data?.[0];

    return NextResponse.json({
      success: true,
      developerTokenGenerated: true,
      developerTokenPreview: tokenPreview,
      catalogReadOk: !!track,
      track: track
        ? {
            name: track.attributes?.name,
            artist: track.attributes?.artistName,
            album: track.attributes?.albumName,
          }
        : null,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
