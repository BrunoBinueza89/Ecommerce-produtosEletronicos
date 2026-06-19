import { Router } from "express";
import {
  createCategoryController,
  listCategoriesController
} from "../controllers/categories-controller.js";
import { requirePermission } from "../middlewares/require-auth.js";
import { validateBody } from "../middlewares/validate-body.js";
import { categoryCreateSchema } from "../validators/category-validator.js";

export const categoriesRouter = Router();

categoriesRouter.get("/categories", listCategoriesController);
categoriesRouter.post(
  "/categories",
  requirePermission("categories.write"),
  validateBody(categoryCreateSchema),
  createCategoryController
);
