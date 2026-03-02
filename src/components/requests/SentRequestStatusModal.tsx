import React from 'react';
import { createPortal } from 'react-dom';

export type SentRequestStatusModalVariant = 'accepted' | 'declined';

interface SentRequestStatusModalProps {
  isOpen: boolean;
  variant: SentRequestStatusModalVariant;
  providerName: string;
  requestedSkill: string;
  requestedSkillLevel?: string | null;
  scheduledAt?: string;
  rejectionReason?: string | null;
  onClose: () => void;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
}

const formatSkillLevel = (level?: string | null): string | null => {
  if (!level) return null;
  return level
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatScheduledAt = (value?: string): string => {
  if (!value) return 'To be confirmed';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'To be confirmed';

  const weekday = date.toLocaleDateString(undefined, { weekday: 'short' });
  const month = date.toLocaleDateString(undefined, { month: 'short' });
  const day = date.toLocaleDateString(undefined, { day: '2-digit' });
  const year = date.toLocaleDateString(undefined, { year: 'numeric' });
  const time = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  return `${weekday}, ${day} ${month} ${year} at ${time}`;
};

export const SentRequestStatusModal: React.FC<SentRequestStatusModalProps> = ({
  isOpen,
  variant,
  providerName,
  requestedSkill,
  requestedSkillLevel,
  scheduledAt,
  rejectionReason,
  onClose,
  onPrimaryAction,
  onSecondaryAction,
}) => {
  if (!isOpen || typeof document === 'undefined') return null;

  const isAccepted = variant === 'accepted';
  const formattedSkillLevel = formatSkillLevel(requestedSkillLevel);
  const skillTitle = formattedSkillLevel
    ? `${requestedSkill} (${formattedSkillLevel})`
    : requestedSkill;
  const scheduledLabel = formatScheduledAt(scheduledAt);

  return createPortal(
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[9998] bg-[rgba(94,95,96,0.2)]"
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-8">
        <div
          role="dialog"
          aria-modal="true"
          className="relative flex w-full max-w-[503px] flex-col items-center gap-4 rounded-[10px] border border-[#e5e7eb] bg-white p-6 shadow-[0px_0px_4.7px_0px_rgba(0,0,0,0.25)]"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-[18px] top-[14px] flex size-6 items-center justify-center text-[#666666]"
            aria-label="Close status modal"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div
            className={`mt-4 flex size-[88px] items-center justify-center rounded-full ${
              isAccepted ? 'bg-[#d0efdb]' : 'bg-[#ffd9d9]'
            }`}
          >
            {isAccepted ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#16A34A" strokeWidth="2" />
                <path
                  d="M8 12L10.8 14.8L16 9.5"
                  stroke="#16A34A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#DC2626" strokeWidth="2" />
                <path
                  d="M15 9L9 15M9 9L15 15"
                  stroke="#DC2626"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>

          {isAccepted ? (
            <>
              <div className="flex w-full flex-col items-center gap-2 text-center">
                <p className="text-[20px] font-semibold leading-none text-[#16a34a]">
                  Great news!
                </p>
                <p className="text-[16px] font-semibold leading-none text-[#0c0d0f]">
                  {providerName} accepted your request
                </p>
                <p className="max-w-[343px] text-[12px] font-normal leading-[1.2] text-[#666666]">
                  You can now start a conversation and finalize your session details.
                </p>
              </div>

              <div className="flex w-full flex-col items-center gap-3 rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] p-2 text-center">
                <p className="text-[16px] font-medium leading-none text-[#0c0d0f]">{skillTitle}</p>
                <p className="text-[14px] font-normal leading-none text-[#413f3f]">
                  Provider: {providerName}
                </p>
                <p className="text-[12px] font-semibold leading-none text-[#413f3f]">
                  Scheduled: {scheduledLabel}
                </p>
              </div>

              <div className="flex w-full flex-col items-center gap-2 pb-4 pt-2">
                <button
                  type="button"
                  onClick={onPrimaryAction}
                  className="h-12 w-full max-w-[345px] rounded-[10px] text-[16px] font-medium text-white transition-opacity hover:opacity-90"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(62, 143, 204) 0%, rgb(62, 143, 204) 100%)',
                  }}
                >
                  Go to Chat
                </button>
                <button
                  type="button"
                  onClick={onSecondaryAction}
                  className="h-12 w-full max-w-[345px] rounded-[10px] border border-[#3272a3] bg-white text-[16px] font-medium text-[#3272a3] transition-colors hover:bg-[#f2f8fc]"
                >
                  View Session Details
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex w-full flex-col items-center gap-2 text-center">
                <p className="text-[20px] font-semibold leading-none text-[#dc2626]">
                  Request Declined
                </p>
                <p className="max-w-[343px] text-[12px] font-normal leading-[1.2] text-[#0c0d0f]">
                  Unfortunately, the provider couldn&apos;t accept this request at this time.
                </p>
              </div>

              <div className="flex w-full flex-col items-start gap-2 rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] p-2">
                <p className="text-[12px] font-normal leading-none text-[#666666]">Reason</p>
                <p className="w-full text-center text-[12px] font-normal leading-[1.2] text-[#413f3f]">
                  "{(rejectionReason?.trim() || 'No reason provided.')}"
                </p>
              </div>

              <div className="flex h-[140px] w-full items-center justify-center">
                <button
                  type="button"
                  onClick={onPrimaryAction}
                  className="h-12 w-full max-w-[345px] rounded-[10px] text-[16px] font-medium text-white transition-opacity hover:opacity-90"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(62, 143, 204) 0%, rgb(62, 143, 204) 100%)',
                  }}
                >
                  Find Another Skill
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>,
    document.body
  );
};
