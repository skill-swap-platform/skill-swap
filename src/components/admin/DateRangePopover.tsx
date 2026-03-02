import React, { useMemo, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

type DateRangePopoverProps = {
    startDate: string
    endDate: string
    onStartDateChange: (value: string) => void
    onEndDateChange: (value: string) => void
    onApply: () => void
}

type CalendarCell = {
    date: Date
    isCurrentMonth: boolean
}

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const normalizeDate = (value: Date): Date =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate())

const parseIsoDate = (value: string): Date | null => {
    if (!value) return null
    const parts = value.split('-').map((part) => Number(part))
    if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) return null

    const [year, month, day] = parts
    const parsed = new Date(year, month - 1, day)
    if (
        parsed.getFullYear() !== year ||
        parsed.getMonth() !== month - 1 ||
        parsed.getDate() !== day
    ) {
        return null
    }

    return normalizeDate(parsed)
}

const pad = (value: number): string => value.toString().padStart(2, '0')

const toIsoDate = (value: Date): string =>
    `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`

const formatInputDate = (value: Date | null): string =>
    value ? `${pad(value.getDate())}/${pad(value.getMonth() + 1)}/${value.getFullYear()}` : ''

const isSameDay = (left: Date, right: Date): boolean =>
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()

const isBeforeDay = (left: Date, right: Date): boolean => left.getTime() < right.getTime()
const isAfterDay = (left: Date, right: Date): boolean => left.getTime() > right.getTime()

const isBetweenInclusive = (date: Date, start: Date, end: Date): boolean =>
    date.getTime() >= start.getTime() && date.getTime() <= end.getTime()

const buildCalendarCells = (visibleMonth: Date): CalendarCell[] => {
    const year = visibleMonth.getFullYear()
    const month = visibleMonth.getMonth()
    const firstDayOfMonth = new Date(year, month, 1)
    const startIndex = firstDayOfMonth.getDay()
    const firstCellDate = new Date(year, month, 1 - startIndex)
    const cells: CalendarCell[] = []

    for (let index = 0; index < 42; index += 1) {
        const nextDate = new Date(firstCellDate)
        nextDate.setDate(firstCellDate.getDate() + index)
        cells.push({
            date: normalizeDate(nextDate),
            isCurrentMonth: nextDate.getMonth() === month,
        })
    }

    return cells
}

const buildRangeSegments = (
    rowCells: CalendarCell[],
    rangeStart: Date | null,
    rangeEnd: Date | null
): Array<{ startIndex: number; endIndex: number }> => {
    if (!rangeStart || !rangeEnd) return []

    const segments: Array<{ startIndex: number; endIndex: number }> = []
    let segmentStart: number | null = null

    rowCells.forEach((cell, index) => {
        const inside = isBetweenInclusive(cell.date, rangeStart, rangeEnd)
        if (inside && segmentStart === null) {
            segmentStart = index
        }

        if ((!inside || index === rowCells.length - 1) && segmentStart !== null) {
            const endIndex = inside && index === rowCells.length - 1 ? index : index - 1
            segments.push({ startIndex: segmentStart, endIndex })
            segmentStart = null
        }
    })

    return segments
}

