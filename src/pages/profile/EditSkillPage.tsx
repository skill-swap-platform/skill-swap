import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { userService } from '@/api/services/user.service';
import type { UserSkill } from '@/types/api.types';

const LANGUAGES = ['English', 'Arabic', 'French', 'Spanish', 'German', 'Other'];
const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;
const LEVEL_LABELS: Record<string, string> = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced',
};
const DURATIONS = [30, 45, 60];

const EditSkillPage: React.FC = () => {
    const { skillId } = useParams<{ skillId: string }>();
    const navigate = useNavigate();
    const [userSkill, setUserSkill] = useState<UserSkill | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [form, setForm] = useState({
        title: '',
        description: '',
        language: 'English',
        level: 'INTERMEDIATE' as string,
        duration: 60,
    });

    useEffect(() => {
        const fetchSkill = async () => {
            try {
                const res = await userService.getUserSkills();
                const raw = res?.data ?? res;
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

                const found = all.find((s) => s.id === skillId || s.skill?.id === skillId);
                if (found) {
                    setUserSkill(found);
                    setForm({
                        title: found.skill?.name || '',
                        description: found.skillDescription || found.skill?.description || '',
                        language: found.sessionLanguage || 'English',
                        level: found.level || 'BEGINNER',
                        duration: 60, // Default for now
                    });
                }
            } catch (err) {
                console.error('[EditSkill] fetch error:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSkill();
    }, [skillId]);

    const handleSave = async () => {
        if (!userSkill) return;
        try {
            setIsSaving(true);
            await userService.updateUserSkill(userSkill.skill.id, {
                level: form.level,
                sessionLanguage: form.language,
                skillDescription: form.description
            });
            if (skillId?.startsWith('mock-')) {
                const updatedMock = {
                    ...userSkill,
                    level: form.level,
                    sessionLanguage: form.language,
                    skillDescription: form.description,
                    skill: {
                        ...userSkill.skill,
                        name: form.title,
                        description: form.description
                    }
                };
                localStorage.setItem(`skill_${skillId}`, JSON.stringify(updatedMock));
            }

            console.log('[EditSkill] Saved successfully');
            navigate(`/profile/skills/${userSkill.id}`, { replace: true });
        } catch (err: any) {
            console.error('[EditSkill] save error:', err);
            if (skillId?.startsWith('mock-')) {
                navigate(`/profile/skills/${skillId}`, { replace: true });
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
            <Header />
            <main className="flex-1 py-8 px-4">
                <div className="max-w-[600px] mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-5 sm:p-8 min-h-[500px]">
                        <div className="flex items-center gap-3 mb-8">
                            <button
                                onClick={() => navigate(`/profile/skills/${skillId}`)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-700" />
                            </button>
                            <h1 className="text-lg font-bold text-gray-900">
                                {isLoading ? (
                                    <div className="h-7 w-48 bg-gray-100 animate-pulse rounded" />
                                ) : (
                                    userSkill?.skill?.name || 'Edit Skill'
                                )}
                            </h1>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Skill Title
                                </label>
                                {isLoading ? (
                                    <div className="h-12 w-full bg-gray-50 border border-gray-100 rounded-xl animate-pulse" />
                                ) : (
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                                        className="w-full h-12 px-4 border border-gray-100 rounded-xl bg-gray-50/50 text-sm text-gray-800 outline-none focus:border-[#3E8FCC] focus:bg-white transition-all shadow-sm"
                                        placeholder="e.g. Python programming"
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Skill Description
                                </label>
                                {isLoading ? (
                                    <div className="h-32 w-full bg-gray-50 border border-gray-100 rounded-xl animate-pulse" />
                                ) : (
                                    <textarea
                                        value={form.description}
                                        onChange={(e) =>
                                            setForm((p) => ({ ...p, description: e.target.value }))
                                        }
                                        rows={5}
                                        className="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50/50 text-sm text-gray-600 outline-none focus:border-[#3E8FCC] focus:bg-white resize-none transition-all shadow-sm"
                                        placeholder="Describe what you'll teach..."
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Language
                                </label>
                                {isLoading ? (
                                    <div className="h-12 w-full bg-gray-50 border border-gray-100 rounded-xl animate-pulse" />
                                ) : (
                                    <div className="relative">
                                        <select
                                            value={form.language}
                                            onChange={(e) =>
                                                setForm((p) => ({ ...p, language: e.target.value }))
                                            }
                                            className="w-full h-12 px-4 border border-gray-100 rounded-xl bg-gray-50/50 text-sm text-gray-800 outline-none focus:border-[#3E8FCC] focus:bg-white appearance-none cursor-pointer transition-all shadow-sm"
                                        >
                                            {LANGUAGES.map((lang) => (
                                                <option key={lang} value={lang}>
                                                    {lang}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M6 9L12 15L18 9" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Skill Level
                                </label>
                                {isLoading ? (
                                    <div className="grid grid-cols-3 gap-3">
                                        {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-50 border border-gray-100 rounded-xl animate-pulse" />)}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-3">
                                        {LEVELS.map((lvl) => (
                                            <button
                                                key={lvl}
                                                onClick={() => setForm((p) => ({ ...p, level: lvl }))}
                                                className={`h-12 rounded-xl border-2 text-[13px] font-bold transition-all shadow-sm ${form.level === lvl
                                                    ? 'border-[#3E8FCC] text-[#3E8FCC] bg-blue-50/50'
                                                    : 'border-gray-50 text-gray-400 bg-white hover:border-gray-100'
                                                    }`}
                                            >
                                                {LEVEL_LABELS[lvl]}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Session Duration
                                </label>
                                {isLoading ? (
                                    <div className="grid grid-cols-3 gap-3">
                                        {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-50 border border-gray-100 rounded-xl animate-pulse" />)}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-3">
                                        {DURATIONS.map((dur) => (
                                            <button
                                                key={dur}
                                                onClick={() => setForm((p) => ({ ...p, duration: dur }))}
                                                className={`h-12 rounded-xl border-2 text-[13px] font-bold transition-all shadow-sm ${form.duration === dur
                                                    ? 'border-[#3E8FCC] text-[#3E8FCC] bg-blue-50/50'
                                                    : 'border-gray-50 text-gray-400 bg-white hover:border-gray-100'
                                                    }`}
                                            >
                                                {dur} min
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={isLoading || isSaving || !form.title.trim()}
                                className="w-full h-12 bg-[#1F2937] hover:bg-[#111827] text-white rounded-xl font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 shadow-md hover:shadow-lg active:scale-[0.98]"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default EditSkillPage;
