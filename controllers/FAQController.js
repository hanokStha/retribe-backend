import FAQCategory from "../models/FAQCategory.js";
import slugify from "slugify";
export const getAllFAQCategories = async (req, res) => {
  try {
    const faqCategories = await FAQCategory.find().sort({ position: 1 });
    return res.status(200).json({ faqCategories });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch FAQ categories",
      error: error.message,
    });
  }
};

export const getFAQCategoryById = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const faqCategory = await FAQCategory.findById(categoryId);

    if (!faqCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ faqCategory });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch FAQ category", error: error.message });
  }
};

export const createFAQCategory = async (req, res) => {
  const { category } = req.body;

  try {
    // Find the maximum position value
    const maxPosition = await FAQCategory.aggregate([
      { $group: { _id: null, maxPosition: { $max: "$position" } } },
    ]);

    let newPosition = 1; // Set default position as 1

    if (maxPosition.length > 0) {
      // If categories exist, increment the max position by 1
      newPosition = maxPosition[0].maxPosition + 1;
    }

    const baseSlug = slugify(category, { lower: true }); // Generate base slug from title

    let slug = baseSlug;
    let suffix = 1;

    // Ensure unique slug
    while (true) {
      const existingService = await FAQCategory.findOne({ slug });
      if (!existingService) {
        break;
      } else {
        // If slug already exists, increment suffix and generate new slug
        suffix++;
        slug = `${baseSlug}-${suffix}`;
      }
    }

    const newFAQCategory = new FAQCategory({
      category,
      slug,
      position: newPosition,
    });

    await newFAQCategory.save();

    return res.status(201).json({
      message: "FAQ category created successfully",
      faqCategory: newFAQCategory,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create FAQ category", error: error.message });
  }
};

export const updateFAQCategory = async (req, res) => {
  const { categoryId } = req.params;
  const updatedFields = req.body;

  try {
    const faqCategory = await FAQCategory.findByIdAndUpdate(
      categoryId,
      updatedFields,
      {
        new: true,
      }
    );

    if (!faqCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res
      .status(200)
      .json({ message: "FAQ category updated successfully", faqCategory });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update FAQ category", error: error.message });
  }
};

export const deleteFAQCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const deletedFAQCategory = await FAQCategory.findByIdAndDelete(categoryId);

    if (!deletedFAQCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      message: "FAQ category deleted successfully",
      faqCategory: deletedFAQCategory,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete FAQ category", error: error.message });
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

    await FAQCategory.bulkWrite(bulkUpdateOps);

    res.status(200).send("Positions updated successfully");
  } catch (error) {
    res.status(500).send("Error updating positions");
  }
};
