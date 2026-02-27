import { useNavigate } from "react-router-dom";
import type { Review, ReviewsData } from "@/services/exploreService";

interface ReviewsProps {
  data?: ReviewsData | null;
  loading?: boolean;
  error?: string | null;
  userId?: string;
  skillId?: string;
}

const Reviews = ({
  data,
  loading = false,
  error = null,
  userId = "",
  skillId = "",
}: ReviewsProps) => {
  const navigate = useNavigate();
  const hasParams = Boolean(userId && skillId);

  const handleSeeAll = () => {
    if (!hasParams) {
      return;
    }

    navigate(`/all-reviews?userId=${userId}&skillId=${skillId}`);
  };

  if (loading) {
    return (
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[#0c0d0f] text-[24px] font-semibold">Reviews</h2>
          <button
            onClick={handleSeeAll}
            disabled={!hasParams}
            className="text-[#666] text-sm hover:text-[#0c0d0f] transition disabled:opacity-40"
          >
            See All
          </button>
        </div>
        <div className="bg-white rounded-[10px] p-4 shadow-[4px_4px_20px_0px_rgba(0,0,0,0.05)]">
          <div className="flex gap-3 mb-3">
            <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
            </div>
          </div>
          <div className="h-5 bg-gray-200 rounded w-full animate-pulse mb-2" />
          <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-[#0c0d0f] text-[24px] font-semibold">Reviews</h2>
        <div className="bg-red-50 border border-red-200 rounded-[10px] p-6">
          <p className="text-red-600 font-semibold">Error loading reviews</p>
          <p className="text-red-500 text-sm mt-2">{error}</p>
        </div>
      </section>
    );
  }

  const review: Review | null = data?.reviews?.[0] || null;
  if (!review) {
    return (
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[#0c0d0f] text-[24px] font-semibold">Reviews</h2>
          <button
            onClick={handleSeeAll}
            disabled={!hasParams}
            className="text-[#666] text-sm hover:text-[#0c0d0f] transition disabled:opacity-40"
          >
            See All
          </button>
        </div>
        <div className="bg-white rounded-[10px] p-6 text-center shadow-[4px_4px_20px_0px_rgba(0,0,0,0.05)]">
          <p className="text-[#666]">No reviews yet.</p>
        </div>
      </section>
    );
  }

  const reviewerName = review.reviewer?.userName || "Anonymous";
  const reviewerImage = review.reviewer?.image || "https://via.placeholder.com/48";
  const rating = Number(review.overallRating) || 0;
  const helpfulCount = Number(
    (review as { helpfulCount?: unknown; helpful?: unknown; likes?: unknown })
      .helpfulCount ??
      (review as { helpful?: unknown }).helpful ??
      (review as { likes?: unknown }).likes ??
      0,
  );

  const helperText =
    helpfulCount > 0
      ? `${helpfulCount} found this comment helpful`
      : review.createdAt
        ? new Date(review.createdAt).toLocaleDateString()
        : "";

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[#0c0d0f] text-[24px] font-semibold">Reviews</h2>
        <button
          onClick={handleSeeAll}
          disabled={!hasParams}
          className="text-[#666] text-sm hover:text-[#0c0d0f] transition disabled:opacity-40"
        >
          See All
        </button>
      </div>

      <div className="bg-white rounded-[10px] p-4 shadow-[4px_4px_20px_0px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-[#e5e7eb] shrink-0">
              <img
                src={reviewerImage}
                alt={reviewerName}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-[#0c0d0f] text-base font-semibold">{reviewerName}</p>
              <div className="flex items-center gap-1 text-[12px]">
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1.8l1.86 3.77 4.16.6-3 2.93.71 4.14L8 11.3l-3.73 1.94.71-4.14-3-2.93 4.16-.6L8 1.8z"
                    fill="#F59E0B"
                  />
                </svg>
                <p className="text-[#0c0d0f]">{rating.toFixed(1)}</p>
              </div>
            </div>
          </div>

          <p className="text-[#666] text-sm sm:text-base">
            &quot;{review.comment || "No comment provided"}&quot;
          </p>

          {helperText ? (
            <p className="text-[#3272a3] text-[13px]">{helperText}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
