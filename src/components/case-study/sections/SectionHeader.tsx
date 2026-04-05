import type { SectionHeaderSection } from "@/lib/types";

export function SectionHeader({ label, title, group, centered }: SectionHeaderSection) {
  const lines = title ? title.split("\n") : [];
  const topPad = group ? "pt-4" : "";
  const align = centered ? "text-center" : "pl-0 md:pl-[calc(100%/24)]";

  return (
    <section className={`w-full ${topPad} pb-0 ${align}`}>
      <span className="inline-block text-[11px] md:text-[13px] tracking-[0.06em] uppercase text-[#141414] font-medium px-4 py-2 rounded-full bg-[#141414]/[0.06] mb-5">
        {label}
      </span>
      {title && (
        <h2 className="text-[16px] md:text-[24px] leading-[1.5] tracking-[-0.02em] font-bold">
          {title.replace(/\n/g, " ")}
        </h2>
      )}
    </section>
  );
}
