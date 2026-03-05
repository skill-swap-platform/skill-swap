import type { SkillDetailsResponse } from "@/api/extended-services/exploreService";

interface SkillInformationCardProps {
  data?: SkillDetailsResponse | null;
  loading?: boolean;
  error?: string | null;
}

const SkillInformationCard = ({
  data,
  loading = false,
  error = null,
}: SkillInformationCardProps) => {
  if (loading) {
    return (
      <div className="bg-white border border-[#e5e7eb] rounded-[10px] p-6 flex flex-col gap-4">
        <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse" />
        <div className="flex gap-2">
          <div className="h-5 bg-gray-200 rounded w-20 animate-pulse" />
          <div className="h-5 bg-gray-200 rounded w-20 animate-pulse" />
          <div className="h-5 bg-gray-200 rounded w-20 animate-pulse" />
        </div>
        <div className="h-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
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
      <div className="bg-white border border-[#e5e7eb] rounded-[10px] p-6">
        <p className="text-[#666]">No skill data available.</p>
      </div>
    );
  }

  const skill = data.skill || { name: "Skill" };
  const level = data.level || "Not specified";
  const sessionLanguage = data.sessionLanguage || "Not specified";
  const skillDescription = data.skillDescription || skill.description || "";
  const firstSessionDuration = data.sessions?.[0]?.duration || 0;
  const secondChipLabel =
    firstSessionDuration > 0
      ? `${firstSessionDuration} min`
      : `${data.countSessions || 0} sessions`;

  const avgRating =
    data.reviews?.LatestReviewDto?.rating ||
    data.reviews?.latestReview?.rating ||
    0;
  const reviewCount = data.reviews?.count || 0;
  const showRating = avgRating > 0 || reviewCount > 0;

  return (
    <section className="bg-white border border-[#e5e7eb] rounded-[10px] p-4 sm:p-6 flex flex-col gap-4">
      <h1 className="text-[#0c0d0f] text-[28px] leading-tight font-bold">
        {skill.name || "Skill"}
      </h1>

      <div className="flex flex-wrap gap-2">
        {[level, secondChipLabel, sessionLanguage].map((chip) => (
          <div
            key={chip}
            className="h-5 rounded-[10px] px-2 bg-[rgba(62,143,204,0.2)] flex items-center justify-center"
          >
            <p className="text-[#3272a3] text-[12px] sm:text-[14px]">{chip}</p>
          </div>
        ))}
      </div>

      {skillDescription ? (
        <div className="border-l-[1.5px] border-[#3272a3] px-2">
          <p className="text-[#0c0d0f] text-sm sm:text-base leading-6">
            {skillDescription}
          </p>
        </div>
      ) : null}

      {showRating ? (
        <div className="flex items-center gap-1 text-[13px]">
          <svg className="h-[14px] w-[14px]" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1.8l1.86 3.77 4.16.6-3 2.93.71 4.14L8 11.3l-3.73 1.94.71-4.14-3-2.93 4.16-.6L8 1.8z"
              fill="#F59E0B"
            />
          </svg>
          <p className="text-[#0c0d0f]">{Number(avgRating).toFixed(1)}</p>
          <p className="text-[#666]">({reviewCount} reviews)</p>
        </div>
      ) : null}
    </section>
  );
};

export default SkillInformationCard;
