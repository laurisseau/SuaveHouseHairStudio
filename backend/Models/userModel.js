import mongoose from "mongoose";
import crypto from 'crypto';
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname:{
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    number: {
      type: String,
      required: true,
      unique: true,
    },

    password: { type: String, required: true },
    confirmPassword:{
      type: String,
      required: [true, 'you need to confirm your password'],
      validate: {
          validator: function(el) {
              return el === this.password;
          },
              message: 'passwords are not the same'
          }
  },
    isUser: {
      type: String,
      default: 'user',
      required: true,
    },
    passwordChangedAt: Date,
    PasswordResetToken: String,
    passwordResetExpires: Date
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;

  next()
})

userSchema.methods.createPasswordResetToken = function(){
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.PasswordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
}

userSchema.pre('save', function(next){
  if(!this.isModified('password')|| this.isNew) return next();

  // the password changed at has to be brought back one second becuse
  // the token sometimes saves 2nd
  // we want token created after the password is changed
  this.passwordChangedAt = Date.now() - 1000;
  
  next()

});

const User = mongoose.model("User", userSchema);

export default User;
