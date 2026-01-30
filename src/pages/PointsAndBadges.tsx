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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {statsData.map((stat) => {
                            const IconComponent = stat.icon
                            return (
                                <div
                                    key={stat.label}
                                    className="bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-sm"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-[#666666] mb-1">{stat.label}</p>
                                            <p className="text-2xl font-bold text-[#0C0D0F] font-poppins">
                                                {stat.value}
                                            </p>
                                            <p className="text-xs text-[#9CA3AF] mt-1">
                                                <span className="text-[#16A34A]">1%</span> Up from yesterday
                                            </p>
                                        </div>
                                        <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                                            <IconComponent className={`w-6 h-6 ${stat.iconColor}`} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                        <input
                            type="text"
                            placeholder="Search by name or email"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 rounded-lg border border-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#3E8FCC] focus:border-transparent bg-white"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            leftIcon={<FilterIcon className="w-4 h-4" />}
                            onClick={() => setShowFilter(true)}
                            className="bg-white border border-[#E5E7EB] text-[#0C0D0F] hover:bg-[#F9FAFB]"
                        >
                            Filter
                        </Button>
                        <Button
                            variant="primary"
                            leftIcon={<Plus className="w-4 h-4" />}
                            onClick={() => setShowCreateBadge(true)}
                            className="bg-[#3E8FCC] hover:bg-[#2F71A3]"
                        >
                            Create Badge
                        </Button>
                    </div>
                </div>

                {isLoadingLeaderboard ? (
                    <div className="text-center py-12">
                        <p className="text-[#666666]">Loading users...</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {leaderboardData?.entries.map((entry) => (
                            <UserListItem
                                key={entry.userId}
                                userName={entry.userName}
                                userAvatar={entry.userAvatar}
                                totalPoints={entry.totalPoints}
                                badges={entry.badges}
                                rank={entry.rank}
                                onEditPoints={() => handleEditPoints(entry.userId, entry.userName, entry.userAvatar)}
                                onManageBadges={() => handleManageBadges(entry.userId, entry.userName, entry.userAvatar)}
                            />
                        ))}
                    </div>
                )}
                {leaderboardData && leaderboardData.entries.length > 0 && (
                    <div className="flex items-center justify-between mt-6">
                        <p className="text-sm text-[#666666]">
                            Showing 12 of 275
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-2 text-sm text-[#666666] hover:bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                                ‹
                            </button>
                            <button className="px-3 py-2 text-sm bg-[#3E8FCC] text-white rounded-lg">1</button>
                            <button className="px-3 py-2 text-sm text-[#666666] hover:bg-[#F9FAFB] rounded-lg">2</button>
                            <button className="px-3 py-2 text-sm text-[#666666] hover:bg-[#F9FAFB] rounded-lg">3</button>
                            <button className="px-3 py-2 text-sm text-[#666666] hover:bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                                ›
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <FilterPanel
                isOpen={showFilter}
                onClose={() => setShowFilter(false)}
                filters={filters}
                onFiltersChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
                onReset={handleResetFilters}
            />
            {modalType === 'points' && selectedUser && (
                <PointsModal
                    isOpen={true}
                    onClose={() => {
                        setModalType(null)
                        setSelectedUser(null)
                    }}
                    userName={selectedUser.name}
                    userAvatar={selectedUser.avatar}
                    currentPoints={mockPointsBreakdown.total}
                />
            )}
            {modalType === 'badges' && selectedUser && allBadges && (
                <ManageBadgeModal
                    isOpen={true}
                    onClose={() => {
                        setModalType(null)
                        setSelectedUser(null)
                    }}
                    userName={selectedUser.name}
                    userAvatar={selectedUser.avatar}
                    availableBadges={allBadges}
                    userBadges={[]}
                    onAssignBadge={(badgeId) => console.log('Assign badge:', badgeId)}
                    onRemoveBadge={(badgeId) => console.log('Remove badge:', badgeId)}
                />
            )}
            <CreateBadgeModal
                isOpen={showCreateBadge}
                onClose={() => setShowCreateBadge(false)}
                onSubmit={(data) => {
                    console.log('Create badge:', data)
                    setShowCreateBadge(false)
                }}
            />
        </div>
    )
}
