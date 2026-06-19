import { finalizeCheckout, previewCheckout } from "../services/checkout-service.js";

export async function previewCheckoutController(request, response, next) {
  try {
    const preview = await previewCheckout(request.auth.sub, request.query.sessionToken, request.query.couponCode);
    response.status(200).json({ data: preview });
  } catch (error) {
    next(error);
  }
}

export async function finalizeCheckoutController(request, response, next) {
  try {
    const order = await finalizeCheckout(request.auth.sub, request.validatedBody);
    response.status(201).json({ data: order });
  } catch (error) {
    next(error);
  }
}
