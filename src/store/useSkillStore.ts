import { create } from 'zustand'

interface SkillStore {
    learningInterests: string[]
    teachingSkill: string
    profile: {
        full_name: string
        bio: string
        availability: string
        location: string
        avatar: string | null
    }

    toggleLearningInterest: (interest: string) => void
    setTeachingSkill: (skill: string) => void
    updateProfile: (data: Partial<SkillStore['profile']>) => void
    clearSkills: () => void
}

export const useSkillStore = create<SkillStore>((set) => ({
    learningInterests: [],
    teachingSkill: '',
    profile: {
        full_name: '',
        bio: '',
        availability: 'Flexible',
        location: 'Palestine',
        avatar: null
    },

    toggleLearningInterest: (interest) => set((state) => {
        const isSelected = state.learningInterests.includes(interest)
        if (isSelected) {
            return { learningInterests: state.learningInterests.filter((i) => i !== interest) }
        } else {
            if (state.learningInterests.length >= 5) return state
            return { learningInterests: [...state.learningInterests, interest] }
        }
    }),

    setTeachingSkill: (skill) => set({ teachingSkill: skill }),

    updateProfile: (data) => set((state) => ({
        profile: { ...state.profile, ...data }
    })),

    clearSkills: () => set({
        learningInterests: [],
        teachingSkill: '',
        profile: { full_name: '', bio: '', availability: 'Flexible', location: 'Palestine', avatar: null }
    })
}))
