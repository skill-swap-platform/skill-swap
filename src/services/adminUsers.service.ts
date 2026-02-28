import axiosInstance from '@/api/axiosInstance'
import type {
    AdminUserItem,
    AdminUserStatus,
    AdminUserOverviewData,
    AdminUserOverviewNote,
    AdminUserOverviewProfile,
    AdminUserOverviewSkill,
    AdminUsersData,
    AdminUsersPagination,
    AdminUsersQueryParams,
    AdminUsersResponse,
} from '@/types/adminUsers.types'

const DEFAULT_LIMIT = 12

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
