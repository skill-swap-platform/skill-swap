import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { styled } from '@mui/material/styles';
import { Box, Popover, Select, MenuItem } from '@mui/material';
import type { PickersCalendarHeaderProps } from '@mui/x-date-pickers/PickersCalendarHeader';

// Custom styled Day component to match Figma design
const CustomDay = styled(PickersDay)(() => ({
  fontFamily: '"Segoe UI", sans-serif',
  fontSize: '12px',
  lineHeight: '18px',
  fontWeight: 400,
  width: '40px',
  height: '40px',
  margin: 0,
  '&.MuiPickersDay-root': {
    color: '#0C0D0F',
  },
  '&.MuiPickersDay-today': {
    border: 'none',
    backgroundColor: 'transparent',
  },
  '&.Mui-selected': {
    backgroundColor: '#3B82F6 !important',
    color: '#FFFFFF !important',
    '&:hover': {
      backgroundColor: '#3B82F6',
    },
    '&:focus': {
      backgroundColor: '#3B82F6',
    },
  },
  '&.MuiPickersDay-dayOutsideMonth': {
    color: '#999999',
  },
  '&:hover': {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
}));

// Custom Calendar Header with Year Dropdown
function CustomCalendarHeader(props: PickersCalendarHeaderProps) {
  const { currentMonth, onMonthChange } = props;
  const [selectedYear, setSelectedYear] = useState(currentMonth.year());

  const handlePreviousMonth = () => {
    onMonthChange(currentMonth.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    onMonthChange(currentMonth.add(1, 'month'));
  };

  const handleYearChange = (event: any) => {
    const newYear = event.target.value;
    setSelectedYear(newYear);
    onMonthChange(currentMonth.year(newYear));
  };

  // Generate year options (current year ± 100 years)
  const currentYear = dayjs().year();
  const years = Array.from({ length: 201 }, (_, i) => currentYear - 100 + i);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 4px 0 12px',
        height: '48px',
      }}
    >
      {/* Left Arrow */}
      <Box
        component="button"
        onClick={handlePreviousMonth}
        sx={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          width: '16px',
          height: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 13L5 8L10 3" stroke="#747474" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Box>

      {/* Month Name */}
      <Box
        sx={{
          flex: 1,
          textAlign: 'center',
          fontFamily: '"Segoe UI", sans-serif',
          fontSize: '12px',
          fontWeight: 400,
          color: '#0C0D0F',
          lineHeight: '18px',
        }}
      >
        {currentMonth.format('MMMM')}
      </Box>

      {/* Right Arrow */}
      <Box
        component="button"
        onClick={handleNextMonth}
        sx={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          width: '16px',
          height: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 3L11 8L6 13" stroke="#747474" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Box>

      {/* Year Dropdown */}
      <Select
        value={selectedYear}
        onChange={handleYearChange}
        sx={{
          width: '80px',
          height: '32px',
          marginLeft: '8px',
          fontFamily: '"Segoe UI", sans-serif',
          fontSize: '13px',
          fontWeight: 400,
          color: '#999',
          backgroundColor: '#FFFFFF',
          border: '1px solid #747474',
          borderRadius: '4px',
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiSelect-select': {
            padding: '5px 11px',
            paddingRight: '35px !important',
          },
          '& .MuiSelect-icon': {
            right: '11px',
            width: '16px',
            height: '16px',
            color: '#747474',
          },
        }}
      >
        {years.map((year) => (
          <MenuItem
            key={year}
            value={year}
            sx={{
              fontFamily: '"Segoe UI", sans-serif',
              fontSize: '13px',
              color: '#0C0D0F',
            }}
          >
            {year}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}

interface CustomDatePickerProps {
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
  placeholder?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ 
  value, 
  onChange,
  placeholder = 'DD/MM/YYYY'
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleDateChange = (newDate: Dayjs | null) => {
    onChange(newDate);
    handleClose();
  };

  const formatDate = (date: Dayjs | null) => {
    if (!date) return '';
    return date.format('DD/MM/YYYY');
  };

  return (
    <>
      <div className="border border-gray-divider rounded-md h-12 flex items-center gap-3 px-3.5 py-1 bg-white cursor-pointer transition-colors hover:border-primary" onClick={handleClick}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
          <path d="M6.66602 1.66667V4.16667" stroke="#5C5C5C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.334 1.66667V4.16667" stroke="#5C5C5C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2.91602 7.575H17.0827" stroke="#5C5C5C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.5 7.08333V14.1667C17.5 16.6667 16.25 18.3333 13.3333 18.3333H6.66667C3.75 18.3333 2.5 16.6667 2.5 14.1667V7.08333C2.5 4.58333 3.75 2.91667 6.66667 2.91667H13.3333C16.25 2.91667 17.5 4.58333 17.5 7.08333Z" stroke="#5C5C5C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input
          type="text"
          className="flex-1 border-none outline-none font-medium text-sm leading-5 tracking-wide text-[#5c5c5c] bg-transparent cursor-pointer placeholder:text-[#5c5c5c]"
          placeholder={placeholder}
          value={formatDate(value)}
          readOnly
        />
        <div className={`flex items-center justify-center w-6 h-6 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-[-90deg]' : 'rotate-90'}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M8.91016 19.92L15.4302 13.4C16.2002 12.63 16.2002 11.37 15.4302 10.6L8.91016 4.08" stroke="#0C0D0F" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
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
              borderRadius: '4px',
              border: '1px solid #C9C9C9',
              boxShadow: '0px 2px 3px 0px rgba(0,0,0,0.16)',
              overflow: 'visible',
            }
          }
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={value}
            onChange={handleDateChange}
            slots={{
              day: CustomDay,
              calendarHeader: CustomCalendarHeader,
            }}
            dayOfWeekFormatter={(day) => day.format('ddd')}
            sx={{
              width: '280px',
              height: 'auto',
              margin: 0,
              padding: 0,
              '& .MuiPickersCalendarHeader-root': {
                padding: 0,
                margin: 0,
                minHeight: '48px',
              },
              '& .MuiDayCalendar-header': {
                paddingLeft: 0,
                paddingRight: 0,
                justifyContent: 'space-between',
                marginTop: '0px',
              },
              '& .MuiDayCalendar-weekDayLabel': {
                width: '40px',
                height: '32px',
                margin: 0,
                fontFamily: '"Segoe UI", sans-serif',
                fontSize: '12px',
                fontWeight: 400,
                color: '#666666',
                lineHeight: '18px',
              },
              '& .MuiDayCalendar-slideTransition': {
                minHeight: '240px',
                overflow: 'visible',
              },
              '& .MuiDayCalendar-monthContainer': {
                position: 'relative',
              },
              '& .MuiDayCalendar-weekContainer': {
                margin: 0,
                justifyContent: 'space-between',
              },
              '& .MuiPickersDay-root': {
                margin: 0,
              },
              '& .MuiYearCalendar-root': {
                width: '280px',
                padding: 0,
              },
              '& .MuiPickersYear-yearButton': {
                fontFamily: '"Segoe UI", sans-serif',
                fontSize: '13px',
                fontWeight: 400,
                color: '#999999',
                '&.Mui-selected': {
                  backgroundColor: '#3B82F6',
                  color: '#FFFFFF',
                },
              },
            }}
            showDaysOutsideCurrentMonth
            views={['day']}
          />
          <Box
            sx={{
              textAlign: 'center',
              paddingBottom: '8px',
              fontFamily: '"Segoe UI", sans-serif',
              fontSize: '12px',
              color: '#3B82F6',
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
            onClick={() => handleDateChange(dayjs())}
          >
            Today
          </Box>
        </LocalizationProvider>
      </Popover>
    </>
  );
};

export default CustomDatePicker;
