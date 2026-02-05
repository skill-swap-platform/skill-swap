import React from 'react'
import { Card, Avatar, RatingDisplay } from '@/components/common'
import { formatDate } from '@/utils'
import type { Feedback } from '@/types/index'
interface FeedbackCardProps {
    feedback: Feedback
    fromUserName: string
    fromUserAvatar?: string
    showDate?: boolean
    className?: string
}
export const FeedbackCard: React.FC<FeedbackCardProps> = ({
    feedback,
    fromUserName,
    fromUserAvatar,
    showDate = true,
    className = '',
}) => {
    return (
        <Card className={className}>
            <div className="flex items-start gap-4">
                <Avatar
                    src={fromUserAvatar}
                    name={fromUserName}
                    size="md"
                />

                <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h4 className="font-medium text-text-primary">{fromUserName}</h4>
                            {showDate && (
                                <p className="text-xs text-text-tertiary">
                                    {formatDate(feedback.createdAt, 'MMM dd, yyyy')}
                                </p>
                            )}
                        </div>
                        <RatingDisplay
                            value={feedback.rating}
                            size="sm"
                            showValue={false}
                        />
                    </div>

                    {feedback.comment && (
                        <p className="text-sm text-text-secondary leading-relaxed">
                            {feedback.comment}
                        </p>
                    )}
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-text-tertiary">
                        {feedback.wasHelpful !== undefined && (
                            <span>
                                {feedback.wasHelpful ? '✅ Was helpful' : '❌ Not helpful'}
                            </span>
                        )}
                        {feedback.wouldRecommend !== undefined && (
                            <span>
                                {feedback.wouldRecommend ? '👍 Would recommend' : '👎 Would not recommend'}
                            </span>
                        )}
                    </div>
                    {feedback.tags && feedback.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {feedback.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-neutral-light rounded text-xs text-text-secondary"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
}
