import { AppError } from "../models/app-error.js";
import {
  adjustStock,
  createCoupon,
  findOrderAdmin,
  getDashboardSummary,
  getReportsSummary,
  listCouponsAdmin,
  listCustomersAdmin,
  listOrdersEligibleForTrackingSync,
  listOrdersAdmin,
  listStockAdmin,
  updateOrderStatus
} from "../repositories/admin-repository.js";
import {
  getEmailIntegrationStatus,
  getEmailLiveValidationStatus,
  sendIntegrationTestEmail,
  validateLiveEmailIntegration
} from "./notification-service.js";
import {
  getTrackingIntegrationStatus,
  getTrackingLiveValidationStatus,
  probeTrackingProvider,
  syncOrderTracking,
  validateLiveTrackingIntegration
} from "./tracking-service.js";

export async function getDashboardData() {
  return getDashboardSummary();
}

export async function getCustomersAdmin() {
  return listCustomersAdmin();
}

export async function getOrdersAdmin() {
  return listOrdersAdmin();
}

export async function updateOrderStatusAdmin(payload) {
  const order = await findOrderAdmin(payload.orderId);

  if (!order) {
    throw new AppError("Pedido nao encontrado.", {
      code: "ORDER_NOT_FOUND",
      statusCode: 404
    });
  }

  await updateOrderStatus(payload.orderId, payload.status, payload.trackingCode ?? null);
  return findOrderAdmin(payload.orderId);
}

export async function getStockAdmin() {
  return listStockAdmin();
}

export async function adjustStockAdmin(payload) {
  return adjustStock(payload);
}

export async function getCouponsAdmin() {
  return listCouponsAdmin();
}

export async function createCouponAdmin(payload) {
  if (payload.type === "valor_fixo" && payload.fixedValue === null) {
    throw new AppError("Cupom de valor fixo exige valor.", {
      code: "INVALID_COUPON",
      statusCode: 422
    });
  }

  if (payload.type === "percentual" && payload.percentage === null) {
    throw new AppError("Cupom percentual exige percentual.", {
      code: "INVALID_COUPON",
      statusCode: 422
    });
  }

  return createCoupon(payload);
}

export async function getReportsAdmin() {
  return getReportsSummary();
}

export async function syncOrderTrackingAdmin(orderId) {
  const order = await findOrderAdmin(orderId);

  if (!order) {
    throw new AppError("Pedido nao encontrado.", {
      code: "ORDER_NOT_FOUND",
      statusCode: 404
    });
  }

  if (!order.delivery_tracking_code) {
    throw new AppError("Pedido ainda nao possui codigo de rastreio.", {
      code: "ORDER_TRACKING_NOT_AVAILABLE",
      statusCode: 422
    });
  }

  const tracking = await syncOrderTracking(order);

  if (tracking.normalizedStatus === "entregue" && order.status === "enviado") {
    await updateOrderStatus(orderId, "entregue", tracking.trackingCode ?? null);
  }

  if (tracking.normalizedStatus === "enviado" && order.status === "em_separacao") {
    await updateOrderStatus(orderId, "enviado", tracking.trackingCode ?? null);
  }

  const refreshedOrder = await findOrderAdmin(orderId);

  return {
    orderId,
    tracking,
    order: refreshedOrder
  };
}

export async function getIntegrationsStatusAdmin() {
  const [email, tracking] = await Promise.all([
    getEmailIntegrationStatus(),
    Promise.resolve(getTrackingIntegrationStatus())
  ]);

  return {
    email,
    tracking
  };
}

export async function validateLiveIntegrationsAdmin(payload) {
  const [emailStatus, trackingStatus] = await Promise.all([
    Promise.resolve(getEmailLiveValidationStatus()),
    Promise.resolve(getTrackingLiveValidationStatus())
  ]);

  const [email, tracking] = await Promise.all([
    validateLiveEmailIntegration(payload.recipientEmail),
    validateLiveTrackingIntegration({
      trackingCode: payload.trackingCode,
      orderCode: payload.orderCode
    })
  ]);

  return {
    liveEnabled: emailStatus.liveEnabled && trackingStatus.liveEnabled,
    sandboxEnabled: emailStatus.sandboxEnabled || trackingStatus.sandboxEnabled,
    email,
    tracking,
    allOk: email.ok && tracking.ok
  };
}

export async function syncPendingOrdersTrackingAdmin(limit = 20) {
  const orders = await listOrdersEligibleForTrackingSync(limit);
  const processed = [];
  const failed = [];

  for (const order of orders) {
    try {
      const tracking = await syncOrderTracking(order);

      if (tracking.normalizedStatus === "entregue" && order.status === "enviado") {
        await updateOrderStatus(order.id, "entregue", tracking.trackingCode ?? null);
      }

      if (tracking.normalizedStatus === "enviado" && order.status === "em_separacao") {
        await updateOrderStatus(order.id, "enviado", tracking.trackingCode ?? null);
      }

      processed.push({
        orderId: order.id,
        orderCode: order.codigo,
        provider: tracking.provider,
        normalizedStatus: tracking.normalizedStatus,
        trackingCode: tracking.trackingCode
      });
    } catch (error) {
      failed.push({
        orderId: order.id,
        orderCode: order.codigo,
        error: error.message
      });
    }
  }

  return {
    selected: orders.length,
    processed,
    failed
  };
}

export async function testEmailIntegrationAdmin(recipientEmail) {
  return sendIntegrationTestEmail(recipientEmail);
}

export async function testTrackingIntegrationAdmin(payload) {
  return probeTrackingProvider(payload);
}
