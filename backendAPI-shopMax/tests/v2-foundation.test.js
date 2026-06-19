import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../app.js";
import { closePool, getPool } from "../connection.js";
import { env } from "../src/config/env.js";
import { resetDatabase, seedFakeDatabase } from "../src/jobs/database-tasks.js";

let adminToken = "";

async function registerAndLoginCustomer(app) {
  await request(app).post("/api/auth/register/customer").send({
    name: "Cliente Recovery",
    email: "cliente.recovery@shopmax.local",
    cpf: "77888999000",
    phone: "11966665555",
    password: "Cliente@123",
    confirmPassword: "Cliente@123"
  });

  const loginResponse = await request(app).post("/api/auth/login").send({
    email: "cliente.recovery@shopmax.local",
    password: "Cliente@123"
  });

  return loginResponse.body.token;
}

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

test("advanced reports, abandoned cart recovery and tracking sync operate in V2 foundation", async () => {
  const app = createApp();
  const customerToken = await registerAndLoginCustomer(app);

  const sessionResponse = await request(app).post("/api/cart/session");
  const productsResponse = await request(app).get("/api/products");

  await request(app).post("/api/cart/items").send({
    sessionToken: sessionResponse.body.data.sessionToken,
    productId: productsResponse.body.data[0].id,
    quantity: 1
  });

  const previewResponse = await request(app)
    .get(`/api/checkout/preview?sessionToken=${sessionResponse.body.data.sessionToken}`)
    .set("Authorization", `Bearer ${customerToken}`);

  assert.equal(previewResponse.status, 200);

  await getPool().query(
    `
      UPDATE carrinhos
      SET updated_at = DATE_SUB(NOW(), INTERVAL 30 HOUR)
      WHERE session_token = ?
    `,
    [sessionResponse.body.data.sessionToken]
  );

  const advancedReportsResponse = await request(app)
    .get("/api/admin/reports/advanced?thresholdHours=24")
    .set("Authorization", `Bearer ${adminToken}`);

  assert.equal(advancedReportsResponse.status, 200);
  assert.equal(Array.isArray(advancedReportsResponse.body.data.abandonedCarts), true);
  assert.equal(advancedReportsResponse.body.data.abandonedCarts.length >= 1, true);

  const abandonedCartsResponse = await request(app)
    .get("/api/admin/carts/abandoned?thresholdHours=24")
    .set("Authorization", `Bearer ${adminToken}`);

  assert.equal(abandonedCartsResponse.status, 200);
  assert.equal(abandonedCartsResponse.body.data.length >= 1, true);

  const processResponse = await request(app)
    .post("/api/admin/carts/abandoned/process")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      thresholdHours: 24,
      limit: 10,
      dryRun: false
    });

  assert.equal(processResponse.status, 200);
  assert.equal(processResponse.body.data.processed.length >= 1, true);
  assert.equal(processResponse.body.data.processed[0].notificationStatus, "sent_simulated");

  const checkoutSessionResponse = await request(app).post("/api/cart/session");

  await request(app).post("/api/cart/items").send({
    sessionToken: checkoutSessionResponse.body.data.sessionToken,
    productId: productsResponse.body.data[0].id,
    quantity: 1
  });

  const finalizeResponse = await request(app)
    .post("/api/checkout/finalize")
    .set("Authorization", `Bearer ${customerToken}`)
    .send({
      sessionToken: checkoutSessionResponse.body.data.sessionToken,
      address: {
        alias: "Apartamento",
        recipient: "Cliente Recovery",
        zipCode: "01311000",
        street: "Avenida Paulista",
        number: "1500",
        district: "Bela Vista",
        city: "Sao Paulo",
        state: "SP"
      },
      shippingMethod: "express",
      shippingPrice: 39.9,
      paymentMethod: "pix"
    });

  assert.equal(finalizeResponse.status, 201);

  const orderId = finalizeResponse.body.data.id;

  await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ status: "em_separacao" });

  await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ status: "enviado", trackingCode: "BRTRACK123456" });

  const syncTrackingResponse = await request(app)
    .post(`/api/admin/orders/${orderId}/tracking/sync`)
    .set("Authorization", `Bearer ${adminToken}`);

  assert.equal(syncTrackingResponse.status, 200);
  assert.equal(syncTrackingResponse.body.data.tracking.provider, "mock");
  assert.equal(syncTrackingResponse.body.data.tracking.trackingCode, "BRTRACK123456");
  assert.equal(Array.isArray(syncTrackingResponse.body.data.tracking.events), true);

  const auditLogsResponse = await request(app)
    .get("/api/admin/audit-logs")
    .set("Authorization", `Bearer ${adminToken}`);

  assert.equal(auditLogsResponse.status, 200);
  assert.equal(
    auditLogsResponse.body.data.some((item) => item.modulo === "notifications"),
    true
  );
  assert.equal(
    auditLogsResponse.body.data.some((item) => item.acao === "sync-tracking"),
    true
  );
});
