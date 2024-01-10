import mongoose, { Schema, model } from "mongoose";

const attributeValueSchema = new Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Attribute",
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
});

export default model("AttributeValue", attributeValueSchema);
