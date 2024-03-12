import express from "express";
import {
  createAuctionHistory,
  getAllBids,
  getHighestBid,
} from "../controllers/auctionHistoryController.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 5000, //30 Seconds
  limit: 1,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
const router = express.Router();

router.post(
  "/auction-history",
  // limiter,
  verifyTokenMiddleware,
  createAuctionHistory
);
router.get("/highest-bid/:auctionId/:auctionItem", getHighestBid);
router.get("/allbids/:auctionId/:auctionItem", getAllBids);

export default router;
