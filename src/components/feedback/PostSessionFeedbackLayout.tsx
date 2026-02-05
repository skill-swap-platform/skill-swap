import React, { useMemo, useState } from 'react'
import { ThumbsDown, ThumbsUp, AlertCircle } from 'lucide-react'
import { Avatar, Rating, Button } from '@/components/common'

interface PostSessionFeedbackLayoutProps {
    partnerName: string
    partnerAvatar?: string
    role: 'provider' | 'seeker'
    onSubmit: (data: { rating: 1 | 2 | 3 | 4 | 5; comment?: string; improvement?: string }) => void
    onCancel: () => void
    isSubmitting?: boolean
}

export const PostSessionFeedbackLayout: React.FC<PostSessionFeedbackLayoutProps> = ({
    partnerName,
    partnerAvatar,
    role,
    onSubmit,
    onCancel,
    isSubmitting = false,
}) => {
    const questions = useMemo(() => {
        return role === 'provider'
            ? [
                'Were they focused the whole session?',
                'How good was their communication?',
                'Were they actively anticipating?',
                'Were they open for feedback?',
            ]
            : [
                'Were they Focus & Engagement',
                'How good was their communication?',
                'Patience',
                'Session Structure',
            ]
    }, [role])

    const [ratings, setRatings] = useState<Record<string, number>>(() =>
        Object.fromEntries(questions.map((q) => [q, 0]))
    )
    const [didShowUp, setDidShowUp] = useState<boolean | undefined>(undefined)
    const [selectedPositiveTags, setSelectedPositiveTags] = useState<string[]>([])
    const [selectedImproveTags, setSelectedImproveTags] = useState<string[]>([])

    const positiveTagOptions = ['Helpfulness', 'Communicator', 'Explanation']
    const improveTagOptions = ['Time management', 'Clarity', 'Pace']

    const toggleTag = (
        tag: string,
        setSelected: React.Dispatch<React.SetStateAction<string[]>>,
    ) => {
        setSelected((prev) => {
            const next = prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
            return next
        })
    }

    const overall = useMemo(() => {
        const vals = Object.values(ratings).filter((v) => v > 0)
        if (!vals.length) return 0
        return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
    }, [ratings])

    const canSubmit = didShowUp !== undefined && Object.values(ratings).every(r => r > 0)

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-10 items-start">
                <div className="bg-white rounded-[24px] border border-[#E5E7EB] p-8 shadow-sm">
                    <h3 className="text-2xl font-poppins font-bold text-[#0C0D0F] mb-8">
                        Session Details
                    </h3>

                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[#F3F4F6]">
                        <Avatar src={partnerAvatar} name={partnerName} size="xl" />
                        <div>
                            <div className="text-2xl font-bold text-[#0C0D0F]">
                                {partnerName}
                            </div>
                            <div className="text-sm text-[#666666] mt-1">
                                Graphic Design Expert
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {[
                            ['Session Date', 'Dec 28, 2025'],
                            ['Duration', '1 hour 30 min'],
                            ['Skill Learned', 'Adobe Illustrator Basics'],
                            ['Meeting Type', 'Video Call'],
                        ].map(([k, v]) => (
                            <div key={k} className="flex items-center justify-between text-base">
                                <span className="text-[#9CA3AF]">{k}</span>
                                <span className="text-[#0C0D0F] font-semibold">{v}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 rounded-[16px] bg-[#F4F9FF] border border-[#EBF5FF] p-6 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-[#3E8FCC] shrink-0 mt-0.5" />
                        <div className="text-sm leading-relaxed text-[#3E8FCC]">
                            <p className="font-semibold mb-1">Your feedback helps improve the platform</p>
                            <p className="text-[#666666] opacity-80">Reviews are visible to other users after both parties complete feedback.</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-[24px] border border-[#E5E7EB] p-10 shadow-sm">
                    <h2 className="text-[32px] font-poppins font-bold text-[#0C0D0F] mb-10">
                        How was your experience?
                    </h2>

                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="text-lg text-[#0C0D0F]">Did they show up on time?</div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setDidShowUp(true)}
                                    className={`h-11 w-11 rounded-xl border-2 grid place-items-center transition-all ${didShowUp === true
                                        ? 'border-[#16A34A] bg-[#F0FDF4]'
                                        : 'border-[#E5E7EB] hover:bg-[#F9FAFB]'
                                        }`}
                                >
                                    <ThumbsUp className={`w-5 h-5 ${didShowUp === true ? 'text-[#16A34A]' : 'text-[#9CA3AF]'}`} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDidShowUp(false)}
                                    className={`h-11 w-11 rounded-xl border-2 grid place-items-center transition-all ${didShowUp === false
                                        ? 'border-[#DC2626] bg-[#FEF2F2]'
                                        : 'border-[#E5E7EB] hover:bg-[#F9FAFB]'
                                        }`}
                                >
                                    <ThumbsDown className={`w-5 h-5 ${didShowUp === false ? 'text-[#DC2626]' : 'text-[#9CA3AF]'}`} />
                                </button>
                            </div>
                        </div>
                        {questions.map((q) => (
                            <div key={q} className="flex items-center justify-between gap-4">
                                <div className="text-lg text-[#0C0D0F]">{q}</div>
                                <Rating
                                    value={ratings[q] || 0}
                                    onChange={(v) => setRatings((s) => ({ ...s, [q]: v }))}
                                    size="md"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 space-y-8">
                        <div className="border border-[#E5E7EB] rounded-[24px] p-8 bg-[#FDFDFD]">
                            <div className="text-lg font-bold text-[#0C0D0F] mb-3">
                                Things they did well? <span className="text-[#9CA3AF] font-normal">(Optional)</span>
                            </div>
                            <textarea
                                value={selectedPositiveTags.join(', ')}
                                onChange={(e) => setSelectedPositiveTags(e.target.value.split(',').map(s => s.trim()))}
                                placeholder="What stood out positively?."
                                rows={3}
                                className="w-full p-5 rounded-[16px] border border-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#3E8FCC] bg-white text-base resize-none"
                            />
                            <div className="mt-4 flex flex-wrap gap-3">
                                {positiveTagOptions.map((t) => {
                                    const isActive = selectedPositiveTags.includes(t)
                                    return (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => toggleTag(t, setSelectedPositiveTags)}
                                            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${isActive
                                                ? 'bg-[#3E8FCC] border-[#3E8FCC] text-white shadow-md'
                                                : 'bg-white border-[#E5E7EB] text-[#666666] hover:bg-[#F9FAFB]'
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="border border-[#E5E7EB] rounded-[24px] p-8 bg-[#FDFDFD]">
                            <div className="text-lg font-bold text-[#0C0D0F] mb-3">
                                Things they could improve? <span className="text-[#9CA3AF] font-normal">(Optional)</span>
                            </div>
                            <textarea
                                value={selectedImproveTags.join(', ')}
                                onChange={(e) => setSelectedImproveTags(e.target.value.split(',').map(s => s.trim()))}
                                placeholder="Any suggestions for improvement?"
                                rows={3}
                                className="w-full p-5 rounded-[16px] border border-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#3E8FCC] bg-white text-base resize-none"
                            />
                            <div className="mt-4 flex flex-wrap gap-3">
                                {improveTagOptions.map((t) => {
                                    const isActive = selectedImproveTags.includes(t)
                                    return (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => toggleTag(t, setSelectedImproveTags)}
                                            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${isActive
                                                ? 'bg-[#3E8FCC] border-[#3E8FCC] text-white shadow-md'
                                                : 'bg-white border-[#E5E7EB] text-[#666666] hover:bg-[#F9FAFB]'
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex gap-5">
                        <Button
                            variant="ghost"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="flex-1 h-14 rounded-xl border-2 border-[#3E8FCC] text-[#3E8FCC] hover:bg-[#F9FAFB] text-lg font-bold transition-all"
                        >
                            Later
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() =>
                                onSubmit({
                                    rating: (Math.max(1, Math.min(5, Math.round(overall || 1))) as 1 | 2 | 3 | 4 | 5),
                                    comment: selectedPositiveTags.join(', '),
                                    improvement: selectedImproveTags.join(', '),
                                })
                            }
                            disabled={!canSubmit || isSubmitting}
                            isLoading={isSubmitting}
                            className="flex-1 h-14 rounded-xl bg-[#3E8FCC] hover:bg-[#2F71A3] text-white text-lg font-bold shadow-md active:scale-[0.98]"
                        >
                            Submit Feedback
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
