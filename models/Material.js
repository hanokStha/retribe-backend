import { Schema, model } from "mongoose";

const materialSchema = new Schema(
  {
    material: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Material", materialSchema);
