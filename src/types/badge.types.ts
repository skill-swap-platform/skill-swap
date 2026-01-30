
export interface Badge {
    id: string
    name: string
    description: string
    icon: string
    color: string
    requiredPoints: number
    requiredSessions: number
    category?: 'learning' | 'achievements' | 'community'
    createdAt?: Date
    updatedAt?: Date
}

export interface UserBadge extends Badge {
    awardedAt: Date
    progress?: number
}
export interface BadgeProgress {
    badgeId: string
    badge: Badge
    currentProgress: number
    totalRequired: number
    percentage: number
    isUnlocked: boolean
    remainingPoints?: number
    remainingSessions?: number
}

export interface BadgeAwardEvent {
    badgeId: string
    badge: Badge
    userId: string
    awardedAt: Date
    triggeredBy: 'session_completion' | 'points_milestone' | 'manual'
}

export interface BadgeFilterOptions {
    category?: 'learning' | 'achievements' | 'community'
    unlocked?: boolean
    sortBy?: 'name' | 'date' | 'rarity'
    sortOrder?: 'asc' | 'desc'
}

export interface CreateBadgeDto {
    name: string
    description: string
    icon: string
    color: string
    requiredPoints: number
    requiredSessions: number
    category?: 'learning' | 'achievements' | 'community'
}

export interface UpdateBadgeDto extends Partial<CreateBadgeDto> {
    id: string
}
