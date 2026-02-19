import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { RequestCardProps } from './RequestCard';

interface RequestDetailsPanelProps {
  request: RequestCardProps | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelRequest?: (request: RequestCardProps) => void;
  onViewProfile?: (userName: string) => void;
}

export const RequestDetailsPanel: React.FC<RequestDetailsPanelProps> = ({
  request,
  isOpen,
  onClose,
  onCancelRequest,
  onViewProfile,
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);

  if (!request || !isOpen) return null;

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleUndoCancel = () => {
    setShowCancelModal(false);
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    onCancelRequest?.(request);
  };

  const statusConfig = {
    pending: { color: '#FFA412', bgColor: '#FFA412', label: 'Pending' },
    accepted: { color: '#16A34A', bgColor: '#16A34A', label: 'Accepted' },
    declined: { color: '#DC2626', bgColor: '#DC2626', label: 'Declined' },
  };

  const currentStatus = statusConfig[request.status];

  // Render different layouts based on status
  if (request.status === 'accepted') {
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

        {/* Provider Section */}
        <div className="bg-white border-b border-[#f3f4f6] flex flex-col items-start w-full">
          <div className="flex h-[24px] items-center justify-center px-[16px] w-full">
            <p className="flex-1 font-semibold leading-[normal] text-[16px] text-[#0c0d0f] min-w-0">
              Provider
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
                <div className="flex flex-col items-start w-full">
                  <p className="font-medium text-[16px] leading-[normal] text-black w-full truncate">
                    {request.userName}
                  </p>
                </div>
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
                  60 minutes
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
                  Beginner
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
            <div className="bg-[#fafafa] border border-[#e6e6e6] flex flex-col h-[70px] items-center justify-center p-[8px] rounded-[10px] w-full">
              <p className="font-normal h-[40px] leading-[normal] text-[12px] text-[#666] text-center w-full">
                "Hi! I'd love to learn this skill and start building my portfolio. I'm a beginner and looking for guidance on the core concepts of performance optimization."
              </p>
            </div>
          </div>
        </div>

        {/* Preferred Time */}
        <div className="bg-white flex flex-col items-start rounded-bl-[10px] rounded-br-[10px] w-full">
          <div className="flex h-[24px] items-center justify-center px-[16px] w-full">
            <p className="flex-1 font-semibold leading-[normal] text-[16px] text-[#0c0d0f] min-w-0">
              Preferred Time
            </p>
          </div>
          <div className="flex flex-col items-start px-[16px] py-[8px] w-full">
            <p className="font-normal text-[14px] leading-[normal] text-[#0c0d0f] text-center">
              Saturday, Feb 2, 4:00 PM - 5:00 PM
            </p>
          </div>
        </div>

        {/* Actions - Go to Chat */}
        <div className="flex flex-col items-center justify-center w-full">
          <button
            className="flex gap-[10px] h-[48px] items-center justify-center rounded-[10px] w-full text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(62, 143, 204) 0%, rgb(62, 143, 204) 100%)' }}
          >
            <p className="font-medium text-[16px] leading-[normal]">
              Go to Chat
            </p>
          </button>
        </div>
      </div>
    );
  }

  if (request.status === 'declined') {
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

        {/* Provider Section */}
        <div className="bg-white border-b border-[#f3f4f6] flex flex-col items-start w-full">
          <div className="flex h-[24px] items-center justify-center px-[16px] w-full">
            <p className="flex-1 font-semibold leading-[normal] text-[16px] text-[#0c0d0f] min-w-0">
              Provider
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
                <div className="flex flex-col gap-[4px] items-start w-full">
                  <p className="font-medium text-[16px] leading-[normal] text-black w-full truncate">
                    {request.userName}
                  </p>
                  <p className="font-medium text-[14px] leading-[normal] text-[#5e5e5f] truncate">
                    Photographer & Filmmaker
                  </p>
                </div>
              </div>
            </div>
            <p className="font-normal text-[12px] leading-[normal] text-[#999] text-right w-full">
              {request.sentTime}
            </p>
          </div>
        </div>

        {/* Decline Container */}
        <div className="bg-white flex flex-col h-[86px] items-center justify-center rounded-[10px] w-full">
          <div className="flex flex-col gap-[8px] items-center p-[16px] w-full">
            <div className="flex items-center justify-center rounded-full shrink-0 w-[24px] h-[24px]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.17 14.83L14.83 9.17" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14.83 14.83L9.17 9.17" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="font-normal text-[14px] leading-[normal] text-[#0c0d0f] text-center">
              This request was declined.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default: Pending status
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

      {/* Provider Section */}
      <div className="bg-white border-b border-[#f3f4f6] flex flex-col items-start w-full">
        <div className="flex h-[24px] items-center justify-center px-[16px] w-full">
          <p className="flex-1 font-semibold leading-[normal] text-[16px] text-[#0c0d0f] min-w-0">
            Provider
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
              <div className="flex flex-col gap-[4px] items-start w-full">
                <p className="font-medium text-[16px] leading-[normal] text-black w-full truncate">
                  {request.userName}
                </p>
                <p className="font-medium text-[14px] leading-[normal] text-[#5e5e5f] truncate">
                  Photographer & Filmmaker
                </p>
              </div>
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
              className="border border-[#3272a3] flex h-[24px] items-center justify-center p-[8px] rounded-[10px] shrink-0"
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
                60 minutes
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
                Beginner
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
          <div className="bg-[#fafafa] border border-[#e6e6e6] flex flex-col h-[70px] items-center justify-center p-[8px] rounded-[10px] w-full">
            <p className="font-normal h-[40px] leading-[normal] text-[12px] text-[#666] text-center w-full">
              "Hi! I'd love to learn this skill and start building my portfolio. I'm a beginner and looking for guidance on the core concepts of performance optimization."
            </p>
          </div>
        </div>
      </div>

      {/* Preferred Time */}
      <div className="bg-white flex flex-col items-start rounded-bl-[10px] rounded-br-[10px] w-full">
        <div className="flex h-[24px] items-center justify-center px-[16px] w-full">
          <p className="flex-1 font-semibold leading-[normal] text-[16px] text-[#0c0d0f] min-w-0">
            Preferred Time
          </p>
        </div>
        <div className="flex flex-col items-start px-[16px] py-[8px] w-full">
          <p className="font-normal text-[14px] leading-[normal] text-[#0c0d0f] text-center">
            Saturday, Feb 2, 4:00 PM - 5:00 PM
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center justify-center w-full">
        <button
          onClick={handleCancelClick}
          className="bg-white border border-[#dc2626] flex gap-[10px] h-[48px] items-center justify-center rounded-[10px] w-full hover:bg-[#dc2626] hover:text-white transition-colors group"
        >
          <p className="font-medium text-[16px] leading-[normal] text-[#dc2626] group-hover:text-white">
            Cancel Request
          </p>
        </button>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && createPortal(
        <>
          <div
            onClick={handleUndoCancel}
            className="fixed inset-0 bg-[rgba(94,95,96,0.2)] z-[9999]"
          />
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            <div className="requests-cancel-modal bg-white border border-[#e5e7eb] flex flex-col h-[173px] items-start rounded-[10px] w-full max-w-[484px]" style={{ boxShadow: '0px 0px 4.7px 0px rgba(0, 0, 0, 0.25)' }}>
              {/* Modal Header */}
              <div className="border-b border-[#f3f4f6] flex gap-[10px] h-[40px] items-center justify-center pl-[16px] rounded-tl-[10px] rounded-tr-[10px] shrink-0 w-full">
                <p className="flex-1 font-medium text-[16px] leading-[normal] text-[#0c0d0f] min-h-px min-w-px">
                  Cancel Request?
                </p>
                <button
                  onClick={handleUndoCancel}
                  className="shrink-0 size-[32px] flex items-center justify-center"
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M12 20L20 12M20 20L12 12" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex flex-col gap-[20px] h-[133px] items-start justify-center p-[16px] shrink-0 w-full">
                <p className="font-normal text-[14px] leading-[normal] text-[#0c0d0f] shrink-0">
                  Are you sure you want to cancel this request? 
                </p>

                {/* Modal Actions */}
                <div className="requests-cancel-actions flex gap-[8px] items-start px-[16px] shrink-0 w-full">
                  <button
                    onClick={handleUndoCancel}
                    className="bg-[#f5f5f5] border border-[#e5e7eb] flex-1 flex gap-[10px] h-[40px] items-center justify-center min-h-px min-w-px rounded-[10px] hover:bg-[#e5e7eb] transition-colors"
                  >
                    <p className="font-normal text-[14px] leading-[normal] text-[#666] shrink-0">
                      Undo
                    </p>
                  </button>
                  <button
                    onClick={handleConfirmCancel}
                    className="bg-[#dc2626] flex-1 flex gap-[10px] h-[40px] items-center justify-center min-h-px min-w-px rounded-[10px] hover:bg-[#b91c1c] transition-colors"
                  >
                    <p className="font-normal text-[14px] leading-[normal] text-white shrink-0">
                      Cancel
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};
