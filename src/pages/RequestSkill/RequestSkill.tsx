import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SwapMethodOption from '../../components/SwapMethodOption/SwapMethodOption';
import CollapsibleSection from '../../components/CollapsibleSection/CollapsibleSection';
import styles from './RequestSkill.module.css';

const RequestSkill: React.FC = () => {
  const [selectedSwapMethod, setSelectedSwapMethod] = useState<'skill' | 'free' | null>(null);

  const handleBackClick = () => {
    // Navigate back logic here
    window.history.back();
  };

  const handleSendRequest = () => {
    // Send request logic here
    console.log('Request sent');
  };

  return (
    <div className={styles.pageContainer}>
      <Header activeTab="Default" />
      
      <div className={styles.mainContent}>
        <div>
          <div className={styles.pageTitle}>
            <button className={styles.backButton} onClick={handleBackClick}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M20 26L10 16L20 6" stroke="#0C0D0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className={styles.title}>Request Skill</h1>
          </div>

          <div className={styles.formContainer}>
          <CollapsibleSection
            number={1}
            title="Select swap method"
            description="Choose the swap method that suits you best."
            defaultExpanded={true}
          >
            <SwapMethodOption
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.91602 2.70898L3.33268 5.67565C2.34935 6.30898 2.34935 7.80898 3.33268 8.44232L7.91602 11.409C8.66602 11.909 9.84935 11.909 10.5993 11.409L15.166 8.44232C16.1493 7.80898 16.1493 6.30898 15.166 5.67565L10.5827 2.70898C9.84935 2.20898 8.66602 2.20898 7.91602 2.70898Z" stroke="#2F71A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.58398 10.625L4.58398 13.7917C4.58398 14.775 5.30065 15.9583 6.16732 16.4167L9.05898 18.0667C9.58398 18.3583 10.409 18.3583 10.934 18.0667L13.8256 16.4167C14.6923 15.9583 15.409 14.775 15.409 13.7917V10.6417" stroke="#2F71A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17.084 12.5V7.5" stroke="#2F71A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              title="Skill Swap"
              description="Exchange one of your skills in return."
              iconBgColor="rgba(47, 113, 163, 0.2)"
              isSelected={selectedSwapMethod === 'skill'}
              onClick={() => setSelectedSwapMethod('skill')}
            />
            <SwapMethodOption
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M9.99935 18.3333C14.6017 18.3333 18.3327 14.6024 18.3327 10C18.3327 5.39763 14.6017 1.66667 9.99935 1.66667C5.39698 1.66667 1.66602 5.39763 1.66602 10C1.66602 14.6024 5.39698 18.3333 9.99935 18.3333Z" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 13.75V11.25" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 6.66667H10.0083" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              title="Free Session"
              description="Learn without offering one in return."
              iconBgColor="rgba(245, 158, 11, 0.3)"
              isSelected={selectedSwapMethod === 'free'}
              onClick={() => setSelectedSwapMethod('free')}
            />
          </CollapsibleSection>

          <CollapsibleSection
            number={2}
            title="Write a message to provider"
          />

          <CollapsibleSection
            number={3}
            title="Select preferred time "
          />

          <div className={styles.buttonContainer}>
            <button 
              className={styles.sendButton}
              onClick={handleSendRequest}
              disabled={!selectedSwapMethod}
            >
              Send Request
            </button>
          </div>
        </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RequestSkill;
