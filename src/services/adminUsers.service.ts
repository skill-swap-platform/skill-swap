import axiosInstance from '@/api/axiosInstance'
import type {
    AdminSessionStatus,
    AdminSwapStatus,
    AdminUserSwapItem,
    AdminUserSwapsData,
    AdminUserSwapsPagination,
    AdminUserSwapsQueryParams,
    AdminUserSessionItem,
    AdminUserSessionProfile,
    AdminUserSessionsData,
    AdminUserSessionsPagination,
    AdminUserSessionsQueryParams,
    AdminUserItem,
    AdminUserStatus,
    AdminUserOverviewData,
    AdminUserOverviewNote,
    AdminUserOverviewProfile,
    AdminUserOverviewSkill,
    AdminUserActivityLogItem,
    AdminUserBadgeItem,
    AdminUserBadgesData,
    AdminUsersData,
    AdminUsersPagination,
    AdminUserRestrictionPayload,
    AdminUserAdjustPointsPayload,
    AdminUsersQueryParams,
    AdminUsersResponse,
} from '@/types/adminUsers.types'

const DEFAULT_LIMIT = 12
const DEFAULT_SWAPS_LIMIT = 10
const DEFAULT_SESSIONS_LIMIT = 12

const toText = (value: unknown, fallback = ''): string => {
    if (typeof value === 'string') return value
    if (typeof value === 'number') return String(value)
    return fallback
}

const normalizeNumberString = (value: string): string => {
    const cleaned = value.trim().replace(/[^\d.,-]/g, '')
    if (!cleaned) return ''

    const thousandsPattern = /^-?\d{1,3}([.,]\d{3})+$/
    if (thousandsPattern.test(cleaned)) {
        return cleaned.replace(/[.,]/g, '')
    }

    const hasDot = cleaned.includes('.')
    const hasComma = cleaned.includes(',')

    if (hasDot && hasComma) {
        const lastDot = cleaned.lastIndexOf('.')
        const lastComma = cleaned.lastIndexOf(',')
        const decimalSeparator = lastDot > lastComma ? '.' : ','
        const thousandsSeparator = decimalSeparator === '.' ? ',' : '.'
        const withoutThousands = cleaned.split(thousandsSeparator).join('')
        return decimalSeparator === ','
            ? withoutThousands.replace(',', '.')
            : withoutThousands
    }

    if (hasComma && !hasDot) {
        const commaParts = cleaned.split(',')
        if (commaParts.length === 2 && commaParts[1].length !== 3) {
            return cleaned.replace(',', '.')
        }
        return cleaned.replace(/,/g, '')
    }

    if (hasDot && !hasComma) {
        const dotParts = cleaned.split('.')
        if (dotParts.length === 2 && dotParts[1].length === 3 && dotParts[0].length >= 1) {
            return cleaned.replace(/\./g, '')
        }
        return cleaned
    }

    return cleaned
}

const toNullableNumber = (value: unknown): number | null => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : null

    if (typeof value === 'string') {
        const normalized = normalizeNumberString(value)
        if (!normalized) return null
        const parsed = Number(normalized)
        return Number.isFinite(parsed) ? parsed : null
    }

    if (Array.isArray(value)) {
        for (const entry of value) {
            const parsed = toNullableNumber(entry)
            if (parsed !== null) return parsed
        }
        return null
    }

    if (value && typeof value === 'object') {
        const row = value as Record<string, unknown>
        const candidate =
            row.value ??
            row.total ??
            row.count ??
            row.points ??
            row.point ??
            row.rating ??
            row.average ??
            row.avg ??
            row.avgRating ??
            row.avgRate ??
            row.duration ??
            row.durationMinutes ??
            row.sessionDuration ??
            row.minutes

        if (candidate !== undefined) {
            const parsed = toNullableNumber(candidate)
            if (parsed !== null) return parsed
        }
    }

    return null
}

const toNumber = (value: unknown, fallback = 0): number => toNullableNumber(value) ?? fallback

const normalizeLookupKey = (value: string): string => value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()

const findNumberInObject = (
    source: unknown,
    keys: string[],
    depth = 0,
    visited = new WeakSet<object>()
): number | null => {
    if (depth > 5 || source == null) return null

    const direct = toNullableNumber(source)
    if (typeof source !== 'object') return direct

    if (Array.isArray(source)) {
        for (const entry of source) {
            const match = findNumberInObject(entry, keys, depth + 1, visited)
            if (match !== null) return match
        }
        return null
    }

    const record = source as Record<string, unknown>
    if (visited.has(record)) return null
    visited.add(record)

    const normalizedKeys = new Set(keys.map(normalizeLookupKey))

    for (const [key, value] of Object.entries(record)) {
        if (!normalizedKeys.has(normalizeLookupKey(key))) continue
        const parsed = toNullableNumber(value)
        if (parsed !== null) return parsed
    }

    for (const value of Object.values(record)) {
        const match = findNumberInObject(value, keys, depth + 1, visited)
        if (match !== null) return match
    }

    return null
}

const firstResolvedNumber = (sources: unknown[], keys: string[]): number | null => {
    for (const source of sources) {
        const match = findNumberInObject(source, keys)
        if (match !== null) return match
    }
    return null
}

const firstResolvedNumberShallow = (
    sources: Array<Record<string, unknown> | null | undefined>,
    keys: string[]
): number | null => {
    for (const source of sources) {
        if (!source) continue
        for (const key of keys) {
            if (!(key in source)) continue
            const match = toNullableNumber(source[key])
            if (match !== null) return match
        }
    }
    return null
}

