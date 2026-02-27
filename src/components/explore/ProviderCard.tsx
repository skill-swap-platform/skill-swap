import { useNavigate } from "react-router-dom";
import { getUserIdentifier, type SkillProvider } from "@/services/exploreService";

interface ProviderCardProps {
  data?: SkillProvider | null;
  loading?: boolean;
  error?: string | null;
  skillId?: string;
}

const ProviderCard = ({
  data,
  loading = false,
  error = null,
  skillId = "",
}: ProviderCardProps) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-[#0c0d0f] text-[24px] font-semibold">Provider</h2>
        <div className="bg-white rounded-[5px] shadow-[4px_4px_20px_0px_rgba(0,0,0,0.05)] p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="h-[60px] w-[60px] rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-40 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-52 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
            </div>
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-[#0c0d0f] text-[24px] font-semibold">Provider</h2>
        <div className="bg-red-50 border border-red-200 rounded-[10px] p-6">
          <p className="text-red-600 font-semibold">
            Error loading provider information
          </p>
          <p className="text-red-500 text-sm mt-2">{error}</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-[#0c0d0f] text-[24px] font-semibold">Provider</h2>
        <div className="bg-white rounded-[5px] shadow-[4px_4px_20px_0px_rgba(0,0,0,0.05)] p-6">
          <p className="text-[#666]">No provider information available.</p>
        </div>
      </section>
    );
  }

  const provider = data;
  const providerId = getUserIdentifier(provider);
  const canOpenDetails = Boolean(providerId && skillId);
  const userName = provider.userName || "Unknown Provider";
  const image = provider.image || "https://via.placeholder.com/60";
  const bio = provider.bio || "Skill Provider";
  const rating = provider.rating || provider.avgRate || provider.avarage || 0;
  const totalFeedbacks = provider.totalFeedbacks || provider.totalFeedback || 0;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-[#0c0d0f] text-[24px] font-semibold">Provider</h2>

      <div className="bg-white rounded-[5px] shadow-[4px_4px_20px_0px_rgba(0,0,0,0.05)] p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="h-[60px] w-[60px] rounded-full overflow-hidden bg-[#e5e7eb] shrink-0">
            <img src={image} alt={userName} className="h-full w-full object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[#0c0d0f] text-xl font-semibold leading-tight">{userName}</p>
            <p className="text-[#666] text-[13px] mt-1 truncate">{bio}</p>
            <div className="mt-1 flex items-center gap-1 text-[13px]">
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1.8l1.86 3.77 4.16.6-3 2.93.71 4.14L8 11.3l-3.73 1.94.71-4.14-3-2.93 4.16-.6L8 1.8z"
                  fill="#F59E0B"
                />
              </svg>
              <p className="text-[#0c0d0f]">{Number(rating).toFixed(1)}</p>
              <p className="text-[#0c0d0f]">({totalFeedbacks} reviews)</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!canOpenDetails) return;
              navigate(`/provider/${providerId}/${skillId}`);
            }}
            disabled={!canOpenDetails}
            className="h-6 rounded-[10px] border border-[#3272a3] px-3 text-[12px] text-[#3272a3] whitespace-nowrap hover:bg-[rgba(62,143,204,0.1)] transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            View Profile
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProviderCard;
