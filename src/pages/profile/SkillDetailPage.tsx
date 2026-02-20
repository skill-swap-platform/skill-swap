import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Star, Globe, BarChart2, Clock, Trash2 } from 'lucide-react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { userService } from '@/api/services/user.service';
import type { UserSkill } from '@/types/api.types';

const LEVEL_LABEL: Record<string, string> = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    EXPERT: 'Advanced',
};

const SkillDetailPage: React.FC = () => {
    const { skillId } = useParams<{ skillId: string }>();
    const navigate = useNavigate();
    const [userSkill, setUserSkill] = useState<UserSkill | null>(null);
    const [rating, setRating] = useState({ average: 0, total: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
                let all: UserSkill[] = Array.isArray(raw)
                    ? raw
                    : Array.isArray(raw?.offeredSkills)
                        ? raw.offeredSkills
                        : Array.isArray(raw?.data)
                            ? raw.data
                            : [];
                if (all.length === 0 || !all.find(s => s.id === skillId)) {
                    const savedMock = localStorage.getItem(`skill_${skillId}`);
                    if (savedMock) {
                        all = [JSON.parse(savedMock)];
                    } else {
                        all = [{
                            id: 'mock-skill-1',
                            level: 'INTERMEDIATE',
                            yearsOfExperience: 2,
                            createdAt: new Date().toISOString(),
                            isOffering: true,
                            skill: {
                                id: 's1',
                                name: 'Python programming',
                                description: 'Learn the core concepts of Components, Props, and State Management using Hooks. By the end of this session, you will be able to build dynamic, interactive user interfaces and understand how to manage data flow efficiently in modern web applications.',
                                category: { id: 'cat1', name: 'Software' }
                            }
                        }];
                    }
                }

                const found = all.find((s) => s.id === skillId);
                setUserSkill(found || null);
            } catch (err) {
                console.error('[SkillDetail] fetch error:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [skillId]);

    const handleDelete = async () => {
        if (!userSkill) return;
        try {
            setIsDeleting(true);
            await userService.removeSkill(userSkill.id);
            navigate('/profile');
        } catch (err) {
            console.error('[SkillDetail] delete error:', err);
            alert('Failed to delete skill. Please try again.');
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F5F6FA] flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-[#3E8FCC] border-t-transparent rounded-full animate-spin" />
                </main>
                <Footer />
            </div>
        );
    }

    if (!userSkill) {
        return (
            <div className="min-h-screen bg-[#F5F6FA] flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-500 mb-4">Skill not found.</p>
                        <button
                            onClick={() => navigate('/profile/edit')}
                            className="px-5 py-2 bg-[#3E8FCC] text-white rounded-xl text-sm font-bold"
                        >
                            Back to Profile
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const initial = userSkill.skill?.name?.[0]?.toUpperCase() || 'S';

    return (
        <div className="min-h-screen bg-[#F5F6FA] flex flex-col font-sans">
            <Header />
            <main className="flex-1 py-10 px-4">
                <div className="max-w-[800px] mx-auto bg-white rounded-[24px] shadow-sm p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/profile')}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6 text-gray-800" />
                            </button>
                            <h1 className="text-[22px] font-bold text-[#0C0D0F]">
                                {userSkill.skill?.name}
                            </h1>
                        </div>
                        <button
                            onClick={() => navigate(`/profile/skills/${userSkill.id}/edit`)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100 shadow-sm"
                            title="Edit skill"
                        >
                            <Pencil className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                    <div className="border border-gray-100 rounded-2xl p-4 flex items-center gap-4 mb-8 bg-white">
                        <div className="w-14 h-14 rounded-xl bg-[#E3F2FD] flex items-center justify-center flex-shrink-0">
                            <span className="text-xl font-bold text-[#3E8FCC]">{initial}</span>
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-[#0C0D0F]">{userSkill.skill?.name}</h2>
                            <div className="flex items-center gap-1 mt-0.5">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="text-[13px] font-bold text-gray-800">
                                    {rating.average.toFixed(1)}
                                </span>
                                <span className="text-[12px] text-gray-400">({rating.total})</span>
                            </div>
                        </div>
                    </div>
                    <div className="mb-8">
                        <h3 className="text-[17px] font-bold text-[#0C0D0F] mb-4">Skill Description</h3>
                        <div className="border-l-[3px] border-[#3E8FCC] pl-5 py-1">
                            <p className="text-[13px] text-gray-500 leading-relaxed font-normal whitespace-pre-wrap">
                                {userSkill.skillDescription || userSkill.skill?.description ||
                                    `Learn the core concepts of this skill. By the end of this session, you will be able to master the essentials of ${userSkill.skill?.name}.`}
                            </p>
                        </div>
                    </div>
                    <div className="mb-10">
                        <h3 className="text-[17px] font-bold text-[#0C0D0F] mb-5">Session Details</h3>
                        <div className="space-y-3">
                            <DetailItem
                                icon={<Globe className="w-5 h-5 text-[#3E8FCC]" />}
                                label="Skill Language"
                                value={userSkill.sessionLanguage || 'English'}
                                color="bg-blue-50"
                            />
                            <DetailItem
                                icon={<BarChart2 className="w-5 h-5 text-[#3E8FCC]" />}
                                label="Skill Level"
                                value={LEVEL_LABEL[userSkill.level] || userSkill.level}
                                color="bg-blue-50"
                            />
                            <DetailItem
                                icon={<Clock className="w-5 h-5 text-[#3E8FCC]" />}
                                label="Session Duration"
                                value="60 min"
                                color="bg-blue-50"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            disabled={isDeleting}
                            className="px-10 py-2.5 border border-red-400 rounded-xl text-red-500 font-bold text-[13px] hover:bg-red-50 transition-all disabled:opacity-50"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete skill'}
                        </button>
                    </div>
                    {showDeleteConfirm && (
                        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl p-8 max-w-[400px] w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-5 mx-auto">
                                    <Trash2 className="w-6 h-6 text-red-500" />
                                </div>
                                <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
                                    Delete Skill?
                                </h3>
                                <p className="text-[13px] text-center text-gray-500 mb-8 leading-relaxed">
                                    Are you sure you want to delete{' '}
                                    <span className="font-bold text-gray-800">"{userSkill.skill?.name}"</span>?
                                    This action cannot be undone.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="flex-1 h-12 bg-gray-50 rounded-xl text-gray-600 font-bold text-[13px] hover:bg-gray-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="flex-1 h-12 bg-red-500 text-white rounded-xl font-bold text-[13px] hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isDeleting ? <Clock className="w-4 h-4 animate-spin" /> : 'Delete Skill'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

const DetailItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
}> = ({ icon, label, value, color }) => (
    <div className="flex items-center justify-between px-6 py-4 bg-white border border-gray-50 rounded-xl hover:border-blue-100 transition-all group">
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center transition-transform group-hover:scale-105`}>
                {icon}
            </div>
            <span className="text-[14px] font-bold text-gray-700">{label}</span>
        </div>
        <span className="text-[12px] font-semibold text-gray-400 bg-gray-50 px-4 py-1.5 rounded-full">
            {value}
        </span>
    </div>
);

export default SkillDetailPage;
