import api from './api'
import type {
    Badge,
    UserBadge,
    BadgeProgress,
    CreateBadgeDto,
    UpdateBadgeDto,
} from '@/types/index'
export const getAllBadges = async (): Promise<Badge[]> => {
    const response = await api.get('/badges')
    return response.data
}
export const getUserBadges = async (userId: string): Promise<UserBadge[]> => {
    const response = await api.get(`/users/${userId}/badges`)
    return response.data
}
export const getBadgeProgress = async (
    userId: string,
    badgeId: string
): Promise<BadgeProgress> => {
    const response = await api.get(`/users/${userId}/badges/${badgeId}/progress`)
    return response.data
}
export const getAllBadgeProgress = async (userId: string): Promise<BadgeProgress[]> => {
    const response = await api.get(`/users/${userId}/badges/progress`)
    return response.data
}

export const awardBadge = async (
    userId: string,
    badgeId: string
): Promise<UserBadge> => {
    const response = await api.post(`/users/${userId}/badges`, { badgeId })
    return response.data
}
export const createBadge = async (data: CreateBadgeDto): Promise<Badge> => {
    const response = await api.post('/badges', data)
    return response.data
}
export const updateBadge = async (data: UpdateBadgeDto): Promise<Badge> => {
    const response = await api.put(`/badges/${data.id}`, data)
    return response.data
}
export const deleteBadge = async (badgeId: string): Promise<void> => {
    await api.delete(`/badges/${badgeId}`)
}
export const removeBadgeFromUser = async (
    userId: string,
    badgeId: string
): Promise<void> => {
    await api.delete(`/users/${userId}/badges/${badgeId}`)
}
export const getBadgesByCategory = async (
    category: 'learning' | 'achievements' | 'community'
): Promise<Badge[]> => {
    const response = await api.get('/badges', { params: { category } })
    return response.data
}
