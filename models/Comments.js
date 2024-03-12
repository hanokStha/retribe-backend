import mongoose, { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    text: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // Reference to the User model, replace with your actual User model name
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    automatic: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
    },

    reply: {
      type: String,
    },
    rating: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Comments", commentSchema);
