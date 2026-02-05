import React from 'react'
interface CardProps {
    children: React.ReactNode
    className?: string
    hover?: boolean
    onClick?: () => void
}
export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    hover = false,
    onClick,
}) => {
    const baseStyles =
        'bg-white rounded-lg p-6 border border-[var(--neutral-light)] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
    const hoverStyles = hover ? 'card-hover cursor-pointer' : ''
    return (
        <div
            className={`${baseStyles} ${hoverStyles} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    )
}
interface CardHeaderProps {
    children: React.ReactNode
    className?: string
}
export const CardHeader: React.FC<CardHeaderProps> = ({
    children,
    className = '',
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            {children}
        </div>
    )
}
interface CardTitleProps {
    children: React.ReactNode
    className?: string
}
export const CardTitle: React.FC<CardTitleProps> = ({
    children,
    className = '',
}) => {
    return (
        <h3 className={`text-xl font-poppins font-semibold text-[var(--text-primary)] ${className}`}>
            {children}
        </h3>
    )
}
interface CardContentProps {
    children: React.ReactNode
    className?: string
}
export const CardContent: React.FC<CardContentProps> = ({
    children,
    className = '',
}) => {
    return (
        <div className={className}>
            {children}
        </div>
    )
}
interface CardFooterProps {
    children: React.ReactNode
    className?: string
}
export const CardFooter: React.FC<CardFooterProps> = ({
    children,
    className = '',
}) => {
    return (
        <div className={`mt-4 pt-4 border-t border-[var(--neutral-light)] ${className}`}>
            {children}
        </div>
    )
}
