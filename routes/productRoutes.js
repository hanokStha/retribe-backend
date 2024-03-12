import { Router } from "express";
import {
  createProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  getProductBySellerId,
  updateProduct,
  getLatestProducts,
  getProductBySellerIdActive,
  getPriceRange,
  getMostLovedProducts,
  getAllProductsForAdmin,
  verifyProductbyAdmin,
  getAllSellerProduct,
} from "../controllers/productController.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";
import isAdmin from "../middleware/verifyAdmin.js";
const router = Router();

router.post("/new", verifyTokenMiddleware, createProduct);
router.get("/latest", getLatestProducts);
router.get("/mostLoved", getMostLovedProducts);
router.put("/update/:id", verifyTokenMiddleware, updateProduct);
router.get("/all", getAllProducts);
router.get("/all/admin", getAllProductsForAdmin);
router.get("/single/:id", getProductById);
router.get("/single/seller/:id", getProductBySellerId);
router.get("/single/seller/active/:id", getProductBySellerIdActive);
router.get("/all/seller/active/:id", getAllSellerProduct);
router.get("/price/range", getPriceRange);

// ADMIN
router.put(
  "/update/status/:id",
  verifyTokenMiddleware,
  isAdmin,
  verifyProductbyAdmin
);

router.delete("/delete/:id", deleteProductById);
export default router;
