import type { ClosingSection } from "@/lib/types";

export function ClosingBlock({ services, stack, links, content }: ClosingSection) {
  return (
    <section className="w-full py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-5 gap-y-8 pl-0 md:pl-[calc(100%/24)]">
        {/* Left — Services, Stack, Links (cols 1-4) */}
        <div className="md:col-span-4 text-[11px] md:text-[14px] leading-[1.875] text-[#141414]">
          <p className="font-bold">Services</p>
          {services.map((s, i) => (
            <p key={i} className="text-foreground/70">{s}</p>
          ))}

          <p className="font-bold mt-6">Stack</p>
          {stack.map((s, i) => (
            <p key={i} className="text-foreground/70">{s}</p>
          ))}

          <p className="font-bold mt-6">Links</p>
          {links.map((l, i) => (
            <p key={i}>
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 underline underline-offset-2"
              >
                {l.label}
              </a>
            </p>
          ))}
        </div>

        {/* Right — Closing text (cols 7-12) */}
        <div className="md:col-start-7 md:col-span-6 space-y-5">
          {content.split("\n\n").map((p, i) => (
            <p key={i} className="text-[11px] md:text-[14px] leading-[1.875] text-foreground/80">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
