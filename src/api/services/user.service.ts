import axiosInstance from '../axiosInstance';
import type { UpdateUserDto, UserResponseDto, ApiResponse, AddUserSkillDto, CategoryResponseDto, CategorySkillsDto } from '../../types/api.types';

export const userService = {
    getCurrentProfile: async (): Promise<ApiResponse<UserResponseDto>> => {
        const response = await axiosInstance.get('/api/v1/user/me');
        return response.data;
    },

    updateProfile: async (data: UpdateUserDto): Promise<ApiResponse<UserResponseDto>> => {
        const response = await axiosInstance.patch('/api/v1/user/me', data);
        return response.data;
    },

    updateInterests: async (categoryIds: string[]): Promise<ApiResponse<any>> => {
        const response = await axiosInstance.patch('/api/v1/user/me/categories', {
            selectedCatIds: categoryIds
        });
        return response.data;
    },

    addSkill: async (skillData: AddUserSkillDto): Promise<ApiResponse<any>> => {
        const payload = {
            skillId: skillData.skillId,
            level: skillData.level,
            yearsOfExperience: skillData.yearsOfExperience,
            sessionLanguage: skillData.sessionLanguage || 'English',
            skillDescription: skillData.skillDescription || '',
        };
        const response = await axiosInstance.post('/api/v1/user/me/skills', payload);
        return response.data;
    },

    getUserSkills: async (): Promise<ApiResponse<any>> => {
        const response = await axiosInstance.get('/api/v1/user/me/skills');
        return response.data;
    },

    updateUserSkill: async (skillId: string, data: Partial<AddUserSkillDto>): Promise<ApiResponse<any>> => {
        const response = await axiosInstance.patch(`/api/v1/user/${skillId}`, data);
        return response.data;
    },

    removeSkill: async (skillId: string): Promise<ApiResponse<any>> => {
        const response = await axiosInstance.delete(`/api/v1/user/me/skills/${skillId}`);
        return response.data;
    },

    getProfileRating: async (userId: string): Promise<ApiResponse<any>> => {
        const response = await axiosInstance.get(`/api/v1/feedback/rating/${userId}`);
        return response.data;
    },

    uploadProfileImage: async (file: File): Promise<ApiResponse<{ image: string }>> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axiosInstance.post('/api/v1/user/me/profile-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteProfileImage: async (): Promise<ApiResponse<any>> => {
        const response = await axiosInstance.delete('/api/v1/user/me/profile-image');
        return response.data;
    },

    healthCheck: async (): Promise<ApiResponse<any>> => {
        const response = await axiosInstance.get('/api/v1/user/health');
        return response.data;
    },

    getPublicProfile: async (userId: string): Promise<ApiResponse<UserResponseDto>> => {
        const response = await axiosInstance.get(`/api/v1/user/${userId}`);
        return response.data;
    }
};

export const skillService = {
    getAllSkills: async (): Promise<ApiResponse<any>> => {
        const response = await axiosInstance.get('/api/v1/skills');
        return response.data;
    },

    getCategories: async (): Promise<ApiResponse<CategoryResponseDto[]>> => {
        const response = await axiosInstance.get('/api/v1/skills/categories');
        return response.data;
    },

    getSkillsByCategory: async (categoryId: string): Promise<ApiResponse<CategorySkillsDto>> => {
        const response = await axiosInstance.get(`/api/v1/skills/categories/${categoryId}/skills`);
        return response.data;
    },

    searchSkills: async (name: string): Promise<ApiResponse<any>> => {
        const response = await axiosInstance.get(`/api/v1/skills/search?name=${name}`);
        return response.data;
    },

    createSkill: async (name: string): Promise<ApiResponse<any>> => {
        const response = await axiosInstance.post('/api/v1/skills/create', { name });
        return response.data;
    }
};