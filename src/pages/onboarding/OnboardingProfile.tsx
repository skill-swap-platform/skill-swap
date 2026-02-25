import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingLayout from './OnboardingLayout';
import ProfileTips from '../../components/onboarding/ProfileTips';
import { useSkillStore } from '../../store/useSkillStore';
import { userService } from '../../api/services/user.service';
import { Loader2, Camera } from 'lucide-react';
import countryList from 'react-select-country-list';
import { Autocomplete, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const countryData = countryList().getData().map((c: { label: string; value: string }) => c.label);
const availabilityOptions = ['Flexible', 'Weekends', 'Morning', 'Evening'];

const CustomAutocomplete = styled(Autocomplete)({
    '& .MuiAutocomplete-endAdornment': {
        right: '14px',
    },
    '& .MuiAutocomplete-popupIndicator': {
        color: '#292D32',
    },
    '& .MuiAutocomplete-clearIndicator': {
        color: '#999999',
    }
});

const OnboardingProfile: React.FC = () => {
    const navigate = useNavigate();
    const { profile, updateProfile: updateStoreProfile } = useSkillStore();
    const [formData, setFormData] = useState({
        full_name: profile.full_name || '',
        location: profile.location || 'Country',
        bio: profile.bio || '',
        availability: profile.availability || 'Flexible',
        avatar: profile.avatar || null as string | null
    });

    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(profile.avatar);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const localUrl = URL.createObjectURL(file);
            setPreviewUrl(localUrl);

            try {
                setIsUploading(true);
                const response = await userService.uploadProfileImage(file);
                if (response.success) {
                    const imageUrl = response.data.image;
                    setFormData(prev => ({ ...prev, avatar: imageUrl }));
                    updateStoreProfile({ avatar: imageUrl });
                }
            } catch (error: any) {
                console.error('Upload failed:', error);
                if (error.response?.status === 401) {
                    console.warn('Unauthorized: Image upload simulated locally.');
                } else {
                    alert('Failed to upload image. Please try again.');
                }
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleNext = async () => {
        try {
            setIsSaving(true);


            const availabilityMap: Record<string, string> = {
                'Flexible': 'FLEXIBLE',
                'Weekends': 'WEEKENDS',
                'Morning': 'MORNING',
                'Evening': 'EVENING'
            };

            const response = await userService.updateProfile({
                userName: formData.full_name,
                bio: formData.bio,
                location: formData.location,
                availability: (availabilityMap[formData.availability] || 'FLEXIBLE') as any
            });

            if (response.success) {
                updateStoreProfile(formData);
                navigate('/');
            }
        } catch (error: any) {
            console.error('Saving profile failed:', error);
            if (error.response?.status === 401) {
                console.warn('Unauthorized: Simulating success for preview.');
                updateStoreProfile(formData);
                navigate('/');
            } else {
                alert('Failed to save profile. Please check your connection.');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleBack = () => {
        navigate('/onboarding/teaching');
    };

    return (
        <OnboardingLayout
            isExactSpec={true}
            sideContent={<ProfileTips />}
            onBack={handleBack}
            onNext={handleNext}
        >
            <div className="w-full max-w-[615px] h-full flex flex-col items-center gap-[25px]">
                <h2 className="w-full text-[20px] font-semibold leading-[24px] text-black text-left">Profile Setup</h2>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <div className="w-[105px] h-[104px] flex flex-col items-center gap-[8px]">
                    <button
                        onClick={handleUploadClick}
                        disabled={isUploading}
                        className="w-[77px] h-[77px] rounded-full border border-black flex items-center justify-center overflow-hidden relative group"
                    >
                        {previewUrl ? (
                            <img src={previewUrl} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center">
                                <Camera className="w-6 h-6 text-black" />
                            </div>
                        )}
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-[10px] text-white font-bold">Change</span>
                        </div>
                    </button>
                    <span className="text-[16px] font-semibold text-black text-center">Upload Photo</span>
                </div>

                <div className="w-full flex flex-col gap-[16px]">
                    <FormInput
                        label="Full Name"
                        placeholder="Enter your name"
                        value={formData.full_name}
                        onChange={(val) => setFormData({ ...formData, full_name: val })}
                    />
                    <FormInput
                        label="Short Bio"
                        placeholder="Tell others a bit about yourself (min. 10 characters)"
                        value={formData.bio}
                        onChange={(val) => setFormData({ ...formData, bio: val })}
                        helperText="Bio must be at least 10 characters long"
                    />
                    <FormSelect
                        label="Availability"
                        value={formData.availability || 'Flexible'}
                        options={availabilityOptions}
                        onChange={(val) => setFormData({ ...formData, availability: val })}
                    />

                    <div className="w-full flex flex-col gap-[8px]">
                        <label className="text-[16px] font-medium leading-[19px] text-[#0C0D0F]">Location</label>
                        <CustomAutocomplete
                            options={countryData}
                            value={formData.location === 'Country' ? '' : formData.location}
                            onChange={(_, newValue) => setFormData({ ...formData, location: (newValue as string) || 'Country' })}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Search your country..."
                                    className="w-full"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            height: '48px',
                                            borderRadius: '10px',
                                            padding: '0 14px',
                                            fontSize: '15px',
                                            fontFamily: 'inherit',
                                            backgroundColor: 'white',
                                            '& fieldset': {
                                                borderColor: '#DADADA',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#DADADA',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#3E8FCC',
                                                borderWidth: '1px'
                                            }
                                        },
                                        '& .MuiInputBase-input': {
                                            padding: '0 !important',
                                            color: 'black',
                                            '&::placeholder': {
                                                color: '#999999',
                                                opacity: 1
                                            }
                                        }
                                    }}
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="w-full flex flex-col items-center gap-[8px] mt-auto">
                    <button
                        onClick={handleNext}
                        disabled={!formData.full_name || formData.bio.length < 10 || formData.location === 'Country' || isSaving}
                        className={`w-full max-w-[415px] h-[48px] rounded-[10px] flex items-center justify-center transition-all ${(!formData.full_name || formData.bio.length < 10 || formData.location === 'Country' || isSaving)
                            ? 'bg-[#9CA3AF] cursor-not-allowed opacity-70'
                            : 'bg-[#3E8FCC] hover:bg-[#357db3] shadow-md shadow-blue-100'
                            }`}
                    >
                        {isSaving ? (
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                        ) : (
                            <span className="text-white font-medium text-[16px]">Finish setup</span>
                        )}
                    </button>
                    <p className="text-[14px] font-poppins text-black text-center">You can edit this later</p>
                </div>
            </div>
        </OnboardingLayout>
    );
};

const FormInput = ({ label, placeholder, value, onChange, helperText }: { label: string, placeholder: string, value: string, onChange: (v: string) => void, helperText?: string }) => (
    <div className="w-full flex flex-col gap-[8px]">
        <label className="text-[16px] font-medium leading-[19px] text-[#0C0D0F]">{label}</label>
        <div className="w-full h-[48px] border border-[#DADADA] rounded-[10px] px-[14px] flex items-center bg-white">
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-transparent outline-none text-[15px] font-normal text-black placeholder:text-[#999999]"
            />
        </div>
        {helperText && (
            <span className={`text-[12px] ${value.length > 0 && value.length < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                {helperText} ({value.length}/10)
            </span>
        )}
    </div>
);

const FormSelect = ({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (v: string) => void }) => (
    <div className="w-full h-[75px] flex flex-col gap-[8px]">
        <label className="text-[16px] font-medium leading-[19px] text-[#0C0D0F]">{label}</label>
        <div className="w-full h-[48px] border border-[#DADADA] rounded-[10px] px-[14px] flex items-center bg-white relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-transparent outline-none text-[15px] font-normal text-black appearance-none"
            >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className="absolute right-[14px] pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#292D32" strokeWidth="1.5">
                    <path d="M6 9L12 15L18 9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    </div>
);

export default OnboardingProfile;
