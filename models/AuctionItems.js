import mongoose, { Schema, model } from "mongoose";

const auctionItemsSchema = new Schema(
  {
    auctionId: {
      type: mongoose.Schema.ObjectId,
      ref: "AuctionSettingsSchema",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Products",
      required: true,
    },

    productPrice: {
      type: Number,
      required: true,
    },

    sellerId: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: true,
    },

    status: {
      type: String,
      enum: ["Sold", "Active", "Inactive", "Unsold"],
    },
  },
  {
    timestamps: true,
  }
);

export default model("AuctionItems", auctionItemsSchema);
