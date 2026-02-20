import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Settings, Star, ChevronRight, Award, Users, Zap, BookOpen, Trophy, Heart } from 'lucide-react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { userService } from '@/api/services/user.service';
import { gamificationService } from '@/api/services/gamification.service';
import { sessionService } from '@/api/services/session.service';
import type { UserResponseDto, UserSkill } from '@/types/api.types';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserResponseDto | null>(null);
    const [skills, setSkills] = useState<UserSkill[]>([]);
    const [badges, setBadges] = useState<any[]>([]);
    const [stats, setStats] = useState({ sessions: 0, points: 0, badges: 0 });
    const [rating, setRating] = useState({ average: 0, total: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [userRes, skillsRes] = await Promise.all([
                    userService.getCurrentProfile(),
                    userService.getUserSkills(),
                ]);

                if (userRes.success) setUser(userRes.data);

                const rawSkills = skillsRes?.data ?? skillsRes;
                let finalSkills = Array.isArray(rawSkills)
                    ? rawSkills
                    : Array.isArray(rawSkills?.offeredSkills)
                        ? rawSkills.offeredSkills
                        : Array.isArray(rawSkills?.data)
                            ? rawSkills.data
                            : [];

                setSkills(finalSkills);

                try {
                    const userId = userRes.data?.id;
                    if (userId) {
                        const [pointsRes, badgesRes, sessionsRes, ratingRes] = await Promise.all([
                            gamificationService.getPoints(userId),
                            gamificationService.getBadges(userId),
                            sessionService.getHistory({ status: 'COMPLETED', limit: 100 }),
                            userService.getProfileRating(userId)
                        ]);
                        if (ratingRes.success) {
                            setRating({
                                average: ratingRes.data.rating || 0,
                                total: ratingRes.data.totalFeedbacks || 0
                            });
                        }
                        const totalPoints = pointsRes?.data?.total || 0;
                        const badgeList: any[] = Array.isArray(badgesRes?.data?.badges)
                            ? badgesRes.data.badges
                            : [];

                        const sessionCount = sessionsRes?.data?.total ||
                            (Array.isArray(sessionsRes?.data) ? sessionsRes.data.length : 0);

                        setBadges(badgeList);
                        setStats({ sessions: sessionCount, points: totalPoints, badges: badgeList.length });
                    }
                } catch (err) {
                    console.error('[ProfilePage] Extra data fetch error:', err);
                }
            } catch (err) {
                console.error('[ProfilePage] Failed to load:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F5F6FA] flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-[#3E8FCC] border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-400 text-sm">Loading profile...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const avatarUrl =
        user?.image ||
        `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.userName || 'user'}`;

    return (
        <div className="min-h-screen bg-[#F5F6FA] flex flex-col">
            <Header />
            <main className="flex-1 py-8 px-4">
                <div className="max-w-[600px] mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-5 pt-5 pb-2">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-700" />
                            </button>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => navigate('/profile/edit')}
                                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Edit profile"
                                >
                                    <Pencil className="w-4 h-4 text-gray-500" />
                                </button>
                                <button
                                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Settings"
                                    onClick={() => navigate('/profile/settings')}
                                >
                                    <Settings className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col items-center pt-2 pb-5 px-5">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 mb-3">
                                <img
                                    src={avatarUrl}
                                    alt={user?.userName || 'User'}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h1 className="text-[18px] font-bold text-[#0C0D0F]">
                                {user?.userName || 'Your Name'}
                            </h1>
                            <p className="text-[13px] text-gray-400 mt-0.5">
                                {user?.bio || 'No bio yet'}
                            </p>
                            <div className="flex items-center gap-1 mt-1.5">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-[13px] font-semibold text-gray-800">
                                    {rating.average.toFixed(1)}
                                </span>
                                <span className="text-[12px] text-gray-400">({rating.total})</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 mx-5 mb-6 border border-gray-100 rounded-xl overflow-hidden">
                            {[
                                { label: 'Sessions', value: stats.sessions },
                                { label: 'Points', value: stats.points },
                                { label: 'Badges', value: stats.badges },
                            ].map(({ label, value }, idx) => (
                                <div
                                    key={label}
                                    className={`flex flex-col items-center py-4 ${idx < 2 ? 'border-r border-gray-100' : ''}`}
                                >
                                    <span className="text-[17px] font-bold text-gray-900">{value}</span>
                                    <span className="text-[11px] text-gray-400 mt-0.5">{label}</span>
                                </div>
                            ))}
                        </div>
                        <div className="px-5 mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-[15px] font-bold text-gray-900">My Skills</h2>
                                <button
                                    onClick={() => navigate('/profile/skills')}
                                    className="text-[13px] text-gray-400 hover:text-[#3E8FCC] transition-colors"
                                >
                                    See All
                                </button>
                            </div>

                            {skills.length === 0 ? (
                                <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center">
                                    <p className="text-gray-400 text-sm">No skills added yet</p>
                                    <button
                                        onClick={() => navigate('/profile/skills')}
                                        className="mt-2 text-sm text-[#3E8FCC] font-medium hover:underline"
                                    >
                                        + Add your first skill
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-3">
                                    {skills.slice(0, 3).map((us) => (
                                        <SkillCard
                                            key={us.id}
                                            userSkill={us}
                                            rating={rating.average}
                                            onClick={() => navigate(`/profile/skills/${us.id}`)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="px-5 pb-7">
                            <h2 className="text-[15px] font-bold text-gray-900 mb-4">
                                Recognition Badges
                            </h2>

                            {badges.length === 0 ? (
                                <div className="py-2">
                                    <p className="text-gray-400 text-[13px] italic">No badges earned yet. Complete sessions to unlock them!</p>
                                </div>
                            ) : (
                                <div className="flex gap-4 flex-wrap">
                                    {badges.map((badge: any, i: number) => {
                                        const getIcon = (iconName: string) => {
                                            const props = { className: "w-6 h-6 text-[#3E8FCC]" };
                                            switch (iconName?.toLowerCase()) {
                                                case 'award': return <Award {...props} />;
                                                case 'users': return <Users {...props} />;
                                                case 'zap': return <Zap {...props} />;
                                                case 'book': return <BookOpen {...props} />;
                                                case 'trophy': return <Trophy {...props} />;
                                                case 'heart': return <Heart {...props} />;
                                                default: return <Award {...props} />;
                                            }
                                        };
                                        return (
                                            <div key={badge.id ?? i} className="flex flex-col items-center gap-1.5">
                                                <div className="w-14 h-14 rounded-full bg-[#EFF6FF] flex items-center justify-center border border-blue-100 shadow-sm">
                                                    {getIcon(badge.icon)}
                                                </div>
                                                <span className="text-[11px] text-gray-500 text-center max-w-[64px] leading-tight font-medium">
                                                    {badge.name}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
const SkillCard: React.FC<{ userSkill: UserSkill; rating: number; onClick: () => void }> = ({ userSkill, rating, onClick }) => {
    const initial = userSkill.skill?.name?.[0]?.toUpperCase() || 'S';
    return (
        <button
            onClick={onClick}
            className="bg-white border border-gray-100 rounded-xl p-3 text-left hover:border-[#3E8FCC] hover:shadow-sm transition-all group"
        >
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center mb-2">
                <span className="text-sm font-bold text-[#3E8FCC]">{initial}</span>
            </div>
            <p className="text-[11px] font-semibold text-gray-800 truncate">{userSkill.skill?.name}</p>
            <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] text-gray-500">{rating.toFixed(1)}</span>
            </div>
            <div className="flex justify-end mt-1">
                <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-[#3E8FCC] transition-colors" />
            </div>
        </button>
    );
};

export default ProfilePage;
