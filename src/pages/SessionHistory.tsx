import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Search, Filter } from 'lucide-react'
import { SessionHistoryList } from '@/components/feedback/index'
import { ViewFeedbackModal } from '@/components/feedback/index'
import { PostSessionFooter, PostSessionTopNav } from '@/components/layout/index'
import { SessionHistorySidebar } from '@/components/feedback/SessionHistorySidebar'
import type { SessionFeedback } from '@/types/index'

// ---------------- MOCK SESSIONS ----------------
const mockSessions = [
    { id: "1", date: new Date('2025-12-10'), partnerName: "Samira Patel", skillName: "Digital Marketing", role: "seeker" as const },
    { id: "2", date: new Date('2025-12-10'), partnerName: "Samira Patel", skillName: "Digital Marketing", role: "seeker" as const, feedback: { rating: 4 } },
    { id: "3", date: new Date('2025-12-10'), partnerName: "Samira Patel", skillName: "Digital Marketing", role: "seeker" as const },
    { id: "4", date: new Date('2025-12-10'), partnerName: "Samira Patel", skillName: "Digital Marketing", role: "seeker" as const, feedback: { rating: 4 } },
    { id: "5", date: new Date('2026-01-15'), partnerName: "Alex Johnson", skillName: "User Experience Design", role: "seeker" as const },
    { id: "6", date: new Date('2026-02-20'), partnerName: "Jamie Lee", skillName: "Data Analysis Fundamentals", role: "seeker" as const },
    { id: "7", date: new Date('2026-03-05'), partnerName: "Chris Adams", skillName: "Web Development Basics", role: "seeker" as const },
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
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans">
            <PostSessionTopNav />

            <div className="flex-1 pb-20">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-2 text-[10px] text-[#9CA3AF] mb-8">
                        <Link to="/" className="hover:text-[#3E8FCC]">Home</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-[#0C0D0F] font-bold">Sessions</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
                        {/* Main Content */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                                        <input
                                            type="text"
                                            placeholder="Search sessions..."
                                            className="pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs w-64 outline-none focus:ring-1 focus:ring-[#3E8FCC] transition-all"
                                        />
                                    </div>
                                    <button className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:bg-gray-50 transition-colors">
                                        <Filter className="w-4 h-4 text-[#666666]" />
                                    </button>
                                </div>
                            </div>

                            <SessionHistoryList
                                sessions={mockSessions as any}
                                onViewFeedback={handleViewFeedback}
                            />
                        </div>

                        {/* Sidebar */}
                        <SessionHistorySidebar />
                    </div>
                </div>
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
    )
}
