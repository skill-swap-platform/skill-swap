import React from 'react';
import styles from './Header.module.css';

type HeaderProps = {
  activeTab?: "Chat" | "Explore" | "Home" | "Notifications" | "Requests" | "Sessions" | "Default";
};

const Header: React.FC<HeaderProps> = ({ activeTab = "Home" }) => {
  return (
    <header className={styles.header}>
      <nav className={styles.navigation}>
        <div className={styles.logo}>
          <span className={styles.logoSkill}>Skill</span>
          <span className={styles.logoSwap}>Swap</span>
          <span className={styles.logoDot}>.</span>
        </div>
        
        <div className={styles.navLinks}>
          <a 
            href="#" 
            className={activeTab === "Home" ? styles.navLinkActive : styles.navLink}
          >
            Home
          </a>
          <a 
            href="#" 
            className={activeTab === "Requests" ? styles.navLinkActive : styles.navLink}
          >
            Requests
          </a>
          <a 
            href="#" 
            className={activeTab === "Sessions" ? styles.navLinkActive : styles.navLink}
          >
            Sessions
          </a>
          <a 
            href="#" 
            className={activeTab === "Explore" ? styles.navLinkActive : styles.navLink}
          >
            Explore
          </a>
        </div>
        
        <div className={styles.userActions}>
          <div className={styles.searchBar}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 14L11.1 11.1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search..." 
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.iconButtons}>
            <button className={styles.iconButton}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z" stroke="#0C0D0F" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className={styles.iconButton}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 6.44V9.77" stroke="#0C0D0F" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
                <path d="M12.02 2C8.34 2 5.36 4.98 5.36 8.66V10.76C5.36 11.44 5.08 12.46 4.73 13.04L3.46 15.16C2.68 16.47 3.22 17.93 4.66 18.41C9.44 20 14.61 20 19.39 18.41C20.74 17.96 21.32 16.38 20.59 15.16L19.32 13.04C18.97 12.46 18.69 11.43 18.69 10.76V8.66C18.68 5 15.68 2 12.02 2Z" stroke="#0C0D0F" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
                <path d="M15.33 18.82C15.33 20.65 13.83 22.15 12 22.15C11.09 22.15 10.25 21.77 9.65 21.17C9.05 20.57 8.67 19.73 8.67 18.82" stroke="#0C0D0F" strokeWidth="1.5" strokeMiterlimit="10"/>
              </svg>
            </button>
          </div>
          
          <div className={styles.profilePicture}>
            <img 
              src="https://via.placeholder.com/48" 
              alt="Profile" 
              className={styles.profileImage}
            />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
