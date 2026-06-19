import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../app.js";
import { closePool } from "../connection.js";
import { env } from "../src/config/env.js";
import { resetDatabase, seedFakeDatabase } from "../src/jobs/database-tasks.js";

let authToken = "";
let adminToken = "";

async function createCustomerSession(app, email = "cliente@shopmax.local") {
  await request(app).post("/api/auth/register/customer").send({
    name: "Cliente ShopMax",
    email,
    cpf: email === "cliente@shopmax.local" ? "12345678901" : "10987654321",
    phone: "11999999999",
    password: "Cliente@123",
    confirmPassword: "Cliente@123"
  });

  const loginResponse = await request(app).post("/api/auth/login").send({
    email,
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

test("customer can register, checkout and list orders", async () => {
  const app = createApp();

  authToken = await createCustomerSession(app);

  const sessionResponse = await request(app).post("/api/cart/session");
  const productsResponse = await request(app).get("/api/products");

  await request(app).post("/api/cart/items").send({
    sessionToken: sessionResponse.body.data.sessionToken,
    productId: productsResponse.body.data[0].id,
    quantity: 1
  });

  const previewResponse = await request(app)
    .get(`/api/checkout/preview?sessionToken=${sessionResponse.body.data.sessionToken}`)
    .set("Authorization", `Bearer ${authToken}`);

  assert.equal(previewResponse.status, 200);
  assert.equal(previewResponse.body.data.cart.itemsCount, 1);

  const finalizeResponse = await request(app)
    .post("/api/checkout/finalize")
    .set("Authorization", `Bearer ${authToken}`)
    .send({
      sessionToken: sessionResponse.body.data.sessionToken,
      address: {
        alias: "Casa",
        recipient: "Cliente ShopMax",
        zipCode: "01001000",
        street: "Rua A",
        number: "100",
        district: "Centro",
        city: "Sao Paulo",
        state: "SP"
      },
      shippingMethod: "standard",
      shippingPrice: 29.9,
      paymentMethod: "pix"
    });

  assert.equal(finalizeResponse.status, 201);
  assert.equal(finalizeResponse.body.data.status, "pagamento_aprovado");

  const ordersResponse = await request(app)
    .get("/api/orders")
    .set("Authorization", `Bearer ${authToken}`);

  assert.equal(ordersResponse.status, 200);
  assert.equal(ordersResponse.body.data.length, 1);
});

test("customer can apply coupon, checkout and cancel eligible order with stock restoration", async () => {
  const app = createApp();
  authToken = await createCustomerSession(app, "cliente.cupom@shopmax.local");

  const categoriesResponse = await request(app).get("/api/categories");

  const couponResponse = await request(app)
    .post("/api/admin/coupons")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      code: "PIX10",
      type: "percentual",
      percentage: 10,
      minimumValue: 100,
      categoryId: categoriesResponse.body.data[0].id,
      active: true
    });

  assert.equal(couponResponse.status, 201);

  const sessionResponse = await request(app).post("/api/cart/session");
  const productsResponse = await request(app).get("/api/products");
  const productId = productsResponse.body.data[0].id;
  const stockBeforeCheckoutResponse = await request(app)
    .get("/api/admin/stock")
    .set("Authorization", `Bearer ${adminToken}`);
  const stockBeforeCheckout = Number(
    stockBeforeCheckoutResponse.body.data.find((item) => item.produto_id === productId).saldo
  );

  await request(app).post("/api/cart/items").send({
    sessionToken: sessionResponse.body.data.sessionToken,
    productId,
    quantity: 1
  });

  const previewResponse = await request(app)
    .get(`/api/checkout/preview?sessionToken=${sessionResponse.body.data.sessionToken}&couponCode=PIX10`)
    .set("Authorization", `Bearer ${authToken}`);

  assert.equal(previewResponse.status, 200);
  assert.equal(previewResponse.body.data.appliedCoupon.code, "PIX10");
  assert.equal(previewResponse.body.data.totals.couponDiscount > 0, true);

  const finalizeResponse = await request(app)
    .post("/api/checkout/finalize")
    .set("Authorization", `Bearer ${authToken}`)
    .send({
      sessionToken: sessionResponse.body.data.sessionToken,
      couponCode: "PIX10",
      address: {
        alias: "Casa",
        recipient: "Cliente ShopMax",
        zipCode: "01001000",
        street: "Rua B",
        number: "200",
        district: "Centro",
        city: "Sao Paulo",
        state: "SP"
      },
      shippingMethod: "standard",
      shippingPrice: 29.9,
      paymentMethod: "pix"
    });

  assert.equal(finalizeResponse.status, 201);
  assert.equal(finalizeResponse.body.data.discount > 0, true);

  const orderId = finalizeResponse.body.data.id;

  const cancelResponse = await request(app)
    .post(`/api/orders/${orderId}/cancel`)
    .set("Authorization", `Bearer ${authToken}`)
    .send({
      reason: "Cliente desistiu antes do envio"
    });

  assert.equal(cancelResponse.status, 200);
  assert.equal(cancelResponse.body.data.status, "cancelado");
  assert.equal(cancelResponse.body.data.payment.status, "reembolsado");

  const stockResponse = await request(app)
    .get("/api/admin/stock")
    .set("Authorization", `Bearer ${adminToken}`);

  assert.equal(stockResponse.status, 200);
  const restoredStock = stockResponse.body.data.find((item) => item.produto_id === productId);
  assert.equal(Number(restoredStock.saldo), stockBeforeCheckout);
});
