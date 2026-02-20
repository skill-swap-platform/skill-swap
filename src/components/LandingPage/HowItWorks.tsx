import { DEFAULT_STEPS } from "@/constants/landingPage";
import type { HowItWorksProps } from "@/types/landingPage.types";
import image from "@/assets/landingPage/pana.png";
export function HowItWorks({
  title = "How Skill Swap works",
  steps = DEFAULT_STEPS,
  className = "xs:px-20 md:px-40 ",
}: HowItWorksProps) {
  return (
    <section className={className}>
      <div className="rounded-3xl bg-slate-50/80 shadow-sm">
        <div className="grid md:grid-cols-2 items-center justify-center">
          {/* Left */}
          <div className="h-full">
            {/* Title with very soft brush */}
            <h2 className="relative text-xl md:text-2xl font-semibold text-slate-800 heading-brush-highlight my-5">
              {title}
            </h2>

            <ol className="flex flex-col justify-start gap-5 h-full">
              {steps.map((step) => (
                <li key={step.id} className="flex items-start gap-4">
                  <div
                    className="
                    rounded-full flex h-7 w-7 shrink-0 items-center justify-center bg-slate-200 text-slate-700 text-xl font-semibold
                    "
                    aria-label={`Step ${step.id}`}
                  >
                    {step.id}
                  </div>

                  <div>
                    <p className="text-3xl md:text-base font-semibold text-slate-800 ">
                      {step.title}
                    </p>
                    <p className="text-lg mt-1 md:text-sm text-slate-500 leading-relaxed max-w-md w-8/12">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Right */}
          <div className="flex justify-center md:justify-end">
            <img
              src={image}
              alt={"How it works illustration"}
              className="object-contain h-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
