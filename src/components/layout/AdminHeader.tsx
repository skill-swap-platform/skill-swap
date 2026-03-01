import React, { useEffect, useRef, useState } from 'react'
import { ChevronDown, Menu } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from '@/components/Avatar/Avatar'
import { authService } from '@/api/services/auth.service'

const DEFAULT_AVATAR_URL = 'https://api.dicebear.com/7.x/notionists/svg?seed=currentuser'

type AdminHeaderProps = {
    onOpenMobileMenu: () => void
    userName?: string | null
    userEmail?: string | null
    userRole?: string | null
    userAvatar?: string | null
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
    onOpenMobileMenu,
    userName,
    userEmail,
    userRole,
    userAvatar,
}) => {
    const navigate = useNavigate()
    const [profileMenuOpen, setProfileMenuOpen] = useState(false)
    const profileMenuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setProfileMenuOpen(false)
            }
        }

        if (profileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [profileMenuOpen])

    const userDisplayName = userName?.trim() || userEmail?.split('@')[0] || 'User Name'
    const userDisplayEmail = userEmail || 'user@example.com'
    const userRoleLabel = userRole?.trim() ? userRole.toLowerCase() : 'admin'
    const userAvatarSrc = userAvatar?.trim() || DEFAULT_AVATAR_URL

    const handleLogout = async () => {
        setProfileMenuOpen(false)
        await authService.logout()
        navigate('/auth/login')
    }

    return (
        <header className="flex h-[80px] items-center justify-between border-b border-[#F3F4F6] bg-white px-4 md:justify-end md:px-6">
            <div className="flex items-center gap-3 md:hidden">
                <button
                    type="button"
                    onClick={onOpenMobileMenu}
                    className="rounded-lg p-2 text-[#1C1C1C] transition-colors hover:bg-[#F3F4F6]"
                    aria-label="Open menu"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <div className="text-lg font-poppins font-bold">
                    <span className="text-[#F59E0B]">Skill</span>
                    <span className="text-[#3E8FCC]">Swap</span>
                    <span className="text-[#F59E0B]">.</span>
                </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
                <button type="button" className="rounded-full p-2 text-[#1C1C1C] hover:bg-[#F3F4F6]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 17.8476C17.6392 17.8476 20.2481 17.1242 20.5 14.2205C20.5 11.3188 18.6812 11.5054 18.6812 7.94511C18.6812 5.16414 16.0452 2 12 2C7.95477 2 5.31885 5.16414 5.31885 7.94511C5.31885 11.5054 3.5 11.3188 3.5 14.2205C3.75295 17.1352 6.36177 17.8476 12 17.8476Z"
                            stroke="#0C0D0F"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M14.3887 20.8572C13.0246 22.372 10.8966 22.3899 9.51941 20.8572"
                            stroke="#0C0D0F"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                <div className="relative" ref={profileMenuRef}>
                    <button
                        type="button"
                        onClick={() => setProfileMenuOpen((previous) => !previous)}
                        className="flex items-center gap-2 rounded-xl border-none bg-transparent p-0 transition-colors"
                        aria-label="Profile menu"
                    >
                        <Avatar src={userAvatarSrc} name={userDisplayName} size={40} />
                        <div className="hidden text-left sm:block">
                            <p className="text-sm text-[#0C0D0F]">{userDisplayName}</p>
                            <p className="text-xs capitalize text-[#666666]">{userRoleLabel}</p>
                        </div>
                        <ChevronDown
                            className={`h-4 w-4 text-[#666666] transition-transform ${
                                profileMenuOpen ? 'rotate-180' : ''
                            }`}
                        />
                    </button>

                    {profileMenuOpen && (
                        <div className="absolute right-0 top-full z-20 mt-2 w-56 origin-top-right rounded-xl border border-[#E8E8E8] bg-white py-2 shadow-lg ring-1 ring-black/5">
                            <div className="border-b border-[#E8E8E8] px-4 py-3">
                                <p className="text-sm font-medium text-dark">{userDisplayName}</p>
                                <p className="text-xs text-gray-500">{userDisplayEmail}</p>
                            </div>

                            <div className="py-1">
                                <Link
                                    to="/profile"
                                    onClick={() => setProfileMenuOpen(false)}
                                    className="flex w-full items-center px-4 py-2.5 text-left text-sm text-dark no-underline transition-colors hover:bg-gray-50"
                                >
                                    My Profile
                                </Link>
                                <Link
                                    to="/profile/settings"
                                    onClick={() => setProfileMenuOpen(false)}
                                    className="flex w-full items-center px-4 py-2.5 text-left text-sm text-dark no-underline transition-colors hover:bg-gray-50"
                                >
                                    Settings
                                </Link>
                            </div>

                            <div className="border-t border-[#E8E8E8] pt-1">
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full cursor-pointer items-center border-none bg-transparent px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
