import React from 'react';

export type RequestStatus =
  | 'all'
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'expired'
  | 'completed'
  | 'cancelled';

interface StatusFilterTabsProps {
  activeFilter: RequestStatus;
  onFilterChange: (filter: RequestStatus) => void;
}

export const StatusFilterTabs: React.FC<StatusFilterTabsProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const filters: { label: string; value: RequestStatus }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Accepted', value: 'accepted' },
    { label: 'Declined', value: 'declined' },
    { label: 'Expired', value: 'expired' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <div className="bg-white border-[#e5e7eb] border-l border-r border-t flex flex-wrap gap-2 items-center p-4 rounded-tl-[10px] rounded-tr-[10px] w-full max-w-[846px]">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`flex h-6 items-center justify-center px-2 py-2.5 rounded-[20px] ${
            activeFilter === filter.value
              ? 'bg-gradient-to-r from-[#3e8fcc] to-[#3e8fcc] text-white'
              : 'border border-[#e5e7eb] text-[#666]'
          }`}
        >
          <p className="font-normal text-sm sm:text-base text-center whitespace-nowrap">
            {filter.label}
          </p>
        </button>
      ))}
    </div>
  );
};
