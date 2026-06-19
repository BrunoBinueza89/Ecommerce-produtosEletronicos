import { createReviewForUser, getReviewsByProductSlug } from "../services/review-service.js";

export async function listReviewsByProductController(request, response, next) {
  try {
    const data = await getReviewsByProductSlug(request.params.slug);
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function createReviewController(request, response, next) {
  try {
    const data = await createReviewForUser(request.auth.sub, request.validatedBody);
    response.status(201).json({ data });
  } catch (error) {
    next(error);
  }
}
