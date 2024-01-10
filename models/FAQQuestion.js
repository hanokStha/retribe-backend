import mongoose, { Schema, model } from "mongoose";

const faqQuestionSchema = new Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FAQCategory",
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
});

export default model("FAQQuestion", faqQuestionSchema);
