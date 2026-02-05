import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getUserPoints,
    getPointsBreakdown,
    getLeaderboard,
    addPoints,
    updateUserPoints,
    getUserRank,
    getPointsHistory,
} from '@/services'
import { usePointsStore } from '@/store'
import type {
    AddPointsDto,
    UpdatePointsDto,
    LeaderboardFilter,
} from '@/types'

export const pointsKeys = {
    all: ['points'] as const,
    summary: (userId: string) => [...pointsKeys.all, 'summary', userId] as const,
    breakdown: (userId: string) => [...pointsKeys.all, 'breakdown', userId] as const,
    leaderboard: (filters?: LeaderboardFilter) => [...pointsKeys.all, 'leaderboard', filters] as const,
    rank: (userId: string) => [...pointsKeys.all, 'rank', userId] as const,
    history: (userId: string, params?: any) => [...pointsKeys.all, 'history', userId, params] as const,
}

export const useUserPoints = (userId: string) => {
    const { setPointsSummary, setLoading, setError } = usePointsStore()

    return useQuery({
        queryKey: pointsKeys.summary(userId),
        queryFn: async () => {
            setLoading(true)
            try {
                const summary = await getUserPoints(userId)
                setPointsSummary(summary)
                return summary
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

export const usePointsBreakdown = (userId: string) => {
    return useQuery({
        queryKey: pointsKeys.breakdown(userId),
        queryFn: () => getPointsBreakdown(userId),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
    })
}

export const useLeaderboard = (filters?: LeaderboardFilter) => {
    const { setLeaderboard, setLoading, setError } = usePointsStore()

    return useQuery({
        queryKey: pointsKeys.leaderboard(filters),
        queryFn: async () => {
            setLoading(true)
            try {
                const data = await getLeaderboard(filters)
                setLeaderboard(data.entries)
                return data
            } catch (error: any) {
                setError(error.message)
                throw error
            } finally {
                setLoading(false)
            }
        },
        staleTime: 2 * 60 * 1000,
    })
}

export const useUserRank = (userId: string) => {
    return useQuery({
        queryKey: pointsKeys.rank(userId),
        queryFn: () => getUserRank(userId),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
    })
}

export const usePointsHistory = (
    userId: string,
    params?: { limit?: number; offset?: number }
) => {
    return useQuery({
        queryKey: pointsKeys.history(userId, params),
        queryFn: () => getPointsHistory(userId, params),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
    })
}

export const useAddPoints = () => {
    const queryClient = useQueryClient()
    const { addActivity } = usePointsStore()

    return useMutation({
        mutationFn: (data: AddPointsDto) => addPoints(data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: pointsKeys.summary(variables.userId) })
            queryClient.invalidateQueries({ queryKey: pointsKeys.leaderboard() })
            queryClient.invalidateQueries({ queryKey: pointsKeys.rank(variables.userId) })

            if (data.activities && data.activities.length > 0) {
                addActivity(data.activities[0])
            }
        },
    })
}

export const useUpdatePoints = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdatePointsDto) => updateUserPoints(data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: pointsKeys.summary(variables.userId) })
            queryClient.invalidateQueries({ queryKey: pointsKeys.leaderboard() })
            queryClient.invalidateQueries({ queryKey: pointsKeys.rank(variables.userId) })
        },
    })
}
