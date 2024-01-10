import {
  deleteFAQCategory,
  updateFAQCategory,
  getFAQCategoryById,
  getAllFAQCategories,
  createFAQCategory,
  updatePosition,
} from "../controllers/FAQController.js";
import express from "express";
import verifyTokenMiddleware from "../middleware/verifyToken.js";
import isAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

// GET all FAQ categories
router.get("/categories", getAllFAQCategories);

// GET a specific FAQ category by ID
router.get("/categories/:categoryId", getFAQCategoryById);

// POST create a new FAQ category
router.post("/categories", verifyTokenMiddleware, isAdmin, createFAQCategory);
router.post(
  "/categories/updatepositions",
  verifyTokenMiddleware,
  isAdmin,
  updatePosition
);

// PUT update a FAQ category by ID
router.put(
  "/categories/:categoryId",
  verifyTokenMiddleware,
  isAdmin,
  updateFAQCategory
);

// DELETE a FAQ category by ID
router.delete(
  "/categories/:categoryId",
  verifyTokenMiddleware,
  isAdmin,
  deleteFAQCategory
);

export default router;
