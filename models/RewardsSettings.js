import mongoose, { Schema, model } from "mongoose";

const coupanSchema = new Schema(
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

export default model("Page", pageSchema);
