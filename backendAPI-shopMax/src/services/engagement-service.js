import { env } from "../config/env.js";
import { listAbandonedCarts, getAdvancedReportsSummary } from "../repositories/engagement-repository.js";
import { sendEmailNotification } from "./notification-service.js";

export async function getAdvancedReports(payload = {}) {
  const thresholdHours = Number(payload.thresholdHours ?? env.CART_ABANDONED_HOURS);
  return getAdvancedReportsSummary({ thresholdHours });
}

export async function getAbandonedCarts(payload = {}) {
  const thresholdHours = Number(payload.thresholdHours ?? env.CART_ABANDONED_HOURS);
  const limit = Number(payload.limit ?? 50);
  return listAbandonedCarts({ thresholdHours, limit });
}

export async function processAbandonedCartRecovery(payload = {}) {
  const thresholdHours = Number(payload.thresholdHours ?? env.CART_ABANDONED_HOURS);
  const limit = Number(payload.limit ?? 20);
  const dryRun = Boolean(payload.dryRun);
  const carts = await listAbandonedCarts({ thresholdHours, limit });

  if (dryRun) {
    return {
      thresholdHours,
      dryRun: true,
      totalCandidates: carts.length,
      processed: []
    };
  }

  const processed = [];

  for (const cart of carts) {
    const notification = await sendEmailNotification({
      recipientEmail: cart.cliente_email,
      templateKey: "abandoned-cart-recovery",
      metadata: {
        cartId: cart.id,
        customerName: cart.cliente_nome,
        subtotal: Number(cart.subtotal),
        itemsCount: Number(cart.items_count)
      }
    });

    processed.push({
      cartId: cart.id,
      recipientEmail: cart.cliente_email,
      notificationStatus: notification.status
    });
  }

  return {
    thresholdHours,
    dryRun: false,
    totalCandidates: carts.length,
    processed
  };
}
