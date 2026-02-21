import { useNavigate } from "react-router-dom";

interface SimilarSkillsProps {
  data?: any;
  loading?: boolean;
  error?: string | null;
  recommendedData?: any;
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

  if (loading) {
    return (
      <div className="flex flex-col gap-4 sm:gap-6">
        <h2 className="text-text-primary text-2xl sm:text-3xl lg:text-4xl font-bold">Similar Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-[16px] shadow-lg p-4 sm:p-6">
              <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 sm:gap-6">
        <h2 className="text-text-primary text-2xl sm:text-3xl lg:text-4xl font-bold">Similar Skills</h2>
        <div className="bg-red-50 border border-red-200 rounded-[10px] p-4 sm:p-6">
          <p className="text-red-600 font-semibold">Error loading similar skills</p>
          <p className="text-red-500 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const similarUser = data?.user || data;
  const similarSkill = data?.skill || {};

  if (!similarUser) {
    return (
      <div className="flex flex-col gap-4 sm:gap-6">
        <h2 className="text-text-primary text-2xl sm:text-3xl lg:text-4xl font-bold">Similar Skills</h2>
        <div className="bg-white rounded-[10px] shadow-lg p-4 sm:p-6 text-center">
          <p className="text-gray-500">No similar skills found</p>
        </div>
      </div>
    );
  }

  const skillCard = (user: any, skill: any, index: number) => (
    <div key={index} className="bg-white rounded-[16px] shadow-lg p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
      {/* Card Header */}
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex gap-3 sm:gap-6">
          {/* Image */}
          <div className="w-16 h-16 sm:w-20 sm:h-22 rounded-[16px] bg-gray-300 flex-shrink-0 overflow-hidden">
            <img
              src={user?.image || 'https://via.placeholder.com/83x88'}
              alt={user?.userName || 'User'}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col gap-2 sm:gap-4">
            <div>
              <p className="text-text-primary text-lg sm:text-2xl font-semibold">
                {user?.userName || 'User'}
              </p>
              <p className="text-[#666] text-sm sm:text-lg line-clamp-2">{user?.bio || 'No bio'}</p>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              {user?.rating && (
                <>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0l2.5 5h5.5l-4.5 3.5 1.5 5-5-3.5-5 3.5 1.5-5-4.5-3.5h5.5z" />
                    </svg>
                    <p className="text-text-primary font-semibold">
                      {user.rating}
                    </p>
                  </div>
                  <div className="w-1 h-1 bg-[#666] rounded-full"></div>
                </>
              )}
              <div className="flex items-center gap-1">
                <p className="text-text-primary">
                  {user?.receivedSwaps || user?.sentSwaps || 0} swaps
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <p className="text-text-primary text-base sm:text-xl font-semibold">
            {skill?.name || 'Skill'}
          </p>
          <p className="text-[#666] text-sm sm:text-lg">
            {skill?.description || 'No description available'}
          </p>
        </div>
      </div>

      {/* Skills Tags */}
      {skill?.category && (
        <div className="flex flex-wrap gap-2">
          <div className="bg-[#e6e6e6] rounded-[8px] px-2 py-1 sm:px-2.5 sm:py-1.5">
            <p className="text-[#666] text-xs sm:text-sm text-center whitespace-nowrap">{skill.category?.name}</p>
          </div>
          {skill?.language && (
            <div className="bg-[#e6e6e6] rounded-[8px] px-2 py-1 sm:px-2.5 sm:py-1.5">
              <p className="text-[#666] text-xs sm:text-sm text-center whitespace-nowrap">{skill.language}</p>
            </div>
          )}
        </div>
      )}

      {/* View Details Button */}
      <button
        onClick={() => navigate(`/explore/${skill?.id}/${user?.id}`)}
        className="bg-primary text-white rounded-[10px] py-2 sm:py-2.5 font-normal text-xs sm:text-sm hover:opacity-90 transition w-full"
      >
        View Details
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <h2 className="text-text-primary text-2xl sm:text-3xl lg:text-4xl font-bold">Similar Skills</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Similar User Skill Card */}
        {similarUser && skillCard(similarUser, similarSkill, 0)}

        {/* Recommended User Skill Card */}
        {recommendedLoading ? (
          <div className="bg-white rounded-[16px] shadow-lg p-6">
            <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        ) : recommendedData?.user ? (
          skillCard(recommendedData.user, recommendedData.skill, 1)
        ) : (
          <div className="bg-white rounded-[16px] shadow-lg p-6 flex items-center justify-center min-h-[300px]">
            <p className="text-gray-500 text-center">
              No additional recommendations available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimilarSkills;
