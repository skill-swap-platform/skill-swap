import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import EmailVerificationPage from "@/pages/auth/EmailVerificationPage";
import { authService } from "@/api/services/auth.service";

const FORGOT_PASSWORD_KEY = "forgot_password_email_v1";
const TTL_MS = 10 * 60 * 1000;
const VALID_OTP = "123456";

type ForgotPasswordData = {
  email: string;
  createdAt: number;
};

function getValidForgotPasswordData(): ForgotPasswordData | null {
  const raw = sessionStorage.getItem(FORGOT_PASSWORD_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as ForgotPasswordData;

    if (!parsed.email) return null;

    const expired = Date.now() - parsed.createdAt > TTL_MS;

    if (expired) {
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

  const [verificationState] = useState(() => {
    const data = getValidForgotPasswordData();

    if (!data) {
      return {
        data: null,
        remainingSeconds: 0,
      };
    }

    const remainingSeconds = Math.max(
      0,
      Math.floor((data.createdAt + TTL_MS - Date.now()) / 1000),
    );

    return {
      data,
      remainingSeconds,
    };
  });

  const data = verificationState.data;
  const remainingSeconds = verificationState.remainingSeconds;

  if (!data) {
    return <Navigate to="/auth/forgot-password" replace />;
  }

  const onVerify = async (code: string) => {
    if (code !== VALID_OTP) {
      throw new Error("Invalid code. Please try again.");
    }

    navigate("/auth/reset-password", {
      replace: true,
      state: { email: data.email },
    });
  };

  const onResend = async () => {
    const res = await authService.forgotPassword(data.email);

    if (!res.success) {
      throw new Error(res.message || "Failed to resend code");
    }

    sessionStorage.setItem(
      FORGOT_PASSWORD_KEY,
      JSON.stringify({
        email: data.email,
        createdAt: Date.now(),
      }),
    );
  };

  return (
    <EmailVerificationPage
      email={data.email}
      onVerify={onVerify}
      onResend={onResend}
      initialSeconds={remainingSeconds}
      supportEmail="support@swap.xyz"
    />
  );
}
