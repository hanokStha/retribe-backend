import mongoose, { Schema, model } from "mongoose";

const blogCommentsSchema = new Schema(
  {
    text: { type: String },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "OurVibeTribe" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: "BlogComments" },
  },
  {
    timestamps: true,
  }
);

export default model("BlogComments", blogCommentsSchema);
