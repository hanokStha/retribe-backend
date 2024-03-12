import slugify from "slugify";
import Settings from "../models/Settings.js";
export async function getAllSettings(req, res) {
  try {
    const settings = await Settings.find()
      .populate({
        path: "image",
        select: "-userType -user  -updated  -updatedAt  ", // Exclude userType, user, and _id fields
      })
      .sort({ createdAt: -1 });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Get a setting by slug
export async function getSettingsBySlug(req, res) {
  try {
    const setting = await Settings.findOne({ slug: req.params.slug });
    if (!setting) {
      return res.status(404).json({ message: "Setting not found" });
    }
    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Create a new setting
export async function addSetting(req, res) {
  const { type, value, title, image } = req.body;
  const baseSlug = slugify(title, { lower: true }); // Generate base slug from title
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const existingPress = await Settings.findOne({ slug });
    if (!existingPress) {
      break;
    } else {
      // If slug already exists, increment suffix and generate new slug
      suffix++;
      slug = `${baseSlug}-${suffix}`;
    }
  }

  try {
    const setting = await Settings.create({
      title,
      slug, // Store the generated slug in the database
      type,
      image,
      value: value,
    });

    res.status(201).json(setting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Update a setting's value by slug
export async function updateSettingsBySlug(req, res) {
  try {
    const setting = await Settings.findOne({ slug: req.params.slug });
    if (!setting) {
      return res.status(404).json({ message: "Setting not found" });
    }

    setting.value = req.body.value;
    setting.type = req.body.type;
    setting.title = req.body.title;
    if (req.body.image) {
      setting.image = req.body.image;
    }
    const updatedSetting = await setting.save();
    res.json(updatedSetting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Delete a setting by slug
export async function deleteSettingsBySlug(req, res) {
  try {
    const setting = await Settings.findOneAndDelete({ slug: req.params.slug });
    if (!setting) {
      return res.status(404).json({ message: "Setting not found" });
    }

    res.json({ message: "Setting deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
