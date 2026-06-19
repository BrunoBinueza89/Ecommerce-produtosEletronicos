import {
  addProductMediaEntry,
  createProductEntry,
  getProductBySlug,
  getProducts,
  removeProductImageEntry,
  removeProductVideoEntry,
  setMainProductImageEntry
} from "../services/product-service.js";
import { logAdminAction } from "../services/audit-log-service.js";

export async function listProductsController(request, response, next) {
  try {
    const products = await getProducts({
      query: request.query.q,
      categorySlug: request.query.category,
      brandSlug: request.query.brand,
      minPrice: request.query.minPrice ? Number(request.query.minPrice) : null,
      maxPrice: request.query.maxPrice ? Number(request.query.maxPrice) : null,
      inStock: request.query.inStock === "true",
      sort: request.query.sort
    });
    response.status(200).json({ data: products });
  } catch (error) {
    next(error);
  }
}

export async function getProductBySlugController(request, response, next) {
  try {
    const product = await getProductBySlug(request.params.slug);
    response.status(200).json({ data: product });
  } catch (error) {
    next(error);
  }
}

export async function createProductController(request, response, next) {
  try {
    const product = await createProductEntry(request.validatedBody, request.files ?? {});
    await logAdminAction(request, {
      module: "products",
      entity: "produtos",
      entityId: product.id,
      action: "create",
      payloadJson: request.validatedBody
    });
    response.status(201).json({ data: product });
  } catch (error) {
    next(error);
  }
}

export async function addProductMediaController(request, response, next) {
  try {
    const product = await addProductMediaEntry(
      Number(request.params.productId),
      request.validatedBody,
      request.files ?? {}
    );
    await logAdminAction(request, {
      module: "products",
      entity: "produtos",
      entityId: product.id,
      action: "media_add",
      payloadJson: request.validatedBody
    });
    response.status(200).json({ data: product });
  } catch (error) {
    next(error);
  }
}

export async function setProductMainImageController(request, response, next) {
  try {
    const product = await setMainProductImageEntry(
      Number(request.params.productId),
      Number(request.params.imageId)
    );
    await logAdminAction(request, {
      module: "products",
      entity: "produtos",
      entityId: product.id,
      action: "media_set_main",
      payloadJson: { imageId: Number(request.params.imageId) }
    });
    response.status(200).json({ data: product });
  } catch (error) {
    next(error);
  }
}

export async function deleteProductImageController(request, response, next) {
  try {
    const product = await removeProductImageEntry(
      Number(request.params.productId),
      Number(request.params.imageId)
    );
    await logAdminAction(request, {
      module: "products",
      entity: "produtos",
      entityId: product.id,
      action: "media_delete_image",
      payloadJson: { imageId: Number(request.params.imageId) }
    });
    response.status(200).json({ data: product });
  } catch (error) {
    next(error);
  }
}

export async function deleteProductVideoController(request, response, next) {
  try {
    const product = await removeProductVideoEntry(
      Number(request.params.productId),
      Number(request.params.videoId)
    );
    await logAdminAction(request, {
      module: "products",
      entity: "produtos",
      entityId: product.id,
      action: "media_delete_video",
      payloadJson: { videoId: Number(request.params.videoId) }
    });
    response.status(200).json({ data: product });
  } catch (error) {
    next(error);
  }
}
