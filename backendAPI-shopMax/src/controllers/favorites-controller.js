import { addFavoriteForUser, getFavoritesForUser, removeFavoriteForUser } from "../services/favorite-service.js";

export async function listFavoritesController(request, response, next) {
  try {
    const data = await getFavoritesForUser(request.auth.sub);
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function createFavoriteController(request, response, next) {
  try {
    const data = await addFavoriteForUser(request.auth.sub, request.validatedBody.productId);
    response.status(201).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function deleteFavoriteController(request, response, next) {
  try {
    const data = await removeFavoriteForUser(request.auth.sub, Number(request.params.productId));
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}
