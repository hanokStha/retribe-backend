import express from "express";
import {
  createPress,
  getAllPress,
  getPressById,
  updatePressById,
  deletePressById,
  getAllPublishedPress,
  duplicatePress,
} from "../controllers/pressController.js"; // Adjust the path based on your project structure
import verifyTokenMiddleware from "../middleware/verifyToken.js";
import isAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

// Create a new press entry
router.post("/post", verifyTokenMiddleware, isAdmin, createPress);
router.post(
  "/post/duplicate/:id",
  verifyTokenMiddleware,
  isAdmin,
  duplicatePress
);

// Get all press entries
router.get("/get", verifyTokenMiddleware, isAdmin, getAllPress);
router.get("/get/published", getAllPublishedPress);

// Get a specific press entry by ID
router.get("/single/:id", getPressById);

// Update a specific press entry by ID
router.put("/update/:id", verifyTokenMiddleware, isAdmin, updatePressById);

// Delete a specific press entry by ID
router.delete("/delete/:id", verifyTokenMiddleware, isAdmin, deletePressById);

export default router;
