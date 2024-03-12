// controllers/couponSettingController.js
import CouponSettings from "../models/CouponSettings.js";

// Controller to create a new coupon setting
export const createCouponSetting = async (req, res) => {
  try {
    const { quantity, amount } = req.body;
    const newCouponSetting = new CouponSettings({ quantity, amount });
    const savedCouponSetting = await newCouponSetting.save();
    res.status(201).json(savedCouponSetting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get all coupon settings
export const getAllCouponSettings = async (req, res) => {
  try {
    const couponSettings = await CouponSettings.find();
    res.json(couponSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get a single coupon setting by ID
export const getCouponSettingById = async (req, res) => {
  try {
    const couponSetting = await CouponSettings.findById(req.params.id);
    if (!couponSetting) {
      return res.status(404).json({ message: "Coupon setting not found" });
    }
    res.json(couponSetting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to update a coupon setting
export const updateCouponSetting = async (req, res) => {
  try {
    const { quantity, amount } = req.body;
    const updatedCouponSetting = await CouponSettings.findByIdAndUpdate(
      req.params.id,
      { quantity, amount },
      { new: true }
    );
    res.json(updatedCouponSetting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to delete a coupon setting
export const deleteCouponSetting = async (req, res) => {
  try {
    await CouponSettings.findByIdAndDelete(req.params.id);
    res.json({ message: "Coupon setting deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
