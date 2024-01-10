import slugify from "slugify";
import Product from "../models/Product.js";

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
    const products = await Product.find()
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
    const product = await Product.find({ slug: productId })
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

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
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
