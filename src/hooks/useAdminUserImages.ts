import { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { userService } from '@/api/services/user.service'

const imageUrlFromUnknown = (value: unknown): string | null => {
    if (typeof value === 'string') return value
    if (!value || typeof value !== 'object') return null

    const image = value as Record<string, unknown>
    const resolvedValue =
        image.url ??
        image.secure_url ??
        image.secureUrl ??
        image.path ??
        image.publicUrl ??
        image.public_url ??
        image.src

    return typeof resolvedValue === 'string' ? resolvedValue : null
}

type ImageMap = Record<string, string | null>

export const useAdminUserImages = (userIds: string[]) => {
    const uniqueUserIds = useMemo(
        () => Array.from(new Set(userIds.filter((id) => typeof id === 'string' && id.trim().length > 0))),
        [userIds]
    )

    const queries = useQueries({
        queries: uniqueUserIds.map((userId) => ({
            queryKey: ['admin-user-image', userId],
            queryFn: async (): Promise<string | null> => {
                const response = await userService.getPublicProfile(userId)
                if (!response.success) return null

                const profile = response.data as unknown as Record<string, unknown>
                return (
                    imageUrlFromUnknown(profile.image) ??
                    imageUrlFromUnknown(profile.profileImage) ??
                    imageUrlFromUnknown(profile.avatar)
                )
            },
            staleTime: 5 * 60 * 1000,
            retry: 0,
        })),
    })

    const imageByUserId = useMemo<ImageMap>(() => {
        const map: ImageMap = {}
        uniqueUserIds.forEach((userId, index) => {
            map[userId] = queries[index]?.data ?? null
        })
        return map
    }, [queries, uniqueUserIds])

    return {
        imageByUserId,
        isLoading: queries.some((query) => query.isLoading),
    }
}
