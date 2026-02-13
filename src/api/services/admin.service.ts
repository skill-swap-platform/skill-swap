import axiosInstance from '../axiosInstance'

export interface AdminDashboardPeriod {
    month: number
    year: number
}

export interface AdminDashboardSummary {
    completedSessionsThisWeek: number
    activeUsers: number
    totalSwapThisWeek: number
    weeklyReports: number
}

export interface CompletedSessionChartPoint {
    day: number
    count: number
}

export interface TopSkillItem {
    skillName: string
    swaps: number
    percentage: number
}

export interface MostActiveUserItem {
    userName: string
    image: string
    swaps: number
}

export interface RequestsVsSessionsItem {
    week: number
    requests: number
    sessions: number
}

export interface UserOverviewData {
    newUsers: number
    newUsersPercentage: number
    usersRatedAbove3: number
    usersRatedAbove3Percentage: number
    usersRatedBelow3: number
    usersRatedBelow3Percentage: number
    usersWithMultipleCancellations: number
    usersWithMultipleCancellationsPercentage: number
    flaggedUsersThisMonth: number
    flaggedUsersThisMonthPercentage: number
}

export interface AdminDashboardData {
    summary: AdminDashboardSummary
    completedSessionsChart: CompletedSessionChartPoint[]
    topSkills: TopSkillItem[]
    mostActiveUsers: MostActiveUserItem[]
    requestsVsSessions: RequestsVsSessionsItem[]
    userOverview: UserOverviewData
    period: AdminDashboardPeriod
}

export const adminService = {
    getDashboard: async (params: AdminDashboardPeriod): Promise<AdminDashboardData> => {
        const response = await axiosInstance.get('/api/v1/admin/dashboard', { params })
        return (response.data?.data ?? response.data) as AdminDashboardData
    },
}
