import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    },
    default_image: {
      type: String,
    },
    coverimage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    },
    address: {
      type: String,
    },
    birthday: {
      type: Date,
    },
    gender: {
      type: String,
    },
    about: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    favBrand: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AttributeValue",
      },
    ],
    favSize: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AttributeValue",
    },
    shoeSize: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AttributeValue",
    },
    otp: {
      type: String,
    },
    otpExpiration: {
      type: Date,
    },
    potp: {
      type: String,
    },
    potpExpiration: {
      type: Date,
    },
    holidayStart: {
      type: Date,
    },
    holidayEnd: {
      type: Date,
    },
    holiday: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);
 
export default model("Users", userSchema);
