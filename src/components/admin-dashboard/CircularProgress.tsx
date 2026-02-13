import React from 'react'

const clampPercentage = (value: number): number => {
    if (value < 0) return 0
    if (value > 100) return 100
    return value
}

interface CircularProgressProps {
    value: number
    size?: number
    strokeWidth?: number
    color?: string
    labelClassName?: string
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    value,
    size = 58,
    strokeWidth = 5,
    color = '#2F71A3',
    labelClassName = 'text-[10px] font-bold text-[#333333]',
}) => {
    const normalizedValue = clampPercentage(value)
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (normalizedValue / 100) * circumference

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className={labelClassName}>{`${Math.round(normalizedValue)}%`}</span>
            </div>
        </div>
    )
}
