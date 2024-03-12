// Initilize express router and import your controller functions
import { Router } from "express";
import {
  createCouponSetting,
  getAllCouponSettings,
  getCouponSettingById,
  updateCouponSetting,
} from "../controllers/couponSettingsController.js";
const router = Router();
import verifyTokenMiddleware from "../middleware/verifyToken.js";
import isAdmin from "../middleware/verifyAdmin.js";

router.post("/post", verifyTokenMiddleware, isAdmin, createCouponSetting);
router.get("/get/:id", getCouponSettingById);
router.get("/all", getAllCouponSettings);
router.put("/update/:id", updateCouponSetting);
export default router;
