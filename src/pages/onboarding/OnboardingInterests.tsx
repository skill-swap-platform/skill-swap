import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingLayout from './OnboardingLayout';
import { useSkillStore } from '../../store/useSkillStore';
import { skillService, userService } from '../../api/services/user.service';
import type { CategoryResponseDto } from '../../types/api.types';

import {
    Cpu,
    Settings,
    Palette,
    DollarSign,
    HeartPulse,
    User,
    Globe,
    Loader2
} from 'lucide-react';

const iconMap: Record<string, any> = {
    'Technology': <Cpu className="w-5 h-5" />,
    'Engineering': <Settings className="w-5 h-5" />,
    'UI/UX Design': <Palette className="w-5 h-5" />,
    'Finance': <DollarSign className="w-5 h-5" />,
    'Health': <HeartPulse className="w-5 h-5" />,
    'Personal': <User className="w-5 h-5" />,
};

const MOCK_CATEGORIES: CategoryResponseDto[] = [
    { id: '1', name: 'Technology', icon: '💻' },
    { id: '2', name: 'Engineering', icon: '⚙️' },
    { id: '3', name: 'UI/UX Design', icon: '🎨' },
    { id: '4', name: 'Finance', icon: '💰' },
    { id: '5', name: 'Health', icon: '🏥' },
    { id: '6', name: 'Personal', icon: '👤' },
];

const OnboardingInterests: React.FC = () => {
    const navigate = useNavigate();
    const { learningInterests, toggleLearningInterest } = useSkillStore();
    const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const response = await skillService.getCategories();
                if (response.success) {
                    setCategories(response.data);
                }
            } catch (error: any) {
                console.error('Failed to fetch categories:', error);
                if (error.response?.status === 401) {
                    console.warn('Unauthorized: Using mock categories for preview.');
                    setCategories(MOCK_CATEGORIES);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleNext = async () => {
        try {
            setIsSaving(true);
            const response = await userService.updateInterests(learningInterests);
            if (response.success) {
                navigate('/onboarding/teaching');
            }
        } catch (error) {
            console.error('Failed to save interests:', error);
            alert('Failed to save interests, please try again later.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSkip = () => {
        navigate('/onboarding/teaching');
    };

    return (
        <OnboardingLayout
            step={1}
            totalSteps={2}
            title="What are you interested in learning?"
            subtitle="Choose 3-5 interests"
            onNext={handleNext}
            onSkip={handleSkip}
            isNextDisabled={learningInterests.length < 3 || isSaving}
        >
            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-10 h-10 text-[#3E8FCC] animate-spin" />
                        <p className="text-gray-500">Loading categories...</p>
                    </div>
                ) : (
                    categories.map((cat) => {
                        const isSelected = learningInterests.includes(cat.id);
                        return (
                            <button
                                key={cat.id}
                                onClick={() => toggleLearningInterest(cat.id)}
                                className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left ${isSelected
                                    ? 'border-[#3E8FCC] bg-blue-50/50'
                                    : 'border-gray-100 bg-white hover:border-gray-200'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-md flex items-center justify-center ${isSelected ? 'bg-white text-[#3E8FCC]' : 'bg-gray-50 text-gray-500'
                                    }`}>
                                    {iconMap[cat.name] || (typeof cat.icon === 'string' ? <span>{cat.icon}</span> : <Globe className="w-5 h-5" />)}
                                </div>
                                <span className={`flex-1 font-semibold ${isSelected ? 'text-[#3E8FCC]' : 'text-gray-700'}`}>
                                    {cat.name}
                                </span>
                                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                                    ? 'border-[#3E8FCC] bg-[#3E8FCC] text-white'
                                    : 'border-gray-200'
                                    }`}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </OnboardingLayout>
    );
};

export default OnboardingInterests;
