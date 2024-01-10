import mongoose, { Schema, model } from "mongoose";

const favouriteSchema = new Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "favoriteType", // Reference path for dynamic association
    },

    favoriteType: {
      type: String,
      enum: ["Users", "Products"], // Enum to specify the possible types
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default model("Favourite", favouriteSchema);
