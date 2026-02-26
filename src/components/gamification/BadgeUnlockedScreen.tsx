import React from 'react'
import { Award, ArrowRight } from 'lucide-react'

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
    const badge = unlockedBadges[0] || {
        name: 'New Achievement',
        description: 'You earned a new badge!',
        icon: '🏆'
    }

    return (
        <div className="flex items-center justify-center px-4 py-12 w-full">
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 max-w-[640px] w-full p-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                    New Badge Unlocked!
                </h2>

                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-[#E8F5E9] rounded-full flex items-center justify-center text-5xl">
                        {badge.icon || <Award className="w-12 h-12 text-[#4CAF50]" />}
                    </div>
                </div>

                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{badge.name}</h3>
                    <p className="text-sm text-gray-600">
                        {badge.description}
                    </p>
                </div>

                {badge.requirement && (
                    <div className="w-full bg-white rounded-xl p-4 mb-6 border border-gray-200">
                        <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-[#4CAF50] w-full transition-all" />
                        </div>
                        <div className="text-xs text-gray-500 text-center font-medium">
                            {badge.requirement}/{badge.requirement} Goal Reached!
                        </div>
                    </div>
                )}

                {nextBadge && (
                    <div className="mb-8">
                        <h4 className="text-sm font-bold text-gray-900 mb-3">Next Badge</h4>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="w-10 h-10 bg-[#E0F2FE] rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                                {nextBadge.icon || <ArrowRight className="w-5 h-5 text-[#3E8FCC]" />}
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-gray-900">{nextBadge.name}</div>
                                <div className="text-xs text-gray-500">{nextBadge.description}</div>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={onContinue}
                    className="w-full h-12 rounded-xl bg-[#3E8FCC] text-white font-semibold hover:bg-[#2F71A3] transition-colors"
                >
                    Continue
                </button>
            </div>
        </div>
    )
}