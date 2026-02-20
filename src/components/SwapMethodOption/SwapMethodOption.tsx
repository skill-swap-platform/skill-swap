import React from 'react';

interface SwapMethodOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgColor: string;
  isSelected?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'warning';
}

const SwapMethodOption: React.FC<SwapMethodOptionProps> = ({
  icon,
  title,
  description,
  iconBgColor,
  isSelected = false,
  onClick,
  variant = 'default'
}) => {
  const baseClasses = "bg-white border rounded-md px-4 py-2 pl-2 flex items-start sm:items-center gap-3 sm:gap-4 cursor-pointer transition-colors duration-200";
  const hoverClasses = variant === 'warning' ? 'hover:border-warning' : 'hover:border-primary';
  const selectedClasses = isSelected 
    ? variant === 'warning' 
      ? 'bg-warning-light/10 border-warning' 
      : 'bg-primary-dark/10 border-primary'
    : 'border-gray-border';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${selectedClasses}`}
      onClick={onClick}
    >
      <div 
        className="flex items-center justify-center rounded w-10 h-10 flex-shrink-0"
        style={{ backgroundColor: iconBgColor }}
      >
        {icon}
      </div>
      <div className="flex flex-1 flex-col gap-2 items-start justify-center min-h-0 min-w-0">
        <p className="font-medium text-sm sm:text-base text-dark m-0 w-full">{title}</p>
        <p className="font-normal text-xs text-dark-light m-0 w-full">{description}</p>
      </div>
      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
        {isSelected ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke={variant === 'warning' ? '#FFA412' : '#3272A3'} strokeWidth="2" fill="white"/>
            <path d="M6 10L8.5 12.5L14 7" stroke={variant === 'warning' ? '#FFA412' : '#3272A3'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <div className="w-5 h-5 border-2 border-gray-300 rounded-full bg-white" />
        )}
      </div>
    </div>
  );
};

export default SwapMethodOption;
