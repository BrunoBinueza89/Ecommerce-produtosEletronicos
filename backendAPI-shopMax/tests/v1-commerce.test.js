import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../app.js";
import { closePool } from "../connection.js";
import { env } from "../src/config/env.js";
import { resetDatabase, seedFakeDatabase } from "../src/jobs/database-tasks.js";

let adminToken = "";

async function registerAndLoginCustomer(app, email, cpf) {
  await request(app).post("/api/auth/register/customer").send({
    name: "Cliente V1",
    email,
    cpf,
    phone: "11977776666",
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

test("public commerce content exposes banners, promotions and advanced filters", async () => {
  const app = createApp();

  const bannerCreateResponse = await request(app)
    .post("/api/admin/banners")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      title: "Ofertas da Semana",
      position: "home-top",
      imageUrl: "https://cdn.shopmax.local/banners/ofertas-semana.png",
      linkUrl: "#/busca?q=oferta",
      order: 2
    });

  assert.equal(bannerCreateResponse.status, 201);

  const productsResponse = await request(app).get("/api/products");
  const targetProduct = productsResponse.body.data[0];

  const promotionCreateResponse = await request(app)
    .post("/api/admin/promotions")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: "Oferta Relampago Headset",
      type: "produto",
      percentage: 15,
      productId: targetProduct.id,
      status: "ativa"
    });

  assert.equal(promotionCreateResponse.status, 201);

  const bannersResponse = await request(app).get("/api/banners");
  assert.equal(bannersResponse.status, 200);
  assert.equal(bannersResponse.body.data.length >= 1, true);

  const promotionsResponse = await request(app).get("/api/promotions");
  assert.equal(promotionsResponse.status, 200);
  assert.equal(promotionsResponse.body.data.length >= 1, true);

  const filteredProductsResponse = await request(app).get(
    "/api/products?brand=hyperx&inStock=true&sort=price_asc"
  );

  assert.equal(filteredProductsResponse.status, 200);
  assert.equal(filteredProductsResponse.body.data.length >= 1, true);
  assert.equal(filteredProductsResponse.body.data[0].brandSlug, "hyperx");
});

test("customer can manage favorites and publish eligible delivered review", async () => {
  const app = createApp();
  const customerToken = await registerAndLoginCustomer(app, "cliente.v1@shopmax.local", "55666777889");

  const productsResponse = await request(app).get("/api/products");
  const product = productsResponse.body.data[0];

  const favoriteCreateResponse = await request(app)
    .post("/api/favorites")
    .set("Authorization", `Bearer ${customerToken}`)
    .send({
      productId: product.id
    });

  assert.equal(favoriteCreateResponse.status, 201);
  assert.equal(favoriteCreateResponse.body.data.length, 1);

  const favoritesListResponse = await request(app)
    .get("/api/favorites")
    .set("Authorization", `Bearer ${customerToken}`);

  assert.equal(favoritesListResponse.status, 200);
  assert.equal(favoritesListResponse.body.data[0].product.slug, product.slug);

  const sessionResponse = await request(app).post("/api/cart/session");
  await request(app).post("/api/cart/items").send({
    sessionToken: sessionResponse.body.data.sessionToken,
    productId: product.id,
    quantity: 1
  });

  const checkoutResponse = await request(app)
    .post("/api/checkout/finalize")
    .set("Authorization", `Bearer ${customerToken}`)
    .send({
      sessionToken: sessionResponse.body.data.sessionToken,
      address: {
        alias: "Casa",
        recipient: "Cliente V1",
        zipCode: "01001000",
        street: "Rua D",
        number: "400",
        district: "Centro",
        city: "Sao Paulo",
        state: "SP"
      },
      shippingMethod: "standard",
      shippingPrice: 29.9,
      paymentMethod: "pix"
    });

  assert.equal(checkoutResponse.status, 201);
  const orderId = checkoutResponse.body.data.id;

  await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ status: "em_separacao" });
  await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ status: "enviado", trackingCode: "BR987654321" });
  await request(app)
    .patch(`/api/admin/orders/${orderId}/status`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ status: "entregue" });

  const reviewCreateResponse = await request(app)
    .post("/api/reviews")
    .set("Authorization", `Bearer ${customerToken}`)
    .send({
      productId: product.id,
      rating: 5,
      title: "Excelente compra",
      comment: "Entrega rapida e produto muito bom."
    });

  assert.equal(reviewCreateResponse.status, 201);
  assert.equal(reviewCreateResponse.body.data.rating, 5);

  const reviewsResponse = await request(app).get(`/api/products/${product.slug}/reviews`);
  assert.equal(reviewsResponse.status, 200);
  assert.equal(reviewsResponse.body.data.length, 1);

  const favoriteDeleteResponse = await request(app)
    .delete(`/api/favorites/${product.id}`)
    .set("Authorization", `Bearer ${customerToken}`);

  assert.equal(favoriteDeleteResponse.status, 200);
  assert.equal(favoriteDeleteResponse.body.data.length, 0);
});
