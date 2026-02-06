import React from 'react'
import { Button } from '@/components/common'
import type { UserBadge } from '@/types/index'

interface BadgeUnlockedScreenProps {
    onContinue: () => void
}

export const BadgeUnlockedScreen: React.FC<BadgeUnlockedScreenProps> = ({
    onContinue,
}) => {
    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-[500px] w-full p-10 relative overflow-hidden flex flex-col items-center"
        >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
                New Badge Unlocked! 🎉
            </h2>

            <div className="mb-6 relative">
                <div className="w-32 h-32 bg-[#E8F5E9] rounded-full flex items-center justify-center">
                    <Award className="w-16 h-16 text-[#4CAF50]" />
                </div>
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
                    <div>
                        <div className="text-sm font-bold text-gray-900">Skill Exchanger</div>
                        <div className="text-[10px] text-gray-500">Complete 25 Sessions</div>
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

            <button
                onClick={onContinue}
                className="w-full h-12 rounded-xl bg-[#3E8FCC] text-white font-bold hover:bg-[#2F71A3] transition-all shadow-sm"
            >
                Continue
            </button>
        </motion.div>
    )
}
