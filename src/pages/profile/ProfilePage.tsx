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

    const avatarUrl =
        user?.image ||
        `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.userName || 'user'}`;

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans">
            <Header />
            <main className="flex-1 py-10 px-4">
                <div className="max-w-[800px] mx-auto">
                    <div className="bg-white rounded-[32px] shadow-sm overflow-hidden p-6 sm:p-10 min-h-[600px]">
                        <div className="flex items-center justify-between mb-8">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-800"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => navigate('/profile/edit')}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                                    title="Edit profile"
                                >
                                    <Pencil className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => navigate('/profile/settings')}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                                    title="Settings"
                                >
                                    <Settings className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col items-center mb-10">
                            {isLoading ? (
                                <>
                                    <div className="w-24 h-24 rounded-full bg-gray-100 animate-pulse mb-4" />
                                    <div className="h-8 w-40 bg-gray-100 animate-pulse rounded-lg mb-2" />
                                    <div className="h-4 w-32 bg-gray-50 animate-pulse rounded-md mb-3" />
                                    <div className="h-4 w-20 bg-gray-50 animate-pulse rounded-md" />
                                </>
                            ) : (
                                <>
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md mb-4 ring-1 ring-gray-100">
                                        <img
                                            src={avatarUrl}
                                            alt={user?.userName || 'User'}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h1 className="text-[24px] font-bold text-[#0C0D0F] mb-1">
                                        {user?.userName || 'Dena Abdo'}
                                    </h1>
                                    <p className="text-[14px] font-medium text-gray-400 mb-2">
                                        {user?.bio || 'UI/UX Designer'}
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="text-[14px] font-bold text-gray-800">
                                            {rating.average.toFixed(1)}
                                        </span>
                                        <span className="text-[14px] text-gray-400">({rating.total})</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-12">
                            {[
                                { label: 'Sessions', value: stats.sessions },
                                { label: 'Points', value: stats.points },
                                { label: 'Badges', value: stats.badges },
                            ].map(({ label, value }) => (
                                <div
                                    key={label}
                                    className="bg-[#F8F9FA] rounded-2xl py-5 px-2 flex flex-col items-center transition-all hover:bg-gray-100/80"
                                >
                                    {isLoading ? (
                                        <div className="h-7 w-10 bg-gray-200 animate-pulse rounded-md mb-1" />
                                    ) : (
                                        <span className="text-[20px] font-bold text-[#0C0D0F]">{value}</span>
                                    )}
                                    <span className="text-[12px] font-medium text-gray-400 uppercase tracking-wide">{label}</span>
                                </div>
                            ))}
                        </div>

                        <section className="mb-12">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-[18px] font-bold text-[#0C0D0F]">My Skills</h2>
                                <button
                                    onClick={() => navigate('/profile/skills')}
                                    className="text-[13px] font-bold text-gray-400 hover:text-[#3E8FCC] transition-colors"
                                >
                                    See All
                                </button>
                            </div>

                            {isLoading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-32 bg-gray-50 border border-gray-100 rounded-2xl animate-pulse" />
                                    ))}
                                </div>
                            ) : skills.length === 0 ? (
                                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-10 text-center">
                                    <p className="text-gray-400 text-sm mb-4">No skills added yet</p>
                                    <button
                                        onClick={() => navigate('/profile/skills')}
                                        className="px-6 py-2.5 bg-[#3E8FCC] text-white text-[13px] font-bold rounded-xl hover:bg-[#2F71A3] transition-all shadow-md shadow-blue-100"
                                    >
                                        + Add your first skill
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                        </section>

                        <section>
                            <h2 className="text-[18px] font-bold text-[#0C0D0F] mb-6">
                                Recognition Badges
                            </h2>

                            {isLoading ? (
                                <div className="flex gap-8">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 rounded-full bg-gray-50 animate-pulse" />
                                            <div className="h-4 w-16 bg-gray-50 animate-pulse rounded" />
                                        </div>
                                    ))}
                                </div>
                            ) : badges.length === 0 ? (
                                <div className="bg-blue-50/30 rounded-2xl p-6 text-center border border-blue-50">
                                    <p className="text-gray-400 text-[14px] font-medium">Earn badges by being active and helping others!</p>
                                </div>
                            ) : (
                                <div className="flex gap-8 flex-wrap">
                                    {badges.map((badge: any, i: number) => {
                                        const getIcon = (iconName: string) => {
                                            const props = { className: "w-7 h-7 text-[#3E8FCC]" };
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
                                            <div key={badge.id ?? i} className="flex flex-col items-center gap-2 group cursor-pointer">
                                                <div className="w-16 h-16 rounded-full bg-blue-50/50 flex items-center justify-center border border-blue-100 shadow-sm transition-transform group-hover:scale-110">
                                                    {getIcon(badge.icon)}
                                                </div>
                                                <span className="text-[12px] text-gray-600 text-center max-w-[80px] leading-tight font-bold">
                                                    {badge.name}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>
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
            className="flex flex-col bg-white border border-gray-100 rounded-2xl p-4 text-left hover:border-[#3E8FCC] hover:shadow-lg transition-all group relative min-h-[140px]"
        >
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <span className="text-base font-bold text-[#3E8FCC]">{initial}</span>
            </div>
            <p className="text-[14px] font-bold text-[#0C0D0F] truncate mb-1">
                {userSkill.skill?.name}
            </p>
            <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-[12px] font-bold text-gray-500">{rating.toFixed(1)}</span>
            </div>
            <div className="absolute bottom-4 right-4 text-gray-300 group-hover:text-[#3E8FCC] transition-colors">
                <ChevronRight className="w-4 h-4" />
            </div>
        </button>
    );
};

export default ProfilePage;
