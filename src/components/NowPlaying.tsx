"use client";

/**
 * NowPlaying — small chip showing Jeremy's most recently played Apple Music
 * track. Polls /api/now-playing every 60 seconds. Falls back gracefully if
 * the endpoint errors or no track is available.
 *
 * Currently used at the bottom of the inspiration page. Could also live as
 * a persistent footer chip or in the dark Section 04 footer.
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

  // Don't render anything until the first fetch settles. Avoids the flash
  // of an empty card on initial paint.
  if (!loaded) return null;

  // No recent track available — render nothing rather than an empty state.
  if (!track) return null;

  return (
    <a
      href={track.appleMusicUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-3 max-w-full"
    >
      {/* Album art */}
      <div className="relative shrink-0 w-12 h-12 md:w-14 md:h-14 overflow-hidden rounded-md bg-[#141414]/[0.06]">
        {track.artworkUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.artworkUrl}
            alt={`${track.albumName} cover`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </div>

      {/* Text — single line, ellipsis if it overflows */}
      <div className="min-w-0 flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-[0.08em] text-foreground/50 font-medium">
          Last played
        </span>
        <span className="text-[13px] md:text-[14px] text-foreground font-medium truncate group-hover:underline underline-offset-2">
          {track.name}
        </span>
        <span className="text-[12px] text-foreground/60 truncate">
          {track.artistName}
        </span>
      </div>
    </a>
  );
}
