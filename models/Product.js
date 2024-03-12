// models/Product.js
import mongoose, { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    featureImage: {
      type: String,
      // required: true,
    },
    galleryImages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
        required: true,
      },
    ],

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AttributeValue",
      required: true,
    },
    productSize: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AttributeValue",
      required: true,
    },
    colors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AttributeValue",
      },
    ],
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AttributeValue",
      required: true,
    },
    conditions: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AttributeValue",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Draft", "Active", "Inactive", "Sold", "Auction"], // Assuming limited statuses
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // Reference to a Seller model
    },
    totalLikes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comments", // Reference to a Seller model
        },
      ],
    },
    hitCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(mongoosePaginate);

export default model("Products", productSchema);
