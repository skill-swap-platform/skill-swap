import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAdminUsers } from '@/services/adminUsers.service'
import type {
    AdminUsersQueryParams,
    AdminUsersSort,
    AdminUsersStatusFilter,
} from '@/types/adminUsers.types'

const DEFAULT_LIMIT = 12

type UseAdminUsersParams = {
    page?: number
    limit?: number
    search?: string
    status?: AdminUsersStatusFilter
    sort?: AdminUsersSort
}

export const useAdminUsers = (params: UseAdminUsersParams) => {
    const normalizedParams: Required<Omit<UseAdminUsersParams, 'search'>> & { search: string } = {
        page: params.page ?? 1,
        limit: params.limit ?? DEFAULT_LIMIT,
        search: params.search?.trim() ?? '',
        status: params.status ?? 'ALL',
        sort: params.sort ?? 'newest',
    }

    const queryParams: AdminUsersQueryParams = {
        page: normalizedParams.page,
        limit: normalizedParams.limit,
        search: normalizedParams.search.length > 0 ? normalizedParams.search : undefined,
        sort: normalizedParams.sort,
        status: normalizedParams.status === 'ALL' ? undefined : normalizedParams.status,
    }

    return useQuery({
        queryKey: [
            'admin-users',
            {
                page: normalizedParams.page,
                limit: normalizedParams.limit,
                search: normalizedParams.search,
                status: normalizedParams.status,
                sort: normalizedParams.sort,
            },
        ],
        queryFn: () => getAdminUsers(queryParams),
        placeholderData: keepPreviousData,
    })
}
