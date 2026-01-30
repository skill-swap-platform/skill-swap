import { create } from 'zustand'
import type { PointsSummary, PointActivity, LeaderboardEntry } from '@/types'

interface PointsState {
    pointsSummary: PointsSummary | null
    leaderboard: LeaderboardEntry[]
    isLoading: boolean
    error: string | null
    setPointsSummary: (summary: PointsSummary) => void
    setLeaderboard: (leaderboard: LeaderboardEntry[]) => void
    addActivity: (activity: PointActivity) => void
    setLoading: (isLoading: boolean) => void
    setError: (error: string | null) => void
    reset: () => void
}
const initialState = {
    pointsSummary: null,
    leaderboard: [],
    isLoading: false,
    error: null,
}
export const usePointsStore = create<PointsState>((set) => ({
    ...initialState,

    setPointsSummary: (summary) =>
        set({ pointsSummary: summary, error: null }),

    setLeaderboard: (leaderboard) =>
        set({ leaderboard, error: null }),

    addActivity: (activity) =>
        set((state) => ({
            pointsSummary: state.pointsSummary
                ? {
                    ...state.pointsSummary,
                    activities: [activity, ...state.pointsSummary.activities],
                    totalPoints: state.pointsSummary.totalPoints + activity.points,
                }
                : null,
        })),

    setLoading: (isLoading) =>
        set({ isLoading }),

    setError: (error) =>
        set({ error, isLoading: false }),

    reset: () =>
        set(initialState),
}))
