import type { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import type { ApiResponse, AuthResponseDto } from "../../types/api.types";

type RegisterDto = {
    email: string;
    password: string;
    confirmPassword: string;
};

type VerifyOtpDto = {
    email: string;
    otpCode: string;
    type: "VERIFY_EMAIL";
};

type ResendOtpDto = {
    email: string;
    type: "VERIFY_EMAIL";
};

function setTokens(data?: AuthResponseDto) {
    if (!data) return;
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
    }
}

function clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
}

function extractApiMessage(error: unknown): string {
    const msg = (error as AxiosError<{ message?: string | string[] }>)?.response?.data?.message;
    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string") return msg;
    return (error as Error)?.message || "Something went wrong";
}

export const authService = {
    // ✅ Register: لا تخزّن tokens هون (لأنه لسه ما تم التحقق من الإيميل)
    signup: async (userData: RegisterDto): Promise<ApiResponse<null>> => {
        try {
            await axiosInstance.post("/api/v1/auth/register", userData);
            return { success: true, data: null };
        } catch (e) {
            return { success: false, message: extractApiMessage(e), data: null };
        }
    },

    // ✅ Verify OTP
    verifyOtp: async (payload: VerifyOtpDto): Promise<ApiResponse<null>> => {
        try {
            await axiosInstance.post("/api/v1/auth/verify-otp", payload);
            return { success: true, data: null };
        } catch (e) {
            return { success: false, message: extractApiMessage(e), data: null };
        }
    },

    // ✅ Resend OTP
    resendOtp: async (payload: ResendOtpDto): Promise<ApiResponse<null>> => {
        try {
            await axiosInstance.post("/api/v1/auth/resend-otp", payload);
            return { success: true, data: null };
        } catch (e) {
            return { success: false, message: extractApiMessage(e), data: null };
        }
    },

    // ✅ Login: هون نخزّن tokens (بعد ما تم verify)
    login: async (credentials: { email: string; password: string }): Promise<ApiResponse<AuthResponseDto>> => {
        try {
            const response = await axiosInstance.post("/api/v1/auth/login", credentials);
            if (response.data.success) setTokens(response.data.data);
            return response.data;
        } catch (e) {
            return { success: false, message: extractApiMessage(e), data: null as any };
        }
    },

    refreshToken: async (): Promise<ApiResponse<AuthResponseDto>> => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                return { success: false, message: "No refresh token available", data: null as any };
            }
            const response = await axiosInstance.post("/api/v1/auth/refresh", { refreshToken });
            if (response.data.success) setTokens(response.data.data);
            return response.data;
        } catch (e) {
            return { success: false, message: extractApiMessage(e), data: null as any };
        }
    },

    logout: async (): Promise<void> => {
        try {
            await axiosInstance.post("/api/v1/auth/logout");
        } catch {
            // Continue with local logout even if API call fails
        }
        clearTokens();
    },
};
