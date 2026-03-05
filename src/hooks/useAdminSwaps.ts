import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { exportAdminSwapsCsv, getAdminSwaps } from '@/api/extended-services/adminSwaps.service'
import type { AdminSwapsExportPayload, AdminSwapsQueryParams } from '@/types/adminSwaps.types'

const DEFAULT_LIMIT = 10

export const useAdminSwaps = (params: AdminSwapsQueryParams) => {
    const normalizedParams = {
        page: params.page ?? 1,
        limit: params.limit ?? DEFAULT_LIMIT,
        status: params.status,
        sort: params.sort ?? 'newest',
        startDate: params.startDate ?? '',
        endDate: params.endDate ?? '',
    }

    return useQuery({
        queryKey: ['admin-swaps', normalizedParams],
        queryFn: () => getAdminSwaps(normalizedParams),
        placeholderData: keepPreviousData,
    })
}

export const useExportAdminSwapsCsv = () =>
    useMutation({
        mutationFn: (payload: AdminSwapsExportPayload) => exportAdminSwapsCsv(payload),
    })

