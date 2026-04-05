import type { TextSection } from "@/lib/types";

const sizeStyles = {
  base: "text-[12px] md:text-[16px] leading-[1.875] text-[#141414]",
  lg: "text-[14px] md:text-[18px] leading-[1.875] text-[#141414]",
  xl: "text-[18px] md:text-[24px] font-normal leading-[1.875] text-[#141414]",
  subhead: "text-[18px] md:text-[24px] font-normal leading-[1.5] tracking-[-0.02em] text-[#141414]",
};

const spacingStyles = {
  base: "pt-1 pb-4",
  lg: "py-4",
  xl: "pt-0 pb-1",
  subhead: "pt-0 pb-4",
};

export function TextBlock({ content, size = "base", centered, fullWidth }: TextSection) {
  const paragraphs = content.split("\n\n");
  const styles = sizeStyles[size] || sizeStyles.base;
  const maxW = fullWidth ? "" : size === "base" ? "max-w-3xl" : size === "lg" ? "max-w-4xl" : "";
  const align = centered
    ? `text-center mx-auto px-4 md:px-0 ${maxW}`
    : `pl-0 md:pl-[calc(100%/24)] ${maxW}`;

  return (
    <section className={`w-full ${spacingStyles[size] || spacingStyles.base}`}>
      <div className={`${styles} ${align}`}>
        {paragraphs.length === 1 ? (
          <p>{paragraphs[0]}</p>
        ) : (
          <div className="space-y-5">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
