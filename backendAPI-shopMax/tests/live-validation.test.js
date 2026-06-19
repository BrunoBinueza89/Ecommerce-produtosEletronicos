import test from "node:test";
import assert from "node:assert/strict";
import { env } from "../src/config/env.js";
import { sanitizeIntegrationMessage } from "../src/services/integration-security-service.js";
import { validateLiveEmailIntegration } from "../src/services/notification-service.js";
import { validateLiveTrackingIntegration } from "../src/services/tracking-service.js";

const originalEnv = {
  EMAIL_PROVIDER: env.EMAIL_PROVIDER,
  EMAIL_FROM: env.EMAIL_FROM,
  SMTP_HOST: env.SMTP_HOST,
  SMTP_PORT: env.SMTP_PORT,
  SMTP_USER: env.SMTP_USER,
  SMTP_PASSWORD: env.SMTP_PASSWORD,
  TRACKING_PROVIDER: env.TRACKING_PROVIDER,
  TRACKING_BASE_URL: env.TRACKING_BASE_URL,
  TRACKING_API_KEY: env.TRACKING_API_KEY,
  INTEGRATIONS_LIVE_ENABLED: env.INTEGRATIONS_LIVE_ENABLED,
  INTEGRATION_SANDBOX_ENABLED: env.INTEGRATION_SANDBOX_ENABLED
};

function restoreEnv() {
  Object.assign(env, originalEnv);
}

test.afterEach(() => {
  restoreEnv();
});

test("live validation blocks safely when live mode is disabled", async () => {
  Object.assign(env, {
    INTEGRATIONS_LIVE_ENABLED: "false",
    INTEGRATION_SANDBOX_ENABLED: "false",
    EMAIL_PROVIDER: "smtp",
    SMTP_HOST: "smtp.example.com",
    SMTP_PORT: "587",
    SMTP_USER: "mailer-user",
    SMTP_PASSWORD: "secret-pass",
    EMAIL_FROM: "mailer@example.com",
    TRACKING_PROVIDER: "correios",
    TRACKING_BASE_URL: "https://tracking.example.com",
    TRACKING_API_KEY: "secret-token"
  });

  const [email, tracking] = await Promise.all([
    validateLiveEmailIntegration("qa@example.com"),
    validateLiveTrackingIntegration({ trackingCode: "BR123", orderCode: "ORDER-1" })
  ]);

  assert.equal(email.blocked, true);
  assert.equal(email.state, "blocked");
  assert.equal(email.reason.includes("INTEGRATIONS_LIVE_ENABLED"), true);
  assert.equal(tracking.blocked, true);
  assert.equal(tracking.state, "blocked");
  assert.equal(tracking.reason.includes("INTEGRATIONS_LIVE_ENABLED"), true);
});

test("live validation blocks with config error when SMTP is incomplete", async () => {
  Object.assign(env, {
    INTEGRATIONS_LIVE_ENABLED: "true",
    INTEGRATION_SANDBOX_ENABLED: "false",
    EMAIL_PROVIDER: "smtp",
    SMTP_HOST: "",
    SMTP_PORT: "587",
    SMTP_USER: "",
    SMTP_PASSWORD: "",
    EMAIL_FROM: "",
    TRACKING_PROVIDER: "mock"
  });

  const email = await validateLiveEmailIntegration("qa@example.com");

  assert.equal(email.blocked, true);
  assert.equal(email.state, "config_error");
  assert.equal(email.reason.includes("SMTP_HOST"), true);
  assert.equal(email.reason.includes("SMTP_USER"), true);
  assert.equal(email.reason.includes("SMTP_PASS"), true);
});

