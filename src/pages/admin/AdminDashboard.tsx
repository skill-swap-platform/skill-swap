import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { ArrowLeftRight, ClipboardCheck, TriangleAlert, Users } from 'lucide-react'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { AdminHeader } from '@/components/layout/AdminHeader'
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

const normalizeNumberString = (value: string): string => {
    const cleaned = value.trim().replace(/[^\d.,-]/g, '')
    if (!cleaned) return ''

    const thousandsPattern = /^-?\d{1,3}([.,]\d{3})+$/
    if (thousandsPattern.test(cleaned)) {
        return cleaned.replace(/[.,]/g, '')
    }

    const hasDot = cleaned.includes('.')
    const hasComma = cleaned.includes(',')

    if (hasDot && hasComma) {
        const lastDot = cleaned.lastIndexOf('.')
        const lastComma = cleaned.lastIndexOf(',')
        const decimalSeparator = lastDot > lastComma ? '.' : ','
        const thousandsSeparator = decimalSeparator === '.' ? ',' : '.'
        const withoutThousands = cleaned.split(thousandsSeparator).join('')
        return decimalSeparator === ',' ? withoutThousands.replace(',', '.') : withoutThousands
    }

    if (hasComma && !hasDot) {
        const commaParts = cleaned.split(',')
        if (commaParts.length === 2 && commaParts[1].length !== 3) {
            return cleaned.replace(',', '.')
        }
        return cleaned.replace(/,/g, '')
    }

    return cleaned
}

const toNumber = (value: unknown, fallback = 0): number => {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : fallback
    }

    if (typeof value === 'string') {
        const normalized = normalizeNumberString(value)
        if (!normalized) return fallback

        const numericValue = Number(normalized)
        return Number.isFinite(numericValue) ? numericValue : fallback
    }

    const numericValue = Number(value)
    return Number.isFinite(numericValue) ? numericValue : fallback
}

const clampPercentage = (value: number): number => {
    if (value < 0) return 0
    if (value > 100) return 100
    return value
}

const normalizePercentage = (value: unknown): number => {
    const numericValue = toNumber(value)
    const normalizedValue =
        Number.isFinite(numericValue) && numericValue > 0 && numericValue < 1
            ? numericValue * 100
            : numericValue
    return clampPercentage(normalizedValue)
}

const pickFirstValue = (source: Record<string, unknown>, keys: string[]): unknown => {
    for (const key of keys) {
        if (source[key] !== undefined && source[key] !== null) return source[key]
    }
    return undefined
}

const normalizeMonth = (value: unknown, fallback: number): number => {
    const parsed = Math.round(toNumber(value, fallback))
    return parsed >= 1 && parsed <= 12 ? parsed : fallback
}

const normalizeYear = (value: unknown, fallback: number): number => {
    const parsed = Math.round(toNumber(value, fallback))
    return parsed >= 1970 ? parsed : fallback
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
    const summaryRecord = summary as unknown as Record<string, unknown>
    const userOverviewRecord = userOverview as unknown as Record<string, unknown>
    const periodRecord = period as unknown as Record<string, unknown>

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
            percentage: normalizePercentage((item as TopSkillItem).percentage),
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
            completedSessionsThisWeek: toNumber(
                pickFirstValue(summaryRecord, [
                    'completedSessionsThisWeek',
                    'completedSessionThisWeek',
                    'completed_sessions_this_week',
                ])
            ),
            activeUsers: toNumber(
                pickFirstValue(summaryRecord, ['activeUsers', 'activeUser', 'active_users'])
            ),
            totalSwapThisWeek: toNumber(
                pickFirstValue(summaryRecord, [
                    'totalSwapThisWeek',
                    'totalSwapsThisWeek',
                    'total_swap_this_week',
                ])
            ),
            weeklyReports: toNumber(
                pickFirstValue(summaryRecord, ['weeklyReports', 'weeklyReport', 'weekly_reports'])
            ),
        },
        completedSessionsChart,
        topSkills,
        mostActiveUsers,
        requestsVsSessions,
        userOverview: {
            newUsers: toNumber(
                pickFirstValue(userOverviewRecord, ['newUsers', 'new_users', 'newUser'])
            ),
            newUsersPercentage: normalizePercentage(
                pickFirstValue(userOverviewRecord, [
                    'newUsersPercentage',
                    'newUsersPercent',
                    'new_users_percentage',
                ])
            ),
            usersRatedAbove3: toNumber(
                pickFirstValue(userOverviewRecord, [
                    'usersRatedAbove3',
                    'usersRatedAboveThree',
                    'users_rated_above_3',
                ])
            ),
            usersRatedAbove3Percentage: normalizePercentage(
                pickFirstValue(userOverviewRecord, [
                    'usersRatedAbove3Percentage',
                    'usersRatedAboveThreePercentage',
                    'users_rated_above_3_percentage',
                ])
            ),
            usersRatedBelow3: toNumber(
                pickFirstValue(userOverviewRecord, [
                    'usersRatedBelow3',
                    'usersRatedBelowThree',
                    'users_rated_below_3',
                ])
            ),
            usersRatedBelow3Percentage: normalizePercentage(
                pickFirstValue(userOverviewRecord, [
                    'usersRatedBelow3Percentage',
                    'usersRatedBelowThreePercentage',
                    'users_rated_below_3_percentage',
                ])
            ),
            usersWithMultipleCancellations: toNumber(
                pickFirstValue(userOverviewRecord, [
                    'usersWithMultipleCancellations',
                    'users_multiple_cancellations',
                ])
            ),
            usersWithMultipleCancellationsPercentage: normalizePercentage(
                pickFirstValue(userOverviewRecord, [
                    'usersWithMultipleCancellationsPercentage',
                    'users_multiple_cancellations_percentage',
                ])
            ),
            flaggedUsersThisMonth: toNumber(
                pickFirstValue(userOverviewRecord, [
                    'flaggedUsersThisMonth',
                    'flaggedUsers',
                    'flagged_users_this_month',
                ])
            ),
            flaggedUsersThisMonthPercentage: normalizePercentage(
                pickFirstValue(userOverviewRecord, [
                    'flaggedUsersThisMonthPercentage',
                    'flaggedUsersPercentage',
                    'flagged_users_this_month_percentage',
                ])
            ),
        },
        period: {
            month: normalizeMonth(periodRecord.month, DEFAULT_DASHBOARD_DATA.period.month),
            year: normalizeYear(periodRecord.year, DEFAULT_DASHBOARD_DATA.period.year),
        },
    }
}

export const AdminDashboard: React.FC = () => {
    const [period, setPeriod] = useState<AdminDashboardPeriod>(getCurrentPeriod())
    const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [reloadCounter, setReloadCounter] = useState(0)
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState<UserAuthDto | null>(() => getStoredUser())
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
                label: 'Flagged users this month',
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
                <AdminHeader
                    onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
                    userName={userDisplayName}
                    userEmail={userDisplayEmail}
                    userRole={userRoleLabel}
                    userAvatar={userAvatarSrc}
                />

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


