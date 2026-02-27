import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Footer, Header } from "@/components";
import {
  getAllUserSkillReviews,
  getSkillDetails,
  type Review,
  type SkillDetailsResponse,
} from "@/services";

const STAR_FILTERS = [5, 4, 3, 2, 1] as const;

const toNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const compactNumberFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const formatHelpfulText = (review: Review): string => {
  const reviewWithHelpful = review as Review & {
    helpfulCount?: unknown;
    helpful?: unknown;
    likes?: unknown;
  };

  const helpfulCount = Math.max(
    0,
    Math.floor(
      toNumber(
        reviewWithHelpful.helpfulCount ??
          reviewWithHelpful.helpful ??
          reviewWithHelpful.likes ??
          0,
      ),
    ),
  );

  if (helpfulCount > 0) {
    return `${compactNumberFormatter.format(helpfulCount)} see this comment helpful`;
  }

  if (review.createdAt) {
    return new Date(review.createdAt).toLocaleDateString();
  }

  return "";
};

const StarIcon = ({
  className = "h-4 w-4",
  fill = "#FFA412",
}: {
  className?: string;
  fill?: string;
}) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
    <path
      d="M8 1.8L9.86 5.57L14.02 6.17L11.01 9.1L11.72 13.24L8 11.28L4.28 13.24L4.99 9.1L1.98 6.17L6.14 5.57L8 1.8Z"
      fill={fill}
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    viewBox="0 0 16 16"
    className="h-4 w-4 text-text-disabled"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M7.16 12.32C10.01 12.32 12.32 10.01 12.32 7.16C12.32 4.31 10.01 2 7.16 2C4.31 2 2 4.31 2 7.16C2 10.01 4.31 12.32 7.16 12.32Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 14L11.19 11.19"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5 text-text-primary"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M6 9L12 15L18 9"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AllReviews = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId") || "";
  const skillId = searchParams.get("skillId") || "";
  const hasRequiredParams = Boolean(userId && skillId);

  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "rating">("recent");
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [details, setDetails] = useState<SkillDetailsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      if (!hasRequiredParams) {
        setReviews([]);
        setDetails(null);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      const [reviewsResult, detailsResult] = await Promise.allSettled([
        getAllUserSkillReviews(userId, skillId),
        getSkillDetails(skillId, userId),
      ]);

      let nextError: string | null = null;

      if (reviewsResult.status === "fulfilled") {
        setReviews(reviewsResult.value.reviews ?? []);
      } else {
        setReviews([]);
        const reviewsError = reviewsResult.reason as {
          response?: { data?: { message?: string } };
        };
        nextError = reviewsError?.response?.data?.message || "Failed to load reviews";
      }

      if (detailsResult.status === "fulfilled") {
        setDetails(detailsResult.value);
      } else {
        setDetails(null);
        if (!nextError) {
          const detailsError = detailsResult.reason as {
            response?: { data?: { message?: string } };
          };
          nextError =
            detailsError?.response?.data?.message || "Failed to load skill details";
        }
      }

      setError(nextError);
      setLoading(false);
    };

    void fetchPageData();
  }, [hasRequiredParams, skillId, userId]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) {
      const provider = details?.provider;
      return toNumber(provider?.rating ?? provider?.avgRate ?? provider?.avarage ?? 0);
    }

    const total = reviews.reduce((sum, review) => sum + toNumber(review.overallRating), 0);
    return total / reviews.length;
  }, [details?.provider, reviews]);

  const totalReviewsCount = useMemo(() => {
    const fromDetails = toNumber(details?.reviews?.count ?? 0);
    return Math.max(fromDetails, reviews.length);
  }, [details?.reviews?.count, reviews.length]);

  const visibleReviews = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = reviews.filter((review) => {
      const rating = toNumber(review.overallRating);
      const matchesRating = selectedRating === null || Math.floor(rating) === selectedRating;

      if (!matchesRating) {
        return false;
      }

      if (!query) {
        return true;
      }

      const reviewerName = review.reviewer?.userName?.toLowerCase() || "";
      const comment = review.comment?.toLowerCase() || "";
      return reviewerName.includes(query) || comment.includes(query);
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "rating") {
        return toNumber(b.overallRating) - toNumber(a.overallRating);
      }

      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [reviews, searchTerm, selectedRating, sortBy]);

  const providerName = details?.provider?.userName || "Unknown provider";
  const providerImage = details?.provider?.image || "https://via.placeholder.com/48";
  const skillName = details?.skill?.name || "Skill";
  const skillDescription =
    details?.skillDescription || details?.skill?.description || "No skill description available.";

  return (
    <div className="bg-neutral-background min-h-screen flex flex-col">
      <Header activeTab="Explore" />

      <main className="w-full max-w-[1440px] mx-auto flex-1 px-4 sm:px-6 lg:px-10 xl:px-20 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {!hasRequiredParams ? (
            <div className="bg-amber-50 border border-amber-200 rounded-sm p-6">
              <p className="text-amber-700 font-semibold">Missing review context</p>
              <p className="text-amber-700 text-sm mt-2">
                Open this page from Explore using a specific provider and skill.
              </p>
            </div>
          ) : null}

          {hasRequiredParams ? (
            <section className="bg-neutral-background border border-neutral-border rounded-sm p-6">
              {loading ? (
                <div className="space-y-4">
                  <div className="h-9 bg-gray-200 rounded w-64 animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded w-52 animate-pulse" />
                  <div className="h-12 bg-gray-200 rounded w-full animate-pulse" />
                </div>
              ) : (
                <>
                  <h1 className="text-text-primary text-3xl font-bold leading-none">{skillName}</h1>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px]">
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-[14px] w-[14px]" />
                      <p className="text-text-primary">{averageRating.toFixed(1)}</p>
                      <p className="text-text-secondary">({totalReviewsCount} reviews)</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="h-6 w-6 rounded-full overflow-hidden bg-[#e5e7eb]">
                        <img
                          src={providerImage}
                          alt={providerName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="text-text-secondary">Offered by</p>
                      <p className="text-text-primary text-sm">{providerName}</p>
                    </div>
                  </div>

                  <div className="mt-4 border-l-[1.5px] border-primary pl-2">
                    <p className="text-text-primary text-base leading-[1.25]">{skillDescription}</p>
                  </div>
                </>
              )}
            </section>
          ) : null}

          {hasRequiredParams ? (
            <section className="space-y-4">
              <div className="bg-white border border-neutral-border rounded-sm p-4 flex flex-col gap-4 lg:flex-row lg:flex-nowrap lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRating(null)}
                    className={`h-6 px-2 rounded-[10px] border text-sm transition ${
                      selectedRating === null
                        ? "border-primary bg-[rgba(0,122,255,0.15)] text-primary"
                        : "border-text-disabled text-text-disabled hover:border-primary hover:text-primary"
                    }`}
                  >
                    All
                  </button>

                  {STAR_FILTERS.map((rating) => (
                    <button
                      type="button"
                      key={rating}
                      onClick={() => setSelectedRating(rating)}
                      className={`h-6 px-2 rounded-[10px] border text-sm transition flex items-center gap-1 ${
                        selectedRating === rating
                          ? "border-primary bg-[rgba(0,122,255,0.15)] text-primary"
                          : "border-text-disabled text-text-disabled hover:border-primary hover:text-primary"
                      }`}
                    >
                      <StarIcon
                        className="h-[14px] w-[14px]"
                        fill={selectedRating === rating ? "#3272A3" : "#FFA412"}
                      />
                      {rating}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                  <label className="h-10 border border-neutral-border rounded flex items-center px-4 gap-2 w-full sm:w-[170px] md:w-[120px]">
                    <SearchIcon />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search reviews"
                      className="w-full text-sm bg-transparent text-text-primary placeholder:text-text-disabled focus:outline-none"
                    />
                  </label>

                  <div className="relative h-10 border border-neutral-border rounded flex items-center px-3 gap-1 w-full sm:w-[150px]">
                    <select
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value as "recent" | "rating")}
                      className="appearance-none bg-transparent w-full text-base text-text-primary focus:outline-none pr-5"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="rating">Highest Rating</option>
                    </select>
                    <ChevronDownIcon />
                  </div>
                </div>
              </div>

              {error ? (
                <div className="bg-red-50 border border-red-200 rounded-md p-6">
                  <p className="text-red-600 font-semibold">Error loading reviews</p>
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                </div>
              ) : null}

              {loading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="bg-white rounded-md p-4 shadow-[4px_4px_20px_0px_rgba(0,0,0,0.05)]"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : null}

              {!loading && !error && reviews.length === 0 ? (
                <div className="bg-white rounded-md p-6 text-center shadow-[4px_4px_20px_0px_rgba(0,0,0,0.05)]">
                  <p className="text-text-secondary">No reviews available</p>
                </div>
              ) : null}

              {!loading && !error && reviews.length > 0 && visibleReviews.length === 0 ? (
                <div className="bg-white rounded-md p-6 text-center shadow-[4px_4px_20px_0px_rgba(0,0,0,0.05)]">
                  <p className="text-text-secondary">No reviews match your current filters.</p>
                </div>
              ) : null}

              {!loading && !error && visibleReviews.length > 0 ? (
                <div className="space-y-6">
                  {visibleReviews.map((review) => {
                    const reviewerName = review.reviewer?.userName || "Anonymous";
                    const reviewerImage = review.reviewer?.image || "https://via.placeholder.com/48";
                    const rating = toNumber(review.overallRating);
                    const helpfulText = formatHelpfulText(review);

                    return (
                      <article
                        key={review.id}
                        className="bg-white rounded-md p-4 shadow-[4px_4px_20px_0px_rgba(0,0,0,0.05)]"
                      >
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
                              <p className="text-black text-lg font-semibold leading-none">
                                {reviewerName}
                              </p>
                              <div className="mt-1 flex items-center gap-1">
                                <StarIcon className="h-4 w-4" />
                                <p className="text-black text-xs leading-none">
                                  {rating.toFixed(1)}
                                </p>
                              </div>
                            </div>
                          </div>

                          <p className="text-text-secondary text-base leading-[1.25]">
                            &quot;{review.comment || "No comment provided"}&quot;
                          </p>

                          {helpfulText ? (
                            <p className="text-primary text-[13px] leading-none">{helpfulText}</p>
                          ) : null}
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : null}
            </section>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AllReviews;
