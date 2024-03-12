import express from "express";
import verifyTokenMiddleware from "../middleware/verifyToken.js";
import isAdmin from "../middleware/verifyAdmin.js";
import {
  createOurVibeTribe,
  deleteOurVibeTribeById,
  duplicateOurVibeTribe,
  getAllOurVibeTribe,
  getAllPublishedOurVibeTribe,
  getOurVibeTribeById,
  updateOurVibeTribeById,
} from "../controllers/vibeTribeController.js";

const router = express.Router();

router.post("/post", verifyTokenMiddleware, isAdmin, createOurVibeTribe);
router.post(
  "/post/duplicate/:id",
  verifyTokenMiddleware,
  isAdmin,
  duplicateOurVibeTribe
);

router.get("/get", verifyTokenMiddleware, isAdmin, getAllOurVibeTribe);
router.get("/get/published", getAllPublishedOurVibeTribe);

router.get("/single/:id", getOurVibeTribeById);

router.put(
  "/update/:id",
  verifyTokenMiddleware,
  isAdmin,
  updateOurVibeTribeById
);

router.delete(
  "/delete/:id",
  verifyTokenMiddleware,
  isAdmin,
  deleteOurVibeTribeById
);

export default router;
