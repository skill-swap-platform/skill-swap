import React, { useMemo, useState } from 'react'
import {
    AlertTriangle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Mail,
    Star,
    X,
} from 'lucide-react'
import Avatar from '@/components/Avatar/Avatar'
import type { AdminUserItem, AdminUserStatus } from '@/types/adminUsers.types'

const DEFAULT_AVATAR_URL = 'https://api.dicebear.com/7.x/notionists/svg?seed=currentuser'
const MAX_TEXT_LENGTH = 500

const restrictionReasons = [
    'Inappropriate behavior',
    'Spam or scam activity',
    'Repeated policy violations',
    'Harassment report',
    'Fake account activity',
]

const noteCategories = ['Behavior', 'Dispute-related', 'warning history']

type SuspendDurationKey = '24h' | '7d' | '30d' | 'custom'

const durationOptions: { key: SuspendDurationKey; label: string; days: number | null }[] = [
    { key: '24h', label: '24 hours', days: 1 },
    { key: '7d', label: '7 days', days: 7 },
    { key: '30d', label: '30 days', days: 30 },
    { key: 'custom', label: 'Custom', days: null },
]

const statusPillClassName: Record<AdminUserStatus, string> = {
    ACTIVE: 'bg-[rgba(22,163,74,0.2)] text-[#16A34A]',
    SUSPENDED: 'bg-[rgba(245,158,11,0.2)] text-[#F59E0B]',
    BANNED: 'bg-[rgba(220,38,38,0.2)] text-[#DC2626]',
}

const displayStatus = (status: AdminUserStatus): string => {
    if (status === 'SUSPENDED') return 'Suspended'
    if (status === 'BANNED') return 'Banned'
    return 'Active'
}

const toUsernameToken = (name: string): string => {
    const trimmed = name.trim()
    if (!trimmed) return 'Username'
    return trimmed.replace(/\s+/g, '')
}

const clampText = (value: string, maxLength = MAX_TEXT_LENGTH): string => value.slice(0, maxLength)

const addDays = (source: Date, days: number): Date => {
    const next = new Date(source)
    next.setDate(next.getDate() + days)
    return next
}

const normalizeDayDate = (value: Date): Date => {
    const normalized = new Date(value)
    normalized.setHours(0, 0, 0, 0)
    return normalized
}

const formatMonthLabel = (value: Date): string =>
    value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

const formatSelectedDate = (value: Date): string =>
    value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const formatRecordedAt = (value: Date): string =>
    value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }) +
    ', ' +
    value.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    })

type CalendarCell = {
    date: Date
    day: number
    isCurrentMonth: boolean
}

const buildCalendarCells = (visibleMonth: Date): CalendarCell[] => {
    const year = visibleMonth.getFullYear()
    const month = visibleMonth.getMonth()
    const firstDayOfMonth = new Date(year, month, 1)
    const mondayBasedStartIndex = (firstDayOfMonth.getDay() + 6) % 7
    const firstCellDate = new Date(year, month, 1 - mondayBasedStartIndex)
    const cells: CalendarCell[] = []

    for (let index = 0; index < 35; index += 1) {
        const next = addDays(firstCellDate, index)
        cells.push({
            date: next,
            day: next.getDate(),
            isCurrentMonth: next.getMonth() === month,
        })
    }

    return cells
}

const FieldLabel: React.FC<{ title: string; required?: boolean; secondaryLabel?: string }> = ({
    title,
    required = false,
    secondaryLabel,
}) => (
    <div className="flex items-center gap-1">
        <p className="text-[16px] text-[#0C0D0F]">{title}</p>
        {required ? <span className="text-[#DC2626]">*</span> : null}
        {secondaryLabel ? <span className="text-[13px] text-[#757575]">{secondaryLabel}</span> : null}
    </div>
)

const ModalShell: React.FC<{
    open: boolean
    onClose: () => void
    children: React.ReactNode
}> = ({ open, onClose, children }) => {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close modal overlay"
                className="absolute inset-0 bg-[rgba(12,13,15,0.3)] backdrop-blur-[10px]"
                onClick={onClose}
            />
            <div className="relative max-h-[95vh] w-full max-w-[566px] overflow-y-auto rounded-[12px] bg-white p-8">
                {children}
            </div>
        </div>
    )
}

