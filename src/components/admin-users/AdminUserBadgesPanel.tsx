import React from 'react'
import { useAdminUserBadges } from '@/hooks/useAdminUserBadges'
import type { AdminUserBadgeItem } from '@/types/adminUsers.types'
import {
    ADMIN_EARNED_BADGE_PRESETS,
    ADMIN_LOCKED_BADGE_ICON_URL,
    type AdminEarnedBadgePreset,
    getAdminEarnedBadgePreset,
    getAdminLockedBadgePreset,
} from './adminBadgeOptionPresets'

const renderEarnedIcon = (preset: AdminEarnedBadgePreset): React.ReactNode => {
    if (preset.iconType === 'single') {
        return <img src={preset.iconMainUrl} alt="" className="h-6 w-6 object-contain" loading="lazy" />
    }

    if (preset.iconType === 'experienced') {
        return (
            <div className="relative h-12 w-12">
                <img
                    src={preset.iconMainUrl}
                    alt=""
                    className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 object-contain"
                    loading="lazy"
                />
                <div className="absolute left-[27.86px] top-[10.5px] flex h-[28.276px] w-[28.276px] items-center justify-center">
                    <div className="rotate-[11.42deg]">
                        <img
                            src={preset.iconAccentRightUrl}
                            alt=""
                            className="h-6 w-6 object-contain"
                            loading="lazy"
                        />
                    </div>
                </div>
                <div className="absolute left-[-14px] top-[10.5px] flex h-[28.276px] w-[28.276px] items-center justify-center">
                    <div className="-scale-y-100 rotate-[168.58deg]">
                        <img
                            src={preset.iconAccentLeftUrl}
                            alt=""
                            className="h-6 w-6 object-contain"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="relative h-12 w-12">
            <img
                src={preset.iconMainUrl}
                alt=""
                className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 object-contain"
                loading="lazy"
            />
            <div className="absolute left-[29px] top-[9.5px] flex h-[28.277px] w-[28.277px] items-center justify-center">
                <div className="rotate-[11.42deg]">
                    <img
                        src={preset.iconAccentRightUrl}
                        alt=""
                        className="h-6 w-6 object-contain"
                        loading="lazy"
                    />
                </div>
            </div>
            <div className="absolute left-[-14px] top-[9.5px] flex h-[28.277px] w-[28.277px] items-center justify-center">
                <div className="-scale-y-100 rotate-[168.58deg]">
                    <img
                        src={preset.iconAccentLeftUrl}
                        alt=""
                        className="h-6 w-6 object-contain"
                        loading="lazy"
                    />
                </div>
            </div>
        </div>
    )
}

const getEarnedSubtitle = (badge: AdminUserBadgeItem): string => {
    const normalizedSubtitle = badge.subtitle.trim()
    if (normalizedSubtitle) return normalizedSubtitle

    const preset = getAdminEarnedBadgePreset(badge.name)
    if (preset) return preset.sessionsLabel

    const normalizedProgress = badge.progress.trim()
    if (normalizedProgress.length > 0 && normalizedProgress !== '100%') return normalizedProgress
    return '--'
}

const toProgressState = (badge: AdminUserBadgeItem): { width: number; label: string } => {
    const normalizedProgress = badge.progress.trim()

    const ratioMatch = normalizedProgress.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/)
    if (ratioMatch) {
        const current = Number(ratioMatch[1])
        const total = Number(ratioMatch[2])
        if (Number.isFinite(current) && Number.isFinite(total) && total > 0) {
            const width = Math.max(0, Math.min(100, (current / total) * 100))
            return {
                width,
                label: `${Math.round(current)} / ${Math.round(total)}`,
            }
        }
    }

    const percentMatch = normalizedProgress.match(/(\d+(?:\.\d+)?)\s*%/)
    if (percentMatch) {
        const percentage = Number(percentMatch[1])
        if (Number.isFinite(percentage)) {
            return {
                width: Math.max(0, Math.min(100, percentage)),
                label: `${Math.round(percentage)}%`,
            }
        }
    }

    if (badge.remainingSessions !== null) {
        return {
            width: 0,
            label: `${badge.remainingSessions} sessions left`,
        }
    }

    const preset = getAdminLockedBadgePreset(badge.name)
    if (preset) {
        return {
            width: preset.sampleProgressWidth,
            label: preset.sampleProgressLabel,
        }
    }

    return {
        width: 0,
        label: normalizedProgress || '--',
    }
}

type AdminUserBadgesPanelProps = {
    userId?: string
}

