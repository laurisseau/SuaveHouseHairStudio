import expressAsyncHandler from 'express-async-handler';
import Employee from '../Models/employeeModel.js';


export const createVacation = expressAsyncHandler(async (req, res) => {
  function convertToMonth(monthNumber) {
    const months = [
      'January',
      'February',
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

    const index = parseInt(monthNumber, 10) - 1; // Subtract 1 to match array index

    if (index >= 0 && index < months.length) {
      return months[index];
    } else {
      return 'Invalid month';
    }
  }

  function spliceZero(number) {
    if (number.startsWith('0') && number !== '10') {
      return number.slice(1); // Remove leading zero
    } else {
      return number;
    }
  }

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
            day: spliceZero(day),
            month: convertToMonth(month),
          },
        },
      }
    );

    currentDate.setDate(currentDate.getDate() + 1);
  }

  res.send('Vacation Created');
});

export const employeeVacation = expressAsyncHandler(async (req, res) => {
  const findVacation = await Employee.findById(req.params.id);

  res.send(findVacation.vacations);
});
