import express from "express";
import {
  createAuctionUser,
  getAllAuctionUsers,
  getAllAuctionUsersByAuction,
  getAuctionByUser,
} from "../controllers/auctionUserController.js";

const router = express.Router();

router.post("/register", createAuctionUser);
router.get("/users/all", getAllAuctionUsers);
router.get("/users/:userId/:auctionId", getAuctionByUser);
router.get("/users/auction/:auctionId ", getAllAuctionUsersByAuction);

export default router;
