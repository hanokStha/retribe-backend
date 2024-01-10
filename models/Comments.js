import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model, replace with your actual User model name
      required: true,
    },
    replies: [
      {
        text: {
          type: String,
          required: true,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to the User model for the reply author
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("Comments", commentSchema);
