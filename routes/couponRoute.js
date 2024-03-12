// Initilize express router and import your controller functions
import { Router } from "express";

const router = Router();
import verifyTokenMiddleware from "../middleware/verifyToken.js";
import isAdmin from "../middleware/verifyAdmin.js";
import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCouponById,
} from "../controllers/couponController.js";

router.post("/post", verifyTokenMiddleware, isAdmin, createCoupon);
router.get("/get/:id", getCouponById);
router.get("/all", getAllCoupons);
router.put("/update/:id", updateCouponById);

export default router;
