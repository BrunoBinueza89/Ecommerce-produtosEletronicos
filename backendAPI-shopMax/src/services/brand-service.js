import { AppError } from "../models/app-error.js";
import { serializeBrand } from "../models/brand-model.js";
import { createBrand, listBrands } from "../repositories/brand-repository.js";
import { createSlug } from "./slug-service.js";

export async function getBrands() {
  const brands = await listBrands();
  return brands.map(serializeBrand);
}

export async function createBrandEntry(payload) {
  const slug = payload.slug ? createSlug(payload.slug) : createSlug(payload.name);

  if (!slug) {
    throw new AppError("Slug invalido para marca.", {
      code: "INVALID_BRAND_SLUG",
      statusCode: 422
    });
  }

  const brand = await createBrand({
    ...payload,
    slug
  });

  return serializeBrand(brand);
}
