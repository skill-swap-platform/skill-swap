import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { ArrowLeftRight, Bell, ChevronDown, ClipboardCheck, TriangleAlert, Users } from 'lucide-react'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
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
    const [period, setPeriod] = useState<AdminDashboardPeriod>(getCurrentPeriod())
    const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [reloadCounter, setReloadCounter] = useState(0)
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

    const data = dashboardData ?? DEFAULT_DASHBOARD_DATA
    const periodLabel = formatPeriodLabel(period)

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
            <AdminSidebar />

            <div className="md:ml-[236px]">
                <header className="flex h-[80px] items-center justify-end border-b border-[#F3F4F6] px-4 md:px-6">
                    <div className="flex items-center gap-4 md:gap-6">
                        <button type="button" className="rounded-full p-2 text-[#1C1C1C] hover:bg-[#F3F4F6]">
                            <Bell className="h-5 w-5" />
                        </button>
                        <div className="flex items-center gap-2">
                            <img
                                src="https://i.pravatar.cc/80?u=admin-wafaa"
                                alt="Wafaa Amjad"
                                className="h-10 w-10 rounded-2xl object-cover"
                            />
                            <div className="hidden sm:block">
                                <p className="text-sm text-[#0C0D0F]">Wafaa Amjad</p>
                                <p className="text-xs text-[#666666]">Admin</p>
                            </div>
                            <ChevronDown className="h-4 w-4 text-[#666666]" />
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
