import { SkillCard } from "./SkillCard";
import { SKILLS } from "@/constants/landingPage";
import type { SkillCard as SkillCardType } from "@/types/landingPage.types";

type SkillsGridProps = {
  skills?: SkillCardType[];
  className?: string;
};

export function SkillsGrid({ skills = SKILLS }: SkillsGridProps) {
  return (
    <div className="py-10 bg-white">
      <h2 className="text-center w-6/12 text-2xl font-semibold tracking-tight text-slate-800 sm:text-3xl mx-auto py-4">
        Some of the skills provided by the skills swap application
      </h2>
      <section className={"bg-white px-40 py-10"}>
        <div
          className="
          grid gap-10
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
        "
        >
          {skills.map((s) => (
            <SkillCard
              key={s.id}
              title={s.title}
              imageSrc={s.imageSrc}
              imageAlt={s.title}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
