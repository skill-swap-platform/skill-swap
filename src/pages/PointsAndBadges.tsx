import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronDown, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Avatar from '@/components/Avatar/Avatar'
import {
    ADMIN_EARNED_BADGE_PRESETS,
    getAdminEarnedBadgePreset,
    type AdminEarnedBadgePreset,
} from '@/components/admin-users/adminBadgeOptionPresets'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { authService } from '@/api/services/auth.service'
import { userService } from '@/api/services/user.service'
import { adminService, type AdminBadgeManagementItem } from '@/api/services/admin.service'
import type { UserAuthDto } from '@/types/api.types'

const DEFAULT_AVATAR_URL = 'https://api.dicebear.com/7.x/notionists/svg?seed=currentuser'
const BADGES_QUERY_KEY = ['admin-badges-management'] as const
const FIGMA_MODAL_CLOSE_ICON_URL = 'https://www.figma.com/api/mcp/asset/f2f83ba8-0faf-4c39-99fa-5103a5fbbcdf'

const badgeDesignByKey: Record<
    string,
    {
        mainIcon: string
        iconCircleClassName: string
        lineAsset: string
        editIcon: string
        rightAccentIcon?: string
        leftAccentIcon?: string
        rightAccentStyle?: { left: string; top: string; size: string }
        leftAccentStyle?: { left: string; top: string; size: string }
    }
> = {
    firstexchange: {
        mainIcon: '/assets/badges/first-exchange.svg',
        iconCircleClassName: 'bg-[rgba(62,143,204,0.1)]',
        lineAsset: 'https://www.figma.com/api/mcp/asset/a3f6e66f-dbb5-4818-b14d-d191228bb021',
        editIcon: 'https://www.figma.com/api/mcp/asset/54813953-3c1e-4e35-9807-f14be1b82ec0',
    },
    activemember: {
        mainIcon: '/assets/badges/active-member.svg',
        iconCircleClassName: 'bg-[rgba(52,199,89,0.1)]',
        lineAsset: 'https://www.figma.com/api/mcp/asset/f00d5aa7-06ea-4d3a-9ff9-accb3dbbbd47',
        editIcon: 'https://www.figma.com/api/mcp/asset/b676a790-562d-4d29-a831-736dd78046d8',
    },
    skillexchanger: {
        mainIcon: '/assets/badges/skill-exchanger.svg',
        iconCircleClassName: 'bg-[rgba(0,199,190,0.1)]',
        lineAsset: 'https://www.figma.com/api/mcp/asset/73628c8c-e35c-465f-9264-3d8fea7e37f4',
        editIcon: 'https://www.figma.com/api/mcp/asset/2c7b404f-3afd-475a-a56d-7de849869f5f',
    },
    experienced: {
        mainIcon: '/assets/badges/experienced.svg',
        iconCircleClassName: 'bg-[rgba(88,86,214,0.1)]',
        lineAsset: 'https://www.figma.com/api/mcp/asset/87e6ba86-4649-48ab-8396-60e581583b85',
        editIcon: 'https://www.figma.com/api/mcp/asset/96dc7240-d246-459d-9952-6185362a1907',
    },
    corecontributor: {
        mainIcon: '/assets/badges/core-contributor.svg',
        iconCircleClassName: 'bg-[rgba(255,204,0,0.1)]',
        lineAsset: 'https://www.figma.com/api/mcp/asset/421b72f8-dd69-4130-bc1d-afc001ff6636',
        editIcon: 'https://www.figma.com/api/mcp/asset/04673e88-bcc2-455b-99a6-ae812dbee96b',
    },
}

const normalizeKey = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]/g, '')

const parseRequirementFromLabel = (label: string): number => {
    const match = label.match(/\d+/)
    if (!match) return 1
    const value = Number(match[0])
    return Number.isFinite(value) && value > 0 ? value : 1
}

const toPluralSessionsLabel = (requirement: number): string =>
    requirement === 1 ? 'completed session' : 'completed sessions'

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
        const joined = message.filter((entry) => typeof entry === 'string').join(', ')
        if (joined.length > 0) return joined
    }

    return fallback
}

const PageBadgesTitleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
    >
        <path
            d="M15.8333 7.50002C15.8333 8.70835 15.475 9.8167 14.8583 10.7417C13.9583 12.075 12.5333 13.0167 10.875 13.2584C10.5917 13.3084 10.3 13.3334 9.99999 13.3334C9.69999 13.3334 9.40832 13.3084 9.12499 13.2584C7.46666 13.0167 6.04166 12.075 5.14166 10.7417C4.52499 9.8167 4.16666 8.70835 4.16666 7.50002C4.16666 4.27502 6.77499 1.66669 9.99999 1.66669C13.225 1.66669 15.8333 4.27502 15.8333 7.50002Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M17.7083 15.3917L16.3333 15.7167C16.025 15.7917 15.7833 16.025 15.7167 16.3333L15.425 17.5583C15.2667 18.225 14.4167 18.425 13.975 17.9L10 13.3333L6.02499 17.9083C5.58333 18.4333 4.73333 18.2333 4.57499 17.5667L4.28333 16.3417C4.20833 16.0333 3.96666 15.7917 3.66666 15.725L2.29166 15.4C1.65833 15.25 1.43333 14.4583 1.89166 14L5.14166 10.75C6.04166 12.0833 7.46666 13.025 9.12499 13.2667C9.40833 13.3167 9.7 13.3417 10 13.3417C10.3 13.3417 10.5917 13.3167 10.875 13.2667C12.5333 13.025 13.9583 12.0833 14.8583 10.75L18.1083 14C18.5667 14.45 18.3417 15.2417 17.7083 15.3917Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M10.4833 4.98331L10.975 5.96664C11.0417 6.09997 11.2167 6.23331 11.375 6.25831L12.2667 6.40831C12.8333 6.49997 12.9667 6.91664 12.5583 7.32498L11.8667 8.01663C11.75 8.1333 11.6833 8.35831 11.725 8.52498L11.925 9.38331C12.0833 10.0583 11.725 10.325 11.125 9.96663L10.2917 9.47497C10.1417 9.3833 9.89166 9.3833 9.74166 9.47497L8.90833 9.96663C8.30833 10.3166 7.95 10.0583 8.10833 9.38331L8.30833 8.52498C8.34166 8.36665 8.28333 8.1333 8.16666 8.01663L7.475 7.32498C7.06666 6.91664 7.2 6.50831 7.76666 6.40831L8.65833 6.25831C8.80833 6.23331 8.98333 6.09997 9.05 5.96664L9.54166 4.98331C9.78333 4.44998 10.2167 4.44998 10.4833 4.98331Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

type BadgeViewModel = {
    badge: AdminBadgeManagementItem
    preset?: AdminEarnedBadgePreset
    requirement: number
    key: string
    displayName: string
    canEdit: boolean
}

