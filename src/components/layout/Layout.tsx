import React, { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    Award,
    History,
    Settings,
    Menu,
    X,
    Users,
    FileText,
    AlertCircle,
    BarChart3,
} from 'lucide-react'

export const Layout: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navItems = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
            name: 'Skills Management',
            path: '/skills',
            icon: <BarChart3 className="w-5 h-5" />,
        },
        {
            name: 'Users List',
            path: '/users',
            icon: <Users className="w-5 h-5" />,
        },
        {
            name: 'Points & Badges',
            path: '/points-badges',
            icon: <Award className="w-5 h-5" />,
        },
        {
            name: 'Swap Requests',
            path: '/requests',
            icon: <FileText className="w-5 h-5" />,
        },
        {
            name: 'Sessions',
            path: '/history',
            icon: <History className="w-5 h-5" />,
        },
        {
            name: 'Disputes',
            path: '/disputes',
            icon: <AlertCircle className="w-5 h-5" />,
        },
        {
            name: 'Setting',
            path: '/settings',
            icon: <Settings className="w-5 h-5" />,
        },
        {
            name: 'Audit Log',
            path: '/audit',
            icon: <FileText className="w-5 h-5" />,
        },
    ]

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex font-poppins">

            <aside className="hidden lg:flex lg:flex-col lg:w-[240px] bg-white border-r border-[#E5E7EB] fixed top-0 bottom-0 left-0 z-50">

                <div className="h-20 flex items-center px-6 border-b border-[#F3F4F6]">
                    <h1 className="text-xl font-bold">
                        <span className="text-[#F59E0B]">Skill</span>
                        <span className="text-[#3E8FCC]">Swap</span>
                        <span className="text-[#F59E0B]">.</span>
                    </h1>
                </div>

                <div className="px-4 py-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full h-10 pl-4 pr-4 rounded-lg border border-[#E5E7EB] text-sm outline-none focus:ring-1 focus:ring-[#3E8FCC] bg-[#F9FAFB]"
                        />
                    </div>
                </div>

                <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${isActive
                                    ? 'bg-[#3E8FCC] text-white'
                                    : 'text-[#666666] hover:bg-[#F9FAFB]'
                                }`
                            }
                        >
                            {item.icon}
                            <span className="font-medium">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#E5E7EB] z-50 flex items-center justify-between px-4">
                <h1 className="text-lg font-bold">
                    <span className="text-[#F59E0B]">Skill</span>
                    <span className="text-[#3E8FCC]">Swap</span>
                    <span className="text-[#0C0D0F]">.</span>
                </h1>

                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors"
                >
                    {isMobileMenuOpen ? (
                        <X className="w-6 h-6 text-[#0C0D0F]" />
                    ) : (
                        <Menu className="w-6 h-6 text-[#0C0D0F]" />
                    )}
                </button>
            </div>
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-[#0C0D0F]/40 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
            <div className={`lg:hidden fixed top-16 left-0 right-0 bottom-0 bg-white z-50 transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                    ? 'bg-[#3E8FCC] text-white'
                                    : 'text-[#666666] hover:bg-[#F9FAFB]'
                                }`
                            }
                        >
                            {item.icon}
                            <span className="font-medium">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
            <main className="flex-1 lg:pl-[240px] pt-16 lg:pt-0 min-h-screen">
                <div className="p-6 lg:p-10">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
