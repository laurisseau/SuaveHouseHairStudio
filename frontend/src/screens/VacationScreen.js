import { useState, useContext, useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';
import { format } from 'date-fns';
import Button from 'react-bootstrap/Button';
import 'react-date-range/dist/styles.css'; // Import the default styles
import 'react-date-range/dist/theme/default.css';
import NavbarComp from '../components/NavbarComp';
import axios from 'axios';
import LoadingBoxComp from '../components/LoadingBoxComp';
import { Store } from '../Store';

export default function VacationScreen() {
  const { state } = useContext(Store);
  const { employeeInfo } = state;
  const [seeVacations, setSeeVacations] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/vacation/employeeVacation/${employeeInfo._id}`
          //, {
          //  headers: { Authorization: `Bearer ${userInfo.token}` },
          //}
        );
        setSeeVacations(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [employeeInfo._id]);

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
    //e.preventDefault();
    try {
      const { data } = await axios.post(
        `/api/vacation/createVacation/${employeeInfo._id}`,
        {
          startDate: format(selectedDates[0].startDate, 'yyyy-MM-dd'),
          endDate: format(selectedDates[0].endDate, 'yyyy-MM-dd'),
        }
        //,{
        //  headers: { Authorization: `Bearer ${employeeInfo.token}` },
        //}
      );
      console.log(data);
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
              <Button type="submit" className="mt-1 ps-3 pe-3">
                Submit
              </Button>
            </div>
          )}
        </form>

        <h1 className="mt-3">Vacation Days</h1>
        {loading ? (
          <div className="mt-5">
            <LoadingBoxComp />{' '}
          </div>
        ) : (
          seeVacations.map((dates, index) => (
            <p key={index}>
              {dates.month} - {dates.day}
            </p>
          ))
        )}
      </div>
    </div>
  );
}

// for ui so users can read the date clearly // selectedDates[0].endDate.toDateString()