const toBoolean = (value: unknown, fallback = false): boolean => {
    if (typeof value === 'boolean') return value
    return fallback
}

const imageUrlFromUnknown = (value: unknown): string | null => {
    if (typeof value === 'string') return value
    if (!value || typeof value !== 'object') return null

    const image = value as Record<string, unknown>
    const resolvedValue =
        image.url ??
        image.secure_url ??
        image.secureUrl ??
        image.path ??
        image.publicUrl ??
        image.public_url ??
        image.src
    return typeof resolvedValue === 'string' ? resolvedValue : null
}

const resolveImage = (row: Record<string, unknown>): string | null => {
    const imageCandidates = [
        row.image,
        row.avatar,
        row.avatarUrl,
        row.profileImage,
        row.picture,
        row.photo,
        row.userImage,
        row.imageUrl,
    ]

    for (const candidate of imageCandidates) {
        const url = imageUrlFromUnknown(candidate)
        if (url) return url
    }

    if (row.user && typeof row.user === 'object') {
        const userObject = row.user as Record<string, unknown>
        return resolveImage(userObject)
    }

    if (row.profile && typeof row.profile === 'object') {
        const profileObject = row.profile as Record<string, unknown>
        return resolveImage(profileObject)
    }

    return null
}

const resolveUserObject = (row: Record<string, unknown>): Record<string, unknown> | null => {
    if (row.user && typeof row.user === 'object') return row.user as Record<string, unknown>
    if (row.userId && typeof row.userId === 'object') return row.userId as Record<string, unknown>
    if (row.profile && typeof row.profile === 'object') return row.profile as Record<string, unknown>
    return null
}

const normalizeStatus = (value: unknown): AdminUserStatus => {
    const normalized = toText(value).toUpperCase()
    if (normalized === 'SUSPENDED') return 'SUSPENDED'
    if (normalized === 'BANNED') return 'BANNED'
    return 'ACTIVE'
}

const normalizeAdminUser = (value: unknown): AdminUserItem => {
    const row = (value ?? {}) as Record<string, unknown>
    const userObject = resolveUserObject(row)
    const rawId = row.id ?? row._id ?? row.userId ?? userObject?.id ?? userObject?._id
    const rawName = row.name ?? row.userName ?? userObject?.name ?? userObject?.userName
    const rawEmail = row.email ?? userObject?.email

    return {
        id: toText(rawId),
        name: toText(rawName, 'Unknown User'),
        email: toText(rawEmail),
        image: resolveImage(row),
        status: normalizeStatus(row.status),
        points: toNumber(row.points),
        badges: Array.isArray(row.badges) ? row.badges : [],
    }
}

const normalizePagination = (value: unknown): AdminUsersPagination => {
    const pagination = (value ?? {}) as Record<string, unknown>
    const total = toNumber(pagination.total)
    const page = toNumber(pagination.page, 1)
    const limit = toNumber(pagination.limit, DEFAULT_LIMIT)
    const totalPages = toNumber(
        pagination.totalPages,
        Math.max(1, Math.ceil(total / Math.max(1, limit)))
    )

    return {
        total,
        page,
        limit,
        totalPages: Math.max(1, totalPages),
        hasNextPage: toBoolean(pagination.hasNextPage, page < totalPages),
        hasPrevPage: toBoolean(pagination.hasPrevPage, page > 1),
    }
}

const normalizeAdminUsersData = (value: unknown): AdminUsersData => {
    const root = (value ?? {}) as Record<string, unknown>
    const payload =
        root.data && typeof root.data === 'object'
            ? (root.data as Record<string, unknown>)
            : root

    const nestedData =
        payload.data && typeof payload.data === 'object'
            ? (payload.data as Record<string, unknown>)
            : null

    const usersSource =
        (Array.isArray(payload.data) && payload.data) ||
        (Array.isArray(payload.users) && payload.users) ||
        (Array.isArray(payload.items) && payload.items) ||
        (nestedData && Array.isArray(nestedData.data) && nestedData.data) ||
        (nestedData && Array.isArray(nestedData.users) && nestedData.users) ||
        (nestedData && Array.isArray(nestedData.items) && nestedData.items) ||
        []

    const paginationSource =
        payload.pagination ||
        payload.meta ||
        (nestedData ? nestedData.pagination || nestedData.meta : undefined)

    const users = usersSource.map(normalizeAdminUser)
    const pagination = normalizePagination(paginationSource)

    return {
        data: users,
        pagination,
    }
}

const normalizeSkillLevel = (value: unknown): string => {
    const rawLevel = toText(value).trim()
    if (!rawLevel) return 'Not specified'
    const lowercase = rawLevel.toLowerCase()
    return `${lowercase.charAt(0).toUpperCase()}${lowercase.slice(1)}`
}

