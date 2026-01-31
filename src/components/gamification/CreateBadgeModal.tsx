import React, { useState } from 'react'
import { Modal, ModalFooter, Button } from '@/components/common'
import { BADGE_ICONS, BADGE_COLOR_SCHEMES } from '@/constants/index'
import type { CreateBadgeDto } from '@/types/index'

interface CreateBadgeModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: CreateBadgeDto) => void
    isLoading?: boolean
}

export const CreateBadgeModal: React.FC<CreateBadgeModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false,
}) => {
    const [formData, setFormData] = useState<CreateBadgeDto>({
        name: '',
        description: '',
        icon: BADGE_ICONS[0],
        color: BADGE_COLOR_SCHEMES.YELLOW,
        category: 'learning',
        requiredPoints: 0,
        requiredSessions: 0,
    })

    const handleSubmit = () => {
        if (formData.name && formData.description) {
            onSubmit(formData)
        }
    }

    const handleReset = () => {
        setFormData({
            name: '',
            description: '',
            icon: BADGE_ICONS[0],
            color: BADGE_COLOR_SCHEMES.YELLOW,
            category: 'learning',
            requiredPoints: 0,
            requiredSessions: 0,
        })
        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleReset}
            title="Create New Badge"
            size="xl"
        >
            <div className="space-y-6">
                <p className="text-sm text-[#666666]">
                    Design a new badge to reward your community members
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6">
                    <div className="rounded-xl border border-[#E5E7EB] p-6 bg-white">
                        <div className="text-sm font-medium text-[#666666] mb-4">
                            Badge Preview
                        </div>

                        <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-6 flex flex-col items-center justify-center text-center min-h-[260px]">
                            <div
                                className="w-24 h-24 rounded-2xl shadow-lg flex items-center justify-center text-4xl mb-4"
                                style={{ backgroundColor: formData.color }}
                            >
                                <span className="text-white">{formData.icon}</span>
                            </div>
                            <div className="text-lg font-poppins font-semibold text-[#0C0D0F]">
                                {formData.name || 'Badge Name'}
                            </div>
                            <div className="text-sm text-[#666666] mt-1">
                                {formData.description || 'Badge Description'}
                            </div>
                            <div className="text-xs text-[#9CA3AF] mt-2 capitalize">
                                {formData.category}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#0C0D0F] mb-2">
                                Badge Name*
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g: Top Contributor"
                                className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#3E8FCC] bg-white"
                                maxLength={50}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#0C0D0F] mb-2">
                                Description*
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe what the badge represent"
                                rows={3}
                                className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#3E8FCC] resize-none bg-white"
                                maxLength={200}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#0C0D0F] mb-2">
                                Icon*
                            </label>
                            <div className="grid grid-cols-3 gap-3 max-w-sm">
                                {BADGE_ICONS.slice(0, 6).map((icon: string) => {
                                    const active = formData.icon === icon
                                    return (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, icon })}
                                            className={`h-14 rounded-lg border-2 transition-all grid place-items-center text-2xl ${active
                                                ? 'border-[#3E8FCC] bg-[#EBF5FF]'
                                                : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]'
                                                }`}
                                            title={`Select icon: ${icon}`}
                                        >
                                            {icon}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#0C0D0F] mb-2">
                                Category*
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#3E8FCC] bg-white"
                                title="Select badge category"
                            >
                                <option value="learning">Learning</option>
                                <option value="achievements">Achievements</option>
                                <option value="community">Community</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#0C0D0F] mb-2">
                                Color Schema*
                            </label>
                            <div className="grid grid-cols-2 gap-3 max-w-sm">
                                {Object.entries(BADGE_COLOR_SCHEMES).map(([name, color]) => {
                                    const active = formData.color === color
                                    return (
                                        <button
                                            key={name}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color: color as string })}
                                            className={`h-16 rounded-xl border-2 transition-all overflow-hidden ${active ? 'border-[#0C0D0F]' : 'border-[#E5E7EB]'
                                                }`}
                                            title={`Select color: ${name}`}
                                        >
                                            <div
                                                className="h-9"
                                                style={{ backgroundColor: color as string }}
                                            />
                                            <div className="h-7 flex items-center justify-center text-xs text-[#666666] bg-white capitalize">
                                                {name.toLowerCase()}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModalFooter>
                <Button
                    variant="secondary"
                    onClick={handleReset}
                    className="bg-white border border-[#E5E7EB] text-[#0C0D0F] hover:bg-[#F9FAFB]"
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    isLoading={isLoading}
                    disabled={!formData.name || !formData.description}
                    className="bg-[#3E8FCC] hover:bg-[#2F71A3] disabled:opacity-50"
                >
                    Create Badge
                </Button>
            </ModalFooter>
        </Modal>
    )
}
