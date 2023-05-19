import expressAsyncHandler from 'express-async-handler';
import Vacations from '../Models/vacationModel.js';

export const createVacation = expressAsyncHandler(async (req, res) => {

    const vacation = await Vacations.create(req.body)

    res.send(vacation)
});


export const employeeVacation = expressAsyncHandler(async( req, res) => {
    
    const findVacation = await Vacations.find({employee: req.params.id})

    res.send(findVacation)
})