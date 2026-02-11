const SkillInformationCard = () => {
  return (
    <div className="bg-white border border-neutral-border rounded-[10px] p-6 flex flex-col gap-4">
      <h1 className="text-text-primary text-4xl font-bold">
        Photography Basics
      </h1>
      {/* Chips */}
        <div className="flex flex-wrap gap-2">
          <div className="bg-chip-background rounded-[10px] px-2 py-1 h-5 flex items-center">
            <p className="text-chip_text text-sm font-inter">Intermediate</p>
          </div>
          <div className="bg-chip-background rounded-[10px] px-2 py-1 h-5 flex items-center">
            <p className="text-chip_text text-sm font-inter">60 min</p>
          </div>
          <div className="bg-chip-background rounded-[10px] px-2 py-1 h-5 flex items-center">
            <p className="text-chip_text text-sm font-inter">English</p>
          </div>
        </div>
        {/* Description with border */}
        <div className="border-l-[1.5px] border-chip_text px-2 py-2">
          <p className="text-text-primary text-lg">
            Learn the core concepts of aperture, shutter speed, and ISO. By the
            end of this session, you will be able to shoot in manual mode and
            understand composition rules. This is a foundational session perfect
            for new camera owners.
          </p>
        </div>
         {/* Rating */}
        <div className="flex items-center gap-1 py-2 px-1">
          <svg
            className="w-3.5 h-3.5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 0l2.5 5h5.5l-4.5 3.5 1.5 5-5-3.5-5 3.5 1.5-5-4.5-3.5h5.5z" />
          </svg>
          <p className="text-text-primary text-sm">4.9</p>
          <p className="text-[#666] text-sm">(50 reviews)</p>
        </div>
    </div>
  );
};

export default SkillInformationCard