const BadgeVisual: React.FC<{ entry: BadgeViewModel; size: 'card' | 'modal' }> = ({ entry, size }) => {
    const design = badgeDesignByKey[entry.key]
    const iconUrl = design?.mainIcon || entry.badge.icon || entry.preset?.iconMainUrl || null
    const circleClassName = design?.iconCircleClassName || entry.preset?.iconCircleClassName || 'bg-[rgba(62,143,204,0.1)]'
    const circleSizeClassName = size === 'card' ? 'size-[80px]' : 'size-16'
    const iconSizeClassName =
        size === 'card'
            ? 'h-auto w-auto max-h-8 max-w-[70px] object-contain'
            : 'h-auto w-auto max-h-6 max-w-[56px] object-contain'
    const hasAccents = Boolean(design?.rightAccentIcon && design.leftAccentIcon)

    const rightAccentStyle = size === 'card'
        ? {
            left: design?.rightAccentStyle?.left ?? '45.86px',
            top: design?.rightAccentStyle?.top ?? '28.5px',
            width: design?.rightAccentStyle?.size ?? '28.276px',
            height: design?.rightAccentStyle?.size ?? '28.276px',
        }
        : { left: '37px', top: '20px', width: '22px', height: '22px' }

    const leftAccentStyle = size === 'card'
        ? {
            left: design?.leftAccentStyle?.left ?? '4px',
            top: design?.leftAccentStyle?.top ?? '28.5px',
            width: design?.leftAccentStyle?.size ?? '28.276px',
            height: design?.leftAccentStyle?.size ?? '28.276px',
        }
        : { left: '1px', top: '20px', width: '22px', height: '22px' }

    return (
        <div className={`relative flex items-center justify-center rounded-full p-4 ${circleClassName} ${circleSizeClassName}`}>
            {iconUrl ? <img src={iconUrl} alt="" className={iconSizeClassName} /> : <PageBadgesTitleIcon className={iconSizeClassName} />}

            {hasAccents ? (
                <>
                    <div className="absolute flex items-center justify-center" style={rightAccentStyle}>
                        <div className="rotate-[11.42deg]">
                            <img src={design?.rightAccentIcon} alt="" className={size === 'card' ? 'size-6' : 'size-5'} />
                        </div>
                    </div>
                    <div className="absolute flex items-center justify-center" style={leftAccentStyle}>
                        <div className="-scale-y-100 rotate-[168.58deg]">
                            <img src={design?.leftAccentIcon} alt="" className={size === 'card' ? 'size-6' : 'size-5'} />
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    )
}

export const PointsAndBadges: React.FC = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    const [profileMenuOpen, setProfileMenuOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null)
    const [requiredSessions, setRequiredSessions] = useState(1)
    const [modalError, setModalError] = useState<string | null>(null)
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
    const [currentUser, setCurrentUser] = useState<UserAuthDto | null>(() => getStoredUser())

    const profileMenuRef = useRef<HTMLDivElement>(null)

    const badgesQuery = useQuery({
        queryKey: BADGES_QUERY_KEY,
        queryFn: () => adminService.getBadges(),
    })

    const updateRequirementMutation = useMutation({
        mutationFn: ({ badgeId, requirement }: { badgeId: string; requirement: number }) =>
            adminService.updateBadgeRequirement(badgeId, requirement),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: BADGES_QUERY_KEY })
            setFeedbackMessage('Requirement updated successfully.')
            setIsEditModalOpen(false)
            setSelectedBadgeId(null)
            setModalError(null)
        },
        onError: (error: unknown) => {
            setModalError(getErrorMessage(error, 'Failed to update badge requirement.'))
        },
    })

    const badges = useMemo<BadgeViewModel[]>(() => {
        const source = badgesQuery.data ?? []
        const sourceMap = new Map(source.map((badge) => [normalizeKey(badge.name), badge] as const))

        const fromPresets = ADMIN_EARNED_BADGE_PRESETS.map((preset): BadgeViewModel => {
            const key = normalizeKey(preset.name)
            const apiBadge = sourceMap.get(key)
            const fallbackRequirement = parseRequirementFromLabel(preset.sessionsLabel)

            return {
                key,
                preset,
                displayName: preset.name,
                requirement: apiBadge?.requirement && apiBadge.requirement > 0 ? apiBadge.requirement : fallbackRequirement,
                canEdit: Boolean(apiBadge?.id),
                badge: {
                    id: apiBadge?.id ?? '',
                    name: apiBadge?.name ?? preset.name,
                    icon: apiBadge?.icon ?? null,
                    requirement: apiBadge?.requirement ?? fallbackRequirement,
                    usersCount: apiBadge?.usersCount ?? 0,
                },
            }
        })

        const knownKeys = new Set(fromPresets.map((item) => item.key))
        const extras = source
            .filter((badge) => !knownKeys.has(normalizeKey(badge.name)))
            .map((badge): BadgeViewModel => {
                const key = normalizeKey(badge.name)
                const preset = getAdminEarnedBadgePreset(badge.name)
                const fallbackRequirement = preset ? parseRequirementFromLabel(preset.sessionsLabel) : 1
                return {
                    key,
                    preset,
                    displayName: badge.name,
                    requirement: badge.requirement > 0 ? badge.requirement : fallbackRequirement,
                    canEdit: Boolean(badge.id),
                    badge,
                }
            })

        return [...fromPresets, ...extras]
    }, [badgesQuery.data])

    const selectedBadge = useMemo(
        () => badges.find((entry) => entry.badge.id === selectedBadgeId) ?? null,
        [badges, selectedBadgeId]
    )

    useEffect(() => {
        if (!isMobileSidebarOpen) {
            document.body.classList.remove('overflow-hidden')
            return
        }
        document.body.classList.add('overflow-hidden')
        return () => document.body.classList.remove('overflow-hidden')
    }, [isMobileSidebarOpen])

    useEffect(() => {
        if (!isEditModalOpen) return
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = previousOverflow
        }
    }, [isEditModalOpen])

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
                    role: storedUser?.role || 'USER',
                    image: response.data.image ?? null,
                    isActive: storedUser?.isActive ?? true,
                    isVerified: storedUser?.isVerified ?? true,
                }
                setCurrentUser(updatedUser)
                localStorage.setItem('user', JSON.stringify(updatedUser))
            } catch {
                // Keep cached user.
            }
        }

        loadCurrentUser()
        return () => {
            mounted = false
        }
    }, [])

    useEffect(() => {
        if (!feedbackMessage) return
        const timeoutId = window.setTimeout(() => setFeedbackMessage(null), 3000)
        return () => window.clearTimeout(timeoutId)
    }, [feedbackMessage])

    const openEditModal = (entry: BadgeViewModel) => {
        setSelectedBadgeId(entry.badge.id)
        setRequiredSessions(entry.requirement)
        setModalError(null)
        setIsEditModalOpen(true)
    }

    const adjustRequirement = (delta: number) => {
        setRequiredSessions((previous) => Math.max(1, previous + delta))
    }

    const handleRequirementInput = (rawValue: string) => {
        const digitsOnly = rawValue.replace(/[^\d]/g, '')
        if (!digitsOnly) {
            setRequiredSessions(1)
            return
        }

        const parsed = Number(digitsOnly)
        if (!Number.isFinite(parsed)) return
        setRequiredSessions(Math.max(1, parsed))
    }

    const handleSaveRequirement = () => {
        if (!selectedBadge) return
        if (!selectedBadge.badge.id) {
            setModalError('Badge id is missing. Cannot update this badge.')
            return
        }
        updateRequirementMutation.mutate({
            badgeId: selectedBadge.badge.id,
            requirement: Math.max(1, requiredSessions),
        })
    }

    const handleLogout = async () => {
        setProfileMenuOpen(false)
        await authService.logout()
        navigate('/auth/login')
    }

    const userDisplayName = currentUser?.userName?.trim() || currentUser?.email?.split('@')[0] || 'User Name'
    const userAvatar = currentUser?.image?.trim() || DEFAULT_AVATAR_URL
    const userRole = currentUser?.role ? currentUser.role.toLowerCase() : 'admin'

    return (
        <div className="min-h-screen bg-[#F9F9F9]">
            <AdminSidebar mobileOpen={isMobileSidebarOpen} onMobileClose={() => setIsMobileSidebarOpen(false)} />

            <div className="md:ml-[236px]">
                <header className="flex h-[80px] items-center justify-between border-b border-[#F3F4F6] bg-white px-4 md:justify-end md:px-6">
                    <div className="flex items-center gap-3 md:hidden">
                        <button type="button" onClick={() => setIsMobileSidebarOpen(true)} className="rounded-lg p-2 text-[#1C1C1C] hover:bg-[#F3F4F6]" aria-label="Open menu">
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
                            <button type="button" onClick={() => setProfileMenuOpen((previous) => !previous)} className="flex items-center gap-2">
                                <Avatar src={userAvatar} name={userDisplayName} size={40} />
                                <div className="hidden text-left sm:block">
                                    <p className="text-sm text-[#0C0D0F]">{userDisplayName}</p>
                                    <p className="text-xs capitalize text-[#666666]">{userRole}</p>
                                </div>
                                <ChevronDown className={`h-4 w-4 text-[#666666] transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {profileMenuOpen && (
                                <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-xl border border-[#E8E8E8] bg-white py-1 shadow-lg">
                                    <button type="button" onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="space-y-4 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <PageBadgesTitleIcon className="size-6 text-[#3272A3]" />
                        <h1 className="text-[28px] font-bold text-[#0C0D0F]">Badges Management</h1>
                    </div>

                    <div className="flex flex-col items-start gap-4 py-4">
                        <div className="inline-flex h-10 items-center border-b-[1.5px] border-[#3272A3]">
                            <h2 className="whitespace-nowrap text-[20px] font-semibold text-[#0C0D0F]">Badges Management</h2>
                        </div>

                        {badgesQuery.isLoading && <div className="rounded-[12px] border border-[#E5E7EB] p-6 text-sm text-[#666666]">Loading badges...</div>}

                        {badgesQuery.isError && (
                            <div className="rounded-[12px] border border-[#FECACA] bg-[#FEF2F2] p-4">
                                <p className="text-sm text-[#B91C1C]">{getErrorMessage(badgesQuery.error, 'Failed to load badges management data.')}</p>
                                <button type="button" onClick={() => badgesQuery.refetch()} className="mt-3 rounded-md bg-[#B91C1C] px-3 py-1.5 text-sm text-white">
                                    Retry
                                </button>
                            </div>
                        )}

                        {!badgesQuery.isLoading && !badgesQuery.isError && (
                            <section className="flex flex-col gap-4">
                                <div className="flex flex-wrap items-center gap-4">
                                    {badges.slice(0, 4).map((entry) => {
                                        const design = badgeDesignByKey[entry.key]
                                        return (
                                            <article key={`${entry.key}-${entry.badge.id || 'fallback'}`} className="w-[271px] rounded-[12px] border border-[#E5E7EB] bg-white p-4">
                                                <div className="flex flex-col items-center gap-4">
                                                    <BadgeVisual entry={entry} size="card" />
                                                    <div className="flex flex-col items-center gap-2 text-center leading-normal">
                                                        <h3 className="text-[16px] font-medium text-[#0C0D0F]">{entry.displayName}</h3>
                                                        <p className="h-[31px] w-[181px] text-[13px] text-[#666666]">{`Unlocked after ${entry.requirement} ${toPluralSessionsLabel(entry.requirement)}`}</p>
                                                    </div>

                                                    <p className="w-full text-[12px] text-[#666666]">
                                                        Earned by <span className="font-semibold text-[#0C0D0F]">{entry.badge.usersCount}</span> users
                                                    </p>

                                                    <div className="relative h-0 w-full">
                                                        <div className="absolute inset-[-1px_0_0_0]">
                                                            <img src={design?.lineAsset} alt="" className="block size-full max-w-none" />
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(entry)}
                                                        disabled={!entry.canEdit}
                                                        className="flex w-full items-center justify-center gap-2 text-[16px] font-medium text-[#3272A3] disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <img src={design?.editIcon} alt="" className="size-4" />
                                                        Edit Condition
                                                    </button>
                                                </div>
                                            </article>
                                        )
                                    })}
                                </div>

                                {badges.slice(4, 5).length > 0 ? (
                                    <div className="flex w-[288px] items-center">
                                        {badges.slice(4, 5).map((entry) => {
                                            const design = badgeDesignByKey[entry.key]
                                            return (
                                                <article key={`${entry.key}-${entry.badge.id || 'fallback'}`} className="w-[271px] rounded-[12px] border border-[#E5E7EB] bg-white p-4">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <BadgeVisual entry={entry} size="card" />
                                                        <div className="flex flex-col items-center gap-2 text-center leading-normal">
                                                            <h3 className="text-[16px] font-medium text-[#0C0D0F]">{entry.displayName}</h3>
                                                            <p className="h-[31px] w-[181px] text-[13px] text-[#666666]">{`Unlocked after ${entry.requirement} ${toPluralSessionsLabel(entry.requirement)}`}</p>
                                                        </div>
                                                        <p className="w-full text-[12px] text-[#666666]">
                                                            Earned by <span className="font-semibold text-[#0C0D0F]">{entry.badge.usersCount}</span> users
                                                        </p>
                                                        <div className="relative h-0 w-full">
                                                            <div className="absolute inset-[-1px_0_0_0]">
                                                                <img src={design?.lineAsset} alt="" className="block size-full max-w-none" />
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditModal(entry)}
                                                            disabled={!entry.canEdit}
                                                            className="flex w-full items-center justify-center gap-2 text-[16px] font-medium text-[#3272A3] disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <img src={design?.editIcon} alt="" className="size-4" />
                                                            Edit Condition
                                                        </button>
                                                    </div>
                                                </article>
                                            )
                                        })}
                                    </div>
                                ) : null}
                            </section>
                        )}
                    </div>

                    {feedbackMessage && (
                        <div className="rounded-[10px] border border-[rgba(22,163,74,0.3)] bg-[rgba(22,163,74,0.08)] px-4 py-3">
                            <p className="text-sm text-[#166534]">{feedbackMessage}</p>
                        </div>
                    )}
                </main>
            </div>

            {isEditModalOpen && selectedBadge && (
                <div
                    className="fixed inset-0 z-50 flex items-start justify-center bg-[rgba(94,95,96,0.2)] p-4 pt-24 md:pt-[300px]"
                    onClick={() => {
                        if (!updateRequirementMutation.isPending) setIsEditModalOpen(false)
                    }}
                >
                    <div
                        className="w-full max-w-[400px] rounded-[10px] border border-[#E5E7EB] bg-white shadow-[0px_0px_4.7px_0px_rgba(0,0,0,0.25)]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-center gap-[10px] rounded-tl-[10px] rounded-tr-[10px] border border-[#F3F4F6] pl-4 py-4 pr-3">
                            <h3 className="flex-1 text-[16px] font-semibold text-[#0C0D0F]">Edit Badge condition</h3>
                            <button type="button" onClick={() => setIsEditModalOpen(false)} disabled={updateRequirementMutation.isPending} className="rounded-full p-1 text-[#666666] hover:bg-[#F3F4F6]">
                                <img src={FIGMA_MODAL_CLOSE_ICON_URL} alt="Close" className="size-6" />
                            </button>
                        </div>

                        <div className="space-y-5 p-4">
                            <div className="flex items-center gap-2">
                                <BadgeVisual entry={selectedBadge} size="modal" />
                                <div className="flex flex-col gap-2">
                                    <p className="text-[16px] font-semibold text-[#0C0D0F]">{selectedBadge.badge.name}</p>
                                    <p className="text-[13px] text-[#666666]">Configure how this badge is earned</p>
                                </div>
                            </div>

                            <div className="border-b border-[#F3F4F6] pb-4">
                                <div className="flex flex-wrap items-center gap-2 px-2">
                                    <p className="w-[198px] text-[14px] text-[#0C0D0F]">Required completed sessions:</p>
                                    <div className="flex h-8 items-center">
                                        <div className="flex h-full w-12 items-center justify-center rounded-l-[8px] border border-r-0 border-[#DADADA]">
                                            <input
                                                type="text"
                                                value={requiredSessions}
                                                inputMode="numeric"
                                                onChange={(event) => handleRequirementInput(event.target.value)}
                                                className="w-full bg-transparent text-center text-[14px] font-medium text-[#272727] outline-none"
                                            />
                                        </div>
                                        <div className="flex h-full w-9 flex-col items-center justify-center rounded-r-[8px] border border-[#E5E7EB] bg-[#F9FAFB]">
                                            <button
                                                type="button"
                                                onClick={() => adjustRequirement(1)}
                                                className="flex h-4 w-4 items-center justify-center text-[#666666] hover:text-[#0C0D0F]"
                                                aria-label="Increase required sessions"
                                            >
                                                <svg width="8" height="5" viewBox="0 0 8 5" fill="none" aria-hidden="true">
                                                    <path d="M1 4L4 1L7 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => adjustRequirement(-1)}
                                                className="flex h-4 w-4 items-center justify-center text-[#666666] hover:text-[#0C0D0F]"
                                                aria-label="Decrease required sessions"
                                            >
                                                <svg width="8" height="5" viewBox="0 0 8 5" fill="none" aria-hidden="true">
                                                    <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <p className="px-2 pt-2 text-[13px] text-[#666666]">Badge will be awarded once the user completes this number of sessions.</p>
                            </div>

                            {modalError && <p className="rounded-md bg-[#FEF2F2] px-3 py-2 text-sm text-[#B91C1C]">{modalError}</p>}

                            <div className="flex items-center justify-end gap-4">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} disabled={updateRequirementMutation.isPending} className="text-[14px] font-semibold text-[#666666]">
                                    Cancel
                                </button>
                                <button type="button" onClick={handleSaveRequirement} disabled={updateRequirementMutation.isPending} className="h-8 w-[173px] rounded-[10px] text-[14px] text-white" style={{ backgroundImage: 'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(62, 143, 204) 0%, rgb(62, 143, 204) 100%)' }}>
                                    {updateRequirementMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
