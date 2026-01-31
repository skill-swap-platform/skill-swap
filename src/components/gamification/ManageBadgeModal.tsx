import React from 'react'
import { Modal, ModalFooter, Button } from '@/components/common'
import { Check } from 'lucide-react'
import type { Badge, UserBadge } from '@/types/index'

interface ManageBadgeModalProps {
    isOpen: boolean
    onClose: () => void
    userName: string
    userAvatar?: string
    availableBadges: Badge[]
    userBadges: UserBadge[]
    onAssignBadge: (badgeId: string) => void
    onRemoveBadge: (badgeId: string) => void
    isLoading?: boolean
}
export const ManageBadgeModal: React.FC<ManageBadgeModalProps> = ({
    isOpen,
    onClose,
    userName,
    userAvatar,
    availableBadges,
    userBadges,
    onAssignBadge,
    onRemoveBadge,
    isLoading = false,
}) => {
    const [selectedBadgeIds, setSelectedBadgeIds] = React.useState<string[]>(() =>
        userBadges.map(b => b.id)
    )


    React.useEffect(() => {
        setSelectedBadgeIds(userBadges.map(b => b.id))
    }, [userBadges])

    const handleToggleBadge = (badgeId: string) => {
        if (selectedBadgeIds.includes(badgeId)) {
            setSelectedBadgeIds(prev => prev.filter(id => id !== badgeId))
            onRemoveBadge(badgeId)
        } else {
            setSelectedBadgeIds(prev => [...prev, badgeId])
            onAssignBadge(badgeId)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Manage Badge"
            size="lg"
        >
            <div className="space-y-6">
                <p className="text-sm text-[#666666]">Add Badge to user</p>

                <div className="flex items-center gap-3 p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                    {userAvatar ? (
                        <img
                            src={userAvatar}
                            alt={userName}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-[#3E8FCC] text-white flex items-center justify-center font-medium text-lg">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h4 className="font-semibold text-[#0C0D0F]">{userName}</h4>
                        <p className="text-sm text-[#666666]">
                            {userBadges.length} {userBadges.length === 1 ? 'Badge' : 'Badges'} currently assigned
                        </p>
                    </div>
                </div>

                <div>
                    <div className="grid grid-cols-2 gap-4">
                        {availableBadges.slice(0, 4).map((badge) => {
                            const isAssigned = selectedBadgeIds.includes(badge.id)

                            return (
                                <button
                                    key={badge.id}
                                    onClick={() => handleToggleBadge(badge.id)}
                                    disabled={isLoading}
                                    className={`relative p-5 border-2 rounded-xl transition-all hover:shadow-md ${isAssigned
                                        ? 'border-[#16A34A] bg-[#F0FDF4]'
                                        : 'border-[#E5E7EB] hover:border-[#3E8FCC] bg-white'
                                        }`}
                                >
                                    <div className="flex flex-col items-center text-center space-y-3">
                                        <div
                                            className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-sm"
                                            style={{ backgroundColor: badge.color || '#FFD700' }}
                                        >
                                            {badge.icon || '🛡️'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#0C0D0F] text-sm">
                                                {badge.name}
                                            </p>
                                            <p className="text-xs text-[#666666] mt-1 capitalize">
                                                {badge.category}
                                            </p>
                                            <p className="text-xs text-[#9CA3AF] mt-1">
                                                {badge.description}
                                            </p>
                                        </div>
                                        {isAssigned && (
                                            <div className="flex items-center gap-1.5 text-[#16A34A] text-xs font-medium">
                                                <Check className="w-4 h-4" />
                                                <span>Already Assigned</span>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
            <ModalFooter>
                <Button
                    variant="primary"
                    onClick={onClose}
                    isLoading={isLoading}
                    className="bg-[#3E8FCC] hover:bg-[#2F71A3] min-w-[100px]"
                >
                    Done
                </Button>
            </ModalFooter>
        </Modal>
    )
}
