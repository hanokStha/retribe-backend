import { Schema, model } from "mongoose";

const showSizeSchema = new Schema(
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

export default model("ShoeSize", showSizeSchema);
