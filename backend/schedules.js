import Employee from "./Models/employeeModel.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

let dayTime = [
  "8:00am",
  "8:30am",
  "9:00am",
  "9:30am",
  "10:30am",
  "11:00am",
  "11:30am",
  "12:00pm",
  "12:30pm",
  "1:00pm",
  "1:30pm",
  "2:00pm",
  "2:30pm",
  "3:00pm",
  "3:30pm",
  "4:00pm",
  "4:30pm",
  "5:00pm",
  "5:30pm",
  "6:00pm",
  "6:30pm",
  "7:30pm",
];

let satTime = [
  "9:00am",
  "9:30am",
  "10:30am",
  "11:00am",
  "11:30am",
  "12:00pm",
  "12:30pm",
  "1:00pm",
  "1:30pm",
  "2:00pm",
  "2:30pm",
  "3:00pm",
  "3:30pm",
  "4:00pm",
  "4:30pm",
  "5:00pm",
];

const monthNames = [
  "January",
  "Febuary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
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
let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let limit = 7;

var utcDate = new Date();
//utc time is ahead of florida time by 5 hours
var numberOfMlSeconds = utcDate.getTime();
var negMillisecondsByFiveHours = -5 * 60 * 60 * 1000;
// florida date and time
var date = new Date(numberOfMlSeconds + negMillisecondsByFiveHours);

let currMonth = date.getMonth();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to db");
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

      if (getLastNum === daysInMonth[currMonth]) {
        addedDay = 1;
        currMonth = currMonth + 1;
      }

      let month = monthNames[currMonth];

      let addingMec = lastDayIndex + 1;

      if (addingMec === 7) {
        addingMec = 0;
      }

      let emptyObjDayName = dayNames[addingMec];

      let emptyObj = {};

      updatedSchedule.push(emptyObj);

      if (emptyObjDayName === "Sun") {
        emptyObj[emptyObjDayName] = [];
        emptyObj["day"] = addedDay;
        emptyObj["month"] = month;
      } else if (emptyObjDayName === "Sat") {
        emptyObj[emptyObjDayName] = satTime;
        emptyObj["day"] = addedDay;
        emptyObj["month"] = month;
      } else {
        emptyObj[emptyObjDayName] = dayTime;
        emptyObj["day"] = addedDay;
        emptyObj["month"] = month;
      }

      //console.log(updatedSchedule)

      await Employee.findByIdAndUpdate(docs[i]._id, {
        schedule: updatedSchedule,
      });

      //console.log(updatedSchedule);
    }
  });
};

// check if console.log() called for this function ex: node schedules.js updatedEmployeeScheduleDaily 
if (process.argv[2] === "updatedEmployeeScheduleDaily") {
  updatedEmployeeScheduleDaily();
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------







