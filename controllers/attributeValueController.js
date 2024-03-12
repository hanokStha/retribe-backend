import mongoose from "mongoose";
import slugify from "slugify";
import Attribute from "../models/Attribute.js";
import AttributeValue from "../models/AttributeValue.js";
const { ObjectId } = mongoose.Types;

export const getAllAttributeValues = async (req, res) => {
  try {
    const AttributeValues = await AttributeValue.find().sort({ position: 1 });
    return res.status(200).json({ AttributeValues });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch  AttributeValue",
      error: error.message,
    });
  }
};

export const getAttributeValueById = async (req, res) => {
  const { questionId } = req.params;

  try {
    const AttributeValues = await AttributeValue.findById(questionId);

    if (!AttributeValues) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json({ AttributeValues });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch FAQ question", error: error.message });
  }
};

export const getAttributeValueByCatId = async (req, res) => {
  const { questionId } = req.params;

  try {
    const faqQuestion = await AttributeValue.find({
      category: questionId,
    }).sort({
      position: 1,
    });
    const category = await Attribute.findById(questionId); // Assuming Category is your model

    if (!faqQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json({ faqQuestion, category });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch FAQ question", error: error.message });
  }
};

export const getAttributeValueByCatIdCount = async (req, res) => {
  const { questionId } = req.params;

  try {
    const faqQuestion = await AttributeValue.aggregate([
      {
        $match: { category: new mongoose.Types.ObjectId(questionId) },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "brand", // Assuming there's a field in the Product model referencing attributes
          as: "productCount",
        },
      },
      {
        $unwind: {
          path: "$productCount",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: { "productCount.status": "Active" },
      },
      {
        $group: {
          _id: "$_id",
          category: { $first: "$category" }, // Keep the category field
          title: { $first: "$title" }, // Keep the category field
          slug: { $first: "$slug" }, // Keep the category field
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          // Include the fields you want in the final result
          _id: 1,
          category: 1,
          slug: 1,
          title: 1,
          count: 1,
        },
      },
      {
        $sort: {
          position: 1,
        },
      },
    ]);

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

export const createAttributeValue = async (req, res) => {
  const { title, desc, category } = req.body;

  try {
    // Find the maximum position value
    const maxPosition = await AttributeValue.aggregate([
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
      const existingService = await AttributeValue.findOne({ slug });
      if (!existingService) {
        break;
      } else {
        // If slug already exists, increment suffix and generate new slug
        suffix++;
        slug = `${baseSlug}-${suffix}`;
      }
    }

    const newAttributeValue = new AttributeValue({
      title,
      desc,
      slug,
      category,
      position: newPosition,
    });

    await newAttributeValue.save();

    return res.status(201).json({
      message: "FAQ question created successfully",
      AttributeValue: newAttributeValue,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create FAQ question", error: error.message });
  }
};

export const updateAttributeValue = async (req, res) => {
  const { questionId } = req.params;
  const updatedFields = req.body;

  try {
    const faqQuestion = await AttributeValue.findByIdAndUpdate(
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

export const deleteAttributeValue = async (req, res) => {
  const { questionId } = req.params;

  try {
    const deletedAttributeValue = await AttributeValue.findByIdAndDelete(
      questionId
    );

    if (!deletedAttributeValue) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json({
      message: "FAQ question deleted successfully",
      AttributeValue: deletedAttributeValue,
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

    await AttributeValue.bulkWrite(bulkUpdateOps);

    res.status(200).send("Positions updated successfully");
  } catch (error) {
    res.status(500).send("Error updating positions");
  }
};
