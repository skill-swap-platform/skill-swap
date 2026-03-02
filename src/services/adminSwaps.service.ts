import axiosInstance from '@/api/axiosInstance'
import type { AdminSwapStatus } from '@/types/adminUsers.types'
import type {
    AdminSwapItem,
    AdminSwapParticipant,
    AdminSwapSkill,
    AdminSwapsData,
    AdminSwapsExportPayload,
    AdminSwapsPagination,
    AdminSwapsQueryParams,
    AdminSwapsSummary,
} from '@/types/adminSwaps.types'

const DEFAULT_LIMIT = 10
type NormalizedAdminSwapsQueryParams = Omit<AdminSwapsQueryParams, 'page' | 'limit'> & {
    page: number
    limit: number
}

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
    if (typeof value === 'string') return value
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

const normalizeSwapStatus = (value: unknown): AdminSwapStatus => {
    const normalized = toText(value).trim().toUpperCase().replace(/[\s-]+/g, '_')
    if (normalized === 'ACCEPTED') return 'ACCEPTED'
    if (normalized === 'DECLINED' || normalized === 'REJECTED') return 'DECLINED'
    if (normalized === 'EXPIRED') return 'EXPIRED'
    if (normalized === 'COMPLETED') return 'COMPLETED'
    if (normalized === 'CANCELLED' || normalized === 'CANCELED') return 'CANCELLED'
    return 'PENDING'
}

const normalizeParticipant = (value: unknown, fallbackId: unknown): AdminSwapParticipant => {
    const participant = toRecord(value)
    if (!participant) {
        return {
            id: toText(fallbackId),
            userName: 'Unknown User',
            image: null,
            email: '',
        }
    }

    return {
        id: toText(participant.id ?? participant._id ?? fallbackId),
        userName: toText(
            participant.userName ?? participant.username ?? participant.name,
            'Unknown User'
        ),
        image: resolveImage(participant),
        email: toText(participant.email),
    }
}

const normalizeSkill = (value: unknown): AdminSwapSkill | null => {
    if (typeof value === 'string' && value.trim().length > 0) {
        return {
            id: '',
            name: value,
        }
    }

    const skill = toRecord(value)
    if (!skill) return null

    const name = toText(skill.name ?? skill.title).trim()
    if (!name) return null

    return {
        id: toText(skill.id ?? skill._id),
        name,
    }
}

const normalizeSwapItem = (value: unknown): AdminSwapItem => {
    const row = toRecord(value) ?? {}

    return {
        id: toText(row.id ?? row._id),
        sender: normalizeParticipant(row.sender ?? row.requester ?? row.from, row.senderId),
        receiver: normalizeParticipant(row.receiver ?? row.requestedTo ?? row.to, row.receiverId),
        requestType: toText(row.requestType ?? row.swapType ?? row.type, 'Skill Swap'),
        requestedSkill: normalizeSkill(row.requestedSkill ?? row.requested_skill),
        offeredSkill: normalizeSkill(row.offeredSkill ?? row.offered_skill),
        status: normalizeSwapStatus(row.status),
        dateTime: toText(row.dateTime ?? row.createdAt ?? row.updatedAt),
    }
}

const normalizeSummary = (value: unknown, rows: AdminSwapItem[]): AdminSwapsSummary => {
    const summary = toRecord(value)
    if (summary) {
        return {
            accepted: toNumber(summary.accepted, 0),
            pending: toNumber(summary.pending, 0),
            rejected: toNumber(summary.rejected ?? summary.declined, 0),
        }
    }

    return rows.reduce<AdminSwapsSummary>(
        (accumulator, row) => {
            if (row.status === 'ACCEPTED' || row.status === 'COMPLETED') {
                accumulator.accepted += 1
            } else if (row.status === 'PENDING') {
                accumulator.pending += 1
            } else if (row.status === 'DECLINED') {
                accumulator.rejected += 1
            }
            return accumulator
        },
        { accepted: 0, pending: 0, rejected: 0 }
    )
}

const normalizePagination = (
    source: Record<string, unknown>,
    fallbackLimit: number
): AdminSwapsPagination => {
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

const normalizeAdminSwapsData = (
    value: unknown,
    fallbackLimit: number
): AdminSwapsData => {
    const root = toRecord(value) ?? {}
    const nestedData = toRecord(root.data)
    const payload = nestedData ?? root

    const rowsSource =
        (Array.isArray(payload.data) && payload.data) ||
        (Array.isArray(payload.items) && payload.items) ||
        []

    const rows = rowsSource.map(normalizeSwapItem)
    const summary = normalizeSummary(payload.summary ?? root.summary, rows)
    const pagination = normalizePagination(payload, fallbackLimit)

    return {
        data: rows,
        summary,
        pagination,
    }
}

const buildParams = (params: AdminSwapsQueryParams): NormalizedAdminSwapsQueryParams => {
    const page = Math.max(1, params.page ?? 1)
    const limit = Math.max(1, params.limit ?? DEFAULT_LIMIT)

    return {
        page,
        limit,
        status: params.status,
        sort: params.sort ?? 'newest',
        startDate: params.startDate?.trim() || undefined,
        endDate: params.endDate?.trim() || undefined,
    }
}

const extractFileName = (contentDisposition: string | undefined): string => {
    if (!contentDisposition) return `swaps-export-${new Date().toISOString().slice(0, 10)}.csv`

    const utf8Match = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition)
    if (utf8Match?.[1]) {
        return decodeURIComponent(utf8Match[1])
    }

    const basicMatch = /filename="?([^";]+)"?/i.exec(contentDisposition)
    if (basicMatch?.[1]) {
        return basicMatch[1]
    }

    return `swaps-export-${new Date().toISOString().slice(0, 10)}.csv`
}

export type AdminSwapsExportResult = {
    blob: Blob
    fileName: string
}

export const getAdminSwaps = async (params: AdminSwapsQueryParams): Promise<AdminSwapsData> => {
    const normalizedParams = buildParams(params)
    const response = await axiosInstance.get('/api/v1/admin/swaps', {
        params: normalizedParams,
    })

    return normalizeAdminSwapsData(response.data, normalizedParams.limit)
}

export const exportAdminSwapsCsv = async (
    payload: AdminSwapsExportPayload
): Promise<AdminSwapsExportResult> => {
    const ids = payload.swapIds.map((id) => id.trim()).filter((id) => id.length > 0)
    if (ids.length === 0) {
        throw new Error('At least one swap request must be selected.')
    }

    const response = await axiosInstance.post('/api/v1/admin/swaps/export', { swapIds: ids }, {
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
