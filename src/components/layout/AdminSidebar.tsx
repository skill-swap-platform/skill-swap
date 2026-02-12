import React from 'react'
import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    Award,
    Users,
    Shield,
    ArrowLeftRight,
    Clock,
    AlertCircle,
    Settings,
    FileText,
    Search
} from 'lucide-react'

export const AdminSidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-white min-h-screen border-r border-[#E5E7EB] fixed left-0 top-0 flex flex-col z-50">
            <div className="p-6">
                <div className="text-xl font-poppins font-bold mb-8 flex items-center gap-0.5">
                    <span className="text-[#F59E0B]">Skill</span>
                    <span className="text-[#3E8FCC]">Swap</span>
                    <span className="text-[#F59E0B]">.</span>
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#F9FAFB] border-none text-sm text-[#0C0D0F] placeholder:text-[#9CA3AF] outline-none hover:bg-[#F3F4F6] focus:bg-white focus:ring-1 focus:ring-[#E5E7EB] transition-all"
                    />
                </div>

                <nav className="space-y-1">
                    {[
                        { icon: LayoutDashboard, label: 'Dashboard', to: '/admin/dashboard' },
                        { icon: Award, label: 'Skills Management', to: '/admin/skills' },
                        { icon: Users, label: 'Users List', to: '/admin/users' },
                        { icon: Shield, label: 'Badges Management', to: '/points-badges' },
                        { icon: ArrowLeftRight, label: 'Swap Requests', to: '/admin/requests' },
                        { icon: Clock, label: 'Sessions', to: '/history' },
                        { icon: AlertCircle, label: 'Disputes', to: '/admin/disputes' },
                    ].map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-[#EBF5FF] text-[#3E8FCC]'
                                    : 'text-[#666666] hover:bg-[#F9FAFB] hover:text-[#0C0D0F]'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-[#E5E7EB] space-y-1">
                {[
                    { icon: Settings, label: 'Setting', to: '/admin/settings' },
                    { icon: FileText, label: 'Audit Log', to: '/admin/audit-log' },
                ].map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? 'bg-[#EBF5FF] text-[#3E8FCC]'
                                : 'text-[#666666] hover:bg-[#F9FAFB] hover:text-[#0C0D0F]'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </NavLink>
                ))}
            </div>
        </aside>
    )
}
