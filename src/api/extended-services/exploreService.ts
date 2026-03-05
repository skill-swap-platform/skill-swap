import axios from "axios";
import axiosInstance from "../axiosInstance";

export interface SkillCategory {
  id: string;
  name: string;
  icon?: string;
  description?: string;
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
  id?: string;
  comment?: string;
  rating?: number;
  overallRating?: number;
  reviewer?: Reviewer;
  createdAt?: string;
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

export type RecommendedUserSkill = ExploreResultItem;

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

const toText = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : undefined;
  }

  if (Array.isArray(value)) {
    for (const candidate of value) {
      const parsed = toText(candidate);
      if (parsed) {
        return parsed;
      }
    }
    return undefined;
  }

  if (!isRecord(value)) {
    return undefined;
  }

  const preferredKeys = [
    "value",
    "text",
    "label",
    "name",
    "title",
    "url",
    "src",
    "path",
    "en",
    "ar",
    "description",
    "bio",
    "icon",
  ];

  for (const key of preferredKeys) {
    const parsed = toText(value[key]);
    if (parsed) {
      return parsed;
    }
  }

  return undefined;
};

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  if (Array.isArray(value)) {
    for (const candidate of value) {
      const parsed = toNumber(candidate);
      if (typeof parsed === "number") {
        return parsed;
      }
    }
    return undefined;
  }

  if (!isRecord(value)) {
    return undefined;
  }

  const preferredKeys = [
    "value",
    "count",
    "total",
    "totalCount",
    "rating",
    "avg",
    "average",
    "avarage",
    "duration",
  ];

  for (const key of preferredKeys) {
    const parsed = toNumber(value[key]);
    if (typeof parsed === "number") {
      return parsed;
    }
  }

  return undefined;
};

const toIdentifier = (value: unknown): string => toText(value) ?? "";

const normalizeCategory = (value: unknown): SkillCategory | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }

  const id = toIdentifier(value.id ?? value._id);
  const name = toText(value.name) ?? "Category";

  return {
    id,
    name,
    icon: toText(value.icon),
    description: toText(value.description),
  };
};

const normalizeSkill = (value: unknown): SkillInfo => {
  if (!isRecord(value)) {
    return { name: "Skill" };
  }

  return {
    id: toIdentifier(value.id ?? value.skillId ?? value._id),
    name: toText(value.name ?? value.title) ?? "Skill",
    description: toText(value.description),
    language: toText(value.language ?? value.sessionLanguage),
    category: normalizeCategory(value.category),
  };
};

const normalizeProvider = (value: unknown): SkillProvider => {
  if (!isRecord(value)) {
    return {
      userName: "Unknown Provider",
      image: null,
      bio: "",
      rating: 0,
      totalFeedbacks: 0,
    };
  }

  return {
    id: toIdentifier(value.id ?? value._id ?? value.userId),
    userId: toIdentifier(value.userId ?? value.id ?? value._id),
    userName: toText(value.userName ?? value.name) ?? "Unknown Provider",
    image: toText(value.image ?? value.avatar) ?? null,
    level: toText(value.level),
    yearsOfExperience:
      toNumber(value.yearsOfExperience) ?? toText(value.yearsOfExperience),
    bio: toText(value.bio ?? value.headline) ?? "",
    receivedSwaps: toNumber(value.receivedSwaps) ?? 0,
    sentSwaps: toNumber(value.sentSwaps) ?? 0,
    rating:
      toNumber(value.rating ?? value.avgRate ?? value.avarage ?? value.average) ?? 0,
    totalFeedback:
      toNumber(value.totalFeedback ?? value.totalFeedbacks ?? value.feedbackCount) ?? 0,
    totalFeedbacks:
      toNumber(value.totalFeedbacks ?? value.totalFeedback ?? value.feedbackCount) ?? 0,
    avgRate: toNumber(value.avgRate),
    avarage: toNumber(value.avarage ?? value.average),
  };
};

const normalizeReviewer = (value: unknown): Reviewer => {
  if (!isRecord(value)) {
    return {
      id: "",
      userName: "Anonymous",
      image: null,
    };
  }

  return {
    id: toIdentifier(value.id ?? value._id ?? value.userId),
    userName: toText(value.userName ?? value.name) ?? "Anonymous",
    image: toText(value.image ?? value.avatar) ?? null,
  };
};

const normalizeLatestReview = (value: unknown): LatestReviewDto | null => {
  if (!isRecord(value)) {
    return null;
  }

  return {
    ...value,
    id: toIdentifier(value.id ?? value._id),
    comment: toText(value.comment),
    rating: toNumber(value.rating ?? value.overallRating) ?? 0,
    overallRating: toNumber(value.overallRating ?? value.rating) ?? 0,
    reviewer: normalizeReviewer(value.reviewer ?? value.user ?? value.author),
    createdAt: toText(value.createdAt ?? value.updatedAt ?? value.date),
  };
};

const normalizeSession = (value: unknown): SkillSession | null => {
  if (!isRecord(value)) {
    return null;
  }

  return {
    id: toIdentifier(value.id ?? value._id ?? value.sessionId),
    title: toText(value.title ?? value.name) ?? "Session",
    description: toText(value.description ?? value.details) ?? "",
    duration: toNumber(value.duration ?? value.durationInMinutes ?? value.minutes) ?? 0,
    createdAt: toText(value.createdAt ?? value.date) ?? "",
  };
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

  const skillSource = value.skill ?? value.skillDto ?? value.offeredSkill;
  const userSource = value.user ?? value.provider ?? value.userDto;
  if (!skillSource || !userSource) {
    return null;
  }

  return {
    skill: normalizeSkill(skillSource),
    user: normalizeProvider(userSource),
  };
};

