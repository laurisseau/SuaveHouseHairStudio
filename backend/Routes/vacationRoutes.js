import express from 'express';
import { createVacation, employeeVacation } from '../Controller/vacationController.js';
//import { isAuth, isAuthEmployee } from "../utils.js";

const appointmentRouter = express.Router();

appointmentRouter.put('/createVacation/:id', createVacation);

appointmentRouter.get('/employeeVacation/:id', employeeVacation);



export default appointmentRouter;
