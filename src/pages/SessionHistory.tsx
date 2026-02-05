import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Search, Filter } from 'lucide-react'
import { SessionHistoryList } from '@/components/feedback/index'
import { ViewFeedbackModal } from '@/components/feedback/index'
import { PostSessionFooter } from '@/components/layout/index'
import type { SessionFeedback, FeedbackRating } from '@/types/index'

// ---------------- MOCK SESSIONS ----------------
const mockSessions = [
    {
        id: "s1",
        date: new Date(),
        partnerName: "Sarah Jones",
        partnerAvatar: undefined,
        skillName: "React Basics",
        role: "seeker" as const,
        feedback: {
            id: "f1",
            sessionId: "s1",
            fromUserId: "u1",
            toUserId: "u2",
            rating: 5 as FeedbackRating,
            comment: "Great session",
            tags: ["clear", "helpful"],
            createdAt: new Date()
        }
    },
    {
        id: "s2",
        date: new Date(),
        partnerName: "Alex Smith",
        partnerAvatar: undefined,
        skillName: "TypeScript",
        role: "provider" as const,
        feedback: undefined
    }
];


// ---------------- MOCK FEEDBACK ----------------
const mockSessionFeedback: SessionFeedback = {
    sessionId: 's1',
    providerFeedback: {
        id: 'f1',
        sessionId: 's1',
        fromUserId: 'u1',
        toUserId: 'u2',
        rating: 5,
        comment: 'Great participation!',
        wasHelpful: true,
        wouldRecommend: true,
        tags: ['Helpfulness', 'Clarity'],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    seekerFeedback: {
        id: 'f2',
        sessionId: 's1',
        fromUserId: 'u2',
        toUserId: 'u1',
        rating: 5,
        comment: 'Excellent session!',
        wasHelpful: true,
        wouldRecommend: true,
        tags: ['Professional'],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    mutualRating: 5,
    isComplete: true,
}

export const SessionHistory: React.FC = () => {
    const [isViewFeedbackOpen, setIsViewFeedbackOpen] = useState(false)
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)

    const handleViewFeedback = (sessionId: string) => {
        setSelectedSessionId(sessionId)
        setIsViewFeedbackOpen(true)
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
            <div className="flex-1 pb-20">

                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                        <Link to="/" className="hover:text-[#3E8FCC]">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-[#0C0D0F] font-medium">Sessions</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex gap-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                                <input
                                    type="text"
                                    placeholder="Search sessions..."
                                    className="pl-12 pr-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-sm"
                                />
                            </div>
                            <button className="p-3 rounded-xl bg-white border border-[#E5E7EB]">
                                <Filter className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <SessionHistoryList
                        sessions={mockSessions}
                        onViewFeedback={handleViewFeedback}
                    />
                </div>

                <ViewFeedbackModal
                    isOpen={isViewFeedbackOpen}
                    onClose={() => setIsViewFeedbackOpen(false)}
                    sessionFeedback={{ ...mockSessionFeedback, sessionId: selectedSessionId || 's1' }}
                    providerName="Sarah Jones"
                    seekerName="Alex Smith"
                />

                <PostSessionFooter />
            </div>
        </div>
    )
}
