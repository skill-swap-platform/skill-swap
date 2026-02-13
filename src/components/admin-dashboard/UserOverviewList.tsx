import React from 'react'
import { CircularProgress } from './CircularProgress'

const numberFormatter = new Intl.NumberFormat('en-US')

export interface UserOverviewRow {
    label: string
    count: number
    percentage: number
}

interface UserOverviewListProps {
    rows: UserOverviewRow[]
}

export const UserOverviewList: React.FC<UserOverviewListProps> = ({ rows }) => (
    <div className="space-y-2">
        {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-base font-semibold text-[#333333]">{row.label}</p>
                    <p className="text-xs text-[#8A8A8A]">
                        {`number: ${numberFormatter.format(row.count)}`}
                    </p>
                </div>
                <CircularProgress
                    value={row.percentage}
                    size={44}
                    strokeWidth={4}
                    labelClassName="text-[9px] font-bold text-[#333333]"
                />
            </div>
        ))}
    </div>
)
