// src/pages/auth/SignUpPage.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import rightImage from "@/assets/auth/right-container.png";
import { authService } from "@/api/services/auth.service";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = {
    email?: string;
    password?: string;
    confirmPassword?: string;
    form?: string;
};

const PENDING_KEY = "pending_signup_v1";

export default function SignUpPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<FieldErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const canSubmit =
        formData.email.trim() && formData.password.trim() && formData.confirmPassword.trim();

    const validate = () => {
        const next: FieldErrors = {};
        const email = formData.email.trim();
        const password = formData.password;

        if (!emailRegex.test(email)) next.email = "Please enter a valid email address";
        if (!password.trim()) next.password = "Please enter a valid password";
        if (formData.confirmPassword !== password)
            next.confirmPassword = "Passwords do not match";

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        if (!validate()) return;

        const email = formData.email.trim();
        const password = formData.password;

        try {
            setIsSubmitting(true);

            const res = await authService.signup({
                email,
                password,
                confirmPassword: formData.confirmPassword,
            });

            if (!res.success) {
                setErrors({ form: res.message || "Registration failed" });
                return;
            }

            // خزّن مؤقتًا عشان نعمل login بعد verify
            sessionStorage.setItem(
                PENDING_KEY,
                JSON.stringify({ email, password, createdAt: Date.now() }),
            );

            navigate("/auth/verify-email", { replace: true });
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
                        <div className="mb-8">
                            <span className="text-sm font-semibold tracking-tight">
                                <span className="text-orange-500">Skill</span>
                                <span className="text-blue-600">Swap</span>
                                <span className="text-blue-600">.</span>
                            </span>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
                            <h1 className="text-center text-xl font-bold text-gray-900">
                                Connect with people, exchange knowledge,
                                <br className="hidden sm:block" /> and grow together
                            </h1>

                            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                {errors.form ? (
                                    <p className="rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                                        {errors.form}
                                    </p>
                                ) : null}

                                <Field label="Email" required htmlFor="email">
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        value={formData.email}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            setFormData((p) => ({ ...p, email: v }));
                                            setErrors((p) => ({ ...p, email: undefined, form: undefined }));
                                        }}
                                        placeholder="user@gmail.com"
                                        className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10"
                                    />
                                    {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
                                </Field>

                                <Field label="Password" required htmlFor="password">
                                    <input
                                        id="password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={formData.password}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            setFormData((p) => ({ ...p, password: v }));
                                            setErrors((p) => ({ ...p, password: undefined, form: undefined }));
                                        }}
                                        placeholder="••••••••"
                                        className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10"
                                    />
                                    {errors.password ? (
                                        <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                                    ) : null}
                                </Field>

                                <Field label="Confirm Password" required htmlFor="confirmPassword">
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            setFormData((p) => ({ ...p, confirmPassword: v }));
                                            setErrors((p) => ({ ...p, confirmPassword: undefined, form: undefined }));
                                        }}
                                        placeholder="••••••••"
                                        className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10"
                                    />
                                    {errors.confirmPassword ? (
                                        <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                                    ) : null}
                                </Field>

                                <button
                                    type="submit"
                                    disabled={!canSubmit || isSubmitting}
                                    className="mt-2 h-11 w-full rounded-md bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting ? "Creating..." : "Continue"}
                                </button>

                                <div className="pt-2 text-center text-xs text-gray-600">
                                    <span>Already have an account? </span>
                                    <Link to="/auth/login" className="font-semibold text-blue-600 hover:underline">
                                        Sign in
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                {/* RIGHT */}
                <aside className="relative hidden lg:block">
                    <img src={rightImage} alt="SkillSwap collage" className="h-full w-full object-cover" />
                </aside>
            </div>
        </main>
    );
}

function Field({
    label,
    required,
    htmlFor,
    children,
}: {
    label: string;
    required?: boolean;
    htmlFor: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label htmlFor={htmlFor} className="mb-1 block text-xs font-semibold text-gray-700">
                {label} {required ? <span className="text-red-500">*</span> : null}
            </label>
            {children}
        </div>
    );
}
