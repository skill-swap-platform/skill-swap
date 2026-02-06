import React from 'react'
import { Button } from '@/components/common'
import { CheckCircle2 } from 'lucide-react'

interface SessionCompletedScreenProps {
    sessionId: string
    partnerName: string
    partnerAvatar?: string
    onRateNow: () => void
    onSkip: () => void
}

export const SessionCompletedScreen: React.FC<SessionCompletedScreenProps> = ({
    partnerName,
    onRateNow,
    onSkip,
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

                <div className="flex flex-col items-center mt-6">
                    <div className="relative w-full aspect-[1.4/1] mb-10 flex justify-center items-center">
                        <div className="w-32 h-32 bg-[#F3F9FF] rounded-full flex items-center justify-center relative shadow-inner">
                            <div className="w-24 h-24 bg-[#3E8FCC]/10 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-16 h-16 text-[#3E8FCC] drop-shadow-sm" />
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0C0D0F] text-white px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-xl">
                                Completed
                            </div>
                        </div>
                    </div>

                    <div className="text-center space-y-3">
                        <h2 className="text-[32px] font-poppins font-bold text-[#0C0D0F]">
                            Session Completed!
                        </h2>
                        <p className="text-[#666666] text-lg max-w-[320px] mx-auto leading-relaxed">
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
        </div>
    )
}
