import React, { useEffect, useState } from 'react'
import {
    Award,
    Bell,
    ChevronDown,
    Medal,
    Zap,
    RefreshCw,
    Crown,
    Trophy,
    Menu,
} from 'lucide-react'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { BadgeCard } from '@/components/gamification/BadgeCard'
import { EditBadgeConditionModal } from '@/components/gamification/EditBadgeConditionModal'
import { Avatar } from '@/components/common'

// Mock Badges Data
const mockBadges = [
    {
        id: '1',
        name: 'First Exchange',
        condition: '1 completed session',
        conditionValue: 1,
        description: 'Unlocked after 1 completed session',
        usersCount: 847,
        icon: <Medal className="w-8 h-8 text-[#3E8FCC]" />,
        iconBgColor: 'bg-[#EBF5FF]',
    },
    {
        id: '2',
        name: 'Active Member',
        condition: '10 completed sessions',
        conditionValue: 10,
        description: 'Unlocked after 10 completed sessions',
        usersCount: 847,
        icon: <Zap className="w-8 h-8 text-[#16A34A]" />,
        iconBgColor: 'bg-[#F0FDF4]',
    },
    {
        id: '3',
        name: 'Skill Exchanger',
        condition: '25 completed sessions',
        conditionValue: 25,
        description: 'Unlocked after 25 completed sessions',
        usersCount: 847,
        icon: <RefreshCw className="w-8 h-8 text-[#059669]" />,
        iconBgColor: 'bg-[#ECFDF5]',
    },
    {
        id: '4',
        name: 'Experienced',
        condition: '50 completed sessions',
        conditionValue: 50,
        description: 'Unlocked after 50 completed sessions',
        usersCount: 847,
        icon: <Crown className="w-8 h-8 text-[#7C3AED]" />,
        iconBgColor: 'bg-[#F5F3FF]',
    },
    {
        id: '5',
        name: 'Core Contributor',
        condition: '80 completed sessions',
        conditionValue: 80,
        description: 'Unlocked after 80 completed sessions',
        usersCount: 847,
        icon: <Trophy className="w-8 h-8 text-[#D97706]" />,
        iconBgColor: 'bg-[#FFFBEB]',
    },
]

export const PointsAndBadges: React.FC = () => {
    const [selectedBadge, setSelectedBadge] = useState<typeof mockBadges[0] | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

    useEffect(() => {
        if (!isMobileSidebarOpen) {
            document.body.classList.remove('overflow-hidden')
            return
        }

        document.body.classList.add('overflow-hidden')
        return () => document.body.classList.remove('overflow-hidden')
    }, [isMobileSidebarOpen])

    const handleEditCondition = (badge: typeof mockBadges[0]) => {
        setSelectedBadge(badge)
        setIsEditModalOpen(true)
    }

    const handleSaveCondition = (newValue: number) => {
        console.log('Update badge condition:', selectedBadge?.id, newValue)
        // Here you would typically call an API to update the badge
        setIsEditModalOpen(false)
        setSelectedBadge(null)
    }

    return (
        <div className="min-h-screen bg-white">
            <AdminSidebar
                mobileOpen={isMobileSidebarOpen}
                onMobileClose={() => setIsMobileSidebarOpen(false)}
            />

            <main className="p-4 md:ml-[236px] md:p-8">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="rounded-lg p-2 text-[#1C1C1C] transition-colors hover:bg-[#F3F4F6] md:hidden"
                            aria-label="Open menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="text-xl font-poppins font-bold">
                            <span className="text-[#F59E0B]">Skill</span>
                            <span className="text-[#3E8FCC]">Swap</span>
                            <span className="text-[#F59E0B]">.</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-[#F9FAFB] rounded-full transition-colors relative">
                            <Bell className="w-5 h-5 text-[#666666]" />
                            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#EF4444] border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-[#E5E7EB]">
                            <Avatar size="sm" name="Wafaa Amjad" />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-[#0C0D0F]">Wafaa Amjad</span>
                                <span className="text-xs text-[#666666]">Admin</span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />
                        </div>
                    </div>
                </header>

                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2 text-[#3E8FCC]">
                        <Award className="w-5 h-5" />
                        <h1 className="text-xl font-bold font-poppins text-[#0C0D0F]">Badges Management</h1>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-base font-bold text-[#0C0D0F] border-b-2 border-[#3E8FCC] inline-block pb-2">
                        Badges Management
                    </h2>
                    <div className="border-b border-[#F3F4F6] mt-[-1px]"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mockBadges.map((badge) => (
                        <BadgeCard
                            key={badge.id}
                            badge={badge}
                            onEdit={() => handleEditCondition(badge)}
                        />
                    ))}
                </div>

                {selectedBadge && (
                    <EditBadgeConditionModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        badge={selectedBadge}
                        onSave={handleSaveCondition}
                    />
                )}
            </main>
        </div>
    )
}
