import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
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
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { AdminHeader } from '@/components/layout/AdminHeader'
import { userService } from '@/api/services/user.service'
import { useAdminSessions, useExportAdminSessionsCsv } from '@/hooks/useAdminSessions'
import type {
    AdminSessionItem,
    AdminSessionParticipant,
    AdminSessionStatus,
    AdminSessionsSort,
} from '@/types/adminSessions.types'
import type { UserAuthDto } from '@/types/api.types'

const DEFAULT_AVATAR_URL = 'https://api.dicebear.com/7.x/notionists/svg?seed=currentuser'
const PAGE_LIMIT = 10

const statusOptions: { label: string; value: AdminSessionStatus | 'ALL' }[] = [
    { label: 'All Status', value: 'ALL' },
    { label: 'Scheduled', value: 'SCHEDULED' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' },
    { label: 'Rescheduled', value: 'RESCHEDULED' },
    { label: 'Disputed', value: 'DISPUTED' },
]

const sortOptions: { label: string; value: AdminSessionsSort }[] = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
]

const statusPillClassName: Record<AdminSessionStatus, string> = {
    SCHEDULED: 'bg-[#E8F1FA] text-[#3272A3]',
    COMPLETED: 'bg-[#D2F7DF] text-[#16A34A]',
    CANCELLED: 'bg-[#FECACA] text-[#EF4444]',
    RESCHEDULED: 'bg-[#FFE8C2] text-[#F59E0B]',
    DISPUTED: 'bg-[#FFE8C2] text-[#F59E0B]',
}

const getStoredUser = (): UserAuthDto | null => {
    try {
        const rawUser = localStorage.getItem('user')
        if (!rawUser) return null
        return JSON.parse(rawUser) as UserAuthDto
    } catch {
        return null
    }
}

const getErrorMessage = (error: unknown, fallback: string): string => {
    if (!axios.isAxiosError(error)) return fallback
    const message = error.response?.data?.message

    if (typeof message === 'string' && message.trim().length > 0) return message
    if (Array.isArray(message)) {
        const joinedMessage = message.filter((item) => typeof item === 'string').join(', ')
        if (joinedMessage.length > 0) return joinedMessage
    }

    return fallback
}

const toStatusLabel = (status: AdminSessionStatus): string => {
    if (status === 'COMPLETED') return 'Completed'
    if (status === 'CANCELLED') return 'Canceled'
    if (status === 'RESCHEDULED') return 'Rescheduled'
    if (status === 'DISPUTED') return 'Disputed'
    return 'Scheduled'
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

const formatSessionId = (value: string): string => {
    const normalized = value.trim()
    if (!normalized) return '--'
    if (normalized.startsWith('#')) return normalized
    if (/^\d+$/.test(normalized)) return `#${normalized}`
    if (normalized.length <= 8) return `#${normalized}`
    return `#${normalized.slice(-4)}`
}

const formatDuration = (session: AdminSessionItem): string => {
    if (typeof session.duration === 'number' && Number.isFinite(session.duration) && session.duration > 0) {
        return `${Math.round(session.duration)} min`
    }

    const start = new Date(session.scheduledAt).getTime()
    const end = new Date(session.endsAt).getTime()
    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return '--'

    const durationInMinutes = Math.round((end - start) / 60000)
    if (durationInMinutes <= 0) return '--'
    return `${durationInMinutes} min`
}

const formatSkills = (value: string): string[] => {
    const lines = value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
    return lines.length > 0 ? lines : ['--']
}

const downloadBlob = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
}

