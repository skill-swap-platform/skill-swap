export type SessionStatus =
    | 'pending'
    | 'accepted'
    | 'declined'
    | 'scheduled'
    | 'in_progress'
    | 'completed'
    | 'cancelled'

export interface Session {
    id: string
    providerId: string
    seekerId: string
    skillId: string
    status: SessionStatus
    scheduledAt?: Date
    startedAt?: Date
    completedAt?: Date
    duration?: number
    providerRating?: number
    seekerRating?: number
    createdAt: Date
    updatedAt: Date
}

export interface SessionDetails extends Session {
    providerName: string
    providerAvatar?: string
    seekerName: string
    seekerAvatar?: string
    skillName: string
    notes?: string
}

export interface SessionFilter {
    status?: SessionStatus
    role?: 'provider' | 'seeker'
    dateFrom?: Date
    dateTo?: Date
    limit?: number
    offset?: number
}
