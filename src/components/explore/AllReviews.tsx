import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Footer, Header } from "@/components";
import { getAllUserSkillReviews, type Review } from "@/services";

const AllReviews = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId") || "";
  const skillId = searchParams.get("skillId") || "";
  const hasRequiredParams = Boolean(userId && skillId);

  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "rating">("recent");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!hasRequiredParams) {
        setReviews([]);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getAllUserSkillReviews(userId, skillId);
        setReviews(data.reviews ?? []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load reviews");
        console.error("Error loading reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [hasRequiredParams, skillId, userId]);

  const sortedReviews = useMemo(() => {
    const filtered = reviews.filter((review) => {
      if (selectedRating === null) return true;
      return Math.floor(Number(review.overallRating) || 0) === selectedRating;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "recent") {
        return (
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
      }

      return (Number(b.overallRating) || 0) - (Number(a.overallRating) || 0);
    });
  }, [reviews, selectedRating, sortBy]);

  return (
    <div className="bg-white flex flex-col min-h-screen">
      <Header activeTab="Explore" />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 py-6 sm:py-8 flex-grow">
        <h1 className="text-text-primary text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">
          All Reviews
        </h1>

        {!hasRequiredParams ? (
          <div className="bg-amber-50 border border-amber-200 rounded-[10px] p-4 sm:p-6 mb-6 sm:mb-8">
            <p className="text-amber-700 font-semibold">Missing review context</p>
            <p className="text-amber-700 text-sm mt-2">
              Open this page from Explore using a specific provider and skill.
            </p>
          </div>
        ) : null}

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-[10px] p-4 sm:p-6 mb-6 sm:mb-8">
            <p className="text-red-600 font-semibold">Error loading reviews</p>
            <p className="text-red-500 text-sm mt-2">{error}</p>
          </div>
        ) : null}

        {loading ? (
          <div className="space-y-3 sm:space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-[10px] shadow-lg p-4">
                <div className="flex gap-2 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-full animate-pulse mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
              </div>
            ))}
          </div>
        ) : null}

        {!loading && !error && reviews.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8 items-start sm:items-center sm:justify-between">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center w-full sm:w-auto">
                <p className="text-text-primary font-semibold text-sm">Filter by rating:</p>
                <div className="flex flex-wrap gap-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() =>
                        setSelectedRating(selectedRating === rating ? null : rating)
                      }
                      className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-[8px] transition flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap ${
                        selectedRating === rating
                          ? "bg-primary text-white"
                          : "bg-neutral-background2 text-text-primary hover:opacity-70"
                      }`}
                    >
                      <span>{rating}</span>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 0l2.5 5h5.5l-4.5 3.5 1.5 5-5-3.5-5 3.5 1.5-5-4.5-3.5h5.5z" />
                      </svg>
                    </button>
                  ))}
                  {selectedRating !== null ? (
                    <button
                      onClick={() => setSelectedRating(null)}
                      className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-[8px] bg-neutral-background2 text-text-primary hover:opacity-70 transition text-xs sm:text-sm"
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 items-center w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => navigate("/search")}
                  className="flex gap-2 bg-gray-100 p-2 hover:bg-gray-200 rounded-lg"
                  aria-label="Search"
                >
                  Search
                </button>
                <p className="text-text-primary font-semibold text-sm">Sort by:</p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "recent" | "rating")}
                  className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-[8px] border border-neutral-border text-text-primary focus:outline-none text-xs sm:text-sm"
                >
                  <option value="recent">Most Recent</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>

            <p className="text-[#666] text-xs sm:text-sm mb-4 sm:mb-6">
              Showing {sortedReviews.length} of {reviews.length} reviews
              {selectedRating ? ` (${selectedRating} star)` : ""}
            </p>

            <div className="space-y-3 sm:space-y-4">
              {sortedReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-[10px] shadow-lg p-4 sm:p-6">
                  <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={review.reviewer?.image || "https://via.placeholder.com/48"}
                        alt={review.reviewer?.userName || "Reviewer"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="text-text-primary font-semibold text-sm sm:text-base">
                        {review.reviewer?.userName || "Anonymous"}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={`${review.id}-${i}`}
                              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                                i < Math.floor(Number(review.overallRating) || 0)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 0l2.5 5h5.5l-4.5 3.5 1.5 5-5-3.5-5 3.5 1.5-5-4.5-3.5h5.5z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-text-primary text-xs sm:text-sm font-semibold">
                          {review.overallRating || "N/A"}
                        </p>
                      </div>
                      <p className="text-[#666] text-xs mt-1">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  </div>

                  <p className="text-[#666] text-sm sm:text-base lg:text-lg mb-2 sm:mb-3">
                    "{review.comment || "No comment provided"}"
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : null}

        {!loading && !error && hasRequiredParams && reviews.length === 0 ? (
          <div className="bg-white rounded-[10px] shadow-lg p-4 sm:p-6 text-center">
            <p className="text-gray-500">No reviews available</p>
          </div>
        ) : null}
      </div>

      <Footer />
    </div>
  );
};

export default AllReviews;
