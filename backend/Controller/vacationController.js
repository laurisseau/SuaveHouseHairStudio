import expressAsyncHandler from 'express-async-handler';
import Vacations from '../Models/vacationModel.js';
import Employee from '../Models/employeeModel.js';

export const createVacation = expressAsyncHandler(async (req, res) => {

  const findVacation = await Employee.updateOne(
    { _id: req.params.id },
    {
      $push: {
        vacations: {
          day: req.body.day,
          month: req.body.month,
          dayName: req.body.dayName,
        },
      },
    }
  );

  res.send('Vacation Created');
});

export const employeeVacation = expressAsyncHandler(async (req, res) => {
  const findVacation = await Vacations.find({ employee: req.params.id });

  res.send(findVacation);
});
