import { Router } from "express";
import upload from "../config/multer.js";
import {
  userLogin,
  userRegister,
  getUserById,
  getAllUser,
  verifyOTP,
  deleteUserController,
  resendOTP,
  updateUser,
  resetPassword,
  forgotPassword,
  changePassword,
  getAllSeller,
  getUserBySlug,
  updateUserBundleItems,
  getBundleItemsById,
  updateBundleDiscounts,
  getBundleDiscounts,
  getAllUserStatistics,
} from "../controllers/userController.js";

import verifyTokenMiddleware from "../middleware/verifyToken.js";
const router = Router();

router.post("/login", userLogin);
router.post("/register", userRegister);
router.put(
  "/update/:id",
  verifyTokenMiddleware,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "coverimage", maxCount: 1 },
  ]),
  updateUser
);
router.post("/otp/verify", verifyOTP);
router.post("/otp/resend", resendOTP);
router.get("/all", getAllUser);
router.get("/seller", getAllSeller);

router.get("/single/:id", getUserById);
router.get("/slug/:id", getUserBySlug);

// router.delete("/delete/:id", verifyTokenMiddleware, deleteUserController);
router.post("/change-password/:id", verifyTokenMiddleware, changePassword);
router.post("/forget-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/update/bundles", verifyTokenMiddleware, updateUserBundleItems);
router.get("/get/bundles/:id", getBundleItemsById);

router.post(
  "/update/bundlediscount/:userId",
  verifyTokenMiddleware,
  updateBundleDiscounts
);
router.get("/get/bundlediscount/:userId", getBundleDiscounts);

router.post("/statistic/:sellerId/:rating", getAllUserStatistics);

export default router;
