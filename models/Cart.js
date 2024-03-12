import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    bundleDiscount: {
      type: Number,
    },
    isBundle: {
      type: Boolean,
    },
    laundryFee: {
      type: Boolean,
      required: true,
    },
    auctionItem: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
