import { Router } from "express";
import {
  addProductMediaController,
  createProductController,
  deleteProductImageController,
  deleteProductVideoController,
  getProductBySlugController,
  listProductsController,
  setProductMainImageController
} from "../controllers/products-controller.js";
import { requirePermission } from "../middlewares/require-auth.js";
import { validateBody } from "../middlewares/validate-body.js";
import {
  normalizeProductMultipartBody,
  productMediaUpload
} from "../middlewares/upload-product-media.js";
import {
  productCreateSchema,
  productMediaMutationSchema
} from "../validators/product-validator.js";

export const productsRouter = Router();

productsRouter.get("/products", listProductsController);
productsRouter.get("/products/:slug", getProductBySlugController);
productsRouter.post(
  "/products",
  requirePermission("products.write"),
  productMediaUpload,
  normalizeProductMultipartBody,
  validateBody(productCreateSchema),
  createProductController
);
productsRouter.post(
  "/products/:productId/media",
  requirePermission("products.write"),
  productMediaUpload,
  normalizeProductMultipartBody,
  validateBody(productMediaMutationSchema),
  addProductMediaController
);
productsRouter.patch(
  "/products/:productId/images/:imageId/main",
  requirePermission("products.write"),
  setProductMainImageController
);
productsRouter.delete(
  "/products/:productId/images/:imageId",
  requirePermission("products.write"),
  deleteProductImageController
);
productsRouter.delete(
  "/products/:productId/videos/:videoId",
  requirePermission("products.write"),
  deleteProductVideoController
);
