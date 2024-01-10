import mongoose, { Schema, model } from "mongoose";

const settingsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["List", "Image", "Text"],
      required: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    },
  },
  {
    timestamps: true,
  }
);

export default model("Settings", settingsSchema);
