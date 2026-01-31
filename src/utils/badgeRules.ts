import { BADGE_UNLOCK_CONDITIONS } from '@/constants/badges'
import type { Badge, UserStats } from '@/types/index'
export const checkBadgeEligibility = (
    badge: Badge,
    userStats: UserStats
): boolean => {
    const conditions = BADGE_UNLOCK_CONDITIONS[badge.id]

    if (!conditions) { return false }
    const {
        totalPoints = 0,
        totalSessions = 0,
        consecutiveDays = 0,
        fiveStarRatings = 0,
    } = userStats

    if (conditions.minPoints && totalPoints < conditions.minPoints) {
        return false
    }
    if (conditions.minSessions && totalSessions < conditions.minSessions) {
        return false
    }
    if (conditions.minConsecutiveDays && consecutiveDays < conditions.minConsecutiveDays) {
        return false
    }
    if (conditions.minFiveStarRatings && fiveStarRatings < conditions.minFiveStarRatings) {
        return false
    }
    if (conditions.custom && !conditions.custom(userStats)) {
        return false
    }

    return true
}
export const getEligibleBadges = (
    userStats: UserStats,
    allBadges: Badge[]
): Badge[] => {
    return allBadges.filter(badge => checkBadgeEligibility(badge, userStats))
}

export const getNextBadge = (
    currentBadgeIds: string[],
    allBadges: Badge[]
): Badge | null => {
    const availableBadges = allBadges.filter(
        badge => !currentBadgeIds.includes(badge.id)
    )

    if (availableBadges.length === 0) return null

    const sortedBadges = availableBadges.sort((a, b) => {
        const conditionsA = BADGE_UNLOCK_CONDITIONS[a.id]
        const conditionsB = BADGE_UNLOCK_CONDITIONS[b.id]

        if (!conditionsA || !conditionsB) return 0

        const pointsA = conditionsA.minPoints || 0
        const pointsB = conditionsB.minPoints || 0

        return pointsA - pointsB
    })

    return sortedBadges[0]
}

export const calculateBadgeProgress = (
    badge: Badge,
    userStats: UserStats
): number => {
    const conditions = BADGE_UNLOCK_CONDITIONS[badge.id]

    if (!conditions) return 0

    const {
        totalPoints = 0,
        totalSessions = 0,
        consecutiveDays = 0,
        fiveStarRatings = 0,
    } = userStats

    const progressFactors: number[] = []

    if (conditions.minPoints) {
        const pointsProgress = Math.min((totalPoints / conditions.minPoints) * 100, 100)
        progressFactors.push(pointsProgress)
    }
    if (conditions.minSessions) {
        const sessionsProgress = Math.min((totalSessions / conditions.minSessions) * 100, 100)
        progressFactors.push(sessionsProgress)
    }

    if (conditions.minConsecutiveDays) {
        const daysProgress = Math.min((consecutiveDays / conditions.minConsecutiveDays) * 100, 100)
        progressFactors.push(daysProgress)
    }

    if (conditions.minFiveStarRatings) {
        const ratingsProgress = Math.min((fiveStarRatings / conditions.minFiveStarRatings) * 100, 100)
        progressFactors.push(ratingsProgress)
    }

    if (progressFactors.length === 0) return 0
    return Math.round(Math.min(...progressFactors))
}

export const getBadgesByCategory = (
    category: 'learning' | 'achievements' | 'community',
    allBadges: Badge[]
): Badge[] => {
    return allBadges.filter(badge => badge.category === category)
}

export const getRecentlyUnlockedBadges = (
    userBadges: Array<Badge & { awardedAt: Date }>,
    daysAgo: number = 7
): Array<Badge & { awardedAt: Date }> => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo)

    return userBadges
        .filter(badge => new Date(badge.awardedAt) >= cutoffDate)
        .sort((a, b) => new Date(b.awardedAt).getTime() - new Date(a.awardedAt).getTime())
}

export const canUnlockWithNextAction = (
    badge: Badge,
    userStats: UserStats,
    actionType: 'session' | 'rating' | 'login'
): boolean => {
    const conditions = BADGE_UNLOCK_CONDITIONS[badge.id]
    if (!conditions) return false

    const simulatedStats = { ...userStats }

    if (actionType === 'session') {
        simulatedStats.totalSessions += 1
    } else if (actionType === 'rating') {
        simulatedStats.fiveStarRatings += 1
    } else if (actionType === 'login') {
        simulatedStats.consecutiveDays += 1
    }
    return checkBadgeEligibility(badge, simulatedStats)
}
