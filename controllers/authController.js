// controllers/authController.js
import { hash, compare } from "bcrypt";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

export async function userRegister(req, res) {
  try {
    // Validate input
    if (!req.body.email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!req.body.name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!req.body.password) {
      return res.status(400).json({ message: "Password is required" });
    }
    // Check if User already exists
    const existingUser = await Admin.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "This email already exists" });
    }

    // Hash the password
    const hashedPassword = await hash(req.body.password, 10);

    // Create a new User
    const newUser = new Admin({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    // Save the User to the database
    await newUser.save();

    // Remove the password field from the response
    const { password, ...userWithoutPassword } = newUser._doc;

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function userLogin(req, res) {
  try {
    // Check if User exists
    const user = await Admin.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Email not found" });
    }

    // Compare passwords
    const passwordMatch = await compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXIPRES }
    );

    // Remove the password field from the response
    const { password, ...userWithoutPassword } = user._doc;

    return res.json({
      message: "Login successful",
      success: true,
      user: userWithoutPassword,
      token, // Include the JWT token in the response
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}

export async function getAllUser(req, res) {
  try {
    // Fetch all users from the database
    const users = await Admin.find({}, { password: 0 });

    return res.status(200).json({
      message: "Successfully fetched all users",
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUserById(req, res) {
  try {
    const userId = req.params.id;

    // Find user by ID in the database
    const user = await Admin.findById(userId, { password: 0 });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Successfully fetched user",
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
export async function getUserByEmail(req, res) {
  try {
    const email = req.body.email;

    // Find user by ID in the database
    const user = await Admin.findOne({ email });
    if (user) {
      return res.status(404).json({ message: "User exists" });
    }

    return res.status(200).json({
      message: "Successfully fetched user",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteUserController(req, res) {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await Admin.findById(id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // Delete the admin from the database
    await Admin.findByIdAndDelete(id);

    return res.status(200).json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
