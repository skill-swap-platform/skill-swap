import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
    CalendarDays,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Download,
    Search,
} from 'lucide-react'
import { SortOrderIcon } from '@/components/admin-users/SortOrderIcon'
import { useAdminUserSessions } from '@/hooks/useAdminUserSessions'
import type {
    AdminSessionStatus,
    AdminUserSessionItem,
    AdminUserSessionsSort,
} from '@/types/adminUsers.types'

const PAGE_LIMIT = 12

const statusOptions: { label: string; value: AdminSessionStatus | 'ALL' }[] = [
    { label: 'All Status', value: 'ALL' },
    { label: 'Scheduled', value: 'SCHEDULED' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Canceled', value: 'CANCELLED' },
    { label: 'Rescheduled', value: 'RESCHEDULED' },
]

const sortOptions: { label: string; value: AdminUserSessionsSort }[] = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
]

const statusPillClassName: Record<AdminSessionStatus, string> = {
    SCHEDULED: 'bg-[rgba(62,143,204,0.2)] text-[#3272A3]',
    COMPLETED: 'bg-[rgba(22,163,74,0.2)] text-[#16A34A]',
    CANCELLED: 'bg-[rgba(220,38,38,0.2)] text-[#DC2626]',
    RESCHEDULED: 'bg-[rgba(255,164,18,0.2)] text-[#FFA412]',
}

const statusDotClassName: Record<AdminSessionStatus, string> = {
    SCHEDULED: 'bg-[#3272A3]',
    COMPLETED: 'bg-[#16A34A]',
    CANCELLED: 'bg-[#DC2626]',
    RESCHEDULED: 'bg-[#FFA412]',
}

type SelectionCheckboxProps = {
    checked: boolean
    onChange: () => void
    ariaLabel: string
}

const SelectionCheckbox: React.FC<SelectionCheckboxProps> = ({ checked, onChange, ariaLabel }) => (
    <label className="inline-flex cursor-pointer items-center justify-center">
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            aria-label={ariaLabel}
            className="peer sr-only"
        />
        <span
            className={`flex size-6 items-center justify-center rounded-[6px] border transition-colors ${
                checked ? 'border-[#3272A3] bg-[#3272A3]' : 'border-[#94A3B8] bg-white'
            }`}
        >
            {checked ? <Check className="h-[14px] w-[14px] text-white" strokeWidth={3} /> : null}
        </span>
    </label>
)

const formatStatusLabel = (status: AdminSessionStatus): string => {
    if (status === 'CANCELLED') return 'Canceled'
    if (status === 'RESCHEDULED') return 'Rescheduled'
    if (status === 'COMPLETED') return 'Completed'
    return 'Scheduled'
}

const formatSessionId = (value: string): string => {
    const normalized = value.trim()
    if (!normalized) return '--'
    if (normalized.startsWith('#')) return normalized
    if (/^\d+$/.test(normalized)) return `#${normalized}`
    return `#${normalized.slice(-4)}`
}

const formatDate = (value: string): string => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '--'
    return date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
    })
}

const formatTime = (value: string): string => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '--'
    return date
        .toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
        })
        .toLowerCase()
}

const formatDuration = (duration: number | null): string =>
    typeof duration === 'number' && duration > 0 ? `${duration} min` : '--'

const toCsvCell = (value: string): string => `"${value.replaceAll('"', '""')}"`

const normalizeSkillLines = (value: string): string[] => {
    const normalized = value.trim()
    if (!normalized) return ['--']

    const separators = [',', '|', '/']
    for (const separator of separators) {
        if (!normalized.includes(separator)) continue
        const splitValues = normalized
            .split(separator)
            .map((entry) => entry.trim())
            .filter(Boolean)

        if (splitValues.length > 0) return splitValues.slice(0, 2)
    }

    return [normalized]
}

