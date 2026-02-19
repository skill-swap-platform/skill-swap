import React from 'react'
import { Button } from '@/components/common'
import { CheckCircle2 } from 'lucide-react'

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
        <div className="flex items-center justify-center px-4 py-20 min-h-[calc(100vh-140px)]">
            <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] max-w-[540px] w-full p-10 relative overflow-hidden animate-fade-in">
                <div className="flex justify-center gap-12 absolute top-8 left-0 right-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#A3D9A5]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#A5C3E8]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E8A5A5]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E8D9A5]" />
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
