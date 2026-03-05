import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAdminUserSwaps } from '@/api/extended-services/adminUsers.service'
import type { AdminUserSwapsQueryParams } from '@/types/adminUsers.types'

export const useAdminUserSwaps = (
    userId: string | undefined,
    params: AdminUserSwapsQueryParams
) => {
    const normalizedUserId = userId?.trim() ?? ''

    return useQuery({
        queryKey: [
            'admin-user-swaps',
            normalizedUserId,
            {
                page: params.page ?? 1,
                limit: params.limit ?? 10,
                direction: params.direction,
                status: params.status ?? 'ALL',
                sort: params.sort ?? 'newest',
                startDate: params.startDate ?? '',
                endDate: params.endDate ?? '',
            },
        ],
        queryFn: () => getAdminUserSwaps(normalizedUserId, params),
        enabled: normalizedUserId.length > 0,
        placeholderData: keepPreviousData,
    })
}
