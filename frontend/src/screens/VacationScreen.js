import { useState} from 'react';
import { DateRangePicker } from 'react-date-range';
import Button from "react-bootstrap/Button";
import 'react-date-range/dist/styles.css'; // Import the default styles
import 'react-date-range/dist/theme/default.css';
import NavbarComp from "../components/NavbarComp";

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
        <NavbarComp color="dark" />
      <div className='vacation-container mt-5 mb-5'>
        <DateRangePicker
          ranges={selectedDates}
          onChange={handleDateChange}
          months={2}
          direction='horizontal'
          className='vacation-box'
        />
        {selectedDates.length > 0 && (
          <div className='text-center vacation-text'>
             From: {selectedDates[0].startDate.toDateString()}<br /> 
             To: {selectedDates[0].endDate.toDateString()}<br />
            <Button className='mt-1 ps-3 pe-3'>Submit</Button>
          </div>
        )}
      </div>
      </div>
    );
  };