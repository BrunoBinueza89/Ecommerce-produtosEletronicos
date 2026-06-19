import { AppError } from "../models/app-error.js";
import { serializeReview } from "../models/review-model.js";
import {
  createReview,
  customerHasEligiblePurchase,
  findReviewByCustomerAndProduct,
  listPublishedReviewsByProductSlug
} from "../repositories/review-repository.js";
import { getCustomerContext } from "./customer-service.js";

export async function getReviewsByProductSlug(slug) {
  const reviews = await listPublishedReviewsByProductSlug(slug);
  return reviews.map(serializeReview);
}

export async function createReviewForUser(userId, payload) {
  const { customer } = await getCustomerContext(userId);
  const eligibleOrder = await customerHasEligiblePurchase(customer.id, payload.productId);

  if (!eligibleOrder) {
    throw new AppError("Cliente precisa ter compra entregue para avaliar o produto.", {
      code: "REVIEW_NOT_ELIGIBLE",
      statusCode: 422
    });
  }

  const existingReview = await findReviewByCustomerAndProduct(customer.id, payload.productId);

  if (existingReview) {
    throw new AppError("Cliente ja avaliou este produto.", {
      code: "REVIEW_ALREADY_EXISTS",
      statusCode: 409
    });
  }

  const review = await createReview({
    ...payload,
    customerId: customer.id,
    orderId: payload.orderId ?? eligibleOrder.id
  });

  return serializeReview(review);
}
