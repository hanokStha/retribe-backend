import { Schema, model } from "mongoose";

const auctionHistory = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    auctionId: { 
      type: Schema.Types.ObjectId,
      ref: "AuctionSettingsSchema",
      required: true,
    },
    auctionItem: {
      type: Schema.Types.ObjectId,
      ref: "AuctionItems",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("AuctionHistory", auctionHistory);
