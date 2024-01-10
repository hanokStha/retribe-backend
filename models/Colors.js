// models/Colors.js
import { Schema, model } from "mongoose";

const colorSchema = new Schema(
  {
    colorCode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Colors", colorSchema);
