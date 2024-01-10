import express from "express";
import {
  createService,
  getAllService,
  getServiceById,
  updateServiceById,
  deleteServiceById,
  getAllPublishedService,
  duplicateService,
} from "../controllers/serviceController.js"; // Adjust the path based on your project structure
import verifyTokenMiddleware from "../middleware/verifyToken.js";
import isAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

// Create a new press entry
router.post("/post", verifyTokenMiddleware, isAdmin, createService);
router.post(
  "/post/duplicate/:id",
  verifyTokenMiddleware,
  isAdmin,
  duplicateService
);

// Get all press entries
router.get("/get", getAllService);
router.get("/get/published", getAllPublishedService);

// Get a specific press entry by ID
router.get("/single/:id", getServiceById);

// Update a specific press entry by ID
router.put("/update/:id", verifyTokenMiddleware, isAdmin, updateServiceById);

// Delete a specific press entry by ID
router.delete("/delete/:id", verifyTokenMiddleware, isAdmin, deleteServiceById);

export default router;