export const DateRangePopover: React.FC<DateRangePopoverProps> = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    onApply,
}) => {
    const selectedStartDate = useMemo(() => parseIsoDate(startDate), [startDate])
    const selectedEndDate = useMemo(() => parseIsoDate(endDate), [endDate])

    const referenceDate = selectedEndDate || selectedStartDate || new Date()
    const [visibleMonth, setVisibleMonth] = useState(
        () => new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1)
    )

    const calendarCells = useMemo(() => buildCalendarCells(visibleMonth), [visibleMonth])
    const calendarRows = useMemo(() => {
        const rows: CalendarCell[][] = []
        for (let row = 0; row < 6; row += 1) {
            rows.push(calendarCells.slice(row * 7, row * 7 + 7))
        }
        return rows
    }, [calendarCells])

    const normalizedRange =
        selectedStartDate && selectedEndDate && isAfterDay(selectedStartDate, selectedEndDate)
            ? { start: selectedEndDate, end: selectedStartDate }
            : { start: selectedStartDate, end: selectedEndDate }

    const rangeStart = normalizedRange.start
    const rangeEnd = normalizedRange.end

    const currentYear = new Date().getFullYear()
    const yearOptions = useMemo(
        () => Array.from({ length: 201 }, (_, index) => currentYear - 100 + index),
        [currentYear]
    )

    const handleDayClick = (day: Date) => {
        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            onStartDateChange(toIsoDate(day))
            onEndDateChange('')
            return
        }

        if (isBeforeDay(day, selectedStartDate)) {
            onEndDateChange(toIsoDate(selectedStartDate))
            onStartDateChange(toIsoDate(day))
            return
        }

        onEndDateChange(toIsoDate(day))
    }

    return (
        <div className="absolute right-0 top-14 z-30 w-[348px] rounded-[12px] border border-[#E5E7EB] bg-white p-4 shadow-[0px_10px_50px_0px_rgba(139,139,139,0.1)]">
            <div className="flex h-12 items-center">
                <button
                    type="button"
                    onClick={() =>
                        setVisibleMonth(
                            (previous) => new Date(previous.getFullYear(), previous.getMonth() - 1, 1)
                        )
                    }
                    className="flex h-8 w-8 items-center justify-center text-[#8B8B8B]"
                    aria-label="Previous month"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                <p
                    className="flex-1 text-center text-[12px] leading-[18px] text-[#0C0D0F]"
                    style={{ fontFamily: '"Segoe UI", sans-serif' }}
                >
                    {visibleMonth.toLocaleDateString('en-US', { month: 'long' })}
                </p>

                <button
                    type="button"
                    onClick={() =>
                        setVisibleMonth(
                            (previous) => new Date(previous.getFullYear(), previous.getMonth() + 1, 1)
                        )
                    }
                    className="flex h-8 w-8 items-center justify-center text-[#8B8B8B]"
                    aria-label="Next month"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>

                <div className="relative ml-2 h-8 w-20">
                    <select
                        value={visibleMonth.getFullYear()}
                        onChange={(event) =>
                            setVisibleMonth(
                                new Date(Number(event.target.value), visibleMonth.getMonth(), 1)
                            )
                        }
                        className="h-full w-full appearance-none rounded-[4px] border border-[#747474] bg-white px-3 pr-8 text-left text-[13px] leading-[20px] text-[#999999]"
                        style={{ fontFamily: '"Segoe UI", sans-serif' }}
                        aria-label="Select year"
                    >
                        {yearOptions.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B8B8B]" />
                </div>
            </div>

            <div className="pb-4">
                <div className="mt-2 flex h-12 items-center gap-[6px] text-center text-[14px] font-semibold leading-none text-[rgba(0,0,0,0.42)]">
                    {WEEK_DAYS.map((dayLabel) => (
                        <p key={dayLabel} className="w-10">
                            {dayLabel}
                        </p>
                    ))}
                </div>

                <div className="space-y-[6px]">
                    {calendarRows.map((rowCells, rowIndex) => {
                        const rangeSegments = buildRangeSegments(rowCells, rangeStart, rangeEnd)

                        return (
                            <div key={`week-row-${rowIndex}`} className="relative flex gap-[6px]">
                                {rangeSegments.map((segment) => {
                                    const left = segment.startIndex * 46
                                    const width = (segment.endIndex - segment.startIndex + 1) * 46 - 6
                                    return (
                                        <span
                                            key={`segment-${rowIndex}-${segment.startIndex}-${segment.endIndex}`}
                                            className="absolute top-0 h-10 rounded-[16px] bg-[#DFEDFD]"
                                            style={{ left, width }}
                                            aria-hidden="true"
                                        />
                                    )
                                })}

                                {rowCells.map((cell) => {
                                    const isSelectedStart =
                                        selectedStartDate !== null && isSameDay(cell.date, selectedStartDate)
                                    const isSelectedEnd =
                                        selectedEndDate !== null && isSameDay(cell.date, selectedEndDate)
                                    const isSelected = isSelectedStart || isSelectedEnd
                                    const isInRange =
                                        rangeStart !== null &&
                                        rangeEnd !== null &&
                                        isBetweenInclusive(cell.date, rangeStart, rangeEnd)

                                    const baseTextColor = cell.isCurrentMonth ? '#282828' : '#DBDBDB'
                                    const textColor = isInRange ? '#106FDF' : baseTextColor

                                    return (
                                        <button
                                            key={cell.date.toISOString()}
                                            type="button"
                                            onClick={() => handleDayClick(cell.date)}
                                            className="relative z-10 flex h-10 w-10 items-center justify-center"
                                        >
                                            <span
                                                className={`flex h-10 w-10 items-center justify-center text-[16px] leading-none ${
                                                    isSelected ? 'rounded-full bg-[#2F71A3] text-white' : ''
                                                }`}
                                                style={{
                                                    color: isSelected ? '#FFFFFF' : textColor,
                                                    fontFamily: '"Inter", sans-serif',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {cell.date.getDate()}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="border-t border-[#E5E7EB] pt-4">
                <div className="flex items-start gap-2">
                    <div className="relative flex-1">
                        <span className="absolute -top-[6px] left-[10px] bg-white px-1 text-[10px] leading-none text-[#282828]">
                            From
                        </span>
                        <div className="flex h-10 items-center rounded-[16px] border border-[#8B8B8B] px-[10px] text-[14px] text-[#282828]">
                            {formatInputDate(selectedStartDate)}
                        </div>
                    </div>

                    <div className="relative flex-1">
                        <span className="absolute -top-[6px] left-[10px] bg-white px-1 text-[10px] leading-none text-[#282828]">
                            To
                        </span>
                        <div className="flex h-10 items-center rounded-[16px] border border-[#8B8B8B] px-[10px] text-[14px] text-[#282828]">
                            {formatInputDate(selectedEndDate)}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onApply}
                        className="h-10 shrink-0 rounded-[16px] bg-[#2F71A3] px-5 text-[16px] font-medium text-white hover:bg-[#2A6795]"
                    >
                        Set Date
                    </button>
                </div>
            </div>
        </div>
    )
}
