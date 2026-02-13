import React, { useMemo } from 'react'
import type { CompletedSessionChartPoint } from '@/api/services/admin.service'

interface CompletedSessionsChartProps {
    data: CompletedSessionChartPoint[]
}

export const CompletedSessionsChart: React.FC<CompletedSessionsChartProps> = ({ data }) => {
    const chartData = useMemo(() => [...data].sort((a, b) => a.day - b.day), [data])

    if (!chartData.length) {
        return (
            <div className="flex h-[230px] items-center justify-center text-sm text-[#666666]">
                No completed session data.
            </div>
        )
    }

    const width = 640
    const height = 230
    const padding = { top: 12, right: 18, bottom: 28, left: 34 }
    const innerWidth = width - padding.left - padding.right
    const innerHeight = height - padding.top - padding.bottom
    const maxValue = Math.max(...chartData.map((item) => item.count), 10)
    const yMax = Math.ceil(maxValue / 20) * 20
    const yTicks = Array.from({ length: 6 }, (_, index) => (yMax / 5) * index)
    const xMin = chartData[0]?.day ?? 1
    const xMax = chartData[chartData.length - 1]?.day ?? xMin
    const xDomain = xMax - xMin || 1
    const labelStep = Math.max(1, Math.ceil(chartData.length / 10))
    const xLabels = chartData.filter(
        (_, index) => index % labelStep === 0 || index === chartData.length - 1
    )

    const toX = (day: number): number => padding.left + ((day - xMin) / xDomain) * innerWidth
    const toY = (count: number): number =>
        padding.top + innerHeight - (count / (yMax || 1)) * innerHeight

    const linePath = chartData
        .map((point, index) => `${index === 0 ? 'M' : 'L'} ${toX(point.day)} ${toY(point.count)}`)
        .join(' ')

    const firstPoint = chartData[0]
    const lastPoint = chartData[chartData.length - 1]
    const areaPath = `${linePath} L ${toX(lastPoint.day)} ${padding.top + innerHeight} L ${toX(firstPoint.day)} ${padding.top + innerHeight} Z`

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

                <path d={areaPath} fill="#3E8FCC" fillOpacity="0.12" />
                <path d={linePath} fill="none" stroke="#3E8FCC" strokeWidth="1.8" />

                {chartData.map((point) => (
                    <circle
                        key={`${point.day}-${point.count}`}
                        cx={toX(point.day)}
                        cy={toY(point.count)}
                        r="3.5"
                        fill="#3E8FCC"
                        stroke="#B2D6F4"
                        strokeWidth="2"
                    />
                ))}

                {xLabels.map((label) => (
                    <text
                        key={`x-${label.day}`}
                        x={toX(label.day)}
                        y={height - 8}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#666666"
                    >
                        {label.day}
                    </text>
                ))}
            </svg>
        </div>
    )
}
