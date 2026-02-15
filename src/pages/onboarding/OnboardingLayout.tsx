import React from 'react';
import DashboardPreview from '../../components/onboarding/DashboardPreview';

interface OnboardingLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    step?: number;
    totalSteps?: number;
    onBack?: () => void;
    onNext?: () => void;
    onSkip?: () => void;
    isNextDisabled?: boolean;
    hideStepHeader?: boolean;
    showPreview?: boolean;
    showFooter?: boolean;
    sideContent?: React.ReactNode;
    isExactSpec?: boolean;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
    children,
    step,
    totalSteps,
    title,
    subtitle,
    onBack,
    onNext,
    onSkip,
    isNextDisabled = false,
    hideStepHeader = false,
    showPreview = true,
    showFooter = true,
    sideContent,
    isExactSpec = false
}) => {
    const progress = totalSteps && step ? (step / totalSteps) * 100 : 0;

    if (isExactSpec) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center px-4 overflow-x-hidden font-inter">
                <header className="w-full max-w-[1280px] h-[84px] flex items-center shrink-0">
                    <div className="text-2xl font-poppins">
                        <span className="text-[#F59E0B] font-medium">Skill</span>
                        <span className="text-[#3E8FCC] font-bold">Swap</span>
                        <span className="text-[#F59E0B] font-bold">.</span>
                    </div>
                </header>

                <main className="w-full max-w-[1314px] flex-1 flex flex-col lg:flex-row items-center lg:items-start gap-[35px] mt-10 pb-10">
                    <div className="w-full max-w-[735px] min-h-[730px] bg-white border border-[#E5E7EB] rounded-[16px] shadow-sm flex flex-col items-center justify-center p-[20px_60px] shrink-0">
                        {children}
                    </div>

                    <div className="w-full max-w-[544px]">
                        {sideContent}
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-white">
            <div className={`flex-1 flex flex-col p-6 md:p-8 lg:p-12 relative ${!showPreview ? 'max-w-4xl mx-auto w-full' : ''}`}>
                <div className="mb-8">
                    <div className="text-2xl font-poppins font-bold">
                        <span className="text-[#F59E0B]">Skill</span>
                        <span className="text-[#3E8FCC]">Swap</span>
                        <span className="text-[#F59E0B]">.</span>
                    </div>
                </div>

                <div className={`w-full mx-auto flex-1 flex flex-col justify-center min-h-0 ${showPreview ? 'max-w-[480px]' : ''}`}>
                    <div className="mb-6 shrink-0">
                        {!hideStepHeader && step && totalSteps && (
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[#F59E0B] font-medium text-sm">Question {step} of {totalSteps}</span>
                                {onSkip && (
                                    <button
                                        onClick={onSkip}
                                        className="text-[#3E8FCC] hover:underline text-sm font-medium"
                                    >
                                        Skip
                                    </button>
                                )}
                            </div>
                        )}
                        {title && <h1 className="text-2xl font-bold text-[#0C0D0F] mb-1">{title}</h1>}
                        {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
                    </div>

                    <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-100 pr-2">
                        {children}
                    </div>

                    {showFooter && (
                        <div className="mt-8 shrink-0">
                            <div className="flex items-center gap-6">
                                <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#3E8FCC] transition-all duration-300 rounded-full"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    {step && totalSteps && (
                                        <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">
                                            Step {step}/{totalSteps}
                                        </span>
                                    )}

                                    <div className="flex gap-2">
                                        <button
                                            onClick={onBack}
                                            disabled={!onBack}
                                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-white text-gray-900"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="15 18 9 12 15 6" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={onNext}
                                            disabled={isNextDisabled || !onNext}
                                            className="w-10 h-10 rounded-full bg-[#1F2937] text-white flex items-center justify-center hover:bg-opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-lg"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="9 18 15 12 9 6" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showPreview && (
                <div className="hidden md:flex flex-1 bg-gradient-to-br from-[#B8C9D6] to-white relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-[92%] h-[92%] bg-white border-l border-t border-gray-100 shadow-2xl overflow-hidden pointer-events-none select-none origin-bottom-right">
                        <DashboardPreview />
                    </div>
                </div>
            )}
        </div>
    );
};

export default OnboardingLayout;
