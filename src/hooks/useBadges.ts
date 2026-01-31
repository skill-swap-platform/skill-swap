import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getAllBadges,
    getUserBadges,
    getBadgeProgress,
    getAllBadgeProgress,
    awardBadge,
    createBadge,
    updateBadge,
    deleteBadge,
    removeBadgeFromUser,
    getBadgesByCategory,
} from '@/services'
import { useBadgesStore } from '@/store'
import type { CreateBadgeDto, UpdateBadgeDto } from '@/types'


export const badgesKeys = {
    all: ['badges'] as const,
    list: () => [...badgesKeys.all, 'list'] as const,
    user: (userId: string) => [...badgesKeys.all, 'user', userId] as const,
    progress: (userId: string, badgeId?: string) =>
        badgeId
            ? [...badgesKeys.all, 'progress', userId, badgeId] as const
            : [...badgesKeys.all, 'progress', userId] as const,
    category: (category: string) => [...badgesKeys.all, 'category', category] as const,
}

export const useAllBadges = () => {
    const { setAllBadges, setLoading, setError } = useBadgesStore()

    return useQuery({
        queryKey: badgesKeys.list(),
        queryFn: async () => {
            setLoading(true)
            try {
                const data = await getAllBadges()
                setAllBadges(data)
                return data
            } catch (error: any) {
                setError(error.message)
                throw error
            } finally {
                setLoading(false)
            }
        },
        staleTime: 10 * 60 * 1000,
    })
}

export const useUserBadges = (userId: string) => {
    const { setUserBadges, setLoading, setError } = useBadgesStore()

    return useQuery({
        queryKey: badgesKeys.user(userId),
        queryFn: async () => {
            setLoading(true)
            try {
                const data = await getUserBadges(userId)
                setUserBadges(data)
                return data
            } catch (error: any) {
                setError(error.message)
                throw error
            } finally {
                setLoading(false)
            }
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
    })
}

export const useBadgeProgress = (userId: string, badgeId: string) => {
    return useQuery({
        queryKey: badgesKeys.progress(userId, badgeId),
        queryFn: () => getBadgeProgress(userId, badgeId),
        enabled: !!userId && !!badgeId,
        staleTime: 5 * 60 * 1000,
    })
}

export const useAllBadgeProgress = (userId: string) => {
    const { setBadgeProgress, setLoading, setError } = useBadgesStore()

    return useQuery({
        queryKey: badgesKeys.progress(userId),
        queryFn: async () => {
            setLoading(true)
            try {
                const data = await getAllBadgeProgress(userId)
                setBadgeProgress(data)
                return data
            } catch (error: any) {
                setError(error.message)
                throw error
            } finally {
                setLoading(false)
            }
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
    })
}

export const useBadgesByCategory = (
    category: 'learning' | 'achievements' | 'community'
) => {
    return useQuery({
        queryKey: badgesKeys.category(category),
        queryFn: () => getBadgesByCategory(category),
        staleTime: 10 * 60 * 1000,
    })
}

export const useAwardBadge = () => {
    const queryClient = useQueryClient()
    const { addUserBadge, setRecentlyUnlocked } = useBadgesStore()

    return useMutation({
        mutationFn: ({ userId, badgeId }: { userId: string; badgeId: string }) =>
            awardBadge(userId, badgeId),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: badgesKeys.user(variables.userId) })
            queryClient.invalidateQueries({ queryKey: badgesKeys.progress(variables.userId) })

            addUserBadge(data)

            setTimeout(() => setRecentlyUnlocked(null), 5000)
        },
    })
}

export const useCreateBadge = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateBadgeDto) => createBadge(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: badgesKeys.list() })
        },
    })
}

export const useUpdateBadge = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateBadgeDto) => updateBadge(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: badgesKeys.list() })
        },
    })
}

export const useDeleteBadge = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (badgeId: string) => deleteBadge(badgeId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: badgesKeys.list() })
        },
    })
}

export const useRemoveBadgeFromUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ userId, badgeId }: { userId: string; badgeId: string }) =>
            removeBadgeFromUser(userId, badgeId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: badgesKeys.user(variables.userId) })
            queryClient.invalidateQueries({ queryKey: badgesKeys.progress(variables.userId) })
        },
    })
}
