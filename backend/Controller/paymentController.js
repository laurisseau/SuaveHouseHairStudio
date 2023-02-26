import stripe from "stripe";
//import expressAsyncHandler from "express-async-handler";
import crypto from "crypto";
import dotenv from "dotenv";
import expressAsyncHandler from "express-async-handler";
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
