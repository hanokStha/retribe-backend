import mongoose, { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
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
    bundleItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Products" }],
    bundleDiscounts: [
      {
        quantity: {
          type: Number,
        },
        discount: {
          type: Number,
        },
      },
    ],
    averageRating: {
      type: String,
    },
    badges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rewards",
      },
    ],
    salesCount: {
      type: Number,
      default: 0,
    },
    purchaseCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(mongoosePaginate);

export default model("Users", userSchema);
