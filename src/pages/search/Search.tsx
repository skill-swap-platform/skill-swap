import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header/Header";
import FiltersSidebar from "@/components/Search/FiltersSidebar";
import { searchSkills } from "@/services/exploreService";

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    skillType: [] as string[],
    availability: ["weekends"] as string[],
    language: "",
    difficultyLevel: [] as string[],
  });
  const [appliedFilters, setAppliedFilters] = useState(() => ({
    skillType: [] as string[],
    availability: ["weekends"] as string[],
    language: "",
    difficultyLevel: [] as string[],
  }));

  const handleToggleFilter = (category: string, value: string) => {
    setFilters({
      ...filters,
      [category]: (filters[category as keyof typeof filters] as string[]).includes(value)
        ? (filters[category as keyof typeof filters] as string[]).filter((item) => item !== value)
        : [...(filters[category as keyof typeof filters] as string[]), value],
    });
  };

  const clearAllFilters = () => {
    setFilters({
      skillType: [],
      availability: ["weekends"],
      language: "",
      difficultyLevel: [],
    });
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setShowFilters(false);
  };

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
    // Load initial recommendations
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const data = await searchSkills("");
      setRecommendations(data || []);
    } catch (error) {
      console.error("Error loading recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter recommendations based on search query and applied filters
  const filteredRecommendations = ((): any[] => {
    const q = searchQuery.trim().toLowerCase();
    return recommendations.filter((rec) => {
      // Search query matching
      const matchesQuery =
        q === "" ||
        rec.name.toLowerCase().includes(q) ||
        rec.skillTitle.toLowerCase().includes(q) ||
        rec.description.toLowerCase().includes(q) ||
        rec.skills?.some((skill: string) => skill.toLowerCase().includes(q)) ||
        rec.title.toLowerCase().includes(q);
      if (!matchesQuery) return false;

      // Language filter (if backend provides `language` on rec)
      if (appliedFilters.language) {
        const recLang = (rec.language || "").toLowerCase();
        if (recLang && recLang !== appliedFilters.language.toLowerCase()) return false;
      }

      // Skill type heuristic: "learning" matches descriptions that contain 'learn' or 'seeking'
      if (appliedFilters.skillType.length > 0) {
        const ok = appliedFilters.skillType.some((t) => {
          const low = t.toLowerCase();
          if (low === "learning") return /learn|seeking/i.test(rec.description || "") || /learn/i.test(rec.skillTitle || "");
          if (low === "offering") return !/learn|seeking/i.test(rec.description || "");
          return true; // both
        });
        if (!ok) return false;
      }

      // Difficulty level heuristic: match keywords in title/description
      if (appliedFilters.difficultyLevel.length > 0) {
        const ok = appliedFilters.difficultyLevel.some((lvl) =>
          (rec.skillTitle || "").toLowerCase().includes(lvl.toLowerCase()) ||
          (rec.description || "").toLowerCase().includes(lvl.toLowerCase()),
        );
        if (!ok) return false;
      }

      // Availability: data not present in mock, skip unless matching field exists
      if (appliedFilters.availability.length > 0 && rec.availability) {
        const ok = appliedFilters.availability.some((a) => (rec.availability || []).includes(a));
        if (!ok) return false;
      }

      return true;
    });
  })();

  const handleSearch = (query?: string) => {
    const q = query || searchQuery;
    if (q.trim()) {
      // Add to recent searches
      const updated = [q, ...recentSearches.filter((s) => s !== q)].slice(0, 4);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      
      // Set search query to filter results locally
      setSearchQuery(q);
    }
  };

  const clearSearch = (index: number) => {
    const updated = recentSearches.filter((_, i) => i !== index);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const clearAllSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handleViewDetails = (name: string, id: string) => {
    navigate(`/profiles/${id}`);
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <div className="max-w-screen-xl mx-auto px-6 py-8 relative">
        <div>
        {/* Search Bar */}
        <div className="flex gap-4 h-12 mb-8">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-primary rounded-lg px-4 py-2">
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
            <input
              type="text"
              placeholder="Search for a skill (e.g. UX, Coding...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="flex-1 bg-transparent outline-none text-text-primary text-base "
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSearch()}
              className="p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Search"
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

            <button
              onClick={() => setShowFilters((s) => !s)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Toggle filters"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h18M6 12h12M10 19h4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Recent Searches Section */}
        {recentSearches.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-text-primary">
                Recent Search
              </h3>
              <button
                onClick={clearAllSearches}
                className="text-sm text-gray-600 hover:text-text-primary"
              >
                Clear all
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-bg-secondary rounded-full px-3 py-1 h-6"
                >
                  <button
                    onClick={() => handleSearch(search)}
                    className="text-sm text-gray-600 hover:text-text-primary"
                  >
                    {search}
                  </button>
                  <button
                    onClick={() => clearSearch(index)}
                    className="text-gray-600 hover:text-text-primary text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredRecommendations.length > 0 ? (
          <>
            {searchQuery.trim() !== "" && (
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-gray-600">
                  {filteredRecommendations.length} Results found
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-8">
              {filteredRecommendations.slice(0, 6).map((rec) => (
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
                    onClick={() => handleViewDetails(rec.name, rec.id)}
                    className="w-full bg-primary text-white py-2 rounded-xl text-xs font-medium hover:bg-opacity-90 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-xl font-semibold text-gray-600 mb-2">
              No skills found
            </p>
            <p className="text-gray-500">
              Try adjusting your search query or browse all skills
            </p>
          </div>
        )}
      </div>

        </div>

        {/* Sidebar: appears as a side panel (pushes content on large screens, stacks on small screens) */}
        {showFilters && (
          <>
            {/* Desktop: absolute sidebar to the right of content (doesn't push layout) */}
            <div className="hidden lg:block absolute top-28 right-0 z-40">
              <div className="w-96">
                <FiltersSidebar
                  filters={filters}
                  onToggleFilter={handleToggleFilter}
                  onChangeLanguage={(lang) => setFilters({ ...filters, language: lang })}
                  onClear={clearAllFilters}
                  onApply={handleApplyFilters}
                  onClose={() => setShowFilters(false)}
                />
              </div>
            </div>

            {/* Mobile: fixed bottom sheet that overlays (stacks but doesn't push content) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
              <div className="bg-white border-t border-gray-200 p-4 rounded-t-xl shadow-lg">
                <FiltersSidebar
                  filters={filters}
                  onToggleFilter={handleToggleFilter}
                  onChangeLanguage={(lang) => setFilters({ ...filters, language: lang })}
                  onClear={clearAllFilters}
                  onApply={handleApplyFilters}
                  onClose={() => setShowFilters(false)}
                />
              </div>
            </div>
          </>
        )}
      </div>
  );
};

export default Search;
