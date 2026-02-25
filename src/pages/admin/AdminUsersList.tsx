import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import {
    Check,
    ChevronDown,
    ChevronRight,
    Menu,
    MoreVertical,
    Search,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Avatar from '@/components/Avatar/Avatar'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { authService } from '@/api/services/auth.service'
import { userService } from '@/api/services/user.service'
import { useAdminUsers } from '@/hooks/useAdminUsers'
import { useAdminUserImages } from '@/hooks/useAdminUserImages'
import type {
    AdminUserStatus,
    AdminUsersSort,
    AdminUsersStatusFilter,
} from '@/types/adminUsers.types'
import type { UserAuthDto } from '@/types/api.types'

const DEFAULT_AVATAR_URL = 'https://api.dicebear.com/7.x/notionists/svg?seed=currentuser'
const PAGE_LIMIT = 12

const statusOptions: { label: string; value: AdminUsersStatusFilter }[] = [
    { label: 'All Status', value: 'ALL' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Suspended', value: 'SUSPENDED' },
    { label: 'Banned', value: 'BANNED' },
]

const sortOptions: { label: string; value: AdminUsersSort }[] = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
]

const statusPillClassName: Record<AdminUserStatus, string> = {
    ACTIVE: 'bg-[#D2F7DF] text-[#16A34A]',
    SUSPENDED: 'bg-[#FEF3C7] text-[#F59E0B]',
    BANNED: 'bg-[#FECACA] text-[#DC2626]',
}

const badgeColors = ['#16A34A', '#FFA412', '#3272A3']

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
        const joinedMessage = message.filter((entry) => typeof entry === 'string').join(', ')
        if (joinedMessage.length > 0) return joinedMessage
    }

    return fallback
}

const displayStatus = (status: AdminUserStatus): string => {
    if (status === 'SUSPENDED') return 'Suspended'
    if (status === 'BANNED') return 'Banned'
    return 'Active'
}

const pageCount = (totalPages: number): number => Math.max(1, totalPages)

const pageRange = (start: number, end: number): number[] => {
    const pages: number[] = []
    for (let index = start; index <= end; index += 1) {
        pages.push(index)
    }
    return pages
}

const idSuffix = (id: string): string => {
    if (!id) return '--'
    return id.slice(-4)
}

const renderBadges = (badges: unknown[]) => {
    if (!Array.isArray(badges) || badges.length === 0) return <span className="text-[#666666]">--</span>

    const visibleCount = Math.min(2, badges.length)
    const extraCount = badges.length - visibleCount

    return (
        <div className="flex items-center pr-2">
            {Array.from({ length: visibleCount }).map((_, index) => (
                <div
                    key={`badge-${index + 1}`}
                    className="-mr-2 h-6 w-6 rounded-full border border-white"
                    style={{ backgroundColor: badgeColors[index] }}
                />
            ))}
            <div
                className={`-mr-2 flex h-6 w-6 items-center justify-center rounded-full border border-white text-[11px] ${
                    extraCount > 0 ? 'bg-[#3272A3] text-white' : ''
                }`}
                style={{
                    backgroundColor: extraCount > 0 ? '#3272A3' : badgeColors[2],
                }}
            >
                {extraCount > 0 ? `+${extraCount}` : ''}
            </div>
        </div>
    )
}

const SelectedUsersCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
        className={className}
        aria-hidden="true"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.307 0C12.498 0 14.219 5.8651e-06 15.562 0.181006C16.939 0.366006 18.031 0.753011 18.889 1.61101C19.747 2.46901 20.134 3.56099 20.319 4.93799C20.5 6.28099 20.5 8.00199 20.5 10.193V10.307C20.5 12.498 20.5 14.219 20.319 15.562C20.134 16.939 19.747 18.031 18.889 18.889C18.031 19.747 16.939 20.134 15.562 20.319C14.219 20.5 12.498 20.5 10.307 20.5H10.193C8.00199 20.5 6.28099 20.5 4.93799 20.319C3.56099 20.134 2.46901 19.747 1.61101 18.889C0.753011 18.031 0.366006 16.939 0.181006 15.562C5.8651e-06 14.219 0 12.498 0 10.307V10.193C0 8.00199 5.8651e-06 6.28099 0.181006 4.93799C0.366006 3.56099 0.753011 2.46901 1.61101 1.61101C2.46901 0.753011 3.56099 0.366006 4.93799 0.181006C6.28099 5.8651e-06 8.00199 0 10.193 0H10.307ZM14.926 6.51299C15.333 6.88599 15.36 7.519 14.987 7.926L9.48701 13.926C9.30301 14.127 9.044 14.244 8.772 14.25C8.499 14.256 8.23599 14.15 8.04299 13.957L5.54299 11.457C5.15199 11.067 5.15199 10.433 5.54299 10.043C5.93299 9.65199 6.56701 9.65199 6.95701 10.043L8.71899 11.804L13.513 6.574C13.886 6.167 14.519 6.13999 14.926 6.51299Z"
            fill="#3E8FCC"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.307 0C12.498 0 14.219 5.8651e-06 15.562 0.181006C16.939 0.366006 18.031 0.753011 18.889 1.61101C19.747 2.46901 20.134 3.56099 20.319 4.93799C20.5 6.28099 20.5 8.00199 20.5 10.193V10.307C20.5 12.498 20.5 14.219 20.319 15.562C20.134 16.939 19.747 18.031 18.889 18.889C18.031 19.747 16.939 20.134 15.562 20.319C14.219 20.5 12.498 20.5 10.307 20.5H10.193C8.00199 20.5 6.28099 20.5 4.93799 20.319C3.56099 20.134 2.46901 19.747 1.61101 18.889C0.753011 18.031 0.366006 16.939 0.181006 15.562C5.8651e-06 14.219 0 12.498 0 10.307V10.193C0 8.00199 5.8651e-06 6.28099 0.181006 4.93799C0.366006 3.56099 0.753011 2.46901 1.61101 1.61101C2.46901 0.753011 3.56099 0.366006 4.93799 0.181006C6.28099 5.8651e-06 8.00199 0 10.193 0H10.307ZM14.926 6.51299C15.333 6.88599 15.36 7.519 14.987 7.926L9.48701 13.926C9.30301 14.127 9.044 14.244 8.772 14.25C8.499 14.256 8.23599 14.15 8.04299 13.957L5.54299 11.457C5.15199 11.067 5.15199 10.433 5.54299 10.043C5.93299 9.65199 6.56701 9.65199 6.95701 10.043L8.71899 11.804L13.513 6.574C13.886 6.167 14.519 6.13999 14.926 6.51299Z"
            fill="black"
            fillOpacity="0.2"
        />
    </svg>
)

const WarnIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.0002 2.25C12.2725 2.25009 12.5233 2.39775 12.6555 2.63574L22.6555 20.6357C22.7845 20.8679 22.7812 21.1509 22.6467 21.3799C22.512 21.6088 22.2659 21.7499 22.0002 21.75H2.00025C1.73451 21.75 1.48853 21.6089 1.35376 21.3799C1.21919 21.1509 1.21508 20.8679 1.344 20.6357L11.344 2.63574C11.4763 2.39764 11.7279 2.25 12.0002 2.25ZM11.2502 16.5V18H12.7502V16.5H11.2502ZM11.2502 10V15H12.7502V10H11.2502Z"
            fill="#DC2626"
        />
    </svg>
)

const SuspendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM10.5 10C10.5 9.17157 11.1716 8.5 12 8.5C12.8284 8.5 13.5 9.17157 13.5 10C13.5 10.8284 12.8284 11.5 12 11.5C11.4477 11.5 11 11.9477 11 12.5V14.5H13V13.3551C14.4457 12.9248 15.5 11.5855 15.5 10C15.5 8.067 13.933 6.5 12 6.5C10.067 6.5 8.5 8.067 8.5 10H10.5ZM11 16V17.5H13V16H11Z"
            fill="#FFA412"
        />
    </svg>
)

const ExportIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
    >
        <path
            d="M19 18.25C19.4142 18.25 19.75 18.5858 19.75 19C19.75 19.4142 19.4142 19.75 19 19.75H5C4.58579 19.75 4.25 19.4142 4.25 19C4.25 18.5858 4.58579 18.25 5 18.25H19ZM12 4.25C12.4142 4.25 12.75 4.58579 12.75 5V13.4619C12.7519 13.4596 12.7539 13.4574 12.7559 13.4551C12.9665 13.2064 13.1733 12.943 13.3662 12.6973C13.3811 12.6783 13.3964 12.6594 13.4111 12.6406C13.6032 12.3961 13.8049 12.1391 13.9619 11.9775C14.2505 11.6806 14.7254 11.6735 15.0225 11.9619C15.3194 12.2505 15.3265 12.7254 15.0381 13.0225C14.9494 13.1137 14.803 13.296 14.5898 13.5674C14.5745 13.5869 14.5588 13.6068 14.543 13.627C14.3529 13.8691 14.1301 14.1537 13.9004 14.4248C13.6544 14.7151 13.3788 15.0165 13.1035 15.251C12.9656 15.3684 12.8098 15.4847 12.6426 15.5742C12.4811 15.6606 12.2583 15.75 12 15.75C11.7417 15.75 11.5189 15.6606 11.3574 15.5742C11.1902 15.4847 11.0344 15.3684 10.8965 15.251C10.6212 15.0165 10.3456 14.7151 10.0996 14.4248C9.86988 14.1537 9.6471 13.8691 9.45703 13.627C9.44119 13.6068 9.42552 13.5869 9.41016 13.5674C9.19696 13.296 9.05062 13.1137 8.96191 13.0225C8.67349 12.7254 8.68061 12.2505 8.97754 11.9619C9.27458 11.6735 9.74948 11.6806 10.0381 11.9775C10.1951 12.1391 10.3968 12.3961 10.5889 12.6406C10.6036 12.6594 10.6189 12.6783 10.6338 12.6973C10.8267 12.943 11.0335 13.2064 11.2441 13.4551C11.2461 13.4574 11.2481 13.4596 11.25 13.4619V5C11.25 4.58579 11.5858 4.25 12 4.25Z"
            fill="#F9FAFB"
        />
    </svg>
)

const UsersListTitleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 16C13.5308 16 14.9649 16.3705 16.0498 17.0215C17.1148 17.6605 18 18.6823 18 20C18 20.5523 17.5523 21 17 21C16.4477 21 16 20.5523 16 20C16 19.6609 15.7658 19.183 15.0215 18.7363C14.2968 18.3015 13.2306 18 12 18C10.7694 18 9.70321 18.3015 8.97852 18.7363C8.23423 19.183 8 19.6609 8 20C8 20.5523 7.55228 21 7 21C6.44772 21 6 20.5523 6 20C6 18.6823 6.88515 17.6605 7.9502 17.0215C9.03514 16.3705 10.4692 16 12 16ZM5.74609 13.2822C6.28026 13.1422 6.82764 13.462 6.96777 13.9961C7.10781 14.5303 6.78802 15.0776 6.25391 15.2178C5.48656 15.4189 4.89098 15.7357 4.50684 16.0811C4.1256 16.4239 4.00012 16.7436 4 17C4 17.5523 3.55228 18 3 18C2.44772 18 2 17.5523 2 17C2.00013 16.0265 2.49194 15.2026 3.16895 14.5938C3.84328 13.9873 4.74774 13.544 5.74609 13.2822ZM17.0322 13.9961C17.1724 13.462 17.7197 13.1422 18.2539 13.2822C19.2523 13.544 20.1567 13.9873 20.8311 14.5938C21.5081 15.2026 21.9999 16.0265 22 17C22 17.5523 21.5523 18 21 18C20.4477 18 20 17.5523 20 17C19.9999 16.7436 19.8744 16.4239 19.4932 16.0811C19.109 15.7357 18.5134 15.4189 17.7461 15.2178C17.212 15.0776 16.8922 14.5303 17.0322 13.9961ZM12 7C14.2091 7 16 8.79086 16 11C16 13.2091 14.2091 15 12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7ZM12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9ZM8 4C9.0238 4 9.95999 4.38579 10.667 5.01855C11.0785 5.38686 11.1134 6.01914 10.7451 6.43066C10.3768 6.84219 9.74453 6.87712 9.33301 6.50879C8.97853 6.19159 8.5128 6 8 6C6.89543 6 6 6.89543 6 8C6 8.59224 6.25623 9.12357 6.66699 9.49121C7.07837 9.85956 7.11339 10.4918 6.74512 10.9033C6.37679 11.3147 5.74448 11.3497 5.33301 10.9814C4.51627 10.2504 4 9.18476 4 8C4 5.79086 5.79086 4 8 4ZM16 4C18.2091 4 20 5.79086 20 8C20 9.18476 19.4837 10.2504 18.667 10.9814C18.2555 11.3497 17.6232 11.3147 17.2549 10.9033C16.8866 10.4918 16.9216 9.85956 17.333 9.49121C17.7438 9.12357 18 8.59224 18 8C18 6.89543 17.1046 6 16 6C15.4872 6 15.0215 6.19159 14.667 6.50879C14.2555 6.87712 13.6232 6.84219 13.2549 6.43066C12.8866 6.01914 12.9215 5.38686 13.333 5.01855C14.04 4.38579 14.9762 4 16 4Z"
            fill="#3E8FCC"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 16C13.5308 16 14.9649 16.3705 16.0498 17.0215C17.1148 17.6605 18 18.6823 18 20C18 20.5523 17.5523 21 17 21C16.4477 21 16 20.5523 16 20C16 19.6609 15.7658 19.183 15.0215 18.7363C14.2968 18.3015 13.2306 18 12 18C10.7694 18 9.70321 18.3015 8.97852 18.7363C8.23423 19.183 8 19.6609 8 20C8 20.5523 7.55228 21 7 21C6.44772 21 6 20.5523 6 20C6 18.6823 6.88515 17.6605 7.9502 17.0215C9.03514 16.3705 10.4692 16 12 16ZM5.74609 13.2822C6.28026 13.1422 6.82764 13.462 6.96777 13.9961C7.10781 14.5303 6.78802 15.0776 6.25391 15.2178C5.48656 15.4189 4.89098 15.7357 4.50684 16.0811C4.1256 16.4239 4.00012 16.7436 4 17C4 17.5523 3.55228 18 3 18C2.44772 18 2 17.5523 2 17C2.00013 16.0265 2.49194 15.2026 3.16895 14.5938C3.84328 13.9873 4.74774 13.544 5.74609 13.2822ZM17.0322 13.9961C17.1724 13.462 17.7197 13.1422 18.2539 13.2822C19.2523 13.544 20.1567 13.9873 20.8311 14.5938C21.5081 15.2026 21.9999 16.0265 22 17C22 17.5523 21.5523 18 21 18C20.4477 18 20 17.5523 20 17C19.9999 16.7436 19.8744 16.4239 19.4932 16.0811C19.109 15.7357 18.5134 15.4189 17.7461 15.2178C17.212 15.0776 16.8922 14.5303 17.0322 13.9961ZM12 7C14.2091 7 16 8.79086 16 11C16 13.2091 14.2091 15 12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7ZM12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9ZM8 4C9.0238 4 9.95999 4.38579 10.667 5.01855C11.0785 5.38686 11.1134 6.01914 10.7451 6.43066C10.3768 6.84219 9.74453 6.87712 9.33301 6.50879C8.97853 6.19159 8.5128 6 8 6C6.89543 6 6 6.89543 6 8C6 8.59224 6.25623 9.12357 6.66699 9.49121C7.07837 9.85956 7.11339 10.4918 6.74512 10.9033C6.37679 11.3147 5.74448 11.3497 5.33301 10.9814C4.51627 10.2504 4 9.18476 4 8C4 5.79086 5.79086 4 8 4ZM16 4C18.2091 4 20 5.79086 20 8C20 9.18476 19.4837 10.2504 18.667 10.9814C18.2555 11.3497 17.6232 11.3147 17.2549 10.9033C16.8866 10.4918 16.9216 9.85956 17.333 9.49121C17.7438 9.12357 18 8.59224 18 8C18 6.89543 17.1046 6 16 6C15.4872 6 15.0215 6.19159 14.667 6.50879C14.2555 6.87712 13.6232 6.84219 13.2549 6.43066C12.8866 6.01914 12.9215 5.38686 13.333 5.01855C14.04 4.38579 14.9762 4 16 4Z"
            fill="black"
            fillOpacity="0.2"
        />
    </svg>
)

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
            className={`flex h-6 w-6 items-center justify-center rounded-[4px] border transition-colors ${
                checked ? 'border-[#3E8FCC] bg-[#3E8FCC]' : 'border-[#94A3B8] bg-white'
            }`}
        >
            {checked ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                        d="M3 7.2L5.6 9.8L11 4.5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ) : null}
        </span>
    </label>
)

