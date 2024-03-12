import slugify from "slugify";
import OurVibeTribe from "../models/OurVibeTribe.js";
// Create a new OurVibeTribe entry
export const createOurVibeTribe = async (req, res) => {
  try {
    const { title } = req.body;
    const baseSlug = slugify(title, { lower: true }); // Generate base slug from title
    let slug = baseSlug;
    let suffix = 1;

    while (true) {
      const existingOurVibeTribe = await OurVibeTribe.findOne({ slug });
      if (!existingOurVibeTribe) {
        break;
      } else {
        // If slug already exists, increment suffix and generate new slug
        suffix++;
        slug = `${baseSlug}-${suffix}`;
      }
    }

    const newOurVibeTribe = await OurVibeTribe.create({ ...req.body, slug });
    res.status(201).json(newOurVibeTribe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const duplicateOurVibeTribe = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the OurVibeTribe document to duplicate by ID
    const OurVibeTribeToDuplicate = await OurVibeTribe.findById(id);

    if (!OurVibeTribeToDuplicate) {
      return res.status(404).json({ error: "OurVibeTribe not found" });
    }

    // Create a new OurVibeTribe document based on the fields of the selected document
    const { _id, slug, status, ...OurVibeTribeFields } =
      OurVibeTribeToDuplicate.toObject();
    const baseSlug = slugify(OurVibeTribeFields.title, { lower: true });
    let newSlug = baseSlug;
    let suffix = 1;

    while (true) {
      const similarSlugOurVibeTribe = await OurVibeTribe.findOne({
        slug: newSlug,
      });
      if (!similarSlugOurVibeTribe) {
        break;
      } else {
        // If slug already exists, increment suffix and generate new slug
        suffix++;
        newSlug = `${baseSlug}-${suffix}`;
      }
    }

    const newOurVibeTribe = await OurVibeTribe.create({
      ...OurVibeTribeFields,
      title: `${OurVibeTribeFields.title} (Copy)`,
      slug: newSlug,
      status: "Draft",
    });

    res.status(201).json(newOurVibeTribe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all OurVibeTribe entries
export const getAllOurVibeTribe = async (req, res) => {
  try {
    const allOurVibeTribe = await OurVibeTribe.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "image",
        select:
          "-userType -user -extension -updated -createdAt -updatedAt -size -originalname", // Exclude userType, user, and _id fields
      });
    res.status(200).json(allOurVibeTribe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPublishedOurVibeTribe = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      populate: {
        path: "image",
        select:
          "-userType -user -extension -updated -createdAt -updatedAt -size -originalname",
      },
    };

    if (sortBy) {
      if (sortBy === "NF") {
        options.sort = { createdAt: -1 };
      } else if (sortBy === "OF") {
        options.sort = { createdAt: 1 };
      }
    } else {
      options.sort = { createdAt: -1 };
    }
    const query = { status: "Published" };

    const result = await OurVibeTribe.paginate(query, options);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get a specific OurVibeTribe entry by ID
export const getOurVibeTribeById = async (req, res) => {
  try {
    const OurVibeTribeSingle = await OurVibeTribe.findOne({
      slug: req.params.id,
    }).populate({
      path: "image",
      select: "-userType -user  -updated  -updatedAt  -originalname",
    });
    if (!OurVibeTribeSingle) {
      return res.status(201).json({ message: "OurVibeTribe not found" });
    }
    // Find the next and previous items based on the '_id' field
    const nextOurVibeTribe = await OurVibeTribe.findOne({
      _id: { $gt: OurVibeTribeSingle._id },
    })
      .sort({ _id: 1 })
      .select("slug title"); // Adjust the criteria and sorting as needed

    const previousOurVibeTribe = await OurVibeTribe.findOne({
      _id: { $lt: OurVibeTribeSingle._id },
    })
      .sort({ _id: -1 })
      .select("slug title"); // Adjust the criteria and sorting as needed

    return res
      .status(200)
      .json({ OurVibeTribeSingle, nextOurVibeTribe, previousOurVibeTribe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a specific OurVibeTribe entry by ID
export const updateOurVibeTribeById = async (req, res) => {
  try {
    const { slug } = req.body;
    const OurVibeTribeId = req.params.id;

    // Check if the slug is already taken by another OurVibeTribe document
    const existingOurVibeTribeWithSlug = await OurVibeTribe.findOne({
      slug,
      _id: { $ne: OurVibeTribeId },
    });

    if (existingOurVibeTribeWithSlug) {
      return res.status(400).json({ message: "Slug is already taken" });
    }

    const updatedOurVibeTribe = await OurVibeTribe.findByIdAndUpdate(
      OurVibeTribeId,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedOurVibeTribe) {
      res.status(404).json({ message: "OurVibeTribe not found" });
    } else {
      res.status(200).json(updatedOurVibeTribe);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a specific OurVibeTribe entry by ID
export const deleteOurVibeTribeById = async (req, res) => {
  try {
    const deletedOurVibeTribe = await OurVibeTribe.findByIdAndDelete(
      req.params.id
    );
    if (!deletedOurVibeTribe) {
      res.status(404).json({ message: "OurVibeTribe not found" });
    } else {
      res.status(200).json({ message: "OurVibeTribe deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
