import React from 'react'
interface ProgressBarProps {
    value: number
    max?: number
    size?: 'sm' | 'md' | 'lg'
    color?: 'primary' | 'success' | 'warning' | 'error'
    showLabel?: boolean
    label?: string
    className?: string
}
export const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    max = 100,
    size = 'md',
    color = 'primary',
    showLabel = false,
    label,
    className = '',
}) => {
    const percentage = Math.min((value / max) * 100, 100)

    const sizes = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
    }

    const colors = {
        primary: 'bg-primary',
        success: 'bg-success',
        warning: 'bg-warning',
        error: 'bg-error',
    }

    return (
        <div className={className}>
            {showLabel && (
                <div className="flex items-center justify-between mb-2">
                    {label && (
                        <span className="text-sm font-medium text-text-secondary">
                            {label}
                        </span>
                    )}
                    <span className="text-sm font-medium text-text-primary">
                        {Math.round(percentage)}%
                    </span>
                </div>
            )}

            <div className={`w-full bg-neutral-light rounded-full overflow-hidden ${sizes[size]}`}>
                <div
                    className={`${sizes[size]} ${colors[color]} rounded-full transition-all duration-300 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}

interface CircularProgressProps {
    value: number
    max?: number
    size?: number
    strokeWidth?: number
    color?: 'primary' | 'success' | 'warning' | 'error'
    showLabel?: boolean
    className?: string
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    value,
    max = 100,
    size = 120,
    strokeWidth = 8,
    color = 'primary',
    showLabel = true,
    className = '',
}) => {
    const percentage = Math.min((value / max) * 100, 100)
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (percentage / 100) * circumference

    const colors = {
        primary: '#3E8FCC',
        success: '#16A34A',
        warning: '#F59E0B',
        error: '#DC2626',
    }

    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#E5E7EB"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={colors[color]}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-300 ease-out"
                />
            </svg>

            {showLabel && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-poppins font-semibold text-text-primary">
                        {Math.round(percentage)}%
                    </span>
                </div>
            )}
        </div>
    )
}
