import Comments from "../models/Comments.js";

const createComment = async (req, res) => {
  try {
    const { text, user, seller, isActive, reply, automatic } = req.body;
    const newComment = new Comments({
      text,
      user,
      seller,
      isActive,
      reply,
      automatic,
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await Comments.find();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCommentsById = async (req, res) => {
  try {
    const id = req.params.id;
    const comments = await Comments.findById(id);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCommentsByUserId = async (req, res) => {
  try {
    const id = req.params.id;
    const comments = await Comments.find({
      user: id,
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getCommentsBySellerId = async (req, res) => {
  try {
    const id = req.params.id;
    const comments = await Comments.find({
      seller: id,
      isActive: true,
    }).populate({
      path: "user",
      select: "_id name image",
      populate: {
        path: "image", // Specify the nested field to be populated
        model: "Media", // Replace with your actual Media model name
        select:
          "-userType -user -extension -updated -createdAt -updatedAt -size -originalname",
      },
    });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedComment = await Comments.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    await Comments.findByIdAndRemove(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export the controller functions
export {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  getCommentsById,
  getCommentsBySellerId,
  getCommentsByUserId,
};
