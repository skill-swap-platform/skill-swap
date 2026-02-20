import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Star } from 'lucide-react';
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
            <main className="flex-1 py-8 px-4">
                <div className="max-w-[600px] mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <button
                            onClick={() => navigate('/profile')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <h1 className="text-base font-bold text-gray-900">My Skills</h1>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-gray-900">My Skills</h2>
                            <button
                                onClick={() => navigate('/profile/add-skill')}
                                className="flex items-center gap-1 text-sm text-[#3E8FCC] font-medium hover:underline"
                            >
                                <Plus className="w-4 h-4" />
                                Add
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-3 gap-3">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-white border border-gray-100 rounded-xl p-4 h-28 animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : skills.length === 0 ? (
                            <div className="bg-white border border-dashed border-gray-200 rounded-xl p-10 text-center">
                                <p className="text-gray-400 text-sm mb-3">No skills added yet</p>
                                <button
                                    onClick={() => navigate('/profile/add-skill')}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#3E8FCC] text-white text-sm font-bold rounded-xl hover:bg-[#2F71A3] transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add your first skill
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {skills.map((us) => {
                                    const initial = us.skill?.name?.[0]?.toUpperCase() || 'S';
                                    return (
                                        <button
                                            key={us.id}
                                            onClick={() => navigate(`/profile/skills/${us.id}`)}
                                            className="bg-white border border-gray-100 rounded-xl p-3 text-left hover:border-[#3E8FCC] hover:shadow-sm transition-all group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
                                                <span className="text-sm font-bold text-[#3E8FCC]">
                                                    {initial}
                                                </span>
                                            </div>
                                            <p className="text-xs font-semibold text-gray-800 truncate">
                                                {us.skill?.name}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1 mb-2">
                                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                                <span className="text-[10px] text-gray-500">
                                                    {rating.average.toFixed(1)}
                                                </span>
                                            </div>
                                            <div className="flex justify-end">
                                                <span className="text-gray-300 text-xs group-hover:text-[#3E8FCC]">
                                                    ›
                                                </span>
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