const normalizeOverviewSkill = (value: unknown): AdminUserOverviewSkill => {
    const row = (value ?? {}) as Record<string, unknown>
    const skillObject =
        row.skill && typeof row.skill === 'object' ? (row.skill as Record<string, unknown>) : null
    const categoryObject =
        skillObject?.category && typeof skillObject.category === 'object'
            ? (skillObject.category as Record<string, unknown>)
            : null
    const detailsObject =
        row.details && typeof row.details === 'object'
            ? (row.details as Record<string, unknown>)
            : null

    const durationMinutes =
        toNullableNumber(
            row.sessionDuration ??
                row.session_duration ??
                row.durationMinutes ??
                row.duration ??
                row.durationInMinutes ??
                row.minutes ??
                row.time ??
                row.sessionTime ??
                row.sessionLength ??
                detailsObject?.sessionDuration ??
                detailsObject?.durationMinutes ??
                detailsObject?.duration ??
                detailsObject?.durationInMinutes ??
                skillObject?.sessionDuration ??
                skillObject?.durationMinutes ??
                skillObject?.duration ??
                skillObject?.durationInMinutes
        ) ??
        firstResolvedNumber([row, detailsObject, skillObject], [
            'sessionDuration',
            'session_duration',
            'durationMinutes',
            'durationInMinutes',
            'duration',
            'minutes',
            'sessionLength',
            'sessionTime',
            'time',
        ])

    const rating =
        toNullableNumber(
            row.rating ??
                row.averageRating ??
                row.avgRate ??
                row.avgRating ??
                row.avg_rate ??
                row.score ??
                row.reviewRate ??
                row.feedbackRating ??
                detailsObject?.rating ??
                detailsObject?.averageRating ??
                detailsObject?.avgRate ??
                skillObject?.rating ??
                skillObject?.averageRating ??
                skillObject?.avgRate
        ) ??
        firstResolvedNumber([row, detailsObject, skillObject], [
            'rating',
            'averageRating',
            'avgRating',
            'avgRate',
            'avg_rate',
            'reviewRate',
            'feedbackRating',
            'score',
            'rate',
            'average',
        ])

    return {
        id: toText(row.id ?? row._id ?? row.userSkillId ?? skillObject?.id ?? skillObject?._id),
        name: toText(row.name ?? row.skillName ?? row.title ?? skillObject?.name, 'Unnamed skill'),
        icon: toText(
            row.icon ??
                row.skillIcon ??
                skillObject?.icon ??
                skillObject?.emoji ??
                categoryObject?.icon ??
                categoryObject?.emoji
        ) || null,
        level: normalizeSkillLevel(row.level ?? skillObject?.level),
        durationMinutes,
        rating,
    }
}

const normalizeOverviewNote = (value: unknown): AdminUserOverviewNote => {
    const row = (value ?? {}) as Record<string, unknown>
    const adminObject =
        row.admin && typeof row.admin === 'object' ? (row.admin as Record<string, unknown>) : null

    return {
        adminId: toText(row.adminId ?? row.admin_id ?? adminObject?.id ?? adminObject?._id),
        externalNote: toText(row.externalNote ?? row.note ?? row.message ?? row.content),
        createdAt: toText(row.createdAt ?? row.updatedAt ?? row.date),
    }
}

const normalizeOverviewProfile = (value: unknown): AdminUserOverviewProfile => {
    const row = (value ?? {}) as Record<string, unknown>
    const userObject = resolveUserObject(row)
    const statsObject =
        row.stats && typeof row.stats === 'object' ? (row.stats as Record<string, unknown>) : null
    const gamificationObject =
        row.gamification && typeof row.gamification === 'object'
            ? (row.gamification as Record<string, unknown>)
            : null
    const profileStatsObject =
        row.profileStats && typeof row.profileStats === 'object'
            ? (row.profileStats as Record<string, unknown>)
            : null
    const pointsObject =
        row.points && typeof row.points === 'object' ? (row.points as Record<string, unknown>) : null

    const rawStatus =
        row.status ??
        userObject?.status ??
        (row.isActive === false || userObject?.isActive === false ? 'SUSPENDED' : 'ACTIVE')

    const rawSkills =
        (Array.isArray(row.userSkills) && row.userSkills) ||
        (Array.isArray(row.skillsOffered) && row.skillsOffered) ||
        (Array.isArray(row.offeredSkills) && row.offeredSkills) ||
        (Array.isArray(row.teachingSkills) && row.teachingSkills) ||
        (Array.isArray(row.user_skills) && row.user_skills) ||
        (Array.isArray(row.skills) && row.skills) ||
        (userObject && Array.isArray(userObject.skills) && userObject.skills) ||
        (userObject && Array.isArray(userObject.userSkills) && userObject.userSkills) ||
        (userObject && Array.isArray(userObject.skillsOffered) && userObject.skillsOffered) ||
        (userObject && Array.isArray(userObject.offeredSkills) && userObject.offeredSkills) ||
        (userObject && Array.isArray(userObject.teachingSkills) && userObject.teachingSkills) ||
        []

    const points =
        toNullableNumber(
            row.points ??
                row.totalPoints ??
                row.currentPoints ??
                row.lifetimePoints ??
                pointsObject?.total ??
                pointsObject?.value ??
                pointsObject?.totalPoints ??
                pointsObject?.currentPoints ??
                statsObject?.points ??
                statsObject?.totalPoints ??
                statsObject?.currentPoints ??
                statsObject?.lifetimePoints ??
                gamificationObject?.points ??
                gamificationObject?.totalPoints ??
                gamificationObject?.currentPoints ??
                profileStatsObject?.points ??
                profileStatsObject?.totalPoints ??
                profileStatsObject?.currentPoints ??
                userObject?.points ??
                userObject?.totalPoints ??
                userObject?.currentPoints
        ) ??
        firstResolvedNumberShallow(
            [
                statsObject,
                gamificationObject,
                profileStatsObject,
                pointsObject,
                userObject,
                row,
            ],
            ['totalPoints', 'currentPoints', 'lifetimePoints', 'points', 'userPoints', 'earnedPoints']
        )

    return {
        id: toText(row.id ?? row._id ?? row.userId ?? userObject?.id ?? userObject?._id),
        userName: toText(
            row.userName ?? row.name ?? row.username ?? userObject?.userName ?? userObject?.name,
            'User name'
        ),
        email: toText(row.email ?? userObject?.email),
        status: normalizeStatus(rawStatus),
        createdAt: toText(row.createdAt ?? row.joinedAt ?? userObject?.createdAt ?? ''),
        image: resolveImage(row),
        points,
        location: toText(row.location ?? userObject?.location),
        country: toText(row.country ?? userObject?.country),
        bio: toText(row.bio ?? row.description ?? userObject?.bio),
        skills: rawSkills.map(normalizeOverviewSkill),
    }
}

