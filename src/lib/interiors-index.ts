/**
 * The interiors system index, as the site reads it.
 *
 * Written by scripts/build-interiors-index.mjs from two sources the
 * studies already hold: each study's own authored `summary` Materials
 * line, and image-vision.json's observed texture readings. This module
 * is only the typed door onto that file, so a component never reaches
 * into generated JSON and guesses at its shape.
 *
 * A slug with no entry returns undefined and its section renders
 * nothing. That is the intended behaviour rather than a gap to paper
 * over: the chart this replaces shipped 49 hand-typed hex values under a
 * header reading "as specified", and the cheapest guard against a repeat
 * is that missing data can only ever produce less on the page, never
 * something invented to fill it.
 */
import raw from "@/data/generated/interiors-index.json";

/** One cycling frame: a photograph and what it is evidence for. */
export interface InteriorsRow {
  src: string;
  /** the material's authored name (Materials row) */
  name?: string;
  /** the observed texture reading, verbatim (Texture row) */
  cap?: string;
  /** how far to crop in. Capped by the generator against native width. */
  zoom?: number;
  /** where to crop. Centre until a human moves it. */
  at?: string;
  /** the source's native pixel width, kept so the cap can be checked */
  native?: number;
}

export interface InteriorsIndexEntry {
  title: string;
  dir: string;
  materials: InteriorsRow[];
  textures: InteriorsRow[];
  palette: { name: string; hex: string }[];
}

/* Through `unknown`: the generated file is a literal type with a
   different key set per study, and TypeScript will not narrow it to the
   interface directly. The runtime shape is guaranteed by the generator,
   which is the actual contract. */
const INDEX = raw as unknown as Record<string, InteriorsIndexEntry>;

export function interiorsIndexFor(slug: string): InteriorsIndexEntry | undefined {
  return INDEX[slug];
}

export function hasInteriorsIndex(slug: string): boolean {
  return Boolean(INDEX[slug]);
}
