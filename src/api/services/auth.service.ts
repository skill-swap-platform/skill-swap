import axiosInstance from '../axiosInstance';
import type { ApiResponse, AuthResponseDto } from '../../types/api.types';

export const authService = {
    signup: async (userData: any): Promise<ApiResponse<AuthResponseDto>> => {
        const response = await axiosInstance.post('/api/v1/auth/register', userData);
        if (response.data.success) {
            localStorage.setItem('accessToken', response.data.data.accessToken);
            localStorage.setItem('refreshToken', response.data.data.refreshToken);
        }
        return response.data;
    },

    login: async (credentials: any): Promise<ApiResponse<AuthResponseDto>> => {
        const response = await axiosInstance.post('/api/v1/auth/login', credentials);
        if (response.data.success) {
            localStorage.setItem('accessToken', response.data.data.accessToken);
            localStorage.setItem('refreshToken', response.data.data.refreshToken);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
    }
};