import express from "express";
import verifyTokenMiddleware from "../middleware/verifyToken.js";
import isAdmin from "../middleware/verifyAdmin.js";
import {
  createPage,
  deletePageById,
  duplicatePage,
  getAllPage,
  getAllPublishedPage,
  getPageById,
  updatePageById,
} from "../controllers/pageController.js";

const router = express.Router();

// Create a new press entry
router.post("/post", verifyTokenMiddleware, isAdmin, createPage);
router.post(
  "/post/duplicate/:id",
  verifyTokenMiddleware,
  isAdmin,
  duplicatePage
);

// Get all press entries
router.get("/get", verifyTokenMiddleware, isAdmin, getAllPage);
router.get("/get/published", getAllPublishedPage);

// Get a specific press entry by ID
router.get("/single/:id", getPageById);

// Update a specific press entry by ID
router.put("/update/:id", verifyTokenMiddleware, isAdmin, updatePageById);

// Delete a specific press entry by ID
router.delete("/delete/:id", verifyTokenMiddleware, isAdmin, deletePageById);

export default router;
