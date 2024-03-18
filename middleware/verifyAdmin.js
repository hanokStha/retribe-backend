// verifyAdmin.js

import Admin from "../models/Admin.js";

export const isAdmin = async (req, res, next) => {
  try {
    const user = await Admin.findById(req.user.userId);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).send({
      success: false,
      message: "Error in admin middleware",
    });
  }
};

export default isAdmin;
