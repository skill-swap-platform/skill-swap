import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingLayout from './OnboardingLayout';
import { useSkillStore } from '../../store/useSkillStore';
import { userService, skillService } from '../../api/services/user.service';
import { Loader2, Search } from 'lucide-react';

const popularSkills = [
    'React', 'Photography', 'JavaScript',
    'English', 'Python',
    'Node.js', 'Axios', 'Database Integration'
];

const OnboardingTeaching: React.FC = () => {
    const navigate = useNavigate();
    const { teachingSkill, setTeachingSkill } = useSkillStore();
    const [inputValue, setInputValue] = useState(teachingSkill);
    const [allSkills, setAllSkills] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isLoadingSkills, setIsLoadingSkills] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    useEffect(() => {
        const fetchAllSkills = async () => {
            try {
                setIsLoadingSkills(true);
                const response = await skillService.getAllSkills();
                const rawData = response?.data ?? response;
                const finalData = Array.isArray(rawData) ? rawData : (rawData?.data && Array.isArray(rawData.data) ? rawData.data : []);

                if (finalData.length > 0) {
                    setAllSkills(finalData);
                }
            } catch (error) {
                console.error('Failed to fetch skills:', error);
            } finally {
                setIsLoadingSkills(false);
            }
        };
        fetchAllSkills();
    }, []);
    useEffect(() => {
        if (inputValue.length > 1 && !selectedSkill) {
            const filtered = allSkills.filter((s: any) =>
                s?.name?.toLowerCase().includes(inputValue.toLowerCase())
            );
            setSearchResults(filtered.slice(0, 10));
        } else {
            setSearchResults([]);
        }
    }, [inputValue, selectedSkill, allSkills]);

    const handlePopularSkillClick = (skillName: string) => {
        setInputValue(skillName);
        setErrorMsg(null);
        const match = allSkills.find(
            (s: any) => s?.name?.toLowerCase() === skillName.toLowerCase()
        );
        if (match) {
            setSelectedSkill(match);
            setSearchResults([]);
        } else {
            setSelectedSkill({ id: `temp-${Date.now()}`, name: skillName, category: { name: 'General' } });
        }
    };

    const handleSkillSelect = (skill: any) => {
        setInputValue(skill.name);
        setSelectedSkill(skill);
        setSearchResults([]);
        setErrorMsg(null);
    };

    const handleNext = async () => {
        if (!selectedSkill) {
            setErrorMsg('Please select a skill first.');
            return;
        }

        setIsSaving(true);
        setErrorMsg(null);

        try {
            let finalSkillId = selectedSkill.id;
            if (typeof finalSkillId === 'string' && (finalSkillId.startsWith('temp-') || finalSkillId.startsWith('custom-'))) {
                const createRes = await skillService.createSkill(selectedSkill.name);
                const created = createRes.data?.data || createRes.data || createRes;
                if (created?.id) {
                    finalSkillId = created.id;
                } else {
                    throw new Error('Skill was not created properly on the server.');
                }
            }
            const response = await userService.addSkill({
                skillId: finalSkillId,
                level: 'BEGINNER',
                yearsOfExperience: 1,
            });

            if (response.success) {
                setTeachingSkill(selectedSkill.name);
                navigate('/onboarding/profile');
            } else {
                setErrorMsg(response.message || 'Failed to add skill.');
            }
        } catch (error: any) {
            console.error('Flow Error:', error);
            const errMsg = error.response?.data?.message || error.message || 'Server error occurred';
            setErrorMsg(`Error: ${errMsg}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleBack = () => navigate('/onboarding/interests');

    return (
        <OnboardingLayout
            step={2}
            totalSteps={2}
            title="What skill can you teach?"
            subtitle="Add one skill to get started!"
            onNext={handleNext}
            onBack={handleBack}
            onSkip={() => navigate('/onboarding/profile')}
            isNextDisabled={!selectedSkill?.id || isSaving}
        >
            <div className="space-y-8">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Skill*</label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                setSelectedSkill(null);
                                setErrorMsg(null);
                            }}
                            placeholder={isLoadingSkills ? 'Loading skills...' : 'Type to search skills (e.g. JavaScript)'}
                            disabled={isLoadingSkills}
                            className="w-full h-14 pl-12 pr-12 rounded-lg border border-gray-200 focus:border-[#3E8FCC] focus:ring-1 focus:ring-[#3E8FCC] outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                        {(isLoadingSkills || isSaving) && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3E8FCC]">
                                <Loader2 className="w-5 h-5 animate-spin" />
                            </div>
                        )}

                        {searchResults.length > 0 && !selectedSkill && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                {searchResults.map((skill, index) => (
                                    <button
                                        key={skill.id ?? index}
                                        onClick={() => handleSkillSelect(skill)}
                                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between group"
                                    >
                                        <p className="font-semibold text-gray-900">{skill.name}</p>
                                        <span className="text-xs text-[#3E8FCC] opacity-0 group-hover:opacity-100 transition-opacity">
                                            Select
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {errorMsg && (
                        <p className="text-sm text-red-500 mt-1">{errorMsg}</p>
                    )}
                    {selectedSkill?.id && (
                        <p className="text-sm text-green-600 mt-1">✓ "{selectedSkill.name}" selected</p>
                    )}
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-gray-900">Popular skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {popularSkills.map((skill) => (
                            <button
                                key={skill}
                                onClick={() => handlePopularSkillClick(skill)}
                                className={`px-4 py-2 rounded-full border border-gray-200 text-sm font-medium transition-all hover:border-[#3E8FCC] hover:text-[#3E8FCC] ${inputValue === skill
                                    ? 'bg-blue-50 border-[#3E8FCC] text-[#3E8FCC]'
                                    : 'bg-white text-gray-600'
                                    }`}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </OnboardingLayout>
    );
};

export default OnboardingTeaching;