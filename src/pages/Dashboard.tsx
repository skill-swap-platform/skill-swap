import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    PointsWidget,
    BadgesShowcase,
    RecentAchievements,
    AchievementsWidget,
} from '@/components/dashboard/index'
import { useUserPoints, useUserBadges, useAllBadges } from '@/hooks/index'
import { ArrowRight, Target, Search } from 'lucide-react'

export const Dashboard: React.FC = () => {
    const navigate = useNavigate()

    // Replace with actual user ID
    const userId = 'current-user-id'

    const { data: pointsData } = useUserPoints(userId)
    const { data: userBadges } = useUserBadges(userId)
    const { data: allBadges } = useAllBadges()

    // Mock recent achievements
    const mockAchievements = [
        {
            id: '1',
            type: 'badge' as const,
            title: 'Community Hero Badge Unlocked!',
            description: 'You helped 100+ community members',
            icon: '⭐',
            color: '#F59E0B',
            timestamp: new Date('2024-01-20'),
        },
        {
            id: '2',
            type: 'points' as const,
            title: 'Earned 50 Points',
            description: 'Completed 5 sessions this week',
            timestamp: new Date('2024-01-19'),
        },
        {
            id: '3',
            type: 'milestone' as const,
            title: 'Reached 1000 Points!',
            description: 'You are now in the top 10%',
            timestamp: new Date('2024-01-18'),
        },
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-700 sm:space-y-8 lg:space-y-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                <div className="relative w-full lg:max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                    <input
                        type="text"
                        placeholder="Search for skills, sessions, or achievements..."
                        className="h-12 w-full rounded-2xl border border-[#E5E7EB] bg-white pl-12 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-[#3E8FCC] sm:h-14 sm:pr-6 sm:text-base"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:justify-end">
                    <div className="flex -space-x-2 sm:-space-x-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-[#F3F4F6] sm:h-10 sm:w-10">
                                <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Avatar" />
                            </div>
                        ))}
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#3E8FCC] text-[10px] font-bold text-white sm:h-10 sm:w-10">
                            +12
                        </div>
                    </div>
                    <p className="flex items-center text-sm font-medium text-[#666666]">
                        Community is active
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="space-y-6 lg:space-y-8">
                    <PointsWidget
                        totalPoints={pointsData?.totalPoints || 0}
                        lifetimePoints={pointsData?.lifetimePoints}
                        currentRank={pointsData?.currentRank}
                        pointsToNextRank={pointsData?.pointsToNextRank}
                        recentPointsGained={50}
                        className="rounded-[32px] overflow-hidden border-[#E5E7EB] shadow-sm transform hover:scale-[1.01] transition-all"
                    />

                    <AchievementsWidget
                        totalBadges={userBadges?.length || 0}
                        totalPoints={pointsData?.totalPoints || 0}
                        completedSessions={80}
                        consecutiveDays={7}
                        nextMilestone={{
                            label: '100 Sessions Milestone',
                            current: 80,
                            target: 100,
                        }}
                        className="rounded-[32px] overflow-hidden border-[#E5E7EB] shadow-sm"
                    />

                    <RecentAchievements
                        achievements={mockAchievements}
                        onViewAll={() => navigate('/session-history')}
                        className="rounded-[32px] overflow-hidden border-[#E5E7EB] shadow-sm"
                    />
                </div>

                <div className="space-y-6 lg:space-y-8">
                    <BadgesShowcase
                        userBadges={userBadges || []}
                        totalBadges={allBadges?.length}
                        onViewAll={() => navigate('/points-badges')}
                        className="rounded-[32px] overflow-hidden border-[#E5E7EB] shadow-sm"
                    />

                    <div className="group rounded-[32px] border border-[#E5E7EB] bg-[#FFFFFF] p-5 shadow-sm sm:p-6 lg:p-8">
                        <h3 className="mb-6 text-lg font-bold text-[#0C0D0F] sm:mb-8 sm:text-xl">
                            Quick Actions
                        </h3>
                        <div className="space-y-3 sm:space-y-4">
                            <button
                                onClick={() => navigate('/sessions')}
                                className="group flex w-full items-center justify-between rounded-2xl border border-[#3E8FCC]/10 bg-[#3E8FCC]/5 p-4 text-left transition-all duration-300 hover:bg-[#3E8FCC] hover:text-white sm:p-6"
                            >
                                <div className="text-left">
                                    <p className="font-bold mb-0.5">Start New Session</p>
                                    <p className="text-xs text-[#666666] group-hover:text-white/80 transition-colors">Exchange skills with others</p>
                                </div>
                                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>

                            <button
                                onClick={() => navigate('/session-history')}
                                className="w-full rounded-2xl border border-transparent bg-[#F9FAFB] p-4 text-left transition-all hover:border-[#E5E7EB] hover:bg-white sm:p-6"
                            >
                                <p className="font-bold text-[#0C0D0F] mb-0.5">View History</p>
                                <p className="text-xs text-[#666666]">See past sessions</p>
                            </button>

                            <button
                                onClick={() => navigate('/profile')}
                                className="w-full rounded-2xl border border-transparent bg-[#F9FAFB] p-4 text-left transition-all hover:border-[#E5E7EB] hover:bg-white sm:p-6"
                            >
                                <p className="font-bold text-[#0C0D0F] mb-0.5">My Profile</p>
                                <p className="text-xs text-[#666666]">Track your latest progress</p>
                            </button>
                        </div>

                        <div className="mt-6 border-t border-[#F3F4F6] pt-6 sm:mt-8 sm:pt-8">
                            <div className="flex items-center gap-3 rounded-3xl border border-[#FEF3C7] bg-[#FFFBEB] p-4 sm:gap-4">
                                <div className="w-10 h-10 bg-[#F59E0B] rounded-xl flex items-center justify-center text-white shadow-md">
                                    <Target className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-bold text-[#92400E]">Weekly Goal</div>
                                    <div className="text-sm font-bold text-[#D97706]">Complete 3 more sessions</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
