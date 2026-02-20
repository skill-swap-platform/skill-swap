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
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Session Completed!
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Great job! You've completed your swap with {partnerName}.
                    </p>
                </div>

                <div className="w-full mt-10 space-y-4">
                    <Button
                        variant="primary"
                        onClick={onRateNow}
                        className="w-full h-14 rounded-xl bg-[#3E8FCC] hover:bg-[#2F71A3] text-lg font-semibold transition-all shadow-md active:scale-[0.98]"
                    >
                        Give Feedback
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onSkip}
                        className="w-full h-14 rounded-xl border-2 border-[#E5E7EB] text-[#3E8FCC] hover:bg-[#F9FAFB] text-lg font-medium transition-all"
                    >
                        Skip for Now
                    </Button>
                </div>
            </div>
        </div>
    )
}
