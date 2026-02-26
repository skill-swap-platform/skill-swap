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

    getSessionSummary: async (sessionId: string): Promise<ApiResponse<any>> => {
        const response = await axiosInstance.get(`/api/v1/sessions/${sessionId}/summary`);
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

    submitDispute: async (disputeData: {
        type: string;
        description: string;
        sessionId: string;
        screenshot?: string
    }): Promise<ApiResponse<any>> => {
        const response = await axiosInstance.post('/api/v1/disputes', disputeData);
        return response.data;
    },

    uploadDisputeScreenshot: async (file: File): Promise<ApiResponse<any>> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axiosInstance.post('/api/v1/disputes/screenshot', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    getMyDisputes: async (params?: { status?: string; page?: number; limit?: number }): Promise<ApiResponse<any>> => {
        const response = await axiosInstance.get('/api/v1/disputes', { params });
        return response.data;
    },

    reportIssue: async (sessionId: string, issueData: any): Promise<ApiResponse<any>> => {
        return sessionService.submitDispute({
            sessionId,
            type: issueData.type || 'SESSION_ISSUE',
            description: issueData.description || issueData.reason || '',
            screenshot: issueData.screenshot
        });
    },

    getReceivedReviews: async (page = 1, limit = 10): Promise<ApiResponse<any>> => {
        const response = await axiosInstance.get('/api/v1/reviews/me/received', { params: { page, limit } });
        return response.data;
    },

    getReviewDetail: async (reviewId: string): Promise<ApiResponse<any>> => {
        const response = await axiosInstance.get(`/api/v1/reviews/${reviewId}`);
        return response.data;
    }
};