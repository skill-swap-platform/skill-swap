import React from 'react';

interface RequestTabsProps {
  activeTab: 'sent' | 'received';
  onTabChange: (tab: 'sent' | 'received') => void;
}

export const RequestTabs: React.FC<RequestTabsProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  return (
    <div className="bg-white border border-[#e5e7eb] flex gap-4 h-12 items-center px-4 sm:px-6 rounded-[10px] w-full max-w-[846px]">
      <button
        onClick={() => onTabChange('sent')}
        className={`flex h-full items-center justify-center flex-1 sm:flex-none sm:w-[88px] ${
          activeTab === 'sent' 
            ? 'border-b-2 border-[#3272a3]' 
            : ''
        }`}
      >
        <p className={`font-normal text-base text-center ${
          activeTab === 'sent'
            ? 'text-[#3272a3]'
            : 'text-[#666]'
        }`}>
          Sent
        </p>
      </button>
      <button
        onClick={() => onTabChange('received')}
        className={`flex h-full items-center justify-center flex-1 sm:flex-none sm:w-[88px] ${
          activeTab === 'received' 
            ? 'border-b-2 border-[#3272a3]' 
            : ''
        }`}
      >
        <p className={`font-normal text-base text-center ${
          activeTab === 'received'
            ? 'text-[#3272a3]'
            : 'text-[#666]'
        }`}>
          Received
        </p>
      </button>
    </div>
  );
};
