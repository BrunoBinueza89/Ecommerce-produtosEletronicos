import { Router } from "express";
import {
  adjustStockAdminController,
  createCouponAdminController,
  getAuditLogsController,
  getDashboardController,
  getIntegrationsStatusAdminController,
  getReportsAdminController,
  listCouponsAdminController,
  listCustomersAdminController,
  listOrdersAdminController,
  listStockAdminController,
  syncPendingOrdersTrackingAdminController,
  syncOrderTrackingAdminController,
  testEmailIntegrationAdminController,
  testTrackingIntegrationAdminController,
  validateLiveIntegrationsAdminController,
  updateOrderStatusAdminController
} from "../controllers/admin-controller.js";
import { requirePermission } from "../middlewares/require-auth.js";
import { validateBody } from "../middlewares/validate-body.js";
import {
  couponCreateSchema,
  integrationEmailTestSchema,
  integrationLiveValidationSchema,
  integrationTrackingTestSchema,
  orderStatusUpdateSchema,
  stockAdjustSchema,
  trackingBatchSyncSchema
} from "../validators/admin-validator.js";

export const adminRouter = Router();

adminRouter.get("/admin/dashboard", requirePermission("reports.read"), getDashboardController);
adminRouter.get("/admin/integrations/status", requirePermission("reports.read"), getIntegrationsStatusAdminController);
adminRouter.post(
  "/admin/integrations/email/test",
  requirePermission("notifications.manage"),
  validateBody(integrationEmailTestSchema),
  testEmailIntegrationAdminController
);
adminRouter.post(
  "/admin/integrations/tracking/test",
  requirePermission("orders.write"),
  validateBody(integrationTrackingTestSchema),
  testTrackingIntegrationAdminController
);
adminRouter.post(
  "/admin/integrations/validate-live",
  requirePermission("reports.read"),
  validateBody(integrationLiveValidationSchema),
  validateLiveIntegrationsAdminController
);
adminRouter.get("/admin/customers", requirePermission("customers.read"), listCustomersAdminController);
adminRouter.get("/admin/orders", requirePermission("orders.read"), listOrdersAdminController);
adminRouter.patch(
  "/admin/orders/:orderId/status",
  requirePermission("orders.write"),
  validateBody(orderStatusUpdateSchema),
  updateOrderStatusAdminController
);
adminRouter.post(
  "/admin/orders/:orderId/tracking/sync",
  requirePermission("orders.write"),
  syncOrderTrackingAdminController
);
adminRouter.post(
  "/admin/orders/tracking/sync-pending",
  requirePermission("orders.write"),
  validateBody(trackingBatchSyncSchema),
  syncPendingOrdersTrackingAdminController
);
adminRouter.get("/admin/stock", requirePermission("stock.read"), listStockAdminController);
adminRouter.patch(
  "/admin/stock/:stockId/adjust",
  requirePermission("stock.write"),
  validateBody(stockAdjustSchema),
  adjustStockAdminController
);
adminRouter.get("/admin/coupons", requirePermission("coupons.read"), listCouponsAdminController);
adminRouter.post(
  "/admin/coupons",
  requirePermission("coupons.write"),
  validateBody(couponCreateSchema),
  createCouponAdminController
);
adminRouter.get("/admin/reports", requirePermission("reports.read"), getReportsAdminController);
adminRouter.get("/admin/audit-logs", requirePermission("audit-logs.read"), getAuditLogsController);
