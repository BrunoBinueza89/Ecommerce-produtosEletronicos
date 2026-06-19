import { cancelOrderForUser, getOrderDetailForUser, getOrdersForUser } from "../services/order-service.js";

export async function listOrdersController(request, response, next) {
  try {
    const orders = await getOrdersForUser(request.auth.sub);
    response.status(200).json({ data: orders });
  } catch (error) {
    next(error);
  }
}

export async function getOrderByIdController(request, response, next) {
  try {
    const order = await getOrderDetailForUser(request.auth.sub, Number(request.params.orderId));
    response.status(200).json({ data: order });
  } catch (error) {
    next(error);
  }
}

export async function cancelOrderController(request, response, next) {
  try {
    const order = await cancelOrderForUser(
      request.auth.sub,
      Number(request.params.orderId),
      request.validatedBody?.reason ?? null
    );
    response.status(200).json({ data: order });
  } catch (error) {
    next(error);
  }
}
