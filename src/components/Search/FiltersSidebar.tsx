import type { FC } from "react";

type SkillTypeFilter = "learning" | "offering" | "both" | "";
type DifficultyFilter = "beginner" | "intermediate" | "advanced" | "";

interface FiltersState {
  skillType: SkillTypeFilter;
  availability: string[];
  language: string;
  difficultyLevel: DifficultyFilter;
}

interface Props {
  filters: FiltersState;
  onSelectSkillType: (value: SkillTypeFilter) => void;
  onToggleAvailability: (value: string) => void;
  onChangeLanguage: (lang: string) => void;
  onSelectDifficulty: (value: DifficultyFilter) => void;
  onClear: () => void;
  onApply: () => void;
}

const radioClass =
  "h-4 w-4 rounded-full border flex items-center justify-center shrink-0";
const checkboxClass =
  "h-4 w-4 rounded-[4px] border flex items-center justify-center shrink-0";

const FiltersSidebar: FC<Props> = ({
  filters,
  onSelectSkillType,
  onToggleAvailability,
  onChangeLanguage,
  onSelectDifficulty,
  onClear,
  onApply,
}) => {
  return (
    <section className="w-full rounded-xl border border-[#e5e7eb] bg-[#f7faff] p-6">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-[#0c0d0f]">Filter Skills</h3>
        <button
          type="button"
          onClick={onClear}
          className="text-sm text-[#666666] transition-colors hover:text-[#0c0d0f]"
        >
          clear all
        </button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-[#0c0d0f]">Skill Type</h4>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Learning", value: "learning" as const },
              { label: "Offering", value: "offering" as const },
              { label: "Both", value: "both" as const },
            ].map((item) => {
              const checked = filters.skillType === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onSelectSkillType(checked ? "" : item.value)}
                  className="flex items-center gap-2 text-base text-[#0c0d0f]"
                >
                  <span
                    className={`${radioClass} ${
                      checked ? "border-[#3272a3]" : "border-[#0c0d0f]"
                    }`}
                  >
                    {checked ? <span className="h-2 w-2 rounded-full bg-[#3272a3]" /> : null}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-[#0c0d0f]">Availability</h4>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Weekends", value: "weekends" },
              { label: "Morning", value: "morning" },
              { label: "Evening", value: "evening" },
              { label: "Flexible", value: "flexible" },
            ].map((item) => {
              const checked = filters.availability.includes(item.value);

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onToggleAvailability(item.value)}
                  className="flex items-center gap-2 text-base text-[#0c0d0f]"
                >
                  <span
                    className={`${checkboxClass} ${
                      checked
                        ? "border-[#3272a3] bg-[#3272a3]"
                        : "border-[#0c0d0f] bg-transparent"
                    }`}
                  >
                    {checked ? (
                      <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-[#0c0d0f]">Language</h4>
          <select
            value={filters.language}
            onChange={(event) => onChangeLanguage(event.target.value)}
            className="h-10 w-full rounded-[5px] border border-[#e5e7eb] bg-transparent px-3 text-base text-[#0c0d0f] outline-none"
          >
            <option value="">Choose a language</option>
            <option value="English">English</option>
            <option value="Arabic">Arabic</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-[#0c0d0f]">Difficult Level</h4>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Beginner", value: "beginner" as const },
              { label: "intermidiate", value: "intermediate" as const },
              { label: "Advance", value: "advanced" as const },
            ].map((item) => {
              const checked = filters.difficultyLevel === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onSelectDifficulty(checked ? "" : item.value)}
                  className="flex items-center gap-2 text-base text-[#0c0d0f]"
                >
                  <span
                    className={`${radioClass} ${
                      checked ? "border-[#3272a3]" : "border-[#0c0d0f]"
                    }`}
                  >
                    {checked ? <span className="h-2 w-2 rounded-full bg-[#3272a3]" /> : null}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onApply}
        className="mt-8 h-12 w-full rounded-[10px] bg-[#3e8fcc] text-base font-medium text-white transition-opacity hover:opacity-90"
      >
        Apply Filter
      </button>
    </section>
  );
};

export default FiltersSidebar;
