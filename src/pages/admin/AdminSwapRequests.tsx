import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import {
    CalendarDays,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Download,
    Search,
    X,
} from 'lucide-react'
import { SortOrderIcon } from '@/components/admin-users/SortOrderIcon'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { AdminHeader } from '@/components/layout/AdminHeader'
import { userService } from '@/api/services/user.service'
import { useAdminSwaps, useExportAdminSwapsCsv } from '@/hooks/useAdminSwaps'
import type { AdminSwapItem, AdminSwapsSort } from '@/types/adminSwaps.types'
import type { UserAuthDto } from '@/types/api.types'
import type { AdminSwapStatus } from '@/types/adminUsers.types'

const DEFAULT_AVATAR_URL = 'https://api.dicebear.com/7.x/notionists/svg?seed=currentuser'
const PAGE_LIMIT = 10

const statusOptions: { label: string; value: AdminSwapStatus | 'ALL' }[] = [
    { label: 'All Status', value: 'ALL' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Accepted', value: 'ACCEPTED' },
    { label: 'Declined', value: 'DECLINED' },
    { label: 'Expired', value: 'EXPIRED' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' },
]

const sortOptions: { label: string; value: AdminSwapsSort }[] = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
]

const statusPillClassName: Record<AdminSwapStatus, string> = {
    PENDING: 'bg-[#FEF3C7] text-[#F59E0B]',
    ACCEPTED: 'bg-[#D2F7DF] text-[#16A34A]',
    DECLINED: 'bg-[#FECACA] text-[#DC2626]',
    EXPIRED: 'bg-[#FFE8C2] text-[#D97706]',
    COMPLETED: 'bg-[#D2F7DF] text-[#16A34A]',
    CANCELLED: 'bg-[#E5E7EB] text-[#6B7280]',
}

const getStoredUser = (): UserAuthDto | null => {
    try {
        const rawUser = localStorage.getItem('user')
        if (!rawUser) return null
        return JSON.parse(rawUser) as UserAuthDto
    } catch {
        return null
    }
}

const getErrorMessage = (error: unknown, fallback: string): string => {
    if (!axios.isAxiosError(error)) return fallback
    const message = error.response?.data?.message

    if (typeof message === 'string' && message.trim().length > 0) return message
    if (Array.isArray(message)) {
        const joinedMessage = message.filter((item) => typeof item === 'string').join(', ')
        if (joinedMessage.length > 0) return joinedMessage
    }

    return fallback
}

const toStatusLabel = (status: AdminSwapStatus): string => {
    if (status === 'DECLINED') return 'Declined'
    if (status === 'CANCELLED') return 'Cancelled'
    if (status === 'COMPLETED') return 'Completed'
    if (status === 'EXPIRED') return 'Expired'
    if (status === 'ACCEPTED') return 'Accepted'
    return 'Pending'
}

const formatDate = (value: string): string => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '--'
    return date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
    })
}

const formatTime = (value: string): string => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '--'
    return date
        .toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
        })
        .toLowerCase()
}

const avatarFallback = (name: string, id: string): string =>
    `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(name || id || 'user')}`

const downloadBlob = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
}

const pageRange = (start: number, end: number): number[] => {
    const pages: number[] = []
    for (let current = start; current <= end; current += 1) {
        pages.push(current)
    }
    return pages
}

type SelectionCheckboxProps = {
    checked: boolean
    onChange: () => void
    ariaLabel: string
}

const SelectionCheckbox: React.FC<SelectionCheckboxProps> = ({ checked, onChange, ariaLabel }) => (
    <label className="inline-flex cursor-pointer items-center justify-center">
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            aria-label={ariaLabel}
            className="peer sr-only"
        />
        <span
            className={`flex h-[18px] w-[18px] items-center justify-center rounded-[6px] border transition-colors ${
                checked ? 'border-[#3272A3] bg-[#3272A3]' : 'border-[#94A3B8] bg-white'
            }`}
        >
            {checked ? <Check className="h-[12px] w-[12px] text-white" /> : null}
        </span>
    </label>
)

