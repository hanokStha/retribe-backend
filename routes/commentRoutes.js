import express from "express";

import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  getCommentsById,
  getCommentsByUserId,
  getCommentsBySellerId,
} from "../controllers/commentController.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";

const router = express.Router();

// Define routes
router.post("/post", createComment);
router.get("/all", getComments);
router.put("/edit/:id", verifyTokenMiddleware, updateComment);
router.get("/single/:id", getCommentsById);
router.get("/user/:id", getCommentsByUserId);
router.get("/seller/:id", getCommentsBySellerId);
router.delete("/delete/:id", verifyTokenMiddleware, deleteComment);

export default router; 
