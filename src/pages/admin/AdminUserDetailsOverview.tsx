import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    AlertTriangle,
    ChevronRight,
    Mail,
    MoreVertical,
    PenTool,
    SendHorizontal,
    Star,
} from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Avatar from '@/components/Avatar/Avatar'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { AdminHeader } from '@/components/layout/AdminHeader'
import AdminUserActionModals, {
    type AdminUserActionModalState,
    type AdminUserActionModalType,
} from '@/components/admin-users/AdminUserActionModals'
import AdminUserSwapsTable from '@/components/admin-users/AdminUserSwapsTable'
import AdminUserSessionsTable from '@/components/admin-users/AdminUserSessionsTable'
import AdminUserBadgesPanel from '@/components/admin-users/AdminUserBadgesPanel'
import AdminUserActivityLogPanel from '@/components/admin-users/AdminUserActivityLogPanel'
import { userService } from '@/api/services/user.service'
import { useAdminUserOverview } from '@/hooks/useAdminUserOverview'
import { useAdminUserImages } from '@/hooks/useAdminUserImages'
import { useAdminUserActivityLog } from '@/hooks/useAdminUserActivityLog'
import {
    addAdminUserNote,
    adjustAdminUserPoints,
    banAdminUser,
    suspendAdminUser,
    unbanAdminUser,
    warnAdminUser,
} from '@/services/adminUsers.service'
import type {
    AdminUserActivityLogItem,
    AdminUserAdjustPointsPayload,
    AdminUserItem,
    AdminUserRestrictionPayload,
    AdminUserStatus,
} from '@/types/adminUsers.types'
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
type OverviewTab = (typeof overviewTabs)[number]

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

const parseStatusToken = (value: unknown): AdminUserStatus | null => {
    const normalized = String(value ?? '')
        .trim()
        .toUpperCase()
        .replace(/[\s-]+/g, '_')
    if (!normalized) return null
    if (normalized === 'ACTIVE' || normalized.includes('UNBAN') || normalized.includes('UNSUSPEND')) {
        return 'ACTIVE'
    }
    if (normalized.includes('BAN')) return 'BANNED'
    if (normalized.includes('SUSPEND') || normalized.includes('SUSPENS') || normalized === 'INACTIVE') {
        return 'SUSPENDED'
    }
    return null
}

const getTimeValue = (value: string): number => {
    const timestamp = new Date(value).getTime()
    return Number.isNaN(timestamp) ? 0 : timestamp
}

const deriveStatusFromActivityLog = (logs: AdminUserActivityLogItem[]): AdminUserStatus | null => {
    if (!logs.length) return null

    const sortedLogs = [...logs].sort((first, second) => getTimeValue(second.createdAt) - getTimeValue(first.createdAt))

    for (const entry of sortedLogs) {
        const entity = String(entry.entity ?? '').toUpperCase()
        const type = String(entry.type ?? '').toUpperCase()
        if (
            entity !== 'USERRESTRICTION' &&
            !type.includes('BAN') &&
            !type.includes('SUSPEND') &&
            !type.includes('SUSPENS')
        ) {
            continue
        }

        const metadata = entry.metadata ?? {}
        const statusFromMetadata = parseStatusToken((metadata as Record<string, unknown>).newStatus)
        if (statusFromMetadata) return statusFromMetadata

        const statusFromType = parseStatusToken(type)
        if (statusFromType === 'SUSPENDED') {
            const endAtTimestamp = getTimeValue(entry.endAt)
            if (endAtTimestamp > 0 && endAtTimestamp <= Date.now()) continue
        }
        if (statusFromType) return statusFromType
    }

    return null
}

const actionSuccessMessage: Record<AdminUserActionModalType, string> = {
    warn: 'Warning sent successfully.',
    suspend: 'User suspended successfully.',
    ban: 'User banned successfully.',
    'adjust-points': 'User points updated successfully.',
    'internal-note': 'Internal note added successfully.',
}

