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

const Header: React.FC<HeaderProps> = ({ activeTab = "Home" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-[#e8e8e8] sticky top-0 z-[100] w-full">
      <nav className="flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-20 max-w-[1440px] mx-auto h-16 md:h-20 w-full">
        {/* Logo */}
        <div className="text-xl md:text-2xl flex-shrink-0 lg:w-[304px]">
          <span className="font-poppins font-normal text-warning">Skill</span>
          <span className="font-poppins font-bold text-primary">Swap</span>
          <span className="font-poppins font-bold text-warning">.</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-4 xl:gap-6 items-center justify-center lg:w-[520px] flex-shrink-0">
          <Link
            to={"/"}
            className={
              activeTab === "Home"
                ? "font-poppins font-medium text-base text-primary no-underline"
                : "font-poppins font-normal text-base text-dark no-underline hover:text-primary"
            }
          >
            Home
          </Link>
          <Link 
            to="/requests-sent" 
            className={activeTab === "Requests" ? "font-poppins font-medium text-base text-primary no-underline" : "font-poppins font-normal text-base text-dark no-underline hover:text-primary"}
          >
            Requests
          </Link>
          <Link
            to={"/sessions"}
            className={
              activeTab === "Sessions"
                ? "font-poppins font-medium text-base text-primary no-underline"
                : "font-poppins font-normal text-base text-dark no-underline hover:text-primary"
            }
          >
            Sessions
          </Link>
          <Link
            to={"/explore"}
            className={
              activeTab === "Explore"
                ? "font-poppins font-medium text-base text-primary no-underline"
                : "font-poppins font-normal text-base text-dark no-underline hover:text-primary"
            }
          >
            Explore
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex gap-2 lg:gap-4 items-center justify-end lg:w-[411px] flex-shrink-0">
          {/* Search Bar - Hidden on tablets, shown on desktop */}
          <div className="hidden lg:flex bg-gray-light border border-gray-border gap-1 h-10 items-center px-4 rounded-2xl flex-1 max-w-[200px]">
            <svg className="flex-shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 14L11.1 11.1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="font-sans font-normal text-xs text-gray-400 border-none bg-transparent outline-none flex-1 placeholder:text-gray-400 w-full"
            />
          </div>

          <div className="flex gap-2 items-center">
            <button className="bg-background-light flex items-center justify-center rounded-3xl w-10 h-10 border-none cursor-pointer hover:bg-[#e8e8ee] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z" stroke="#0C0D0F" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="bg-background-light flex items-center justify-center rounded-3xl w-10 h-10 border-none cursor-pointer hover:bg-[#e8e8ee] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 17.8476C17.6392 17.8476 20.2481 17.1242 20.5 14.2205C20.5 11.3188 18.6812 11.5054 18.6812 7.94511C18.6812 5.16414 16.0452 2 12 2C7.95477 2 5.31885 5.16414 5.31885 7.94511C5.31885 11.5054 3.5 11.3188 3.5 14.2205C3.75295 17.1352 6.36177 17.8476 12 17.8476Z" stroke="#0C0D0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.3887 20.8572C13.0246 22.372 10.8966 22.3899 9.51941 20.8572" stroke="#0C0D0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="rounded-xl w-12 h-12 overflow-hidden flex items-center justify-center flex-shrink-0">
            <Avatar 
              src="https://api.dicebear.com/7.x/notionists/svg?seed=currentuser" 
              name="User Name" 
              size={40}
            />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center justify-center w-10 h-10 border-none bg-transparent cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#0C0D0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="#0C0D0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#e8e8e8] px-4 py-4">
          <div className="flex flex-col gap-4">
            {/* Mobile Search & Actions */}
            <div className="flex gap-2 items-center justify-between pb-4 border-b border-[#e8e8e8]">
              {/* Search Bar - Half Width */}
              <div className="bg-gray-light border border-gray-border flex gap-2 h-10 items-center px-3 rounded-2xl flex-1 max-w-[50%]">
                <svg className="flex-shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 14L11.1 11.1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  className="font-sans font-normal text-xs text-gray-400 border-none bg-transparent outline-none flex-1 placeholder:text-gray-400 w-full"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 items-center">
                <button className="bg-background-light flex items-center justify-center rounded-3xl w-10 h-10 border-none cursor-pointer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z" stroke="#0C0D0F" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button className="bg-background-light flex items-center justify-center rounded-3xl w-10 h-10 border-none cursor-pointer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 17.8476C17.6392 17.8476 20.2481 17.1242 20.5 14.2205C20.5 11.3188 18.6812 11.5054 18.6812 7.94511C18.6812 5.16414 16.0452 2 12 2C7.95477 2 5.31885 5.16414 5.31885 7.94511C5.31885 11.5054 3.5 11.3188 3.5 14.2205C3.75295 17.1352 6.36177 17.8476 12 17.8476Z" stroke="#0C0D0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14.3887 20.8572C13.0246 22.372 10.8966 22.3899 9.51941 20.8572" stroke="#0C0D0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="rounded-xl w-10 h-10 overflow-hidden flex items-center justify-center">
                  <Avatar 
                    src="https://api.dicebear.com/7.x/notionists/svg?seed=currentuser" 
                    name="User Name" 
                    size={40}
                  />
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <Link
              to={"/"}
              className={
                activeTab === "Home"
                  ? "font-poppins font-medium text-base text-primary no-underline py-2 text-center"
                  : "font-poppins font-normal text-base text-dark no-underline py-2 text-center"
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/requests-sent" 
              className={activeTab === "Requests" ? "font-poppins font-medium text-base text-primary no-underline py-2 text-center" : "font-poppins font-normal text-base text-dark no-underline py-2 text-center"}
              onClick={() => setMobileMenuOpen(false)}
            >
              Requests
            </Link>
            <Link
              to={"/sessions"}
              className={
                activeTab === "Sessions"
                  ? "font-poppins font-medium text-base text-primary no-underline py-2 text-center"
                  : "font-poppins font-normal text-base text-dark no-underline py-2 text-center"
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Sessions
            </Link>
            <Link
              to={"/explore"}
              className={
                activeTab === "Explore"
                  ? "font-poppins font-medium text-base text-primary no-underline py-2 text-center"
                  : "font-poppins font-normal text-base text-dark no-underline py-2 text-center"
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
