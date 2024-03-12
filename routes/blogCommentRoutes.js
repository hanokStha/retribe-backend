import express from "express";
import {
  createComment,
  editComment,
  deleteComment,
  getCommentsWithReplies,
} from "../controllers/blogCommentController.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create", verifyTokenMiddleware, createComment);
router.get("/get/:id", getCommentsWithReplies);
router.patch("/edit/:commentId", verifyTokenMiddleware, editComment);
router.delete("/delete/:commentId", verifyTokenMiddleware, deleteComment);

export default router;
