import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api/services/auth.service';
import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setIsLoading(true);

        try {
            const response = await authService.signup(formData);
            if (response.success) {
                setIsSuccess(true);
                setTimeout(() => navigate('/onboarding/interests'), 2000);
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4 font-inter">
                <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 p-8 md:p-10 text-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
                    <p className="text-gray-500">Welcome to SkillSwap! Redirecting you to set up your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4 font-inter">
            <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 p-8 md:p-10">
                <div className="text-center mb-10">
                    <div className="text-3xl font-poppins mb-3">
                        <span className="text-[#F59E0B] font-medium">Skill</span>
                        <span className="text-[#3E8FCC] font-bold">Swap</span>
                        <span className="text-[#F59E0B] font-bold">.</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-gray-500 mt-2 text-sm">Join our community of skilled people</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                required
                                value={formData.userName}
                                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                placeholder="John Doe"
                                className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#3E8FCC] focus:ring-2 focus:ring-blue-50 outline-none transition-all text-sm text-gray-900"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="name@email.com"
                                className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#3E8FCC] focus:ring-2 focus:ring-blue-50 outline-none transition-all text-sm text-gray-900"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#3E8FCC] focus:ring-2 focus:ring-blue-50 outline-none transition-all text-sm text-gray-900"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="••••••••"
                                className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#3E8FCC] focus:ring-2 focus:ring-blue-50 outline-none transition-all text-sm text-gray-900"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-[#3E8FCC] hover:bg-blue-600 text-white rounded-xl font-bold transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-blue-100 mt-2 text-sm"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-50 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/auth/login" className="font-bold text-[#3E8FCC] hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
