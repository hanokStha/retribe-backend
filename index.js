import express, { json } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import favouriteRoute from "./routes/favouriteRoute.js";
import userRoutes from "./routes/userRoutes.js";
import productAttributeRoutes from "./routes/productAttributeRoutes.js";
import pressRoute from "./routes/pressRoute.js";
import vibeTribeRoute from "./routes/vibeTribeRoute.js";
import mediaRoute from "./routes/mediaRoute.js";
import serviceRoute from "./routes/serviceRoute.js";
import faqRoute from "./routes/faqRoute.js";
import pageRoute from "./routes/pageRoute.js";
import faqQuesRoute from "./routes/faqQuesRoute.js";
import settingRoute from "./routes/settingRoute.js";
import attributeRoute from "./routes/attributeRoute.js";
import attributeValueRoute from "./routes/attributeValueRoute.js";
import commentRoutes from "./routes/commentRoutes.js";
import productCommentRoutes from "./routes/productCommentRoutes.js";
import blogCommentRoutes from "./routes/blogCommentRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import rewardsRoute from "./routes/rewardsRoute.js";
import couponSettingsRoute from "./routes/couponSettingsRoute.js";
import couponRoute from "./routes/couponRoute.js";
import auctionSettingRoutes from "./routes/auctionSettingRoutes.js";
import auctionItemRoutes from "./routes/auctionItemRoutes.js";
import auctionUserRoutes from "./routes/auctionUserRoutes.js";
import auctionHistoryRoute from "./routes/auctionHistoryRoute.js";
import { fileURLToPath } from "url";
import path from "path";
import { Server } from "socket.io";
import { createServer } from "http";
dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL },
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// Connect to the database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

// Middleware

// app.use(cors(corsOptions));
app.use(cors());
app.use(cors());
app.use(json());

// Routes

// Error handling middleware

app.get("/", (req, res) => {
  res.send("<h1>Welcome to Retribe Store</h1>");
});

app.use("/api/user/auth", authRoute);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/product/attributes", productAttributeRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/user/favourite", favouriteRoute);
app.use("/api/media", mediaRoute);
app.use("/api/press", pressRoute);
app.use("/api/vibetribe", vibeTribeRoute);
app.use("/api/page", pageRoute);
app.use("/api/service", serviceRoute);
app.use("/api/faq", faqRoute);
app.use("/api/faq/que", faqQuesRoute);
app.use("/api/attribute", attributeRoute);
app.use("/api/attribute/value", attributeValueRoute);
app.use("/api/settings", settingRoute);
app.use("/api/comments", commentRoutes);
app.use("/api/product/comments", productCommentRoutes);
app.use("/api/blogs/comments", blogCommentRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/rewards", rewardsRoute);
app.use("/api/coupon/settings", couponSettingsRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/auction", auctionSettingRoutes);
app.use("/api/auction", auctionItemRoutes);
app.use("/api/auction", auctionUserRoutes);
app.use("/api/auction", auctionHistoryRoute);

// PORT
const PORT = process.env.PORT || 8000;
io.on("connection", (socket) => {});
server.listen(PORT, () => {
  console.log(`Server running on ${process.env.DEV_MODE} ${PORT}`);
});

export { io };
