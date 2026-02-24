import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Star, ChevronRight } from 'lucide-react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { userService } from '@/api/services/user.service';
import type { UserSkill } from '@/types/api.types';

const MySkillsPage: React.FC = () => {
    const navigate = useNavigate();
    const [skills, setSkills] = useState<UserSkill[]>([]);
    const [rating, setRating] = useState({ average: 0, total: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileRes = await userService.getCurrentProfile();
                const userId = profileRes.data?.id;
                const [skillsRes, ratingRes] = await Promise.all([
                    userService.getUserSkills(),
                    userId ? userService.getProfileRating(userId) : Promise.resolve(null)
                ]);
                if (ratingRes?.success) {
                    setRating({
                        average: ratingRes.data.rating || 0,
                        total: ratingRes.data.totalFeedbacks || 0
                    });
                }

                const raw = skillsRes?.data ?? skillsRes;
                let final = Array.isArray(raw)
                    ? raw
                    : Array.isArray(raw?.offeredSkills)
                        ? raw.offeredSkills
                        : Array.isArray(raw?.data)
                            ? raw.data
                            : [];

                setSkills(final);
            } catch (err) {
                console.error('[MySkills] fetch error:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
            <Header />
            <main className="flex-1 py-10 px-4">
                <div className="max-w-[800px] mx-auto bg-white rounded-[24px] shadow-sm p-5 sm:p-8 min-h-[500px]">
                    <div className="flex items-center gap-3 mb-8">
                        <button
                            onClick={() => navigate('/profile')}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <h1 className="text-[22px] font-bold text-[#0C0D0F]">My Skills</h1>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-base font-bold text-gray-900">Active Skills</h2>
                            <button
                                onClick={() => navigate('/profile/add-skill')}
                                className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-[#3E8FCC] text-sm font-bold rounded-xl hover:bg-blue-100 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Add New
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-50 border border-gray-100 rounded-2xl p-4 h-32 animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : skills.length === 0 ? (
                            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-12 text-center">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <Plus className="w-8 h-8 text-gray-300" />
                                </div>
                                <p className="text-gray-400 text-sm mb-6">You haven't added any skills to your profile yet.</p>
                                <button
                                    onClick={() => navigate('/profile/add-skill')}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#3E8FCC] text-white text-[13px] font-bold rounded-xl hover:bg-[#2F71A3] transition-all shadow-md shadow-blue-100"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add your first skill
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {skills.map((us) => {
                                    const initial = us.skill?.name?.[0]?.toUpperCase() || 'S';
                                    return (
                                        <button
                                            key={us.id}
                                            onClick={() => navigate(`/profile/skills/${us.id}`)}
                                            className="bg-white border border-gray-100 rounded-2xl p-4 text-left hover:border-[#3E8FCC] hover:shadow-md transition-all group relative overflow-hidden"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                                <span className="text-base font-bold text-[#3E8FCC]">
                                                    {initial}
                                                </span>
                                            </div>
                                            <p className="text-sm font-bold text-gray-800 truncate mb-1">
                                                {us.skill?.name}
                                            </p>
                                            <div className="flex items-center gap-1 mb-4">
                                                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                                <span className="text-[11px] font-bold text-gray-500">
                                                    {rating.average.toFixed(1)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mt-auto">
                                                <span className="text-[10px] font-bold text-[#3E8FCC] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                                    View Details
                                                </span>
                                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#3E8FCC] transition-colors" />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MySkillsPage;
