import slugify from "slugify";
import Attribute from "../models/Attribute.js";
export const getAllAttribute = async (req, res) => {
  try {
    const attribute = await Attribute.find().sort({ position: 1 });
    return res.status(200).json({ attribute });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch FAQ categories",
      error: error.message,
    });
  }
};

export const getAttributeById = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const Attribute = await Attribute.findById(categoryId) ;

    if (!Attribute) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ Attribute });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch FAQ category", error: error.message });
  }
};

export const createAttribute = async (req, res) => {
  const { category } = req.body;

  try {
    // Find the maximum position value
    const maxPosition = await Attribute.aggregate([
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
      const existingService = await Attribute.findOne({ slug });
      if (!existingService) {
        break;
      } else {
        // If slug already exists, increment suffix and generate new slug
        suffix++;
        slug = `${baseSlug}-${suffix}`;
      }
    }

    const newAttribute = new Attribute({
      category,
      slug,
      position: newPosition,
    });

    await newAttribute.save();

    return res.status(201).json({
      message: "FAQ category created successfully",
      Attribute: newAttribute,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create FAQ category", error: error.message });
  }
};

export const updateAttribute = async (req, res) => {
  const { categoryId } = req.params;
  const updatedFields = req.body;

  try {
    const attribute = await Attribute.findByIdAndUpdate(
      categoryId,
      updatedFields,
      {
        new: true,
      }
    );

    if (!attribute) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res
      .status(200)
      .json({ message: "FAQ category updated successfully", attribute });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update FAQ category", error: error.message });
  }
};

export const deleteAttribute = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const deletedAttribute = await Attribute.findByIdAndDelete(categoryId);

    if (!deletedAttribute) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      message: "FAQ category deleted successfully",
      Attribute: deletedAttribute,
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

    await Attribute.bulkWrite(bulkUpdateOps);

    res.status(200).send("Positions updated successfully");
  } catch (error) {
    res.status(500).send("Error updating positions");
  }
};
