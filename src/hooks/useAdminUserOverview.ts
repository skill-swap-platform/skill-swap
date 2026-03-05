import { useQuery } from '@tanstack/react-query'
import { getAdminUserOverview } from '@/api/extended-services/adminUsers.service'

export const useAdminUserOverview = (userId: string | undefined) =>
    useQuery({
        queryKey: ['admin-user-overview', userId],
        queryFn: () => getAdminUserOverview(userId ?? ''),
        enabled: Boolean(userId && userId.trim().length > 0),
    })
