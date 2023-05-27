import expressAsyncHandler from 'express-async-handler';
import Vacations from '../Models/vacationModel.js';
import Employee from '../Models/employeeModel.js';


export const createVacation = expressAsyncHandler(async (req, res) => {
  
  //let vacationArr = findVacation.vacations;
  const Vacations = await Vacations.create(req.body)
  console.log(Vacations)
  //const findVacation = await Employee.findById(req.params.id);
/*
  const vacation = await Employee.findByIdAndUpdate(req.params.id, {
    vacations: vacationArr.push({
      day: req.body.day,
      month: req.body.month,
      dayName: req.body.dayName,
    }),
  });

  vacationArr.push({
    day: req.body.day,
    month: req.body.month,
    dayName: req.body.dayName,
  })
*/
  res.send('saved');
 // console.log(vacationArr);
 //const test = await vacationArr.save()
  //console.log(test)
});

export const employeeVacation = expressAsyncHandler(async (req, res) => {
  const findVacation = await Vacations.find({ employee: req.params.id });

  res.send(findVacation);
});
