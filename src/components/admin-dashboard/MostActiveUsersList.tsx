import React from 'react'
import type { MostActiveUserItem } from '@/api/services/admin.service'

const numberFormatter = new Intl.NumberFormat('en-US')

const getInitials = (fullName: string): string => {
    const parts = fullName.trim().split(/\s+/).slice(0, 2)
    return parts.map((part) => part[0]?.toUpperCase() || '').join('')
}

interface MostActiveUsersListProps {
    users: MostActiveUserItem[]
    limit?: number
}

export const MostActiveUsersList: React.FC<MostActiveUsersListProps> = ({ users, limit = 5 }) => {
    const items = users.slice(0, limit)

    return (
        <div className="space-y-3">
            {items.map((user) => (
                <div
                    key={`${user.userName}-${user.swaps}`}
                    className="flex items-center justify-between border-b border-[#F3F4F6] pb-2 last:border-none"
                >
                    <div className="flex items-center gap-2">
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={user.userName}
                                className="h-8 w-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EBF5FF] text-xs font-semibold text-[#3272A3]">
                                {getInitials(user.userName)}
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-semibold text-[#333333]">{user.userName}</p>
                            <p className="text-xs text-[#8A8A8A]">
                                {`Swaps: ${numberFormatter.format(user.swaps)}`}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
            {!items.length && <p className="text-sm text-[#666666]">No active user data.</p>}
        </div>
    )
}
