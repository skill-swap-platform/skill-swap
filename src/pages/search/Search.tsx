import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header/Header";
import FiltersSidebar from "@/components/Search/FiltersSidebar";
import { searchSkills, discoverSkills } from "@/services/exploreService";
import type { SearchResultItem, DiscoverResultItem } from "@/services/exploreService";

type ResultItem = SearchResultItem | DiscoverResultItem;

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleApplyFilters = async () => {
    setAppliedFilters({ ...filters });
    setShowFilters(false);

    // If filters applied, use discover endpoint
    const hasActiveFilters =
      filters.availability.length > 0 ||
      filters.language !== "" ||
      filters.difficultyLevel.length > 0;

    if (hasActiveFilters) {
      try {
        setLoading(true);
        setError(null);
        // Map availability filter to API value
        const availabilityMap: Record<string, string> = {
          weekends: "WEEKENDS",
          morning: "MORNING",
          evening: "EVENING",
          flexible: "FLEXIBLE",
        };
        const availability = filters.availability.length > 0
          ? availabilityMap[filters.availability[0]] ?? undefined
          : undefined;
        const level = filters.difficultyLevel.length > 0
          ? filters.difficultyLevel[0].toUpperCase()
          : undefined;
        const data = await discoverSkills({
          availability,
          language: filters.language || undefined,
          level,
        });
        setRecommendations(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to apply filters");
        console.error("Error applying filters:", err);
      } finally {
        setLoading(false);
      }
    } else {
      loadRecommendations();
    }
  };

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await searchSkills("", 1, 20);
      setRecommendations(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load recommendations");
      console.error("Error loading recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  // Live search while typing
  useEffect(() => {
    if (!searchQuery.trim()) {
      loadRecommendations();
      return;
    }
    const debounce = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await searchSkills(searchQuery.trim(), 1, 20);
        setRecommendations(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to search");
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSearch = (query?: string) => {
    const q = query || searchQuery;
    if (q.trim()) {
      const updated = [q, ...recentSearches.filter((s) => s !== q)].slice(0, 4);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
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

  const handleViewDetails = (skillId: string, userId: string) => {
    navigate(`/explore/${skillId}/${userId}`);
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
                  if (e.key === "Enter") handleSearch();
                }}
                className="flex-1 bg-transparent outline-none text-text-primary text-base"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600">
                  ×
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSearch()}
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Search"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button
                onClick={() => setShowFilters((s) => !s)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Toggle filters"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h18M6 12h12M10 19h4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-text-primary">Recent Search</h3>
                <button onClick={clearAllSearches} className="text-sm text-gray-600 hover:text-text-primary">
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <div key={index} className="flex items-center gap-2 bg-bg-secondary rounded-full px-3 py-1 h-6">
                    <button onClick={() => handleSearch(search)} className="text-sm text-gray-600 hover:text-text-primary">
                      {search}
                    </button>
                    <button onClick={() => clearSearch(index)} className="text-gray-600 hover:text-text-primary text-lg leading-none">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Results Grid */}
          {loading ? (
            <div className="grid grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-200 h-64 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            <>
              {searchQuery.trim() !== "" && (
                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-semibold text-gray-600">
                    {recommendations.length} Results found
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-8">
                {recommendations.slice(0, 6).map((rec, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                  >
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="flex gap-4 items-start">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex-shrink-0 flex items-center justify-center text-white text-2xl font-bold">
                          {rec.user?.userName?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1">
                          <div className="flex gap-2 items-start mb-1">
                            <h4 className="text-xl font-semibold text-text-primary">
                              {rec.user?.userName}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600">{rec.user?.bio}</p>
                          <div className="flex gap-4 mt-2 text-sm">
                            <div className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 0l2.5 5h5.5l-4.5 3.5 1.5 5-5-3.5-5 3.5 1.5-5-4.5-3.5h5.5z" />
                              </svg>
                              <span className="text-text-primary">{rec.user?.rating?.toFixed(1) ?? "N/A"}</span>
                            </div>
                            <span className="text-gray-600">
                              · {(rec.user?.receivedSwaps ?? 0) + (rec.user?.sentSwaps ?? 0)} swaps
                            </span>
                            <span className="text-gray-600 capitalize">
                              · {rec.user?.level?.toLowerCase()}
                            </span>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-text-primary">🔖</button>
                      </div>

                      {/* Skill Info */}
                      <div className="space-y-2">
                        <h5 className="text-lg font-semibold text-text-primary">{rec.skill?.name}</h5>
                        <p className="text-sm text-gray-600">{rec.skill?.description}</p>
                      </div>

                      {/* Category */}
                      {rec.skill?.category && (
                        <div className="flex gap-2 flex-wrap">
                          <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-lg">
                            {rec.skill.category.name}
                          </span>
                          {rec.skill?.language && (
                            <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-lg">
                              {rec.skill.language}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Button */}
                      <button
                        onClick={() => handleViewDetails(rec.skill?.id ?? "", rec.user?.id ?? "")}
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
              <p className="text-xl font-semibold text-gray-600 mb-2">No skills found</p>
              <p className="text-gray-500">Try adjusting your search query or browse all skills</p>
            </div>
          )}
        </div>

        {/* Filters Sidebar */}
        {showFilters && (
          <>
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
    </div>
  );
};

export default Search;
