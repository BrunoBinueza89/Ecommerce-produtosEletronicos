import { Router } from "express";
import {
  addCartItemController,
  createCartSessionController,
  deleteCartItemController,
  getCartController,
  updateCartItemController
} from "../controllers/cart-controller.js";
import { validateBody } from "../middlewares/validate-body.js";
import { addCartItemSchema, updateCartItemSchema } from "../validators/cart-validator.js";

export const cartRouter = Router();

cartRouter.post("/cart/session", createCartSessionController);
cartRouter.get("/cart", getCartController);
cartRouter.post("/cart/items", validateBody(addCartItemSchema), addCartItemController);
cartRouter.patch("/cart/items/:itemId", validateBody(updateCartItemSchema), updateCartItemController);
cartRouter.delete("/cart/items/:itemId", deleteCartItemController);
