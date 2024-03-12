import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  getCategoriesWithNestedSubcategories,
  updateCategoryParentAndPosition,
  updateCategoryPositions,
  getCategoriesWithNestedChildren,
  getAllParentCategories,
  getParentList,
  getCategoryBySlug,
} from "../controllers/categoryController.js"; // Import your controller functions
import { Router } from "express";
const router = Router();

router.post("/new", createCategory);
router.get("/all", getAllCategories);
router.get("/all/parent", getAllParentCategories);
router.get("/parent/list/:id", getParentList);
router.get("/single/:id", getCategoryById);
router.get("/slug/:slug", getCategoryBySlug);
router.put("/update/:id", updateCategoryById);
router.delete("/delete/:id", deleteCategoryById);
router.get("/all/subcategories", getCategoriesWithNestedSubcategories);
router.get("/all/children", getCategoriesWithNestedChildren);
router.post("/update/parent", updateCategoryParentAndPosition);
router.post("/update/position", updateCategoryPositions);

export default router;
