import React, { useMemo } from 'react'
import { ThumbsUp, ThumbsDown, X, Loader2 } from 'lucide-react'
import { Modal, RatingDisplay, Avatar } from '@/components/common'
import type { Feedback } from '@/types/index'

interface ViewFeedbackModalProps {
    isOpen: boolean
    onClose: () => void
    sessionFeedback: {
        sessionId: string
        providerFeedback?: any
        seekerFeedback?: any
        comment?: string
        mutualRating?: number
        isComplete: boolean
    }
    providerName: string
    seekerName: string
    skillName?: string
    isLoading?: boolean
}

export const ViewFeedbackModal: React.FC<ViewFeedbackModalProps> = ({
    isOpen,
    onClose,
    sessionFeedback,
    providerName,
    seekerName,
    skillName,
    isLoading = false,
}) => {
    console.log('DEBUG: ViewFeedbackModal Received sessionFeedback:', sessionFeedback);

    const isSeekerFeedback = !!sessionFeedback.seekerFeedback
    const feedback = isSeekerFeedback ? sessionFeedback.seekerFeedback : sessionFeedback.providerFeedback
    const role = isSeekerFeedback ? 'seeker' : 'provider'
    const partnerName = isSeekerFeedback ? providerName : seekerName

    console.log('DEBUG: Derived Feedback Object:', feedback);

    const parseRating = (val: any) => {
        if (!val) return 5;
        if (typeof val === 'number') return val;
        const map: Record<string, number> = { 'ONE': 1, 'TWO': 2, 'THREE': 3, 'FOUR': 4, 'FIVE': 5 };
        return map[val.toString().toUpperCase()] || 5;
    };

    const questions = useMemo(() => {
        return role === 'seeker'
            ? [
                'Were they Focused the whole session?',
                'How good was their communication?',
                'Were they actively participating?',
                'Were they open for feedback?',
            ]
            : [
                'Were they Focus & Engagement',
                'How good was their communication?',
                'Patience',
                'Session Structure',
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

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-10 h-10 text-[#3E8FCC] animate-spin" />
                        <p className="text-sm text-gray-500">Loading session details...</p>
                    </div>
                ) : (
                    <>
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

                        {skillName && (
                            <div className="mb-8 flex items-center gap-2">
                                <span className="text-[13px] font-bold text-[#0C0D0F]">Session Subject:</span>
                                <span className="text-[13px] font-bold text-[#3E8FCC]">{skillName}</span>
                            </div>
                        )}

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-between">
                                <div className="text-[12px] text-[#0C0D0F]">Did they show up on time?</div>
                                <div className="flex items-center gap-2">
                                    <ThumbsUp className={`w-4 h-4 ${feedback?.wasHelpful !== false ? 'text-[#16A34A]' : 'text-[#9CA3AF]'}`} />
                                    <ThumbsDown className={`w-4 h-4 ${feedback?.wasHelpful === false ? 'text-[#DC2626]' : 'text-[#9CA3AF]'}`} />
                                </div>
                            </div>

                            {questions.map((q, idx) => {
                                const keys = role === 'provider'
                                    ? ['communication', 'learningFocus', 'clarity', 'patience', 'sessionStructure']
                                    : ['communication', 'sessionFocus', 'activeParticipation', 'openToFeedback'];

                                const key = keys[idx];
                                const ratingValue = feedback?.[key] ||
                                    feedback?.ratings?.[key] ||
                                    feedback?.[`${key}Rating`] ||
                                    feedback?.ratings?.[`${key}Rating`] ||
                                    feedback?.[`rating${key.charAt(0).toUpperCase() + key.slice(1)}`] ||
                                    feedback?.ratings?.[`rating${key.charAt(0).toUpperCase() + key.slice(1)}`] ||
                                    (feedback?.ratings?.find?.((r: any) => r.type === key || r.metric === key)?.value) ||
                                    5;

                                return (
                                    <div key={q} className="flex items-center justify-between">
                                        <div className="text-[12px] text-[#0C0D0F]">{q}</div>
                                        <RatingDisplay value={parseRating(ratingValue)} size="sm" showValue={true} className="text-[10px] font-bold" />
                                    </div>
                                );
                            })}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="text-[12px] font-bold text-[#0C0D0F] mb-3 flex items-center gap-1">
                                    Things they did well? <span className="text-[#9CA3AF] font-normal text-[10px]">(Optional)</span>
                                </div>
                                <div className="w-full p-4 rounded-xl border border-[#E5E7EB] bg-white text-[11px] text-[#666666] italic leading-relaxed">
                                    {feedback?.strengths || 'No specific strengths noted.'}
                                </div>
                            </div>

                            <div>
                                <div className="text-[12px] font-bold text-[#0C0D0F] mb-3 flex items-center gap-1">
                                    Things they could improve? <span className="text-[#9CA3AF] font-normal text-[10px]">(Optional)</span>
                                </div>
                                <div className="w-full p-4 rounded-xl border border-[#E5E7EB] bg-white text-[11px] text-[#666666] italic leading-relaxed">
                                    {feedback?.improvements || 'No improvement notes provided.'}
                                </div>
                            </div>

                            {(sessionFeedback.comment && sessionFeedback.comment !== 'No public review available.') && (
                                <div className="pt-6 border-t border-[#F3F4F6]">
                                    <div className="text-[12px] font-bold text-[#0C0D0F] mb-3">General Review</div>
                                    <div className="w-full p-5 rounded-2xl bg-blue-50/50 border border-blue-100 text-[12px] text-gray-700 italic leading-relaxed shadow-sm uppercase-first">
                                        "{sessionFeedback.comment}"
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Modal>
    )
}
