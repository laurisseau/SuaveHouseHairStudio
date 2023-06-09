import dotenv from 'dotenv';
import Employee from '../Models/employeeModel.js';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateEmployeeToken } from '../utils.js';
import { sendEmail } from '../sendEmail.js';

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import multer from 'multer';
import sharp from 'sharp';

dotenv.config({ path: '../config.env' });

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

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

let dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
let employeeSchedule = [];
let scheduleObj = {};
let limit = 7;

var utcDate = new Date();
//utc time is ahead of florida time by 5 hours
var numberOfMlSeconds = utcDate.getTime();
var negMillisecondsByFiveHours = -5 * 60 * 60 * 1000;
// florida date and time
var date = new Date(numberOfMlSeconds + negMillisecondsByFiveHours);

let currDay = date.getDay();
let currDate = date.getDate();
let currMonth = date.getMonth();
let currentMonthDays = daysInMonth[currMonth];

let year = date.getFullYear();
let length = currDate + limit;
let counter = Math.trunc(limit / 7);

//-------------------------------UPLOADING IMAGES---------------------------------------*/

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single('image');

export const resizeUserPhoto = expressAsyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const randomImageName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString('hex');

  const buffer = await sharp(req.file.buffer).resize(350, 475).toBuffer();

  req.file.filename = randomImageName();

  const params = {
    Bucket: bucketName,
    Key: req.file.filename,
    Body: buffer,
    ContentType: req.file.mimetype,
  };

  const command = new PutObjectCommand(params);

  await s3.send(command);

  next();
});

export const createEmployee = expressAsyncHandler(async (req, res) => {
  let dayTime = [];
  let satTime = [];
  let stylistMenu = [];

  if (req.body.position === 'Barber') {
    dayTime = [
      '8:00am',
      '9:00am',
      '10:00am',
      '11:00am',
      '12:00pm',
      '1:00pm',
      '2:00pm',
      '3:00pm',
      '4:00pm',
      '5:00pm',
      '6:00pm',
      '7:00pm',
    ];

    satTime = [
      '9:00am',
      '10:00am',
      '11:00am',
      '12:00pm',
      '1:00pm',
      '2:00pm',
      '3:00pm',
      '4:00pm',
      '5:00pm',
    ];

    stylistMenu = [
      { listName: 'Men Haircut & Beard', price: 3000 },
      {
        listName: 'Kids Cuts(under 12 years old)',
        price: 2000,
      },
      {
        listName: 'Men Haircut/eyebrows(No Facial)',
        price: 2500,
      },
      {
        listName: 'Eyebrows',
        price: 500,
      },
      {
        listName: 'Shape Up & Beard',
        price: 1800,
      },
      {
        listName: 'Shape Up(No Facial)',
        price: 1000,
      },
    ];
  } else if (req.body.position === 'Hairstylist') {
    // need to talk to hairstylist bout the times
    dayTime = ['8:00am', '8:15am', '8:30am', '8:45am', '9:00am'];

    satTime = ['9:00am', '9:15am', '9:30am'];
    stylistMenu = [{listName: 'consult', price: 7500}]
  }

  for (counter; counter > 0; counter--) {
    for (let i = 0; i < dayNames.length; i++) {
      //loops through obj and add daytime to every day
      scheduleObj[dayNames[currDay + i]] = dayTime;

      // obj days become undefined so replace the
      //undefined with the actual days
      if (scheduleObj[undefined]) {
        let arr = [0, 6, 5, 4, 3, 2, 1];
        delete scheduleObj[undefined];
        let test = i - arr[currDay];
        scheduleObj[dayNames[test]] = dayTime;
      }

      // sun day is an off day
      if (scheduleObj.Sun) {
        scheduleObj[dayNames[0]] = [];
      }

      // sat day cut hours
      if (scheduleObj.Sat) {
        scheduleObj[dayNames[6]] = satTime;
      }

      scheduleObj['day'] = currDate++;
      scheduleObj['month'] = monthNames[currMonth];

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
      scheduleObj['day'] = currDate++;
      scheduleObj['month'] = monthNames[currMonth];
      if (currDate > currentMonthDays) {
        currDate = 1;
        currMonth++;
      }

      employeeSchedule.push(scheduleObj);
      scheduleObj = {};
    }
  }

  const newEmployee = new Employee({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    publishableKey: req.body.publishableKey,
    secretKey: req.body.secretKey,
    iv: req.body.iv,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    number: req.body.number,
    position: req.body.position,
    isEmployee: req.body.isEmployee,
    menu: stylistMenu,
    schedule: employeeSchedule,
    image: req.file.filename,
  });

  const employee = await newEmployee.save();

  res.send(employee);
});

export const getEmployee = async (req, res) => {
  const findEmployee = await Employee.find();

  for (const employee of findEmployee) {
    const getObjectParams = {
      Bucket: bucketName,
      Key: employee.image,
    };

    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 30 });

    employee.image = url;
  }

  res.send(findEmployee);
};

export const getEmployeeId = expressAsyncHandler(async (req, res) => {
  const findEmployeeId = await Employee.findById(req.params.id);

  res.send(findEmployeeId);
});

export const deleteEmployeeById = expressAsyncHandler(async (req, res) => {
  const deleteEmployeeById = await Employee.findByIdAndDelete(req.params.id);

  const params = {
    Bucket: bucketName,
    Key: deleteEmployeeById.image,
  };

  const command = new DeleteObjectCommand(params);

  await s3.send(command);

  res.send(deleteEmployeeById);
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
  res.status(401).send({ message: 'Invalid email or password' });
});

export const employeeForgotPassword = expressAsyncHandler(
  async (req, res, next) => {
    const employee = await Employee.findOne({ email: req.body.email });

    if (!employee) {
      return next(
        res
          .status(404)
          .send({ message: 'there is noone with that email Address' })
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
        'x-forwarded-host'
      )}/resetEmployeePassword/${resetToken}`;

      sendEmail(req.body.email, resetURL);

      res.send({ message: 'token sent to email' });
    } catch (err) {
      employee.createPasswordResetToken = undefined;
      employee.passwordResetExpires = undefined;
      await employee.save({ validateBeforeSave: false });

      console.log(err);

      return next(
        res.status(500).send({ message: 'there was an error sending an email' })
      );
    }
  }
);

export const resetEmployeePassword = expressAsyncHandler(
  async (req, res, next) => {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const employee = await Employee.findOne({
      createPasswordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!employee) {
      return next(
        res.status(400).send({ message: 'time to update password expired' })
      );
    }

    employee.password = req.body.password;
    employee.confirmPassword = req.body.confirmPassword;
    employee.createPasswordResetToken = undefined;
    employee.passwordResetExpires = undefined;

    await employee.save();

    res.send({ message: 'password Changed' });
  }
);
