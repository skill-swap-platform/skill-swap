import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header/Header";
import FiltersSidebar from "@/components/Search/FiltersSidebar";
import {
  discoverSkills,
  getSkillIdentifier,
  getUserIdentifier,
  searchSkills,
  type ExploreResultItem,
} from "@/services/exploreService";

type FilterState = {
  skillType: string[];
  availability: string[];
  language: string;
  difficultyLevel: string[];
};

const defaultFilters: FilterState = {
  skillType: [],
  availability: [],
  language: "",
  difficultyLevel: [],
};

const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<ExploreResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "rating">("recent");

  const hasActiveFilters =
    filters.availability.length > 0 ||
    filters.language.trim().length > 0 ||
    filters.difficultyLevel.length > 0;

  const loadDiscoverRecommendations = async () => {
    const data = await discoverSkills({ page: 1, limit: 20 });
    setRecommendations(data);
  };

  const loadSearchResults = async (query: string) => {
    const data = await searchSkills(query, 1, 20);
    setRecommendations(data);
  };

  const loadCurrentResults = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      if (query.trim()) {
        await loadSearchResults(query.trim());
      } else if (hasActiveFilters) {
        const availabilityMap: Record<string, string> = {
          weekends: "WEEKENDS",
          morning: "MORNING",
          evening: "EVENING",
          flexible: "FLEXIBLE",
        };

        const levelMap: Record<string, string> = {
          beginner: "BEGINNER",
          intermediate: "INTERMEDIATE",
          advance: "ADVANCED",
          advanced: "ADVANCED",
          expert: "ADVANCED",
        };

        const availability =
          filters.availability.length > 0
            ? availabilityMap[filters.availability[0]] || undefined
            : undefined;
        const level =
          filters.difficultyLevel.length > 0
            ? levelMap[filters.difficultyLevel[0]] || undefined
            : undefined;

        const data = await discoverSkills({
          availability,
          language: filters.language || undefined,
          level,
          page: 1,
          limit: 20,
        });
        setRecommendations(data);
      } else {
        await loadDiscoverRecommendations();
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load results");
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      void loadCurrentResults(searchQuery);
    }, 350);
    return () => clearTimeout(debounce);
  }, [filters, searchQuery]);

  const handleToggleFilter = (category: string, value: string) => {
    const key = category as keyof FilterState;
    const current = filters[key];

    if (!Array.isArray(current)) {
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [key]: current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    }));
  };

  const clearAllFilters = () => {
    setFilters(defaultFilters);
  };

  const handleApplyFilters = () => {
    setShowFilters(false);
    void loadCurrentResults(searchQuery);
  };

  const handleSearch = (query?: string) => {
    const q = (query || searchQuery).trim();
    setSearchQuery(q);

    if (q.length === 0) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("q");
      setSearchParams(nextParams, { replace: true });
      return;
    }

    const updated = [q, ...recentSearches.filter((s) => s !== q)].slice(0, 4);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    setSearchParams({ q }, { replace: true });
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

  const sortedRecommendations = useMemo(() => {
    return [...recommendations].sort((a, b) => {
      if (sortBy === "rating") {
        const ar = a.user.rating ?? a.user.avgRate ?? a.user.avarage ?? 0;
        const br = b.user.rating ?? b.user.avgRate ?? b.user.avarage ?? 0;
        return br - ar;
      }

      if (sortBy === "popular") {
        const asw = (a.user.receivedSwaps ?? 0) + (a.user.sentSwaps ?? 0);
        const bsw = (b.user.receivedSwaps ?? 0) + (b.user.sentSwaps ?? 0);
        return bsw - asw;
      }

      return 0;
    });
  }, [recommendations, sortBy]);

  const renderCard = (item: ExploreResultItem, idx: number) => {
    const skillId = getSkillIdentifier(item.skill);
    const userId = getUserIdentifier(item.user);
    const canViewDetails = Boolean(skillId && userId);
    const rating = item.user.rating ?? item.user.avgRate ?? item.user.avarage;
    const swaps = (item.user.receivedSwaps ?? 0) + (item.user.sentSwaps ?? 0);

    return (
      <div
        key={`${item.user.userName}-${item.skill.name}-${idx}`}
        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
              {item.user.userName?.charAt(0) || "U"}
            </div>
            <div>
              <h4 className="text-2xl font-semibold text-text-primary">{item.user.userName}</h4>
              <p className="text-[#666]">{item.user.level || "Skill Provider"}</p>
              <div className="flex items-center gap-2 mt-1 text-sm text-[#666]">
                <span className="text-yellow-500">★</span>
                <span>{rating ? Number(rating).toFixed(1) : "N/A"}</span>
                <span>•</span>
                <span>{swaps} swaps</span>
              </div>
            </div>
          </div>
          <button type="button" className="text-gray-400 hover:text-text-primary" aria-label="Bookmark">
            ♡
          </button>
        </div>

        <div className="mt-4">
          <h5 className="text-xl font-semibold text-text-primary">{item.skill.name}</h5>
          <p className="text-[#666] mt-1">{item.skill.description || "No description available"}</p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {item.skill.category?.name ? (
            <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-lg">
              {item.skill.category.name}
            </span>
          ) : null}
          {item.skill.language ? (
            <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-lg">
              {item.skill.language}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (!canViewDetails) return;
              navigate(`/explore/${skillId}/${userId}`);
            }}
            disabled={!canViewDetails}
            className="min-w-[128px] bg-primary text-white py-2 rounded-xl text-xs font-medium hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            View Details
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen">
      <Header activeTab="Explore" />

      <div className="max-w-screen-xl mx-auto px-6 py-8 relative">
        <div>
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="flex-1 bg-transparent outline-none text-text-primary text-base"
              />
              {searchQuery ? (
                <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600">
                  x
                </button>
              ) : null}
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

          {recentSearches.length > 0 ? (
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
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          ) : null}

          {!loading && sortedRecommendations.length > 0 ? (
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-semibold text-gray-600">
                {sortedRecommendations.length} Results found
              </p>
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "recent" | "popular" | "rating")}
                  className="outline-none text-text-primary font-semibold"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>
          ) : null}

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-200 h-48 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : sortedRecommendations.length > 0 ? (
            <div className="space-y-4">{sortedRecommendations.map(renderCard)}</div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-xl font-semibold text-gray-600 mb-2">No skills found</p>
              <p className="text-gray-500">Try adjusting your search query or filters</p>
            </div>
          )}
        </div>

        {showFilters ? (
          <>
            <div className="hidden lg:block absolute top-28 right-0 z-40">
              <div className="w-96">
                <FiltersSidebar
                  filters={filters}
                  onToggleFilter={handleToggleFilter}
                  onChangeLanguage={(lang) => setFilters((prev) => ({ ...prev, language: lang }))}
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
                  onChangeLanguage={(lang) => setFilters((prev) => ({ ...prev, language: lang }))}
                  onClear={clearAllFilters}
                  onApply={handleApplyFilters}
                  onClose={() => setShowFilters(false)}
                />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Search;
