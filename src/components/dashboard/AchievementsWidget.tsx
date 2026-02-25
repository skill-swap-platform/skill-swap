import React from 'react'
import { Trophy, Target, Flame, Award } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CircularProgress } from '@/components/common'
import { formatNumber } from '@/utils'

interface AchievementsStat {
    label: string
    value: number
    target?: number
    icon: React.ReactNode
    color: string
}

interface AchievementsWidgetProps {
    totalBadges: number
    totalPoints: number
    completedSessions: number
    consecutiveDays: number
    nextMilestone?: {
        label: string
        current: number
        target: number
    }
    className?: string
}

export const AchievementsWidget: React.FC<AchievementsWidgetProps> = ({
    totalBadges,
    totalPoints,
    completedSessions,
    consecutiveDays,
    nextMilestone,
    className = '',
}) => {
    const stats: AchievementsStat[] = [
        {
            label: 'Badges Earned',
            value: totalBadges,
            icon: <Trophy className="w-5 h-5" />,
            color: '#F59E0B',
        },
        {
            label: 'Total Points',
            value: totalPoints,
            icon: <Award className="w-5 h-5" />,
            color: '#3E8FCC',
        },
        {
            label: 'Sessions',
            value: completedSessions,
            icon: <Target className="w-5 h-5" />,
            color: '#16A34A',
        },
        {
            label: 'Day Streak',
            value: consecutiveDays,
            icon: <Flame className="w-5 h-5" />,
            color: '#DC2626',
        },
    ]

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Achievements Summary</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="rounded-lg border border-neutral-light p-4 transition-colors hover:border-primary"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                                    >
                                        {stat.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-text-secondary">{stat.label}</p>
                                        <p className="text-xl font-poppins font-bold text-text-primary sm:text-2xl">
                                            {formatNumber(stat.value)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {nextMilestone && (
                        <div className="pt-4 border-t border-neutral-light">
                            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm font-medium text-text-primary">
                                        Next Milestone
                                    </p>
                                    <p className="text-xs text-text-secondary mt-1">
                                        {nextMilestone.label}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-primary">
                                        {nextMilestone.current}/{nextMilestone.target}
                                    </p>
                                </div>
                            </div>

                            <CircularProgress
                                value={nextMilestone.current}
                                max={nextMilestone.target}
                                size={120}
                                color="primary"
                                className="mx-auto"
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
