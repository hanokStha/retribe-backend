import { hash, compare } from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import hbs from "nodemailer-express-handlebars";
import { handlebarOptions, transporter } from "../config/transporter.js";
import slugify from "slugify";
import Product from "../models/Product.js";
import Comments from "../models/Comments.js";
import Orders from "../models/Orders.js";
import Favourite from "../models/Favourite.js";

function calculateRoundedAverageRating(reviews) {
  if (!reviews || reviews.length === 0) {
    // Handle case with no reviews
    return 0;
  }

  const totalStars = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalStars / reviews.length;

  // Round the average rating to the closest star or half star
  const roundedRating = Math.round(averageRating * 4) / 4;

  return roundedRating;
}
export async function userRegister(req, res) {
  try {
    const generatedOTP = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 15);
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
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "This email already exists" });
    }

    // Hash the password
    const hashedPassword = await hash(req.body.password, 10);

    const baseSlug = slugify(req.body.name, { lower: true }); // Generate base slug from title
    let slug = baseSlug;
    let suffix = 1;

    while (true) {
      const existingPress = await User.findOne({ slug });
      if (!existingPress) {
        break;
      } else {
        // If slug already exists, increment suffix and generate new slug
        suffix++;
        slug = `${baseSlug}-${suffix}`;
      }
    }

    // Create a new User
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      slug: slug,
      password: hashedPassword,
      default_image: "/images/profile_user.png",
      otp: generatedOTP,
      otpExpiration: otpExpiration,
    });

    // Save the User to the database
    await newUser.save();

    // Remove the password field from the response
    const { password, ...userWithoutPassword } = newUser._doc;

    transporter.use("compile", hbs(handlebarOptions));
    const mailOptions = {
      from: "notification@visitktm.com",
      template: "email",
      to: req.body.email,
      subject: `Verify your Email - Retribe`,
      context: {
        name: "Hanok",
        otp: generatedOTP,
      },
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      return res.status(400).json({ error });
    }

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

