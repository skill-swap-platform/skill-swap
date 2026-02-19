import React from 'react';
import Avatar from '../Avatar/Avatar';
import { Link } from 'react-router-dom';

type HeaderProps = {
  activeTab?: "Chat" | "Explore" | "Home" | "Notifications" | "Requests" | "Sessions" | "Default";
};

const Header: React.FC<HeaderProps> = ({ activeTab = "Home" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/", tab: "Home" },
    { name: "Requests", path: "/requests-sent", tab: "Requests" },
    { name: "Sessions", path: "/sessions", tab: "Sessions" },
    { name: "Explore", path: "/explore", tab: "Explore" },
  ];

  return (
    <header className="bg-white border-b border-[#e8e8e8] sticky top-0 z-[100] w-full h-20 flex items-center shadow-sm">
      <nav className="w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 flex items-center justify-between h-full">
        <Link to="/" className="text-2xl flex-shrink-0 no-underline">
          <span className="font-poppins font-normal text-warning">Skill</span>
          <span className="font-poppins font-bold text-primary">Swap</span>
          <span className="font-poppins font-bold text-warning">.</span>
        </div>

        <div className="flex gap-6 items-center justify-center w-[520px] flex-shrink-0">
          <Link
            to={"/"}
            className={activeTab === "Home" ? "font-poppins font-medium text-base text-primary no-underline flex-shrink-0" : "font-poppins font-normal text-base text-dark no-underline flex-shrink-0"}
          >
            Home
          </Link>
          <Link
            to="/requests"
            className={activeTab === "Requests" ? "font-poppins font-medium text-base text-primary no-underline flex-shrink-0" : "font-poppins font-normal text-base text-dark no-underline flex-shrink-0"}
          >
            Requests
          </Link>
          <Link
            to={"/sessions"}
            className={activeTab === "Sessions" ? "font-poppins font-medium text-base text-primary no-underline flex-shrink-0" : "font-poppins font-normal text-base text-dark no-underline flex-shrink-0"}
          >
            Sessions
          </Link>
          <Link
            to={"/explore"}
            className={activeTab === "Explore" ? "font-poppins font-medium text-base text-primary no-underline flex-shrink-0" : "font-poppins font-normal text-base text-dark no-underline flex-shrink-0"}
          >
            Explore
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <div className="hidden lg:flex bg-gray-50 border border-gray-200 gap-2 h-10 items-center px-4 rounded-xl w-[240px] transition-all focus-within:w-[300px] focus-within:border-primary/50">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="font-sans text-xs bg-transparent outline-none flex-1 placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors hidden sm:flex">
              <MessageSquare className="w-[22px] h-[22px] text-gray-700" />
            </button>
            <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors hidden sm:flex">
              <Bell className="w-[22px] h-[22px] text-gray-700" />
            </button>
            <button className="bg-background-light flex items-center justify-center rounded-3xl w-10 h-10 border-none cursor-pointer flex-shrink-0 hover:bg-[#e8e8ee]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 6.44V9.77" stroke="#0C0D0F" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" />
                <path d="M12.02 2C8.34 2 5.36 4.98 5.36 8.66V10.76C5.36 11.44 5.08 12.46 4.73 13.04L3.46 15.16C2.68 16.47 3.22 17.93 4.66 18.41C9.44 20 14.61 20 19.39 18.41C20.74 17.96 21.32 16.38 20.59 15.16L19.32 13.04C18.97 12.46 18.69 11.43 18.69 10.76V8.66C18.68 5 15.68 2 12.02 2Z" stroke="#0C0D0F" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" />
                <path d="M15.33 18.82C15.33 20.65 13.83 22.15 12 22.15C11.09 22.15 10.25 21.77 9.65 21.17C9.05 20.57 8.67 19.73 8.67 18.82" stroke="#0C0D0F" strokeWidth="1.5" strokeMiterlimit="10" />
              </svg>
            </button>
          </div>

          <div className="rounded-xl w-12 h-12 overflow-hidden flex-shrink-0 flex items-center justify-center">
            <Avatar
              src={null}
              name="User Name"
              size={40}
            />
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white border-b border-gray-200 py-4 px-6 md:hidden flex flex-col gap-4 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="bg-gray-50 border border-gray-200 flex gap-2 h-11 items-center px-4 rounded-xl">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search skills, sessions..."
              className="text-sm bg-transparent outline-none flex-1"
            />
          </div>

          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`py-3 px-2 rounded-lg text-base font-semibold transition-colors no-underline ${activeTab === link.tab
                  ? "bg-blue-50 text-primary"
                  : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button className="flex-1 py-3 flex items-center justify-center gap-2 rounded-lg bg-gray-50 text-sm font-bold text-gray-700">
              <MessageSquare className="w-5 h-5" /> Chat
            </button>
            <button className="flex-1 py-3 flex items-center justify-center gap-2 rounded-lg bg-gray-50 text-sm font-bold text-gray-700">
              <Bell className="w-5 h-5" /> Alerts
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
