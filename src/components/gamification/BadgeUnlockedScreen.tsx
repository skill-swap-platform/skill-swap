import React from 'react'
import { ArrowRight } from 'lucide-react'

interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    requirement: string;
    points: number;
}

interface BadgeUnlockedScreenProps {
    onContinue: () => void;
    unlockedBadges?: Badge[];
    nextBadge?: Badge;
}

export const BadgeUnlockedScreen: React.FC<BadgeUnlockedScreenProps> = ({
    onContinue,
    unlockedBadges = [],
    nextBadge
}) => {
    const badge = unlockedBadges[0] || {
        name: 'Active Member',
        description: "You've completed your latest session successfully!",
        icon: '🎯'
    };

    return (
        <div className="flex items-center justify-center px-4 py-12 w-full">
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 max-w-[640px] w-full p-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center text-[#16A34A]">
                    New Badge Unlocked!
                </h2>

                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-[#F0FDF4] rounded-full flex items-center justify-center border-4 border-[#DCFCE7] shadow-inner">
                        <span className="text-5xl">{badge.icon || '🏆'}</span>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-2">{badge.name}</h3>
                    <p className="text-sm text-gray-600 px-8">
                        {badge.description}
                    </p>
                </div>

                {nextBadge && (
                    <div className="mb-8">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Next Challenge</h4>
                        <div className="flex items-center gap-4 p-4 bg-[#F9FAFB] rounded-2xl border border-gray-100">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0 text-2xl">
                                {nextBadge.icon || '🎯'}
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-bold text-gray-900">{nextBadge.name}</div>
                                <div className="text-xs text-gray-500 mt-1">{nextBadge.description}</div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-[#3E8FCC]" />
                        </div>
                    </div>
                )}

                <button
                    onClick={onContinue}
                    className="w-full h-14 rounded-xl bg-[#3E8FCC] text-white font-bold text-lg hover:bg-[#2F71A3] transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
                >
                    Great! Continue
                </button>
            </div>
        </div>
    )
}
