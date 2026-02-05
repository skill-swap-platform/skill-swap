import type { Badge } from './badge.types'

export type UserRole = 'skill_seeker' | 'skill_provider' | 'both' | 'admin'

export interface User {
    id: string
    name: string
    email: string
    avatar?: string
    role: UserRole
    totalPoints: number
    totalSessions: number
    averageRating: number
    badges: Badge[]
    skillsTaught: number
    skillsLearned: number
    consecutiveDays: number
    fiveStarRatings: number
    joinedAt: Date
    lastActiveAt: Date
}

export interface UserStats {
    totalPoints: number
    lifetimePoints: number
    currentRank: number
    totalSessions: number
    completedSessions: number
    averageRating: number
    badges: Badge[]
    badgesCount: number
    skillsTaught: number
    skillsLearned: number
    consecutiveDays: number
    fiveStarRatings: number
    achievements: Achievement[]
}

export interface Achievement {
    id: string
    title: string
    description: string
    icon: string
    unlockedAt: Date
}

export interface UpdateUserProfileDto {
    name?: string
    avatar?: string
    bio?: string
    skills?: string[]
}
