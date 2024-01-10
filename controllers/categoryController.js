import mongoose from "mongoose";
import Category from "../models/Category.js";
const { ObjectId } = mongoose.Types;

export const createCategory = async (req, res) => {
  try {
    const { title, parent } = req.body;
    let newPosition = 1; // Set default position as 1

    if (!parent) {
      // If there's no parent, find the maximum position among categories with no parent
      const maxPositionMain = await Category.aggregate([
        { $match: { parent: null } }, // Match documents with no parent
        { $group: { _id: null, maxPosition: { $max: "$position" } } }, // Calculate the maximum position
      ]);

      if (maxPositionMain.length > 0) {
        // If main categories exist, increment the max position by 1
        newPosition = maxPositionMain[0].maxPosition + 1;
      }
    } else {
      // If there's a parent, follow the existing logic
      const maxPosition = await Category.aggregate([
        { $match: { parent: new ObjectId(parent) } }, // Match documents with the specified category
        { $group: { _id: null, maxPosition: { $max: "$position" } } }, // Calculate the maximum position
      ]);

      if (maxPosition.length > 0) {
        // If categories exist, increment the max position by 1
        newPosition = maxPosition[0].maxPosition + 1;
      }
    }

    const category = await Category.create({
      title,
      parent,
      position: newPosition,
    });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate({
        path: "parent",
        populate: {
          path: "parent",
        },
      })
      .sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id).populate({
      path: "parent",
      populate: {
        path: "parent",
      },
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, parent } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { title, parent },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(deletedCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategoriesWithNestedSubcategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ position: 1 });
    // Create a map to store categories with their respective subcategories
    const categoryMap = {};

    // Iterate through categories to build the map
    categories.forEach((category) => {
      // If the category's parent doesn't exist in the map, create an empty array
      if (
        !categoryMap[category.parent] ||
        !categoryMap[category.parent] === null
      ) {
        categoryMap[category.parent] = [];
      }
      // Push the category into its parent's subcategories array
      categoryMap[category.parent].push(category);
    });
    // Function to recursively build the nested structure
    function buildHierarchy(parentId) {
      // Find subcategories for the given parent ID
      const subcategories = categoryMap[parentId] || [];
      subcategories.sort((a, b) => a.position - b.position);

      // Recursively build the nested structure for each subcategory
      return subcategories.map((subcategory) => ({
        _id: subcategory._id,
        title: subcategory.title,
        position: subcategory.position,
        subcategory: buildHierarchy(subcategory._id),
      }));
    }

    // Start building the hierarchy with the root category (parent ID: null or 0)
    const nestedCategories = buildHierarchy(null); // or 0, depending on how root categories are represented

    res.status(200).json(nestedCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategoriesWithNestedChildren = async (req, res) => {
  try {
    const categories = await Category.find().sort({ position: 1 });
    // Create a map to store categories with their respective subcategories
    const categoryMap = {};

    // Iterate through categories to build the map
    categories.forEach((category) => {
      // If the category's parent doesn't exist in the map, create an empty array
      if (
        !categoryMap[category.parent] ||
        !categoryMap[category.parent] === null
      ) {
        categoryMap[category.parent] = [];
      }
      // Push the category into its parent's subcategories array
      categoryMap[category.parent].push(category);
    });
    // Function to recursively build the nested structure
    function buildHierarchy(parentId) {
      // Find subcategories for the given parent ID
      const children = categoryMap[parentId] || [];
      children.sort((a, b) => a.position - b.position);

      // Recursively build the nested structure for each subcategory
      return children.map((subcategory) => ({
        _id: subcategory._id,
        value: subcategory._id,
        title: subcategory.title,
        position: subcategory.position,
        children: buildHierarchy(subcategory._id),
      }));
    }

    // Start building the hierarchy with the root category (parent ID: null or 0)
    const nestedCategories = buildHierarchy(null); // or 0, depending on how root categories are represented

    res.status(200).json(nestedCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const updateCategoryParentAndPosition = async (req, res) => {
  try {
    const { categoryId, newParentId } = req.body;

    // Retrieve the category to be updated
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update the category's parent and position
    category.parent = newParentId;

    await category.save();

    // Find all categories affected by the position change

    // Shift positions of affected categories based on the direction of movement

    res.status(200).json({ message: "Category updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCategoryPositions = async (req, res) => {
  try {
    const { newPositionData } = req.body; // Retrieve newPositionData from req.body
    if (!newPositionData || !Array.isArray(newPositionData)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    // Create an array to store update operations
    const bulkOperations = newPositionData.map(({ _id, position }) => ({
      updateOne: {
        filter: { _id },
        update: { $set: { position } },
      },
    }));

    // Execute bulk update operation
    const result = await Category.bulkWrite(bulkOperations);

    res.status(200).json({
      message: `${result.modifiedCount} categories updated successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
