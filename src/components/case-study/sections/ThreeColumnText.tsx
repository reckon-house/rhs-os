import type { ThreeColumnTextSection } from "@/lib/types";
import { SwipeRow } from "../SwipeRow";

export function ThreeColumnText({ columns }: ThreeColumnTextSection) {
  const cards = columns.map((col, i) => (
    <div key={i}>
      {col.title && (
        <h3 className="text-[11px] md:text-[14px] font-bold leading-[1.875] mb-3">{col.title}</h3>
      )}
      <p className="text-[11px] md:text-[14px] leading-[1.875] text-foreground/80 whitespace-pre-line">
        {col.content.replace(/\n\n/g, "\n")}
      </p>
    </div>
  ));

  return (
    <section className="w-full pt-2 pb-8 md:px-[calc(100%/24)]">
      <SwipeRow className="" cardFraction={0.80}>{cards}</SwipeRow>

      <div className="hidden md:block space-y-10">
        {columns.map((col, i) => (
          <div key={i} className="grid grid-cols-12 gap-x-5">
            {col.title && (
              <h3 className="col-span-3 text-[11px] md:text-[14px] font-bold leading-[1.875] pt-[3px]">
                {col.title}
              </h3>
            )}
            <div className={`${col.title ? "col-start-7 col-span-6" : "col-span-12"}`}>
              {col.content.split("\n\n").map((p, j) => (
                <p key={j} className="text-[11px] md:text-[14px] leading-[1.875] text-foreground/80 mb-4 last:mb-0">
                  {p}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
