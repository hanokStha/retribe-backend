import mongoose from "mongoose";
import ProductComments from "../models/ProductComments.js";

// Create a new comment
export const createComment = async (req, res) => {
  try {
    const { text, productId, userId, parentCommentId } = req.body;
    if (userId !== req.user.userId) {
      return res.status(404).json({ error: "Authentication Requried" });
    }
    const newComment = new ProductComments({
      text,
      productId,
      userId,
      parentCommentId,
    });
    const savedComment = await newComment.save();

    return res.status(201).json(savedComment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Edit a comment
export const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    const updatedComment = await ProductComments.findByIdAndUpdate(
      commentId,
      { text },
      { new: true }
    );

    return res.json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Find the comment to get the parentId
    const comment = await ProductComments.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const parentId = comment._id;
    
    // Delete the comment and all its child data
    await ProductComments.deleteMany({ parentCommentId: parentId });
    await ProductComments.findByIdAndDelete(commentId);

    return res.json({
      message: "Comment and its children deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getCommentsWithReplies = async (req, res) => {
  try {
    const yourProductId = req.params.id;

    const commentData = await ProductComments.find({
      productId: yourProductId,
    }).populate({
      path: "userId",
      select: "_id name image",
      populate: {
        path: "image", // Specify the nested field to be populated
        model: "Media", // Replace with your actual Media model name
        select:
          "-userType -user -extension -updated -createdAt -updatedAt -size -originalname",
      },
    });

    const commentMap = {};

    // Iterate through categories to build the map
    commentData.forEach((category) => {
      // If the category's parent doesn't exist in the map, create an empty array
      if (
        !commentMap[category.parentCommentId] ||
        commentMap[category.parentCommentId] === null
      ) {
        commentMap[category.parentCommentId] = [];
      }
      // Push the category into its parent's subcategories array
      commentMap[category.parentCommentId].push(category);
    });

    async function buildHierarchy(parentId) {
      // Find subcategories for the given parent ID
      const children = commentMap[parentId] || [];

      // Recursively build the nested structure for each subcategory
      const result = await Promise.all(
        children.map(async (subcategory) => ({
          _id: subcategory._id,
          text: subcategory.text,
          productId: subcategory.productId,
          userId: subcategory.userId,
          updatedAt: subcategory.updatedAt,
          replies: await buildHierarchy(subcategory._id),
        }))
      );

      return result;
    }

    const nestedComment = await buildHierarchy(null); // or 0, depending on how root categories are represented

    if (!nestedComment) {
      return res.json({ message: "No comments" });
    }
    return res.json({ nestedComment });
  } catch (error) {
    return res.json({ error });
    // Handle errors here
  }
};
