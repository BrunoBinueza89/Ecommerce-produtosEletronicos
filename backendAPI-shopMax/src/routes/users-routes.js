import { Router } from "express";
import { getMyUserController } from "../controllers/users-controller.js";
import { requireAuth } from "../middlewares/require-auth.js";

export const usersRouter = Router();

usersRouter.get("/users/me", requireAuth, getMyUserController);
