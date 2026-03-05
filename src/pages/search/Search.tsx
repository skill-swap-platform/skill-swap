import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Footer, Header } from "@/components";
import FiltersSidebar from "@/components/Search/FiltersSidebar";
import {
  discoverSkills,
  getSkillIdentifier,
  getUserIdentifier,
  searchSkills,
  type ExploreResultItem,
} from "@/services/exploreService";

type SkillTypeFilter = "learning" | "offering" | "both" | "";
type DifficultyFilter = "beginner" | "intermediate" | "advanced" | "";

type FilterState = {
  skillType: SkillTypeFilter;
  availability: string[];
  language: string;
  difficultyLevel: DifficultyFilter;
};

const defaultFilters: FilterState = {
  skillType: "",
  availability: [],
  language: "",
  difficultyLevel: "",
};

const availabilityMap: Record<string, string> = {
  weekends: "WEEKENDS",
  morning: "MORNING",
  evening: "EVENING",
  flexible: "FLEXIBLE",
};

const levelMap: Record<DifficultyFilter, string | undefined> = {
  "": undefined,
  beginner: "BEGINNER",
  intermediate: "INTERMEDIATE",
  advanced: "ADVANCED",
};

const skillTypeMap: Record<SkillTypeFilter, string | undefined> = {
  "": undefined,
  learning: "LEARNING",
  offering: "OFFERING",
  both: "BOTH",
};

const normalizeLanguage = (value?: string): string => {
  const normalized = value?.trim().toLowerCase() ?? "";
  if (!normalized) return "";

  if (
    normalized === "en" ||
    normalized === "eng" ||
    normalized === "english" ||
    normalized === "en-us" ||
    normalized === "en_uk"
  ) {
    return "english";
  }

  if (normalized === "ar" || normalized === "ara" || normalized === "arabic") {
    return "arabic";
  }

  if (normalized === "es" || normalized === "spa" || normalized === "spanish") {
    return "spanish";
  }

  if (normalized === "fr" || normalized === "fra" || normalized === "french") {
    return "french";
  }

  return normalized;
};

const toApiLanguage = (value?: string): string | undefined => {
  const normalized = normalizeLanguage(value);
  if (!normalized) return undefined;

  if (normalized === "english") return "English";
  if (normalized === "arabic") return "Arabic";
  if (normalized === "spanish") return "Spanish";
  if (normalized === "french") return "French";

  return value?.trim() || undefined;
};

const getLanguageFallbacks = (value?: string): string[] => {
  const first = toApiLanguage(value);
  if (!first) return [];

  const candidates = [first, first.toLowerCase(), first.toUpperCase()];
  if (first === "Arabic") {
    candidates.push("العربية");
  }

  return Array.from(new Set(candidates));
};

