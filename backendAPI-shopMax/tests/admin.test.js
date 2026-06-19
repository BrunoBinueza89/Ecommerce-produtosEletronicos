import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../app.js";
import { closePool } from "../connection.js";
import { env } from "../src/config/env.js";
import { resetDatabase, seedFakeDatabase } from "../src/jobs/database-tasks.js";

let adminToken = "";

test.before(async () => {
  await resetDatabase();
  await seedFakeDatabase();

  const app = createApp();
  const loginResponse = await request(app).post("/api/auth/login").send({
    email: env.DEFAULT_ADMIN_EMAIL,
    password: env.DEFAULT_ADMIN_PASSWORD
  });

  adminToken = loginResponse.body.token;
});

test.after(async () => {
  await closePool();
});

test("admin dashboard endpoints return operational data", async () => {
  const app = createApp();

  const dashboardResponse = await request(app)
    .get("/api/admin/dashboard")
    .set("Authorization", `Bearer ${adminToken}`);

  assert.equal(dashboardResponse.status, 200);

  const customersResponse = await request(app)
    .get("/api/admin/customers")
    .set("Authorization", `Bearer ${adminToken}`);

  assert.equal(customersResponse.status, 200);

  const reportsResponse = await request(app)
    .get("/api/admin/reports")
    .set("Authorization", `Bearer ${adminToken}`);

  assert.equal(reportsResponse.status, 200);
});

test("admin can create coupon and inspect audit logs", async () => {
  const app = createApp();

  const createCouponResponse = await request(app)
    .post("/api/admin/coupons")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      code: "ADMIN10",
      type: "percentual",
      percentage: 10,
      minimumValue: 100,
      active: true
    });

  assert.equal(createCouponResponse.status, 201);

  const logsResponse = await request(app)
    .get("/api/admin/audit-logs")
    .set("Authorization", `Bearer ${adminToken}`);

  assert.equal(logsResponse.status, 200);
  assert.equal(Array.isArray(logsResponse.body.data), true);
  assert.equal(logsResponse.body.data.length >= 1, true);
});

test("admin cannot regress delivered order to previous status", async () => {
  const app = createApp();

  await request(app).post("/api/auth/register/customer").send({
    name: "Cliente Admin Flow",
    email: "cliente.admin@shopmax.local",
    cpf: "22233344455",
    phone: "11988887777",
    password: "Cliente@123",
    confirmPassword: "Cliente@123"
  });

  const customerLogin = await request(app).post("/api/auth/login").send({
    email: "cliente.admin@shopmax.local",
    password: "Cliente@123"
  });

  const sessionResponse = await request(app).post("/api/cart/session");
  const productsResponse = await request(app).get("/api/products");

  await request(app).post("/api/cart/items").send({
    sessionToken: sessionResponse.body.data.sessionToken,
    productId: productsResponse.body.data[0].id,
    quantity: 1
  });

  const finalizeResponse = await request(app)
    .post("/api/checkout/finalize")
    .set("Authorization", `Bearer ${customerLogin.body.token}`)
    .send({
      sessionToken: sessionResponse.body.data.sessionToken,
      address: {
        alias: "Casa",
        recipient: "Cliente Admin Flow",
        zipCode: "01001000",
        street: "Rua C",
        number: "300",
        district: "Centro",
        city: "Sao Paulo",
        state: "SP"
      },
      shippingMethod: "standard",
      shippingPrice: 29.9,
      paymentMethod: "pix"
    });

  const orderId = finalizeResponse.body.data.id;

  const shippedResponse = await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      status: "em_separacao"
    });

  assert.equal(shippedResponse.status, 200);

  const deliveredResponse = await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      status: "enviado",
      trackingCode: "BR123456789"
    });

  assert.equal(deliveredResponse.status, 200);

  const completedResponse = await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      status: "entregue"
    });

  assert.equal(completedResponse.status, 200);

  const invalidRegressionResponse = await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      status: "em_separacao"
    });

  assert.equal(invalidRegressionResponse.status, 422);
  assert.equal(invalidRegressionResponse.body.error, "INVALID_ORDER_STATUS_TRANSITION");
});

