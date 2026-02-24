import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { userService, skillService } from '@/api/services/user.service';
import { Loader2 } from 'lucide-react';

const LANGUAGES = [
    'English',
    'Arabic',
    'Spanish',
    'French',
    'German',
    'Mandarin',
    'Italian',
    'Portuguese',
];

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const SESSION_DURATIONS = [
    { label: '30 min', value: 30 }, { label: '45 min', value: 45 }, { label: '60 min', value: 60 },
];

const AddSkillProfile: React.FC = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const [description, setDescription] = useState('');
    const [language, setLanguage] = useState('English');
    const [showLanguagePanel, setShowLanguagePanel] = useState(false);
    const languageDropdownRef = useRef<HTMLDivElement | null>(null);
    const [skillLevel, setSkillLevel] = useState<string | null>('Beginner');
    const [sessionDuration, setSessionDuration] = useState<number | null>(60);
    const [allSkills, setAllSkills] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedSkill, setSelectedSkill] = useState<any>(null);
    const [isLoadingSkills, setIsLoadingSkills] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setIsLoadingSkills(true);
                const res = await skillService.getAllSkills();
                const raw = res?.data ?? res;
                const final = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
                setAllSkills(final);
            } catch (err) {
                console.error('Failed to fetch skills', err);
            } finally {
                setIsLoadingSkills(false);
            }
        };
        fetchAll();
    }, []);

    useEffect(() => {
        if (inputValue.length > 1 && !selectedSkill) {
            const filtered = allSkills.filter(s =>
                s.name.toLowerCase().includes(inputValue.toLowerCase())
            );
            setSearchResults(filtered.slice(0, 8));
        } else {
            setSearchResults([]);
        }
    }, [inputValue, selectedSkill, allSkills]);

    const isPublishDisabled = useMemo(() => {
        return !inputValue.trim() || !description.trim() || !language || !skillLevel || !sessionDuration;
    }, [inputValue, description, language, skillLevel, sessionDuration]);

    const handleBack = () => navigate('/profile/edit');

    const handlePublish = async () => {
        if (isPublishDisabled || isPublishing) return;

        try {
            setIsPublishing(true);
            setErrorMsg(null);

            let finalSkillId = selectedSkill?.id;

            if (!finalSkillId) {
                const match = allSkills.find(s => s.name.toLowerCase() === inputValue.trim().toLowerCase());
                if (match) {
                    finalSkillId = match.id;
                } else {
                    try {
                        const createRes = await skillService.createSkill(inputValue.trim());
                        const created = createRes.data?.data || createRes.data || createRes;
                        if (created?.id) {
                            finalSkillId = created.id;
                        } else {
                            throw new Error('Could not create or find this skill. Please select from the list.');
                        }
                    } catch (createErr) {
                        console.error('Skill creation failed:', createErr);
                        throw new Error('This skill doesn\'t exist in our list. Please pick an existing one or contact support.');
                    }
                }
            }

            const levelMap: Record<string, any> = {
                'Beginner': 'BEGINNER',
                'Intermediate': 'INTERMEDIATE',
                'Advanced': 'ADVANCED'
            };

            const response = await userService.addSkill({
                skillId: finalSkillId,
                level: levelMap[skillLevel || 'Beginner'] || 'BEGINNER',
                yearsOfExperience: 1,
                sessionLanguage: language,
                skillDescription: description
            });

            if (response.success) {
                navigate('/profile/edit');
            } else {
                setErrorMsg(response.message || 'Failed to add skill to your profile.');
            }

        } catch (err: any) {
            console.error('[AddSkillProfile] Publication failed:', err);
            setErrorMsg(err.message || 'An error occurred while publishing.');
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-light">
            <Header activeTab="Requests" />
            <div className="flex flex-1 flex-col items-center px-5 py-10">
                <div className="w-full max-w-[846px] rounded-[20px] bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-4">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
                            aria-label="Go back"
                        >
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <path d="M13.3333 26.6667L4.66663 18L13.3333 9.33334" stroke="#0C0D0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M27.3333 18H4.66663" stroke="#0C0D0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <h1 className="m-0 text-3xl font-bold text-[#0c0d0f]">Add a Skill</h1>
                    </div>

                    <form className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-sm font-semibold text-[#0c0d0f]">
                                Skill Title <span className="text-[#dc2626]">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(event) => {
                                        setInputValue(event.target.value);
                                        setSelectedSkill(null);
                                    }}
                                    placeholder="e.g. Mobile Photography Basics"
                                    className="h-12 w-full rounded-[10px] border border-[#e5e7eb] px-4 text-[14px] text-[#0c0d0f] placeholder:text-[#9ca3af] focus:border-[#3272a3] focus:outline-none"
                                />
                                {isLoadingSkills && <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-gray-400" />}
                            </div>

                            {searchResults.length > 0 && (
                                <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-20 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
                                    {searchResults.map((s) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => {
                                                setInputValue(s.name);
                                                setSelectedSkill(s);
                                                setSearchResults([]);
                                            }}
                                            className="w-full px-4 py-3 text-left hover:bg-gray-50 text-[14px] text-gray-800"
                                        >
                                            {s.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-[#0c0d0f]">Skill Description</label>
                            <textarea
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                placeholder="What will the learner gain? What topics will you cover?"
                                className="min-h-[120px] rounded-[10px] border border-[#e5e7eb] px-4 py-3 text-[14px] text-[#0c0d0f] placeholder:text-[#9ca3af] focus:border-[#3272a3] focus:outline-none resize-none"
                            />
                        </div>

                        <div className="flex flex-col gap-2" ref={languageDropdownRef}>
                            <label className="text-sm font-semibold text-[#0c0d0f]">Language</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowLanguagePanel((prev) => !prev)}
                                    className={`h-12 w-full rounded-[10px] border bg-white px-4 text-left text-[14px] focus:outline-none ${showLanguagePanel ? 'border-[#3272a3]' : 'border-[#e5e7eb]'
                                        } ${language ? 'text-[#0c0d0f]' : 'text-[#9ca3af]'}`}
                                >
                                    {language || 'Select Language'}
                                </button>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                                >
                                    <path d="M4 6L8 10L12 6" stroke="#0C0D0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {showLanguagePanel && (
                                    <div
                                        className="absolute left-0 right-0 bottom-full mb-2 z-10 rounded-[10px] bg-white border border-gray-100 py-2 shadow-xl max-h-48 overflow-y-auto"
                                    >
                                        {LANGUAGES.map((lang) => (
                                            <button
                                                key={lang}
                                                type="button"
                                                className={`flex w-full px-4 py-2 text-left text-[14px] text-[#0c0d0f] hover:bg-gray-50 ${lang === language ? 'font-semibold text-[#3272a3]' : ''
                                                    }`}
                                                onClick={() => {
                                                    setLanguage(lang);
                                                    setShowLanguagePanel(false);
                                                }}
                                            >
                                                {lang}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-semibold text-[#0c0d0f]">Skill Level</label>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                {SKILL_LEVELS.map((level) => {
                                    const isActive = skillLevel === level;
                                    return (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setSkillLevel(level)}
                                            className={`h-12 rounded-[12px] border text-[14px] font-medium transition-colors ${isActive ? 'border-[#3272a3] bg-[rgba(50,114,163,0.08)] text-[#0c0d0f]' : 'border-[#e5e7eb] bg-white text-[#666]'
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-semibold text-[#0c0d0f]">Session Duration</label>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                {SESSION_DURATIONS.map((duration) => {
                                    const isSelected = sessionDuration === duration.value;
                                    return (
                                        <button
                                            key={duration.value}
                                            type="button"
                                            onClick={() => setSessionDuration(duration.value)}
                                            className={`h-12 rounded-[12px] border text-[14px] font-medium transition-colors ${isSelected ? 'border-[#3272a3] bg-[rgba(50,114,163,0.08)] text-[#0c0d0f]' : 'border-[#e5e7eb] bg-white text-[#666]'
                                                }`}
                                        >
                                            {duration.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}

                        <div className="flex justify-end pt-4">
                            <button
                                type="button"
                                onClick={handlePublish}
                                disabled={isPublishDisabled || isPublishing}
                                className={`h-12 w-[160px] rounded-[10px] text-[16px] font-medium text-white transition-opacity flex items-center justify-center gap-2 ${isPublishDisabled || isPublishing ? 'bg-[#9ca3af] opacity-70 cursor-not-allowed' : 'bg-[#3272a3] hover:opacity-90'
                                    }`}
                            >
                                {isPublishing && <Loader2 className="w-4 h-4 animate-spin" />}
                                Publish
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AddSkillProfile;
