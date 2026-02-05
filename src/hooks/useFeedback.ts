import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    submitFeedback,
    getSessionFeedback,
    getUserFeedbackHistory,
    getUserFeedbackStats,
    getUserAverageRating,
    updateFeedback,
    deleteFeedback,
    getFeedbackReceived,
    getFeedbackGiven,
    canSubmitFeedback,
} from '@/services'
import { useFeedbackStore } from '@/store'
import type { SubmitFeedbackDto, FeedbackHistoryFilter } from '@/types'

export const feedbackKeys = {
    all: ['feedback'] as const,
    session: (sessionId: string) => [...feedbackKeys.all, 'session', sessionId] as const,
    userHistory: (userId: string, filters?: FeedbackHistoryFilter) =>
        [...feedbackKeys.all, 'history', userId, filters] as const,
    stats: (userId: string) => [...feedbackKeys.all, 'stats', userId] as const,
    rating: (userId: string) => [...feedbackKeys.all, 'rating', userId] as const,
    received: (userId: string, params?: any) => [...feedbackKeys.all, 'received', userId, params] as const,
    given: (userId: string, params?: any) => [...feedbackKeys.all, 'given', userId, params] as const,
    canSubmit: (sessionId: string, userId: string) =>
        [...feedbackKeys.all, 'canSubmit', sessionId, userId] as const,
}

export const useSessionFeedback = (sessionId: string) => {
    const { setSessionFeedback, setLoading, setError } = useFeedbackStore()

    return useQuery({
        queryKey: feedbackKeys.session(sessionId),
        queryFn: async () => {
            setLoading(true)
            try {
                const data = await getSessionFeedback(sessionId)
                setSessionFeedback(data)
                return data
            } catch (error: any) {
                setError(error.message)
                throw error
            } finally {
                setLoading(false)
            }
        },
        enabled: !!sessionId,
        staleTime: 5 * 60 * 1000,
    })
}

export const useFeedbackHistory = (
    userId: string,
    filters?: FeedbackHistoryFilter
) => {
    const { setFeedbackHistory, setLoading, setError } = useFeedbackStore()

    return useQuery({
        queryKey: feedbackKeys.userHistory(userId, filters),
        queryFn: async () => {
            setLoading(true)
            try {
                const data = await getUserFeedbackHistory(userId, filters)
                setFeedbackHistory(data.feedbacks)
                return data
            } catch (error: any) {
                setError(error.message)
                throw error
            } finally {
                setLoading(false)
            }
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
    })
}

export const useFeedbackStats = (userId: string) => {
    const { setFeedbackStats, setLoading, setError } = useFeedbackStore()

    return useQuery({
        queryKey: feedbackKeys.stats(userId),
        queryFn: async () => {
            setLoading(true)
            try {
                const data = await getUserFeedbackStats(userId)
                setFeedbackStats(data)
                return data
            } catch (error: any) {
                setError(error.message)
                throw error
            } finally {
                setLoading(false)
            }
        },
        enabled: !!userId,
        staleTime: 10 * 60 * 1000,
    })
}

export const useAverageRating = (userId: string) => {
    return useQuery({
        queryKey: feedbackKeys.rating(userId),
        queryFn: () => getUserAverageRating(userId),
        enabled: !!userId,
        staleTime: 10 * 60 * 1000,
    })
}

export const useFeedbackReceived = (
    userId: string,
    params?: { limit?: number; offset?: number }
) => {
    return useQuery({
        queryKey: feedbackKeys.received(userId, params),
        queryFn: () => getFeedbackReceived(userId, params),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
    })
}

export const useFeedbackGiven = (
    userId: string,
    params?: { limit?: number; offset?: number }
) => {
    return useQuery({
        queryKey: feedbackKeys.given(userId, params),
        queryFn: () => getFeedbackGiven(userId, params),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
    })
}

export const useCanSubmitFeedback = (sessionId: string, userId: string) => {
    return useQuery({
        queryKey: feedbackKeys.canSubmit(sessionId, userId),
        queryFn: () => canSubmitFeedback(sessionId, userId),
        enabled: !!sessionId && !!userId,
        staleTime: 1 * 60 * 1000,
    })
}

export const useSubmitFeedback = () => {
    const queryClient = useQueryClient()
    const { addFeedback, setSubmitting, setError } = useFeedbackStore()

    return useMutation({
        mutationFn: (data: SubmitFeedbackDto) => {
            setSubmitting(true)
            return submitFeedback(data)
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: feedbackKeys.session(variables.sessionId)
            })
            queryClient.invalidateQueries({
                queryKey: feedbackKeys.stats(variables.toUserId)
            })
            queryClient.invalidateQueries({
                queryKey: feedbackKeys.rating(variables.toUserId)
            })

            addFeedback(data)
            setSubmitting(false)
        },
        onError: (error: any) => {
            setError(error.message)
            setSubmitting(false)
        },
    })
}

export const useUpdateFeedback = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            feedbackId,
            data
        }: {
            feedbackId: string
            data: Partial<SubmitFeedbackDto>
        }) => updateFeedback(feedbackId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: feedbackKeys.session(data.sessionId)
            })
        },
    })
}

export const useDeleteFeedback = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (feedbackId: string) => deleteFeedback(feedbackId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: feedbackKeys.all })
        },
    })
}