const normalizeAdminUserOverviewData = (value: unknown): AdminUserOverviewData => {
    const root = (value ?? {}) as Record<string, unknown>
    const payload =
        root.data && typeof root.data === 'object'
            ? (root.data as Record<string, unknown>)
            : root

    const nestedData =
        payload.data && typeof payload.data === 'object'
            ? (payload.data as Record<string, unknown>)
            : null

    const profileSource =
        payload.profile ??
        payload.user ??
        payload.userProfile ??
        (nestedData ? nestedData.profile ?? nestedData.user ?? nestedData.userProfile : undefined)

    const notesSource =
        (Array.isArray(payload.adminNotes) && payload.adminNotes) ||
        (Array.isArray(payload.notes) && payload.notes) ||
        (Array.isArray(payload.admin_notes) && payload.admin_notes) ||
        (nestedData && Array.isArray(nestedData.adminNotes) && nestedData.adminNotes) ||
        (nestedData && Array.isArray(nestedData.notes) && nestedData.notes) ||
        []

    return {
        profile: normalizeOverviewProfile(profileSource),
        adminNotes: notesSource.map(normalizeOverviewNote),
    }
}

const normalizeActivityMetadata = (value: unknown): Record<string, unknown> | null => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null
    return value as Record<string, unknown>
}

const normalizeActivityLogItem = (value: unknown, index: number): AdminUserActivityLogItem => {
    const row = (value ?? {}) as Record<string, unknown>
    const adminObject =
        row.admin && typeof row.admin === 'object' ? (row.admin as Record<string, unknown>) : null
    const metadata = normalizeActivityMetadata(row.metadata)
    const createdAt = toText(
        row.createdAt ?? row.updatedAt ?? row.loggedAt ?? row.date ?? row.timestamp ?? ''
    )
    const fallbackId = `${toText(row.type, 'activity')}-${createdAt || index}`

    return {
        id: toText(row.id ?? row._id ?? row.activityId ?? row.logId, fallbackId),
        entity: toText(row.entity, 'Activity'),
        type: toText(row.type, 'UNKNOWN'),
        adminId: toText(row.adminId ?? row.admin_id ?? adminObject?.id ?? adminObject?._id),
        adminName: toText(
            row.adminName ??
                row.admin_name ??
                row.actorName ??
                row.performedBy ??
                adminObject?.userName ??
                adminObject?.name
        ),
        adminEmail: toText(row.adminEmail ?? row.admin_email ?? adminObject?.email),
        externalNote: toText(row.externalNote ?? row.note ?? row.message ?? row.content),
        reason: toText(row.reason),
        metadata,
        endAt: toText(row.endAt ?? row.endsAt ?? row.expireAt ?? row.expiresAt),
        createdAt,
    }
}

const normalizeAdminUserActivityLogs = (value: unknown): AdminUserActivityLogItem[] => {
    const root = (value ?? {}) as Record<string, unknown>
    const payload =
        root.data && typeof root.data === 'object' ? (root.data as Record<string, unknown>) : root
    const nestedData =
        payload.data && typeof payload.data === 'object'
            ? (payload.data as Record<string, unknown>)
            : null

    const logsSource =
        (Array.isArray(value) && value) ||
        (Array.isArray(root.data) && root.data) ||
        (Array.isArray(payload.data) && payload.data) ||
        (Array.isArray(payload.items) && payload.items) ||
        (Array.isArray(payload.logs) && payload.logs) ||
        (Array.isArray(payload.activityLogs) && payload.activityLogs) ||
        (nestedData && Array.isArray(nestedData.data) && nestedData.data) ||
        (nestedData && Array.isArray(nestedData.items) && nestedData.items) ||
        (nestedData && Array.isArray(nestedData.logs) && nestedData.logs) ||
        []

    return logsSource.map(normalizeActivityLogItem)
}

const normalizeSwapStatus = (value: unknown): AdminSwapStatus => {
    const normalized = toText(value).toUpperCase()
    if (normalized === 'ACCEPTED') return 'ACCEPTED'
    if (normalized === 'DECLINED') return 'DECLINED'
    if (normalized === 'EXPIRED') return 'EXPIRED'
    if (normalized === 'COMPLETED') return 'COMPLETED'
    if (normalized === 'CANCELLED') return 'CANCELLED'
    return 'PENDING'
}

