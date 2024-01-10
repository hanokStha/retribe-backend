import { Schema, model } from "mongoose";

const sizeSchema = new Schema(
  {
    size: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Size", sizeSchema);
