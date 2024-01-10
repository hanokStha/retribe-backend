import { Router } from "express";
import verifyTokenMiddleware from "../middleware/verifyToken.js";

const router = Router();
import upload from "../config/multer.js";
import {
  filterMediaExtensions,
  getMediaByUser,
  getSingleMediaById,
  getUniqueExtensions,
  searchMediaByType,
  searchMediaQuery,
  updateImageDetails,
  uploadImage,
} from "../controllers/mediaController.js";

router.post(
  "/upload",
  verifyTokenMiddleware,
  upload.fields([{ name: "media", maxCount: 30 }]),
  uploadImage
);

router.get("/all/:user", verifyTokenMiddleware, getMediaByUser);
router.get("/search/:userId", verifyTokenMiddleware, searchMediaQuery);
router.get("/type/:userId", verifyTokenMiddleware, searchMediaByType);
router.get("/get/extension", getUniqueExtensions);
router.get("/filter/extension/:user", filterMediaExtensions);
router.get("/single/:id", getSingleMediaById);
router.put("/update/:id", updateImageDetails);

export default router;
