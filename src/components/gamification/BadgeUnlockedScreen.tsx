import React from 'react'
import { Trophy, ChevronRight } from 'lucide-react'

interface BadgeUnlockedScreenProps {
    unlockedBadges?: any[]
    nextBadge?: any
    onContinue: () => void
}

export const BadgeUnlockedScreen: React.FC<BadgeUnlockedScreenProps> = ({
    unlockedBadges = [],
    nextBadge,
    onContinue,
}) => {
    const userBadge = unlockedBadges[0]
    const badge = userBadge?.badge || userBadge || {
        name: 'New Achievement',
        description: 'You earned a new badge!',
        icon: '🏆',
        requirement: null,
        points: 0,
    }

    const requirement = Number(badge.requirement) || 0

    return (
        <div className="flex items-center justify-center px-4 py-12 w-full">
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 max-w-[640px] w-full p-10">

                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                    New Badge Unlocked! 🎉
                </h2>

                <div className="flex justify-center mb-5">
                    <div className="w-24 h-24 bg-[#E8F5E9] rounded-full flex items-center justify-center shadow-sm">
                        <Trophy className="w-12 h-12 text-[#4CAF50]" strokeWidth={1.8} />
                    </div>
                </div>

                <div className="text-center mb-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{badge.name}</h3>
                    <p className="text-sm text-gray-500">{badge.description}</p>
                </div>

                {requirement > 0 && (
                    <div className="w-full mb-6">
                        <div className="w-full h-2.5 bg-[#E5E7EB] rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-[#4CAF50] w-full rounded-full transition-all" />
                        </div>
                        <div className="text-xs text-gray-400 text-right font-medium">
                            {requirement}/{requirement} Sessions Completed
                        </div>
                    </div>
                )}

                {nextBadge && (
                    <div className="mb-8">
                        <h4 className="text-sm font-bold text-gray-900 mb-3">Next Badge</h4>
                        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <div className="w-11 h-11 bg-[#E0F2FE] rounded-full flex items-center justify-center flex-shrink-0">
                                <ChevronRight className="w-5 h-5 text-[#3E8FCC]" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-gray-900">{nextBadge.name}</div>
                                <div className="text-xs text-gray-400 mt-0.5">
                                    Complete {nextBadge.requirement} Sessions
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={onContinue}
                    className="w-full h-12 rounded-xl bg-[#3E8FCC] text-white font-semibold hover:bg-[#2F71A3] transition-colors text-sm"
                >
                    Continue
                </button>
            </div>
        </div>
    )
}