const ModalHeader: React.FC<{
    title: React.ReactNode
    subtitle?: string
    iconVariant?: 'warning' | 'danger'
    onClose: () => void
}> = ({ title, subtitle, iconVariant, onClose }) => (
    <div className="flex items-center gap-2">
        {iconVariant ? (
            <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    iconVariant === 'danger' ? 'bg-[rgba(220,38,38,0.2)]' : 'bg-[rgba(245,158,11,0.2)]'
                }`}
            >
                <AlertTriangle
                    className={`h-5 w-5 ${iconVariant === 'danger' ? 'text-[#DC2626]' : 'text-[#F59E0B]'}`}
                />
            </div>
        ) : null}

        <div className="min-w-0 flex-1">
            <div className="text-[18px] font-semibold text-[#0C0D0F]">{title}</div>
            {subtitle ? <p className="text-[13px] text-[#929292]">{subtitle}</p> : null}
        </div>

        <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-full p-1 text-[#0C0D0F] transition-colors hover:bg-[#F3F4F6]"
        >
            <X className="h-5 w-5" />
        </button>
    </div>
)

const UserSummaryCard: React.FC<{
    user: AdminUserItem
    includePoints?: boolean
}> = ({ user, includePoints = false }) => (
    <div className="flex items-center gap-4 rounded-[12px] border border-[#E5E7EB] bg-white p-4">
        <Avatar
            src={user.image || DEFAULT_AVATAR_URL}
            name={user.name || 'User name'}
            size={80}
        />
        <div className="min-w-0 flex-1">
            <p className="truncate text-[30px] leading-none text-[#0C0D0F]">{user.name || 'User name'}</p>
            <div className="mt-2 flex items-center gap-1 text-[13px] text-[#666666]">
                <Mail className="h-4 w-4" />
                <span className="truncate">{user.email || '--'}</span>
            </div>
            <div className="mt-2">
                <span
                    className={`inline-flex h-[23px] items-center rounded-[8px] px-[6px] text-[13px] ${
                        statusPillClassName[user.status]
                    }`}
                >
                    {displayStatus(user.status)}
                </span>
            </div>
        </div>

        {includePoints ? (
            <div className="w-[121px] text-right">
                <p className="text-[16px] text-[#3272A3]">Current balance</p>
                <div className="mt-1 flex items-center justify-end gap-1">
                    <p className="text-[18px] font-semibold text-[#0C0D0F]">
                        {user.points.toLocaleString('en-US')}
                    </p>
                    <p className="text-[13px] text-[#0C0D0F]">pts</p>
                </div>
            </div>
        ) : null}
    </div>
)

const FooterButtons: React.FC<{
    onClose: () => void
    submitLabel: string
    submitting: boolean
    submitDisabled: boolean
    onSubmit: () => void
    submitVariant?: 'primary' | 'danger'
}> = ({
    onClose,
    submitLabel,
    submitting,
    submitDisabled,
    onSubmit,
    submitVariant = 'primary',
}) => (
    <div className="flex items-center justify-end gap-4">
        <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-[10px] border border-[#D1D5DB] bg-white px-5 text-[14px] text-[#0C0D0F] transition-colors hover:bg-[#F9FAFB]"
        >
            cancel
        </button>
        <button
            type="button"
            onClick={onSubmit}
            disabled={submitDisabled || submitting}
            className={`h-10 rounded-[10px] px-5 text-[14px] text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                submitVariant === 'danger'
                    ? 'bg-[#DC2626] hover:bg-[#B91C1C]'
                    : 'bg-[#3272A3] hover:bg-[#295C82]'
            }`}
        >
            {submitting ? 'saving...' : submitLabel}
        </button>
    </div>
)

export type AdminUserActionModalType =
    | 'warn'
    | 'suspend'
    | 'ban'
    | 'adjust-points'
    | 'internal-note'

export type AdminUserActionModalState = {
    type: AdminUserActionModalType
    user: AdminUserItem
}

export type WarnModalPayload = {
    type: string
    reason: string
    externalNote: string
}

export type SuspendModalPayload = {
    type: string
    reason: string
    externalNote: string
    endAt: string
}

export type BanModalPayload = {
    type: string
    reason: string
    externalNote: string
}

export type AdjustPointsModalPayload = {
    actionType: 'ADD' | 'DEDUCT'
    points: number
    reason: string
}

export type InternalNoteModalPayload = {
    externalNote: string
}

type AdminUserActionModalsProps = {
    state: AdminUserActionModalState | null
    pendingType: AdminUserActionModalType | null
    errorMessage: string | null
    adminName: string
    onClose: () => void
    onWarnSubmit: (payload: WarnModalPayload) => void | Promise<void>
    onSuspendSubmit: (payload: SuspendModalPayload) => void | Promise<void>
    onBanSubmit: (payload: BanModalPayload) => void | Promise<void>
    onAdjustPointsSubmit: (payload: AdjustPointsModalPayload) => void | Promise<void>
    onInternalNoteSubmit: (payload: InternalNoteModalPayload) => void | Promise<void>
}

export const AdminUserActionModals: React.FC<AdminUserActionModalsProps> = ({
    state,
    pendingType,
    errorMessage,
    adminName,
    onClose,
    onWarnSubmit,
    onSuspendSubmit,
    onBanSubmit,
    onAdjustPointsSubmit,
    onInternalNoteSubmit,
}) => {
    const modalType = state?.type ?? null
    const user = state?.user ?? null
    const isOpen = modalType !== null && user !== null

    const [warnReason, setWarnReason] = useState(restrictionReasons[0])
    const [warnMessage, setWarnMessage] = useState('')

    const [suspendReason, setSuspendReason] = useState(restrictionReasons[0])
    const [suspendDuration, setSuspendDuration] = useState<SuspendDurationKey>('custom')
    const [suspendEndDate, setSuspendEndDate] = useState(() => normalizeDayDate(addDays(new Date(), 7)))
    const [visibleMonth, setVisibleMonth] = useState(() => new Date())

    const [banReason, setBanReason] = useState(restrictionReasons[0])
    const [banNote, setBanNote] = useState('')
    const [banAcknowledge, setBanAcknowledge] = useState(false)

    const [adjustActionType, setAdjustActionType] = useState<'ADD' | 'DEDUCT'>('ADD')
    const [adjustPointsAmount, setAdjustPointsAmount] = useState('0')
    const [adjustReason, setAdjustReason] = useState('')
    const [adjustNotifyUser, setAdjustNotifyUser] = useState(true)

    const [noteContent, setNoteContent] = useState('')
    const [noteCategory, setNoteCategory] = useState<string | null>('Dispute-related')

    const warnMessageLength = warnMessage.length
    const banNoteLength = banNote.length
    const noteContentLength = noteContent.length

    const calendarCells = useMemo(() => buildCalendarCells(visibleMonth), [visibleMonth])
    const selectedDateLabel = `selected: ${formatSelectedDate(suspendEndDate)}`
    const isSubmitting = pendingType === modalType

    if (!isOpen || !user) return null

    const handleSuspendDurationChange = (nextDuration: SuspendDurationKey) => {
        setSuspendDuration(nextDuration)
        const option = durationOptions.find((entry) => entry.key === nextDuration)
        if (!option || option.days === null) return

        const nextDate = normalizeDayDate(addDays(new Date(), option.days))
        setSuspendEndDate(nextDate)
        setVisibleMonth(nextDate)
    }

    const handleWarnSubmit = () => {
        if (!warnReason.trim() || !warnMessage.trim()) return
        onWarnSubmit({
            type: 'WARNING',
            reason: warnReason.trim(),
            externalNote: warnMessage.trim(),
        })
    }

    const handleSuspendSubmit = () => {
        if (!suspendReason.trim()) return
        const normalizedEndDate = new Date(suspendEndDate)
        normalizedEndDate.setHours(23, 59, 59, 999)

        onSuspendSubmit({
            type: 'SUSPENSION',
            reason: suspendReason.trim(),
            externalNote: suspendReason.trim(),
            endAt: normalizedEndDate.toISOString(),
        })
    }

    const handleBanSubmit = () => {
        if (!banReason.trim() || !banNote.trim() || !banAcknowledge) return

        onBanSubmit({
            type: 'BAN',
            reason: banReason.trim(),
            externalNote: banNote.trim(),
        })
    }

    const handleAdjustPointsSubmit = () => {
        const parsedPoints = Number(adjustPointsAmount)
        if (!Number.isFinite(parsedPoints) || parsedPoints <= 0 || !adjustReason.trim()) return

        onAdjustPointsSubmit({
            actionType: adjustActionType,
            points: parsedPoints,
            reason: adjustReason.trim(),
        })
    }

    const handleInternalNoteSubmit = () => {
        const normalizedContent = noteContent.trim()
        if (!normalizedContent) return

        const payload =
            noteCategory && noteCategory.trim().length > 0
                ? `[${noteCategory}] ${normalizedContent}`
                : normalizedContent

        onInternalNoteSubmit({ externalNote: payload })
    }

    const headerUsername = toUsernameToken(user.name || 'Username')
    const formattedRecordedAt = formatRecordedAt(new Date())

    return (
        <ModalShell open={isOpen} onClose={onClose}>
            {modalType === 'warn' ? (
                <div className="space-y-6">
                    <ModalHeader
                        title="Issue Warning"
                        subtitle="Notify user about a violation"
                        iconVariant="danger"
                        onClose={onClose}
                    />

                    <UserSummaryCard user={user} />

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <FieldLabel title="Reason for warning" required />
                            <div className="relative">
                                <select
                                    value={warnReason}
                                    onChange={(event) => setWarnReason(event.target.value)}
                                    className="h-12 w-full appearance-none rounded-[8px] border border-[rgba(0,122,255,0.15)] bg-white px-4 pr-11 text-[14px] text-[#0C0D0F] outline-none focus:border-[#3E8FCC]"
                                >
                                    {restrictionReasons.map((reason) => (
                                        <option key={reason} value={reason}>
                                            {reason}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0C0D0F]" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <FieldLabel title="Message to user" required />
                            <textarea
                                value={warnMessage}
                                onChange={(event) => setWarnMessage(clampText(event.target.value))}
                                placeholder="Type a message..."
                                className="h-[120px] w-full resize-none rounded-[8px] border border-[rgba(0,122,255,0.15)] bg-white p-4 text-[14px] text-[#0C0D0F] outline-none placeholder:text-[#929292] focus:border-[#3E8FCC]"
                            />
                            <p className="text-right text-[12px] text-[#0C0D0F]">
                                {warnMessageLength}/{MAX_TEXT_LENGTH} characters
                            </p>
                        </div>
                    </div>

                    {errorMessage ? <p className="text-[13px] text-[#DC2626]">{errorMessage}</p> : null}

                    <FooterButtons
                        onClose={onClose}
                        submitLabel="send warning"
                        submitting={isSubmitting}
                        submitDisabled={!warnReason.trim() || !warnMessage.trim()}
                        onSubmit={handleWarnSubmit}
                    />
                </div>
            ) : null}

            {modalType === 'suspend' ? (
                <div className="space-y-6">
                    <ModalHeader
                        title={
                            <span>
                                Suspend Account: <span className="text-[#3E8FCC]">@{headerUsername}</span>
                            </span>
                        }
                        onClose={onClose}
                    />

                    <div className="rounded-[8px] border-l-2 border-[#F59E0B] bg-[rgba(245,158,11,0.2)] p-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full">
                                <AlertTriangle className="h-6 w-6 text-[#F59E0B]" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[18px] font-semibold text-[#0C0D0F]">Warning</p>
                                <p className="text-[13px] text-[#929292]">
                                    Suspending this user will immediately{' '}
                                    <span className="text-[#DC2626]">cancel upcoming skill swaps</span> and hide
                                    their profile from search results.
                                </p>
                            </div>
                        </div>
                    </div>

                    <UserSummaryCard user={user} />

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <FieldLabel title="Reason for suspension" required />
                            <div className="relative">
                                <select
                                    value={suspendReason}
                                    onChange={(event) => setSuspendReason(event.target.value)}
                                    className="h-12 w-full appearance-none rounded-[8px] border border-[rgba(0,122,255,0.15)] bg-white px-4 pr-11 text-[14px] text-[#0C0D0F] outline-none focus:border-[#3E8FCC]"
                                >
                                    {restrictionReasons.map((reason) => (
                                        <option key={reason} value={reason}>
                                            {reason}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0C0D0F]" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <FieldLabel title="Duration" required />
                            <div className="flex items-center justify-between rounded-[8px] bg-[#F3F4F6] p-2">
                                {durationOptions.map((option) => {
                                    const active = suspendDuration === option.key
                                    return (
                                        <button
                                            key={option.key}
                                            type="button"
                                            onClick={() => handleSuspendDurationChange(option.key)}
                                            className={`rounded-[4px] px-3 py-2 text-[14px] transition-colors ${
                                                active
                                                    ? 'bg-white text-[#3E8FCC]'
                                                    : 'text-[#666666] hover:bg-white'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="space-y-4 rounded-[12px] border border-[#F5F5F5] bg-[#F3F4F6] p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-[16px] text-[#0C0D0F]">suspension end date</p>
                                <span className="inline-flex h-[23px] items-center rounded-[8px] bg-[rgba(62,143,204,0.2)] px-[6px] text-[13px] text-[#3272A3]">
                                    {selectedDateLabel}
                                </span>
                            </div>

                            <div className="flex items-center justify-between px-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setVisibleMonth(
                                            (previous) =>
                                                new Date(previous.getFullYear(), previous.getMonth() - 1, 1)
                                        )
                                    }
                                    className="rounded-full p-1 text-[#757575] transition-colors hover:bg-white"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <p className="text-[30px] font-semibold text-[#757575]">{formatMonthLabel(visibleMonth)}</p>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setVisibleMonth(
                                            (previous) =>
                                                new Date(previous.getFullYear(), previous.getMonth() + 1, 1)
                                        )
                                    }
                                    className="rounded-full p-1 text-[#757575] transition-colors hover:bg-white"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-5">
                                <div className="grid grid-cols-7 px-4 text-center text-[16px] font-semibold text-[#757575]">
                                    {['S', 'S', 'M', 'T', 'W', 'Th', 'F'].map((dayLabel) => (
                                        <p key={dayLabel}>{dayLabel}</p>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-y-2 px-4 text-center">
                                    {calendarCells.map((cell) => {
                                        const dayDate = normalizeDayDate(cell.date)
                                        const selectedDay = dayDate.getTime() === suspendEndDate.getTime()
                                        return (
                                            <button
                                                key={dayDate.toISOString()}
                                                type="button"
                                                onClick={() => {
                                                    setSuspendEndDate(dayDate)
                                                    setVisibleMonth(new Date(dayDate.getFullYear(), dayDate.getMonth(), 1))
                                                    setSuspendDuration('custom')
                                                }}
                                                className={`mx-auto flex h-10 w-10 items-center justify-center rounded-[30px] text-[16px] font-semibold ${
                                                    selectedDay
                                                        ? 'bg-[rgba(49,76,255,0.1)] text-[#314CFF]'
                                                        : cell.isCurrentMonth
                                                          ? 'text-[#757575]'
                                                          : 'text-[#9E9E9E]'
                                                }`}
                                            >
                                                {cell.day}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {errorMessage ? <p className="text-[13px] text-[#DC2626]">{errorMessage}</p> : null}

                    <FooterButtons
                        onClose={onClose}
                        submitLabel="suspend user"
                        submitting={isSubmitting}
                        submitDisabled={!suspendReason.trim()}
                        onSubmit={handleSuspendSubmit}
                    />
                </div>
            ) : null}

            {modalType === 'ban' ? (
                <div className="space-y-6">
                    <ModalHeader
                        title="Ban user Permanently"
                        subtitle="review the user details before proceeding"
                        iconVariant="danger"
                        onClose={onClose}
                    />

                    <div className="rounded-[8px] border-l-2 border-[#DC2626] bg-[rgba(220,38,38,0.2)] p-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full">
                                <AlertTriangle className="h-6 w-6 text-[#DC2626]" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[18px] font-semibold text-[#0C0D0F]">Warning</p>
                                <p className="text-[13px] text-[#DC2626]">
                                    this action is <span className="font-semibold">irreversible</span>. the user
                                    will lose access to their profile, messages, and history immediately.
                                </p>
                            </div>
                        </div>
                    </div>

                    <UserSummaryCard user={user} />

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <FieldLabel title="Reason for Ban" required />
                            <div className="relative">
                                <select
                                    value={banReason}
                                    onChange={(event) => setBanReason(event.target.value)}
                                    className="h-12 w-full appearance-none rounded-[8px] border border-[rgba(0,122,255,0.15)] bg-white px-4 pr-11 text-[14px] text-[#0C0D0F] outline-none focus:border-[#3E8FCC]"
                                >
                                    {restrictionReasons.map((reason) => (
                                        <option key={reason} value={reason}>
                                            {reason}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0C0D0F]" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <FieldLabel title="Enternal admin note" required />
                            <textarea
                                value={banNote}
                                onChange={(event) => setBanNote(clampText(event.target.value))}
                                placeholder="Type a note..."
                                className="h-[120px] w-full resize-none rounded-[8px] border border-[rgba(0,122,255,0.15)] bg-white p-4 text-[14px] text-[#0C0D0F] outline-none placeholder:text-[#929292] focus:border-[#3E8FCC]"
                            />
                            <p className="text-right text-[12px] text-[#0C0D0F]">
                                {banNoteLength}/{MAX_TEXT_LENGTH} characters
                            </p>
                        </div>
                    </div>

                    <label className="flex cursor-pointer items-start gap-2">
                        <input
                            type="checkbox"
                            checked={banAcknowledge}
                            onChange={(event) => setBanAcknowledge(event.target.checked)}
                            className="mt-1 h-4 w-4 accent-[#3272A3]"
                        />
                        <span className="text-[13px] text-[#0C0D0F]">
                            i understand this actin cannot be undone and the user date may be deleted Premanently
                        </span>
                    </label>

                    {errorMessage ? <p className="text-[13px] text-[#DC2626]">{errorMessage}</p> : null}

                    <FooterButtons
                        onClose={onClose}
                        submitLabel="Ban user Premanently"
                        submitting={isSubmitting}
                        submitDisabled={!banReason.trim() || !banNote.trim() || !banAcknowledge}
                        onSubmit={handleBanSubmit}
                        submitVariant="danger"
                    />
                </div>
            ) : null}

            {modalType === 'adjust-points' ? (
                <div className="space-y-6">
                    <ModalHeader title="Adjust user points" onClose={onClose} />

                    <UserSummaryCard user={user} includePoints />

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <FieldLabel title="Action Type" required />
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setAdjustActionType('ADD')}
                                    className={`rounded-[12px] border px-10 py-6 text-center ${
                                        adjustActionType === 'ADD'
                                            ? 'border-2 border-[#314CFF] bg-[rgba(62,143,204,0.2)]'
                                            : 'border border-[#D9D9D9] bg-white'
                                    }`}
                                >
                                    <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#314CFF] text-white">
                                        <Star className="h-4 w-4 fill-white" />
                                    </span>
                                    <span className="mt-2 block text-[16px] text-[#0C0D0F]">Add points</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setAdjustActionType('DEDUCT')}
                                    className={`rounded-[12px] border px-10 py-6 text-center ${
                                        adjustActionType === 'DEDUCT'
                                            ? 'border-2 border-[#DC2626] bg-[rgba(220,38,38,0.12)]'
                                            : 'border border-[#D9D9D9] bg-white'
                                    }`}
                                >
                                    <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#DC2626] text-white">
                                        <Star className="h-4 w-4 fill-white" />
                                    </span>
                                    <span className="mt-2 block text-[16px] text-[#0C0D0F]">deduct points</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <FieldLabel title="points amount" required />
                            <div className="flex h-12 items-center rounded-[8px] border border-[rgba(0,122,255,0.15)] px-4">
                                <span className="text-[16px] text-[#929292]">#</span>
                                <input
                                    type="number"
                                    min={0}
                                    value={adjustPointsAmount}
                                    onChange={(event) => setAdjustPointsAmount(event.target.value)}
                                    className="ml-6 flex-1 bg-transparent text-[14px] text-[#0C0D0F] outline-none"
                                />
                                <span className="text-[14px] text-[#929292]">pts</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <FieldLabel title="reason for adjustment" required />
                            <textarea
                                value={adjustReason}
                                onChange={(event) => setAdjustReason(clampText(event.target.value))}
                                placeholder="e.g. compensation for technical issue during swap session .."
                                className="h-[120px] w-full resize-none rounded-[8px] border border-[rgba(0,122,255,0.15)] bg-white p-4 text-[14px] text-[#0C0D0F] outline-none placeholder:text-[#929292] focus:border-[#3E8FCC]"
                            />
                            <p className="text-[12px] text-[#757575]">this reason will be visible in user activity log</p>
                        </div>
                    </div>

                    <label className="flex cursor-pointer items-start gap-2">
                        <input
                            type="checkbox"
                            checked={adjustNotifyUser}
                            onChange={(event) => setAdjustNotifyUser(event.target.checked)}
                            className="mt-1 h-4 w-4 accent-[#3272A3]"
                        />
                        <span>
                            <p className="text-[16px] text-[#0C0D0F]">notify user about this change</p>
                            <p className="text-[12px] text-[#929292]">an email notofication will be sent immedatily</p>
                        </span>
                    </label>

                    {errorMessage ? <p className="text-[13px] text-[#DC2626]">{errorMessage}</p> : null}

                    <FooterButtons
                        onClose={onClose}
                        submitLabel="save changes"
                        submitting={isSubmitting}
                        submitDisabled={
                            !Number.isFinite(Number(adjustPointsAmount)) ||
                            Number(adjustPointsAmount) <= 0 ||
                            !adjustReason.trim()
                        }
                        onSubmit={handleAdjustPointsSubmit}
                    />
                </div>
            ) : null}

            {modalType === 'internal-note' ? (
                <div className="space-y-6">
                    <ModalHeader title="Add internal note" onClose={onClose} />

                    <UserSummaryCard user={user} includePoints />

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <FieldLabel title="Note content" required />
                            <textarea
                                value={noteContent}
                                onChange={(event) => setNoteContent(clampText(event.target.value))}
                                placeholder="e.g. compensation for technical issue during swap session .."
                                className="h-[120px] w-full resize-none rounded-[8px] border border-[rgba(0,122,255,0.15)] bg-white p-4 text-[14px] text-[#0C0D0F] outline-none placeholder:text-[#929292] focus:border-[#3E8FCC]"
                            />
                        </div>

                        <div className="space-y-2">
                            <FieldLabel title="Categories" secondaryLabel="(optional)" />
                            <div className="flex flex-wrap items-center gap-2">
                                {noteCategories.map((category) => {
                                    const active = noteCategory === category
                                    return (
                                        <button
                                            key={category}
                                            type="button"
                                            onClick={() => setNoteCategory(active ? null : category)}
                                            className={`rounded-[12px] border px-4 py-2 text-[14px] ${
                                                active
                                                    ? 'border-[#3E8FCC] bg-[rgba(62,143,204,0.2)] text-[#3E8FCC]'
                                                    : 'border-[#E5E7EB] bg-[#F3F4F6] text-[#0C0D0F]'
                                            }`}
                                        >
                                            {category}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 text-[12px] text-[#929292]">
                        <Clock3 className="h-4 w-4" />
                        <span>Recorded as:</span>
                        <span className="font-semibold">{formattedRecordedAt}</span>
                        <span>By :{adminName}</span>
                    </div>

                    <p className="text-right text-[12px] text-[#0C0D0F]">
                        {noteContentLength}/{MAX_TEXT_LENGTH} characters
                    </p>

                    {errorMessage ? <p className="text-[13px] text-[#DC2626]">{errorMessage}</p> : null}

                    <FooterButtons
                        onClose={onClose}
                        submitLabel="save note"
                        submitting={isSubmitting}
                        submitDisabled={!noteContent.trim()}
                        onSubmit={handleInternalNoteSubmit}
                    />
                </div>
            ) : null}
        </ModalShell>
    )
}

export default AdminUserActionModals
