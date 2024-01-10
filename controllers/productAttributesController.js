// Create a color
import Colors from "../models/Colors.js";
import Brands from "../models/Brands.js";
import Sizes from "../models/Sizes.js";
import Material from "../models/Material.js";
import Condition from "../models/Condition.js";
import ShoeSize from "../models/ShoeSize.js";
// COLORS CONTROLLER

export const createColor = async (req, res) => {
  try {
    const { colorCode } = req.body;
    const existingSlug = await Colors.findOne({ colorCode });

    if (existingSlug) {
      return res.status(400).json({ message: "This color already exists" });
    }

    const newColor = new Colors({
      colorCode,
    });

    // Save the admin to the database
    await newColor.save();

    return res.status(200).json({
      message: "Color added successfully",
      success: true,
      newColor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllColors = async (req, res) => {
  try {
    const allColors = await Colors.find();
    res.status(200).json(allColors);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getColorById = async (req, res) => {
  try {
    const color = await Colors.findById(req.params.id);
    if (!color) {
      return res.status(404).json({ message: "Color not found" });
    }
    res.status(200).json(color);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateColorById = async (req, res) => {
  try {
    const { colorCode } = req.body;
    const existingSlug = await Colors.findOne({ colorCode });

    if (existingSlug) {
      return res.status(400).json({ message: "This color already exists" });
    }
    const updatedColor = await Colors.findByIdAndUpdate(
      req.params.id,
      { colorCode: req.body.colorCode },
      { new: true }
    );
    if (!updatedColor) {
      return res.status(404).json({ message: "Color not found" });
    }
    res.status(200).json(updatedColor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteColorById = async (req, res) => {
  try {
    const deletedColor = await Colors.findByIdAndDelete(req.params.id);
    if (!deletedColor) {
      return res.status(404).json({ message: "Color not found" });
    }
    res.status(200).json(deletedColor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// BRANDS CONTROLLER

export const createBrand = async (req, res) => {
  try {
    const { brandName } = req.body;
    const existingSlug = await Brands.findOne({ brandName });

    if (existingSlug) {
      return res.status(400).json({ message: "This brand already exists" });
    }

    const newColor = new Brands({
      brandName,
    });

    // Save the admin to the database
    await newColor.save();

    return res.status(200).json({
      message: "Brands added successfully",
      success: true,
      newColor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllBrands = async (req, res) => {
  try {
    const allColors = await Brands.find();
    res.status(200).json(allColors);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getBrandById = async (req, res) => {
  try {
    const color = await Brands.findById(req.params.id);
    if (!color) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json(color);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBrandsById = async (req, res) => {
  try {
    const { brandName } = req.body;
    const existingSlug = await Brands.findOne({ brandName });

    if (existingSlug) {
      return res.status(400).json({ message: "This brand already exists" });
    }
    const updatedColor = await Brands.findByIdAndUpdate(
      req.params.id,
      { brandName: req.body.brandName },
      { new: true }
    );
    if (!updatedColor) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json(updatedColor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBrandById = async (req, res) => {
  try {
    const deletedBrands = await Brands.findByIdAndDelete(req.params.id);
    if (!deletedBrands) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json(deletedBrands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// SIZE CONTROLLER

export const createSize = async (req, res) => {
  try {
    const { size } = req.body;
    const existingSlug = await Sizes.findOne({ size });

    if (existingSlug) {
      return res.status(400).json({ message: "This size already exists" });
    }

    const newColor = new Sizes({
      size,
    });

    // Save the admin to the database
    await newColor.save();

    return res.status(200).json({
      message: "Size added successfully",
      success: true,
      newColor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllSizes = async (req, res) => {
  try {
    const allColors = await Sizes.find();
    res.status(200).json(allColors);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getSizeById = async (req, res) => {
  try {
    const color = await Sizes.findById(req.params.id);
    if (!color) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json(color);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSizeById = async (req, res) => {
  try {
    const { size } = req.body;
    const existingSlug = await Sizes.findOne({ size });

    if (existingSlug) {
      return res.status(400).json({ message: "This size already exists" });
    }
    const updatedColor = await Sizes.findByIdAndUpdate(
      req.params.id,
      { size: req.body.size },
      { new: true }
    );
    if (!updatedColor) {
      return res.status(404).json({ message: "Size not found" });
    }
    res.status(200).json(updatedColor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSizeById = async (req, res) => {
  try {
    const deletedBrands = await Sizes.findByIdAndDelete(req.params.id);
    if (!deletedBrands) {
      return res.status(404).json({ message: "Size not found" });
    }
    res.status(200).json(deletedBrands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// SHOE SIZE CONTROLLER

export const createShoeSize = async (req, res) => {
  try {
    const { size } = req.body;
    const existingSlug = await ShoeSize.findOne({ size });

    if (existingSlug) {
      return res.status(400).json({ message: "This shoe size already exists" });
    }

    const newColor = new ShoeSize({
      size,
    });

    // Save the admin to the database
    await newColor.save();

    return res.status(200).json({
      message: "Show Size added successfully",
      success: true,
      newColor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllShowSizes = async (req, res) => {
  try {
    const allColors = await ShoeSize.find();
    res.status(200).json(allColors);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getShoeSizeById = async (req, res) => {
  try {
    const color = await ShoeSize.findById(req.params.id);
    if (!color) {
      return res.status(404).json({ message: "SHOE size not found" });
    }
    res.status(200).json(color);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateShoeSizeById = async (req, res) => {
  try {
    const { size } = req.body;
    const existingSlug = await ShoeSize.findOne({ size });

    if (existingSlug) {
      return res.status(400).json({ message: "This shoe size already exists" });
    }
    const updatedColor = await ShoeSize.findByIdAndUpdate(
      req.params.id,
      { size: req.body.size },
      { new: true }
    );
    if (!updatedColor) {
      return res.status(404).json({ message: "Shoe Size not found" });
    }
    res.status(200).json(updatedColor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteShowSizeById = async (req, res) => {
  try {
    const deletedBrands = await ShoeSize.findByIdAndDelete(req.params.id);
    if (!deletedBrands) {
      return res.status(404).json({ message: "Show Size not found" });
    }
    res.status(200).json(deletedBrands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// MATERIAL CONTROLLER

export const createMaterial = async (req, res) => {
  try {
    const { material } = req.body;
    const existingSlug = await Material.findOne({ material });

    if (existingSlug) {
      return res.status(400).json({ message: "This material already exists" });
    }

    const newColor = new Material({
      material,
    });

    // Save the admin to the database
    await newColor.save();

    return res.status(200).json({
      message: "Material added successfully",
      success: true,
      newColor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllMaterial = async (req, res) => {
  try {
    const allColors = await Material.find();
    res.status(200).json(allColors);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getMaterialById = async (req, res) => {
  try {
    const color = await Material.findById(req.params.id);
    if (!color) {
      return res.status(404).json({ message: "Material not found" });
    }
    res.status(200).json(color);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMaterialById = async (req, res) => {
  try {
    const { material } = req.body;
    const existingSlug = await Material.findOne({ material });

    if (existingSlug) {
      return res.status(400).json({ message: "This material already exists" });
    }
    const updatedColor = await Material.findByIdAndUpdate(
      req.params.id,
      { material: req.body.material },
      { new: true }
    );
    if (!updatedColor) {
      return res.status(404).json({ message: "Material not found" });
    }
    res.status(200).json(updatedColor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMaterialById = async (req, res) => {
  try {
    const deletedBrands = await Material.findByIdAndDelete(req.params.id);
    if (!deletedBrands) {
      return res.status(404).json({ message: "Material not found" });
    }
    res.status(200).json(deletedBrands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CONDITON CONTROLLER

export const createCondition = async (req, res) => {
  try {
    const { condition } = req.body;
    const existingSlug = await Condition.findOne({ condition });

    if (existingSlug) {
      return res.status(400).json({ message: "This condition already exists" });
    }

    const newColor = new Condition({
      condition,
    });

    // Save the admin to the database
    await newColor.save();

    return res.status(200).json({
      message: "Condition added successfully",
      success: true,
      newColor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllCondition = async (req, res) => {
  try {
    const allColors = await Condition.find();
    res.status(200).json(allColors);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getConditionById = async (req, res) => {
  try {
    const color = await Condition.findById(req.params.id);
    if (!color) {
      return res.status(404).json({ message: "Condition not found" });
    }
    res.status(200).json(color);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateConditionById = async (req, res) => {
  try {
    const { condition } = req.body;

    const existingSlug = await Condition.findOne({ condition });

    if (existingSlug) {
      return res.status(400).json({ message: "This condition already exists" });
    }
    const updatedColor = await Condition.findByIdAndUpdate(
      req.params.id,
      { condition: req.body.condition },
      { new: true }
    );
    if (!updatedColor) {
      return res.status(404).json({ message: "Condition not found" });
    }
    res.status(200).json(updatedColor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteConditionById = async (req, res) => {
  try {
    const deletedBrands = await Condition.findByIdAndDelete(req.params.id);
    if (!deletedBrands) {
      return res.status(404).json({ message: "Condition not found" });
    }
    res.status(200).json(deletedBrands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
