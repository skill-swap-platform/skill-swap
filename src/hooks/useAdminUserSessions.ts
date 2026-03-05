import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAdminUserSessions } from '@/api/extended-services/adminUsers.service'
import type { AdminUserSessionsQueryParams } from '@/types/adminUsers.types'

export const useAdminUserSessions = (
    userId: string | undefined,
    params: AdminUserSessionsQueryParams
) => {
    const normalizedUserId = userId?.trim() ?? ''

    return useQuery({
        queryKey: [
            'admin-user-sessions',
            normalizedUserId,
            {
                page: params.page ?? 1,
                limit: params.limit ?? 12,
                search: params.search ?? '',
                status: params.status ?? 'ALL',
                sort: params.sort ?? 'newest',
                startDate: params.startDate ?? '',
                endDate: params.endDate ?? '',
            },
        ],
        queryFn: () => getAdminUserSessions(normalizedUserId, params),
        enabled: normalizedUserId.length > 0,
        placeholderData: keepPreviousData,
    })
}
