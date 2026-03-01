import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { ChevronRight } from 'lucide-react'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { AdminHeader } from '@/components/layout/AdminHeader'
import { userService } from '@/api/services/user.service'
import {
    adminService,
    type AdminAuditLogItem,
    type AdminAuditLogsResponse,
} from '@/api/services/admin.service'
import type { UserAuthDto } from '@/types/api.types'

const DEFAULT_AVATAR_URL = 'https://api.dicebear.com/7.x/notionists/svg?seed=currentuser'
const PAGE_LIMIT = 7

type AuditLogListState = {
    rows: AdminAuditLogItem[]
    total: number
    page: number
    limit: number
}

const DEFAULT_LIST_STATE: AuditLogListState = {
    rows: [],
    total: 0,
    page: 1,
    limit: PAGE_LIMIT,
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
        const joinedMessage = message.filter((entry) => typeof entry === 'string').join(', ')
        if (joinedMessage.length > 0) return joinedMessage
    }

    return fallback
}

const pageCountFrom = (total: number, limit: number): number => {
    if (limit <= 0) return 1
    return Math.max(1, Math.ceil(total / limit))
}

const pagesRange = (start: number, end: number): number[] => {
    const pages: number[] = []
    for (let currentPage = start; currentPage <= end; currentPage += 1) {
        pages.push(currentPage)
    }
    return pages
}

const formatTimestamp = (value: string): { date: string; time: string } => {
    const parsedDate = new Date(value)
    if (Number.isNaN(parsedDate.getTime())) {
        return {
            date: '--',
            time: '--',
        }
    }

    const date = parsedDate.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
    const time = parsedDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    })

    return { date, time }
}

const statusPillClassName = (status: string): string => {
    const normalizedStatus = status.trim().toUpperCase()
    if (normalizedStatus === 'SUCCESS' || normalizedStatus === 'SUCCEEDED') {
        return 'bg-[rgba(22,163,74,0.2)] text-[#16A34A]'
    }
    if (
        normalizedStatus === 'FAILED' ||
        normalizedStatus === 'FAIL' ||
        normalizedStatus === 'ERROR'
    ) {
        return 'bg-[rgba(220,38,38,0.2)] text-[#DC2626]'
    }
    return 'bg-[rgba(245,158,11,0.2)] text-[#F59E0B]'
}

const statusLabel = (status: string): string => {
    const normalizedStatus = status.trim()
    if (!normalizedStatus) return 'Unknown'

    if (normalizedStatus.toUpperCase() === normalizedStatus) {
        return `${normalizedStatus.charAt(0)}${normalizedStatus.slice(1).toLowerCase()}`
    }

    return normalizedStatus
}

const AuditLogTitleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
    >
        <path
            d="M17.5 5.83329V14.1666C17.5 16.6666 16.25 18.3333 13.3333 18.3333H6.66667C3.75 18.3333 2.5 16.6666 2.5 14.1666V5.83329C2.5 3.33329 3.75 1.66663 6.66667 1.66663H13.3333C16.25 1.66663 17.5 3.33329 17.5 5.83329Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M12.0833 3.75V5.41667C12.0833 6.33333 12.8333 7.08333 13.75 7.08333H15.4167"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M6.66666 10.8334H9.99999"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M6.66666 14.1666H13.3333"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

