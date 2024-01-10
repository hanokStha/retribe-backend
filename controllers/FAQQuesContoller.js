import mongoose from "mongoose";
import slugify from "slugify";
import FAQQuestion from "../models/FAQQuestion.js";
const { ObjectId } = mongoose.Types;

export const getAllFAQQuestions = async (req, res) => {
  try {
    const faqQuestions = await FAQQuestion.find().sort({ position: 1 });
    return res.status(200).json({ faqQuestions });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch  FAQQuestion",
      error: error.message,
    });
  }
};

export const getFAQQuestionById = async (req, res) => {
  const { questionId } = req.params;

  try {
    const faqQuestion = await FAQQuestion.findById(questionId);

    if (!faqQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json({ faqQuestion });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch FAQ question", error: error.message });
  }
};

export const getFAQQuestionByCatId = async (req, res) => {
  const { questionId } = req.params;

  try {
    const faqQuestion = await FAQQuestion.find({ category: questionId }).sort({
      position: 1,
    });

    if (!faqQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json({ faqQuestion });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch FAQ question", error: error.message });
  }
};

export const createFAQQuestion = async (req, res) => {
  const { title, desc, category } = req.body;

  try {
    // Find the maximum position value
    const maxPosition = await FAQQuestion.aggregate([
      { $match: { category: new ObjectId(category) } }, // Match documents with the specified category
      { $group: { _id: null, maxPosition: { $max: "$position" } } }, // Calculate the maximum position
    ]);
    let newPosition = 1; // Set default position as 1

    if (maxPosition.length > 0) {
      // If categories exist, increment the max position by 1
      newPosition = maxPosition[0].maxPosition + 1;
    }

    const baseSlug = slugify(title, { lower: true }); // Generate base slug from title

    let slug = baseSlug;
    let suffix = 1;

    // Ensure unique slug
    while (true) {
      const existingService = await FAQQuestion.findOne({ slug });
      if (!existingService) {
        break;
      } else {
        // If slug already exists, increment suffix and generate new slug
        suffix++;
        slug = `${baseSlug}-${suffix}`;
      }
    }

    const newFAQQuestion = new FAQQuestion({
      title,
      desc,
      slug,
      category,
      position: newPosition,
    });

    await newFAQQuestion.save();

    return res.status(201).json({
      message: "FAQ question created successfully",
      faqQuestion: newFAQQuestion,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create FAQ question", error: error.message });
  }
};

export const updateFAQQuestion = async (req, res) => {
  const { questionId } = req.params;
  const updatedFields = req.body;

  try {
    const faqQuestion = await FAQQuestion.findByIdAndUpdate(
      questionId,
      updatedFields,
      {
        new: true,
      }
    );

    if (!faqQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res
      .status(200)
      .json({ message: "FAQ question updated successfully", faqQuestion });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update FAQ question", error: error.message });
  }
};

export const deleteFAQQuestion = async (req, res) => {
  const { questionId } = req.params;

  try {
    const deletedFAQQuestion = await FAQQuestion.findByIdAndDelete(questionId);

    if (!deletedFAQQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json({
      message: "FAQ question deleted successfully",
      faqQuestion: deletedFAQQuestion,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete FAQ question", error: error.message });
  }
};

export const updatePosition = async (req, res) => {
  const { newItems } = req.body;

  try {
    const bulkUpdateOps = newItems.map((item, index) => {
      return {
        updateOne: {
          filter: { _id: item._id },
          update: { $set: { position: index } },
        },
      };
    });

    await FAQQuestion.bulkWrite(bulkUpdateOps);

    res.status(200).send("Positions updated successfully");
  } catch (error) {
    res.status(500).send("Error updating positions");
  }
};
