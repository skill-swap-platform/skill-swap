
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: UserAuthDto;
    expiresIn: string;
}

export interface UserAuthDto {
    id: string;
    userName: string | null;
    email: string;
    role: 'USER' | 'ADMIN';
    image: string | null;
    isActive: boolean;
    isVerified: boolean;
}

export interface SignupDto {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface UserResponseDto {
    id: string;
    userName: string;
    email: string;
    bio: string;
    country: string;
    location: string;
    timezone: string;
    availability: string;
    image?: string;
    createdAt: string;
    skills?: UserSkill[];
    categories?: CategoryResponseDto[];
}

export interface UpdateUserDto {
    userName?: string;
    bio?: string;
    country?: string;
    location?: string;
    timezone?: string;
    availability?: string;
}

export interface UserSkill {
    id: string;
    level: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
    yearsOfExperience: number;
    isOffering: boolean;
    sessionLanguage?: string;
    skillDescription?: string;
    createdAt: string;
    skill: SkillDto;
}

export interface SkillDto {
    id: string;
    name: string;
    description: string;
    icon?: string;
    category: CategoryResponseDto;
}


export interface AddUserSkillDto {
    skillId: string;
    level: string;
    yearsOfExperience: number;
    sessionLanguage?: string;
    skillDescription?: string;
}

export interface CategoryResponseDto {
    id: string;
    name: string;
    icon?: string;
}

export interface CategorySkillsDto {
    id: string;
    name: string;
    icon?: string;
    skills: SkillDto[];
}

export interface UpdateCategoriesDto {
    selectedCatIds: string[];
}