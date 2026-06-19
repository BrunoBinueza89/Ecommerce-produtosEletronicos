import { env } from "../config/env.js";

function redactValue(message, value) {
  if (!value || String(value).length < 3) {
    return message;
  }

  return String(message).split(String(value)).join("[redacted]");
}

export function sanitizeIntegrationMessage(message) {
  let sanitized = String(message ?? "Falha desconhecida na integracao.");

  const sensitiveValues = [
    env.DB_PASSWORD,
    env.JWT_SECRET,
    env.SMTP_HOST,
    env.SMTP_USER,
    env.SMTP_PASSWORD,
    env.EMAIL_FROM,
    env.TRACKING_BASE_URL,
    env.TRACKING_API_KEY
  ];

  for (const sensitiveValue of sensitiveValues) {
    sanitized = redactValue(sanitized, sensitiveValue);
  }

  sanitized = sanitized.replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [redacted]");
  sanitized = sanitized.replace(/(token|key|secret|password|pass)=([^\s&]+)/gi, "$1=[redacted]");

  return sanitized;
}

export function isLiveIntegrationEnabled() {
  return env.INTEGRATIONS_LIVE_ENABLED === "true";
}

export function getLiveBlockedReason() {
  if (!isLiveIntegrationEnabled()) {
    return "INTEGRATIONS_LIVE_ENABLED esta desabilitado.";
  }

  if (env.INTEGRATION_SANDBOX_ENABLED === "true") {
    return "INTEGRATION_SANDBOX_ENABLED esta ativo.";
  }

  return null;
}
