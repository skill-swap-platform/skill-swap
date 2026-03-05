import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { exportAdminSessionsCsv, getAdminSessions } from '@/api/extended-services/adminSessions.service'
import type {
    AdminSessionsExportPayload,
    AdminSessionsQueryParams,
} from '@/types/adminSessions.types'

const DEFAULT_LIMIT = 10

export const useAdminSessions = (params: AdminSessionsQueryParams) => {
    const normalizedParams = {
        page: params.page ?? 1,
        limit: params.limit ?? DEFAULT_LIMIT,
        search: params.search?.trim() ?? '',
        status: params.status,
        sort: params.sort ?? 'newest',
        startDate: params.startDate ?? '',
        endDate: params.endDate ?? '',
    }

    const queryParams: AdminSessionsQueryParams = {
        page: normalizedParams.page,
        limit: normalizedParams.limit,
        search: normalizedParams.search.length > 0 ? normalizedParams.search : undefined,
        status: normalizedParams.status,
        sort: normalizedParams.sort,
        startDate: normalizedParams.startDate || undefined,
        endDate: normalizedParams.endDate || undefined,
    }

    return useQuery({
        queryKey: ['admin-sessions', normalizedParams],
        queryFn: () => getAdminSessions(queryParams),
        placeholderData: keepPreviousData,
    })
}

export const useExportAdminSessionsCsv = () =>
    useMutation({
        mutationFn: (payload: AdminSessionsExportPayload) => exportAdminSessionsCsv(payload),
    })
