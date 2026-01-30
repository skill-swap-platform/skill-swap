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
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                    <input
                        type="text"
                        placeholder="Search for skills, sessions, or achievements..."
                        className="w-full h-14 pl-12 pr-6 rounded-2xl border border-[#E5E7EB] bg-white outline-none focus:ring-2 focus:ring-[#3E8FCC] transition-all"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-[#F3F4F6] overflow-hidden">
                                <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Avatar" />
                            </div>
                        ))}
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-[#3E8FCC] text-white flex items-center justify-center text-[10px] font-bold">
                            +12
                        </div>
                    </div>
                    <p className="text-sm font-medium text-[#666666] flex items-center">
                        Community is active
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
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
                        onViewAll={() => navigate('/history')}
                        className="rounded-[32px] overflow-hidden border-[#E5E7EB] shadow-sm"
                    />
                </div>
                <div className="space-y-10">
                    <BadgesShowcase
                        userBadges={userBadges || []}
                        totalBadges={allBadges?.length}
                        onViewAll={() => navigate('/points-badges')}
                        className="rounded-[32px] overflow-hidden border-[#E5E7EB] shadow-sm"
                    />

                    <div className="bg-[#FFFFFF] rounded-[32px] p-8 border border-[#E5E7EB] shadow-sm group">
                        <h3 className="text-xl font-bold text-[#0C0D0F] mb-8">
                            Quick Actions
                        </h3>
                        <div className="space-y-4">
                            <button
                                onClick={() => navigate('/history')}
                                className="w-full flex items-center justify-between p-6 rounded-2xl bg-[#3E8FCC]/5 border border-[#3E8FCC]/10 hover:bg-[#3E8FCC] hover:text-white group transition-all duration-300"
                            >
                                <div className="text-left">
                                    <p className="font-bold mb-0.5">Start New Session</p>
                                    <p className="text-xs text-[#666666] group-hover:text-white/80 transition-colors">Exchange skills with others</p>
                                </div>
                                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>

                            <button
                                onClick={() => navigate('/history')}
                                className="w-full text-left p-6 rounded-2xl bg-[#F9FAFB] border border-transparent hover:border-[#E5E7EB] hover:bg-white transition-all"
                            >
                                <p className="font-bold text-[#0C0D0F] mb-0.5">View History</p>
                                <p className="text-xs text-[#666666]">See past sessions</p>
                            </button>

                            <button
                                onClick={() => navigate('/points-badges')}
                                className="w-full text-left p-6 rounded-2xl bg-[#F9FAFB] border border-transparent hover:border-[#E5E7EB] hover:bg-white transition-all"
                            >
                                <p className="font-bold text-[#0C0D0F] mb-0.5">Leaderboard</p>
                                <p className="text-xs text-[#666666]">See your ranking</p>
                            </button>
                        </div>

                        <div className="mt-8 pt-8 border-t border-[#F3F4F6]">
                            <div className="flex items-center gap-4 p-4 rounded-3xl bg-[#FFFBEB] border border-[#FEF3C7]">
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
