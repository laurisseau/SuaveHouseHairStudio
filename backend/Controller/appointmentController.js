import Appointments from "../Models/appointmentModel.js";
import Employee from "../Models/employeeModel.js";
import expressAsyncHandler from "express-async-handler";

export const createAppointment = expressAsyncHandler(async (req, res) => {
  const createdAppointments = await Appointments.find({
    time: req.body.time,
    employee: req.body.employee,
    month: req.body.month,
    day: req.body.day,
  });

  for (const appointments of createdAppointments) {
    if (appointments) {
      res
        .status(404)
        .json({
          message: "This appointment is already taken refresh the page.",
        });
    }
  }

  
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

  console.log(schedule)

  const updateEmployee = await Employee.findByIdAndUpdate(
    appointment.employee._id,
    { schedule: schedule }
  );

  //console.log(updateEmployee.schedule)

  res.send(createdAppointments);
});


export const spliceAppointment = expressAsyncHandler(async(req, res) => {

  //const findUserAppointment = await Appointments.findById(req.params.id);

  /*
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
*/

//console.log(findUserAppointment)
//res.send(findUserAppointment);
res.send('hi')
console.log('hi')
})


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
  const updatePaidAppointment = await Appointments.findByIdAndUpdate(req.params.id, {
    paid: "Paid",
  });





  res.send(updatePaidAppointment);
});

export const getEmployeeAppointment = expressAsyncHandler(async (req, res) => {
  const appointment = await Appointments.find({
    employee: req.employee._id,
    active: true,
  }).populate("user");
  res.send(appointment);
});

