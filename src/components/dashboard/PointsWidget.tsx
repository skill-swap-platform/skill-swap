import React from 'react'
import { TrendingUp, Award, Target } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, ProgressBar } from '@/components/common'
import { formatPoints, calculateProgressPercentage } from '@/utils'

interface PointsWidgetProps {
    totalPoints: number
    lifetimePoints?: number
    currentRank?: number
    pointsToNextRank?: number
    nextRankPoints?: number
    recentPointsGained?: number
    className?: string
}

export const PointsWidget: React.FC<PointsWidgetProps> = ({
    totalPoints,
    lifetimePoints,
    currentRank,
    pointsToNextRank,
    nextRankPoints,
    recentPointsGained,
    className = '',
}) => {
    const progressPercentage = nextRankPoints
        ? calculateProgressPercentage(totalPoints, nextRankPoints)
        : 0

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Points Overview</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="space-y-6">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary bg-opacity-10 rounded-full mb-3">
                            <Award className="w-10 h-10 text-primary" />
                        </div>
                        <p className="text-sm text-text-secondary mb-1">Total Points</p>
                        <p className="text-3xl font-poppins font-bold text-primary sm:text-4xl">
                            {formatPoints(totalPoints)}
                        </p>
                        {recentPointsGained !== undefined && recentPointsGained > 0 && (
                            <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-success bg-opacity-10 rounded-full">
                                <TrendingUp className="w-4 h-4 text-success" />
                                <span className="text-sm font-medium text-success">
                                    +{formatPoints(recentPointsGained)} today
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {lifetimePoints !== undefined && (
                            <div className="text-center p-4 bg-neutral-lightest rounded-lg">
                                <p className="text-xs text-text-secondary mb-1">Lifetime</p>
                                <p className="text-xl font-poppins font-semibold text-text-primary">
                                    {formatPoints(lifetimePoints)}
                                </p>
                            </div>
                        )}
                        {currentRank !== undefined && (
                            <div className="text-center p-4 bg-neutral-lightest rounded-lg">
                                <p className="text-xs text-text-secondary mb-1">Rank</p>
                                <p className="text-xl font-poppins font-semibold text-text-primary">
                                    #{currentRank}
                                </p>
                            </div>
                        )}
                    </div>
                    {pointsToNextRank !== undefined && pointsToNextRank > 0 && (
                        <div className="space-y-3">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium text-text-primary">
                                        Next Rank
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-primary">
                                    {formatPoints(pointsToNextRank)} more
                                </span>
                            </div>

                            <ProgressBar
                                value={progressPercentage}
                                max={100}
                                color="primary"
                                size="md"
                            />

                            <p className="text-xs text-text-secondary text-center">
                                {progressPercentage}% to rank #{currentRank! - 1}
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
