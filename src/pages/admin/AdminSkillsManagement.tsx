import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { ChevronDown, ChevronRight, Menu, MoreVertical, Search, TriangleAlert, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import Avatar from '@/components/Avatar/Avatar'
import { authService } from '@/api/services/auth.service'
import { userService } from '@/api/services/user.service'
import {
    adminService,
    type AdminSkillDetails,
    type AdminSkillRow,
    type AdminSkillSort,
    type GetAdminSkillsParams,
} from '@/api/services/admin.service'
import type { UserAuthDto } from '@/types/api.types'

const DEFAULT_AVATAR_URL = 'https://api.dicebear.com/7.x/notionists/svg?seed=currentuser'
const PAGE_LIMIT = 8

type SkillsListState = {
    rows: AdminSkillRow[]
    total: number
    page: number
    limit: number
}

const DEFAULT_LIST_STATE: SkillsListState = {
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

const textValue = (value: unknown): string => {
    if (typeof value === 'string') return value
    if (typeof value === 'number') return String(value)
    return ''
}

const imageUrlFromUnknown = (value: unknown): string | null => {
    if (typeof value === 'string') return value
    if (!value || typeof value !== 'object') return null

    const rawImage = value as Record<string, unknown>
    const resolvedValue = rawImage.url ?? rawImage.secure_url ?? rawImage.path
    return typeof resolvedValue === 'string' ? resolvedValue : null
}

const formatIsoDate = (value: string): string => {
    const parsedDate = new Date(value)
    if (Number.isNaN(parsedDate.getTime())) return '--'
    return parsedDate.toISOString().slice(0, 10)
}

const providerName = (skillRow: AdminSkillRow): string => {
    const name = skillRow.provider?.userName?.trim()
    if (name && name.length > 0) return name
    return 'Unknown Provider'
}

const providerImage = (skillRow: AdminSkillRow): string | null => imageUrlFromUnknown(skillRow.provider?.image)

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

const skillInitial = (skillName: string): string => {
    const normalized = skillName.trim()
    if (normalized.length === 0) return 'S'
    return normalized[0].toUpperCase()
}

const SortOrderIcon: React.FC<{ sort: AdminSkillSort }> = ({ sort }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={`transition-transform ${sort === 'oldest' ? 'rotate-180' : ''}`}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.99994 3.25C6.41416 3.25 6.74994 3.58579 6.74994 4V19.1895L7.96967 17.9697C8.26256 17.6768 8.73732 17.6768 9.03022 17.9697C9.32311 18.2626 9.32311 18.7374 9.03022 19.0303L6.53022 21.5303C6.23732 21.8232 5.76256 21.8232 5.46967 21.5303L2.96967 19.0303C2.67678 18.7374 2.67678 18.2626 2.96967 17.9697C3.26256 17.6768 3.73732 17.6768 4.03022 17.9697L5.24994 19.1895V4C5.24994 3.58579 5.58573 3.25 5.99994 3.25ZM15.4999 15.25C15.9142 15.25 16.2499 15.5858 16.2499 16C16.2499 16.4142 15.9142 16.75 15.4999 16.75H14.4999C14.0857 16.75 13.7499 16.4142 13.7499 16C13.7499 15.5858 14.0857 15.25 14.4999 15.25H15.4999ZM17.4999 11.25C17.9142 11.25 18.2499 11.5858 18.2499 12C18.2499 12.4142 17.9142 12.75 17.4999 12.75H12.4999C12.0857 12.75 11.7499 12.4142 11.7499 12C11.7499 11.5858 12.0857 11.25 12.4999 11.25H17.4999ZM19.4999 7.25C19.9142 7.25 20.2499 7.58579 20.2499 8C20.2499 8.41421 19.9142 8.75 19.4999 8.75H11.4999C11.0857 8.75 10.7499 8.41421 10.7499 8C10.7499 7.58579 11.0857 7.25 11.4999 7.25H19.4999ZM20.4999 3.25C20.9142 3.25 21.2499 3.58579 21.2499 4C21.2499 4.41421 20.9142 4.75 20.4999 4.75H10.4999C10.0857 4.75 9.74994 4.41421 9.74994 4C9.74994 3.58579 10.0857 3.25 10.4999 3.25H20.4999Z"
            fill="#0C0D0F"
        />
    </svg>
)

export const AdminSkillsManagement: React.FC = () => {
    const navigate = useNavigate()
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

    const [currentUser, setCurrentUser] = useState<UserAuthDto | null>(() => getStoredUser())
    const [profileMenuOpen, setProfileMenuOpen] = useState(false)
    const profileMenuRef = useRef<HTMLDivElement>(null)

    const [searchInput, setSearchInput] = useState('')
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState<AdminSkillSort>('newest')
    const [sortMenuOpen, setSortMenuOpen] = useState(false)
    const sortMenuRef = useRef<HTMLDivElement>(null)

    const [page, setPage] = useState(1)
    const [skillsState, setSkillsState] = useState<SkillsListState>(DEFAULT_LIST_STATE)
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [reloadCounter, setReloadCounter] = useState(0)

    const [activeActionSkillId, setActiveActionSkillId] = useState<string | null>(null)

    const [detailsModalOpen, setDetailsModalOpen] = useState(false)
    const [detailsSkillId, setDetailsSkillId] = useState<string | null>(null)
    const [detailsData, setDetailsData] = useState<AdminSkillDetails | null>(null)
    const [detailsLoading, setDetailsLoading] = useState(false)
    const [detailsError, setDetailsError] = useState<string | null>(null)

    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setPage(1)
            setSearch(searchInput.trim())
        }, 350)

        return () => window.clearTimeout(timeoutId)
    }, [searchInput])

    useEffect(() => {
        let mounted = true

        const fetchSkills = async () => {
            setError(null)
            if (isLoading) setIsLoading(true)
            else setIsRefreshing(true)

            try {
                const params: GetAdminSkillsParams = {
                    page,
                    limit: PAGE_LIMIT,
                    search: search || undefined,
                    sort,
                }
                const response = await adminService.getSkills(params)
                if (!mounted) return

                setSkillsState({
                    rows: response.data,
                    total: response.total,
                    page: response.page,
                    limit: response.limit,
                })
            } catch (requestError: unknown) {
                if (!mounted) return
                setError(getErrorMessage(requestError, 'Failed to load skills management data.'))
            } finally {
                if (mounted) {
                    setIsLoading(false)
                    setIsRefreshing(false)
                }
            }
        }

        fetchSkills()
        return () => {
            mounted = false
        }
    }, [isLoading, page, reloadCounter, search, sort])

    useEffect(() => {
        let mounted = true

        const loadCurrentUser = async () => {
            const storedUser = getStoredUser()
            if (storedUser && mounted) setCurrentUser(storedUser)

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
        if (!detailsModalOpen || !detailsSkillId) return

        let mounted = true
        setDetailsLoading(true)
        setDetailsError(null)

        adminService
            .getSkillDetails(detailsSkillId)
            .then((data) => {
                if (!mounted) return
                setDetailsData(data)
            })
            .catch((requestError: unknown) => {
                if (!mounted) return
                setDetailsError(getErrorMessage(requestError, 'Failed to load skill details.'))
            })
            .finally(() => {
                if (mounted) {
                    setDetailsLoading(false)
                }
            })

        return () => {
            mounted = false
        }
    }, [detailsModalOpen, detailsSkillId])

    useEffect(() => {
        const totalPages = pageCountFrom(skillsState.total, skillsState.limit)
        if (page > totalPages) setPage(totalPages)
    }, [page, skillsState.limit, skillsState.total])

    useEffect(() => {
        if (!isMobileSidebarOpen) {
            document.body.classList.remove('overflow-hidden')
            return
        }

        document.body.classList.add('overflow-hidden')
        return () => document.body.classList.remove('overflow-hidden')
    }, [isMobileSidebarOpen])

    useEffect(() => {
        if (!(detailsModalOpen || deleteModalOpen)) return

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = previousOverflow
        }
    }, [deleteModalOpen, detailsModalOpen])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node

            if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
                setProfileMenuOpen(false)
            }
            if (sortMenuRef.current && !sortMenuRef.current.contains(target)) {
                setSortMenuOpen(false)
            }
            const targetElement = event.target as Element | null
            if (!targetElement?.closest('[data-actions-menu-root]')) {
                setActiveActionSkillId(null)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const totalPages = pageCountFrom(skillsState.total, skillsState.limit)
    const pageNumbers = useMemo(() => {
        if (totalPages <= 3) return pagesRange(1, totalPages)
        if (page <= 2) return [1, 2, 3]
        if (page >= totalPages - 1) return [totalPages - 2, totalPages - 1, totalPages]
        return [page - 1, page, page + 1]
    }, [page, totalPages])

    const userDisplayName =
        currentUser?.userName?.trim() || currentUser?.email?.split('@')[0] || 'User Name'
    const userAvatar = currentUser?.image?.trim() || DEFAULT_AVATAR_URL
    const userRole = currentUser?.role ? currentUser.role.toLowerCase() : 'admin'

    const detailsProviderName = detailsData?.provider?.userName?.trim() || 'Unknown Provider'
    const detailsProviderImage = imageUrlFromUnknown(detailsData?.provider?.image)
    const detailsProviderBio = textValue(detailsData?.provider?.bio).trim() || 'No bio available'
    const detailsLevel = textValue(detailsData?.provider?.level).trim() || 'N/A'
    const detailsLanguage = textValue(detailsData?.language).trim() || 'N/A'
    const detailsDurationRaw = detailsData?.provider?.sessionDuration
    const detailsDuration =
        typeof detailsDurationRaw === 'number'
            ? `${detailsDurationRaw} min`
            : textValue(detailsDurationRaw).trim() || 'N/A'
    const detailsDescription = textValue(detailsData?.description).trim() || 'No description provided.'

    const openDetails = (skillId: string) => {
        setActiveActionSkillId(null)
        setDetailsSkillId(skillId)
        setDetailsData(null)
        setDetailsError(null)
        setDetailsModalOpen(true)
    }

    const closeDetails = () => {
        setDetailsModalOpen(false)
        setDetailsSkillId(null)
        setDetailsData(null)
        setDetailsError(null)
    }

    const openDelete = (id: string, name: string) => {
        setActiveActionSkillId(null)
        setDeleteError(null)
        setDeleteTarget({ id, name })
        setDeleteModalOpen(true)
    }

    const closeDelete = () => {
        setDeleteModalOpen(false)
        setDeleteTarget(null)
        setDeleteError(null)
    }

    const reloadAfterDelete = () => {
        const wasLastItemOnPage = skillsState.rows.length <= 1 && page > 1
        if (wasLastItemOnPage) setPage((previous) => previous - 1)
        else setReloadCounter((counter) => counter + 1)
    }

    const confirmDelete = async () => {
        if (!deleteTarget) return
        setDeleteLoading(true)
        setDeleteError(null)
        try {
            await adminService.deleteSkill(deleteTarget.id)
            if (detailsSkillId === deleteTarget.id) closeDetails()
            closeDelete()
            reloadAfterDelete()
        } catch (requestError: unknown) {
            setDeleteError(getErrorMessage(requestError, 'Failed to delete this skill.'))
        } finally {
            setDeleteLoading(false)
        }
    }

    const retryFetch = () => setReloadCounter((counter) => counter + 1)

    const logout = async () => {
        await authService.logout()
        navigate('/auth/login')
    }

    return (
        <div className="min-h-screen bg-white">
            <AdminSidebar
                mobileOpen={isMobileSidebarOpen}
                onMobileClose={() => setIsMobileSidebarOpen(false)}
            />

            <div className="md:ml-[236px]">
                <header className="flex h-[80px] items-center justify-between border-b border-[#F3F4F6] px-4 md:justify-end md:px-6">
                    <div className="flex items-center gap-3 md:hidden">
                        <button
                            type="button"
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="rounded-lg p-2 text-[#1C1C1C] transition-colors hover:bg-[#F3F4F6]"
                            aria-label="Open menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="text-lg font-poppins font-bold">
                            <span className="text-[#F59E0B]">Skill</span>
                            <span className="text-[#3E8FCC]">Swap</span>
                            <span className="text-[#F59E0B]">.</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        <button type="button" className="rounded-full p-2 text-[#1C1C1C] hover:bg-[#F3F4F6]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 17.8476C17.6392 17.8476 20.2481 17.1242 20.5 14.2205C20.5 11.3188 18.6812 11.5054 18.6812 7.94511C18.6812 5.16414 16.0452 2 12 2C7.95477 2 5.31885 5.16414 5.31885 7.94511C5.31885 11.5054 3.5 11.3188 3.5 14.2205C3.75295 17.1352 6.36177 17.8476 12 17.8476Z" stroke="#0C0D0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14.3887 20.8572C13.0246 22.372 10.8966 22.3899 9.51941 20.8572" stroke="#0C0D0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <div className="relative" ref={profileMenuRef}>
                            <button
                                type="button"
                                onClick={() => setProfileMenuOpen((previous) => !previous)}
                                className="flex items-center gap-2 rounded-xl border-none bg-transparent p-0"
                            >
                                <Avatar src={userAvatar} name={userDisplayName} size={40} />
                                <div className="hidden text-left sm:block">
                                    <p className="text-sm text-[#0C0D0F]">{userDisplayName}</p>
                                    <p className="text-xs capitalize text-[#666666]">{userRole}</p>
                                </div>
                                <ChevronDown className={`h-4 w-4 text-[#666666] transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {profileMenuOpen && (
                                <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-xl border border-[#E8E8E8] bg-white py-1 shadow-lg">
                                    <button
                                        type="button"
                                        onClick={logout}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="space-y-4 px-4 py-4 md:px-6 md:py-6">
                    <div className="hidden items-center text-sm md:flex">
                        <span className="text-[#9CA3AF]">Dashboard</span>
                        <ChevronRight className="mx-1 h-4 w-4 text-[#9CA3AF]" />
                        <span className="text-[#3272A3]">Skills Management</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                    d="M13.01 2.92007L18.91 5.54007C20.61 6.29007 20.61 7.53007 18.91 8.28007L13.01 10.9001C12.34 11.2001 11.24 11.2001 10.57 10.9001L4.66999 8.28007C2.96999 7.53007 2.96999 6.29007 4.66999 5.54007L10.57 2.92007C11.24 2.62007 12.34 2.62007 13.01 2.92007Z"
                                    stroke="#3E8FCC"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M13.01 2.92007L18.91 5.54007C20.61 6.29007 20.61 7.53007 18.91 8.28007L13.01 10.9001C12.34 11.2001 11.24 11.2001 10.57 10.9001L4.66999 8.28007C2.96999 7.53007 2.96999 6.29007 4.66999 5.54007L10.57 2.92007C11.24 2.62007 12.34 2.62007 13.01 2.92007Z"
                                    stroke="black"
                                    strokeOpacity="0.2"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M3 11C3 11.84 3.63 12.81 4.4 13.15L11.19 16.17C11.71 16.4 12.3 16.4 12.81 16.17L19.6 13.15C20.37 12.81 21 11.84 21 11"
                                    stroke="#3E8FCC"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M3 11C3 11.84 3.63 12.81 4.4 13.15L11.19 16.17C11.71 16.4 12.3 16.4 12.81 16.17L19.6 13.15C20.37 12.81 21 11.84 21 11"
                                    stroke="black"
                                    strokeOpacity="0.2"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M3 16C3 16.93 3.55 17.77 4.4 18.15L11.19 21.17C11.71 21.4 12.3 21.4 12.81 21.17L19.6 18.15C20.45 17.77 21 16.93 21 16"
                                    stroke="#3E8FCC"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M3 16C3 16.93 3.55 17.77 4.4 18.15L11.19 21.17C11.71 21.4 12.3 21.4 12.81 21.17L19.6 18.15C20.45 17.77 21 16.93 21 16"
                                    stroke="black"
                                    strokeOpacity="0.2"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <h1 className="font-sans text-[24px] font-bold text-[#0C0D0F] md:text-[28px]">Skills Management</h1>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="flex h-12 w-full items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 md:max-w-[543px]">
                            <Search className="h-5 w-5 text-[#9CA3AF]" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(event) => setSearchInput(event.target.value)}
                                placeholder="Search skills by name..."
                                className="h-full w-full border-none bg-transparent text-[16px] text-[#0C0D0F] outline-none placeholder:text-[#9CA3AF]"
                            />
                        </div>

                        <div className="relative ml-auto" ref={sortMenuRef}>
                            <button
                                type="button"
                                onClick={() => setSortMenuOpen((previous) => !previous)}
                                className="flex h-12 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 text-[16px] text-[#0C0D0F]"
                            >
                                {sort === 'newest' ? 'Newest' : 'Oldest'}
                                <SortOrderIcon sort={sort} />
                            </button>

                            {sortMenuOpen && (
                                <div className="absolute right-0 top-[56px] z-20 min-w-[112px] rounded-lg border border-[#E5E7EB] bg-white p-2 shadow-[0px_0px_4.7px_0px_rgba(0,0,0,0.25)]">
                                    {(['newest', 'oldest'] as const).map((sortOption) => {
                                        const isActive = sort === sortOption
                                        return (
                                            <button
                                                key={sortOption}
                                                type="button"
                                                onClick={() => {
                                                    setSort(sortOption)
                                                    setPage(1)
                                                    setSortMenuOpen(false)
                                                }}
                                                className={`flex w-full items-center rounded-[4px] px-2 py-2 text-left text-sm ${isActive ? 'bg-[#E5E7EB] text-[#0C0D0F]' : 'text-[#0C0D0F] hover:bg-[#F3F4F6]'}`}
                                            >
                                                {sortOption === 'newest' ? 'Newest' : 'Oldest'}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {isLoading && skillsState.rows.length === 0 && (
                        <div className="rounded-xl border border-[#E5E7EB] bg-white p-10 text-center text-sm text-[#666666]">
                            Loading skills...
                        </div>
                    )}

                    {error && !isLoading && (
                        <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4">
                            <p className="text-sm text-[#B91C1C]">{error}</p>
                            <button
                                type="button"
                                onClick={retryFetch}
                                className="mt-3 rounded-md bg-[#B91C1C] px-3 py-1.5 text-sm text-white"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {!error && !isLoading && skillsState.rows.length === 0 && (
                        <div className="rounded-xl border border-[#E5E7EB] bg-white p-10 text-center text-sm text-[#666666]">
                            No skills found.
                        </div>
                    )}

                    {!error && skillsState.rows.length > 0 && (
                        <>
                            <div className="hidden overflow-x-auto rounded-xl border border-[#F9FAFB] md:block">
                                <table className="min-w-full table-fixed">
                                    <thead>
                                        <tr className="h-[62px] bg-[#F9FAFB] text-left">
                                            <th className="px-4 text-[18px] font-semibold text-[#666666]">Skill</th>
                                            <th className="px-4 text-[18px] font-semibold text-[#666666]">Provider</th>
                                            <th className="px-4 text-[18px] font-semibold text-[#666666]">Requests</th>
                                            <th className="px-4 text-[18px] font-semibold text-[#666666]">Created Date</th>
                                            <th className="w-[136px] px-4 text-right text-[18px] font-semibold text-[#666666]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {skillsState.rows.map((skillRow) => (
                                            <tr key={skillRow.id} className="h-[62px] border-b border-[#F3F4F6]">
                                                <td className="px-4 text-[14px] font-semibold text-[#0C0D0F]">{skillRow.name || 'Untitled Skill'}</td>
                                                <td className="px-4">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar src={providerImage(skillRow)} name={providerName(skillRow)} size={32} />
                                                        <span className="text-[14px] text-[#0C0D0F]">{providerName(skillRow)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4">
                                                    <span className="inline-flex h-6 items-center rounded-[10px] bg-[rgba(62,143,204,0.2)] px-[10px] text-[14px] font-medium text-[#3272A3]">
                                                        {skillRow.requestsCount} requests
                                                    </span>
                                                </td>
                                                <td className="px-4 text-[14px] text-[#666666]">{formatIsoDate(skillRow.createdAt)}</td>
                                                <td className="relative px-4 text-right" data-actions-menu-root>
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveActionSkillId((previous) => (previous === skillRow.id ? null : skillRow.id))}
                                                        className="rounded-md p-1 text-[#0C0D0F] hover:bg-[#F3F4F6]"
                                                        aria-label={`Actions for ${skillRow.name}`}
                                                    >
                                                        <MoreVertical className="h-5 w-5" />
                                                    </button>

                                                    {activeActionSkillId === skillRow.id && (
                                                        <div className="absolute right-4 top-12 z-20 w-[138px] rounded-lg border border-[#E5E7EB] bg-white p-2 shadow-[0px_0px_4.7px_0px_rgba(0,0,0,0.25)]">
                                                            <button
                                                                type="button"
                                                                onClick={() => openDetails(skillRow.id)}
                                                                className="w-full rounded-[4px] bg-[#E5E7EB] px-2 py-2 text-left text-sm text-[#0C0D0F]"
                                                            >
                                                                View Details
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => openDelete(skillRow.id, skillRow.name)}
                                                                className="mt-1 w-full rounded-[4px] px-2 py-2 text-left text-sm text-[#DC2626] hover:bg-[#FEF2F2]"
                                                            >
                                                                Delete skill
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="space-y-3 md:hidden">
                                {skillsState.rows.map((skillRow) => (
                                    <article key={skillRow.id} className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                                        <div className="mb-2 flex items-start justify-between gap-3">
                                            <h3 className="text-sm font-semibold text-[#0C0D0F]">{skillRow.name || 'Untitled Skill'}</h3>
                                            <div className="relative" data-actions-menu-root>
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveActionSkillId((previous) => (previous === skillRow.id ? null : skillRow.id))}
                                                    className="rounded-md p-1 text-[#0C0D0F] hover:bg-[#F3F4F6]"
                                                    aria-label={`Actions for ${skillRow.name}`}
                                                >
                                                    <MoreVertical className="h-5 w-5" />
                                                </button>

                                                {activeActionSkillId === skillRow.id && (
                                                    <div className="absolute right-0 top-10 z-20 w-[138px] rounded-lg border border-[#E5E7EB] bg-white p-2 shadow-[0px_0px_4.7px_0px_rgba(0,0,0,0.25)]">
                                                        <button
                                                            type="button"
                                                            onClick={() => openDetails(skillRow.id)}
                                                            className="w-full rounded-[4px] bg-[#E5E7EB] px-2 py-2 text-left text-sm text-[#0C0D0F]"
                                                        >
                                                            View Details
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => openDelete(skillRow.id, skillRow.name)}
                                                            className="mt-1 w-full rounded-[4px] px-2 py-2 text-left text-sm text-[#DC2626] hover:bg-[#FEF2F2]"
                                                        >
                                                            Delete skill
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-2 flex items-center gap-2">
                                            <Avatar src={providerImage(skillRow)} name={providerName(skillRow)} size={32} />
                                            <span className="text-sm text-[#0C0D0F]">{providerName(skillRow)}</span>
                                        </div>

                                        <div className="mb-2">
                                            <span className="inline-flex h-6 items-center rounded-[10px] bg-[rgba(62,143,204,0.2)] px-[10px] text-xs font-medium text-[#3272A3]">
                                                {skillRow.requestsCount} requests
                                            </span>
                                        </div>

                                        <p className="text-sm text-[#666666]">{formatIsoDate(skillRow.createdAt)}</p>
                                    </article>
                                ))}
                            </div>

                            <div className="flex flex-col gap-3 py-2 md:h-[49px] md:flex-row md:items-center">
                                <div className="md:flex-1">
                                    <p className="text-[16px] text-[#3272A3]">
                                        Page {page} of {totalPages}
                                    </p>
                                </div>
                                <div className="ml-auto flex items-center gap-2">
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
                        </>
                    )}

                    {isRefreshing && !isLoading && (
                        <p className="text-xs text-[#666666]">Updating skills list...</p>
                    )}
                </main>
            </div>

            {detailsModalOpen && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(94,95,96,0.2)] p-4">
                    <div className="w-full max-w-[600px] rounded-[10px] border border-[#E5E7EB] bg-white shadow-[0px_0px_4.7px_0px_rgba(0,0,0,0.25)]">
                        <div className="flex items-center gap-2 border-b border-[#F3F4F6] p-4">
                            <h2 className="flex-1 text-base font-semibold text-[#0C0D0F]">Skill Details</h2>
                            <button
                                type="button"
                                onClick={closeDetails}
                                className="rounded-md p-1 text-[#666666] hover:bg-[#F3F4F6]"
                                aria-label="Close skill details"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-6 p-4">
                            {detailsLoading && (
                                <div className="rounded-lg border border-[#E5E7EB] p-6 text-center text-sm text-[#666666]">
                                    Loading details...
                                </div>
                            )}

                            {detailsError && !detailsLoading && (
                                <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#B91C1C]">
                                    {detailsError}
                                </div>
                            )}

                            {!detailsLoading && !detailsError && detailsData && (
                                <>
                                    <div className="flex items-center gap-4 rounded-[5px] border border-[#E5E7EB] p-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[rgba(62,143,204,0.2)] text-xl font-semibold text-[#3272A3]">
                                            {skillInitial(detailsData.name)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-base font-semibold text-[#0C0D0F]">{detailsData.name}</p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <span className="inline-flex h-5 items-center rounded-[10px] bg-[rgba(62,143,204,0.2)] px-2 text-xs text-[#3272A3]">
                                                    {detailsLevel}
                                                </span>
                                                <span className="inline-flex h-5 items-center rounded-[10px] bg-[rgba(62,143,204,0.2)] px-2 text-xs text-[#3272A3]">
                                                    {detailsDuration}
                                                </span>
                                                <span className="inline-flex h-5 items-center rounded-[10px] bg-[rgba(62,143,204,0.2)] px-2 text-xs text-[#3272A3]">
                                                    {detailsLanguage}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <section className="space-y-2">
                                        <h3 className="inline-flex border-b border-[#3272A3] pb-1 text-base font-medium text-[#0C0D0F]">
                                            Provider
                                        </h3>
                                        <div className="flex h-[72px] items-center gap-3 rounded-[5px] bg-white p-2 shadow-[1px_3px_3.1px_0px_rgba(0,0,0,0.03)]">
                                            <Avatar src={detailsProviderImage} name={detailsProviderName} size={48} />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-base font-medium text-[#0C0D0F]">{detailsProviderName}</p>
                                                <p className="truncate text-xs text-[#666666]">{detailsProviderBio}</p>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="space-y-2 border-b border-[#E5E7EB] pb-4">
                                        <h3 className="inline-flex border-b border-[#3272A3] pb-1 text-base font-medium text-[#0C0D0F]">
                                            Skill Description
                                        </h3>
                                        <p className="px-2 text-sm text-[#666666]">{detailsDescription}</p>
                                    </section>

                                    <section className="space-y-2">
                                        <h3 className="inline-flex border-b border-[#3272A3] pb-1 text-base font-medium text-[#0C0D0F]">
                                            Session Details
                                        </h3>
                                        <div className="border-b border-[#F3F4F6]">
                                            <div className="flex min-h-10 items-center border-b border-[#E5E7EB] px-4">
                                                <p className="w-[178px] text-sm text-[#666666]">Skill Language</p>
                                                <p className="text-sm text-[#0C0D0F]">{detailsLanguage}</p>
                                            </div>
                                            <div className="flex min-h-10 items-center border-b border-[#E5E7EB] px-4">
                                                <p className="w-[178px] text-sm text-[#666666]">Session Duration:</p>
                                                <p className="text-sm text-[#0C0D0F]">{detailsDuration}</p>
                                            </div>
                                            <div className="flex min-h-10 items-center px-4">
                                                <p className="w-[178px] text-sm text-[#666666]">Skill Level:</p>
                                                <p className="text-sm text-[#0C0D0F]">{detailsLevel}</p>
                                            </div>
                                        </div>
                                    </section>

                                    <div className="flex justify-end border-t border-[#F3F4F6] pt-4">
                                        <button
                                            type="button"
                                            onClick={() => openDelete(detailsData.id, detailsData.name)}
                                            className="text-sm font-semibold text-[#DC2626] hover:underline"
                                        >
                                            Delete Skill
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(94,95,96,0.2)] p-4">
                    <div className="w-full max-w-[410px] rounded-[10px] border border-[#E5E7EB] bg-white shadow-[0px_0px_4.7px_0px_rgba(0,0,0,0.25)]">
                        <div className="flex items-center gap-2 border-b border-[#F3F4F6] px-4 py-[10px]">
                            <h2 className="flex-1 text-base font-medium text-[#0C0D0F]">Confirm Deletion</h2>
                            <button
                                type="button"
                                onClick={closeDelete}
                                className="rounded-md p-1 text-[#666666] hover:bg-[#F3F4F6]"
                                aria-label="Close delete dialog"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4 px-4 py-6">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFD9D9]">
                                <TriangleAlert className="h-5 w-5 text-[#DC2626]" />
                            </div>

                            <div className="space-y-1 text-center">
                                <p className="text-base font-semibold text-[#0C0D0F]">Are you absolutely sure?</p>
                                <p className="text-xs text-[#666666]">This action cannot be undone.</p>
                                {deleteTarget?.name ? (
                                    <p className="text-xs text-[#666666]">{`Skill: ${deleteTarget.name}`}</p>
                                ) : null}
                            </div>

                            {deleteError ? (
                                <p className="rounded-md bg-[#FEF2F2] px-3 py-2 text-center text-xs text-[#B91C1C]">
                                    {deleteError}
                                </p>
                            ) : null}

                            <div className="flex items-center gap-4 pt-2">
                                <button
                                    type="button"
                                    disabled={deleteLoading}
                                    onClick={closeDelete}
                                    className="flex-1 rounded-[10px] border border-[#E5E7EB] bg-[#F5F5F5] px-4 py-3 text-base font-medium text-[#666666] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    No, Keep it
                                </button>
                                <button
                                    type="button"
                                    disabled={deleteLoading}
                                    onClick={confirmDelete}
                                    className="flex-1 rounded-[10px] bg-[#DC2626] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
