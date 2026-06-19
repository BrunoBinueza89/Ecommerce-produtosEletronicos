import {
  getAbandonedCarts,
  getAdvancedReports,
  processAbandonedCartRecovery
} from "../services/engagement-service.js";
import { logAdminAction } from "../services/audit-log-service.js";

export async function getAdvancedReportsController(request, response, next) {
  try {
    const data = await getAdvancedReports({
      thresholdHours: request.query.thresholdHours
    });
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function listAbandonedCartsController(request, response, next) {
  try {
    const data = await getAbandonedCarts({
      thresholdHours: request.query.thresholdHours,
      limit: request.query.limit
    });
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function processAbandonedCartsController(request, response, next) {
  try {
    const data = await processAbandonedCartRecovery(request.validatedBody);
    await logAdminAction(request, {
      module: "notifications",
      entity: "carrinhos",
      entityId: null,
      action: "process-abandoned-carts",
      payloadJson: request.validatedBody
    });
    response.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}
