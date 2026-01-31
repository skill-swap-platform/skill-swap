import React, { useState } from 'react';
import { Popover } from '@mui/material';

interface TimezoneSelectorProps {
  value: string;
  onChange: (timezone: string) => void;
  timezones: string[];
}

const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({ value, onChange, timezones }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchQuery('');
  };

  const handleSelect = (timezone: string) => {
    onChange(timezone);
    handleClose();
  };

  const open = Boolean(anchorEl);

  const filteredTimezones = timezones.filter(tz => 
    tz.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div 
        className="bg-background-muted rounded-md h-10 flex items-center justify-between px-4 gap-1 cursor-pointer transition-colors hover:bg-[#d9d9d9]"
        onClick={handleClick}
      >
        <span className="flex-1 font-normal text-sm text-dark-light">{value}</span>
        <div className={`flex items-center justify-center w-4 h-4 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-[-90deg]' : 'rotate-90'}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5.94 13.28L10.2867 8.93335C10.8 8.42002 10.8 7.58002 10.2867 7.06668L5.94 2.72002" stroke="#0C0D0F" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              marginTop: '4px',
              borderRadius: '10px',
              boxShadow: '0px 0px 4.7px 0px rgba(0,0,0,0.25)',
              overflow: 'hidden',
              backgroundColor: '#F9FAFB',
              width: anchorEl ? anchorEl.offsetWidth : 'auto',
            }
          }
        }}
      >
        <div className="bg-gray-light rounded-md overflow-hidden py-2">
          <div className="px-2 pb-2 relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 bg-white border border-gray-border rounded-md py-2 pr-10 pl-4 font-normal text-xs text-dark outline-none placeholder:text-dark-light"
              autoFocus
            />
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute right-6 top-3 pointer-events-none">
              <path d="M7.33333 13.3333C10.647 13.3333 13.3333 10.647 13.3333 7.33333C13.3333 4.01967 10.647 1.33333 7.33333 1.33333C4.01967 1.33333 1.33333 4.01967 1.33333 7.33333C1.33333 10.647 4.01967 13.3333 7.33333 13.3333Z" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14.6667 14.6667L13.3334 13.3333" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="max-h-[200px] overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-[#d9d9d9] scrollbar-track-transparent scrollbar-thumb-rounded-2xl">
            {filteredTimezones.map((tz, index) => (
              <div
                key={index}
                className={`py-2 px-4 font-normal text-sm text-dark cursor-pointer transition-colors ${tz === value ? 'bg-primary-light/20' : 'hover:bg-primary-light/10'}`}
                onClick={() => handleSelect(tz)}
              >
                {tz}
              </div>
            ))}
          </div>
        </div>
      </Popover>
    </>
  );
};

export default TimezoneSelector;
