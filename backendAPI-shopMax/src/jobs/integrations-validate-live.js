import { closePool } from "../../connection.js";
import { validateLiveIntegrationsAdmin } from "../services/admin-service.js";
import { env } from "../config/env.js";
import { sanitizeIntegrationMessage } from "../services/integration-security-service.js";

const result = await validateLiveIntegrationsAdmin({
  recipientEmail: env.DEFAULT_ADMIN_EMAIL,
  trackingCode: process.env.LIVE_TEST_TRACKING_CODE ?? "TESTE-LIVE-SHOPMAX",
  orderCode: process.env.LIVE_TEST_ORDER_CODE ?? "TESTE-LIVE-SHOPMAX"
});

console.log(
  JSON.stringify(
    {
      ...result,
      email: result.email.reason
        ? { ...result.email, reason: sanitizeIntegrationMessage(result.email.reason) }
        : result.email,
      tracking: result.tracking.reason
        ? { ...result.tracking, reason: sanitizeIntegrationMessage(result.tracking.reason) }
        : result.tracking
    },
    null,
    2
  )
);

await closePool();

if (!result.allOk) {
  process.exitCode = 1;
}
