import React from 'react'
import { MoreVertical } from 'lucide-react'
import { Avatar, Button } from '@/components/common'
import { formatPoints, formatRelativeTime } from '@/utils'

interface UserListItemProps {
    userName: string
    userAvatar?: string
    totalPoints: number
    badges?: number
    rank?: number
    lastActive?: Date
    onEditPoints?: () => void
    onManageBadges?: () => void
    className?: string
}

export const UserListItem: React.FC<UserListItemProps> = ({
    userName,
    userAvatar,
    totalPoints,
    badges = 0,
    rank,
    lastActive,
    onEditPoints,
    onManageBadges,
    className = '',
}) => {
    const [showMenu, setShowMenu] = React.useState(false)
    const email = `${userName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`

    return (
        <div
            className={`bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm ${className}`}
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    <Avatar src={userAvatar} name={userName} size="xl" />
                    <div className="min-w-0">
                        <div className="text-lg font-semibold text-[#0C0D0F] truncate">
                            {userName}
                        </div>
                        <div className="text-sm text-[#666666] truncate">{email}</div>
                        <div className="text-xs text-[#9CA3AF] mt-1">
                            {lastActive ? `Last updated ${formatRelativeTime(lastActive)}` : `Rank #${rank || 0} • Active 2h ago`}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {onEditPoints && (
                        <Button
                            variant="secondary"
                            onClick={onEditPoints}
                            className="bg-white border border-[#3E8FCC] text-[#3E8FCC] hover:bg-[#F9FAFB]"
                        >
                            Edit Points
                        </Button>
                    )}
                    {onManageBadges && (
                        <Button variant="primary" onClick={onManageBadges} className="bg-[#3E8FCC] text-white">
                            Manage Badges
                        </Button>
                    )}

                    {(onEditPoints || onManageBadges) && (
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="h-10 w-10 grid place-items-center rounded-lg hover:bg-[#F9FAFB] transition-colors border border-[#E5E7EB]"
                                title="Toggle menu"
                                aria-label="Toggle menu"
                            >
                                <MoreVertical className="w-5 h-5 text-[#666666]" />
                            </button>

                            {showMenu && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                                    <div className="absolute right-0 top-full mt-2 bg-white border border-[#E5E7EB] rounded-lg shadow-lg py-2 z-20 w-56">
                                        <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#F9FAFB] transition-colors flex items-center gap-3">
                                            <span>👤</span>
                                            <span>View Full Profile</span>
                                        </button>
                                        <div className="my-1 border-t border-[#E5E7EB]" />
                                        <button className="w-full px-4 py-2.5 text-left text-sm text-[#DC2626] hover:bg-[#FEF2F2] transition-colors flex items-center gap-3">
                                            <span>🗑️</span>
                                            <span>Delete User</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[#EBF5FF] grid place-items-center">
                        <span className="text-[#3E8FCC] font-bold">↗</span>
                    </div>
                    <div>
                        <div className="text-xs text-[#666666]">Current Points</div>
                        <div className="text-xl font-poppins font-bold text-[#0C0D0F]">
                            {formatPoints(totalPoints)} <span className="text-sm font-medium text-[#666666]">Pts</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-[#FFFBEB] border border-[#FEF3C7] p-4">
                    <div className="text-xs text-[#666666] mb-2">Assigned Badges</div>
                    <div className="flex items-center gap-2">
                        {badges > 0 ? (
                            Array.from({ length: Math.min(badges, 4) }).map((_, i) => (
                                <div key={i} className="h-9 w-9 rounded-lg bg-[#F59E0B] flex items-center justify-center shadow-sm">
                                    <span className="text-white text-lg">🛡️</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-[#9CA3AF]">No badges</div>
                        )}
                        {badges > 4 && (
                            <div className="h-9 px-3 rounded-lg bg-[#EBF5FF] border border-[#3E8FCC] flex items-center justify-center text-sm font-medium text-[#3E8FCC]">
                                +{badges - 4}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
