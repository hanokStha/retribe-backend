import { Schema, model } from "mongoose";

const conditionSchema = new Schema(
  {
    condition: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Condition", conditionSchema);
