import React, { useState, useRef, useEffect } from 'react';
import { Popover } from '@mui/material';
import styles from './CustomTimePicker.module.css';

interface CustomTimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label: string;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({ value, onChange }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [hour, setHour] = useState<string>('12');
  const [minute, setMinute] = useState<string>('00');
  const [period, setPeriod] = useState<string>('AM');

  const hourColumnRef = useRef<HTMLDivElement>(null);
  const minuteColumnRef = useRef<HTMLDivElement>(null);
  const periodColumnRef = useRef<HTMLDivElement>(null);

  // Generate hours (01-12)
  const hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  // Generate minutes (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const periods = ['AM', 'PM'];

  useEffect(() => {
    if (value) {
      const match = value.match(/(\d{2}):(\d{2})\s(AM|PM)/);
      if (match) {
        setHour(match[1]);
        setMinute(match[2]);
        setPeriod(match[3]);
      }
    }
  }, [value]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleHourChange = (newHour: string) => {
    setHour(newHour);
    onChange(`${newHour}:${minute} ${period}`);
  };

  const handleMinuteChange = (newMinute: string) => {
    setMinute(newMinute);
    onChange(`${hour}:${newMinute} ${period}`);
  };

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    onChange(`${hour}:${minute} ${newPeriod}`);
  };

  const scrollToSelected = (
    ref: React.RefObject<HTMLDivElement | null>,
    selectedValue: string,
    values: string[]
  ) => {
    if (ref.current) {
      const index = values.indexOf(selectedValue);
      if (index !== -1) {
        const itemHeight = 24 + 4; // height + gap
        ref.current.scrollTop = index * itemHeight;
      }
    }
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        scrollToSelected(hourColumnRef, hour, hours);
        scrollToSelected(minuteColumnRef, minute, minutes);
        scrollToSelected(periodColumnRef, period, periods);
      }, 0);
    }
  }, [open]);

  return (
    <>
      <div className={styles.inputWrapper} onClick={handleClick}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.timeIcon}>
          <path d="M14.6673 8.00016C14.6673 11.68 11.6807 14.6668 8.00065 14.6668C4.32065 14.6668 1.33398 11.68 1.33398 8.00016C1.33398 4.32016 4.32065 1.3335 8.00065 1.3335C11.6807 1.3335 14.6673 4.32016 14.6673 8.00016Z" stroke="#5C5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.4727 10.12L8.40602 8.88667C8.04602 8.67334 7.75269 8.16 7.75269 7.74V5.00667" stroke="#5C5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input
          type="text"
          className={styles.input}
          placeholder="00:00"
          value={value}
          readOnly
        />
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={styles.dropdownIcon}>
          <path d="M19.92 8.91016L13.4 15.4302C12.63 16.2002 11.37 16.2002 10.6 15.4302L4.08 8.91016" stroke="#0C0D0F" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
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
              border: '1px solid #E5E7EB',
              boxShadow: '0px 0px 4.7px 0px rgba(0,0,0,0.25)',
              overflow: 'hidden',
              backgroundColor: '#F9FAFB',
            }
          }
        }}
      >
        <div className={styles.timePickerContainer}>
          <div className={styles.timePickerColumns}>
            <div className={styles.timePickerColumn} ref={hourColumnRef}>
              {hours.map((h) => (
                <div
                  key={h}
                  className={`${styles.timePickerItem} ${hour === h ? styles.timePickerItemSelected : ''}`}
                  onClick={() => handleHourChange(h)}
                >
                  {h}
                </div>
              ))}
            </div>
            <div className={styles.timePickerColumn} ref={minuteColumnRef}>
              {minutes.map((m) => (
                <div
                  key={m}
                  className={`${styles.timePickerItem} ${minute === m ? styles.timePickerItemSelected : ''}`}
                  onClick={() => handleMinuteChange(m)}
                >
                  {m}
                </div>
              ))}
            </div>
            <div className={styles.timePickerColumn} ref={periodColumnRef}>
              {periods.map((p) => (
                <div
                  key={p}
                  className={`${styles.timePickerItem} ${period === p ? styles.timePickerItemSelected : ''}`}
                  onClick={() => handlePeriodChange(p)}
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Popover>
    </>
  );
};

export default CustomTimePicker;
