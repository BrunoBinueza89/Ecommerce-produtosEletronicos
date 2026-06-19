import { Router } from "express";
import {
  loginController,
  meController,
  registerCustomerController
} from "../controllers/auth-controller.js";
import { requireAuth } from "../middlewares/require-auth.js";
import { validateBody } from "../middlewares/validate-body.js";
import { customerRegisterSchema, loginSchema } from "../validators/auth-validator.js";

export const authRouter = Router();

authRouter.post("/auth/login", validateBody(loginSchema), loginController);
authRouter.post(
  "/auth/register/customer",
  validateBody(customerRegisterSchema),
  registerCustomerController
);
authRouter.get("/auth/me", requireAuth, meController);
