import axiosInstance from '../axiosInstance';
import type { ApiResponse } from '../../types/api.types';

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    requirement: string;
    points: number;
    isActive: boolean;
    createdAt: string;
}

export interface BadgeCheckResponse {
    newlyUnlocked: Badge[];
    nextBadge?: Badge;
}

export interface PointHistoryItem {
    id: string;
    userId: string;
    amount: number;
    reason: string;
    type: 'EARNED' | 'REDEEMED';
    createdAt: string;
}

export interface UserPointsResponse {
    total: number;
    points: PointHistoryItem[];
}

export interface UserBadgesResponse {
    completedSessions: number;
    nextBadge: Partial<Badge>;
    badges: Record<string, any>;
}

export const gamificationService = {
    checkBadges: async (): Promise<ApiResponse<BadgeCheckResponse>> => {
        const response = await axiosInstance.get('/api/v1/gamification/badges/check');
        return response.data;
    },

    getPoints: async (userId: string): Promise<ApiResponse<UserPointsResponse>> => {
        const response = await axiosInstance.get(`/api/v1/gamification/points/${userId}`);
        return response.data;
    },

    getBadges: async (userId: string): Promise<ApiResponse<UserBadgesResponse>> => {
        const response = await axiosInstance.get(`/api/v1/gamification/badges/${userId}`);
        return response.data;
    }
};