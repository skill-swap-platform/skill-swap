import React from 'react'

const numberFormatter = new Intl.NumberFormat('en-US')

interface SummaryCardProps {
    title: string
    value: number
    icon: React.ReactNode
    iconBackground: string
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
    title,
    value,
    icon,
    iconBackground,
}) => (
    <div className="rounded-[10px] border border-[#E5E7EB] bg-white px-4 py-3">
        <div className="flex items-center justify-between gap-3">
            <div>
                <p className="text-xs text-[#808191]">{title}</p>
                <p className="mt-1 text-[32px] font-semibold leading-none text-black">
                    {numberFormatter.format(value)}
                </p>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded ${iconBackground}`}>
                {icon}
            </div>
        </div>
    </div>
)
