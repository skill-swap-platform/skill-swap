import React from 'react'
import { Calendar, Clock, Star } from 'lucide-react'
import { Avatar } from '@/components/common'

export const SessionHistorySidebar: React.FC = () => {
    return (
        <div className="space-y-8">
            {/* Upcoming Sessions Widget */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#0C0D0F] mb-5">Upcoming Sessions</h3>
                <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-[#FEF3C7] bg-[#FFFBEB] relative">
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar size="sm" name="Haya Al Rubi" />
                            <div className="min-w-0">
                                <div className="text-sm font-bold text-[#0C0D0F] truncate">Graphic Design</div>
                                <div className="text-[10px] text-[#666666]">with Haya Al Rubi</div>
                            </div>
                            <span className="absolute top-4 right-4 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                                <span className="text-[10px] font-bold text-[#D97706]">Upcoming</span>
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-[#666666]">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Dec 10, 2025
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                1 hour
                            </div>
                            <div className="flex items-center gap-0.5 text-[#F59E0B]">
                                <Star className="w-3 h-3 fill-current" />
                                <Star className="w-3 h-3 fill-current" />
                                <Star className="w-3 h-3 fill-current" />
                                <Star className="w-3 h-3 fill-current" />
                                <Star className="w-3 h-3 text-[#E5E7EB]" />
                            </div>
                        </div>
                        <button className="w-full mt-4 py-2 bg-[#3E8FCC] text-white text-xs font-bold rounded-lg hover:bg-[#2F71A3] transition-colors">
                            View Details
                        </button>
                    </div>
                </div>
            </div>

            {/* Status Widget */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#0C0D0F] mb-5">Status</h3>
                <div className="space-y-3">
                    {[
                        { label: 'All Sessions', count: 24, active: true },
                        { label: 'Upcoming', count: 7 },
                        { label: 'Completed', count: 8 },
                        { label: 'Canceled', count: 5 },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between text-sm py-1">
                            <span className={item.active ? 'font-bold text-[#0C0D0F]' : 'text-[#666666]'}>{item.label}</span>
                            <span className="font-bold text-[#0C0D0F]">{item.count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Skills Widget */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#0C0D0F] mb-5">Skills</h3>
                <div className="space-y-3">
                    {[
                        { label: 'Desing', count: 3 },
                        { label: 'Photography', count: 7 },
                        { label: 'UI/UX', count: 8 },
                        { label: 'Development', count: 5 },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between text-sm py-1">
                            <span className="text-[#666666]">{item.label}</span>
                            <span className="font-bold text-[#0C0D0F]">{item.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
