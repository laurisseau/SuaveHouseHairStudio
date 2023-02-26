import express from "express";
import { paymentIntent } from "../Controller/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-payment-intent", paymentIntent);

export default paymentRouter;