export const AdminUserDetailsOverview: React.FC = () => {
    const navigate = useNavigate()
    const { userId } = useParams<{ userId: string }>()
    const location = useLocation()
    const locationState = location.state as UserDetailsLocationState | null
    const userSnapshot = locationState?.userSnapshot

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    const [actionMenuOpen, setActionMenuOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<OverviewTab>('Overview')
    const [noteInput, setNoteInput] = useState('')
    const [actionModalState, setActionModalState] = useState<AdminUserActionModalState | null>(null)
    const [pendingActionType, setPendingActionType] = useState<AdminUserActionModalType | null>(null)
    const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null)
    const [actionFeedbackMessage, setActionFeedbackMessage] = useState<string | null>(null)
    const actionMenuRef = useRef<HTMLDivElement>(null)
    const queryClient = useQueryClient()

    const [currentUser, setCurrentUser] = useState<UserAuthDto | null>(() => getStoredUser())

    const overviewQuery = useAdminUserOverview(userId)
    const activityStatusQuery = useAdminUserActivityLog(userId)
    const profile = overviewQuery.data?.profile

    const profileId = profile?.id || userSnapshot?.id || userId || ''
    const profileName = profile?.userName?.trim() || userSnapshot?.name || 'User name'
    const profileEmail = profile?.email?.trim() || userSnapshot?.email || '--'
    const statusFromActivityLog = useMemo(
        () => deriveStatusFromActivityLog(activityStatusQuery.data ?? []),
        [activityStatusQuery.data]
    )
    const baseProfileStatus: AdminUserStatus = profile?.status ?? userSnapshot?.status ?? 'ACTIVE'
    const profileStatus: AdminUserStatus =
        baseProfileStatus === 'ACTIVE' && statusFromActivityLog
            ? statusFromActivityLog
            : baseProfileStatus
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
    const isOverviewTab = activeTab === 'Overview'
    const isSessionsTab = activeTab === 'Sessions'
    const isBadgesTab = activeTab === 'Badges'
    const isActivityLogTab = activeTab === 'Activity log'
    const swapsDirection: 'SENT' | 'RECEIVED' | null =
        activeTab === 'Sent Swap Requests'
            ? 'SENT'
            : activeTab === 'Received Swap Requests'
              ? 'RECEIVED'
              : null

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
            if (actionMenuRef.current && !actionMenuRef.current.contains(target)) {
                setActionMenuOpen(false)
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

    const actionTargetUser = useMemo<AdminUserItem | null>(() => {
        const resolvedId = profileId || userId || ''
        if (!resolvedId) return null

        return {
            id: resolvedId,
            name: profileName,
            email: profileEmail === '--' ? '' : profileEmail,
            image: profileImage,
            status: profileStatus,
            points: profilePoints,
            badges: [],
        }
    }, [profileId, userId, profileName, profileEmail, profileImage, profileStatus, profilePoints])

    const warnMutation = useMutation({
        mutationFn: async ({
            targetUserId,
            payload,
        }: {
            targetUserId: string
            payload: AdminUserRestrictionPayload
        }) => warnAdminUser(targetUserId, payload),
    })

    const suspendMutation = useMutation({
        mutationFn: async ({
            targetUserId,
            payload,
        }: {
            targetUserId: string
            payload: AdminUserRestrictionPayload
        }) => suspendAdminUser(targetUserId, payload),
    })

    const banMutation = useMutation({
        mutationFn: async ({
            targetUserId,
            payload,
        }: {
            targetUserId: string
            payload: AdminUserRestrictionPayload
        }) => banAdminUser(targetUserId, payload),
    })

    const unbanMutation = useMutation({
        mutationFn: async (targetUserId: string) => unbanAdminUser(targetUserId),
    })

    const adjustPointsMutation = useMutation({
        mutationFn: async ({
            targetUserId,
            payload,
        }: {
            targetUserId: string
            payload: AdminUserAdjustPointsPayload
        }) => adjustAdminUserPoints(targetUserId, payload),
    })

    const addInlineNoteMutation = useMutation({
        mutationFn: async (externalNote: string) => {
            if (!userId) throw new Error('User id is required')
            await addAdminUserNote(userId, externalNote)
        },
        onSuccess: async () => {
            setNoteInput('')
            await queryClient.invalidateQueries({ queryKey: ['admin-user-overview', userId] })
        },
    })

    const addNoteErrorMessage = addInlineNoteMutation.error
        ? getErrorMessage(addInlineNoteMutation.error, 'Failed to add admin note.')
        : null

    const submitNote = () => {
        const trimmed = noteInput.trim()
        if (!trimmed || addInlineNoteMutation.isPending) return
        addInlineNoteMutation.mutate(trimmed)
    }

    const clearActionMessages = () => {
        setActionErrorMessage(null)
        setActionFeedbackMessage(null)
    }

    const closeActionModal = () => {
        setActionModalState(null)
        setPendingActionType(null)
        setActionErrorMessage(null)
    }

    const openActionModal = (type: AdminUserActionModalType) => {
        clearActionMessages()
        setActionMenuOpen(false)
        if (!actionTargetUser) return
        setActionModalState({
            type,
            user: actionTargetUser,
        })
    }

    const invalidateUserCaches = async (targetUserId: string) => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
            queryClient.invalidateQueries({ queryKey: ['admin-user-overview', targetUserId] }),
            queryClient.invalidateQueries({ queryKey: ['admin-user-activity-log', targetUserId] }),
        ])
    }

    const updateOverviewStatusCache = (targetUserId: string, nextStatus: AdminUserStatus) => {
        queryClient.setQueryData(
            ['admin-user-overview', targetUserId],
            (previous: unknown) => {
                if (!previous || typeof previous !== 'object') return previous
                const cached = previous as { profile?: Record<string, unknown> } & Record<string, unknown>
                if (!cached.profile || typeof cached.profile !== 'object') return previous

                return {
                    ...cached,
                    profile: {
                        ...cached.profile,
                        status: nextStatus,
                    },
                }
            }
        )
    }

    const runActionMutation = async (
        actionType: AdminUserActionModalType,
        targetUserId: string,
        run: () => Promise<void>,
        nextStatus?: AdminUserStatus
    ) => {
        setPendingActionType(actionType)
        setActionErrorMessage(null)
        setActionFeedbackMessage(null)

        try {
            await run()
            if (nextStatus) updateOverviewStatusCache(targetUserId, nextStatus)
            await invalidateUserCaches(targetUserId)
            setActionFeedbackMessage(actionSuccessMessage[actionType])
            closeActionModal()
        } catch (error) {
            setActionErrorMessage(getErrorMessage(error, 'Failed to update user action.'))
            setPendingActionType(null)
        }
    }

    const submitWarnUser = async (payload: AdminUserRestrictionPayload) => {
        if (!actionModalState?.user.id) return
        await runActionMutation(
            'warn',
            actionModalState.user.id,
            () =>
                warnMutation.mutateAsync({
                    targetUserId: actionModalState.user.id,
                    payload,
                }),
            undefined
        )
    }

    const submitSuspendUser = async (payload: AdminUserRestrictionPayload) => {
        if (!actionModalState?.user.id) return
        await runActionMutation(
            'suspend',
            actionModalState.user.id,
            () =>
                suspendMutation.mutateAsync({
                    targetUserId: actionModalState.user.id,
                    payload,
                }),
            'SUSPENDED'
        )
    }

    const submitBanUser = async (payload: AdminUserRestrictionPayload) => {
        if (!actionModalState?.user.id) return
        await runActionMutation(
            'ban',
            actionModalState.user.id,
            () =>
                banMutation.mutateAsync({
                    targetUserId: actionModalState.user.id,
                    payload,
                }),
            'BANNED'
        )
    }

    const submitAdjustPoints = async (payload: AdminUserAdjustPointsPayload) => {
        if (!actionModalState?.user.id) return
        await runActionMutation(
            'adjust-points',
            actionModalState.user.id,
            () =>
                adjustPointsMutation.mutateAsync({
                    targetUserId: actionModalState.user.id,
                    payload,
                }),
            undefined
        )
    }

    const submitInternalNote = async (payload: { externalNote: string }) => {
        if (!actionModalState?.user.id) return
        await runActionMutation(
            'internal-note',
            actionModalState.user.id,
            () => addAdminUserNote(actionModalState.user.id, payload.externalNote),
            undefined
        )
    }

    const handleUnban = async () => {
        if (!actionTargetUser?.id) return
        clearActionMessages()
        setPendingActionType(null)

        try {
            await unbanMutation.mutateAsync(actionTargetUser.id)
            updateOverviewStatusCache(actionTargetUser.id, 'ACTIVE')
            await invalidateUserCaches(actionTargetUser.id)
            setActionFeedbackMessage('User unbanned successfully.')
            setActionMenuOpen(false)
        } catch (error) {
            setActionErrorMessage(getErrorMessage(error, 'Failed to unban user.'))
        }
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
                    userEmail={currentUser?.email}
                    userRole={userRole}
                    userAvatar={userAvatar}
                />

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

                            <div className="relative flex items-center gap-2" ref={actionMenuRef}>
                                <button
                                    type="button"
                                    onClick={() => openActionModal('warn')}
                                    disabled={!actionTargetUser || pendingActionType !== null}
                                    className="inline-flex h-10 items-center gap-1 rounded-[30px] border border-[#DC2626] bg-white px-4 text-sm text-[#DC2626]"
                                >
                                    Warn
                                    <AlertTriangle className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => openActionModal('suspend')}
                                    disabled={!actionTargetUser || pendingActionType !== null}
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
                                    onClick={() => setActionMenuOpen((previous) => !previous)}
                                    className="rounded-md p-1 text-[#0C0D0F] hover:bg-[#F3F4F6]"
                                    aria-label="More actions"
                                >
                                    <MoreVertical className="h-5 w-5" />
                                </button>
                                {actionMenuOpen && (
                                    <div className="absolute right-0 top-12 z-20 w-[206px] rounded-lg border border-[#E5E7EB] bg-white p-2 shadow-[0px_0px_4.7px_0px_rgba(0,0,0,0.25)]">
                                        {profileStatus === 'BANNED' ? (
                                            <button
                                                type="button"
                                                onClick={handleUnban}
                                                className="w-full rounded-[4px] px-2 py-2 text-left text-sm text-[#16A34A] transition-colors hover:bg-[rgba(22,163,74,0.1)]"
                                            >
                                                Unban User
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => openActionModal('ban')}
                                                className="w-full rounded-[4px] px-2 py-2 text-left text-sm text-[#DC2626] transition-colors hover:bg-[rgba(220,38,38,0.08)]"
                                            >
                                                Ban User
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => openActionModal('adjust-points')}
                                            className="mt-1 w-full rounded-[4px] px-2 py-2 text-left text-sm text-[#3272A3] transition-colors hover:bg-[rgba(62,143,204,0.12)]"
                                        >
                                            Adjust Points
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => openActionModal('internal-note')}
                                            className="mt-1 w-full rounded-[4px] px-2 py-2 text-left text-sm text-[#3272A3] transition-colors hover:bg-[rgba(62,143,204,0.12)]"
                                        >
                                            Add Internal Note
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {actionFeedbackMessage ? (
                        <div className="rounded-[10px] border border-[rgba(22,163,74,0.3)] bg-[rgba(22,163,74,0.08)] px-4 py-3">
                            <p className="text-sm text-[#166534]">{actionFeedbackMessage}</p>
                        </div>
                    ) : null}

                    {actionErrorMessage && !actionModalState ? (
                        <div className="rounded-[10px] border border-[rgba(220,38,38,0.3)] bg-[rgba(220,38,38,0.08)] px-4 py-3">
                            <p className="text-sm text-[#B91C1C]">{actionErrorMessage}</p>
                        </div>
                    ) : null}

                    <section className="overflow-x-auto border-b border-[#E5E7EB]">
                        <div className="flex min-w-max items-center gap-7">
                            {overviewTabs.map((tab) => {
                                const active = tab === activeTab
                                return (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() => setActiveTab(tab)}
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

                    {isOverviewTab && overviewQuery.isLoading && (
                        <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 text-center text-sm text-[#666666]">
                            Loading user overview...
                        </section>
                    )}

                    {isOverviewTab && usersErrorMessage && !overviewQuery.isLoading && (
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

                    {isOverviewTab && !overviewQuery.isLoading && !usersErrorMessage && (
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
                                        disabled={addInlineNoteMutation.isPending || !userId}
                                        className="min-w-0 flex-1 bg-transparent text-[16px] text-[#0C0D0F] placeholder:text-[#9CA3AF] outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={submitNote}
                                        disabled={
                                            addInlineNoteMutation.isPending ||
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

                    {swapsDirection && <AdminUserSwapsTable userId={userId} direction={swapsDirection} />}

                    {isSessionsTab && <AdminUserSessionsTable userId={userId} />}

                    {isBadgesTab && <AdminUserBadgesPanel userId={userId} />}

                    {isActivityLogTab && <AdminUserActivityLogPanel userId={userId} />}

                    {!isOverviewTab &&
                        !swapsDirection &&
                        !isSessionsTab &&
                        !isBadgesTab &&
                        !isActivityLogTab && (
                        <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 text-center text-sm text-[#666666]">
                            This section is coming soon.
                        </section>
                    )}

                    {isOverviewTab && overviewQuery.isFetching && !overviewQuery.isLoading && (
                        <p className="text-xs text-[#666666]">Updating user overview...</p>
                    )}

                    <AdminUserActionModals
                        key={`${actionModalState?.type ?? 'none'}-${actionModalState?.user.id ?? 'none'}`}
                        state={actionModalState}
                        pendingType={pendingActionType}
                        errorMessage={actionErrorMessage}
                        adminName={userDisplayName}
                        onClose={closeActionModal}
                        onWarnSubmit={submitWarnUser}
                        onSuspendSubmit={submitSuspendUser}
                        onBanSubmit={submitBanUser}
                        onAdjustPointsSubmit={submitAdjustPoints}
                        onInternalNoteSubmit={submitInternalNote}
                    />
                </main>
            </div>
        </div>
    )
}

export default AdminUserDetailsOverview


