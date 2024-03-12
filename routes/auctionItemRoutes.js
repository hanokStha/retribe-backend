import express from "express";
import {
  createAuctionItem,
  deleteAuctionItem,
  getAuctionItemById,
  getAuctionItemsByAuctionId,
  getAuctionItemsBySellerId,
} from "../controllers/auctionItemsController.js";

const router = express.Router();
import verifyTokenMiddleware from "../middleware/verifyToken.js";
// Create a new Auction Item
router.post("/auctionItems", verifyTokenMiddleware, createAuctionItem);

// router.get("/auctionItems", getAuctionItems);
router.get("/auctionItems/seller/:id/:auctionId", getAuctionItemsBySellerId);
router.get("/auctionItems/:id", getAuctionItemById);
router.get("/auctionItems/auction/:auctionId", getAuctionItemsByAuctionId);
router.delete(
  "/auctionItems/delete/:id",
  verifyTokenMiddleware,
  deleteAuctionItem
);

export default router;
