import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Camera, Star } from 'lucide-react';
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
            const res = await userService.uploadProfileImage(file);
            if (res.success) setPreviewUrl(res.data.image);
        } catch (err) {
            console.error('[EditProfile] upload failed:', err);
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

    const avatarUrl =
        previewUrl ||
        `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.userName || 'user'}`;

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans">
            <Header />
            <main className="flex-1 py-10 px-4">
                <div className="max-w-[800px] mx-auto">
                    <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm overflow-hidden p-6 sm:p-10">
                        <div className="flex items-center justify-between mb-2">
                            <button
                                onClick={() => navigate('/profile')}
                                className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400">
                                <Settings className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex flex-col items-center mb-10">
                            <div className="relative mb-3 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-50 border-2 border-white shadow-sm ring-1 ring-gray-100">
                                    {isLoading ? (
                                        <div className="w-full h-full animate-pulse bg-gray-100" />
                                    ) : (
                                        <div className="relative w-full h-full">
                                            <img
                                                src={avatarUrl}
                                                alt="avatar"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                <Camera className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    )}
                                </div>
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
                                className="text-[14px] text-[#3E8FCC] font-bold hover:underline"
                            >
                                Edit
                            </button>
                        </div>

                        <div className="space-y-6 mb-12">
                            <div>
                                <label className="block text-[14px] font-bold text-gray-900 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                                    className="w-full h-12 px-4 border border-gray-200 rounded-lg text-[14px] text-gray-700 outline-none focus:border-[#3E8FCC] transition-all"
                                    placeholder="Dena Abdo"
                                />
                            </div>
                            <div>
                                <label className="block text-[14px] font-bold text-gray-900 mb-2">
                                    Bio
                                </label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData(p => ({ ...p, bio: e.target.value }))}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[14px] text-gray-700 outline-none focus:border-[#3E8FCC] resize-none transition-all"
                                    placeholder="UI/UX Designer"
                                />
                            </div>
                        </div>

                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-[18px] font-bold text-gray-900">My Skills</h2>
                                <button
                                    onClick={() => navigate('/profile/add-skill')}
                                    className="text-[14px] text-[#3E8FCC] font-bold hover:underline py-1"
                                >
                                    + Add
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {isLoading ? (
                                    [1, 2, 3].map(i => (
                                        <div key={i} className="h-32 bg-gray-50 border border-gray-100 rounded-xl animate-pulse" />
                                    ))
                                ) : skills.length === 0 ? (
                                    <div className="col-span-full py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <p className="text-gray-400 text-sm">No skills added yet</p>
                                    </div>
                                ) : (
                                    skills.map((us) => (
                                        <div key={us.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col min-h-[140px] relative">
                                            <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center mb-3">
                                                <span className="text-lg font-bold text-[#3E8FCC]">
                                                    {us.skill?.name?.[0]?.toUpperCase() || 'P'}
                                                </span>
                                            </div>
                                            <h3 className="text-[14px] font-bold text-gray-900 mb-1 truncate pr-2">
                                                {us.skill?.name}
                                            </h3>
                                            <div className="flex items-center gap-1 mb-6">
                                                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                                <span className="text-[12px] text-gray-500 font-bold">4.6</span>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/profile/skills/${us.id}/edit`)}
                                                className="absolute bottom-4 right-4 text-[12px] text-[#3E8FCC] font-bold hover:underline"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="flex justify-center pt-4">
                            <button
                                onClick={handleSave}
                                disabled={isLoading || isSaving}
                                className="px-10 py-3 bg-[#1F2937] text-white rounded-xl font-bold text-[15px] hover:bg-black transition-all shadow-md active:scale-95 disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default EditProfilePage;
