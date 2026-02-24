import api from "./api";

// ── Types based on actual API response shapes ────────────────────────────────

export interface SkillCategory {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

export interface SkillInfo {
  id: string;
  name: string;
  description: string;
  language?: string;
  category: SkillCategory;
}

export interface SkillProvider {
  userName: string;
  image: string | null;
  bio?: string;
  rating: number;
  totalFeedbacks?: number;
}

export interface SkillProviderWithId extends SkillProvider {
  id: string;
}

export interface SkillSession {
  id: string;
  title: string;
  description: string;
  duration: number;
  createdAt: string;
}

export interface LatestReviewDto {
  rating?: number;
  [key: string]: unknown;
}

export interface SkillDetailsResponse {
  provider: SkillProviderWithId;
  skill: SkillInfo;
  level: string;
  sessionLanguage: string;
  skillDescription: string;
  userSkillId: string;
  reviews: {
    count: number;
    LatestReviewDto: LatestReviewDto | null;
  };
  sessions: SkillSession[];
  countSessions: number;
}

export interface SimilarSkillUser {
  skill: SkillInfo;
  user: {
    userName: string;
    image: string | null;
    level: string;
    bio?: string;
    receivedSwaps: number;
    sentSwaps: number;
    rating: number;
    totalFeedbacks: number;
    id?: string;
  };
}

export interface Reviewer {
  id: string;
  userName: string;
  image: string | null;
}

export interface Review {
  id: string;
  comment: string;
  overallRating: number | string;
  reviewer: Reviewer;
  createdAt: string;
  isVerified?: boolean;
}

export interface ReviewsData {
  review: Review[];
  avgRatingUserSkill?: { reviewCount: number };
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface ApiReviewsResponse {
  success: boolean;
  data: ReviewsData;
}

export interface RecommendedUserSkill {
  skill: SkillInfo & { id: string };
  user: {
    userName: string;
    image: string | null;
    level: string;
    yearsOfExperience?: string | number;
    bio?: string;
    receivedSwaps: number;
    sentSwaps: number;
    avarage?: number;
    totalFeedbacks: number;
    id?: string;
  };
}

export interface ApiRecommendedResponse {
  success: boolean;
  data: RecommendedUserSkill;
}

/** Shape returned by GET /api/v1/skills/search per item */
export interface SearchResultItem {
  skill: SkillInfo;
  user: {
    userName: string;
    image: string | null;
    level: string;
    yearsOfExperience?: string | number;
    bio?: string;
    receivedSwaps: number;
    sentSwaps: number;
    rating: number;
    totalFeedback: number;
  };
}

export interface ApiSearchResponse {
  success: boolean;
  data: SearchResultItem | SearchResultItem[];
}

/** Shape used by GET /api/v1/skills/discover per item */
export interface DiscoverResultItem {
  skill: Pick<SkillInfo, "name" | "category">;
  user: {
    userName: string;
    image: string | null;
    level: string;
    bio?: string;
    receivedSwaps: number;
    sentSwaps: number;
    rating: number;
    totalFeedbacks: number;
  };
}

// ── API Functions ─────────────────────────────────────────────────────────────

/**
 * Get skill details for a specific user
 * GET /api/v1/skills/{skillId}/users/{userId}/details
 */
export const getSkillDetails = async (
  skillId: string,
  userId: string,
): Promise<SkillDetailsResponse> => {
  const response = await api.get<SkillDetailsResponse>(
    `/skills/${skillId}/users/${userId}/details`,
  );
  return response.data;
};

/**
 * Get one similar user offering the same skill
 * GET /api/v1/skills/{skillId}/similar
 */
export const getSimilarSkillUsers = async (
  skillId: string,
): Promise<SimilarSkillUser> => {
  const response = await api.get<SimilarSkillUser>(
    `/skills/${skillId}/similar`,
  );
  return response.data;
};

/**
 * Get reviews received by a user for a specific skill
 * GET /api/v1/reviews/{userId}/received?skillId={skillId}&page={page}&limit={limit}
 */
export const getReviews = async (
  userId: string,
  skillId: string,
  page: number = 1,
  limit: number = 10,
): Promise<ReviewsData> => {
  const response = await api.get<ApiReviewsResponse>(
    `/reviews/${userId}/received`,
    { params: { skillId, page, limit } },
  );
  return response.data.data;
};

/**
 * Get recommended user skill
 * GET /api/v1/skills/recommended-user
 */
export const getRecommendedUserSkill =
  async (): Promise<RecommendedUserSkill> => {
    const response = await api.get<ApiRecommendedResponse>(
      `/v1/skills/recommended-user`,
    );
    return response.data.data;
  };

/**
 * Get all reviews for a user skill (detailed, paginated)
 * GET /api/v1/reviews/{userId}/received?skillId={skillId}&page={page}&limit={limit}
 */
export const getAllUserSkillReviews = async (
  userId: string,
  skillId: string,
  page: number = 1,
  limit: number = 50,
): Promise<ReviewsData> => {
  const response = await api.get<ApiReviewsResponse>(
    `/reviews/${userId}/received`,
    { params: { skillId, page, limit } },
  );
  return response.data.data;
};

/**
 * Get public user profile by ID
 * GET /api/v1/user/{userId}
 */
export const getProviderProfile = async (userId: string) => {
  const response = await api.get<{ success: boolean; data: unknown }>(
    `/user/${userId}`,
  );
  return response.data.data;
};

/**
 * Search for skills by name
 * GET /api/v1/skills/search?name={name}&page={page}&limit={limit}
 */
export const searchSkills = async (
  name: string,
  page: number = 1,
  limit: number = 10,
): Promise<SearchResultItem[]> => {
  const response = await api.get<ApiSearchResponse>(`/skills/search`, {
    params: { name, page, limit },
  });
  // The API may return a single object or array depending on the result
  const data = response.data.data;
  if (Array.isArray(data)) return data;
  if (data) return [data];
  return [];
};

/**
 * Discover skills with filters
 * GET /api/v1/skills/discover?availability={}&language={}&level={}&page={}&limit={}
 */
export const discoverSkills = async (params: {
  availability?: string;
  language?: string;
  level?: string;
  page?: number;
  limit?: number;
}): Promise<DiscoverResultItem[]> => {
  const response = await api.get<{ data: DiscoverResultItem[] }>(
    `/skills/discover`,
    { params },
  );
  const data = response.data?.data;
  if (Array.isArray(data)) return data;
  if (data) return [data as unknown as DiscoverResultItem];
  return [];
};
