import React from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    children: React.ReactNode
}
export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    const variants = {
        primary:
            'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] focus:ring-[var(--primary)]',
        secondary:
            'bg-[var(--neutral-light)] text-[var(--text-primary)] hover:bg-[var(--neutral-medium)] focus:ring-[var(--neutral-light)]',
        success:
            'bg-[var(--success)] text-white hover:brightness-95 focus:ring-[var(--success)]',
        danger:
            'bg-[var(--error)] text-white hover:brightness-95 focus:ring-[var(--error)]',
        ghost:
            'bg-transparent text-[var(--text-primary)] hover:bg-[var(--neutral-light)] focus:ring-[var(--neutral-light)]',
    }
    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    }
    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </button>
    )
}
