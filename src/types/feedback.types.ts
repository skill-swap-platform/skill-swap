export type FeedbackRating = 1 | 2 | 3 | 4 | 5
export interface Feedback {
    id: string
    sessionId: string
    fromUserId: string
    toUserId: string
    rating: FeedbackRating
    comment?: string
    wasHelpful?: boolean
    wouldRecommend?: boolean
    tags?: string[]
    improvement?: string
    createdAt: Date
    updatedAt?: Date
}

export interface SessionFeedback {
    sessionId: string
    providerFeedback?: Feedback
    seekerFeedback?: Feedback
    mutualRating?: number
    isComplete: boolean
}

export interface FeedbackFormData {
    rating: FeedbackRating
    comment?: string
    wasHelpful?: boolean
    wouldRecommend?: boolean
    tags?: string[]
}

export interface SubmitFeedbackDto {
    sessionId: string
    toUserId: string
    rating: FeedbackRating
    comment?: string
    wasHelpful?: boolean
    wouldRecommend?: boolean
    tags?: string[]
}

export interface FeedbackStats {
    userId: string
    totalFeedbacks: number
    averageRating: number
    fiveStarCount: number
    fourStarCount: number
    threeStarCount: number
    twoStarCount: number
    oneStarCount: number
    ratingDistribution: {
        rating: FeedbackRating
        count: number
        percentage: number
    }[]
}

export interface FeedbackHistoryFilter {
    role?: 'provider' | 'seeker' | 'both'
    minRating?: FeedbackRating
    dateFrom?: Date
    dateTo?: Date
    limit?: number
    offset?: number
}
