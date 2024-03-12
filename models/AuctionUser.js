import mongoose, { Schema, model } from "mongoose";

const AuctionUser = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    paymentDone: {
      type: Boolean,
      default: false,
    },
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuctionSettingsSchema",
    },
  },
  {
    timestamps: true,
  }
);

export default model("AuctionUser", AuctionUser);
