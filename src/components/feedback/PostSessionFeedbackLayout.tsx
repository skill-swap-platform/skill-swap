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
                </div>
            </div>
        </div>
    )
}
