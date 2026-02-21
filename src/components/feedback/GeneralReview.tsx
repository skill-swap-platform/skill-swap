import React, { useState } from 'react'
import { Info } from 'lucide-react'

interface GeneralReviewProps {
    partnerName: string
    swapRequestId: string
    onSubmit: (data: any) => void
    onSkip: () => void
}

export const GeneralReview: React.FC<GeneralReviewProps> = ({
    partnerName,
    swapRequestId,
    onSubmit,
    onSkip,
}) => {
    const [comment, setComment] = useState('')
    const [isPublic, setIsPublic] = useState(false)
    const [selectedTags, setSelectedTags] = useState<string[]>([])

    const tags = ['clear', 'Helpful', 'Knowledgeable', 'Patient', 'Engaging', 'On time']

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            const tagPattern = new RegExp(`#${tag}\\s*`, 'gi')
            setComment(prev => prev.replace(tagPattern, '').trim())
            setSelectedTags(prev => prev.filter(t => t !== tag))
        } else {
            setComment(prev => prev ? `${prev} #${tag}` : `#${tag}`)
            setSelectedTags(prev => [...prev, tag])
        }
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl w-full">
            <div className="lg:w-[320px] shrink-0">
                <div className="bg-white rounded-lg p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Session Details</h3>

                    <div className="flex flex-col items-center mb-8 py-4">
                        <h4 className="text-xl font-bold text-gray-900">{partnerName}</h4>
                        <p className="text-xs text-gray-400 mt-1">Session Partner</p>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-gray-50">
                        <DetailRow label="Session Date" value="Dec 28, 2025" />
                        <DetailRow label="Duration" value="1 hour 30 min" />
                        <DetailRow label="Skill Learned" value="Adobe Illustrator Basics" />
                        <DetailRow label="Meeting Type" value="Video Call" />
                    </div>

                    <div className="mt-8 p-4 bg-[#F3F9FF] rounded-lg flex gap-3 border border-[#E5F1FF]">
                        <Info className="w-5 h-5 text-[#3E8FCC] shrink-0" />
                        <p className="text-[10px] text-[#3E8FCC] leading-relaxed">
                            Your feedback helps improve the platform. Reviews are visible to other users after both parties complete feedback.
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex-1">
                <div className="bg-white rounded-lg p-8 border border-gray-100 shadow-sm min-h-full flex flex-col">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Leave a Review</h2>
                    <p className="text-sm text-gray-500 mb-8">How was your teaching session?</p>

                    <div className="flex-1 space-y-6">
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-gray-900">Share your experience</label>
                            <div className="relative">
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="What did you like about this session?"
                                    className="w-full h-32 p-4 pt-6 rounded-lg border border-gray-100 bg-gray-50 outline-none focus:ring-1 focus:ring-gray-200 resize-none text-sm"
                                    maxLength={200}
                                />
                                <span className="absolute bottom-4 right-4 text-[10px] text-gray-400">
                                    {comment.length}/200
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {tags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`px-3 py-1.5 rounded-md text-[10px] border transition-all ${selectedTags.includes(tag)
                                            ? 'bg-[#3E8FCC] text-white border-[#3E8FCC]'
                                            : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={isPublic}
                                    onChange={() => setIsPublic(!isPublic)}
                                />
                                <div className={`w-5 h-5 rounded-md border-2 transition-all ${isPublic ? 'bg-[#3E8FCC] border-[#3E8FCC]' : 'border-gray-300 group-hover:border-gray-400'
                                    }`}>
                                    {isPublic && (
                                        <svg className="w-full h-full text-white p-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                            <path d="M20 6L9 17L4 12" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <span className="text-sm text-gray-600">Make review public</span>
                        </label>
                    </div>

                    <div className="flex gap-4 mt-12">
                        <button
                            onClick={onSkip}
                            className="flex-1 h-12 rounded-lg border-2 border-[#3E8FCC] text-[#3E8FCC] font-bold hover:bg-gray-50 transition-all"
                        >
                            Skip
                        </button>
                        <button
                            onClick={() => onSubmit({ swapRequestId, comment, isPublic })}
                            disabled={!comment.trim() && selectedTags.length === 0}
                            className={`flex-1 h-12 rounded-lg font-bold transition-all shadow-sm ${(!comment.trim() && selectedTags.length === 0)
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-[#3E8FCC] text-white hover:bg-[#2F71A3]'
                                }`}
                        >
                            Submit Review
                        </button>
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