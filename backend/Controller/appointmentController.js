import Appointments from "../Models/appointmentModel.js";
import Employee from "../Models/employeeModel.js";
import expressAsyncHandler from "express-async-handler";
import schedule from "node-schedule";

export const createAppointment = expressAsyncHandler(async (req, res) => {
  const appointment = await (
    await Appointments.create(req.body)
  ).populate("employee");

  const schedule = appointment.employee.schedule;
  const appointmentDay = appointment.day;
  const appointmentDayName = appointment.dayName;
  const appointmentTime = appointment.time;

  for (let i = 0; i < schedule.length; i++) {
    if (schedule[i].day == appointmentDay) {
      const sch = schedule[i];
      const schArr = sch[appointmentDayName];
      const index = schArr.indexOf(`${appointmentTime}`);
      schArr.splice(index, 1);
    }
  }

  //console.log(schedule)

  const updateEmployee = await Employee.findByIdAndUpdate(
    appointment.employee._id,
    { schedule: schedule }
  );

  //console.log(updateEmployee.schedule)

  res.send(schedule);
});

export const getAppointment = expressAsyncHandler(async (req, res) => {
  const appointment = await Appointments.find({
    user: req.user._id,
    active: true,
  }).populate("employee");

  res.send(appointment);
});

export const getAppointmentId = expressAsyncHandler(async (req, res) => {
  const appointment = await Appointments.findById(req.params.id).populate(
    "employee"
  );
  res.send(appointment);
});

export const updatePaidAppointment = expressAsyncHandler(async (req, res) => {
  const appointment = await Appointments.findByIdAndUpdate(req.params.id, {
    paid: "Paid",
  });
  res.send(appointment);
});

export const getEmployeeAppointment = expressAsyncHandler(async (req, res) => {
  const appointment = await Appointments.find({
    employee: req.employee._id,
    active: true,
  }).populate("user");
  res.send(appointment);
});

const date = new Date();

const monthNames = [
  "January",
  "February",
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

let currDay = date.getDate();
let currMonth = monthNames[date.getMonth()];

const checkIfAppointmentsArePastDate = () => {
  Appointments.find(async (err, docs) => {
    const docsLength = docs.length;

    for (let i = 0; i < docsLength; i++) {
      if (docs[i].active === true) {
        if (currDay === +docs[i].day + 1 && currMonth === docs[i].month) {
          await Appointments.findByIdAndUpdate(docs[i]._id, { active: false });
        }
      }
    }
  });
};

schedule.scheduleJob('0 0 * * 1-7', () => {
  checkIfAppointmentsArePastDate()
});
