import { serializeFavorite } from "../models/favorite-model.js";
import { addFavorite, deleteFavorite, findFavorite, listFavoritesByCustomerId } from "../repositories/favorite-repository.js";
import { findProductForCart } from "../repositories/cart-repository.js";
import { getCustomerContext } from "./customer-service.js";
import { AppError } from "../models/app-error.js";

export async function getFavoritesForUser(userId) {
  const { customer } = await getCustomerContext(userId);
  const favorites = await listFavoritesByCustomerId(customer.id);
  return favorites.map(serializeFavorite);
}

export async function addFavoriteForUser(userId, productId) {
  const { customer } = await getCustomerContext(userId);
  const product = await findProductForCart(productId);

  if (!product) {
    throw new AppError("Produto nao encontrado.", {
      code: "PRODUCT_NOT_FOUND",
      statusCode: 404
    });
  }

  await addFavorite(customer.id, productId);
  return getFavoritesForUser(userId);
}

export async function removeFavoriteForUser(userId, productId) {
  const { customer } = await getCustomerContext(userId);
  const favorite = await findFavorite(customer.id, productId);

  if (!favorite) {
    throw new AppError("Favorito nao encontrado.", {
      code: "FAVORITE_NOT_FOUND",
      statusCode: 404
    });
  }

  await deleteFavorite(customer.id, productId);
  return getFavoritesForUser(userId);
}
