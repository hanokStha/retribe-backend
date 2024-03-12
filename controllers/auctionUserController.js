import AuctionUser from "../models/AuctionUser.js";

// Controller to create a new auction user
export const createAuctionUser = async (req, res) => {
  try {
    const { userId, auctionId, paymentDone } = req.body;
    const auctionUser = new AuctionUser({ userId, auctionId, paymentDone });
    await auctionUser.save();
    res.status(201).json(auctionUser);
  } catch (error) {
    console.error("Error creating auction user:", error);
    res.status(500).json({ error: "Failed to create auction user." });
  }
};

// Controller to get all auction users
export const getAllAuctionUsers = async (req, res) => {
  try {
    const auctionUsers = await AuctionUser.find();
    res.json(auctionUsers);
  } catch (error) {
    console.error("Error getting auction users:", error);
    res.status(500).json({ error: "Failed to get auction users." });
  }
};

export const getAllAuctionUsersByAuction = async (req, res) => {
  try {
    const auctionId = req.params.auctionId;
    const auctionUsers = await AuctionUser.find({ auctionId });
    res.json(auctionUsers);
  } catch (error) {
    console.error("Error getting auction users:", error);
    res.status(500).json({ error: "Failed to get auction users." });
  }
};

// Controller to update payment status of an auction user
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentDone } = req.body;
    const updatedAuctionUser = await AuctionUser.findByIdAndUpdate(
      id,
      { paymentDone },
      { new: true }
    );
    res.json(updatedAuctionUser);
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Failed to update payment status." });
  }
};

// Controller to delete an auction user
export const deleteAuctionUser = async (req, res) => {
  try {
    const { id } = req.params;
    await AuctionUser.findByIdAndDelete(id);
    res.json({ message: "Auction user deleted successfully." });
  } catch (error) {
    console.error("Error deleting auction user:", error);
    res.status(500).json({ error: "Failed to delete auction user." });
  }
};
export const getAuctionByUser = async (req, res) => {
  try {
    const { userId, auctionId } = req.params;
    const user = await AuctionUser.findOne({ userId, auctionId });
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ error: "Failed to get auction user." });
  }
};
