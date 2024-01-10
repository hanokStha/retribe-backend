import { Schema, model } from "mongoose";

const cookiePageSchema = new Schema(
  {
   
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Cookie Page", cookiePageSchema);
