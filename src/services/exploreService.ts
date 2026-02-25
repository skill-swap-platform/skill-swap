import axiosInstance from "@/api/axiosInstance";

export interface SkillCategory {
  id: string;
  name: string;
  icon?: unknown;
  description?: unknown;
}

export interface SkillInfo {
  id?: string;
  name: string;
  description?: string;
  language?: string;
  category?: SkillCategory;
}

export interface SkillProvider {
  id?: string;
  userId?: string;
  userName: string;
  image: string | null;
  level?: string;
  yearsOfExperience?: string | number;
  bio?: string;
  receivedSwaps?: number;
  sentSwaps?: number;
  rating?: number;
  totalFeedback?: number;
  totalFeedbacks?: number;
  avgRate?: number;
  avarage?: number;
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
  provider: SkillProvider;
  skill: SkillInfo;
  level?: string;
  sessionLanguage?: string;
  skillDescription?: string;
  userSkillId?: string;
  reviews?: {
    count?: number;
    LatestReviewDto?: LatestReviewDto | null;
    latestReview?: LatestReviewDto | null;
  };
  sessions?: SkillSession[];
  countSessions?: number;
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
  reviews: Review[];
  avgRatingUserSkill?: { reviewCount: number };
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ExploreResultItem {
  skill: SkillInfo;
  user: SkillProvider;
}

export interface RecommendedUserSkill extends ExploreResultItem {}

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const unwrapData = <T>(payload: T | ApiEnvelope<T>): T => {
  if (isRecord(payload) && "data" in payload && payload.data !== undefined) {
    return payload.data as T;
  }

  return payload as T;
};

const toArray = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (!isRecord(payload)) {
    return [];
  }

  const candidates = [payload.data, payload.items, payload.results] as unknown[];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as T[];
    }
  }

  return [];
};

const toResultItem = (value: unknown): ExploreResultItem | null => {
  if (!isRecord(value)) {
    return null;
  }

  if (!isRecord(value.skill) || !isRecord(value.user)) {
    return null;
  }

  return {
    skill: value.skill as unknown as SkillInfo,
    user: value.user as unknown as SkillProvider,
  };
};

const normalizeReviewData = (
  payload: unknown,
  page: number,
  limit: number,
): ReviewsData => {
  const data = unwrapData(payload as Record<string, unknown>);
  const reviewContainer = isRecord(data) ? data : {};

  const rawReviews = Array.isArray(reviewContainer.reviews)
    ? reviewContainer.reviews
    : Array.isArray(reviewContainer.review)
      ? reviewContainer.review
      : [];

  const reviews = rawReviews as Review[];
  const total =
    typeof reviewContainer.total === "number" ? reviewContainer.total : reviews.length;
  const totalPages =
    typeof reviewContainer.totalPages === "number"
      ? reviewContainer.totalPages
      : total > 0
        ? Math.ceil(total / limit)
        : 0;

  return {
    reviews,
    avgRatingUserSkill: reviewContainer.avgRatingUserSkill as
      | { reviewCount: number }
      | undefined,
    total,
    page: typeof reviewContainer.page === "number" ? reviewContainer.page : page,
    limit: typeof reviewContainer.limit === "number" ? reviewContainer.limit : limit,
    totalPages,
  };
};

export const getUserIdentifier = (user?: Partial<SkillProvider> | null): string =>
  user?.id || user?.userId || "";

export const getSkillIdentifier = (skill?: Partial<SkillInfo> | null): string =>
  skill?.id || "";

/**
 * GET /api/v1/skills/{skillId}/users/{userId}/details
 */
export const getSkillDetails = async (
  skillId: string,
  userId: string,
): Promise<SkillDetailsResponse> => {
  const response = await axiosInstance.get<
    SkillDetailsResponse | ApiEnvelope<SkillDetailsResponse>
  >(`/api/v1/skills/${skillId}/users/${userId}/details`);
  return unwrapData(response.data);
};

/**
 * GET /api/v1/skills/{skillId}/similar
 */
export const getSimilarSkillUsers = async (
  skillId: string,
): Promise<ExploreResultItem | null> => {
  const response = await axiosInstance.get<
    ExploreResultItem | ApiEnvelope<ExploreResultItem> | { data?: unknown }
  >(`/api/v1/skills/${skillId}/similar`);

  const payload = unwrapData(response.data);
  if (Array.isArray(payload)) {
    return toResultItem(payload[0]);
  }

  return toResultItem(payload);
};

/**
 * GET /api/v1/reviews/{userId}/received?skillId={skillId}&page={page}&limit={limit}
 */
export const getReviews = async (
  userId: string,
  skillId: string,
  page: number = 1,
  limit: number = 10,
): Promise<ReviewsData> => {
  const response = await axiosInstance.get(`/api/v1/reviews/${userId}/received`, {
    params: { skillId, page, limit },
  });

  return normalizeReviewData(response.data, page, limit);
};

/**
 * GET /api/v1/skills/recommended-user
 */
export const getRecommendedUserSkill = async (): Promise<RecommendedUserSkill | null> => {
  const response = await axiosInstance.get<
    RecommendedUserSkill | ApiEnvelope<RecommendedUserSkill>
  >(`/api/v1/skills/recommended-user`);

  return toResultItem(unwrapData(response.data));
};

/**
 * GET /api/v1/reviews/{userId}/received?skillId={skillId}&page={page}&limit={limit}
 */
export const getAllUserSkillReviews = async (
  userId: string,
  skillId: string,
  page: number = 1,
  limit: number = 50,
): Promise<ReviewsData> => {
  const response = await axiosInstance.get(`/api/v1/reviews/${userId}/received`, {
    params: { skillId, page, limit },
  });

  return normalizeReviewData(response.data, page, limit);
};

/**
 * GET /api/v1/user/{userId}
 */
export const getProviderProfile = async (userId: string) => {
  const response = await axiosInstance.get(`/api/v1/user/${userId}`);
  return unwrapData(response.data);
};

/**
 * GET /api/v1/skills/search?name={name}&page={page}&limit={limit}
 */
export const searchSkills = async (
  name: string,
  page: number = 1,
  limit: number = 10,
): Promise<ExploreResultItem[]> => {
  const response = await axiosInstance.get(`/api/v1/skills/search`, {
    params: { name, page, limit },
  });

  const payload = unwrapData(response.data);
  if (Array.isArray(payload)) {
    return payload
      .map(toResultItem)
      .filter((item): item is ExploreResultItem => item !== null);
  }

  const single = toResultItem(payload);
  return single ? [single] : [];
};

/**
 * GET /api/v1/skills/discover?availability={}&language={}&level={}&page={}&limit={}
 */
export const discoverSkills = async (params: {
  availability?: string;
  language?: string;
  level?: string;
  page?: number;
  limit?: number;
}): Promise<ExploreResultItem[]> => {
  const response = await axiosInstance.get(`/api/v1/skills/discover`, { params });

  const payload = unwrapData(response.data);
  const items = Array.isArray(payload) ? payload : toArray(payload);
  return items
    .map(toResultItem)
    .filter((item): item is ExploreResultItem => item !== null);
};
