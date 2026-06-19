import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({
  path: fileURLToPath(new URL("../../.env", import.meta.url))
});

function required(name, fallback = "") {
  const value = process.env[name] ?? fallback;

  if (value === "") {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null);
}

export const env = {
  PORT: process.env.PORT ?? "3000",
  NODE_ENV: process.env.NODE_ENV ?? "development",
  DB_HOST: required("DB_HOST", "127.0.0.1"),
  DB_PORT: process.env.DB_PORT ?? "3306",
  DB_NAME: required("DB_NAME", "shopmax"),
  DB_USER: required("DB_USER", "root"),
  DB_PASSWORD: process.env.DB_PASSWORD ?? "",
  JWT_SECRET: required("JWT_SECRET", "shopmax-dev-secret"),
  TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN ?? "8h",
  DEFAULT_ADMIN_NAME: process.env.DEFAULT_ADMIN_NAME ?? "ShopMax Root",
  DEFAULT_ADMIN_EMAIL: process.env.DEFAULT_ADMIN_EMAIL ?? "admin@shopmax.local",
  DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD ?? "Admin@123",
  CART_ABANDONED_HOURS: process.env.CART_ABANDONED_HOURS ?? "24",
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER ?? "simulated",
  EMAIL_FROM: firstDefined(process.env.SMTP_FROM, process.env.EMAIL_FROM) ?? "no-reply@shopmax.local",
  SMTP_HOST: process.env.SMTP_HOST ?? "",
  SMTP_PORT: process.env.SMTP_PORT ?? "587",
  SMTP_SECURE: process.env.SMTP_SECURE ?? "false",
  SMTP_USER: process.env.SMTP_USER ?? "",
  SMTP_PASSWORD: firstDefined(process.env.SMTP_PASS, process.env.SMTP_PASSWORD) ?? "",
  EMAIL_TIMEOUT_MS: process.env.EMAIL_TIMEOUT_MS ?? "5000",
  EMAIL_RETRY_ATTEMPTS: process.env.EMAIL_RETRY_ATTEMPTS ?? "2",
  INTEGRATIONS_LIVE_ENABLED: process.env.INTEGRATIONS_LIVE_ENABLED ?? "false",
  INTEGRATION_SANDBOX_ENABLED: process.env.INTEGRATION_SANDBOX_ENABLED ?? "true",
  TRACKING_PROVIDER: process.env.TRACKING_PROVIDER ?? "mock",
  TRACKING_BASE_URL: process.env.TRACKING_BASE_URL ?? "",
  TRACKING_API_KEY: firstDefined(process.env.TRACKING_API_TOKEN, process.env.TRACKING_API_KEY) ?? "",
  TRACKING_TIMEOUT_MS: process.env.TRACKING_TIMEOUT_MS ?? "5000",
  TRACKING_RETRY_ATTEMPTS: process.env.TRACKING_RETRY_ATTEMPTS ?? "2"
};
