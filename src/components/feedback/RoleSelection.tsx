import React, { useState } from 'react'
import { BookOpen, GraduationCap, Repeat, CheckCircle2 } from 'lucide-react'

type UserRole = 'teaching' | 'learning' | 'both'

interface RoleSelectionProps {
    onContinue: (role: UserRole) => void
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onContinue }) => {
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

    const roles = [
        {
            id: 'teaching' as const,
            title: 'I was teaching',
            description: 'I shared my skill with the other person.',
            icon: <BookOpen className="w-6 h-6" />,
        },
        {
            id: 'learning' as const,
            title: 'I was learning',
            description: 'I attended the session to learn a skill.',
            icon: <GraduationCap className="w-6 h-6" />,
        },
        {
            id: 'both' as const,
            title: 'Both teaching & learning',
            description: 'Skill exchange.',
            icon: <Repeat className="w-6 h-6" />,
        },
    ]

    return (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 max-w-lg w-full">
            <h2 className="text-xl font-bold text-gray-900 text-center mb-1">
                How did you participate in this session?
            </h2>
            <p className="text-sm text-gray-500 text-center mb-8">
                This helps us show you the right feedback form.
            </p>

            <div className="space-y-3 mb-8">
                {roles.map((role) => {
                    const isSelected = selectedRole === role.id
                    return (
                        <button
                            key={role.id}
                            onClick={() => setSelectedRole(role.id)}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${isSelected
                                ? 'border-[#3E8FCC] bg-[rgba(62,143,204,0.05)]'
                                : 'border-gray-100 hover:border-gray-200'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white text-[#3E8FCC] shadow-sm' : 'bg-gray-50 text-gray-400'
                                    }`}>
                                    {role.icon}
                                </div>
                                <div>
                                    <h3 className={`font-bold text-sm ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                                        {role.title}
                                    </h3>
                                    <p className="text-xs text-gray-500">{role.description}</p>
                                </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#3E8FCC] bg-[#3E8FCC]' : 'border-gray-300'
                                }`}>
                                {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </div>
                        </button>
                    )
                })}
            </div>

            <button
                onClick={() => selectedRole && onContinue(selectedRole)}
                disabled={!selectedRole}
                className={`w-full h-12 rounded-xl font-bold transition-all ${selectedRole
                    ? 'bg-[#3E8FCC] text-white hover:bg-[#2F71A3]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
            >
                Continue
            </button>
        </div>
    )
}
