import express from "express";
import verifyTokenMiddleware from "../middleware/verifyToken.js";
import isAdmin from "../middleware/verifyAdmin.js";
import {
  createFAQQuestion,
  deleteFAQQuestion,
  getAllFAQQuestions,
  getFAQQuestionByCatId,
  getFAQQuestionById,
  updateFAQQuestion,
  updatePosition,
} from "../controllers/FAQQuesContoller.js";

const router = express.Router();

// GET all FAQ questions
router.get("/questions", getAllFAQQuestions);

// GET a specific FAQ question by ID
router.get("/questions/:questionId", getFAQQuestionById);
router.get("/questions/cat/:questionId", getFAQQuestionByCatId);

// POST create a new FAQ question
router.post("/questions", verifyTokenMiddleware, isAdmin, createFAQQuestion);
router.post(
  "/questions/updatepositions",
  verifyTokenMiddleware,
  isAdmin,
  updatePosition
);

// PUT update a FAQ question by ID
router.put(
  "/questions/:questionId",
  verifyTokenMiddleware,
  isAdmin,
  updateFAQQuestion
);

// DELETE a FAQ question by ID
router.delete(
  "/questions/:questionId",
  verifyTokenMiddleware,
  isAdmin,
  deleteFAQQuestion
);

export default router;
