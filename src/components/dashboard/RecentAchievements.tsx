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
            <CardHeader className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-bold sm:text-xl">
                    <Award className="h-5 w-5 text-[#3E8FCC]" />
                    Recent Achievements
                </CardTitle>
                {onViewAll && (
                    <button
                        onClick={onViewAll}
                        className="flex items-center gap-1 self-start text-xs font-medium text-[#3E8FCC] hover:underline sm:self-auto sm:text-sm"
                    >
                        View All
                        <ChevronRight className="h-4 w-4" />
                    </button>
                )}
            </CardHeader>

            <CardContent>
                <div className="space-y-6">
                    {achievements.length > 0 ? (
                        achievements.map((achievement) => (
                            <div key={achievement.id} className="flex gap-3 sm:gap-4">
                                <div className="mt-1">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6] text-lg sm:h-10 sm:w-10 sm:text-xl">
                                        {achievement.icon || <Award className="h-5 w-5 text-[#3E8FCC]" />}
                                    </div>
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h4 className="truncate text-sm font-semibold text-[#0C0D0F] sm:text-base">
                                                {achievement.title}
                                            </h4>
                                            <p className="text-xs text-[#666666] sm:text-sm">
                                                {achievement.description}
                                            </p>
                                        </div>
                                        <Badge variant="neutral" className="shrink-0 whitespace-nowrap">
                                            {formatRelativeTime(achievement.timestamp)}
                                        </Badge>
                                    </div>

                                    {achievement.type === 'points' && achievement.value && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F3F4F6]">
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
                        <div className="py-8 text-center">
                            <Star className="mx-auto mb-3 h-12 w-12 text-[#E5E7EB]" />
                            <p className="text-[#666666]">No recent achievements yet.</p>
                            <p className="mt-1 text-sm text-[#9CA3AF]">
                                Complete sessions and earn points to unlock badges!
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-8 border-t border-[#F3F4F6] pt-6">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                        <div className="rounded-lg bg-[#F9FAFB] p-3 text-center sm:bg-transparent sm:p-0">
                            <div className="mb-1 text-sm text-[#666666]">Total XP</div>
                            <div className="text-lg font-bold text-[#0C0D0F]">2,450</div>
                        </div>
                        <div className="rounded-lg bg-[#F9FAFB] p-3 text-center sm:rounded-none sm:border-x sm:border-[#F3F4F6] sm:bg-transparent sm:p-0">
                            <div className="mb-1 text-sm text-[#666666]">Rank</div>
                            <div className="text-lg font-bold text-[#0C0D0F]">#12</div>
                        </div>
                        <div className="rounded-lg bg-[#F9FAFB] p-3 text-center sm:bg-transparent sm:p-0">
                            <div className="mb-1 text-sm text-[#666666]">Badges</div>
                            <div className="text-lg font-bold text-[#0C0D0F]">8</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
