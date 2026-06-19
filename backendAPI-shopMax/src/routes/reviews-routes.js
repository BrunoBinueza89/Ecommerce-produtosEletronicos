import { Router } from "express";
import { createReviewController, listReviewsByProductController } from "../controllers/reviews-controller.js";
import { requireAuth } from "../middlewares/require-auth.js";
import { validateBody } from "../middlewares/validate-body.js";
import { reviewCreateSchema } from "../validators/review-validator.js";

export const reviewsRouter = Router();

reviewsRouter.get("/products/:slug/reviews", listReviewsByProductController);
reviewsRouter.post("/reviews", requireAuth, validateBody(reviewCreateSchema), createReviewController);
