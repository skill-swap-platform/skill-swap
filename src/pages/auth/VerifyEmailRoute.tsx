// src/pages/auth/VerifyEmailRoute.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailVerificationPage from "@/pages/auth/EmailVerificationPage";
import { authService } from "@/api/services/auth.service";

const PENDING_KEY = "pending_signup_v1";
const TTL_MS = 15 * 60 * 1000; // 15 minutes

type PendingSignup = { email: string; password: string; createdAt: number };

export default function VerifyEmailRoute() {
  const navigate = useNavigate();
  const [pending, setPending] = useState<PendingSignup | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) {
      navigate("/auth/register", { replace: true });
      return;
    }

    try {
      const parsed = JSON.parse(raw) as PendingSignup;
      const expired = Date.now() - parsed.createdAt > TTL_MS;

      if (!parsed.email || !parsed.password || expired) {
        sessionStorage.removeItem(PENDING_KEY);
        navigate("/auth/register", { replace: true });
        return;
      }

      setPending(parsed);
    } catch {
      sessionStorage.removeItem(PENDING_KEY);
      navigate("/auth/register", { replace: true });
    }
  }, [navigate]);

  const email = useMemo(() => pending?.email ?? "", [pending]);

  if (!pending) return null;

  const onVerify = async (code: string) => {
    // 1) verify otp
    const verifyRes = await authService.verifyOtp({
      email: pending.email,
      otpCode: code,
      type: "VERIFY_EMAIL",
    });

    if (!verifyRes.success) {
      throw new Error(verifyRes.message || "Invalid code");
    }

    // 2) login
    const loginRes = await authService.login({
      email: pending.email,
      password: pending.password,
    });

    if (!loginRes.success || !loginRes.data) {
      throw new Error(loginRes.message || "Login failed");
    }

    // 3) cleanup + redirect
    sessionStorage.removeItem(PENDING_KEY);

    const nextPath =
      loginRes.data.user?.role === "ADMIN" ? "/admin/dashboard" : "/explore";

    navigate(nextPath, { replace: true });
  };

  const onResend = async () => {
    const res = await authService.resendOtp({
      email: pending.email,
      type: "VERIFY_EMAIL",
    });

    if (!res.success) {
      throw new Error(res.message || "Failed to resend code");
    }
  };

  return (
    <EmailVerificationPage
      email={email}
      onVerify={onVerify}
      onResend={onResend}
      initialSeconds={10 * 60}
      supportEmail="support@swap.xyz"
    />
  );
}
