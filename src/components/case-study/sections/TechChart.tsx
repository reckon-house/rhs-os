import type { TechChartSection } from "@/lib/types";

const GRID_COLS = 12;

export function TechChart({ items }: TechChartSection) {
  return (
    <section className="w-full py-8 pl-[calc(100%/12)]">
      <div className="relative">
        {/* Subtle grid lines */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {/* Vertical */}
          {Array.from({ length: GRID_COLS + 1 }).map((_, i) => (
            <div
              key={`v${i}`}
              className="absolute top-0 bottom-0 w-px bg-foreground/[0.06]"
              style={{ left: `${(i / GRID_COLS) * 100}%` }}
            />
          ))}
          {/* Horizontal */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`h${i}`}
              className="absolute left-0 right-0 h-px bg-foreground/[0.06]"
              style={{ top: `${((i + 1) / 6) * 100}%` }}
            />
          ))}
        </div>

        {/* Bars */}
        <div className="relative flex flex-col gap-[3px] py-4">
          {items.map((item, i) => (
            <div key={i} className="flex items-center">
              <div
                className="flex items-center gap-0"
                style={{ paddingLeft: `${(item.offset ?? 0)}%` }}
              >
                <span className="text-[11px] tracking-[0.05em] text-[#141414] shrink-0 text-right pr-3 w-[90px]">
                  {item.role}
                </span>
                <div
                  className="h-[22px] rounded-full flex items-center px-4 shrink-0"
                  style={{
                    width: `${item.width}%`,
                    minWidth: "fit-content",
                    background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
                  }}
                >
                  <span className="text-[11px] font-medium text-white/90 whitespace-nowrap">
                    {item.tech}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
