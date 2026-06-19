import { Router } from "express";
import {
  getAdvancedReportsController,
  listAbandonedCartsController,
  processAbandonedCartsController
} from "../controllers/engagement-controller.js";
import { requirePermission } from "../middlewares/require-auth.js";
import { validateBody } from "../middlewares/validate-body.js";
import { abandonedCartProcessSchema } from "../validators/engagement-validator.js";

export const engagementRouter = Router();

engagementRouter.get("/admin/reports/advanced", requirePermission("reports.read"), getAdvancedReportsController);
engagementRouter.get("/admin/carts/abandoned", requirePermission("reports.read"), listAbandonedCartsController);
engagementRouter.post(
  "/admin/carts/abandoned/process",
  requirePermission("notifications.manage"),
  validateBody(abandonedCartProcessSchema),
  processAbandonedCartsController
);
