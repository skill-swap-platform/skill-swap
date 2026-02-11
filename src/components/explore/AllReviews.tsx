import { useState } from "react";
import { Header } from "../Header";
import { Footer } from "../Footer";

const AllReviews = () => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("recent");

  const reviews = [
    {
      id: 1,
      author: "Emma Rodriguez",
      rating: 4.8,
      text: '" Emma was incredibly patient and clear, Highly recommended for React skills"',
      helpful: "1.5K",
    },
    {
      id: 2,
      author: "Emma Rodriguez",
      rating: 4.8,
      text: '" Emma was incredibly patient and clear, Highly recommended for React skills"',
      helpful: "1.5K",
    },
    {
      id: 3,
      author: "Emma Rodriguez",
      rating: 4.8,
      text: '" Emma was incredibly patient and clear, Highly recommended for React skills"',
      helpful: "1.5K",
    },
    {
      id: 4,
      author: "Emma Rodriguez",
      rating: 4.8,
      text: '" Emma was incredibly patient and clear, Highly recommended for React skills"',
      helpful: "1.5K",
    },
  ];
  const filteredReviews = reviews.filter((review) => {
    if (selectedRating === null) return true;
    return Math.floor(review.rating) === selectedRating;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "recent") {
      return b.id - a.id;
    }
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    return 0;
  });
  return (
    <div className="bg-white flex flex-col items-center min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="w-full max-w-6xl px-20 py-8 flex flex-col gap-8">
        {/* Skill Header Card */}
        <div className="bg-neutral-background border border-neutral-border rounded-[5px] p-6 flex flex-col gap-4">
          <h1 className="text-text-primary text-4xl font-bold">
            Photography Basics
          </h1>

          {/* Rating and Provider Info */}
          <div className="flex gap-4 items-center">
            {/* Rating */}
            <div className="flex items-center gap-1 py-2 px-1">
              <svg
                className="w-3.5 h-3.5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 0l2.5 5h5.5l-4.5 3.5 1.5 5-5-3.5-5 3.5 1.5-5-4.5-3.5h5.5z" />
              </svg>
              <p className="text-text-primary text-sm">4.9</p>
              <p className="text-[#666] text-sm">(50 reviews)</p>
            </div>

            {/* Provider */}
            <div className="flex items-center gap-1">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-[#666] text-sm">Offered by</p>
              <p className="text-text-primary text-sm font-semibold">
                Alex River
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="border-l-[1.5px] border-chip_text px-2 py-2">
            <p className="text-text-primary text-lg">
              Learn the core concepts of aperture, shutter speed, and ISO. By
              the end of this session, you will be able to shoot in manual mode
              and understand composition rules. This is a foundational session
              perfect for new camera owners.
            </p>
          </div>
        </div>

        {/* Reviews Filter and Sort */}
        <div className="flex flex-col gap-4">
          <div className="border border-neutral-border rounded-[5px] p-4 flex gap-4 items-center">
            {/* Rating Filter Buttons */}
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setSelectedRating(null)}
                className={`h-6 px-2 rounded-[10px] text-sm font-inter transition ${
                  selectedRating === null
                    ? "bg-tint-fill border border-chip_text text-chip_text"
                    : "border border-[#9ca3af] text-[#9ca3af]"
                }`}
              >
                All
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(rating)}
                  className={`h-6 px-2 rounded-[10px] text-sm font-inter border transition flex items-center gap-1 ${
                    selectedRating === rating
                      ? "border-chip_text text-chip_text bg-tint-fill"
                      : "border-[#9ca3af] text-[#9ca3af]"
                  }`}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0l2.5 5h5.5l-4.5 3.5 1.5 5-5-3.5-5 3.5 1.5-5-4.5-3.5h5.5z" />
                  </svg>
                  {rating}
                </button>
              ))}
            </div>

            {/* Search and Sort */}
            <div className="flex gap-4 items-center flex-1 justify-end">
              <div className="border border-neutral-border rounded-[8px] h-10 px-4 flex items-center">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <div
                onClick={() =>
                  setSortBy(sortBy === "recent" ? "rating" : "recent")
                }
                className="border border-neutral-border rounded-[8px] h-10 px-4 flex items-center gap-2 cursor-pointer"
              >
                <svg
                  className="w-6 h-6 text-text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
                <p className="text-text-primary text-lg font-inter">
                  {sortBy === "recent" ? "Most Recent" : "Highest Rating"}
                </p>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="flex flex-col gap-6">
            {sortedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-[10px] shadow-lg p-4 flex flex-col gap-3"
              >
                {/* Review Header */}
                <div className="flex gap-2 items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src="https://via.placeholder.com/48"
                      alt={review.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-text-primary font-semibold text-lg">
                      {review.author}
                    </p>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 0l2.5 5h5.5l-4.5 3.5 1.5 5-5-3.5-5 3.5 1.5-5-4.5-3.5h5.5z" />
                      </svg>
                      <p className="text-text-primary text-sm">
                        {review.rating}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-[#666] text-lg">{review.text}</p>

                {/* Helpful Link */}
                <p className="text-chip_text text-sm">
                  {review.helpful} see this comment helpful
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllReviews;
