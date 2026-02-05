import React from 'react'
import { User } from 'lucide-react'
import { getInitials } from '@/utils'

interface AvatarProps {
    src?: string
    alt?: string
    name?: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    className?: string
}
export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    name,
    size = 'md',
    className = '',
}) => {
    const sizes = {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
        xl: 'w-16 h-16 text-xl',
    }
    const iconSizes = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
        xl: 'w-8 h-8',
    }

    if (src) {
        return (
            <img
                src={src}
                alt={alt || name || 'Avatar'}
                className={`${sizes[size]} rounded-full object-cover ${className}`}
            />
        )
    }
    return (
        <div
            className={`${sizes[size]} rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-medium ${className}`}
        >
            {name ? (
                getInitials(name)
            ) : (
                <User className={iconSizes[size]} />
            )}
        </div>
    )
}
