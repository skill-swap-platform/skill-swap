import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Camera, Loader2, Plus } from 'lucide-react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { userService } from '@/api/services/user.service';
import type { UserResponseDto, UserSkill } from '@/types/api.types';

const EditProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [user, setUser] = useState<UserResponseDto | null>(null);
    const [skills, setSkills] = useState<UserSkill[]>([]);
    const [formData, setFormData] = useState({ name: '', bio: '' });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, skillsRes] = await Promise.all([
                    userService.getCurrentProfile(),
                    userService.getUserSkills(),
                ]);
                if (userRes.success) {
                    setUser(userRes.data);
                    setFormData({
                        name: userRes.data.userName || '',
                        bio: userRes.data.bio || '',
                    });
                    setPreviewUrl(userRes.data.image || null);
                }
                const rawSkills = skillsRes?.data ?? skillsRes;
                let finalSkills = Array.isArray(rawSkills)
                    ? rawSkills
                    : Array.isArray(rawSkills?.offeredSkills)
                        ? rawSkills.offeredSkills
                        : Array.isArray(rawSkills?.data)
                            ? rawSkills.data
                            : [];

                setSkills(finalSkills);
            } catch (err) {
                console.error('[EditProfile] fetch error:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const localUrl = URL.createObjectURL(file);
        setPreviewUrl(localUrl);
        try {
            setIsUploading(true);
            const res = await userService.uploadProfileImage(file);
            if (res.success) setPreviewUrl(res.data.image);
        } catch (err) {
            console.error('[EditProfile] upload failed:', err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await userService.updateProfile({
                userName: formData.name,
                bio: formData.bio,
            });
            navigate('/profile');
        } catch (err) {
            console.error('[EditProfile] save failed:', err);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-[#3E8FCC] border-t-transparent rounded-full animate-spin" />
                </main>
                <Footer />
            </div>
        );
    }

    const avatarUrl =
        previewUrl ||
        `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.userName || 'user'}`;

    return (
        <div className="min-h-screen bg-[#F5F6FA] flex flex-col">
            <Header />
            <main className="flex-1 py-8 px-4">
                <div className="max-w-[600px] mx-auto">

                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-6">
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => navigate('/profile')}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-700" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                                <Settings className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative mb-2">
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100">
                                    <img
                                        src={avatarUrl}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/40 transition-colors"
                                >
                                    {isUploading ? (
                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                    ) : (
                                        <Camera className="w-5 h-5 text-white" />
                                    )}
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="text-sm text-[#3E8FCC] font-medium hover:underline"
                            >
                                Change Photo
                            </button>
                        </div>
                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData((p) => ({ ...p, name: e.target.value }))
                                    }
                                    className="w-full h-11 px-4 border border-gray-100 rounded-xl bg-gray-50/50 text-sm text-gray-800 outline-none focus:border-[#3E8FCC] focus:bg-white transition-all shadow-sm"
                                    placeholder="Your full name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                    Bio / Expertise
                                </label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) =>
                                        setFormData((p) => ({ ...p, bio: e.target.value }))
                                    }
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50/50 text-sm text-gray-800 outline-none focus:border-[#3E8FCC] focus:bg-white resize-none transition-all shadow-sm"
                                    placeholder="Tell others what you can teach..."
                                />
                            </div>
                        </div>
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-bold text-gray-900">My Skills</h2>
                                <button
                                    onClick={() => navigate('/profile/add-skill')}
                                    className="flex items-center gap-1 text-[13px] text-[#3E8FCC] font-bold hover:underline"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add New
                                </button>
                            </div>
                            {skills.length === 0 ? (
                                <div className="border border-dashed border-gray-100 rounded-xl p-6 text-center bg-gray-50/50">
                                    <p className="text-gray-400 text-[13px]">No skills added yet</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-3">
                                    {skills.slice(0, 6).map((us) => {
                                        const initial = us.skill?.name?.[0]?.toUpperCase() || 'S';
                                        return (
                                            <div
                                                key={us.id}
                                                className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm"
                                            >
                                                <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] flex items-center justify-center mb-2">
                                                    <span className="text-xs font-bold text-[#3E8FCC]">
                                                        {initial}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] font-bold text-gray-800 truncate mb-1.5">
                                                    {us.skill?.name}
                                                </p>
                                                <button
                                                    onClick={() =>
                                                        navigate(`/profile/skills/${us.id}/edit`)
                                                    }
                                                    className="text-[10px] text-[#3E8FCC] font-bold hover:underline"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !formData.name.trim()}
                            className="w-full h-12 bg-[#1F2937] hover:bg-[#111827] text-white rounded-xl font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98]"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default EditProfilePage;
