import express from "express";
import verifyTokenMiddleware from "../middleware/verifyToken.js";
import isAdmin from "../middleware/verifyAdmin.js";
import {
  createRewards,
  deleteRewardsById,
  getAllRewards,
  getRewardsById,
  updateRewardsById,
  updateRewardsPositions,
} from "../controllers/rewardsController.js";

const router = express.Router();

router.post("/post", verifyTokenMiddleware, isAdmin, createRewards);
router.post(
  "/update/positions",
  verifyTokenMiddleware,
  isAdmin,
  updateRewardsPositions
);
router.get("/get", getAllRewards);
router.get("/single/:id", getRewardsById);
router.put("/update/:id", verifyTokenMiddleware, isAdmin, updateRewardsById);
router.delete("/delete/:id", verifyTokenMiddleware, isAdmin, deleteRewardsById);

export default router;
