import express from "express";
import {
  createAppointment,
  getAppointment,
  getAppointmentId,
  updatePaidAppointment,
  getEmployeeAppointment,
  spliceAppointment
} from "../Controller/appointmentController.js";
import { isAuth, isAuthEmployee } from "../utils.js";

const appointmentRouter = express.Router();

appointmentRouter.get(
  "/getEmployeeAppointment",
  isAuthEmployee,
  getEmployeeAppointment
);

appointmentRouter.get("/getAppointment", isAuth, getAppointment);

appointmentRouter.get("/getAppointment/:id", isAuth, getAppointmentId);
appointmentRouter.put("/updatePaidAppointment/:id", updatePaidAppointment);
appointmentRouter.put("/spliceAppointment/:id", spliceAppointment);
appointmentRouter.post("/createAppointment", createAppointment);

export default appointmentRouter;