test("admin can inspect integration status and synchronize tracking in batch", async () => {
  const app = createApp();

  await request(app).post("/api/auth/register/customer").send({
    name: "Cliente Batch Flow",
    email: "cliente.batch@shopmax.local",
    cpf: "33344455566",
    phone: "11977778888",
    password: "Cliente@123",
    confirmPassword: "Cliente@123"
  });

  const customerLogin = await request(app).post("/api/auth/login").send({
    email: "cliente.batch@shopmax.local",
    password: "Cliente@123"
  });

  const sessionResponse = await request(app).post("/api/cart/session");
  const productsResponse = await request(app).get("/api/products");

  await request(app).post("/api/cart/items").send({
    sessionToken: sessionResponse.body.data.sessionToken,
    productId: productsResponse.body.data[0].id,
    quantity: 1
  });

  const finalizeResponse = await request(app)
    .post("/api/checkout/finalize")
    .set("Authorization", `Bearer ${customerLogin.body.token}`)
    .send({
      sessionToken: sessionResponse.body.data.sessionToken,
      address: {
        alias: "Casa",
        recipient: "Cliente Batch Flow",
        zipCode: "01001000",
        street: "Rua E",
        number: "500",
        district: "Centro",
        city: "Sao Paulo",
        state: "SP"
      },
      shippingMethod: "standard",
      shippingPrice: 29.9,
      paymentMethod: "pix"
    });

  const orderId = finalizeResponse.body.data.id;

  await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ status: "em_separacao" });

  await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ status: "enviado", trackingCode: "BRBATCH123456" });

  const integrationsResponse = await request(app)
    .get("/api/admin/integrations/status")
    .set("Authorization", `Bearer ${adminToken}`);

  assert.equal(integrationsResponse.status, 200);
  assert.equal(integrationsResponse.body.data.email.mode, "simulated");
  assert.equal(integrationsResponse.body.data.tracking.provider, "mock");

  const batchSyncResponse = await request(app)
    .post("/api/admin/orders/tracking/sync-pending")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ limit: 10 });

  assert.equal(batchSyncResponse.status, 200);
  assert.equal(batchSyncResponse.body.data.selected >= 1, true);
  assert.equal(batchSyncResponse.body.data.processed.length >= 1, true);
  assert.equal(batchSyncResponse.body.data.failed.length, 0);

  const logsResponse = await request(app)
    .get("/api/admin/audit-logs")
    .set("Authorization", `Bearer ${adminToken}`);

  assert.equal(logsResponse.status, 200);
  assert.equal(
    logsResponse.body.data.some((item) => item.acao === "sync-tracking-batch"),
    true
  );
});

test("admin can execute integration probes for email and tracking", async () => {
  const app = createApp();

  const emailProbeResponse = await request(app)
    .post("/api/admin/integrations/email/test")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      recipientEmail: env.DEFAULT_ADMIN_EMAIL
    });

  assert.equal(emailProbeResponse.status, 200);
  assert.equal(["sent_simulated", "sent"].includes(emailProbeResponse.body.data.status), true);

  const trackingProbeResponse = await request(app)
    .post("/api/admin/integrations/tracking/test")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      trackingCode: "BRHOMOLOG123",
      orderCode: "TESTE-SHOPMAX"
    });

  assert.equal(trackingProbeResponse.status, 200);
  assert.equal(Boolean(trackingProbeResponse.body.data.provider), true);
  assert.equal(Boolean(trackingProbeResponse.body.data.normalizedStatus), true);

  const logsResponse = await request(app)
    .get("/api/admin/audit-logs")
    .set("Authorization", `Bearer ${adminToken}`);

  assert.equal(logsResponse.status, 200);
  assert.equal(
    logsResponse.body.data.some((item) => item.acao === "test-email-integration"),
    true
  );
  assert.equal(
    logsResponse.body.data.some((item) => item.acao === "test-tracking-integration"),
    true
  );
});

test("admin can validate live integrations with safe blocking in sandbox mode", async () => {
  const app = createApp();

  const response = await request(app)
    .post("/api/admin/integrations/validate-live")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      recipientEmail: env.DEFAULT_ADMIN_EMAIL,
      trackingCode: "BRLIVE123456",
      orderCode: "TESTE-LIVE-SHOPMAX"
    });

  assert.equal(response.status, 200);
  assert.equal(response.body.data.liveEnabled, false);
  assert.equal(response.body.data.sandboxEnabled, true);
  assert.equal(response.body.data.allOk, false);
  assert.equal(response.body.data.email.blocked, true);
  assert.equal(response.body.data.email.state, "blocked");
  assert.equal(response.body.data.tracking.blocked, true);
  assert.equal(response.body.data.tracking.state, "blocked");

  const logsResponse = await request(app)
    .get("/api/admin/audit-logs")
    .set("Authorization", `Bearer ${adminToken}`);

  assert.equal(logsResponse.status, 200);
  assert.equal(
    logsResponse.body.data.some((item) => item.acao === "validate-live"),
    true
  );
});
