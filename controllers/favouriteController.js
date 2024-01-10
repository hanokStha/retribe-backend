import Favourite from "../models/Favourite.js";

export const addFavourite = async (req, res) => {
  const { user, item, favoriteType } = req.body;

  try {
    // Create a new Favourite entry
    const newFavourite = new Favourite({
      user,
      item,
      favoriteType,
    });

    await newFavourite.save();
    res.status(201).json({ message: "Favourite added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFavouritesByUser = async (req, res) => {
  const userId = req.params.id; // Assuming userId is passed as a parameter
  try {
    const favourites = await Favourite.find({ user: userId }).populate({
      path: "item",
      select:
        "-password -emailVerified -phoneVerified -favBrand -shoeSize -potpExpiration -potp -otpExpiration -otp ", // Exclude the 'password' field from the populated 'item'
    });

    res
      .status(201)
      .json({ message: "Favourite fetched successfully", favourites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllFavourites = async (req, res) => {
  try {
    const favourites = await Favourite.find();

    res.json({ favourites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFavourite = async (req, res) => {
  const { user, item } = req.body;

  try {
    // Delete the Favourite entry that matches the user and item
    const deletedFavourite = await Favourite.findOneAndDelete({ user, item });

    if (!deletedFavourite) {
      return res.status(404).json({ message: "Favourite not found" });
    }

    res.status(200).json({ message: "Favourite removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
