import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header/Header";
import { searchSkills } from "@/services/exploreService";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const [sortBy, setSortBy] = useState("recent");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        const data = await searchSkills(query);
        setResults(data || []);
      } catch (error) {
        console.error("Error loading search results:", error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [query]);

  const handleViewDetails = (id: string) => {
    navigate(`/profiles/${id}`);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    // Sort results based on selection
    let sorted = [...results];
    if (value === "rating") {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (value === "popular") {
      sorted.sort((a, b) => (b.swaps || 0) - (a.swaps || 0));
    }
    setResults(sorted);
  };

  const sortedResults = results.slice().sort((a, b) => {
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "popular") return (b.swaps || 0) - (a.swaps || 0);
    return 0;
  });

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <div className="max-w-screen-xl mx-auto px-20 py-8 space-y-8">
        {/* Search Bar */}
        <div className="flex gap-4 h-12">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg px-4 py-2">
            <svg
              className="w-4 h-4 text-gray-400"
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
            <span className="text-text-primary font-semibold">{query}</span>
          </div>
          <button
            onClick={() => navigate("/search")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
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
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-gray-600">
            {sortedResults.length} Results found
          </p>
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2">
            <svg
              className="w-6 h-6 text-gray-400"
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
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="outline-none text-text-primary font-semibold"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : sortedResults.length > 0 ? (
          <div className="grid grid-cols-2 gap-8">
            {sortedResults.map((rec) => (
              <div
                key={rec.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex gap-4 items-start">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex-shrink-0 flex items-center justify-center text-white text-2xl font-bold">
                      {rec.name?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-2 items-start mb-1">
                        <h4 className="text-xl font-semibold text-text-primary">
                          {rec.name}
                        </h4>
                        <span className="text-gray-400">★</span>
                      </div>
                      <p className="text-sm text-gray-600">{rec.title}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-3.5 h-3.5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 0l2.5 5h5.5l-4.5 3.5 1.5 5-5-3.5-5 3.5 1.5-5-4.5-3.5h5.5z" />
                          </svg>
                          <span className="text-text-primary">{rec.rating}</span>
                        </div>
                        <span className="text-gray-600">· {rec.swaps} swaps</span>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-text-primary">
                      🔖
                    </button>
                  </div>

                  {/* Title and Description */}
                  <div className="space-y-2">
                    <h5 className="text-lg font-semibold text-text-primary">
                      {rec.skillTitle}
                    </h5>
                    <p className="text-sm text-gray-600">{rec.description}</p>
                  </div>

                  {/* Skills */}
                  <div className="flex gap-2 flex-wrap">
                    {rec.skills?.slice(0, 3).map((skill: string) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => handleViewDetails(rec.id)}
                    className="w-full bg-primary text-white py-2 rounded-xl text-xs font-medium hover:bg-opacity-90 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No results found for "{query}"</p>
            <button
              onClick={() => navigate("/search")}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
            >
              Back to Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
