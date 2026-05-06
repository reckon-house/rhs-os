import Image from "next/image";
import type { PipelineSection } from "@/lib/types";
import { SwipeRow } from "../SwipeRow";

export function PipelineBlock({ steps }: PipelineSection) {
  const mobileCards = steps.map((step, i) => (
    <div key={i}>
      {step.image && (
        <div className="relative aspect-square rounded-[18%] overflow-hidden bg-surface-alt mb-4">
          <Image
            src={step.image}
            alt={step.title}
            fill
            sizes="(min-width: 768px) 25vw, 75vw"
            className="object-cover"
          />
        </div>
      )}
      <h4 className="text-[11px] md:text-[14px] font-bold leading-[1.875] mb-2">{step.title}</h4>
      <p className="text-[11px] md:text-[14px] leading-[1.875] text-foreground/80">{step.description}</p>
    </div>
  ));

  return (
    <section className="w-full py-4 md:px-[calc(100%/24)]">
      <div className="md:hidden">
        <SwipeRow className="">{mobileCards}</SwipeRow>
      </div>

      <div className="hidden md:block space-y-6">
        {steps.map((step, i) => (
          <div key={i} className="grid grid-cols-12 gap-x-5 items-start bg-[#EDE7E2] rounded-[clamp(20px,3vw,40px)] p-8">
            <div className="col-span-3">
              {step.image && (
                <div className="relative aspect-square rounded-[18%] overflow-hidden bg-surface-alt">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="(min-width: 768px) 22vw, 75vw"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <div className="col-start-7 col-span-6">
              <h4 className="text-[11px] md:text-[14px] font-bold leading-[1.875] mb-2">{step.title}</h4>
              <p className="text-[11px] md:text-[14px] leading-[1.875] text-foreground/80">{step.description}</p>
              {step.title2 && (
                <>
                  <h4 className="text-[11px] md:text-[14px] font-bold leading-[1.875] mt-6 mb-2">{step.title2}</h4>
                  <p className="text-[11px] md:text-[14px] leading-[1.875] text-foreground/80">{step.description2}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
