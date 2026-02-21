import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { RequestCardProps } from './RequestCard';

type DeclineReasonOption = 'not-available' | 'not-good-match' | 'other';

interface DeclineRequestMetadata {
  reason: DeclineReasonOption | 'no-reason';
  additionalContext?: string;
}

interface ReceivedRequestDetailsPanelProps {
  request: RequestCardProps | null;
  isOpen: boolean;
  onClose: () => void;
  onAcceptRequest?: (request: RequestCardProps) => void;
  onDeclineRequest?: (request: RequestCardProps, metadata: DeclineRequestMetadata) => void;
  onViewProfile?: (userName: string) => void;
  isAccepting?: boolean;
  isDeclining?: boolean;
}

const formatSkillLevel = (level?: string | null): string => {
  if (!level) return 'Not specified';
  return level
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatSessionDuration = (startAt?: string, endAt?: string): string => {
  if (!startAt || !endAt) return 'Not specified';
  const startDate = new Date(startAt);
  const endDate = new Date(endAt);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return 'Not specified';
  }

  const totalMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
  if (totalMinutes <= 0) return 'Not specified';

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return `${minutes} minutes`;
};

const formatPreferredTime = (startAt?: string, endAt?: string, timezone?: string): string => {
  if (!startAt || !endAt) return 'Not specified';
  const startDate = new Date(startAt);
  const endDate = new Date(endAt);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return 'Not specified';
  }

  const dateText = startDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
  const startTimeText = startDate.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
  const endTimeText = endDate.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
  const timezoneText = timezone ? ` (${timezone})` : '';

  return `${dateText}, ${startTimeText} - ${endTimeText}${timezoneText}`;
};

const formatProfileSubtitle = (skill?: string, level?: string | null): string => {
  if (!skill) return 'Skill Seeker';
  if (!level) return skill;
  return `${skill} - ${formatSkillLevel(level)}`;
};

