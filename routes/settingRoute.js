// routes/authRoutes.js
import { Router } from "express";
import {
  addSetting,
  deleteSettingsBySlug,
  getAllSettings,
  getSettingsBySlug,
  updateSettingsBySlug,
} from "../controllers/settingsController.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";
import isAdmin from "../middleware/verifyAdmin.js";
const router = Router();

router.post("/add", verifyTokenMiddleware, isAdmin, addSetting);
router.get("/all", getAllSettings);
router.get("/single/:slug", getSettingsBySlug);
router.put(
  "/update/:slug", 
  verifyTokenMiddleware,
  isAdmin,
  updateSettingsBySlug
);
router.delete(
  "/delete/:slug",
  verifyTokenMiddleware,
  isAdmin,
  deleteSettingsBySlug
);

export default router;
