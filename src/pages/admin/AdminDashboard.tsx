import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { ArrowLeftRight, ChevronDown, ClipboardCheck, Menu, TriangleAlert, Users } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import Avatar from '@/components/Avatar/Avatar'
import { authService } from '@/api/services/auth.service'
import { userService } from '@/api/services/user.service'
import type { UserAuthDto } from '@/types/api.types'
import {
    adminService,
    type AdminDashboardData,
    type AdminDashboardPeriod,
    type CompletedSessionChartPoint,
    type MostActiveUserItem,
    type RequestsVsSessionsItem,
    type TopSkillItem,
} from '@/api/services/admin.service'
import {
    CompletedSessionsChart,
    MostActiveUsersList,
    PeriodHeader,
    RequestsVsSessionsChart,
    SummaryCard,
    TopSkillsList,
    UserOverviewList,
    type UserOverviewRow,
} from '@/components/admin-dashboard'

const DEFAULT_DASHBOARD_DATA: AdminDashboardData = {
    summary: {
        completedSessionsThisWeek: 0,
        activeUsers: 0,
        totalSwapThisWeek: 0,
        weeklyReports: 0,
    },
    completedSessionsChart: [],
    topSkills: [],
    mostActiveUsers: [],
    requestsVsSessions: [],
    userOverview: {
        newUsers: 0,
        newUsersPercentage: 0,
        usersRatedAbove3: 0,
        usersRatedAbove3Percentage: 0,
        usersRatedBelow3: 0,
        usersRatedBelow3Percentage: 0,
        usersWithMultipleCancellations: 0,
        usersWithMultipleCancellationsPercentage: 0,
        flaggedUsersThisMonth: 0,
        flaggedUsersThisMonthPercentage: 0,
    },
    period: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    },
}

const DEFAULT_AVATAR_URL = 'https://api.dicebear.com/7.x/notionists/svg?seed=currentuser'

const getStoredUser = (): UserAuthDto | null => {
    try {
        const rawUser = localStorage.getItem('user')
        if (!rawUser) return null
        return JSON.parse(rawUser) as UserAuthDto
    } catch {
        return null
    }
}

const toNumber = (value: unknown, fallback = 0): number => {
    const numericValue = Number(value)
    return Number.isFinite(numericValue) ? numericValue : fallback
}

const clampPercentage = (value: number): number => {
    if (value < 0) return 0
    if (value > 100) return 100
    return value
}

const getCurrentPeriod = (): AdminDashboardPeriod => ({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
})

const shiftPeriod = (period: AdminDashboardPeriod, deltaMonths: number): AdminDashboardPeriod => {
    const nextDate = new Date(period.year, period.month - 1 + deltaMonths, 1)
    return {
        month: nextDate.getMonth() + 1,
        year: nextDate.getFullYear(),
    }
}

const formatPeriodLabel = (period: AdminDashboardPeriod): string =>
    new Date(period.year, period.month - 1, 1).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    })

