import React, { useState } from 'react';
import { Popover } from '@mui/material';
import styles from './TimezoneSelector.module.css';

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
        className={styles.timezoneSelector}
        onClick={handleClick}
      >
        <span>{value}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.timezoneArrow}>
          <path d="M12.72 5.78016L8.93335 9.56682C8.42002 10.0802 7.58002 10.0802 7.06668 9.56682L3.28002 5.78016" stroke="#0C0D0F" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
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
        <div className={styles.timezoneDropdown}>
          <div className={styles.timezoneSearch}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.timezoneSearchInput}
              autoFocus
            />
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.searchIcon}>
              <path d="M7.33333 13.3333C10.647 13.3333 13.3333 10.647 13.3333 7.33333C13.3333 4.01967 10.647 1.33333 7.33333 1.33333C4.01967 1.33333 1.33333 4.01967 1.33333 7.33333C1.33333 10.647 4.01967 13.3333 7.33333 13.3333Z" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14.6667 14.6667L13.3334 13.3333" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.timezoneList}>
            {filteredTimezones.map((tz, index) => (
              <div
                key={index}
                className={`${styles.timezoneItem} ${tz === value ? styles.timezoneItemSelected : ''}`}
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
