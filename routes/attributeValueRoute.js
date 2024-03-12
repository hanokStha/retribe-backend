import express from "express";
import verifyTokenMiddleware from "../middleware/verifyToken.js";
import isAdmin from "../middleware/verifyAdmin.js";
import {
  createAttributeValue,
  deleteAttributeValue,
  getAllAttributeValues,
  getAttributeValueByCatId,
  getAttributeValueByCatIdCount,
  getAttributeValueById,
  updateAttributeValue,
  updatePosition,
} from "../controllers/attributeValueController.js";

const router = express.Router();

// GET all FAQ questions
router.get("/value", getAllAttributeValues);

// GET a specific FAQ question by ID
router.get("/value/:questionId", getAttributeValueById);
router.get("/value/cat/:questionId", getAttributeValueByCatId);
router.get("/value/cat/count/:questionId", getAttributeValueByCatIdCount);

// POST create a new FAQ question
router.post("/value", verifyTokenMiddleware, isAdmin, createAttributeValue);
router.post(
  "/value/updatepositions",
  verifyTokenMiddleware,
  isAdmin,
  updatePosition
);

// PUT update a FAQ question by ID
router.put(
  "/value/:questionId",
  verifyTokenMiddleware,
  isAdmin,
  updateAttributeValue
);

// DELETE a FAQ question by ID
router.delete(
  "/value/:questionId",
  verifyTokenMiddleware,
  isAdmin,
  deleteAttributeValue
);

export default router;
