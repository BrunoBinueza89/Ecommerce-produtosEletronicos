import multer from "multer";
import path from "node:path";
import { AppError } from "../models/app-error.js";

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".mp4", ".webm"]);
const maxUploadBytes = 20 * 1024 * 1024;

function productMediaFileFilter(_request, file, callback) {
  const extension = path.extname(file.originalname ?? "").toLowerCase();

  if (!allowedExtensions.has(extension)) {
    callback(
      new AppError("Extensao de arquivo nao permitida para upload de produto.", {
        code: "INVALID_MEDIA_EXTENSION",
        statusCode: 422
      })
    );
    return;
  }

  callback(null, true);
}

export const productMediaUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxUploadBytes,
    files: 12
  },
  fileFilter: productMediaFileFilter
}).fields([
  { name: "mainImage", maxCount: 1 },
  { name: "galleryImages", maxCount: 8 },
  { name: "videoFiles", maxCount: 3 }
]);

function normalizeNullableString(value) {
  const normalized = String(value ?? "").trim();
  return normalized || null;
}

function normalizeNullableNumber(value) {
  const normalized = String(value ?? "").trim();
  return normalized ? Number(normalized) : null;
}

function normalizeTechnicalSheet(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value === "object") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (_error) {
    return value;
  }
}

export function normalizeProductMultipartBody(request, _response, next) {
  if (!request.is("multipart/form-data")) {
    next();
    return;
  }

  request.body = {
    categoryId: request.body.categoryId,
    brandId: request.body.brandId,
    name: request.body.name,
    slug: normalizeNullableString(request.body.slug) ?? undefined,
    sku: request.body.sku,
    price: request.body.price,
    promotionalPrice: normalizeNullableNumber(request.body.promotionalPrice),
    shortDescription: normalizeNullableString(request.body.shortDescription),
    description: normalizeNullableString(request.body.description),
    technicalSheet: normalizeTechnicalSheet(request.body.technicalSheet),
    status: normalizeNullableString(request.body.status) ?? undefined,
    weight: normalizeNullableNumber(request.body.weight),
    height: normalizeNullableNumber(request.body.height),
    width: normalizeNullableNumber(request.body.width),
    length: normalizeNullableNumber(request.body.length),
    warrantyMonths: normalizeNullableNumber(request.body.warrantyMonths),
    mainImageUrl: normalizeNullableString(request.body.mainImageUrl),
    stockInitial: request.body.stockInitial,
    stockMinimum: normalizeNullableNumber(request.body.stockMinimum)
  };

  next();
}
