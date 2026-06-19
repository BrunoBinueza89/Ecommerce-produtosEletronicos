import { Router } from "express";
import {
  createFavoriteController,
  deleteFavoriteController,
  listFavoritesController
} from "../controllers/favorites-controller.js";
import { requireAuth } from "../middlewares/require-auth.js";
import { validateBody } from "../middlewares/validate-body.js";
import { favoriteCreateSchema } from "../validators/favorite-validator.js";

export const favoritesRouter = Router();

favoritesRouter.get("/favorites", requireAuth, listFavoritesController);
favoritesRouter.post("/favorites", requireAuth, validateBody(favoriteCreateSchema), createFavoriteController);
favoritesRouter.delete("/favorites/:productId", requireAuth, deleteFavoriteController);