const normalizeDashboardData = (
    rawData: Partial<AdminDashboardData> | undefined
): AdminDashboardData => {
    if (!rawData) return DEFAULT_DASHBOARD_DATA

    const summary = rawData.summary ?? DEFAULT_DASHBOARD_DATA.summary
    const userOverview = rawData.userOverview ?? DEFAULT_DASHBOARD_DATA.userOverview
    const period = rawData.period ?? DEFAULT_DASHBOARD_DATA.period

    const completedSessionsChart = Array.isArray(rawData.completedSessionsChart)
        ? rawData.completedSessionsChart
            .map((item) => ({
                day: toNumber((item as CompletedSessionChartPoint).day),
                count: toNumber((item as CompletedSessionChartPoint).count),
            }))
            .filter((item) => item.day > 0)
            .sort((a, b) => a.day - b.day)
        : []

    const topSkills = Array.isArray(rawData.topSkills)
        ? rawData.topSkills.map((item) => ({
            skillName: (item as TopSkillItem).skillName || 'Unknown',
            swaps: toNumber((item as TopSkillItem).swaps),
            percentage: clampPercentage(toNumber((item as TopSkillItem).percentage)),
        }))
        : []

    const mostActiveUsers = Array.isArray(rawData.mostActiveUsers)
        ? rawData.mostActiveUsers.map((item) => ({
            userName: (item as MostActiveUserItem).userName || 'Unknown User',
            image: (item as MostActiveUserItem).image || '',
            swaps: toNumber((item as MostActiveUserItem).swaps),
        }))
        : []

    const requestsVsSessions = Array.isArray(rawData.requestsVsSessions)
        ? rawData.requestsVsSessions
            .map((item) => ({
                week: toNumber((item as RequestsVsSessionsItem).week),
                requests: toNumber((item as RequestsVsSessionsItem).requests),
                sessions: toNumber((item as RequestsVsSessionsItem).sessions),
            }))
            .filter((item) => item.week > 0)
            .sort((a, b) => a.week - b.week)
        : []

    return {
        summary: {
            completedSessionsThisWeek: toNumber(summary.completedSessionsThisWeek),
            activeUsers: toNumber(summary.activeUsers),
            totalSwapThisWeek: toNumber(summary.totalSwapThisWeek),
            weeklyReports: toNumber(summary.weeklyReports),
        },
        completedSessionsChart,
        topSkills,
        mostActiveUsers,
        requestsVsSessions,
        userOverview: {
            newUsers: toNumber(userOverview.newUsers),
            newUsersPercentage: clampPercentage(toNumber(userOverview.newUsersPercentage)),
            usersRatedAbove3: toNumber(userOverview.usersRatedAbove3),
            usersRatedAbove3Percentage: clampPercentage(
                toNumber(userOverview.usersRatedAbove3Percentage)
            ),
            usersRatedBelow3: toNumber(userOverview.usersRatedBelow3),
            usersRatedBelow3Percentage: clampPercentage(
                toNumber(userOverview.usersRatedBelow3Percentage)
            ),
            usersWithMultipleCancellations: toNumber(userOverview.usersWithMultipleCancellations),
            usersWithMultipleCancellationsPercentage: clampPercentage(
                toNumber(userOverview.usersWithMultipleCancellationsPercentage)
            ),
            flaggedUsersThisMonth: toNumber(userOverview.flaggedUsersThisMonth),
            flaggedUsersThisMonthPercentage: clampPercentage(
                toNumber(userOverview.flaggedUsersThisMonthPercentage)
            ),
        },
        period: {
            month: toNumber(period.month, DEFAULT_DASHBOARD_DATA.period.month),
            year: toNumber(period.year, DEFAULT_DASHBOARD_DATA.period.year),
        },
    }
}

