import mongoose, { Schema, model } from "mongoose";

const pageSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Draft", "Published"], // Enum to specify the possible types
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Page", pageSchema);
