import { AppError } from "../models/app-error.js";
import { serializeCategory } from "../models/category-model.js";
import { createCategory, listCategories } from "../repositories/category-repository.js";
import { createSlug } from "./slug-service.js";

export async function getCategories() {
  const categories = await listCategories();
  return categories.map(serializeCategory);
}

export async function createCategoryEntry(payload) {
  const slug = payload.slug ? createSlug(payload.slug) : createSlug(payload.name);

  if (!slug) {
    throw new AppError("Slug invalido para categoria.", {
      code: "INVALID_CATEGORY_SLUG",
      statusCode: 422
    });
  }

  const category = await createCategory({
    ...payload,
    slug
  });

  return serializeCategory(category);
}
