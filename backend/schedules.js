import Appointments from './Models/appointmentModel.js';
import Vacations from './Models/vacationModel.js';
import Employee from './Models/employeeModel.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { sendInvoice } from './sendEmail.js';
dotenv.config();

let dayTime = [
  '8:00am',
  '8:30am',
  '9:00am',
  '9:30am',
  '10:30am',
  '11:00am',
  '11:30am',
  '12:00pm',
  '12:30pm',
  '1:00pm',
  '1:30pm',
  '2:00pm',
  '2:30pm',
  '3:00pm',
  '3:30pm',
  '4:00pm',
  '4:30pm',
  '5:00pm',
  '5:30pm',
  '6:00pm',
  '6:30pm',
  '7:30pm',
];

let satTime = [
  '9:00am',
  '9:30am',
  '10:30am',
  '11:00am',
  '11:30am',
  '12:00pm',
  '12:30pm',
  '1:00pm',
  '1:30pm',
  '2:00pm',
  '2:30pm',
  '3:00pm',
  '3:30pm',
  '4:00pm',
  '4:30pm',
  '5:00pm',
];

const monthNames = [
  'January',
  'Febuary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const daysInMonth = {
  0: 31,
  1: 28,
  2: 31,
  3: 30,
  4: 31,
  5: 30,
  6: 31,
  7: 31,
  8: 30,
  9: 31,
  10: 30,
  11: 31,
};
let dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
let limit = 7;

var utcDate = new Date();
//utc time is ahead of florida time by 5 hours
var numberOfMlSeconds = utcDate.getTime();
var negMillisecondsByFiveHours = -5 * 60 * 60 * 1000;
// florida date and time
var date = new Date(numberOfMlSeconds + negMillisecondsByFiveHours);

let currMonth = date.getMonth();
//let appointmentCurrMonth = monthNames[date.getMonth()];
let currDay = date.getDate();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

//  update employee schedule daily
const updatedEmployeeScheduleDaily = () => {
  Employee.find(async (err, docs) => {
    const docsLength = docs.length;
    for (let i = 0; i < docsLength; i++) {
      const updatedSchedule = docs[i].schedule;
      const vactionDays = docs[i].vacations;

      updatedSchedule.shift();

      const currDayNameArr = [];
      const currDayArr = [];

      for (let i = 0; i < updatedSchedule.length; i++) {
        //dayNames
        const objKeys = Object.keys(updatedSchedule[i]);
        const objKeyDay = objKeys[0];
        currDayNameArr.push(objKeyDay);
        //day
        currDayArr.push(updatedSchedule[i].day);
      }

      const getLastDayOfLimit = currDayNameArr[currDayNameArr.length - 1];
      const getLastNum = currDayArr[currDayArr.length - 1];
      let lastDayIndex = dayNames.indexOf(getLastDayOfLimit);

      if (limit - 1 === lastDayIndex) {
        lastDayIndex = -1;
      }

      let addedDay = getLastNum + 1;
      //
      let currDataMonth = monthNames.indexOf(docs[i].schedule[5].month);

      // goes to the next month if december starts months over

      if (getLastNum === daysInMonth[currDataMonth] && currDataMonth === 11) {
        addedDay = 1;
        currDataMonth = 0;
      } else if (getLastNum === daysInMonth[currDataMonth]) {
        addedDay = 1;
        currDataMonth = currDataMonth + 1;
      }

      let month = monthNames[currDataMonth];

      let addingMec = lastDayIndex + 1;

      if (addingMec === 7) {
        addingMec = 0;
      }

      let emptyObjDayName = dayNames[addingMec];

      let emptyObj = {};

      updatedSchedule.push(emptyObj);

      if (emptyObjDayName === 'Sun') {
        emptyObj[emptyObjDayName] = [];
        emptyObj['day'] = addedDay;
        emptyObj['month'] = month;
      } else if (emptyObjDayName === 'Sat') {
        emptyObj[emptyObjDayName] = satTime;
        emptyObj['day'] = addedDay;
        emptyObj['month'] = month;
      } else {
        emptyObj[emptyObjDayName] = dayTime;
        emptyObj['day'] = addedDay;
        emptyObj['month'] = month;

        for (let i = 0; i < vactionDays.length; i++) {
          if (
            vactionDays[i].day == emptyObj['day'] &&
            vactionDays[i].month == emptyObj['month']
          ) {
          //console.log(`this person has vacation on the ${vactionDays[i].day} of ${vactionDays[i].month}`)
            emptyObj[emptyObjDayName] = [];
          }
        }
      }

      await Employee.findByIdAndUpdate(docs[i]._id, {
        schedule: updatedSchedule,
      });
    }
  });
};

// check if console.log() called for this function ex: node backend/schedules.js updatedEmployeeScheduleDaily
if (process.argv[2] === 'updatedEmployeeScheduleDaily') {
  updatedEmployeeScheduleDaily();
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------

// need to add year++ to updateemployee schedule and to creating employee schedule

const checkIfAppointmentsArePastDate = () => {
  Appointments.find(async (err, docs) => {
    const docsLength = docs.length;

    for (let i = 0; i < docsLength; i++) {
      const appointmentMonth = monthNames.indexOf(docs[i].month);

      //if current month is greater than the appointment month then
      // appointmentday = 0
      if (currMonth > appointmentMonth) {
        docs[i].day = 0;
      }

      // if the current day is larger than any appaointment date
      // the dates under the current date will turn inactive
      if (currDay > docs[i].day) {
        await Appointments.findByIdAndUpdate(docs[i]._id, { active: false });
      }
    }
  });
};

// check if console.log() called for this function ex: node backend/schedules.js checkIfAppointmentsArePastDate
if (process.argv[2] === 'checkIfAppointmentsArePastDate') {
  checkIfAppointmentsArePastDate();
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------

// sum that will be used later to add cut prices
let sum = 0;

// cant be more than this number -- current day in miliseconds
const today = Date.now();

// cant be less than this number -- past 7 days in miliseconds
const LastSevenDays = new Date() - 7 * 60 * 60 * 24 * 1000;

const clientPayment = () => {
  Appointments.find(async (err, docs) => {
    const docsLength = docs.length;

    for (let i = 0; i < docsLength; i++) {
      // give the time appointments were made
      let getDate = new Date(docs[i].createdAt);
      // converting the appintment dates to miliseconds
      let date = getDate.getTime();

      if (date < today && date > LastSevenDays) {
        // turn cut price into an int by putting plus first
        let price = +docs[i].cutPrice;
        sum += price;
      }
    }
    // get sum of all the cuts in the past week and take 5% out
    sum = sum * 0.05;

    //before sending email make the price readable
    var str = Math.round(Math.abs(sum)) / 100;

    sendInvoice(str);
  });
};

// check if console.log() called for this function ex: node backend/schedules.js clientPayment
if (process.argv[2] === 'clientPayment') {
  clientPayment();
}
