import React from 'react'
interface BadgeProps {
    children: React.ReactNode
    variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral'
    size?: 'sm' | 'md' | 'lg'
    className?: string
}
export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'neutral',
    size = 'md',
    className = '',
}) => {
    const baseStyles = 'inline-flex items-center font-medium rounded-full'
    const variants = {
        success: 'bg-[var(--success)] text-white',
        warning: 'bg-[var(--warning)] text-white',
        error: 'bg-[var(--error)] text-white',
        info: 'bg-[var(--info)] text-white',
        neutral: 'bg-[var(--neutral-light)] text-[var(--text-primary)]',
    }
    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
    }
    return (
        <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
        </span>
    )
}