test("live validation blocks with config error when tracking is incomplete", async () => {
  Object.assign(env, {
    INTEGRATIONS_LIVE_ENABLED: "true",
    INTEGRATION_SANDBOX_ENABLED: "false",
    TRACKING_PROVIDER: "correios",
    TRACKING_BASE_URL: "",
    TRACKING_API_KEY: ""
  });

  const tracking = await validateLiveTrackingIntegration({
    trackingCode: "BR123",
    orderCode: "ORDER-2"
  });

  assert.equal(tracking.blocked, true);
  assert.equal(tracking.state, "config_error");
  assert.equal(tracking.reason.includes("TRACKING_BASE_URL"), true);
  assert.equal(tracking.reason.includes("TRACKING_API_TOKEN"), true);
});

test("live validation returns contractual success when configuration is complete", async () => {
  Object.assign(env, {
    INTEGRATIONS_LIVE_ENABLED: "true",
    INTEGRATION_SANDBOX_ENABLED: "false",
    EMAIL_PROVIDER: "smtp",
    SMTP_HOST: "smtp.example.com",
    SMTP_PORT: "587",
    SMTP_USER: "mailer-user",
    SMTP_PASSWORD: "secret-pass",
    EMAIL_FROM: "mailer@example.com",
    TRACKING_PROVIDER: "correios",
    TRACKING_BASE_URL: "https://tracking.example.com",
    TRACKING_API_KEY: "secret-token"
  });

  const [email, tracking] = await Promise.all([
    validateLiveEmailIntegration("qa@example.com", {
      getEmailIntegrationStatus: async () => ({ ready: true }),
      sendEmailNotification: async () => ({ status: "sent", provider: "smtp" })
    }),
    validateLiveTrackingIntegration(
      { trackingCode: "BR123", orderCode: "ORDER-3" },
      {
        probeTrackingProvider: async () => ({
          provider: "correios",
          normalizedStatus: "enviado",
          trackingCode: "BR123",
          events: [{ label: "Objeto postado" }]
        })
      }
    )
  ]);

  assert.equal(email.ok, true);
  assert.equal(email.state, "success");
  assert.equal(tracking.ok, true);
  assert.equal(tracking.state, "success");
});

test("live validation messages never leak secrets", async () => {
  Object.assign(env, {
    INTEGRATIONS_LIVE_ENABLED: "true",
    INTEGRATION_SANDBOX_ENABLED: "false",
    EMAIL_PROVIDER: "smtp",
    SMTP_HOST: "smtp.secret.local",
    SMTP_PORT: "587",
    SMTP_USER: "secret-user",
    SMTP_PASSWORD: "super-secret-pass",
    EMAIL_FROM: "secret-from@example.com",
    TRACKING_PROVIDER: "correios",
    TRACKING_BASE_URL: "https://tracking.secret.local",
    TRACKING_API_KEY: "tracking-secret-token"
  });

  const email = await validateLiveEmailIntegration("qa@example.com", {
    getEmailIntegrationStatus: async () => ({
      ready: false,
      error:
        "SMTP error at smtp.secret.local using secret-user / super-secret-pass from secret-from@example.com"
    })
  });

  const tracking = await validateLiveTrackingIntegration(
    { trackingCode: "BR123", orderCode: "ORDER-4" },
    {
      probeTrackingProvider: async () => {
        throw new Error(
          "Bearer tracking-secret-token failed against https://tracking.secret.local?token=tracking-secret-token"
        );
      }
    }
  );

  const sanitized = sanitizeIntegrationMessage(
    "token=tracking-secret-token password=super-secret-pass host=smtp.secret.local"
  );

  assert.equal(email.reason.includes("super-secret-pass"), false);
  assert.equal(email.reason.includes("secret-user"), false);
  assert.equal(email.reason.includes("smtp.secret.local"), false);
  assert.equal(tracking.reason.includes("tracking-secret-token"), false);
  assert.equal(tracking.reason.includes("tracking.secret.local"), false);
  assert.equal(sanitized.includes("tracking-secret-token"), false);
  assert.equal(sanitized.includes("super-secret-pass"), false);
});
