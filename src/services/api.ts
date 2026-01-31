import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('authToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response) {
            const { status, data } = error.response

            if (status === 401) {
                localStorage.removeItem('authToken')
                window.location.href = '/login'
            }
            if (status === 403) {
                console.error('Forbidden: You do not have permission to access this resource')
            }
            if (status >= 500) {
                console.error('Server Error:', (data as any)?.message || 'Something went wrong')
            }
        } else if (error.request) {
            console.error('Network Error: No response from server')
        } else {
            console.error('Error:', error.message)
        }
        return Promise.reject(error)
    }
)
export default api
