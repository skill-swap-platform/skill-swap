import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, Search, Filter, Loader2 } from 'lucide-react'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import { SessionHistoryList } from '@/components/feedback/index'
import { ViewFeedbackModal } from '@/components/feedback/index'
import { PostSessionFooter, PostSessionTopNav } from '@/components/layout/index'
import { SessionHistorySidebar } from '@/components/feedback/SessionHistorySidebar'
import type { SessionFeedback } from '@/types/index'
import { sessionService } from '@/api/services/session.service'
import { userService } from '@/api/services/user.service'


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
    const navigate = useNavigate()
    const [isViewFeedbackOpen, setIsViewFeedbackOpen] = useState(false)
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
    const [sessions, setSessions] = useState<any[]>([])
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                setIsLoading(true)

                const [userRes, sessionRes] = await Promise.all([
                    userService.getCurrentProfile(),
                    sessionService.getHistory(),
                ])

                if (userRes.success) {
                    setCurrentUser(userRes.data)
                }

                if (sessionRes.success) {
                    const rawSessions: any[] = sessionRes.data.data || []
                    const currentUserId = userRes.data?.id

                    if (rawSessions.length === 0) {
                        // Restore Demo Mode for this specific UUID
                        setSessions([{
                            id: '3b6f1d2e-1111-4b2c-9c2f-1a2b3c4d5e6f',
                            date: new Date(),
                            partnerName: 'Test Partner',
                            partnerAvatar: undefined,
                            skillName: 'React & AI Assistant',
                            role: 'seeker',
                            status: 'SCHEDULED',
                            swapRequestId: 'd979cfc4-b2e0-4d0a-93cd-6f1f8c53f01e'
                        }])
                        return
                    }

                    const transformed = rawSessions.map((s: any) => {
                        const isHost = s.host?.id === currentUserId
                        const partner = isHost ? s.attendee : s.host
                        return {
                            id: s.id,
                            date: new Date(s.scheduledAt),
                            partnerName: partner?.userName || 'Unknown Partner',
                            partnerAvatar: partner?.image ?? undefined,
                            skillName: s.skill?.name || s.title || 'Skill Session',
                            role: isHost ? 'provider' : 'seeker',
                            status: s.status,
                            swapRequestId: s.swapRequest?.id,
                        }
                    })

                    setSessions(transformed)
                } else {
                    setError('Failed to load session history.')
                }
            } catch (err: any) {
                console.error('Failed to fetch session history:', err)
                if (err.response?.status === 401) {
                    setSessions([])
                } else {
                    setError('An error occurred while fetching your sessions.')
                }
            } finally {
                setIsLoading(false)
            }
        }

        fetchSessions()
    }, [])

    const handleViewFeedback = async (sessionId: string, action?: 'view' | 'complete') => {
        if (action === 'complete') {
            if (sessionId?.toLowerCase().includes('3b6f1d2e')) {
                navigate(`/session-feedback/${sessionId}`)
                return
            }

            try {
                const session = sessions.find((s) => s.id === sessionId)
                if (session?.status === 'SCHEDULED') {
                    const response = await sessionService.completeSession(
                        sessionId,
                        'Completed via history page'
                    )
                    if (!response.success) {
                        alert('Failed to complete session. Please try again.')
                        return
                    }
                }
                navigate(`/session-feedback/${sessionId}`)
            } catch (err: any) {
                console.error('Failed to complete session:', err)
                alert(err.response?.data?.message || 'Failed to complete session. Please try again.')
            }
            return
        }

        setSelectedSessionId(sessionId)
        setIsViewFeedbackOpen(true)
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans">
            <PostSessionTopNav />

            <div className="flex-1 pb-20">
                <div className="max-w-7xl mx-auto px-4 py-8">

                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2 text-[10px] text-[#9CA3AF]">
                            <Link to="/" className="hover:text-[#3E8FCC]">Home</Link>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-[#0C0D0F] font-bold">Sessions</span>
                        </div>
                        {currentUser && (
                            <span className="text-xs text-gray-500">
                                Welcome back,{' '}
                                <span className="font-bold text-[#3E8FCC]">{currentUser.userName}</span>
                            </span>
                        )}
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

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[24px] border border-gray-100">
                                    <Loader2 className="w-10 h-10 text-[#3E8FCC] animate-spin mb-4" />
                                    <p className="text-gray-500">Loading your session history...</p>
                                </div>
                            ) : error ? (
                                <div className="p-10 text-center bg-white rounded-[24px] border border-gray-100">
                                    <p className="text-red-500 mb-4">{error}</p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="text-[#3E8FCC] font-bold underline"
                                    >
                                        Try again
                                    </button>
                                </div>
                            ) : sessions.length === 0 ? (
                                <div className="p-20 text-center bg-white rounded-[24px] border border-gray-100">
                                    <p className="text-gray-500 mb-2">No sessions found yet.</p>
                                    <Link to="/explore" className="text-[#3E8FCC] font-bold">
                                        Explore skills to start swapping!
                                    </Link>
                                </div>
                            ) : (
                                <SessionHistoryList
                                    sessions={sessions}
                                    onViewFeedback={handleViewFeedback}
                                />
                            )}
                        </div>

                        {/* Sidebar */}
                        <SessionHistorySidebar />
                    </div>
                </div>
            </div>

            <ViewFeedbackModal
                isOpen={isViewFeedbackOpen}
                onClose={() => setIsViewFeedbackOpen(false)}
                sessionFeedback={{
                    ...mockSessionFeedback,
                    sessionId: selectedSessionId || 's1',
                }}
                providerName="Sarah Jones"
                seekerName="Alex Smith"
            />

            <PostSessionFooter />
        </div>
    )
}