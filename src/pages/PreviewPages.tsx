import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SessionCompletedScreen } from '@/components/feedback/SessionCompletedScreen'
import { FeedbackForm } from '@/components/feedback/FeedbackForm'
import { BadgeUnlockedScreen } from '@/components/gamification/BadgeUnlockedScreen'
import { PointsModal } from '@/components/gamification/PointsModal'
import { ManageBadgeModal } from '@/components/gamification/ManageBadgeModal'
import type { Badge } from '@/types'

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
    }
]

export const PreviewSessionCompleted: React.FC = () => {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
            <SessionCompletedScreen
                partnerName="Sarah Jones"
                onContinue={() => navigate('/preview/feedback-form')}
                onReport={() => console.log('Report issue')}
            />
        </div>
    )
}

export const PreviewBadgeUnlocked: React.FC = () => {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
            <BadgeUnlockedScreen
                unlockedBadges={[]}
                nextBadge={undefined}
                onContinue={() => navigate('/dashboard')}
            />
        </div>
    )
}

export const PreviewFeedbackForm: React.FC = () => {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center py-12 px-4">
            <FeedbackForm
                partnerName="Sarah Jones"
                role="learning"
                onSubmit={(data) => {
                    console.log('Submit', data)
                    navigate('/preview/badge-unlocked')
                }}
                onSkip={() => navigate('/dashboard')}
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
