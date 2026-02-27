import React from 'react'
import { Calendar, Clock } from 'lucide-react'
import { Avatar } from '@/components/common'
import { useNavigate } from 'react-router-dom'

interface SessionItem {
    id: string
    date: Date
    partnerName: string
    partnerAvatar?: string
    skillName: string
    role: 'provider' | 'seeker'
    status?: string
}

interface SessionHistorySidebarProps {
    sessions?: SessionItem[]
}

export const SessionHistorySidebar: React.FC<SessionHistorySidebarProps> = ({ sessions = [] }) => {
    const navigate = useNavigate()
    const total = sessions.length
    const upcoming = sessions.filter(s => s.status === 'SCHEDULED' || s.status === 'RESCHEDULED').length
    const completed = sessions.filter(s => s.status === 'COMPLETED').length
    const canceled = sessions.filter(s => s.status === 'CANCELLED').length
    const upcomingSessions = sessions
        .filter(s => s.status === 'SCHEDULED' || s.status === 'RESCHEDULED')
        .slice(0, 2)

    const skillCounts: Record<string, number> = {}
    sessions.forEach(s => {
        if (s.skillName) {
            skillCounts[s.skillName] = (skillCounts[s.skillName] || 0) + 1
        }
    })
    const topSkills = Object.entries(skillCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)

    const formatDate = (date: Date) =>
        date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#0C0D0F] mb-5">Upcoming Sessions</h3>
                {upcomingSessions.length === 0 ? (
                    <p className="text-sm text-[#9CA3AF] text-center py-4">No upcoming sessions</p>
                ) : (
                    <div className="space-y-4">
                        {upcomingSessions.map(session => (
                            <div key={session.id} className="p-4 rounded-xl border border-[#FEF3C7] bg-[#FFFBEB] relative">
                                <div className="flex items-center gap-3 mb-3">
                                    <Avatar size="sm" name={session.partnerName} src={session.partnerAvatar} />
                                    <div className="min-w-0">
                                        <div className="text-sm font-bold text-[#0C0D0F] truncate">{session.skillName}</div>
                                        <div className="text-[10px] text-[#666666]">with {session.partnerName}</div>
                                    </div>
                                    <span className="absolute top-4 right-4 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                                        <span className="text-[10px] font-bold text-[#D97706]">Upcoming</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-[#666666]">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(session.date)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        1 hour
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(`/session-room/${session.id}`)}
                                    className="w-full mt-4 py-2 bg-[#3E8FCC] text-white text-xs font-bold rounded-lg hover:bg-[#2F71A3] transition-colors"
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#0C0D0F] mb-5">Status</h3>
                <div className="space-y-3">
                    {[
                        { label: 'All Sessions', count: total, active: true },
                        { label: 'Upcoming', count: upcoming },
                        { label: 'Completed', count: completed },
                        { label: 'Canceled', count: canceled },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between text-sm py-1">
                            <span className={item.active ? 'font-bold text-[#0C0D0F]' : 'text-[#666666]'}>{item.label}</span>
                            <span className="font-bold text-[#0C0D0F]">{item.count}</span>
                        </div>
                    ))}
                </div>
            </div>
            {topSkills.length > 0 && (
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-[#0C0D0F] mb-5">Skills</h3>
                    <div className="space-y-3">
                        {topSkills.map(([skill, count]) => (
                            <div key={skill} className="flex items-center justify-between text-sm py-1">
                                <span className="text-[#666666] truncate max-w-[180px]">{skill}</span>
                                <span className="font-bold text-[#0C0D0F]">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
