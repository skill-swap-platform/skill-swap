export type PointActivityType =
    | 'SESSION_COMPLETED'
    | 'SESSION_RATED'
    | 'FIRST_SESSION'
    | 'FEEDBACK_GIVEN'
    | 'PROFILE_COMPLETED'
    | 'SWAP_REQUEST_SENT'
    | 'SWAP_REQUEST_ACCEPTED'
    | 'SKILL_ADDED'
    | 'CONSECUTIVE_DAY_BONUS'

export interface PointActivity {
    id: string
    userId: string
    type: PointActivityType
    points: number
    description: string
    createdAt: Date
    metadata?: Record<string, any>
}

export interface PointsSummary {
    userId: string
    totalPoints: number
    lifetimePoints: number
    currentRank?: number
    pointsToNextRank?: number
    activities: PointActivity[]
}

export interface PointsBreakdown {
    sessionPoints: number
    ratingPoints: number
    feedbackPoints: number
    bonusPoints: number
    total: number
    breakdown: {
        type: PointActivityType
        count: number
        totalPoints: number
    }[]
}

export interface LeaderboardEntry {
    userId: string
    userName: string
    userAvatar?: string
    totalPoints: number
    rank: number
    badges: number
    completedSessions: number
}

export interface LeaderboardFilter {
    timeRange?: 'all_time' | 'this_month' | 'this_week' | 'today'
    limit?: number
    offset?: number
}
export interface AddPointsDto {
    userId: string
    activityType: PointActivityType
    additionalData?: {
        rating?: number
        sessionId?: string
        skillId?: string
        [key: string]: any
    }
}
export interface UpdatePointsDto {
    userId: string
    points: number
    reason: string
}