const normalizeSwapSkill = (value: unknown) => {
    if (!value || typeof value !== 'object') return null
    const row = value as Record<string, unknown>
    const skillObject =
        row.skill && typeof row.skill === 'object' ? (row.skill as Record<string, unknown>) : null

    return {
        id: toText(row.id ?? row._id ?? skillObject?.id ?? skillObject?._id),
        name: toText(row.name ?? row.skillName ?? skillObject?.name, '--'),
    }
}

const normalizeSwapParticipant = (value: unknown, fallback?: Record<string, unknown>) => {
    const row = (value ?? fallback ?? {}) as Record<string, unknown>
    const nestedUser = resolveUserObject(row)
    const firstName = toText(row.firstName ?? nestedUser?.firstName).trim()
    const lastName = toText(row.lastName ?? nestedUser?.lastName).trim()
    const fullName = `${firstName} ${lastName}`.trim()
    const rawName = toText(
        row.userName ??
            row.username ??
            row.name ??
            row.fullName ??
            nestedUser?.userName ??
            nestedUser?.username ??
            nestedUser?.name ??
            nestedUser?.fullName ??
            fallback?.userName ??
            fallback?.name ??
            fallback?.senderName ??
            fallback?.receiverName
    ).trim()

    return {
        id: toText(row.id ?? row._id ?? row.userId ?? nestedUser?.id ?? nestedUser?._id),
        userName: rawName || fullName || 'Unknown User',
        image: resolveImage(row) || (fallback ? resolveImage(fallback) : null),
    }
}

const resolveSwapParticipantObject = (
    row: Record<string, unknown>,
    direction: 'SENT' | 'RECEIVED'
): Record<string, unknown> | null => {
    const candidateKeysByDirection =
        direction === 'SENT'
            ? [
                  'user',
                  'receiver',
                  'reciever',
                  'toUser',
                  'targetUser',
                  'requestedTo',
                  'userTo',
                  'receiverId',
                  'participant',
                  'otherUser',
                  'counterpart',
              ]
            : [
                  'user',
                  'sender',
                  'requester',
                  'fromUser',
                  'sourceUser',
                  'requestedBy',
                  'userFrom',
                  'senderId',
                  'participant',
                  'otherUser',
                  'counterpart',
              ]

    const genericKeys = [
        'user',
        'participant',
        'otherUser',
        'counterpart',
        'sender',
        'requester',
        'receiver',
        'reciever',
        'fromUser',
        'toUser',
        'sourceUser',
        'targetUser',
        'requestedBy',
        'requestedTo',
        'senderId',
        'receiverId',
    ]

    const keys = [...candidateKeysByDirection, ...genericKeys]

    for (const key of keys) {
        const candidate = row[key]
        if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) continue
        return candidate as Record<string, unknown>
    }

    return null
}

const normalizeSwapItem = (value: unknown, direction: 'SENT' | 'RECEIVED'): AdminUserSwapItem => {
    const row = (value ?? {}) as Record<string, unknown>
    const participant = resolveSwapParticipantObject(row, direction)

    return {
        id: toText(row.id ?? row._id),
        user: normalizeSwapParticipant(participant, row),
        requestType: toText(row.requestType ?? row.swapType ?? row.type, 'Skill Swap'),
        requestedSkill: normalizeSwapSkill(row.requestedSkill ?? row.requested_skill),
        offeredSkill: normalizeSwapSkill(row.offeredSkill ?? row.offered_skill),
        status: normalizeSwapStatus(row.status),
        dateTime: toText(row.dateTime ?? row.createdAt ?? row.updatedAt),
    }
}

const normalizeSwapsPagination = (value: unknown): AdminUserSwapsPagination => {
    const pagination = (value ?? {}) as Record<string, unknown>
    const total = toNumber(pagination.total)
    const page = toNumber(pagination.page, 1)
    const limit = toNumber(pagination.limit, DEFAULT_SWAPS_LIMIT)
    const totalPages = Math.max(1, toNumber(pagination.totalPages, Math.ceil(total / Math.max(1, limit))))
    const nextPage = toNullableNumber(pagination.nextPage)
    const prevPage = toNullableNumber(pagination.prevPage)

    return {
        total,
        page,
        limit,
        totalPages,
        nextPage,
        prevPage,
        hasNextPage: toBoolean(pagination.hasNextPage, nextPage !== null || page < totalPages),
        hasPrevPage: toBoolean(pagination.hasPrevPage, prevPage !== null || page > 1),
    }
}

const normalizeAdminUserSwapsData = (
    value: unknown,
    direction: 'SENT' | 'RECEIVED'
): AdminUserSwapsData => {
    const root = (value ?? {}) as Record<string, unknown>
    const payload =
        root.data && typeof root.data === 'object'
            ? (root.data as Record<string, unknown>)
            : root

    const nestedData =
        payload.data && typeof payload.data === 'object'
            ? (payload.data as Record<string, unknown>)
            : null

    const swapsSource =
        (Array.isArray(payload.data) && payload.data) ||
        (Array.isArray(payload.items) && payload.items) ||
        (nestedData && Array.isArray(nestedData.data) && nestedData.data) ||
        (nestedData && Array.isArray(nestedData.items) && nestedData.items) ||
        []

    const paginationSource =
        payload.pagination ||
        payload.meta ||
        (nestedData ? nestedData.pagination || nestedData.meta : undefined)

    return {
        data: swapsSource.map((entry) => normalizeSwapItem(entry, direction)),
        pagination: normalizeSwapsPagination(paginationSource),
    }
}

