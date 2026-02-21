import { useNavigate } from "react-router-dom";

interface ReviewsProps {
  data?: any;
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

  const handleSeeAll = () => {
    navigate(`/all-reviews?userId=${userId}&skillId=${skillId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-text-primary text-2xl sm:text-3xl lg:text-4xl font-bold">
            Reviews
          </h2>
          <button
            onClick={handleSeeAll}
            className="text-primary hover:text-opacity-80 text-xs sm:text-sm font-semibold transition w-fit"
          >
            See All →
          </button>
        </div>

        <div className="bg-white rounded-[10px] shadow-lg p-4">
          <div className="flex gap-2 mb-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 animate-pulse"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            </div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-full animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-text-primary text-2xl sm:text-3xl lg:text-4xl font-bold">
          Reviews
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-[10px] p-4 sm:p-6">
          <p className="text-red-600 font-semibold">Error loading reviews</p>
          <p className="text-red-500 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const reviews = data?.review || data?.reviews || [];
  const hasReviews = reviews && reviews.length > 0;
  
  if (!hasReviews) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-text-primary text-2xl sm:text-3xl lg:text-4xl font-bold">
            Reviews
          </h2>
          <button
            onClick={handleSeeAll}
            className="text-primary hover:text-opacity-80 text-xs sm:text-sm font-semibold transition w-fit"
          >
            See All →
          </button>
        </div>
        <div className="bg-white rounded-[10px] shadow-lg p-4 sm:p-6 text-center">
          <p className="text-gray-500">No reviews yet</p>
        </div>
      </div>
    );
  }

  const latestReviews = reviews.slice(0, 3);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-text-primary text-2xl sm:text-3xl lg:text-4xl font-bold">
          Reviews
        </h2>
        {reviews.length > 0 && (
          <button
            onClick={handleSeeAll}
            className="text-primary hover:text-opacity-80 text-xs sm:text-sm font-semibold transition w-fit"
          >
            See All →
          </button>
        )}
      </div>

      {/* Review Cards */}
      {latestReviews.map((review: any, index: number) => (
        <div
          key={review?.id || index}
          className="bg-white rounded-[10px] shadow-lg p-3 sm:p-4"
        >
          <div className="flex gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex-shrink-0 flex items-center justify-center overflow-hidden">
              <img
                src={
                  review?.reviewer?.image || "https://via.placeholder.com/48"
                }
                alt={review?.reviewer?.userName || "Reviewer"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-text-primary font-semibold text-sm sm:text-base">
                {review?.reviewer?.userName || "Anonymous"}
              </p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                      i < Math.floor(review?.overallRating || 0)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0l2.5 5h5.5l-4.5 3.5 1.5 5-5-3.5-5 3.5 1.5-5-4.5-3.5h5.5z" />
                  </svg>
                ))}
                <p className="text-text-primary text-xs sm:text-sm ml-1">
                  {review?.overallRating || "N/A"}
                </p>
              </div>
            </div>
          </div>
          <p className="text-[#666] text-sm sm:text-base lg:text-lg mb-2">
            "{review?.comment || "No comment provided"}"
          </p>
          {review?.createdAt && (
            <p className="text-chip_text text-xs sm:text-sm">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Reviews;
