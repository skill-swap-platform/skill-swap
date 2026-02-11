import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl'
    showCloseButton?: boolean
}
export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true,
}) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    }

    if (!isOpen) return null

    return (
        <>
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className={`bg-white rounded-lg shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden animate-scale-in`}>
                    {(title || showCloseButton) && (
                        <div className="flex items-center justify-between p-6 border-b border-neutral-light">
                            {title && (
                                <h2 className="text-2xl font-poppins font-semibold text-text-primary">
                                    {title}
                                </h2>
                            )}
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-neutral-light rounded-lg transition-colors"
                                    title="Close modal"
                                >
                                    <X className="w-5 h-5 text-text-secondary" />
                                </button>
                            )}
                        </div>
                    )}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}
interface ModalFooterProps {
    children: React.ReactNode
    className?: string
}
export const ModalFooter: React.FC<ModalFooterProps> = ({
    children,
    className = '',
}) => {
    return (
        <div className={`flex items-center justify-end gap-3 pt-4 border-t border-neutral-light ${className}`}>
            {children}
        </div>
    )
}