const normalizeSessionStatus = (value: unknown): AdminSessionStatus => {
    const normalized = toText(value).toUpperCase()
    if (normalized === 'COMPLETED') return 'COMPLETED'
    if (normalized === 'RESCHEDULED') return 'RESCHEDULED'
    if (normalized === 'CANCELLED' || normalized === 'CANCELED') return 'CANCELLED'
    return 'SCHEDULED'
}

const normalizeSessionProfile = (value: unknown): AdminUserSessionProfile => {
    const row = (value ?? {}) as Record<string, unknown>
    const userObject = resolveUserObject(row)

    return {
        id: toText(row.id ?? row._id ?? row.userId ?? userObject?.id ?? userObject?._id),
        userName: toText(
            row.userName ?? row.username ?? row.name ?? userObject?.userName ?? userObject?.name,
            'Unknown User'
        ),
        email: toText(row.email ?? userObject?.email),
        image: resolveImage(row),
    }
}

const resolveSessionPartnerObject = (row: Record<string, unknown>): Record<string, unknown> | null => {
    const keys = [
        'partner',
        'partnerUser',
        'participant',
        'otherUser',
        'counterpart',
        'matchedUser',
        'peer',
        'user',
        'partnerId',
    ]

    for (const key of keys) {
        const candidate = row[key]
        if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) continue
        return candidate as Record<string, unknown>
    }

    return null
}

const normalizeSessionItem = (value: unknown): AdminUserSessionItem => {
    const row = (value ?? {}) as Record<string, unknown>
    const partnerObject = resolveSessionPartnerObject(row)
    const skillObject =
        row.skill && typeof row.skill === 'object' && !Array.isArray(row.skill)
            ? (row.skill as Record<string, unknown>)
            : null

    return {
        id: toText(row.id ?? row._id),
        scheduledAt: toText(
            row.scheduledAt ??
                row.startAt ??
                row.startDate ??
                row.dateTime ??
                row.sessionDate ??
                row.createdAt
        ),
        endsAt: toText(row.endsAt ?? row.endAt ?? row.endDate ?? row.finishAt ?? row.completedAt),
        status: normalizeSessionStatus(row.status),
        duration: toNullableNumber(
            row.duration ?? row.durationMinutes ?? row.sessionDuration ?? row.lengthMinutes
        ),
        skillName: toText(
            row.skillName ??
                row.skill_name ??
                row.topic ??
                row.title ??
                skillObject?.name ??
                skillObject?.title,
            '--'
        ),
        partner: normalizeSwapParticipant(partnerObject, row),
    }
}

const normalizeSessionsPagination = (value: unknown): AdminUserSessionsPagination => {
    const pagination = (value ?? {}) as Record<string, unknown>
    const total = toNumber(pagination.total)
    const page = toNumber(pagination.page, 1)
    const limit = toNumber(pagination.limit, DEFAULT_SESSIONS_LIMIT)
    const totalPages = Math.max(1, toNumber(pagination.totalPages, Math.ceil(total / Math.max(1, limit))))
    const nextPage = toNullableNumber(pagination.nextPage)
    const prevPage = toNullableNumber(pagination.prevPage)

    return {
        total,
        page,
        limit,
        totalPages,
        nextPage,
        prevPage,
        hasNextPage: toBoolean(pagination.hasNextPage, nextPage !== null || page < totalPages),
        hasPrevPage: toBoolean(pagination.hasPrevPage, prevPage !== null || page > 1),
    }
}

const normalizeAdminUserSessionsData = (value: unknown): AdminUserSessionsData => {
    const root = (value ?? {}) as Record<string, unknown>
    const payload =
        root.data && typeof root.data === 'object' && !Array.isArray(root.data)
            ? (root.data as Record<string, unknown>)
            : root

    const nestedData =
        payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)
            ? (payload.data as Record<string, unknown>)
            : null

    const sessionsSource =
        (Array.isArray(payload.data) && payload.data) ||
        (Array.isArray(payload.sessions) && payload.sessions) ||
        (Array.isArray(payload.items) && payload.items) ||
        (nestedData && Array.isArray(nestedData.data) && nestedData.data) ||
        (nestedData && Array.isArray(nestedData.sessions) && nestedData.sessions) ||
        (nestedData && Array.isArray(nestedData.items) && nestedData.items) ||
        []

    const userSource =
        payload.user ||
        payload.profile ||
        (nestedData ? nestedData.user || nestedData.profile : undefined)

    const paginationSource =
        payload.pagination ||
        payload.meta ||
        (nestedData ? nestedData.pagination || nestedData.meta : undefined)

    return {
        user: userSource ? normalizeSessionProfile(userSource) : null,
        data: sessionsSource.map(normalizeSessionItem),
        pagination: normalizeSessionsPagination(paginationSource),
    }
}

const normalizeBadgeProgressText = (row: Record<string, unknown>): string => {
    const rawProgress = toText(
        row.progress ?? row.progressText ?? row.progressLabel ?? row.percentage ?? row.ratio
    ).trim()
    if (rawProgress) return rawProgress

    const completed = toNullableNumber(
        row.current ??
            row.completed ??
            row.completedSessions ??
            row.earnedSessions ??
            row.value ??
            row.count
    )
    const required = toNullableNumber(
        row.required ??
            row.requiredSessions ??
            row.target ??
            row.targetSessions ??
            row.goal ??
            row.total
    )

    if (completed !== null && required !== null && required > 0) {
        return `${Math.round(completed)}/${Math.round(required)}`
    }

    if (completed !== null) return `${Math.round(completed)}`
    return ''
}

