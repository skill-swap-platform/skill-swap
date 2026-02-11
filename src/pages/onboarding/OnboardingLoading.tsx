import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OnboardingLoading: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/dashboard');
        }, 2500);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
            <div className="text-2xl font-poppins font-bold absolute top-12 left-12">
                <span className="text-[#F59E0B]">Skill</span>
                <span className="text-[#3E8FCC]">Swap</span>
                <span className="text-[#F59E0B]">.</span>
            </div>

            <div className="text-center max-w-[400px]">
                <h1 className="text-2xl font-bold text-[#0C0D0F] mb-2">Setting up your personalized experience</h1>
                <p className="text-gray-500 mb-8">This won't take long</p>

                <div className="flex justify-center">
                    <div className="w-12 h-12 border-4 border-gray-100 border-t-[#3E8FCC] rounded-full animate-spin"></div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingLoading;
