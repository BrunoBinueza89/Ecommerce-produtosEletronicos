import { AppError } from "../models/app-error.js";
import { serializeProduct } from "../models/product-model.js";
import {
  addProductMedia,
  createProduct,
  findProductById,
  findProductBySlug,
  findProductImage,
  findProductVideo,
  listProductImages,
  listProductVideos,
  listProducts,
  setMainProductImage,
  softDeleteProductImage,
  softDeleteProductVideo
} from "../repositories/product-repository.js";
import {
  persistProductMediaFiles,
  removeStoredMediaFiles
} from "./product-media-storage-service.js";
import { attachPromotionPricing } from "./pricing-service.js";
import { createSlug } from "./slug-service.js";

export async function getProducts(filters = {}) {
  const baseProducts = await listProducts(filters);
  const hydratedProducts = await Promise.all(baseProducts.map((product) => hydrateProduct(product)));
  const products = await attachPromotionPricing(hydratedProducts);
  return products.map(serializeProduct);
}

async function buildProductMedia(productId) {
  const [images, videos] = await Promise.all([listProductImages(productId), listProductVideos(productId)]);

  return {
    images: images.map((image) => ({
      id: image.id,
      productId: image.produto_id,
      url: image.url,
      altText: image.alt_text,
      isMain: Boolean(image.principal),
      sortOrder: image.ordem
    })),
    videos: videos.map((video) => ({
      id: video.id,
      productId: video.produto_id,
      url: video.url,
      title: video.titulo,
      sortOrder: video.ordem
    }))
  };
}

async function hydrateProduct(productRow) {
  if (!productRow) {
    return null;
  }

  const { images, videos } = await buildProductMedia(productRow.id);
  const mainImage =
    images.find((image) => image.isMain) ??
    (productRow.main_image_url ? { url: productRow.main_image_url } : null) ??
    images[0] ??
    null;

  return {
    ...productRow,
    main_image_url: mainImage?.url ?? null,
    images,
    videos
  };
}

function flattenStoredMedia(storedMedia) {
  return [...(storedMedia?.images ?? []), ...(storedMedia?.videos ?? [])];
}

function buildMediaPayload(payload, storedMedia, productName) {
  const images = [];
  const videos = [];

  const uploadedImages = storedMedia.images.map((file) => ({
    url: file.url,
    altText: productName,
    main: file.fieldName === "mainImage"
  }));

  if (payload.mainImageUrl) {
    images.push({
      url: payload.mainImageUrl,
      altText: productName,
      main: uploadedImages.every((image) => !image.main)
    });
  }

  images.push(...uploadedImages);

  storedMedia.videos.forEach((file) => {
    videos.push({
      url: file.url,
      title: productName
    });
  });

  if (images.length > 0 && images.every((image) => !image.main)) {
    images[0].main = true;
  }

  return { images, videos };
}

export async function getProductBySlug(slug) {
  const baseProduct = await findProductBySlug(slug);
  const hydrated = await hydrateProduct(baseProduct);
  const [product] = await attachPromotionPricing([hydrated].filter(Boolean));

  if (!product) {
    throw new AppError("Produto nao encontrado.", {
      code: "PRODUCT_NOT_FOUND",
      statusCode: 404
    });
  }

  return serializeProduct(product);
}

export async function getProductById(productId) {
  const [product] = await attachPromotionPricing([await hydrateProduct(await findProductById(productId))].filter(Boolean));

  if (!product) {
    throw new AppError("Produto nao encontrado.", {
      code: "PRODUCT_NOT_FOUND",
      statusCode: 404
    });
  }

  return serializeProduct(product);
}