export const AdminUsersList: React.FC = () => {
    const navigate = useNavigate()

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    const [profileMenuOpen, setProfileMenuOpen] = useState(false)
    const profileMenuRef = useRef<HTMLDivElement>(null)

    const [statusMenuOpen, setStatusMenuOpen] = useState(false)
    const [sortMenuOpen, setSortMenuOpen] = useState(false)
    const statusMenuRef = useRef<HTMLDivElement>(null)
    const sortMenuRef = useRef<HTMLDivElement>(null)

    const [searchInput, setSearchInput] = useState('')
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState<AdminUsersStatusFilter>('ALL')
    const [sort, setSort] = useState<AdminUsersSort>('newest')
    const [page, setPage] = useState(1)
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
    const tableScrollRef = useRef<HTMLDivElement>(null)
    const [isTableScrollable, setIsTableScrollable] = useState(false)
    const [canScrollTableRight, setCanScrollTableRight] = useState(false)

    const [currentUser, setCurrentUser] = useState<UserAuthDto | null>(() => getStoredUser())

    const usersQuery = useAdminUsers({
        page,
        limit: PAGE_LIMIT,
        search,
        status,
        sort,
    })

    const activeCountQuery = useAdminUsers({
        page: 1,
        limit: 1,
        search,
        status: 'ACTIVE',
        sort: 'newest',
    })

    const suspendedCountQuery = useAdminUsers({
        page: 1,
        limit: 1,
        search,
        status: 'SUSPENDED',
        sort: 'newest',
    })

    const bannedCountQuery = useAdminUsers({
        page: 1,
        limit: 1,
        search,
        status: 'BANNED',
        sort: 'newest',
    })

    const usersData = usersQuery.data
    const rows = usersData?.data ?? []
    const pagination = usersData?.pagination
    const totalPages = pageCount(pagination?.totalPages ?? 1)
    const totalUsers = pagination?.total ?? 0
    const currentPage = pagination?.page ?? page
    const currentLimit = pagination?.limit ?? PAGE_LIMIT
    const shownUsersCount =
        rows.length === 0
            ? 0
            : Math.min(totalUsers, (Math.max(1, currentPage) - 1) * currentLimit + rows.length)
    const missingImageUserIds = rows.filter((user) => !user.image).map((user) => user.id)
    const { imageByUserId } = useAdminUserImages(missingImageUserIds)

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setPage(1)
            setSearch(searchInput.trim())
        }, 300)

        return () => window.clearTimeout(timeoutId)
    }, [searchInput])

    useEffect(() => {
        if (!isMobileSidebarOpen) {
            document.body.classList.remove('overflow-hidden')
            return
        }

        document.body.classList.add('overflow-hidden')
        return () => document.body.classList.remove('overflow-hidden')
    }, [isMobileSidebarOpen])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node
            if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
                setProfileMenuOpen(false)
            }
            if (statusMenuRef.current && !statusMenuRef.current.contains(target)) {
                setStatusMenuOpen(false)
            }
            if (sortMenuRef.current && !sortMenuRef.current.contains(target)) {
                setSortMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        let mounted = true

        const loadCurrentUser = async () => {
            const storedUser = getStoredUser()
            if (storedUser && mounted) setCurrentUser(storedUser)

            try {
                const response = await userService.getCurrentProfile()
                if (!mounted || !response.success) return

                const updatedUser: UserAuthDto = {
                    id: response.data.id,
                    userName: response.data.userName || storedUser?.userName || null,
                    email: response.data.email || storedUser?.email || '',
                    role: storedUser?.role || 'ADMIN',
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

    useEffect(() => {
        const scrollContainer = tableScrollRef.current
        if (!scrollContainer) return

        const updateTableScrollState = () => {
            const hasOverflow = scrollContainer.scrollWidth > scrollContainer.clientWidth + 1
            const hasRightOverflow =
                scrollContainer.scrollLeft + scrollContainer.clientWidth <
                scrollContainer.scrollWidth - 1

            setIsTableScrollable(hasOverflow)
            setCanScrollTableRight(hasRightOverflow)
        }

        updateTableScrollState()
        scrollContainer.addEventListener('scroll', updateTableScrollState, { passive: true })
        window.addEventListener('resize', updateTableScrollState)

        return () => {
            scrollContainer.removeEventListener('scroll', updateTableScrollState)
            window.removeEventListener('resize', updateTableScrollState)
        }
    }, [rows.length, totalUsers, totalPages])

    const pageNumbers = useMemo(() => {
        if (totalPages <= 3) return pageRange(1, totalPages)
        if (page <= 2) return [1, 2, 3]
        if (page >= totalPages - 1) return [totalPages - 2, totalPages - 1, totalPages]
        return [page - 1, page, page + 1]
    }, [page, totalPages])

    const selectedStatusLabel =
        statusOptions.find((option) => option.value === status)?.label ?? 'All Status'
    const selectedSortLabel =
        sortOptions.find((option) => option.value === sort)?.label ?? 'Newest'

    const activeCount = activeCountQuery.data?.pagination.total ?? 0
    const suspendedCount = suspendedCountQuery.data?.pagination.total ?? 0
    const bannedCount = bannedCountQuery.data?.pagination.total ?? 0

    const userDisplayName =
        currentUser?.userName?.trim() || currentUser?.email?.split('@')[0] || 'User Name'
    const userAvatar = currentUser?.image?.trim() || DEFAULT_AVATAR_URL
    const userRole = currentUser?.role ? currentUser.role.toLowerCase() : 'admin'

    const isAllRowsChecked = rows.length > 0 && rows.every((row) => selectedUserIds.includes(row.id))

    const toggleAllRows = () => {
        if (isAllRowsChecked) {
            setSelectedUserIds([])
            return
        }
        setSelectedUserIds(rows.map((row) => row.id))
    }

    const toggleSingleUser = (userId: string) => {
        setSelectedUserIds((previousIds) =>
            previousIds.includes(userId)
                ? previousIds.filter((id) => id !== userId)
                : [...previousIds, userId]
        )
    }

    const selectStatus = (value: AdminUsersStatusFilter) => {
        setStatus(value)
        setPage(1)
        setStatusMenuOpen(false)
    }

    const selectSort = (value: AdminUsersSort) => {
        setSort(value)
        setPage(1)
        setSortMenuOpen(false)
    }

    const logout = async () => {
        await authService.logout()
        navigate('/auth/login')
    }

    const usersErrorMessage = usersQuery.error
        ? getErrorMessage(usersQuery.error, 'Failed to load users list.')
        : null

    return (
        <div className="min-h-screen bg-white">
            <AdminSidebar
                mobileOpen={isMobileSidebarOpen}
                onMobileClose={() => setIsMobileSidebarOpen(false)}
            />

            <div className="md:ml-[236px]">
                <header className="flex h-[80px] items-center justify-between border-b border-[#F3F4F6] px-4 md:justify-end md:px-6">
                    <div className="flex items-center gap-3 md:hidden">
                        <button
                            type="button"
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="rounded-lg p-2 text-[#1C1C1C] transition-colors hover:bg-[#F3F4F6]"
                            aria-label="Open menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="text-lg font-poppins font-bold">
                            <span className="text-[#F59E0B]">Skill</span>
                            <span className="text-[#3E8FCC]">Swap</span>
                            <span className="text-[#F59E0B]">.</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        <button type="button" className="rounded-full p-2 text-[#1C1C1C] hover:bg-[#F3F4F6]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12 17.8476C17.6392 17.8476 20.2481 17.1242 20.5 14.2205C20.5 11.3188 18.6812 11.5054 18.6812 7.94511C18.6812 5.16414 16.0452 2 12 2C7.95477 2 5.31885 5.16414 5.31885 7.94511C5.31885 11.5054 3.5 11.3188 3.5 14.2205C3.75295 17.1352 6.36177 17.8476 12 17.8476Z"
                                    stroke="#0C0D0F"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M14.3887 20.8572C13.0246 22.372 10.8966 22.3899 9.51941 20.8572"
                                    stroke="#0C0D0F"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>

                        <div className="relative" ref={profileMenuRef}>
                            <button
                                type="button"
                                onClick={() => setProfileMenuOpen((previous) => !previous)}
                                className="flex items-center gap-2 rounded-xl border-none bg-transparent p-0"
                            >
                                <Avatar src={userAvatar} name={userDisplayName} size={40} />
                                <div className="hidden text-left sm:block">
                                    <p className="text-sm text-[#0C0D0F]">{userDisplayName}</p>
                                    <p className="text-xs capitalize text-[#666666]">{userRole}</p>
                                </div>
                                <ChevronDown
                                    className={`h-4 w-4 text-[#666666] transition-transform ${
                                        profileMenuOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            {profileMenuOpen && (
                                <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-xl border border-[#E8E8E8] bg-white py-1 shadow-lg">
                                    <button
                                        type="button"
                                        onClick={logout}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="space-y-4 px-4 py-4 md:px-6 md:py-6">
                    <div className="flex items-center gap-2">
                        <UsersListTitleIcon className="h-6 w-6 shrink-0" />
                        <h1 className="text-[28px] font-bold text-[#0C0D0F]">Users List</h1>
                    </div>

                    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
                        <article className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                            <p className="text-base text-[#3272A3]">Total Users</p>
                            <p className="mt-1 text-[28px] font-semibold text-[#0C0D0F]">{totalUsers}</p>
                            <p className="text-xs text-[#0C0D0F]">
                                <span className="mr-1 text-[#16A34A]">+10%</span>
                                last month
                            </p>
                        </article>
                        <article className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                            <p className="text-base text-[#3272A3]">Active Users</p>
                            <p className="mt-1 text-[28px] font-semibold text-[#0C0D0F]">{activeCount}</p>
                            <p className="text-xs text-[#0C0D0F]">
                                <span className="mr-1 text-[#16A34A]">+8%</span>
                                last month
                            </p>
                        </article>
                        <article className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                            <p className="text-base text-[#3272A3]">Suspended Users</p>
                            <p className="mt-1 text-[28px] font-semibold text-[#0C0D0F]">{suspendedCount}</p>
                            <p className="text-xs text-[#0C0D0F]">
                                <span className="mr-1 text-[#16A34A]">+10%</span>
                                last month
                            </p>
                        </article>
                        <article className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                            <p className="text-base text-[#3272A3]">Banned Users</p>
                            <p className="mt-1 text-[28px] font-semibold text-[#0C0D0F]">{bannedCount}</p>
                            <p className="text-xs text-[#0C0D0F]">
                                <span className="mr-1 text-[#DC2626]">-10%</span>
                                last month
                            </p>
                        </article>
                    </section>

                    <section className="space-y-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9CA3AF]" />
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(event) => setSearchInput(event.target.value)}
                                    placeholder="Search by name or email"
                                    className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-white pl-12 pr-4 text-base text-[#0C0D0F] placeholder:text-[#9CA3AF] outline-none transition-colors focus:border-[#3272A3]"
                                />
                            </div>

                            <div className="flex gap-2">
                                <div className="relative" ref={statusMenuRef}>
                                    <button
                                        type="button"
                                        onClick={() => setStatusMenuOpen((previous) => !previous)}
                                        className="flex h-12 min-w-[128px] items-center justify-between rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#0C0D0F]"
                                    >
                                        {selectedStatusLabel}
                                        <ChevronDown
                                            className={`h-4 w-4 text-[#0C0D0F] transition-transform ${
                                                statusMenuOpen ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </button>

                                    {statusMenuOpen && (
                                        <div className="absolute right-0 top-[52px] z-20 w-[170px] rounded-xl border border-[#E5E7EB] bg-white py-1 shadow-[0px_6px_20px_rgba(12,13,15,0.1)]">
                                            {statusOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => selectStatus(option.value)}
                                                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${
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
                                        className="flex h-12 min-w-[110px] items-center justify-between rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#0C0D0F]"
                                    >
                                        {selectedSortLabel}
                                        <ChevronDown
                                            className={`h-4 w-4 text-[#0C0D0F] transition-transform ${
                                                sortMenuOpen ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </button>

                                    {sortMenuOpen && (
                                        <div className="absolute right-0 top-[52px] z-20 w-[120px] rounded-xl border border-[#E5E7EB] bg-white py-1 shadow-[0px_6px_20px_rgba(12,13,15,0.1)]">
                                            {sortOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => selectSort(option.value)}
                                                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${
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

                        <div className="relative overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
                            <div ref={tableScrollRef} className="overflow-x-auto">
                                <table className="min-w-[900px] w-full border-separate border-spacing-0">
                                    <thead>
                                        <tr className="bg-[#F9FAFB]">
                                            <th className="h-[62px] w-[46px] border-b border-[#F3F4F6] px-4 text-left">
                                                <SelectionCheckbox
                                                    checked={isAllRowsChecked}
                                                    onChange={toggleAllRows}
                                                    ariaLabel="Select all users in current page"
                                                />
                                            </th>
                                            <th className="h-[62px] border-b border-[#F3F4F6] px-4 text-left text-[18px] font-semibold text-[#666666]">
                                                User
                                            </th>
                                            <th className="h-[62px] border-b border-[#F3F4F6] px-4 text-left text-[18px] font-semibold text-[#666666]">
                                                Email
                                            </th>
                                            <th className="h-[62px] border-b border-[#F3F4F6] px-4 text-left text-[18px] font-semibold text-[#666666]">
                                                Status
                                            </th>
                                            <th className="h-[62px] border-b border-[#F3F4F6] px-4 text-left text-[18px] font-semibold text-[#666666]">
                                                Points
                                            </th>
                                            <th className="h-[62px] border-b border-[#F3F4F6] px-4 text-left text-[18px] font-semibold text-[#666666]">
                                                Badges
                                            </th>
                                            <th className="h-[62px] border-b border-[#F3F4F6] px-4 text-right text-[18px] font-semibold text-[#666666]">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usersQuery.isLoading && !usersData && (
                                            <tr>
                                                <td
                                                    colSpan={7}
                                                    className="h-[120px] border-b border-[#F3F4F6] px-4 text-center text-sm text-[#666666]"
                                                >
                                                    Loading users list...
                                                </td>
                                            </tr>
                                        )}

                                        {usersErrorMessage && !usersQuery.isLoading && !rows.length && (
                                            <tr>
                                                <td colSpan={7} className="border-b border-[#F3F4F6] px-4 py-6">
                                                    <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-4 text-center">
                                                        <p className="text-sm text-[#B91C1C]">{usersErrorMessage}</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => usersQuery.refetch()}
                                                            className="mt-3 rounded-md bg-[#B91C1C] px-3 py-1.5 text-sm text-white"
                                                        >
                                                            Retry
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}

                                        {!usersQuery.isLoading && !usersErrorMessage && rows.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={7}
                                                    className="h-[120px] border-b border-[#F3F4F6] px-4 text-center text-sm text-[#666666]"
                                                >
                                                    No users found.
                                                </td>
                                            </tr>
                                        )}

                                        {rows.map((user) => {
                                            const checked = selectedUserIds.includes(user.id)
                                            return (
                                                <tr key={user.id} className="bg-white">
                                                    <td className="h-[62px] border-b border-[#F3F4F6] px-4">
                                                        <SelectionCheckbox
                                                            checked={checked}
                                                            onChange={() => toggleSingleUser(user.id)}
                                                            ariaLabel={`Select ${user.name}`}
                                                        />
                                                    </td>
                                                    <td className="h-[62px] border-b border-[#F3F4F6] px-4">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar
                                                                src={user.image || imageByUserId[user.id]}
                                                                name={user.name || 'Unknown User'}
                                                                size={40}
                                                            />
                                                            <div className="min-w-0">
                                                                <p className="truncate text-sm text-[#0C0D0F]">
                                                                    {user.name || 'Unknown User'}
                                                                </p>
                                                                <p className="text-xs text-[#666666]">
                                                                    #{idSuffix(user.id)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="h-[62px] border-b border-[#F3F4F6] px-4 text-sm text-[#0C0D0F]">
                                                        {user.email || '--'}
                                                    </td>
                                                    <td className="h-[62px] border-b border-[#F3F4F6] px-4">
                                                        <span
                                                            className={`inline-flex h-6 items-center rounded-[10px] px-2 text-xs ${statusPillClassName[user.status]}`}
                                                        >
                                                            <span className="mr-1 text-[9px]">●</span>
                                                            {displayStatus(user.status)}
                                                        </span>
                                                    </td>
                                                    <td className="h-[62px] border-b border-[#F3F4F6] px-4 text-sm text-[#0C0D0F]">
                                                        {user.points.toLocaleString('en-US')}
                                                    </td>
                                                    <td className="h-[62px] border-b border-[#F3F4F6] px-4 text-sm text-[#0C0D0F]">
                                                        {renderBadges(user.badges)}
                                                    </td>
                                                    <td className="h-[62px] border-b border-[#F3F4F6] px-4 text-right">
                                                        <button
                                                            type="button"
                                                            className="rounded-md p-1 text-[#0C0D0F] hover:bg-[#F3F4F6]"
                                                            aria-label={`Actions for ${user.name}`}
                                                        >
                                                            <MoreVertical className="ml-auto h-5 w-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {isTableScrollable && canScrollTableRight && (
                                <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent md:hidden" />
                            )}

                            {isTableScrollable && (
                                <p className="px-4 pt-2 text-xs text-[#3272A3] md:hidden">
                                    Swipe horizontally to view the remaining columns
                                </p>
                            )}

                            <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center">
                                <div className="text-base text-[#3272A3]">
                                    Showing {shownUsersCount} of {totalUsers}
                                </div>
                                <div className="flex items-center gap-2 sm:ml-auto">
                                    <button
                                        type="button"
                                        onClick={() => setPage((previousPage) => Math.max(1, previousPage - 1))}
                                        disabled={currentPage <= 1}
                                        className="flex h-8 w-8 items-center justify-center rounded-[30px] border border-[#E5E7EB] bg-white text-[#0C0D0F] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <ChevronRight className="h-4 w-4 rotate-180" />
                                    </button>
                                    {pageNumbers.map((pageNumber) => {
                                        const active = pageNumber === page
                                        return (
                                            <button
                                                key={pageNumber}
                                                type="button"
                                                onClick={() => setPage(pageNumber)}
                                                className={`flex h-8 w-8 items-center justify-center rounded-[30px] border border-[#E5E7EB] text-sm ${
                                                    active
                                                        ? 'bg-[rgba(62,143,204,0.2)] text-[#0C0D0F]'
                                                        : 'bg-white text-[#0C0D0F]'
                                                }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        )
                                    })}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPage((previousPage) => Math.min(previousPage + 1, totalPages))
                                        }
                                        disabled={currentPage >= totalPages}
                                        className="flex h-8 w-8 items-center justify-center rounded-[30px] border border-[#E5E7EB] bg-white text-[#0C0D0F] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {usersQuery.isFetching && !usersQuery.isLoading && (
                            <p className="text-xs text-[#666666]">Updating users list...</p>
                        )}
                    </section>

                    {selectedUserIds.length > 0 && (
                        <section className="rounded-[50px] border border-[#3272A3] bg-[#F7FAFF] p-4">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                                <div className="flex flex-1 items-center gap-2 text-[#3272A3]">
                                    <SelectedUsersCheckIcon className="h-[21px] w-[21px] shrink-0" />
                                    <p className="text-base">{selectedUserIds.length} user selected</p>
                                </div>

                                <div className="flex flex-wrap items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        className="flex h-10 items-center gap-1 rounded-[30px] border border-[#DC2626] bg-white px-4 text-sm text-[#DC2626]"
                                    >
                                        Warn
                                        <WarnIcon className="h-6 w-6" />
                                    </button>
                                    <button
                                        type="button"
                                        className="flex h-10 items-center gap-1 rounded-[30px] border border-[#FFA412] bg-white px-4 text-sm text-[#FFA412]"
                                    >
                                        Suspend
                                        <SuspendIcon className="h-6 w-6" />
                                    </button>
                                    <button
                                        type="button"
                                        className="flex h-10 items-center gap-1 rounded-[30px] px-4 text-sm text-[#F9FAFB]"
                                        style={{
                                            backgroundImage:
                                                'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(62, 143, 204) 0%, rgb(62, 143, 204) 100%)',
                                        }}
                                    >
                                        Export
                                        <ExportIcon className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    )
}

export default AdminUsersList
