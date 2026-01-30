import React from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewRequests: () => void;
  onBrowseSkills: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  onViewRequests,
  onBrowseSkills
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-[rgba(94,95,96,0.2)] flex items-center justify-center z-[1000] p-6" onClick={onClose}>
      <div className="bg-white rounded-md shadow-[0_0_4.7px_rgba(0,0,0,0.25)] w-[503px] h-[608px] p-6 flex flex-col items-center justify-center gap-4 relative" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-[13px] right-[13px] w-10 h-10 bg-transparent border-none cursor-pointer p-0 flex items-center justify-center hover:opacity-80" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="rgba(102, 102, 102, 1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="w-22 h-22 bg-success-light rounded-3xl flex items-center justify-center flex-shrink-0">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="17" stroke="#16A34A" strokeWidth="2" fill="none"/>
            <path d="M13 20L17 24L27 14" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>

        <div className="flex flex-col gap-2 items-center text-center w-full whitespace-pre-wrap">
          <h2 className="font-semibold text-xl leading-none text-success m-0">Request Sent!</h2>
          <p className="font-normal text-xs leading-none text-dark-light w-[343px] h-[42px] m-0">
            Your request is now on its way. You'll be notified as soon as the provider responds.
          </p>
        </div>

        <div className="flex flex-col gap-2 items-center justify-end w-full">
          <button className="w-[345px] h-12 bg-gradient-to-r from-primary-light to-primary-light rounded-md border-none cursor-pointer flex items-center justify-center gap-2.5 font-medium text-base leading-none text-white transition-opacity hover:opacity-90" onClick={onViewRequests}>
            View My Requests
          </button>
          <button className="w-[345px] h-12 bg-white border border-primary rounded-md cursor-pointer flex items-center justify-center gap-2.5 font-medium text-base leading-none text-primary transition-colors hover:bg-gray-light" onClick={onBrowseSkills}>
            Browse more Skills
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
