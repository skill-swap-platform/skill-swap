import React from 'react'
import { motion } from 'framer-motion'
import { Award } from 'lucide-react'

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

            <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Active Member</h3>
                <p className="text-gray-500 text-sm italic">You've completed 10 sessions in a row!</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full mb-10">
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-[#4CAF50]"
                    />
                </div>
                <div className="text-[10px] text-gray-400 text-center uppercase tracking-wider">
                    10/10 Sessions Completed
                </div>
            </div>

            {/* Next Badge Preview */}
            <div className="w-full bg-[#F9FAFB] rounded-2xl p-6 border border-gray-100 mb-10">
                <h4 className="text-xs font-bold text-gray-900 mb-4">Next Badge</h4>
                <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-50">
                    <div className="w-12 h-12 bg-[#E1F5FE] rounded-lg flex items-center justify-center">
                        <Award className="w-6 h-6 text-[#03A9F4]" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-900">Skill Exchanger</div>
                        <div className="text-[10px] text-gray-500">Complete 25 Sessions</div>
                    </div>
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
