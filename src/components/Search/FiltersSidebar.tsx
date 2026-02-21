import React from "react";

interface Props {
  filters: {
    skillType: string[];
    availability: string[];
    language: string;
    difficultyLevel: string[];
  };
  onToggleFilter: (category: string, value: string) => void;
  onChangeLanguage: (lang: string) => void;
  onClear: () => void;
  onApply: () => void;
  onClose: () => void;
}

const FiltersSidebar: React.FC<Props> = ({ filters, onToggleFilter, onChangeLanguage, onClear, onApply, onClose }) => {
  return (
    <div className="w-96 bg-white border border-gray-300 rounded-2xl p-6 h-fit sticky top-8 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-text-primary">Filter Skills</h3>
        <div className="flex items-center gap-2">
          <button onClick={onClear} className="text-sm text-gray-600 hover:text-text-primary">clear all</button>
          <button onClick={onClose} aria-label="Close filters" className="text-gray-600 hover:text-text-primary text-xl font-bold leading-none">×</button>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-text-primary">Skill Type</h4>
        <div className="flex flex-wrap gap-2">
          {["Learning", "Offering", "Both"].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.skillType.includes(type.toLowerCase())}
                onChange={() => onToggleFilter("skillType", type.toLowerCase())}
                className="w-4 h-4 rounded"
              />
              <span className="text-text-primary text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-text-primary">Availability</h4>
        <div className="space-y-2">
          {["Weekends", "Morning", "Evening", "Flexible"].map((time) => (
            <label key={time} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.availability.includes(time.toLowerCase())}
                onChange={() => onToggleFilter("availability", time.toLowerCase())}
                className="w-4 h-4 rounded border border-text-primary"
              />
              <span className="text-text-primary text-sm">{time}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-text-primary">Language</h4>
        <select value={filters.language} onChange={(e) => onChangeLanguage(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-text-primary outline-none">
          <option value="">Choose a language</option>
          <option value="english">English</option>
          <option value="spanish">Spanish</option>
          <option value="french">French</option>
        </select>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-text-primary">Difficulty Level</h4>
        <div className="flex flex-wrap gap-2">
          {["Beginner", "Intermediate", "Advance"].map((level) => (
            <label key={level} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.difficultyLevel.includes(level.toLowerCase())}
                onChange={() => onToggleFilter("difficultyLevel", level.toLowerCase())}
                className="w-4 h-4 rounded"
              />
              <span className="text-text-primary text-sm">{level}</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={onApply} className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-opacity-90 transition">Apply Filter</button>
    </div>
  );
};

export default FiltersSidebar;
