import Cart from "../models/Cart.js";
import Comments from "../models/Comments.js";
import Orders from "../models/Orders.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import CouponSettings from "../models/CouponSettings.js";

// Controller to create a new order

const generateOrderNumber = async () => {
  let orderNumber;
  let existingOrder; // Define the variable here
  do {
    // Generate a random number between 1 and 9999999999 (10 digits)
    orderNumber = Math.floor(Math.random() * 9999999999) + 1;
    // Check if the generated order number already exists in the database
    existingOrder = await Orders.findOne({ orderNumber });
  } while (existingOrder);

  return orderNumber;
};

export const createOrder = async (req, res) => {
  try {
    const orderNumber = await generateOrderNumber();
    if (req.body.userId !== req.user.userId) {
      return res.status(404).json({ error: "Authentication Requried" });
    }
    const newOrder = new Orders({
      ...req.body,
      orderNumber,
    });

    const savedOrder = await newOrder.save();

    const updatedProduct = await Product.findByIdAndUpdate(
      req.body.item,
      { status: "Sold" },
      { new: true }
    );

    const deleteCartItems = await Cart.findOneAndDelete({
      item: req.body.item,
      userId: req.body.userId,
    });
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to get a specific order by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Orders.findById(orderId)
      .populate({
        path: "item",
        populate: {
          path: "productId",
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
        },
        // select: "_id title price",
      })
      .populate({
        path: "sellerId",
        select: "name _id image email phone",
        populate: [
          {
            path: "image",
            select:
              "-userType -user -extension -updated -createdAt -updatedAt -size -originalname",
          },
        ],
      })
      .populate({
        path: "userId",
        select: "name _id image email phone",
        populate: [
          {
            path: "image",
            select:
              "-userType -user -extension -updated -createdAt -updatedAt -size -originalname",
          },
        ],
      });

    if (!order) {
      return res.status(201).json({ message: "Order not found" });
    }
    const reviews = await Comments.find({
      seller: order.sellerId._id,
    });
    const averageRating = calculateRoundedAverageRating(reviews);

    res.status(200).json({ order, averageRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to get a specific order by USER ID
export const getOrderByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId !== req.user.userId) {
      return res.status(404).json({ error: "Authentication Requried" });
    }
    const filter = { userId };
    if (req?.query?.status) {
      filter.status = req?.query?.status;
    }
    const order = await Orders.find(filter)
      .populate({
        path: "item",
        populate: {
          path: "productId",
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
        },
        // select: "_id title price",
      })
      .populate({
        path: "sellerId",
        select: "name _id image",
        populate: [
          {
            path: "image",
            select:
              "-userType -user -extension -updated -createdAt -updatedAt -size -originalname",
          },
        ],
      });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const cartWithAverageRatings = await Promise.all(
      order.map(async (cartItem) => {
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
// Controller to get a specific order by USER ID
export const getOrderBySellerId = async (req, res) => {
  try {
    const { sellerId } = req.params;
    if (sellerId !== req.user.userId) {
      return res.status(404).json({ error: "Authentication Requried" });
    }
    const filter = { sellerId };
    if (req?.query?.status) {
      filter.status = req?.query?.status;
    }
    const order = await Orders.find(filter)
      .populate({
        path: "item",
        populate: {
          path: "productId",
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
        },
        // select: "_id title price",
      })
      .populate({
        path: "sellerId",
        select: "name _id image",
        populate: [
          {
            path: "image",
            select:
              "-userType -user -extension -updated -createdAt -updatedAt -size -originalname",
          },
        ],
      });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const cartWithAverageRatings = await Promise.all(
      order.map(async (cartItem) => {
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
// Controller to update an order by ID
export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updatedOrder = await Orders.findByIdAndUpdate(orderId, req.body, {
      new: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to delete an order by ID
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deletedOrder = await Orders.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createOrders = async (req, res) => {
  try {
    const {
      userId,
      sellerId,
      item,
      bundleDiscount,
      bundleDisPercentage,
      deliveryFee,
      totalPayment,
      deliveryAddress,
    } = req.body;
    if (req.body.userId !== req.user.userId) {
      return res.status(404).json({ error: "Authentication Requried" });
    }
    // Assuming you have a function to generate a unique order number
    const orderNumber = await generateOrderNumber();

    // Create an array to hold the order items
    const orderItems = [];
    // Iterate through the items and create order item instances
    for (const sitem of item) {
      const orderItem = {
        productId: sitem._id,

        laundryFee: sitem.laundryFee,
        servicePercentage: sitem.servicePercentage,
      };

      orderItems.push(orderItem);

      // await updateProductStatus(sitem._id);

      // await Cart.findOneAndDelete({
      //   item: sitem._id,
      //   userId: userId,
      // });
    }

    const order = new Orders({
      userId,
      sellerId,
      item: orderItems,
      orderNumber,
      bundleDiscount,
      bundleDisPercentage,
      deliveryFee,
      totalPayment,
      deliveryAddress,
    });

    // // Save the order to the database
    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateCartStatus = async (req, res) => {
  if (req.body.userId !== req.user.userId) {
    return res.status(404).json({ error: "Authentication Requried" });
  }

  try {
    const _id = req.params.id;
    const SingleOrder = await Orders.findById(_id);
    const data = await Orders.findByIdAndUpdate(
      _id,
      { status: req.body.status },
      { new: true }
    );
    const couponSettings = await CouponSettings.find();
    const status = ["Cancelled", "On-hold", "Processing"];

    if (data.status === "Delivered") {
      const user = await User.findById(data.userId);
      const seller = await User.findById(data.sellerId);
      user.purchaseCount = user.purchaseCount + 1;
      seller.salesCount = seller.salesCount + 1;
      if (
        parseInt(user.purchaseCount) >= parseInt(couponSettings[0].quantity)
      ) {
        user.purchaseCount = 0;
      }
      await user.save();
      await seller.save();
    } else if (!status.includes(SingleOrder?.status)) {
      const user = await User.findById(data.userId);
      const seller = await User.findById(data.sellerId);

      user.purchaseCount = user.purchaseCount - 1;
      seller.salesCount = seller.salesCount === 0 ? 0 : seller.salesCount - 1;
      await seller.save();
      await user.save();
    }
    res.status(201).send("Update success");
  } catch (error) {
     res.status(500).json({ error: "Internal Server Error" });
  }
};
