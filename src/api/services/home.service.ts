import axiosInstance from "../axiosInstance";

/* ── API response shapes (from Swagger docs) ──────────────────────────── */

export interface TrendingSkillDto {
  skillName: string;
  learningCount: number;
}

export interface RecommendedUserDto {
  skill: {
    id: string;
    name: string;
    language: string;
    description: string;
    category: { id: string; name: string; icon: string; description: string };
  };
  user: {
    userName: string;
    image: string | null;
    level: string;
    yearsOfExperience?: string;
    bio?: string;
    receivedSwaps: number;
    sentSwaps: number;
    avarage?: number;
    totalFeedbacks: number;
  };
}

export interface SessionDto {
  id: string;
  title: string;
  description: string;
  scheduledAt: string;
  endsAt: string;
  duration: number;
  communication: string;
  status: string;
  host: { id: string; userName: string; image: string | null };
  attendee: { id: string; userName: string; image: string | null };
  skill: { id: string; name: string; description: string };
  swapRequest: { id: string; status: string };
}

export interface SwapStatsDto {
  sentTotal: number;
  receivedTotal: number;
  accepted: number;
  rejected: number;
  acceptanceRate: number;
}

export interface RatingDto {
  receiverId: string;
  receiverName: string;
  receiverImage: string;
  rating: number;
  totalFeedbacks: number;
}

export interface DashboardApiResponse {
  profile: Record<string, unknown>;
  trending: TrendingSkillDto[];
  recommended: RecommendedUserDto | null;
  sessions: { data: SessionDto[]; total: number };
  swaps: SwapStatsDto;
  rating: RatingDto;
  learnedSkillsCount: number;
}

export const getDashboardData = async (
  userId: string
): Promise<DashboardApiResponse> => {
  const results = await Promise.allSettled([
    axiosInstance.get("/api/v1/user/me"),
    axiosInstance.get("/api/v1/skills/trending"),
    axiosInstance.get("/api/v1/skills/recommended-user"),
    axiosInstance.get("/api/v1/sessions/my-sessions"),
    axiosInstance.get("/api/v1/swaps/stats"),
    axiosInstance.get(`/api/v1/feedback/rating/${userId}`),
    axiosInstance.get("/api/v1/skills/learned-skills"),
  ]);

  const val = (idx: number) => {
    const r = results[idx];
    if (r.status === "fulfilled") {
      const d = r.value.data;
      return d?.data ?? d;
    }
    return null;
  };

  return {
    profile: val(0) ?? {},
    trending: val(1) ?? [],
    recommended: val(2) ?? null,
    sessions: val(3) ?? { data: [], total: 0 },
    swaps: val(4) ?? { sentTotal: 0, receivedTotal: 0, accepted: 0, rejected: 0, acceptanceRate: 0 },
    rating: val(5) ?? { rating: 0, totalFeedbacks: 0 },
    learnedSkillsCount: val(6) ?? 0,
  };
};