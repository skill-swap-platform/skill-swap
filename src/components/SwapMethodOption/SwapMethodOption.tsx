import React from 'react';
import styles from './SwapMethodOption.module.css';

interface SwapMethodOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgColor: string;
  isSelected?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'warning';
}

const SwapMethodOption: React.FC<SwapMethodOptionProps> = ({
  icon,
  title,
  description,
  iconBgColor,
  isSelected = false,
  onClick,
  variant = 'default'
}) => {
  const containerClass = `${styles.container} ${isSelected ? (variant === 'warning' ? styles.selectedWarning : styles.selected) : ''} ${variant === 'warning' ? styles.warningVariant : ''}`;
  
  return (
    <div 
      className={containerClass}
      onClick={onClick}
    >
      <div className={styles.iconContainer} style={{ backgroundColor: iconBgColor }}>
        {icon}
      </div>
      <div className={styles.textContainer}>
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.radioButton}>
        {isSelected ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke={variant === 'warning' ? '#FFA412' : '#3272A3'} strokeWidth="2" fill="white"/>
            <path d="M6 10L8.5 12.5L14 7" stroke={variant === 'warning' ? '#FFA412' : '#3272A3'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <div className={styles.emptyCircle} />
        )}
      </div>
    </div>
  );
};

export default SwapMethodOption;
