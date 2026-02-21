import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = 'https://skill-swap-platform-api.onrender.com';

/** Paths that should never trigger a token refresh attempt */
const AUTH_PATHS = ['/api/v1/auth/login', '/api/v1/auth/register', '/api/v1/auth/refresh', '/api/v1/auth/verify-otp', '/api/v1/auth/resend-otp'];

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ─── Request Interceptor ────────────────────────────────────────────────────────
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

// ─── Response Interceptor (silent refresh) ──────────────────────────────────────

/** Whether a refresh request is currently in-flight */
let isRefreshing = false;

/** Queue of requests waiting for the token to be refreshed */
let failedQueue: {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}[] = [];

/** Replay (or reject) every queued request once the refresh settles */
function processQueue(error: unknown, token: string | null = null) {
    failedQueue.forEach(({ resolve, reject }) => {
        if (token) {
            resolve(token);
        } else {
            reject(error);
        }
    });
    failedQueue = [];
}

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // ── Non-401 errors — pass through ────────────────────────────────────
        if (error.response?.status !== 401) {
            if (error.response?.status === 400) {
                console.error('Bad Request:', error.response.data);
            }
            if (error.response?.status === 404) {
                console.error('Resource not found:', error.response.data);
            }
            return Promise.reject(error);
        }

        // ── 401 on an auth endpoint or already retried — don't refresh ───────
        const requestUrl = originalRequest?.url || '';
        const isAuthRequest = AUTH_PATHS.some((p) => requestUrl.includes(p));

        if (isAuthRequest || originalRequest._retry) {
            // If this was a retried request or an auth request, the refresh token
            // is invalid — force logout.
            if (originalRequest._retry) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                const path = window.location.pathname;
                if (!path.includes('/auth/') && !path.includes('/onboarding/')) {
                    window.location.href = '/auth/login?expired=true';
                }
            }
            return Promise.reject(error);
        }

        // ── Token refresh already in-flight — queue this request ─────────────
        if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((newToken) => {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            });
        }

        // ── Attempt a silent refresh ─────────────────────────────────────────
        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            isRefreshing = false;
            processQueue(error, null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            const path = window.location.pathname;
            if (!path.includes('/auth/') && !path.includes('/onboarding/')) {
                window.location.href = '/auth/login?expired=true';
            }
            return Promise.reject(error);
        }

        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, { refreshToken });

            const newAccessToken: string = data?.data?.accessToken ?? data?.accessToken;
            const newRefreshToken: string = data?.data?.refreshToken ?? data?.refreshToken;

            if (!newAccessToken) {
                throw new Error('No access token in refresh response');
            }

            localStorage.setItem('accessToken', newAccessToken);
            if (newRefreshToken) {
                localStorage.setItem('refreshToken', newRefreshToken);
            }

            // Replay queued requests with the new token
            processQueue(null, newAccessToken);

            // Retry the original request
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            const path = window.location.pathname;
            if (!path.includes('/auth/') && !path.includes('/onboarding/')) {
                window.location.href = '/auth/login?expired=true';
            }
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default axiosInstance;
