import express from 'express';
import { createVacation } from '../Controller/vacationController.js';
//import { isAuth, isAuthEmployee } from "../utils.js";

const appointmentRouter = express.Router();

appointmentRouter.post('/createVacation', createVacation);

export default appointmentRouter;