export async function updateUser(req, res) {
  try {
    // Extract the user ID from the request or the user object if it's already stored in the request
    const userId = req.params.id; // assuming you pass the user ID in the URL

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user information based on request body fields
    if (req.body.name) {
      user.name = req.body.name;
    }
    if (req.body.email !== user.email) {
      user.emailVerified = false;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }

    if (req.body.address) {
      user.address = req.body.address;
    }
    if (req.body.birthday) {
      user.birthday = req.body.birthday;
    }
    if (req.body.gender) {
      user.gender = req.body.gender;
    }
    if (req.body.about) {
      user.about = req.body.about;
    }

    if (req.body.phone) {
      user.phone = req.body.phone;
    }

    if (req.body.favBrand) {
      user.favBrand = req.body.favBrand;
    }
    if (req.body.favSize) {
      user.favSize = req.body.favSize;
    }

    if (req.body.shoeSize) {
      user.shoeSize = req.body.shoeSize;
    }

    if (req.body.image) {
      user.image = req.body.image;
    }

    user.holidayEnd = req.body.holidayEnd;

    user.holidayStart = req.body.holidayStart;
    user.holiday = req.body.holiday;

    user.coverimage = req.body.coverimage || null;

    // Save the updated user to the database
    await user.save();

    // Remove the password field from the response
    const { password, ...updatedUserWithoutPassword } = user._doc;

    return res.status(200).json({
      message: "User updated successfully",
      success: true,
      user: updatedUserWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP matches and is not expired
    if (otp !== user.otp || user.otpExpiration < new Date()) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    // Mark the user as verified (you might have an emailVerified field in your User model)
    user.emailVerified = true;
    user.otp = null;
    await user.save();

    return res.status(200).json({
      message: "OTP verified. Email verified successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function resendOTP(req, res) {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new OTP
    const generatedOTP = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    // Set OTP expiration time to 15 minutes from now
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 15);

    // Update the user with the new OTP and its expiration
    user.otp = generatedOTP;
    user.otpExpiration = otpExpiration;
    await user.save();

    transporter.use("compile", hbs(handlebarOptions));
    const mailOptions = {
      from: "notification@visitktm.com",
      template: "email",
      to: req.body.email,
      subject: `Verify your Email - Retribe`,
      context: {
        name: "Hanok",
        otp: generatedOTP,
      },
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      return res.status(400).json({ error });
    }

    return res.status(200).json({
      message: "New OTP sent to email.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function userLogin(req, res) {
  try {
    // Check if User exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Email not found" });
    }

    if (!user.emailVerified) {
      const generatedOTP = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

      // Set OTP expiration time to 15 minutes from now
      const otpExpiration = new Date();
      otpExpiration.setMinutes(otpExpiration.getMinutes() + 15);

      // Update the user with the new OTP and its expiration
      user.otp = generatedOTP;
      user.otpExpiration = otpExpiration;
      await user.save();

      transporter.use("compile", hbs(handlebarOptions));
      const mailOptions = {
        from: "notification@visitktm.com",
        template: "email",
        to: req.body.email,
        subject: `Verify your Email - Retribe`,
        context: {
          name: "Hanok",
          otp: generatedOTP,
        },
      };
      try {
        await transporter.sendMail(mailOptions);
      } catch (error) {
        return res.status(400).json({ error });
      }

      return res
        .status(401)
        .json({ message: `Email not verified ${user?._id}` });
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
    const users = await User.find({}, { password: 0, otp: 0, otpExpiration: 0 })
      .populate("shoeSize")
      .populate("favBrand")
      .populate({
        path: "coverimage",
        select:
          "-userType -user -extension -updated -createdAt -updatedAt -size -originalname", // Exclude userType, user, and _id fields
      })
      .populate({
        path: "image",
        select:
          "-userType -user -extension -updated -createdAt -updatedAt -size -originalname", // Exclude userType, user, and _id fields
      })
      .populate("favSize");

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

export async function getAllSeller(req, res) {
  try {
    const usersWithProducts = await User.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "sellerId",
          as: "products",
        },
      },
      {
        $match: {
          "products.status": "Active", // Match only active products
        },
      },
      {
        $addFields: {
          productCount: {
            $size: {
              $filter: {
                input: "$products",
                as: "product",
                cond: { $eq: ["$$product.status", "Active"] },
              },
            },
          },
        },
      },
      {
        $match: {
          productCount: { $gte: 1 }, // Filter users with at least one active product
        },
      },
      {
        $project: {
          products: 0,
        },
      },
    ]);
    const data = await User.populate(usersWithProducts, [
      {
        path: "image",
        select:
          "-userType -user -extension -updated -createdAt -updatedAt -size -originalname",
      },
      {
        path: "coverimage",
        select:
          "-userType -user -extension -updated -createdAt -updatedAt -size -originalname",
      },
    ]);

    const usersWithAverageRating = await Promise.all(
      usersWithProducts.map(async (user) => {
        const reviews = await Comments.find({ seller: user._id });
        const averageRating = calculateRoundedAverageRating(reviews);
        return { ...user, averageRating };
      })
    );
    res.json(usersWithAverageRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getUserById(req, res) {
  try {
    const userId = req.params.id;

    // Find user by ID in the database
    const user = await User.findById(userId, {
      password: 0,
      potp: 0,
      potpExpiration: 0,
      otpExpiration: 0,
      otp: 0,
      createdAt: 0,
      updatedAt: 0,
      favSize: 0,
      shoeSize: 0,
      favBrand: 0,
    })
      .populate({
        path: "image",
        select:
          "-userType -user -extension -updated -createdAt -updatedAt -size -originalname", // Exclude userType, user, and _id fields
      })
      .populate({
        path: "coverimage",
        select:
          "-userType -user -extension -updated -createdAt -updatedAt -size -originalname", // Exclude userType, user, and _id fields
      })
      .populate({
        path: "favBrand",
      })
      .populate({
        path: "shoeSize",
      })
      .populate({
        path: "favSize",
      });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const reviews = await Comments.find({
      seller: userId,
    });
    const averageRating = calculateRoundedAverageRating(reviews);
    user.averageRating = averageRating;

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

export async function getUserBySlug(req, res) {
  try {
    const userId = req.params.id;
    // Find user by ID in the database
    const user = await User.findOne(
      { slug: userId },
      {
        password: 0,
        potp: 0,
        potpExpiration: 0,
        otpExpiration: 0,
        otp: 0,
        createdAt: 0,
        updatedAt: 0,
      }
    )
      .populate({
        path: "image",
        select:
          "-userType -user -extension -updated -createdAt -updatedAt -size -originalname", // Exclude userType, user, and _id fields
      })
      .populate({
        path: "coverimage",
        select:
          "-userType -user -extension -updated -createdAt -updatedAt -size -originalname", // Exclude userType, user, and _id fields
      })
      .populate({
        path: "favBrand",
      })
      .populate({
        path: "shoeSize",
      })
      .populate({
        path: "favSize",
      })
      .populate({
        path: "badges",
        select: "image",
        populate: {
          path: "image",
          select: "filename title alt",
        },
      });
    if (!user) {
      return res.status(201).json({ message: "User not found" });
    }
    const productLength = await Product.countDocuments({ sellerId: user._id });

    return res.status(200).json({
      message: "Successfully fetched user",
      success: true,
      user,
      productLength,
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
    const user = await User.findOne({ email });
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
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // Delete the User from the database
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.params.id; // Assuming you have user authentication middleware setting this
    if (userId !== req.user.userId) {
      return res.status(404).json({ error: "Authentication Requried" });
    }
    // Fetch the user from the database
    const user = await User.findById(userId);
    // Compare the old password provided with the stored password hash
    const passwordMatch = await compare(oldPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect old password" });
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    // Generate a new JWT token (optional, based on your application flow)
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXIPRES }
    );

    return res
      .status(200)
      .json({ message: "Password updated successfully", token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new OTP
    const generatedOTP = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    // Set OTP expiration time to 15 minutes from now
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 15);

    // Update the user with the new OTP and its expiration
    user.potp = generatedOTP;
    user.potpExpiration = otpExpiration;
    await user.save();

    transporter.use("compile", hbs(handlebarOptions));
    const mailOptions = {
      from: "notification@visitktm.com",
      template: "email",
      to: req.body.email,
      subject: `Verify your Email - Retribe`,
      context: {
        name: "Hanok",
        otp: generatedOTP,
      },
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      return res.status(400).json({ error });
    }

    return res.status(200).json({
      message: "OTP sent to email.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (parseInt(user.potp) !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword, 10);

    // Update the user's password and reset the OTP in the database
    user.password = hashedPassword;
    user.potp = null; // Clear the OTP after successful password reset
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
}

export async function updateUserBundleItems(req, res) {
  try {
    const { userId, bundleItems } = req.body;
    if (userId !== req.user.userId) {
      return res.status(404).json({ error: "Authentication Requried" });
    }
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's bundleItems in the database
    user.bundleItems = bundleItems;
    await user.save();

    return res
      .status(200)
      .json({ message: "BundleItems updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
}

export async function getBundleItemsById(req, res) {
  try {
    const id = req.params.id;
    const bundle = await User.findById(id, "bundleItems").populate({
      path: "bundleItems",
      select:
        "-productSize -colors -conditions -material -totalLikes  -comments -hitCount",
      populate: [
        {
          path: "galleryImages",
          select:
            "-userType -user -extension -updated -createdAt -updatedAt -size -originalname",
        },
        {
          path: "category",
          select: "title",
        },
        {
          path: "brand",
          select: "title",
        },
      ],
    });
    if (!bundle) {
      return res.status(400).send("User Not found");
    }
    return res.status(200).json(bundle);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
}

export async function updateBundleDiscounts(req, res) {
  try {
    const userId = req.params.userId;
    if (userId !== req.user.userId) {
      return res.status(404).json({ error: "Authentication Requried" });
    }
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }
    const { bundleDiscounts } = req.body;
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingKeys = new Set(); // Create a Set to store unique keys
    for (const discount of bundleDiscounts) {
      if (existingKeys.has(discount.quantity)) {
        return res
          .status(400)
          .json({ message: "Duplicate keys found in bundleDiscounts" });
      }
      existingKeys.add(discount.quantity);
    }

    // Update the user's bundleItems in the database
    user.bundleDiscounts = bundleDiscounts;
    await user.save();

    return res
      .status(200)
      .json({ message: "BundleDiscounts updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
}

export async function getBundleDiscounts(req, res) {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).select("bundleDiscounts");
    if (!user) {
      return res.status(400).send("User not found");
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
}

export async function getAllUserStatistics(req, res) {
  try {
    const { sellerId, rating } = req.params;
    const { sellerPoints, buyerPoints, ratingsPoint, influencerPoints } =
      req.body;
    const user = await User.findById(sellerId);
    if (!user) {
      return res.status(400).send("User not found");
    }
    const totalSales = await Orders.countDocuments({
      sellerId,
      status: "Delivered",
    });
    const totalOrders = await Orders.countDocuments({
      userId: sellerId,
      status: "Delivered",
    });
    const totalRatings = await Comments.countDocuments({
      seller: sellerId,
      rating: { $gte: parseInt(rating) },
      isActive: true,
      automatic: false,
    });
    const totalInfluencers = await Favourite.countDocuments({
      favoriteType: "Users",
      item: sellerId,
    });
    if (
      !user.badges.some((badge) => badge.equals("65c7628be3af0ddcaac6e3a0")) &&
      totalSales >= sellerPoints
    ) {
      user.badges.push("65c7628be3af0ddcaac6e3a0");
    }
    if (
      !user.badges.some((badge) => badge.equals("65c755b7ee34ebc6ab06f4cc")) &&
      totalOrders >= buyerPoints
    ) {
      user.badges.push("65c755b7ee34ebc6ab06f4cc");
    }
    if (
      !user.badges.some((badge) => badge.equals("65c7a917fbdbbe8bf7127466")) &&
      totalRatings >= ratingsPoint
    ) {
      user.badges.push("65c7a917fbdbbe8bf7127466");
    }
    if (
      !user.badges.some((badge) => badge.equals("65c7a9f1fbdbbe8bf7127480")) &&
      totalInfluencers >= influencerPoints
    ) {
      user.badges.push("65c7a9f1fbdbbe8bf7127480");
    }

    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
}
