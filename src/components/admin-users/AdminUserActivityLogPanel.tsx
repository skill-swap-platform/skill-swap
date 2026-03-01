import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { CalendarDays, Check, ChevronDown, Search, SlidersHorizontal } from 'lucide-react'
import { useAdminUserActivityLog } from '@/hooks/useAdminUserActivityLog'
import type { AdminUserActivityLogItem } from '@/types/adminUsers.types'

const BATCH_SIZE = 6

type ActivitySort = 'newest' | 'oldest'

const sortOptions: { label: string; value: ActivitySort }[] = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
]

const toText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '')

const formatDateTime = (value: string): string => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '--'

    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
    })
    const formattedTime = date
        .toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
        })
        .replace(' ', '')
        .toLowerCase()

    return `${formattedDate} - ${formattedTime}`
}

const normalizeToken = (value: string): string =>
    value
        .toLowerCase()
        .split('_')
        .filter(Boolean)
        .map((token) => `${token.charAt(0).toUpperCase()}${token.slice(1)}`)
        .join(' ')

const getAdminLabel = (entry: AdminUserActivityLogItem): string => {
    const adminName = toText(entry.adminName)
    if (adminName) return adminName

    const adminId = toText(entry.adminId)
    if (!adminId) return 'Admin'
    return `Admin#${adminId.slice(-4)}`
}

const buildActivityDescription = (entry: AdminUserActivityLogItem): string => {
    const adminLabel = getAdminLabel(entry)
    const entity = toText(entry.entity).toUpperCase()
    const type = toText(entry.type).toUpperCase()
    const externalNote = toText(entry.externalNote)
    const reason = toText(entry.reason)
    const metadata = entry.metadata ?? {}
    const oldStatus = toText(metadata.oldStatus)
    const newStatus = toText(metadata.newStatus)

    if (entity === 'ADMINNOTE' || type === 'ADMIN_NOTE') {
        if (externalNote) return `${adminLabel} added a note: ${externalNote}`
        return `${adminLabel} added a note to the user`
    }

    if (entity === 'USERRESTRICTION') {
        if (oldStatus && newStatus) {
            return `${adminLabel} changed user status from ${normalizeToken(oldStatus)} to ${normalizeToken(newStatus)}`
        }
        if (reason) return `${adminLabel} marked user as ${normalizeToken(type)} - Reason: ${reason}`
        return `${adminLabel} marked user as ${normalizeToken(type)}`
    }

    if (reason) return `${adminLabel} ${normalizeToken(type)} - Reason: ${reason}`
    if (externalNote) return `${adminLabel} ${normalizeToken(type)} - ${externalNote}`
    return `${adminLabel} ${normalizeToken(type || 'updated activity')}`
}

const getTimeValue = (value: string): number => {
    const parsed = new Date(value).getTime()
    return Number.isNaN(parsed) ? 0 : parsed
}

const isWithinDateRange = (value: string, startDate: string, endDate: string): boolean => {
    if (!startDate && !endDate) return true

    const timestamp = getTimeValue(value)
    if (!timestamp) return false

    if (startDate) {
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)
        if (timestamp < start.getTime()) return false
    }

    if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        if (timestamp > end.getTime()) return false
    }

    return true
}

const getErrorMessage = (error: unknown, fallback: string): string => {
    if (!axios.isAxiosError(error)) return fallback
    const message = error.response?.data?.message

    if (typeof message === 'string' && message.trim().length > 0) return message
    if (Array.isArray(message)) {
        const joinedMessage = message.filter((entry) => typeof entry === 'string').join(', ')
        if (joinedMessage.length > 0) return joinedMessage
    }

    return fallback
}

type AdminUserActivityLogPanelProps = {
    userId?: string
}

