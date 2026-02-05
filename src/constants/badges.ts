import type { Badge } from '@/types'

export const BADGE_CATEGORIES = {
    LEARNING: 'learning',
    ACHIEVEMENTS: 'achievements',
    COMMUNITY: 'community',
} as const

export type BadgeCategory = typeof BADGE_CATEGORIES[keyof typeof BADGE_CATEGORIES]
export const BADGE_COLOR_SCHEMES = {
    YELLOW: '#F59E0B',
    BLUE: '#3B82F6',
    GRAY: '#6B7280',
    PURPLE: '#A855F7',
} as const

export const BADGE_ICONS = [
    '⭐',
    '🌟',
    '✨',
    '💫',
    '⚡',
    '🏆',
] as const

export const DEFAULT_BADGES: Badge[] = [
    {
        id: 'community-hero',
        name: 'Community Hero',
        description: 'Helped +100 community users',
        icon: '⭐',
        color: BADGE_COLOR_SCHEMES.YELLOW,
        category: 'community',
        requiredPoints: 500,
        requiredSessions: 100,
    },
    {
        id: 'first-session',
        name: 'First Session',
        description: 'Complete your first skill swap session',
        icon: '🌟',
        color: BADGE_COLOR_SCHEMES.BLUE,
        category: 'learning',
        requiredPoints: 0,
        requiredSessions: 1,
    },
    {
        id: 'skill-master',
        name: 'Skill Master',
        description: 'Completed 50 sessions',
        icon: '🏆',
        color: BADGE_COLOR_SCHEMES.PURPLE,
        category: 'achievements',
        requiredPoints: 500,
        requiredSessions: 50,
    },
    {
        id: 'helpful-mentor',
        name: 'Helpful Mentor',
        description: 'Received 20+ five-star ratings',
        icon: '✨',
        color: BADGE_COLOR_SCHEMES.YELLOW,
        category: 'achievements',
        requiredPoints: 200,
        requiredSessions: 0,
    },
    {
        id: 'consistent-learner',
        name: 'Consistent Learner',
        description: 'Logged in for 7 consecutive days',
        icon: '⚡',
        color: BADGE_COLOR_SCHEMES.BLUE,
        category: 'learning',
        requiredPoints: 100,
        requiredSessions: 0,
    },
]

export const BADGE_UNLOCK_CONDITIONS: Record<string, {
    minPoints?: number
    minSessions?: number
    minConsecutiveDays?: number
    minFiveStarRatings?: number
    custom?: (userStats: any) => boolean
}> = {
    'community-hero': {
        minPoints: 500,
        minSessions: 100,
    },
    'first-session': {
        minSessions: 1,
    },
    'skill-master': {
        minPoints: 500,
        minSessions: 50,
    },
    'helpful-mentor': {
        minPoints: 200,
        minFiveStarRatings: 20,
    },
    'consistent-learner': {
        minPoints: 100,
        minConsecutiveDays: 7,
    },
}

export const POINTS_RANGES = [
    { label: '0 - 1,000', min: 0, max: 1000 },
    { label: '0 - 1,000, 3,000', min: 0, max: 3000 },
    { label: '+3,000', min: 3000, max: null },
    { label: '+4,000', min: 4000, max: null },
] as const

export const ACTIVITY_TIME_RANGES = {
    ALL_TIME: 'all_time',
    LAST_24_HOURS: 'last_24_hours',
    LAST_7_DAYS: 'last_7_days',
    LAST_30_DAYS: 'last_30_days',
} as const

export const ACTIVITY_TIME_RANGE_LABELS = {
    [ACTIVITY_TIME_RANGES.ALL_TIME]: 'All Time',
    [ACTIVITY_TIME_RANGES.LAST_24_HOURS]: 'Last 24 hours',
    [ACTIVITY_TIME_RANGES.LAST_7_DAYS]: 'Last 7 Days',
    [ACTIVITY_TIME_RANGES.LAST_30_DAYS]: 'Last 30 Days',
} as const
