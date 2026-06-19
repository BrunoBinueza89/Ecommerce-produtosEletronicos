import { AppError } from "../models/app-error.js";
import { serializeBanner } from "../models/banner-model.js";
import { serializePromotion } from "../models/promotion-model.js";
import {
  createBanner,
  createPromotion,
  listActiveBanners,
  listActivePromotions,
  listBannersAdmin,
  listPromotionsAdmin
} from "../repositories/content-repository.js";
import { createSlug } from "./slug-service.js";

export async function getBanners(position = null) {
  const banners = await listActiveBanners(position);
  return banners.map(serializeBanner);
}

export async function getPromotions() {
  const promotions = await listActivePromotions();
  return promotions.map(serializePromotion);
}

export async function getBannersAdmin() {
  const banners = await listBannersAdmin();
  return banners.map(serializeBanner);
}

export async function createBannerEntry(payload) {
  const banner = await createBanner(payload);
  return serializeBanner(banner);
}

export async function getPromotionsAdmin() {
  const promotions = await listPromotionsAdmin();
  return promotions.map(serializePromotion);
}

export async function createPromotionEntry(payload) {
  if (
    (payload.value === null || payload.value === undefined || payload.value <= 0) &&
    (payload.percentage === null || payload.percentage === undefined || payload.percentage <= 0)
  ) {
    throw new AppError("Promocao exige valor fixo ou percentual.", {
      code: "INVALID_PROMOTION",
      statusCode: 422
    });
  }

  if ((payload.type === "produto" && !payload.productId) || (payload.type === "categoria" && !payload.categoryId)) {
    throw new AppError("Promocao exige alvo compativel com o tipo.", {
      code: "INVALID_PROMOTION_TARGET",
      statusCode: 422
    });
  }

  const slug = payload.slug ? createSlug(payload.slug) : createSlug(payload.name);

  if (!slug) {
    throw new AppError("Slug invalido para promocao.", {
      code: "INVALID_PROMOTION_SLUG",
      statusCode: 422
    });
  }

  const promotion = await createPromotion({
    ...payload,
    slug
  });
  return serializePromotion(promotion);
}
