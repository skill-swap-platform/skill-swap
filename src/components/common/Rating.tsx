import React, { useState } from 'react'
import { Star } from 'lucide-react'
interface RatingProps {
    value: number
    onChange?: (value: number) => void
    max?: number
    size?: 'sm' | 'md' | 'lg'
    readonly?: boolean
    className?: string
}
export const Rating: React.FC<RatingProps> = ({
    value,
    onChange,
    max = 5,
    size = 'md',
    readonly = false,
    className = '',
}) => {
    const [hoverValue, setHoverValue] = useState(0)

    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    }
    const handleClick = (rating: number) => {
        if (!readonly && onChange) {
            onChange(rating)
        }
    }

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {Array.from({ length: max }, (_, index) => {
                const rating = index + 1
                const isFilled = rating <= (hoverValue || value)

                return (
                    <button
                        key={rating}
                        type="button"
                        onClick={() => handleClick(rating)}
                        onMouseEnter={() => !readonly && setHoverValue(rating)}
                        onMouseLeave={() => !readonly && setHoverValue(0)}
                        disabled={readonly}
                        className={`transition-[color,transform] ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
                        title={`Rate ${rating} out of ${max}`}
                    >
                        <Star
                            className={`${sizes[size]} ${isFilled
                                    ? 'fill-[var(--warning)] text-[var(--warning)]'
                                    : 'fill-none text-[var(--neutral-light)]'
                                }`}
                        />
                    </button>
                )
            })}
        </div>
    )
}
interface RatingDisplayProps {
    value: number
    max?: number
    showValue?: boolean
    size?: 'sm' | 'md' | 'lg'
    className?: string
}
export const RatingDisplay: React.FC<RatingDisplayProps> = ({
    value,
    max = 5,
    showValue = true,
    size = 'md',
    className = '',
}) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <Rating value={value} max={max} size={size} readonly />
            {showValue && (
                <span className="text-sm text-[var(--text-secondary)] font-medium">
                    {value.toFixed(1)}/{max}
                </span>
            )}
        </div>
    )
}
