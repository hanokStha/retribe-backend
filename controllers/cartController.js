import { ObjectId } from "mongodb";
import Cart from "../models/Cart.js";
import Comments from "../models/Comments.js";

// Create a new cart item
const createCart = async (req, res) => {
  try {
    const { userId, item, laundryFee, sellerId, bundleDiscount, isBundle } =
      req.body;
    if (userId !== req.user.userId) {
      return res.status(404).json({ error: "Authentication Requried" });
    }
    const newCart = await Cart.create({
      userId,
      item,
      laundryFee,
      sellerId,
      bundleDiscount,
      isBundle,
    });
    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all cart items
const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a cart item
const deleteCart = async (req, res) => {
  try {
    const { userId, item } = req.params;
    if (userId !== req.user.userId) {
      return res.status(404).json({ error: "Authentication Requried" });
    }
    await Cart.findOneAndDelete({ userId, item });
    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteMultiple = async (req, res) => {
  try {
    const { userId } = req.params;
    const { itemIds } = req.body; // Assuming itemIds is an array of item IDs to delete
    const idObjects = itemIds.map((id) => new ObjectId(id));

    // Check if the user is authenticated
    if (userId !== req.user.userId) {
      return res.status(401).json({ error: "Authentication Required" });
    }

    // Use $in operator to delete multiple items based on their IDs
    const deletionResult = await Cart.deleteMany({
      userId,
      item: { $in: idObjects },
    });

    res.status(200).json({
      message: `${deletionResult.deletedCount} cart items deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get cart by userId
const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.find({ userId })
      .populate({
        path: "item",
        select: "_id title price",
        populate: [
          {
            path: "brand",
            select: "title",
          },
          {
            path: "productSize",
            select: "title",
          },
          {
            path: "galleryImages",
            select:
              "-userType -user -extension -updated -createdAt -updatedAt -size -originalname",
          },
        ],
      })
      .populate({
        path: "sellerId",
        select: "name _id image",
        populate: [
          {
            path: "image",
            select: "-userType -user  -updated  -updatedAt -size ",
          },
        ],
      });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    // Fetch reviews for each seller and calculate average ratings
    const cartWithAverageRatings = await Promise.all(
      cart.map(async (cartItem) => {
        const reviews = await Comments.find({
          seller: cartItem.sellerId._id,
        });
        const averageRating = calculateRoundedAverageRating(reviews);
        return {
          ...cartItem.toObject(),
          sellerId: { ...cartItem.sellerId.toObject(), averageRating },
        };
      })
    );

    res.status(200).json(cartWithAverageRatings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

function calculateRoundedAverageRating(reviews) {
  if (!reviews || reviews.length === 0) {
    // Handle case with no reviews
    return 0;
  }

  const totalStars = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalStars / reviews.length;

  // Round the average rating to the closest star or half star
  const roundedRating = Math.round(averageRating * 4) / 4;

  return roundedRating;
}

const countTotalCartForUsers = async (req, res) => {
  // Count total number of products in users' carts

  try {
    const { userId } = req.params;
    const count = await Cart.countDocuments({ userId });
    return res.status(200).json(count);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getCartByProductId = async (req, res) => {
  try {
    const { userId, item } = req.params;
    const cart = await Cart.findOne({ userId, item });

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllItemsBySellerId = async (req, res) => {
  try {
    const result = await Cart.aggregate([
      {
        $lookup: {
          from: "Products", // Replace "Products" with the actual name of your product collection
          localField: "item",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $group: {
          _id: "$sellerId",
          products: {
            $push: {
              _id: "$item",
              laundryFee: "$laundryFee",
              // Add other product fields you want to include
              // For example: name: "$productInfo.name", price: "$productInfo.price"
            },
          },
        },
      },
      {
        $lookup: {
          from: "Users", // Replace "Users" with the actual name of your user collection
          localField: "_id",
          foreignField: "_id",
          as: "sellerInfo",
        },
      },
      {
        $unwind: "$sellerInfo",
      },
      {
        $project: {
          _id: 0,
          seller: "$sellerInfo.username", // Change "username" to the field you want to use for the seller's name
          products: 1,
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteAllCartsBySellerId = async (req, res) => {
  try {
    const { sellerId, userId } = req.params; // Assuming you're passing sellerId as a URL parameter
    if (userId !== req.user.userId) {
      return res.status(404).json({ error: "Authentication Requried" });
    }
    const result = await Cart.deleteMany({ sellerId, userId });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No cart items found for the given sellerId." });
    }
    res.status(200).json({
      message:
        "All cart items for the given sellerId have been successfully deleted.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  createCart,
  getAllCarts,
  deleteCart,
  getCartByUserId,
  getCartByProductId,
  countTotalCartForUsers,
  getAllItemsBySellerId,
  deleteAllCartsBySellerId,
  deleteMultiple,
};
