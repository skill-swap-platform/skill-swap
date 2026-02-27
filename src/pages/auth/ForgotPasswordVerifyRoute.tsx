import { useMemo } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import EmailVerificationPage from "@/pages/auth/EmailVerificationPage";
import { authService } from "@/api/services/auth.service";

const FORGOT_PASSWORD_KEY = "forgot_password_email_v1";
const TTL_MS = 15 * 60 * 1000; // 15 minutes
const VALID_OTP = "123456"; // Temporary: backend doesn't validate OTP yet

type ForgotPasswordData = { email: string; createdAt: number };

function getValidForgotPasswordData(): ForgotPasswordData | null {
  const raw = sessionStorage.getItem(FORGOT_PASSWORD_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as ForgotPasswordData;
    const expired = Date.now() - parsed.createdAt > TTL_MS;

    if (!parsed.email || expired) {
      sessionStorage.removeItem(FORGOT_PASSWORD_KEY);
      return null;
    }

    return parsed;
  } catch {
    sessionStorage.removeItem(FORGOT_PASSWORD_KEY);
    return null;
  }
}

export default function ForgotPasswordVerifyRoute() {
  const navigate = useNavigate();

  // Compute initial data once
  const forgotPasswordData = useMemo(() => getValidForgotPasswordData(), []);

  // Redirect if no valid data
  if (!forgotPasswordData) {
    return <Navigate to="/auth/forgot-password" replace />;
  }

  const onVerify = async (code: string) => {
    // TODO: Once backend supports OTP validation for password reset,
    // replace this with actual API call
    if (code !== VALID_OTP) {
      throw new Error("Invalid code. Please try again.");
    }

    // Navigate to reset password page with email context
    navigate("/auth/reset-password", {
      replace: true,
      state: { email: forgotPasswordData.email },
    });
  };

  const onResend = async () => {
    const res = await authService.forgotPassword(forgotPasswordData.email);

    if (!res.success) {
      throw new Error(res.message || "Failed to resend code");
    }

    // Update timestamp
    sessionStorage.setItem(
      FORGOT_PASSWORD_KEY,
      JSON.stringify({ email: forgotPasswordData.email, createdAt: Date.now() })
    );
  };

  return (
    <EmailVerificationPage
      email={forgotPasswordData.email}
      onVerify={onVerify}
      onResend={onResend}
      initialSeconds={165} // 2:45
      supportEmail="support@swap.xyz"
    />
  );
}
