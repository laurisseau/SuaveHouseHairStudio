import React, { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Import the default styles
import 'react-date-range/dist/theme/default.css';


export default function VacationScreen() {
    const [selectedDates, setSelectedDates] = useState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
      }
    ]);
  
    const handleDateChange = (ranges) => {
      setSelectedDates([ranges.selection]);
    };
  
    return (
      <div>
        <DateRangePicker
          ranges={selectedDates}
          onChange={handleDateChange}
          months={2}
          direction='horizantal'
        />
        {selectedDates.length > 0 && (
          <div>
            Selected start date: {selectedDates[0].startDate.toDateString()} <br />
            Selected end date: {selectedDates[0].endDate.toDateString()}
          </div>
        )}
      </div>
    );
  };