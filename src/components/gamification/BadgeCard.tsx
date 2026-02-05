import React from 'react'
import { Lock, Check } from 'lucide-react'
import { Card } from '@/components/common'
import type { Badge } from '@/types/index'
import { ProgressBar } from '@/components/common'

interface BadgeCardProps {
    badge: Badge
    isUnlocked?: boolean
    progress?: number
    onClick?: () => void
    className?: string
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
    badge,
    isUnlocked = false,
    progress = 0,
    onClick,
    className = '',
}) => {
    return (
        <Card
            hover={!!onClick}
            onClick={onClick}
            className={`relative ${isUnlocked ? '' : 'opacity-60'} ${className}`}
        >
            {isUnlocked && (
                <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                    </div>
                </div>
            )}
            {!isUnlocked && (
                <div className="absolute top-3 right-3">
                    <Lock className="w-5 h-5 text-text-tertiary" />
                </div>
            )}

            <div className="flex flex-col items-center text-center space-y-3">
                <div
                    className="w-20 h-20 rounded-lg flex items-center justify-center text-4xl"
                    style={{ backgroundColor: `${badge.color}20` }}
                >
                    {badge.icon}
                </div>
                <div>
                    <h4 className="font-poppins font-semibold text-text-primary">
                        {badge.name}
                    </h4>
                    <p className="text-sm text-text-secondary mt-1">
                        {badge.description}
                    </p>
                </div>
                {badge.category && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-light text-xs font-medium text-text-secondary">
                        {badge.category.charAt(0).toUpperCase() + badge.category.slice(1)}
                    </div>
                )}
                {!isUnlocked && progress > 0 && (
                    <div className="w-full">
                        <ProgressBar
                            value={progress}
                            max={100}
                            size="sm"
                            color="primary"
                            showLabel
                        />
                    </div>
                )}
            </div>
        </Card>
    )
}
