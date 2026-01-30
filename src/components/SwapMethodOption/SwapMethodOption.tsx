import React from 'react';
import styles from './SwapMethodOption.module.css';

interface SwapMethodOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgColor: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const SwapMethodOption: React.FC<SwapMethodOptionProps> = ({
  icon,
  title,
  description,
  iconBgColor,
  isSelected = false,
  onClick
}) => {
  return (
    <div 
      className={`${styles.container} ${isSelected ? styles.selected : ''}`}
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
        {isSelected && <div className={styles.radioButtonInner} />}
      </div>
    </div>
  );
};

export default SwapMethodOption;
