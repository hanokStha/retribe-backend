import bcrypt from "bcrypt";
import Coupons from "../models/Coupons.js";

// Controller function to create a new secure coupon
export const createCoupon = async (req, res) => {
  try {
    // Generate a unique coupon code
    const couponCode = generateCouponCode();

    // Hash the coupon code
    const hashedCouponCode = await bcrypt.hash(couponCode, 10);

    // Store the hashed coupon code in the database
    const coupon = new Coupons({ code: hashedCouponCode, active: true });
    const savedCoupon = await coupon.save();

    res.status(201).json(savedCoupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to get all coupons
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupons.find();
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get a single coupon by ID
export const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupons.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to update a coupon by ID
export const updateCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, active } = req.body;
    const updatedCoupon = await Coupons.findByIdAndUpdate(
      id,
      { code, active },
      { new: true }
    );
    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to delete a coupon by ID
export const deleteCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoupon = await Coupons.findByIdAndDelete(id);
    if (!deletedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate a random coupon code
const generateCouponCode = () => {
  // Generate a random string of characters
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let couponCode = "";
  for (let i = 0; i < 10; i++) {
    couponCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return couponCode;
};
