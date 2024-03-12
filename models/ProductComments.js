import mongoose, { Schema, model } from "mongoose";

const productCommentSchema = new Schema(
  {
    text: { type: String },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  },
  {
    timestamps: true,
  }
);

export default model("ProductComments", productCommentSchema);
