import slugify from "slugify";
import Service from "../models/Service.js";
// Create a new Service entry
export const createService = async (req, res) => {
  try {
    const { title } = req.body;
    const baseSlug = slugify(title, { lower: true }); // Generate base slug from title
    let slug = baseSlug;
    let suffix = 1;

    while (true) {
      const existingService = await Service.findOne({ slug });
      if (!existingService) {
        break;
      } else {
        // If slug already exists, increment suffix and generate new slug
        suffix++;
        slug = `${baseSlug}-${suffix}`;
      }
    }

    const newService = await Service.create({ ...req.body, slug });
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const duplicateService = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the Service document to duplicate by ID
    const ServiceToDuplicate = await Service.findById(id);

    if (!ServiceToDuplicate) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Create a new Service document based on the fields of the selected document
    const { _id, slug, status, ...ServiceFields } =
      ServiceToDuplicate.toObject();
    const baseSlug = slugify(ServiceFields.title, { lower: true });
    let newSlug = baseSlug;
    let suffix = 1;

    while (true) {
      const similarSlugService = await Service.findOne({ slug: newSlug });
      if (!similarSlugService) {
        break;
      } else {
        // If slug already exists, increment suffix and generate new slug
        suffix++;
        newSlug = `${baseSlug}-${suffix}`;
      }
    }

    const newService = await Service.create({
      ...ServiceFields,
      title: `${ServiceFields.title} (Copy)`,
      slug: newSlug,
      status: "Draft",
    });

    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Service entries
export const getAllService = async (req, res) => {
  try {
    const allService = await Service.find().sort({ createdAt: -1 }).populate({
      path: "image",
      select: "-userType -user  -updated  -updatedAt  -originalname",
    });
    res.status(200).json(allService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPublishedService = async (req, res) => {
  try {
    const allService = await Service.find({ status: "Published" }).populate({
      path: "image",
      select: "-userType -user  -updated  -updatedAt  -originalname",

    });
    res.status(200).json(allService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get a specific Service entry by ID
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.id }).populate({
      path: "image",
      select: "-userType -user  -updated  -updatedAt ",

    });
    if (!service) {
      res.status(200).json({ message: "Service not found" });
    } else {
      res.status(200).json(service);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a specific Service entry by ID
export const updateServiceById = async (req, res) => {
  try {
    const { slug } = req.body;
    const ServiceId = req.params.id;

    // Check if the slug is already taken by another Service document
    const existingServiceWithSlug = await Service.findOne({
      slug,
      _id: { $ne: ServiceId },
    });

    if (existingServiceWithSlug) {
      return res.status(400).json({ message: "Slug is already taken" });
    }

    const updatedService = await Service.findByIdAndUpdate(
      ServiceId,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedService) {
      res.status(404).json({ message: "Service not found" });
    } else {
      res.status(200).json(updatedService);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a specific Service entry by ID
export const deleteServiceById = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      res.status(404).json({ message: "Service not found" });
    } else {
      res.status(200).json({ message: "Service deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
