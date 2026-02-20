import React, { useState } from "react";
import Avatar from "../Avatar/Avatar";
import { Link } from "react-router-dom";

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

          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl">
            <Avatar
              src="https://api.dicebear.com/7.x/notionists/svg?seed=currentuser"
              name="User Name"
              size={40}
            />
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
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
