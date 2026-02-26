import React, { useMemo, useState } from 'react'
import { ChevronRight, ChevronLeft, Star } from 'lucide-react'
import { Avatar } from '@/components/common'
import { formatDate } from '@/utils'
import type { Feedback } from '@/types/index'

interface SessionHistoryListProps {
    sessions: Array<{
        id: string
        date: Date
        partnerName: string
        partnerAvatar?: string
        skillName: string
        role: 'provider' | 'seeker'
        feedback?: Feedback
        status?: string
    }>
    onViewFeedback?: (sessionId: string, action?: 'view' | 'complete') => void
    emptyMessage?: string
    currentPage?: number
    totalPages?: number
    onPageChange?: (page: number) => void
}

export const SessionHistoryList: React.FC<SessionHistoryListProps> = ({
    sessions,
    onViewFeedback,
    emptyMessage = 'No sessions yet',
    currentPage = 1,
    totalPages = 1,
    onPageChange,
}) => {
    const [filter] = useState<'all' | 'provider' | 'seeker'>('all')

    const filteredSessions = useMemo(() => {
        return sessions.filter((session) => {
            if (filter === 'all') return true
            return session.role === filter
        })
    }, [sessions, filter])

    const statusColors: Record<string, string> = {
        Completed: 'bg-[#F0FDF4] text-[#16A34A] border-[#DCFCE7]',
        Upcoming: 'bg-[#FFFBEB] text-[#D97706] border-[#FEF3C7]',
        Canceled: 'bg-[#FEF2F2] text-[#DC2626] border-[#FEE2E2]',
        'In Progress': 'bg-[#F0F9FF] text-[#0284C7] border-[#E0F2FE]',
    }

    if (sessions.length === 0) {
        return (
            <div className="bg-white rounded-[24px] border border-[#E5E7EB] p-16 text-center shadow-sm">
                <p className="text-[#666666] text-lg">{emptyMessage}</p>
            </div>
        )
    }

    const getDisplayStatus = (backendStatus?: string): 'Upcoming' | 'Completed' | 'Canceled' | 'In Progress' => {
        switch (backendStatus) {
            case 'COMPLETED': return 'Completed'
            case 'CANCELLED': return 'Canceled'
            case 'RESCHEDULED': return 'Upcoming'
            case 'SCHEDULED': return 'Upcoming'
            default: return 'Upcoming'
        }
    }

    return (
        <div className="space-y-6">
            <div className="hidden md:block bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
                <div className="grid grid-cols-[50px_2fr_1.5fr_1.2fr_1.2fr_120px_40px] gap-4 px-6 py-5 text-[11px] font-bold text-[#666666] border-b border-[#F3F4F6] bg-white">
                    <div className="flex items-center">
                        <input type="checkbox" className="w-4 h-4 rounded border-[#E5E7EB] text-[#3E8FCC] focus:ring-[#3E8FCC]" />
                    </div>
                    <div>Skill & Partner</div>
                    <div>Date & Time</div>
                    <div className="text-center">Rating</div>
                    <div className="text-center">Status</div>
                    <div className="text-center">Feedback</div>
                    <div />
                </div>
                <div className="divide-y divide-[#F3F4F6]">
                    {filteredSessions.map((session) => {
                        const status = getDisplayStatus(session.status)
                        return (
                            <div
                                key={session.id}
                                className="grid grid-cols-[50px_2fr_1.5fr_1.2fr_1.2fr_120px_40px] gap-4 px-6 py-4 items-center hover:bg-[#F9FAFB] transition-all group"
                            >
                                <div className="flex items-center">
                                    <input type="checkbox" className="w-4 h-4 rounded border-[#E5E7EB] text-[#3E8FCC] focus:ring-[#3E8FCC]" />
                                </div>
                                <div className="flex items-center gap-4 min-w-0">
                                    <Avatar src={session.partnerAvatar} name={session.partnerName} size="md" />
                                    <div className="min-w-0">
                                        <div className="text-sm font-bold text-[#0C0D0F] truncate">{session.skillName}</div>
                                        <div className="text-[10px] text-[#666666] truncate mt-0.5">with {session.partnerName}</div>
                                    </div>
                                </div>
                                <div className="text-[11px] text-[#0C0D0F]">
                                    <div className="font-bold">{formatDate(session.date, 'MMM dd, yyyy')}</div>
                                    <div className="text-[#9CA3AF] mt-0.5">1 hour</div>
                                </div>
                                <div className="flex justify-center">
                                    {(status === 'Completed' || status === 'In Progress') ? (
                                        <div className="flex gap-0.5 text-[#F59E0B]">
                                            {[1, 2, 3, 4].map(s => <Star key={s} className="w-3.5 h-3.5 fill-current" />)}
                                            <Star className="w-3.5 h-3.5 text-[#E5E7EB]" />
                                        </div>
                                    ) : (
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((s) => <div key={s} className="w-3.5 h-3.5 border border-[#E5E7EB] rounded-full" />)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-center">
                                    <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full border ${statusColors[status]}`}>
                                        {status}
                                    </span>
                                </div>
                                <div className="flex justify-center">
                                    {status === 'Completed' || status === 'In Progress' || status === 'Canceled' ? (
                                        <button
                                            onClick={() => onViewFeedback?.(session.id)}
                                            className="px-4 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-[10px] font-bold text-[#3E8FCC] hover:bg-gray-50 transition-colors"
                                        >
                                            View
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => (onViewFeedback as any)?.(session.id, 'complete')}
                                            className="px-4 py-1.5 rounded-lg border border-[#E5E7EB] bg-[#3E8FCC] text-[10px] font-bold text-white hover:bg-[#357db3] transition-colors"
                                        >
                                            Complete
                                        </button>
                                    )}
                                </div>
                                <div className="flex justify-end">
                                    <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                                        <ChevronRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#0C0D0F]" />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="md:hidden space-y-3">
                {filteredSessions.map((session) => {
                    const status = getDisplayStatus(session.status)
                    return (
                        <div key={session.id} className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <Avatar src={session.partnerAvatar} name={session.partnerName} size="md" />
                                    <div className="min-w-0">
                                        <div className="text-sm font-bold text-[#0C0D0F] truncate">{session.skillName}</div>
                                        <div className="text-[10px] text-[#666666] truncate">with {session.partnerName}</div>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full border shrink-0 ml-2 ${statusColors[status]}`}>
                                    {status}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-[11px] text-[#666666]">
                                    {formatDate(session.date, 'MMM dd, yyyy')} · 1 hour
                                </div>
                                <div className="flex gap-0.5 text-[#F59E0B]">
                                    {(status === 'Completed' || status === 'In Progress') ? (
                                        [1, 2, 3, 4].map(s => <Star key={s} className="w-3 h-3 fill-current" />)
                                    ) : (
                                        [1, 2, 3, 4, 5].map(s => <div key={s} className="w-3 h-3 border border-[#E5E7EB] rounded-full" />)
                                    )}
                                </div>
                            </div>

                            <div className="mt-3 flex justify-end">
                                {status === 'Completed' || status === 'In Progress' || status === 'Canceled' ? (
                                    <button
                                        onClick={() => onViewFeedback?.(session.id)}
                                        className="px-4 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-[10px] font-bold text-[#3E8FCC] hover:bg-gray-50 transition-colors"
                                    >
                                        View
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => (onViewFeedback as any)?.(session.id, 'complete')}
                                        className="px-4 py-1.5 rounded-lg border border-[#E5E7EB] bg-[#3E8FCC] text-[10px] font-bold text-white hover:bg-[#357db3] transition-colors"
                                    >
                                        Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 pt-4">
                    <button
                        onClick={() => onPageChange?.(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-2 text-[10px] font-bold transition-all px-3 py-1.5 rounded-lg border ${currentPage === 1
                            ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                            : 'bg-white text-[#666666] border-[#E5E7EB] hover:text-[#0C0D0F]'
                            }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Prev
                    </button>
                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => onPageChange?.(page as number)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${page === currentPage
                                    ? 'bg-[#EBF5FF] text-[#3E8FCC] border border-[#3E8FCC]'
                                    : 'text-[#666666] hover:bg-[#F9FAFB] hover:text-[#0C0D0F]'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => onPageChange?.(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-2 text-[10px] font-bold transition-all px-3 py-1.5 rounded-lg border ${currentPage === totalPages
                            ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                            : 'bg-white text-[#666666] border-[#E5E7EB] hover:text-[#0C0D0F]'
                            }`}
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    )
}