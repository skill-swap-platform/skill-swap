export type SwapApiStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'EXPIRED'
  | 'COMPLETED'
  | 'CANCELLED';

export type SwapRequestStatus = SwapApiStatus | 'REJECTED';

export interface ApiSuccessResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SwapParticipant {
  id: string;
  userName: string;
  image: string | null;
}

export interface SwapSkillCategory {
  id: string;
  name: string;
}

export interface SwapSkill {
  id: string;
  name: string;
  description: string;
  category: SwapSkillCategory;
}

export interface SwapUserSkill {
  id?: string;
  userId?: string;
  skillId?: string;
  level?: string | null;
  skillDescription?: string | null;
  yearsOfExperience?: number | null;
  sessionLanguage?: string | null;
  isActive?: boolean;
  isOffering?: boolean;
  createdAt?: string;
  updatedAt?: string;
  skill: SwapSkill;
}

export interface SwapRequest {
  id: string;
  requesterId?: string;
  receiverId?: string;
  offeredUserSkillId?: string;
  requestedUserSkillId?: string;
  date?: string;
  startAt?: string;
  endAt?: string;
  timezone?: string;
  status: SwapRequestStatus;
  rejectionReason: string | null;
  message?: string | null;
  expiresAt: string;
  tracking?: unknown;
  createdAt: string;
  updatedAt?: string;
  receiver?: SwapParticipant;
  requester?: SwapParticipant;
  offeredUserSkill: SwapUserSkill;
  requestedUserSkill: SwapUserSkill;
}

export interface CreateSwapRequestPayload {
  receiverId: string;
  offeredSkillId: string;
  requestedSkillId: string;
  message: string;
  date: string;
  startAt: string;
  endAt: string;
  timezone: string;
}

export interface DeclineSwapRequestPayload {
  reason: string;
}

export interface SwapsListQueryParams {
  page: number;
  limit: number;
  status?: SwapApiStatus;
}

export interface SwapStats {
  sentTotal: number;
  receivedTotal: number;
  accepted: number;
  rejected: number;
  acceptanceRate: number;
}

export type SwapListResponse = ApiSuccessResponse<PaginatedResponse<SwapRequest>>;
export type SwapDetailsResponse = ApiSuccessResponse<SwapRequest>;
export type SwapStatsResponse = ApiSuccessResponse<SwapStats>;
