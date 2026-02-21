import React, { useEffect, useMemo, useState } from 'react';
import { Dayjs } from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SwapMethodOption from '../../components/SwapMethodOption/SwapMethodOption';
import CollapsibleSection from '../../components/CollapsibleSection/CollapsibleSection';
import { CustomDatePicker, CustomTimePicker, TimezoneSelector } from '../../components/DatePicker';
import SuccessModal from '../../components/SuccessModal';
import { useCreateSwapMutation } from '../../features/swaps/swaps.queries';
import { userService } from '../../api/services/user.service';

interface OfferedSkillOption {
  id: string;
  name: string;
}

interface RequestSkillNavigationState {
  receiverId?: string;
  requestedSkillId?: string;
  requestedSkillName?: string;
  newSkill?: OfferedSkillOption;
}

const parseErrorMessage = (error: unknown, fallback: string): string => {
  const maybeAxiosError = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };

  return maybeAxiosError?.response?.data?.message || maybeAxiosError?.message || fallback;
};

const convertTimeTo24Hour = (timeValue: string): string | null => {
  const match = timeValue.match(/^(\d{2}):(\d{2})\s(AM|PM)$/);
  if (!match) return null;

  const [, rawHour, minute, period] = match;
  let hour = Number(rawHour);

  if (period === 'AM') {
    if (hour === 12) hour = 0;
  } else if (hour !== 12) {
    hour += 12;
  }

  return `${String(hour).padStart(2, '0')}:${minute}`;
};

const toMinutes = (time24Hour: string): number => {
  const [hour, minute] = time24Hour.split(':').map(Number);
  return (hour * 60) + minute;
};

