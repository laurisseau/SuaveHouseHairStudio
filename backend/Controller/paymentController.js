import stripe from "stripe";
import crypto from "crypto";
import dotenv from "dotenv";
import schedule from "node-schedule";
import expressAsyncHandler from "express-async-handler";
import { sendInvoice } from "../sendEmail.js";
import Appointments from "../Models/appointmentModel.js";
dotenv.config({ path: "config.env" });

export const paymentIntent = async (req, res) => {
  try {
    const secretKey = process.env.ENCRYPT_AND_DECRYPT_KEY;
    const iv = req.body.iv;
    const key = req.body.key;

    const algorithm = "aes-256-cbc";
    const origionalData = Buffer.from(iv, "base64");

    const decipher = crypto.createDecipheriv(
      algorithm,
      secretKey,
      origionalData
    );
    let decryptedData = decipher.update(key, "hex", "utf-8");

    decryptedData += decipher.final("utf8");

    const paymentIntent = await stripe(decryptedData).paymentIntents.create({
      amount: req.body.amount,
      currency: "usd",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    console.log(e);
  }
};



// sum that will be used later to add cut prices
let sum = 0;

// cant be more than this number -- current day in miliseconds
const today = Date.now();

// cant be less than this number -- past 7 days in miliseconds
const LastSevenDays = new Date() - 7 * 60 * 60 * 24 * 1000;

const clientPayment = () => {
  Appointments.find(expressAsyncHandler(async (err, docs) => {
    const docsLength = docs.length;

    for (let i = 0; i < docsLength; i++) {
      // give the time appointments were made
      let getDate = new Date(docs[i].createdAt);
      // converting the appintment dates to miliseconds
      let date = getDate.getTime();

      if (date < today && date > LastSevenDays) {
        // turn cut price into an int by putting plus first
        let price = +docs[i].cutPrice;
        sum += price;
      }
    }
    // get sum of all the cuts in the past week and take 5% out
    sum = sum * .05

    //before sending email make the price readable
    var str = Math.round((Math.abs(sum)))/100;
  
    sendInvoice(str)
  }));
};

// payments going to my account / send invoice email
// at 9:00am on monday
schedule.scheduleJob('0 9 * * MON', () => {
  clientPayment()
});
