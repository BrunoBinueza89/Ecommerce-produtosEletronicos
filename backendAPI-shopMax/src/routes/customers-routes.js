import { Router } from "express";
import {
  createCustomerAddressController,
  getCustomerProfileController
} from "../controllers/customers-controller.js";
import { requireAuth } from "../middlewares/require-auth.js";
import { validateBody } from "../middlewares/validate-body.js";
import { addressCreateSchema } from "../validators/customer-validator.js";

export const customersRouter = Router();

customersRouter.get("/customers/me/profile", requireAuth, getCustomerProfileController);
customersRouter.post(
  "/customers/me/addresses",
  requireAuth,
  validateBody(addressCreateSchema),
  createCustomerAddressController
);
