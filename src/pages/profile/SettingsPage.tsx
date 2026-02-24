import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, LogOut } from 'lucide-react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { userService } from '@/api/services/user.service';
import type { UserResponseDto } from '@/types/api.types';

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await userService.getCurrentProfile();
                if (res.success) {
                    setUser(res.data);
                }
            } catch (err) {
                console.error('[SettingsPage] Error fetching profile:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        navigate('/auth/login');
    };

    return (
        <div className="min-h-screen bg-[#F5F6FA] flex flex-col font-sans text-[#0C0D0F]">
            <Header />
            <main className="flex-1 py-10 px-4">
                <div className="max-w-[800px] mx-auto bg-white rounded-[24px] shadow-sm p-5 sm:p-8 min-h-[500px]">
                    <div className="flex items-center gap-4 mb-10">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-[#0C0D0F]" />
                        </button>
                        <h1 className="text-[22px] font-bold">Settings</h1>
                    </div>

                    <div className="space-y-10">
                        <section>
                            <h2 className="text-base font-bold mb-4 px-1">Account</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-2 px-1">Name</label>
                                    {isLoading ? (
                                        <div className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl animate-pulse" />
                                    ) : (
                                        <input
                                            type="text"
                                            readOnly
                                            value={user?.userName || 'User Name'}
                                            className="w-full h-12 bg-white border border-gray-100 rounded-xl px-4 text-[14px] text-gray-800 outline-none shadow-sm focus:border-[#3E8FCC] transition-colors"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-2 px-1">Email</label>
                                    {isLoading ? (
                                        <div className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl animate-pulse" />
                                    ) : (
                                        <input
                                            type="email"
                                            readOnly
                                            value={user?.email || 'user@example.com'}
                                            className="w-full h-12 bg-white border border-gray-100 rounded-xl px-4 text-[14px] text-gray-800 outline-none shadow-sm focus:border-[#3E8FCC] transition-colors"
                                        />
                                    )}
                                </div>
                            </div>
                        </section>
                        <section>
                            <h2 className="text-base font-bold mb-4 px-1">Notification</h2>
                            <div className="space-y-3">
                                <ToggleRow
                                    label="Push Notifications"
                                    isActive={pushNotifications}
                                    onToggle={() => setPushNotifications(!pushNotifications)}
                                />
                                <ToggleRow
                                    label="Email Notifications"
                                    isActive={emailNotifications}
                                    onToggle={() => setEmailNotifications(!emailNotifications)}
                                />
                            </div>
                        </section>
                        <section>
                            <h2 className="text-base font-bold mb-4 px-1">Preferences</h2>
                            <div className="space-y-3">
                                <SelectRow label="Language" value="English" onClick={() => { }} />
                                <SelectRow label="Timezone" value="GMZ+2" onClick={() => { }} />
                            </div>
                        </section>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-1 py-2 text-red-500 hover:text-red-600 transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors group-hover:bg-red-50">
                                <LogOut className="w-5 h-5" />
                            </div>
                            <span className="text-base font-bold">Log out</span>
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

const ToggleRow: React.FC<{ label: string; isActive: boolean; onToggle: () => void }> = ({ label, isActive, onToggle }) => (
    <div className="flex items-center justify-between h-14 bg-white border border-gray-50 rounded-xl px-4 shadow-sm">
        <span className="text-[14px] font-medium text-gray-700">{label}</span>
        <button
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isActive ? 'bg-[#3E8FCC]' : 'bg-gray-200'
                }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />
        </button>
    </div>
);

const SelectRow: React.FC<{ label: string; value: string; onClick: () => void }> = ({ label, value, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center justify-between h-14 bg-white border border-gray-50 rounded-xl px-4 shadow-sm hover:border-blue-100 transition-all group"
    >
        <span className="text-[14px] font-medium text-gray-700">{label}</span>
        <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-400">{value}</span>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#3E8FCC] transition-all" />
        </div>
    </button>
);

export default SettingsPage;
