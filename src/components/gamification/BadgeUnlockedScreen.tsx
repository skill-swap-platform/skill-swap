import React from 'react'
import { Button } from '@/components/common'
import type { UserBadge } from '@/types/index'

interface BadgeUnlockedScreenProps {
    badge: UserBadge | null
    onClose: () => void
}

export const BadgeUnlockedScreen: React.FC<BadgeUnlockedScreenProps> = ({
    badge,
    onClose,
}) => {
    if (!badge) return null

    return (
        <div className="min-h-screen bg-[#3E8FCC] text-white relative flex flex-col overflow-x-hidden">
            <div className="w-full py-4 px-6 flex justify-between items-center">
                <div className="text-lg font-semibold">SkillSwap</div>
                <button
                    onClick={onClose}
                    className="text-white hover:text-white/80 text-2xl"
                >
                    ×
                </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-4xl mx-auto w-full">
                <div className="relative w-full max-w-[500px] mb-8 animate-fade-in">
                    <div className="w-full h-full flex items-end justify-center">
                        <div className="text-[140px] leading-none mb-2">🏆</div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-[180px] opacity-20">🎊</div>
                        </div>
                    </div>
                </div>
                <div className="text-center mb-10">
                    <h2 className="text-[40px] font-poppins font-bold animate-fade-in">
                        Badge Unlocked!
                    </h2>
                    <p className="text-xl text-white/90 mt-1 animate-fade-in">
                        {badge.name}
                    </p>
                </div>
                <div className="w-full max-w-[600px] bg-white rounded-2xl p-6 shadow-xl mb-6 border border-white/20 animate-fade-in">
                    <div className="text-[#3E8FCC] font-bold text-center mb-4 text-lg">
                        {badge.description}
                    </div>
                    <div className="w-full h-4 bg-[#E5E7EB] rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-[#3E8FCC] w-full" />
                    </div>
                    <div className="text-[#9CA3AF] text-xs text-center font-medium">
                        Achievement Completed!
                    </div>
                </div>
                <div className="w-full max-w-[600px] bg-white rounded-2xl p-6 shadow-xl mb-8 border border-white/20 animate-fade-in">
                    <div className="text-[#0C0D0F] font-bold mb-4 text-base">
                        Next Badge
                    </div>
                    <div className="flex items-center gap-5 p-5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[20px]">
                        <div className="w-16 h-16 bg-white border border-[#E5E7EB] rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                            🎖️
                        </div>
                        <div>
                            <div className="text-[#0C0D0F] font-bold text-lg">Keep Going!</div>
                            <div className="text-[#666666] text-sm mt-1">Complete more sessions to unlock</div>
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-[600px] grid grid-cols-2 gap-6">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="h-14 rounded-xl bg-white text-[#3E8FCC] hover:bg-white/90 font-bold text-lg shadow-lg"
                    >
                        Continue
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onClose}
                        className="h-14 rounded-xl bg-[#2F71A3] hover:bg-[#1F5D86] text-white font-bold text-lg shadow-lg"
                    >
                        View All Badges
                    </Button>
                </div>
            </div>
        </div>
    )
}