const RequestSkill: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const createSwapMutation = useCreateSwapMutation();

  const locationState = (location.state as RequestSkillNavigationState | null) ?? null;
  const requestContext = useMemo(() => {
    const params = new URLSearchParams(location.search);

    const receiverId = locationState?.receiverId?.trim()
      || params.get('receiverId')?.trim()
      || '';
    const requestedSkillId = locationState?.requestedSkillId?.trim()
      || params.get('requestedSkillId')?.trim()
      || '';
    const requestedSkillName = locationState?.requestedSkillName?.trim()
      || params.get('requestedSkillName')?.trim()
      || '';

    return {
      receiverId,
      requestedSkillId,
      requestedSkillName,
    };
  }, [
    location.search,
    locationState?.receiverId,
    locationState?.requestedSkillId,
    locationState?.requestedSkillName,
  ]);

  const [selectedSwapMethod, setSelectedSwapMethod] = useState<'skill' | 'free' | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<string>('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [userSkills, setUserSkills] = useState<OfferedSkillOption[]>([]);
  const [message, setMessage] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<string>('12:00 AM');
  const [endTime, setEndTime] = useState<string>('12:00 AM');
  const [timezone, setTimezone] = useState<string>('UTC');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [isLoadingSkills, setIsLoadingSkills] = useState<boolean>(true);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedSkillName = useMemo(
    () => userSkills.find((skill) => skill.id === selectedSkillId)?.name ?? 'Select your skill',
    [userSkills, selectedSkillId]
  );
  const receiverId = requestContext.receiverId.trim();
  const requestedSkillId = requestContext.requestedSkillId.trim();
  const requestedSkillName = requestContext.requestedSkillName.trim();

  const timezones = [
    'UTC',
    'Asia/Jerusalem',
    'Asia/Jakarta',
    'Africa/Johannesburg',
    'Asia/Kathmandu',
    'Asia/Kuala_Lumpur',
    'Asia/Kuwait',
    'Africa/Lagos',
  ];

  const messageSuggestions = [
    "Hi! I'd love to learn this skill...",
    "I can exchange one of my skills in return.",
    'Can we schedule a session this week?',
  ];

  useEffect(() => {
    let isMounted = true;

    const fetchUserSkills = async () => {
      try {
        setIsLoadingSkills(true);
        setSkillsError(null);

        const response = await userService.getUserSkills();
        const raw = response?.data ?? response;
        const offeredSkills = Array.isArray(raw?.offeredSkills)
          ? raw.offeredSkills
          : Array.isArray(raw?.data?.offeredSkills)
            ? raw.data.offeredSkills
            : [];

        const mappedSkills: OfferedSkillOption[] = offeredSkills
          .filter((skill: { id?: unknown; skill?: { name?: unknown } }) =>
            typeof skill?.id === 'string' && typeof skill?.skill?.name === 'string'
          )
          .map((skill: { id: string; skill: { name: string } }) => ({
            id: skill.id,
            name: skill.skill.name,
          }));

        if (!isMounted) return;

        setUserSkills(mappedSkills);
        setSelectedSkillId((current) => {
          if (current && mappedSkills.some((skill) => skill.id === current)) {
            return current;
          }
          return mappedSkills[0]?.id ?? '';
        });
      } catch (error) {
        if (!isMounted) return;
        console.error('[RequestSkill] Failed to load user skills:', error);
        setSkillsError(parseErrorMessage(error, 'Failed to load your skills.'));
      } finally {
        if (isMounted) {
          setIsLoadingSkills(false);
        }
      }
    };

    fetchUserSkills();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const incomingSkill = locationState?.newSkill;
    if (!incomingSkill?.id || !incomingSkill?.name) return;

    setUserSkills((currentSkills) => (
      currentSkills.some((skill) => skill.id === incomingSkill.id)
        ? currentSkills
        : [incomingSkill, ...currentSkills]
    ));
    setSelectedSkillId(incomingSkill.id);
    setShowSkillDropdown(false);

    navigate(`${location.pathname}${location.search}`, {
      replace: true,
      state: {
        receiverId: receiverId || undefined,
        requestedSkillId: requestedSkillId || undefined,
        requestedSkillName: requestedSkillName || undefined,
      } satisfies RequestSkillNavigationState,
    });
  }, [
    location.pathname,
    location.search,
    locationState?.newSkill,
    navigate,
    receiverId,
    requestedSkillId,
    requestedSkillName,
  ]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleAddNewSkill = () => {
    navigate('/request-skill/add-skill', {
      state: {
        receiverId: receiverId || undefined,
        requestedSkillId: requestedSkillId || undefined,
        requestedSkillName: requestedSkillName || undefined,
      } satisfies RequestSkillNavigationState,
    });
  };

  const handleSendRequest = async () => {
    setSubmitError(null);

    if (selectedSwapMethod !== 'skill') {
      setSubmitError('Free session is not supported by this API endpoint yet.');
      return;
    }

    if (!receiverId || !requestedSkillId) {
      setSubmitError('Missing receiver or requested skill. Open this page from a skill details page.');
      return;
    }

    if (!selectedSkillId) {
      setSubmitError('Please choose one of your offered skills.');
      return;
    }

    if (!selectedDate) {
      setSubmitError('Please choose a date first.');
      return;
    }

    const startAt = convertTimeTo24Hour(startTime);
    const endAt = convertTimeTo24Hour(endTime);

    if (!startAt || !endAt) {
      setSubmitError('Invalid time format selected.');
      return;
    }

    if (toMinutes(endAt) <= toMinutes(startAt)) {
      setSubmitError('End time must be after start time.');
      return;
    }

    try {
      await createSwapMutation.mutateAsync({
        receiverId,
        offeredSkillId: selectedSkillId,
        requestedSkillId,
        message: message.trim(),
        date: selectedDate.format('YYYY-MM-DD'),
        startAt,
        endAt,
        timezone,
      });

      setShowSuccessModal(true);
    } catch (error) {
      console.error('[RequestSkill] Failed to send request:', error);
      setSubmitError(parseErrorMessage(error, 'Failed to send request.'));
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  const handleViewRequests = () => {
    setShowSuccessModal(false);
    navigate('/requests-sent');
  };

  const handleBrowseSkills = () => {
    setShowSuccessModal(false);
    navigate('/explore');
  };

  const isSection1Complete = selectedSwapMethod === 'skill'
    ? Boolean(selectedSkillId)
    : selectedSwapMethod === 'free';
  const isSection2Complete = message.trim().length > 0;
  const isSection3Complete = !!selectedDate && !!startTime && !!endTime;
  const hasRequestContext = Boolean(receiverId && requestedSkillId);
  const isFormComplete = isSection1Complete
    && isSection2Complete
    && isSection3Complete
    && selectedSwapMethod === 'skill'
    && hasRequestContext;

  return (
    <div className="flex flex-col min-h-screen bg-gray-light">
      <Header activeTab="Default" />

      <div className="flex-1 flex flex-col items-center px-4 py-6 sm:px-5 sm:py-10">
        <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-[846px] shadow-sm">
          <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
            <button
              type="button"
              className="bg-transparent border-none w-8 h-8 flex items-center justify-center cursor-pointer rounded-sm p-0 transition-colors hover:bg-gray-100"
              onClick={handleBackClick}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M13.3327 26.6667L4.66602 18L13.3327 9.33334" stroke="#0C0D0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M27.3327 18H4.66602" stroke="#0C0D0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1 className="font-bold text-2xl sm:text-3xl text-dark m-0">Request Skill</h1>
          </div>

          {!hasRequestContext ? (
            <div className="mb-4 rounded-md border border-[#facc15] bg-[#fefce8] px-4 py-3 text-xs text-[#854d0e]">
              Missing request context. Please open this page from Explore and choose a skill provider.
            </div>
          ) : null}

          {requestedSkillName ? (
            <div className="mb-4 rounded-md border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-sm text-[#374151]">
              Requested skill: <span className="font-semibold text-[#111827]">{requestedSkillName}</span>
            </div>
          ) : null}

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
                  icon={(
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M7.91602 2.70898L3.33268 5.67565C2.34935 6.30898 2.34935 7.80898 3.33268 8.44232L7.91602 11.409C8.66602 11.909 9.84935 11.909 10.5993 11.409L15.166 8.44232C16.1493 7.80898 16.1493 6.30898 15.166 5.67565L10.5827 2.70898C9.84935 2.20898 8.66602 2.20898 7.91602 2.70898Z" stroke="#2F71A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M4.58398 10.625L4.58398 13.7917C4.58398 14.775 5.30065 15.9583 6.16732 16.4167L9.05898 18.0667C9.58398 18.3583 10.409 18.3583 10.934 18.0667L13.8256 16.4167C14.6923 15.9583 15.409 14.775 15.409 13.7917V10.6417" stroke="#2F71A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M17.084 12.5V7.5" stroke="#2F71A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  title="Skill Swap"
                  description="Exchange one of your skills in return."
                  iconBgColor="rgba(47, 113, 163, 0.2)"
                  isSelected={selectedSwapMethod === 'skill'}
                  onClick={() => setSelectedSwapMethod('skill')}
                />

                {selectedSwapMethod === 'skill' ? (
                  <div className="px-0 sm:px-4 w-full">
                    <div className="border border-primary rounded-lg p-3 sm:p-4 flex flex-col gap-4 bg-white">
                      <div className="flex flex-col gap-1">
                        <h3 className="font-semibold text-lg text-dark m-0">Your offered skill</h3>
                        <p className="font-normal text-sm text-dark-light m-0">Select one of your skills to exchange with the provider.</p>
                      </div>

                      <div className="flex flex-col gap-2.5 px-0 sm:px-4">
                        <div className="relative w-full">
                          <button
                            type="button"
                            className="bg-white border border-gray-border rounded-md h-12 w-full flex items-center justify-between px-4 cursor-pointer transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={() => setShowSkillDropdown((current) => !current)}
                            disabled={isLoadingSkills || userSkills.length === 0}
                          >
                            <span className="font-semibold text-xs text-dark text-left flex-1">
                              {isLoadingSkills ? 'Loading skills...' : selectedSkillName}
                            </span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 transition-transform">
                              <path d="M4 6L8 10L12 6" stroke="#0C0D0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>

                          {showSkillDropdown && userSkills.length > 0 ? (
                            <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-gray-border rounded-md shadow-card z-10 overflow-hidden">
                              {userSkills.map((skill) => (
                                <button
                                  key={skill.id}
                                  type="button"
                                  className="w-full py-3 px-4 font-semibold text-xs text-dark cursor-pointer transition-colors hover:bg-gray-light text-left"
                                  onClick={() => {
                                    setSelectedSkillId(skill.id);
                                    setShowSkillDropdown(false);
                                  }}
                                >
                                  {skill.name}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>

                        {skillsError ? (
                          <p className="text-xs text-[#dc2626]">{skillsError}</p>
                        ) : null}

                        <button
                          type="button"
                          onClick={handleAddNewSkill}
                          className="border border-primary rounded-md h-8 w-full sm:w-[163px] flex items-center justify-center gap-1 bg-transparent cursor-pointer transition-colors hover:bg-primary-dark/5"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 6V18M6 12H18" stroke="#3272A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="font-normal text-13 text-primary">Add new Skill</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}

                <SwapMethodOption
                  icon={(
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M9.99935 18.3333C14.6017 18.3333 18.3327 14.6024 18.3327 10C18.3327 5.39763 14.6017 1.66667 9.99935 1.66667C5.39698 1.66667 1.66602 5.39763 1.66602 10C1.66602 14.6024 5.39698 18.3333 9.99935 18.3333Z" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10 13.75V11.25" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10 6.66667H10.0083" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  title="Free Session"
                  description="Learn without offering one in return."
                  iconBgColor="rgba(245, 158, 11, 0.3)"
                  isSelected={selectedSwapMethod === 'free'}
                  onClick={() => {
                    setSelectedSwapMethod('free');
                    setShowSkillDropdown(false);
                  }}
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
                    onChange={(event) => setMessage(event.target.value)}
                    maxLength={500}
                  />
                  <div className="absolute bottom-2 right-2 font-normal text-xs text-[#656363] pointer-events-none">
                    {message.length} / 500
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
                {messageSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full min-w-0 bg-background-gray border border-gray-border rounded-2xl px-2 py-2 min-h-12 font-normal text-xs text-black cursor-pointer transition-colors text-center flex items-center justify-center hover:bg-gray-border"
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

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-end w-full">
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="font-medium text-xs leading-4 tracking-wide text-[#5c5c5c]">Start</label>
                    <CustomTimePicker
                      value={startTime}
                      onChange={setStartTime}
                      label="Start"
                    />
                  </div>

                  <div className="font-medium text-sm text-[#353535] text-center w-auto sm:w-[13px] pb-0 sm:pb-3">to</div>

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

            {selectedSwapMethod === 'free' ? (
              <p className="text-xs text-[#b45309]">
                Free session is currently not available on the backend endpoint. Please choose Skill Swap.
              </p>
            ) : null}

            {submitError ? (
              <p className="text-xs text-[#dc2626]">{submitError}</p>
            ) : null}

            <div className="flex justify-end pt-6 sm:pt-8 w-full">
              <button
                type="button"
                className="border-none rounded-md w-full sm:w-[218px] h-12 font-medium text-base text-white transition-all disabled:cursor-not-allowed disabled:bg-gradient-to-r disabled:from-gray-400 disabled:to-gray-400 enabled:bg-gradient-to-r enabled:from-primary-light enabled:to-primary-light enabled:cursor-pointer enabled:hover:opacity-90"
                onClick={handleSendRequest}
                disabled={!isFormComplete || createSwapMutation.isPending || isLoadingSkills}
              >
                {createSwapMutation.isPending ? 'Sending...' : 'Send Request'}
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
