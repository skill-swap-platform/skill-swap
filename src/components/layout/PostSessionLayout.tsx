import React from 'react'
import { Search, Bell, MessageSquare } from 'lucide-react'

interface PostSessionLayoutProps {
    children: React.ReactNode
}

export const PostSessionLayout: React.FC<PostSessionLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-[#F9FAFB] font-sans">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <h1 className="text-xl font-bold flex items-center">
                            <span className="text-[#F59E0B]">Skill</span>
                            <span className="text-[#3E8FCC]">Swap</span>
                            <span className="text-[#F59E0B]">.</span>
                        </h1>
                        <nav className="hidden md:flex items-center gap-6">
                            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Home</a>
                            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Requests</a>
                            <a href="#" className="text-[#3E8FCC] border-b-2 border-[#3E8FCC] font-medium h-16 flex items-center">Sessions</a>
                            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Explore</a>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden lg:block w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-100 border-none outline-none focus:ring-1 focus:ring-gray-200 text-sm"
                            />
                        </div>
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                            <MessageSquare className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                            <Bell className="w-5 h-5" />
                        </button>
                        <div className="h-8 w-8 rounded-full bg-[#3E8FCC] text-white grid place-items-center text-xs font-bold ring-2 ring-white cursor-pointer">
                            WA
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12 flex items-center justify-center">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-[#0C1222] text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-1">
                            <h2 className="text-white text-lg font-bold flex items-center mb-4">
                                <span className="text-[#F59E0B]">Skill</span>
                                <span className="text-[#3E8FCC]">Swap</span>
                                <span className="text-[#F59E0B]">.</span>
                            </h2>
                            <p className="text-sm leading-relaxed">
                                Exchange skills, build connections, and grow together
                            </p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-4">Product</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">How it works</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-4">Company</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-4">Legal</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Guidelines</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-gray-800 flex justify-center items-center text-xs">
                        <p>© 2025 Skillswap. All rights reserved</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
