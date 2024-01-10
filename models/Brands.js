import { Schema, model } from "mongoose";

const brandSchema = new Schema(
  {
    brandName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Brands", brandSchema);
