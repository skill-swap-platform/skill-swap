// src/pages/auth/VerifyEmailRoute.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EmailVerificationPage from "@/pages/auth/EmailVerificationPage";
import { authService } from "@/api/services/auth.service";

const PENDING_KEY = "pending_signup_v1";
const TTL_MS = 15 * 60 * 1000; // 15 minutes

type PendingSignup = { email: string; password: string; createdAt: number };
type LocationState = { email?: string } | null;

export default function VerifyEmailRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pending, setPending] = useState<PendingSignup | null>(null);
  // For users coming from login (unverified email) - only have email, no password
  const [loginEmail, setLoginEmail] = useState<string | null>(null);

  useEffect(() => {
    // First check if user came from login with an unverified email
    const state = location.state as LocationState;
    if (state?.email) {
      setLoginEmail(state.email);
      return;
    }

    // Otherwise check for pending signup from registration
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
  }, [navigate, location.state]);

  const email = useMemo(() => loginEmail ?? pending?.email ?? "", [loginEmail, pending]);

  // Handle case when user came from login (unverified email)
  if (loginEmail) {
    const onVerifyFromLogin = async (code: string) => {
      const verifyRes = await authService.verifyOtp({
        email: loginEmail,
        otpCode: code,
        type: "VERIFY_EMAIL",
      });

      if (!verifyRes.success) {
        throw new Error(verifyRes.message || "Invalid code");
      }

      // Redirect to login after successful verification
      navigate("/auth/login", { replace: true });
    };

    const onResendFromLogin = async () => {
      const res = await authService.resendOtp({
        email: loginEmail,
        type: "VERIFY_EMAIL",
      });

      if (!res.success) {
        throw new Error(res.message || "Failed to resend code");
      }
    };

    return (
      <EmailVerificationPage
        email={email}
        onVerify={onVerifyFromLogin}
        onResend={onResendFromLogin}
        initialSeconds={60}
        supportEmail="support@swap.xyz"
      />
    );
  }

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
      initialSeconds={60}
      supportEmail="support@swap.xyz"
    />
  );
}
