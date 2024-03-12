// routes/auctionSettingsRoutes.js
import express from "express";
import {
  createAuctionSetting,
  getAllAuctionSettings,
  getAuctionSettingById,
  updateAuctionSettingById,
  deleteAuctionSettingById,
  getAllActiveAuction,
  getLiveAuctions,
  getHighestPriceForAuction,
} from "../controllers/auctionSettingsController.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";
import isAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

// Create a new auction setting
router.post("/settings", verifyTokenMiddleware, isAdmin, createAuctionSetting);

// Get all auction settings
router.get("/all", getAllAuctionSettings);
router.get("/get/active", getLiveAuctions);
router.get("/update/cart/:id", getHighestPriceForAuction);
router.get("/get/live", getLiveAuctions);

// Get auction setting by ID
router.get("/single/:id", getAuctionSettingById);

// Update auction setting by ID
router.put("/update/:id", updateAuctionSettingById);

// Delete auction setting by ID
router.delete("/delete/:id", deleteAuctionSettingById);

export default router;