export const AdminDashboard: React.FC = () => {
    const navigate = useNavigate()
    const [period, setPeriod] = useState<AdminDashboardPeriod>(getCurrentPeriod())
    const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [reloadCounter, setReloadCounter] = useState(0)
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    const [profileMenuOpen, setProfileMenuOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState<UserAuthDto | null>(() => getStoredUser())
    const profileMenuRef = useRef<HTMLDivElement>(null)
    const hasFetchedOnce = useRef(false)

    useEffect(() => {
        let isMounted = true

        const fetchDashboard = async () => {
            setError(null)

            if (hasFetchedOnce.current) {
                setIsRefreshing(true)
            } else {
                setIsLoading(true)
            }

            try {
                const data = await adminService.getDashboard(period)
                if (!isMounted) return

                setDashboardData(normalizeDashboardData(data))
                hasFetchedOnce.current = true
            } catch (requestError: unknown) {
                if (!isMounted) return

                if (axios.isAxiosError(requestError)) {
                    const message = requestError.response?.data?.message as string | undefined
                    setError(message || 'Failed to load dashboard data.')
                } else {
                    setError('Failed to load dashboard data.')
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                    setIsRefreshing(false)
                }
            }
        }

        fetchDashboard()

        return () => {
            isMounted = false
        }
    }, [period, reloadCounter])

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
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setProfileMenuOpen(false)
            }
        }

        if (profileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [profileMenuOpen])

    useEffect(() => {
        let isMounted = true

        const loadCurrentUser = async () => {
            const storedUser = getStoredUser()
            if (storedUser && isMounted) {
                setCurrentUser(storedUser)
            }

            try {
                const response = await userService.getCurrentProfile()
                if (!isMounted || !response.success) return

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
                // Keep cached user in case profile request fails.
            }
        }

        loadCurrentUser()

        return () => {
            isMounted = false
        }
    }, [])

    const data = dashboardData ?? DEFAULT_DASHBOARD_DATA
    const periodLabel = formatPeriodLabel(period)
    const userDisplayName =
        currentUser?.userName?.trim() || currentUser?.email?.split('@')[0] || 'User Name'
    const userDisplayEmail = currentUser?.email || 'user@example.com'
    const userAvatarSrc = currentUser?.image?.trim() || DEFAULT_AVATAR_URL
    const userRoleLabel = currentUser?.role ? currentUser.role.toLowerCase() : 'admin'

    const handleLogout = async () => {
        setProfileMenuOpen(false)
        await authService.logout()
        navigate('/auth/login')
    }

    const userOverviewRows = useMemo<UserOverviewRow[]>(
        () => [
            {
                label: 'New Users',
                count: data.userOverview.newUsers,
                percentage: data.userOverview.newUsersPercentage,
            },
            {
                label: 'Users Rated Above 3',
                count: data.userOverview.usersRatedAbove3,
                percentage: data.userOverview.usersRatedAbove3Percentage,
            },
            {
                label: 'Users with rating below 3',
                count: data.userOverview.usersRatedBelow3,
                percentage: data.userOverview.usersRatedBelow3Percentage,
            },
            {
                label: 'Users with multiple cancellations',
                count: data.userOverview.usersWithMultipleCancellations,
                percentage: data.userOverview.usersWithMultipleCancellationsPercentage,
            },
            {
                label: 'Flagged users this week',
                count: data.userOverview.flaggedUsersThisMonth,
                percentage: data.userOverview.flaggedUsersThisMonthPercentage,
            },
        ],
        [data.userOverview]
    )

    const handlePrevMonth = () => setPeriod((previousPeriod) => shiftPeriod(previousPeriod, -1))
    const handleNextMonth = () => setPeriod((previousPeriod) => shiftPeriod(previousPeriod, 1))
    const handleRetry = () => setReloadCounter((counter) => counter + 1)

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
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 17.8476C17.6392 17.8476 20.2481 17.1242 20.5 14.2205C20.5 11.3188 18.6812 11.5054 18.6812 7.94511C18.6812 5.16414 16.0452 2 12 2C7.95477 2 5.31885 5.16414 5.31885 7.94511C5.31885 11.5054 3.5 11.3188 3.5 14.2205C3.75295 17.1352 6.36177 17.8476 12 17.8476Z" stroke="#0C0D0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14.3887 20.8572C13.0246 22.372 10.8966 22.3899 9.51941 20.8572" stroke="#0C0D0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <div className="relative" ref={profileMenuRef}>
                            <button
                                type="button"
                                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                className="flex items-center gap-2 rounded-xl border-none bg-transparent p-0 transition-colors"
                                aria-label="Profile menu"
                            >
                                <Avatar src={userAvatarSrc} name={userDisplayName} size={40} />
                                <div className="hidden text-left sm:block">
                                    <p className="text-sm text-[#0C0D0F]">{userDisplayName}</p>
                                    <p className="text-xs capitalize text-[#666666]">{userRoleLabel}</p>
                                </div>
                                <ChevronDown className={`h-4 w-4 text-[#666666] transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {profileMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-xl border border-[#e8e8e8] bg-white py-2 shadow-lg ring-1 ring-black/5">
                                    <div className="border-b border-[#e8e8e8] px-4 py-3">
                                        <p className="text-sm font-medium text-dark">{userDisplayName}</p>
                                        <p className="text-xs text-gray-500">{userDisplayEmail}</p>
                                    </div>

                                    <div className="py-1">
                                        <Link
                                            to="/profile"
                                            onClick={() => setProfileMenuOpen(false)}
                                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-dark no-underline transition-colors hover:bg-gray-50"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                                                    stroke="#6B7280"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
                                                    stroke="#6B7280"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            My Profile
                                        </Link>

                                        <Link
                                            to="/profile/settings"
                                            onClick={() => setProfileMenuOpen(false)}
                                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-dark no-underline transition-colors hover:bg-gray-50"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                                                    stroke="#6B7280"
                                                    strokeWidth="1.5"
                                                    strokeMiterlimit="10"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z"
                                                    stroke="#6B7280"
                                                    strokeWidth="1.5"
                                                    strokeMiterlimit="10"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            Settings
                                        </Link>
                                    </div>

                                    <div className="border-t border-[#e8e8e8] pt-1">
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full cursor-pointer items-center gap-3 border-none bg-transparent px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M8.90002 7.56023C9.21002 3.96023 11.06 2.49023 15.11 2.49023H15.24C19.71 2.49023 21.5 4.28023 21.5 8.75023V15.2702C21.5 19.7402 19.71 21.5302 15.24 21.5302H15.11C11.09 21.5302 9.24002 20.0802 8.91002 16.5402"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M15 12H3.62"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M5.85 8.65039L2.5 12.0004L5.85 15.3504"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="space-y-4 px-4 py-4 md:px-6 md:py-6">
                    {isLoading && !dashboardData && (
                        <div className="rounded-xl border border-[#E5E7EB] bg-white p-10 text-center text-sm text-[#666666]">
                            Loading dashboard...
                        </div>
                    )}

                    {error && !isLoading && (
                        <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4">
                            <p className="text-sm text-[#B91C1C]">{error}</p>
                            <button
                                type="button"
                                onClick={handleRetry}
                                className="mt-3 rounded-md bg-[#B91C1C] px-3 py-1.5 text-sm text-white"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {dashboardData && (
                        <>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <SummaryCard
                                    title="Completed Sessions(this week)"
                                    value={data.summary.completedSessionsThisWeek}
                                    icon={<ClipboardCheck className="h-5 w-5 text-[#30B7BF]" />}
                                    iconBackground="bg-[#F4FEFF]"
                                />
                                <SummaryCard
                                    title="Active Users"
                                    value={data.summary.activeUsers}
                                    icon={<Users className="h-5 w-5 text-[#EF7B9E]" />}
                                    iconBackground="bg-[#FFF1F4]"
                                />
                                <SummaryCard
                                    title="Total Swap(this week)"
                                    value={data.summary.totalSwapThisWeek}
                                    icon={<ArrowLeftRight className="h-5 w-5 text-[#6E57E0]" />}
                                    iconBackground="bg-[#F3F0FF]"
                                />
                                <SummaryCard
                                    title="Weekly Reports"
                                    value={data.summary.weeklyReports}
                                    icon={<TriangleAlert className="h-5 w-5 text-[#F06565]" />}
                                    iconBackground="bg-[#FFF2F2]"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                                <section className="rounded-xl border border-[#E5E7EB] bg-white p-4 xl:col-span-6">
                                    <PeriodHeader
                                        title="Completed Sessions"
                                        periodLabel={periodLabel}
                                        onPrev={handlePrevMonth}
                                        onNext={handleNextMonth}
                                    />
                                    <CompletedSessionsChart data={data.completedSessionsChart} />
                                </section>

                                <section className="rounded-xl border border-[#E5E7EB] bg-white p-4 xl:col-span-3">
                                    <PeriodHeader
                                        title="Top skills"
                                        periodLabel={periodLabel}
                                        onPrev={handlePrevMonth}
                                        onNext={handleNextMonth}
                                    />
                                    <TopSkillsList skills={data.topSkills} />
                                </section>

                                <section className="rounded-xl border border-[#E5E7EB] bg-white p-4 xl:col-span-3">
                                    <PeriodHeader
                                        title="Most Active Users"
                                        periodLabel={periodLabel}
                                        onPrev={handlePrevMonth}
                                        onNext={handleNextMonth}
                                    />
                                    <MostActiveUsersList users={data.mostActiveUsers} />
                                </section>
                            </div>

                            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                                <section className="rounded-xl border border-[#E5E7EB] bg-white p-4 xl:col-span-6">
                                    <PeriodHeader
                                        title="Requests Vs Sessions"
                                        periodLabel={periodLabel}
                                        onPrev={handlePrevMonth}
                                        onNext={handleNextMonth}
                                    />
                                    <p className="mb-3 text-sm text-[#666666]">
                                        Session requests compared to completed sessions over time.
                                    </p>
                                    <RequestsVsSessionsChart data={data.requestsVsSessions} />
                                    <div className="mt-3 flex items-center gap-5">
                                        <div className="flex items-center gap-2 text-sm text-[#1C1C1C]">
                                            <span className="h-3 w-3 rounded bg-[#2F71A3]" />
                                            <span>Sessions</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-[#1C1C1C]">
                                            <span className="h-3 w-3 rounded bg-[#419063]" />
                                            <span>Requests</span>
                                        </div>
                                    </div>
                                </section>

                                <section className="rounded-xl border border-[#E5E7EB] bg-white p-4 xl:col-span-6">
                                    <PeriodHeader
                                        title="User Overview"
                                        periodLabel={periodLabel}
                                        onPrev={handlePrevMonth}
                                        onNext={handleNextMonth}
                                    />
                                    <UserOverviewList rows={userOverviewRows} />
                                </section>
                            </div>
                        </>
                    )}

                    {isRefreshing && (
                        <p className="text-xs text-[#666666]">{`Updating ${periodLabel}...`}</p>
                    )}
                </main>
            </div>
        </div>
    )
}
