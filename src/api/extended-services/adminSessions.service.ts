import axiosInstance from '../axiosInstance'
import type {
    AdminSessionItem,
    AdminSessionParticipant,
    AdminSessionStatus,
    AdminSessionsData,
    AdminSessionsExportPayload,
    AdminSessionsPagination,
    AdminSessionsQueryParams,
    AdminSessionsSummary,
} from '@/types/adminSessions.types'

const DEFAULT_LIMIT = 10

const toText = (value: unknown, fallback = ''): string => {
    if (typeof value === 'string') return value
    if (typeof value === 'number') return String(value)
    return fallback
}

const toNumber = (value: unknown, fallback = 0): number => {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
}

const toRecord = (value: unknown): Record<string, unknown> | null => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null
    return value as Record<string, unknown>
}

const imageUrlFromUnknown = (value: unknown): string | null => {
    if (typeof value === 'string' && value.trim().length > 0) return value
    const imageObject = toRecord(value)
    if (!imageObject) return null

    const candidate =
        imageObject.url ??
        imageObject.secure_url ??
        imageObject.secureUrl ??
        imageObject.path ??
        imageObject.publicUrl ??
        imageObject.public_url ??
        imageObject.src

    return typeof candidate === 'string' && candidate.trim().length > 0 ? candidate : null
}

const resolveImage = (row: Record<string, unknown>): string | null => {
    const candidates = [
        row.image,
        row.avatar,
        row.avatarUrl,
        row.profileImage,
        row.photo,
        row.picture,
        row.userImage,
        row.imageUrl,
    ]

    for (const candidate of candidates) {
        const image = imageUrlFromUnknown(candidate)
        if (image) return image
    }

    return null
}

const resolveUserName = (value: unknown): string => {
    if (typeof value === 'string' && value.trim().length > 0) return value
    if (typeof value === 'number') return String(value)

    const user = toRecord(value)
    if (!user) return 'Unknown User'

    const directName = toText(
        user.userName ?? user.username ?? user.name ?? user.fullName ?? user.displayName
    ).trim()

    if (directName.length > 0) return directName

    const firstName = toText(user.firstName ?? user.first_name).trim()
    const lastName = toText(user.lastName ?? user.last_name).trim()
    const fullName = `${firstName} ${lastName}`.trim()

    if (fullName.length > 0) return fullName

    return 'Unknown User'
}

const normalizeSessionStatus = (value: unknown): AdminSessionStatus => {
    const normalized = toText(value).trim().toUpperCase().replace(/[\s-]+/g, '_')
    if (normalized === 'COMPLETED') return 'COMPLETED'
    if (normalized === 'CANCELLED' || normalized === 'CANCELED') return 'CANCELLED'
    if (normalized === 'RESCHEDULED') return 'RESCHEDULED'
    if (normalized === 'DISPUTED') return 'DISPUTED'
    return 'SCHEDULED'
}

const normalizeParticipant = (value: unknown, fallbackId: unknown): AdminSessionParticipant => {
    const participant = toRecord(value)
    if (!participant) {
        return {
            id: toText(fallbackId),
            userName: 'Unknown User',
            image: null,
        }
    }

    return {
        id: toText(participant.id ?? participant._id ?? fallbackId),
        userName: resolveUserName(participant.userName ?? participant),
        image: resolveImage(participant),
    }
}

const normalizeSessionItem = (value: unknown): AdminSessionItem => {
    const row = toRecord(value) ?? {}
    const skill = toRecord(row.skill)

    return {
        id: toText(row.id ?? row._id),
        scheduledAt: toText(
            row.scheduledAt ?? row.startAt ?? row.startDate ?? row.dateTime ?? row.createdAt
        ),
        endsAt: toText(row.endsAt ?? row.endAt ?? row.endDate),
        status: normalizeSessionStatus(row.status),
        skillName: toText(
            row.skillName ?? row.skill_name ?? row.topic ?? row.title ?? skill?.name,
            '--'
        ),
        host: normalizeParticipant(row.host ?? row.person1, row.hostId),
        attendee: normalizeParticipant(row.attendee ?? row.person2 ?? row.partner, row.attendeeId),
        duration: (() => {
            const parsedDuration = toNumber(
                row.duration ?? row.durationMinutes ?? row.sessionDuration,
                NaN
            )
            return Number.isFinite(parsedDuration) ? parsedDuration : null
        })(),
    }
}

