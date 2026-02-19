import React, { useState } from 'react';

interface CollapsibleSectionProps {
  number: number;
  title: string;
  description?: string;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
  isCompleted?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  number,
  title,
  description,
  children,
  defaultExpanded = false,
  isCompleted = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`bg-white border rounded-2xl p-4 w-full ${isCompleted ? 'border-success shadow-none' : 'border-gray-border'} ${isExpanded ? 'shadow-[0_0_4.7px_rgba(0,0,0,0.25)]' : ''}`}>
      <div className="flex gap-3 sm:gap-4 items-start sm:items-center justify-between w-full cursor-pointer flex-shrink-0 min-h-12" onClick={toggleExpanded}>
        <div className="flex flex-1 flex-col gap-1 items-start justify-center min-h-0 min-w-0">
          <div className="flex flex-col gap-1 w-full">
            <ol className="font-semibold text-base sm:text-lg text-dark m-0 p-0 w-full flex-shrink-0 list-decimal list-outside pl-[27px]" start={number}>
              <li className="whitespace-pre-wrap">
                <span className="leading-normal">{title}</span>
              </li>
            </ol>
            {description && !isExpanded && (
              <p className="font-normal text-xs sm:text-sm text-dark-light m-0 w-full whitespace-pre-wrap flex-shrink-0">{description}</p>
            )}
          </div>
        </div>
        {isCompleted ? (
          <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8.5" stroke="#16A34A" strokeWidth="1.5" fill="none"/>
              <path d="M6.5 10L8.5 12L13.5 7" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
        ) : (
          <div className={`flex items-center justify-center w-6 h-6 flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-[-90deg]' : 'rotate-90'}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8.91016 19.92L15.4302 13.4C16.2002 12.63 16.2002 11.37 15.4302 10.6L8.91016 4.08" stroke="#0C0D0F" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
      {isExpanded && children && (
        <div className="flex flex-col gap-3 mt-4 w-full animate-slide-down">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
