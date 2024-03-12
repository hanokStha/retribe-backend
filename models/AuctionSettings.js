import { Schema, model } from "mongoose";

const auctionSchema = new Schema(
  {
    title: {
      type: String,
      default: "Auction",
    },
    auctionDate: {
      type: Date,
      required: true,
    },
    auctionTime: {
      type: String,
      required: true,
    },
    auctionEndTime: {
      type: Date,
      required: true,
    },
    auctionDiscountPercent: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Active", "Inactive", "Scheduled", "Completed"],
    },
    availableToSeller: {
      type: String,
      required: true,
    },
    availableToUser: {
      type: String,
      required: true,
    },
    registerFee: {
      type: String,
      required: true,
    },
    productDemoAmounut: {
      type: Number,
      required: true,
    },
    live: {
      type: Boolean,
      default: false,
    },

    minBiddingPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("AuctionSettingsSchema", auctionSchema);
