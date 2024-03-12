// controllers/auctionSettingsController.js

import mongoose from "mongoose";
import { io } from "../index.js";
import AuctionHistory from "../models/AuctionHistory.js";
import AuctionSettings from "../models/AuctionSettings.js";
import schedule from "node-schedule";

// Create a new auction setting
export const createAuctionSetting = async (req, res) => {
  try {
    const activeAuction = await AuctionSettings.findOne({
      status: "Scheduled",
    });

    if (activeAuction && req.body.status === "Scheduled") {
      return res.status(200).json(activeAuction);
    }
    const auctionSetting = new AuctionSettings(req.body);

    const savedAuctionSetting = await auctionSetting.save();
    res.status(201).json(savedAuctionSetting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all auction settings
export const getAllAuctionSettings = async (req, res) => {
  try {
    const auctionSettings = await AuctionSettings.find();
    res.status(200).json(auctionSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllActiveAuction = async (req, res) => {
  try {
    const auctionSettings = await AuctionSettings.findOne({
      status: "Scheduled",
    });
    res.status(200).json(auctionSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLiveAuctions = async (req, res) => {
  try {
    const auctionSettings = await AuctionSettings.findOne({
      status: "Scheduled",
    });
    res.status(200).json(auctionSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get auction setting by ID
export const getAuctionSettingById = async (req, res) => {
  try {
    const auctionSetting = await AuctionSettings.findById(req.params.id);
    if (!auctionSetting) {
      return res.status(404).json({ message: "Auction setting not found" });
    }
    res.status(200).json(auctionSetting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update auction setting by ID
export const updateAuctionSettingById = async (req, res) => {
  try {
    const activeAuction = await AuctionSettings.findOne({
      status: "Scheduled",
      _id: { $ne: req.params.id },
    });

    if (activeAuction && req.body.status === "Scheduled") {
      return res.status(201).json(activeAuction);
    }
    const updatedAuctionSetting = await AuctionSettings.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAuctionSetting) {
      return res.status(404).json({ message: "Auction setting not found" });
    }
    io.emit("auctionSettingUpdated", updatedAuctionSetting);

    res.status(200).json(updatedAuctionSetting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete auction setting by ID
export const deleteAuctionSettingById = async (req, res) => {
  try {
    const deletedAuctionSetting = await AuctionSettings.findByIdAndDelete(
      req.params.id
    );
    if (!deletedAuctionSetting) {
      return res.status(404).json({ message: "Auction setting not found" });
    }
    res.status(200).json({ message: "Auction setting deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

let scheduleData;
const job = schedule.scheduleJob("24 * * * *", function () {
  getScheduleDate();
});

async function getScheduleDate() {
  const today = new Date();
  today.setDate(today.getDate());

  today.setHours(0, 0, 0, 0); // Set time to start of day
  const data = await AuctionSettings.findOne({
    status: "Scheduled",
    auctionDate: today,
  });

  const hours = new Date(data?.auctionTime).getUTCHours();
  const minutes = new Date(data?.auctionTime).getUTCMinutes();
  const seconds = new Date(data?.auctionTime).getUTCSeconds();
  const milliseconds = new Date(data?.auctionTime).getUTCMilliseconds();

  // Create a new date by combining date without time with time components
  const combinedDate = new Date(
    Date.UTC(
      new Date(data?.auctionDate)?.getUTCFullYear(),
      new Date(data?.auctionDate)?.getUTCMonth(),
      new Date(data?.auctionDate)?.getUTCDate() + 1,
      hours,
      minutes,
      seconds,
      milliseconds
    )
  );
  if (data) {
    schedule.scheduleJob(new Date(combinedDate), async function () {
      data.live = true;
      await data.save();
      io.emit("auctionSettingUpdated", data);
    });
    schedule.scheduleJob(new Date(data?.auctionEndTime), async function () {
      data.live = false;
      data.status = "Completed";
      await data.save();
      io.emit("auctionSettingUpdated", data);
    });

    let date = new Date(data?.auctionEndTime);
    let totalMilliSeconds = date.getTime();
    let millisecondsToSubtract = 5 * 60 * 1000;
    let newDate = new Date(totalMilliSeconds - millisecondsToSubtract);
    schedule.scheduleJob(new Date(newDate), async function () {
      io.emit("sendAuctionAlert", true);
    });
  }
}

export async function getHighestPriceForAuction(req, res) {
  try {
    const { id } = req.params;
    const allProducts = await AuctionHistory.find({ auctionId: id });
    const result = await AuctionHistory.aggregate([
      { $match: { auctionId: new mongoose.Types.ObjectId(id) } }, // Match documents with the specified auctionId
      { $group: { _id: "$auctionItem", maxPrice: { $max: "$price" } } }, // Group by auctionItem and calculate the maximum price
    ]);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching highest prices:", error);
    throw error;
  }
}
