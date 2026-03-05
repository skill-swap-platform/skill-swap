import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSkillIdentifier,
  getUserIdentifier,
  type ExploreResultItem,
  type RecommendedUserSkill,
} from "@/services/exploreService";

interface SimilarSkillsProps {
  data?: ExploreResultItem[] | null;
  loading?: boolean;
  error?: string | null;
  recommendedData?: RecommendedUserSkill | null;
  recommendedLoading?: boolean;
  recommendedError?: string | null;
}

const SimilarSkills = ({
  data,
  loading = false,
  error = null,
  recommendedData,
  recommendedLoading = false,
  recommendedError = null,
}: SimilarSkillsProps) => {
  const navigate = useNavigate();

  const cards = useMemo(() => {
    const combined: ExploreResultItem[] = [];
    const seen = new Set<string>();

    const pushUnique = (item: ExploreResultItem | null | undefined) => {
      if (!item) return;
      const skillId = getSkillIdentifier(item.skill);
      const userId = getUserIdentifier(item.user);
      const key = `${skillId}-${userId}`;
      if (!key || seen.has(key)) return;
      seen.add(key);
      combined.push(item);
    };

    (data || []).forEach(pushUnique);
    pushUnique(recommendedData || null);

    return combined.slice(0, 2);
  }, [data, recommendedData]);

  const renderCard = (item: ExploreResultItem, index: number) => {
    const user = item.user;
    const skill = item.skill;
    const skillId = getSkillIdentifier(skill);
    const userId = getUserIdentifier(user);
    const canViewDetails = Boolean(skillId && userId);
    const rating = user.rating || user.avgRate || user.avarage || 0;
    const swaps = (user.receivedSwaps || 0) + (user.sentSwaps || 0);

    return (
      <article
        key={`${userId || user.userName}-${skillId || skill.name}-${index}`}
        className="bg-white rounded-[16px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] p-4 sm:p-6 flex flex-col gap-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4 min-w-0 flex-1">
            <div className="h-[88px] w-[83px] shrink-0 overflow-hidden rounded-[16px] bg-[#d9d9d9]">
              <img
                src={user.image || "https://via.placeholder.com/83x88"}
                alt={user.userName || "User"}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[#0c0d0f] text-2xl font-semibold truncate">
                {user.userName || "User"}
              </p>
              <p className="text-[#666] text-base sm:text-lg truncate">
                {user.bio || "Skill Provider"}
              </p>

              <div className="mt-2 flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 1.8l1.86 3.77 4.16.6-3 2.93.71 4.14L8 11.3l-3.73 1.94.71-4.14-3-2.93 4.16-.6L8 1.8z"
                      fill="#F59E0B"
                    />
                  </svg>
                  <p className="text-[#0c0d0f]">{Number(rating).toFixed(1)}</p>
                </div>
                <div className="h-[6px] w-[6px] rounded-full bg-[#666]" />
                <p className="text-[#0c0d0f]">{swaps} swaps</p>
              </div>
            </div>
          </div>

          {/* <button
            type="button"
            className="text-[#666] transition-colors hover:text-[#0c0d0f]"
            aria-label="Bookmark"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 4.75A2.25 2.25 0 0 1 9.25 2.5h5.5A2.25 2.25 0 0 1 17 4.75v15.59a.25.25 0 0 1-.4.2L12 16.85l-4.6 3.69a.25.25 0 0 1-.4-.2V4.75Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button> */}
        </div>

        <div>
          <p className="text-[#0c0d0f] text-xl font-semibold">{skill.name || "Skill"}</p>
          <p className="text-[#666] text-sm sm:text-base mt-1">
            {skill.description || "No description available."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {skill.category?.name ? (
            <div className="h-[30px] rounded-[8px] bg-[#e6e6e6] px-3 flex items-center">
              <p className="text-[#666] text-sm">{skill.category.name}</p>
            </div>
          ) : null}
          {skill.language ? (
            <div className="h-[30px] rounded-[8px] bg-[#e6e6e6] px-3 flex items-center">
              <p className="text-[#666] text-sm">{skill.language}</p>
            </div>
          ) : null}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (!canViewDetails) return;
              navigate(`/explore/${skillId}/${userId}`);
            }}
            disabled={!canViewDetails}
            className="h-8 min-w-[96px] rounded-[10px] bg-[#3e8fcc] px-4 text-xs text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            View Details
          </button>
        </div>
      </article>
    );
  };

  if (loading) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-[#0c0d0f] text-[24px] font-semibold">Simillar Skills</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((item) => (
            <div key={item} className="bg-white rounded-[16px] p-6 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)]">
              <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse mb-4" />
              <div className="h-5 bg-gray-200 rounded w-full animate-pulse mb-2" />
              <div className="h-5 bg-gray-200 rounded w-2/3 animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-[#0c0d0f] text-[24px] font-semibold">Simillar Skills</h2>
        <div className="bg-red-50 border border-red-200 rounded-[10px] p-6">
          <p className="text-red-600 font-semibold">Error loading similar skills</p>
          <p className="text-red-500 text-sm mt-2">{error}</p>
        </div>
      </section>
    );
  }

  if (cards.length === 0 && !recommendedLoading) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-[#0c0d0f] text-[24px] font-semibold">Simillar Skills</h2>
        <div className="bg-white rounded-[10px] p-6 text-center shadow-[0px_4px_20px_0px_rgba(0,0,0,0.08)]">
          <p className="text-[#666]">
            {recommendedError || "No similar skills available right now."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4 pb-4">
      <h2 className="text-[#0c0d0f] text-[24px] font-semibold">Simillar Skills</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cards.map(renderCard)}

        {recommendedLoading && cards.length < 2 ? (
          <div className="bg-white rounded-[16px] p-6 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)]">
            <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse mb-4" />
            <div className="h-5 bg-gray-200 rounded w-full animate-pulse mb-2" />
            <div className="h-5 bg-gray-200 rounded w-2/3 animate-pulse" />
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default SimilarSkills;
