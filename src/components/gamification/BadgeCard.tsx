import React from 'react'
import { Pencil } from 'lucide-react'

interface BadgeCardProps {
    badge: {
        id: string
        name: string
        icon: React.ReactNode
        description: string
        usersCount: number
        condition: string
        iconBgColor: string
    }
    onEdit: () => void
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, onEdit }) => {
    return (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-8 flex flex-col items-center text-center hover:shadow-sm transition-shadow">
            <div className={`w-20 h-20 rounded-full ${badge.iconBgColor} flex items-center justify-center mb-6`}>
                {badge.icon}
            </div>

            <h3 className="text-base font-bold text-[#0C0D0F] mb-2">{badge.name}</h3>
            <p className="text-xs text-[#9CA3AF] mb-4 h-8">
                {badge.description}
            </p>

            <div className="text-[11px] text-[#666666] mb-8">
                Earned by <span className="font-bold text-[#0C0D0F]">{badge.usersCount}</span> users
            </div>

            <button
                onClick={onEdit}
                className="w-full pt-4 border-t border-[#F3F4F6] flex items-center justify-center gap-2 text-sm text-[#3E8FCC] font-medium hover:text-[#2F71A3] transition-colors"
            >
                <Pencil className="w-3.5 h-3.5" />
                Edit Condition
            </button>
        </div>
    )
}
