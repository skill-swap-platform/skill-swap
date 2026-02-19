import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingLayout from './OnboardingLayout';
import { useSkillStore } from '../../store/useSkillStore';
import { userService, skillService } from '../../api/services/user.service';
import { Loader2, Search } from 'lucide-react';

const popularSkills = [
    'JavaScript', 'Python', 'React',
    'UI/UX Design', 'Data Science', 'English',
    'Marketing', 'Photography', 'Cooking'
];

const OnboardingTeaching: React.FC = () => {
    const navigate = useNavigate();
    const { teachingSkill, setTeachingSkill } = useSkillStore();
    const [inputValue, setInputValue] = useState(teachingSkill);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [allBackendSkills, setAllBackendSkills] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<any>(null);

    useEffect(() => {
        const fetchAllSkills = async () => {
            try {
                const response = await skillService.getAllSkills();
                // Swagger photo shows an array of skills coming back
                if (Array.isArray(response)) {
                    setAllBackendSkills(response);
                } else if (Array.isArray(response?.data)) {
                    setAllBackendSkills(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch all skills:', error);
            }
        };
        fetchAllSkills();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (inputValue.length > 2 && !selectedSkill) {
                try {
                    setIsSearching(true);
                    const response = await skillService.searchSkills(inputValue);

                    const results = Array.isArray(response) ? response :
                        (Array.isArray(response?.data) ? response.data : []);

                    if (results.length > 0) {
                        setSearchResults(results);

                        const exactMatch = results.find((s: any) => s.name.toLowerCase() === inputValue.toLowerCase());
                        if (exactMatch) {
                            setSelectedSkill(exactMatch);
                        }
                    } else {
                        const customSkill = {
                            id: `custom-${Date.now()}`,
                            name: inputValue,
                            category: { name: 'Custom' }
                        };
                        setSearchResults([customSkill]);
                    }
                } catch (error: any) {
                    console.error('Skill search failed:', error);
                    const mockSkill = {
                        id: `custom-${inputValue.toLowerCase()}`,
                        name: inputValue,
                        category: { name: 'General' }
                    };
                    setSearchResults([mockSkill]);
                    if (inputValue.length > 2) {
                        setSelectedSkill(mockSkill);
                    }
                } finally {
                    setIsSearching(false);
                }
            } else if (inputValue.length <= 2) {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [inputValue, selectedSkill, navigate]);

    const handleNext = async () => {
        if (!selectedSkill) {
            alert('Please select a skill from the list');
            return;
        }

        try {
            setIsSaving(true);

            let finalSkillId = selectedSkill.id;
            const isTempId = typeof finalSkillId === 'string' && (
                finalSkillId.startsWith('temp-') ||
                finalSkillId.startsWith('custom-') ||
                finalSkillId.startsWith('mock-')
            );

            if (isTempId) {
                try {
                    const createResponse = await skillService.createSkill(selectedSkill.name);
                    if (createResponse?.success && createResponse?.data?.id) {
                        finalSkillId = createResponse.data.id;
                    }
                } catch (createError: any) {
                    console.error('Failed to create skill in backend:', createError);

                }
            }

            const response = await userService.addSkill({
                skillId: finalSkillId,
                level: 'BEGINNER',
                yearsOfExperience: 1,
                isOffering: true
            });

            if (response.success) {
                setTeachingSkill(selectedSkill.name);
                navigate('/onboarding/profile');
            }
        } catch (error: any) {
            console.error('Failed to add skill:', error);

            if (error.response?.status === 404 || error.response?.status === 401) {
                console.warn('Backend error (404/401). Proceeding with simulation for onboarding flow.');
                setTeachingSkill(selectedSkill.name);
                navigate('/onboarding/profile');
            } else {
                alert('Failed to add skill, please try again later.');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleBack = () => {
        navigate('/onboarding/interests');
    };

    const handleSkillSelect = (skill: any) => {
        setInputValue(skill.name);
        setSelectedSkill(skill);
        setSearchResults([]);
    };

    const handlePopularSkillClick = (skillName: string) => {
        setInputValue(skillName);
        const existingSkill = allBackendSkills.find(
            s => s.name.toLowerCase() === skillName.toLowerCase()
        );

        if (existingSkill) {
            setSelectedSkill(existingSkill);
        } else {
            setSelectedSkill({
                id: `temp-${Date.now()}`,
                name: skillName,
                category: { name: 'General' }
            });
        }
    };

    return (
        <OnboardingLayout
            step={2}
            totalSteps={2}
            title="What skill can you teach?"
            subtitle="Add one skill to get started!"
            onNext={handleNext}
            onBack={handleBack}
            onSkip={() => navigate('/onboarding/profile')}
            isNextDisabled={!selectedSkill || isSaving}
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
                            }}
                            placeholder="Type to search skills (e.g. JavaScript)"
                            className="w-full h-14 pl-12 pr-12 rounded-lg border border-gray-200 focus:border-[#3E8FCC] focus:ring-1 focus:ring-[#3E8FCC] outline-none transition-all"
                        />
                        {(isSearching || isSaving) && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3E8FCC]">
                                <Loader2 className="w-5 h-5 animate-spin" />
                            </div>
                        )}

                        {searchResults.length > 0 && !selectedSkill && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                {searchResults.map((skill) => (
                                    <button
                                        key={skill.id}
                                        onClick={() => handleSkillSelect(skill)}
                                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between group"
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-900">{skill.name}</p>
                                            <p className="text-xs text-gray-500">{skill.category?.name}</p>
                                        </div>
                                        <span className="text-xs text-[#3E8FCC] opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-gray-900">Popular skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {popularSkills.map((skill) => (
                            <button
                                key={skill}
                                onClick={() => handlePopularSkillClick(skill)}
                                className={`px-4 py-2 rounded-full border border-gray-200 text-sm font-medium transition-all hover:border-[#3E8FCC] hover:text-[#3E8FCC] ${inputValue === skill ? 'bg-blue-50 border-[#3E8FCC] text-[#3E8FCC]' : 'bg-white text-gray-600'
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
