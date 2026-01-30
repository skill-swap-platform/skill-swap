import React, { useState } from 'react';
import styles from './CollapsibleSection.module.css';

interface CollapsibleSectionProps {
  number: number;
  title: string;
  description?: string;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
  isCompleted?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  number,
  title,
  description,
  children,
  defaultExpanded = false,
  isCompleted = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`${styles.container} ${isCompleted ? styles.completed : ''}`}>
      <div className={styles.header} onClick={toggleExpanded}>
        <div className={styles.titleContainer}>
          <div className={styles.titleWrapper}>
            <ol className={styles.numberList} start={number}>
              <li className={styles.listItem}>
                <span>{title}</span>
              </li>
            </ol>
            {description && !isExpanded && (
              <p className={styles.description}>{description}</p>
            )}
          </div>
        </div>
        {isCompleted ? (
          <div className={styles.checkIcon}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8.5" stroke="#16A34A" strokeWidth="1.5" fill="none"/>
              <path d="M6.5 10L8.5 12L13.5 7" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
        ) : (
          <div className={`${styles.arrowIcon} ${isExpanded ? styles.arrowExpanded : ''}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8.91016 19.92L15.4302 13.4C16.2002 12.63 16.2002 11.37 15.4302 10.6L8.91016 4.08" stroke="#0C0D0F" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
      {isExpanded && children && (
        <div className={styles.content}>
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
