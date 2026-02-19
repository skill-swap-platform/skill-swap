import React from 'react'

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
        <div className="flex items-center justify-center px-4 py-12 w-full">
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 max-w-[640px] w-full p-12 relative">
                <div className="flex justify-center gap-6 mb-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#4ADE80]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#60A5FA]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F87171]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
                </div>

                <div className="flex justify-center mb-10">
                    <div className="relative w-64 h-64">
                        <img
                            src="/session-completed.png"
                            alt="Session Completed"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-[32px] font-bold text-[#0C0D0F] mb-3">
                        Session Completed!
                    </h2>
                    <p className="text-[#666666] text-lg">
                        Great job! You've completed your swap with {partnerName}.
                    </p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onReport}
                        className="flex-1 h-14 rounded-xl border-2 border-[#3E8FCC] text-[#3E8FCC] font-bold hover:bg-[#F0F7FF] transition-colors"
                    >
                        Report Issue
                    </button>
                    <button
                        onClick={onContinue}
                        className="flex-1 h-14 rounded-xl bg-[#2F71A3] text-white font-bold hover:bg-[#25608E] transition-colors"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}