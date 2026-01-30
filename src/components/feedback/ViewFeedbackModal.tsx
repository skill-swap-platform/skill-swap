import React, { useMemo } from 'react'
import { ThumbsUp, X } from 'lucide-react'
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
    const isProviderFeedback = true // Mocked for design purposes
    const role = isProviderFeedback ? 'provider' : 'seeker'

    const feedback = isProviderFeedback ? sessionFeedback.providerFeedback : sessionFeedback.seekerFeedback
    const partnerName = isProviderFeedback ? seekerName : providerName

    const questions = useMemo(() => {
        return role === 'provider'
            ? [
                'Focused & Engagement',
                'Communication Quality',
                'Actively Participating',
                'Open for Feedback',
            ]
            : [
                'Focus & Engagement',
                'How good was their communication?',
                'Patience',
                'Session Structure',
            ]
    }, [role])

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" size="xl" showCloseButton={false}>
            <div className="bg-white rounded-[32px] overflow-hidden p-10 relative">
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 text-[#9CA3AF] hover:text-[#0C0D0F] transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="mb-10">
                    <h2 className="text-[32px] font-poppins font-bold text-[#0C0D0F]">Feedback</h2>
                    <p className="text-lg text-[#666666] mt-1">
                        Feedback about you as a {role}
                    </p>
                </div>

                <div className="flex items-center gap-12 mb-10 pb-8 border-b border-[#F3F4F6]">
                    <div className="flex items-center gap-3">
                        <Avatar size="sm" name="You" src={undefined} />
                        <div className="text-sm font-medium">
                            <span className="text-[#0C0D0F]">You</span>
                            <span className="text-[#9CA3AF] ml-1">({role === 'provider' ? 'Provider' : 'Seeker'})</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Avatar size="sm" name={partnerName} src={undefined} />
                        <div className="text-sm font-medium">
                            <span className="text-[#0C0D0F]">{partnerName}</span>
                            <span className="text-[#9CA3AF] ml-1">({role === 'provider' ? 'Skill Seeker' : 'Skill Provider'})</span>
                        </div>
                    </div>
                </div>

                <div className="mb-10 flex items-center gap-2">
                    <span className="text-lg font-bold text-[#0C0D0F]">Session Subject:</span>
                    <span className="text-lg font-bold text-[#3E8FCC]">SEO Strategies</span>
                </div>

                <div className="space-y-6 mb-10">
                    <div className="flex items-center justify-between">
                        <div className="text-base text-[#0C0D0F]">Did they show up on time?</div>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-[#F0FDF4] text-[#16A34A]">
                                <ThumbsUp className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {questions.map(q => (
                        <div key={q} className="flex items-center justify-between">
                            <div className="text-base text-[#0C0D0F]">{q}</div>
                            <RatingDisplay value={feedback?.rating || 4} size="sm" />
                        </div>
                    ))}
                </div>

                <div className="space-y-8">
                    <div>
                        <div className="text-base font-bold text-[#0C0D0F] mb-3">
                            Things they did well? <span className="text-[#9CA3AF] font-normal">(Optional)</span>
                        </div>
                        <div className="w-full p-6 rounded-[20px] border border-[#E5E7EB] bg-white text-sm text-[#666666] italic leading-relaxed">
                            {feedback?.comment || 'They had interactive examples and explained patiently for someone as a beginner'}
                        </div>
                    </div>

                    <div>
                        <div className="text-base font-bold text-[#0C0D0F] mb-3">
                            Things they could improve? <span className="text-[#9CA3AF] font-normal">(Optional)</span>
                        </div>
                        <div className="w-full p-6 rounded-[20px] border border-[#E5E7EB] bg-white text-sm text-[#666666] italic leading-relaxed">
                            {feedback?.tags?.join(', ') || 'I just hoped the session was more structured'}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
