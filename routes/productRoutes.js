import { Router } from "express";
import {
  createProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  getProductBySellerId,
  updateProduct,
} from "../controllers/productController.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";
const router = Router();

router.post("/new", verifyTokenMiddleware, createProduct);
router.put("/update/:id", verifyTokenMiddleware, updateProduct);
router.get("/all", getAllProducts);
router.get("/single/:id", getProductById);
router.get("/single/seller/:id", getProductBySellerId);
router.delete("/delete/:id", deleteProductById);
export default router;
 