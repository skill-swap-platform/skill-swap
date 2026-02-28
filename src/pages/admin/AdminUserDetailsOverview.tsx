import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    AlertTriangle,
    ChevronDown,
    ChevronRight,
    Mail,
    Menu,
    MoreVertical,
    PenTool,
    SendHorizontal,
    Star,
} from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Avatar from '@/components/Avatar/Avatar'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { authService } from '@/api/services/auth.service'
import { userService } from '@/api/services/user.service'
import { useAdminUserOverview } from '@/hooks/useAdminUserOverview'
import { useAdminUserImages } from '@/hooks/useAdminUserImages'
import { addAdminUserNote } from '@/services/adminUsers.service'
import type { AdminUserItem, AdminUserStatus } from '@/types/adminUsers.types'
import type { UserAuthDto } from '@/types/api.types'

const DEFAULT_AVATAR_URL = 'https://api.dicebear.com/7.x/notionists/svg?seed=currentuser'
const overviewTabs = [
    'Overview',
    'Sent Swap Requests',
    'Received Swap Requests',
    'Sessions',
    'Badges',
    'Activity log',
    'Disputes',
] as const

const statusPillClassName: Record<AdminUserStatus, string> = {
    ACTIVE: 'bg-[rgba(22,163,74,0.2)] text-[#16A34A]',
    SUSPENDED: 'bg-[rgba(255,164,18,0.2)] text-[#FFA412]',
    BANNED: 'bg-[rgba(220,38,38,0.2)] text-[#DC2626]',
}

type UserDetailsLocationState = {
    userSnapshot?: AdminUserItem
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

const displayStatus = (status: AdminUserStatus): string => {
    if (status === 'SUSPENDED') return 'Suspended'
    if (status === 'BANNED') return 'Banned'
    return 'Active'
}

const formatShortDate = (value: string): string => {
    const parsedDate = new Date(value)
    if (Number.isNaN(parsedDate.getTime())) return '--'
    return parsedDate.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
    })
}

const formatNoteDate = (value: string): string => formatShortDate(value)

const formatPointsLabel = (points: number): string =>
    `${points.toLocaleString('en-US').replaceAll(',', '.')} pts`

const formatDuration = (durationMinutes: number | null): string =>
    durationMinutes && durationMinutes > 0 ? `${durationMinutes} min` : '--'

const formatRating = (rating: number | null): string =>
    typeof rating === 'number' ? rating.toFixed(1) : '--'

const idSuffix = (id: string): string => {
    if (!id) return '--'
    return id.slice(-8)
}

