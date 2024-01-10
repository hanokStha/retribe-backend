import { Router } from "express";
import {
  addFavourite,
  getAllFavourites,
  getFavouritesByUser,
  removeFavourite,
} from "../controllers/favouriteController.js";
import verifyTokenMiddleware from "../middleware/verifyToken.js";

const router = Router();

router.post("/add", verifyTokenMiddleware, addFavourite);
router.get("/single/:id", verifyTokenMiddleware, getFavouritesByUser);
router.get("/all", getAllFavourites);
router.delete("/remove", removeFavourite);

export default router;