const mapResultItems = (values: unknown[]): ExploreResultItem[] =>
  values.map(toResultItem).filter((item): item is ExploreResultItem => item !== null);

const normalizeResultItems = (payload: unknown): ExploreResultItem[] => {
  const candidates = Array.isArray(payload) ? payload : toArray(payload);
  const normalizedCandidates = mapResultItems(candidates);
  if (normalizedCandidates.length > 0) {
    return normalizedCandidates;
  }

  const directItem = toResultItem(payload);
  if (directItem) {
    return [directItem];
  }

  if (!isRecord(payload)) {
    return [];
  }

  const nestedSingleCandidates = [payload.data, payload.item, payload.result];
  for (const candidate of nestedSingleCandidates) {
    const nestedItem = toResultItem(candidate);
    if (nestedItem) {
      return [nestedItem];
    }
  }

  return [];
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

  const reviews = rawReviews
    .map((review, index) => {
      if (!isRecord(review)) {
        return null;
      }

      return {
        id: toIdentifier(review.id ?? review._id ?? `review-${index}`),
        comment: toText(review.comment ?? review.review ?? review.feedback) ?? "",
        overallRating:
          toNumber(review.overallRating ?? review.rating ?? review.score) ?? 0,
        reviewer: normalizeReviewer(review.reviewer ?? review.user ?? review.author),
        createdAt: toText(review.createdAt ?? review.updatedAt ?? review.date) ?? "",
        isVerified: Boolean(review.isVerified),
      } as Review;
    })
    .filter((review): review is Review => review !== null);

  const total =
    toNumber(reviewContainer.total ?? reviewContainer.count ?? reviewContainer.totalCount) ??
    reviews.length;
  const totalPages = toNumber(reviewContainer.totalPages) ??
    (total > 0 ? Math.ceil(total / limit) : 0);
  const reviewCount =
    toNumber(
      isRecord(reviewContainer.avgRatingUserSkill)
        ? reviewContainer.avgRatingUserSkill.reviewCount
        : undefined,
    ) ?? reviews.length;

  return {
    reviews,
    avgRatingUserSkill: { reviewCount },
    total: Math.max(total, reviews.length),
    page: toNumber(reviewContainer.page) ?? page,
    limit: toNumber(reviewContainer.limit) ?? limit,
    totalPages,
  };
};

const normalizeSkillDetails = (payload: unknown): SkillDetailsResponse => {
  const unwrapped = unwrapData(payload as Record<string, unknown>);
  const data = isRecord(unwrapped) ? unwrapped : {};

  const provider = normalizeProvider(data.provider);
  const skill = normalizeSkill(data.skill);
  const sessions = Array.isArray(data.sessions)
    ? data.sessions
        .map((session) => normalizeSession(session))
        .filter((session): session is SkillSession => session !== null)
    : [];

  const reviewsRecord = isRecord(data.reviews) ? data.reviews : {};
  const latestReview = normalizeLatestReview(
    reviewsRecord.LatestReviewDto ?? reviewsRecord.latestReview ?? data.latestReview,
  );
  const reviewCount =
    toNumber(
      reviewsRecord.count ?? reviewsRecord.total ?? reviewsRecord.totalCount,
    ) ?? 0;

  return {
    provider,
    skill,
    level: toText(data.level) ?? provider.level ?? "Not specified",
    sessionLanguage:
      toText(data.sessionLanguage ?? data.language) ??
      skill.language ??
      "Not specified",
    skillDescription:
      toText(data.skillDescription ?? data.description) ??
      skill.description ??
      "",
    userSkillId: toIdentifier(data.userSkillId ?? data.id ?? data._id),
    reviews: {
      count: reviewCount,
      LatestReviewDto: latestReview,
      latestReview: latestReview,
    },
    sessions,
    countSessions: toNumber(data.countSessions) ?? sessions.length,
  };
};

export const getUserIdentifier = (user?: Partial<SkillProvider> | null): string =>
  toIdentifier(user?.id ?? user?.userId ?? (user as { _id?: unknown } | null)?._id);

export const getSkillIdentifier = (skill?: Partial<SkillInfo> | null): string =>
  toIdentifier(
    skill?.id ?? (skill as { skillId?: unknown; _id?: unknown } | null)?.skillId ?? (skill as { _id?: unknown } | null)?._id,
  );

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
  return normalizeSkillDetails(response.data);
};

/**
 * GET /api/v1/skills/{skillId}/similar
 */
export const getSimilarSkillUsers = async (
  skillId: string,
): Promise<ExploreResultItem[]> => {
  const response = await axiosInstance.get<
    ExploreResultItem | ExploreResultItem[] | ApiEnvelope<ExploreResultItem> | { data?: unknown }
  >(`/api/v1/skills/${skillId}/similar`);

  const payload = unwrapData(response.data);
  return normalizeResultItems(payload);
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

  const payload = unwrapData(response.data);
  return normalizeResultItems(payload)[0] ?? null;
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
  try {
    const response = await axiosInstance.get(`/api/v1/skills/search`, {
      params: { name, page, limit },
    });

    const payload = unwrapData(response.data);
    return normalizeResultItems(payload);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      // API can return 400/404 when no match exists; treat that as empty state.
      if (status === 400 || status === 404) {
        return [];
      }
    }

    throw error;
  }
};

/**
 * GET /api/v1/skills/discover?availability={}&language={}&level={}&page={}&limit={}
 */
export const discoverSkills = async (params: {
  skillType?: string;
  availability?: string;
  language?: string;
  level?: string;
  page?: number;
  limit?: number;
}): Promise<ExploreResultItem[]> => {
  const response = await axiosInstance.get(`/api/v1/skills/discover`, { params });

  const payload = unwrapData(response.data);
  return normalizeResultItems(payload);
};