export const AdminUserActivityLogPanel: React.FC<AdminUserActivityLogPanelProps> = ({ userId }) => {
    const [searchInput, setSearchInput] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [sort, setSort] = useState<ActivitySort>('newest')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [dateMenuOpen, setDateMenuOpen] = useState(false)
    const [sortMenuOpen, setSortMenuOpen] = useState(false)
    const [visibleCount, setVisibleCount] = useState(BATCH_SIZE)

    const dateMenuRef = useRef<HTMLDivElement>(null)
    const sortMenuRef = useRef<HTMLDivElement>(null)

    const activityLogQuery = useAdminUserActivityLog(userId)

    const logs = useMemo(() => activityLogQuery.data ?? [], [activityLogQuery.data])

    const filteredRows = useMemo(() => {
        const normalizedSearch = searchValue.toLowerCase().trim()
        const searchedRows = logs.filter((entry) => {
            if (!normalizedSearch) return true

            const description = buildActivityDescription(entry).toLowerCase()
            const haystack = [
                description,
                toText(entry.adminName).toLowerCase(),
                toText(entry.adminEmail).toLowerCase(),
                toText(entry.adminId).toLowerCase(),
                toText(entry.externalNote).toLowerCase(),
                toText(entry.reason).toLowerCase(),
            ]
            return haystack.some((value) => value.includes(normalizedSearch))
        })

        const dateFilteredRows = searchedRows.filter((entry) =>
            isWithinDateRange(entry.createdAt, startDate, endDate)
        )

        const sortedRows = [...dateFilteredRows].sort((a, b) => {
            const first = getTimeValue(a.createdAt)
            const second = getTimeValue(b.createdAt)
            return sort === 'newest' ? second - first : first - second
        })

        return sortedRows
    }, [logs, searchValue, sort, startDate, endDate])

    const visibleRows = useMemo(
        () => filteredRows.slice(0, Math.max(BATCH_SIZE, visibleCount)),
        [filteredRows, visibleCount]
    )

    const hasMoreRows = visibleRows.length < filteredRows.length
    const usersErrorMessage = activityLogQuery.error
        ? getErrorMessage(activityLogQuery.error, 'Failed to load activity log.')
        : null

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setSearchValue(searchInput.trim())
            setVisibleCount(BATCH_SIZE)
        }, 250)

        return () => window.clearTimeout(timeoutId)
    }, [searchInput])

    useEffect(() => {
        const closeMenus = (event: MouseEvent) => {
            const target = event.target as Node
            if (dateMenuRef.current && !dateMenuRef.current.contains(target)) {
                setDateMenuOpen(false)
            }
            if (sortMenuRef.current && !sortMenuRef.current.contains(target)) {
                setSortMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', closeMenus)
        return () => document.removeEventListener('mousedown', closeMenus)
    }, [])

    const applyDateFilter = () => {
        setDateMenuOpen(false)
    }

    const clearDateFilter = () => {
        setStartDate('')
        setEndDate('')
        setVisibleCount(BATCH_SIZE)
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
            <section className="flex flex-col gap-2 py-4 xl:flex-row xl:items-center">
                <div className="relative w-full xl:max-w-[550px]">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(event) => setSearchInput(event.target.value)}
                        placeholder="Search by name or email"
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
                                            onChange={(event) => {
                                                setStartDate(event.target.value)
                                                setVisibleCount(BATCH_SIZE)
                                            }}
                                            className="mt-1 h-9 w-full rounded-[8px] border border-[#E5E7EB] px-2 text-sm text-[#0C0D0F] outline-none focus:border-[#3272A3]"
                                        />
                                    </label>
                                    <label className="block text-xs text-[#666666]">
                                        End date
                                        <input
                                            type="date"
                                            value={endDate}
                                            min={startDate || undefined}
                                            onChange={(event) => {
                                                setEndDate(event.target.value)
                                                setVisibleCount(BATCH_SIZE)
                                            }}
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

                    <div className="relative" ref={sortMenuRef}>
                        <button
                            type="button"
                            onClick={() => setSortMenuOpen((previous) => !previous)}
                            className="inline-flex h-12 items-center gap-1 rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-[16px] text-[#0C0D0F]"
                        >
                            {sort === 'newest' ? 'Newest' : 'Oldest'}
                            <SlidersHorizontal className="h-5 w-5 text-[#0C0D0F]" />
                        </button>

                        {sortMenuOpen && (
                            <div className="absolute right-0 top-14 z-30 w-[124px] rounded-[10px] border border-[#E5E7EB] bg-white p-1 shadow-[0px_0px_4.7px_0px_rgba(0,0,0,0.25)]">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            setSort(option.value)
                                            setVisibleCount(BATCH_SIZE)
                                            setSortMenuOpen(false)
                                        }}
                                        className={`flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left text-sm ${
                                            sort === option.value
                                                ? 'bg-[#F7FAFF] text-[#3272A3]'
                                                : 'text-[#0C0D0F] hover:bg-[#F9FAFB]'
                                        }`}
                                    >
                                        {option.label}
                                        {sort === option.value ? <Check className="h-3.5 w-3.5" /> : null}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {activityLogQuery.isLoading && (
                <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 text-center text-sm text-[#666666]">
                    Loading activity log...
                </section>
            )}

            {!activityLogQuery.isLoading && usersErrorMessage && (
                <section className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4">
                    <p className="text-sm text-[#B91C1C]">{usersErrorMessage}</p>
                    <button
                        type="button"
                        onClick={() => activityLogQuery.refetch()}
                        className="mt-3 rounded-md bg-[#B91C1C] px-3 py-1.5 text-sm text-white"
                    >
                        Retry
                    </button>
                </section>
            )}

            {!activityLogQuery.isLoading && !usersErrorMessage && visibleRows.length === 0 && (
                <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 text-center text-sm text-[#666666]">
                    No activity found.
                </section>
            )}

            {!activityLogQuery.isLoading && !usersErrorMessage && visibleRows.length > 0 && (
                <section className="space-y-3 px-0 md:px-6">
                    <div className="space-y-0">
                        {visibleRows.map((entry, index) => {
                            const isLastVisible = index === visibleRows.length - 1
                            return (
                                <article
                                    key={`${entry.id}-${index}`}
                                    className="flex min-h-[80px] items-start gap-4"
                                >
                                    <div className="flex h-full w-8 flex-col items-center pb-[2px]">
                                        <span className="h-3 w-3 rounded-full bg-[#3272A3]" />
                                        {!isLastVisible ? (
                                            <span className="mt-[-2px] min-h-[60px] w-1 flex-1 bg-[rgba(62,143,204,0.2)]" />
                                        ) : null}
                                    </div>

                                    <div className="flex flex-1 flex-col gap-2 pb-4">
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="h-5 w-5 text-[#666666]" />
                                            <p className="text-[14px] text-[#666666]">
                                                {formatDateTime(entry.createdAt)}
                                            </p>
                                        </div>
                                        <p className="text-[16px] text-[#0C0D0F]">
                                            {buildActivityDescription(entry)}
                                        </p>
                                    </div>
                                </article>
                            )
                        })}
                    </div>

                    {hasMoreRows && (
                        <div className="flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => setVisibleCount((previous) => previous + BATCH_SIZE)}
                                className="inline-flex items-center gap-2 text-[16px] text-[#3272A3]"
                            >
                                <span>Load Older Activity</span>
                                <ChevronDown className="h-6 w-6" />
                            </button>
                        </div>
                    )}
                </section>
            )}

            {activityLogQuery.isFetching && !activityLogQuery.isLoading && (
                <p className="text-xs text-[#666666]">Updating activity log...</p>
            )}
        </div>
    )
}

export default AdminUserActivityLogPanel
