import { Router } from "express";
import { createBrandController, listBrandsController } from "../controllers/brands-controller.js";
import { requirePermission } from "../middlewares/require-auth.js";
import { validateBody } from "../middlewares/validate-body.js";
import { brandCreateSchema } from "../validators/brand-validator.js";

export const brandsRouter = Router();

brandsRouter.get("/brands", listBrandsController);
brandsRouter.post(
  "/brands",
  requirePermission("brands.write"),
  validateBody(brandCreateSchema),
  createBrandController
);
