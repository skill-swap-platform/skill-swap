import React from 'react';
import styles from './SuccessModal.module.css';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewRequests: () => void;
  onBrowseSkills: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  onViewRequests,
  onBrowseSkills
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="rgba(102, 102, 102, 1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className={styles.iconContainer}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="17" stroke="#16A34A" strokeWidth="2" fill="none"/>
            <path d="M13 20L17 24L27 14" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>

        <div className={styles.messageContainer}>
          <h2 className={styles.title}>Request Sent!</h2>
          <p className={styles.description}>
            Your request is now on its way. You'll be notified as soon as the provider responds.
          </p>
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.primaryButton} onClick={onViewRequests}>
            View My Requests
          </button>
          <button className={styles.secondaryButton} onClick={onBrowseSkills}>
            Browse more Skills
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
