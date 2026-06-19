import {
  createBannerEntry,
  createPromotionEntry,
  getBanners,
  getBannersAdmin,
  getPromotions,
  getPromotionsAdmin
} from "../services/content-service.js";
import { logAdminAction } from "../services/audit-log-service.js";

export async function listBannersController(request, response, next) {
  try {
    const data = await getBanners(request.query.position);
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function listPromotionsController(_request, response, next) {
  try {
    const data = await getPromotions();
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function listBannersAdminController(_request, response, next) {
  try {
    const data = await getBannersAdmin();
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function createBannerAdminController(request, response, next) {
  try {
    const data = await createBannerEntry(request.validatedBody);
    await logAdminAction(request, {
      module: "banners",
      entity: "banners",
      entityId: data.id,
      action: "create",
      payloadJson: request.validatedBody
    });
    response.status(201).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function listPromotionsAdminController(_request, response, next) {
  try {
    const data = await getPromotionsAdmin();
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function createPromotionAdminController(request, response, next) {
  try {
    const data = await createPromotionEntry(request.validatedBody);
    await logAdminAction(request, {
      module: "promotions",
      entity: "promocoes",
      entityId: data.id,
      action: "create",
      payloadJson: request.validatedBody
    });
    response.status(201).json({ data });
  } catch (error) {
    next(error);
  }
}