const normalizeSummary = (value: unknown, rows: AdminSessionItem[]): AdminSessionsSummary => {
    const summary = toRecord(value)
    if (summary) {
        return {
            completed: toNumber(summary.completed, 0),
            cancelled: toNumber(summary.cancelled ?? summary.canceled, 0),
            disputed: toNumber(summary.disputed ?? summary.rescheduled, 0),
        }
    }

    return rows.reduce<AdminSessionsSummary>(
        (accumulator, row) => {
            if (row.status === 'COMPLETED') accumulator.completed += 1
            if (row.status === 'CANCELLED') accumulator.cancelled += 1
            if (row.status === 'DISPUTED' || row.status === 'RESCHEDULED') accumulator.disputed += 1
            return accumulator
        },
        { completed: 0, cancelled: 0, disputed: 0 }
    )
}

const normalizePagination = (
    source: Record<string, unknown>,
    fallbackLimit: number
): AdminSessionsPagination => {
    const pagination = toRecord(source.pagination ?? source.meta)
    const total = toNumber(source.total ?? pagination?.total, 0)
    const page = Math.max(1, toNumber(source.page ?? pagination?.page, 1))
    const limit = Math.max(1, toNumber(source.limit ?? pagination?.limit, fallbackLimit))
    const totalPages = Math.max(
        1,
        toNumber(source.totalPages ?? pagination?.totalPages, Math.ceil(total / limit))
    )

    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    }
}

const normalizeAdminSessionsData = (value: unknown, fallbackLimit: number): AdminSessionsData => {
    const root = toRecord(value) ?? {}
    const nestedData = toRecord(root.data)
    const payload = nestedData ?? root

    const rowsSource =
        (Array.isArray(payload.data) && payload.data) ||
        (Array.isArray(payload.items) && payload.items) ||
        (Array.isArray(payload.sessions) && payload.sessions) ||
        []

    const rows = rowsSource.map(normalizeSessionItem)
    const summary = normalizeSummary(payload.summary ?? root.summary, rows)
    const pagination = normalizePagination(payload, fallbackLimit)

    return {
        data: rows,
        summary,
        pagination,
    }
}

const buildParams = (params: AdminSessionsQueryParams): AdminSessionsQueryParams => {
    const page = Math.max(1, params.page ?? 1)
    const limit = Math.max(1, params.limit ?? DEFAULT_LIMIT)

    return {
        page,
        limit,
        status: params.status,
        sort: params.sort ?? 'newest',
        search: params.search?.trim() || undefined,
        startDate: params.startDate?.trim() || undefined,
        endDate: params.endDate?.trim() || undefined,
    }
}

const extractFileName = (contentDisposition: string | undefined): string => {
    if (!contentDisposition) return `sessions-export-${new Date().toISOString().slice(0, 10)}.csv`

    const utf8Match = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition)
    if (utf8Match?.[1]) {
        return decodeURIComponent(utf8Match[1])
    }

    const basicMatch = /filename="?([^";]+)"?/i.exec(contentDisposition)
    if (basicMatch?.[1]) {
        return basicMatch[1]
    }

    return `sessions-export-${new Date().toISOString().slice(0, 10)}.csv`
}

export type AdminSessionsExportResult = {
    blob: Blob
    fileName: string
}

export const getAdminSessions = async (params: AdminSessionsQueryParams): Promise<AdminSessionsData> => {
    const normalizedParams = buildParams(params)
    const normalizedLimit = normalizedParams.limit ?? DEFAULT_LIMIT
    const response = await axiosInstance.get('/api/v1/admin/sessions', {
        params: normalizedParams,
    })

    return normalizeAdminSessionsData(response.data, normalizedLimit)
}

export const exportAdminSessionsCsv = async (
    payload: AdminSessionsExportPayload
): Promise<AdminSessionsExportResult> => {
    const ids = payload.sessionIds.map((id) => id.trim()).filter((id) => id.length > 0)
    if (ids.length === 0) {
        throw new Error('At least one session must be selected.')
    }

    const response = await axiosInstance.post('/api/v1/admin/sessions/export', { sessionIds: ids }, {
        headers: {
            Accept: 'text/csv',
        },
        responseType: 'blob',
    })

    return {
        blob: response.data as Blob,
        fileName: extractFileName(response.headers['content-disposition'] as string | undefined),
    }
}
