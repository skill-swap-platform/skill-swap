import { create } from 'zustand'
import type { Feedback, SessionFeedback, FeedbackStats } from '@/types'

interface FeedbackState {
    sessionFeedback: SessionFeedback | null
    feedbackHistory: Feedback[]
    feedbackStats: FeedbackStats | null
    isSubmitting: boolean
    isLoading: boolean
    error: string | null
    setSessionFeedback: (feedback: SessionFeedback) => void
    setFeedbackHistory: (history: Feedback[]) => void
    setFeedbackStats: (stats: FeedbackStats) => void
    addFeedback: (feedback: Feedback) => void
    setSubmitting: (isSubmitting: boolean) => void
    setLoading: (isLoading: boolean) => void
    setError: (error: string | null) => void
    reset: () => void
}

const initialState = {
    sessionFeedback: null,
    feedbackHistory: [],
    feedbackStats: null,
    isSubmitting: false,
    isLoading: false,
    error: null,
}

export const useFeedbackStore = create<FeedbackState>((set) => ({
    ...initialState,

    setSessionFeedback: (feedback) =>
        set({ sessionFeedback: feedback, error: null }),

    setFeedbackHistory: (history) =>
        set({ feedbackHistory: history, error: null }),

    setFeedbackStats: (stats) =>
        set({ feedbackStats: stats, error: null }),

    addFeedback: (feedback) =>
        set((state) => ({
            feedbackHistory: [feedback, ...state.feedbackHistory],
        })),

    setSubmitting: (isSubmitting) =>
        set({ isSubmitting }),

    setLoading: (isLoading) =>
        set({ isLoading }),

    setError: (error) =>
        set({ error, isLoading: false, isSubmitting: false }),

    reset: () =>
        set(initialState),
}))
