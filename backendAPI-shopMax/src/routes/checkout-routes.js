import { Router } from "express";
import {
  finalizeCheckoutController,
  previewCheckoutController
} from "../controllers/checkout-controller.js";
import { requireAuth } from "../middlewares/require-auth.js";
import { validateBody } from "../middlewares/validate-body.js";
import { checkoutFinalizeSchema } from "../validators/checkout-validator.js";

export const checkoutRouter = Router();

checkoutRouter.get("/checkout/preview", requireAuth, previewCheckoutController);
checkoutRouter.post(
  "/checkout/finalize",
  requireAuth,
  validateBody(checkoutFinalizeSchema),
  finalizeCheckoutController
);
