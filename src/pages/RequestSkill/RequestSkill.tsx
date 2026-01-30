import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SwapMethodOption from '../../components/SwapMethodOption/SwapMethodOption';
import CollapsibleSection from '../../components/CollapsibleSection/CollapsibleSection';
import { CustomDatePicker, CustomTimePicker, TimezoneSelector } from '../../components/DatePicker';
import SuccessModal from '../../components/SuccessModal';
import { Dayjs } from 'dayjs';
import styles from './RequestSkill.module.css';

const RequestSkill: React.FC = () => {
  const [selectedSwapMethod, setSelectedSwapMethod] = useState<'skill' | 'free' | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string>('React Basics');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [userSkills] = useState<string[]>(['React Basics', 'JavaScript Fundamentals', 'CSS Design', 'Node.js Basics']);
  const [message, setMessage] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<string>('12:00 AM');
  const [endTime, setEndTime] = useState<string>('12:00 AM');
  const [timezone, setTimezone] = useState<string>('Jerusalem, Palestine (GMT +2:00)');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const timezones = [
    'Jakarta, Indonesia (GMT +7:00)',
    'Jerusalem, Palestine (GMT +2:00)',
    'Johannesburg, South Africa (GMT +2:00)',
    'Kathmandu, Nepal (GMT +5:45)',
    'Kuala Lumpur, Malaysia (GMT +8:00)',
    'Kuwait City, Kuwait (GMT +3:00)',
    'Lagos, Nigeria (GMT +1:00)'
  ];

  const messageSuggestions = [
    "Hi! I'd love to learn this skill...",
    "Hi! I'd love to learn this skill...",
    "Hi! I'd love to learn this skill..."
  ];

  const handleBackClick = () => {
    // Navigate back logic here
    window.history.back();
  };

  const handleSendRequest = () => {
    // Send request logic here
    console.log('Request sent');
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  const handleViewRequests = () => {
    setShowSuccessModal(false);
    // Navigate to requests page
    console.log('Navigate to requests');
  };

  const handleBrowseSkills = () => {
    setShowSuccessModal(false);
    // Navigate to explore page
    console.log('Navigate to explore');
  };

  // Check if all sections are completed
  const isSection1Complete = !!selectedSwapMethod;
  const isSection2Complete = message.length > 0;
  const isSection3Complete = !!selectedDate && !!startTime && !!endTime;
  const isFormComplete = isSection1Complete && isSection2Complete && isSection3Complete;

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
            defaultExpanded={false}
            isCompleted={isSection1Complete}
          >
            <div className={styles.swapMethodsContainer}>
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

              {selectedSwapMethod === 'skill' && (
                <div className={styles.offeredSkillContainer}>
                  <div className={styles.offeredSkillWrapper}>
                    <div className={styles.offeredSkillTitleContainer}>
                      <h3 className={styles.offeredSkillTitle}>Your offered skill</h3>
                      <p className={styles.offeredSkillDescription}>Select one of your skills to exchange with the provider.</p>
                    </div>
                    <div className={styles.offeredSkillSelectionContainer}>
                      <div className={styles.skillDropdownWrapper}>
                        <button 
                          className={styles.skillDropdown}
                          onClick={() => setShowSkillDropdown(!showSkillDropdown)}
                        >
                          <span className={styles.skillDropdownText}>{selectedSkill}</span>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.dropdownArrow}>
                            <path d="M4 6L8 10L12 6" stroke="#0C0D0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        {showSkillDropdown && (
                          <div className={styles.skillDropdownMenu}>
                            {userSkills.map((skill) => (
                              <div
                                key={skill}
                                className={styles.skillDropdownItem}
                                onClick={() => {
                                  setSelectedSkill(skill);
                                  setShowSkillDropdown(false);
                                }}
                              >
                                {skill}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <button className={styles.addSkillButton}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M12 6V18M6 12H18" stroke="#3272A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Add new Skill</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
                variant="warning"
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            number={2}
            title="Write a message to provider (optional)"
            description="Introduce yourself and explain what you want to learn."
            defaultExpanded={false}
            isCompleted={isSection2Complete}
          >
            <div className={styles.messageContainer}>
              <div className={styles.textareaWrapper}>
                <textarea
                  className={styles.messageTextarea}
                  placeholder="Hi! I've always wanted to improve my speaking skills for my upcoming conference..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                />
                <div className={styles.characterCount}>
                  {message.length} / 500
                </div>
              </div>
            </div>
            <div className={styles.suggestionContainer}>
              {messageSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className={styles.suggestionButton}
                  onClick={() => setMessage(suggestion)}
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            number={3}
            title="Select preferred time "
            description="Pick a preferred date and time."
            defaultExpanded={false}
            isCompleted={isSection3Complete}
          >
            <div className={styles.timeSelectionContainer}>
              <div className={styles.inputField}>
                <label className={styles.inputLabel}>Date</label>
                <CustomDatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  placeholder="DD/MM/YYYY"
                />
              </div>

              <div className={styles.timeInputsRow}>
                <div className={styles.timeInputField}>
                  <label className={styles.inputLabel}>Start</label>
                  <CustomTimePicker
                    value={startTime}
                    onChange={setStartTime}
                    label="Start"
                  />
                </div>

                <div className={styles.timeSeparator}>to</div>

                <div className={styles.timeInputField}>
                  <label className={styles.inputLabel}>End</label>
                  <CustomTimePicker
                    value={endTime}
                    onChange={setEndTime}
                    label="End"
                  />
                </div>
              </div>

              <div className={styles.timezoneWrapper}>
                <TimezoneSelector
                  value={timezone}
                  onChange={setTimezone}
                  timezones={timezones}
                />
              </div>
            </div>
          </CollapsibleSection>

          <div className={styles.buttonContainer}>
            <button 
              className={styles.sendButton}
              onClick={handleSendRequest}
              disabled={!isFormComplete}
            >
              Send Request
            </button>
          </div>
        </div>
        </div>
      </div>

      <Footer />
      
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        onViewRequests={handleViewRequests}
        onBrowseSkills={handleBrowseSkills}
      />
    </div>
  );
};

export default RequestSkill;