export const AdminAuditLog: React.FC = () => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    const hasFetchedOnce = useRef(false)
    const [currentUser, setCurrentUser] = useState<UserAuthDto | null>(() => getStoredUser())

    const [page, setPage] = useState(1)
    const [listState, setListState] = useState<AuditLogListState>(DEFAULT_LIST_STATE)
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [reloadCounter, setReloadCounter] = useState(0)

    useEffect(() => {
        let mounted = true

        const fetchAuditLogs = async () => {
            setError(null)
            if (hasFetchedOnce.current) {
                setIsRefreshing(true)
            } else {
                setIsLoading(true)
            }

            try {
                const response: AdminAuditLogsResponse = await adminService.getAuditLogs({
                    page,
                    limit: PAGE_LIMIT,
                })
                if (!mounted) return

                setListState({
                    rows: response.data,
                    total: response.total,
                    page: response.page,
                    limit: response.limit,
                })
            } catch (requestError: unknown) {
                if (!mounted) return
                setError(getErrorMessage(requestError, 'Failed to load audit logs.'))
            } finally {
                if (mounted) {
                    hasFetchedOnce.current = true
                    setIsLoading(false)
                    setIsRefreshing(false)
                }
            }
        }

        fetchAuditLogs()
        return () => {
            mounted = false
        }
    }, [page, reloadCounter])

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

    useEffect(() => {
        const totalPages = pageCountFrom(listState.total, listState.limit)
        if (page > totalPages) setPage(totalPages)
    }, [listState.limit, listState.total, page])

    useEffect(() => {
        if (!isMobileSidebarOpen) {
            document.body.classList.remove('overflow-hidden')
            return
        }

        document.body.classList.add('overflow-hidden')
        return () => document.body.classList.remove('overflow-hidden')
    }, [isMobileSidebarOpen])

    const totalPages = pageCountFrom(listState.total, listState.limit)
    const pageNumbers = useMemo(() => {
        if (totalPages <= 3) return pagesRange(1, totalPages)
        if (page <= 2) return [1, 2, 3]
        if (page >= totalPages - 1) return [totalPages - 2, totalPages - 1, totalPages]
        return [page - 1, page, page + 1]
    }, [page, totalPages])

    const userDisplayName =
        currentUser?.userName?.trim() || currentUser?.email?.split('@')[0] || 'User Name'
    const userDisplayEmail = currentUser?.email || 'user@example.com'
    const userAvatarSrc = currentUser?.image?.trim() || DEFAULT_AVATAR_URL
    const userRoleLabel = currentUser?.role ? currentUser.role.toLowerCase() : 'admin'

    const handleRetry = () => setReloadCounter((counter) => counter + 1)

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

                <main className="space-y-4 px-4 py-4 md:px-6 md:py-6">
                    <section className="space-y-2">
                        <div className="flex items-center gap-2">
                            <AuditLogTitleIcon className="h-6 w-6 text-[#3272A3]" />
                            <h1 className="text-2xl font-semibold text-[#0C0D0F]">Audit Log</h1>
                        </div>
                        <p className="text-base text-[#666666]">
                            Track all administrative actions for transparency and accountability
                        </p>
                    </section>

                    {error && !isLoading && (
                        <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4">
                            <p className="text-sm text-[#B91C1C]">{error}</p>
                            <button
                                type="button"
                                onClick={handleRetry}
                                className="mt-3 rounded-md bg-[#B91C1C] px-3 py-1.5 text-sm text-white"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    <section className="space-y-3">
                        <div className="overflow-x-auto border border-[#F3F4F6]">
                            <table className="min-w-[980px] w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#F9FAFB]">
                                        <th className="h-[62px] border-b border-[#F3F4F6] px-4 text-left text-[18px] font-semibold text-[#666666]">
                                            Timestamp
                                        </th>
                                        <th className="h-[62px] border-b border-[#F3F4F6] px-4 text-left text-[18px] font-semibold text-[#666666]">
                                            Action
                                        </th>
                                        <th className="h-[62px] border-b border-[#F3F4F6] px-4 text-left text-[18px] font-semibold text-[#666666]">
                                            Entity
                                        </th>
                                        <th className="h-[62px] border-b border-[#F3F4F6] px-4 text-left text-[18px] font-semibold text-[#666666]">
                                            Details
                                        </th>
                                        <th className="h-[62px] border-b border-[#F3F4F6] px-4 text-center text-[18px] font-semibold text-[#666666]">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="h-[62px] border-b border-[#F3F4F6] px-4 text-sm text-[#666666]"
                                            >
                                                Loading audit logs...
                                            </td>
                                        </tr>
                                    )}

                                    {!isLoading && listState.rows.length === 0 && !error && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="h-[62px] border-b border-[#F3F4F6] px-4 text-sm text-[#666666]"
                                            >
                                                No audit logs found.
                                            </td>
                                        </tr>
                                    )}

                                    {!isLoading &&
                                        listState.rows.map((logRow) => {
                                            const timestamp = formatTimestamp(logRow.timestamp)
                                            const statusClassName = statusPillClassName(logRow.status)
                                            return (
                                                <tr key={`${logRow.id || logRow.timestamp}-${logRow.action}`}>
                                                    <td className="h-[62px] border-b border-[#F3F4F6] px-4 align-middle text-sm text-[#0C0D0F]">
                                                        <div className="flex flex-col gap-1">
                                                            <span>{timestamp.date}</span>
                                                            <span className="text-[#666666]">{timestamp.time}</span>
                                                        </div>
                                                    </td>
                                                    <td className="h-[62px] border-b border-[#F3F4F6] px-4 align-middle text-sm text-[#0C0D0F]">
                                                        {logRow.action || '--'}
                                                    </td>
                                                    <td className="h-[62px] border-b border-[#F3F4F6] px-4 align-middle text-sm text-[#0C0D0F]">
                                                        {logRow.entity || '--'}
                                                    </td>
                                                    <td className="h-[62px] border-b border-[#F3F4F6] px-4 align-middle text-sm text-[#0C0D0F]">
                                                        {logRow.details || '--'}
                                                    </td>
                                                    <td className="h-[62px] border-b border-[#F3F4F6] px-4 align-middle text-center">
                                                        <span
                                                            className={`inline-flex h-6 items-center rounded-[10px] px-[10px] py-[2px] text-sm ${statusClassName}`}
                                                        >
                                                            {statusLabel(logRow.status)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col gap-3 py-2 sm:flex-row sm:items-center">
                            <div className="text-center sm:text-left sm:flex-1">
                                <p className="text-[16px] text-[#3272A3]">
                                    Page {page} of {totalPages}
                                </p>
                            </div>
                            <div className="flex items-center justify-center gap-2 sm:ml-auto sm:justify-end">
                                {pageNumbers.map((pageNumber) => {
                                    const active = pageNumber === page
                                    return (
                                        <button
                                            key={pageNumber}
                                            type="button"
                                            onClick={() => setPage(pageNumber)}
                                            className={`flex h-8 w-8 items-center justify-center rounded-[30px] border border-[#E5E7EB] text-sm ${active ? 'bg-[rgba(62,143,204,0.2)] text-[#0C0D0F]' : 'bg-white text-[#0C0D0F]'}`}
                                        >
                                            {pageNumber}
                                        </button>
                                    )
                                })}
                                <button
                                    type="button"
                                    onClick={() => setPage((previousPage) => Math.min(previousPage + 1, totalPages))}
                                    disabled={page >= totalPages}
                                    className="flex h-8 w-8 items-center justify-center rounded-[30px] border border-[#E5E7EB] bg-white text-[#0C0D0F] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </section>

                    {isRefreshing && !isLoading && (
                        <p className="text-xs text-[#666666]">Updating audit logs...</p>
                    )}
                </main>
            </div>
        </div>
    )
}

export default AdminAuditLog


