// routes/authRoutes.js
import { Router } from "express";
import {
  userLogin,
  userRegister,
} from "../controllers/authController.js";


const router = Router();

router.post("/login", userLogin);
router.post("/register", userRegister);

export default router;
