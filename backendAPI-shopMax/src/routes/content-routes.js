import { Router } from "express";
import {
  createBannerAdminController,
  createPromotionAdminController,
  listBannersAdminController,
  listBannersController,
  listPromotionsAdminController,
  listPromotionsController
} from "../controllers/content-controller.js";
import { requirePermission } from "../middlewares/require-auth.js";
import { validateBody } from "../middlewares/validate-body.js";
import { bannerCreateSchema, promotionCreateSchema } from "../validators/content-validator.js";

export const contentRouter = Router();

contentRouter.get("/banners", listBannersController);
contentRouter.get("/promotions", listPromotionsController);
contentRouter.get("/admin/banners", requirePermission("reports.read"), listBannersAdminController);
contentRouter.post(
  "/admin/banners",
  requirePermission("products.write"),
  validateBody(bannerCreateSchema),
  createBannerAdminController
);
contentRouter.get("/admin/promotions", requirePermission("reports.read"), listPromotionsAdminController);
contentRouter.post(
  "/admin/promotions",
  requirePermission("coupons.write"),
  validateBody(promotionCreateSchema),
  createPromotionAdminController
);
