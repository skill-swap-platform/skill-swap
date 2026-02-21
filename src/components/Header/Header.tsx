import React, { useState, useRef, useEffect } from "react";
import Avatar from "../Avatar/Avatar";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../api/services/auth.service";

type HeaderProps = {
  activeTab?:
  | "Chat"
  | "Explore"
  | "Home"
  | "Notifications"
  | "Requests"
  | "Sessions"
  | "Default";
};

type NavItem = {
  label: string;
  to: string;
  tab: HeaderProps["activeTab"];
};

const navItems: NavItem[] = [
  { label: "Home", to: "/", tab: "Home" },
  { label: "Requests", to: "/requests-sent", tab: "Requests" },
  { label: "Sessions", to: "/sessions", tab: "Sessions" },
  { label: "Explore", to: "/explore", tab: "Explore" },
];

const Header: React.FC<HeaderProps> = ({ activeTab = "Home" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    await authService.logout();
    navigate("/auth/login");
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen]);

  const getNavClass = (tab: HeaderProps["activeTab"], mobile = false) => {
    const base = mobile
      ? "font-poppins text-base no-underline py-2 text-center"
      : "font-poppins text-base no-underline";

    return activeTab === tab
      ? `${base} font-medium text-primary`
      : `${base} font-normal text-dark hover:text-primary`;
  };

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-[#e8e8e8] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
      <nav className="relative mx-auto grid h-16 w-full max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:h-20 lg:px-10 xl:px-16">
        <div className="col-start-1 ml-2 text-xl md:text-2xl lg:ml-4">
          <span className="font-poppins font-normal text-warning">Skill</span>
          <span className="font-poppins font-bold text-primary">Swap</span>
          <span className="font-poppins font-bold text-warning">.</span>
        </div>

        <div className="col-start-2 hidden items-center justify-center gap-3 lg:flex xl:gap-6">
          {navItems.map((item) => (
            <Link key={item.label} to={item.to} className={getNavClass(item.tab)}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="col-start-3 hidden min-w-0 items-center justify-self-end gap-2 lg:flex xl:gap-4">
          <div className="flex h-10 w-[150px] min-w-0 items-center gap-1 rounded-2xl border border-gray-border bg-gray-light px-4 xl:w-[220px]">
            <svg
              className="flex-shrink-0"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
                stroke="#9CA3AF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 14L11.1 11.1"
                stroke="#9CA3AF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="w-full flex-1 border-none bg-transparent font-sans text-xs font-normal text-gray-400 outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-3xl border-none bg-background-light transition-colors hover:bg-[#e8e8ee]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z"
                  stroke="#0C0D0F"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-3xl border-none bg-background-light transition-colors hover:bg-[#e8e8ee]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
          </div>

          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex h-12 w-12 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-none bg-transparent p-0 transition-all hover:ring-2 hover:ring-primary/30"
              aria-label="Profile menu"
            >
              <Avatar
                src="https://api.dicebear.com/7.x/notionists/svg?seed=currentuser"
                name="User Name"
                size={40}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {profileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-xl border border-[#e8e8e8] bg-white py-2 shadow-lg ring-1 ring-black/5">
                <div className="border-b border-[#e8e8e8] px-4 py-3">
                  <p className="text-sm font-medium text-dark">User Name</p>
                  <p className="text-xs text-gray-500">user@example.com</p>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-dark no-underline transition-colors hover:bg-gray-50"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                        stroke="#6B7280"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
                        stroke="#6B7280"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    My Profile
                  </Link>


                  <Link
                    to="/profile/settings"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-dark no-underline transition-colors hover:bg-gray-50"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                        stroke="#6B7280"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z"
                        stroke="#6B7280"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Settings
                  </Link>
                </div>

                <div className="border-t border-[#e8e8e8] pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full cursor-pointer items-center gap-3 border-none bg-transparent px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M8.90002 7.56023C9.21002 3.96023 11.06 2.49023 15.11 2.49023H15.24C19.71 2.49023 21.5 4.28023 21.5 8.75023V15.2702C21.5 19.7402 19.71 21.5302 15.24 21.5302H15.11C11.09 21.5302 9.24002 20.0802 8.91002 16.5402"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15 12H3.62"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.85 8.65039L2.5 12.0004L5.85 15.3504"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          className="col-start-3 flex h-10 w-10 cursor-pointer items-center justify-self-end border-none bg-transparent lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="#0C0D0F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 12h18M3 6h18M3 18h18"
                stroke="#0C0D0F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-[#e8e8e8] bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-[#e8e8e8] pb-4">
              <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-2xl border border-gray-border bg-gray-light px-3">
                <svg
                  className="flex-shrink-0"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
                    stroke="#9CA3AF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 14L11.1 11.1"
                    stroke="#9CA3AF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full flex-1 border-none bg-transparent font-sans text-xs font-normal text-gray-400 outline-none placeholder:text-gray-400"
                />
              </div>

              <div className="flex flex-shrink-0 items-center gap-2">
                <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-3xl border-none bg-background-light">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z"
                      stroke="#0C0D0F"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-3xl border-none bg-background-light">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl">
                  <Avatar
                    src="https://api.dicebear.com/7.x/notionists/svg?seed=currentuser"
                    name="User Name"
                    size={40}
                  />
                </div>
              </div>
            </div>

            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={getNavClass(item.tab, true)}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-red-50 py-3 text-red-600 transition-colors hover:bg-red-100"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M8.90002 7.56023C9.21002 3.96023 11.06 2.49023 15.11 2.49023H15.24C19.71 2.49023 21.5 4.28023 21.5 8.75023V15.2702C21.5 19.7402 19.71 21.5302 15.24 21.5302H15.11C11.09 21.5302 9.24002 20.0802 8.91002 16.5402"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 12H3.62"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.85 8.65039L2.5 12.0004L5.85 15.3504"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
