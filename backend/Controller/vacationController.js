import expressAsyncHandler from 'express-async-handler';
import Vacations from '../Models/vacationModel.js';
import Employee from '../Models/employeeModel.js';

export const createVacation = expressAsyncHandler(async (req, res) => {
  let currentDate = new Date(req.body.startDate);

  while (currentDate <= new Date(req.body.endDate)) {
    const newCurrentDate = new Date(currentDate);

    const date = newCurrentDate.toISOString().split('T')[0];

    const month = date.split('-')[1];
    const day = date.split('-')[2];

    await Employee.updateOne(
      { _id: req.params.id },
      {
        $push: {
          vacations: {
            day: day,
            month: month,
          },
        },
      }
    );

    currentDate.setDate(currentDate.getDate() + 1);
  }

  res.send('Vacation Created');
});

export const employeeVacation = expressAsyncHandler(async (req, res) => {
  const findVacation = await Vacations.find({ employee: req.params.id });

  res.send(findVacation);
});
