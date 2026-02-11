import React, { useState } from 'react'
import { Modal, Button } from '@/components/common'

interface EditBadgeConditionModalProps {
    isOpen: boolean
    onClose: () => void
    badge: {
        id: string
        name: string
        icon: React.ReactNode
        iconBgColor: string
        conditionValue: number
    }
    onSave: (value: number) => void
}

export const EditBadgeConditionModal: React.FC<EditBadgeConditionModalProps> = ({
    isOpen,
    onClose,
    badge,
    onSave,
}) => {
    const [value, setValue] = useState(badge.conditionValue)

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Badge condition" size="md">
            <div className="p-6">
                <div className="flex items-start gap-4 p-4 bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] mb-6">
                    <div className={`w-12 h-12 rounded-full ${badge.iconBgColor} flex items-center justify-center flex-shrink-0`}>
                        {badge.icon}
                    </div>
                    <div>
                        <h4 className="font-bold text-[#0C0D0F] mb-1">{badge.name}</h4>
                        <p className="text-xs text-[#666666]">Configure how this badge is earned</p>
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-medium text-[#0C0D0F] mb-2">
                        Required completed sessions:
                    </label>
                    <div className="flex items-center">
                        <input
                            type="number"
                            min="1"
                            value={value}
                            onChange={(e) => setValue(parseInt(e.target.value) || 0)}
                            className="w-24 px-3 py-2 border border-[#E5E7EB] rounded-lg text-center font-medium focus:ring-1 focus:ring-[#3E8FCC] outline-none"
                        />
                        <div className="flex flex-col ml-2 gap-1">
                            <button
                                onClick={() => setValue(v => v + 1)}
                                className="p-0.5 hover:bg-gray-100 rounded text-[#666666]"
                            >
                                ▲
                            </button>
                            <button
                                onClick={() => setValue(v => Math.max(1, v - 1))}
                                className="p-0.5 hover:bg-gray-100 rounded text-[#666666]"
                            >
                                ▼
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-[#9CA3AF] mt-3 leading-relaxed">
                        Badge will be awarded once the user completes this number of sessions.
                    </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F3F4F6]">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-[#666666] hover:text-[#0C0D0F]"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => onSave(value)}
                        className="bg-[#2F71A3] hover:bg-[#265D85] px-6"
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
