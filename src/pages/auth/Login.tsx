import React from "react";

import rightImage from "@/assets/auth/right-container.png";
import Brand from "@/components/Auth/Brand";
import { Link } from "react-router-dom";

type Provider = "google" | "facebook" | "apple";

export default function LoginPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: login submit
  };

  const onSocial = (provider: Provider) => {
    // TODO: social login
    console.log(provider);
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
                Welcome back
              </h1>
              <p className="mt-1 text-center text-sm text-gray-600">
                Sign in to continue
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
                    className="
                      h-14 w-full rounded-xl border border-gray-300 px-5
                      text-lg text-gray-900 outline-none transition
                      focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10
                    "
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-base font-semibold text-gray-900"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="
                      h-14 w-full rounded-xl border border-gray-300 px-5
                      text-lg text-gray-900 outline-none transition
                      focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10
                    "
                  />
                </div>

                {/* Remember / Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-base text-gray-600">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    Remember me?
                  </label>

                  <a
                    href="#"
                    className="text-base text-gray-600 hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>

                {/* Divider */}
                <div className="pt-2">
                  <div className="relative">
                    <div className="h-px w-full bg-gray-200" />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-gray-500">
                      or
                    </span>
                  </div>
                </div>

                {/* Social */}
                <div className="space-y-3">
                  <SocialButton
                    label="Sign in with Google"
                    onClick={() => onSocial("google")}
                    icon={<GoogleIcon />}
                  />
                  <SocialButton
                    label="Sign in with Facebook"
                    onClick={() => onSocial("facebook")}
                    icon={<FacebookIcon />}
                  />
                  <SocialButton
                    label="Sign in with Apple"
                    onClick={() => onSocial("apple")}
                    icon={<AppleIcon />}
                  />
                </div>

                {/* Continue */}
                <button
                  type="submit"
                  className="h-11 w-full rounded-md bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30"
                >
                  Continue
                </button>

                {/* Footer */}
                <div className="pt-2 text-center text-xs text-gray-600">
                  <span>Don’t have an account? </span>
                  <Link
                    to={"/auth/register"}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Sign up
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

/* -------------------- Social Button -------------------- */

function SocialButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group h-10 w-full rounded-md border border-gray-300 bg-white px-4
        text-sm font-semibold text-gray-800 shadow-sm transition
        hover:bg-gray-50 active:bg-gray-100
        focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10
      "
      aria-label={label}
    >
      <div className="grid h-full grid-cols-[24px_1fr_24px] items-center">
        <span className="flex items-center justify-start" aria-hidden="true">
          {icon}
        </span>
        <span className="text-center">{label}</span>
        <span aria-hidden="true" />
      </div>
    </button>
  );
}

/* -------------------- Icons -------------------- */

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" fill="none" {...props}>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.73 32.659 29.273 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.963 3.037l5.657-5.657C34.067 6.053 29.267 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917Z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691 12.88 19.51C14.656 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.963 3.037l5.657-5.657C34.067 6.053 29.267 4 24 4 16.318 4 9.655 8.337 6.306 14.691Z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.164 0 9.86-1.977 13.391-5.193l-6.18-5.226C29.137 35.091 26.705 36 24 36c-5.252 0-9.695-3.317-11.283-7.946l-6.525 5.025C9.505 39.556 16.227 44 24 44Z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a11.96 11.96 0 0 1-4.092 5.581l.003-.002 6.18 5.226C36.957 39.205 44 34 44 24c0-1.341-.138-2.651-.389-3.917Z"
      />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      {...props}
      aria-hidden="true"
    >
      <path
        fill="#1877F2"
        d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89H8.078V12h2.36V9.797c0-2.33 1.388-3.62 3.513-3.62.99 0 2.026.177 2.026.177v2.234h-1.141c-1.124 0-1.474.697-1.474 1.413V12h2.507l-.401 2.89h-2.106v6.989C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10Z"
      />
    </svg>
  );
}

function AppleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      {...props}
      aria-hidden="true"
    >
      <path
        fill="#000"
        d="M16.365 1.43c0 1.14-.417 2.205-1.252 3.08-.895.933-2.36 1.654-3.627 1.55-.162-1.097.32-2.25 1.168-3.13.878-.92 2.39-1.6 3.711-1.5ZM20.5 17.36c-.52 1.2-.77 1.73-1.44 2.79-.93 1.45-2.24 3.26-3.87 3.27-1.45.01-1.83-.95-3.79-.94-1.96.01-2.38.96-3.83.95-1.63-.02-2.87-1.65-3.8-3.09-2.6-4.02-2.87-8.74-1.27-11.2 1.14-1.76 2.94-2.79 4.63-2.79 1.72 0 2.8.96 4.22.96 1.38 0 2.22-.97 4.2-.97 1.5 0 3.09.84 4.23 2.29-3.71 2.07-3.11 7.42.72 8.73Z"
      />
    </svg>
  );
}
