import slugify from "slugify";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import Category from "../models/Category.js";
import User from "../models/User.js";
import Comments from "../models/Comments.js";
import algoliasearch from "algoliasearch";
const client = algoliasearch("BD6BE3PVLK", "5b31e16a3b6b30edce05e467d09a7003");
const index = client.initIndex("ProductIndex");

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      metaDesc,
      description,
      category,
      brand,
      productSize,
      colors,
      material,
      conditions,
      price,
      status,
      totalLikes,
      sellerId,
      galleryImages,
    } = req.body;
    if (sellerId !== req.user.userId) {
      return res.status(404).json({ error: "Authentication Requried" });
    }
    const baseSlug = slugify(title, { lower: true }); // Generate base slug from title
    let slug = baseSlug;
    let suffix = 1;

    while (true) {
      const existingPress = await Product.findOne({ slug });
      if (!existingPress) {
        break;
      } else {
        // If slug already exists, increment suffix and generate new slug
        suffix++;
        slug = `${baseSlug}-${suffix}`;
      }
    }

    const newProduct = new Product({
      title,
      slug,
      metaDesc,
      description,
      category,
      galleryImages,
      brand,
      productSize,
      colors,
      material,
      conditions,
      price,
      status,
      totalLikes,
      sellerId,
    });

    // Save the admin to the database
    await newProduct.save();

    return res.status(200).json({
      message: "Product added successfully",
      success: true,
      newProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id; // Assuming the product ID is passed in the URL params
    const updateData = req.body; // Data to update
    if (req.body.sellerId !== req.user.userId) {
      return res.status(404).json({ error: "Authentication Requried" });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      success: true,
      updatedProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy } = req.query;
    const usersWithProducts = await User.find(); // You might want to adjust this based on your actual schema and how users are associated with products.

    const calculateRoundedAverageRating = (reviews) => {
      if (!reviews || reviews.length === 0) {
        return 0;
      }

      const totalStars = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating = totalStars / reviews.length;

      const roundedRating = Math.round(averageRating * 4) / 4;

      return roundedRating;
    };

    const usersWithAverageRating = await Promise.all(
      usersWithProducts.map(async (user) => {
        const reviews = await Comments.find({ seller: user._id });
        const averageRating = calculateRoundedAverageRating(reviews);
        return { userId: user._id, averageRating };
      })
    );

    const filter = { status: "Active" };
    const getAllChildCategoryIds = async (categoryId) => {
      const childCategories = await Category.find({
        parent: categoryId,
      }).select("_id");

      const childCategoryIds = childCategories.map((child) => child._id);

      const allDescendantIds = await Promise.all(
        childCategoryIds.map((childId) => getAllChildCategoryIds(childId))
      );

      return [...childCategoryIds, ...allDescendantIds.flat()];
    };

    if (req.query.categoryIds) {
      const categoryIds = req.query.categoryIds.split(",");

      const categoryObjectIds = categoryIds.map(
        (id) => new mongoose.Types.ObjectId(id)
      );

      const allCategoryIds = await Promise.all(
        categoryObjectIds.map((categoryId) =>
          getAllChildCategoryIds(categoryId)
        )
      );

      const allId = [...categoryObjectIds, ...[].concat(...allCategoryIds)];

      filter.category = { $in: allId };
    }

    if (req.query.brand) {
      const brandId = req.query.brand.split(",");
      filter.brand = { $in: brandId };
    }
    if (req.query.productSize) {
      const sizeId = req.query.productSize.split(",");
      filter.productSize = { $in: sizeId };
    }
    if (req.query.colors) {
      const colorid = req.query.colors.split(",");
      filter.colors = { $in: colorid };
    }
    if (req.query.material) {
      const materialid = req.query.material.split(",");
      filter.material = { $in: materialid };
    }
    if (req.query.conditions) {
      const conditionsid = req.query.conditions.split(",");
      filter.conditions = { $in: conditionsid };
    }

    if (req.query.sellerRating) {
      const minSellerRating = parseFloat(req.query.sellerRating);
      const filteredUserIds = usersWithAverageRating
        .filter((user) => user.averageRating == minSellerRating)
        .map((user) => user.userId);

      filter.sellerId = { $in: filteredUserIds };
    }

    if (req.query.minPrice || req.query.maxPrice) {
      const priceFilter = {};

      if (req.query.minPrice) {
        priceFilter.$gte = parseFloat(req.query.minPrice);
      }

      if (req.query.maxPrice) {
        priceFilter.$lte = parseFloat(req.query.maxPrice);
      }

      filter.price = priceFilter;
    }

    let opt = { createdAt: -1 };
    if (sortBy) {
      switch (sortBy) {
        case "HL":
          opt = { price: -1 }; // Sort by price high to low
          break;
        case "LH":
          opt = { price: 1 }; // Sort by price low to high
          break;
        case "NF":
          opt = { createdAt: -1 }; // Sort by newest first
          break;
        // Add more cases for other sorting options if needed
        default:
          opt = { createdAt: -1 };
          break;
      }
    } else {
      opt = { createdAt: -1 };
    }
    const options = {
      page: parseInt(page, 10),
      populate: [
        "material",
        "conditions",
        "colors",
        "productSize",
        "brand",
        {
          path: "galleryImages",
          select:
            "-userType -user -extension -updated -createdAt -updatedAt -size -originalname",
        },
        "category",
      ],
      limit: parseInt(limit, 10),
      sort: opt, // Sorting by the 'createdAt' field in descending order (-1 for descending, 1 for ascending)
    };

    const productsPaginated = await Product.paginate(filter, options);

    return res.status(200).json({ success: true, productsPaginated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllProductsForAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy } = req.query;
    const activeDocs = await Product.countDocuments({ status: "Active" });
    const allDocs = await Product.countDocuments();
    const inactiveDocs = await Product.countDocuments({ status: "Inactive" });
    const soldDocs = await Product.countDocuments({ status: "Sold" });
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const getAllChildCategoryIds = async (categoryId) => {
      const childCategories = await Category.find({
        parent: categoryId,
      }).select("_id");

      const childCategoryIds = childCategories.map((child) => child._id);

      const allDescendantIds = await Promise.all(
        childCategoryIds.map((childId) => getAllChildCategoryIds(childId))
      );

      return [...childCategoryIds, ...allDescendantIds.flat()];
    };

    if (req.query.categoryIds) {
      const categoryIds = req.query.categoryIds.split(",");

      const categoryObjectIds = categoryIds.map(
        (id) => new mongoose.Types.ObjectId(id)
      );

      const allCategoryIds = await Promise.all(
        categoryObjectIds.map((categoryId) =>
          getAllChildCategoryIds(categoryId)
        )
      );

      const allId = [...categoryObjectIds, ...[].concat(...allCategoryIds)];

      filter.category = { $in: allId };
    }

    if (req.query.brand) {
      const brandId = req.query.brand.split(",");
      filter.brand = { $in: brandId };
    }
    if (req.query.productSize) {
      const sizeId = req.query.productSize.split(",");
      filter.productSize = { $in: sizeId };
    }
    if (req.query.colors) {
      const colorid = req.query.colors.split(",");
      filter.colors = { $in: colorid };
    }
    if (req.query.material) {
      const materialid = req.query.material.split(",");
      filter.material = { $in: materialid };
    }
    if (req.query.conditions) {
      const conditionsid = req.query.conditions.split(",");
      filter.conditions = { $in: conditionsid };
    }

    if (req.query.sellerRating) {
      const minSellerRating = parseFloat(req.query.sellerRating);
      const filteredUserIds = usersWithAverageRating
        .filter((user) => user.averageRating == minSellerRating)
        .map((user) => user.userId);

      filter.sellerId = { $in: filteredUserIds };
    }

    if (req.query.minPrice || req.query.maxPrice) {
      const priceFilter = {};

      if (req.query.minPrice) {
        priceFilter.$gte = parseFloat(req.query.minPrice);
      }

      if (req.query.maxPrice) {
        priceFilter.$lte = parseFloat(req.query.maxPrice);
      }

      filter.price = priceFilter;
    }

    let opt = { createdAt: -1 };
    if (sortBy) {
      switch (sortBy) {
        case "HL":
          opt = { price: -1 }; // Sort by price high to low
          break;
        case "LH":
          opt = { price: 1 }; // Sort by price low to high
          break;
        case "NF":
          opt = { createdAt: -1 }; // Sort by newest first
          break;
        // Add more cases for other sorting options if needed
        default:
          opt = { createdAt: -1 };
          break;
      }
    } else {
      opt = { createdAt: -1 };
    }
    const options = {
      page: parseInt(page, 10),
      populate: [
        {
          path: "productSize",
          select: "_id title",
        },
        {
          path: "sellerId",
          select: "_id name email image",
          populate: {
            path: "image",
            select:
              "-userType -user -extension -updated -createdAt -updatedAt -size -originalname",
          },
        },
        {
          path: "brand",
          select: "_id title",
        },
        {
          path: "category",
          select: "_id title",
        },

        {
          path: "galleryImages",
          select:
            "-userType -user -extension -updated -createdAt -updatedAt -size -originalname",
        },
      ],
      limit: parseInt(limit, 10),
      sort: opt, // Sorting by the 'createdAt' field in descending order (-1 for descending, 1 for ascending)
    };

    const productsPaginated = await Product.paginate(filter, options);

    return res.status(200).json({
      success: true,
      productsPaginated,
      activeDocs,
      inactiveDocs,
      soldDocs,
      allDocs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getLatestProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "Active" })
      .limit(5)
      .sort({ createdAt: -1 })
      .populate("category")
      .populate("productSize")
      .populate("material")
      .populate("conditions")
      .populate({
        path: "galleryImages",
        select:
          "-userType -user -extension -updated -createdAt -updatedAt -size -originalname", // Exclude userType, user, and _id fields
      })
      .populate("colors")
      .populate("brand");
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMostLovedProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "Active" })
      .limit(5)
      .sort({ totalLikes: -1 })
      .populate("category")
      .populate("productSize")
      .populate("material")
      .populate("conditions")
      .populate({
        path: "galleryImages",
        select:
          "-userType -user -extension -updated -createdAt -updatedAt -size -originalname", // Exclude userType, user, and _id fields
      })
      .populate("colors")
      .populate("brand");
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOne({ slug: productId })
      .populate("category")
      .populate("productSize")
      .populate("material")
      .populate("conditions")
      .populate({
        path: "galleryImages",
        select:
          "-userType -user -extension -updated -createdAt -updatedAt -size -originalname", // Exclude userType, user, and _id fields
      })
      .populate("colors")
      .populate("brand")
      .populate({
        path: "sellerId",
        select: "_id name address slug image",
        populate: {
          path: "image",
          select:
            "-userType -user -extension -updated -createdAt -updatedAt -size -originalname",
        },
      });

    if (!product) {
      return res.status(201).json({ message: "Product not found" });
    }

    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProductBySellerId = async (req, res) => {
  try {
    const sellerId = req.params.id;
    const totalCount = await Product.countDocuments({ sellerId });

    const { page = 1, limit = 10, status } = req.query; // Default to page 1 and 10 items per page
    const filter = { sellerId }; // Filter by sellerId initially

    if (status) {
      filter.status = status;
    }
    const options = {
      page: parseInt(page, 10),
      populate: [
        "material",
        "conditions",
        "colors",
        "productSize",
        "brand",
        {
          path: "galleryImages",
          select:
            "-userType -user -extension -updated -createdAt -updatedAt -size -originalname",
        },
        "category",
      ],
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 }, // Sorting by the 'createdAt' field in descending order (-1 for descending, 1 for ascending)
    };

    // Use the paginate method provided by mongoose-paginate-v2
    const productsPaginated = await Product.paginate(filter, options);

    if (!productsPaginated) {
      return res.status(404).json({ message: "Products not found" });
    }

    // Populate the fields in the paginated results

    return res
      .status(200)
      .json({ success: true, productsPaginated, totalCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProductBySellerIdActive = async (req, res) => {
  try {
    const sellerId = req.params.id;
    const totalCount = await Product.countDocuments({
      sellerId,
      status: "Active",
    });

    const { page = 1, limit = 10, status } = req.query;
    const filter = { sellerId, status: "Active" };

    const getAllChildCategoryIds = async (categoryId) => {
      const childCategories = await Category.find({
        parent: categoryId,
      }).select("_id");

      const childCategoryIds = childCategories.map((child) => child._id);

      const allDescendantIds = await Promise.all(
        childCategoryIds.map((childId) => getAllChildCategoryIds(childId))
      );

      return [...childCategoryIds, ...allDescendantIds.flat()];
    };

    if (req.query.categoryIds) {
      const categoryIds = req.query.categoryIds.split(",");

      const categoryObjectIds = categoryIds.map(
        (id) => new mongoose.Types.ObjectId(id)
      );

      const allCategoryIds = await Promise.all(
        categoryObjectIds.map((categoryId) =>
          getAllChildCategoryIds(categoryId)
        )
      );

      const allId = [...categoryObjectIds, ...[].concat(...allCategoryIds)];
      filter.category = { $in: allId };
    }
    const options = {
      page: parseInt(page, 10),
      populate: [
        "material",
        "conditions",
        "colors",
        "productSize",
        "brand",
        {
          path: "galleryImages",
          select:
            "-userType -user -extension -updated -createdAt -updatedAt -size -originalname",
        },
        "category",
      ],
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
    };

    const productsPaginated = await Product.paginate(filter, options);

    if (!productsPaginated) {
      return res.status(404).json({ message: "Products not found" });
    }

    return res
      .status(200)
      .json({ success: true, productsPaginated, totalCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const getAllSellerProduct = async (req, res) => {
  try {
    const sellerId = req.params.id;
    const product = await Product.find({ sellerId, status: "Active" })
      .populate("category")
      .populate("productSize")
      .populate("material")
      .populate("conditions")
      .populate({
        path: "galleryImages",
        select:
          "-userType -user -extension -updated -createdAt -updatedAt -size -originalname", // Exclude userType, user, and _id fields
      })
      .populate("colors")
      .populate("brand")
      .populate({
        path: "sellerId",
        select: "_id name address slug image",
        populate: {
          path: "image",
          select:
            "-userType -user -extension -updated -createdAt -updatedAt -size -originalname",
        },
      });

    if (!product) {
      return res.status(201).json({ message: "Product not found" });
    }

    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
      success: true,
      deletedProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getPriceRange = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $match: {
          status: "Active", // Filter for active products
        },
      },
      {
        $group: {
          _id: null,
          maxPrice: { $max: "$price" },
          minPrice: { $min: "$price" },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(404).json({ error: "No active products found" });
    }

    const { maxPrice, minPrice } = result[0];
    return res.json({ maxPrice, minPrice });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const verifyProductbyAdmin = async (req, res) => {
  try {
    const productId = req.params.id;
    const { status } = req.body; // Destructure status from req.body

    // Ensure status is provided in the request body
    if (!status) {
      return res
        .status(400)
        .json({ error: "Status is required in the request body" });
    }

    // Update only the 'status' field in the document
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: { status } },
      { new: true }
    )
      .populate({
        path: "category",
        select: "title",
      }) 
      .populate({
        path: "galleryImages",
        select: "thumb",
      });
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    try {
      if (updatedProduct.status === "Active") {
        const res = await index
          .saveObject({
            title: updatedProduct.title,
            category: updatedProduct.category,
            objectID: updatedProduct._id,
            slug: updatedProduct.slug,
            featureImage: updatedProduct.galleryImages[0].thumb,
          })
          .wait();
      } else {
        await index.deleteObject(updatedProduct._id.toString()); // Remove the product from the index
      }
    } catch (error) {
      res.status(500).json(error);
    }

    return res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
