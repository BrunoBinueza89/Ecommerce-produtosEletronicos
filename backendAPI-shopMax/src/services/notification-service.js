import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { createAuditLog } from "../repositories/admin-repository.js";
import {
  getLiveBlockedReason,
  isLiveIntegrationEnabled,
  sanitizeIntegrationMessage
} from "./integration-security-service.js";

let transporterPromise = null;

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

async function withTimeout(promise, timeoutMs, timeoutMessage) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
    })
  ]);
}

function shouldUseSmtp() {
  return env.EMAIL_PROVIDER === "smtp" && env.SMTP_HOST && env.EMAIL_FROM;
}

function getSmtpConfigurationState() {
  const missing = [];

  if (env.EMAIL_PROVIDER !== "smtp") {
    missing.push("EMAIL_PROVIDER=smtp");
  }

  if (!env.SMTP_HOST) {
    missing.push("SMTP_HOST");
  }

  if (!env.SMTP_PORT) {
    missing.push("SMTP_PORT");
  }

  if (!env.EMAIL_FROM) {
    missing.push("SMTP_FROM");
  }

  if (!env.SMTP_USER) {
    missing.push("SMTP_USER");
  }

  if (!env.SMTP_PASSWORD) {
    missing.push("SMTP_PASS");
  }

  return {
    configured: missing.length === 0,
    missing
  };
}

async function getTransporter() {
  if (!shouldUseSmtp()) {
    return null;
  }

  if (!transporterPromise) {
    transporterPromise = Promise.resolve(
      nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: Number(env.SMTP_PORT),
        secure: env.SMTP_SECURE === "true",
        connectionTimeout: Number(env.EMAIL_TIMEOUT_MS),
        greetingTimeout: Number(env.EMAIL_TIMEOUT_MS),
        socketTimeout: Number(env.EMAIL_TIMEOUT_MS),
        auth: env.SMTP_USER
          ? {
              user: env.SMTP_USER,
              pass: env.SMTP_PASSWORD
            }
          : undefined
      })
    );
  }

  return transporterPromise;
}

function buildEmailContent(templateKey, metadata) {
  if (templateKey === "abandoned-cart-reminder") {
    return {
      subject: "Seu carrinho na ShopMax esta te esperando",
      text: `Voce deixou ${metadata.itemsCount ?? 0} item(ns) no carrinho com total de R$ ${Number(
        metadata.cartTotal ?? 0
      ).toFixed(2)}.`
    };
  }

  return {
    subject: `Notificacao ShopMax - ${templateKey}`,
    text: JSON.stringify(metadata)
  };
}

export async function getEmailIntegrationStatus() {
  const mode = shouldUseSmtp() ? "smtp" : "simulated";
  const retryAttempts = Number(env.EMAIL_RETRY_ATTEMPTS);
  const timeoutMs = Number(env.EMAIL_TIMEOUT_MS);

  if (mode === "simulated") {
    return {
      mode,
      configured: true,
      ready: true,
      fallbackEnabled: true,
      retryAttempts,
      timeoutMs,
      from: env.EMAIL_FROM,
      liveEnabled: isLiveIntegrationEnabled()
    };
  }

  try {
    const transporter = await getTransporter();
    await withTimeout(
      transporter.verify(),
      timeoutMs,
      "Timeout verificando conexao SMTP."
    );

    return {
      mode,
      configured: true,
      ready: true,
      fallbackEnabled: true,
      retryAttempts,
      timeoutMs,
      from: env.EMAIL_FROM,
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      liveEnabled: isLiveIntegrationEnabled()
    };
  } catch (error) {
    return {
      mode,
      configured: true,
      ready: false,
      fallbackEnabled: true,
      retryAttempts,
      timeoutMs,
      from: env.EMAIL_FROM,
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      liveEnabled: isLiveIntegrationEnabled(),
      error: sanitizeIntegrationMessage(error.message)
    };
  }
}

export function getEmailLiveValidationStatus() {
  const blockedReason = getLiveBlockedReason();
  const liveModeRequested = env.EMAIL_PROVIDER === "smtp";
  const configuration = getSmtpConfigurationState();

  return {
    provider: env.EMAIL_PROVIDER,
    sandboxEnabled: env.INTEGRATION_SANDBOX_ENABLED === "true",
    liveEnabled: isLiveIntegrationEnabled(),
    liveModeRequested,
    configured: configuration.configured,
    missing: configuration.missing,
    blockedReason,
    canValidateLive: liveModeRequested && configuration.configured && !blockedReason
  };
}

