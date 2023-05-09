import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config({ path: "config.env" });
//const validator = require('validator')

const employeeSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      require: [true, "A firstname is required"],
    },

    lastname: {
      type: String,
      require: [true, "A lastname is required"],
    },

    email: {
      type: String,
      require: [true, "A email is required"],
    },

    number: {
      type: String,
      require: [true, "A phone Number is required"],
    },

    position: {
      type: String,
      enum: ["Hairstylist", "Barber"],
      require: [true, "A job title is required"],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    schedule: [],

    appointment: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    publishableKey: {
      type: String,
      require: [true, "A publishable key is required"], // test
    },

    secretKey: {
      type: String,
      require: [true, "A key is required"], // test
    },

    iv: {
      type: String,
    },

    password: { type: String, required: true },
    confirmPassword: {
      type: String,
      required: [true, "you need to confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "passwords are not the same",
      },
    },
    isEmployee: {
      type: String,
      default: "Employee",
      enum: ["Employee", "Admin"],
      required: true,
    },
    passwordChangedAt: Date,
    PasswordResetToken: String,
    passwordResetExpires: Date,

    image: {
      type: String,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;

  next();
});

//------------------------------------------

employeeSchema.pre("save", async function (next) {
  if (!this.isModified("key")) return next();

  const algorithm = "aes-256-cbc";
  const secretKey = process.env.ENCRYPT_AND_DECRYPT_KEY;
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encryptedData = cipher.update(this.key, "utf-8", "hex");
  encryptedData += cipher.final("hex");
  const base64data = Buffer.from(iv, "binary").toString("base64");

  this.key = encryptedData;
  this.iv = base64data;

  next();
});

//------------------------------------------

employeeSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.PasswordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

employeeSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  // the password changed at has to be brought back one second becuse
  // the token sometimes saves 2nd
  // we want token created after the password is changed
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
