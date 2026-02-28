import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
    CalendarDays,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Download,
    Search,
    SlidersHorizontal,
} from 'lucide-react'
import { useAdminUserSwaps } from '@/hooks/useAdminUserSwaps'
import type {
    AdminSwapDirection,
    AdminSwapStatus,
    AdminUserSwapItem,
    AdminUserSwapsSort,
} from '@/types/adminUsers.types'

const PAGE_LIMIT = 12

const statusOptions: { label: string; value: AdminSwapStatus | 'ALL' }[] = [
    { label: 'All Status', value: 'ALL' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Accepted', value: 'ACCEPTED' },
    { label: 'Declined', value: 'DECLINED' },
    { label: 'Expired', value: 'EXPIRED' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' },
]

const sortOptions: { label: string; value: AdminUserSwapsSort }[] = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
]

const statusPillClassName: Record<AdminSwapStatus, string> = {
    PENDING: 'bg-[#FEF3C7] text-[#F59E0B]',
    ACCEPTED: 'bg-[#D2F7DF] text-[#16A34A]',
    DECLINED: 'bg-[#FEE2E2] text-[#EF4444]',
    EXPIRED: 'bg-[#FFE8C2] text-[#D97706]',
    COMPLETED: 'bg-[#D2F7DF] text-[#16A34A]',
    CANCELLED: 'bg-[#E5E7EB] text-[#6B7280]',
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
            className={`flex h-[18px] w-[18px] items-center justify-center rounded-[6px] border transition-colors ${
                checked ? 'border-[#3272A3] bg-[#3272A3]' : 'border-[#94A3B8] bg-white'
            }`}
        >
            {checked ? <Check className="h-[12px] w-[12px] text-white" /> : null}
        </span>
    </label>
)

const formatStatusLabel = (status: AdminSwapStatus): string =>
    `${status.charAt(0)}${status.slice(1).toLowerCase()}`

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

const toCsvCell = (value: string): string => `"${value.replaceAll('"', '""')}"`

const downloadCsv = (rows: AdminUserSwapItem[], direction: AdminSwapDirection) => {
    const headers = [
        direction === 'SENT' ? 'Receiver' : 'Sender',
        'Status',
        'Request Type',
        'Requested Skill',
        'Offered Skill',
        'Date',
        'Time',
    ]

    const lines = [
        headers.map(toCsvCell).join(','),
        ...rows.map((row) =>
            [
                row.user.userName || 'Unknown User',
                formatStatusLabel(row.status),
                row.requestType || '--',
                row.requestedSkill?.name || '--',
                row.offeredSkill?.name || '____________',
                formatDate(row.dateTime),
                formatTime(row.dateTime),
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
    link.download = `admin-${direction.toLowerCase()}-swaps-${timestamp}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

type AdminUserSwapsTableProps = {
    userId?: string
    direction: AdminSwapDirection
}

export const AdminUserSwapsTable: React.FC<AdminUserSwapsTableProps> = ({ userId, direction }) => {
    const [page, setPage] = useState(1)
    const [searchInput, setSearchInput] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [status, setStatus] = useState<AdminSwapStatus | 'ALL'>('ALL')
    const [sort, setSort] = useState<AdminUserSwapsSort>('newest')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [statusMenuOpen, setStatusMenuOpen] = useState(false)
    const [sortMenuOpen, setSortMenuOpen] = useState(false)
    const [dateMenuOpen, setDateMenuOpen] = useState(false)
    const [selectedSwapIds, setSelectedSwapIds] = useState<string[]>([])

    const statusMenuRef = useRef<HTMLDivElement>(null)
    const sortMenuRef = useRef<HTMLDivElement>(null)
    const dateMenuRef = useRef<HTMLDivElement>(null)

    const swapsQuery = useAdminUserSwaps(userId, {
        page,
        limit: PAGE_LIMIT,
        direction,
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

    const pagination = swapsQuery.data?.pagination
    const totalRows = pagination?.total ?? 0
    const totalPages = Math.max(1, pagination?.totalPages ?? 1)
    const currentPage = pagination?.page ?? page
    const currentLimit = pagination?.limit ?? PAGE_LIMIT

    const filteredRows = useMemo(() => {
        const swapsRows = swapsQuery.data?.data ?? []
        const trimmedSearch = searchValue.trim().toLowerCase()
        if (!trimmedSearch) return swapsRows
        return swapsRows.filter((row) => row.user.userName.toLowerCase().includes(trimmedSearch))
    }, [swapsQuery.data?.data, searchValue])

    const selectedRows = useMemo(
        () => filteredRows.filter((row) => selectedSwapIds.includes(row.id)),
        [filteredRows, selectedSwapIds]
    )

    const isAllRowsChecked =
        filteredRows.length > 0 && filteredRows.every((row) => selectedSwapIds.includes(row.id))

    const shownCount =
        filteredRows.length === 0
            ? 0
            : Math.min(totalRows, (Math.max(1, currentPage) - 1) * currentLimit + filteredRows.length)

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setPage(1)
            setSearchValue(searchInput.trim())
            setSelectedSwapIds([])
        }, 250)

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
            setSelectedSwapIds((previousIds) =>
                previousIds.filter((id) => !filteredRows.some((row) => row.id === id))
            )
            return
        }

        const idsToAdd = filteredRows.map((row) => row.id)
        setSelectedSwapIds((previousIds) => Array.from(new Set([...previousIds, ...idsToAdd])))
    }

    const toggleSingleRow = (rowId: string) => {
        setSelectedSwapIds((previousIds) =>
            previousIds.includes(rowId)
                ? previousIds.filter((id) => id !== rowId)
                : [...previousIds, rowId]
        )
    }

    const onStatusChange = (value: AdminSwapStatus | 'ALL') => {
        setStatus(value)
        setPage(1)
        setSelectedSwapIds([])
        setStatusMenuOpen(false)
    }

    const onSortChange = (value: AdminUserSwapsSort) => {
        setSort(value)
        setPage(1)
        setSelectedSwapIds([])
        setSortMenuOpen(false)
    }

    const applyDateFilter = () => {
        setPage(1)
        setSelectedSwapIds([])
        setDateMenuOpen(false)
    }

    const clearDateFilter = () => {
        setStartDate('')
        setEndDate('')
        setPage(1)
        setSelectedSwapIds([])
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
            <section className="rounded-[12px] border border-[#E5E7EB] bg-white p-4">
                <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center">
                    <div className="relative w-full xl:max-w-[388px]">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9CA3AF]" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            placeholder="Search by name"
                            className="h-10 w-full rounded-[10px] border border-[#E5E7EB] bg-white pl-11 pr-4 text-[16px] text-[#0C0D0F] outline-none placeholder:text-[16px] placeholder:text-[#9CA3AF] focus:border-[#3272A3]"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 xl:ml-auto">
                        <div className="relative" ref={dateMenuRef}>
                            <button
                                type="button"
                                onClick={() => setDateMenuOpen((previous) => !previous)}
                                className="inline-flex h-10 items-center gap-2 rounded-[12px] border border-[#E5E7EB] bg-white px-3 text-[16px] text-[#1C1C1C]"
                            >
                                Date Range
                                <CalendarDays className="h-4 w-4 text-[#0C0D0F]" />
                            </button>

                            {dateMenuOpen && (
                                <div className="absolute right-0 top-12 z-30 w-[280px] rounded-[10px] border border-[#E5E7EB] bg-white p-3 shadow-[0px_0px_4.7px_0px_rgba(0,0,0,0.25)]">
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
                                className="inline-flex h-10 items-center gap-2 rounded-[12px] border border-[#E5E7EB] bg-white px-3 text-[16px] text-[#1C1C1C]"
                            >
                                {statusLabel}
                                <ChevronDown className="h-4 w-4 text-[#1C1C1C]" />
                            </button>

                            {statusMenuOpen && (
                                <div className="absolute right-0 top-12 z-30 w-[164px] rounded-[10px] border border-[#E5E7EB] bg-white p-1 shadow-[0px_0px_4.7px_0px_rgba(0,0,0,0.25)]">
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
                                className="inline-flex h-10 items-center gap-2 rounded-[12px] border border-[#E5E7EB] bg-white px-3 text-[16px] text-[#1C1C1C]"
                            >
                                {sortLabel}
                                <SlidersHorizontal className="h-4 w-4 text-[#0C0D0F]" />
                            </button>

                            {sortMenuOpen && (
                                <div className="absolute right-0 top-12 z-30 w-[124px] rounded-[10px] border border-[#E5E7EB] bg-white p-1 shadow-[0px_0px_4.7px_0px_rgba(0,0,0,0.25)]">
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

                <div className="overflow-x-auto">
                    <table className="min-w-[960px] w-full border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-[#F9FAFB]">
                                <th className="h-[42px] w-[44px] border-b border-[#F3F4F6] px-3 text-left">
                                    <SelectionCheckbox
                                        checked={isAllRowsChecked}
                                        onChange={toggleAllRows}
                                        ariaLabel="Select all swaps"
                                    />
                                </th>
                                <th className="h-[42px] border-b border-[#F3F4F6] px-3 text-left text-[16px] font-semibold text-[#666666]">
                                    {direction === 'SENT' ? 'Receiver' : 'Sender'}
                                </th>
                                <th className="h-[42px] border-b border-[#F3F4F6] px-3 text-left text-[16px] font-semibold text-[#666666]">
                                    Status
                                </th>
                                <th className="h-[42px] border-b border-[#F3F4F6] px-3 text-left text-[16px] font-semibold text-[#666666]">
                                    Request Type
                                </th>
                                <th className="h-[42px] border-b border-[#F3F4F6] px-3 text-left text-[16px] font-semibold text-[#666666]">
                                    Requested Skill
                                </th>
                                <th className="h-[42px] border-b border-[#F3F4F6] px-3 text-left text-[16px] font-semibold text-[#666666]">
                                    Offered Skill
                                </th>
                                <th className="h-[42px] border-b border-[#F3F4F6] px-3 text-left text-[16px] font-semibold text-[#666666]">
                                    Date & Time
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {swapsQuery.isLoading && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="h-[88px] border-b border-[#F3F4F6] px-4 text-center text-sm text-[#666666]"
                                    >
                                        Loading swaps...
                                    </td>
                                </tr>
                            )}

                            {swapsQuery.isError && !swapsQuery.isLoading && (
                                <tr>
                                    <td colSpan={7} className="border-b border-[#F3F4F6] px-4 py-4">
                                        <div className="rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] p-3">
                                            <p className="text-sm text-[#B91C1C]">Failed to load swaps.</p>
                                            <button
                                                type="button"
                                                onClick={() => swapsQuery.refetch()}
                                                className="mt-2 rounded-md bg-[#B91C1C] px-3 py-1.5 text-xs text-white"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!swapsQuery.isLoading && !swapsQuery.isError && filteredRows.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="h-[88px] border-b border-[#F3F4F6] px-4 text-center text-sm text-[#666666]"
                                    >
                                        No swap requests found.
                                    </td>
                                </tr>
                            )}

                            {!swapsQuery.isLoading &&
                                !swapsQuery.isError &&
                                filteredRows.map((swap) => {
                                    const checked = selectedSwapIds.includes(swap.id)
                                    return (
                                        <tr key={swap.id}>
                                            <td className="h-[62px] border-b border-[#F3F4F6] px-3">
                                                <SelectionCheckbox
                                                    checked={checked}
                                                    onChange={() => toggleSingleRow(swap.id)}
                                                    ariaLabel={`Select swap with ${swap.user.userName}`}
                                                />
                                            </td>
                                            <td className="h-[62px] border-b border-[#F3F4F6] px-3">
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={
                                                            swap.user.image ||
                                                            `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(
                                                                swap.user.userName || swap.id
                                                            )}`
                                                        }
                                                        alt={swap.user.userName}
                                                        className="h-5 w-5 rounded-full object-cover"
                                                    />
                                                    <span className="text-[14px] text-[#0C0D0F]">
                                                        {swap.user.userName || 'Unknown User'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="h-[62px] border-b border-[#F3F4F6] px-3">
                                                <span
                                                    className={`inline-flex h-6 items-center rounded-[10px] px-2 text-[13px] ${
                                                        statusPillClassName[swap.status]
                                                    }`}
                                                >
                                                    <span className="mr-1 text-[9px]">●</span>
                                                    {formatStatusLabel(swap.status)}
                                                </span>
                                            </td>
                                            <td className="h-[62px] border-b border-[#F3F4F6] px-3 text-[14px] text-[#0C0D0F]">
                                                {swap.requestType || '--'}
                                            </td>
                                            <td className="h-[62px] border-b border-[#F3F4F6] px-3 text-[14px] text-[#0C0D0F]">
                                                {swap.requestedSkill?.name || '--'}
                                            </td>
                                            <td className="h-[62px] border-b border-[#F3F4F6] px-3 text-[14px] text-[#0C0D0F]">
                                                {swap.offeredSkill?.name || '____________'}
                                            </td>
                                            <td className="h-[62px] border-b border-[#F3F4F6] px-3">
                                                <div className="flex flex-col">
                                                    <span className="text-[14px] text-[#0C0D0F]">
                                                        {formatDate(swap.dateTime)}
                                                    </span>
                                                    <span className="text-[13px] text-[#666666]">
                                                        {formatTime(swap.dateTime)}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
                    <div className="text-[16px] text-[#3272A3]">
                        Showing {shownCount} of {totalRows}
                    </div>
                    <div className="flex items-center gap-2 sm:ml-auto">
                        <button
                            type="button"
                            onClick={() => setPage((previousPage) => Math.max(1, previousPage - 1))}
                            disabled={currentPage <= 1}
                            className="flex h-8 w-8 items-center justify-center rounded-[30px] border border-[#E5E7EB] bg-white text-[#0C0D0F] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        {Array.from({ length: Math.min(totalPages, 3) }).map((_, index) => {
                            let pageNumber = index + 1
                            if (currentPage > 2 && totalPages > 3) {
                                pageNumber = Math.min(totalPages - 2 + index, totalPages)
                            }

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
                <section className="rounded-[50px] border border-[#3272A3] bg-[#F7FAFF] p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                        <div className="flex flex-1 items-center gap-2 text-[#3272A3]">
                            <div className="flex h-[21px] w-[21px] items-center justify-center rounded-[6px] bg-[#3272A3]">
                                <Check className="h-3.5 w-3.5 text-white" />
                            </div>
                            <p className="text-[16px]">{selectedRows.length} Sessions selected</p>
                        </div>

                        <div className="flex items-center justify-end">
                            <button
                                type="button"
                                onClick={() => downloadCsv(selectedRows, direction)}
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
                </section>
            )}
        </div>
    )
}

export default AdminUserSwapsTable
