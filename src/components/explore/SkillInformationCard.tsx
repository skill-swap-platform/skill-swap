interface SkillInformationCardProps {
  data?: any;
  loading?: boolean;
  error?: string | null;
}

const SkillInformationCard = ({ data, loading = false, error = null }: SkillInformationCardProps) => {
  if (loading) {
    return (
      <div className="bg-white border border-neutral-border rounded-[10px] p-6 flex flex-col gap-4">
        <div className="h-10 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-[10px] p-6">
        <p className="text-red-600 font-semibold">Error loading skill details</p>
        <p className="text-red-500 text-sm mt-2">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white border border-neutral-border rounded-[10px] p-6">
        <p className="text-gray-500">No skill data available</p>
      </div>
    );
  }

  const skill = data?.skill || {};
  const level = data?.level || 'N/A';
  const sessionLanguage = data?.sessionLanguage || 'Not specified';
  const skillDescription = data?.skillDescription || skill?.description || '';
  const avgRating = data?.reviews?.LatestReviewDto?.rating || 0;
  const reviewCount = data?.reviews?.count || 0;

  return (
    <div className="bg-white border border-neutral-border rounded-[10px] p-4 sm:p-6 flex flex-col gap-4">
      <h1 className="text-text-primary text-2xl sm:text-3xl lg:text-4xl font-bold">
        {skill?.name || 'Skill'}
      </h1>
      
      {/* Chips */}
      <div className="flex flex-wrap gap-2">
        <div className="bg-chip-background rounded-[10px] px-2 py-1 h-5 flex items-center">
          <p className="text-chip_text text-sm font-inter">{level}</p>
        </div>
        <div className="bg-chip-background rounded-[10px] px-2 py-1 h-5 flex items-center">
          <p className="text-chip_text text-sm font-inter">
            {data?.sessions?.length || 0} sessions
          </p>
        </div>
        <div className="bg-chip-background rounded-[10px] px-2 py-1 h-5 flex items-center">
          <p className="text-chip_text text-sm font-inter">{sessionLanguage}</p>
        </div>
      </div>

      {/* Description with border */}
      {skillDescription && (
        <div className="border-l-[1.5px] border-chip_text px-2 py-2">
          <p className="text-text-primary text-lg">
            {skillDescription}
          </p>
        </div>
      )}

      {/* Rating */}
      {reviewCount > 0 && (
        <div className="flex items-center gap-1 py-2 px-1">
          <svg
            className="w-3.5 h-3.5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 0l2.5 5h5.5l-4.5 3.5 1.5 5-5-3.5-5 3.5 1.5-5-4.5-3.5h5.5z" />
          </svg>
          <p className="text-text-primary text-sm">{avgRating.toFixed(1)}</p>
          <p className="text-[#666] text-sm">({reviewCount} reviews)</p>
        </div>
      )}

      {/* Category Info */}
      {skill?.category && (
        <div className="flex items-center gap-2 pt-2">
          <span className="text-2xl">{skill.category?.icon || '📚'}</span>
          <p className="text-text-primary text-sm">
            <span className="font-semibold">{skill.category?.name || 'Category'}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default SkillInformationCard
