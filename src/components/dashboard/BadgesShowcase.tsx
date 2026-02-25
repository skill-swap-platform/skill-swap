import React from 'react'
import { Lock, ChevronRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Badge as BadgeComponent } from '@/components/common'
import type { UserBadge } from '@/types/index'

interface BadgesShowcaseProps {
    userBadges: UserBadge[]
    totalBadges?: number
    onViewAll?: () => void
    maxDisplay?: number
    className?: string
}

export const BadgesShowcase: React.FC<BadgesShowcaseProps> = ({
    userBadges,
    totalBadges,
    onViewAll,
    maxDisplay = 6,
    className = '',
}) => {
    const displayedBadges = userBadges.slice(0, maxDisplay)
    const remainingCount = userBadges.length - maxDisplay

    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Badges</CardTitle>
                    {onViewAll && (
                        <button
                            onClick={onViewAll}
                            className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary-dark sm:text-sm"
                        >
                            View All
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
                {totalBadges !== undefined && (
                    <p className="text-sm text-text-secondary mt-1">
                        {userBadges.length} of {totalBadges} badges unlocked
                    </p>
                )}
            </CardHeader>

            <CardContent>
                {userBadges.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-neutral-light rounded-full flex items-center justify-center mx-auto mb-3">
                            <Lock className="w-8 h-8 text-text-tertiary" />
                        </div>
                        <p className="text-text-secondary">No badges earned yet</p>
                        <p className="text-sm text-text-tertiary mt-1">
                            Complete sessions to unlock badges
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {displayedBadges.map((badge) => (
                                <button
                                    key={badge.id}
                                    className="group relative flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-neutral-light p-2 transition-all hover:border-primary hover:bg-primary hover:bg-opacity-5 sm:p-3"
                                    title={badge.name}
                                >
                                    <div
                                        className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg text-xl sm:h-12 sm:w-12 sm:text-2xl"
                                        style={{ backgroundColor: `${badge.color}20` }}
                                    >
                                        {badge.icon}
                                    </div>
                                    <p className="text-xs font-medium text-text-primary text-center line-clamp-1">
                                        {badge.name}
                                    </p>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-text-primary text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                                        {badge.description}
                                    </div>
                                </button>
                            ))}
                            {remainingCount > 0 && (
                                <button
                                    onClick={onViewAll}
                                    className="flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-light p-2 transition-all hover:border-primary hover:bg-primary hover:bg-opacity-5 sm:p-3"
                                >
                                    <div className="text-2xl mb-1">+{remainingCount}</div>
                                    <p className="text-xs font-medium text-text-secondary">More</p>
                                </button>
                            )}
                        </div>
                        {userBadges[0] && (
                            <div className="pt-4 border-t border-neutral-light">
                                <div className="flex items-center gap-3 p-3 bg-neutral-lightest rounded-lg">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                                        style={{ backgroundColor: `${userBadges[0].color}20` }}
                                    >
                                        {userBadges[0].icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-text-secondary">Latest Badge</p>
                                        <p className="text-sm font-medium text-text-primary truncate">
                                            {userBadges[0].name}
                                        </p>
                                    </div>
                                    <BadgeComponent variant="success" size="sm">
                                        New
                                    </BadgeComponent>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
