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
