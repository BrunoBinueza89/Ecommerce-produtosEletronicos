import {
  adjustStockAdmin,
  createCouponAdmin,
  getCouponsAdmin,
  getCustomersAdmin,
  getDashboardData,
  getIntegrationsStatusAdmin,
  getOrdersAdmin,
  getReportsAdmin,
  getStockAdmin,
  syncPendingOrdersTrackingAdmin,
  syncOrderTrackingAdmin,
  testEmailIntegrationAdmin,
  testTrackingIntegrationAdmin,
  validateLiveIntegrationsAdmin,
  updateOrderStatusAdmin
} from "../services/admin-service.js";
import { getAuditLogs, logAdminAction } from "../services/audit-log-service.js";

export async function getDashboardController(_request, response, next) {
  try {
    const data = await getDashboardData();
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function listCustomersAdminController(_request, response, next) {
  try {
    const data = await getCustomersAdmin();
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function listOrdersAdminController(_request, response, next) {
  try {
    const data = await getOrdersAdmin();
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatusAdminController(request, response, next) {
  try {
    const data = await updateOrderStatusAdmin({
      orderId: Number(request.params.orderId),
      ...request.validatedBody
    });
    await logAdminAction(request, {
      module: "orders",
      entity: "pedidos",
      entityId: Number(request.params.orderId),
      action: "update-status",
      payloadJson: request.validatedBody
    });
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function listStockAdminController(_request, response, next) {
  try {
    const data = await getStockAdmin();
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function adjustStockAdminController(request, response, next) {
  try {
    const data = await adjustStockAdmin({
      stockId: Number(request.params.stockId),
      ...request.validatedBody
    });
    await logAdminAction(request, {
      module: "stock",
      entity: "estoques",
      entityId: Number(request.params.stockId),
      action: "adjust",
      payloadJson: request.validatedBody
    });
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function listCouponsAdminController(_request, response, next) {
  try {
    const data = await getCouponsAdmin();
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function createCouponAdminController(request, response, next) {
  try {
    const data = await createCouponAdmin(request.validatedBody);
    await logAdminAction(request, {
      module: "coupons",
      entity: "cupons",
      entityId: data.id,
      action: "create",
      payloadJson: request.validatedBody
    });
    response.status(201).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function getReportsAdminController(_request, response, next) {
  try {
    const data = await getReportsAdmin();
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function getAuditLogsController(_request, response, next) {
  try {
    const data = await getAuditLogs();
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function syncOrderTrackingAdminController(request, response, next) {
  try {
    const data = await syncOrderTrackingAdmin(Number(request.params.orderId));
    await logAdminAction(request, {
      module: "orders",
      entity: "entregas",
      entityId: Number(request.params.orderId),
      action: "sync-tracking",
      payloadJson: {
        trackingCode: data.tracking.trackingCode,
        provider: data.tracking.provider,
        normalizedStatus: data.tracking.normalizedStatus
      }
    });
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function getIntegrationsStatusAdminController(_request, response, next) {
  try {
    const data = await getIntegrationsStatusAdmin();
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function syncPendingOrdersTrackingAdminController(request, response, next) {
  try {
    const data = await syncPendingOrdersTrackingAdmin(request.validatedBody.limit);
    await logAdminAction(request, {
      module: "orders",
      entity: "entregas",
      entityId: null,
      action: "sync-tracking-batch",
      payloadJson: {
        selected: data.selected,
        processed: data.processed.length,
        failed: data.failed.length
      }
    });
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function testEmailIntegrationAdminController(request, response, next) {
  try {
    const data = await testEmailIntegrationAdmin(request.validatedBody.recipientEmail);
    await logAdminAction(request, {
      module: "notifications",
      entity: "email",
      entityId: null,
      action: "test-email-integration",
      payloadJson: {
        recipientEmail: request.validatedBody.recipientEmail,
        provider: data.provider,
        status: data.status
      }
    });
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function testTrackingIntegrationAdminController(request, response, next) {
  try {
    const data = await testTrackingIntegrationAdmin(request.validatedBody);
    await logAdminAction(request, {
      module: "orders",
      entity: "entregas",
      entityId: null,
      action: "test-tracking-integration",
      payloadJson: {
        trackingCode: request.validatedBody.trackingCode,
        orderCode: request.validatedBody.orderCode,
        provider: data.provider,
        normalizedStatus: data.normalizedStatus
      }
    });
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function validateLiveIntegrationsAdminController(request, response, next) {
  try {
    const data = await validateLiveIntegrationsAdmin(request.validatedBody);
    await logAdminAction(request, {
      module: "integrations",
      entity: "live-validation",
      entityId: null,
      action: "validate-live",
      payloadJson: {
        allOk: data.allOk,
        email: {
          ok: data.email.ok,
          blocked: data.email.blocked,
          provider: data.email.provider
        },
        tracking: {
          ok: data.tracking.ok,
          blocked: data.tracking.blocked,
          provider: data.tracking.provider
        }
      }
    });
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}
