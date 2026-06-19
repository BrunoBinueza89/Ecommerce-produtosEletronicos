import { AppError } from "../models/app-error.js";
import { serializeOrder, serializeOrderItem } from "../models/order-model.js";
import { getCustomerContext } from "./customer-service.js";
import {
  cancelOrderByCustomer,
  findOrderByIdAndCustomerId,
  listOrderItems,
  listOrdersByCustomerId
} from "../repositories/order-repository.js";

export async function getOrdersForUser(userId) {
  const { customer } = await getCustomerContext(userId);
  const orders = await listOrdersByCustomerId(customer.id);
  return orders.map(serializeOrder);
}

export async function getOrderDetailForUser(userId, orderId) {
  const { customer } = await getCustomerContext(userId);
  const order = await findOrderByIdAndCustomerId(orderId, customer.id);

  if (!order) {
    throw new AppError("Pedido nao encontrado.", {
      code: "ORDER_NOT_FOUND",
      statusCode: 404
    });
  }

  const items = await listOrderItems(order.id);

  return {
    ...serializeOrder(order),
    items: items.map(serializeOrderItem)
  };
}

export async function cancelOrderForUser(userId, orderId, reason) {
  const { customer } = await getCustomerContext(userId);
  const cancelled = await cancelOrderByCustomer(orderId, customer.id, reason);

  if (!cancelled) {
    throw new AppError("Pedido nao encontrado.", {
      code: "ORDER_NOT_FOUND",
      statusCode: 404
    });
  }

  return getOrderDetailForUser(userId, orderId);
}
