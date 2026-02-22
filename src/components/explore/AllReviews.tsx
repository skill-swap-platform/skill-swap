import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { getAllUserSkillReviews } from "@/services";
import { useNavigate } from "react-router-dom";
import Search from "@/pages/search/Search";

const AllReviews = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId') || 'mock-user-1';
  const skillId = searchParams.get('skillId') || 'mock-skill-1';
  
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("recent");
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllUserSkillReviews(userId, skillId);
        setReviews(data?.review || data?.reviews || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load reviews');
        console.error('Error loading reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId, skillId]);

  const filteredReviews = reviews.filter((review) => {
    if (selectedRating === null) return true;
    return Math.floor(review?.overallRating || 0) === selectedRating;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime();
    }
    if (sortBy === "rating") {
      return (b?.overallRating || 0) - (a?.overallRating || 0);
    }
    return 0;
  });

  return (
    <div className="bg-white flex flex-col min-h-screen">
      <Header />
      
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 py-6 sm:py-8 flex-grow">
        {/* Title */}
        <h1 className="text-text-primary text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">All Reviews</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-[10px] p-4 sm:p-6 mb-6 sm:mb-8">
            <p className="text-red-600 font-semibold">Error loading reviews</p>
            <p className="text-red-500 text-sm mt-2">{error}</p>
          </div>
        )}

        {loading && (
          <div className="space-y-3 sm:space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-[10px] shadow-lg p-4">
                <div className="flex gap-2 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-full animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && reviews.length === 0 && (
          <div className="bg-white rounded-[10px] shadow-lg p-4 sm:p-6 text-center">
            <p className="text-gray-500">No reviews available</p>
          </div>
        )}

        {!loading && !error && reviews.length > 0 && (
          <>
            {/* Filter and Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8 items-start sm:items-center sm:justify-between">
              {/* Rating Filter */}
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
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 0l2.5 5h5.5l-4.5 3.5 1.5 5-5-3.5-5 3.5 1.5-5-4.5-3.5h5.5z" />
                      </svg>
                    </button>
                  ))}
                  {selectedRating !== null && (
                    <button
                      onClick={() => setSelectedRating(null)}
                      className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-[8px] bg-neutral-background2 text-text-primary hover:opacity-70 transition text-xs sm:text-sm"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Sort */}
              <div className="flex gap-2 sm:gap-3 items-center w-full sm:w-auto">
                <button
                
              onClick={() => navigate('/search')}
              className="flex gap-2 bg-gray p-2 hover:bg-primary x-100 rounded-lg"
              aria-label="Search"
            >
              Search
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3c2.5 0 4.7 1.1 6.3 2.8m-1.8 8.9a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            
            </button>
                <p className="text-text-primary font-semibold text-sm">Sort by:</p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2 sm:px-4 py-1.5 sm:py-2 rounded-[8px] border border-neutral-border text-text-primary focus:outline-none text-xs sm:text-sm"
                >
                  <option value="recent">Most Recent</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-[#666] text-xs sm:text-sm mb-4 sm:mb-6">
              Showing {sortedReviews.length} of {reviews.length} reviews
              {selectedRating && ` (${selectedRating} star)`}
            </p>

            {/* Review Cards */}
            <div className="space-y-3 sm:space-y-4">
              {sortedReviews.map((review, index) => (
                <div key={review?.id || index} className="bg-white rounded-[10px] shadow-lg p-4 sm:p-6">
                  <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4">
                    {/* Reviewer Avatar */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={review?.reviewer?.image || 'https://via.placeholder.com/48'}
                        alt={review?.reviewer?.userName || 'Reviewer'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Reviewer Info */}
                    <div className="flex-1">
                      <p className="text-text-primary font-semibold text-sm sm:text-base">
                        {review?.reviewer?.userName || 'Anonymous'}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                                i < Math.floor(review?.overallRating || 0)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 0l2.5 5h5.5l-4.5 3.5 1.5 5-5-3.5-5 3.5 1.5-5-4.5-3.5h5.5z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-text-primary text-xs sm:text-sm font-semibold">
                          {review?.overallRating || 'N/A'}
                        </p>
                      </div>
                      <p className="text-[#666] text-xs mt-1">
                        {review?.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>

                  {/* Review Content */}
                  <p className="text-[#666] text-sm sm:text-base lg:text-lg mb-2 sm:mb-3">
                    "{review?.comment || 'No comment provided'}"
                  </p>

                  {/* Review Metadata */}
                  {review?.isVerified && (
                    <div className="flex items-center gap-2 pt-2 sm:pt-3 border-t border-neutral-border">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                      </svg>
                      <p className="text-green-600 text-xs sm:text-xs font-semibold">Verified Purchase</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AllReviews;
