import React from 'react';
import Avatar from '../Avatar/Avatar';

type HeaderProps = {
  activeTab?: "Chat" | "Explore" | "Home" | "Notifications" | "Requests" | "Sessions" | "Default";
};

const Header: React.FC<HeaderProps> = ({ activeTab = "Home" }) => {
  return (
    <header className="bg-white border-b border-[#e8e8e8] sticky top-0 z-[100] w-full h-20 flex items-center justify-center">
      <nav className="flex items-center justify-between px-20 max-w-[1440px] mx-auto h-12">
        <div className="text-2xl text-center w-[304px] flex-shrink-0">
          <span className="font-poppins font-normal text-warning">Skill</span>
          <span className="font-poppins font-bold text-primary">Swap</span>
          <span className="font-poppins font-bold text-warning">.</span>
        </div>
        
        <div className="flex gap-6 items-center justify-center w-[520px] flex-shrink-0">
          <a 
            href="#" 
            className={activeTab === "Home" ? "font-poppins font-medium text-base text-primary no-underline flex-shrink-0" : "font-poppins font-normal text-base text-dark no-underline flex-shrink-0"}
          >
            Home
          </a>
          <a 
            href="#" 
            className={activeTab === "Requests" ? "font-poppins font-medium text-base text-primary no-underline flex-shrink-0" : "font-poppins font-normal text-base text-dark no-underline flex-shrink-0"}
          >
            Requests
          </a>
          <a 
            href="#" 
            className={activeTab === "Sessions" ? "font-poppins font-medium text-base text-primary no-underline flex-shrink-0" : "font-poppins font-normal text-base text-dark no-underline flex-shrink-0"}
          >
            Sessions
          </a>
          <a 
            href="#" 
            className={activeTab === "Explore" ? "font-poppins font-medium text-base text-primary no-underline flex-shrink-0" : "font-poppins font-normal text-base text-dark no-underline flex-shrink-0"}
          >
            Explore
          </a>
        </div>
        
        <div className="flex gap-4 items-center justify-end w-[411px] flex-shrink-0">
          <div className="bg-gray-light border border-gray-border flex flex-1 gap-1 h-10 items-center px-4 rounded-2xl">
            <svg className="flex-shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 14L11.1 11.1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search..." 
              className="font-sans font-normal text-xs text-gray-400 border-none bg-transparent outline-none flex-1 placeholder:text-gray-400"
            />
          </div>
          
          <div className="flex gap-2 items-center">
            <button className="bg-background-light flex items-center justify-center rounded-3xl w-10 h-10 border-none cursor-pointer flex-shrink-0 hover:bg-[#e8e8ee]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z" stroke="#0C0D0F" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="bg-background-light flex items-center justify-center rounded-3xl w-10 h-10 border-none cursor-pointer flex-shrink-0 hover:bg-[#e8e8ee]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 6.44V9.77" stroke="#0C0D0F" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
                <path d="M12.02 2C8.34 2 5.36 4.98 5.36 8.66V10.76C5.36 11.44 5.08 12.46 4.73 13.04L3.46 15.16C2.68 16.47 3.22 17.93 4.66 18.41C9.44 20 14.61 20 19.39 18.41C20.74 17.96 21.32 16.38 20.59 15.16L19.32 13.04C18.97 12.46 18.69 11.43 18.69 10.76V8.66C18.68 5 15.68 2 12.02 2Z" stroke="#0C0D0F" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
                <path d="M15.33 18.82C15.33 20.65 13.83 22.15 12 22.15C11.09 22.15 10.25 21.77 9.65 21.17C9.05 20.57 8.67 19.73 8.67 18.82" stroke="#0C0D0F" strokeWidth="1.5" strokeMiterlimit="10"/>
              </svg>
            </button>
          </div>
          
          <div className="rounded-xl w-12 h-12 overflow-hidden flex-shrink-0 flex items-center justify-center">
            <Avatar 
              src="https://via.placeholder.com/48" 
              name="User Name" 
              size={40}
            />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
