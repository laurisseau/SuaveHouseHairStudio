import express from 'express';
import {createEmployee, getEmployee, getEmployeeId, deleteEmployeeById, signin, updateEmployeeById, employeeForgotPassword, resetEmployeePassword,
uploadUserPhoto, resizeUserPhoto} from '../controller/employeeController.js'
import { isAuthEmployee } from "../utils.js";

const employeeRouter = express.Router();



employeeRouter.post('/signin', signin);

employeeRouter.post("/forgotPassword", employeeForgotPassword);

employeeRouter.patch("/resetPassword/:token", resetEmployeePassword);

employeeRouter.get('/getEmployee', getEmployee)

employeeRouter.get('/getEmployeeId/:id', getEmployeeId)

employeeRouter.delete('/deleteEmployeeById/:id', deleteEmployeeById)

employeeRouter.post('/createEmployee', isAuthEmployee, uploadUserPhoto,  resizeUserPhoto, createEmployee);

employeeRouter.patch('/updateEmployeeById/:id', isAuthEmployee, updateEmployeeById);

export default employeeRouter;