import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, Search, Filter } from 'lucide-react'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import { SessionHistoryList } from '@/components/feedback/index'
import { ViewFeedbackModal } from '@/components/feedback/index'
import { SessionHistorySidebar } from '@/components/feedback/SessionHistorySidebar'
import { sessionService } from '@/api/services/session.service'
import { userService } from '@/api/services/user.service'

export const SessionHistory: React.FC = () => {
    const navigate = useNavigate()
    const [isViewFeedbackOpen, setIsViewFeedbackOpen] = useState(false)
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
    const [selectedSession, setSelectedSession] = useState<any>(null)
    const [receivedReview, setReceivedReview] = useState<any>(null)
    const [sessions, setSessions] = useState<any[]>([])
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [sessionDetailLoading, setSessionDetailLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [pageSize] = useState(10)

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                setIsLoading(true)

                const userRes = await userService.getCurrentProfile()
                if (userRes.success) {
                    setCurrentUser(userRes.data)
                }

                const response = await sessionService.getHistory({ page: currentPage, limit: pageSize })
                if (response.success && userRes.success) {
                    const rawSessions = response.data.data || []
                    const currentUserId = userRes.data.id

                    // Backend returns totalPages or we calculate it
                    setTotalPages(response.data.totalPages || Math.ceil((response.data.total || 0) / pageSize) || 1)

                    const transformed = rawSessions.map((s: any) => {
                        const isHost = s.host?.id === currentUserId
                        const partner = isHost ? s.attendee : s.host

                        return {
                            id: s.id,
                            date: new Date(s.scheduledAt),
                            partnerName: partner?.userName || 'Unknown Partner',
                            partnerAvatar: partner?.image,
                            skillName: s.skill?.name || s.title,
                            role: isHost ? 'provider' : 'seeker',
                            status: s.status,
                            _raw: s,
                            _partner: partner,
                        }
                    })
                    setSessions(transformed)
                } else if (!response.success) {
                    setError('Failed to load session history')
                }
            } catch (err: any) {
                console.error('Failed to fetch session history:', err)
                setError('An error occurred while fetching your sessions.')
                if (err.response?.status === 401 || err.response?.status === 404) {
                    setSessions([])
                }
            } finally {
                setIsLoading(false)
            }
        }
        fetchSessions()
    }, [currentPage, pageSize])

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const handleViewFeedback = async (sessionId: string, action?: 'view' | 'complete') => {
        if (action === 'complete') {
            try {
                const response = await sessionService.completeSession(sessionId, 'Completed via history page')
                if (response.success) {
                    navigate(`/session-feedback/${sessionId}`)
                }
            } catch (err) {
                console.error('Failed to complete session:', err)
                alert('Failed to complete session. Please try again.')
            }
            return
        }

        setSelectedSessionId(sessionId)
        setIsViewFeedbackOpen(true)
        setSessionDetailLoading(true)
        try {
            const [detailRes, reviewsRes] = await Promise.all([
                sessionService.getSessionDetail(sessionId),
                sessionService.getReceivedReviews(1, 50)
            ])

            if (detailRes.success) {
                const sData = detailRes.data;
                setSelectedSession(sData)

                const isHost = sData.host?.id === currentUser?.id;
                const partnerId = isHost ? sData.attendee?.id : sData.host?.id;

                if (reviewsRes.success && reviewsRes.data.reviews) {
                    const match = reviewsRes.data.reviews.find((r: any) =>
                        r.reviewer?.id === partnerId
                    );

                    if (match) {
                        try {
                            const fullReview = await sessionService.getReviewDetail(match.id);
                            setReceivedReview(fullReview.success ? fullReview.data : match);
                        } catch {
                            setReceivedReview(match);
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Failed to fetch session feedback details:', err)
        } finally {
            setSessionDetailLoading(false)
        }
    }

    const getSessionNames = () => {
        if (!selectedSession || !currentUser) {
            const fallback = sessions.find(s => s.id === selectedSessionId)
            return {
                providerName: fallback?.role === 'provider' ? currentUser?.userName || 'You' : fallback?.partnerName || 'Provider',
                seekerName: fallback?.role === 'seeker' ? currentUser?.userName || 'You' : fallback?.partnerName || 'Seeker',
                skillName: fallback?.skillName || 'Session',
            }
        }
        const isHost = selectedSession.host?.id === currentUser.id
        return {
            providerName: isHost ? currentUser.userName || 'You' : selectedSession.host?.userName || 'Provider',
            seekerName: isHost ? selectedSession.attendee?.userName || 'Seeker' : currentUser.userName || 'You',
            skillName: selectedSession.skill?.name || selectedSession.title || 'Session',
        }
    }

    const sessionNames = getSessionNames()

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans">
            <Header activeTab="Sessions" />

            <div className="flex-1 pb-20">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2 text-[10px] text-[#9CA3AF]">
                            <Link to="/" className="hover:text-[#3E8FCC]">Home</Link>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-[#0C0D0F] font-bold">Sessions</span>
                        </div>
                        {currentUser && (
                            <span className="text-xs text-gray-500">Welcome back, <span className="font-bold text-[#3E8FCC]">{currentUser.userName}</span></span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
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
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-32 bg-white rounded-[24px] border border-gray-100 animate-pulse" />
                                    ))}
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
                                    <p className="text-gray-500 mb-2">No sessions found.</p>
                                    <Link to="/explore" className="text-[#3E8FCC] font-bold">Explore skills to start swapping!</Link>
                                </div>
                            ) : (
                                <SessionHistoryList
                                    sessions={sessions}
                                    onViewFeedback={handleViewFeedback}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </div>

                        <SessionHistorySidebar sessions={sessions} />
                    </div>
                </div>
            </div>

            <ViewFeedbackModal
                isOpen={isViewFeedbackOpen}
                onClose={() => {
                    setIsViewFeedbackOpen(false)
                    setSelectedSession(null)
                    setSelectedSessionId(null)
                    setReceivedReview(null)
                }}
                sessionFeedback={selectedSession ? {
                    sessionId: selectedSession.id,
                    isComplete: selectedSession.status === 'COMPLETED',
                    comment: receivedReview?.comment || selectedSession.notes || 'No public review available yet.',
                    providerFeedback: (selectedSession.host?.id === currentUser?.id)
                        ? (selectedSession.feedbackAttendee ||
                            selectedSession.feedbacks?.find((f: any) => f.role === 'learning' || f.type === 'LEARNING') ||
                            receivedReview)
                        : undefined,
                    seekerFeedback: (selectedSession.attendee?.id === currentUser?.id)
                        ? (selectedSession.feedbackHost ||
                            selectedSession.feedbacks?.find((f: any) => f.role === 'teaching' || f.type === 'TEACHING') ||
                            receivedReview)
                        : undefined,
                    mutualRating: receivedReview?.overallRating || selectedSession.swapRequest?.rating || 5,
                } : {
                    sessionId: selectedSessionId || '',
                    isComplete: true,
                }}
                providerName={sessionNames.providerName}
                seekerName={sessionNames.seekerName}
                skillName={sessionNames.skillName}
                isLoading={sessionDetailLoading}
            />

            <Footer />
        </div>
    )
}