import React, { useMemo } from 'react'
import { ThumbsUp, ThumbsDown, X } from 'lucide-react'
import { Modal, RatingDisplay, Avatar } from '@/components/common'
import type { Feedback } from '@/types/index'

interface ViewFeedbackModalProps {
    isOpen: boolean
    onClose: () => void
    sessionFeedback: {
        sessionId: string
        providerFeedback?: Feedback
        seekerFeedback?: Feedback
        mutualRating?: number
        isComplete: boolean
    }
    providerName: string
    seekerName: string
}

export const ViewFeedbackModal: React.FC<ViewFeedbackModalProps> = ({
    isOpen,
    onClose,
    sessionFeedback,
    providerName,
    seekerName,
}) => {
    // For demonstration, we'll determine role based on which feedback is present
    const isProviderFeedback = !!sessionFeedback.providerFeedback
    const role = isProviderFeedback ? 'provider' : 'seeker'

    const feedback = isProviderFeedback ? sessionFeedback.providerFeedback : sessionFeedback.seekerFeedback
    const partnerName = isProviderFeedback ? seekerName : providerName

    const questions = useMemo(() => {
        return role === 'provider'
            ? [
                'Were they Focus & Engagement',
                'How good was their communication?',
                'Patience',
                'Session Structure',
            ]
            : [
                'Were they Focused the whole session?',
                'How good was their communication?',
                'Were they actively participating?',
                'Were they open for feedback?',
            ]
    }, [role])

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" size="xl" showCloseButton={false}>
            <div className="bg-white rounded-xl overflow-hidden p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-[#9CA3AF] hover:text-[#0C0D0F] transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-[#0C0D0F]">Feedback</h2>
                    <p className="text-sm text-[#666666] mt-1">
                        Feedback about you as a {role}
                    </p>
                </div>

                <div className="flex items-center gap-10 mb-8 pb-8 border-b border-[#F3F4F6]">
                    <div className="flex items-center gap-2">
                        <Avatar size="sm" name="You" />
                        <div className="text-[11px] font-bold">
                            <span className="text-[#0C0D0F]">You</span>
                            <span className="text-[#9CA3AF] ml-1">({role === 'provider' ? 'Provider' : 'Skill Seeker'})</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Avatar size="sm" name={partnerName} />
                        <div className="text-[11px] font-bold">
                            <span className="text-[#0C0D0F]">{partnerName}</span>
                            <span className="text-[#9CA3AF] ml-1">({role === 'provider' ? 'Skill Seeker' : 'Skill Provider'})</span>
                        </div>
                    </div>
                </div>

                <div className="mb-8 flex items-center gap-2">
                    <span className="text-[13px] font-bold text-[#0C0D0F]">Session Subject:</span>
                    <span className="text-[13px] font-bold text-[#3E8FCC]">SEO Strategies</span>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="text-[12px] text-[#0C0D0F]">Did they show up on time?</div>
                        <div className="flex items-center gap-2">
                            <ThumbsUp className={`w-4 h-4 ${feedback?.wasHelpful !== false ? 'text-[#16A34A]' : 'text-[#9CA3AF]'}`} />
                            <ThumbsDown className={`w-4 h-4 ${feedback?.wasHelpful === false ? 'text-[#DC2626]' : 'text-[#9CA3AF]'}`} />
                        </div>
                    </div>

                    {questions.map(q => (
                        <div key={q} className="flex items-center justify-between">
                            <div className="text-[12px] text-[#0C0D0F]">{q}</div>
                            <RatingDisplay value={feedback?.rating || 5} size="sm" showValue={true} className="text-[10px] font-bold" />
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="text-[12px] font-bold text-[#0C0D0F] mb-3 flex items-center gap-1">
                            Things they did well? <span className="text-[#9CA3AF] font-normal text-[10px]">(Optional)</span>
                        </div>
                        <div className="w-full p-4 rounded-xl border border-[#E5E7EB] bg-white text-[11px] text-[#666666] italic leading-relaxed">
                            {feedback?.comment || 'They had interactive examples and explained patiently for someone as a beginner'}
                        </div>
                    </div>

                    <div>
                        <div className="text-[12px] font-bold text-[#0C0D0F] mb-3 flex items-center gap-1">
                            Things they could improve? <span className="text-[#9CA3AF] font-normal text-[10px]">(Optional)</span>
                        </div>
                        <div className="w-full p-4 rounded-xl border border-[#E5E7EB] bg-white text-[11px] text-[#666666] italic leading-relaxed">
                            {feedback?.improvement || 'I just hoped the session was more structured'}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