const downloadCsv = (rows: AdminUserSessionItem[]) => {
    const headers = ['Session ID', 'Date', 'Time', 'Status', 'Skills', 'Partner', 'Duration']

    const lines = [
        headers.map(toCsvCell).join(','),
        ...rows.map((row) =>
            [
                formatSessionId(row.id),
                formatDate(row.scheduledAt),
                formatTime(row.scheduledAt),
                formatStatusLabel(row.status),
                normalizeSkillLines(row.skillName).join(' | '),
                row.partner.userName || 'Unknown User',
                formatDuration(row.duration),
            ]
                .map((cell) => toCsvCell(cell))
                .join(',')
        ),
    ]

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const timestamp = new Date().toISOString().slice(0, 10)
    link.href = url
    link.download = `admin-user-sessions-${timestamp}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

const getPageNumbers = (totalPages: number, currentPage: number): number[] => {
    if (totalPages <= 3) return Array.from({ length: totalPages }, (_, index) => index + 1)
    if (currentPage <= 2) return [1, 2, 3]
    if (currentPage >= totalPages - 1) return [totalPages - 2, totalPages - 1, totalPages]
    return [currentPage - 1, currentPage, currentPage + 1]
}

type AdminUserSessionsTableProps = {
    userId?: string
}

export const AdminUserSessionsTable: React.FC<AdminUserSessionsTableProps> = ({ userId }) => {
    const [page, setPage] = useState(1)
    const [searchInput, setSearchInput] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [status, setStatus] = useState<AdminSessionStatus | 'ALL'>('ALL')
    const [sort, setSort] = useState<AdminUserSessionsSort>('newest')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [statusMenuOpen, setStatusMenuOpen] = useState(false)
    const [sortMenuOpen, setSortMenuOpen] = useState(false)
    const [dateMenuOpen, setDateMenuOpen] = useState(false)
    const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([])

    const statusMenuRef = useRef<HTMLDivElement>(null)
    const sortMenuRef = useRef<HTMLDivElement>(null)
    const dateMenuRef = useRef<HTMLDivElement>(null)

    const sessionsQuery = useAdminUserSessions(userId, {
        page,
        limit: PAGE_LIMIT,
        search: searchValue || undefined,
        status: status === 'ALL' ? undefined : status,
        sort,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
    })

    const statusLabel = useMemo(
        () => statusOptions.find((option) => option.value === status)?.label ?? 'All Status',
        [status]
    )
    const sortLabel = useMemo(
        () => sortOptions.find((option) => option.value === sort)?.label ?? 'Newest',
        [sort]
    )

    const rows = useMemo(() => sessionsQuery.data?.data ?? [], [sessionsQuery.data?.data])
    const pagination = sessionsQuery.data?.pagination
    const totalRows = pagination?.total ?? 0
    const totalPages = Math.max(1, pagination?.totalPages ?? 1)
    const currentPage = pagination?.page ?? page
    const currentLimit = pagination?.limit ?? PAGE_LIMIT
    const shownCount =
        rows.length === 0
            ? 0
            : Math.min(totalRows, (Math.max(1, currentPage) - 1) * currentLimit + rows.length)
    const pageNumbers = getPageNumbers(totalPages, currentPage)

    const selectedRows = useMemo(
        () => rows.filter((row) => selectedSessionIds.includes(row.id)),
        [rows, selectedSessionIds]
    )
    const isAllRowsChecked = rows.length > 0 && rows.every((row) => selectedSessionIds.includes(row.id))

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setPage(1)
            setSearchValue(searchInput.trim())
            setSelectedSessionIds([])
        }, 300)

        return () => window.clearTimeout(timeoutId)
    }, [searchInput])

    useEffect(() => {
        const closeMenus = (event: MouseEvent) => {
            const target = event.target as Node
            if (statusMenuRef.current && !statusMenuRef.current.contains(target)) {
                setStatusMenuOpen(false)
            }
            if (sortMenuRef.current && !sortMenuRef.current.contains(target)) {
                setSortMenuOpen(false)
            }
            if (dateMenuRef.current && !dateMenuRef.current.contains(target)) {
                setDateMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', closeMenus)
        return () => document.removeEventListener('mousedown', closeMenus)
    }, [])

    const toggleAllRows = () => {
        if (isAllRowsChecked) {
            setSelectedSessionIds((previousIds) =>
                previousIds.filter((id) => !rows.some((row) => row.id === id))
            )
            return
        }

        const idsToAdd = rows.map((row) => row.id)
        setSelectedSessionIds((previousIds) => Array.from(new Set([...previousIds, ...idsToAdd])))
    }

    const toggleSingleRow = (rowId: string) => {
        setSelectedSessionIds((previousIds) =>
            previousIds.includes(rowId)
                ? previousIds.filter((id) => id !== rowId)
                : [...previousIds, rowId]
        )
    }

    const onStatusChange = (value: AdminSessionStatus | 'ALL') => {
        setStatus(value)
        setPage(1)
        setSelectedSessionIds([])
        setStatusMenuOpen(false)
    }

    const onSortChange = (value: AdminUserSessionsSort) => {
        setSort(value)
        setPage(1)
        setSelectedSessionIds([])
        setSortMenuOpen(false)
    }

    const applyDateFilter = () => {
        setPage(1)
        setSelectedSessionIds([])
        setDateMenuOpen(false)
    }

    const clearDateFilter = () => {
        setStartDate('')
        setEndDate('')
        setPage(1)
        setSelectedSessionIds([])
        setDateMenuOpen(false)
    }

    if (!userId) {
        return (
            <section className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4">
                <p className="text-sm text-[#B91C1C]">User id is missing.</p>
            </section>
        )
    }

    return (
        <div className="space-y-4">
            <section className="rounded-[12px] bg-white">
                <div className="flex flex-col gap-2 py-4 xl:flex-row xl:items-center">
                    <div className="relative w-full xl:max-w-[550px]">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9CA3AF]" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            placeholder="Search by name"
                            className="h-12 w-full rounded-[12px] border border-[#E5E7EB] bg-white pl-12 pr-4 text-[16px] text-[#0C0D0F] outline-none placeholder:text-[#9CA3AF] focus:border-[#3272A3]"
                        />
                    </div>

                    <div className="flex w-full flex-wrap items-center gap-2 xl:ml-auto xl:w-auto">
                        <div className="relative" ref={dateMenuRef}>
                            <button
                                type="button"
                                onClick={() => setDateMenuOpen((previous) => !previous)}
                                className="inline-flex h-12 items-center gap-1 rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-[16px] text-[#0C0D0F]"
                            >
                                Date Range
                                <CalendarDays className="h-5 w-5 text-[#0C0D0F]" />
                            </button>

                            {dateMenuOpen && (
                                <div className="absolute right-0 top-14 z-30 w-[280px] rounded-[10px] border border-[#E5E7EB] bg-white p-3 shadow-[0px_0px_4.7px_0px_rgba(0,0,0,0.25)]">
                                    <div className="space-y-2">
                                        <label className="block text-xs text-[#666666]">
                                            Start date
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(event) => setStartDate(event.target.value)}
                                                className="mt-1 h-9 w-full rounded-[8px] border border-[#E5E7EB] px-2 text-sm text-[#0C0D0F] outline-none focus:border-[#3272A3]"
                                            />
                                        </label>
                                        <label className="block text-xs text-[#666666]">
                                            End date
                                            <input
                                                type="date"
                                                value={endDate}
                                                min={startDate || undefined}
                                                onChange={(event) => setEndDate(event.target.value)}
                                                className="mt-1 h-9 w-full rounded-[8px] border border-[#E5E7EB] px-2 text-sm text-[#0C0D0F] outline-none focus:border-[#3272A3]"
                                            />
                                        </label>
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={clearDateFilter}
                                            className="flex-1 rounded-[8px] border border-[#E5E7EB] px-2 py-2 text-xs text-[#666666]"
                                        >
                                            Clear
                                        </button>
                                        <button
                                            type="button"
                                            onClick={applyDateFilter}
                                            className="flex-1 rounded-[8px] bg-[#3272A3] px-2 py-2 text-xs text-white"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative" ref={statusMenuRef}>
                            <button
                                type="button"
                                onClick={() => setStatusMenuOpen((previous) => !previous)}
                                className="inline-flex h-12 items-center gap-1 rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-[16px] text-[#0C0D0F]"
                            >
                                {statusLabel}
                                <ChevronDown className="h-5 w-5 text-[#0C0D0F]" />
                            </button>

                            {statusMenuOpen && (
                                <div className="absolute right-0 top-14 z-30 w-[164px] rounded-[10px] border border-[#E5E7EB] bg-white p-1 shadow-[0px_0px_4.7px_0px_rgba(0,0,0,0.25)]">
                                    {statusOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => onStatusChange(option.value)}
                                            className={`flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left text-sm ${
                                                status === option.value
                                                    ? 'bg-[#F7FAFF] text-[#3272A3]'
                                                    : 'text-[#0C0D0F] hover:bg-[#F9FAFB]'
                                            }`}
                                        >
                                            {option.label}
                                            {status === option.value ? (
                                                <Check className="h-3.5 w-3.5" />
                                            ) : null}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative" ref={sortMenuRef}>
                            <button
                                type="button"
                                onClick={() => setSortMenuOpen((previous) => !previous)}
                                className="inline-flex h-12 items-center gap-1 rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-[16px] text-[#0C0D0F]"
                            >
                                {sortLabel}
                                <SortOrderIcon sort={sort} />
                            </button>

                            {sortMenuOpen && (
                                <div className="absolute right-0 top-14 z-30 w-[124px] rounded-[10px] border border-[#E5E7EB] bg-white p-1 shadow-[0px_0px_4.7px_0px_rgba(0,0,0,0.25)]">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => onSortChange(option.value)}
                                            className={`flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left text-sm ${
                                                sort === option.value
                                                    ? 'bg-[#F7FAFF] text-[#3272A3]'
                                                    : 'text-[#0C0D0F] hover:bg-[#F9FAFB]'
                                            }`}
                                        >
                                            {option.label}
                                            {sort === option.value ? (
                                                <Check className="h-3.5 w-3.5" />
                                            ) : null}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto border border-[#F9FAFB]">
                    <table className="w-full min-w-[1108px] border-separate border-spacing-0">
                        <thead>
                            <tr>
                                <th className="h-[62px] w-[56px] border-b border-[#F3F4F6] bg-[#F9FAFB] px-4 text-left">
                                    <SelectionCheckbox
                                        checked={isAllRowsChecked}
                                        onChange={toggleAllRows}
                                        ariaLabel="Select all sessions"
                                    />
                                </th>
                                <th className="h-[62px] w-[197.75px] border-b border-[#F3F4F6] bg-[#F9FAFB] px-4 text-left text-[18px] font-semibold text-[#666666]">
                                    Session ID
                                </th>
                                <th className="h-[62px] w-[197.75px] border-b border-[#F3F4F6] bg-[#F9FAFB] px-4 text-left text-[18px] font-semibold text-[#666666]">
                                    Date &amp; Time
                                </th>
                                <th className="h-[62px] w-[197.75px] border-b border-[#F3F4F6] bg-[#F9FAFB] px-4 text-left text-[18px] font-semibold text-[#666666]">
                                    Status
                                </th>
                                <th className="h-[62px] w-[197.75px] border-b border-[#F3F4F6] bg-[#F9FAFB] px-4 text-left text-[18px] font-semibold text-[#666666]">
                                    Skills
                                </th>
                                <th className="h-[62px] w-[154px] border-b border-[#F3F4F6] bg-[#F9FAFB] px-4 text-left text-[18px] font-semibold text-[#666666]">
                                    Partener
                                </th>
                                <th className="h-[62px] w-[107px] border-b border-[#F3F4F6] bg-[#F9FAFB] px-4 text-left text-[18px] font-semibold text-[#666666]">
                                    Duration
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessionsQuery.isLoading && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="h-[88px] border-b border-[#F3F4F6] px-4 text-center text-sm text-[#666666]"
                                    >
                                        Loading sessions...
                                    </td>
                                </tr>
                            )}
                            {sessionsQuery.isError && !sessionsQuery.isLoading && (
                                <tr>
                                    <td colSpan={7} className="border-b border-[#F3F4F6] px-4 py-4">
                                        <div className="rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] p-3">
                                            <p className="text-sm text-[#B91C1C]">Failed to load sessions.</p>
                                            <button
                                                type="button"
                                                onClick={() => sessionsQuery.refetch()}
                                                className="mt-2 rounded-md bg-[#B91C1C] px-3 py-1.5 text-xs text-white"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!sessionsQuery.isLoading && !sessionsQuery.isError && rows.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="h-[88px] border-b border-[#F3F4F6] px-4 text-center text-sm text-[#666666]"
                                    >
                                        No sessions found.
                                    </td>
                                </tr>
                            )}
                            {!sessionsQuery.isLoading &&
                                !sessionsQuery.isError &&
                                rows.map((session) => {
                                    const checked = selectedSessionIds.includes(session.id)
                                    const skillLines = normalizeSkillLines(session.skillName)
                                    return (
                                        <tr key={session.id}>
                                            <td className="h-[62px] border-b border-[#F3F4F6] px-4">
                                                <SelectionCheckbox
                                                    checked={checked}
                                                    onChange={() => toggleSingleRow(session.id)}
                                                    ariaLabel={`Select session ${formatSessionId(session.id)}`}
                                                />
                                            </td>
                                            <td className="h-[62px] border-b border-[#F3F4F6] px-4">
                                                <p className="text-[14px] text-[#0C0D0F]">
                                                    {formatSessionId(session.id)}
                                                </p>
                                            </td>
                                            <td className="h-[62px] border-b border-[#F3F4F6] px-4">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-[14px] text-[#0C0D0F]">
                                                        {formatDate(session.scheduledAt)}
                                                    </p>
                                                    <p className="text-[13px] text-[#666666]">
                                                        {formatTime(session.scheduledAt)}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="h-[62px] border-b border-[#F3F4F6] px-4">
                                                <span
                                                    className={`inline-flex h-[23px] items-center gap-1 rounded-[8px] px-[6px] text-[14px] ${statusPillClassName[session.status]}`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${statusDotClassName[session.status]}`}
                                                    />
                                                    {formatStatusLabel(session.status)}
                                                </span>
                                            </td>
                                            <td className="h-[62px] border-b border-[#F3F4F6] px-4">
                                                <div className="flex flex-col gap-1">
                                                    {skillLines.map((skillLine, index) => (
                                                        <p
                                                            key={`${session.id}-skill-${index}`}
                                                            className="text-[14px] text-[#0C0D0F]"
                                                        >
                                                            {skillLine}
                                                        </p>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="h-[62px] border-b border-[#F3F4F6] px-4">
                                                <div className="flex items-center gap-2">
                                                    {session.partner.image ? (
                                                        <img
                                                            src={session.partner.image}
                                                            alt={session.partner.userName}
                                                            className="h-8 w-8 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-8 w-8 rounded-full bg-[#D4D4D4]" />
                                                    )}
                                                    <p className="truncate text-[14px] text-[#0C0D0F]">
                                                        {session.partner.userName || 'Unknown User'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="h-[62px] border-b border-[#F3F4F6] px-4">
                                                <p className="text-[14px] text-[#0C0D0F]">
                                                    {formatDuration(session.duration)}
                                                </p>
                                            </td>
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
                    <div className="px-4 text-[16px] text-[#3272A3]">
                        Showing {shownCount} of {totalRows}
                    </div>
                    <div className="flex items-center gap-2 px-4 sm:ml-auto">
                        <button
                            type="button"
                            onClick={() => setPage((previousPage) => Math.max(1, previousPage - 1))}
                            disabled={currentPage <= 1}
                            className="flex h-8 w-8 items-center justify-center rounded-[30px] border border-[#E5E7EB] bg-white text-[#0C0D0F] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        {pageNumbers.map((pageNumber) => {
                            const active = pageNumber === currentPage
                            return (
                                <button
                                    key={pageNumber}
                                    type="button"
                                    onClick={() => setPage(pageNumber)}
                                    className={`flex h-8 w-8 items-center justify-center rounded-[30px] border border-[#E5E7EB] text-sm ${
                                        active ? 'bg-[#F3F4F6] text-[#0C0D0F]' : 'bg-white text-[#0C0D0F]'
                                    }`}
                                >
                                    {pageNumber}
                                </button>
                            )
                        })}
                        <button
                            type="button"
                            onClick={() => setPage((previousPage) => Math.min(previousPage + 1, totalPages))}
                            disabled={currentPage >= totalPages}
                            className="flex h-8 w-8 items-center justify-center rounded-[30px] border border-[#E5E7EB] bg-white text-[#0C0D0F] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </section>

            {selectedRows.length > 0 && (
                <section className="px-0 md:px-[56px]">
                    <div className="rounded-[50px] border border-[#3272A3] bg-[#F7FAFF] p-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                            <div className="flex flex-1 items-center gap-2 text-[#3272A3]">
                                <div className="flex size-6 items-center justify-center rounded-[6px] bg-[#3272A3]">
                                    <Check className="h-[14px] w-[14px] text-white" strokeWidth={3} />
                                </div>
                                <p className="text-[16px]">{selectedRows.length} Sessions selected</p>
                            </div>
                            <div className="flex items-center justify-end">
                                <button
                                    type="button"
                                    onClick={() => downloadCsv(selectedRows)}
                                    className="flex h-10 items-center gap-1 rounded-[30px] px-4 text-[14px] text-[#F9FAFB]"
                                    style={{
                                        backgroundImage:
                                            'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(62, 143, 204) 0%, rgb(62, 143, 204) 100%)',
                                    }}
                                >
                                    Export
                                    <Download className="h-[18px] w-[18px]" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {sessionsQuery.isFetching && !sessionsQuery.isLoading && (
                <p className="text-xs text-[#666666]">Updating sessions...</p>
            )}
        </div>
    )
}

export default AdminUserSessionsTable
