import { Router } from "express";
import verifyTokenMiddleware from "../middleware/verifyToken.js";
import {
  countTotalCartForUsers,
  createCart,
  deleteAllCartsBySellerId,
  deleteCart,
  deleteMultiple,
  getAllItemsBySellerId,
  getCartByProductId,
  getCartByUserId,
} from "../controllers/cartController.js";
const router = Router();

router.post("/add", verifyTokenMiddleware, createCart);
router.get("/count/:userId", countTotalCartForUsers);
router.delete("/remove/:userId/:item", verifyTokenMiddleware, deleteCart);
router.post(
  "/remove/multiple/:userId",
  verifyTokenMiddleware,
  deleteMultiple
);
router.delete(
  "/remove/seller/:sellerId/:userId",
  verifyTokenMiddleware,
  deleteAllCartsBySellerId
);
router.get("/user/:userId", getCartByUserId);
router.get("/collection/:userId", getAllItemsBySellerId);
router.get("/single/:userId/:item", getCartByProductId);

export default router;
