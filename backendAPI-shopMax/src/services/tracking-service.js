import { env } from "../config/env.js";
import {
  getLiveBlockedReason,
  isLiveIntegrationEnabled,
  sanitizeIntegrationMessage
} from "./integration-security-service.js";

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function withRetry(task, attempts) {
  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await task(attempt);
    } catch (error) {
      lastError = error;

      if (attempt < attempts) {
        await wait(150 * attempt);
      }
    }
  }

  throw lastError;
}

function normalizeTrackingStatus(status) {
  const value = String(status ?? "").toLowerCase();

  if (["delivered", "entregue"].includes(value)) {
    return "entregue";
  }

  if (["shipped", "enviado", "in_transit", "em_transito"].includes(value)) {
    return "enviado";
  }

  if (["sorting", "separando", "processing"].includes(value)) {
    return "em_separacao";
  }

  return "pagamento_aprovado";
}

function buildMockTrackingSnapshot(order) {
  const status = order.delivery_status ?? "pendente";
  const now = new Date();
  const events = [
    {
      label: "Pedido recebido pela operacao",
      happenedAt: order.created_at
    }
  ];

  if (["separando", "enviado", "entregue"].includes(status)) {
    events.push({
      label: "Pedido em separacao",
      happenedAt: new Date(now.getTime() - 1000 * 60 * 60 * 18).toISOString()
    });
  }

  if (["enviado", "entregue"].includes(status)) {
    events.push({
      label: "Objeto postado pela transportadora",
      happenedAt: new Date(now.getTime() - 1000 * 60 * 60 * 8).toISOString()
    });
  }

  if (status === "entregue") {
    events.push({
      label: "Pedido entregue ao cliente",
      happenedAt: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString()
    });
  }

  return {
    provider: "mock",
    rawStatus: status,
    normalizedStatus:
      status === "entregue" ? "entregue" : status === "enviado" ? "enviado" : "em_separacao",
    trackingCode: order.delivery_tracking_code,
    estimatedDeliveryAt:
      status === "entregue" ? null : new Date(now.getTime() + 1000 * 60 * 60 * 24).toISOString(),
    events
  };
}

async function fetchRemoteTrackingSnapshot(order) {
  const url = new URL(env.TRACKING_BASE_URL);
  url.searchParams.set("trackingCode", order.delivery_tracking_code);
  url.searchParams.set("orderCode", order.codigo);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), Number(env.TRACKING_TIMEOUT_MS));

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: env.TRACKING_API_KEY
        ? {
            Authorization: `Bearer ${env.TRACKING_API_KEY}`
          }
        : undefined
    });

    if (!response.ok) {
      throw new Error(`Tracking provider returned ${response.status}`);
    }

    const payload = await response.json();

    return {
      provider: env.TRACKING_PROVIDER,
      rawStatus: payload.status ?? payload.rawStatus ?? "unknown",
      normalizedStatus: normalizeTrackingStatus(payload.status ?? payload.rawStatus),
      trackingCode: payload.trackingCode ?? order.delivery_tracking_code,
      estimatedDeliveryAt: payload.estimatedDeliveryAt ?? null,
      events: Array.isArray(payload.events) ? payload.events : []
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export function getTrackingIntegrationStatus() {
  const configured =
    env.TRACKING_PROVIDER === "mock" ||
    (Boolean(env.TRACKING_BASE_URL) && Boolean(env.TRACKING_API_KEY));

  return {
    provider: env.TRACKING_PROVIDER,
    mode: env.TRACKING_PROVIDER === "mock" ? "simulated" : "http",
    configured,
    ready: configured,
    retryAttempts: Number(env.TRACKING_RETRY_ATTEMPTS),
    timeoutMs: Number(env.TRACKING_TIMEOUT_MS),
    liveEnabled: isLiveIntegrationEnabled(),
    baseUrl: env.TRACKING_BASE_URL || null
  };
}

export function getTrackingLiveValidationStatus() {
  const blockedReason = getLiveBlockedReason();
  const liveModeRequested = env.TRACKING_PROVIDER !== "mock";
  const missing = [];

  if (liveModeRequested && !env.TRACKING_BASE_URL) {
    missing.push("TRACKING_BASE_URL");
  }

  if (liveModeRequested && !env.TRACKING_API_KEY) {
    missing.push("TRACKING_API_TOKEN");
  }

  const configured = liveModeRequested ? missing.length === 0 : true;

  return {
    provider: env.TRACKING_PROVIDER,
    sandboxEnabled: env.INTEGRATION_SANDBOX_ENABLED === "true",
    liveEnabled: isLiveIntegrationEnabled(),
    liveModeRequested,
    configured,
    missing,
    blockedReason,
    canValidateLive: liveModeRequested && configured && !blockedReason
  };
}

export async function probeTrackingProvider({ trackingCode, orderCode = "TESTE-SHOPMAX" }) {
  return syncOrderTracking({
    delivery_tracking_code: trackingCode,
    codigo: orderCode,
    delivery_status: "enviado",
    status: "enviado",
    created_at: new Date().toISOString()
  });
}

export async function validateLiveTrackingIntegration(
  { trackingCode, orderCode = "TESTE-SHOPMAX" },
  dependencies = {}
) {
  const liveStatus = getTrackingLiveValidationStatus();

  if (!liveStatus.canValidateLive) {
    const state = !liveStatus.liveEnabled || liveStatus.sandboxEnabled ? "blocked" : "config_error";
    return {
      integration: "tracking",
      ok: false,
      blocked: true,
      reason: trackingBlockedReason(liveStatus),
      state,
      missing: liveStatus.missing,
      provider: liveStatus.provider
    };
  }

  try {
    const probe = dependencies.probeTrackingProvider ?? probeTrackingProvider;
    const result = await probe({ trackingCode, orderCode });

    return {
      integration: "tracking",
      ok: result.provider !== "mock",
      blocked: false,
      provider: result.provider,
      normalizedStatus: result.normalizedStatus,
      trackingCode: result.trackingCode,
      eventsCount: result.events.length,
      state: result.provider !== "mock" ? "success" : "provider_error"
    };
  } catch (error) {
    return {
      integration: "tracking",
      ok: false,
      blocked: false,
      provider: liveStatus.provider,
      reason: sanitizeIntegrationMessage(error.message),
      state: "provider_error"
    };
  }
}

function trackingBlockedReason(liveStatus) {
  if (liveStatus.blockedReason) {
    return liveStatus.blockedReason;
  }

  if (!liveStatus.liveModeRequested) {
    return "TRACKING_PROVIDER ainda esta em modo mock.";
  }

  if (!liveStatus.configured) {
    return `Configuracao de rastreio incompleta para validacao real. Variaveis obrigatorias: ${liveStatus.missing.join(", ")}.`;
  }

  return "Validacao real de rastreio indisponivel.";
}

export async function syncOrderTracking(order) {
  if (!order?.delivery_tracking_code) {
    return {
      provider: env.TRACKING_PROVIDER,
      rawStatus: "missing_tracking_code",
      normalizedStatus: order?.status ?? "pagamento_aprovado",
      trackingCode: null,
      estimatedDeliveryAt: null,
      events: []
    };
  }

  if (env.TRACKING_PROVIDER !== "mock" && env.TRACKING_BASE_URL) {
    try {
      return await withRetry(
        async () => fetchRemoteTrackingSnapshot(order),
        Math.max(1, Number(env.TRACKING_RETRY_ATTEMPTS))
      );
    } catch (_error) {
      return buildMockTrackingSnapshot(order);
    }
  }

  return buildMockTrackingSnapshot(order);
}