export const AdminUserBadgesPanel: React.FC<AdminUserBadgesPanelProps> = ({ userId }) => {
    const badgesQuery = useAdminUserBadges(userId)

    if (!userId) {
        return (
            <section className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4">
                <p className="text-sm text-[#B91C1C]">User id is missing.</p>
            </section>
        )
    }

    const earnedBadges = badgesQuery.data?.earned ?? []
    const lockedBadges = badgesQuery.data?.locked ?? []

    if (badgesQuery.isLoading) {
        return (
            <section className="space-y-4">
                <h2 className="h-10 text-[20px] font-semibold text-[#0C0D0F]">User Badges</h2>
                <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-4">
                    <p className="text-sm text-[#666666]">Loading badges...</p>
                </div>
            </section>
        )
    }

    if (badgesQuery.isError) {
        return (
            <section className="space-y-4">
                <h2 className="h-10 text-[20px] font-semibold text-[#0C0D0F]">User Badges</h2>
                <div className="rounded-[12px] border border-[#FECACA] bg-[#FEF2F2] p-4">
                    <p className="text-sm text-[#B91C1C]">Failed to load user badges.</p>
                    <button
                        type="button"
                        onClick={() => badgesQuery.refetch()}
                        className="mt-3 rounded-md bg-[#B91C1C] px-3 py-1.5 text-sm text-white"
                    >
                        Retry
                    </button>
                </div>
            </section>
        )
    }

    return (
        <section className="space-y-4">
            <h2 className="h-10 text-[20px] font-semibold text-[#0C0D0F]">User Badges</h2>

            <article className="rounded-[12px] border border-[#E5E7EB] bg-white p-4">
                <div className="px-4">
                    <div className="inline-flex h-10 items-center border-b-[1.5px] border-[#3272A3]">
                        <h3 className="text-[18px] font-semibold text-[#0C0D0F]">Earned Badges</h3>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                        {earnedBadges.length === 0 ? (
                            <div className="rounded-[10px] border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#666666]">
                                No earned badges.
                            </div>
                        ) : (
                            earnedBadges.map((badge, index) => {
                                const preset = getAdminEarnedBadgePreset(badge.name)
                                const fallbackPreset =
                                    ADMIN_EARNED_BADGE_PRESETS[index % ADMIN_EARNED_BADGE_PRESETS.length]
                                const resolvedPreset = preset ?? fallbackPreset
                                const iconContent =
                                    preset || !badge.icon ? (
                                        renderEarnedIcon(resolvedPreset)
                                    ) : (
                                        <img
                                            src={badge.icon}
                                            alt=""
                                            className="h-6 w-6 object-contain"
                                            loading="lazy"
                                        />
                                    )

                                return (
                                    <div
                                        key={`earned-${badge.id || badge.name}-${index}`}
                                        className="flex h-[180px] w-[180px] flex-col items-center justify-center gap-2 rounded-[12px] border border-[rgba(62,143,204,0.2)] bg-[#F7FAFF] px-4 py-3 text-center"
                                    >
                                        <div
                                            className={`flex size-[80px] items-center justify-center rounded-[999px] ${resolvedPreset.iconCircleClassName}`}
                                        >
                                            {iconContent}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[16px] text-[#0C0D0F]">{badge.name}</p>
                                            <p className="text-[13px] text-[#666666]">
                                                {getEarnedSubtitle(badge)}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </article>

            <article className="rounded-[12px] border border-[#E5E7EB] bg-white p-4">
                <div className="px-4">
                    <div className="inline-flex h-10 items-center border-b-[1.5px] border-[#3272A3]">
                        <h3 className="text-[18px] font-semibold text-[#0C0D0F]">Locked Badges</h3>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                        {lockedBadges.length === 0 ? (
                            <div className="rounded-[10px] border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#666666]">
                                No locked badges.
                            </div>
                        ) : (
                            lockedBadges.map((badge, index) => {
                                const progress = toProgressState(badge)

                                return (
                                    <div
                                        key={`locked-${badge.id || badge.name}-${index}`}
                                        className="flex h-[180px] w-[180px] flex-col items-center justify-center gap-2 rounded-[12px] border border-[#9CA3AF] bg-[#F9FAFB] px-4 py-3 text-center"
                                    >
                                        <div className="flex size-[80px] items-center justify-center rounded-[999px] bg-[#E5E7EB]">
                                            <img
                                                src={ADMIN_LOCKED_BADGE_ICON_URL}
                                                alt=""
                                                className="h-6 w-6 object-contain"
                                                loading="lazy"
                                            />
                                        </div>
                                        <p className="text-[16px] text-[#0C0D0F]">{badge.name}</p>
                                        <div className="w-full">
                                            <div className="h-[6px] w-full rounded-[10px] bg-[#E5E7EB]">
                                                <div
                                                    className="h-[6px] rounded-[10px] bg-[#9CA3AF]"
                                                    style={{ width: `${progress.width}%` }}
                                                />
                                            </div>
                                        </div>
                                        <p className="text-[13px] text-[#666666]">{progress.label}</p>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </article>

            {badgesQuery.isFetching && <p className="text-xs text-[#666666]">Updating badges...</p>}
        </section>
    )
}

export default AdminUserBadgesPanel
