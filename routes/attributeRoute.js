import express from "express";
import verifyTokenMiddleware from "../middleware/verifyToken.js";
import isAdmin from "../middleware/verifyAdmin.js";
import {
  createAttribute,
  deleteAttribute,
  getAllAttribute,
  getAttributeById,
  updateAttribute,
  updatePosition,
} from "../controllers/attributeController.js";

const router = express.Router();

// GET all FAQ categories
router.get("/attribute", getAllAttribute);

// GET a specific FAQ category by ID
router.get("/attribute/:categoryId", getAttributeById);

// POST create a new FAQ category
router.post("/attribute", verifyTokenMiddleware, isAdmin, createAttribute);
router.post(
  "/attribute/updatepositions",
  verifyTokenMiddleware,
  isAdmin,
  updatePosition
);

// PUT update a FAQ category by ID
router.put(
  "/attribute/:categoryId",
  verifyTokenMiddleware,
  isAdmin,
  updateAttribute
);

// DELETE a FAQ category by ID
router.delete(
  "/attribute/:categoryId",
  verifyTokenMiddleware,
  isAdmin,
  deleteAttribute
);

export default router;
