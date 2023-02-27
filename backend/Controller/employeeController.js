import schedule from "node-schedule";
import Employee from "../Models/employeeModel.js";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import path from "path"
import { generateEmployeeToken } from "../utils.js";
import { sendEmail } from "../sendEmail.js";
import multer from "multer";
import sharp from "sharp";

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
  "5:00pm"
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

let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let employeeSchedule = [];
let scheduleObj = {};
let limit = 7;

let date = new Date();
let currDay = date.getDay();
let currDate = date.getDate();
let currMonth = date.getMonth();
let currentMonthDays = daysInMonth[currMonth];

let year = date.getFullYear();
let length = currDate + limit;
//-----------------------------------------------
let counter = Math.trunc(limit / 7);


//need if statement for new employees

for (counter; counter > 0; counter--) {
  for (let i = 0; i < dayNames.length; i++) {
    //loops through obj and add daytime to every day
    scheduleObj[dayNames[currDay + i]] = dayTime;

    // sun day is an off day
  if(scheduleObj.Sun){
    scheduleObj[dayNames[0]] = []
  }

  // sat day cut hours
  if(scheduleObj.Sat){
    scheduleObj[dayNames[6]] = satTime
  }
    
    if (scheduleObj[undefined]) {
      let arr = [0, 6, 5, 4, 3, 2, 1];
      delete scheduleObj[undefined];
      let test = i - arr[currDay];
      scheduleObj[dayNames[test]] = dayTime;
    }
    scheduleObj["day"] = currDate++;
    scheduleObj["month"] = monthNames[currMonth];
    if (currDate > currentMonthDays) {
      currDate = 1;
      currMonth++;
    }
    employeeSchedule.push(scheduleObj);
    scheduleObj = {};
  }
}

let count = Math.trunc(limit / 7);
let rem = limit - count * 7;

if (rem > 0) {
  for (let j = currDay; j < currDay + rem; j++) {
    scheduleObj[dayNames[j]] = dayTime;
    scheduleObj["day"] = currDate++;
    scheduleObj["month"] = monthNames[currMonth];
    if (currDate > currentMonthDays) {
      currDate = 1;
      currMonth++;
    }
    employeeSchedule.push(scheduleObj);
    scheduleObj = {};
  }
}
//console.log(employeeSchedule)
//-------------------------------UPLOADING IMAGES---------------------------------------*/
const __dirname = path.resolve()

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single("image");

export const resizeUserPhoto = expressAsyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  
  const name = req.file.originalname.split(".");
  
  req.file.filename = `employee-${name[0]}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(350, 475)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    //.toFile(`../frontend/src/img/${req.file.filename}`);
    .toFile(path.join(__dirname, `../frontend/src/img/${req.file.filename}`))

    
  next();
});



//console.log(__dirname, 'path')



export const createEmployee = expressAsyncHandler(async (req, res) => {
  const newEmployee = new Employee({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    publishableKey: req.body.publishableKey,
    key: req.body.key,
    iv: req.body.iv,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    number: req.body.number,
    position: req.body.position,
    isEmployee: req.body.isEmployee,
    schedule: employeeSchedule,
    image: req.file.filename,
  });

  const employee = await newEmployee.save();

  res.send(employee);
});

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

      if(emptyObjDayName === 'Sun'){
        emptyObj[emptyObjDayName] = [];
        emptyObj["day"] = addedDay;
        emptyObj["month"] = month;
      }else if(emptyObjDayName === 'Sat'){
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

// update schedule by the day
schedule.scheduleJob('0 1 * * *', () => {
  updatedEmployeeScheduleDaily()
});

export const getEmployee = expressAsyncHandler(async (req, res) => {
  const findEmployee = await Employee.find();

  res.send(findEmployee);
});

export const getEmployeeId = expressAsyncHandler(async (req, res) => {
  const findEmployeeId = await Employee.findById(req.params.id);

  res.send(findEmployeeId);
});

export const deleteEmployeeById = expressAsyncHandler(async (req, res) => {
  try {
    const deleteEmployeeById = await Employee.findByIdAndDelete(req.params.id);

    res.send(deleteEmployeeById);
  } catch (err) {
    res.send({ message: err });
  }
});

export const updateEmployeeById = expressAsyncHandler(async (req, res) => {
  try {
    const update = await Employee.findByIdAndUpdate(req.params.id, req.body);
    res.send(update);
  } catch (err) {
    res.send(err);
  }
});

export const signin = expressAsyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ email: req.body.email });

  if (employee) {
    if (bcrypt.compareSync(req.body.password, employee.password)) {
      res.send({
        _id: employee._id,
        firstname: employee.firstname,
        lastname: employee.lastname,
        email: employee.email,
        isEmployee: employee.isEmployee,
        token: generateEmployeeToken(employee),
      });
      return;
    }
  }
  res.status(401).send({ message: "Invalid email or password" });
});

export const employeeForgotPassword = expressAsyncHandler(
  async (req, res, next) => {
    const employee = await Employee.findOne({ email: req.body.email });

    if (!employee) {
      return next(
        res
          .status(404)
          .send({ message: "there is noone with that email Address" })
      );
    }

    const resetToken = employee.createPasswordResetToken();
    //console.log(employee, 'employee')
    //console.log(resetToken, 'resetToken')

    await employee.save({ validateBeforeSave: false });

    try {
      // const resetURL = `${req.protocol}://${req.get(
      //   "host"
      // )}/resetPassword/${resetToken}`;

      const resetURL = `${req.protocol}://${req.get(
        "x-forwarded-host"
      )}/resetEmployeePassword/${resetToken}`;

      sendEmail(req.body.email, resetURL);

      res.send({ message: "token sent to email" });
    } catch (err) {
      employee.createPasswordResetToken = undefined;
      employee.passwordResetExpires = undefined;
      await employee.save({ validateBeforeSave: false });

      console.log(err);

      return next(
        res.status(500).send({ message: "there was an error sending an email" })
      );
    }
  }
);

export const resetEmployeePassword = expressAsyncHandler(
  async (req, res, next) => {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const employee = await Employee.findOne({
      createPasswordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!employee) {
      return next(
        res.status(400).send({ message: "time to update password expired" })
      );
    }

    employee.password = req.body.password;
    employee.confirmPassword = req.body.confirmPassword;
    employee.createPasswordResetToken = undefined;
    employee.passwordResetExpires = undefined;

    await employee.save();

    res.send({ message: "password Changed" });
  }
);
