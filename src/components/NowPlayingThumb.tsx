"use client";

/**
 * NowPlayingThumb — easter egg for the homepage project grid.
 *
 * Renders as a regular Thumb when no recent track is available (using the
 * provided fallback project), so the grid never has a blank slot. When a
 * recent track is detected, swaps to show:
 *   - Album art as the image
 *   - Song name as the title
 *   - Artist as the category
 *   - Click-through to the Apple Music URL (opens in new tab)
 *
 * Visually identical to Thumb so it integrates seamlessly. Polls
 * /api/now-playing every 60 seconds.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Project } from "@/data/projects";

type Track = {
  name: string;
  artistName: string;
  albumName: string;
  artworkUrl: string;
  appleMusicUrl: string;
};

const POLL_INTERVAL_MS = 60_000;

export function NowPlayingThumb({ fallback }: { fallback: Project }) {
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchNow = async () => {
      try {
        const res = await fetch("/api/now-playing");
        if (!res.ok) return;
        const data = (await res.json()) as { track: Track | null };
        if (!cancelled) setTrack(data.track);
      } catch {
        /* swallow — fallback project just keeps showing */
      }
    };

    fetchNow();
    const interval = setInterval(fetchNow, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Resolve display values — track when present, fallback project otherwise.
  const image = track?.artworkUrl || fallback.image;
  const title = track?.name || fallback.title;
  const category = track?.artistName || fallback.category;
  const href = track?.appleMusicUrl || fallback.href;
  const isExternal = !!track;

  const inner = (
    <div className="w-[130px] md:w-[160px]">
      {/* Album art / project image */}
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          className="w-full aspect-square object-cover rounded-[23%]"
        />

        {/* Now-playing dot — only shows when a real track is loaded.
            Pulsing red dot in the top-right corner of the album art so
            it reads at a glance as "live / now playing" without
            obscuring the artwork. */}
        {track && (
          <span
            aria-hidden
            className="absolute top-2 right-2 flex items-center justify-center"
          >
            <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-[#ff3b30] opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff3b30]" />
          </span>
        )}
      </div>

      {/* Title row — when a track is playing, prefix with a small muted
          "Playing:" so the easter egg is self-explanatory. Otherwise
          just the plain project title. */}
      <div className="text-center mt-2 md:mt-3">
        <p className="text-[10px] font-medium leading-[14px]">
          {track && (
            <span className="text-foreground/45 font-normal italic">Playing: </span>
          )}
          {title}
        </p>
        <p className="text-[10px] leading-[14px] text-foreground/50">{category}</p>
      </div>
    </div>
  );

  if (!href) {
    return <div className="hp-thumb group cursor-default">{inner}</div>;
  }

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="hp-thumb group block"
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className="hp-thumb group block">
      {inner}
    </Link>
  );
}
