import Comments from "../models/Comments.js";
import Favourite from "../models/Favourite.js";
import Product from "../models/Product.js";

export const addFavourite = async (req, res) => {
  const { user, item, favoriteType } = req.body;

  try {
    // Create a new Favourite entry
    const newFavourite = new Favourite({
      user,
      item,
      favoriteType,
    });
    if (user !== req.user.userId) {
      return res.status(404).json({ error: "Authentication Requried" });
    }
    if (favoriteType === "Products") {
      // Bypass validation for this update
      const productFav = await Product.findByIdAndUpdate(
        item,
        { $inc: { totalLikes: 1 } },
        { new: true, runValidators: false }
      );

      if (!productFav) {
        // Handle the case where the product is not found
        return res.status(404).json({ message: "Product not found" });
      }
    }

    await newFavourite.save();
    res.status(201).json({ message: "Favourite added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFavouritesByUser = async (req, res) => {
  const userId = req.params.id; // Assuming userId is passed as a parameter
  try {
    if (userId !== req.user.userId) {
      return res.status(404).json({ error: "Authentication Requried" });
    }
    const favourites = await Favourite.find(
      { user: userId },
      "-createdAt -updatedAt"
    ).populate({
      path: "item",
      select:
        "-password -emailVerified -phoneVerified -favBrand -shoeSize -potpExpiration -potp -otpExpiration -otp -brand -category -colors -comments -description -createdAt -material -sellerId -updatedAt",
      populate: [
        {
          path: "conditions",
          select: "title",
          strictPopulate: false,
        },
        {
          path: "productSize",
          select: "title",
          strictPopulate: false,
        },
        {
          path: "galleryImages",
          select:
            "-userType -user -extension -updated -createdAt -updatedAt -size -originalname",
          strictPopulate: false,
        },
        {
          path: "image",
          select:
            "-userType -user -extension -updated -createdAt -updatedAt -size -originalname",
          strictPopulate: false,
        },
      ],
    });

    async function fetchReviewsForSeller(sellerId) {
      try {
        const reviews = await Comments.find({ seller: sellerId });
        return reviews;
      } catch (error) {
        throw new Error(
          `Error fetching reviews for seller ${sellerId}: ${error.message}`
        );
      }
    }

    async function fetchProductCount(sellerId) {
      try {
        const reviews = await Product.countDocuments({
          sellerId,
          status: "Active",
        });
        return reviews;
      } catch (error) {
        throw new Error(
          `Error fetching reviews for seller ${sellerId}: ${error.message}`
        );
      }
    }

    // Function to calculate rounded average rating
    function calculateRoundedAverageRating(reviews) {
      if (!reviews || reviews.length === 0) {
        // Handle case with no reviews
        return 0;
      }

      const totalStars = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating = totalStars / reviews.length;

      // Round the average rating to the closest star or half star
      const roundedRating = Math.round(averageRating * 4) / 4;

      return roundedRating;
    }

    // Update the favourites array for favoriteType "seller"
    for (const favorite of favourites) {
      if (favorite.favoriteType === "Users") {
        const sellerId = favorite.item._id;
        const sellerReviews = await fetchReviewsForSeller(sellerId);
        const productCount = await fetchProductCount(sellerId);
        const sellerRatings = calculateRoundedAverageRating(sellerReviews);
        favorite.ratings = sellerRatings;
        favorite.productCount = productCount;
      }
    }

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
  if (user !== req.user.userId) {
    return res.status(404).json({ error: "Authentication Requried" });
  }
  try {
    // Delete the Favourite entry that matches the user and item
    const deletedFavourite = await Favourite.findOneAndDelete({ user, item });

    const productFav = await Product.findByIdAndUpdate(
      item,
      { $inc: { totalLikes: -1 } },
      { new: true, runValidators: false }
    );

    if (!deletedFavourite) {
      return res.status(404).json({ message: "Favourite not found" });
    }

    res.status(200).json({ message: "Favourite removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
