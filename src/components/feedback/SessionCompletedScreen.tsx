import React from 'react'
import { Button } from '@/components/common/Button'

interface SessionCompletedScreenProps {
    partnerName: string
    onContinue: () => void
    onSkip?: () => void
    onReport: () => void
}

export const SessionCompletedScreen: React.FC<SessionCompletedScreenProps> = ({
    partnerName,
    onContinue,
    onSkip,
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Session Completed!
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Great job! You've completed your swap with {partnerName}.
                    </p>
                </div>

                <div className="flex gap-4 mt-10">
                    <Button
                        variant="ghost"
                        onClick={onReport}
                        className="flex-1 h-12 rounded-xl border border-primary text-primary hover:bg-blue-50 font-semibold transition-all"
                    >
                        Report Issue
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onContinue}
                        className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold transition-all shadow-sm active:scale-[0.98]"
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    )
}