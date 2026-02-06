import React from 'react'
import { motion } from 'framer-motion'

interface SessionCompletedScreenProps {
    partnerName: string
    onContinue: () => void
    onReport: () => void
}

export const SessionCompletedScreen: React.FC<SessionCompletedScreenProps> = ({
    partnerName,
    onContinue,
    onReport,
}) => {
    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-[540px] w-full p-10 relative overflow-hidden flex flex-col items-center"
        >
            {/* Progress indicators */}
            <div className="flex justify-center gap-12 mb-8">
                <div className="w-2 h-2 rounded-full bg-[#A3D9A5]" />
                <div className="w-2 h-2 rounded-full bg-[#A5C3E8]" />
                <div className="w-2 h-2 rounded-full bg-[#E8A5A5]" />
                <div className="w-2 h-2 rounded-full bg-[#E8D9A5]" />
            </div>

            <div className="mb-8">
                {/* Placeholder for the illustration seen in Figma */}
                <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
                    <img
                        src="https://img.freepik.com/free-vector/job-interview-concept-illustration_114360-3129.jpg"
                        alt="Session Completed Illustration"
                        className="w-full h-full object-contain"
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 bg-[#0C1222] text-white text-[10px] font-bold px-3 py-1 rounded shadow-lg uppercase">
                        Completed
                    </div>
                </div>
            </div>

            <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Session Completed!
                </h2>
                <p className="text-gray-500 text-sm">
                    Great job! You've completed your swap with {partnerName}.
                </p>
            </div>

            <div className="flex gap-4 w-full mt-auto">
                <button
                    onClick={onReport}
                    className="flex-1 h-12 rounded-xl border-2 border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-all"
                >
                    Report Issue
                </button>
                <button
                    onClick={onContinue}
                    className="flex-1 h-12 rounded-xl bg-[#3E8FCC] text-white font-bold hover:bg-[#2F71A3] transition-all shadow-sm"
                >
                    Continue
                </button>
            </div>
        </motion.div>
    )
}
