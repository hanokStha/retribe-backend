import mongoose from "mongoose";

const rewardsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media", // Reference path for dynamic association
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
    },
    position: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Rewards = mongoose.model("Rewards", rewardsSchema);

export default Rewards;
