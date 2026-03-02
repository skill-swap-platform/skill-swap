export type AdminSessionStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'DISPUTED'

export type AdminSessionsSort = 'newest' | 'oldest'

export interface AdminSessionsQueryParams {
    page?: number
    limit?: number
    search?: string
    status?: AdminSessionStatus
    sort?: AdminSessionsSort
    startDate?: string
    endDate?: string
}

export interface AdminSessionParticipant {
    id: string
    userName: string
    image: string | null
}

export interface AdminSessionItem {
    id: string
    scheduledAt: string
    endsAt: string
    status: AdminSessionStatus
    skillName: string
    host: AdminSessionParticipant
    attendee: AdminSessionParticipant
    duration: number | null
}

export interface AdminSessionsSummary {
    completed: number
    cancelled: number
    disputed: number
}

export interface AdminSessionsPagination {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

export interface AdminSessionsData {
    data: AdminSessionItem[]
    summary: AdminSessionsSummary
    pagination: AdminSessionsPagination
}

export interface AdminSessionsExportPayload {
    sessionIds: string[]
}
