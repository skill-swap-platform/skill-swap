import React, { useState } from 'react'
import { Plus, Filter as FilterIcon, Search, Users, TrendingUp, Award, Activity } from 'lucide-react'
import { Button } from '@/components/common'
import {
    UserListItem,
    FilterPanel,
    PointsModal,
    ManageBadgeModal,
    CreateBadgeModal,
} from '@/components/gamification'
import { useAllBadges, useLeaderboard } from '@/hooks'
import type { PointsBreakdown } from '@/types'

export const PointsAndBadges: React.FC = () => {
    const [showFilter, setShowFilter] = useState(false)
    const [showCreateBadge, setShowCreateBadge] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedUser, setSelectedUser] = useState<{
        id: string
        name: string
        avatar?: string
    } | null>(null)
    const [modalType, setModalType] = useState<'points' | 'badges' | null>(null)

    const [filters, setFilters] = useState({
        pointsRange: undefined as { min: number; max: number | null } | undefined,
        badges: [] as string[],
        timeRange: 'all_time' as string,
    })


    const { data: leaderboardData, isLoading: isLoadingLeaderboard } = useLeaderboard({
        timeRange: filters.timeRange as any,
        limit: 50,
    })

    const { data: allBadges } = useAllBadges()

    const handleEditPoints = (userId: string, userName: string, avatar?: string) => {
        setSelectedUser({ id: userId, name: userName, avatar })
        setModalType('points')
    }

    const handleManageBadges = (userId: string, userName: string, avatar?: string) => {
        setSelectedUser({ id: userId, name: userName, avatar })
        setModalType('badges')
    }

    const handleResetFilters = () => {
        setFilters({
            pointsRange: undefined,
            badges: [],
            timeRange: 'all_time',
        })
    }

    // Mock points breakdown
    const mockPointsBreakdown: PointsBreakdown = {
        sessionPoints: 800,
        ratingPoints: 300,
        feedbackPoints: 158,
        bonusPoints: 100,
        total: 1358,
        breakdown: [
            { type: 'SESSION_COMPLETED', count: 80, totalPoints: 800 },
            { type: 'SESSION_RATED', count: 60, totalPoints: 300 },
            { type: 'FEEDBACK_GIVEN', count: 79, totalPoints: 158 },
            { type: 'CONSECUTIVE_DAY_BONUS', count: 20, totalPoints: 100 },
        ],
    }
    const statsData = [
        {
            label: 'Total Users',
            value: leaderboardData?.entries.length || 2586,
            icon: Users,
            bgColor: 'bg-[#EBF5FF]',
            iconColor: 'text-[#3E8FCC]',
        },
        {
            label: 'Points Issued',
            value: '2000',
            icon: TrendingUp,
            bgColor: 'bg-[#FFE8E8]',
            iconColor: 'text-[#FF6B6B]',
        },
        {
            label: 'Badge Awarded',
            value: '256',
            icon: Award,
            bgColor: 'bg-[#E8F5E9]',
            iconColor: 'text-[#4CAF50]',
        },
        {
            label: 'Engagement',
            value: '85%',
            icon: Activity,
            bgColor: 'bg-[#FFF4E6]',
            iconColor: 'text-[#FF9800]',
        },
    ]

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            <div className="bg-white border-b border-[#E5E7EB]">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="text-sm text-[#666666] mb-4">
                        Dashboard <span className="mx-2">›</span>
                        <span className="text-[#3E8FCC]">Points & Badges Management</span>
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


