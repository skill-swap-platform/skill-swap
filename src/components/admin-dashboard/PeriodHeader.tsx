import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PeriodHeaderProps {
    title: string
    periodLabel: string
    onPrev: () => void
    onNext: () => void
}

export const PeriodHeader: React.FC<PeriodHeaderProps> = ({
    title,
    periodLabel,
    onPrev,
    onNext,
}) => (
    <div className="mb-4 border-b border-[#DADADA] pb-2">
        <div className="flex items-center justify-between gap-2">
            <h3 className="relative pb-1 text-base font-semibold text-[#1C1C1C]">
                {title}
                <span className="absolute -bottom-[11px] left-0 h-[3px] w-11 rounded-full bg-[#3E8FCC]" />
            </h3>
            <div className="flex items-center gap-1 text-xs text-[#2E3A59]">
                <button
                    type="button"
                    onClick={onPrev}
                    className="rounded p-1 text-[#2E3A59] hover:bg-[#F3F4F6]"
                    aria-label="Previous month"
                >
                    <ChevronLeft className="h-3 w-3" />
                </button>
                <span>{periodLabel}</span>
                <button
                    type="button"
                    onClick={onNext}
                    className="rounded p-1 text-[#2E3A59] hover:bg-[#F3F4F6]"
                    aria-label="Next month"
                >
                    <ChevronRight className="h-3 w-3" />
                </button>
            </div>
        </div>
    </div>
)
