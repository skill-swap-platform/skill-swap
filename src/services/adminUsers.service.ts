import axiosInstance from '@/api/axiosInstance'
import type {
    AdminUserItem,
    AdminUserStatus,
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

const toNumber = (value: unknown, fallback = 0): number => {
    const numericValue = Number(value)
    return Number.isFinite(numericValue) ? numericValue : fallback
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