export async function validateLiveEmailIntegration(recipientEmail, dependencies = {}) {
  const liveStatus = getEmailLiveValidationStatus();

  if (!liveStatus.canValidateLive) {
    const state = !liveStatus.liveEnabled || liveStatus.sandboxEnabled ? "blocked" : "config_error";
    return {
      integration: "email",
      ok: false,
      blocked: true,
      reason: sandboxEnabledReason(liveStatus),
      state,
      missing: liveStatus.missing,
      provider: liveStatus.provider
    };
  }

  const getStatus = dependencies.getEmailIntegrationStatus ?? getEmailIntegrationStatus;
  const sendHealthCheck = dependencies.sendEmailNotification ?? sendEmailNotification;
  const status = await getStatus();

  if (!status.ready) {
    return {
      integration: "email",
      ok: false,
      blocked: false,
      reason: sanitizeIntegrationMessage(status.error ?? "SMTP nao esta pronto para homologacao real."),
      state: "provider_error",
      provider: liveStatus.provider
    };
  }

  try {
    const result = await sendHealthCheck({
      recipientEmail,
      templateKey: "live-integration-health-check",
      metadata: {
        triggeredAt: new Date().toISOString(),
        liveValidation: true
      }
    });

    return {
      integration: "email",
      ok: result.status === "sent",
      blocked: false,
      provider: result.provider,
      status: result.status,
      recipientEmail,
      state: result.status === "sent" ? "success" : "provider_error"
    };
  } catch (error) {
    return {
      integration: "email",
      ok: false,
      blocked: false,
      reason: sanitizeIntegrationMessage(error.message),
      provider: liveStatus.provider,
      state: "provider_error"
    };
  }
}

function sandboxEnabledReason(liveStatus) {
  if (liveStatus.blockedReason) {
    return liveStatus.blockedReason;
  }

  if (!liveStatus.liveModeRequested) {
    return "EMAIL_PROVIDER nao esta configurado como smtp.";
  }

  if (!liveStatus.configured) {
    return `Configuracao SMTP incompleta para validacao real. Variaveis obrigatorias: ${liveStatus.missing.join(", ")}.`;
  }

  return "Validacao real de e-mail indisponivel.";
}

export async function sendIntegrationTestEmail(recipientEmail) {
  const result = await sendEmailNotification({
    recipientEmail,
    templateKey: "integration-health-check",
    metadata: {
      triggeredAt: new Date().toISOString(),
      sandboxEnabled: env.INTEGRATION_SANDBOX_ENABLED === "true"
    }
  });

  return {
    ...result,
    sandboxEnabled: env.INTEGRATION_SANDBOX_ENABLED === "true"
  };
}

export async function sendEmailNotification({ recipientEmail, templateKey, metadata = {} }) {
  const provider = shouldUseSmtp() ? "smtp" : "simulated";
  const content = buildEmailContent(templateKey, metadata);
  const retryAttempts = Math.max(1, Number(env.EMAIL_RETRY_ATTEMPTS));

  if (provider === "smtp") {
    try {
      const transporter = await getTransporter();
      await withRetry(
        async () =>
          withTimeout(
            transporter.sendMail({
              from: env.EMAIL_FROM,
              to: recipientEmail,
              subject: content.subject,
              text: content.text
            }),
            Number(env.EMAIL_TIMEOUT_MS),
            "Timeout enviando e-mail."
          ),
        retryAttempts
      );

      await createAuditLog({
        userId: null,
        module: "notifications",
        entity: "email",
        entityId: null,
        action: "send-email",
        ip: null,
        payloadJson: {
          recipientEmail,
          templateKey,
          metadata,
          provider,
          retryAttempts
        }
      });

      return {
        status: "sent",
        provider,
        recipientEmail,
        templateKey
      };
    } catch (error) {
      await createAuditLog({
        userId: null,
        module: "notifications",
        entity: "email",
        entityId: null,
        action: "send-email-fallback",
        ip: null,
        payloadJson: {
          recipientEmail,
          templateKey,
          metadata,
          provider,
          retryAttempts,
          error: sanitizeIntegrationMessage(error.message)
        }
      });
    }
  }

  await createAuditLog({
    userId: null,
    module: "notifications",
    entity: "email",
    entityId: null,
    action: "send-simulated-email",
    ip: null,
    payloadJson: {
      recipientEmail,
      templateKey,
      metadata,
      provider: "simulated"
    }
  });

  return {
    status: "sent_simulated",
    provider: "simulated",
    recipientEmail,
    templateKey
  };
}
