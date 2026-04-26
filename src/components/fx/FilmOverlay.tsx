"use client";

/**
 * FilmOverlay — subtle grain + vignette for a vintage photographic feel.
 *
 * Exports:
 *   - <FilmOverlay />          — the fixed grain + vignette layer. Put in root layout.
 *   - <FilmOverlayControls />  — inline control panel. Drop anywhere in page content.
 *
 * Both components share state through localStorage + a custom event.
 * Copy values with the button once you're happy, paste into DEFAULTS, and delete
 * the <FilmOverlayControls /> from the page to ship.
 */

import { useCallback, useEffect, useState } from "react";

type BlendMode = "overlay" | "soft-light" | "multiply" | "screen" | "normal";

interface Settings {
  grainOpacity: number;
  grainSize: number;
  grainFrequency: number;
  grainContrast: number;
  grainBlend: BlendMode;
  vignetteInnerStop: number;
  vignetteDark: number;
  gridEnabled: boolean;
  gridMinorSize: number;       // px between minor lines
  gridMajorEvery: number;      // major line every N minor cells
  gridColor: string;           // hex (e.g. "#6FA8DC")
  gridStrength: number;        // 0–1, drives major-line opacity
  gridMinorRatio: number;      // 0–1, minor-line opacity = gridStrength * gridMinorRatio
}

const DEFAULTS: Settings = {
  grainOpacity: 0.63,
  grainSize: 170,
  grainFrequency: 0.4,
  grainContrast: 2.2,
  grainBlend: "overlay",
  vignetteInnerStop: 20,
  vignetteDark: 0,
  gridEnabled: true,
  gridMinorSize: 8,
  gridMajorEvery: 10,
  gridColor: "#dbc6ae",
  gridStrength: 0.11,
  gridMinorRatio: 0.64,
};

const STORAGE_KEY = "rhs-film-overlay";
const CHANGE_EVENT = "rhs-film-overlay-change";

function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function saveSettings(s: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent<Settings>(CHANGE_EVENT, { detail: s }));
}

function useSharedSettings(): [Settings, (s: Settings) => void, boolean] {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    setHydrated(true);
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<Settings>).detail;
      if (detail) setSettings(detail);
    };
    window.addEventListener(CHANGE_EVENT, handler);
    return () => window.removeEventListener(CHANGE_EVENT, handler);
  }, []);

  const update = useCallback((next: Settings) => {
    setSettings(next);
    saveSettings(next);
  }, []);

  return [settings, update, hydrated];
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildGridStyle(s: Settings): React.CSSProperties {
  if (!s.gridEnabled) return { display: "none" };
  const minorAlpha = s.gridStrength * s.gridMinorRatio;
  const majorAlpha = s.gridStrength;
  const minor = hexToRgba(s.gridColor, minorAlpha);
  const major = hexToRgba(s.gridColor, majorAlpha);
  const minorSize = s.gridMinorSize;
  const majorSize = s.gridMinorSize * s.gridMajorEvery;
  return {
    backgroundImage: [
      // Major lines (drawn first so minor lines layer on top, but bigger size sits visually heavier)
      `linear-gradient(to right, ${major} 1px, transparent 1px)`,
      `linear-gradient(to bottom, ${major} 1px, transparent 1px)`,
      // Minor lines
      `linear-gradient(to right, ${minor} 1px, transparent 1px)`,
      `linear-gradient(to bottom, ${minor} 1px, transparent 1px)`,
    ].join(", "),
    backgroundSize: [
      `${majorSize}px ${majorSize}px`,
      `${majorSize}px ${majorSize}px`,
      `${minorSize}px ${minorSize}px`,
      `${minorSize}px ${minorSize}px`,
    ].join(", "),
  };
}

function buildGrainUri(s: Settings): string {
  const intercept = (1 - s.grainContrast) / 2;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${s.grainSize} ${s.grainSize}'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${s.grainFrequency}' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='linear' slope='${s.grainContrast}' intercept='${intercept}'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;
  return `url("data:image/svg+xml;utf8,${svg.replace(/#/g, "%23")}")`;
}

// ────────────────────────────────────────────────────────────────
// Fixed overlay layer (grain + vignette)
// ────────────────────────────────────────────────────────────────

export function FilmOverlay() {
  const [settings, , hydrated] = useSharedSettings();

  if (!hydrated) return null;

  const grainDataUri = buildGrainUri(settings);

  return (
    <>
      {/* Background stack — sits behind page content.
          Layer order (bottom → top): cream → graph paper grid → grain. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: -1,
          background: "var(--background)",
        }}
      >
        {/* Graph paper grid */}
        <div className="absolute inset-0" style={buildGridStyle(settings)} />
        {/* Grain */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: grainDataUri,
            backgroundSize: `${settings.grainSize}px ${settings.grainSize}px`,
            opacity: settings.grainOpacity,
            mixBlendMode: settings.grainBlend as React.CSSProperties["mixBlendMode"],
          }}
        />
      </div>
      {/* Vignette — stays on top of content for the edge-darkening effect */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[45]"
        style={{
          background: `radial-gradient(ellipse at center, transparent ${settings.vignetteInnerStop}%, rgba(0,0,0,${settings.vignetteDark}) 100%)`,
        }}
      />
    </>
  );
}

