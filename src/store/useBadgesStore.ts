import { create } from 'zustand'
import type { Badge, UserBadge, BadgeProgress } from '@/types'

interface BadgesState {
    allBadges: Badge[]
    userBadges: UserBadge[]
    badgeProgress: BadgeProgress[]
    recentlyUnlocked: UserBadge | null
    isLoading: boolean
    error: string | null

    setAllBadges: (badges: Badge[]) => void
    setUserBadges: (badges: UserBadge[]) => void
    setBadgeProgress: (progress: BadgeProgress[]) => void
    addUserBadge: (badge: UserBadge) => void
    setRecentlyUnlocked: (badge: UserBadge | null) => void
    setLoading: (isLoading: boolean) => void
    setError: (error: string | null) => void
    reset: () => void
}

const initialState = {
    allBadges: [],
    userBadges: [],
    badgeProgress: [],
    recentlyUnlocked: null,
    isLoading: false,
    error: null,
}
export const useBadgesStore = create<BadgesState>((set) => ({
    ...initialState,
    setAllBadges: (badges) =>
        set({ allBadges: badges, error: null }),

    setUserBadges: (badges) =>
        set({ userBadges: badges, error: null }),

    setBadgeProgress: (progress) =>
        set({ badgeProgress: progress, error: null }),

    addUserBadge: (badge) =>
        set((state) => ({
            userBadges: [...state.userBadges, badge],
            recentlyUnlocked: badge,
        })),

    setRecentlyUnlocked: (badge) =>
        set({ recentlyUnlocked: badge }),
    setLoading: (isLoading) =>
        set({ isLoading }),
    setError: (error) =>
        set({ error, isLoading: false }),
    reset: () =>
        set(initialState),
}))
