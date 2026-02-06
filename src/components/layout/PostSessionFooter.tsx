import React from 'react'

export const PostSessionFooter: React.FC = () => {
    return (
        <footer className="mt-20 bg-[#0C0D0F] text-white pt-16 pb-8 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                <div className="md:col-span-4 max-w-xs">
                    <div className="text-2xl font-poppins font-bold mb-6 flex items-center gap-0.5">
                        <span className="text-[#F59E0B]">Skill</span>
                        <span className="text-[#3E8FCC]">Swap</span>
                        <span className="text-[#F59E0B]">.</span>
                    </div>
                    <p className="text-sm text-[#9CA3AF] leading-relaxed">
                        Exchange skills, build connections, and grow together
                    </p>
                </div>

                <div className="md:col-span-2">
                    <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Product</h4>
                    <ul className="space-y-4 text-sm text-[#9CA3AF]">
                        <li className="hover:text-white cursor-pointer transition-colors">Features</li>
                        <li className="hover:text-white cursor-pointer transition-colors">How it works</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Pricing</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Success Stories</li>
                    </ul>
                </div>

                <div className="md:col-span-2">
                    <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Company</h4>
                    <ul className="space-y-4 text-sm text-[#9CA3AF]">
                        <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
                    </ul>
                </div>

                <div className="md:col-span-2">
                    <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Legal</h4>
                    <ul className="space-y-4 text-sm text-[#9CA3AF]">
                        <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Cookie Policy</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Guidelines</li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/5 pt-8">
                <div className="max-w-7xl mx-auto px-6 text-center text-[11px] text-[#666666] flex items-center justify-center gap-1.5 font-medium uppercase tracking-[0.1em]">
                    <span className="text-lg leading-none">©</span>
                    <span>2025 SkillSwap. All rights reserved</span>
                </div>
            </div>
        </footer>
    )
}
