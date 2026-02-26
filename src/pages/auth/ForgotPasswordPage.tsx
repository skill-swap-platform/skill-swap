import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import rightImage from "@/assets/auth/right-container.png";
import Brand from "@/components/Auth/Brand";
import { authService } from "@/api/services/auth.service";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORGOT_PASSWORD_KEY = "forgot_password_email_v1";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isValidEmail = emailRegex.test(email.trim());
  const canSubmit = isValidEmail && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await authService.forgotPassword(trimmedEmail);

      if (!response.success) {
        setError(response.message || "Failed to send reset code");
        return;
      }

      // Store email with TTL for the verification step
      sessionStorage.setItem(
        FORGOT_PASSWORD_KEY,
        JSON.stringify({ email: trimmedEmail, createdAt: Date.now() })
      );

      setSuccessMessage(response.message || "Reset code sent successfully");

      // Navigate to verify code page after short delay to show success
      setTimeout(() => {
        navigate("/auth/forgot-password/verify", { replace: true });
      }, 1000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 lg:grid-cols-2">
        {/* LEFT */}
        <section className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            {/* Brand */}
            <Brand />

            {/* Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
              <h1 className="text-center text-xl font-bold text-gray-900">
                Forgot Password
              </h1>
              <p className="mt-1 text-center text-sm text-gray-600">
                Enter your email to send verification code
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-base font-semibold text-gray-900"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    onBlur={() => {
                      if (email.trim() && !emailRegex.test(email.trim())) {
                        setError("Please enter a valid email address");
                      }
                    }}
                    className="
                      h-14 w-full rounded-xl border border-gray-300 px-5
                      text-lg text-gray-900 outline-none transition
                      focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10
                    "
                  />
                  {error && (
                    <p className="mt-2 text-sm text-[#D14343]">{error}</p>
                  )}
                  {successMessage && (
                    <p className="mt-2 text-sm text-green-600">{successMessage}</p>
                  )}
                </div>

                {/* Send Code Button */}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="h-11 w-full rounded-md bg-[#3272A3] text-sm font-semibold text-white shadow-sm transition hover:bg-[#2a6191] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3272A3]/30 disabled:cursor-not-allowed disabled:bg-[#9CA3AF] disabled:shadow-none"
                >
                  {isSubmitting ? "Sending..." : "Send Code"}
                </button>

                {/* Back to Login */}
                <div className="pt-2 text-center text-xs text-gray-600">
                  <span>Remember your password? </span>
                  <Link
                    to="/auth/login"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <aside className="relative hidden lg:block">
          <img
            src={rightImage}
            alt="SkillSwap collage"
            className="h-full w-full object-cover"
          />
        </aside>
      </div>
    </main>
  );
}
