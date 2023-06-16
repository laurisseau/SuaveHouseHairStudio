import { useState, useContext } from 'react';
import { DateRangePicker } from 'react-date-range';
import { format } from 'date-fns';
import Button from 'react-bootstrap/Button';
import 'react-date-range/dist/styles.css'; // Import the default styles
import 'react-date-range/dist/theme/default.css';
import NavbarComp from '../components/NavbarComp';
import axios from 'axios';
import { Store } from "../Store";

export default function VacationScreen() {

  const { state } = useContext(Store);
  const { employeeInfo } = state;

  const [selectedDates, setSelectedDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const handleDateChange = (ranges) => {
    setSelectedDates([ranges.selection]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `/api/vacation/createVacation/${employeeInfo._id}`,{
        startDate: format(selectedDates[0].startDate, 'yyyy-MM-dd'),
        endDate: format(selectedDates[0].endDate, 'yyyy-MM-dd')
      }
        //,{
        //  headers: { Authorization: `Bearer ${employeeInfo.token}` },
        //}
      );
      console.log(data)
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <NavbarComp color="dark" />
      <div className="vacation-container mt-5 mb-5">
        <DateRangePicker
          ranges={selectedDates}
          onChange={handleDateChange}
          months={2}
          direction="horizontal"
          className="vacation-box"
        />
        <form onSubmit={submitHandler}>
        {selectedDates.length > 0 && (
          <div className="text-center vacation-text">
            From: {selectedDates[0].startDate.toDateString()}
            <br />
            To: {selectedDates[0].endDate.toDateString()}
            <br />
            <Button type="submit" className="mt-1 ps-3 pe-3">Submit</Button>
          </div>
        )}
        </form>
      </div>
    </div>
  );
}

// for ui so users can read the date clearly // selectedDates[0].endDate.toDateString()
