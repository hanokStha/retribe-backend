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
import mediaRoute from "./routes/mediaRoute.js";
import serviceRoute from "./routes/serviceRoute.js";
import faqRoute from "./routes/faqRoute.js";
import pageRoute from "./routes/pageRoute.js";
import faqQuesRoute from "./routes/faqQuesRoute.js";
import settingRoute from "./routes/settingRoute.js";
import attributeRoute from "./routes/attributeRoute.js";
import attributeValueRoute from "./routes/attributeValueRoute.js";
import { fileURLToPath } from "url";
import path from "path";
dotenv.config();
const app = express();

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
app.use("/api/page", pageRoute);
app.use("/api/service", serviceRoute);
app.use("/api/faq", faqRoute);
app.use("/api/faq/que", faqQuesRoute);
app.use("/api/attribute", attributeRoute);
app.use("/api/attribute/value", attributeValueRoute);
app.use("/api/settings", settingRoute);

// PORT
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on ${process.env.DEV_MODE} ${PORT}`);
});
