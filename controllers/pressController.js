import Press from "../models/Press.js"; // Adjust the path based on your project structure
import slugify from "slugify";
// Create a new press entry
export const createPress = async (req, res) => {
  try {
    const { title } = req.body;
    const baseSlug = slugify(title, { lower: true }); // Generate base slug from title
    let slug = baseSlug;
    let suffix = 1;

    while (true) {
      const existingPress = await Press.findOne({ slug });
      if (!existingPress) {
        break;
      } else {
        // If slug already exists, increment suffix and generate new slug
        suffix++;
        slug = `${baseSlug}-${suffix}`;
      }
    }

    const newPress = await Press.create({ ...req.body, slug });
    res.status(201).json(newPress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const duplicatePress = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the Press document to duplicate by ID
    const pressToDuplicate = await Press.findById(id);

    if (!pressToDuplicate) {
      return res.status(404).json({ error: "Press not found" });
    }

    // Create a new Press document based on the fields of the selected document
    const { _id, slug, status, ...pressFields } = pressToDuplicate.toObject();
    const baseSlug = slugify(pressFields.title, { lower: true });
    let newSlug = baseSlug;
    let suffix = 1;

    while (true) {
      const similarSlugPress = await Press.findOne({ slug: newSlug });
      if (!similarSlugPress) {
        break;
      } else {
        // If slug already exists, increment suffix and generate new slug
        suffix++;
        newSlug = `${baseSlug}-${suffix}`;
      }
    }

    const newPress = await Press.create({
      ...pressFields,
      title: `${pressFields.title} (Copy)`,
      slug: newSlug,
      status: "Draft"
    });

    res.status(201).json(newPress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all press entries
export const getAllPress = async (req, res) => {
  try {
    const allPress = await Press.find().sort({ createdAt: -1 }).populate({
      path: "image",
      select: "-userType -user -_id", // Exclude userType, user, and _id fields
    });
    res.status(200).json(allPress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPublishedPress = async (req, res) => {
  try {
    const allPress = await Press.find({ status: "Published" }).populate({
      path: "image",
      select: "-userType -user -_id", // Exclude userType, user, and _id fields
    });
    res.status(200).json(allPress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get a specific press entry by ID
export const getPressById = async (req, res) => {
  try {
    const press = await Press.findOne({ slug: req.params.id }).populate({
      path: "image",
      select: "-userType -user -_id", // Exclude userType, user, and _id fields
    });
    if (!press) {
      res.status(201).json({ message: "Press not found" });
    } else {
      res.status(200).json(press);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a specific press entry by ID
export const updatePressById = async (req, res) => {
  try {
    const { slug } = req.body;
    const pressId = req.params.id;

    // Check if the slug is already taken by another Press document
    const existingPressWithSlug = await Press.findOne({
      slug,
      _id: { $ne: pressId },
    });

    if (existingPressWithSlug) {
      return res.status(400).json({ message: "Slug is already taken" });
    }

    const updatedPress = await Press.findByIdAndUpdate(pressId, req.body, {
      new: true,
    });

    if (!updatedPress) {
      res.status(404).json({ message: "Press not found" });
    } else {
      res.status(200).json(updatedPress);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a specific press entry by ID
export const deletePressById = async (req, res) => {
  try {
    const deletedPress = await Press.findByIdAndDelete(req.params.id);
    if (!deletedPress) {
      res.status(404).json({ message: "Press not found" });
    } else {
      res.status(200).json({ message: "Press deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
