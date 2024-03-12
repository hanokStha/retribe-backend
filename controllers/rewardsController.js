import slugify from "slugify";
import Rewards from "../models/Rewards.js";

export const createRewards = async (req, res) => {
  try {
    const { title } = req.body;
    const baseSlug = slugify(title, { lower: true }); // Generate base slug from title
    let slug = baseSlug;
    let suffix = 1;

    while (true) {
      const existingPress = await Rewards.findOne({ slug });
      if (!existingPress) {
        break;
      } else {
        // If slug already exists, increment suffix and generate new slug
        suffix++;
        slug = `${baseSlug}-${suffix}`;
      }
    }

    const newPress = await Rewards.create({ ...req.body, slug });
    res.status(201).json(newPress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllRewards = async (req, res) => {
  try {
    const rewards = await Rewards.find().sort({ position: 1 }).populate({
      path: "image",
      select: "-userType -user  -updated  -updatedAt  -originalname",
    });
    res.status(200).json(rewards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRewardsById = async (req, res) => {
  try {
    const rewards = await Rewards.findOne({ slug: req.params.id }).populate({
      path: "image",
      select: "-userType -user  -updated  -updatedAt  ",
    });
    if (!rewards) {
      res.status(201).json({ message: "Rewards not found" });
    } else {
      res.status(200).json(rewards);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRewardsById = async (req, res) => {
  try {
    const { slug } = req.body;
    const rewardsId = req.params.id;

    // Check if the slug is already taken by another Press document
    const existingPressWithSlug = await Rewards.findOne({
      slug,
      _id: { $ne: rewardsId },
    });

    if (existingPressWithSlug) {
      return res.status(400).json({ message: "Slug is already taken" });
    }

    const updatedPress = await Rewards.findByIdAndUpdate(rewardsId, req.body, {
      new: true,
    });

    if (!updatedPress) {
      res.status(404).json({ message: "rewardsId not found" });
    } else {
      res.status(200).json(updatedPress);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a specific press entry by ID
export const deleteRewardsById = async (req, res) => {
  try {
    const deletedPress = await Rewards.findByIdAndDelete(req.params.id);
    if (!deletedPress) {
      res.status(404).json({ message: "Rewards not found" });
    } else {
      res.status(200).json({ message: "Rewards deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRewardsPositions = async (req, res) => {
  const { positions } = req.body;
   try {
    // Iterate over the positions array and update each reward with the new position
    await Promise.all(
      positions.map(async (position, index) => {
        await Rewards.findByIdAndUpdate(position._id, { position: index });
      })
    );

    res.status(200).json({ message: "Positions updated successfully" });
  } catch (error) {
    console.error("Error updating positions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
