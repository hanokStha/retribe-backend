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
router.get("/single/:id", getUserById);
router.delete("/delete/:id", verifyTokenMiddleware, deleteUserController);
router.post("/change-password/:id", verifyTokenMiddleware, changePassword);
router.post("/forget-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