// ────────────────────────────────────────────────────────────────
// Inline controls panel — drop into page content wherever
// ────────────────────────────────────────────────────────────────

export function FilmOverlayControls() {
  const [settings, setSettings, hydrated] = useSharedSettings();
  const [copied, setCopied] = useState(false);

  if (!hydrated) return null;

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) =>
    setSettings({ ...settings, [k]: v });

  const reset = () => setSettings(DEFAULTS);

  const copyValues = async () => {
    const text = `const DEFAULTS: Settings = ${JSON.stringify(settings, null, 2)};`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto my-16 bg-white text-neutral-900 rounded-lg p-5 font-mono text-[11px] shadow-2xl border border-neutral-200">
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold tracking-[0.15em] uppercase text-[10px] text-neutral-900">Film Overlay · Dev Panel</span>
      </div>

      <Slider label="Grain Opacity"   value={settings.grainOpacity}   min={0}    max={1}    step={0.01} onChange={(v) => set("grainOpacity", v)} />
      <Slider label="Grain Size (px)" value={settings.grainSize}      min={40}   max={400}  step={10}   onChange={(v) => set("grainSize", v)} />
      <Slider label="Grain Frequency" value={settings.grainFrequency} min={0.2}  max={2}    step={0.05} onChange={(v) => set("grainFrequency", v)} />
      <Slider label="Grain Contrast"  value={settings.grainContrast}  min={1}    max={4}    step={0.1}  onChange={(v) => set("grainContrast", v)} />

      <div className="my-3">
        <div className="flex justify-between mb-1 text-neutral-600">
          <span>Grain Blend</span>
          <span className="text-neutral-900">{settings.grainBlend}</span>
        </div>
        <select
          value={settings.grainBlend}
          onChange={(e) => set("grainBlend", e.target.value as BlendMode)}
          className="w-full bg-neutral-100 text-neutral-900 rounded px-2 py-1 text-[11px] outline-none border border-neutral-200"
        >
          <option value="overlay">overlay</option>
          <option value="soft-light">soft-light</option>
          <option value="multiply">multiply</option>
          <option value="screen">screen</option>
          <option value="normal">normal</option>
        </select>
      </div>

      <div className="h-px bg-neutral-200 my-3" />

      <Slider label="Vignette Inner Stop" value={settings.vignetteInnerStop} min={20} max={95}  step={1}    unit="%" onChange={(v) => set("vignetteInnerStop", v)} />
      <Slider label="Vignette Darkness"   value={settings.vignetteDark}      min={0}  max={0.8} step={0.01}          onChange={(v) => set("vignetteDark", v)} />

      <div className="h-px bg-neutral-200 my-3" />

      <div className="flex items-center justify-between mb-2">
        <span className="text-neutral-600">Graph Grid</span>
        <button
          onClick={() => set("gridEnabled", !settings.gridEnabled)}
          className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider transition ${
            settings.gridEnabled ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-500"
          }`}
        >
          {settings.gridEnabled ? "On" : "Off"}
        </button>
      </div>

      <Slider label="Minor Cell (px)" value={settings.gridMinorSize}  min={4}  max={64}  step={1}    onChange={(v) => set("gridMinorSize", v)} />
      <Slider label="Major Every"     value={settings.gridMajorEvery} min={2}  max={10}  step={1}    unit=" cells" onChange={(v) => set("gridMajorEvery", v)} />
      <Slider label="Grid Strength"   value={settings.gridStrength}   min={0}  max={0.5} step={0.01} onChange={(v) => set("gridStrength", v)} />
      <Slider label="Minor / Major"   value={settings.gridMinorRatio} min={0}  max={1}   step={0.01} unit="×" onChange={(v) => set("gridMinorRatio", v)} />

      <div className="my-2">
        <div className="flex justify-between mb-1 text-neutral-600">
          <span>Grid Color</span>
          <span className="text-neutral-900 tabular-nums">{settings.gridColor}</span>
        </div>
        <input
          type="color"
          value={settings.gridColor}
          onChange={(e) => set("gridColor", e.target.value)}
          className="w-full h-8 bg-transparent rounded cursor-pointer border border-neutral-200"
        />
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={copyValues}
          className="flex-1 bg-neutral-900 hover:bg-neutral-700 text-white rounded px-2 py-2 text-[10px] transition uppercase tracking-wider"
        >
          {copied ? "Copied ✓" : "Copy values"}
        </button>
        <button
          onClick={reset}
          className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded px-2 py-2 text-[10px] transition uppercase tracking-wider border border-neutral-200"
        >
          Reset
        </button>
      </div>

      <div className="text-neutral-500 mt-3 text-[9px] leading-tight">
        Values persist to localStorage · changes apply live to the overlay above
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  unit?: string;
}) {
  const display = Number.isInteger(step) ? value : value.toFixed(2);
  return (
    <div className="mb-2">
      <div className="flex justify-between mb-1">
        <span className="text-neutral-600">{label}</span>
        <span className="tabular-nums text-neutral-900">
          {display}
          {unit || ""}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-neutral-900"
      />
    </div>
  );
}
