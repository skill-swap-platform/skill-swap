import React from 'react';
import {
    Search,
    Bell,
    MessageCircle,
    ChevronRight,
    Star,
    Globe,
    Shield,
    Database,
    Music,
    Terminal,
    MessageSquare,
    Send,
    Settings,
    Palette,
    Cpu,
    Bookmark,
    User
} from 'lucide-react';

const DashboardPreview: React.FC = () => {
    return (
        <div className="w-full h-full bg-[#F9FAFB] flex flex-col font-sans overflow-hidden">
            <header className="bg-white border-b border-gray-100 flex items-center justify-between px-6 py-3 shrink-0">
                <div className="flex items-center gap-8">
                    <div className="text-xl font-bold flex items-center">
                        <span className="text-[#F59E0B]">Skill</span>
                        <span className="text-[#3E8FCC]">Swap</span>
                        <span className="text-[#F59E0B]">.</span>
                    </div>
                    <nav className="hidden lg:flex items-center gap-4 text-[13px] font-medium text-gray-500">
                        <span className="text-[#3E8FCC]">Home</span>
                        <span className="hover:text-gray-900 cursor-pointer">Requests</span>
                        <span className="hover:text-gray-900 cursor-pointer">Sessions</span>
                        <span className="hover:text-gray-900 cursor-pointer">Explore</span>
                    </nav>
                </div>
                <div className="flex items-center gap-4 flex-1 max-w-md mx-8">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-gray-50 border-none rounded-full py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-blue-100 outline-none"
                            readOnly
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-gray-400" />
                    <Bell className="w-5 h-5 text-gray-400" />
                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-white shadow-sm flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Hi Ahmed</h1>
                    <p className="text-sm text-gray-500">Ready to exchange skills? Start your learning journey today</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <ActionCard
                        icon={<Search className="text-[#3E8FCC]" />}
                        title="Find a Teacher"
                        color="blue"
                        desc="Browse thousands of skilled people ready to share knowledge"
                    />
                    <ActionCard
                        icon={<Settings className="text-orange-400" />}
                        title="Offer Your Skills"
                        color="orange"
                        desc="Share what you know and help other grow while learning"
                    />
                    <ActionCard
                        icon={<Globe className="text-green-500" />}
                        title="Join Live Sessions"
                        color="green"
                        desc="Participate in real time workshops group leaning"
                    />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    <StatsCard bg="#4B81A8" icon={<Terminal />} label="15 Skills" sub="Successfully Learned" />
                    <StatsCard bg="#FF9946" icon={<MessageSquare />} label="23 Swaps" sub="Currently Active" />
                    <StatsCard bg="#3BB77E" icon={<Star className="fill-white" />} label="4.3 Rating" sub="From your peers" />
                </div>

                <div className="bg-[#4B81A8] rounded-xl p-4 flex items-center justify-between mb-10 shadow-md border border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-white mb-0.5">Your swap was accepted!</p>
                            <p className="text-[11px] text-white/70">Frontend Development with Emma Rodriguez</p>
                        </div>
                    </div>
                    <button className="bg-white text-[#4B81A8] text-[11px] font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-transform hover:scale-105">
                        Start Chat <Send className="w-3 h-3" />
                    </button>
                </div>

                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingIcon className="w-4 h-4 text-gray-400" />
                        <h2 className="font-bold text-sm text-gray-900">Trending This Week</h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <TopicItem icon={<Globe className="text-green-500" />} title="Web Development" count="1236 Learning" />
                        <TopicItem icon={<Database className="text-blue-500" />} title="Data Science" count="1216 Learning" />
                        <TopicItem icon={<Music className="text-purple-500" />} title="Music Production" count="890 Learning" />
                        <TopicItem icon={<Palette className="text-red-500" />} title="UX/UI Design" count="1216 Learning" />
                    </div>
                </div>

                <div className="mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-bold text-sm text-gray-900">Your Interests</h2>
                        <span className="text-[11px] text-[#3E8FCC] font-bold cursor-pointer">See all {'>'}</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <InterestTag icon={<Search />} label="Mobile Development" />
                        <InterestTag icon={<Globe />} label="Cloud Computing" />
                        <InterestTag icon={<Shield />} label="Cybersecurity" active />
                        <InterestTag icon={<Database />} label="Data Analytics" />
                        <InterestTag icon={<Cpu />} label="AI & Machine Learning" />
                    </div>
                </div>

                <div className="mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-bold text-sm text-gray-900">Recommended for you</h2>
                        <span className="text-[11px] text-[#3E8FCC] font-bold cursor-pointer">See all {'>'}</span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <UserCard name="Sarah Johnson" title="Marketing Strategist" topic="Mastering Data Visualization" />
                        <UserCard name="Sarah Johnson" title="Marketing Strategist" topic="Advanced Data Mining Techniques" />
                        <UserCard name="Sarah Johnson" title="Marketing Strategist" topic="Intro to Machine Learning" />
                    </div>
                </div>

                <div className="mb-10 pb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-bold text-sm text-gray-900">Upcoming Sessions</h2>
                        <span className="text-[11px] text-[#3E8FCC] font-bold cursor-pointer">See all {'>'}</span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="relative h-40 rounded-2xl overflow-hidden group cursor-pointer shadow-lg">
                            <img
                                src="https://images.unsplash.com/photo-1551288049-bbbda536ad31?auto=format&fit=crop&w=800&q=80"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                alt="session"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute top-4 left-4 bg-[#3E8FCC] text-white text-[10px] font-bold px-3 py-1 rounded-full">Data Science</div>
                        </div>
                        <div className="relative h-40 rounded-2xl overflow-hidden group cursor-pointer shadow-lg">
                            <img
                                src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                alt="session"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute top-4 left-4 bg-[#3BB77E] text-white text-[10px] font-bold px-3 py-1 rounded-full">Web Development</div>
                            <div className="absolute bottom-4 left-4 text-white">
                                <p className="text-xs font-bold leading-tight">Advanced React Patterns</p>
                                <p className="text-[10px] text-white/80">Started • 12 mins ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActionCard = ({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-4 ${color === 'blue' ? 'bg-blue-50' : color === 'orange' ? 'bg-orange-50' : 'bg-green-50'
            }`}>
            {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-4 h-4' })}
        </div>
        <h3 className="font-bold text-sm mb-1">{title}</h3>
        <p className="text-xs text-gray-400 mb-3 leading-relaxed">{desc}</p>
        <div className={`text-[12px] font-bold flex items-center gap-1 cursor-pointer ${color === 'blue' ? 'text-[#3E8FCC]' : color === 'orange' ? 'text-orange-400' : 'text-green-500'
            }`}>
            {color === 'blue' ? 'Explore now' : color === 'orange' ? 'Create Offer' : 'View Sessions'} <ChevronRight className="w-3 h-3" />
        </div>
    </div>
);

const StatsCard = ({ bg, icon, label, sub }: { bg: string, icon: React.ReactNode, label: string, sub: string }) => (
    <div className="p-5 rounded-xl text-white shadow-sm relative overflow-hidden group" style={{ backgroundColor: bg }}>
        <div className="relative z-10">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4">
                {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-4 h-4' })}
            </div>
            <div className="text-xl font-bold mb-1">{label}</div>
            <div className="text-[10px] text-white/70 font-medium">{sub}</div>
        </div>
    </div>
);

const TrendingIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
    </svg>
);

const TopicItem = ({ icon, title, count }: { icon: React.ReactNode, title: string, count: string }) => (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative group cursor-pointer hover:border-blue-100">
        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
            {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-4 h-4' })}
        </div>
        <div className="font-bold text-xs mb-1 text-gray-900">{title}</div>
        <div className="text-[10px] text-gray-400">{count}</div>
        <div className="absolute top-4 right-4 text-[9px] font-bold text-green-500 bg-green-50 px-1.5 py-0.5 rounded">+341</div>
    </div>
);

const InterestTag = ({ icon, label, active }: { icon: React.ReactNode, label: string, active?: boolean }) => (
    <div className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all text-xs font-semibold ${active ? 'bg-[#3E8FCC] border-[#3E8FCC] text-white shadow-md' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
        }`}>
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-3.5 h-3.5' })}
        {label}
    </div>
);

const UserCard = ({ name, title, topic }: { name: string, title: string, topic: string }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-300" />
            </div>
            <div className="flex-1">
                <div className="text-xs font-bold text-gray-900 mb-0.5">{name}</div>
                <div className="text-[10px] text-gray-400">{title}</div>
            </div>
            <Bookmark className="w-4 h-4 text-gray-300 cursor-pointer" />
        </div>
        <div className="flex items-center gap-1 mb-3">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-[10px] font-bold text-gray-700">4.8</span>
            <span className="text-[10px] text-gray-400">• 12 swaps</span>
        </div>
        <h4 className="text-[11px] font-bold text-gray-900 mb-2 leading-relaxed h-8 line-clamp-2">{topic}</h4>
        <p className="text-[10px] text-gray-400 mb-4 line-clamp-2 leading-relaxed">Seeking a mentor to guide me through the intricacies of data visualization techniques.</p>
        <div className="flex flex-wrap gap-1.5 mb-5">
            <span className="px-2 py-0.5 bg-gray-50 rounded-md text-[9px] font-medium text-gray-500 border border-gray-100">React.js</span>
            <span className="px-2 py-0.5 bg-gray-50 rounded-md text-[9px] font-medium text-gray-500 border border-gray-100">Node.js</span>
            <span className="px-2 py-0.5 bg-gray-50 rounded-md text-[9px] font-medium text-gray-500 border border-gray-100">SQL</span>
        </div>
        <button className="w-full bg-[#4B81A8] text-white py-2 rounded-lg text-[10px] font-bold hover:bg-blue-600 transition-colors">View Profile</button>
    </div>
);

export default DashboardPreview;
