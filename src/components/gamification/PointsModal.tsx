import React, { useMemo, useState } from 'react'
import { Modal, ModalFooter, Button, Avatar } from '@/components/common'
import { formatPoints } from '@/utils'
interface PointsModalProps {
    isOpen: boolean
    onClose: () => void
    userName: string
    userAvatar?: string
    currentPoints?: number
}

export const PointsModal: React.FC<PointsModalProps> = ({
    isOpen,
    onClose,
    userName,
    userAvatar,
    currentPoints = 0,
}) => {
    const [amount, setAmount] = useState('')
    const [reason, setReason] = useState('')

    const parsedAmount = useMemo(() => {
        const n = Number(amount)
        return Number.isFinite(n) ? n : 0
    }, [amount])

    const canSubmit = parsedAmount > 0

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Points"
            size="md"
        >
            <div className="space-y-5">
                <div className="flex items-center gap-3">
                    <Avatar src={userAvatar} name={userName} size="lg" />
                    <div>
                        <div className="font-semibold text-[#0C0D0F] text-base">{userName}</div>
                        <div className="text-sm text-[#666666]">
                            Current: {formatPoints(currentPoints)} Points
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#0C0D0F] mb-2">
                        Points Amount
                    </label>
                    <input
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter Amount"
                        inputMode="numeric"
                        className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#3E8FCC] bg-white text-[#0C0D0F]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#0C0D0F] mb-2">
                        Reason <span className="text-[#9CA3AF] font-normal">(Optional)</span>
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Add a note about this change..."
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#3E8FCC] resize-none bg-white text-[#0C0D0F]"
                    />
                </div>
            </div>

            <ModalFooter>
                <div className="w-full flex items-center justify-end gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => onClose()}
                        disabled={!canSubmit}
                        className="min-w-[100px] bg-white border-2 border-[#DC2626] text-[#DC2626] hover:bg-[#FEF2F2] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Deduct
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => onClose()}
                        disabled={!canSubmit}
                        className="min-w-[130px] bg-[#3E8FCC] hover:bg-[#2F71A3] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        + Add Points
                    </Button>
                </div>
            </ModalFooter>
        </Modal>
    )
}
