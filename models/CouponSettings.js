// models/CouponSetting.js
import { Schema, model } from "mongoose";

const couponSettingsSchema = new Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("CouponSettings", couponSettingsSchema);
