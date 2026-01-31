import React from 'react'
import { TrendingUp, Award } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common'
import { formatPoints } from '@/utils'

interface PointsCardProps {
    totalPoints: number
    lifetimePoints?: number
    currentRank?: number
    pointsToNextRank?: number
    className?: string
}
export const PointsCard: React.FC<PointsCardProps> = ({
    totalPoints,
    lifetimePoints,
    currentRank,
    pointsToNextRank,
    className = '',
}) => {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Your Points</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                                <Award className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-text-secondary">Total Points</p>
                                <p className="text-2xl font-poppins font-bold text-text-primary">
                                    {formatPoints(totalPoints)}
                                </p>
                            </div>
                        </div>
                    </div>
                    {lifetimePoints !== undefined && (
                        <div className="pt-4 border-t border-neutral-light">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-text-secondary">Lifetime Points</span>
                                <span className="text-sm font-medium text-text-primary">
                                    {formatPoints(lifetimePoints)}
                                </span>
                            </div>
                        </div>
                    )}

                    {currentRank !== undefined && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-text-secondary">Current Rank</span>
                            <div className="flex items-center gap-1">
                                <TrendingUp className="w-4 h-4 text-success" />
                                <span className="text-sm font-medium text-text-primary">
                                    #{currentRank}
                                </span>
                            </div>
                        </div>
                    )}

                    {pointsToNextRank !== undefined && pointsToNextRank > 0 && (
                        <div className="pt-4 border-t border-neutral-light">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-text-secondary">Next Rank</span>
                                <span className="text-sm font-medium text-primary">
                                    {formatPoints(pointsToNextRank)} more
                                </span>
                            </div>
                            <div className="w-full bg-neutral-light rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${Math.min(
                                            ((totalPoints % 1000) / 1000) * 100,
                                            100
                                        )}%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
