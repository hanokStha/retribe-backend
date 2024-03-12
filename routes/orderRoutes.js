import express from "express";
import {
  getOrderById,
  createOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getOrderByUserId,
  createOrders,
  updateCartStatus,
  getOrderBySellerId,
} from "../controllers/ordersController.js";

const router = express.Router();
import verifyTokenMiddleware from "../middleware/verifyToken.js";
// Create a new order
router.post("/new", verifyTokenMiddleware, createOrder);
router.post("/new/test", verifyTokenMiddleware, createOrders);

// Get all orders
router.get("/all", getAllOrders);
router.get("/user/:userId", verifyTokenMiddleware, getOrderByUserId);
router.get("/seller/:sellerId", verifyTokenMiddleware, getOrderBySellerId);

// Get a specific order by ID
router.get("/single/:orderId", getOrderById);

// Update an order by ID
router.put("/orders/:orderId", verifyTokenMiddleware, updateOrder);

// Delete an order by ID
router.delete("/orders/:orderId", verifyTokenMiddleware, deleteOrder);

// UPDATE ORDER STATUS

router.post("/update/status/:id", verifyTokenMiddleware, updateCartStatus);
export default router;
