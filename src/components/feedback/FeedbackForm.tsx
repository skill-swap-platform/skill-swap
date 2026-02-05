import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Rating } from '@/components/common'
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react'
import type { FeedbackFormData, FeedbackRating } from '@/types/index'

interface FeedbackFormProps {
    partnerName: string
    partnerAvatar?: string
    role: 'provider' | 'seeker'
    onSubmit: (data: FeedbackFormData) => void
    onCancel?: () => void
    isSubmitting?: boolean
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
    partnerName,
    partnerAvatar,
    role,
    onSubmit,
    onCancel,
    isSubmitting = false,
}) => {
    const [formData, setFormData] = useState<FeedbackFormData>({
        rating: 0 as FeedbackRating,
        comment: '',
        wasHelpful: undefined,
        wouldRecommend: undefined,
        tags: [],
    })

    const handleSubmit = () => {
        if (formData.rating > 0) {
            onSubmit(formData)
        }
    }
    const isValid = formData.rating > 0
    const roleText = role === 'provider' ? 'teaching' : 'learning'
    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>How was your experience?</CardTitle>
                <p className="text-sm text-[var(--text-secondary)] mt-2">
                    Help us improve by sharing feedback about your {roleText} session.
                </p>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="flex items-center gap-3 p-4 rounded-lg border border-[var(--neutral-light)] bg-[var(--neutral-lightest)]">
                    {partnerAvatar ? (
                        <img
                            src={partnerAvatar}
                            alt={partnerName}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-medium">
                            {partnerName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <p className="font-medium text-[var(--text-primary)]">{partnerName}</p>
                        <p className="text-sm text-[var(--text-secondary)] capitalize">{role}</p>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                        Overall Rating *
                    </label>
                    <div className="flex justify-center">
                        <Rating
                            value={formData.rating}
                            onChange={(value) => setFormData({ ...formData, rating: value as FeedbackRating })}
                            size="lg"
                        />
                    </div>
                    {formData.rating > 0 && (
                        <p className="text-center text-sm text-[var(--text-secondary)] mt-2">
                            {formData.rating === 5 && '⭐ Excellent!'}
                            {formData.rating === 4 && '👍 Great!'}
                            {formData.rating === 3 && '😊 Good'}
                            {formData.rating === 2 && '😐 Fair'}
                            {formData.rating === 1 && '😞 Poor'}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                        Was this session helpful?
                    </label>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setFormData({ ...formData, wasHelpful: true })}
                            className={`flex-1 p-4 rounded-lg border-2 transition-all ${formData.wasHelpful === true
                                ? 'border-[var(--success)] bg-[color-mix(in_srgb,var(--success)_10%,white)]'
                                : 'border-[var(--neutral-light)] hover:border-[var(--success)]'
                                }`}
                        >
                            <ThumbsUp className={`w-6 h-6 mx-auto mb-2 ${formData.wasHelpful === true ? 'text-[var(--success)]' : 'text-[var(--text-tertiary)]'
                                }`} />
                            <p className="text-sm font-medium text-center">Yes</p>
                        </button>

                        <button
                            onClick={() => setFormData({ ...formData, wasHelpful: false })}
                            className={`flex-1 p-4 rounded-lg border-2 transition-all ${formData.wasHelpful === false
                                ? 'border-[var(--error)] bg-[color-mix(in_srgb,var(--error)_10%,white)]'
                                : 'border-[var(--neutral-light)] hover:border-[var(--error)]'
                                }`}
                        >
                            <ThumbsDown className={`w-6 h-6 mx-auto mb-2 ${formData.wasHelpful === false ? 'text-[var(--error)]' : 'text-[var(--text-tertiary)]'
                                }`} />
                            <p className="text-sm font-medium text-center">No</p>
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                        Would you recommend {partnerName}?
                    </label>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setFormData({ ...formData, wouldRecommend: true })}
                            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${formData.wouldRecommend === true
                                ? 'border-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,white)] text-[var(--primary)]'
                                : 'border-[var(--neutral-light)] hover:border-[var(--primary)]'
                                }`}
                        >
                            <p className="font-medium text-center">Yes, definitely!</p>
                        </button>

                        <button
                            onClick={() => setFormData({ ...formData, wouldRecommend: false })}
                            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${formData.wouldRecommend === false
                                ? 'border-[var(--neutral-light)] bg-[var(--neutral-light)]'
                                : 'border-[var(--neutral-light)] hover:bg-[var(--neutral-light)]'
                                }`}
                        >
                            <p className="font-medium text-center">Not really</p>
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        <MessageSquare className="w-4 h-4 inline mr-2" />
                        Comments (Optional)
                    </label>
                    <textarea
                        value={formData.comment}
                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        placeholder="Share your thoughts about this session..."
                        rows={4}
                        className="w-full px-4 py-3 border border-[var(--neutral-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none bg-white"
                        maxLength={500}
                    />
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">
                        {(formData.comment || '').length}/500 characters
                    </p>
                </div>
            </CardContent>

            <CardFooter>
                <div className="flex gap-3 w-full">
                    {onCancel && (
                        <Button
                            variant="secondary"
                            onClick={onCancel}
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        className="flex-1"
                        disabled={!isValid || isSubmitting}
                        isLoading={isSubmitting}
                    >
                        Submit Feedback
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
