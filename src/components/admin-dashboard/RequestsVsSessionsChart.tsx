import React, { useMemo } from 'react'
import type { RequestsVsSessionsItem } from '@/api/services/admin.service'

interface RequestsVsSessionsChartProps {
    data: RequestsVsSessionsItem[]
}

export const RequestsVsSessionsChart: React.FC<RequestsVsSessionsChartProps> = ({ data }) => {
    const chartData = useMemo(() => [...data].sort((a, b) => a.week - b.week), [data])

    if (!chartData.length) {
        return (
            <div className="flex h-[230px] items-center justify-center text-sm text-[#666666]">
                No weekly request/session data.
            </div>
        )
    }

    const width = 640
    const height = 230
    const padding = { top: 12, right: 18, bottom: 34, left: 34 }
    const innerWidth = width - padding.left - padding.right
    const innerHeight = height - padding.top - padding.bottom
    const maxValue = Math.max(
        ...chartData.flatMap((item) => [item.requests, item.sessions]),
        10
    )
    const yMax = Math.ceil(maxValue / 20) * 20
    const yTicks = Array.from({ length: 6 }, (_, index) => (yMax / 5) * index)
    const groupWidth = innerWidth / chartData.length
    const barWidth = Math.min(22, groupWidth / 3)

    const toY = (value: number): number =>
        padding.top + innerHeight - (value / (yMax || 1)) * innerHeight

    return (
        <div className="h-[230px] w-full">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-full w-full"
                preserveAspectRatio="none"
            >
                {yTicks.map((tick) => (
                    <g key={tick}>
                        <line
                            x1={padding.left}
                            y1={toY(tick)}
                            x2={width - padding.right}
                            y2={toY(tick)}
                            stroke="#D1D5DB"
                            strokeDasharray="3 3"
                        />
                        <text
                            x={padding.left - 8}
                            y={toY(tick) + 4}
                            textAnchor="end"
                            fontSize="10"
                            fill="#666666"
                        >
                            {Math.round(tick)}
                        </text>
                    </g>
                ))}

                {chartData.map((item, index) => {
                    const groupStart = padding.left + index * groupWidth
                    const sessionsX = groupStart + groupWidth / 2 - barWidth - 2
                    const requestsX = groupStart + groupWidth / 2 + 2
                    const sessionsHeight = innerHeight - (toY(item.sessions) - padding.top)
                    const requestsHeight = innerHeight - (toY(item.requests) - padding.top)

                    return (
                        <g key={`week-${item.week}`}>
                            <rect
                                x={sessionsX}
                                y={padding.top}
                                width={barWidth}
                                height={innerHeight}
                                fill="#2F71A3"
                                opacity="0.15"
                            />
                            <rect
                                x={requestsX}
                                y={padding.top}
                                width={barWidth}
                                height={innerHeight}
                                fill="#419063"
                                opacity="0.15"
                            />
                            <rect
                                x={sessionsX}
                                y={toY(item.sessions)}
                                width={barWidth}
                                height={sessionsHeight}
                                fill="#2F71A3"
                                opacity="0.8"
                            />
                            <rect
                                x={requestsX}
                                y={toY(item.requests)}
                                width={barWidth}
                                height={requestsHeight}
                                fill="#419063"
                                opacity="0.8"
                            />
                            <text
                                x={groupStart + groupWidth / 2}
                                y={height - 8}
                                textAnchor="middle"
                                fontSize="10"
                                fill="#666666"
                            >
                                {`Week${item.week}`}
                            </text>
                        </g>
                    )
                })}
            </svg>
        </div>
    )
}
