import api from './api'
import type {
    Feedback,
    SessionFeedback,
    SubmitFeedbackDto,
    FeedbackStats,
    FeedbackHistoryFilter,
} from '@/types/index'
export const submitFeedback = async (data: SubmitFeedbackDto): Promise<Feedback> => {
    const response = await api.post(`/sessions/${data.sessionId}/feedback`, {
        toUserId: data.toUserId,
        rating: data.rating,
        comment: data.comment,
        wasHelpful: data.wasHelpful,
        wouldRecommend: data.wouldRecommend,
        tags: data.tags,
    })
    return response.data
}
export const getSessionFeedback = async (sessionId: string): Promise<SessionFeedback> => {
    const response = await api.get(`/sessions/${sessionId}/feedback`)
    return response.data
}
export const getUserFeedbackHistory = async (
    userId: string,
    filters?: FeedbackHistoryFilter
): Promise<{ feedbacks: Feedback[]; total: number }> => {
    const response = await api.get(`/users/${userId}/feedback`, { params: filters })
    return response.data
}
export const getUserFeedbackStats = async (userId: string): Promise<FeedbackStats> => {
    const response = await api.get(`/users/${userId}/feedback/stats`)
    return response.data
}
export const getUserAverageRating = async (
    userId: string
): Promise<{ averageRating: number; totalRatings: number }> => {
    const response = await api.get(`/users/${userId}/rating`)
    return response.data
}
export const updateFeedback = async (
    feedbackId: string,
    data: Partial<SubmitFeedbackDto>
): Promise<Feedback> => {
    const response = await api.put(`/feedback/${feedbackId}`, data)
    return response.data
}
export const deleteFeedback = async (feedbackId: string): Promise<void> => {
    await api.delete(`/feedback/${feedbackId}`)
}
export const getFeedbackReceived = async (
    userId: string,
    params?: { limit?: number; offset?: number }
): Promise<{ feedbacks: Feedback[]; total: number }> => {
    const response = await api.get(`/users/${userId}/feedback/received`, { params })
    return response.data
}
export const getFeedbackGiven = async (
    userId: string,
    params?: { limit?: number; offset?: number }
): Promise<{ feedbacks: Feedback[]; total: number }> => {
    const response = await api.get(`/users/${userId}/feedback/given`, { params })
    return response.data
}
export const canSubmitFeedback = async (
    sessionId: string,
    userId: string
): Promise<{ canSubmit: boolean; reason?: string }> => {
    const response = await api.get(`/sessions/${sessionId}/can-submit-feedback`, {
        params: { userId },
    })
    return response.data
}
