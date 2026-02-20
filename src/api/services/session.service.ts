import axiosInstance from '../axiosInstance';
import type { ApiResponse } from '../../types/api.types';

export const sessionService = {
    getHistory: async (params?: { page?: number; limit?: number; status?: string; month?: string }): Promise<ApiResponse<any>> => {
        const response = await axiosInstance.get('/api/v1/sessions/my-sessions', { params });
        return response.data;
    },

    getSessionDetail: async (sessionId: string): Promise<ApiResponse<any>> => {
        const response = await axiosInstance.get(`/api/v1/sessions/${sessionId}`);
        return response.data;
    },

    submitRoleFeedback: async (role: 'teaching' | 'learning' | 'both', feedbackData: any): Promise<ApiResponse<any>> => {
        const endpoint = role === 'teaching' ? '/api/v1/feedback/teaching' : '/api/v1/feedback/learning';
        const response = await axiosInstance.post(endpoint, feedbackData);
        return response.data;
    },

    submitReview: async (reviewData: { swapRequestId: string; comment: string; isPublic: boolean }): Promise<ApiResponse<any>> => {
        const response = await axiosInstance.post('/api/v1/reviews', reviewData);
        return response.data;
    },

    completeSession: async (sessionId: string, notes: string = ''): Promise<ApiResponse<any>> => {
        const response = await axiosInstance.patch(`/api/v1/sessions/${sessionId}/complete`, { notes });
        return response.data;
    },

    // Note: Backend does not yet have a /report endpoint.
    reportIssue: async (sessionId: string, issueData: any): Promise<ApiResponse<any>> => {
        console.warn('[ReportIssue] Backend endpoint not yet available. Logging report locally.', {
            sessionId,
            ...issueData,
        });
        return { success: true, message: 'Report received (pending backend implementation)', data: null };
    }
};