import { useQuery } from '@tanstack/react-query'
import { getAdminUserActivityLog } from '@/services/adminUsers.service'

export const useAdminUserActivityLog = (userId: string | undefined) => {
    const normalizedUserId = userId?.trim() ?? ''

    return useQuery({
        queryKey: ['admin-user-activity-log', normalizedUserId],
        queryFn: () => getAdminUserActivityLog(normalizedUserId),
        enabled: normalizedUserId.length > 0,
    })
}
