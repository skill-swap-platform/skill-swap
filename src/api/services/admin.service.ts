import axiosInstance from '../axiosInstance'

export interface AdminDashboardPeriod {
    month: number
    year: number
}

export interface AdminDashboardSummary {
    completedSessionsThisWeek: number
    activeUsers: number
    totalSwapThisWeek: number
    weeklyReports: number
}

export interface CompletedSessionChartPoint {
    day: number
    count: number
}

export interface TopSkillItem {
    skillName: string
    swaps: number
    percentage: number
}

export interface MostActiveUserItem {
    userName: string
    image: string
    swaps: number
}

export interface RequestsVsSessionsItem {
    week: number
    requests: number
    sessions: number
}

export interface UserOverviewData {
    newUsers: number
    newUsersPercentage: number
    usersRatedAbove3: number
    usersRatedAbove3Percentage: number
    usersRatedBelow3: number
    usersRatedBelow3Percentage: number
    usersWithMultipleCancellations: number
    usersWithMultipleCancellationsPercentage: number
    flaggedUsersThisMonth: number
    flaggedUsersThisMonthPercentage: number
}

export interface AdminDashboardData {
    summary: AdminDashboardSummary
    completedSessionsChart: CompletedSessionChartPoint[]
    topSkills: TopSkillItem[]
    mostActiveUsers: MostActiveUserItem[]
    requestsVsSessions: RequestsVsSessionsItem[]
    userOverview: UserOverviewData
    period: AdminDashboardPeriod
}

export type AdminSkillSort = 'newest' | 'oldest'

export interface GetAdminSkillsParams {
    page: number
    limit: number
    search?: string
    sort: AdminSkillSort
}

export interface AdminSkillProvider {
    id: string
    userName: string
    image: unknown
    bio: unknown
    level: unknown
    sessionDuration: unknown
}

export interface AdminSkillRow {
    id: string
    name: string
    provider: AdminSkillProvider | null
    requestsCount: number
    createdAt: string
}

export interface AdminSkillsListResponse {
    data: AdminSkillRow[]
    total: number
    page: number
    limit: number
}

export interface AdminSkillDetails {
    id: string
    name: string
    description: unknown
    category: string
    provider: AdminSkillProvider | null
    language: unknown
    requestsCount: number
    createdAt: string
    updatedAt: string
}

const toNumber = (value: unknown, fallback = 0): number => {
    const normalized = Number(value)
    return Number.isFinite(normalized) ? normalized : fallback
}

const toText = (value: unknown): string => {
    if (typeof value === 'string') return value
    if (typeof value === 'number') return String(value)
    return ''
}

const toProvider = (value: unknown): AdminSkillProvider | null => {
    if (!value || typeof value !== 'object') return null

    const provider = value as Record<string, unknown>
    return {
        id: toText(provider.id),
        userName: toText(provider.userName),
        image: provider.image ?? null,
        bio: provider.bio ?? null,
        level: provider.level ?? null,
        sessionDuration: provider.sessionDuration ?? null,
    }
}

const normalizeSkillRow = (value: unknown): AdminSkillRow => {
    const row = value as Record<string, unknown>
    return {
        id: toText(row.id),
        name: toText(row.name),
        provider: toProvider(row.provider),
        requestsCount: toNumber(row.requestsCount),
        createdAt: toText(row.createdAt),
    }
}

const normalizeSkillsResponse = (value: unknown): AdminSkillsListResponse => {
    const responseRecord = (value ?? {}) as Record<string, unknown>
    const maybeWrapper = responseRecord.data

    const payload =
        maybeWrapper && typeof maybeWrapper === 'object'
            ? (maybeWrapper as Record<string, unknown>)
            : responseRecord

    const listSource = payload.data
    const rows = Array.isArray(listSource) ? listSource.map(normalizeSkillRow) : []

    return {
        data: rows,
        total: toNumber(payload.total),
        page: toNumber(payload.page, 1),
        limit: toNumber(payload.limit, rows.length || 1),
    }
}

const normalizeSkillDetails = (value: unknown): AdminSkillDetails => {
    const rootRecord = (value ?? {}) as Record<string, unknown>
    const payload =
        rootRecord.data && typeof rootRecord.data === 'object'
            ? (rootRecord.data as Record<string, unknown>)
            : rootRecord

    return {
        id: toText(payload.id),
        name: toText(payload.name),
        description: payload.description ?? '',
        category: toText(payload.category),
        provider: toProvider(payload.provider),
        language: payload.language ?? '',
        requestsCount: toNumber(payload.requestsCount),
        createdAt: toText(payload.createdAt),
        updatedAt: toText(payload.updatedAt),
    }
}

export const adminService = {
    getDashboard: async (params: AdminDashboardPeriod): Promise<AdminDashboardData> => {
        const response = await axiosInstance.get('/api/v1/admin/dashboard', { params })
        return (response.data?.data ?? response.data) as AdminDashboardData
    },

    getSkills: async (params: GetAdminSkillsParams): Promise<AdminSkillsListResponse> => {
        const response = await axiosInstance.get('/api/v1/admin/skills', { params })
        return normalizeSkillsResponse(response.data)
    },

    getSkillDetails: async (skillId: string): Promise<AdminSkillDetails> => {
        const response = await axiosInstance.get(`/api/v1/admin/skills/${skillId}`)
        return normalizeSkillDetails(response.data)
    },

    deleteSkill: async (skillId: string): Promise<void> => {
        await axiosInstance.delete(`/api/v1/admin/skills/${skillId}`)
    },
}