const normalizeBadgeItem = (value: unknown): AdminUserBadgeItem => {
    const row = (value ?? {}) as Record<string, unknown>

    return {
        id: toText(row.id ?? row._id ?? row.badgeId),
        name: toText(row.name ?? row.badgeName ?? row.title, 'Badge'),
        icon: toText(row.icon ?? row.image ?? row.badgeIcon ?? row.iconUrl) || null,
        progress: normalizeBadgeProgressText(row),
        subtitle: toText(
            row.subtitle ??
                row.requirement ??
                row.condition ??
                row.requirements ??
                row.criteria ??
                row.sessionLabel
        ),
        unlockedAt: toText(row.unlockedAt ?? row.earnedAt ?? row.awardedAt ?? row.createdAt),
        remainingSessions: toNullableNumber(
            row.remainingSessions ??
                row.remaining ??
                row.sessionsRemaining ??
                row.remainingCount ??
                row.left
        ),
    }
}

const normalizeAdminUserBadgesData = (value: unknown): AdminUserBadgesData => {
    const root = (value ?? {}) as Record<string, unknown>
    const payload =
        root.data && typeof root.data === 'object' && !Array.isArray(root.data)
            ? (root.data as Record<string, unknown>)
            : root

    const nestedData =
        payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)
            ? (payload.data as Record<string, unknown>)
            : null

    const earnedSource =
        (Array.isArray(payload.earned) && payload.earned) ||
        (Array.isArray(payload.unlocked) && payload.unlocked) ||
        (Array.isArray(payload.earnedBadges) && payload.earnedBadges) ||
        (nestedData && Array.isArray(nestedData.earned) && nestedData.earned) ||
        (nestedData && Array.isArray(nestedData.unlocked) && nestedData.unlocked) ||
        (nestedData && Array.isArray(nestedData.earnedBadges) && nestedData.earnedBadges) ||
        []

    const lockedSource =
        (Array.isArray(payload.locked) && payload.locked) ||
        (Array.isArray(payload.pending) && payload.pending) ||
        (Array.isArray(payload.lockedBadges) && payload.lockedBadges) ||
        (nestedData && Array.isArray(nestedData.locked) && nestedData.locked) ||
        (nestedData && Array.isArray(nestedData.pending) && nestedData.pending) ||
        (nestedData && Array.isArray(nestedData.lockedBadges) && nestedData.lockedBadges) ||
        []

    return {
        earned: earnedSource.map(normalizeBadgeItem),
        locked: lockedSource.map(normalizeBadgeItem),
    }
}

const buildParams = (params: AdminUsersQueryParams): AdminUsersQueryParams => {
    const search = params.search?.trim()

    return {
        page: params.page ?? 1,
        limit: params.limit ?? DEFAULT_LIMIT,
        sort: params.sort ?? 'newest',
        search: search && search.length > 0 ? search : undefined,
        status: params.status,
    }
}

const buildSwapsParams = (params: AdminUserSwapsQueryParams): AdminUserSwapsQueryParams => {
    const startDate = params.startDate?.trim()
    const endDate = params.endDate?.trim()

    return {
        page: params.page ?? 1,
        limit: params.limit ?? DEFAULT_SWAPS_LIMIT,
        direction: params.direction,
        sort: params.sort ?? 'newest',
        status: params.status,
        startDate: startDate && startDate.length > 0 ? startDate : undefined,
        endDate: endDate && endDate.length > 0 ? endDate : undefined,
    }
}

const buildSessionsParams = (
    params: AdminUserSessionsQueryParams
): AdminUserSessionsQueryParams => {
    const search = params.search?.trim()
    const startDate = params.startDate?.trim()
    const endDate = params.endDate?.trim()

    return {
        page: params.page ?? 1,
        limit: params.limit ?? DEFAULT_SESSIONS_LIMIT,
        sort: params.sort ?? 'newest',
        status: params.status,
        search: search && search.length > 0 ? search : undefined,
        startDate: startDate && startDate.length > 0 ? startDate : undefined,
        endDate: endDate && endDate.length > 0 ? endDate : undefined,
    }
}

export const getAdminUsers = async (params: AdminUsersQueryParams): Promise<AdminUsersData> => {
    const response = await axiosInstance.get<AdminUsersResponse>('/api/v1/admin/users', {
        params: buildParams(params),
    })

    return normalizeAdminUsersData(response.data)
}

export const getAdminUserOverview = async (userId: string): Promise<AdminUserOverviewData> => {
    const normalizedUserId = userId.trim()
    if (!normalizedUserId) {
        throw new Error('User id is required')
    }

    const response = await axiosInstance.get(`/api/v1/admin/${normalizedUserId}/overview`)
    return normalizeAdminUserOverviewData(response.data)
}

export const getAdminUserActivityLog = async (
    userId: string
): Promise<AdminUserActivityLogItem[]> => {
    const normalizedUserId = userId.trim()
    if (!normalizedUserId) {
        throw new Error('User id is required')
    }

    const response = await axiosInstance.get(`/api/v1/admin/users/${normalizedUserId}/activity-log`)
    return normalizeAdminUserActivityLogs(response.data)
}

