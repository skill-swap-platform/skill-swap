import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SessionCompletedScreen, PostSessionFeedbackLayout } from '@/components/feedback/index'
import { BadgeUnlockedScreen } from '@/components/gamification/index'
import { useSubmitFeedback } from '@/hooks/index'
import { useBadgesStore } from '@/store/index'
import type { FeedbackFormData } from '@/types'
import { PostSessionTopNav } from '@/components/layout/index'
import { PostSessionFooter } from '@/components/layout/index'

export const SessionFeedback: React.FC = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [showForm, setShowForm] = useState(false)
    const sessionId = searchParams.get('sessionId') || ''
    const partnerName = searchParams.get('partnerName') || 'Your Partner'
    const partnerAvatar = searchParams.get('partnerAvatar') || undefined
    const role = (searchParams.get('role') || 'seeker') as 'provider' | 'seeker'

    const submitFeedbackMutation = useSubmitFeedback()
    const { recentlyUnlocked, setRecentlyUnlocked } = useBadgesStore()

    const handleRateNow = () => {
        setShowForm(true)
    }

    const handleSkip = () => {
        navigate('/dashboard')
    }

    const handleSubmitFeedback = async (data: FeedbackFormData) => {
        try {
            await submitFeedbackMutation.mutateAsync({
                sessionId,
                toUserId: 'partner-user-id', // Replace with actual partner ID
                ...data,
            })

            const badgeUnlocked = false // Replace with actual check

            if (badgeUnlocked) {
            } else {
                navigate('/dashboard')
            }
        } catch (error) {
            console.error('Failed to submit feedback:', error)
        }
    }

    const handleCloseBadge = () => {
        setRecentlyUnlocked(null)
        navigate('/dashboard')
    }

    if (recentlyUnlocked) {
        return (
            <BadgeUnlockedScreen
                badge={recentlyUnlocked}
                onClose={handleCloseBadge}
            />
        )
    }
    if (!showForm) {
        return (
            <div className="min-h-screen bg-[var(--neutral-lightest)]">
                <PostSessionTopNav />
                <SessionCompletedScreen
                    sessionId={sessionId}
                    partnerName={partnerName}
                    partnerAvatar={partnerAvatar}
                    onRateNow={handleRateNow}
                    onSkip={handleSkip}
                />
                <PostSessionFooter />
            </div>
        )
    }
    return (
        <div className="min-h-screen bg-[var(--neutral-lightest)]">
            <PostSessionTopNav />
            <PostSessionFeedbackLayout
                partnerName={partnerName}
                partnerAvatar={partnerAvatar}
                role={role}
                onSubmit={(data: { rating: 1 | 2 | 3 | 4 | 5; comment?: string; improvement?: string }) =>
                    handleSubmitFeedback({
                        rating: data.rating,
                        comment: data.comment,
                    } as FeedbackFormData)
                }
                onCancel={handleSkip}
                isSubmitting={submitFeedbackMutation.isPending}
            />
            <PostSessionFooter />
        </div>
    )
}
