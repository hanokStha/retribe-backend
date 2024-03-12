// models/Coupon.js
import mongoose, { Schema, model } from "mongoose";

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    active: {
      type: Boolean,
    },
    discount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Coupons", couponSchema);
