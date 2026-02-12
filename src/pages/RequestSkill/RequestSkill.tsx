import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SwapMethodOption from '../../components/SwapMethodOption/SwapMethodOption';
import CollapsibleSection from '../../components/CollapsibleSection/CollapsibleSection';
import { CustomDatePicker, CustomTimePicker, TimezoneSelector } from '../../components/DatePicker';
import SuccessModal from '../../components/SuccessModal';
import { Dayjs } from 'dayjs';

const RequestSkill: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSwapMethod, setSelectedSwapMethod] = useState<'skill' | 'free' | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string>('React Basics');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [userSkills, setUserSkills] = useState<string[]>(['React Basics', 'JavaScript Fundamentals', 'CSS Design', 'Node.js Basics']);
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
    navigate(-1);
  };

  const handleAddNewSkill = () => {
    navigate('/request-skill/add-skill');
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

  useEffect(() => {
    const state = location.state as { newSkill?: string } | null;
    const incomingSkill = state?.newSkill?.trim();

    if (!incomingSkill) return;

    setUserSkills((prev) => (prev.includes(incomingSkill) ? prev : [incomingSkill, ...prev]));
    setSelectedSkill(incomingSkill);
    setShowSkillDropdown(false);
    navigate(location.pathname, { replace: true });
  }, [location.pathname, location.state, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-light">
      <Header activeTab="Default" />

      <div className="flex-1 flex flex-col items-center px-5 py-10">
        <div className="bg-white rounded-lg p-6 w-full max-w-[846px] shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <button className="bg-transparent border-none w-8 h-8 flex items-center justify-center cursor-pointer rounded-sm p-0 transition-colors hover:bg-gray-100" onClick={handleBackClick}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M13.3327 26.6667L4.66602 18L13.3327 9.33334" stroke="#0C0D0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M27.3327 18H4.66602" stroke="#0C0D0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1 className="font-bold text-3xl text-dark m-0">Request Skill</h1>
          </div>

          <div className="flex flex-col gap-6 w-full">
            <CollapsibleSection
              number={1}
              title="Select swap method"
              description="Choose the swap method that suits you best."
              defaultExpanded={false}
              isCompleted={isSection1Complete}
            >
              <div className="flex flex-col gap-3 w-full">
                <SwapMethodOption
                  icon={
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M7.91602 2.70898L3.33268 5.67565C2.34935 6.30898 2.34935 7.80898 3.33268 8.44232L7.91602 11.409C8.66602 11.909 9.84935 11.909 10.5993 11.409L15.166 8.44232C16.1493 7.80898 16.1493 6.30898 15.166 5.67565L10.5827 2.70898C9.84935 2.20898 8.66602 2.20898 7.91602 2.70898Z" stroke="#2F71A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M4.58398 10.625L4.58398 13.7917C4.58398 14.775 5.30065 15.9583 6.16732 16.4167L9.05898 18.0667C9.58398 18.3583 10.409 18.3583 10.934 18.0667L13.8256 16.4167C14.6923 15.9583 15.409 14.775 15.409 13.7917V10.6417" stroke="#2F71A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M17.084 12.5V7.5" stroke="#2F71A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                  title="Skill Swap"
                  description="Exchange one of your skills in return."
                  iconBgColor="rgba(47, 113, 163, 0.2)"
                  isSelected={selectedSwapMethod === 'skill'}
                  onClick={() => setSelectedSwapMethod('skill')}
                />

                {selectedSwapMethod === 'skill' && (
                  <div className="px-4 w-full">
                    <div className="border border-primary rounded-lg p-4 flex flex-col gap-4 bg-white">
                      <div className="flex flex-col gap-1">
                        <h3 className="font-semibold text-lg text-dark m-0">Your offered skill</h3>
                        <p className="font-normal text-sm text-dark-light m-0">Select one of your skills to exchange with the provider.</p>
                      </div>
                      <div className="flex flex-col gap-2.5 px-4">
                        <div className="relative w-full">
                          <button
                            className="bg-white border border-gray-border rounded-md h-12 w-full flex items-center justify-between px-4 cursor-pointer transition-colors hover:border-primary"
                            onClick={() => setShowSkillDropdown(!showSkillDropdown)}
                          >
                            <span className="font-semibold text-xs text-dark text-left flex-1">{selectedSkill}</span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 transition-transform">
                              <path d="M4 6L8 10L12 6" stroke="#0C0D0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          {showSkillDropdown && (
                            <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-gray-border rounded-md shadow-card z-10 overflow-hidden">
                              {userSkills.map((skill) => (
                                <div
                                  key={skill}
                                  className="py-3 px-4 font-semibold text-xs text-dark cursor-pointer transition-colors hover:bg-gray-light"
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
                        <button
                          type="button"
                          onClick={handleAddNewSkill}
                          className="border border-primary rounded-md h-8 w-[163px] flex items-center justify-center gap-1 bg-transparent cursor-pointer transition-colors hover:bg-primary-dark/5"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 6V18M6 12H18" stroke="#3272A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="font-normal text-13 text-primary">Add new Skill</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <SwapMethodOption
                  icon={
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M9.99935 18.3333C14.6017 18.3333 18.3327 14.6024 18.3327 10C18.3327 5.39763 14.6017 1.66667 9.99935 1.66667C5.39698 1.66667 1.66602 5.39763 1.66602 10C1.66602 14.6024 5.39698 18.3333 9.99935 18.3333Z" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10 13.75V11.25" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10 6.66667H10.0083" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
              title="Write a message to provider"
              description="Introduce yourself and explain what you want to learn."
              defaultExpanded={false}
              isCompleted={isSection2Complete}
            >
              <div className="flex flex-col gap-2 w-full">
                <div className="relative w-full">
                  <textarea
                    className="bg-white border border-gray-border rounded-md p-2 pb-6 min-h-[121px] max-h-[121px] font-normal text-xs text-dark resize-none w-full overflow-y-auto placeholder:text-dark-light"
                    placeholder="Hi! I've always wanted to improve my speaking skills for my upcoming conference..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={500}
                  />
                  <div className="absolute bottom-2 right-2 font-normal text-xs text-[#656363] pointer-events-none">
                    {message.length} / 500
                  </div>
                </div>
              </div>
              <div className="flex gap-2 w-full flex-wrap">
                {messageSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="flex-1 min-w-0 bg-background-gray border border-gray-border rounded-2xl px-2 py-2 h-12 font-normal text-xs text-black cursor-pointer transition-colors text-center flex items-center justify-center hover:bg-gray-border"
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
              <div className="flex flex-col gap-3 w-full">
                <div className="flex flex-col gap-1 w-full">
                  <label className="font-medium text-xs leading-4 tracking-wide text-[#5c5c5c]">Date</label>
                  <CustomDatePicker
                    value={selectedDate}
                    onChange={setSelectedDate}
                    placeholder="DD/MM/YYYY"
                  />
                </div>

                <div className="flex gap-4 items-end w-full">
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="font-medium text-xs leading-4 tracking-wide text-[#5c5c5c]">Start</label>
                    <CustomTimePicker
                      value={startTime}
                      onChange={setStartTime}
                      label="Start"
                    />
                  </div>

                  <div className="font-medium text-sm text-[#353535] text-center w-[13px] pb-3">to</div>

                  <div className="flex-1 flex flex-col gap-1">
                    <label className="font-medium text-xs leading-4 tracking-wide text-[#5c5c5c]">End</label>
                    <CustomTimePicker
                      value={endTime}
                      onChange={setEndTime}
                      label="End"
                    />
                  </div>
                </div>

                <div className="w-full">
                  <TimezoneSelector
                    value={timezone}
                    onChange={setTimezone}
                    timezones={timezones}
                  />
                </div>
              </div>
            </CollapsibleSection>

            <div className="flex justify-end pt-8 w-full">
              <button
                className="border-none rounded-md w-[218px] h-12 font-medium text-base text-white transition-all disabled:cursor-not-allowed disabled:bg-gradient-to-r disabled:from-gray-400 disabled:to-gray-400 enabled:bg-gradient-to-r enabled:from-primary-light enabled:to-primary-light enabled:cursor-pointer enabled:hover:opacity-90"
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