type SummaryCardProps = {
    label: string
    value: number
    icon: React.ReactNode
    iconContainerClassName: string
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, icon, iconContainerClassName }) => (
    <article className="flex min-h-[80px] items-center justify-between rounded-[10px] border border-[#E5E7EB] bg-white p-4">
        <div className="min-w-0">
            <p className="text-[12px] leading-[16.8px] text-[#808191]">{label}</p>
            <p className="text-[30px] font-semibold leading-[33px] text-[#0C0D0F]">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-[4px] ${iconContainerClassName}`}>
            {icon}
        </div>
    </article>
)

const SwapRequestsTitleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
    >
        <path
            d="M2.98334 4.29999H14.5167C15.9 4.29999 17.0167 5.41665 17.0167 6.79999V9.56666"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M5.61667 1.66669L2.98334 4.3L5.61667 6.93336"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M17.0167 15.7H5.48334C4.1 15.7 2.98334 14.5834 2.98334 13.2V10.4333"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M14.3834 18.3333L17.0167 15.7L14.3834 13.0667"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

const AcceptedIcon: React.FC = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path
            opacity="0.4"
            d="M7.51382 3.5C7.50214 3.58165 7.49609 3.66512 7.49609 3.75C7.49609 4.7165 8.2796 5.5 9.24609 5.5H14.7461C15.7126 5.5 16.4961 4.7165 16.4961 3.75C16.4961 3.66512 16.4901 3.58165 16.4784 3.5H16.4922C18.048 3.54667 18.9756 3.71984 19.6174 4.36228C20.4961 5.24177 20.4961 6.6573 20.4961 9.48836V15.9944C20.4961 18.8255 20.4961 20.241 19.6174 21.1205C18.7387 22 17.3245 22 14.4961 22L9.49609 22C6.66767 22 5.25345 22 4.37477 21.1205C3.49609 20.241 3.49609 18.8255 3.49609 15.9944V9.48836C3.49609 6.6573 3.49609 5.24177 4.37477 4.36227C5.01661 3.71984 5.9442 3.54667 7.5 3.5H7.51382Z"
            fill="#16A34A"
        />
        <path
            d="M14.7461 1.25C15.7798 1.25 16.6662 1.8777 17.0469 2.77246C18.3408 2.84468 19.3786 3.06144 20.1484 3.83203C20.75 4.43433 21.0089 5.19316 21.1299 6.09375C21.2464 6.96137 21.2461 8.06489 21.2461 9.43359V16.0488C21.2461 17.4177 21.2464 18.521 21.1299 19.3887C21.0089 20.2893 20.7501 21.0481 20.1484 21.6504C19.5465 22.2528 18.7879 22.5117 17.8877 22.6328C17.0207 22.7495 15.9182 22.75 14.5508 22.75L9.44141 22.75C8.07395 22.75 6.97148 22.7495 6.10449 22.6328C5.20426 22.5117 4.44564 22.2528 3.84375 21.6504C3.24207 21.0481 2.98328 20.2893 2.8623 19.3887C2.74578 18.521 2.74607 17.4177 2.74609 16.0488L2.74609 9.43359C2.74607 8.06491 2.74582 6.96136 2.8623 6.09375C2.98327 5.19316 3.24218 4.43433 3.84375 3.83203C4.61344 3.06163 5.65083 2.84473 6.94434 2.77246C7.32489 1.87751 8.21225 1.25 9.24609 1.25L14.7461 1.25ZM17.1865 4.28711C16.9406 5.40951 15.9423 6.25 14.7461 6.25L9.24609 6.25C8.04982 6.25 7.05051 5.40961 6.80469 4.28711C5.74625 4.36684 5.24684 4.54982 4.90527 4.8916C4.6284 5.16874 4.44829 5.55835 4.34961 6.29297C4.24804 7.04914 4.24609 8.05157 4.24609 9.48828L4.24609 15.9941C4.24609 17.4308 4.24804 18.4333 4.34961 19.1895C4.44828 19.9237 4.62852 20.3128 4.90527 20.5898C5.18206 20.8669 5.57104 21.0478 6.30469 21.1465C7.05994 21.2481 8.0609 21.25 9.49609 21.25L14.4961 21.25C15.9313 21.25 16.9323 21.2481 17.6875 21.1465C18.4211 21.0478 18.8101 20.8669 19.0869 20.5898C19.3637 20.3128 19.5439 19.9237 19.6426 19.1895C19.7441 18.4333 19.7461 17.4308 19.7461 15.9941V9.48828C19.7461 8.05157 19.7441 7.04914 19.6426 6.29297C19.5439 5.55835 19.3638 5.16874 19.0869 4.8916C18.7452 4.54972 18.2456 4.3668 17.1865 4.28711ZM9 16C9.55228 16 10 16.4477 10 17C10 17.5523 9.55228 18 9 18H8C7.44772 18 7 17.5523 7 17C7 16.4477 7.44772 16 8 16H9ZM17 16.25C17.4142 16.25 17.75 16.5858 17.75 17C17.75 17.4142 17.4142 17.75 17 17.75H13.5C13.0858 17.75 12.75 17.4142 12.75 17C12.75 16.5858 13.0858 16.25 13.5 16.25L17 16.25ZM10.75 9.29297C11.1403 9.15498 11.5688 9.35969 11.707 9.75C11.8452 10.1404 11.6404 10.5688 11.25 10.707C11.0263 10.7863 10.7456 10.9671 10.4297 11.2441C10.1216 11.5144 9.81862 11.8422 9.54688 12.168C9.27638 12.4922 9.04562 12.8035 8.88281 13.0342C8.80169 13.1491 8.7382 13.2432 8.69531 13.3076C8.6739 13.3398 8.65797 13.3647 8.64746 13.3809L8.63574 13.3984L8.63281 13.4023C8.48785 13.6301 8.23157 13.7627 7.96191 13.749C7.69205 13.7352 7.45002 13.5776 7.3291 13.3359C7.12359 12.9249 6.95218 12.7862 6.89648 12.749C6.89171 12.7458 6.88734 12.7433 6.88379 12.7412C6.52476 12.6854 6.25 12.3747 6.25 12C6.25011 11.5859 6.58585 11.25 7 11.25V12C7 11.2502 7.00122 11.25 7.00195 11.25H7.01172L7.02539 11.251C7.03426 11.2513 7.04372 11.2513 7.05371 11.252C7.07405 11.2533 7.09743 11.2555 7.12207 11.2588C7.17133 11.2654 7.22846 11.2768 7.29199 11.2949C7.42051 11.3316 7.56966 11.3951 7.72852 11.501C7.81623 11.5595 7.90496 11.6293 7.99316 11.7119C8.11382 11.5534 8.24843 11.3822 8.39453 11.207C8.69611 10.8455 9.05489 10.4552 9.44141 10.1162C9.82016 9.78405 10.2679 9.46371 10.75 9.29297ZM17 10.25C17.4142 10.25 17.75 10.5858 17.75 11C17.75 11.4142 17.4142 11.75 17 11.75L13.5 11.75C13.0858 11.75 12.75 11.4142 12.75 11C12.75 10.5858 13.0858 10.25 13.5 10.25L17 10.25ZM9.24609 2.75C8.69381 2.75 8.24609 3.19772 8.24609 3.75C8.24609 4.30228 8.69381 4.75 9.24609 4.75L14.7461 4.75C15.2984 4.75 15.7461 4.30228 15.7461 3.75C15.7461 3.19772 15.2984 2.75 14.7461 2.75L9.24609 2.75Z"
            fill="#16A34A"
        />
    </svg>
)

const RejectedIcon: React.FC = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path
            opacity="0.4"
            d="M17.2624 10.2459L19.0165 8.49174C19.4244 8.08391 19.6283 7.88 19.7507 7.66787C20.0831 7.09222 20.0831 6.38299 19.7507 5.80734C19.6283 5.59521 19.4244 5.3913 19.0165 4.98347C18.6087 4.57565 18.4048 4.37174 18.1927 4.24927C17.617 3.91691 16.9078 3.91691 16.3321 4.24926C16.12 4.37174 15.9161 4.57565 15.5083 4.98347L13.7541 6.7376C12.9272 7.56451 12.5138 7.97796 12 7.97796C11.4862 7.97796 11.0728 7.56451 10.2459 6.7376L8.49174 4.98347C8.08391 4.57565 7.88 4.37174 7.66787 4.24926C7.09222 3.91691 6.38299 3.91691 5.80734 4.24926C5.59521 4.37174 5.3913 4.57565 4.98347 4.98347C4.57565 5.3913 4.37174 5.59521 4.24927 5.80734C3.91691 6.38299 3.91691 7.09222 4.24926 7.66787C4.37174 7.88 4.57565 8.08391 4.98347 8.49174L6.7376 10.2459C7.56451 11.0728 7.97796 11.4862 7.97796 12C7.97796 12.5138 7.56451 12.9272 6.7376 13.7541L4.98347 15.5083C4.57565 15.9161 4.37174 16.12 4.24926 16.3321C3.91691 16.9078 3.91691 17.617 4.24926 18.1927C4.37174 18.4048 4.57565 18.6087 4.98347 19.0165C5.3913 19.4244 5.59521 19.6283 5.80733 19.7507C6.38299 20.0831 7.09222 20.0831 7.66787 19.7507C7.88 19.6283 8.08391 19.4244 8.49174 19.0165L10.2459 17.2624C11.0728 16.4355 11.4862 16.022 12 16.022C12.5138 16.022 12.9272 16.4355 13.7541 17.2624L15.5083 19.0165C15.9161 19.4244 16.12 19.6283 16.3321 19.7507C16.9078 20.0831 17.617 20.0831 18.1927 19.7507C18.4048 19.6283 18.6087 19.4244 19.0165 19.0165C19.4244 18.6087 19.6283 18.4048 19.7507 18.1927C20.0831 17.617 20.0831 16.9078 19.7507 16.3321C19.6283 16.12 19.4244 15.9161 19.0165 15.5083L17.2624 13.7541C16.4355 12.9272 16.022 12.5138 16.022 12C16.022 11.4862 16.4355 11.0728 17.2624 10.2459Z"
            fill="#DC2626"
        />
        <path
            d="M6.80786 20.7542C5.66786 20.7542 4.80789 19.8842 4.46789 19.5442C4.00789 19.0842 2.60786 17.6942 3.61786 15.9542C3.78786 15.6542 4.02789 15.4142 4.46789 14.9742L6.21789 13.2242C6.78789 12.6542 7.23785 12.2042 7.23785 12.0042C7.23785 11.8042 6.78789 11.3542 6.21789 10.7842L4.45788 9.0242C4.01788 8.5842 3.77785 8.34416 3.60785 8.04416C2.60785 6.30416 3.99788 4.91419 4.45788 4.45419C4.91788 3.99419 6.30785 2.59416 8.04785 3.60416C8.34785 3.77416 8.58789 4.01419 9.02789 4.45419L10.7779 6.20419C11.3479 6.77419 11.7979 7.22415 11.9979 7.22415C12.1979 7.22415 12.6479 6.77419 13.2179 6.20419L14.9679 4.45419C15.4079 4.01419 15.6479 3.77416 15.9479 3.60416C17.6779 2.60416 19.0779 3.99419 19.5379 4.45419C19.9979 4.91419 21.3979 6.30416 20.3879 8.04416C20.2179 8.34416 19.9779 8.5842 19.5379 9.0242L17.7879 10.7742C17.2179 11.3442 16.7679 11.7942 16.7679 11.9942C16.7679 12.1942 17.2179 12.6442 17.7879 13.2142L19.5379 14.9642C19.9779 15.4042 20.2179 15.6442 20.3879 15.9442C21.3879 17.6842 19.9979 19.0742 19.5379 19.5342C19.0779 19.9942 17.6879 21.3942 15.9479 20.3842C15.6479 20.2142 15.4079 19.9742 14.9679 19.5342L13.2179 17.7842C12.6479 17.2142 12.1979 16.7642 11.9979 16.7642C11.7979 16.7642 11.3479 17.2142 10.7779 17.7842L9.02789 19.5342C8.58789 19.9742 8.34785 20.2142 8.04785 20.3842C7.60785 20.6342 7.18786 20.7342 6.80786 20.7342V20.7542ZM6.80786 4.75418C6.47786 4.75418 6.08789 4.95419 5.52789 5.51419C4.65789 6.38419 4.6479 6.83416 4.9079 7.29416C4.9779 7.42416 5.18788 7.6242 5.51788 7.9642L7.26788 9.7142C8.17788 10.6242 8.72784 11.1742 8.72784 11.9942C8.72784 12.8142 8.17788 13.3642 7.26788 14.2742L5.51788 16.0242C5.17788 16.3642 4.97789 16.5642 4.89789 16.6942C4.63789 17.1542 4.64787 17.6042 5.50787 18.4742C6.37787 19.3442 6.8279 19.3542 7.2879 19.0942C7.4179 19.0242 7.61788 18.8142 7.95788 18.4842L9.70788 16.7342C10.6179 15.8242 11.1679 15.2742 11.9879 15.2742C12.8079 15.2742 13.3579 15.8242 14.2679 16.7342L16.0179 18.4842C16.3579 18.8242 16.5579 19.0242 16.6879 19.1042C17.1479 19.3642 17.5979 19.3542 18.4679 18.4942C19.3379 17.6242 19.3479 17.1742 19.0879 16.7142C19.0179 16.5842 18.8078 16.3842 18.4778 16.0442L16.7278 14.2942C15.8178 13.3842 15.2679 12.8342 15.2679 12.0142C15.2679 11.1942 15.8178 10.6442 16.7278 9.73416L18.4879 7.97415C18.8279 7.63415 19.0278 7.43417 19.1078 7.30417C19.3678 6.84417 19.3579 6.3942 18.4979 5.5242C17.6279 4.6542 17.1779 4.6442 16.7179 4.9042C16.5879 4.9742 16.3879 5.18419 16.0479 5.51419L14.2979 7.26419C13.3879 8.17419 12.8379 8.72415 12.0179 8.72415C11.1979 8.72415 10.6479 8.17419 9.73785 7.26419L7.98785 5.51419C7.64785 5.17419 7.44787 4.97419 7.31787 4.89419C7.15787 4.80419 6.99787 4.74417 6.81787 4.74417L6.80786 4.75418Z"
            fill="#DC2626"
        />
    </svg>
)

const PendingIcon: React.FC = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path
            opacity="0.4"
            d="M4.31802 19.682C3 18.364 3 16.2426 3 12C3 7.75736 3 5.63604 4.31802 4.31802C5.63604 3 7.75736 3 12 3C16.2426 3 18.364 3 19.682 4.31802C21 5.63604 21 7.75736 21 12C21 16.2426 21 18.364 19.682 19.682C18.364 21 16.2426 21 12 21C7.75736 21 5.63604 21 4.31802 19.682Z"
            fill="#FFA412"
        />
        <path
            d="M12.0566 2.25C14.1297 2.24999 15.7627 2.25041 17.0381 2.42188C18.3464 2.59783 19.3904 2.9666 20.2119 3.78809C21.0334 4.60957 21.4022 5.65356 21.5781 6.96191C21.7496 8.23726 21.75 9.87032 21.75 11.9434V12.0566C21.75 14.1297 21.7496 15.7627 21.5781 17.0381C21.4022 18.3464 21.0334 19.3904 20.2119 20.2119C19.3904 21.0334 18.3464 21.4022 17.0381 21.5781C15.7627 21.7496 14.1297 21.75 12.0566 21.75H11.9434C9.87032 21.75 8.23726 21.7496 6.96191 21.5781C5.65356 21.4022 4.60957 21.0334 3.78809 20.2119C2.9666 19.3904 2.59783 18.3464 2.42188 17.0381C2.25041 15.7627 2.24999 14.1297 2.25 12.0566V11.9434C2.24999 9.87032 2.25041 8.23726 2.42188 6.96191C2.59783 5.65356 2.9666 4.60957 3.78809 3.78809C4.60957 2.9666 5.65356 2.59783 6.96191 2.42188C8.23726 2.25041 9.87032 2.24999 11.9434 2.25H12.0566ZM12 3.75C9.85748 3.75 8.32593 3.75173 7.16211 3.9082C6.01994 4.06178 5.34505 4.35222 4.84863 4.84863C4.35222 5.34505 4.06178 6.01994 3.9082 7.16211C3.75173 8.32593 3.75 9.85748 3.75 12C3.75 14.1425 3.75173 15.6741 3.9082 16.8379C4.06178 17.9801 4.35222 18.655 4.84863 19.1514C5.34505 19.6478 6.01994 19.9382 7.16211 20.0918C8.32593 20.2483 9.85748 20.25 12 20.25C14.1425 20.25 15.6741 20.2483 16.8379 20.0918C17.9801 19.9382 18.655 19.6478 19.1514 19.1514C19.6478 18.655 19.9382 17.9801 20.0918 16.8379C20.2483 15.6741 20.25 14.1425 20.25 12C20.25 9.85748 20.2483 8.32593 20.0918 7.16211C19.9382 6.01994 19.6478 5.34505 19.1514 4.84863C18.655 4.35222 17.9801 4.06178 16.8379 3.9082C15.6741 3.75173 14.1425 3.75 12 3.75ZM16.4697 9.46973C16.7626 9.17683 17.2374 9.17683 17.5303 9.46973C17.8232 9.76262 17.8232 10.2374 17.5303 10.5303L14.7373 13.3232C14.0539 14.0066 12.9461 14.0066 12.2627 13.3232L10.6768 11.7373C10.5791 11.6398 10.4209 11.6398 10.3232 11.7373L7.53027 14.5303C7.23738 14.8232 6.76262 14.8232 6.46973 14.5303C6.17683 14.2374 6.17683 13.7626 6.46973 13.4697L9.2627 10.6768C9.94609 9.99344 11.0539 9.99344 11.7373 10.6768L13.3232 12.2627C13.4209 12.3602 13.5791 12.3602 13.6768 12.2627L16.4697 9.46973Z"
            fill="#FFA412"
        />
    </svg>
)

export const AdminSwapRequests: React.FC = () => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState<UserAuthDto | null>(() => getStoredUser())

    const [page, setPage] = useState(1)
    const [searchInput, setSearchInput] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [status, setStatus] = useState<AdminSwapStatus | 'ALL'>('ALL')
    const [sort, setSort] = useState<AdminSwapsSort>('newest')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [draftStartDate, setDraftStartDate] = useState('')
    const [draftEndDate, setDraftEndDate] = useState('')
    const [selectedSwapIds, setSelectedSwapIds] = useState<string[]>([])
    const [statusMenuOpen, setStatusMenuOpen] = useState(false)
    const [sortMenuOpen, setSortMenuOpen] = useState(false)
    const [dateMenuOpen, setDateMenuOpen] = useState(false)
    const [exportError, setExportError] = useState<string | null>(null)

    const statusMenuRef = useRef<HTMLDivElement>(null)
    const sortMenuRef = useRef<HTMLDivElement>(null)
    const dateMenuRef = useRef<HTMLDivElement>(null)

    const swapsQuery = useAdminSwaps({
        page,
        limit: PAGE_LIMIT,
        status: status === 'ALL' ? undefined : status,
        sort,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
    })

    const exportMutation = useExportAdminSwapsCsv()

    const statusLabel = useMemo(
        () => statusOptions.find((option) => option.value === status)?.label ?? 'All Status',
        [status]
    )

    const sortLabel = useMemo(
        () => sortOptions.find((option) => option.value === sort)?.label ?? 'Newest',
        [sort]
    )

    const rows = useMemo(() => swapsQuery.data?.data ?? [], [swapsQuery.data?.data])
    const pagination = swapsQuery.data?.pagination
    const summary = swapsQuery.data?.summary ?? { accepted: 0, pending: 0, rejected: 0 }

    const filteredRows = useMemo(() => {
        const query = searchValue.trim().toLowerCase()
        if (!query) return rows

        return rows.filter((swap) => {
            const sender = swap.sender.userName.toLowerCase()
            const receiver = swap.receiver.userName.toLowerCase()
            const senderEmail = swap.sender.email.toLowerCase()
            const receiverEmail = swap.receiver.email.toLowerCase()
            return (
                sender.includes(query) ||
                receiver.includes(query) ||
                senderEmail.includes(query) ||
                receiverEmail.includes(query)
            )
        })
    }, [rows, searchValue])

    const totalRows = pagination?.total ?? rows.length
    const currentPage = pagination?.page ?? page
    const currentLimit = pagination?.limit ?? PAGE_LIMIT
    const totalPages = Math.max(1, pagination?.totalPages ?? 1)
    const shownCount =
        filteredRows.length === 0
            ? 0
            : Math.min(totalRows, (Math.max(1, currentPage) - 1) * currentLimit + filteredRows.length)

    const pageNumbers = useMemo(() => {
        if (totalPages <= 3) return pageRange(1, totalPages)
        if (currentPage <= 2) return [1, 2, 3]
        if (currentPage >= totalPages - 1) return [totalPages - 2, totalPages - 1, totalPages]
        return [currentPage - 1, currentPage, currentPage + 1]
    }, [currentPage, totalPages])

    const isAllRowsChecked =
        filteredRows.length > 0 && filteredRows.every((swap) => selectedSwapIds.includes(swap.id))

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setSearchValue(searchInput.trim())
            setSelectedSwapIds([])
        }, 250)

        return () => window.clearTimeout(timeoutId)
    }, [searchInput])

    useEffect(() => {
        const closeMenus = (event: MouseEvent) => {
            const target = event.target as Node

            if (statusMenuRef.current && !statusMenuRef.current.contains(target)) {
                setStatusMenuOpen(false)
            }

            if (sortMenuRef.current && !sortMenuRef.current.contains(target)) {
                setSortMenuOpen(false)
            }

            if (dateMenuRef.current && !dateMenuRef.current.contains(target)) {
                setDateMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', closeMenus)
        return () => document.removeEventListener('mousedown', closeMenus)
    }, [])

    useEffect(() => {
        if (!isMobileSidebarOpen) {
            document.body.classList.remove('overflow-hidden')
            return
        }

        document.body.classList.add('overflow-hidden')
        return () => document.body.classList.remove('overflow-hidden')
    }, [isMobileSidebarOpen])

    useEffect(() => {
        let mounted = true

        const loadCurrentUser = async () => {
            const storedUser = getStoredUser()
            if (storedUser && mounted) {
                setCurrentUser(storedUser)
            }

            try {
                const response = await userService.getCurrentProfile()
                if (!mounted || !response.success) return

                const updatedUser: UserAuthDto = {
                    id: response.data.id,
                    userName: response.data.userName || storedUser?.userName || null,
                    email: response.data.email || storedUser?.email || '',
                    role: storedUser?.role || 'USER',
                    image: response.data.image ?? null,
                    isActive: storedUser?.isActive ?? true,
                    isVerified: storedUser?.isVerified ?? true,
                }

                setCurrentUser(updatedUser)
                localStorage.setItem('user', JSON.stringify(updatedUser))
            } catch {
                // Keep cached user if profile request fails.
            }
        }

        loadCurrentUser()
        return () => {
            mounted = false
        }
    }, [])

    const userDisplayName =
        currentUser?.userName?.trim() || currentUser?.email?.split('@')[0] || 'User Name'
    const userDisplayEmail = currentUser?.email || 'user@example.com'
    const userAvatarSrc = currentUser?.image?.trim() || DEFAULT_AVATAR_URL
    const userRoleLabel = currentUser?.role ? currentUser.role.toLowerCase() : 'admin'

    const toggleAllRows = () => {
        if (isAllRowsChecked) {
            setSelectedSwapIds((previous) =>
                previous.filter((id) => !filteredRows.some((row) => row.id === id))
            )
            return
        }

        const idsToAdd = filteredRows.map((swap) => swap.id)
        setSelectedSwapIds((previous) => Array.from(new Set([...previous, ...idsToAdd])))
    }

    const toggleSingleRow = (swapId: string) => {
        setSelectedSwapIds((previous) =>
            previous.includes(swapId) ? previous.filter((id) => id !== swapId) : [...previous, swapId]
        )
    }

    const onStatusChange = (value: AdminSwapStatus | 'ALL') => {
        setStatus(value)
        setPage(1)
        setSelectedSwapIds([])
        setStatusMenuOpen(false)
    }

    const onSortChange = (value: AdminSwapsSort) => {
        setSort(value)
        setPage(1)
        setSelectedSwapIds([])
        setSortMenuOpen(false)
    }

    const applyDateFilter = () => {
        setStartDate(draftStartDate)
        setEndDate(draftEndDate)
        setPage(1)
        setSelectedSwapIds([])
        setDateMenuOpen(false)
    }

    const clearDateFilter = () => {
        setDraftStartDate('')
        setDraftEndDate('')
        setStartDate('')
        setEndDate('')
        setPage(1)
        setSelectedSwapIds([])
        setDateMenuOpen(false)
    }

    const handleExport = async () => {
        if (selectedSwapIds.length === 0 || exportMutation.isPending) return

        setExportError(null)

        try {
            const result = await exportMutation.mutateAsync({ swapIds: selectedSwapIds })
            downloadBlob(result.blob, result.fileName)
        } catch (error: unknown) {
            setExportError(getErrorMessage(error, 'Failed to export selected swap requests.'))
        }
    }

    const renderRow = (swap: AdminSwapItem) => {
        const checked = selectedSwapIds.includes(swap.id)

        return (
            <tr key={swap.id}>
                <td className="h-[62px] border-b border-[#F3F4F6] px-4">
                    <SelectionCheckbox
                        checked={checked}
                        onChange={() => toggleSingleRow(swap.id)}
                        ariaLabel={`Select swap request ${swap.id}`}
                    />
                </td>
                <td className="h-[62px] border-b border-[#F3F4F6] px-4">
                    <div className="flex items-center gap-2">
                        <img
                            src={swap.sender.image || avatarFallback(swap.sender.userName, swap.sender.id)}
                            alt={swap.sender.userName}
                            className="h-6 w-6 rounded-full object-cover"
                        />
                        <span className="text-[14px] text-[#0C0D0F]">{swap.sender.userName}</span>
                    </div>
                </td>
                <td className="h-[62px] border-b border-[#F3F4F6] px-4">
                    <div className="flex items-center gap-2">
                        <img
                            src={swap.receiver.image || avatarFallback(swap.receiver.userName, swap.receiver.id)}
                            alt={swap.receiver.userName}
                            className="h-6 w-6 rounded-full object-cover"
                        />
                        <span className="text-[14px] text-[#0C0D0F]">{swap.receiver.userName}</span>
                    </div>
                </td>
                <td className="h-[62px] border-b border-[#F3F4F6] px-4">
                    <span
                        className={`inline-flex h-[23px] items-center rounded-[8px] px-2 text-[14px] ${statusPillClassName[swap.status]}`}
                    >
                        <span className="mr-1 text-[8px] leading-none">●</span>
                        {toStatusLabel(swap.status)}
                    </span>
                </td>
                <td className="h-[62px] border-b border-[#F3F4F6] px-4 text-[14px] text-[#0C0D0F]">
                    {swap.requestType || '--'}
                </td>
                <td className="h-[62px] border-b border-[#F3F4F6] px-4 text-[14px] text-[#0C0D0F]">
                    {swap.requestedSkill?.name || '--'}
                </td>
                <td className="h-[62px] border-b border-[#F3F4F6] px-4 text-[14px] text-[#0C0D0F]">
                    {swap.offeredSkill?.name || '______________'}
                </td>
                <td className="h-[62px] border-b border-[#F3F4F6] px-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[14px] text-[#0C0D0F]">{formatDate(swap.dateTime)}</span>
                        <span className="text-[13px] text-[#666666]">{formatTime(swap.dateTime)}</span>
                    </div>
                </td>
            </tr>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <AdminSidebar
                mobileOpen={isMobileSidebarOpen}
                onMobileClose={() => setIsMobileSidebarOpen(false)}
            />

            <div className="md:ml-[236px]">
                <AdminHeader
                    onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
                    userName={userDisplayName}
                    userEmail={userDisplayEmail}
                    userRole={userRoleLabel}
                    userAvatar={userAvatarSrc}
                />

                <main className="space-y-4 px-4 py-4 md:px-2 md:py-4">
                    <section className="flex items-center gap-2">
                        <SwapRequestsTitleIcon className="h-6 w-6 text-[#3272A3]" />
                        <h1 className="text-[28px] font-bold leading-[34px] text-[#0C0D0F]">Swap Requests</h1>
                    </section>

                    <section className="grid gap-4 lg:grid-cols-3">
                        <SummaryCard
                            label="Requests accepted (this week)"
                            value={summary.accepted}
                            icon={<AcceptedIcon />}
                            iconContainerClassName="bg-[#F0FFF6]"
                        />
                        <SummaryCard
                            label="Requests rejected"
                            value={summary.rejected}
                            icon={<RejectedIcon />}
                            iconContainerClassName="bg-[#FFEAEA]"
                        />
                        <SummaryCard
                            label="Requests pended"
                            value={summary.pending}
                            icon={<PendingIcon />}
                            iconContainerClassName="bg-[#FFF8E7]"
                        />
                    </section>

                    <section className="space-y-0 overflow-hidden rounded-[10px] border border-[#F3F4F6] bg-white">
                        <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
                            <div className="relative w-full lg:max-w-[566px]">
                                <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-[#9CA3AF]" />
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(event) => setSearchInput(event.target.value)}
                                    placeholder="Search by name or email"
                                    className="h-12 w-full rounded-[10px] border border-[#E5E7EB] bg-white pl-12 pr-4 text-[16px] text-[#0C0D0F] outline-none placeholder:text-[#9CA3AF] focus:border-[#3272A3]"
                                />
                            </div>

                            <div className="flex w-full flex-wrap items-center justify-end gap-2 lg:max-w-[566px] lg:ml-auto">
                                <div className="relative" ref={dateMenuRef}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setDateMenuOpen((previous) => {
                                                const next = !previous
                                                if (next) {
                                                    setDraftStartDate(startDate)
                                                    setDraftEndDate(endDate)
                                                }
                                                return next
                                            })
                                        }
                                        className="inline-flex h-12 items-center gap-2 rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-[16px] text-[#1C1C1C]"
                                    >
                                        Date Range
                                        <CalendarDays className="h-5 w-5 text-[#0C0D0F]" />
                                    </button>

                                    {dateMenuOpen && (
                                        <div className="absolute right-0 top-14 z-30 w-[280px] rounded-[10px] border border-[#E5E7EB] bg-white p-3 shadow-[0px_0px_4.7px_0px_rgba(0,0,0,0.25)]">
                                            <div className="space-y-2">
                                                <label className="block text-xs text-[#666666]">
                                                    Start date
                                                    <input
                                                        type="date"
                                                        value={draftStartDate}
                                                        onChange={(event) => setDraftStartDate(event.target.value)}
                                                        className="mt-1 h-9 w-full rounded-[8px] border border-[#E5E7EB] px-2 text-sm text-[#0C0D0F] outline-none focus:border-[#3272A3]"
                                                    />
                                                </label>
                                                <label className="block text-xs text-[#666666]">
                                                    End date
                                                    <input
                                                        type="date"
                                                        value={draftEndDate}
                                                        min={draftStartDate || undefined}
                                                        onChange={(event) => setDraftEndDate(event.target.value)}
                                                        className="mt-1 h-9 w-full rounded-[8px] border border-[#E5E7EB] px-2 text-sm text-[#0C0D0F] outline-none focus:border-[#3272A3]"
                                                    />
                                                </label>
                                            </div>
                                            <div className="mt-3 flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={clearDateFilter}
                                                    className="flex-1 rounded-[8px] border border-[#E5E7EB] px-2 py-2 text-xs text-[#666666]"
                                                >
                                                    Clear
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={applyDateFilter}
                                                    className="flex-1 rounded-[8px] bg-[#3272A3] px-2 py-2 text-xs text-white"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="relative" ref={statusMenuRef}>
                                    <button
                                        type="button"
                                        onClick={() => setStatusMenuOpen((previous) => !previous)}
                                        className="inline-flex h-12 items-center gap-2 rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-[16px] text-[#1C1C1C]"
                                    >
                                        {statusLabel}
                                        <ChevronDown className="h-5 w-5 text-[#1C1C1C]" />
                                    </button>

                                    {statusMenuOpen && (
                                        <div className="absolute right-0 top-14 z-30 w-[164px] rounded-[10px] border border-[#E5E7EB] bg-white p-1 shadow-[0px_0px_4.7px_0px_rgba(0,0,0,0.25)]">
                                            {statusOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => onStatusChange(option.value)}
                                                    className={`flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left text-sm ${
                                                        status === option.value
                                                            ? 'bg-[#F7FAFF] text-[#3272A3]'
                                                            : 'text-[#0C0D0F] hover:bg-[#F9FAFB]'
                                                    }`}
                                                >
                                                    {option.label}
                                                    {status === option.value ? (
                                                        <Check className="h-3.5 w-3.5" />
                                                    ) : null}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="relative" ref={sortMenuRef}>
                                    <button
                                        type="button"
                                        onClick={() => setSortMenuOpen((previous) => !previous)}
                                        className="inline-flex h-12 items-center gap-2 rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-[16px] text-[#1C1C1C]"
                                    >
                                        {sortLabel}
                                        <SortOrderIcon sort={sort} />
                                    </button>

                                    {sortMenuOpen && (
                                        <div className="absolute right-0 top-14 z-30 w-[124px] rounded-[10px] border border-[#E5E7EB] bg-white p-1 shadow-[0px_0px_4.7px_0px_rgba(0,0,0,0.25)]">
                                            {sortOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => onSortChange(option.value)}
                                                    className={`flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left text-sm ${
                                                        sort === option.value
                                                            ? 'bg-[#F7FAFF] text-[#3272A3]'
                                                            : 'text-[#0C0D0F] hover:bg-[#F9FAFB]'
                                                    }`}
                                                >
                                                    {option.label}
                                                    {sort === option.value ? (
                                                        <Check className="h-3.5 w-3.5" />
                                                    ) : null}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1140px] border-separate border-spacing-0">
                                <thead>
                                    <tr className="bg-[#F9FAFB]">
                                        <th className="h-[62px] w-[56px] border-b border-[#F3F4F6] px-4 text-left">
                                            <SelectionCheckbox
                                                checked={isAllRowsChecked}
                                                onChange={toggleAllRows}
                                                ariaLabel="Select all swaps"
                                            />
                                        </th>
                                        <th className="h-[62px] w-[154px] border-b border-[#F3F4F6] px-4 text-left text-[16px] font-semibold text-[#666666]">
                                            Sender
                                        </th>
                                        <th className="h-[62px] w-[154px] border-b border-[#F3F4F6] px-4 text-left text-[16px] font-semibold text-[#666666]">
                                            Receiver
                                        </th>
                                        <th className="h-[62px] w-[162px] border-b border-[#F3F4F6] px-4 text-left text-[16px] font-semibold text-[#666666]">
                                            Status
                                        </th>
                                        <th className="h-[62px] w-[162px] border-b border-[#F3F4F6] px-4 text-left text-[16px] font-semibold text-[#666666]">
                                            Request Type
                                        </th>
                                        <th className="h-[62px] w-[162px] border-b border-[#F3F4F6] px-4 text-left text-[16px] font-semibold text-[#666666]">
                                            Requested Skill
                                        </th>
                                        <th className="h-[62px] w-[162px] border-b border-[#F3F4F6] px-4 text-left text-[16px] font-semibold text-[#666666]">
                                            Offered Skill
                                        </th>
                                        <th className="h-[62px] w-[126px] border-b border-[#F3F4F6] px-4 text-left text-[16px] font-semibold text-[#666666]">
                                            Date & Time
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {swapsQuery.isLoading && (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="h-[88px] border-b border-[#F3F4F6] px-4 text-center text-sm text-[#666666]"
                                            >
                                                Loading swap requests...
                                            </td>
                                        </tr>
                                    )}

                                    {swapsQuery.isError && !swapsQuery.isLoading && (
                                        <tr>
                                            <td colSpan={8} className="border-b border-[#F3F4F6] px-4 py-4">
                                                <div className="rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] p-3">
                                                    <p className="text-sm text-[#B91C1C]">
                                                        Failed to load swap requests.
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() => swapsQuery.refetch()}
                                                        className="mt-2 rounded-md bg-[#B91C1C] px-3 py-1.5 text-xs text-white"
                                                    >
                                                        Retry
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {!swapsQuery.isLoading &&
                                        !swapsQuery.isError &&
                                        filteredRows.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={8}
                                                    className="h-[88px] border-b border-[#F3F4F6] px-4 text-center text-sm text-[#666666]"
                                                >
                                                    No swap requests found.
                                                </td>
                                            </tr>
                                        )}

                                    {!swapsQuery.isLoading &&
                                        !swapsQuery.isError &&
                                        filteredRows.map((swap) => renderRow(swap))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center">
                            <div className="text-[16px] text-[#3272A3]">
                                Showing {shownCount} of {totalRows}
                            </div>

                            <div className="flex items-center gap-2 sm:ml-auto">
                                <button
                                    type="button"
                                    onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                                    disabled={!pagination?.hasPrevPage && currentPage <= 1}
                                    className="flex h-8 w-8 items-center justify-center rounded-[30px] border border-[#E5E7EB] bg-white text-[#0C0D0F] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>

                                {pageNumbers.map((pageNumber) => {
                                    const active = pageNumber === currentPage
                                    return (
                                        <button
                                            key={pageNumber}
                                            type="button"
                                            onClick={() => setPage(pageNumber)}
                                            className={`flex h-8 w-8 items-center justify-center rounded-[30px] border border-[#E5E7EB] text-sm ${
                                                active ? 'bg-[#F3F4F6] text-[#0C0D0F]' : 'bg-white text-[#0C0D0F]'
                                            }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    )
                                })}

                                <button
                                    type="button"
                                    onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
                                    disabled={!pagination?.hasNextPage && currentPage >= totalPages}
                                    className="flex h-8 w-8 items-center justify-center rounded-[30px] border border-[#E5E7EB] bg-white text-[#0C0D0F] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </section>

                    {selectedSwapIds.length > 0 && (
                        <section className="md:px-14">
                            <div className="flex flex-col gap-3 rounded-[50px] border border-[#3272A3] bg-[#F7FAFF] p-4 lg:flex-row lg:items-center">
                                <div className="flex flex-1 items-center gap-2 text-[#3272A3]">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#3272A3]">
                                        <Check className="h-4 w-4 text-white" />
                                    </div>
                                    <p className="text-[16px]">{selectedSwapIds.length} Sessions selected</p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleExport}
                                    disabled={exportMutation.isPending}
                                    className="inline-flex h-10 items-center justify-center gap-1 self-end rounded-[30px] px-4 text-[14px] text-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-70 lg:self-auto"
                                    style={{
                                        backgroundImage:
                                            'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(62, 143, 204) 0%, rgb(62, 143, 204) 100%)',
                                    }}
                                >
                                    {exportMutation.isPending ? 'Exporting...' : 'Export'}
                                    {exportMutation.isPending ? (
                                        <X className="h-[18px] w-[18px]" />
                                    ) : (
                                        <Download className="h-[18px] w-[18px]" />
                                    )}
                                </button>
                            </div>

                            {exportError && <p className="mt-2 text-sm text-[#B91C1C]">{exportError}</p>}
                        </section>
                    )}
                </main>
            </div>
        </div>
    )
}

export default AdminSwapRequests
