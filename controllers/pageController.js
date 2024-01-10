import slugify from "slugify";
import Page from "../models/Page.js";
// Create a new page entry
export const createPage = async (req, res) => {
  try {
    const { title } = req.body;
    const baseSlug = slugify(title, { lower: true }); // Generate base slug from title
    let slug = baseSlug;
    let suffix = 1;

    while (true) {
      const existingPage = await Page.findOne({ slug });
      if (!existingPage) {
        break;
      } else {
        // If slug already exists, increment suffix and generate new slug
        suffix++;
        slug = `${baseSlug}-${suffix}`;
      }
    }

    const newPage = await Page.create({ ...req.body, slug });
    res.status(201).json(newPage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const duplicatePage = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the Page document to duplicate by ID
    const pageToDuplicate = await Page.findById(id);

    if (!pageToDuplicate) {
      return res.status(404).json({ error: "Page not found" });
    }

    // Create a new Page document based on the fields of the selected document
    const { _id, slug, status, ...pageFields } = pageToDuplicate.toObject();
    const baseSlug = slugify(pageFields.title, { lower: true });
    let newSlug = baseSlug;
    let suffix = 1;

    while (true) {
      const similarSlugPage = await Page.findOne({ slug: newSlug });
      if (!similarSlugPage) {
        break;
      } else {
        // If slug already exists, increment suffix and generate new slug
        suffix++;
        newSlug = `${baseSlug}-${suffix}`;
      }
    }

    const newPage = await Page.create({
      ...pageFields,
      title: `${pageFields.title} (Copy)`,
      slug: newSlug,
      status: "Draft",
    });

    res.status(201).json(newPage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all page entries
export const getAllPage = async (req, res) => {
  try {
    const allPage = await Page.find().sort({ createdAt: -1 });
    res.status(200).json(allPage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPublishedPage = async (req, res) => {
  try {
    const allPage = await Page.find({ status: "Published" });
    res.status(200).json(allPage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get a specific page entry by ID
export const getPageById = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.id });
    if (!page) {
      res.status(201).json({ message: "Page not found" });
    } else {
      res.status(200).json(page);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a specific page entry by ID
export const updatePageById = async (req, res) => {
  try {
    const { slug } = req.body;
    const pageId = req.params.id;

    // Check if the slug is already taken by another Page document
    const existingPageWithSlug = await Page.findOne({
      slug,
      _id: { $ne: pageId },
    });

    if (existingPageWithSlug) {
      return res.status(400).json({ message: "Slug is already taken" });
    }

    const updatedPage = await Page.findByIdAndUpdate(pageId, req.body, {
      new: true,
    });

    if (!updatedPage) {
      res.status(404).json({ message: "Page not found" });
    } else {
      res.status(200).json(updatedPage);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a specific page entry by ID
export const deletePageById = async (req, res) => {
  try {
    const deletedPage = await Page.findByIdAndDelete(req.params.id);
    if (!deletedPage) {
      res.status(404).json({ message: "Page not found" });
    } else {
      res.status(200).json({ message: "Page deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