const pageRange = (start: number, end: number): number[] => {
    const pages: number[] = []
    for (let current = start; current <= end; current += 1) {
        pages.push(current)
    }
    return pages
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

type SummaryCardProps = {
    label: string
    value: number
    icon: React.ReactNode
    iconContainerClassName: string
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, icon, iconContainerClassName }) => (
    <article className="flex min-h-[80px] items-center justify-between rounded-[10px] border border-[#E5E7EB] bg-white p-4">
        <div className="min-w-0">
            <p className="text-[12px] leading-[16.8px] text-[#808191]">{label}</p>
            <p className="text-[30px] font-semibold leading-[33px] text-[#0C0D0F]">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-[4px] ${iconContainerClassName}`}>
            {icon}
        </div>
    </article>
)

const SessionsTitleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
    >
        <path
            d="M18.3333 12.5V7.5C18.3333 3.33333 16.6667 1.66667 12.5 1.66667H7.5C3.33333 1.66667 1.66667 3.33333 1.66667 7.5V12.5C1.66667 16.6667 3.33333 18.3333 7.5 18.3333H12.5C16.6667 18.3333 18.3333 16.6667 18.3333 12.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M2.1 5.925H17.9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M7.1 1.75833V5.80833"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M12.9 1.75833V5.43333"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M8.125 12.0417V11.0417C8.125 9.75833 9.03333 9.23333 10.1417 9.875L11.0083 10.375L11.875 10.875C12.9833 11.5167 12.9833 12.5667 11.875 13.2083L11.0083 13.7083L10.1417 14.2083C9.03333 14.85 8.125 14.325 8.125 13.0417V12.0417Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

const CompletedSessionsIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
            d="M8.5 2.5V5M15.5 2.5V5M3.5 9H20.5M6.75 14.5L10 17.75L17.25 10.5M7.7 21.5H16.3C18.6202 21.5 19.7803 21.5 20.666 20.9484C21.1615 20.6397 21.5794 20.2218 21.8881 19.7263C22.4397 18.8406 22.4397 17.6805 22.4397 15.3603V9.2C22.4397 6.87978 22.4397 5.71967 21.8881 4.83399C21.5794 4.33847 21.1615 3.92058 20.666 3.61186C19.7803 3.0603 18.6202 3.0603 16.3 3.0603H7.7C5.37978 3.0603 4.21967 3.0603 3.33399 3.61186C2.83847 3.92058 2.42058 4.33847 2.11186 4.83399C1.5603 5.71967 1.5603 6.87978 1.5603 9.2V15.3603C1.5603 17.6805 1.5603 18.8406 2.11186 19.7263C2.42058 20.2218 2.83847 20.6397 3.33399 20.9484C4.21967 21.5 5.37978 21.5 7.7 21.5Z"
            stroke="#16A34A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

const CancelledSessionsIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
            d="M8 8L16 16M16 8L8 16M9 2H15C18.7712 2 20.6569 2 21.8284 3.17157C23 4.34315 23 6.22876 23 10V14C23 17.7712 23 19.6569 21.8284 20.8284C20.6569 22 18.7712 22 15 22H9C5.22876 22 3.34315 22 2.17157 20.8284C1 19.6569 1 17.7712 1 14V10C1 6.22876 1 4.34315 2.17157 3.17157C3.34315 2 5.22876 2 9 2Z"
            stroke="#EF4444"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

const DisputedSessionsIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
            d="M15.5 22H8.5C4.5 22 3 20.5 3 16.5V9.5C3 5.5 4.5 4 8.5 4H15.5C19.5 4 21 5.5 21 9.5V16.5C21 20.5 19.5 22 15.5 22Z"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M8.5 4V3C8.5 1.9 9.4 1 10.5 1H13.5C14.6 1 15.5 1.9 15.5 3V4"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M9 13L11 15L15 11"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

const ParticipantCell: React.FC<{ participant: AdminSessionParticipant }> = ({ participant }) => (
    <div className="flex items-center gap-2">
        {participant.image ? (
            <img
                src={participant.image}
                alt={participant.userName}
                className="h-6 w-6 rounded-full object-cover"
            />
        ) : (
            <span className="h-5 w-5 rounded-full bg-[#D4D4D4]" aria-hidden="true" />
        )}
        <span className="truncate text-[14px] text-[#0C0D0F]">{participant.userName || '--'}</span>
    </div>
)

export const AdminSessions: React.FC = () => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState<UserAuthDto | null>(() => getStoredUser())

    const [page, setPage] = useState(1)
    const [searchInput, setSearchInput] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [status, setStatus] = useState<AdminSessionStatus | 'ALL'>('ALL')
    const [sort, setSort] = useState<AdminSessionsSort>('newest')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [draftStartDate, setDraftStartDate] = useState('')
    const [draftEndDate, setDraftEndDate] = useState('')
    const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([])
    const [statusMenuOpen, setStatusMenuOpen] = useState(false)
    const [sortMenuOpen, setSortMenuOpen] = useState(false)
    const [dateMenuOpen, setDateMenuOpen] = useState(false)
    const [exportError, setExportError] = useState<string | null>(null)

    const statusMenuRef = useRef<HTMLDivElement>(null)
    const sortMenuRef = useRef<HTMLDivElement>(null)
    const dateMenuRef = useRef<HTMLDivElement>(null)

    const sessionsQuery = useAdminSessions({
        page,
        limit: PAGE_LIMIT,
        search: searchValue || undefined,
        status: status === 'ALL' ? undefined : status,
        sort,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
    })

    const exportMutation = useExportAdminSessionsCsv()

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
    const summary = sessionsQuery.data?.summary ?? { completed: 0, cancelled: 0, disputed: 0 }

    const totalRows = pagination?.total ?? rows.length
    const currentPage = pagination?.page ?? page
    const currentLimit = pagination?.limit ?? PAGE_LIMIT
    const totalPages = Math.max(1, pagination?.totalPages ?? 1)
    const shownCount =
        rows.length === 0
            ? 0
            : Math.min(totalRows, (Math.max(1, currentPage) - 1) * currentLimit + rows.length)

    const pageNumbers = useMemo(() => {
        if (totalPages <= 3) return pageRange(1, totalPages)
        if (currentPage <= 2) return [1, 2, 3]
        if (currentPage >= totalPages - 1) return [totalPages - 2, totalPages - 1, totalPages]
        return [currentPage - 1, currentPage, currentPage + 1]
    }, [currentPage, totalPages])

    const isAllRowsChecked =
        rows.length > 0 && rows.every((session) => selectedSessionIds.includes(session.id))

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setSearchValue(searchInput.trim())
            setPage(1)
            setSelectedSessionIds([])
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

    useEffect(() => {
        if (!isMobileSidebarOpen) {
            document.body.classList.remove('overflow-hidden')
            return
        }

        document.body.classList.add('overflow-hidden')
        return () => document.body.classList.remove('overflow-hidden')
    }, [isMobileSidebarOpen])

    useEffect(() => {
        let mounted = true

        const loadCurrentUser = async () => {
            const storedUser = getStoredUser()
            if (storedUser && mounted) {
                setCurrentUser(storedUser)
            }

            try {
                const response = await userService.getCurrentProfile()
                if (!mounted || !response.success) return

                const updatedUser: UserAuthDto = {
                    id: response.data.id,
                    userName: response.data.userName || storedUser?.userName || null,
                    email: response.data.email || storedUser?.email || '',
                    role: storedUser?.role || 'USER',
                    image: response.data.image ?? null,
                    isActive: storedUser?.isActive ?? true,
                    isVerified: storedUser?.isVerified ?? true,
                }

                setCurrentUser(updatedUser)
                localStorage.setItem('user', JSON.stringify(updatedUser))
            } catch {
                // Keep cached user if profile request fails.
            }
        }

        loadCurrentUser()
        return () => {
            mounted = false
        }
    }, [])

    const userDisplayName =
        currentUser?.userName?.trim() || currentUser?.email?.split('@')[0] || 'User Name'
    const userDisplayEmail = currentUser?.email || 'user@example.com'
    const userAvatarSrc = currentUser?.image?.trim() || DEFAULT_AVATAR_URL
    const userRoleLabel = currentUser?.role ? currentUser.role.toLowerCase() : 'admin'

    const toggleAllRows = () => {
        if (isAllRowsChecked) {
            setSelectedSessionIds((previous) =>
                previous.filter((id) => !rows.some((row) => row.id === id))
            )
            return
        }

        const idsToAdd = rows.map((session) => session.id)
        setSelectedSessionIds((previous) => Array.from(new Set([...previous, ...idsToAdd])))
    }

    const toggleSingleRow = (sessionId: string) => {
        setSelectedSessionIds((previous) =>
            previous.includes(sessionId)
                ? previous.filter((id) => id !== sessionId)
                : [...previous, sessionId]
        )
    }

    const onStatusChange = (value: AdminSessionStatus | 'ALL') => {
        setStatus(value)
        setPage(1)
        setSelectedSessionIds([])
        setStatusMenuOpen(false)
    }

    const onSortChange = (value: AdminSessionsSort) => {
        setSort(value)
        setPage(1)
        setSelectedSessionIds([])
        setSortMenuOpen(false)
    }

    const applyDateFilter = () => {
        setStartDate(draftStartDate)
        setEndDate(draftEndDate)
        setPage(1)
        setSelectedSessionIds([])
        setDateMenuOpen(false)
    }

    const clearDateFilter = () => {
        setDraftStartDate('')
        setDraftEndDate('')
        setStartDate('')
        setEndDate('')
        setPage(1)
        setSelectedSessionIds([])
        setDateMenuOpen(false)
    }

    const handleExport = async () => {
        if (selectedSessionIds.length === 0 || exportMutation.isPending) return

        setExportError(null)

        try {
            const result = await exportMutation.mutateAsync({ sessionIds: selectedSessionIds })
            downloadBlob(result.blob, result.fileName)
        } catch (error: unknown) {
            setExportError(getErrorMessage(error, 'Failed to export selected sessions.'))
        }
    }

    const renderRow = (session: AdminSessionItem) => {
        const checked = selectedSessionIds.includes(session.id)
        const skills = formatSkills(session.skillName)

        return (
            <tr key={session.id}>
                <td className="h-[62px] border-b border-[#F3F4F6] px-4">
                    <SelectionCheckbox
                        checked={checked}
                        onChange={() => toggleSingleRow(session.id)}
                        ariaLabel={`Select session ${session.id}`}
                    />
                </td>
                <td className="h-[62px] border-b border-[#F3F4F6] px-4 text-[14px] text-[#0C0D0F]">
                    {formatSessionId(session.id)}
                </td>
                <td className="h-[62px] border-b border-[#F3F4F6] px-4">
                    <div className="flex flex-col gap-[2px]">
                        <span className="text-[14px] text-[#0C0D0F]">{formatDate(session.scheduledAt)}</span>
                        <span className="text-[13px] text-[#666666]">{formatTime(session.scheduledAt)}</span>
                    </div>
                </td>
                <td className="h-[62px] border-b border-[#F3F4F6] px-4">
                    <span
                        className={`inline-flex h-[23px] items-center rounded-[8px] px-2 text-[14px] ${statusPillClassName[session.status]}`}
                    >
                        <span className="mr-1 text-[8px] leading-none">●</span>
                        {toStatusLabel(session.status)}
                    </span>
                </td>
                <td className="h-[62px] border-b border-[#F3F4F6] px-4 text-[14px] text-[#0C0D0F]">
                    <div className="flex flex-col leading-[18px]">
                        {skills.slice(0, 2).map((skillLine, index) => (
                            <span key={`${session.id}-skill-${index}`}>{skillLine}</span>
                        ))}
                    </div>
                </td>
                <td className="h-[62px] border-b border-[#F3F4F6] px-4">
                    <ParticipantCell participant={session.host} />
                </td>
                <td className="h-[62px] border-b border-[#F3F4F6] px-4">
                    <ParticipantCell participant={session.attendee} />
                </td>
                <td className="h-[62px] border-b border-[#F3F4F6] px-4 text-[14px] text-[#0C0D0F]">
                    {formatDuration(session)}
                </td>
            </tr>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <AdminSidebar
                mobileOpen={isMobileSidebarOpen}
                onMobileClose={() => setIsMobileSidebarOpen(false)}
            />

            <div className="md:ml-[236px]">
                <AdminHeader
                    onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
                    userName={userDisplayName}
                    userEmail={userDisplayEmail}
                    userRole={userRoleLabel}
                    userAvatar={userAvatarSrc}
                />

                <main className="space-y-4 px-4 py-4 md:px-2 md:py-4">
                    <section className="flex items-center gap-2">
                        <SessionsTitleIcon className="h-6 w-6 text-[#3272A3]" />
                        <h1 className="text-[38px] font-bold leading-[34px] text-[#0C0D0F]">Sessions</h1>
                    </section>

                    <section className="grid gap-4 lg:grid-cols-3">
                        <SummaryCard
                            label="Completed Sessions(this week)"
                            value={summary.completed}
                            icon={<CompletedSessionsIcon />}
                            iconContainerClassName="bg-[#F0FFF6]"
                        />
                        <SummaryCard
                            label="Canceled Sessions"
                            value={summary.cancelled}
                            icon={<CancelledSessionsIcon />}
                            iconContainerClassName="bg-[#FFEAEA]"
                        />
                        <SummaryCard
                            label="Disputed(this week)"
                            value={summary.disputed}
                            icon={<DisputedSessionsIcon />}
                            iconContainerClassName="bg-[#FFF8E7]"
                        />
                    </section>

                    <section className="space-y-0 overflow-hidden rounded-[10px] border border-[#F3F4F6] bg-white">
                        <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
                            <div className="relative w-full lg:max-w-[566px]">
                                <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-[#9CA3AF]" />
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(event) => setSearchInput(event.target.value)}
                                    placeholder="Search by name or email"
                                    className="h-12 w-full rounded-[10px] border border-[#E5E7EB] bg-white pl-12 pr-4 text-[16px] text-[#0C0D0F] outline-none placeholder:text-[#9CA3AF] focus:border-[#3272A3]"
                                />
                            </div>

                            <div className="flex w-full flex-wrap items-center justify-end gap-2 lg:max-w-[566px] lg:ml-auto">
                                <div className="relative" ref={dateMenuRef}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setDateMenuOpen((previous) => {
                                                const next = !previous
                                                if (next) {
                                                    setDraftStartDate(startDate)
                                                    setDraftEndDate(endDate)
                                                }
                                                return next
                                            })
                                        }
                                        className="inline-flex h-12 items-center gap-2 rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-[16px] text-[#1C1C1C]"
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
                                                        value={draftStartDate}
                                                        onChange={(event) => setDraftStartDate(event.target.value)}
                                                        className="mt-1 h-9 w-full rounded-[8px] border border-[#E5E7EB] px-2 text-sm text-[#0C0D0F] outline-none focus:border-[#3272A3]"
                                                    />
                                                </label>
                                                <label className="block text-xs text-[#666666]">
                                                    End date
                                                    <input
                                                        type="date"
                                                        value={draftEndDate}
                                                        min={draftStartDate || undefined}
                                                        onChange={(event) => setDraftEndDate(event.target.value)}
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
                                        className="inline-flex h-12 items-center gap-2 rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-[16px] text-[#1C1C1C]"
                                    >
                                        {statusLabel}
                                        <ChevronDown className="h-5 w-5 text-[#1C1C1C]" />
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
                                        className="inline-flex h-12 items-center gap-2 rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-[16px] text-[#1C1C1C]"
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

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1140px] border-separate border-spacing-0">
                                <thead>
                                    <tr className="bg-[#F9FAFB]">
                                        <th className="h-[62px] w-[56px] border-b border-[#F3F4F6] px-4 text-left">
                                            <SelectionCheckbox
                                                checked={isAllRowsChecked}
                                                onChange={toggleAllRows}
                                                ariaLabel="Select all sessions"
                                            />
                                        </th>
                                        <th className="h-[62px] w-[112px] border-b border-[#F3F4F6] px-4 text-left text-[16px] font-semibold text-[#666666]">
                                            Session ID
                                        </th>
                                        <th className="h-[62px] w-[126px] border-b border-[#F3F4F6] px-4 text-left text-[16px] font-semibold text-[#666666]">
                                            Date &amp; Time
                                        </th>
                                        <th className="h-[62px] w-[112px] border-b border-[#F3F4F6] px-4 text-left text-[16px] font-semibold text-[#666666]">
                                            Status
                                        </th>
                                        <th className="h-[62px] w-[112px] border-b border-[#F3F4F6] px-4 text-left text-[16px] font-semibold text-[#666666]">
                                            Skills
                                        </th>
                                        <th className="h-[62px] w-[154px] border-b border-[#F3F4F6] px-4 text-left text-[16px] font-semibold text-[#666666]">
                                            Person 1
                                        </th>
                                        <th className="h-[62px] w-[154px] border-b border-[#F3F4F6] px-4 text-left text-[16px] font-semibold text-[#666666]">
                                            Person 2
                                        </th>
                                        <th className="h-[62px] w-[107px] border-b border-[#F3F4F6] px-4 text-left text-[16px] font-semibold text-[#666666]">
                                            Duration
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessionsQuery.isLoading && (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="h-[88px] border-b border-[#F3F4F6] px-4 text-center text-sm text-[#666666]"
                                            >
                                                Loading sessions...
                                            </td>
                                        </tr>
                                    )}

                                    {sessionsQuery.isError && !sessionsQuery.isLoading && (
                                        <tr>
                                            <td colSpan={8} className="border-b border-[#F3F4F6] px-4 py-4">
                                                <div className="rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] p-3">
                                                    <p className="text-sm text-[#B91C1C]">
                                                        Failed to load sessions.
                                                    </p>
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

                                    {!sessionsQuery.isLoading &&
                                        !sessionsQuery.isError &&
                                        rows.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={8}
                                                    className="h-[88px] border-b border-[#F3F4F6] px-4 text-center text-sm text-[#666666]"
                                                >
                                                    No sessions found.
                                                </td>
                                            </tr>
                                        )}

                                    {!sessionsQuery.isLoading &&
                                        !sessionsQuery.isError &&
                                        rows.map((session) => renderRow(session))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center">
                            <div className="text-[16px] text-[#3272A3]">
                                Showing {shownCount} of {totalRows}
                            </div>

                            <div className="flex items-center gap-2 sm:ml-auto">
                                <button
                                    type="button"
                                    onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                                    disabled={!pagination?.hasPrevPage && currentPage <= 1}
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
                                    onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
                                    disabled={!pagination?.hasNextPage && currentPage >= totalPages}
                                    className="flex h-8 w-8 items-center justify-center rounded-[30px] border border-[#E5E7EB] bg-white text-[#0C0D0F] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </section>

                    {sessionsQuery.isFetching && !sessionsQuery.isLoading && (
                        <p className="text-xs text-[#666666]">Updating sessions list...</p>
                    )}

                    {selectedSessionIds.length > 0 && (
                        <section className="md:px-10">
                            <div className="flex flex-col gap-3 rounded-[50px] border border-[#3272A3] bg-[#F7FAFF] p-4 lg:flex-row lg:items-center">
                                <div className="flex flex-1 items-center gap-2 text-[#3272A3]">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#3272A3]">
                                        <Check className="h-4 w-4 text-white" />
                                    </div>
                                    <p className="text-[16px]">{selectedSessionIds.length} Sessions selected</p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleExport}
                                    disabled={exportMutation.isPending}
                                    className="inline-flex h-10 items-center justify-center gap-1 self-end rounded-[30px] px-4 text-[14px] text-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-70 lg:self-auto"
                                    style={{
                                        backgroundImage:
                                            'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(62, 143, 204) 0%, rgb(62, 143, 204) 100%)',
                                    }}
                                >
                                    {exportMutation.isPending ? 'Exporting...' : 'Export'}
                                    <Download className="h-[18px] w-[18px]" />
                                </button>
                            </div>

                            {exportError && <p className="mt-2 text-sm text-[#B91C1C]">{exportError}</p>}
                        </section>
                    )}
                </main>
            </div>
        </div>
    )
}

export default AdminSessions
