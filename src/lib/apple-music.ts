/**
 * Apple Music API helpers.
 *
 * Two tokens are involved:
 *
 *   1. Developer Token (JWT) — signs as the Apple Developer account. Generated
 *      server-side from the .p8 private key. Required for every API call.
 *      Max lifetime: 6 months.
 *
 *   2. Music User Token — per-user, authorizes "personalized requests" like
 *      reading recently-played. Captured once via MusicKit JS auth flow on
 *      /admin/connect-music, then stored in env. Lasts ~6 months before
 *      requiring re-auth.
 *
 * Env vars expected:
 *   APPLE_TEAM_ID                  — 10-char Team ID (top-right of dev portal)
 *   APPLE_MUSICKIT_KEY_ID          — 10-char Key ID (from the Keys page)
 *   APPLE_MUSICKIT_PRIVATE_KEY     — full PEM contents of the .p8 file
 *   APPLE_MUSIC_USER_TOKEN         — captured after admin auth (optional for
 *                                    catalog-only calls)
 */

import { SignJWT, importPKCS8 } from "jose";

const APPLE_MUSIC_API = "https://api.music.apple.com";

// Cache the developer token in module scope so we don't re-sign on every call.
// Tokens are valid for 6 months; we'll refresh after ~150 days as a safety margin.
let cachedDeveloperToken: { token: string; expiresAt: number } | null = null;
const TOKEN_LIFETIME_SECONDS = 60 * 60 * 24 * 150; // 150 days
const TOKEN_REFRESH_THRESHOLD_MS = 60 * 60 * 24 * 1000; // refresh 1 day before expiry

export async function generateDeveloperToken(): Promise<string> {
  // Return cached token if still valid (with 1-day safety margin)
  if (
    cachedDeveloperToken &&
    cachedDeveloperToken.expiresAt - Date.now() > TOKEN_REFRESH_THRESHOLD_MS
  ) {
    return cachedDeveloperToken.token;
  }

  const teamId = process.env.APPLE_TEAM_ID;
  const keyId = process.env.APPLE_MUSICKIT_KEY_ID;
  const privateKeyPem = process.env.APPLE_MUSICKIT_PRIVATE_KEY;

  if (!teamId || !keyId || !privateKeyPem) {
    throw new Error(
      "Missing Apple Music credentials. Required env: APPLE_TEAM_ID, APPLE_MUSICKIT_KEY_ID, APPLE_MUSICKIT_PRIVATE_KEY"
    );
  }

  // Import the PEM-encoded ES256 private key
  const privateKey = await importPKCS8(privateKeyPem, "ES256");

  // Apple expects header { alg: 'ES256', kid: KEY_ID } and payload
  // { iss: TEAM_ID, iat: now, exp: now + maxLifetime }
  const nowSeconds = Math.floor(Date.now() / 1000);
  const expiresAtSeconds = nowSeconds + TOKEN_LIFETIME_SECONDS;

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: keyId })
    .setIssuer(teamId)
    .setIssuedAt(nowSeconds)
    .setExpirationTime(expiresAtSeconds)
    .sign(privateKey);

  cachedDeveloperToken = {
    token,
    expiresAt: expiresAtSeconds * 1000,
  };

  return token;
}

/**
 * Reset the cached developer token. Useful after rotating the .p8 key.
 */
export function clearDeveloperTokenCache() {
  cachedDeveloperToken = null;
}

// ── Catalog ─────────────────────────────────────────────────────────────────
// Catalog endpoints only need the Developer Token. Useful for verifying the
// JWT works end-to-end before getting the Music User Token.

export async function getCatalogTrack(trackId: string, storefront = "us") {
  const developerToken = await generateDeveloperToken();
  const url = `${APPLE_MUSIC_API}/v1/catalog/${storefront}/songs/${trackId}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${developerToken}` },
    // No need to cache catalog data aggressively — but a short cache is fine.
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Apple Music catalog request failed (${res.status}): ${body}`);
  }

  return res.json();
}

// ── Recently Played ────────────────────────────────────────────────────────
// Requires both Developer Token AND Music User Token.

export type RecentTrack = {
  name: string;
  artistName: string;
  albumName: string;
  artworkUrl: string; // already-templated URL at 600x600
  appleMusicUrl: string;
  durationMs: number;
  trackId: string;
};

export async function getRecentlyPlayedTrack(): Promise<RecentTrack | null> {
  const developerToken = await generateDeveloperToken();
  const musicUserToken = process.env.APPLE_MUSIC_USER_TOKEN;

  if (!musicUserToken) {
    throw new Error(
      "Missing APPLE_MUSIC_USER_TOKEN. Visit /admin/connect-music to capture it."
    );
  }

  const url = `${APPLE_MUSIC_API}/v1/me/recent/played/tracks?limit=1`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${developerToken}`,
      "Music-User-Token": musicUserToken,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Apple Music recent request failed (${res.status}): ${body}`);
  }

  const json = (await res.json()) as {
    data?: Array<{
      id: string;
      attributes?: {
        name?: string;
        artistName?: string;
        albumName?: string;
        url?: string;
        durationInMillis?: number;
        artwork?: { url?: string; width?: number; height?: number };
      };
    }>;
  };

  const first = json.data?.[0];
  if (!first?.attributes) return null;

  const a = first.attributes;
  // Artwork URL is templated with {w} and {h} placeholders. Resolve to 600x600.
  const artwork = a.artwork?.url ?? "";
  const artworkUrl = artwork.replace("{w}", "600").replace("{h}", "600");

  return {
    name: a.name ?? "",
    artistName: a.artistName ?? "",
    albumName: a.albumName ?? "",
    artworkUrl,
    appleMusicUrl: a.url ?? "",
    durationMs: a.durationInMillis ?? 0,
    trackId: first.id,
  };
}
