import api from './api'
import type {
    PointsSummary,
    PointsBreakdown,
    LeaderboardEntry,
    LeaderboardFilter,
    AddPointsDto,
    UpdatePointsDto,
} from '@/types/index'
export const getUserPoints = async (userId: string): Promise<PointsSummary> => {
    const response = await api.get(`/users/${userId}/points`)
    return response.data
}
export const getPointsBreakdown = async (userId: string): Promise<PointsBreakdown> => {
    const response = await api.get(`/users/${userId}/points/breakdown`)
    return response.data
}
export const getLeaderboard = async (
    filters?: LeaderboardFilter
): Promise<{ entries: LeaderboardEntry[]; total: number }> => {
    const response = await api.get('/leaderboard', { params: filters })
    return response.data
}
export const addPoints = async (data: AddPointsDto): Promise<PointsSummary> => {
    const response = await api.post(`/users/${data.userId}/points/add`, {
        activityType: data.activityType,
        additionalData: data.additionalData,
    })
    return response.data
}
export const updateUserPoints = async (data: UpdatePointsDto): Promise<PointsSummary> => {
    const response = await api.put(`/users/${data.userId}/points`, {
        points: data.points,
        reason: data.reason,
    })
    return response.data
}
export const getUserRank = async (userId: string): Promise<{ rank: number; totalUsers: number }> => {
    const response = await api.get(`/users/${userId}/rank`)
    return response.data
}
export const getPointsHistory = async (
    userId: string,
    params?: { limit?: number; offset?: number }
): Promise<{ activities: any[]; total: number }> => {
    const response = await api.get(`/users/${userId}/points/history`, { params })
    return response.data
}
