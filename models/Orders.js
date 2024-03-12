import mongoose, { Schema, model } from "mongoose";

const orderSchema = new Schema(
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

    item: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },

        laundryFee: {
          type: Number,
        },
        servicePercentage: {
          type: Number,
        },
      },
    ],
    deliveryFee: {
      type: Number,
    },
    bundleDiscount: {
      type: Boolean,
    },
    bundleDisPercentage: {
      type: Number,
    },
    orderNumber: {
      type: Number,
    },
    totalPayment: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Delivered", "Processing", "Cancelled", "On-hold"],
      default: "On-hold",
    },
    deliveryAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Orders", orderSchema);