export const AdminUserDetailsOverview: React.FC = () => {
    const navigate = useNavigate()
    const { userId } = useParams<{ userId: string }>()
    const location = useLocation()
    const locationState = location.state as UserDetailsLocationState | null
    const userSnapshot = locationState?.userSnapshot

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    const [profileMenuOpen, setProfileMenuOpen] = useState(false)
    const [noteInput, setNoteInput] = useState('')
    const profileMenuRef = useRef<HTMLDivElement>(null)
    const queryClient = useQueryClient()

    const [currentUser, setCurrentUser] = useState<UserAuthDto | null>(() => getStoredUser())

    const overviewQuery = useAdminUserOverview(userId)
    const profile = overviewQuery.data?.profile

    const profileId = profile?.id || userSnapshot?.id || userId || ''
    const profileName = profile?.userName?.trim() || userSnapshot?.name || 'User name'
    const profileEmail = profile?.email?.trim() || userSnapshot?.email || '--'
    const profileStatus: AdminUserStatus = profile?.status ?? userSnapshot?.status ?? 'ACTIVE'
    const snapshotPoints = userSnapshot?.points
    const fetchedPoints = profile?.points
    const profilePoints =
        typeof fetchedPoints === 'number'
            ? typeof snapshotPoints === 'number' && snapshotPoints > fetchedPoints && fetchedPoints <= 1
                ? snapshotPoints
                : fetchedPoints
            : snapshotPoints ?? 0
    const profileJoinedAt = profile?.createdAt ?? ''
    const profileLocation = profile?.location || profile?.country || '--'
    const profileBio = profile?.bio?.trim() || 'No bio available.'
    const profileSkills = profile?.skills ?? []

    const rawProfileImage = profile?.image ?? userSnapshot?.image ?? null
    const imageLookupIds = !rawProfileImage && profileId ? [profileId] : []
    const { imageByUserId } = useAdminUserImages(imageLookupIds)
    const profileImage = rawProfileImage || (profileId ? imageByUserId[profileId] : null)

    const notes = overviewQuery.data?.adminNotes ?? []

    useEffect(() => {
        if (!isMobileSidebarOpen) {
            document.body.classList.remove('overflow-hidden')
            return
        }

        document.body.classList.add('overflow-hidden')
        return () => document.body.classList.remove('overflow-hidden')
    }, [isMobileSidebarOpen])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node
            if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
                setProfileMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

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
                    role: storedUser?.role || 'ADMIN',
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
    const userAvatar = currentUser?.image?.trim() || DEFAULT_AVATAR_URL
    const userRole = currentUser?.role ? currentUser.role.toLowerCase() : 'admin'

    const usersErrorMessage = overviewQuery.error
        ? getErrorMessage(overviewQuery.error, 'Failed to load user overview.')
        : null

    const addNoteMutation = useMutation({
        mutationFn: async (externalNote: string) => {
            if (!userId) throw new Error('User id is required')
            await addAdminUserNote(userId, externalNote)
        },
        onSuccess: async () => {
            setNoteInput('')
            await queryClient.invalidateQueries({ queryKey: ['admin-user-overview', userId] })
        },
    })

    const addNoteErrorMessage = addNoteMutation.error
        ? getErrorMessage(addNoteMutation.error, 'Failed to add admin note.')
        : null

    const submitNote = () => {
        const trimmed = noteInput.trim()
        if (!trimmed || addNoteMutation.isPending) return
        addNoteMutation.mutate(trimmed)
    }

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
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12 17.8476C17.6392 17.8476 20.2481 17.1242 20.5 14.2205C20.5 11.3188 18.6812 11.5054 18.6812 7.94511C18.6812 5.16414 16.0452 2 12 2C7.95477 2 5.31885 5.16414 5.31885 7.94511C5.31885 11.5054 3.5 11.3188 3.5 14.2205C3.75295 17.1352 6.36177 17.8476 12 17.8476Z"
                                    stroke="#0C0D0F"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M14.3887 20.8572C13.0246 22.372 10.8966 22.3899 9.51941 20.8572"
                                    stroke="#0C0D0F"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
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
                                <ChevronDown
                                    className={`h-4 w-4 text-[#666666] transition-transform ${
                                        profileMenuOpen ? 'rotate-180' : ''
                                    }`}
                                />
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
                    <div className="flex items-center text-sm">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/users')}
                            className="text-[#9CA3AF] hover:text-[#6B7280]"
                        >
                            Useres
                        </button>
                        <ChevronRight className="mx-1 h-4 w-4 text-[#9CA3AF]" />
                        <span className="text-[#3272A3]">User Details</span>
                    </div>

                    <section className="rounded-[12px] border border-[#E5E7EB] bg-white p-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                            <div className="flex min-w-0 flex-1 items-center gap-4">
                                <Avatar src={profileImage} name={profileName} size={80} />
                                <div className="min-w-0 space-y-2">
                                    <p className="truncate text-[26px] font-semibold leading-none text-[#0C0D0F] sm:text-[28px]">
                                        {profileName}
                                    </p>
                                    <div className="flex items-center gap-1 text-[13px] text-[#666666]">
                                        <Mail className="h-4 w-4 shrink-0" />
                                        <span className="truncate">{profileEmail}</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span
                                            className={`inline-flex h-[23px] items-center rounded-[10px] px-[6px] text-[13px] ${statusPillClassName[profileStatus]}`}
                                        >
                                            {displayStatus(profileStatus)}
                                        </span>
                                        <span className="inline-flex h-[23px] items-center rounded-[10px] bg-[rgba(255,164,18,0.2)] px-[6px] text-[13px] text-[#FFA412]">
                                            {formatPointsLabel(profilePoints)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="inline-flex h-10 items-center gap-1 rounded-[30px] border border-[#DC2626] bg-white px-4 text-sm text-[#DC2626]"
                                >
                                    Warn
                                    <AlertTriangle className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex h-10 items-center gap-1 rounded-[30px] border border-[#FFA412] bg-white px-4 text-sm text-[#FFA412]"
                                >
                                    Suspend
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM10.5 10C10.5 9.17157 11.1716 8.5 12 8.5C12.8284 8.5 13.5 9.17157 13.5 10C13.5 10.8284 12.8284 11.5 12 11.5C11.4477 11.5 11 11.9477 11 12.5V14.5H13V13.3551C14.4457 12.9248 15.5 11.5855 15.5 10C15.5 8.067 13.933 6.5 12 6.5C10.067 6.5 8.5 8.067 8.5 10H10.5ZM11 16V17.5H13V16H11Z"
                                            fill="#FFA412"
                                        />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    className="rounded-md p-1 text-[#0C0D0F] hover:bg-[#F3F4F6]"
                                    aria-label="More actions"
                                >
                                    <MoreVertical className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="overflow-x-auto border-b border-[#E5E7EB]">
                        <div className="flex min-w-max items-center gap-7">
                            {overviewTabs.map((tab) => {
                                const active = tab === 'Overview'
                                return (
                                    <button
                                        key={tab}
                                        type="button"
                                        className={`border-b-[1.5px] py-4 text-[16px] ${
                                            active
                                                ? 'border-[#3272A3] text-[#3272A3]'
                                                : 'border-transparent text-[#0C0D0F]'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                )
                            })}
                        </div>
                    </section>

                    {overviewQuery.isLoading && (
                        <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 text-center text-sm text-[#666666]">
                            Loading user overview...
                        </section>
                    )}

                    {usersErrorMessage && !overviewQuery.isLoading && (
                        <section className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4">
                            <p className="text-sm text-[#B91C1C]">{usersErrorMessage}</p>
                            <button
                                type="button"
                                onClick={() => overviewQuery.refetch()}
                                className="mt-3 rounded-md bg-[#B91C1C] px-3 py-1.5 text-sm text-white"
                            >
                                Retry
                            </button>
                        </section>
                    )}

                    {!overviewQuery.isLoading && !usersErrorMessage && (
                        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                            <div className="space-y-4">
                                <article className="rounded-[12px] bg-[#F7FAFF] p-6">
                                    <div className="mb-6 flex items-center">
                                        <h2 className="text-[30px] font-semibold leading-none text-[#0C0D0F]">
                                            Personal Information
                                        </h2>
                                    </div>

                                    <div className="space-y-4 text-[16px]">
                                        <div className="flex flex-col gap-4 text-[#0C0D0F] sm:flex-row">
                                            <div className="flex min-w-0 flex-1 items-center gap-2">
                                                <p className="text-[#666666]">Uset ID</p>
                                                <p>#{idSuffix(profileId)}</p>
                                            </div>
                                            <div className="flex min-w-0 flex-1 items-center gap-2">
                                                <p className="text-[#666666]">Date Of Join</p>
                                                <p>{formatShortDate(profileJoinedAt)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <p className="text-[#666666]">Location</p>
                                            <p className="text-[#0C0D0F]">{profileLocation}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-[#666666]">Bio</p>
                                            <div className="border-l-[1.5px] border-[#9CA3AF] pl-2">
                                                <p className="text-[#0C0D0F]">{profileBio}</p>
                                            </div>
                                        </div>
                                    </div>
                                </article>

                                <article className="rounded-[12px] bg-[#F7FAFF] p-6">
                                    <h2 className="mb-4 text-[30px] font-semibold leading-none text-[#0C0D0F]">
                                        User Skills
                                    </h2>

                                    <div className="space-y-2">
                                        {profileSkills.length === 0 && (
                                            <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-4 text-sm text-[#666666]">
                                                No skills available.
                                            </div>
                                        )}

                                        {profileSkills.map((skill) => (
                                            <div
                                                key={skill.id || skill.name}
                                                className="flex flex-col gap-3 rounded-[12px] border border-[#E5E7EB] bg-white p-4 sm:flex-row sm:items-start"
                                            >
                                                <div className="flex min-w-0 flex-1 items-center gap-2">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[rgba(62,143,204,0.2)]">
                                                        {skill.icon ? (
                                                            /^https?:\/\//i.test(skill.icon) ||
                                                            /^data:image\//i.test(skill.icon) ? (
                                                                <img
                                                                    src={skill.icon}
                                                                    alt={`${skill.name} icon`}
                                                                    className="h-5 w-5 object-contain"
                                                                />
                                                            ) : (
                                                                <span className="text-base leading-none text-[#3272A3]">
                                                                    {skill.icon}
                                                                </span>
                                                            )
                                                        ) : (
                                                            <PenTool className="h-5 w-5 text-[#3272A3]" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-[18px] font-semibold text-[#3272A3]">
                                                            {skill.name}
                                                        </p>
                                                        <p className="text-[13px] text-[#0C0D0F]">{skill.level}</p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                                    <span className="inline-flex h-6 items-center rounded-[10px] bg-[rgba(62,143,204,0.2)] px-2 text-[13px] text-[#0C0D0F]">
                                                        {formatDuration(skill.durationMinutes)}
                                                    </span>
                                                    <span className="inline-flex h-6 items-center gap-1 rounded-[10px] bg-[rgba(62,143,204,0.2)] px-2 text-[13px] text-[#0C0D0F]">
                                                        <Star className="h-3.5 w-3.5 fill-[#FFA412] text-[#FFA412]" />
                                                        {formatRating(skill.rating)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </article>
                            </div>

                            <article className="rounded-[12px] bg-[#F7FAFF] p-6">
                                <div className="mb-4 flex items-center gap-2">
                                    <h2 className="text-[30px] font-semibold leading-none text-[#0C0D0F]">
                                        Admin Notes
                                    </h2>
                                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-[50px] bg-white px-1.5 text-[13px] text-[#0C0D0F]">
                                        {notes.length}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {notes.length === 0 && (
                                        <div className="rounded-[6px] bg-white p-4 text-sm text-[#666666]">
                                            No admin notes yet.
                                        </div>
                                    )}

                                    {notes.map((note, index) => (
                                        <div key={`${note.createdAt}-${index}`} className="rounded-[6px] bg-white p-4">
                                            <div className="mb-4 border-l-[1.5px] border-[#9CA3AF] pl-2">
                                                <p className="text-[16px] text-[#0C0D0F]">
                                                    {note.externalNote || '--'}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-end">
                                                <p className="text-[14px] text-[#666666]">
                                                    {formatNoteDate(note.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 flex h-12 items-center gap-2 rounded-[12px] border border-[#E5E7EB] bg-white px-4">
                                    <input
                                        type="text"
                                        value={noteInput}
                                        onChange={(event) => setNoteInput(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault()
                                                submitNote()
                                            }
                                        }}
                                        placeholder="Type A  Note"
                                        disabled={addNoteMutation.isPending || !userId}
                                        className="min-w-0 flex-1 bg-transparent text-[16px] text-[#0C0D0F] placeholder:text-[#9CA3AF] outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={submitNote}
                                        disabled={
                                            addNoteMutation.isPending ||
                                            noteInput.trim().length === 0 ||
                                            !userId
                                        }
                                        className="flex h-8 w-8 items-center justify-center rounded-[50px] text-white disabled:cursor-not-allowed disabled:opacity-60"
                                        style={{
                                            backgroundImage:
                                                'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(62, 143, 204) 0%, rgb(62, 143, 204) 100%)',
                                        }}
                                        aria-label="Add note"
                                    >
                                        <SendHorizontal className="h-4 w-4" />
                                    </button>
                                </div>
                                {addNoteErrorMessage ? (
                                    <p className="mt-2 text-xs text-[#B91C1C]">{addNoteErrorMessage}</p>
                                ) : null}
                            </article>
                        </section>
                    )}

                    {overviewQuery.isFetching && !overviewQuery.isLoading && (
                        <p className="text-xs text-[#666666]">Updating user overview...</p>
                    )}
                </main>
            </div>
        </div>
    )
}

export default AdminUserDetailsOverview
