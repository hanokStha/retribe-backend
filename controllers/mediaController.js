import Media from "../models/Media.js";
import path from "path";
import fileExtension from "file-extension";
import sharp from "sharp";

function generateName(fileName) {
  // Remove hyphens and split the filename by '.'
  const nameWithoutHyphens = fileName.replace(/-/g, " ");
  const nameWithoutExtension = nameWithoutHyphens.split(".")[0];

  // Capitalize the name
  const capitalized =
    nameWithoutExtension.charAt(0).toUpperCase() +
    nameWithoutExtension.slice(1);

  return capitalized;
}
export const uploadImage = async (req, res) => {
  try {
    const { user, userType } = req.body;
    if (user !== req.user.userId) {
      return res.status(404).json({ error: "Authentication Requried" });
    }
    const mediaArray = req.files.media; // Access uploaded files from req.files['media']
    for (const media of mediaArray) {
      const thumbnailFilename = `thumb_${media.filename}`;
      const thumbnailPath = path.join("public/images", thumbnailFilename);
      if (media.mimetype.split("/")[0] === "image") {
        await sharp(media.path)
          .resize({ width: 200, height: 200 })
          .toFile(thumbnailPath);
      }

      const newMedia = new Media({
        filename: media.filename,
        thumb: thumbnailFilename, // Store the path to the thumbnail
        originalname: media.originalname,
        updated: new Date(),
        size: media.size.toString(),
        title: generateName(media.originalname),
        alt: generateName(media.originalname),
        extension: fileExtension(media.originalname),
        userType,
        user,
      });

      await newMedia.save();
    }

    return res.status(200).json({ message: "Media uploaded successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to upload media" });
  }
};

export const getMediaByUser = async (req, res) => {
  try {
    const { user } = req.params; // Assuming userId is passed in the request params
    if (user !== req.user.userId) {
      return res.status(404).json({ error: "Authentication Requried" });
    }
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 items per page

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 }, // Sorting by the 'updated' field in descending order (-1 for descending, 1 for ascending)
    };

    const media = await Media.paginate({ user: user }, options);

    return res.status(200).json({ media });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch media" });
  }
};

export const searchMediaQuery = async (req, res) => {
  const user = req.params.userId;
  if (user !== req.user.userId) {
    return res.status(404).json({ error: "Authentication Requried" });
  }
  const searchQuery = req.query.search;
  const extensionQuery = req.query.extension;
  const sortBy = req.query.sortBy; // New sortBy query parameter
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 }, // Default sorting by createdAt
  };

  try {
    let mediaQuery = { user };

    if (searchQuery) {
      mediaQuery = {
        ...mediaQuery,
        originalname: { $regex: `^${searchQuery}`, $options: "i" },
      };
    }

    if (extensionQuery) {
      mediaQuery = {
        ...mediaQuery,
        extension: extensionQuery,
      };
    }

    if (sortBy === "highestSize") {
      options.sort = { size: -1 }; // Sort by highest file size
    } else if (sortBy === "lowestSize") {
      options.sort = { size: 1 }; // Sort by lowest file size
    } else if (sortBy === "az") {
      options.sort = { originalname: 1 }; // Sort alphabetically A-Z
      options.collation = { locale: "en", caseLevel: true }; // Sort alphabetically A-Z
    }

    const media = await Media.paginate(mediaQuery, options);
    res.json({ media });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getUniqueExtensions = async (req, res) => {
  try {
    const uniqueExtensions = await Media.distinct("extension");
    res.status(200).json({ extensions: uniqueExtensions });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch unique extensions" });
  }
};

export const filterMediaExtensions = async (req, res) => {
  try {
    const { category } = req.query;
    const { user } = req.params; // Assuming userId is passed in the request params
    const { page = 1, limit = 10 } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
    };

    const media = await Media.find({ user: user });

    const categoryPatterns = {
      image: /^image\//,
      pdf: /^application\/pdf/,
      powerpoint:
        /^application\/vnd.ms-powerpoint|application\/vnd.openxmlformats-officedocument.presentationml.presentation/,
      word: /^application\/vnd.openxmlformats-officedocument.wordprocessingml.document/,
      json: /^application\/json/,
      text: /^text\//,
      other:
        /^(?!(image\/|application\/pdf|application\/vnd.ms-powerpoint|application\/vnd.openxmlformats-officedocument.presentationml.presentation|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|application\/json|text\/)).*/,
    };

    let selectedPattern;

    if (category === "other") {
      selectedPattern = categoryPatterns.other; // Set selected pattern to 'other'
    } else {
      selectedPattern = categoryPatterns[category];
    }

    if (!selectedPattern) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const filteredFiles = media.filter((file) =>
      file.extension.match(selectedPattern)
    );

    const startIndex = (options.page - 1) * options.limit;
    const endIndex = options.page * options.limit;

    const paginatedFiles = filteredFiles.slice(startIndex, endIndex);

    res.json({ files: paginatedFiles });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const getSingleMediaById = async (req, res) => {
  try {
    const { id } = req.params; // Assuming userId is passed in the request params

    const media = await Media.findById(id);

    return res.status(200).json({ media });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch media" });
  }
};

export const updateImageDetails = async (req, res) => {
  try {
    const { alt, title, description } = req.body;
    const { id } = req.params;

    const media = await Media.findById(id);

    if (!media) {
      return res.status(400).json({ message: "No media found" });
    }

    media.title = title;
    media.alt = alt;
    media.description = description;

    await media.save();
    // Respond with a success message or appropriate response
    return res
      .status(200)
      .json({ message: "Media updates successfully", media });
  } catch (error) {
    // Handle any errors that occur during the upload process
    console.error(error);
    return res.status(500).json({ error: "Failed to upload media" });
  }
};

export const searchMediaByType = async (req, res) => {
  const user = req.params.userId;
  if (user !== req.user.userId) {
    return res.status(404).json({ error: "Authentication Requried" });
  }
  const searchQuery = req.query.search;
  const type = req.query.type;
  const sortBy = req.query.sortBy; // New sortBy query parameter
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 }, // Default sorting by createdAt
  };

  try {
    let mediaQuery = { user };

    if (searchQuery) {
      mediaQuery = {
        ...mediaQuery,
        originalname: { $regex: `^${searchQuery}`, $options: "i" },
      };
    }

    if (type === "image") {
      // Filtering for 'image' type
      mediaQuery = {
        ...mediaQuery,
        extension: { $in: ["jpg", "png", "gif", "jpeg"] }, // Update with your image extensions
      };
    } else if (type === "file") {
      // Filtering for 'file' type (excluding images)
      mediaQuery = {
        ...mediaQuery,
        extension: { $nin: ["jpg", "png", "gif", "jpeg"] }, // Update with your image extensions
      };
    }

    if (sortBy === "highestSize") {
      options.sort = { size: -1 }; // Sort by highest file size
    } else if (sortBy === "lowestSize") {
      options.sort = { size: 1 }; // Sort by lowest file size
    } else if (sortBy === "az") {
      options.sort = { originalname: 1 }; // Sort alphabetically A-Z
      options.collation = { locale: "en", caseLevel: true }; // Sort alphabetically A-Z
    }

    const media = await Media.paginate(mediaQuery, options);
    res.json({ media });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
