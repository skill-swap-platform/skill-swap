import React from 'react'

interface SecondRolePromptProps {
    onContinue: () => void
    onSkip: () => void
}

export const SecondRolePrompt: React.FC<SecondRolePromptProps> = ({ onContinue, onSkip }) => {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-white rounded-xl p-10 border border-gray-100 shadow-lg max-w-md w-full text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Would you like to give feedback for your other role as well?
                </h2>

                <div className="flex gap-4 mt-8">
                    <button
                        onClick={onSkip}
                        className="flex-1 h-12 rounded-xl border-2 border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition-all"
                    >
                        Skip
                    </button>
                    <button
                        onClick={onContinue}
                        className="flex-1 h-12 rounded-xl bg-[#3E8FCC] text-white font-bold hover:bg-[#2F71A3] transition-all shadow-sm"
                    >
                        Yes, Continue
                    </button>
                </div>
            </div>
        </div>
    )
}
