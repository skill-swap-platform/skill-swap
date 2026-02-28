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