export const ReceivedRequestDetailsPanel: React.FC<ReceivedRequestDetailsPanelProps> = ({
  request,
  isOpen,
  onClose,
  onAcceptRequest,
  onDeclineRequest,
  onViewProfile,
  isAccepting = false,
  isDeclining = false,
}) => {
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [selectedDeclineReason, setSelectedDeclineReason] = useState<DeclineReasonOption | null>(null);
  const [additionalContext, setAdditionalContext] = useState('');

  if (!request || !isOpen) return null;
  const sessionDurationText = formatSessionDuration(request.startAt, request.endAt);
  const skillLevelText = formatSkillLevel(request.requestedSkillLevel ?? request.offeredSkillLevel);
  const messageText = request.message?.trim() || 'No message provided.';
  const preferredTimeText = formatPreferredTime(request.startAt, request.endAt, request.timezone);
  const seekerSkill = request.offeredSkill ?? request.requestedSkill;
  const seekerLevel = request.offeredSkill ? request.offeredSkillLevel : request.requestedSkillLevel;
  const seekerSubtitle = formatProfileSubtitle(seekerSkill, seekerLevel);

  const declineReasons: { value: DeclineReasonOption; label: string }[] = [
    { value: 'not-available', label: 'Not available at this time' },
    { value: 'not-good-match', label: 'Skill not a good match' },
    { value: 'other', label: 'Other' },
  ];

  const handleOpenDeclineModal = () => {
    if (isDeclining || isAccepting) return;
    setIsDeclineModalOpen(true);
  };

  const handleCloseDeclineModal = () => {
    setIsDeclineModalOpen(false);
    setSelectedDeclineReason(null);
    setAdditionalContext('');
  };

  const handleConfirmDecline = () => {
    if (isDeclining) return;
    const trimmedContext = additionalContext.trim();
    const payload: DeclineRequestMetadata = {
      reason: selectedDeclineReason ?? 'no-reason',
      additionalContext: trimmedContext || undefined,
    };
    onDeclineRequest?.(request, payload);
    handleCloseDeclineModal();
  };

  const statusConfig = {
    pending: { color: '#FFA412', bgColor: '#FFA412', label: 'Pending' },
    accepted: { color: '#16A34A', bgColor: '#16A34A', label: 'Accepted' },
    completed: { color: '#16A34A', bgColor: '#16A34A', label: 'Completed' },
    declined: { color: '#DC2626', bgColor: '#DC2626', label: 'Declined' },
    expired: { color: '#D97706', bgColor: '#D97706', label: 'Expired' },
    cancelled: { color: '#6B7280', bgColor: '#6B7280', label: 'Cancelled' },
  };

  const currentStatus = statusConfig[request.status];
  const isClosedState =
    request.status === 'declined' ||
    request.status === 'expired' ||
    request.status === 'cancelled';
  const closedStateMessage =
    request.status === 'declined'
      ? 'This request was declined.'
      : request.status === 'expired'
      ? 'This request has expired.'
      : 'This request was cancelled.';

  // Render different layouts based on status
  if (request.status === 'pending') {
    return (
      <>
      <div className="requests-details-panel bg-white border border-[#e5e7eb] flex flex-col gap-[24px] pb-[16px] pt-[8px] px-[8px] rounded-[10px] w-full h-fit sticky top-6">
        {/* Header with Status */}
        <div className="bg-white border-b border-[#f3f4f6] flex items-center justify-between pl-[16px] pr-[8px] rounded-tl-[10px] rounded-tr-[10px]">
          <div className="flex flex-1 gap-[4px] items-center min-w-0">
            <div
              className="shrink-0 w-[8px] h-[8px] rounded-full"
              style={{ backgroundColor: currentStatus.bgColor }}
            />
            <p className="font-semibold text-[14px] leading-[normal]" style={{ color: currentStatus.color }}>
              {currentStatus.label}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-[32px] h-[32px] flex items-center justify-center transition-colors"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M20 12L12 20M12 12L20 20" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Seeker Section */}
        <div className="bg-white border-b border-[#f3f4f6] flex flex-col items-start w-full">
          <div className="flex h-[24px] items-center justify-center px-[16px] w-full">
            <p className="flex-1 font-semibold leading-[normal] text-[16px] text-[#0c0d0f] min-w-0">
              Seeker
            </p>
          </div>
          <div className="flex flex-col items-start px-[16px] py-[8px] w-full">
            <div className="bg-white flex gap-[16px] h-[72px] items-center rounded-[5px] w-full">
              <img
                src={request.userAvatar}
                alt={request.userName}
                className="shrink-0 w-[56px] h-[56px] rounded-full object-cover"
              />
              <div className="flex flex-1 flex-col gap-[4px] items-start justify-center min-w-0">
                <p className="font-medium text-[16px] leading-[normal] text-black w-full truncate">
                  {request.userName}
                </p>
                <p className="font-medium text-[14px] leading-[normal] text-[#5e5e5f] truncate">
                  {seekerSubtitle}
                </p>
              </div>
              <button
                onClick={() => onViewProfile?.(request.userName)}
                className="border border-[#3272a3] flex h-[24px] items-center justify-center px-[8px] rounded-[10px] shrink-0"
              >
                <p className="font-normal text-[12px] leading-[normal] text-[#3272a3]">
                  View Profile
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Request Summary */}
        <div className="bg-white border-b border-[#f3f4f6] flex flex-col items-start w-full">
          <div className="flex h-[24px] items-center justify-center px-[16px] w-full">
            <p className="flex-1 font-semibold leading-[normal] text-[16px] text-[#0c0d0f] min-w-0">
              Request Summary
            </p>
          </div>
          <div className="flex flex-col items-start px-[16px] w-full">
            <div className="border-b border-[#e5e7eb] flex gap-[4px] h-[40px] items-center w-full">
              <div className="flex h-full items-center w-[117px]">
                <p className="font-normal text-[12px] leading-[normal] text-[#666] text-center">
                  Requested Skill:
                </p>
              </div>
              <div className="flex flex-1 h-full items-center min-w-0">
                <p className="font-normal text-[14px] leading-[normal] text-[#0c0d0f] text-center">
                  {request.requestedSkill}
                </p>
              </div>
            </div>
            
            <div className="border-b border-[#e5e7eb] flex gap-[4px] h-[40px] items-center w-full">
              <div className="flex h-full items-center w-[117px]">
                <p className="font-normal text-[12px] leading-[normal] text-[#666] text-center">
                  Exchange Type:
                </p>
              </div>
              <div className="flex flex-1 h-full items-center min-w-0">
                <p className="font-normal text-[14px] leading-[normal] text-[#0c0d0f] text-center">
                  {request.sessionType === 'skill-swap' ? 'Skill Swap' : 'Free Session'}
                </p>
              </div>
            </div>
            
            {request.offeredSkill && (
              <div className="border-b border-[#e5e7eb] flex gap-[4px] h-[40px] items-center w-full">
                <div className="flex h-full items-center w-[117px]">
                  <p className="font-normal text-[12px] leading-[normal] text-[#666] text-center">
                    Offered Skill:
                  </p>
                </div>
                <div className="flex flex-1 h-full items-center min-w-0">
                  <p className="font-normal text-[14px] leading-[normal] text-[#0c0d0f] text-center">
                    {request.offeredSkill}
                  </p>
                </div>
              </div>
            )}
            
            <div className="border-b border-[#e5e7eb] flex gap-[4px] h-[40px] items-center w-full">
              <div className="flex h-full items-center w-[117px]">
                <p className="font-normal text-[12px] leading-[normal] text-[#666] text-center">
                  Session Duration:
                </p>
              </div>
              <div className="flex flex-1 h-full items-center min-w-0">
                <p className="font-normal text-[14px] leading-[normal] text-[#0c0d0f] text-center">
                  {sessionDurationText}
                </p>
              </div>
            </div>
            
            <div className="flex gap-[4px] h-[40px] items-center w-full">
              <div className="flex h-full items-center w-[117px]">
                <p className="font-normal text-[12px] leading-[normal] text-[#666] text-center">
                  Skill Level:
                </p>
              </div>
              <div className="flex flex-1 h-full items-center min-w-0">
                <p className="font-normal text-[14px] leading-[normal] text-[#0c0d0f] text-center">
                  {skillLevelText}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="bg-white border-b border-[#f3f4f6] flex flex-col items-start w-full">
          <div className="flex h-[24px] items-center justify-center px-[16px] w-full">
            <p className="flex-1 font-semibold leading-[normal] text-[16px] text-[#0c0d0f] min-w-0">
              Message
            </p>
          </div>
          <div className="flex flex-col items-start px-[16px] py-[8px] w-full">
            <div className="bg-[#fafafa] border border-[#e6e6e6] flex flex-col min-h-[70px] items-center justify-center p-[8px] rounded-[10px] w-full">
              <p className="font-normal leading-[normal] text-[12px] text-[#666] text-center w-full">
                {messageText}
              </p>
            </div>
          </div>
        </div>

        {/* Preferred Time */}
        <div className="bg-white border-b border-[#f3f4f6] flex flex-col items-start w-full">
          <div className="flex h-[24px] items-center justify-center px-[16px] w-full">
            <p className="flex-1 font-semibold leading-[normal] text-[16px] text-[#0c0d0f] min-w-0">
              Preferred Time
            </p>
          </div>
          <div className="flex flex-col items-start px-[16px] py-[8px] w-full">
            <p className="font-normal text-[14px] leading-[normal] text-[#0c0d0f] text-center">
              {preferredTimeText}
            </p>
          </div>
        </div>

        {/* Actions - Accept/Decline Buttons */}
        <div className="flex gap-[10px] h-[48px] items-center justify-center w-full px-[8px]">
          <button
            onClick={handleOpenDeclineModal}
            disabled={isDeclining || isAccepting}
            className="bg-[#f5f5f5] border border-[#e5e7eb] flex flex-1 h-full items-center justify-center rounded-[10px] transition-colors hover:bg-[#e5e5e5]"
          >
            <p className="font-medium leading-[normal] text-[16px] text-[#666]">
              Decline
            </p>
          </button>
          <button
            onClick={() => onAcceptRequest?.(request)}
            disabled={isAccepting || isDeclining}
            className="flex flex-1 h-full items-center justify-center rounded-[10px] transition-opacity hover:opacity-90"
            style={{
              background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(62, 143, 204) 0%, rgb(62, 143, 204) 100%)',
            }}
          >
            <p className="font-medium leading-[normal] text-[16px] text-white">
              Accept
            </p>
          </button>
        </div>
        {isDeclineModalOpen && createPortal(
          <>
            <div
              onClick={handleCloseDeclineModal}
              className="fixed inset-0 bg-[rgba(94,95,96,0.2)] z-[9999]"
            />
            <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
              <div
                className="bg-white border border-[#e5e7eb] flex flex-col rounded-[10px] w-full max-w-[384px]"
                style={{ boxShadow: '0px 0px 4.7px 0px rgba(0, 0, 0, 0.25)' }}
              >
                <div className="border-b border-[#f3f4f6] flex h-[48px] items-center px-4 rounded-t-[10px]">
                  <p className="flex-1 font-medium text-[16px] text-[#0c0d0f]">
                    Decline Request
                  </p>
                  <button
                    onClick={handleCloseDeclineModal}
                    className="shrink-0 size-[32px] flex items-center justify-center"
                    aria-label="Close decline modal"
                  >
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M12 20L20 12M20 20L12 12" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                <div className="flex flex-col gap-4 p-4">
                  <p className="text-[14px] text-[#0c0d0f]">
                    You can optionally add a reason to help the requester understand.
                  </p>
                  <div className="flex flex-col gap-3">
                    {declineReasons.map((reason) => {
                      const isSelected = selectedDeclineReason === reason.value;
                      return (
                        <label
                          key={reason.value}
                          className={`border rounded-[10px] p-3 flex items-center gap-3 cursor-pointer transition-colors ${
                            isSelected ? 'border-[#3272a3] bg-[rgba(50,114,163,0.08)]' : 'border-[#e5e7eb] bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="decline-reason"
                            value={reason.value}
                            checked={isSelected}
                            onChange={() => setSelectedDeclineReason(reason.value)}
                            className="sr-only"
                          />
                          <span
                            className={`flex items-center justify-center size-[18px] rounded-full border ${
                              isSelected ? 'border-[#3272a3]' : 'border-[#d1d5db]'
                            }`}
                          >
                            <span
                              className={`size-[10px] rounded-full ${isSelected ? 'bg-[#3272a3]' : 'bg-transparent'}`}
                            />
                          </span>
                          <span className="text-[14px] text-[#0c0d0f]">{reason.label}</span>
                        </label>
                      );
                    })}
                  </div>
                  {selectedDeclineReason === 'other' && (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={additionalContext}
                        onChange={(event) =>
                          setAdditionalContext(event.target.value.slice(0, 200))
                        }
                        placeholder="Provide additional context (optional)"
                        className="min-h-[96px] w-full resize-none rounded-[10px] border border-[#e5e7eb] p-3 text-[14px] text-[#0c0d0f] focus:border-[#3272a3] focus:outline-none"
                      />
                      <p className="text-right text-[12px] text-[#999]">
                        {additionalContext.length} / 200
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleCloseDeclineModal}
                      className="flex-1 h-[40px] rounded-[10px] border border-[#e5e7eb] bg-[#f5f5f5] text-[14px] text-[#666] transition-colors hover:bg-[#e5e7eb]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDecline}
                      disabled={isDeclining}
                      className="flex-1 h-[40px] rounded-[10px] text-[14px] text-white transition-opacity"
                      style={{
                        background:
                          'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(62, 143, 204) 0%, rgb(62, 143, 204) 100%)',
                      }}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}
      </div>
        </>
    );
  }

  // For closed statuses - simplified view
  if (isClosedState) {
    return (
      <div className="requests-details-panel bg-white border border-[#e5e7eb] flex flex-col gap-[24px] pb-[16px] pt-[8px] px-[8px] rounded-[10px] w-full h-fit sticky top-6">
        {/* Header with Status */}
        <div className="bg-white border-b border-[#f3f4f6] flex items-center justify-between pl-[16px] pr-[8px] rounded-tl-[10px] rounded-tr-[10px]">
          <div className="flex flex-1 gap-[4px] items-center min-w-0">
            <div
              className="shrink-0 w-[8px] h-[8px] rounded-full"
              style={{ backgroundColor: currentStatus.bgColor }}
            />
            <p className="font-semibold text-[14px] leading-[normal]" style={{ color: currentStatus.color }}>
              {currentStatus.label}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-[32px] h-[32px] flex items-center justify-center transition-colors"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M20 12L12 20M12 12L20 20" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Seeker Section - Simplified for Closed Status */}
        <div className="bg-white border-b border-[#f3f4f6] flex flex-col items-start w-full">
          <div className="flex h-[24px] items-center justify-center px-[16px] w-full">
            <p className="flex-1 font-semibold leading-[normal] text-[16px] text-[#0c0d0f] min-w-0">
              Seeker
            </p>
          </div>
          <div className="flex flex-col items-start px-[16px] py-[8px] w-full">
            <div className="bg-white flex gap-[16px] h-[72px] items-center rounded-[5px] w-full">
              <img
                src={request.userAvatar}
                alt={request.userName}
                className="shrink-0 w-[56px] h-[56px] rounded-full object-cover"
              />
              <div className="flex flex-1 flex-col gap-[4px] items-start justify-center min-w-0">
                <p className="font-medium text-[16px] leading-[normal] text-black w-full truncate">
                  {request.userName}
                </p>
                <p className="font-medium text-[14px] leading-[normal] text-[#5e5e5f] truncate">
                  {seekerSubtitle}
                </p>
              </div>
            </div>
            <p className="font-normal leading-[normal] text-[#999] text-[12px] text-right w-full mt-2">
              {request.sentTime}
            </p>
          </div>
        </div>

        {/* Closed Status Message */}
        <div className="bg-white flex flex-col h-[86px] items-center justify-center rounded-[10px] w-full">
          <div className="flex flex-col gap-[8px] items-center p-[16px] w-full">
            <div className="flex items-center justify-center rounded-full shrink-0 w-[24px] h-[24px]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke={currentStatus.bgColor} strokeWidth="1.5"/>
                <path d="M15 9L9 15M9 9L15 15" stroke={currentStatus.bgColor} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="font-normal leading-[normal] text-[14px] text-[#0c0d0f] text-center">
              {closedStateMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // For accepted status - full details with "Go to Chat" button
  return (
    <div className="requests-details-panel bg-white border border-[#e5e7eb] flex flex-col gap-[24px] pb-[16px] pt-[8px] px-[8px] rounded-[10px] w-full h-fit sticky top-6">
      {/* Header with Status */}
      <div className="bg-white border-b border-[#f3f4f6] flex items-center justify-between pl-[16px] pr-[8px] rounded-tl-[10px] rounded-tr-[10px]">
        <div className="flex flex-1 gap-[4px] items-center min-w-0">
          <div
            className="shrink-0 w-[8px] h-[8px] rounded-full"
            style={{ backgroundColor: currentStatus.bgColor }}
          />
          <p className="font-semibold text-[14px] leading-[normal]" style={{ color: currentStatus.color }}>
            {currentStatus.label}
          </p>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 w-[32px] h-[32px] flex items-center justify-center transition-colors"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M20 12L12 20M12 12L20 20" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Seeker Section */}
      <div className="bg-white border-b border-[#f3f4f6] flex flex-col items-start w-full">
        <div className="flex h-[24px] items-center justify-center px-[16px] w-full">
          <p className="flex-1 font-semibold leading-[normal] text-[16px] text-[#0c0d0f] min-w-0">
            Seeker
          </p>
        </div>
        <div className="flex flex-col items-start px-[16px] py-[8px] w-full">
          <div className="bg-white flex gap-[16px] h-[72px] items-center rounded-[5px] w-full">
            <img
              src={request.userAvatar}
              alt={request.userName}
              className="shrink-0 w-[56px] h-[56px] rounded-full object-cover"
            />
            <div className="flex flex-1 flex-col gap-[4px] items-start justify-center min-w-0">
              <p className="font-medium text-[16px] leading-[normal] text-black w-full truncate">
                {request.userName}
              </p>
              <div className="flex gap-[2px] items-end">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M7 1.16667L8.8025 4.81917L12.8333 5.405L9.91667 8.24917L10.605 12.2617L7 10.365L3.395 12.2617L4.08333 8.24917L1.16667 5.405L5.1975 4.81917L7 1.16667Z"
                    fill="#FFE947"
                    stroke="#FFE947"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="font-normal text-[12px] leading-[normal] text-[#666] text-center">
                  {request.userRating.toFixed(1)}
                </p>
              </div>
            </div>
            <button
              onClick={() => onViewProfile?.(request.userName)}
              className="border border-[#3272a3] flex h-[24px] items-center justify-center px-[8px] rounded-[10px] shrink-0"
            >
              <p className="font-normal text-[12px] leading-[normal] text-[#3272a3]">
                View Profile
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Request Summary */}
      <div className="bg-white border-b border-[#f3f4f6] flex flex-col items-start w-full">
        <div className="flex h-[24px] items-center justify-center px-[16px] w-full">
          <p className="flex-1 font-semibold leading-[normal] text-[16px] text-[#0c0d0f] min-w-0">
            Request Summary
          </p>
        </div>
        <div className="flex flex-col items-start px-[16px] w-full">
          <div className="border-b border-[#e5e7eb] flex gap-[4px] h-[40px] items-center w-full">
            <div className="flex h-full items-center w-[117px]">
              <p className="font-normal text-[12px] leading-[normal] text-[#666] text-center">
                Requested Skill:
              </p>
            </div>
            <div className="flex flex-1 h-full items-center min-w-0">
              <p className="font-normal text-[14px] leading-[normal] text-[#0c0d0f] text-center">
                {request.requestedSkill}
              </p>
            </div>
          </div>
          
          <div className="border-b border-[#e5e7eb] flex gap-[4px] h-[40px] items-center w-full">
            <div className="flex h-full items-center w-[117px]">
              <p className="font-normal text-[12px] leading-[normal] text-[#666] text-center">
                Exchange Type:
              </p>
            </div>
            <div className="flex flex-1 h-full items-center min-w-0">
              <p className="font-normal text-[14px] leading-[normal] text-[#0c0d0f] text-center">
                {request.sessionType === 'skill-swap' ? 'Skill Swap' : 'Free Session'}
              </p>
            </div>
          </div>
          
          {request.offeredSkill && (
            <div className="border-b border-[#e5e7eb] flex gap-[4px] h-[40px] items-center w-full">
              <div className="flex h-full items-center w-[117px]">
                <p className="font-normal text-[12px] leading-[normal] text-[#666] text-center">
                  Offered Skill:
                </p>
              </div>
              <div className="flex flex-1 h-full items-center min-w-0">
                <p className="font-normal text-[14px] leading-[normal] text-[#0c0d0f] text-center">
                  {request.offeredSkill}
                </p>
              </div>
            </div>
          )}
          
          <div className="border-b border-[#e5e7eb] flex gap-[4px] h-[40px] items-center w-full">
            <div className="flex h-full items-center w-[117px]">
              <p className="font-normal text-[12px] leading-[normal] text-[#666] text-center">
                Session Duration:
              </p>
            </div>
            <div className="flex flex-1 h-full items-center min-w-0">
              <p className="font-normal text-[14px] leading-[normal] text-[#0c0d0f] text-center">
                {sessionDurationText}
              </p>
            </div>
          </div>
          
          <div className="flex gap-[4px] h-[40px] items-center w-full">
            <div className="flex h-full items-center w-[117px]">
              <p className="font-normal text-[12px] leading-[normal] text-[#666] text-center">
                Skill Level:
              </p>
            </div>
            <div className="flex flex-1 h-full items-center min-w-0">
              <p className="font-normal text-[14px] leading-[normal] text-[#0c0d0f] text-center">
                {skillLevelText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="bg-white border-b border-[#f3f4f6] flex flex-col items-start w-full">
        <div className="flex h-[24px] items-center justify-center px-[16px] w-full">
          <p className="flex-1 font-semibold leading-[normal] text-[16px] text-[#0c0d0f] min-w-0">
            Message
          </p>
        </div>
        <div className="flex flex-col items-start px-[16px] py-[8px] w-full">
          <div className="bg-[#fafafa] border border-[#e6e6e6] flex flex-col min-h-[70px] items-center justify-center p-[8px] rounded-[10px] w-full">
            <p className="font-normal leading-[normal] text-[12px] text-[#666] text-center w-full">
              {messageText}
            </p>
          </div>
        </div>
      </div>

      {/* Preferred Time */}
      <div className="bg-white border-b border-[#f3f4f6] flex flex-col items-start w-full">
        <div className="flex h-[24px] items-center justify-center px-[16px] w-full">
          <p className="flex-1 font-semibold leading-[normal] text-[16px] text-[#0c0d0f] min-w-0">
            Preferred Time
          </p>
        </div>
        <div className="flex flex-col items-start px-[16px] py-[8px] w-full">
          <p className="font-normal text-[14px] leading-[normal] text-[#0c0d0f] text-center">
            {preferredTimeText}
          </p>
        </div>
      </div>

      {/* Go to Chat Button */}
      <div className="flex flex-col items-center justify-center w-full">
        <button
          className="flex gap-[10px] h-[48px] items-center justify-center rounded-[10px] w-full transition-opacity hover:opacity-90"
          style={{
            background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(62, 143, 204) 0%, rgb(62, 143, 204) 100%)',
          }}
        >
          <p className="font-medium leading-[normal] text-[16px] text-white">
            Go to Chat
          </p>
        </button>
      </div>
    </div>
  );
};
