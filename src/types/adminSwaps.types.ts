import type { AdminSwapStatus } from '@/types/adminUsers.types'

export type AdminSwapsSort = 'newest' | 'oldest'

export interface AdminSwapsQueryParams {
    page?: number
    limit?: number
    status?: AdminSwapStatus
    sort?: AdminSwapsSort
    startDate?: string
    endDate?: string
}

export interface AdminSwapParticipant {
    id: string
    userName: string
    image: string | null
    email: string
}

export interface AdminSwapSkill {
    id: string
    name: string
}

export interface AdminSwapItem {
    id: string
    sender: AdminSwapParticipant
    receiver: AdminSwapParticipant
    requestType: string
    requestedSkill: AdminSwapSkill | null
    offeredSkill: AdminSwapSkill | null
    status: AdminSwapStatus
    dateTime: string
}

export interface AdminSwapsSummary {
    accepted: number
    pending: number
    rejected: number
}

export interface AdminSwapsPagination {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

export interface AdminSwapsData {
    data: AdminSwapItem[]
    summary: AdminSwapsSummary
    pagination: AdminSwapsPagination
}

export interface AdminSwapsExportPayload {
    swapIds: string[]
}