export const getAdminUserSwaps = async (
    userId: string,
    params: AdminUserSwapsQueryParams
): Promise<AdminUserSwapsData> => {
    const normalizedUserId = userId.trim()
    if (!normalizedUserId) {
        throw new Error('User id is required')
    }

    const response = await axiosInstance.get(`/api/v1/admin/${normalizedUserId}/swaps`, {
        params: buildSwapsParams(params),
    })

    return normalizeAdminUserSwapsData(response.data, params.direction)
}

export const getAdminUserSessions = async (
    userId: string,
    params: AdminUserSessionsQueryParams
): Promise<AdminUserSessionsData> => {
    const normalizedUserId = userId.trim()
    if (!normalizedUserId) {
        throw new Error('User id is required')
    }

    const response = await axiosInstance.get(`/api/v1/admin/${normalizedUserId}/sessions`, {
        params: buildSessionsParams(params),
    })

    return normalizeAdminUserSessionsData(response.data)
}

export const getAdminUserBadges = async (userId: string): Promise<AdminUserBadgesData> => {
    const normalizedUserId = userId.trim()
    if (!normalizedUserId) {
        throw new Error('User id is required')
    }

    const response = await axiosInstance.get(`/api/v1/admin/badge/${normalizedUserId}`)
    return normalizeAdminUserBadgesData(response.data)
}

export const addAdminUserNote = async (userId: string, externalNote: string): Promise<void> => {
    const normalizedUserId = userId.trim()
    if (!normalizedUserId) {
        throw new Error('User id is required')
    }

    const normalizedNote = externalNote.trim()
    if (!normalizedNote) {
        throw new Error('Note content is required')
    }

    await axiosInstance.post(`/api/v1/admin/${normalizedUserId}/note`, {
        externalNote: normalizedNote,
    })
}

const normalizeRestrictionPayload = (
    payload: AdminUserRestrictionPayload,
    fallbackType: string
): AdminUserRestrictionPayload => {
    const normalizedType = payload.type?.trim() || fallbackType
    const normalizedReason = payload.reason?.trim() ?? ''
    const normalizedExternalNote = payload.externalNote?.trim() ?? ''
    const normalizedEndAt = payload.endAt?.trim()

    if (!normalizedReason) {
        throw new Error('Reason is required')
    }

    if (!normalizedExternalNote) {
        throw new Error('Message is required')
    }

    return {
        type: normalizedType,
        reason: normalizedReason,
        externalNote: normalizedExternalNote,
        endAt: normalizedEndAt && normalizedEndAt.length > 0 ? normalizedEndAt : undefined,
    }
}

const normalizePointsPayload = (
    payload: AdminUserAdjustPointsPayload
): { actionType: 'ADD' | 'DEDUCT'; points: number; reason: string } => {
    const normalizedReason = payload.reason?.trim() ?? ''
    if (!normalizedReason) {
        throw new Error('Adjustment reason is required')
    }

    const normalizedPoints = Number(payload.points)
    if (!Number.isFinite(normalizedPoints) || normalizedPoints <= 0) {
        throw new Error('Points amount must be greater than zero')
    }

    return {
        actionType: payload.actionType === 'DEDUCT' ? 'DEDUCT' : 'ADD',
        points: normalizedPoints,
        reason: normalizedReason,
    }
}

export const warnAdminUser = async (
    userId: string,
    payload: AdminUserRestrictionPayload
): Promise<void> => {
    const normalizedUserId = userId.trim()
    if (!normalizedUserId) {
        throw new Error('User id is required')
    }

    const normalizedPayload = normalizeRestrictionPayload(payload, 'WARNING')
    await axiosInstance.post(`/api/v1/admin/${normalizedUserId}/warn`, normalizedPayload)
}

export const suspendAdminUser = async (
    userId: string,
    payload: AdminUserRestrictionPayload
): Promise<void> => {
    const normalizedUserId = userId.trim()
    if (!normalizedUserId) {
        throw new Error('User id is required')
    }

    const normalizedPayload = normalizeRestrictionPayload(payload, 'SUSPENSION')
    if (!normalizedPayload.endAt) {
        throw new Error('Suspension end date is required')
    }

    await axiosInstance.post(`/api/v1/admin/${normalizedUserId}/suspend`, normalizedPayload)
}

export const banAdminUser = async (
    userId: string,
    payload: AdminUserRestrictionPayload
): Promise<void> => {
    const normalizedUserId = userId.trim()
    if (!normalizedUserId) {
        throw new Error('User id is required')
    }

    const normalizedPayload = normalizeRestrictionPayload(payload, 'BAN')
    await axiosInstance.post(`/api/v1/admin/${normalizedUserId}/ban`, normalizedPayload)
}

export const unbanAdminUser = async (userId: string): Promise<void> => {
    const normalizedUserId = userId.trim()
    if (!normalizedUserId) {
        throw new Error('User id is required')
    }

    await axiosInstance.post(`/api/v1/admin/${normalizedUserId}/unban`)
}

export const adjustAdminUserPoints = async (
    userId: string,
    payload: AdminUserAdjustPointsPayload
): Promise<void> => {
    const normalizedUserId = userId.trim()
    if (!normalizedUserId) {
        throw new Error('User id is required')
    }

    const normalizedPayload = normalizePointsPayload(payload)
    await axiosInstance.post(`/api/v1/admin/${normalizedUserId}/points`, normalizedPayload)
}
