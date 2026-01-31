import React from 'react'
import { Award, Star, ChevronRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/common'
import { formatRelativeTime } from '@/utils'

interface Achievement {
    id: string
    userId?: string
    type: 'badge' | 'points' | 'milestone' | 'streak'
    title: string
    description: string
    icon?: string
    color?: string
    value?: number
    timestamp: Date
}

interface RecentAchievementsProps {
    achievements: Achievement[]
    onViewAll?: () => void
    className?: string
}

export const RecentAchievements: React.FC<RecentAchievementsProps> = ({
    achievements,
    onViewAll,
    className = '',
}) => {
    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#3E8FCC]" />
                    Recent Achievements
                </CardTitle>
                {onViewAll && (
                    <button
                        onClick={onViewAll}
                        className="text-sm font-medium text-[#3E8FCC] hover:underline flex items-center gap-1"
                    >
                        View All
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {achievements.length > 0 ? (
                        achievements.map((achievement) => (
                            <div key={achievement.id} className="flex gap-4">
                                <div className="mt-1">
                                    <div className="h-10 w-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-xl">
                                        {achievement.icon || '🏆'}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h4 className="font-semibold text-[#0C0D0F] truncate">
                                                {achievement.title}
                                            </h4>
                                            <p className="text-sm text-[#666666]">
                                                {achievement.description}
                                            </p>
                                        </div>
                                        <Badge variant="neutral" className="whitespace-nowrap shrink-0">
                                            {formatRelativeTime(achievement.timestamp)}
                                        </Badge>
                                    </div>

                                    {achievement.type === 'points' && achievement.value && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#3E8FCC]"
                                                    style={{ width: `${Math.min((achievement.value / 1000) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-[#3E8FCC]">
                                                +{achievement.value} XP
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <Star className="w-12 h-12 text-[#E5E7EB] mx-auto mb-3" />
                            <p className="text-[#666666]">No recent achievements yet.</p>
                            <p className="text-sm text-[#9CA3AF] mt-1">
                                Complete sessions and earn points to unlock badges!
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-[#F3F4F6]">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-sm text-[#666666] mb-1">Total XP</div>
                            <div className="text-lg font-bold text-[#0C0D0F]">2,450</div>
                        </div>
                        <div className="text-center border-x border-[#F3F4F6]">
                            <div className="text-sm text-[#666666] mb-1">Rank</div>
                            <div className="text-lg font-bold text-[#0C0D0F]">#12</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-[#666666] mb-1">Badges</div>
                            <div className="text-lg font-bold text-[#0C0D0F]">8</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
