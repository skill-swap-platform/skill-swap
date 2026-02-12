import React from 'react'
import { NavLink } from 'react-router-dom'
import { Bell, MessageCircle, Search } from 'lucide-react'

export const PostSessionTopNav: React.FC = () => {
    return (
        <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB]">
            <div className="h-16 max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-8">
                    <div className="text-xl font-poppins font-bold">
                        <span className="text-[#F59E0B]">Skill</span>
                        <span className="text-[#3E8FCC]">Swap</span>
                        <span className="text-[#F59E0B]">.</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-6 text-sm">
                        {[
                            { label: 'Home', to: '/dashboard' },
                            { label: 'Requests', to: '/dashboard' },
                            { label: 'Sessions', to: '/history' },
                            { label: 'Explore', to: '/dashboard' },
                        ].map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.to}
                                className={({ isActive }) =>
                                    `font-medium ${isActive
                                        ? 'text-[#3E8FCC]'
                                        : 'text-[#666666] hover:text-[#0C0D0F]'
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-3 h-9 rounded-full border border-[#E5E7EB] bg-[#F9FAFB]">
                        <Search className="w-4 h-4 text-[#9CA3AF]" />
                        <input
                            className="bg-transparent outline-none text-sm placeholder:text-[#9CA3AF] w-40"
                            placeholder="Search..."
                        />
                    </div>

                    <button
                        title="Messages"
                        aria-label="Messages"
                        className="h-9 w-9 rounded-full border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] grid place-items-center"
                    >
                        <MessageCircle className="w-4 h-4 text-[#666666]" />
                    </button>
                    <button
                        title="Notifications"
                        aria-label="Notifications"
                        className="h-9 w-9 rounded-full border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] grid place-items-center"
                    >
                        <Bell className="w-4 h-4 text-[#666666]" />
                    </button>

                    <div className="h-9 w-9 rounded-full bg-[#3E8FCC] text-white grid place-items-center text-sm font-semibold">
                        W
                    </div>
                </div>
            </div>
        </header>
    )
}
