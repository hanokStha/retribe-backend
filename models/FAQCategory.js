import { Schema, model } from "mongoose";

const faqCategorySchema = new Schema({
  category: {
    type: String,
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
});

export default model("FAQCategory", faqCategorySchema);
