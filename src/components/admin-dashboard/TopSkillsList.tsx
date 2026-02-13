import React from 'react'
import type { TopSkillItem } from '@/api/services/admin.service'
import { CircularProgress } from './CircularProgress'

const numberFormatter = new Intl.NumberFormat('en-US')

interface TopSkillsListProps {
    skills: TopSkillItem[]
    limit?: number
}

export const TopSkillsList: React.FC<TopSkillsListProps> = ({ skills, limit = 4 }) => {
    const items = skills.slice(0, limit)

    return (
        <div className="space-y-4">
            {items.map((skill) => (
                <div key={skill.skillName} className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-lg font-semibold text-[#333333]">{skill.skillName}</p>
                        <p className="text-xs text-[#8A8A8A]">
                            {`Swaps: ${numberFormatter.format(skill.swaps)}`}
                        </p>
                    </div>
                    <CircularProgress value={skill.percentage} />
                </div>
            ))}
            {!items.length && <p className="text-sm text-[#666666]">No top skills data.</p>}
        </div>
    )
}
