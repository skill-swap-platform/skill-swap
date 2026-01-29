import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerInfo}>
          <div className={styles.logo}>
            <span className={styles.logoSkill}>Skill</span>
            <span className={styles.logoSwap}>Swap</span>
            <span className={styles.logoDot}>.</span>
          </div>
          <div className={styles.footerDescription}>
            <p>Exchange skills, build connections, and</p>
            <p>grow together</p>
          </div>
        </div>
        
        <div className={styles.footerLinks}>
          <div className={styles.linkColumn}>
            <h3 className={styles.linkTitle}>Product</h3>
            <div className={styles.linkList}>
              <a href="#" className={styles.link}>Features</a>
              <a href="#" className={styles.link}>How it works</a>
              <a href="#" className={styles.link}>Pricing</a>
              <a href="#" className={styles.link}>Success Stories</a>
            </div>
          </div>
          
          <div className={styles.linkColumn}>
            <h3 className={styles.linkTitle}>Company</h3>
            <div className={styles.linkList}>
              <a href="#" className={styles.link}>About Us</a>
              <a href="#" className={styles.link}>Careers</a>
              <a href="#" className={styles.link}>Blog</a>
              <a href="#" className={styles.link}>Contact</a>
            </div>
          </div>
          
          <div className={styles.linkColumn}>
            <h3 className={styles.linkTitle}>Legal</h3>
            <div className={styles.linkList}>
              <a href="#" className={styles.link}>Privacy Policy</a>
              <a href="#" className={styles.link}>Terms of Service</a>
              <a href="#" className={styles.link}>Cookie Policy</a>
              <a href="#" className={styles.link}>Guidelines</a>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.copyright}>
        <hr className={styles.divider} />
        <div className={styles.copyrightInfo}>
          <svg className={styles.copyrightIcon} width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#999999" strokeWidth="1.5" strokeMiterlimit="10"/>
            <path d="M15 9.5C14.4 8.9 13.5 8.5 12.5 8.5C10.6 8.5 9 10.1 9 12C9 13.9 10.6 15.5 12.5 15.5C13.5 15.5 14.4 15.1 15 14.5" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className={styles.copyrightText}>2025 Skillswap. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
