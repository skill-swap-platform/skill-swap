export type AdminUserStatus = 'ACTIVE' | 'SUSPENDED' | 'BANNED'

export type AdminUsersSort = 'newest' | 'oldest'

export type AdminUsersStatusFilter = AdminUserStatus | 'ALL'

export interface AdminUsersQueryParams {
    page?: number
    limit?: number
    status?: AdminUserStatus
    search?: string
    sort?: AdminUsersSort
}

export interface AdminUserItem {
    id: string
    name: string
    email: string
    image: string | null
    status: AdminUserStatus
    points: number
    badges: unknown[]
}

export interface AdminUsersPagination {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

export interface AdminUsersData {
    data: AdminUserItem[]
    pagination: AdminUsersPagination
}

export interface AdminUsersResponse {
    success: boolean
    data: AdminUsersData
}

export interface AdminUserOverviewSkill {
    id: string
    name: string
    icon: string | null
    level: string
    durationMinutes: number | null
    rating: number | null
}

export interface AdminUserOverviewNote {
    adminId: string
    externalNote: string
    createdAt: string
}

export interface AdminUserOverviewProfile {
    id: string
    userName: string
    email: string
    status: AdminUserStatus
    createdAt: string
    image: string | null
    points: number | null
    location: string
    country: string
    bio: string
    skills: AdminUserOverviewSkill[]
}

export interface AdminUserOverviewData {
    profile: AdminUserOverviewProfile
    adminNotes: AdminUserOverviewNote[]
}

export type AdminUserActivityEntity = 'AdminNote' | 'UserRestriction' | string

export type AdminUserActivityType = string

export interface AdminUserActivityLogItem {
    id: string
    entity: AdminUserActivityEntity
    type: AdminUserActivityType
    adminId: string
    adminName: string
    adminEmail: string
    externalNote: string
    reason: string
    metadata: Record<string, unknown> | null
    endAt: string
    createdAt: string
}

export type AdminSwapStatus =
    | 'PENDING'
    | 'ACCEPTED'
    | 'DECLINED'
    | 'EXPIRED'
    | 'COMPLETED'
    | 'CANCELLED'

export type AdminSwapDirection = 'SENT' | 'RECEIVED'

export type AdminUserSwapsSort = 'newest' | 'oldest'

export interface AdminUserSwapsQueryParams {
    page?: number
    limit?: number
    status?: AdminSwapStatus
    sort?: AdminUserSwapsSort
    startDate?: string
    endDate?: string
    direction: AdminSwapDirection
}

export interface AdminUserSwapSkill {
    id: string
    name: string
}

export interface AdminUserSwapParticipant {
    id: string
    userName: string
    image: string | null
}

export interface AdminUserSwapItem {
    id: string
    user: AdminUserSwapParticipant
    requestType: string
    requestedSkill: AdminUserSwapSkill | null
    offeredSkill: AdminUserSwapSkill | null
    status: AdminSwapStatus
    dateTime: string
}

export interface AdminUserSwapsPagination {
    total: number
    page: number
    limit: number
    totalPages: number
    nextPage: number | null
    prevPage: number | null
    hasNextPage: boolean
    hasPrevPage: boolean
}

export interface AdminUserSwapsData {
    data: AdminUserSwapItem[]
    pagination: AdminUserSwapsPagination
}

export type AdminSessionStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED'

export type AdminUserSessionsSort = 'newest' | 'oldest'

export interface AdminUserSessionsQueryParams {
    page?: number
    limit?: number
    search?: string
    status?: AdminSessionStatus
    sort?: AdminUserSessionsSort
    startDate?: string
    endDate?: string
}

export interface AdminUserSessionProfile {
    id: string
    userName: string
    email: string
    image: string | null
}

export interface AdminUserSessionPartner {
    id: string
    userName: string
    image: string | null
}

export interface AdminUserSessionItem {
    id: string
    scheduledAt: string
    endsAt: string
    status: AdminSessionStatus
    duration: number | null
    skillName: string
    partner: AdminUserSessionPartner
}

export interface AdminUserSessionsPagination {
    total: number
    page: number
    limit: number
    totalPages: number
    nextPage: number | null
    prevPage: number | null
    hasNextPage: boolean
    hasPrevPage: boolean
}

export interface AdminUserSessionsData {
    user: AdminUserSessionProfile | null
    data: AdminUserSessionItem[]
    pagination: AdminUserSessionsPagination
}

export interface AdminUserBadgeItem {
    id: string
    name: string
    icon: string | null
    progress: string
    subtitle: string
    unlockedAt: string
    remainingSessions: number | null
}

export interface AdminUserBadgesData {
    earned: AdminUserBadgeItem[]
    locked: AdminUserBadgeItem[]
}

export interface AdminUserRestrictionPayload {
    type: string
    reason: string
    externalNote: string
    endAt?: string
}

export interface AdminUserAdjustPointsPayload {
    actionType: 'ADD' | 'DEDUCT'
    points: number
    reason: string
}
