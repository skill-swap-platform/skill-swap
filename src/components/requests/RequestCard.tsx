import React from 'react';

export interface RequestCardProps {
  userName: string;
  userAvatar: string;
  userRating: number;
  requestedSkill: string;
  offeredSkill?: string;
  requestedSkillLevel?: string | null;
  offeredSkillLevel?: string | null;
  status: 'pending' | 'accepted' | 'completed' | 'declined' | 'expired' | 'cancelled';
  sessionType: 'skill-swap' | 'free-session';
  sentTime: string;
  message?: string | null;
  startAt?: string;
  endAt?: string;
  timezone?: string;
  onClick?: () => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  userName,
  userAvatar,
  userRating,
  requestedSkill,
  offeredSkill,
  status,
  sessionType,
  sentTime,
  onClick,
}) => {
  const statusConfig = {
    pending: {
      color: '#FFA412',
      bgColor: '#FFA412',
      label: 'Pending',
    },
    accepted: {
      color: '#16A34A',
      bgColor: '#16A34A',
      label: 'Accepted',
    },
    completed: {
      color: '#16A34A',
      bgColor: '#16A34A',
      label: 'Completed',
    },
    declined: {
      color: '#9CA3AF',
      bgColor: '#9CA3AF',
      label: 'Declined',
    },
    expired: {
      color: '#D97706',
      bgColor: '#D97706',
      label: 'Expired',
    },
    cancelled: {
      color: '#6B7280',
      bgColor: '#6B7280',
      label: 'Cancelled',
    },
  };

  const sessionTypeConfig = {
    'skill-swap': {
      bgColor: 'rgba(62, 143, 204, 0.2)',
      textColor: '#3272a3',
      label: 'Skill-Swap',
    },
    'free-session': {
      bgColor: 'rgba(245, 158, 11, 0.2)',
      textColor: '#ffa412',
      label: 'Free Session',
    },
  };

  const currentStatus = statusConfig[status];
  const currentSessionType = sessionTypeConfig[sessionType];

  return (
    <button 
      onClick={onClick}
      className="bg-white border border-[#e5e7eb] flex flex-col gap-4 items-start p-4 rounded-[10px] w-full cursor-pointer transition-colors hover:bg-[rgba(0,0,0,0.05)] text-left"
    >
      {/* Header */}
      <div className="flex flex-wrap sm:flex-nowrap gap-2 items-start w-full">
        <img
          src={userAvatar}
          alt={userName}
          className="shrink-0 w-12 h-12 rounded-full object-cover"
        />
        <div className="flex flex-1 flex-col gap-1 items-start justify-center px-2 min-w-0">
          <div className="flex gap-2 items-center min-w-0">
            <p className="font-semibold text-[#0c0d0f] text-[20px] leading-[normal] text-left truncate">
              {userName}
            </p>
            <div className="flex gap-[2px] items-end">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 w-[16px] h-[16px]"
              >
                <path
                  d="M8 1.33334L10.06 5.50668L14.6667 6.18001L11.3333 9.42668L12.12 14.0133L8 11.8467L3.88 14.0133L4.66667 9.42668L1.33333 6.18001L5.94 5.50668L8 1.33334Z"
                  fill="#FFE947"
                  stroke="#FFE947"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="font-normal text-[#999] text-[14px] leading-[normal] text-center">
                {userRating.toFixed(1)}
              </p>
            </div>
          </div>
          <div className="flex items-center h-5 px-2 rounded-[10px]" style={{ backgroundColor: currentSessionType.bgColor }}>
            <p className="font-normal text-xs" style={{ color: currentSessionType.textColor }}>
              {currentSessionType.label}
            </p>
          </div>
        </div>
        <div className="flex gap-1 items-center justify-start sm:justify-end min-w-0 sm:min-w-[64px] w-full sm:w-auto pl-[56px] sm:pl-0">
          <div
            className="shrink-0 w-2 h-2 rounded-full"
            style={{ backgroundColor: currentStatus.bgColor }}
          />
          <p className="font-semibold text-sm whitespace-nowrap" style={{ color: currentStatus.color }}>
            {currentStatus.label}
          </p>
        </div>
      </div>

      {/* Request Details */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start w-full">
        <div className="flex flex-wrap gap-1 items-center text-[13px] text-left">
          <p className="text-[#9ca3af] font-normal">Requested Skill</p>
          <p className="text-[#0c0d0f] font-normal">{requestedSkill}</p>
        </div>
        {offeredSkill && (
          <>
            <p className="hidden sm:block font-normal text-[#9ca3af] text-[13px] text-center">|</p>
            <div className="flex flex-1 flex-col items-start justify-center min-w-0 w-full sm:w-auto">
              <div className="flex flex-wrap gap-1 items-center text-[13px] text-left">
                <p className="text-[#9ca3af] font-normal">You offer:</p>
                <p className="text-[#0c0d0f] font-normal">{offeredSkill}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-[#f3f4f6] h-px w-full" />

      {/* Footer */}
      <div className="flex gap-2 h-[27px] items-center w-full">
        <p className="flex-1 font-normal text-[#999] text-xs min-w-0">
          {sentTime}
        </p>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 shrink-0"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="#666"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </button>
  );
};
