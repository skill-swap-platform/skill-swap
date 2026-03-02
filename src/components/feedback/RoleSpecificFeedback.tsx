import React, { useState } from 'react'
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react'

interface RoleSpecificFeedbackProps {
    partnerName: string
    partnerImage?: string
    sessionId: string
    role: 'teaching' | 'learning' | 'both'
    sessionMetadata?: {
        date?: string
        duration?: string
        skillName?: string
        communicationType?: string
    }
    onSubmit: (data: any) => void
    onSkip: () => void
}

export const RoleSpecificFeedback: React.FC<RoleSpecificFeedbackProps> = ({
    partnerName,
    partnerImage,
    sessionId,
    role,
    sessionMetadata,
    onSubmit,
    onSkip,
}) => {
    const [ratings, setRatings] = useState<Record<string, number>>({})
    const [improvements, setImprovements] = useState('')
    const [bestPart, setBestPart] = useState('')
    const [hoveredStar, setHoveredStar] = useState<{ questionId: string; star: number } | null>(null)
    const [onTime, setOnTime] = useState<boolean | null>(null)

    const getQuestions = () => {
        if (role === 'learning') {
            return [
                { id: 'learningFocus', label: 'Were they Focus & Engagement' },
                { id: 'communication', label: 'How good was their communication?' },
                { id: 'patience', label: 'Patience' },
                { id: 'sessionStructure', label: 'Session Structure' },
            ]
        } else if (role === 'teaching') {
            return [
                { id: 'sessionFocus', label: 'Were they focused the whole session?' },
                { id: 'communication', label: 'How good was their communication?' },
                { id: 'activeParticipation', label: 'Were they actively anticipating?' },
                { id: 'openToFeedback', label: 'Were they open for feedback?' },
            ]
        } else {
            return [
                { id: 'communication', label: 'Communication' },
                { id: 'overall', label: 'Overall Experience' },
            ]
        }
    }

    const questions = getQuestions()
    const setRating = (questionId: string, rating: number) => {
        setRatings(prev => ({ ...prev, [questionId]: rating }))
    }

    const canSubmit = onTime !== null && Object.keys(ratings).length >= questions.length

    return (
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl w-full">
            <div className="lg:w-[320px] shrink-0">
                <div className="bg-white rounded-lg p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Session Details</h3>

                    <div className="flex flex-col items-center mb-8 py-4">
                        {partnerImage ? (
                            <img
                                src={partnerImage}
                                alt={partnerName}
                                className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-[#E5F1FF]"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mb-3">
                                <span className="text-2xl text-white font-bold">{partnerName.charAt(0).toUpperCase()}</span>
                            </div>
                        )}
                        <h4 className="text-xl font-bold text-gray-900">{partnerName}</h4>
                        <p className="text-xs text-gray-400 mt-1">Session Partner</p>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-gray-50">
                        <DetailRow label="Session Date" value={sessionMetadata?.date || 'N/A'} />
                        <DetailRow label="Duration" value={sessionMetadata?.duration || '90 min'} />
                        <DetailRow label="Skill" value={sessionMetadata?.skillName || 'Skill Setup'} />
                        <DetailRow label="Meeting Type" value={sessionMetadata?.communicationType || 'Standard'} />
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">How was your experience?</h2>
                    <p className="text-sm text-gray-500 mb-8">
                        {role === 'learning'
                            ? 'Give feedback for the skill provider'
                            : role === 'teaching'
                                ? 'Give feedback for the skill seeker'
                                : 'Rate your overall experience'}
                    </p>

                    <div className="space-y-8">
                        {/* First question: thumbs up/down */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-700">Did they show up on time?</span>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setOnTime(true)}
                                    className={`p-2 rounded-full transition-all hover:scale-110 ${onTime === true ? 'bg-green-100' : 'hover:bg-gray-100'}`}
                                >
                                    <ThumbsUp className={`w-6 h-6 transition-colors ${onTime === true ? 'text-green-600 fill-green-200' : 'text-gray-400'}`} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOnTime(false)}
                                    className={`p-2 rounded-full transition-all hover:scale-110 ${onTime === false ? 'bg-red-100' : 'hover:bg-gray-100'}`}
                                >
                                    <ThumbsDown className={`w-6 h-6 transition-colors ${onTime === false ? 'text-red-500 fill-red-200' : 'text-gray-400'}`} />
                                </button>
                            </div>
                        </div>

                        {/* Star rating questions */}
                        {questions.map((question: any) => (
                            <div key={question.id} className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-gray-700">{question.label}</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        const isHovered = hoveredStar !== null && hoveredStar.questionId === question.id && hoveredStar.star >= star
                                        const isSelected = (ratings[question.id] || 0) >= star
                                        const shouldHighlight = isSelected || isHovered

                                        return (
                                            <button
                                                key={star}
                                                onClick={() => setRating(question.id, star)}
                                                onMouseEnter={() => setHoveredStar({ questionId: question.id, star })}
                                                onMouseLeave={() => setHoveredStar(null)}
                                                className="transition-all hover:scale-110"
                                            >
                                                <Star
                                                    className={`w-7 h-7 transition-colors ${shouldHighlight
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'fill-none text-gray-300'
                                                        }`}
                                                />
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}

                        <div className="space-y-3 pt-4">
                            <label className="text-sm font-semibold text-gray-700">
                                Things they did well? (Optional)
                            </label>
                            <textarea
                                value={bestPart}
                                onChange={(e) => setBestPart(e.target.value)}
                                placeholder="What stood out positively?"
                                className="w-full h-24 p-4 rounded-lg border border-gray-100 bg-gray-50 outline-none focus:ring-1 focus:ring-gray-200 resize-none text-sm"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-700">
                                Things they could improve? (Optional)
                            </label>
                            <textarea
                                value={improvements}
                                onChange={(e) => setImprovements(e.target.value)}
                                placeholder="Any suggestions for improvement?"
                                className="w-full h-24 p-4 rounded-lg border border-gray-100 bg-gray-50 outline-none focus:ring-1 focus:ring-gray-200 resize-none text-sm"
                            />
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={onSkip}
                                className="flex-1 h-12 rounded-lg border-2 border-[#3E8FCC] text-[#3E8FCC] font-bold hover:bg-gray-50 transition-all"
                            >
                                Later
                            </button>
                            <button
                                onClick={() => onSubmit({ sessionId, ratings, improvements, bestPart, onTime })}
                                disabled={!canSubmit}
                                className={`flex-1 h-12 rounded-lg font-bold transition-all shadow-sm ${!canSubmit
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#3E8FCC] text-white hover:bg-[#2F71A3]'
                                    }`}
                            >
                                Submit Feedback
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between items-center text-xs">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-900 font-bold">{value}</span>
    </div>
)
