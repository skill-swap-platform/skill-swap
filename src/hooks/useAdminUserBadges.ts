import { useQuery } from '@tanstack/react-query'
import { getAdminUserBadges } from '@/services/adminUsers.service'

export const useAdminUserBadges = (userId: string | undefined) => {
    const normalizedUserId = userId?.trim() ?? ''

    return useQuery({
        queryKey: ['admin-user-badges', normalizedUserId],
        queryFn: () => getAdminUserBadges(normalizedUserId),
        enabled: normalizedUserId.length > 0,
    })
}
