import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, Filter, ChevronDown } from 'lucide-react'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import { SessionHistoryList } from '@/components/feedback/index'
import { ViewFeedbackModal } from '@/components/feedback/index'
import { SessionHistorySidebar } from '@/components/feedback/SessionHistorySidebar'
import { sessionService } from '@/api/services/session.service'
import { userService } from '@/api/services/user.service'

type StatusFilter = 'ALL' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Upcoming', value: 'SCHEDULED' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' },
]

const parseOverallRating = (val: string | number | undefined): number => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    const map: Record<string, number> = { 'ONE': 1, 'TWO': 2, 'THREE': 3, 'FOUR': 4, 'FIVE': 5 };
    return map[val.toString().toUpperCase()] || 0;
};

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
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
    const [filterOpen, setFilterOpen] = useState(false)
    const filterRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
                setFilterOpen(false)
            }
        }
        if (filterOpen) document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [filterOpen])

    const filteredSessions = statusFilter === 'ALL'
        ? sessions
        : sessions.filter(s => {
            if (statusFilter === 'SCHEDULED') return s.status === 'SCHEDULED' || s.status === 'RESCHEDULED'
            return s.status === statusFilter
        })

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                setIsLoading(true)

                const userRes = await userService.getCurrentProfile()
                if (userRes.success) {
                    setCurrentUser(userRes.data)
                }

                const [response, reviewsRes] = await Promise.all([
                    sessionService.getHistory({ page: currentPage, limit: pageSize }),
                    sessionService.getReceivedReviews(1, 100)
                ])
                if (response.success && userRes.success) {
                    const rawSessions = response.data.data || []
                    const currentUserId = userRes.data.id
                    const reviewMap: Record<string, number> = {}
                    if (reviewsRes.success && reviewsRes.data?.reviews) {
                        reviewsRes.data.reviews.forEach((r: any) => {
                            if (r.swapRequestId) {
                                reviewMap[r.swapRequestId] = parseOverallRating(r.overallRating)
                            }
                        })
                    }

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
                            duration: s.duration,
                            rating: s.swapRequest?.id ? (reviewMap[s.swapRequest.id] || 0) : 0,
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
                                <div className="flex gap-3 relative" ref={filterRef}>
                                    <button
                                        onClick={() => setFilterOpen(prev => !prev)}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:bg-gray-50 transition-colors text-xs font-medium text-[#666666]"
                                    >
                                        <Filter className="w-4 h-4 text-[#666666]" />
                                        {statusFilter === 'ALL' ? 'Filter' : STATUS_OPTIONS.find(o => o.value === statusFilter)?.label}
                                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {filterOpen && (
                                        <div className="absolute top-full left-0 mt-2 w-44 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1 z-50">
                                            {STATUS_OPTIONS.map(opt => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => { setStatusFilter(opt.value); setFilterOpen(false); setCurrentPage(1) }}
                                                    className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors ${statusFilter === opt.value
                                                        ? 'bg-[#EBF5FF] text-[#3E8FCC]'
                                                        : 'text-[#374151] hover:bg-[#F9FAFB]'
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
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
                                    sessions={filteredSessions}
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
                    mutualRating: parseOverallRating(receivedReview?.overallRating) || selectedSession.swapRequest?.rating || 0,
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