import mongoose, { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const mediaSchema = new Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalname: {
      type: String,
      required: true,
    },
    updated: {
      type: Date,
    },
    size: {
      type: String,
    },
    title: {
      type: String,
    },
    alt: {
      type: String,
    },
    thumb: {
      type: String,
    },
    description: {
      type: String,
    },
    extension: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "userType", // Reference path for dynamic association
      required: true,
    },
    userType: {
      type: String,
      enum: ["Seller", "Admin"], // Enum to specify the possible types
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
mediaSchema.plugin(mongoosePaginate);

export default model("Media", mediaSchema);
