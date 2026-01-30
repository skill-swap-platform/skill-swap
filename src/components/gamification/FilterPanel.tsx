import React, { useMemo, useState } from 'react'
import { Filter as FilterIcon, X } from 'lucide-react'
import { Button, Modal, ModalFooter } from '@/components/common'
import { POINTS_RANGES, ACTIVITY_TIME_RANGE_LABELS } from '@/constants/index'
interface FilterPanelProps {
    isOpen: boolean
    onClose: () => void
    filters: {
        pointsRange?: { min: number; max: number | null }
        badges?: string[]
        timeRange?: string
    }
    onFiltersChange: (filters: { pointsRange?: { min: number; max: number | null }; badges?: string[]; timeRange?: string }) => void
    onReset: () => void
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
    isOpen,
    onClose,
    filters,
    onFiltersChange,
    onReset,
}) => {
    const [minPoints, setMinPoints] = useState<string>(String(filters.pointsRange?.min ?? 0))
    const [maxPoints, setMaxPoints] = useState<string>(
        filters.pointsRange?.max === null || filters.pointsRange?.max === undefined
            ? ''
            : String(filters.pointsRange?.max)
    )

    const isOpenSafe = isOpen
    const selectedRangeLabel = useMemo(() => {
        const found = POINTS_RANGES.find(
            (r: { min: number; max: number | null; label: string }) => r.min === filters.pointsRange?.min && r.max === filters.pointsRange?.max
        )
        return found?.label
    }, [filters.pointsRange])

    const handlePointsRangeChange = (range: { min: number; max: number | null }) => {
        onFiltersChange({ ...filters, pointsRange: range })
        setMinPoints(String(range.min))
        setMaxPoints(range.max === null ? '' : String(range.max))
    }

    const handleTimeRangeChange = (timeRange: string) => {
        onFiltersChange({ ...filters, timeRange })
    }

    return (
        <Modal
            isOpen={isOpenSafe}
            onClose={onClose}
            title=""
            size="lg"
            showCloseButton={false}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <FilterIcon className="w-5 h-5 text-[#0C0D0F]" />
                        <h2 className="text-xl font-poppins font-semibold text-[#0C0D0F]">
                            Filter Users
                        </h2>
                    </div>
                    <p className="text-sm text-[#666666] mt-1">
                        Refine your user list with multiple filter options
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-[#F9FAFB] rounded-lg transition-colors border border-[#E5E7EB]"
                    title="Close"
                    aria-label="Close"
                >
                    <X className="w-4 h-4 text-[#666666]" />
                </button>
            </div>

            <div className="mt-6 space-y-6">
                <div>
                    <div className="text-sm font-medium text-[#0C0D0F] mb-3">Points Range</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <div className="text-xs text-[#9CA3AF] mb-1">Min Points</div>
                            <input
                                value={minPoints}
                                onChange={(e) => setMinPoints(e.target.value)}
                                placeholder="0"
                                className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#3E8FCC] bg-white"
                                inputMode="numeric"
                                title="Min points"
                                aria-label="Min points"
                            />
                        </div>
                        <div>
                            <div className="text-xs text-[#9CA3AF] mb-1">Max Points</div>
                            <input
                                value={maxPoints}
                                onChange={(e) => setMaxPoints(e.target.value)}
                                placeholder="No Limit"
                                className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#3E8FCC] bg-white"
                                inputMode="numeric"
                                title="Max points"
                                aria-label="Max points"
                            />
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {POINTS_RANGES.slice(0, 3).map((range: { min: number; max: number | null; label: string }) => {
                            const active =
                                filters.pointsRange?.min === range.min && filters.pointsRange?.max === range.max
                            return (
                                <button
                                    key={range.label}
                                    type="button"
                                    onClick={() => handlePointsRangeChange({ min: range.min, max: range.max })}
                                    className={`px-3 py-1.5 rounded-md text-xs border transition-colors ${active
                                        ? 'border-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,white)] text-[var(--primary)]'
                                        : 'border-[var(--neutral-light)] bg-white text-[var(--text-secondary)] hover:bg-[var(--neutral-lightest)]'
                                        }`}
                                    title={`Select points range: ${range.label}`}
                                >
                                    {range.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
                <div>
                    <div className="text-sm font-medium text-[#0C0D0F] mb-3">Filter by Badge</div>
                    <div className="grid grid-cols-3 gap-3 max-w-sm">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                className="h-16 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] grid place-items-center text-2xl"
                                title="Badge"
                                aria-label="Badge"
                            >
                                ☆
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="text-sm font-medium text-[#0C0D0F] mb-3">Recent Activity</div>
                    <select
                        value={filters.timeRange || 'all_time'}
                        onChange={(e) => handleTimeRangeChange(e.target.value)}
                        className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#3E8FCC] bg-white text-[#0C0D0F]"
                        title="Select recent activity time range"
                    >
                        {Object.entries(ACTIVITY_TIME_RANGE_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label as React.ReactNode}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                    <button
                        type="button"
                        onClick={onReset}
                        className="inline-flex items-center gap-2 text-[#666666] hover:text-[#0C0D0F] font-medium"
                        title="Reset all"
                    >
                        ↺ Reset All
                    </button>
                    {selectedRangeLabel ? <span>Selected: {selectedRangeLabel}</span> : <span />}
                </div>
            </div>

            <ModalFooter className="justify-end">
                <Button
                    variant="secondary"
                    onClick={onClose}
                    className="bg-white border border-[#DC2626] text-[#DC2626] hover:bg-[#FEF2F2]"
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={onClose}
                    className="bg-[#3E8FCC] hover:bg-[#2F71A3]"
                >
                    Apply Filter
                </Button>
            </ModalFooter>
        </Modal>
    )
}
