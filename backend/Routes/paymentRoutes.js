import express from "express";
import { paymentIntent } from "../controller/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-payment-intent", paymentIntent);

export default paymentRouter;
