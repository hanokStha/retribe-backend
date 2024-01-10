import { Router } from "express";
import {
  createColor,
  getAllColors,
  getColorById,
  updateColorById,
  deleteColorById,
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrandsById,
  deleteBrandById,
  createSize,
  getAllSizes,
  getSizeById,
  updateSizeById,
  deleteSizeById,
  createMaterial,
  getAllMaterial,
  getMaterialById,
  updateMaterialById,
  deleteMaterialById,
  createCondition,
  getAllCondition,
  getConditionById,
  updateConditionById,
  deleteConditionById,
  createShoeSize,
  getAllShowSizes,
  getShoeSizeById,
  updateShoeSizeById,
  deleteShowSizeById,
} from "../controllers/productAttributesController.js";

const router = Router();

// COLORS ROUTE

router.post("/colors", createColor);
router.get("/colors", getAllColors);
router.get("/colors/:id", getColorById);
router.put("/colors/:id", updateColorById);
router.delete("/colors/:id", deleteColorById);

// Brand Routes

router.post("/brands", createBrand);
router.get("/brands", getAllBrands);
router.get("/brands/:id", getBrandById);
router.put("/brands/:id", updateBrandsById);
router.delete("/brands/:id", deleteBrandById);

// SIZE Routes

router.post("/sizes", createSize);
router.get("/sizes", getAllSizes);
router.get("/sizes/:id", getSizeById);
router.put("/sizes/:id", updateSizeById);
router.delete("/sizes/:id", deleteSizeById);

// SHOE SIZE Routes

router.post("/shoesizes", createShoeSize);
router.get("/shoesizes", getAllShowSizes);
router.get("/shoesizes/:id", getShoeSizeById);
router.put("/shoesizes/:id", updateShoeSizeById);
router.delete("/shoesizes/:id", deleteShowSizeById);

// Material Routes

router.post("/material", createMaterial);
router.get("/material", getAllMaterial);
router.get("/material/:id", getMaterialById);
router.put("/material/:id", updateMaterialById);
router.delete("/material/:id", deleteMaterialById);

// CONDITON Routes

router.post("/condition", createCondition);
router.get("/condition", getAllCondition);
router.get("/condition/:id", getConditionById);
router.put("/condition/:id", updateConditionById);
router.delete("/condition/:id", deleteConditionById);

export default router;
