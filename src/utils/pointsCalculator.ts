import { POINTS_REWARDS } from '@/constants/points'
import type { PointActivityType } from '@/types'

export const calculatePoints = (
    activityType: PointActivityType,
    additionalData?: { rating?: number;[key: string]: any }
): number => {
    switch (activityType) {
        case 'SESSION_COMPLETED':
            return POINTS_REWARDS.SESSION_COMPLETED

        case 'SESSION_RATED':
            const rating = additionalData?.rating || 0
            if (rating === 5) return POINTS_REWARDS.SESSION_RATED_5_STARS
            if (rating === 4) return POINTS_REWARDS.SESSION_RATED_4_STARS
            if (rating === 3) return POINTS_REWARDS.SESSION_RATED_3_STARS
            return 0

        case 'FIRST_SESSION':
            return POINTS_REWARDS.FIRST_SESSION

        case 'FEEDBACK_GIVEN':
            return POINTS_REWARDS.FEEDBACK_GIVEN

        case 'PROFILE_COMPLETED':
            return POINTS_REWARDS.PROFILE_COMPLETED

        case 'SWAP_REQUEST_SENT':
            return POINTS_REWARDS.SWAP_REQUEST_SENT

        case 'SWAP_REQUEST_ACCEPTED':
            return POINTS_REWARDS.SWAP_REQUEST_ACCEPTED

        case 'SKILL_ADDED':
            return POINTS_REWARDS.SKILL_ADDED

        case 'CONSECUTIVE_DAY_BONUS':
            return POINTS_REWARDS.CONSECUTIVE_DAY_BONUS

        default:
            return 0
    }
}

export const calculateTotalPoints = (
    activities: Array<{ type: PointActivityType; data?: any }>
): number => {
    return activities.reduce((total, activity) => {
        return total + calculatePoints(activity.type, activity.data)
    }, 0)
}

export const calculatePointsToGoal = (
    currentPoints: number,
    goalPoints: number
): number => {
    const remaining = goalPoints - currentPoints
    return remaining > 0 ? remaining : 0
}

export const calculateProgressPercentage = (
    currentPoints: number,
    goalPoints: number
): number => {
    if (goalPoints === 0) return 100
    const percentage = (currentPoints / goalPoints) * 100
    return Math.min(Math.round(percentage), 100)
}

export const getPointsRangeCategory = (points: number): string => {
    if (points >= 4000) return '+4,000'
    if (points >= 3000) return '+3,000'
    if (points >= 1000) return '1,000 - 3,000'
    return '0 - 1,000'
}

export const isPointsInRange = (
    points: number,
    min: number,
    max: number | null
): boolean => {
    if (max === null) {
        return points >= min
    }
    return points >= min && points <= max
}
export const calculateRank = (
    userPoints: number,
    allUserPoints: number[]
): number => {
    const sortedPoints = [...allUserPoints].sort((a, b) => b - a)
    const rank = sortedPoints.findIndex(p => p <= userPoints) + 1
    return rank || sortedPoints.length + 1
}
export const getPointsToNextRank = (
    currentPoints: number,
    nextRankPoints: number
): number => {
    return Math.max(0, nextRankPoints - currentPoints)
}
