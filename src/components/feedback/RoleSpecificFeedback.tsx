import React, { useState } from 'react'
import { Star } from 'lucide-react'

interface RoleSpecificFeedbackProps {
    partnerName: string
    sessionId: string
    role: 'teaching' | 'learning' | 'both'
    onSubmit: (data: any) => void
    onSkip: () => void
}

export const RoleSpecificFeedback: React.FC<RoleSpecificFeedbackProps> = ({
    partnerName,
    sessionId,
    role,
    onSubmit,
    onSkip,
}) => {
    const [ratings, setRatings] = useState<Record<string, number>>({})
    const [improvements, setImprovements] = useState('')
    const [bestPart, setBestPart] = useState('')
    const [hoveredStar, setHoveredStar] = useState<{ questionId: string; star: number } | null>(null)

    const getQuestions = () => {
        if (role === 'learning') {
            return [
                { id: 'communication', label: 'Communication Quality' },
                { id: 'learningFocus', label: 'Focus during session' },
                { id: 'clarity', label: 'Clarity of goals' },
                { id: 'patience', label: 'Patience & Engagement' },
                { id: 'sessionStructure', label: 'Structure of the learning' }
            ]
        } else if (role === 'teaching') {
            return [
                { id: 'communication', label: 'Communication Quality' },
                { id: 'sessionFocus', label: 'Focus & Preparation' },
                { id: 'activeParticipation', label: 'Active Participation' },
                { id: 'openToFeedback', label: 'Openness to Feedback' }
            ]
        } else {
            return [
                { id: 'communication', label: 'Communication' },
                { id: 'overall', label: 'Overall Experience' }
            ]
        }
    }

    const questions = getQuestions()

    const setRating = (questionId: string, rating: number) => {
        setRatings(prev => ({ ...prev, [questionId]: rating }))
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl w-full">
            <div className="lg:w-[320px] shrink-0">
                <div className="bg-white rounded-lg p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Session Details</h3>

                    <div className="flex flex-col items-center mb-8 py-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mb-3">
                            <span className="text-2xl">👤</span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">{partnerName}</h4>
                        <p className="text-xs text-gray-400 mt-1">Session Partner</p>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-gray-50">
                        <DetailRow label="Session Date" value="Dec 28, 2025" />
                        <DetailRow label="Duration" value="1 hour 30 min" />
                        <DetailRow label="Skill Learned" value="Adobe Illustrator Basics" />
                        <DetailRow label="Meeting Type" value="Video Call" />
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">How was your experience?</h2>
                    <p className="text-sm text-gray-500 mb-8">
                        {role === 'learning'
                            ? 'Give feedback for the skill seeker'
                            : role === 'teaching'
                                ? 'Give feedback for the skill provider'
                                : 'Rate your overall experience'}
                    </p>

                    <div className="space-y-8">
                        {questions.map((question: any) => (
                            <div key={question.id} className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700">{question.label}</label>
                                <div className="flex gap-2">
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
                                                    className={`w-8 h-8 transition-colors ${shouldHighlight
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
                                onClick={() => onSubmit({ sessionId, ratings, improvements, bestPart })}
                                disabled={Object.keys(ratings).length < questions.length}
                                className={`flex-1 h-12 rounded-lg font-bold transition-all shadow-sm ${(Object.keys(ratings).length < questions.length)
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
