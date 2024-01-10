import mongoose, { Schema, model } from "mongoose";

const serviceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media", // Reference path for dynamic association
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
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

export default model("Services", serviceSchema);
