import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path"
import userRoutes from "./Routes/userRoutes.js";
import employeeRoutes from "./Routes/employeeRoutes.js";
import appointmentRoutes from "./Routes/appointmentRoutes.js";
import paymentRouter from "./Routes/paymentRoutes.js";
import {errorController} from "./Controller/errorController.js"

const app = express();



app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/appointment", appointmentRoutes); 
app.use("/api", paymentRouter)

const __dirname = path.resolve()

//console.log(__dirname)
app.use(express.static(path.join(__dirname, '/frontend/build')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
})
app.use(errorController)


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});


