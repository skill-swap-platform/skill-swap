import React, { useEffect, useMemo, useRef, useState } from "react";

type EmailVerificationPageProps = {
  email: string;
  /** default: 10 minutes */
  initialSeconds?: number;
  supportEmail?: string;
  onVerify: (code: string) => Promise<void> | void;
  onResend?: () => Promise<void> | void;
};

const OTP_LENGTH = 6;

export default function EmailVerificationPage({
  email,
  initialSeconds = 10 * 60,
  supportEmail = "support@womp.xyz",
  onVerify,
  onResend,
}: EmailVerificationPageProps) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState<number>(Math.max(0, initialSeconds));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const otpValue = useMemo(() => otp.join(""), [otp]);
  const isComplete = otpValue.length === OTP_LENGTH && !otpValue.includes("");

  useEffect(() => {
    if (timeLeft <= 0) return;

    const id = window.setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);

    return () => window.clearInterval(id);
  }, [timeLeft]);

  function focusIndex(i: number) {
    inputsRef.current[i]?.focus();
    inputsRef.current[i]?.select();
  }

  function setDigit(index: number, value: string) {
    setOtp((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function handleChange(index: number, raw: string) {
    setError(null);

    // Accept only digits
    const digit = raw.replace(/\D/g, "").slice(-1);
    setDigit(index, digit);

    if (digit && index < OTP_LENGTH - 1) focusIndex(index + 1);
  }

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    setError(null);

    if (e.key === "Backspace") {
      e.preventDefault();
      if (otp[index]) {
        setDigit(index, "");
        return;
      }
      if (index > 0) {
        setDigit(index - 1, "");
        focusIndex(index - 1);
      }
      return;
    }

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusIndex(index - 1);
      return;
    }

    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      e.preventDefault();
      focusIndex(index + 1);
      return;
    }

    // Prevent typing non-digits
    if (e.key.length === 1 && !/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;

    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];

    setOtp(next);
    focusIndex(Math.min(pasted.length, OTP_LENGTH - 1));
  }

  function formatTime(seconds: number) {
    const m = String(Math.floor(seconds / 60)).padStart(1, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  async function onSubmit() {
    setError(null);

    if (!isComplete) {
      setError("Please enter the full 6-digit code.");
      focusIndex(0);
      return;
    }

    try {
      setIsVerifying(true);
      await onVerify(otpValue);
    } catch {
      setError("Invalid code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  }

  async function onResendClick() {
    if (!onResend || timeLeft > 0) return;

    try {
      setIsResending(true);
      await onResend();
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeLeft(initialSeconds);
      focusIndex(0);
    } finally {
      setIsResending(false);
    }
  }

  return (
      <div className="max-h-screen p-4 mx-auto w-full rounded-2xl border-4 bg-white">
        {/* Logo */}
        <div className="absolute left-6 top-5 select-none text-2xl font-semibold">
          <span className="text-orange-500">Skill</span>
          <span className="text-sky-700">Swap</span>
          <span className="text-sky-700">.</span>
        </div>

        {/* Center content */}
        <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <h1 className="text-2xl font-bold text-neutral-900">
              Email Verification
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-neutral-500">
              Please enter the 6-digit verification code that was sent to{" "}
              <span className="font-medium text-neutral-700">{email}</span>. The
              code is valid for 10 minutes.
            </p>

            <div className="mt-5 flex justify-center gap-2">
              {otp.map((value, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  value={value}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  aria-label={`Verification code digit ${i + 1}`}
                  className="h-10 w-10 rounded-md border border-sky-300 bg-white text-center text-sm font-medium text-neutral-800 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 sm:h-11 sm:w-11"
                />
              ))}
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-neutral-500">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-600" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            {error ? (
              <p className="mt-3 text-xs text-red-600">{error}</p>
            ) : (
              <div className="mt-3" />
            )}

            <button
              type="button"
              onClick={onSubmit}
              disabled={isVerifying || !isComplete}
              className="mx-auto mt-2 block w-72 rounded-md bg-sky-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </button>

            <div className="mt-3 text-xs text-neutral-700">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={onResendClick}
                disabled={!onResend || timeLeft > 0 || isResending}
                className="font-semibold text-sky-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isResending ? "Resending..." : "Resend Code"}
              </button>
            </div>

            <div className="mt-2 text-[10px] text-neutral-500">
              Having trouble?{" "}
              <a className="hover:underline" href={`mailto:${supportEmail}`}>
                {supportEmail}
              </a>
            </div>
          </div>
        </div>
      </div>
   
  );
}
