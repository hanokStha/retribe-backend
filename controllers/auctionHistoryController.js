import mongoose from "mongoose";
import AuctionHistory from "../models/AuctionHistory.js";
import AuctionItems from "../models/AuctionItems.js";
import AuctionSettings from "../models/AuctionSettings.js";
import { io } from "../index.js";

export const createAuctionHistory = async (req, res) => {
  try {
    const { user, auctionId, auctionItem, price } = req.body;
    const getAuctionPrice = await AuctionItems.findById(auctionItem);
    const getAuctionSettings = await AuctionSettings.findById(auctionId);
    const highestPrice = await AuctionHistory.aggregate([
      {
        $match: {
          auctionId: new mongoose.Types.ObjectId(auctionId), // Convert to ObjectId if needed
          auctionItem: new mongoose.Types.ObjectId(auctionItem), // Convert to ObjectId if needed
        },
      },
      {
        $group: {
          _id: { auctionId: "$auctionId", auctionItem: "$auctionItem" },
          highestPrice: { $max: "$price" },
        },
      },
    ]);

    const newAuctionHistory = await AuctionHistory.create({
      user,
      auctionId,
      auctionItem,
      price:
        highestPrice && highestPrice.length > 0
          ? parseFloat(highestPrice[0]?.highestPrice) +
            parseFloat(getAuctionSettings.minBiddingPrice)
          : parseFloat(getAuctionPrice?.productPrice) +
            parseFloat(getAuctionSettings.minBiddingPrice),
    });

    const _newAuctionItem = await AuctionHistory.findById(
      newAuctionHistory?._id
    ).populate({
      path: "user",
      select: "name image",
      populate: {
        path: "image",
        select:
          "-userType -user -extension -updated -createdAt -updatedAt -size -originalname -filename",
      },
    });

    io.emit("historyAuction", _newAuctionItem);

    res.status(201).json(newAuctionHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAuctionHistory = async (req, res) => {
  try {
    const allAuctionHistory = await AuctionHistory.find();
    res.status(200).json(allAuctionHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHighestBid = async (req, res) => {
  try {
    const { auctionId, auctionItem } = req.params;
    const price = await AuctionHistory.aggregate([
      {
        $match: {
          auctionId: new mongoose.Types.ObjectId(auctionId), // Convert to ObjectId if needed
          auctionItem: new mongoose.Types.ObjectId(auctionItem), // Convert to ObjectId if needed
        },
      },
      {
        $group: {
          _id: { auctionId: "$auctionId", auctionItem: "$auctionItem" },
          price: { $max: "$price" },
        },
      },
    ]);
    if (price) {
      res.status(200).json(price[0]);
    } else {
      res.status(400).json({ message: "No records found" });
    }
  } catch (error) {
    console.error("Error occurred while fetching highest price:", error);
  }
};

export const getAllBids = async (req, res) => {
  try {
    const { auctionId, auctionItem } = req.params;
    const allBids = await AuctionHistory.find({
      auctionId,
      auctionItem,
    })
      .populate({
        path: "user",
        select: "name image",
        populate: {
          path: "image",
          select:
            "-userType -user -extension -updated -createdAt -updatedAt -size -originalname -filename",
        },
      })
      .sort({ createdAt: -1 });
    if (allBids) {
      res.status(200).json(allBids);
    } else {
      res.status(400).json({ message: "No records found" });
    }
  } catch (error) {
    console.error("Error occurred while fetching all bids:", error);
  }
};
