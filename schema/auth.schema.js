const { Schema, model } = require("mongoose");

const Auth = new Schema({
  username: {
    type: String,
    required: [true, "Full name bolishi shart"],
    set: (val) => val.trim(),
    minLength: [3, "Kamida 3 ta harf bolsin"],
    maxLength: 50,
    match: /^[a-zA-Z\s]+$/,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: null
  },
  otp: {
    type: String,
    required: false
  },
  otpTime: {
    type: Number,
    required: false,
  },
  role: {
    type: String,
    default: "user",
    required: true,
    enum: ["user", "admin", "superadmin"]
  },
}, {
  versionKey: false,
  timestamps: true
})

const AuthSchema = model("Auth", Auth)
module.exports = AuthSchema
