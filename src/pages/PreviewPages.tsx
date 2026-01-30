import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SessionCompletedScreen, FeedbackForm } from '@/components/feedback'
import { BadgeUnlockedScreen, PointsModal } from '@/components/gamification'
import { ManageBadgeModal } from '@/components/gamification/ManageBadgeModal'
import type { Badge, UserBadge } from '@/types'

// Mock data
const mockBadges: Badge[] = [
    {
        id: '1',
        name: 'Community Hero',
        description: 'Helped 100 members',
        icon: '⭐',
        color: '#F59E0B',
        category: 'community' as const,
        requiredPoints: 100,
        requiredSessions: 10
    },
    {
        id: '2',
        name: 'Fast Learner',
        description: 'Finished 5 sessions in a week',
        icon: '🚀',
        color: '#3E8FCC',
        category: 'learning' as const,
        requiredPoints: 50,
        requiredSessions: 5
    },
]

export const PreviewSessionCompleted: React.FC = () => {
    const [showFeedback, setShowFeedback] = useState(false)
    const navigate = useNavigate()

    if (showFeedback) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] py-8 px-4">
                <FeedbackForm
                    partnerName="Sarah Jones"
                    role="seeker"
                    onSubmit={(data) => {
                        console.log('Submit', data)
                        navigate('/dashboard')
                    }}
                    onCancel={() => navigate('/dashboard')}
                    isSubmitting={false}
                />
            </div>
        )
    }

    return (
        <SessionCompletedScreen
            sessionId="s1"
            partnerName="Sarah Jones"
            onRateNow={() => setShowFeedback(true)}
            onSkip={() => navigate('/dashboard')}
        />
    )
}

export const PreviewBadgeUnlocked: React.FC = () => {
    const navigate = useNavigate()
    const userBadge: UserBadge = {
        ...mockBadges[0],
        awardedAt: new Date(),
    }
    return (
        <BadgeUnlockedScreen
            badge={userBadge}
            onClose={() => navigate('/dashboard')}
        />
    )
}

export const PreviewFeedbackForm: React.FC = () => {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-[#F9FAFB] py-8 px-4">
            <FeedbackForm
                partnerName="Sarah Jones"
                role="seeker"
                onSubmit={(data) => {
                    console.log('Submit', data)
                    navigate('/dashboard')
                }}
                onCancel={() => navigate('/dashboard')}
                isSubmitting={false}
            />
        </div>
    )
}

export const PreviewManageBadges: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center py-20">
            <div className="text-center">
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-6 py-3 bg-[#3E8FCC] text-white rounded-xl font-bold"
                >
                    Open Manage Badges Modal
                </button>
            </div>
            <ManageBadgeModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                userName="Alex Smith"
                availableBadges={mockBadges}
                userBadges={[]}
                onAssignBadge={() => { }}
                onRemoveBadge={() => { }}
            />
        </div>
    )
}

export const PreviewPointsManage: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center py-20">
            <div className="text-center">
                <button onClick={() => setIsOpen(true)} className="px-6 py-3 bg-[#3E8FCC] text-white rounded-xl font-bold">
                    Open Points Modal
                </button>
            </div>
            <PointsModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                userName="Alex Smith"
                currentPoints={1250}
            />
        </div>
    )
}
