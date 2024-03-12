import AuctionItems from "../models/AuctionItems.js";
import Product from "../models/Product.js";

// Create a new Auction Item
export const createAuctionItem = async (req, res) => {
  try {
    if (req.user.userId !== req.body.sellerId) {
      return res
        .status(400)
        .send("You are not authorized to create this auction item");
    }

    const auctionItem = await AuctionItems.create(req.body);
    const product = await Product.findById(req.body.product);

    // If there's no product with the given id, send back a 404
    if (!product) {
      res.status(404).json({ message: "No product found with that id" });
      return;
    }

    // Add the createdAt timestamp to the product object and save it
    product.status = "Auction";
    await product.save();

    // Send back the newly created auction item
    res.status(201).json(auctionItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all Auction Items
export const getAuctionItemsBySellerId = async (req, res) => {
  try {
    const auctionItems = await AuctionItems.find({
      sellerId: req.params.id,
      auctionId: req.params.auctionId,
    }).populate({
      path: "product",
      select:
        "-productSize -colors -conditions -material -totalLikes  -comments -hitCount",
      populate: [
        {
          path: "galleryImages",
          select:
            "-userType -user -extension -updated -createdAt -updatedAt -size -originalname",
        },
        {
          path: "category",
          select: "title",
        },
        {
          path: "brand",
          select: "title",
        },
      ],
    });
    res.status(200).json(auctionItems);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAuctionItemsByAuctionId = async (req, res) => {
  try {
    const auctionItems = await AuctionItems.find({
      auctionId: req.params.auctionId,
    }).populate({
      path: "product",
      select: " -colors -material -totalLikes  -comments -hitCount",
      populate: [
        {
          path: "galleryImages",
          select:
            "-userType -user -extension -updated -createdAt -updatedAt -size -originalname",
        },
        {
          path: "category",
          select: "title",
        },
        {
          path: "brand",
          select: "title",
        },
        {
          path: "productSize",
          select: "title",
        },
        {
          path: "conditions",
          select: "title",
        },
      ],
    });
    res.status(200).json(auctionItems);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
// Get a specific Auction Item by ID
export const getAuctionItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const auctionItem = await AuctionItems.findById(id).populate({
      path: "product",
      select: "-comments -updatedAt",
      populate: [
        {
          path: "conditions",
          select: "title",
        },
        {
          path: "category",
          select: "title",
        },
        {
          path: "brand",
          select: "title",
        },
        {
          path: "material",
          select: "title",
        },
        {
          path: "sellerId",
          select: "_id name address slug image",
          populate: {
            path: "image",
            select:
              "-userType -user -extension -updated -createdAt -updatedAt -size -originalname",
          },
        },
        {
          path: "colors",
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
    });
    if (!auctionItem)
      return res.status(404).json({ message: "Auction Item not found" });
    res.status(200).json(auctionItem);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteAuctionItem = async (req, res) => {
  const { id } = req.params;

  try {
    const auctionItem = await AuctionItems.findById(id);
    if (!auctionItem) {
      return res.status(400).send("Auction Item not found");
    }
    if (auctionItem.sellerId.toString() !== req.user.userId) {
      return res.status(400).send("Not authorized");
    }
    const product = await Product.findById(auctionItem.product);

    // If there's no product with the given id, send back a 404
    if (!product) {
      res.status(404).json({ message: "No product found with that id" });
      return;
    }

    // Add the createdAt timestamp to the product object and save it
    product.status = "Active";
    await product.save();

    await AuctionItems.deleteOne({ _id: id }).exec();

    res.status(201).json({ message: "Deleted Successfully!" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