export async function createProductEntry(payload, filesByField = {}) {
  if (payload.promotionalPrice !== null && payload.promotionalPrice !== undefined) {
    if (payload.promotionalPrice > payload.price) {
      throw new AppError("Preco promocional nao pode ser maior que o preco base.", {
        code: "INVALID_PROMOTIONAL_PRICE",
        statusCode: 422
      });
    }
  }

  const slug = payload.slug ? createSlug(payload.slug) : createSlug(payload.name);

  if (!slug) {
    throw new AppError("Slug invalido para produto.", {
      code: "INVALID_PRODUCT_SLUG",
      statusCode: 422
    });
  }

  const storedMedia = await persistProductMediaFiles(filesByField, payload.name);

  try {
    const mediaPayload = buildMediaPayload(payload, storedMedia, payload.name);
    const product = await createProduct({
      ...payload,
      slug,
      images: mediaPayload.images,
      videos: mediaPayload.videos
    });

    return await getProductById(product.id);
  } catch (error) {
    await removeStoredMediaFiles(flattenStoredMedia(storedMedia));
    throw error;
  }
}

export async function addProductMediaEntry(productId, payload = {}, filesByField = {}) {
  const product = await findProductById(productId);

  if (!product) {
    throw new AppError("Produto nao encontrado.", {
      code: "PRODUCT_NOT_FOUND",
      statusCode: 404
    });
  }

  const storedMedia = await persistProductMediaFiles(filesByField, product.nome);

  try {
    const mediaPayload = buildMediaPayload(payload, storedMedia, product.nome);
    await addProductMedia(productId, mediaPayload);

    const uploadedMainImage = mediaPayload.images.find((image) => image.main);

    if (uploadedMainImage) {
      const images = await listProductImages(productId);
      const matchingImage = images.find((image) => image.url === uploadedMainImage.url);

      if (matchingImage) {
        await setMainProductImage(productId, matchingImage.id);
      }
    }

    return await getProductById(productId);
  } catch (error) {
    await removeStoredMediaFiles(flattenStoredMedia(storedMedia));
    throw error;
  }
}

export async function setMainProductImageEntry(productId, imageId) {
  const product = await findProductById(productId);

  if (!product) {
    throw new AppError("Produto nao encontrado.", {
      code: "PRODUCT_NOT_FOUND",
      statusCode: 404
    });
  }

  const image = await findProductImage(productId, imageId);

  if (!image) {
    throw new AppError("Imagem do produto nao encontrada.", {
      code: "PRODUCT_IMAGE_NOT_FOUND",
      statusCode: 404
    });
  }

  await setMainProductImage(productId, imageId);
  return await getProductById(productId);
}

function isManagedUploadUrl(url) {
  return typeof url === "string" && url.startsWith("/uploads/products/");
}

export async function removeProductImageEntry(productId, imageId) {
  const product = await findProductById(productId);

  if (!product) {
    throw new AppError("Produto nao encontrado.", {
      code: "PRODUCT_NOT_FOUND",
      statusCode: 404
    });
  }

  const image = await findProductImage(productId, imageId);

  if (!image) {
    throw new AppError("Imagem do produto nao encontrada.", {
      code: "PRODUCT_IMAGE_NOT_FOUND",
      statusCode: 404
    });
  }

  const removed = await softDeleteProductImage(productId, imageId);

  if (!removed) {
    throw new AppError("Nao foi possivel remover a imagem do produto.", {
      code: "PRODUCT_IMAGE_DELETE_FAILED",
      statusCode: 409
    });
  }

  if (isManagedUploadUrl(image.url)) {
    await removeStoredMediaFiles([{ url: image.url }]);
  }

  return await getProductById(productId);
}

export async function removeProductVideoEntry(productId, videoId) {
  const product = await findProductById(productId);

  if (!product) {
    throw new AppError("Produto nao encontrado.", {
      code: "PRODUCT_NOT_FOUND",
      statusCode: 404
    });
  }

  const video = await findProductVideo(productId, videoId);

  if (!video) {
    throw new AppError("Video do produto nao encontrado.", {
      code: "PRODUCT_VIDEO_NOT_FOUND",
      statusCode: 404
    });
  }

  const removed = await softDeleteProductVideo(productId, videoId);

  if (!removed) {
    throw new AppError("Nao foi possivel remover o video do produto.", {
      code: "PRODUCT_VIDEO_DELETE_FAILED",
      statusCode: 409
    });
  }

  if (isManagedUploadUrl(video.url)) {
    await removeStoredMediaFiles([{ url: video.url }]);
  }

  return await getProductById(productId);
}
