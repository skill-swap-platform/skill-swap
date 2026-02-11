import axios from 'axios';

const API_BASE_URL = 'https://skill-swap-platform-api.onrender.com';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const path = window.location.pathname;
            // Only redirect if NOT on an auth page AND if we don't have sensitive onboarding state
            if (!path.includes('/auth/') && !path.includes('/onboarding/')) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/auth/login?expired=true';
            }
        }

        if (error.response?.status === 400) {
            console.error('Bad Request:', error.response.data);
        }

        if (error.response?.status === 404) {
            console.error('Resource not found:', error.response.data);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;