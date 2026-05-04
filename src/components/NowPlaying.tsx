"use client";

/**
 * NowPlaying — 1×1 album-art tile showing Jeremy's most recently played
 * Apple Music track. Drops into masonry grids alongside inspiration
 * imagery so it reads as just another shelf item, not a chrome chip.
 *
 * Polls /api/now-playing every 60 seconds. Renders nothing until the
 * first fetch settles or if no track is available — keeps the layout
 * from flashing an empty state.
 */

import { useEffect, useState } from "react";

type Track = {
  name: string;
  artistName: string;
  albumName: string;
  artworkUrl: string;
  appleMusicUrl: string;
  durationMs: number;
  trackId: string;
};

const POLL_INTERVAL_MS = 60_000;

export function NowPlaying() {
  const [track, setTrack] = useState<Track | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchNow = async () => {
      try {
        const res = await fetch("/api/now-playing");
        if (!res.ok) {
          if (!cancelled) setLoaded(true);
          return;
        }
        const data = (await res.json()) as { track: Track | null };
        if (!cancelled) {
          setTrack(data.track);
          setLoaded(true);
        }
      } catch {
        if (!cancelled) setLoaded(true);
      }
    };

    fetchNow();
    const interval = setInterval(fetchNow, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Don't render anything until the first fetch settles.
  if (!loaded) return null;

  // No recent track available — render nothing rather than an empty state.
  if (!track) return null;

  return (
    <a
      href={track.appleMusicUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block w-full aspect-square overflow-hidden bg-[#141414]/[0.06]"
      style={{ borderRadius: "clamp(18px, 3.5vw, 36px)" }}
    >
      {/* Album art — fills the square */}
      {track.artworkUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={track.artworkUrl}
          alt={`${track.albumName} cover`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      )}

      {/* Gradient scrim — only over the bottom third for text legibility,
          keeps most of the album art clean. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Text overlay — bottom left */}
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-white">
        <div className="text-[9px] md:text-[10px] uppercase tracking-[0.1em] font-medium opacity-70 mb-1">
          Last played
        </div>
        <div className="text-[13px] md:text-[14px] font-medium leading-tight truncate group-hover:underline underline-offset-2">
          {track.name}
        </div>
        <div className="text-[11px] md:text-[12px] opacity-80 leading-tight truncate mt-0.5">
          {track.artistName}
        </div>
      </div>
    </a>
  );
}