const matchesSearchText = (item: ExploreResultItem, query: string): boolean => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  const fields = [
    item.skill.name,
    item.skill.description,
    item.user.userName,
    item.user.level,
    item.skill.category?.name,
  ];

  return fields.some((field) => field?.toLowerCase().includes(normalizedQuery));
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
  const [draftFilters, setDraftFilters] = useState<FilterState>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(defaultFilters);
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "rating">("recent");
  const latestRequestIdRef = useRef(0);

  const hasActiveFilters =
    appliedFilters.skillType !== "" ||
    appliedFilters.availability.length > 0 ||
    appliedFilters.language.trim().length > 0 ||
    appliedFilters.difficultyLevel !== "";

  const loadCurrentResults = async (query: string, filters: FilterState) => {
    const requestId = latestRequestIdRef.current + 1;
    latestRequestIdRef.current = requestId;

    setLoading(true);
    setError(null);

    try {
      const trimmedQuery = query.trim();
      const hasFilters =
        filters.skillType !== "" ||
        filters.availability.length > 0 ||
        filters.language.trim().length > 0 ||
        filters.difficultyLevel !== "";

      const selectedAvailability =
        filters.availability.length > 0
          ? availabilityMap[filters.availability[0]] || undefined
          : undefined;
      const selectedLevel = levelMap[filters.difficultyLevel];
      const selectedLanguage = toApiLanguage(filters.language);

      let baseResults: ExploreResultItem[] = [];
      if (hasFilters) {
        const sharedParams = {
          skillType: skillTypeMap[filters.skillType],
          availability: selectedAvailability,
          level: selectedLevel,
          page: 1,
          limit: 20,
        };

        if (selectedLanguage) {
          const languageCandidates = getLanguageFallbacks(selectedLanguage);
          let firstResponse: ExploreResultItem[] = [];

          for (let index = 0; index < languageCandidates.length; index += 1) {
            const language = languageCandidates[index];
            const response = await discoverSkills({
              ...sharedParams,
              language,
            });

            if (index === 0) {
              firstResponse = response;
            }

            if (response.length > 0) {
              baseResults = response;
              break;
            }
          }

          if (baseResults.length === 0) {
            baseResults = firstResponse;
          }
        } else {
          baseResults = await discoverSkills({
            ...sharedParams,
            language: undefined,
          });
        }
      } else if (trimmedQuery.length > 0) {
        baseResults = await searchSkills(trimmedQuery, 1, 20);
      } else {
        baseResults = await discoverSkills({ page: 1, limit: 20 });
      }

      const filteredResults = baseResults.filter((item) => {
        if (trimmedQuery.length > 0 && !matchesSearchText(item, trimmedQuery)) {
          return false;
        }
        return true;
      });

      if (requestId !== latestRequestIdRef.current) {
        return;
      }

      setRecommendations(filteredResults);
    } catch (err: unknown) {
      if (requestId !== latestRequestIdRef.current) {
        return;
      }

      const maybeApiError = err as { response?: { data?: { message?: string } } };
      setError(maybeApiError.response?.data?.message || "Failed to load results");
      setRecommendations([]);
    } finally {
      if (requestId === latestRequestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as unknown;
      if (Array.isArray(parsed)) {
        setRecentSearches(parsed.filter((item): item is string => typeof item === "string"));
      }
    } catch {
      setRecentSearches([]);
    }
  }, []);

  useEffect(() => {
    const debounce = window.setTimeout(() => {
      void loadCurrentResults(searchQuery, appliedFilters);
    }, 350);

    return () => window.clearTimeout(debounce);
  }, [appliedFilters, searchQuery]);

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
  };

  const clearAllFilters = () => {
    setDraftFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  const toggleAvailability = (value: string) => {
    setDraftFilters((prev) => ({
      ...prev,
      availability: prev.availability.includes(value)
        ? prev.availability.filter((item) => item !== value)
        : [...prev.availability, value],
    }));
  };

  const commitSearch = (query?: string) => {
    const q = (query ?? searchQuery).trim();
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

  const clearRecentSearch = (index: number) => {
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
        const aRating = a.user.rating ?? a.user.avgRate ?? a.user.avarage ?? 0;
        const bRating = b.user.rating ?? b.user.avgRate ?? b.user.avarage ?? 0;
        return bRating - aRating;
      }

      if (sortBy === "popular") {
        const aSwaps = (a.user.receivedSwaps ?? 0) + (a.user.sentSwaps ?? 0);
        const bSwaps = (b.user.receivedSwaps ?? 0) + (b.user.sentSwaps ?? 0);
        return bSwaps - aSwaps;
      }

      return 0;
    });
  }, [recommendations, sortBy]);

  const showRecentSection =
    searchQuery.trim().length === 0 && !hasActiveFilters && recentSearches.length > 0;
  const showResultsHeader =
    (searchQuery.trim().length > 0 || hasActiveFilters) &&
    !loading &&
    sortedRecommendations.length > 0;

  const renderCard = (item: ExploreResultItem, idx: number) => {
    const skillId = getSkillIdentifier(item.skill);
    const userId = getUserIdentifier(item.user);
    const canViewDetails = Boolean(skillId && userId);
    const rating = item.user.rating ?? item.user.avgRate ?? item.user.avarage;
    const swaps = (item.user.receivedSwaps ?? 0) + (item.user.sentSwaps ?? 0);

    return (
      <article
        key={`${item.user.userName}-${item.skill.name}-${idx}`}
        className="rounded-2xl border border-[#e5e7eb] bg-white p-6"
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex min-w-0 flex-1 gap-4">
            <div className="h-[88px] w-[83px] shrink-0 overflow-hidden rounded-2xl bg-[#d9d9d9]">
              {item.user.image ? (
                <img
                  src={item.user.image}
                  alt={item.user.userName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#3e8fcc] text-2xl font-semibold text-white">
                  {(item.user.userName?.charAt(0) || "U").toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h4 className="truncate text-2xl font-semibold text-[#0c0d0f]">{item.user.userName}</h4>
              <p className="truncate text-lg text-[#666666]">{item.user.level || "Skill Provider"}</p>

              <div className="mt-1 flex items-center gap-2 text-sm text-[#0c0d0f]">
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M8 1.8l1.86 3.77 4.16.6-3 2.93.71 4.14L8 11.3l-3.73 1.94.71-4.14-3-2.93 4.16-.6L8 1.8z"
                    fill="#F59E0B"
                  />
                </svg>
                <span>{rating ? Number(rating).toFixed(1) : "N/A"}</span>
                <span className="h-1 w-1 rounded-full bg-[#666666]" />
                <span>{swaps} swaps</span>
              </div>
            </div>
          </div>

          {/* <button
            type="button"
            className="text-[#666666] transition-colors hover:text-[#0c0d0f]"
            aria-label="Bookmark"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M7 4.75A2.25 2.25 0 0 1 9.25 2.5h5.5A2.25 2.25 0 0 1 17 4.75v15.59a.25.25 0 0 1-.4.2L12 16.85l-4.6 3.69a.25.25 0 0 1-.4-.2V4.75Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button> */}
        </div>

        <div className="mt-4">
          <h5 className="text-xl font-semibold text-[#0c0d0f]">{item.skill.name}</h5>
          <p className="mt-1 text-base text-[#666666]">
            {item.skill.description || "No description available"}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {item.skill.category?.name ? (
            <span className="rounded-lg bg-[#e6e6e6] px-2 py-1 text-xs text-[#666666]">
              {item.skill.category.name}
            </span>
          ) : null}
          {item.skill.language ? (
            <span className="rounded-lg bg-[#e6e6e6] px-2 py-1 text-xs text-[#666666]">
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
            className="h-9 min-w-[128px] rounded-[10px] bg-[#3e8fcc] px-4 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            View Details
          </button>
        </div>
      </article>
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#f9fafb]">
      <Header activeTab="Explore" />

      <main className="w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-20">
        <div className="mb-8 flex h-12 items-center gap-4">
          <div
            className={`flex h-12 flex-1 items-center gap-3 rounded-lg border bg-[#f9fafb] px-4 ${
              searchQuery.trim().length === 0 && !hasActiveFilters
                ? "border-[#3272a3]"
                : "border-[#e5e7eb]"
            }`}
          >
            <svg className="h-4 w-4 text-[#666666]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M21 21L15.8 15.8M17 10.5C17 14.09 14.09 17 10.5 17C6.91 17 4 14.09 4 10.5C4 6.91 6.91 4 10.5 4C14.09 4 17 6.91 17 10.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search for a skill (e.g. UX, Coding...)"
              value={searchQuery}
              onChange={(event) => {
                const nextValue = event.target.value;
                setSearchQuery(nextValue);

                if (nextValue.trim().length === 0) {
                  const nextParams = new URLSearchParams(searchParams);
                  nextParams.delete("q");
                  setSearchParams(nextParams, { replace: true });
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  commitSearch();
                }
              }}
              className="h-full w-full bg-transparent text-base text-[#0c0d0f] outline-none placeholder:text-[#666666]"
            />
            {searchQuery.trim().length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  const nextParams = new URLSearchParams(searchParams);
                  nextParams.delete("q");
                  setSearchParams(nextParams, { replace: true });
                }}
                className="text-sm text-[#666666] transition-colors hover:text-[#0c0d0f]"
                aria-label="Clear search"
              >
                x
              </button>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => {
              setDraftFilters(appliedFilters);
              setShowFilters((prev) => !prev);
            }}
            className={`flex h-6 w-6 items-center justify-center transition-colors ${
              showFilters || hasActiveFilters ? "text-[#3272a3]" : "text-[#0c0d0f]"
            }`}
            aria-label="Toggle filters"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 5H20L14 12V18L10 20V12L4 5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {showRecentSection ? (
          <section className="mb-8 space-y-4 px-6">
            <div className="flex items-center gap-6">
              <h3 className="flex-1 text-lg font-semibold text-[#0c0d0f]">Recent Search</h3>
              <button
                type="button"
                onClick={clearAllSearches}
                className="text-sm text-[#666666] transition-colors hover:text-[#0c0d0f]"
              >
                Clear all
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <div
                  key={`${search}-${index}`}
                  className="flex h-6 items-center gap-2 rounded-[20px] bg-[#f7faff] px-2"
                >
                  <button
                    type="button"
                    onClick={() => commitSearch(search)}
                    className="text-[13px] text-[#666666] transition-colors hover:text-[#0c0d0f]"
                  >
                    {search}
                  </button>
                  <button
                    type="button"
                    onClick={() => clearRecentSearch(index)}
                    className="text-xs text-[#666666] transition-colors hover:text-[#0c0d0f]"
                    aria-label={`Remove ${search}`}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {error ? (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : null}

        {showResultsHeader ? (
          <div className="mb-4 flex items-center gap-6">
            <p className="flex-1 text-lg font-semibold text-[#666666]">
              {sortedRecommendations.length} Results found
            </p>
            <div className="flex h-10 items-center gap-2 rounded-lg border border-[#e5e7eb] px-4">
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as "recent" | "popular" | "rating")
                }
                className="border-none bg-transparent text-base font-semibold text-[#0c0d0f] outline-none"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>
          </div>
        ) : null}

        <div className="flex items-start gap-6">
          <div className="min-w-0 flex-1">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((skeleton) => (
                  <div key={skeleton} className="h-48 animate-pulse rounded-2xl bg-gray-200" />
                ))}
              </div>
            ) : sortedRecommendations.length > 0 ? (
              <div className="space-y-4">{sortedRecommendations.map(renderCard)}</div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="mb-2 text-xl font-semibold text-[#666666]">No skills found</p>
                <p className="text-[#666666]">Try adjusting your search query or filters</p>
              </div>
            )}
          </div>

          {showFilters ? (
            <aside className="hidden w-[377px] shrink-0 animate-fade-in xl:block">
              <FiltersSidebar
                filters={draftFilters}
                onSelectSkillType={(value) =>
                  setDraftFilters((prev) => ({ ...prev, skillType: value }))
                }
                onToggleAvailability={toggleAvailability}
                onChangeLanguage={(language) =>
                  setDraftFilters((prev) => ({ ...prev, language }))
                }
                onSelectDifficulty={(difficultyLevel) =>
                  setDraftFilters((prev) => ({ ...prev, difficultyLevel }))
                }
                onClear={clearAllFilters}
                onApply={applyFilters}
              />
            </aside>
          ) : null}
        </div>
      </main>

      {showFilters ? (
        <div
          className="fixed inset-0 z-[120] bg-black/20 p-4 xl:hidden"
          onClick={() => setShowFilters(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <FiltersSidebar
              filters={draftFilters}
              onSelectSkillType={(value) =>
                setDraftFilters((prev) => ({ ...prev, skillType: value }))
              }
              onToggleAvailability={toggleAvailability}
              onChangeLanguage={(language) =>
                setDraftFilters((prev) => ({ ...prev, language }))
              }
              onSelectDifficulty={(difficultyLevel) =>
                setDraftFilters((prev) => ({ ...prev, difficultyLevel }))
              }
              onClear={clearAllFilters}
              onApply={() => {
                applyFilters();
                setShowFilters(false);
              }}
            />
          </div>
        </div>
      ) : null}

      <Footer />
    </div>
  );
};

export default Search;
